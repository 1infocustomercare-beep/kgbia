import { useState, useRef, useEffect, forwardRef } from "react";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Star, Phone, Mail, MapPin, Clock, Calendar,
  Heart, Cake, CookingPot, Wheat, Award,
  MessageCircle, AlertTriangle, ShoppingBag, Sparkles,
  ChevronDown, Menu, X
} from "lucide-react";
import { HeroVideoBackground } from "@/components/public/HeroVideoBackground";
import fallbackHeroVideo from "@/assets/video-hero-empire.mp4";
import bakeryHeroPoster from "@/assets/bakery-croissant.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const Section = forwardRef<HTMLElement, { id?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }>(
  ({ id, children, className = "", style }, _ref) => {
    const localRef = useRef(null);
    const isInView = useInView(localRef, { once: true, margin: "-60px" });
    return (
      <section id={id} ref={localRef} className={className} style={style}>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          {children}
        </motion.div>
      </section>
    );
  }
);
Section.displayName = "Section";

interface Props { company: any; }

export default function BakeryPublicSite({ company }: Props) {
  const brown = "#6B3A2A";
  const creamBg = "#F5E6CC";
  const pink = "#E8B4B8";
  const companyId = company.id;

  // Try loading from content_blocks for products
  const { data: contentBlocks = [] } = useQuery({
    queryKey: ["bakery-pub-content", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("content_blocks").select("*").eq("company_id", companyId);
      return data || [];
    },
  });

  const [form, setForm] = useState({ name: "", phone: "", product: "", date: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.product) { toast.error("Compila i campi obbligatori"); return; }
    setSubmitting(true);
    try {
      await supabase.from("leads").insert({ company_id: companyId, name: form.name, phone: form.phone, source: "website", notes: `Pre-ordine: ${form.product}, Ritiro: ${form.date}, Note: ${form.notes}` });
      toast.success("Pre-ordine ricevuto! Ti contatteremo per conferma.");
      setForm({ name: "", phone: "", product: "", date: "", notes: "" });
    } catch { toast.error("Errore, riprova."); }
    setSubmitting(false);
  };

  const name = company.name || "Panificio Artigianale";
  const tagline = company.tagline || "Fatto con Amore Ogni Giorno";
  const phone = company.phone;
  const whatsapp = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "#";

  const products = [
    { name: "Croissant al Burro", price: "1.80", img: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=600", tag: "Classico" },
    { name: "Pane di Campagna", price: "4.50", img: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600", tag: "Lievito Madre" },
    { name: "Torta della Nonna", price: "22.00", img: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600", tag: "Su ordinazione", preorder: true },
    { name: "Focaccia Genovese", price: "3.50", img: "https://images.pexels.com/photos/1387070/pexels-photo-1387070.jpeg?auto=compress&cs=tinysrgb&w=600", tag: "Tradizionale" },
    { name: "Cannoli Siciliani", price: "3.00", img: "https://images.pexels.com/photos/6163263/pexels-photo-6163263.jpeg?auto=compress&cs=tinysrgb&w=600", tag: "Dolce" },
    { name: "Biscotti Artigianali", price: "8.00/kg", img: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=600", tag: "Assortiti" },
  ];

  const allergenIcons = ["🌾 Glutine", "🥚 Uova", "🥛 Latte", "🥜 Frutta a guscio", "🫘 Soia"];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => { const fn = () => setNavScrolled(window.scrollY > 40); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);

  const HERO_VIDEO = "https://videos.pexels.com/video-files/3191572/3191572-uhd_2560_1440_25fps.mp4";
  const tickerItems = ["Pane Fresco", "Cornetti", "Focaccia", "Torte Artigianali", "Lievito Madre", "Farine Bio", "Biscotti", "Dolci Tipici", "Pizza al Taglio", "Cannoli"];
  const navLinks = ["Vetrina", "Chi Siamo", "Pre-ordina", "Contatti"];

  return (
    <div style={{ fontFamily: "'Dancing Script', cursive", background: creamBg, color: brown }}>
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&family=Nunito:wght@300;400;600;700&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navScrolled ? "shadow-lg" : ""}`} style={{ background: `${creamBg}F5`, backdropFilter: "blur(20px)", borderBottom: `2px solid ${brown}15` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
            {company.logo_url ? <motion.img src={company.logo_url} alt={name} className="h-10 w-10 rounded-full object-cover" whileHover={{ scale: 1.1 }} /> :
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${pink}20` }}><Wheat className="w-5 h-5" style={{ color: brown }} /></div>}
            <div className="min-w-0">
              <span className="text-xl font-bold truncate block" style={{ color: brown }}>{name}</span>
              <span className="text-[9px] tracking-[0.2em] uppercase block font-semibold" style={{ color: pink, fontFamily: "'Nunito', sans-serif" }}>PANIFICIO ARTIGIANALE</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="text-sm tracking-wider font-medium hover:opacity-100 opacity-60 transition" style={{ color: brown, fontFamily: "'Nunito', sans-serif" }}>{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {phone && <Button size="sm" className="hidden sm:flex gap-2 rounded-full font-bold text-xs h-10 px-5" style={{ background: brown, color: creamBg, fontFamily: "'Nunito', sans-serif" }} asChild>
              <a href={`tel:${phone}`}><Phone className="w-3.5 h-3.5" /> CHIAMA</a>
            </Button>}
            <button className="md:hidden p-2 rounded-xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ background: creamBg, borderTop: `1px solid ${brown}15` }}>
              <div className="px-5 py-4 space-y-1">
                {navLinks.map(item => <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm border-b" style={{ borderColor: `${brown}10`, color: brown, fontFamily: "'Nunito', sans-serif" }}>{item}</a>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO — video bg + text reveal */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center overflow-hidden">
        <HeroVideoBackground
          primarySrc={HERO_VIDEO}
          fallbackSrc={fallbackHeroVideo}
          poster={bakeryHeroPoster}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.5) saturate(1.04)" }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${brown}70 0%, ${brown}8A 60%, ${brown}B3 100%)` }} />
        <div className="absolute inset-0 opacity-[0.09]" style={{ backgroundImage: `radial-gradient(circle, ${creamBg}80 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

        <motion.div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white pt-20" style={{ y: heroY }}>
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium"
              style={{ background: `${creamBg}15`, border: `1px solid ${creamBg}30`, color: creamBg, fontFamily: "'Nunito', sans-serif" }}>
              <Sparkles className="w-4 h-4" /> Panificio Artigianale
            </motion.div>
            <motion.div variants={fadeUp} custom={1}>
              <Wheat className="w-10 h-10 mx-auto mb-4" style={{ color: creamBg }} />
            </motion.div>
            <motion.h1 variants={fadeUp} custom={2} className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-5 leading-[1.05]">
              {tagline.split("").map((char, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 30, rotateX: -90 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.6 + i * 0.03, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: "inline-block", color: i % 5 === 0 ? pink : creamBg }}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p variants={fadeUp} custom={3} className="text-lg sm:text-xl opacity-70 mb-10" style={{ fontFamily: "'Nunito', sans-serif", color: creamBg }}>Tradizione artigianale dal {company.founded_year || 1985}</motion.p>
            <motion.div variants={fadeUp} custom={4} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#vetrina"><Button className="px-10 h-14 text-base font-semibold rounded-xl shadow-2xl" style={{ background: creamBg, color: brown, fontFamily: "'Nunito', sans-serif", boxShadow: `0 20px 60px -15px rgba(0,0,0,0.4)` }}>Scopri i Prodotti</Button></a>
              <a href="#preordina"><Button variant="outline" className="px-10 h-14 text-base rounded-xl hover:bg-white/10" style={{ borderColor: `${creamBg}50`, color: creamBg, fontFamily: "'Nunito', sans-serif" }}>Pre-ordina una Torta</Button></a>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5" style={{ color: `${creamBg}50` }} />
        </motion.div>
      </section>

      {/* TICKER */}
      <div className="overflow-hidden py-4" style={{ background: brown }}>
        <motion.div className="flex gap-8 whitespace-nowrap" animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 18, ease: "linear" }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-medium" style={{ color: `${creamBg}40`, fontFamily: "'Nunito', sans-serif" }}>
              <Wheat className="w-3 h-3" style={{ color: `${pink}60` }} /> {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* VETRINA */}
      <Section id="vetrina" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <Cake className="w-8 h-8 mx-auto mb-3" style={{ color: pink }} />
            <h2 className="text-4xl sm:text-5xl font-bold" style={{ color: brown }}>La Nostra Vetrina</h2>
            <p className="mt-3 text-sm opacity-60" style={{ fontFamily: "'Nunito', sans-serif" }}>Tutto preparato fresco ogni mattina</p>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <Card className="overflow-hidden group shadow-md border-0 hover:shadow-xl transition-shadow">
                  <div className="h-48 overflow-hidden relative">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <Badge className="absolute top-3 left-3 text-xs" style={{ background: p.preorder ? `${pink}` : `${brown}CC`, color: "#fff", fontFamily: "'Nunito', sans-serif" }}>
                      {p.tag}
                    </Badge>
                  </div>
                  <CardContent className="p-5" style={{ background: "#fff" }}>
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold" style={{ color: brown }}>{p.name}</h3>
                      <span className="text-lg font-bold" style={{ color: brown, fontFamily: "'Nunito', sans-serif" }}>€{p.price}</span>
                    </div>
                    {p.preorder && (
                      <a href="#preordina" className="mt-3 inline-flex items-center gap-1 text-sm" style={{ color: pink, fontFamily: "'Nunito', sans-serif" }}>
                        <ShoppingBag className="w-4 h-4" /> Pre-ordina
                      </a>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Allergens notice */}
          <div className="mt-10 p-4 rounded-xl text-center" style={{ background: `${brown}08`, border: `1px solid ${brown}15` }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4" style={{ color: brown }} />
              <p className="text-sm font-semibold" style={{ fontFamily: "'Nunito', sans-serif", color: brown }}>Informazioni Allergeni (Reg. UE 1169/2011)</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {allergenIcons.map(a => <span key={a} className="text-xs px-3 py-1 rounded-full" style={{ background: `${brown}10`, color: brown, fontFamily: "'Nunito', sans-serif" }}>{a}</span>)}
            </div>
            <p className="text-xs mt-2 opacity-50" style={{ fontFamily: "'Nunito', sans-serif" }}>Per la lista completa degli allergeni, chiedi al nostro staff.</p>
          </div>
        </div>
      </Section>

      {/* CHI SIAMO */}
      <Section id="chi-siamo" className="py-20" style={{ background: "#fff" } as any}>
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 className="text-4xl font-bold mb-6" style={{ color: brown }}>La Nostra Storia</h2>
            <p className="text-base leading-relaxed mb-6 opacity-70" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Da generazioni portiamo sulle tavole il profumo del pane appena sfornato. Ogni impasto è curato con ingredienti selezionati, farine macinate a pietra e lievito madre centenario. La nostra passione è la vostra colazione.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Wheat, text: "Farine Bio" },
                { icon: Heart, text: "Fatto a Mano" },
                { icon: Award, text: "Tradizione dal 1985" },
                { icon: CookingPot, text: "Lievito Madre" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-sm" style={{ fontFamily: "'Nunito', sans-serif", color: brown }}>
                  <Icon className="w-4 h-4" style={{ color: pink }} /> {text}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-square">
              <img src="https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Baker" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* PRE-ORDINA */}
      <Section id="preordina" className="py-20 sm:py-28" style={{ background: `${brown}` } as any}>
        <div className="max-w-lg mx-auto px-6 text-center">
          <Cake className="w-10 h-10 mx-auto mb-4" style={{ color: creamBg }} />
          <h2 className="text-4xl font-bold mb-2" style={{ color: creamBg }}>Pre-ordina</h2>
          <p className="text-sm mb-8 opacity-70" style={{ color: creamBg, fontFamily: "'Nunito', sans-serif" }}>Torte, dolci e prodotti speciali su ordinazione</p>
          <Card className="p-6 text-left" style={{ background: `${creamBg}`, border: "none" }}>
            <div className="space-y-4" style={{ fontFamily: "'Nunito', sans-serif" }}>
              <div><label className="text-xs font-semibold uppercase mb-1 block" style={{ color: brown }}>Nome *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Il tuo nome" /></div>
              <div><label className="text-xs font-semibold uppercase mb-1 block" style={{ color: brown }}>Telefono *</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+39..." /></div>
              <div><label className="text-xs font-semibold uppercase mb-1 block" style={{ color: brown }}>Prodotto *</label><Input value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} placeholder="Es: Torta della Nonna per 8 persone" /></div>
              <div><label className="text-xs font-semibold uppercase mb-1 block" style={{ color: brown }}>Data Ritiro</label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              <div><label className="text-xs font-semibold uppercase mb-1 block" style={{ color: brown }}>Note</label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Allergie, decorazioni..." /></div>
            </div>
            <Button onClick={handleOrder} disabled={submitting} className="w-full mt-6 py-5 text-lg font-semibold" style={{ background: brown, color: creamBg }}>
              {submitting ? "Invio..." : "Invia Pre-ordine"}
            </Button>
          </Card>
        </div>
      </Section>

      {/* CONTATTI + FOOTER */}
      <Section id="contatti" className="py-16" style={{ background: "#fff" } as any}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8" style={{ color: brown }}>Vieni a Trovarci</h2>
          <div className="grid sm:grid-cols-3 gap-6 mb-10" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {company.address && <div className="flex flex-col items-center gap-2"><MapPin className="w-6 h-6" style={{ color: pink }} /><p className="text-sm">{company.address}{company.city ? `, ${company.city}` : ""}</p></div>}
            {phone && <div className="flex flex-col items-center gap-2"><Phone className="w-6 h-6" style={{ color: pink }} /><a href={`tel:${phone}`} className="text-sm">{phone}</a></div>}
            <div className="flex flex-col items-center gap-2"><Clock className="w-6 h-6" style={{ color: pink }} /><p className="text-sm">Lun-Sab 6:30 - 20:00</p></div>
          </div>
        </div>
      </Section>

      <AutomationShowcase accentColor={brown} accentBg="bg-amber-800" sectorName="panifici e pasticcerie" darkMode={false} />

      <footer className="py-8 border-t" style={{ borderColor: `${brown}15`, background: creamBg }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-40" style={{ fontFamily: "'Nunito', sans-serif", color: brown }}>
          <p>© {new Date().getFullYear()} {name}. Tutti i diritti riservati.</p>
          <div className="flex gap-4"><a href="/privacy">Privacy</a><a href="/cookie-policy">Cookie</a><span>Powered by Empire</span></div>
        </div>
      </footer>

      {phone && (
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl" style={{ background: "#25D366" }}>
          <MessageCircle className="w-7 h-7 text-white" />
        </a>
      )}
    </div>
  );
}
