const RESULTS = [
  { v: "847+", l: "Business Trasformati" },
  { v: "3.2M", l: "Operazioni Automatizzate" },
  { v: "94h", l: "Ore Risparmiate / Mese" },
  { v: "+40%", l: "Revenue Medio" },
];

const BA = [
  { title: "Gestione Ordini", badge: "-93%", rows: [["Prima", "45 min manuali/giorno", true], ["Dopo", "3 min — automatico", false]] },
  { title: "Reputazione Online", badge: "-100%", rows: [["Prima", "12 recensioni negative/mese", true], ["Dopo", "0 — intercettate dall'IA", false]] },
  { title: "Clienti Persi", badge: "-94%", rows: [["Prima", "34% abbandono", true], ["Dopo", "2% con retention AI", false]] },
  { title: "Revenue Digitali", badge: "+∞", teal: true, rows: [["Prima", "€0 automazioni", true], ["Dopo", "+€2.400/mese", false]] },
  { title: "Fatturazione", badge: "-100%", rows: [["Prima", "2 ore/giorno", true], ["Dopo", "Completamente automatica", false]] },
  { title: "Marketing", badge: "∞", teal: true, rows: [["Prima", "Manuale, costoso", true], ["Dopo", "AI Content Engine 24/7", false]] },
];

export default function LandingResults() {
  return (
    <section className="py-[100px]" style={{ background: "#08080f", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-4 before:content-[''] before:w-5 before:h-[1.5px] before:bg-[#7eb7be]">RISULTATI REALI</span>
          <h2 className="text-[#f0f0f5]" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 700 }}>
            I Numeri <em className="not-italic" style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Parlano</em>
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {RESULTS.map(r => (
            <div key={r.l} className="text-center p-6 rounded-2xl transition-all hover:translate-y-[-4px]" style={{ background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="text-[2.2rem] font-extrabold" style={{ fontFamily: "'Space Grotesk', sans-serif", background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{r.v}</div>
              <p className="text-xs text-[rgba(240,240,245,0.55)] mt-1">{r.l}</p>
            </div>
          ))}
        </div>

        {/* Before/After */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
          {BA.map(b => (
            <div key={b.title} className="rounded-2xl p-5 transition-all hover:translate-y-[-3px]" style={{ background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h4 className="text-[13px] font-bold text-[#f0f0f5] mb-3 flex items-center gap-1.5 flex-wrap" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {b.title}
                <span className="text-[10px] px-2 py-0.5 rounded-lg font-bold" style={{ background: b.teal ? "rgba(126,183,190,0.12)" : "rgba(34,197,94,0.1)", color: b.teal ? "#7eb7be" : "#22c55e" }}>{b.badge}</span>
              </h4>
              {b.rows.map(([label, val, isOld], i) => (
                <div key={i} className="flex justify-between py-1.5 text-xs" style={{ borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                  <span className="text-[rgba(240,240,245,0.55)] font-semibold">{label as string}</span>
                  <span className={`font-semibold ${isOld ? "text-red-400/60 line-through" : "text-[#22c55e]"}`}>{val as string}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="text-center p-8 rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(126,183,190,0.12), rgba(108,60,224,0.12))", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 className="text-[1.2rem] font-bold text-[#f0f0f5] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Garanzia Risultati 90 Giorni</h3>
          <p className="text-[13px] text-[rgba(240,240,245,0.55)] max-w-[550px] mx-auto">Se non vedi miglioramenti misurabili nei primi 90 giorni, rimborso integrale. Zero rischi.</p>
          <div className="flex gap-2.5 justify-center mt-3 flex-wrap">
            {["GDPR", "Sicuro", "Certificato"].map(t => (
              <span key={t} className="text-[11px] text-[rgba(240,240,245,0.55)] px-3 py-1 rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
