import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, DollarSign, FolderOpen, User, ChevronRight, Crown, Trophy,
  Sparkles, Zap, TrendingUp, Users, Bot, Package, CheckCircle, Presentation,
  ShieldCheck, Globe, Clock, Headphones, BarChart3, Smartphone, Star,
  MessageCircle, Heart, Lock, Rocket, Award, ArrowRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import empireMonkeyMascot from "@/assets/empire-monkey.png";
import PartnerVoiceAgent from "@/components/partner/PartnerVoiceAgent";
import { usePartnerDemoMode } from "@/components/layout/PartnerLayout";

export default function PartnerHomePage() {
  const navigate = useNavigate();
  const { user, isTeamLeader } = useAuth();
  const { demoMode } = usePartnerDemoMode();
  const [partnerAvatar, setPartnerAvatar] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [salesCount, setSalesCount] = useState(0);
  const [totalCommissions, setTotalCommissions] = useState(0);
  const [teamCount, setTeamCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from("profiles").select("avatar_url, full_name").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data?.avatar_url) setPartnerAvatar(data.avatar_url);
      if (data?.full_name) setProfileName(data.full_name);
    });
    supabase.from("partner_sales").select("partner_commission").eq("partner_id", user.id).then(({ data }) => {
      setSalesCount(data?.length || 0);
      setTotalCommissions((data || []).reduce((s: number, r: any) => s + Number(r.partner_commission || 0), 0));
    });
    if (isTeamLeader) {
      supabase.from("partner_teams").select("id").eq("team_leader_id", user.id).then(({ data }) => setTeamCount(data?.length || 0));
    }
  }, [user?.id, isTeamLeader]);

  const userName = profileName || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Partner";

  const QUICK_NAV = [
    { icon: Target, label: "LeadEngine Scout", desc: "Trova, analizza e contatta lead reali con AI", color: "#14b8a6", path: "/partner/leads" },
    { icon: DollarSign, label: "Guadagni & Team", desc: "Commissioni, bonus e reclutamento venditori", color: "#10b981", path: "/partner/earnings" },
    { icon: FolderOpen, label: "Portfolio Demo", desc: "Catalogo 25+ settori con preview personalizzate", color: "#a78bfa", path: "/partner/portfolio" },
    { icon: User, label: "Il Mio Profilo", desc: "Dati personali, avatar e impostazioni", color: "#f59e0b", path: "/partner/profile" },
  ];

  const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.35 } });

  return (
    <div className="space-y-6">
      {/* ═══ HERO ═══ */}
      <section className="relative px-4 pt-8 pb-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 65%)", filter: "blur(120px)" }} />
        <div className="relative flex items-center gap-4">
          <motion.div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 bg-primary/10 border border-primary/20"
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            {partnerAvatar ? (
              <img src={partnerAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <img src={empireMonkeyMascot} alt="Empire" className="w-12 h-12 object-contain" />
            )}
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{demoMode ? "Presentazione per" : "Benvenuto,"}</p>
            <h1 className="text-xl font-bold text-foreground truncate">
              {demoMode ? "Il Tuo Business" : userName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {!demoMode && isTeamLeader && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-500">
                  <Crown className="w-3 h-3" /> Team Leader
                </span>
              )}
              {demoMode && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-500">
                  <Presentation className="w-3 h-3" /> Modalità Presentazione
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {demoMode ? (
          /* ═══════════════════════════════════════════
             DEMO MODE — FULL SALES PRESENTATION
             ═══════════════════════════════════════════ */
          <motion.div key="demo-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5 pb-8">
            
            {/* Banner */}
            <div className="py-2.5 text-center bg-amber-500/5 border-y border-amber-500/15">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                <Presentation className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                Il sistema completo per far crescere il tuo business
              </p>
            </div>

            <section className="px-4 space-y-5">

              {/* ─── 1. VALUE PROPOSITION ─── */}
              <motion.div {...fadeUp(0)} className="p-5 rounded-2xl text-center" style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.08), hsl(var(--accent)/0.05))", border: "1px solid hsl(var(--primary)/0.15)" }}>
                <Rocket className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h2 className="text-base font-bold text-foreground mb-1">Un Unico Sistema. Tutto Automatizzato.</h2>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  App personalizzata, sito web, agenti IA, gestione clienti, marketing automatico e analytics — tutto integrato, chiavi in mano, per qualsiasi settore.
                </p>
              </motion.div>

              {/* ─── 2. COSA INCLUDE — 6 pillars ─── */}
              <motion.div {...fadeUp(0.05)}>
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500 mb-3">
                  <Sparkles className="w-3 h-3 inline mr-1 -mt-0.5" /> Cosa Include
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: Smartphone, title: "App White Label", desc: "Con il tuo brand, logo e colori" },
                    { icon: Globe, title: "Sito Web Pro", desc: "SEO ottimizzato, velocissimo" },
                    { icon: Bot, title: "Agenti IA 24/7", desc: "Rispondono, vendono, gestiscono" },
                    { icon: MessageCircle, title: "WhatsApp & CRM", desc: "Contatti, chat e fidelizzazione" },
                    { icon: BarChart3, title: "Analytics & AI", desc: "Dati, previsioni, insight" },
                    { icon: ShieldCheck, title: "Review Shield™", desc: "Proteggi la reputazione online" },
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}
                      className="p-3 rounded-xl text-center bg-card border border-border">
                      <item.icon className="w-5 h-5 mx-auto mb-1.5 text-primary" />
                      <p className="text-[10px] font-bold text-foreground leading-tight">{item.title}</p>
                      <p className="text-[8px] mt-0.5 text-muted-foreground">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ─── 3. SETTORI — universal ─── */}
              <motion.div {...fadeUp(0.1)} className="p-4 rounded-2xl bg-card border border-border">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500 mb-2">
                  <Globe className="w-3 h-3 inline mr-1 -mt-0.5" /> Adatto a Ogni Settore
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {["🍽️ Ristorazione", "💅 Beauty & Spa", "🏨 Hotel", "🚗 NCC & Transfer", "💪 Fitness", "🏥 Sanità",
                    "🛍️ Retail", "🏖️ Stabilimenti", "🔧 Artigiani", "📷 Fotografi", "🎉 Eventi", "⚖️ Studi Professionali",
                    "🐾 Veterinari", "🎨 Tattoo", "👶 Asili", "📚 Formazione", "🌾 Agriturismo", "📦 Logistica"
                  ].map((s, i) => (
                    <span key={i} className="px-2 py-1 rounded-full text-[9px] font-medium bg-muted text-muted-foreground border border-border">{s}</span>
                  ))}
                </div>
                <p className="text-[9px] text-muted-foreground mt-2 text-center italic">…e qualsiasi altro settore con personalizzazione completa</p>
              </motion.div>

              {/* ─── 4. PACKAGES ─── */}
              <motion.div {...fadeUp(0.15)} className="space-y-3">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500">
                  <Package className="w-3 h-3 inline mr-1 -mt-0.5" /> Pacchetti & Investimento
                </h3>
                {[
                  { name: "Digital Start", price: "1.997", monthly: "49", accent: "hsl(var(--primary))", features: ["App completa personalizzata", "Menu/Catalogo + QR Code", "Dashboard Analytics", "Notifiche Push"], popular: false },
                  { name: "Growth AI", price: "4.997", monthly: "29", accent: "#14b8a6", badge: "⭐ Più Scelto", features: ["Tutto di Start +", "AI Engine completo", "2 Agenti IA inclusi", "Review Shield™", "WhatsApp Business API"], popular: true },
                  { name: "Empire Domination", price: "7.997", monthly: "0", accent: "#f59e0b", badge: "👑 Tutto Incluso", features: ["TUTTO illimitato", "0% commissioni per sempre", "5 Agenti IA personalizzati", "Account Manager VIP dedicato", "Priorità assoluta sviluppi"], popular: false },
                ].map((pkg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                    className="p-4 rounded-xl bg-card border relative overflow-hidden"
                    style={{ borderColor: pkg.popular ? pkg.accent : "hsl(var(--border))" }}>
                    {pkg.popular && <div className="absolute top-0 right-0 w-20 h-20 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at 100% 0%, ${pkg.accent}, transparent 70%)` }} />}
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 text-center">
                        <p className="text-xl font-bold text-foreground">€{pkg.price}</p>
                        <p className="text-[9px] text-muted-foreground">
                          {pkg.monthly === "0" ? "poi €0/mese" : `poi €${pkg.monthly}/mese`}
                        </p>
                        <p className="text-[8px] text-muted-foreground mt-0.5">rateizzabile 3x / 6x</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <p className="text-xs font-bold text-foreground">{pkg.name}</p>
                          {pkg.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: `${pkg.accent}20`, color: pkg.accent }}>{pkg.badge}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          {pkg.features.map((f, j) => (
                            <span key={j} className="text-[9px] flex items-center gap-1 text-muted-foreground">
                              <CheckCircle className="w-2.5 h-2.5 shrink-0" style={{ color: pkg.accent }} /> {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* ─── 5. AI AGENTS SHOWCASE ─── */}
              <motion.div {...fadeUp(0.2)} className="p-5 rounded-2xl bg-primary/5 border border-primary/15">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Agenti IA — Il Tuo Team Digitale</h3>
                </div>
                <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
                  Ogni agente lavora 24/7 senza pause, senza errori. Risponde ai clienti, gestisce prenotazioni, protegge le recensioni, invia promozioni e molto altro — automaticamente.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { emoji: "💬", name: "Assistente Clienti", desc: "Risponde in tempo reale a ogni richiesta" },
                    { emoji: "⭐", name: "Review Shield™", desc: "Gestisce e protegge le recensioni" },
                    { emoji: "📣", name: "Marketing AI", desc: "Post social e promozioni automatiche" },
                    { emoji: "📋", name: "Gestione Ordini", desc: "Riceve e organizza ordini e prenotazioni" },
                    { emoji: "🧠", name: "Business Advisor", desc: "Analizza dati e suggerisce strategie" },
                    { emoji: "📞", name: "Voice Agent", desc: "Risponde al telefono con voce umana" },
                  ].map((agent, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-card border border-border flex items-center gap-2">
                      <span className="text-lg shrink-0">{agent.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-foreground truncate">{agent.name}</p>
                        <p className="text-[8px] text-muted-foreground truncate">{agent.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ─── 6. COMPARISON — Why us vs competitors ─── */}
              <motion.div {...fadeUp(0.25)} className="p-4 rounded-2xl bg-card border border-border">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500 mb-3">
                  <TrendingUp className="w-3 h-3 inline mr-1 -mt-0.5" /> Perché Scegliere Noi
                </h3>
                <div className="space-y-2">
                  {[
                    { label: "Commissioni piattaforme (JustEat, TheFork…)", them: "fino a 30%", us: "0 – 2%", icon: DollarSign },
                    { label: "Aggiornamenti e nuove funzioni", them: "A pagamento", us: "Incluse per sempre", icon: Rocket },
                    { label: "Supporto tecnico", them: "Email, giorni", us: "WhatsApp diretto, istantaneo", icon: Headphones },
                    { label: "Personalizzazione", them: "Limitata", us: "100% su misura", icon: Star },
                    { label: "Proprietà dei dati", them: "Della piattaforma", us: "Tuoi per sempre", icon: Lock },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border/50 last:border-0">
                      <row.icon className="w-3.5 h-3.5 shrink-0 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-muted-foreground truncate">{row.label}</p>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium shrink-0">{row.them}</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold shrink-0">{row.us}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ─── 7. OBJECTION HANDLING ─── */}
              <motion.div {...fadeUp(0.3)} className="space-y-2">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500">
                  <Heart className="w-3 h-3 inline mr-1 -mt-0.5" /> Domande Frequenti
                </h3>
                {[
                  { q: "È complicato da usare?", a: "No. L'app è intuitiva come Instagram. In più, il nostro team ti segue passo dopo passo." },
                  { q: "Funziona per il mio settore?", a: "Sì, il sistema si adatta a qualsiasi attività: ristorazione, beauty, hotel, artigiani, studi professionali e molto altro." },
                  { q: "E se non funziona?", a: "90 giorni di prova gratuita. Se non sei soddisfatto, non paghi nulla. Zero rischi." },
                  { q: "Quanto tempo serve per partire?", a: "In 48 ore la tua app e il tuo sito sono online, completamente personalizzati." },
                  { q: "Posso rateizzare?", a: "Assolutamente sì. Offriamo rate comode in 3 o 6 mesi, senza interessi." },
                ].map((faq, i) => (
                  <details key={i} className="group rounded-xl bg-card border border-border overflow-hidden">
                    <summary className="flex items-center justify-between p-3 cursor-pointer text-[11px] font-semibold text-foreground list-none">
                      {faq.q}
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground transition-transform group-open:rotate-90 shrink-0" />
                    </summary>
                    <p className="px-3 pb-3 text-[10px] text-muted-foreground leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </motion.div>

              {/* ─── 8. SOCIAL PROOF ─── */}
              <motion.div {...fadeUp(0.35)} className="p-4 rounded-2xl text-center" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.06), rgba(167,139,250,0.04))", border: "1px solid rgba(245,158,11,0.12)" }}>
                <div className="flex items-center justify-center gap-0.5 mb-2">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-xs font-bold text-foreground mb-1">Oltre 500 attività già attive</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  "Da quando usiamo il sistema, gli ordini online sono aumentati del 40% e risparmiamo 15 ore a settimana."
                </p>
                <p className="text-[9px] text-amber-500 font-semibold mt-1.5">— Marco R., Ristoratore, Roma</p>
              </motion.div>

              {/* ─── 9. GUARANTEE ─── */}
              <motion.div {...fadeUp(0.38)} className="p-4 rounded-2xl flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/15">
                <ShieldCheck className="w-10 h-10 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">90 Giorni di Prova Gratuita</p>
                  <p className="text-[10px] text-muted-foreground">Nessun rischio. Provi tutto il sistema completo. Se non sei soddisfatto, non paghi nulla.</p>
                </div>
              </motion.div>

              {/* ─── 10. CTA Portfolio ─── */}
              <div className="text-center py-4 space-y-3">
                <motion.button onClick={() => navigate("/partner/portfolio")} whileTap={{ scale: 0.97 }}
                  className="w-full px-6 py-3.5 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 bg-amber-500 text-white shadow-lg shadow-amber-500/20">
                  <FolderOpen className="w-4 h-4" /> Vedi le Demo per il Tuo Settore
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <p className="text-[10px] text-muted-foreground">
                  👆 Mostra al cliente le preview interattive personalizzate per il suo settore
                </p>
              </div>

            </section>
          </motion.div>
        ) : (
          /* ═══════════════════════════════════════════
             LIVE MODE — INTERNAL PARTNER TOOLS
             ═══════════════════════════════════════════ */
          <motion.div key="live-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            
            {/* Quick Stats */}
            <section className="px-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Trophy, value: salesCount, label: "Vendite", color: "text-primary" },
                  { icon: TrendingUp, value: `€${totalCommissions.toLocaleString()}`, label: "Commissioni", color: "text-accent" },
                  { icon: isTeamLeader ? Users : Target, value: isTeamLeader ? teamCount : `${salesCount}/4`, label: isTeamLeader ? "Team" : "a Leader", color: "text-blue-400" },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="p-3.5 rounded-xl text-center bg-card border border-border">
                    <s.icon className={`w-4 h-4 mb-1 mx-auto ${s.color}`} />
                    <p className="text-xl font-bold text-foreground">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Quick Nav */}
            <section className="px-4 space-y-3">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Strumenti</h3>
              {QUICK_NAV.map((item, i) => (
                <motion.div key={item.path} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer group transition-all active:scale-[0.98] bg-card border border-border hover:border-primary/30">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${item.color}15` }}>
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground">{item.label}</h4>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1 text-muted-foreground" />
                </motion.div>
              ))}
            </section>

            {/* CTA */}
            <section className="px-4 pb-8">
              <div className="relative p-6 rounded-2xl overflow-hidden text-center bg-primary/5 border border-primary/15">
                <Sparkles className="w-6 h-6 mx-auto mb-2 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Trova i tuoi prossimi clienti</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4">LeadEngine Scout trova, analizza e crea messaggi personalizzati per ogni canale.</p>
                <motion.button onClick={() => navigate("/partner/leads")} whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2 bg-accent text-accent-foreground">
                  <Zap className="w-4 h-4" /> Inizia Ora
                </motion.button>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <PartnerVoiceAgent activeTab="dashboard" demoMode={demoMode} />
    </div>
  );
}
