export default function LandingCTA() {
  return (
    <section className="py-[120px] sm:py-[140px] px-5 sm:px-10 text-center relative overflow-hidden" id="contatti">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse,rgba(126,183,190,0.12),rgba(108,60,224,0.12) 40%,transparent 70%)" }} />
      <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-4 relative before:content-[''] before:w-5 before:h-[1.5px] before:bg-[#7eb7be]">INIZIA ORA</span>
      <h2 className="text-[#f0f0f5] mb-4 relative" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 700, lineHeight: 1.1 }}>Pronto a Costruire<br /><em className="not-italic" style={{ background: "linear-gradient(135deg,#7eb7be,#6c3ce0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>il Tuo Impero?</em></h2>
      <p className="text-[15px] text-[rgba(240,240,245,0.55)] max-w-[560px] mx-auto mb-8 leading-[1.7] relative">25+ settori, automazione totale, IA integrata. I tuoi competitor si stanno digitalizzando.</p>
      <div className="flex gap-3.5 flex-wrap justify-center relative">
        <button onClick={() => document.querySelector("#prezzi")?.scrollIntoView({ behavior: "smooth" })} className="px-8 py-3.5 rounded-full font-semibold text-sm text-white transition-all hover:translate-y-[-3px]" style={{ background: "linear-gradient(135deg,#7eb7be,#6c3ce0)", fontFamily: "'Space Grotesk',sans-serif", boxShadow: "0 16px 48px rgba(126,183,190,0.25)" }}>Sono un Imprenditore →</button>
        <button className="px-8 py-3.5 rounded-full font-semibold text-sm text-white transition-all hover:border-[#7eb7be] hover:text-[#7eb7be]" style={{ border: "1px solid rgba(255,255,255,0.14)", fontFamily: "'Space Grotesk',sans-serif" }}>Prenota Demo</button>
      </div>
    </section>
  );
}
