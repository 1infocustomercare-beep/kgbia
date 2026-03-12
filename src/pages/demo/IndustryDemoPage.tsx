import { useState, useMemo, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_INDUSTRY_DATA, DEMO_SLUGS, type DemoService } from "@/data/demo-industries";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Star, Phone, Mail, MapPin, Clock, ArrowLeft, Shield, Zap,
  Heart, Award, Users, Sparkles, ChevronRight, Send, CheckCircle,
  Menu as MenuIcon, X, Leaf, Camera, Truck, GraduationCap,
  Calendar, Globe, Package, Coffee, Sun, Waves, Baby, BookOpen,
  Settings, TrendingUp, Calculator, Palette, Image, Monitor,
  Wrench, FileText, HardHat, Bike, Wine, Stethoscope, Dumbbell
} from "lucide-react";

// Icon resolver
const ICON_MAP: Record<string, any> = {
  Shield, Zap, Heart, Award, Users, Sparkles, Star, Clock,
  Leaf, Camera, Truck, GraduationCap, Calendar, Globe, Package,
  Coffee, Sun, Waves, Baby, BookOpen, Settings, TrendingUp,
  Calculator, Palette, Image, Monitor, Wrench, FileText, HardHat,
  Bike, Wine, Stethoscope, Dumbbell, Phone, Mail, MapPin, Send,
  ChefHat: Star, // fallback
};

function resolveIcon(name: string) {
  return ICON_MAP[name] || Star;
}

export default function IndustryDemoPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Try to load from DB first
  const { data: company } = useQuery({
    queryKey: ["demo-company", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data } = await supabase
        .from("companies")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      return data as any;
    },
    enabled: !!slug,
  });

  // Resolve industry - from DB or from slug mapping
  const resolvedIndustry: IndustryId = useMemo(() => {
    if (company?.industry) return company.industry as IndustryId;
    // Find by slug in demo slugs
    for (const [ind, s] of Object.entries(DEMO_SLUGS)) {
      if (s === slug) return ind as IndustryId;
    }
    return "custom";
  }, [company, slug]);

  const industryConfig = INDUSTRY_CONFIGS[resolvedIndustry];
  const demoData = DEMO_INDUSTRY_DATA[resolvedIndustry];
  const companyName = company?.name || demoData.companyName;
  const primaryColor = company?.primary_color || industryConfig.defaultPrimaryColor;
  const tagline = company?.tagline || demoData.tagline;

  // Group services by category
  const categories = useMemo(() => {
    const cats: string[] = [];
    demoData.services.forEach(s => {
      if (!cats.includes(s.category)) cats.push(s.category);
    });
    return cats;
  }, [demoData]);

  const [activeCat, setActiveCat] = useState("");
  const effectiveCat = activeCat || categories[0] || "";
  const filteredServices = useMemo(
    () => demoData.services.filter(s => s.category === effectiveCat),
    [demoData, effectiveCat]
  );
  const popularServices = useMemo(
    () => demoData.services.filter(s => s.popular),
    [demoData]
  );

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("Inserisci nome e telefono");
      return;
    }
    setBookingSubmitted(true);
    toast.success("Richiesta inviata con successo!");
    setFormData({});
    setTimeout(() => setBookingSubmitted(false), 5000);
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "services", label: industryConfig.terminology.items || "Servizi" },
    { id: "reviews", label: "Recensioni" },
    { id: "booking", label: demoData.bookingLabel },
    { id: "contact", label: "Contatti" },
  ];

  const fieldLabels: Record<string, string> = {
    name: "Nome *",
    phone: "Telefono *",
    email: "Email",
    date: "Data",
    time: "Ora",
    guests: "Ospiti",
    service: "Servizio",
    pickup: "Punto di Partenza",
    dropoff: "Destinazione",
    address: "Indirizzo",
    passengers: "Passeggeri",
    notes: "Note aggiuntive",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* ═══ NAV BAR ═══ */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/home")} className="mr-2 p-1.5 rounded-lg hover:bg-white/10 transition">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-lg">{industryConfig.emoji}</span>
            <span className="font-bold text-sm truncate max-w-[150px] sm:max-w-none">{companyName}</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeSection === l.id ? "bg-white/15 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="md:hidden overflow-hidden bg-slate-900 border-t border-white/5">
              {navLinks.map(l => (
                <button key={l.id} onClick={() => scrollTo(l.id)}
                  className="block w-full text-left px-6 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
                >
                  {l.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="home" className="relative pt-14">
        <div className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${primaryColor}22 0%, #0f172a 50%, ${primaryColor}11 100%)` }}
        >
          {/* Decorative circles */}
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-10"
            style={{ background: `radial-gradient(circle, ${primaryColor}, transparent)` }} />
          <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full opacity-5"
            style={{ background: `radial-gradient(circle, ${primaryColor}, transparent)` }} />

          <div className="relative text-center px-6 py-16 max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="text-5xl sm:text-6xl block mb-4">{industryConfig.emoji}</span>
              <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">{demoData.heroTitle}</h1>
              <p className="text-base sm:text-lg text-white/60 mb-6 max-w-md mx-auto">{demoData.heroSubtitle}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => scrollTo("services")} size="lg"
                  className="h-12 min-h-[44px] px-8 font-semibold rounded-xl text-black"
                  style={{ backgroundColor: primaryColor }}
                >
                  {demoData.ctaLabel} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <Button onClick={() => scrollTo("booking")} size="lg" variant="outline"
                  className="h-12 min-h-[44px] px-8 rounded-xl border-white/20 text-white hover:bg-white/10"
                >
                  {demoData.bookingLabel}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES STRIP ═══ */}
      <section className="border-y border-white/5 bg-slate-900/50">
        <div className="max-w-5xl mx-auto py-8 px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {demoData.features.map((f, i) => {
            const Icon = resolveIcon(f.icon);
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: primaryColor }} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">{f.label}</h3>
                  <p className="text-xs text-white/50 mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══ POPULAR / HIGHLIGHTS ═══ */}
      {popularServices.length > 0 && (
        <section className="max-w-5xl mx-auto py-12 px-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">
            ⭐ {resolvedIndustry === "food" ? "I Più Amati" : "I Più Richiesti"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularServices.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} viewport={{ once: true }}
              >
                <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-all hover:scale-[1.02] cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{s.emoji || "📌"}</span>
                          <h3 className="font-semibold text-sm text-white truncate">{s.name}</h3>
                        </div>
                        <p className="text-xs text-white/50 line-clamp-2">{s.description}</p>
                        {s.duration && <p className="text-[10px] text-white/40 mt-1">⏱ {s.duration}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-sm" style={{ color: primaryColor }}>
                          {s.price === 0 ? "Gratis" : `€${s.price.toLocaleString("it-IT")}`}
                        </span>
                        {s.duration?.startsWith("/") && (
                          <span className="text-[10px] text-white/40 block">{s.duration}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ FULL SERVICE LIST ═══ */}
      <section id="services" className="max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">
          {industryConfig.terminology.items || "I Nostri Servizi"}
        </h2>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition min-h-[36px] ${
                effectiveCat === cat
                  ? "text-black"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
              style={effectiveCat === cat ? { backgroundColor: primaryColor } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Service cards */}
        <div className="space-y-3">
          {filteredServices.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }} viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition">
                <span className="text-2xl shrink-0">{s.emoji || "📋"}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-white">{s.name}</h3>
                  <p className="text-xs text-white/50 mt-0.5">{s.description}</p>
                  {s.duration && !s.duration.startsWith("/") && (
                    <p className="text-[10px] text-white/40 mt-0.5">⏱ {s.duration}</p>
                  )}
                </div>
                <span className="font-bold text-sm shrink-0" style={{ color: primaryColor }}>
                  {s.price === 0 ? "Gratis" : `€${s.price.toLocaleString("it-IT")}`}
                  {s.duration?.startsWith("/") && <span className="text-[10px] text-white/40">{s.duration}</span>}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ REVIEWS ═══ */}
      <section id="reviews" className="bg-slate-900/30 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">⭐ Cosa Dicono di Noi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {demoData.reviews.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              >
                <Card className="bg-white/5 border-white/10 h-full">
                  <CardContent className="p-4">
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(r.rating)].map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-white/70 mb-3 italic">"{r.comment}"</p>
                    <p className="text-xs font-semibold text-white/90">— {r.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOOKING FORM ═══ */}
      <section id="booking" className="max-w-2xl mx-auto py-12 px-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">{demoData.bookingLabel}</h2>
        <p className="text-sm text-white/50 text-center mb-8">Compila il form e ti ricontattiamo noi</p>

        {bookingSubmitted ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: primaryColor }} />
            <h3 className="text-xl font-bold mb-2">Richiesta Inviata!</h3>
            <p className="text-sm text-white/50">Ti ricontatteremo al più presto.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {demoData.bookingFields.map(field => (
                <div key={field} className={field === "notes" ? "sm:col-span-2" : ""}>
                  <label className="text-xs text-white/50 mb-1.5 block">{fieldLabels[field] || field}</label>
                  {field === "notes" ? (
                    <Textarea
                      value={formData[field] || ""}
                      onChange={e => setFormData(p => ({ ...p, [field]: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[80px]"
                      placeholder="Inserisci eventuali note..."
                    />
                  ) : field === "service" ? (
                    <select
                      value={formData[field] || ""}
                      onChange={e => setFormData(p => ({ ...p, [field]: e.target.value }))}
                      className="w-full h-11 min-h-[44px] rounded-md bg-white/5 border border-white/10 text-white text-sm px-3"
                    >
                      <option value="">Seleziona...</option>
                      {demoData.services.map((s, i) => (
                        <option key={i} value={s.name} className="bg-slate-900">{s.name}</option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type={field === "date" ? "date" : field === "time" ? "time" : field === "email" ? "email" : field === "phone" ? "tel" : field === "guests" || field === "passengers" ? "number" : "text"}
                      value={formData[field] || ""}
                      onChange={e => setFormData(p => ({ ...p, [field]: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 min-h-[44px]"
                      placeholder={fieldLabels[field]?.replace(" *", "") || field}
                      min={field === "guests" || field === "passengers" ? "1" : undefined}
                    />
                  )}
                </div>
              ))}
            </div>
            <Button type="submit" size="lg"
              className="w-full h-12 min-h-[44px] rounded-xl font-semibold text-black"
              style={{ backgroundColor: primaryColor }}
            >
              <Send className="w-4 h-4 mr-2" /> Invia Richiesta
            </Button>
          </form>
        )}
      </section>

      {/* ═══ CONTACT / INFO ═══ */}
      <section id="contact" className="bg-slate-900/50 py-12 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">📍 Contatti & Orari</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 shrink-0" style={{ color: primaryColor }} />
                <div>
                  <p className="text-sm font-medium">{demoData.address}</p>
                  <p className="text-xs text-white/50">{demoData.city}</p>
                </div>
              </div>
              <a href={`tel:${demoData.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:opacity-80 transition">
                <Phone className="w-5 h-5 shrink-0" style={{ color: primaryColor }} />
                <span className="text-sm">{demoData.phone}</span>
              </a>
              <a href={`mailto:${demoData.email}`} className="flex items-center gap-3 hover:opacity-80 transition">
                <Mail className="w-5 h-5 shrink-0" style={{ color: primaryColor }} />
                <span className="text-sm">{demoData.email}</span>
              </a>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: primaryColor }} /> Orari
              </h3>
              <div className="space-y-2">
                {demoData.hours.map((h, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-white/60">{h.day}</span>
                    <span className="font-medium">{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/5 py-8 text-center">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">{industryConfig.emoji}</span>
            <span className="font-bold">{companyName}</span>
          </div>
          <p className="text-xs text-white/40 mb-4">{tagline}</p>
          <div className="flex items-center justify-center gap-1 text-[10px] text-white/30">
            <span>Powered by</span>
            <span className="font-semibold text-amber-400/60">Empire Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
