import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const BEFORE_AFTER = [
  { title: "Gestione Ordini", badge: "-93%", before: "45 min manuali ogni giorno", after: "3 min — tutto automatizzato dall'IA" },
  { title: "Reputazione Online", badge: "0 negative", before: "12 recensioni negative/mese", after: "Intercettate e risolte in privato dall'IA" },
  { title: "Clienti Persi", badge: "-94%", before: "34% tasso di abbandono annuale", after: "Solo 2% con retention IA automatica" },
  { title: "Revenue Digitali", badge: "+€2.400", before: "€0 da canali digitali", after: "+€2.400/mese da ordini e prenotazioni online" },
  { title: "Fatturazione", badge: "-100%", before: "2 ore al giorno di lavoro manuale", after: "Completamente automatica — e-Fatt inclusa" },
  { title: "Marketing", badge: "24/7", before: "Agenzia esterna: €800-2.000/mese", after: "AI Content Engine crea e pubblica tutto gratis" },
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
    <p ref={ref} className="font-heading text-[clamp(1.4rem,2.8vw,2.2rem)] font-semibold leading-[1.65] max-w-[900px] mx-auto text-center">
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
      {/* Word Reveal */}
      <section className="relative py-28 lg:py-36 px-5 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #06081a 0%, #0e1230 50%, #080a1e 100%)" }} />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(201,168,76,0.1) 0%, transparent 70%)",
        }} />

        <div className="relative z-[1] max-w-[1200px] mx-auto">
          <WordReveal text="Mentre i tuoi competitor perdono tempo con processi manuali e software obsoleti, i nostri 98 agenti IA lavorano 24 ore su 24 per generare fatturato, fidelizzare i tuoi clienti e automatizzare ogni singolo processo — dal primo contatto alla fatturazione elettronica." />
          <div className="flex gap-3 justify-center flex-wrap mt-12">
            {["Zero intervento manuale", "Dashboard predittive", "ROI in 30 giorni", "Setup in 7 giorni"].map((p) => (
              <span key={p} className="text-[12px] text-[#c9a84c]/70 px-5 py-2.5 rounded-full border border-[#c9a84c]/15 bg-[#c9a84c]/5 font-medium">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After Results */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #080a1e 0%, #0b1028 30%, #070a1c 100%)" }} />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(ellipse 40% 40% at 70% 30%, rgba(34,197,94,0.06) 0%, transparent 50%)",
        }} />

        <div className="relative z-[1] max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-14">
            <span className="inline-block text-[11px] tracking-[3px] uppercase font-bold mb-4 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
              Risultati Reali & Verificabili
            </span>
            <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-heading font-bold mb-4 text-white leading-tight">
              Prima vs Dopo Empire.<br />
              <span className="text-emerald-400">I Numeri Non Mentono.</span>
            </h2>
            <p className="text-white/55 max-w-[600px] mx-auto text-[16px] leading-[1.8]">
              Dati aggregati e verificabili dai nostri 847+ clienti attivi. Ogni numero rappresenta un miglioramento reale e misurabile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {BEFORE_AFTER.map((b, i) => (
              <motion.div
                key={b.title}
                className="rounded-2xl border border-white/[0.06] p-6 hover:-translate-y-1 transition-all"
                style={{ background: "linear-gradient(160deg, rgba(11,16,40,0.9), rgba(8,10,28,0.95))" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[15px] font-heading font-bold text-white">{b.title}</h4>
                  <span className="text-[11px] px-3 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {b.badge}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2.5 border-b border-white/[0.05] text-[13px]">
                    <span className="text-white/40 font-medium">Prima</span>
                    <span className="text-red-400/70 line-through">{b.before}</span>
                  </div>
                  <div className="flex justify-between py-2.5 text-[13px]">
                    <span className="text-white/40 font-medium">Con Empire</span>
                    <span className="text-emerald-400 font-semibold">{b.after}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Guarantee */}
          <div
            className="text-center py-12 px-8 rounded-2xl border border-[#c9a84c]/15"
            style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.04), rgba(201,168,76,0.02), rgba(11,16,40,0.9))" }}
          >
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-heading font-bold mb-3 text-white">Garanzia Soddisfatti o Rimborsati — 90 Giorni</h3>
            <p className="text-white/55 text-[15px] max-w-[580px] mx-auto leading-[1.8]">
              Se non vedi miglioramenti misurabili nei primi 90 giorni, ti restituiamo ogni centesimo investito. Nessuna domanda, nessun vincolo. Il rischio è completamente nostro.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
