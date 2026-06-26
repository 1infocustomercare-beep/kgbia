import { useNavigate } from "react-router-dom";

export default function LandingFooter() {
  const navigate = useNavigate();
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden px-gutter py-14">
      <div className="absolute inset-0 bg-deep-black" />
      <div className="absolute left-0 right-0 top-0 h-px bg-border" />

      <div className="relative z-[1] max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-9 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3 flex items-center gap-2 text-lg font-extrabold text-foreground">
              <div className="grid h-8 w-8 place-items-center rounded-sm bg-primary text-xs font-extrabold text-primary-foreground">E</div>
              EMPIRE.AI
            </div>
            <p className="max-w-[260px] text-[13px] leading-[1.7] text-muted-foreground">
              La piattaforma AI che automatizza ogni processo del tuo business. Agenti IA su misura, 25+ settori, risultati concreti.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[1.5px] text-foreground/70">Piattaforma</h4>
            <ul className="space-y-2.5">
              {[["Settori", "sectors"], ["Sistema", "showcase"], ["Portfolio", "portfolio"], ["Prezzi", "pricing"]].map(([l, h]) => (
                <li key={l}><button onClick={() => scrollTo(h)} className="text-[13px] text-muted-foreground transition-colors hover:text-primary">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[1.5px] text-foreground/70">Risorse</h4>
            <ul className="space-y-2.5">
              {[["Agenti IA", "agents"], ["FAQ", "faq"], ["Demo Gratuita", "/demo"], ["Contatti", "contatti"]].map(([l, h]) => (
                <li key={l}><button onClick={() => h.startsWith("/") ? navigate(h) : scrollTo(h)} className="text-[13px] text-muted-foreground transition-colors hover:text-primary">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[1.5px] text-foreground/70">Legale</h4>
            <ul className="space-y-2.5">
              {[["Privacy Policy", "/privacy"], ["Cookie Policy", "/cookie-policy"], ["Termini di Servizio", "#"], ["Contatti", "contatti"]].map(([l, h]) => (
                <li key={l}><button onClick={() => h.startsWith("/") ? navigate(h) : scrollTo(h)} className="text-[13px] text-muted-foreground transition-colors hover:text-primary">{l}</button></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-8 md:flex-row">
          <span className="text-[12px] text-muted-foreground/70">© 2026 Empire AI — Tutti i diritti riservati</span>
          <span className="text-[12px] text-muted-foreground/70">Made with precision in Italy</span>
        </div>
      </div>
    </footer>
  );
}
