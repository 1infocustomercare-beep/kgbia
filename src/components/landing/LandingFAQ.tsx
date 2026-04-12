import { useState } from "react";
const FAQS = [
  { q: "Quanto tempo serve per avere tutto pronto?", a: "Setup base in 24-48 ore. Personalizzazione completa in 5-7 giorni. Include app, sito, gestionale e configurazione IA." },
  { q: "Posso cambiare piano dopo?", a: "Sì, puoi fare upgrade in qualsiasi momento. La differenza viene calcolata pro-rata. Nessun costo nascosto." },
  { q: "I dati dei miei clienti sono sicuri?", a: "Assolutamente. Utilizziamo crittografia AES-256, siamo GDPR compliant e i server sono in Europa. Backup automatici ogni 6 ore." },
  { q: "Come funziona la garanzia 90 giorni?", a: "Se nei primi 90 giorni non vedi miglioramenti misurabili nel tuo business, rimborso completo. Zero burocrazia." },
  { q: "Devo avere competenze tecniche?", a: "Zero. La piattaforma è progettata per imprenditori. L'IA si occupa di tutto." },
  { q: "Come funzionano le commissioni?", a: "Digital Start: 2%. Growth AI: 1%. Empire: 0%. Solo sui pagamenti processati." },
  { q: "Posso provare prima di acquistare?", a: "Sì. Prenota una demo personalizzata e vedrai la piattaforma configurata per il tuo settore." },
];
export default function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-16 sm:py-[100px]" id="faq" style={{ background: "#020204" }}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-4 before:content-[''] before:w-5 before:h-[1.5px] before:bg-[#7eb7be]">FAQ</span>
          <h2 className="text-[#f0f0f5]" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 700 }}>Domande <em className="not-italic" style={{ background: "linear-gradient(135deg,#7eb7be,#6c3ce0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Frequenti</em></h2>
        </div>
        <div className="max-w-[760px] mx-auto flex flex-col gap-1.5">
          {FAQS.map((f, i) => (
            <div key={i} className="rounded-2xl overflow-hidden" style={{ border: `1px solid rgba(255,255,255,${open === i ? 0.14 : 0.07})` }}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex justify-between items-center px-5 py-4 text-left text-sm font-semibold text-[#f0f0f5] hover:text-[#7eb7be] transition-colors gap-3" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{f.q}<span className={`text-lg text-[#7eb7be] shrink-0 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>+</span></button>
              <div className="overflow-hidden transition-all duration-400" style={{ maxHeight: open === i ? 300 : 0 }}><p className="px-5 pb-4 text-[13px] text-[rgba(240,240,245,0.55)] leading-[1.7]">{f.a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
