import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, RefreshCw, ExternalLink, KeyRound, Trash2, Pencil, ShieldCheck,
  Lock, Unlock, Copy, X, Filter, ArrowUpDown, Users, AlertTriangle, Check,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const INDUSTRY_LABELS: Record<string, string> = {
  food: "Ristorazione", ncc: "NCC/Trasporto", beauty: "Beauty", healthcare: "Sanità",
  fitness: "Fitness", retail: "Retail", hospitality: "Hotel", beach: "Stabilimento",
  plumber: "Idraulico", electrician: "Elettricista", education: "Formazione",
  events: "Eventi", cleaning: "Pulizie", legal: "Studio Legale", accounting: "Commercialista",
  photography: "Fotografia", logistics: "Logistica", veterinary: "Veterinario", custom: "Altro",
};

const ROLE_OPTIONS = [
  { value: "super_admin", label: "Super Admin" },
  { value: "team_leader", label: "Team Leader" },
  { value: "partner", label: "Partner" },
  { value: "restaurant_admin", label: "Admin Tenant" },
  { value: "staff", label: "Staff" },
  { value: "customer", label: "Customer" },
];

type Tenant = {
  kind: "company" | "restaurant";
  id: string;
  name: string;
  slug: string;
  industry: string;
  is_active: boolean;
  is_blocked: boolean;
};

type AccountUser = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  city: string | null;
  avatar_url: string | null;
  demo_section_enabled: boolean;
  roles: string[];
  primary_role: string;
  tenants: Tenant[];
  sector: string;
  origin: string;
  provider: string;
  sales: { count: number; revenue: number; commission: number } | null;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  banned_until: string | null;
  created_at: string;
};

type SortKey = "created_at" | "last_sign_in_at" | "email" | "primary_role" | "sector";

const adminLinkFor = (t: Tenant) =>
  t.kind === "restaurant" ? `/admin?demo=${t.id}` : `/app?company=${t.id}`;
const publicLinkFor = (t: Tenant) =>
  t.kind === "restaurant" ? `/r/${t.slug}` : `/b/${t.slug}`;

export default function AccountManagerPanel() {
  const [users, setUsers] = useState<AccountUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterSector, setFilterSector] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "blocked" | "unconfirmed">("all");
  const [filterOrigin, setFilterOrigin] = useState<"all" | "signup" | "demo_seed" | "oauth">("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [editing, setEditing] = useState<AccountUser | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AccountUser | null>(null);
  const [working, setWorking] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("superadmin-account-actions", {
        body: { action: "list" },
      });
      if (error) throw error;
      setUsers((data as any)?.users ?? []);
    } catch (e: any) {
      console.error(e);
      toast({ title: "Impossibile caricare gli account", description: e?.message ?? "Errore sconosciuto" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sectors = useMemo(() => {
    const s = new Set<string>();
    users.forEach((u) => u.tenants.forEach((t) => s.add(t.industry)));
    return Array.from(s).filter(Boolean).sort();
  }, [users]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = users.filter((u) => {
      if (filterRole !== "all" && u.primary_role !== filterRole) return false;
      if (filterSector !== "all" && !u.tenants.some((t) => t.industry === filterSector)) return false;
      if (filterStatus === "blocked" && !u.tenants.some((t) => t.is_blocked)) return false;
      if (filterStatus === "active" && u.tenants.length > 0 && u.tenants.every((t) => t.is_blocked || !t.is_active)) return false;
      if (filterStatus === "unconfirmed" && u.email_confirmed_at) return false;
      if (filterOrigin === "signup" && u.origin !== "signup") return false;
      if (filterOrigin === "demo_seed" && u.origin !== "demo_seed") return false;
      if (filterOrigin === "oauth" && !u.origin.startsWith("oauth")) return false;
      if (q) {
        const hay = `${u.email} ${u.full_name} ${u.phone ?? ""} ${u.city ?? ""} ${u.tenants.map((t) => `${t.name} ${t.slug}`).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const va = (a as any)[sortKey] ?? "";
      const vb = (b as any)[sortKey] ?? "";
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
    return list;
  }, [users, search, filterRole, filterSector, filterStatus, filterOrigin, sortKey, sortDir]);

  const onMagicLink = async (u: AccountUser, tenant?: Tenant) => {
    setWorking(true);
    try {
      const { data, error } = await supabase.functions.invoke("superadmin-account-actions", {
        body: { action: "magic_link", user_id: u.id, redirect_path: tenant ? adminLinkFor(tenant) : "/admin" },
      });
      if (error) throw error;
      const link = (data as any)?.link as string | undefined;
      if (!link) throw new Error("Link non disponibile");
      await navigator.clipboard.writeText(link);
      toast({ title: "Magic link copiato", description: u.email });
    } catch (e: any) {
      toast({ title: "Errore magic link", description: e?.message });
    } finally {
      setWorking(false);
    }
  };

  const onSetRole = async (u: AccountUser, role: string) => {
    setWorking(true);
    try {
      const { error } = await supabase.functions.invoke("superadmin-account-actions", {
        body: { action: "set_role", user_id: u.id, role },
      });
      if (error) throw error;
      toast({ title: "Ruolo aggiornato" });
      await load();
    } catch (e: any) {
      toast({ title: "Errore aggiornamento ruolo", description: e?.message });
    } finally {
      setWorking(false);
    }
  };

  const onSaveProfile = async (form: { full_name: string; phone: string; city: string; demo_section_enabled: boolean }) => {
    if (!editing) return;
    setWorking(true);
    try {
      const { error } = await supabase.functions.invoke("superadmin-account-actions", {
        body: { action: "update_profile", user_id: editing.id, ...form },
      });
      if (error) throw error;
      toast({ title: "Profilo salvato" });
      setEditing(null);
      await load();
    } catch (e: any) {
      toast({ title: "Errore salvataggio", description: e?.message });
    } finally {
      setWorking(false);
    }
  };

  const onDelete = async (u: AccountUser) => {
    setWorking(true);
    try {
      const { error } = await supabase.functions.invoke("superadmin-account-actions", {
        body: { action: "delete_user", user_id: u.id },
      });
      if (error) throw error;
      toast({ title: "Account eliminato", description: u.email });
      setConfirmDelete(null);
      await load();
    } catch (e: any) {
      toast({ title: "Errore eliminazione", description: e?.message });
    } finally {
      setWorking(false);
    }
  };

  const onToggleBlock = async (u: AccountUser, tenant: Tenant) => {
    setWorking(true);
    try {
      const { error } = await supabase.functions.invoke("superadmin-account-actions", {
        body: { action: "toggle_tenant_block", tenant_kind: tenant.kind, tenant_id: tenant.id, blocked: !tenant.is_blocked },
      });
      if (error) throw error;
      toast({ title: tenant.is_blocked ? "Tenant sbloccato" : "Tenant bloccato", description: tenant.name });
      await load();
    } catch (e: any) {
      toast({ title: "Errore blocco", description: e?.message });
    } finally {
      setWorking(false);
    }
  };

  const totalActive = users.filter((u) => u.tenants.some((t) => t.is_active && !t.is_blocked)).length;
  const totalBlocked = users.filter((u) => u.tenants.some((t) => t.is_blocked)).length;
  const totalDemo = users.filter((u) => u.origin === "demo_seed").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Account Manager
          </h2>
          <p className="text-[0.65rem] text-muted-foreground">Tutti gli account creati o registrati. Filtra, modifica, accedi, elimina.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[0.55rem] px-2 py-1 rounded-full bg-primary/10 text-primary font-bold">{users.length} totali</span>
          <span className="text-[0.55rem] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">{totalActive} attivi</span>
          <span className="text-[0.55rem] px-2 py-1 rounded-full bg-rose-500/10 text-rose-400 font-bold">{totalBlocked} bloccati</span>
          <span className="text-[0.55rem] px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 font-bold">{totalDemo} demo</span>
          <button
            onClick={load}
            className="ml-2 inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[0.6rem] hover:bg-muted/30"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} /> Aggiorna
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card/40 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca per email, nome, telefono, città, tenant…"
              className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-background border border-border text-[0.7rem] text-foreground"
            />
          </div>
          <Select label="Ruolo" value={filterRole} onChange={setFilterRole} options={[{ value: "all", label: "Tutti i ruoli" }, ...ROLE_OPTIONS.map((r) => ({ value: r.value, label: r.label }))]} />
          <Select label="Settore" value={filterSector} onChange={setFilterSector} options={[{ value: "all", label: "Tutti i settori" }, ...sectors.map((s) => ({ value: s, label: INDUSTRY_LABELS[s] || s }))]} />
          <Select label="Stato" value={filterStatus} onChange={(v) => setFilterStatus(v as any)} options={[
            { value: "all", label: "Tutti gli stati" },
            { value: "active", label: "Attivi" },
            { value: "blocked", label: "Bloccati" },
            { value: "unconfirmed", label: "Email non confermata" },
          ]} />
          <Select label="Origine" value={filterOrigin} onChange={(v) => setFilterOrigin(v as any)} options={[
            { value: "all", label: "Tutte le origini" },
            { value: "signup", label: "Registrazione" },
            { value: "demo_seed", label: "Demo / seed" },
            { value: "oauth", label: "OAuth" },
          ]} />
          <Select label="Ordina" value={sortKey} onChange={(v) => setSortKey(v as SortKey)} options={[
            { value: "created_at", label: "Data creazione" },
            { value: "last_sign_in_at", label: "Ultimo accesso" },
            { value: "email", label: "Email" },
            { value: "primary_role", label: "Ruolo" },
            { value: "sector", label: "Settore" },
          ]} />
          <button
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[0.6rem] hover:bg-muted/30"
            title="Inverti ordinamento"
          >
            <ArrowUpDown className="w-3 h-3" /> {sortDir === "asc" ? "ASC" : "DESC"}
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="rounded-xl border border-border p-6 text-center text-xs text-muted-foreground">Caricamento account…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border p-6 text-center text-xs text-muted-foreground">Nessun account corrisponde ai filtri.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              onEdit={() => setEditing(u)}
              onDelete={() => setConfirmDelete(u)}
              onMagicLink={onMagicLink}
              onSetRole={onSetRole}
              onToggleBlock={onToggleBlock}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <EditProfileModal user={editing} working={working} onClose={() => setEditing(null)} onSave={onSaveProfile} />
        )}
        {confirmDelete && (
          <ConfirmDeleteModal user={confirmDelete} working={working} onClose={() => setConfirmDelete(null)} onConfirm={() => onDelete(confirmDelete)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="inline-flex items-center gap-1 text-[0.6rem] text-muted-foreground">
      <Filter className="w-3 h-3" /> {label}:
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg bg-background border border-border px-2 py-1 text-[0.65rem] text-foreground"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function UserCard({
  user, onEdit, onDelete, onMagicLink, onSetRole, onToggleBlock,
}: {
  user: AccountUser;
  onEdit: () => void;
  onDelete: () => void;
  onMagicLink: (u: AccountUser, t?: Tenant) => void;
  onSetRole: (u: AccountUser, role: string) => void;
  onToggleBlock: (u: AccountUser, t: Tenant) => void;
}) {
  const initial = (user.full_name || user.email || "?").trim().charAt(0).toUpperCase();
  const lastSeen = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString("it-IT") : "Mai";
  const created = user.created_at ? new Date(user.created_at).toLocaleDateString("it-IT") : "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card/60 p-3 space-y-2"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-xs">{initial}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs font-bold text-foreground truncate">{user.full_name}</p>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              user.primary_role === "super_admin" ? "bg-amber-500/15 text-amber-400" :
              user.primary_role === "team_leader" || user.primary_role === "partner" ? "bg-purple-500/15 text-purple-400" :
              user.primary_role === "restaurant_admin" ? "bg-primary/15 text-primary" :
              "bg-muted text-muted-foreground"
            }`}>{ROLE_OPTIONS.find((r) => r.value === user.primary_role)?.label || user.primary_role}</span>
            {!user.email_confirmed_at && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400">Non conf.</span>
            )}
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">{user.origin === "demo_seed" ? "Demo seed" : user.origin.startsWith("oauth") ? user.origin.replace("oauth:", "OAuth ") : "Registrato"}</span>
          </div>
          <p className="text-[0.6rem] text-muted-foreground truncate">{user.email}</p>
          <p className="text-[0.55rem] text-muted-foreground">Creato {created} · Ultimo accesso: {lastSeen}</p>
        </div>
        <div className="flex items-center gap-1">
          <IconBtn title="Modifica profilo" onClick={onEdit}><Pencil className="w-3 h-3" /></IconBtn>
          <IconBtn title="Magic link" onClick={() => onMagicLink(user)}><KeyRound className="w-3 h-3" /></IconBtn>
          <IconBtn title="Elimina account" onClick={onDelete} danger><Trash2 className="w-3 h-3" /></IconBtn>
        </div>
      </div>

      {/* Role quick switch */}
      <div className="flex items-center gap-2 text-[0.6rem]">
        <span className="text-muted-foreground inline-flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Ruolo</span>
        <select
          value={user.primary_role}
          onChange={(e) => onSetRole(user, e.target.value)}
          className="rounded-md bg-background border border-border px-2 py-1 text-[0.6rem]"
        >
          {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>

      {/* Tenants */}
      {user.tenants.length > 0 ? (
        <div className="space-y-1.5">
          {user.tenants.map((t) => (
            <div key={`${t.kind}-${t.id}`} className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/40 px-2 py-1.5">
              <div className="min-w-0">
                <p className="text-[0.65rem] font-bold text-foreground truncate">{t.name} <span className="text-[10px] text-muted-foreground">/{t.slug}</span></p>
                <p className="text-[0.55rem] text-muted-foreground">{INDUSTRY_LABELS[t.industry] || t.industry} · {t.kind === "company" ? "Company" : "Restaurant"} · {t.is_blocked ? "🔴 Bloccato" : t.is_active ? "🟢 Attivo" : "⚪ Disattivo"}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a href={publicLinkFor(t)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border border-border px-1.5 py-1 text-[0.55rem] hover:bg-muted/30">
                  <ExternalLink className="w-3 h-3" /> Sito
                </a>
                <a href={adminLinkFor(t)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border border-border px-1.5 py-1 text-[0.55rem] hover:bg-muted/30">
                  <ExternalLink className="w-3 h-3" /> Admin
                </a>
                <button onClick={() => onMagicLink(user, t)} className="inline-flex items-center gap-1 rounded-md border border-primary/40 text-primary px-1.5 py-1 text-[0.55rem] hover:bg-primary/10">
                  <KeyRound className="w-3 h-3" /> Link
                </button>
                <button onClick={() => onToggleBlock(user, t)} className={`inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[0.55rem] ${t.is_blocked ? "border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10" : "border border-rose-500/40 text-rose-400 hover:bg-rose-500/10"}`}>
                  {t.is_blocked ? <><Unlock className="w-3 h-3" /> Sblocca</> : <><Lock className="w-3 h-3" /> Blocca</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[0.55rem] text-muted-foreground italic">Nessun tenant collegato.</p>
      )}

      {user.sales && user.sales.count > 0 && (
        <div className="text-[0.55rem] text-purple-400">
          Vendite: {user.sales.count} · Revenue €{user.sales.revenue.toLocaleString()} · Commissioni €{user.sales.commission.toLocaleString()}
        </div>
      )}
    </motion.div>
  );
}

function IconBtn({ children, onClick, title, danger }: { children: React.ReactNode; onClick: () => void; title: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-7 h-7 rounded-md flex items-center justify-center border ${danger ? "border-rose-500/40 text-rose-400 hover:bg-rose-500/10" : "border-border text-foreground/80 hover:bg-muted/30"}`}
    >
      {children}
    </button>
  );
}

function EditProfileModal({ user, working, onClose, onSave }: { user: AccountUser; working: boolean; onClose: () => void; onSave: (form: { full_name: string; phone: string; city: string; demo_section_enabled: boolean }) => void }) {
  const [fullName, setFullName] = useState(user.full_name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [city, setCity] = useState(user.city || "");
  const [demoEnabled, setDemoEnabled] = useState(user.demo_section_enabled);

  return (
    <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-md rounded-2xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Modifica account</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-md border border-border flex items-center justify-center"><X className="w-3 h-3" /></button>
        </div>
        <p className="text-[0.6rem] text-muted-foreground">{user.email}</p>
        <div className="space-y-2">
          <Field label="Nome completo" value={fullName} onChange={setFullName} />
          <Field label="Telefono" value={phone} onChange={setPhone} />
          <Field label="Città" value={city} onChange={setCity} />
          <label className="flex items-center justify-between rounded-lg border border-border bg-background/50 px-3 py-2">
            <span className="text-[0.65rem] text-foreground">Sezione demo abilitata</span>
            <input type="checkbox" checked={demoEnabled} onChange={(e) => setDemoEnabled(e.target.checked)} />
          </label>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button onClick={onClose} className="rounded-lg border border-border px-3 py-1.5 text-xs">Annulla</button>
          <button
            disabled={working}
            onClick={() => onSave({ full_name: fullName, phone, city, demo_section_enabled: demoEnabled })}
            className="rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1 disabled:opacity-60"
          >
            <Check className="w-3 h-3" /> Salva
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[0.6rem] text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg bg-background border border-border px-3 py-1.5 text-[0.7rem] text-foreground"
      />
    </label>
  );
}

function ConfirmDeleteModal({ user, working, onClose, onConfirm }: { user: AccountUser; working: boolean; onClose: () => void; onConfirm: () => void }) {
  const [text, setText] = useState("");
  const allowed = text.trim().toLowerCase() === "elimina";
  return (
    <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-md rounded-2xl border border-rose-500/40 bg-card p-4 space-y-3">
        <div className="flex items-center gap-2 text-rose-400">
          <AlertTriangle className="w-4 h-4" />
          <h3 className="text-sm font-bold">Eliminare definitivamente?</h3>
        </div>
        <p className="text-[0.65rem] text-foreground/80">
          Stai per eliminare <strong>{user.full_name}</strong> ({user.email}). Verrà rimosso anche dall'autenticazione. Tenant e dati collegati resteranno fino a cancellazione manuale.
        </p>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Scrivi "elimina" per confermare'
          className="w-full rounded-lg bg-background border border-border px-3 py-1.5 text-[0.7rem]"
        />
        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-border px-3 py-1.5 text-xs">Annulla</button>
          <button
            onClick={onConfirm}
            disabled={!allowed || working}
            className="rounded-lg bg-rose-500 text-white px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1 disabled:opacity-50"
          >
            <Trash2 className="w-3 h-3" /> Elimina
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}