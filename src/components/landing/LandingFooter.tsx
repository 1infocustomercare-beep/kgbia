import { useNavigate } from "react-router-dom";

export default function LandingFooter() {
  const navigate = useNavigate();
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="relative py-14 px-5 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #060612 0%, #0a0a1a 100%)" }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative z-[1] max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-9 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-heading font-extrabold text-lg text-white mb-3">
              <div className="w-8 h-8 rounded-lg grid place-items-center text-white text-xs font-extrabold" style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)" }}>E</div>
              EMPIRE.AI
            </div>
            <p className="text-[13px] text-white/45 leading-[1.7] max-w-[260px]">
              La piattaforma AI che automatizza ogni processo del tuo business. 98 agenti IA, 25+ settori, risultati garantiti.
            </p>
          </div>
          <div>
            <h4 className="text-[11px] font-heading font-bold uppercase tracking-[1.5px] text-white/65 mb-4">Piattaforma</h4>
            <ul className="space-y-2.5">
              {[["Settori", "settori"], ["Servizi", "servizi"], ["Portfolio", "portfolio"], ["Prezzi", "prezzi"]].map(([l, h]) => (
                <li key={l}><button onClick={() => scrollTo(h)} className="text-[13px] text-white/50 hover:text-[#7eb7be] transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-heading font-bold uppercase tracking-[1.5px] text-white/65 mb-4">Risorse</h4>
            <ul className="space-y-2.5">
              {[["Agenti IA", "agenti"], ["FAQ", "faq"], ["Demo Gratuita", "/demo"], ["Contatti", "contatti"]].map(([l, h]) => (
                <li key={l}><button onClick={() => h.startsWith("/") ? navigate(h) : scrollTo(h)} className="text-[13px] text-white/50 hover:text-[#7eb7be] transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-heading font-bold uppercase tracking-[1.5px] text-white/65 mb-4">Legale</h4>
            <ul className="space-y-2.5">
              {[["Privacy Policy", "/privacy"], ["Cookie Policy", "/cookie-policy"], ["Termini di Servizio", "#"], ["Contatti", "contatti"]].map(([l, h]) => (
                <li key={l}><button onClick={() => h.startsWith("/") ? navigate(h) : scrollTo(h)} className="text-[13px] text-white/50 hover:text-[#7eb7be] transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/[0.06] gap-3">
          <span className="text-[12px] text-white/25">© 2024 Empire AI Group — Tutti i diritti riservati · P.IVA IT00000000000</span>
          <span className="text-[12px] text-white/25">Made with precision in Italy</span>
        </div>
      </div>
    </footer>
  );
}
