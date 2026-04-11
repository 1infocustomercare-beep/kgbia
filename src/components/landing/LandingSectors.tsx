import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ArrowRight, Play, Sparkles, X, ChefHat, Car, Scissors, Heart, Store, Dumbbell, Building, MapPin, Wrench, Camera, GraduationCap, Waves, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DEMO_SLUGS } from "@/data/demo-industries";
import sectorHeroFood from "@/assets/sector-hero-food.jpg";
import sectorHeroNcc from "@/assets/sector-hero-ncc.jpg";
import sectorHeroBeauty from "@/assets/sector-hero-beauty.jpg";
import sectorHeroHealthcare from "@/assets/sector-hero-healthcare.jpg";
import sectorHeroRetail from "@/assets/sector-hero-retail.jpg";
import sectorHeroFitness from "@/assets/sector-hero-fitness.jpg";
import sectorHeroHotel from "@/assets/sector-hero-hotel.jpg";
import sectorHeroBeach from "@/assets/sector-hero-beach.jpg";

const SECTORS = [
  { id: "food", title: "Ristorazione", desc: "Menu QR · Ordini · Cucina", icon: <ChefHat className="w-4 h-4" />, color: "#e85d04", image: sectorHeroFood, gradient: "from-orange-600 to-red-600" },
  { id: "ncc", title: "NCC & Trasporti", desc: "Flotta · Booking · Autisti", icon: <Car className="w-4 h-4" />, color: "#C9A84C", image: sectorHeroNcc, gradient: "from-amber-600 to-yellow-700" },
  { id: "beauty", title: "Beauty & Wellness", desc: "Agenda · Clienti · Fidelity", icon: <Scissors className="w-4 h-4" />, color: "#e91e8c", image: sectorHeroBeauty, gradient: "from-pink-600 to-rose-600" },
  { id: "healthcare", title: "Salute & Cliniche", desc: "Pazienti · Telemedicina", icon: <Heart className="w-4 h-4" />, color: "#0ea5e9", image: sectorHeroHealthcare, gradient: "from-sky-500 to-blue-600" },
  { id: "retail", title: "Retail & Negozi", desc: "Inventario · POS · E-commerce", icon: <Store className="w-4 h-4" />, color: "#8b5cf6", image: sectorHeroRetail, gradient: "from-violet-600 to-purple-600" },
  { id: "fitness", title: "Fitness & Palestre", desc: "Classi · Abbonamenti · Check-in", icon: <Dumbbell className="w-4 h-4" />, color: "#f97316", image: sectorHeroFitness, gradient: "from-orange-500 to-amber-600" },
  { id: "hospitality", title: "Hotel & Ospitalità", desc: "Camere · Booking · Revenue", icon: <Building className="w-4 h-4" />, color: "#10b981", image: sectorHeroHotel, gradient: "from-emerald-600 to-teal-600" },
  { id: "beach", title: "Stabilimenti Balneari", desc: "Ombrelloni · Lettini · Stagionali", icon: <Waves className="w-4 h-4" />, color: "#06b6d4", image: sectorHeroBeach, gradient: "from-cyan-500 to-blue-500" },
];

const EXTRA_SECTORS = [
  { title: "Artigiani & Impiantisti", icon: <Wrench className="w-4 h-4" />, gradient: "from-blue-600 to-indigo-600" },
  { title: "Studi Creativi", icon: <Camera className="w-4 h-4" />, gradient: "from-purple-600 to-violet-600" },
  { title: "Formazione & Coaching", icon: <GraduationCap className="w-4 h-4" />, gradient: "from-cyan-600 to-blue-600" },
  { title: "Giardinaggio & Vivaisti", icon: <Leaf className="w-4 h-4" />, gradient: "from-green-600 to-emerald-600" },
];

export default function LandingSectors() {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const active = SECTORS[activeIdx];

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="industries" className="relative py-20 sm:py-28 px-5 overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(228 22% 8%) 0%, hsl(230 24% 10%) 35%, hsl(232 22% 9%) 65%, hsl(228 22% 8%) 100%)" }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[4%] left-[8%] w-[500px] h-[500px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, hsla(265,70%,55%,0.6), transparent 65%)", filter: "blur(150px)" }} />
        <div className="absolute top-[30%] right-[5%] w-[450px] h-[450px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, hsla(155,55%,42%,0.5), transparent 65%)", filter: "blur(140px)" }} />
      </div>

      <div className="max-w-[1100px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <motion.div className="inline-flex items-center gap-2.5 mb-5 px-5 py-2.5 rounded-2xl" style={{ background: "hsla(var(--primary) / 0.1)", border: "1px solid hsla(var(--primary) / 0.15)" }} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--empire-violet)))" }}>
              <Globe className="w-3 h-3 text-white" />
            </div>
            <span className="text-[0.65rem] font-heading font-bold tracking-[2.5px] uppercase text-white/90">Multi-Settore</span>
          </motion.div>
          <motion.h2 className="text-[clamp(1.6rem,4.5vw,3.2rem)] font-heading font-bold text-white leading-[1.08] mb-4" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Qualsiasi Settore. <span className="text-shimmer">Un Unico Sistema.</span>
          </motion.h2>
          <motion.p className="text-foreground/50 max-w-[550px] mx-auto leading-[1.7] text-sm" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Empire si adatta automaticamente alla tua industria. Terminologia, moduli, dashboard e flussi operativi cambiano in base al settore.
          </motion.p>
        </div>

        {/* Sector pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {SECTORS.map((s, i) => (
            <motion.button key={s.id} onClick={() => setActiveIdx(i)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-semibold transition-all border ${i === activeIdx ? "border-primary/40 bg-primary/10 text-white" : "border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/10"}`} style={i === activeIdx ? { boxShadow: `0 0 20px ${s.color}20` } : undefined} whileTap={{ scale: 0.95 }}>
              {s.icon}
              <span className="hidden sm:inline">{s.title}</span>
              <span className="sm:hidden">{s.title.split(" ")[0]}</span>
            </motion.button>
          ))}
          <motion.button onClick={() => setSheetOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-semibold border border-dashed border-white/[0.08] text-white/25 hover:text-white/40 hover:border-white/15 transition-all" whileTap={{ scale: 0.95 }}>
            <Sparkles className="w-3.5 h-3.5" /> +18 altri
          </motion.button>
        </div>

        {/* Active sector showcase */}
        <AnimatePresence mode="wait">
          <motion.div key={active.id} className="relative rounded-3xl overflow-hidden border border-white/[0.06]" style={{ background: "linear-gradient(160deg, hsl(228 20% 14% / 0.92), hsl(232 22% 12% / 0.88))" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${active.color}40, transparent)` }} />
            <div className="grid sm:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative aspect-[4/3] sm:aspect-auto overflow-hidden">
                <img src={active.image} alt={active.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${active.color}15, transparent 60%)` }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent, hsla(228,20%,12%,0.7))" }} />
              </div>
              {/* Content */}
              <div className="p-6 sm:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${active.color}15`, color: active.color }}>
                    {active.icon}
                  </div>
                  <span className="text-[0.5rem] px-2 py-1 rounded-full font-bold tracking-wider uppercase" style={{ background: `${active.color}20`, color: active.color }}>Live Demo</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2">{active.title}</h3>
                <p className="text-sm text-foreground/40 leading-relaxed mb-6">{active.desc}. App dedicata con AI, dashboard gestionale e agenti inclusi.</p>
                <motion.button
                  onClick={() => {
                    const slug = DEMO_SLUGS[active.id as keyof typeof DEMO_SLUGS];
                    navigate(active.id === "food" ? `/r/${slug}` : `/demo/${slug}`);
                  }}
                  className="self-start px-6 py-3 rounded-xl text-xs font-heading font-bold tracking-wider uppercase text-white flex items-center gap-2"
                  style={{ background: active.color, boxShadow: `0 4px 20px ${active.color}30` }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Scopri il Piano <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <motion.button onClick={() => scrollTo("pricing")} className="group px-7 py-3.5 rounded-2xl bg-vibrant-gradient text-primary-foreground font-bold text-sm tracking-wider uppercase flex items-center gap-2" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            Inizia Ora <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button onClick={() => navigate("/demo")} className="px-7 py-3.5 rounded-2xl text-foreground/60 text-sm font-semibold tracking-wide flex items-center gap-2 hover:text-foreground transition-colors" style={{ border: "1px solid hsla(var(--border) / 0.4)", background: "hsla(228,20%,14%,0.85)" }}>
            <Play className="w-4 h-4 text-primary/60" /> Prova Tutte le Demo
          </motion.button>
        </motion.div>
      </div>

      {/* Sector Sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheetOpen(false)} />
            <motion.div className="fixed z-50 inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-[420px] sm:max-h-[85vh]" style={{ maxHeight: "85vh" }} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30 }}>
              <div className="sm:relative sm:-translate-x-1/2 sm:-translate-y-1/2 rounded-t-[28px] sm:rounded-[28px] overflow-hidden border border-foreground/10" style={{ background: "hsla(260,20%,6%,0.97)", backdropFilter: "blur(40px)" }}>
                <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1 rounded-full bg-white/15" /></div>
                <div className="px-6 pt-4 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-foreground text-sm">Tutti i Settori</h3>
                    <p className="text-[0.6rem] text-foreground/30 mt-0.5">25+ industrie supportate</p>
                  </div>
                  <motion.button onClick={() => setSheetOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "hsla(0,0%,100%,0.06)" }} whileHover={{ scale: 1.1 }}><X className="w-3.5 h-3.5 text-foreground/50" /></motion.button>
                </div>
                <div className="overflow-y-auto px-4 py-4 space-y-2" style={{ maxHeight: "60vh" }}>
                  {SECTORS.map((s, i) => {
                    const slug = DEMO_SLUGS[s.id as keyof typeof DEMO_SLUGS];
                    const path = s.id === "food" ? `/r/${slug}` : `/demo/${slug}`;
                    return (
                      <motion.div key={i} className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer" style={{ background: "hsla(0,0%,100%,0.02)", border: "1px solid hsla(0,0%,100%,0.04)" }} whileHover={{ background: "hsla(265,70%,60%,0.06)", scale: 1.01 }} onClick={() => { setSheetOpen(false); navigate(path); }}>
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white`}>{s.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-heading font-bold text-foreground truncate">{s.title}</p>
                          <p className="text-[0.6rem] text-foreground/30 truncate">{s.desc}</p>
                        </div>
                        <ArrowRight className="w-3 h-3 text-primary/40 flex-shrink-0" />
                      </motion.div>
                    );
                  })}
                  <div className="py-2"><div className="h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(265,70%,60%,0.12), transparent)" }} /></div>
                  <p className="text-[0.55rem] font-heading font-bold text-foreground/25 tracking-[3px] uppercase px-2 mb-2">In Arrivo</p>
                  {EXTRA_SECTORS.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "hsla(0,0%,100%,0.01)", border: "1px solid hsla(0,0%,100%,0.03)" }}>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white opacity-70`}>{s.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-heading font-bold text-foreground/60 truncate">{s.title}</p>
                      </div>
                      <span className="text-[0.5rem] text-foreground/15 tracking-wider uppercase">Presto</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
