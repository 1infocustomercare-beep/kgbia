export default function LandingFooter() {
  return (
    <footer className="px-6 py-12" style={{ background: "#08080f", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9 max-w-[1280px] mx-auto">
        <div>
          <div className="flex items-center gap-2.5 text-xl font-extrabold mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
            <div className="w-9 h-9 rounded-xl grid place-items-center text-white text-[15px] font-extrabold" style={{ background: "linear-gradient(135deg,#7eb7be,#6c3ce0)", boxShadow: "0 4px 16px rgba(126,183,190,0.3)" }}>E</div>
            <span className="text-[#f0f0f5]">EMPIRE.AI</span>
          </div>
          <p className="text-xs text-[rgba(240,240,245,0.55)] leading-relaxed max-w-[280px]">La piattaforma AI autonoma più completa d'Italia.</p>
        </div>
        <div><h4 className="text-xs uppercase tracking-[1px] text-[#f0f0f5] font-bold mb-3">Settori</h4><ul className="space-y-1.5">{["Food & Ristorazione","NCC & Trasporto","Beauty & Wellness","Healthcare","Retail & E-commerce","+19 altri"].map(s => (<li key={s}><a href="#settori" className="text-xs text-[rgba(240,240,245,0.55)] hover:text-[#7eb7be] transition-colors">{s}</a></li>))}</ul></div>
        <div><h4 className="text-xs uppercase tracking-[1px] text-[#f0f0f5] font-bold mb-3">Piattaforma</h4><ul className="space-y-1.5">{["Funzionalità","Automazioni IA","ROI Calculator","Piani & Prezzi"].map(s => (<li key={s}><a href="#" className="text-xs text-[rgba(240,240,245,0.55)] hover:text-[#7eb7be] transition-colors">{s}</a></li>))}</ul></div>
        <div><h4 className="text-xs uppercase tracking-[1px] text-[#f0f0f5] font-bold mb-3">Contatti</h4><ul className="space-y-1.5"><li><a href="mailto:info@empire-suite.it" className="text-xs text-[rgba(240,240,245,0.55)] hover:text-[#7eb7be] transition-colors">info@empire-suite.it</a></li><li className="text-xs text-[rgba(240,240,245,0.55)]">Roma, Italia</li><li><a href="/privacy" className="text-xs text-[rgba(240,240,245,0.55)] hover:text-[#7eb7be] transition-colors">Privacy Policy</a></li></ul></div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between max-w-[1280px] mx-auto pt-7 mt-7 text-[11px] text-[rgba(240,240,245,0.3)] gap-2 text-center sm:text-left" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}><span>© 2026 Empire AI · Piattaforma Multi-Settore</span><span>P.IVA IT12345678901</span></div>
    </footer>
  );
}
