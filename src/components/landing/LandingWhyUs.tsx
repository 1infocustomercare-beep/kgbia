import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const RESULTS = [
  { value: "847+", label: "Business Trasformati" },
  { value: "3.2M", label: "Operazioni Automatizzate" },
  { value: "94h", label: "Ore Risparmiate / Mese" },
  { value: "+40%", label: "Revenue Medio" },
];

const BEFORE_AFTER = [
  { title: "Gestione Ordini", badge: "-93%", before: "45 min manuali/giorno", after: "3 min — automatico" },
  { title: "Reputazione Online", badge: "-100%", before: "12 negative/mese", after: "0 — intercettate dall'IA" },
  { title: "Clienti Persi", badge: "-94%", before: "34% abbandono", after: "2% con retention AI" },
  { title: "Revenue Digitali", badge: "+∞", before: "€0 automazioni", after: "+€2.400/mese", isTeal: true },
  { title: "Fatturazione", badge: "-100%", before: "2 ore/giorno", after: "Completamente automatica" },
  { title: "Marketing", badge: "∞", before: "Manuale, costoso", after: "AI Content Engine 24/7", isTeal: true },
];

function WordReveal({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const start = window.innerHeight * 0.8;
      const end = window.innerHeight * 0.2;
      const p = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const words = text.split(" ");
  return (
    <p ref={ref} className="font-heading text-[clamp(1.3rem,2.6vw,1.9rem)] font-semibold leading-[1.65] max-w-[880px] mx-auto text-center">
      {words.map((w, i) => (
        <span key={i} className="transition-opacity duration-300" style={{ opacity: progress > i / words.length ? 1 : 0.12 }}>
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

export default function LandingWhyUs() {
  return (
    <>
      <section className="py-20 lg:py-28 px-5 lg:px-10" style={{ background: "#020204" }}>
        <div className="max-w-[1320px] mx-auto">
          <WordReveal text="Mentre i tuoi competitor perdono clienti, noi costruiamo il tuo vantaggio competitivo. Un ecosistema di 98 agenti IA autonomi, dashboard predittive, CRM intelligente e automazioni multi-canale che lavora 24/7 — generando fatturato e fidelizzando clienti." />
          <div className="flex gap-3 justify-center flex-wrap mt-8">
            {["98+ Agenti IA", "Dashboard Predittive", "Automazioni 24/7", "White-Label"].map((p) => (
              <span key={p} className="text-xs text-white/55 px-4 py-2 rounded-full border border-white/[0.07]">{p}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 border-y border-white/[0.07]" style={{ background: "#080810" }}>
        <div className="max-w-[1320px] mx-auto px-5">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-5">
              <span className="w-5 h-[1.5px] bg-[#7eb7be]" />RISULTATI REALI
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-white">
              I Numeri <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">Parlano</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {RESULTS.map((r, i) => (
              <motion.div key={r.label} className="text-center py-6 px-4 rounded-2xl border border-white/[0.07] hover:-translate-y-1 transition-all"
                style={{ background: "#0d0d1a" }}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}>
                <div className="font-heading text-[2rem] font-extrabold bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">{r.value}</div>
                <p className="text-xs text-white/55 mt-1">{r.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-8">
            {BEFORE_AFTER.map((b, i) => (
              <motion.div key={b.title} className="rounded-2xl border border-white/[0.07] p-5 hover:-translate-y-1 transition-all"
                style={{ background: "#0d0d1a" }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}>
                <h4 className="text-[13px] font-heading font-bold mb-3 flex items-center gap-2 flex-wrap text-white">
                  {b.title}
                  <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${b.isTeal ? "bg-[rgba(126,183,190,0.12)] text-[#7eb7be]" : "bg-[rgba(34,197,94,0.1)] text-green-500"}`}>{b.badge}</span>
                </h4>
                <div className="flex justify-between py-1.5 border-b border-white/[0.07] text-xs">
                  <span className="text-white/55 font-semibold">Prima</span>
                  <span className="text-red-400/60 line-through font-semibold">{b.before}</span>
                </div>
                <div className="flex justify-between py-1.5 text-xs">
                  <span className="text-white/55 font-semibold">Dopo</span>
                  <span className="text-green-500 font-semibold">{b.after}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center py-8 px-6 rounded-3xl border border-white/[0.07]"
            style={{ background: "linear-gradient(135deg, rgba(126,183,190,0.12), rgba(108,60,224,0.12))" }}>
            <h3 className="text-lg font-heading font-bold mb-1 text-white">Garanzia Risultati 90 Giorni</h3>
            <p className="text-white/55 text-[13px] max-w-[550px] mx-auto">
              Se non vedi miglioramenti misurabili nei primi 90 giorni, rimborso integrale. Zero rischi.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
