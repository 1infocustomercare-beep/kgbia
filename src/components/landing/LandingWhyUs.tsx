import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const RESULTS = [
  { value: "847+", label: "Imprese Digitalizzate", color: "#22d3ee" },
  { value: "3.2M", label: "Processi Automatizzati", color: "#a78bfa" },
  { value: "94h", label: "Risparmiate al Mese", color: "#4ade80" },
  { value: "+40%", label: "Fatturato Medio", color: "#f59e0b" },
];

const BEFORE_AFTER = [
  { title: "Gestione Ordini", badge: "-93% tempo", before: "45 min manuali ogni giorno", after: "3 min — tutto automatico", badgeColor: "#4ade80" },
  { title: "Reputazione Online", badge: "0 negative", before: "12 recensioni negative/mese", after: "Intercettate e gestite dall'IA", badgeColor: "#22d3ee" },
  { title: "Clienti Persi", badge: "-94%", before: "34% tasso di abbandono", after: "Solo 2% con retention AI", badgeColor: "#f472b6" },
  { title: "Revenue Digitali", badge: "+€2.400/mese", before: "€0 da canali digitali", after: "+€2.400/mese automatici", badgeColor: "#f59e0b" },
  { title: "Tempo Fatturazione", badge: "Automatica", before: "2 ore al giorno di burocrazia", after: "Fatture inviate in automatico", badgeColor: "#a78bfa" },
  { title: "Social & Marketing", badge: "24/7 AI", before: "Costoso, manuale e incostante", after: "Content Engine genera tutto", badgeColor: "#ec4899" },
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
        <span key={i} className="transition-colors duration-300" style={{
          color: progress > i / words.length ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.08)",
        }}>
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

export default function LandingWhyUs() {
  return (
    <>
      {/* Word reveal — deep purple atmosphere */}
      <section className="relative py-24 lg:py-32 px-5 lg:px-10 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, #020208 0%, #100820 50%, #020208 100%)",
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(167,139,250,0.06) 0%, transparent 60%)",
        }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/15 to-transparent" />

        <div className="relative z-[1] max-w-[1320px] mx-auto">
          <WordReveal text="Mentre i tuoi competitor perdono tempo con fogli Excel e telefonate, tu hai 98 agenti IA che lavorano 24 ore su 24. Generano fatturato, fidelizzano clienti e automatizzano ogni processo — dal primo contatto alla fatturazione." />
          <div className="flex gap-3 justify-center flex-wrap mt-10">
            {["Zero intervento manuale", "Dashboard predittive", "ROI in 30 giorni", "Setup in 7 giorni"].map((p) => (
              <span key={p} className="text-[11px] text-purple-300/60 px-4 py-2 rounded-full border border-purple-400/15 bg-purple-500/[0.04]">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Results — emerald/success green theme */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, #020208 0%, #041210 30%, #061614 50%, #020208 100%)",
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(ellipse 50% 50% at 70% 30%, rgba(74,222,128,0.04) 0%, transparent 50%), radial-gradient(ellipse 40% 40% at 30% 70%, rgba(245,158,11,0.03) 0%, transparent 50%)",
        }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent" />

        <div className="relative z-[1] max-w-[1320px] mx-auto px-5">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-emerald-400 font-bold mb-5">
              <span className="w-6 h-[2px] bg-gradient-to-r from-emerald-400 to-transparent" />RISULTATI MISURABILI
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-white">
              Non Promettiamo. <span className="text-emerald-400">Dimostriamo.</span>
            </h2>
            <p className="text-white/55 max-w-[540px] mx-auto text-[15px] leading-relaxed mt-3">
              Dati reali aggregati dai nostri 847+ clienti attivi. Ogni numero è verificabile.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {RESULTS.map((r, i) => (
              <motion.div
                key={r.label}
                className="text-center py-8 px-4 rounded-2xl border border-white/[0.06] hover:-translate-y-1 transition-all"
                style={{ background: "linear-gradient(145deg, rgba(6,18,16,0.85), rgba(4,10,8,0.95))", boxShadow: `0 0 30px ${r.color}06` }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="font-heading text-[2rem] font-extrabold" style={{ color: r.color }}>{r.value}</div>
                <p className="text-xs text-white/60 mt-1 font-medium">{r.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Before/After */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {BEFORE_AFTER.map((b, i) => (
              <motion.div
                key={b.title}
                className="rounded-2xl border border-white/[0.06] p-5 hover:-translate-y-1 transition-all hover:border-white/[0.12]"
                style={{ background: "linear-gradient(145deg, rgba(6,18,16,0.85), rgba(4,10,8,0.95))" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <h4 className="text-[14px] font-heading font-bold mb-3 flex items-center gap-2 flex-wrap text-white/90">
                  {b.title}
                  <span className="text-[10px] px-2 py-0.5 rounded-lg font-bold"
                    style={{ background: `${b.badgeColor}15`, color: b.badgeColor }}>
                    {b.badge}
                  </span>
                </h4>
                <div className="flex justify-between py-2 border-b border-white/[0.06] text-xs">
                  <span className="text-white/45 font-medium">Prima</span>
                  <span className="text-red-400/60 line-through font-medium">{b.before}</span>
                </div>
                <div className="flex justify-between py-2 text-xs">
                  <span className="text-white/45 font-medium">Dopo Empire</span>
                  <span className="text-emerald-400 font-semibold">{b.after}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Guarantee */}
          <div
            className="text-center py-10 px-8 rounded-3xl border border-emerald-400/15"
            style={{ background: "linear-gradient(135deg, rgba(74,222,128,0.04), rgba(6,18,16,0.8))" }}
          >
            <h3 className="text-xl font-heading font-bold mb-2 text-white">Garanzia Soddisfatti o Rimborsati — 90 Giorni</h3>
            <p className="text-white/55 text-[14px] max-w-[550px] mx-auto leading-[1.7]">
              Se non vedi miglioramenti misurabili nei primi 90 giorni, ti restituiamo ogni centesimo. Il rischio è tutto nostro.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
