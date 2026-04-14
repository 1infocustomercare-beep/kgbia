import { useNavigate } from "react-router-dom";

export default function LandingFooter() {
  const navigate = useNavigate();
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="relative py-16 px-5 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #080a1c 0%, #060818 100%)" }} />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative z-[1] max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 font-heading font-extrabold text-lg text-white mb-4">
              <div className="w-9 h-9 rounded-xl grid place-items-center text-black text-sm font-extrabold"
                style={{ background: "linear-gradient(135deg, #c9a84c, #e8c47a)" }}>E</div>
              EMPIRE.AI
            </div>
            <p className="text-[14px] text-white/45 leading-[1.8] max-w-[280px]">
              La piattaforma italiana che automatizza ogni processo del tuo business con 98 agenti IA, app personalizzate e gestionali completi per 25+ settori.
            </p>
          </div>
          <div>
            <h4 className="text-[12px] font-heading font-bold uppercase tracking-[2px] text-white/60 mb-5">Piattaforma</h4>
            <ul className="space-y-3">
              {[["Settori", "settori"], ["Servizi", "servizi"], ["Portfolio", "portfolio"], ["Prezzi", "prezzi"]].map(([l, h]) => (
                <li key={l}><button onClick={() => scrollTo(h)} className="text-[14px] text-white/50 hover:text-[#c9a84c] transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-heading font-bold uppercase tracking-[2px] text-white/60 mb-5">Risorse</h4>
            <ul className="space-y-3">
              {[["Agenti IA", "agenti"], ["FAQ", "faq"], ["Demo Gratuita", "/demo"], ["Contatti", "contatti"]].map(([l, h]) => (
                <li key={l}><button onClick={() => h.startsWith("/") ? navigate(h) : scrollTo(h)} className="text-[14px] text-white/50 hover:text-[#c9a84c] transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-heading font-bold uppercase tracking-[2px] text-white/60 mb-5">Legale</h4>
            <ul className="space-y-3">
              {[["Privacy Policy", "/privacy"], ["Cookie Policy", "/cookie-policy"], ["Termini di Servizio", "#"]].map(([l, h]) => (
                <li key={l}><button onClick={() => h.startsWith("/") ? navigate(h) : scrollTo(h)} className="text-[14px] text-white/50 hover:text-[#c9a84c] transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/[0.06] gap-3">
          <span className="text-[13px] text-white/30">© 2024 Empire AI Group — Tutti i diritti riservati</span>
          <span className="text-[13px] text-white/30">Made with precision in Italy 🇮🇹</span>
        </div>
      </div>
    </footer>
  );
}
