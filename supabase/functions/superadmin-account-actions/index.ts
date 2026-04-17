import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Action =
  | { action: "list" }
  | { action: "magic_link"; user_id: string; redirect_path?: string }
  | { action: "update_profile"; user_id: string; full_name?: string; phone?: string; city?: string; demo_section_enabled?: boolean }
  | { action: "set_role"; user_id: string; role: string }
  | { action: "delete_user"; user_id: string }
  | { action: "toggle_tenant_block"; tenant_kind: "company" | "restaurant"; tenant_id: string; blocked: boolean };

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

  const authHeader = req.headers.get("Authorization") ?? "";
  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const admin = createClient(SUPABASE_URL, SERVICE_KEY);

  // Verify caller is super_admin
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) return json({ error: "unauthenticated" }, 401);
  const callerId = userData.user.id;

  const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", callerId);
  const isSuperAdmin = (roles ?? []).some((r: any) => r.role === "super_admin");
  if (!isSuperAdmin) return json({ error: "forbidden" }, 403);

  let payload: Action;
  try {
    payload = (await req.json()) as Action;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  try {
    switch (payload.action) {
      case "list": {
        // Pull auth users (last_sign_in_at, confirmed_at, provider, banned)
        const { data: usersList, error: lErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
        if (lErr) throw lErr;
        const users = usersList?.users ?? [];

        const [profilesRes, rolesRes, compMemRes, restMemRes, companiesRes, restaurantsRes, partnerSalesRes] = await Promise.all([
          admin.from("profiles").select("user_id, full_name, email, phone, city, avatar_url, demo_section_enabled, created_at"),
          admin.from("user_roles").select("user_id, role"),
          admin.from("company_memberships").select("user_id, company_id, role, companies(id, name, slug, industry, is_active, is_blocked)"),
          admin.from("restaurant_memberships").select("user_id, restaurant_id, role, restaurants(id, name, slug, is_active, is_blocked)"),
          admin.from("companies").select("id, name, slug, industry, owner_id, is_active, is_blocked, created_at"),
          admin.from("restaurants").select("id, name, slug, owner_id, is_active, is_blocked, created_at"),
          admin.from("partner_sales").select("partner_id, sale_amount, partner_commission"),
        ]);

        const profiles = profilesRes.data ?? [];
        const allRoles = rolesRes.data ?? [];
        const compMems = compMemRes.data ?? [];
        const restMems = restMemRes.data ?? [];
        const companies = companiesRes.data ?? [];
        const restaurants = restaurantsRes.data ?? [];
        const partnerSales = partnerSalesRes.data ?? [];

        const profileMap = new Map<string, any>(profiles.map((p: any) => [p.user_id, p]));
        const rolesMap: Record<string, string[]> = {};
        for (const r of allRoles as any[]) {
          rolesMap[r.user_id] = rolesMap[r.user_id] || [];
          rolesMap[r.user_id].push(r.role);
        }
        const tenantsByUser: Record<string, any[]> = {};
        for (const m of compMems as any[]) {
          if (!m.companies) continue;
          tenantsByUser[m.user_id] = tenantsByUser[m.user_id] || [];
          tenantsByUser[m.user_id].push({
            kind: "company",
            id: m.companies.id,
            name: m.companies.name,
            slug: m.companies.slug,
            industry: m.companies.industry,
            is_active: m.companies.is_active,
            is_blocked: m.companies.is_blocked,
          });
        }
        for (const m of restMems as any[]) {
          if (!m.restaurants) continue;
          tenantsByUser[m.user_id] = tenantsByUser[m.user_id] || [];
          tenantsByUser[m.user_id].push({
            kind: "restaurant",
            id: m.restaurants.id,
            name: m.restaurants.name,
            slug: m.restaurants.slug,
            industry: "food",
            is_active: m.restaurants.is_active,
            is_blocked: m.restaurants.is_blocked,
          });
        }
        // Owners not yet in memberships
        for (const c of companies as any[]) {
          if (!c.owner_id) continue;
          const list = tenantsByUser[c.owner_id] || [];
          if (!list.find((t) => t.kind === "company" && t.id === c.id)) {
            list.push({ kind: "company", id: c.id, name: c.name, slug: c.slug, industry: c.industry, is_active: c.is_active, is_blocked: c.is_blocked });
          }
          tenantsByUser[c.owner_id] = list;
        }
        for (const r of restaurants as any[]) {
          if (!r.owner_id) continue;
          const list = tenantsByUser[r.owner_id] || [];
          if (!list.find((t) => t.kind === "restaurant" && t.id === r.id)) {
            list.push({ kind: "restaurant", id: r.id, name: r.name, slug: r.slug, industry: "food", is_active: r.is_active, is_blocked: r.is_blocked });
          }
          tenantsByUser[r.owner_id] = list;
        }

        const salesByPartner: Record<string, { count: number; revenue: number; commission: number }> = {};
        for (const s of partnerSales as any[]) {
          const k = s.partner_id;
          if (!k) continue;
          salesByPartner[k] = salesByPartner[k] || { count: 0, revenue: 0, commission: 0 };
          salesByPartner[k].count += 1;
          salesByPartner[k].revenue += Number(s.sale_amount || 0);
          salesByPartner[k].commission += Number(s.partner_commission || 0);
        }

        const enriched = users.map((u: any) => {
          const p = profileMap.get(u.id) || {};
          const r = rolesMap[u.id] || [];
          const ts = tenantsByUser[u.id] || [];
          const provider = u.app_metadata?.provider || (u.identities?.[0]?.provider ?? "email");
          const isDemoSeeded = (p.email || "").endsWith("@empire.local") || ts.some((t: any) => (t.slug || "").startsWith("demo-"));
          return {
            id: u.id,
            email: u.email || p.email || "—",
            full_name: p.full_name || u.user_metadata?.full_name || "—",
            phone: p.phone || null,
            city: p.city || null,
            avatar_url: p.avatar_url || null,
            demo_section_enabled: !!p.demo_section_enabled,
            roles: r,
            primary_role: r.includes("super_admin") ? "super_admin" : r.includes("team_leader") ? "team_leader" : r.includes("partner") ? "partner" : r.includes("restaurant_admin") ? "restaurant_admin" : r.includes("staff") ? "staff" : (r[0] || "customer"),
            tenants: ts,
            sector: ts[0]?.industry || "—",
            origin: isDemoSeeded ? "demo_seed" : (provider !== "email" ? `oauth:${provider}` : "signup"),
            provider,
            sales: salesByPartner[u.id] || null,
            email_confirmed_at: u.email_confirmed_at,
            last_sign_in_at: u.last_sign_in_at,
            banned_until: u.banned_until,
            created_at: u.created_at,
          };
        });

        return json({ users: enriched });
      }

      case "magic_link": {
        const { data: u } = await admin.auth.admin.getUserById(payload.user_id);
        const email = u?.user?.email;
        if (!email) return json({ error: "user_email_missing" }, 400);
        const origin = req.headers.get("origin") || "";
        const { data, error } = await admin.auth.admin.generateLink({
          type: "magiclink",
          email,
          options: { redirectTo: `${origin}${payload.redirect_path || "/admin"}` },
        });
        if (error) throw error;
        return json({ link: data?.properties?.action_link, email });
      }

      case "update_profile": {
        const updates: Record<string, unknown> = {};
        if (payload.full_name !== undefined) updates.full_name = payload.full_name;
        if (payload.phone !== undefined) updates.phone = payload.phone;
        if (payload.city !== undefined) updates.city = payload.city;
        if (payload.demo_section_enabled !== undefined) updates.demo_section_enabled = payload.demo_section_enabled;
        const { error } = await admin.from("profiles").update(updates).eq("user_id", payload.user_id);
        if (error) throw error;
        return json({ ok: true });
      }

      case "set_role": {
        const allowed = ["super_admin", "team_leader", "partner", "restaurant_admin", "staff", "customer"];
        if (!allowed.includes(payload.role)) return json({ error: "invalid_role" }, 400);
        // Replace primary role: remove all and insert the new one (keeps things simple)
        await admin.from("user_roles").delete().eq("user_id", payload.user_id);
        const { error } = await admin.from("user_roles").insert({ user_id: payload.user_id, role: payload.role });
        if (error) throw error;
        return json({ ok: true });
      }

      case "delete_user": {
        if (payload.user_id === callerId) return json({ error: "cannot_delete_self" }, 400);
        const { error } = await admin.auth.admin.deleteUser(payload.user_id);
        if (error) throw error;
        return json({ ok: true });
      }

      case "toggle_tenant_block": {
        const table = payload.tenant_kind === "company" ? "companies" : "restaurants";
        const { error } = await admin
          .from(table)
          .update({
            is_blocked: payload.blocked,
            is_active: !payload.blocked,
            blocked_reason: payload.blocked ? "Bloccato dal Super Admin." : null,
          })
          .eq("id", payload.tenant_id);
        if (error) throw error;
        return json({ ok: true });
      }
    }
  } catch (e) {
    console.error("[superadmin-account-actions]", e);
    return json({ error: (e as Error).message }, 500);
  }

  return json({ error: "unknown_action" }, 400);
});