import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const RESULTS = [
  { value: "847+", label: "Imprese Digitalizzate" },
  { value: "3.2M", label: "Processi Automatizzati" },
  { value: "94h", label: "Risparmiate al Mese" },
  { value: "+40%", label: "Fatturato Medio" },
];

const BEFORE_AFTER = [
  { title: "Gestione Ordini", badge: "-93%", before: "45 min manuali ogni giorno", after: "3 min — tutto automatico" },
  { title: "Reputazione Online", badge: "0 negative", before: "12 recensioni negative/mese", after: "Intercettate e gestite dall'IA" },
  { title: "Clienti Persi", badge: "-94%", before: "34% tasso di abbandono", after: "Solo 2% con retention AI" },
  { title: "Revenue Digitali", badge: "+€2.400", before: "€0 da canali digitali", after: "+€2.400/mese automatici", isTeal: true },
  { title: "Tempo Fatturazione", badge: "-100%", before: "2 ore al giorno", after: "Fatturazione completamente automatica" },
  { title: "Marketing", badge: "24/7", before: "Costoso e manuale", after: "AI Content Engine genera tutto", isTeal: true },
];

function WordReveal({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const start = window.innerHeight * 0.85;
      const end = window.innerHeight * 0.15;
      const p = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const words = text.split(" ");
  return (
    <p ref={ref} className="font-heading text-[clamp(1.3rem,2.6vw,2rem)] font-semibold leading-[1.6] max-w-[880px] mx-auto text-center">
      {words.map((w, i) => (
        <span key={i} className="transition-opacity duration-300" style={{ opacity: progress > i / words.length ? 1 : 0.08, color: progress > i / words.length ? "white" : "rgba(255,255,255,0.08)" }}>
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

export default function LandingWhyUs() {
  return (
    <>
      {/* Word reveal */}
      <section className="py-20 lg:py-28 px-5 lg:px-10" style={{ background: "#020204" }}>
        <div className="max-w-[1320px] mx-auto">
          <WordReveal text="Mentre i tuoi competitor gestiscono tutto a mano, noi costruiamo il tuo vantaggio competitivo. 98 agenti IA lavorano 24 ore su 24 per generare fatturato, fidelizzare clienti e automatizzare ogni processo — dal primo contatto alla fatturazione." />
          <div className="flex gap-3 justify-center flex-wrap mt-8">
            {["Zero intervento manuale", "Dashboard predittive", "ROI misurabile in 30 giorni", "Setup in 7 giorni"].map((p) => (
              <span key={p} className="text-[11px] text-white/40 px-4 py-2 rounded-full border border-white/[0.06]">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-16 lg:py-24 border-y border-white/[0.05]" style={{ background: "#080810" }}>
        <div className="max-w-[1320px] mx-auto px-5">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-5">
              <span className="w-5 h-[1.5px] bg-[#7eb7be]" />RISULTATI MISURABILI
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-white">
              Numeri Reali. <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">Risultati Concreti.</span>
            </h2>
            <p className="text-white/40 max-w-[540px] mx-auto text-sm leading-relaxed mt-2">
              Dati aggregati dai nostri clienti attivi. Ogni numero è verificabile.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {RESULTS.map((r, i) => (
              <motion.div
                key={r.label}
                className="text-center py-7 px-4 rounded-2xl border border-white/[0.06] hover:-translate-y-1 transition-all"
                style={{ background: "rgba(13,13,26,0.6)" }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="font-heading text-[2rem] font-extrabold bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">{r.value}</div>
                <p className="text-xs text-white/50 mt-1">{r.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Before/After */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
            {BEFORE_AFTER.map((b, i) => (
              <motion.div
                key={b.title}
                className="rounded-2xl border border-white/[0.06] p-5 hover:-translate-y-1 transition-all"
                style={{ background: "rgba(13,13,26,0.6)" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <h4 className="text-[13px] font-heading font-bold mb-3 flex items-center gap-2 flex-wrap text-white">
                  {b.title}
                  <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${b.isTeal ? "bg-[rgba(126,183,190,0.1)] text-[#7eb7be]" : "bg-[rgba(34,197,94,0.08)] text-green-500"}`}>
                    {b.badge}
                  </span>
                </h4>
                <div className="flex justify-between py-1.5 border-b border-white/[0.06] text-xs">
                  <span className="text-white/40 font-medium">Prima</span>
                  <span className="text-red-400/50 line-through font-medium">{b.before}</span>
                </div>
                <div className="flex justify-between py-1.5 text-xs">
                  <span className="text-white/40 font-medium">Dopo Empire</span>
                  <span className="text-emerald-500 font-semibold">{b.after}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Guarantee */}
          <div
            className="text-center py-8 px-6 rounded-3xl border border-white/[0.06]"
            style={{ background: "linear-gradient(135deg, rgba(126,183,190,0.06), rgba(108,60,224,0.06))" }}
          >
            <h3 className="text-lg font-heading font-bold mb-1 text-white">Garanzia Soddisfatti o Rimborsati — 90 Giorni</h3>
            <p className="text-white/40 text-[13px] max-w-[550px] mx-auto">
              Se non vedi miglioramenti misurabili nei primi 90 giorni, ti restituiamo ogni centesimo. Zero rischi, zero vincoli.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
