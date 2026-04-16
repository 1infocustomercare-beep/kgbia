import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/* ─── Pipeline stages — ordered, with colors ─── */
export const PIPELINE_STAGES = [
  { id: "new",          label: "Da contattare",  color: "#9ca3af", emoji: "🎯" },
  { id: "contacted",    label: "Contattato",     color: "#60a5fa", emoji: "📨" },
  { id: "replied",      label: "Risposto",       color: "#a78bfa", emoji: "💬" },
  { id: "demo_booked",  label: "Demo prenotata", color: "#f59e0b", emoji: "📅" },
  { id: "negotiating",  label: "In trattativa",  color: "#06b6d4", emoji: "🤝" },
  { id: "won",          label: "Cliente",        color: "#22c55e", emoji: "🏆" },
  { id: "lost",         label: "Perso",          color: "#ef4444", emoji: "❌" },
] as const;

export type PipelineStageId = typeof PIPELINE_STAGES[number]["id"];

export interface Interaction {
  ts: string;             // ISO timestamp
  channel: "whatsapp" | "instagram" | "email" | "phone" | "note";
  direction: "out" | "in" | "internal";
  text: string;
  status?: string;        // sent / delivered / read / replied
}

export interface PipelineLead {
  id: string;
  owner_id: string;
  name: string;
  city: string | null;
  sector: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  full_address: string | null;
  google_rating: number | null;
  google_reviews: number | null;
  ai_score: number | null;
  ai_summary: string | null;
  status: PipelineStageId;
  outcome: "in_progress" | "won" | "lost" | "paused";
  channel_used: string | null;
  estimated_value: number;
  notes: string | null;
  interactions: Interaction[];
  last_contacted_at: string | null;
  next_followup_at: string | null;
  created_at: string;
  updated_at: string;
  lead_source_data: Record<string, any>;
}

interface SaveLeadInput {
  name: string;
  city?: string | null;
  sector?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  instagram?: string | null;
  full_address?: string | null;
  google_rating?: number | null;
  google_reviews?: number | null;
  ai_score?: number | null;
  ai_summary?: string | null;
  estimated_value?: number;
  source?: string;
  lead_source_data?: Record<string, any>;
}

/* ─── Hook: real-time CRM pipeline scoped to current seller (owner_id = auth.uid()) ─── */
export function useSellerPipeline() {
  const [leads, setLeads] = useState<PipelineLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  /* ─── Auth user resolution ─── */
  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUserId(data.user?.id ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  /* ─── Initial fetch + realtime subscription ─── */
  useEffect(() => {
    if (!userId) { setLeads([]); setLoading(false); return; }
    let cancelled = false;

    const fetchLeads = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("owner_id", userId)
        .order("updated_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error("Pipeline fetch error:", error);
        toast.error("Errore caricamento pipeline");
      } else {
        setLeads((data || []).map(normalizeLead));
      }
      setLoading(false);
    };
    fetchLeads();

    const channel = supabase
      .channel(`leads_owner_${userId}`)
      .on("postgres_changes",
        { event: "*", schema: "public", table: "leads", filter: `owner_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setLeads(prev => [normalizeLead(payload.new), ...prev.filter(l => l.id !== payload.new.id)]);
          } else if (payload.eventType === "UPDATE") {
            setLeads(prev => prev.map(l => l.id === payload.new.id ? normalizeLead(payload.new) : l));
          } else if (payload.eventType === "DELETE") {
            setLeads(prev => prev.filter(l => l.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, [userId]);

  /* ─── Save (create or upsert by name+city) ─── */
  const saveLead = useCallback(async (input: SaveLeadInput): Promise<PipelineLead | null> => {
    if (!userId) { toast.error("Devi essere loggato per salvare lead"); return null; }
    if (!input.name?.trim()) { toast.error("Nome lead obbligatorio"); return null; }

    // Check duplicate by (owner_id, name, city) — handle null/empty city correctly
    const cityNorm = (input.city || "").trim();
    let dupQuery = supabase
      .from("leads")
      .select("id")
      .eq("owner_id", userId)
      .ilike("name", input.name.trim());
    if (cityNorm) {
      dupQuery = dupQuery.ilike("city", cityNorm);
    } else {
      dupQuery = dupQuery.or("city.is.null,city.eq.");
    }
    const { data: existingRows } = await dupQuery.limit(1);
    const existing = existingRows && existingRows.length > 0 ? existingRows[0] : null;

    if (existing?.id) {
      toast.info("Lead già nel tuo CRM", { description: `${input.name} è già stato salvato` });
      const { data } = await supabase.from("leads").select("*").eq("id", existing.id).single();
      return data ? normalizeLead(data) : null;
    }

    const { data, error } = await supabase
      .from("leads")
      .insert({
        owner_id: userId,
        name: input.name.trim(),
        city: input.city || null,
        sector: input.sector || null,
        phone: input.phone || null,
        email: input.email || null,
        website: input.website || null,
        instagram: input.instagram || null,
        full_address: input.full_address || null,
        google_rating: input.google_rating ?? null,
        google_reviews: input.google_reviews ?? null,
        ai_score: input.ai_score ?? null,
        ai_summary: input.ai_summary || null,
        estimated_value: input.estimated_value ?? 0,
        source: input.source || "manual",
        lead_source_data: input.lead_source_data || {},
        status: "new",
        outcome: "in_progress",
        interactions: [],
        value: input.estimated_value ?? 0,
      })
      .select()
      .single();

    if (error) {
      // Unique-constraint violation → fetch existing instead of erroring loudly
      if ((error as any).code === "23505") {
        const { data: existingRow } = await supabase
          .from("leads")
          .select("*")
          .eq("owner_id", userId)
          .ilike("name", input.name.trim())
          .limit(1)
          .maybeSingle();
        if (existingRow) {
          toast.info("Lead già nel tuo CRM", { description: `${input.name} è stato aggiornato` });
          return normalizeLead(existingRow);
        }
      }
      console.error("Save lead error:", error);
      toast.error("Errore salvataggio: " + error.message);
      return null;
    }
    toast.success(`✓ ${input.name} salvato nel CRM`, { description: "Lo trovi nella tab Pipeline" });
    return data ? normalizeLead(data) : null;
  }, [userId]);

  /* ─── Update status / move stage ─── */
  const updateStage = useCallback(async (leadId: string, status: PipelineStageId) => {
    const outcome: PipelineLead["outcome"] = status === "won" ? "won" : status === "lost" ? "lost" : "in_progress";
    const { error } = await supabase
      .from("leads")
      .update({ status, outcome, updated_at: new Date().toISOString() })
      .eq("id", leadId);
    if (error) toast.error("Errore aggiornamento stato");
    else {
      const stage = PIPELINE_STAGES.find(s => s.id === status);
      toast.success(`${stage?.emoji} Spostato in: ${stage?.label}`);
    }
  }, []);

  /* ─── Add interaction (message sent / received / call / note) ─── */
  const addInteraction = useCallback(async (leadId: string, interaction: Omit<Interaction, "ts">) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    const newInteraction: Interaction = { ts: new Date().toISOString(), ...interaction };
    const updated = [...lead.interactions, newInteraction];

    const updates: Record<string, any> = {
      interactions: updated,
      updated_at: new Date().toISOString(),
    };
    if (interaction.direction === "out") {
      updates.last_contacted_at = newInteraction.ts;
      updates.channel_used = interaction.channel;
      // auto-promote new -> contacted when first outbound message is logged
      if (lead.status === "new") updates.status = "contacted";
    }
    if (interaction.direction === "in" && lead.status === "contacted") {
      updates.status = "replied";
    }

    const { error } = await supabase.from("leads").update(updates).eq("id", leadId);
    if (error) toast.error("Errore registrazione interazione");
  }, [leads]);

  /* ─── Schedule follow-up ─── */
  const scheduleFollowup = useCallback(async (leadId: string, daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    const { error } = await supabase
      .from("leads")
      .update({ next_followup_at: date.toISOString() })
      .eq("id", leadId);
    if (error) toast.error("Errore pianificazione follow-up");
    else toast.success(`📅 Follow-up tra ${daysFromNow} giorni`, {
      description: date.toLocaleDateString("it-IT", { day: "2-digit", month: "long", weekday: "long" })
    });
  }, []);

  /* ─── Update notes ─── */
  const updateNotes = useCallback(async (leadId: string, notes: string) => {
    const { error } = await supabase.from("leads").update({ notes }).eq("id", leadId);
    if (error) toast.error("Errore salvataggio note");
  }, []);

  /* ─── Update estimated value ─── */
  const updateValue = useCallback(async (leadId: string, value: number) => {
    const { error } = await supabase
      .from("leads")
      .update({ estimated_value: value, value })
      .eq("id", leadId);
    if (error) toast.error("Errore aggiornamento valore");
  }, []);

  /* ─── Delete lead ─── */
  const deleteLead = useCallback(async (leadId: string) => {
    const { error } = await supabase.from("leads").delete().eq("id", leadId);
    if (error) toast.error("Errore eliminazione");
    else toast.success("Lead rimosso dal CRM");
  }, []);

  return {
    userId,
    leads,
    loading,
    saveLead,
    updateStage,
    addInteraction,
    scheduleFollowup,
    updateNotes,
    updateValue,
    deleteLead,
  };
}

/* ─── Normalize raw row → PipelineLead (handles jsonb arrays) ─── */
function normalizeLead(row: any): PipelineLead {
  let interactions: Interaction[] = [];
  if (Array.isArray(row.interactions)) interactions = row.interactions;
  else if (typeof row.interactions === "string") {
    try { interactions = JSON.parse(row.interactions); } catch { interactions = []; }
  }
  return {
    id: row.id,
    owner_id: row.owner_id,
    name: row.name,
    city: row.city,
    sector: row.sector,
    phone: row.phone,
    email: row.email,
    website: row.website,
    instagram: row.instagram,
    full_address: row.full_address,
    google_rating: row.google_rating,
    google_reviews: row.google_reviews,
    ai_score: row.ai_score,
    ai_summary: row.ai_summary,
    status: (row.status as PipelineStageId) || "new",
    outcome: (row.outcome as PipelineLead["outcome"]) || "in_progress",
    channel_used: row.channel_used,
    estimated_value: Number(row.estimated_value || row.value || 0),
    notes: row.notes,
    interactions,
    last_contacted_at: row.last_contacted_at,
    next_followup_at: row.next_followup_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    lead_source_data: row.lead_source_data || {},
  };
}

/* ─── Helpers exported for consumers ─── */
export const getStageMeta = (id: string) => PIPELINE_STAGES.find(s => s.id === id) || PIPELINE_STAGES[0];

export const getOverdueFollowups = (leads: PipelineLead[]) => {
  const now = Date.now();
  return leads.filter(l => l.next_followup_at && new Date(l.next_followup_at).getTime() <= now && l.status !== "won" && l.status !== "lost");
};

export const getTodayFollowups = (leads: PipelineLead[]) => {
  const start = new Date(); start.setHours(0,0,0,0);
  const end = new Date(); end.setHours(23,59,59,999);
  return leads.filter(l => {
    if (!l.next_followup_at) return false;
    const d = new Date(l.next_followup_at).getTime();
    return d >= start.getTime() && d <= end.getTime();
  });
};
