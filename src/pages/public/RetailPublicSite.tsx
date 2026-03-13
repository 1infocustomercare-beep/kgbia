import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Star, Phone, Mail, MapPin, Clock, ShoppingBag,
  Heart, Truck, Shield, ArrowRight, MessageCircle,
  CreditCard, Award, RefreshCw, Package
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

function Section({ id, children, className = "", style }: { id?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id={id} ref={ref} className={className} style={style}>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
        {children}
      </motion.div>
    </section>
  );
}

interface Props { company: any; }

export default function RetailPublicSite({ company }: Props) {
  const accent = company.primary_color || "#000000";
  const companyId = company.id;

  const { data: contentBlocks = [] } = useQuery({
    queryKey: ["retail-pub-content", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("content_blocks").select("*").eq("company_id", companyId);
      return data || [];
    },
  });

  const [email, setEmail] = useState("");

  const handleNewsletter = async () => {
    if (!email) return;
    await supabase.from("leads").insert({ company_id: companyId, name: email.split("@")[0], email, source: "newsletter" });
    toast.success("Iscritto alla newsletter!");
    setEmail("");
  };

  const name = company.name || "Store";
  const tagline = company.tagline || "Shopping Premium";
  const phone = company.phone;
  const whatsapp = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "#";

  const categories = [
    { name: "Nuovi Arrivi", img: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600", count: 24 },
    { name: "Best Seller", img: "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=600", count: 18 },
    { name: "Saldi", img: "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=600", count: 12, sale: true },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", color: "#111" }}>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
            {company.logo_url && <img src={company.logo_url} alt={name} className="h-10 w-10 rounded-full object-cover" />}
            <span className="text-xl font-bold tracking-tight">{name}</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Collezioni", "Chi Siamo", "Negozio", "Contatti"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-gray-500 hover:text-black transition">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="#negozio"><Button size="sm" className="text-white" style={{ background: accent }}>Shop Now</Button></a>
          </div>
        </div>
      </nav>

      {/* HERO - Slideshow style */}
      <section className="relative min-h-[85vh] flex items-center pt-20" style={{ background: "#f8f8f8" }}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-6 text-xs uppercase tracking-widest" style={{ background: `${accent}15`, color: accent }}>Nuova Collezione</Badge>
            <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6">{tagline}</h1>
            <p className="text-lg text-gray-500 mb-8">Scopri le ultime novità selezionate per te. Qualità premium, stile inconfondibile.</p>
            <div className="flex gap-4">
              <a href="#negozio"><Button className="px-8 py-6 text-lg text-white" style={{ background: accent }}>Esplora <ArrowRight className="ml-2 w-5 h-5" /></Button></a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
            <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[3/4]">
              <img src="https://images.pexels.com/photos/1148957/pexels-photo-1148957.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Fashion" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits bar */}
      <div className="py-6 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, text: "Spedizione Gratuita" },
            { icon: RefreshCw, text: "Reso Facile 30gg" },
            { icon: Shield, text: "Pagamento Sicuro" },
            { icon: CreditCard, text: "3 Rate Senza Interessi" },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
              <Icon className="w-5 h-5 shrink-0" style={{ color: accent }} /> {text}
            </div>
          ))}
        </div>
      </div>

      {/* COLLECTIONS */}
      <Section id="negozio" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Le Nostre Collezioni</h2>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer aspect-[3/4]">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-end p-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{cat.name}</h3>
                      <p className="text-white/70 text-sm">{cat.count} prodotti</p>
                      {cat.sale && <Badge className="mt-2" style={{ background: "#E74C3C", color: "#fff" }}>Fino al -50%</Badge>}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* STORE INFO */}
      <Section id="contatti" className="py-20" style={{ background: "#f8f8f8" } as any}>
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Il Nostro Negozio</h2>
            <div className="space-y-4 text-gray-600">
              {company.address && <div className="flex items-start gap-3"><MapPin className="w-5 h-5 mt-0.5 shrink-0" style={{ color: accent }} /><span>{company.address}{company.city ? `, ${company.city}` : ""}</span></div>}
              {phone && <div className="flex items-center gap-3"><Phone className="w-5 h-5 shrink-0" style={{ color: accent }} /><a href={`tel:${phone}`}>{phone}</a></div>}
              {company.email && <div className="flex items-center gap-3"><Mail className="w-5 h-5 shrink-0" style={{ color: accent }} /><a href={`mailto:${company.email}`}>{company.email}</a></div>}
              <div className="flex items-center gap-3"><Clock className="w-5 h-5 shrink-0" style={{ color: accent }} /><span>Lun-Sab 10:00-20:00 | Dom 10:00-13:00</span></div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Iscriviti alla Newsletter</h3>
            <p className="text-gray-500 mb-4 text-sm">Ricevi offerte esclusive e anticipazioni sulle nuove collezioni.</p>
            <div className="flex gap-2">
              <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="La tua email" className="flex-1" />
              <Button onClick={handleNewsletter} className="text-white" style={{ background: accent }}>Iscriviti</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
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
