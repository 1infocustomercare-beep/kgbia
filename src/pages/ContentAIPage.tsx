import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Plus, Instagram, Facebook, Linkedin, Globe, Video,
  Sparkles, Copy, Check, RefreshCw, Clock, TrendingUp, Hash,
  FileText, Image, Megaphone, Star, BookOpen, Gift, Users,
  ChevronLeft, ChevronRight, BarChart3, Eye, Heart, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SECTOR_OPTIONS } from "@/data/mock-leads-data";
import { toast } from "sonner";

type ContentTab = "calendar" | "create" | "templates" | "analytics";

const PLATFORMS = [
  { id: "instagram", icon: Instagram, label: "Instagram", color: "#E4405F", maxChars: 2200 },
  { id: "facebook", icon: Facebook, label: "Facebook", color: "#1877F2", maxChars: 63206 },
  { id: "linkedin", icon: Linkedin, label: "LinkedIn", color: "#0A66C2", maxChars: 3000 },
  { id: "google", icon: Globe, label: "Google Business", color: "#4285F4", maxChars: 1500 },
  { id: "tiktok", icon: Video, label: "TikTok", color: "#000000", maxChars: 2200 },
];

const CONTENT_TYPES = [
  { id: "post", label: "Post Social", icon: Image },
  { id: "story", label: "Story", icon: Eye },
  { id: "reel", label: "Reel Script", icon: Video },
  { id: "blog", label: "Articolo Blog", icon: FileText },
  { id: "google_post", label: "Google Post", icon: Globe },
  { id: "newsletter", label: "Email Newsletter", icon: Megaphone },
];

const OBJECTIVES = [
  { id: "awareness", label: "Brand Awareness" },
  { id: "engagement", label: "Engagement" },
  { id: "conversion", label: "Conversione" },
  { id: "educational", label: "Educativo" },
  { id: "testimonial", label: "Testimonial" },
];

const TEMPLATE_CATEGORIES = [
  { id: "promo", label: "Promozioni", icon: Gift, color: "#ef4444" },
  { id: "menu", label: "Menu Update", icon: BookOpen, color: "#f59e0b" },
  { id: "new_arrival", label: "Nuovo Arrivo", icon: Sparkles, color: "#8b5cf6" },
  { id: "event", label: "Evento", icon: Calendar, color: "#3b82f6" },
  { id: "review", label: "Recensione Cliente", icon: Star, color: "#10b981" },
  { id: "tips", label: "Tips & Tricks", icon: BookOpen, color: "#06b6d4" },
];

// Mock content generation
function generateContent(platform: string, type: string, sector: string, objective: string): { text: string; hashtags: string[]; bestTime: string; imageIdea: string } {
  const sectorLabel = SECTOR_OPTIONS.find(s => s.value === sector)?.label || sector;
  
  const templates: Record<string, string[]> = {
    awareness: [
      `✨ Sapevi che il 73% delle persone cerca ${sectorLabel.toLowerCase()} online prima di scegliere?\n\nNoi ci siamo. E ci siamo evoluti.\n\n🚀 Prenotazione facile, servizio impeccabile, esperienza memorabile.\n\nScopri perché sempre più clienti ci scelgono.\n\n📲 Link in bio`,
      `Il futuro di ${sectorLabel.toLowerCase()} è già qui.\n\nMentre gli altri restano fermi, noi investiamo:\n▪️ Prenotazione digitale 24/7\n▪️ Esperienza personalizzata\n▪️ Servizio che supera le aspettative\n\nVieni a scoprire la differenza. 🎯`,
    ],
    engagement: [
      `📊 SONDAGGIO\n\nCosa conta di più quando scegli ${sectorLabel.toLowerCase()}?\n\nA) Qualità del servizio\nB) Prezzo competitivo\nC) Facilità di prenotazione\nD) Recensioni online\n\nRispondi nei commenti! 👇\n\nIl risultato più votato diventerà il nostro focus del mese 💡`,
      `🎲 INDOVINA!\n\nQuanti clienti abbiamo servito questo mese?\n\n💬 Scrivi il tuo numero nei commenti!\nIl più vicino vince [PREMIO]!\n\n⏰ Risposte aperte fino a domani sera`,
    ],
    conversion: [
      `🔥 OFFERTA LIMITATA\n\nSolo per questa settimana:\n\n✅ [SERVIZIO] con il 20% di sconto\n✅ Prenotazione prioritaria\n✅ Consulenza personalizzata inclusa\n\n📲 Prenota ora → Link in bio\n\n⏰ Scade domenica. Solo [X] posti rimasti.`,
    ],
    educational: [
      `💡 LO SAPEVI?\n\n3 errori che il 90% delle persone fa quando sceglie ${sectorLabel.toLowerCase()}:\n\n1️⃣ Non controllare le recensioni online\n2️⃣ Non chiedere una consulenza prima\n3️⃣ Scegliere solo in base al prezzo\n\nIl nostro consiglio? Investi nella qualità.\nCosta meno di quanto pensi. 😉\n\n📲 Scopri di più → Link in bio`,
    ],
    testimonial: [
      `⭐⭐⭐⭐⭐\n\n"Non pensavo potesse essere così semplice. Ho prenotato online in 30 secondi e il servizio è stato impeccabile."\n— Marco R., cliente verificato\n\n💬 Le parole dei nostri clienti sono la nostra migliore pubblicità.\n\nGrazie Marco! E grazie a tutti voi che ci scegliete ogni giorno. ❤️\n\n📲 Prenota la tua esperienza → Link in bio`,
    ],
  };

  const hashtagMap: Record<string, string[]> = {
    food: ["#ristoranteitaliano", "#foodie", "#cucinaitaliana", "#buonappetito", "#foodporn", "#mangiarbene"],
    beauty: ["#beautysalon", "#skincare", "#haircare", "#wellness", "#beauty", "#selfcare"],
    fitness: ["#fitness", "#workout", "#gym", "#healthylifestyle", "#training", "#fitnessmotivation"],
    ncc: ["#ncc", "#transfer", "#luxury", "#travel", "#chauffeur", "#limousine"],
    default: ["#business", "#qualità", "#servizio", "#innovazione", "#eccellenza", "#italia"],
  };

  const texts = templates[objective] || templates.awareness;
  const text = texts[Math.floor(Math.random() * texts.length)];
  const hashtags = (hashtagMap[sector] || hashtagMap.default).sort(() => Math.random() - 0.5).slice(0, 6);
  const bestTimes = ["09:00", "12:30", "18:00", "20:00", "21:30"];
  const imageIdeas = [
    "Foto del team al lavoro con luce naturale",
    "Close-up del prodotto/servizio di punta",
    "Behind the scenes dell'attività",
    "Foto cliente soddisfatto (con consenso)",
    "Flat lay con elementi del brand",
  ];

  return {
    text,
    hashtags,
    bestTime: bestTimes[Math.floor(Math.random() * bestTimes.length)],
    imageIdea: imageIdeas[Math.floor(Math.random() * imageIdeas.length)],
  };
}

// Calendar mock data
function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: { day: number; posts: { platform: string; title: string }[] }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const posts: { platform: string; title: string }[] = [];
    if (Math.random() > 0.6) posts.push({ platform: "instagram", title: "Post social" });
    if (Math.random() > 0.75) posts.push({ platform: "facebook", title: "Articolo" });
    if (Math.random() > 0.85) posts.push({ platform: "google", title: "Google Post" });
    days.push({ day: d, posts });
  }
  return { firstDay: firstDay === 0 ? 6 : firstDay - 1, days };
}

export default function ContentAIPage() {
  const [tab, setTab] = useState<ContentTab>("create");
  const [platform, setPlatform] = useState("instagram");
  const [contentType, setContentType] = useState("post");
  const [sector, setSector] = useState("food");
  const [objective, setObjective] = useState("awareness");
  const [generatedContent, setGeneratedContent] = useState<ReturnType<typeof generateContent> | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [templateCat, setTemplateCat] = useState("promo");

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGeneratedContent(generateContent(platform, contentType, sector, objective));
      setGenerating(false);
      toast.success("Contenuto generato!");
    }, 800);
  };

  const handleCopy = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent.text + "\n\n" + generatedContent.hashtags.join(" "));
    setCopied(true);
    toast.success("Copiato!");
    setTimeout(() => setCopied(false), 2000);
  };

  const calData = getCalendarDays(calYear, calMonth);
  const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  const selectedPlatform = PLATFORMS.find(p => p.id === platform)!;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5" style={{ color: "#a78bfa" }} /> Content AI Studio
        </h1>
        <p className="text-[11px] mt-0.5" style={{ color: "#6b7280" }}>Genera, programma e ottimizza contenuti per ogni piattaforma</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {([
          { id: "create" as ContentTab, icon: Sparkles, label: "Genera" },
          { id: "calendar" as ContentTab, icon: Calendar, label: "Calendario" },
          { id: "templates" as ContentTab, icon: FileText, label: "Template" },
          { id: "analytics" as ContentTab, icon: BarChart3, label: "Analytics" },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: tab === t.id ? "rgba(167,139,250,0.12)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${tab === t.id ? "rgba(167,139,250,0.25)" : "rgba(255,255,255,0.06)"}`,
              color: tab === t.id ? "#a78bfa" : "#9ca3af",
            }}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* CREATE TAB */}
      {tab === "create" && (
        <div className="space-y-4">
          {/* Platform */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "#9ca3af" }}>Piattaforma</label>
            <div className="flex gap-2 flex-wrap">
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => setPlatform(p.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-semibold transition-all"
                  style={{
                    background: platform === p.id ? `${p.color}18` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${platform === p.id ? `${p.color}40` : "rgba(255,255,255,0.06)"}`,
                    color: platform === p.id ? p.color : "#9ca3af",
                  }}>
                  <p.icon className="w-3.5 h-3.5" /> {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type + Sector + Objective */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: "#9ca3af" }}>Tipo</label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: "#9ca3af" }}>Settore</label>
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTOR_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: "#9ca3af" }}>Obiettivo</label>
              <Select value={objective} onValueChange={setObjective}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OBJECTIVES.map(o => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={generating} className="w-full h-11 text-xs font-bold" style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
            {generating ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Genero contenuto...</span>
              : <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Genera Contenuto AI</span>}
          </Button>

          {/* Generated Content */}
          <AnimatePresence>
            {generatedContent && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center justify-between p-3" style={{ background: `${selectedPlatform.color}08`, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center gap-2">
                      <selectedPlatform.icon className="w-4 h-4" style={{ color: selectedPlatform.color }} />
                      <span className="text-xs font-bold text-white">Preview {selectedPlatform.label}</span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "#9ca3af" }}>
                      {generatedContent.text.length}/{selectedPlatform.maxChars} caratteri
                    </span>
                  </div>
                  <div className="p-4">
                    <pre className="text-[11px] leading-relaxed whitespace-pre-wrap font-sans" style={{ color: "#d1d5db" }}>{generatedContent.text}</pre>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {generatedContent.hashtags.map(h => (
                        <span key={h} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa" }}>{h}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Meta info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <Clock className="w-3.5 h-3.5 mb-1" style={{ color: "#f59e0b" }} />
                    <p className="text-[10px] font-semibold text-white">Best Time</p>
                    <p className="text-xs font-bold" style={{ color: "#f59e0b" }}>{generatedContent.bestTime}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <Image className="w-3.5 h-3.5 mb-1" style={{ color: "#10b981" }} />
                    <p className="text-[10px] font-semibold text-white">Immagine</p>
                    <p className="text-[10px]" style={{ color: "#10b981" }}>{generatedContent.imageIdea}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button onClick={handleGenerate} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-semibold" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}>
                    <RefreshCw className="w-3 h-3" /> Rigenera
                  </button>
                  <button onClick={handleCopy} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-bold" style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)", color: "#fff" }}>
                    {copied ? <><Check className="w-3.5 h-3.5" /> Copiato!</> : <><Copy className="w-3.5 h-3.5" /> Copia</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* CALENDAR TAB */}
      {tab === "calendar" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}>
              <ChevronLeft className="w-5 h-5 text-white/60" />
            </button>
            <h3 className="text-sm font-bold text-white">{monthNames[calMonth]} {calYear}</h3>
            <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}>
              <ChevronRight className="w-5 h-5 text-white/60" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map(d => (
              <div key={d} className="text-[9px] font-semibold text-center py-1" style={{ color: "#6b7280" }}>{d}</div>
            ))}
            {Array.from({ length: calData.firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {calData.days.map(d => (
              <div key={d.day} className="aspect-square rounded-lg p-1 cursor-pointer hover:bg-white/5 transition-colors relative"
                style={{ background: d.posts.length > 0 ? "rgba(124,58,237,0.06)" : "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <span className="text-[10px] font-medium text-white/80">{d.day}</span>
                <div className="flex gap-0.5 mt-0.5 flex-wrap">
                  {d.posts.map((p, pi) => {
                    const pl = PLATFORMS.find(x => x.id === p.platform);
                    return <div key={pi} className="w-1.5 h-1.5 rounded-full" style={{ background: pl?.color || "#6b7280" }} />;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEMPLATES TAB */}
      {tab === "templates" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {TEMPLATE_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setTemplateCat(cat.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-semibold transition-all"
                style={{
                  background: templateCat === cat.id ? `${cat.color}15` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${templateCat === cat.id ? `${cat.color}35` : "rgba(255,255,255,0.06)"}`,
                  color: templateCat === cat.id ? cat.color : "#9ca3af",
                }}>
                <cat.icon className="w-3 h-3" /> {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => {
              const cat = TEMPLATE_CATEGORIES.find(c => c.id === templateCat)!;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl cursor-pointer hover:border-white/15 transition-all"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                    <span className="text-xs font-bold text-white">{cat.label} Template #{i}</span>
                  </div>
                  <p className="text-[10px] leading-relaxed" style={{ color: "#9ca3af" }}>
                    Template ottimizzato per {cat.label.toLowerCase()} con testo persuasivo, hashtag e CTA pronti all'uso.
                  </p>
                  <button className="mt-3 text-[9px] font-semibold flex items-center gap-1" style={{ color: "#a78bfa" }}>
                    <Sparkles className="w-3 h-3" /> Genera Variante AI
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {tab === "analytics" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Eye, label: "Reach Stimata", value: "12.4K", color: "#3b82f6" },
              { icon: Heart, label: "Engagement", value: "4.8%", color: "#ef4444" },
              { icon: MessageCircle, label: "Commenti", value: "156", color: "#10b981" },
              { icon: TrendingUp, label: "Crescita", value: "+23%", color: "#a78bfa" },
            ].map((m, i) => (
              <div key={i} className="p-3 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <m.icon className="w-4 h-4 mx-auto mb-1" style={{ color: m.color }} />
                <p className="text-lg font-bold text-white">{m.value}</p>
                <p className="text-[9px]" style={{ color: "#6b7280" }}>{m.label}</p>
              </div>
            ))}
          </div>

          {/* Mock chart */}
          <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h4 className="text-xs font-bold text-white mb-3">Performance Ultimi 7 Giorni</h4>
            <div className="flex items-end gap-2 h-32">
              {[65, 78, 45, 92, 83, 70, 88].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div initial={{ height: 0 }} animate={{ height: `${v}%` }} transition={{ delay: i * 0.08 }}
                    className="w-full rounded-t-lg" style={{ background: "linear-gradient(180deg, #7c3aed, #3b82f6)" }} />
                  <span className="text-[8px]" style={{ color: "#6b7280" }}>{["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
