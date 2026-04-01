import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Search, Plus, Phone, Mail, Instagram, MessageCircle,
  MapPin, Send, RotateCcw, Trash2, ChevronDown, ChevronUp,
  Clock, CheckCircle, XCircle, Calendar, Filter,
  ArrowRight, Globe, Pencil, Save, X as XIcon
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  sent:      { label: "Inviato",    color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  icon: Send },
  replied:   { label: "Risposto",   color: "#34d399", bg: "rgba(52,211,153,0.12)",  icon: MessageCircle },
  meeting:   { label: "Meeting",    color: "#a78bfa", bg: "rgba(167,139,250,0.12)", icon: Calendar },
  converted: { label: "Convertito", color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  icon: CheckCircle },
  lost:      { label: "Perso",      color: "#f87171", bg: "rgba(248,113,113,0.12)", icon: XCircle },
};

const CHANNEL_ICON: Record<string, any> = {
  instagram: Instagram,
  whatsapp: MessageCircle,
  email: Mail,
  field: MapPin,
  site: Globe,
};

interface Outreach {
  id: string;
  prospect_name: string;
  prospect_contact: string | null;
  channel: string;
  sector_id: string | null;
  message_sent: string | null;
  status: string;
  notes: string | null;
  next_followup_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Props {
  partnerId: string;
  onLogOutreach?: (data: { prospect_name: string; channel: string; sector_id?: string; message?: string }) => void;
}

export default function PartnerOutreachCRM({ partnerId, onLogOutreach }: Props) {
  const [items, setItems] = useState<Outreach[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterChannel, setFilterChannel] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");

  // Add form
  const [addForm, setAddForm] = useState({ name: "", contact: "", channel: "instagram", sector: "", notes: "" });

  const fetch = async () => {
    const { data } = await supabase
      .from("partner_outreach" as any)
      .select("*")
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false });
    if (data) setItems(data as unknown as Outreach[]);
    setLoading(false);
  };

  useEffect(() => { if (partnerId) fetch(); }, [partnerId]);

  const addOutreach = async () => {
    if (!addForm.name.trim()) return;
    await supabase.from("partner_outreach" as any).insert({
      partner_id: partnerId,
      prospect_name: addForm.name,
      prospect_contact: addForm.contact || null,
      channel: addForm.channel,
      sector_id: addForm.sector || null,
      notes: addForm.notes || null,
      status: "sent",
    });
    toast.success("Contatto registrato!");
    setAddForm({ name: "", contact: "", channel: "instagram", sector: "", notes: "" });
    setShowAdd(false);
    fetch();
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("partner_outreach" as any).update({ status }).eq("id", id);
    toast.success(`Stato aggiornato: ${STATUS_MAP[status]?.label}`);
    fetch();
  };

  const updateNotes = async (id: string) => {
    await supabase.from("partner_outreach" as any).update({ notes: editNotes }).eq("id", id);
    toast.success("Note salvate");
    setEditId(null);
    fetch();
  };

  const deleteOutreach = async (id: string) => {
    await supabase.from("partner_outreach" as any).delete().eq("id", id);
    toast.success("Contatto eliminato");
    fetch();
  };

  const setFollowup = async (id: string, days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    await supabase.from("partner_outreach" as any).update({ next_followup_at: d.toISOString() }).eq("id", id);
    toast.success(`Follow-up tra ${days} giorni`);
    fetch();
  };

  const filtered = items.filter(i => {
    const matchSearch = i.prospect_name.toLowerCase().includes(search.toLowerCase()) ||
      (i.prospect_contact || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || i.status === filterStatus;
    const matchChannel = filterChannel === "all" || i.channel === filterChannel;
    return matchSearch && matchStatus && matchChannel;
  });

  // Stats
  const totalSent = items.length;
  const totalReplied = items.filter(i => i.status === "replied").length;
  const totalMeeting = items.filter(i => i.status === "meeting").length;
  const totalConverted = items.filter(i => i.status === "converted").length;
  const pendingFollowups = items.filter(i => i.next_followup_at && new Date(i.next_followup_at) <= new Date()).length;

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("it-IT", { day: "2-digit", month: "short" });
  };
  const formatTime = (d: string) => {
    const date = new Date(d);
    return date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  };

  const isOverdue = (d: string | null) => d && new Date(d) < new Date();

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-8 py-6">
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(59,130,246,0.12)" }}>
              <Users className="w-4.5 h-4.5" style={{ color: "#60a5fa" }} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">CRM Contatti</h3>
              <p className="text-[9px]" style={{ color: "#6b7280" }}>{totalSent} contatti · {pendingFollowups > 0 && <span style={{ color: "#f59e0b" }}>{pendingFollowups} follow-up in scadenza</span>}</p>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAdd(!showAdd)}
            className="p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
            style={{ background: showAdd ? "rgba(239,68,68,0.12)" : "rgba(59,130,246,0.15)", color: showAdd ? "#f87171" : "#60a5fa", border: `1px solid ${showAdd ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.25)"}` }}>
            {showAdd ? <XIcon className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showAdd ? "Chiudi" : "Nuovo"}
          </motion.button>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-5 gap-0 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {[
            { label: "Inviati", value: totalSent, color: "#60a5fa" },
            { label: "Risposto", value: totalReplied, color: "#34d399" },
            { label: "Meeting", value: totalMeeting, color: "#a78bfa" },
            { label: "Chiusi", value: totalConverted, color: "#fbbf24" },
            { label: "Follow-up", value: pendingFollowups, color: pendingFollowups > 0 ? "#f59e0b" : "#6b7280" },
          ].map((kpi, i) => (
            <div key={i} className="py-3 px-1" style={{ borderRight: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
              <p className="text-lg font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="p-4 space-y-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(59,130,246,0.03)" }}>
                <input value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="Nome attività *" className="w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder:text-gray-500 bg-transparent"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
                <div className="grid grid-cols-2 gap-2">
                  <input value={addForm.contact} onChange={e => setAddForm({ ...addForm, contact: e.target.value })}
                    placeholder="@instagram / telefono / email" className="px-3 py-2.5 rounded-xl text-xs text-white placeholder:text-gray-500 bg-transparent"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
                  <select value={addForm.channel} onChange={e => setAddForm({ ...addForm, channel: e.target.value })}
                    className="px-3 py-2.5 rounded-xl text-xs bg-transparent text-white"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                    <option value="instagram">Instagram</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="field">Porta a Porta</option>
                    <option value="site">Link Sito</option>
                  </select>
                </div>
                <input value={addForm.sector} onChange={e => setAddForm({ ...addForm, sector: e.target.value })}
                  placeholder="Settore (es. food, beauty, ncc...)" className="w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder:text-gray-500 bg-transparent"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
                <textarea value={addForm.notes} onChange={e => setAddForm({ ...addForm, notes: e.target.value })}
                  placeholder="Note..." rows={2} className="w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder:text-gray-500 bg-transparent resize-none"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
                <motion.button whileTap={{ scale: 0.97 }} onClick={addOutreach}
                  className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                  style={{ background: "#3b82f6", color: "#fff" }}>
                  <Plus className="w-3.5 h-3.5" /> Salva Contatto
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="p-3 flex flex-wrap gap-2 items-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="relative flex-1 min-w-[140px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3" style={{ color: "#6b7280" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cerca..." className="w-full pl-8 pr-3 py-2 rounded-lg text-[11px] text-white placeholder:text-gray-600 bg-transparent"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }} />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-2.5 py-2 rounded-lg text-[10px] bg-transparent text-white"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <option value="all">Tutti stati</option>
            {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={filterChannel} onChange={e => setFilterChannel(e.target.value)}
            className="px-2.5 py-2 rounded-lg text-[10px] bg-transparent text-white"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <option value="all">Tutti canali</option>
            <option value="instagram">Instagram</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="field">Porta a Porta</option>
            <option value="site">Link Sito</option>
          </select>
        </div>

        {/* List */}
        <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          {loading && <div className="p-8 text-center text-xs" style={{ color: "#6b7280" }}>Caricamento...</div>}
          {!loading && filtered.length === 0 && (
            <div className="p-8 text-center space-y-2">
              <Users className="w-8 h-8 mx-auto opacity-30" style={{ color: "#6b7280" }} />
              <p className="text-xs font-medium" style={{ color: "#9ca3af" }}>Nessun contatto trovato</p>
              <p className="text-[10px]" style={{ color: "#6b7280" }}>Registra i prospect contattati per tracciare la pipeline</p>
            </div>
          )}
          {filtered.map(item => {
            const ChannelIcon = CHANNEL_ICON[item.channel] || Send;
            const statusConf = STATUS_MAP[item.status] || STATUS_MAP.sent;
            const StatusIcon = statusConf.icon;
            const isExpanded = expandedId === item.id;
            const overdue = isOverdue(item.next_followup_at);

            return (
              <div key={item.id}>
                {/* Row */}
                <motion.div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="flex items-center gap-3 p-3 sm:p-4 cursor-pointer transition-colors active:bg-white/[0.02]"
                >
                  {/* Channel icon */}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: statusConf.bg }}>
                    <ChannelIcon className="w-3.5 h-3.5" style={{ color: statusConf.color }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-white truncate">{item.prospect_name}</p>
                      {overdue && <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: "#f59e0b" }} />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.prospect_contact && (
                        <span className="text-[9px] truncate max-w-[120px]" style={{ color: "#6b7280" }}>{item.prospect_contact}</span>
                      )}
                      <span className="text-[8px]" style={{ color: "#4b5563" }}>{formatDate(item.created_at)}</span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1 flex-shrink-0"
                    style={{ background: statusConf.bg, color: statusConf.color, border: `1px solid ${statusConf.color}25` }}>
                    <StatusIcon className="w-2.5 h-2.5" />
                    {statusConf.label}
                  </span>

                  <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} style={{ color: "#4b5563" }} />
                </motion.div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 space-y-3">
                        {/* Status change buttons */}
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[8px] font-semibold uppercase tracking-wider self-center mr-1" style={{ color: "#6b7280" }}>Stato:</span>
                          {Object.entries(STATUS_MAP).map(([key, conf]) => (
                            <button key={key} onClick={(e) => { e.stopPropagation(); updateStatus(item.id, key); }}
                              className="px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all"
                              style={{
                                background: item.status === key ? conf.bg : "rgba(255,255,255,0.03)",
                                border: `1px solid ${item.status === key ? `${conf.color}40` : "rgba(255,255,255,0.06)"}`,
                                color: item.status === key ? conf.color : "#6b7280",
                              }}>
                              {conf.label}
                            </button>
                          ))}
                        </div>

                        {/* Follow-up */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Clock className="w-3 h-3" style={{ color: "#6b7280" }} />
                          <span className="text-[9px] font-semibold" style={{ color: "#9ca3af" }}>Follow-up:</span>
                          {[1, 3, 7].map(d => (
                            <button key={d} onClick={(e) => { e.stopPropagation(); setFollowup(item.id, d); }}
                              className="px-2 py-0.5 rounded-md text-[9px] font-medium"
                              style={{ background: "rgba(245,158,11,0.08)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.15)" }}>
                              {d}g
                            </button>
                          ))}
                          {item.next_followup_at && (
                            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md`}
                              style={{ background: overdue ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", color: overdue ? "#f87171" : "#34d399" }}>
                              📅 {formatDate(item.next_followup_at)} {overdue ? "— SCADUTO" : ""}
                            </span>
                          )}
                        </div>

                        {/* Quick actions */}
                        <div className="flex gap-2 flex-wrap">
                          {item.prospect_contact && item.channel === "instagram" && (
                            <a href={`https://instagram.com/${item.prospect_contact.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                              style={{ background: "linear-gradient(135deg, #833AB4, #E4405F)", color: "#fff" }}>
                              <Instagram className="w-3 h-3" /> Ricontatta DM
                            </a>
                          )}
                          {item.prospect_contact && item.channel === "whatsapp" && (
                            <a href={`https://wa.me/${item.prospect_contact.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                              style={{ background: "#25D366", color: "#fff" }}>
                              <MessageCircle className="w-3 h-3" /> Ricontatta WA
                            </a>
                          )}
                          {item.prospect_contact && item.channel === "email" && (
                            <a href={`mailto:${item.prospect_contact}`}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                              style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)" }}>
                              <Mail className="w-3 h-3" /> Ricontatta Email
                            </a>
                          )}
                          {item.prospect_contact && !["instagram", "whatsapp", "email"].includes(item.channel) && (
                            <a href={`tel:${item.prospect_contact}`}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                              style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}>
                              <Phone className="w-3 h-3" /> Chiama
                            </a>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); deleteOutreach(item.id); }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium"
                            style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.12)" }}>
                            <Trash2 className="w-3 h-3" /> Elimina
                          </button>
                        </div>

                        {/* Notes */}
                        <div className="space-y-1.5">
                          {editId === item.id ? (
                            <div className="flex gap-2">
                              <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)}
                                className="flex-1 px-3 py-2 rounded-lg text-[11px] text-white placeholder:text-gray-600 bg-transparent resize-none"
                                style={{ border: "1px solid rgba(255,255,255,0.1)" }} rows={2} />
                              <div className="flex flex-col gap-1">
                                <button onClick={() => updateNotes(item.id)} className="p-1.5 rounded-lg" style={{ background: "rgba(16,185,129,0.15)" }}>
                                  <Save className="w-3 h-3" style={{ color: "#34d399" }} />
                                </button>
                                <button onClick={() => setEditId(null)} className="p-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.1)" }}>
                                  <XIcon className="w-3 h-3" style={{ color: "#f87171" }} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button onClick={(e) => { e.stopPropagation(); setEditId(item.id); setEditNotes(item.notes || ""); }}
                              className="flex items-center gap-1.5 text-[10px]" style={{ color: "#9ca3af" }}>
                              <Pencil className="w-3 h-3" />
                              {item.notes ? item.notes : "Aggiungi note..."}
                            </button>
                          )}
                        </div>

                        {/* Sector tag */}
                        {item.sector_id && (
                          <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-semibold"
                            style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)" }}>
                            📁 {item.sector_id}
                          </span>
                        )}

                        {/* Message preview */}
                        {item.message_sent && (
                          <div className="p-2.5 rounded-lg text-[10px] leading-relaxed line-clamp-3"
                            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", color: "#9ca3af" }}>
                            {item.message_sent}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
