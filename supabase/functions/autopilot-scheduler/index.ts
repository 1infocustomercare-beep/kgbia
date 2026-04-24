// ══════════════════════════════════════════════════════════════
// autopilot-scheduler — Pianificatore server-side
// Invocato ogni 5 min dal pg_cron. Per ogni owner valuta:
//   • is_enabled
//   • finestra orari operativi (Europe/Rome)
//   • cap giornaliero residuo
//   • intervallo run_interval_minutes dall'ultima esecuzione
//   • canali NON in pausa
// Se OK → esegue cycle (avanza conversazioni hot, scan leads pending).
// Aggiorna autopilot_config.next_run_at + log in autopilot_scheduler_runs.
// ══════════════════════════════════════════════════════════════
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface AutopilotConfig {
  owner_id: string;
  is_enabled: boolean;
  daily_scan_cap: number;
  daily_scans_used: number;
  scans_reset_at: string;
  run_interval_minutes: number;
  enabled_channels: string[];
  paused_channels: string[];
  paused_sectors: string[];
  priority_rules: { excluded_sectors?: string[] } | null;
  operating_hours: { start: string; end: string; timezone?: string };
  last_run_at: string | null;
  next_run_at: string | null;
  total_runs: number;
}

function normalizeSector(s: unknown): string {
  return String(s ?? "").trim().toLowerCase();
}

function buildBlockedSectorSet(cfg: AutopilotConfig): Set<string> {
  const blocked = new Set<string>();
  for (const s of cfg.paused_sectors || []) blocked.add(normalizeSector(s));
  for (const s of cfg.priority_rules?.excluded_sectors || [])
    blocked.add(normalizeSector(s));
  blocked.delete("");
  return blocked;
}

// Ritorna [hh, mm] in Europe/Rome
function nowInRome(): { hh: number; mm: number; date: Date } {
  const date = new Date();
  const fmt = new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const hh = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);
  const mm = parseInt(parts.find((p) => p.type === "minute")?.value || "0", 10);
  return { hh, mm, date };
}

function isWithinOperatingHours(start: string, end: string): boolean {
  const { hh, mm } = nowInRome();
  const cur = hh * 60 + mm;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const s = sh * 60 + sm;
  const e = eh * 60 + em;
  // Finestra normale (start < end)
  if (s <= e) return cur >= s && cur <= e;
  // Finestra a cavallo di mezzanotte
  return cur >= s || cur <= e;
}

function nextRunISO(intervalMinutes: number): string {
  return new Date(Date.now() + intervalMinutes * 60_000).toISOString();
}

async function processOwner(
  supa: ReturnType<typeof createClient>,
  cfg: AutopilotConfig,
): Promise<{ status: string; skip_reason?: string; metadata: any }> {
  const startedAt = Date.now();
  const owner_id = cfg.owner_id;

  // 1) Switch master
  if (!cfg.is_enabled) {
    return { status: "skipped", skip_reason: "autopilot_disabled", metadata: {} };
  }

  // 2) Orari operativi
  const start = cfg.operating_hours?.start || "09:00";
  const end = cfg.operating_hours?.end || "19:00";
  if (!isWithinOperatingHours(start, end)) {
    return {
      status: "skipped",
      skip_reason: "outside_operating_hours",
      metadata: { window: `${start}-${end}` },
    };
  }

  // 3) Intervallo dall'ultima run
  if (cfg.last_run_at) {
    const elapsed = Date.now() - new Date(cfg.last_run_at).getTime();
    const minMs = (cfg.run_interval_minutes || 30) * 60_000;
    if (elapsed < minMs) {
      return {
        status: "skipped",
        skip_reason: "interval_not_elapsed",
        metadata: { elapsed_ms: elapsed, required_ms: minMs },
      };
    }
  }

  // 4) Cap giornaliero
  // Reset se scaduto
  if (cfg.scans_reset_at && new Date(cfg.scans_reset_at) <= new Date()) {
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    await supa
      .from("autopilot_config")
      .update({
        daily_scans_used: 0,
        scans_reset_at: tomorrow.toISOString(),
      })
      .eq("owner_id", owner_id);
    cfg.daily_scans_used = 0;
  }
  const remaining = (cfg.daily_scan_cap || 100) - (cfg.daily_scans_used || 0);
  if (remaining <= 0) {
    return {
      status: "skipped",
      skip_reason: "daily_cap_reached",
      metadata: { cap: cfg.daily_scan_cap, used: cfg.daily_scans_used },
    };
  }

  // 5) Canali attivi (rimuovi quelli in pausa)
  const activeChannels = (cfg.enabled_channels || ["email", "chat", "whatsapp_link"])
    .filter((c) => !(cfg.paused_channels || []).includes(c));
  if (activeChannels.length === 0) {
    return {
      status: "skipped",
      skip_reason: "all_channels_paused",
      metadata: { paused: cfg.paused_channels },
    };
  }

  // 6) ESECUZIONE — Trova fino a 3 conversazioni "hot" da far avanzare
  // (limita per non saturare il cap in una run)
  const batchSize = Math.min(3, remaining);
  const blockedSectors = buildBlockedSectorSet(cfg);

  // Carichiamo qualche convo in più per poi filtrare i settori bloccati
  const fetchSize = Math.min(batchSize * 4, 20);
  const { data: hotConvosRaw } = await supa
    .from("autopilot_conversations")
    .select("id, channel, funnel_stage, last_ai_message_at, shared_context")
    .eq("owner_id", owner_id)
    .eq("status", "active")
    .in("funnel_stage", ["pain_validated", "roi_pitched", "negotiating"])
    .in("channel", activeChannels)
    .order("updated_at", { ascending: true })
    .limit(fetchSize);

  // Filtra i settori in pausa o esclusi
  let skippedBySector = 0;
  const hotConvos = (hotConvosRaw || []).filter((c: any) => {
    const sec = normalizeSector(c?.shared_context?.sector);
    if (sec && blockedSectors.has(sec)) {
      skippedBySector++;
      return false;
    }
    return true;
  }).slice(0, batchSize);

  if ((hotConvosRaw?.length ?? 0) > 0 && hotConvos.length === 0) {
    return {
      status: "skipped",
      skip_reason: "all_sectors_paused",
      metadata: {
        candidates: hotConvosRaw?.length ?? 0,
        blocked_sectors: Array.from(blockedSectors),
        skipped_by_sector: skippedBySector,
      },
    };
  }

  let advanced = 0;
  const channelsUsed = new Set<string>();
  const errors: string[] = [];

  for (const convo of hotConvos || []) {
    try {
      const { error } = await supa.functions.invoke(
        "autopilot-conversation-engine",
        {
          body: {
            action: "advance_conversation",
            conversation_id: convo.id,
            triggered_by: "scheduler",
          },
        },
      );
      if (error) {
        errors.push(`${convo.id}: ${error.message}`);
      } else {
        advanced++;
        channelsUsed.add(convo.channel);
      }
    } catch (e) {
      errors.push(`${convo.id}: ${(e as Error).message}`);
    }
  }

  return {
    status: errors.length > 0 && advanced === 0 ? "failed" : "completed",
    metadata: {
      conversations_advanced: advanced,
      channels_used: Array.from(channelsUsed),
      errors: errors.slice(0, 5),
      remaining_cap: remaining - advanced,
      duration_ms: Date.now() - startedAt,
    },
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supa = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { persistSession: false },
    });

    // Carica tutte le config attive
    const { data: configs, error } = await supa
      .from("autopilot_config")
      .select("*")
      .eq("is_enabled", true);

    if (error) throw error;

    const results: any[] = [];

    for (const cfg of (configs || []) as unknown as AutopilotConfig[]) {
      const startedAt = new Date().toISOString();
      const t0 = Date.now();

      // Insert running log
      const { data: runLog } = await supa
        .from("autopilot_scheduler_runs")
        .insert({
          owner_id: cfg.owner_id,
          triggered_at: startedAt,
          status: "running",
        })
        .select("id")
        .single();

      const result = await processOwner(supa, cfg);
      const duration = Date.now() - t0;

      // Update log
      if (runLog?.id) {
        await supa
          .from("autopilot_scheduler_runs")
          .update({
            finished_at: new Date().toISOString(),
            status: result.status,
            skip_reason: result.skip_reason || null,
            scans_executed: 0,
            conversations_advanced: result.metadata.conversations_advanced || 0,
            channels_used: result.metadata.channels_used || [],
            duration_ms: duration,
            error_message: result.metadata.errors?.join("; ") || null,
            metadata: result.metadata,
          })
          .eq("id", runLog.id);
      }

      // Aggiorna config se eseguito
      if (result.status === "completed" || result.status === "failed") {
        await supa
          .from("autopilot_config")
          .update({
            last_run_at: new Date().toISOString(),
            last_run_status: result.status,
            last_run_summary: result.metadata,
            next_run_at: nextRunISO(cfg.run_interval_minutes || 30),
            total_runs: (cfg.total_runs || 0) + 1,
          })
          .eq("owner_id", cfg.owner_id);
      } else {
        // Per gli skip aggiorniamo solo next_run_at (retry tra 5 min)
        await supa
          .from("autopilot_config")
          .update({ next_run_at: nextRunISO(5) })
          .eq("owner_id", cfg.owner_id);
      }

      results.push({
        owner_id: cfg.owner_id,
        status: result.status,
        skip_reason: result.skip_reason,
        duration_ms: duration,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("[autopilot-scheduler] fatal:", err);
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
