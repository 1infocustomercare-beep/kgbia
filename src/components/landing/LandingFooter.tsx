import { useNavigate } from "react-router-dom";

export default function LandingFooter() {
  const navigate = useNavigate();
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="border-t border-white/[0.07] py-12 px-5" style={{ background: "#080810" }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-9 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-heading font-extrabold text-lg text-white mb-3">
              <div className="w-8 h-8 rounded-lg grid place-items-center text-white text-xs font-extrabold" style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)" }}>E</div>
              EMPIRE.AI
            </div>
            <p className="text-[12px] text-white/40 leading-[1.7] max-w-[260px]">
              La piattaforma AI #1 per le imprese italiane. 98+ agenti IA, 25+ settori, ROI garantito.
            </p>
          </div>
          <div>
            <h4 className="text-[12px] font-heading font-bold uppercase tracking-[1px] text-white mb-4">Piattaforma</h4>
            <ul className="space-y-2">
              {[["Settori", "settori"], ["Servizi", "servizi"], ["Portfolio", "portfolio"], ["Prezzi", "prezzi"]].map(([l, h]) => (
                <li key={l}><button onClick={() => scrollTo(h)} className="text-[12px] text-white/55 hover:text-[#7eb7be] transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-heading font-bold uppercase tracking-[1px] text-white mb-4">Risorse</h4>
            <ul className="space-y-2">
              {[["Agenti IA", "agenti"], ["FAQ", "faq"], ["Demo", "/demo"], ["Blog", "#"]].map(([l, h]) => (
                <li key={l}><button onClick={() => h.startsWith("/") ? navigate(h) : scrollTo(h)} className="text-[12px] text-white/55 hover:text-[#7eb7be] transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-heading font-bold uppercase tracking-[1px] text-white mb-4">Legale</h4>
            <ul className="space-y-2">
              {[["Privacy Policy", "/privacy"], ["Cookie Policy", "/cookie-policy"], ["Termini", "#"], ["Contatti", "contatti"]].map(([l, h]) => (
                <li key={l}><button onClick={() => h.startsWith("/") ? navigate(h) : scrollTo(h)} className="text-[12px] text-white/55 hover:text-[#7eb7be] transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/[0.07] gap-3">
          <span className="text-[11px] text-white/30">© 2024 Empire.AI — Tutti i diritti riservati</span>
          <span className="text-[11px] text-white/30">Made with ❤️ in Italy</span>
        </div>
      </div>
    </footer>
  );
}
