import { useNavigate } from "react-router-dom";
import { Instagram, Facebook, Globe, ArrowRight } from "lucide-react";
import empireLogoNew from "@/assets/empire-logo-new.png";

const COLUMNS = [
  { title: "Prodotto", links: ["Dashboard", "CRM Clienti", "Prenotazioni", "Analytics", "Agenti AI", "Automazioni"] },
  { title: "Risorse", links: ["Centro Assistenza", "Documentazione", "Video Tutorial", "Blog", "Webinar", "API"] },
  { title: "Azienda", links: ["Chi Siamo", "Lavora con Noi", "Partner Program", "Press Kit", "Privacy Policy", "Termini"] },
];

export default function LandingFooter() {
  const navigate = useNavigate();

  return (
    <footer className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #050508, #08080c)", color: "white" }}>
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, hsla(38,50%,55%,0.2), transparent)" }} />

      {/* Newsletter strip */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-1">Resta Aggiornato</h3>
            <p className="text-xs text-white/35">Ricevi novità, guide e offerte esclusive per il tuo business</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input type="email" placeholder="La tua email..." className="bg-white/[0.05] border border-white/10 text-white placeholder:text-white/20 h-11 px-4 rounded-xl w-full sm:w-64 text-sm focus:outline-none focus:border-primary/30" />
            <button className="h-11 px-6 rounded-xl font-semibold text-sm text-white bg-primary shrink-0 flex items-center gap-1 hover:bg-primary/90 transition-colors">
              Iscriviti <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img src={empireLogoNew} alt="Empire" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Empire.AI</p>
                <p className="text-[0.55rem] text-white/25 uppercase tracking-wider">Autonomous AI Platform</p>
              </div>
            </div>
            <p className="text-xs text-white/30 leading-relaxed mb-4">La piattaforma AI completa per digitalizzare e automatizzare qualsiasi business.</p>
            <div className="flex gap-2">
              {[Instagram, Facebook, Globe].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/[0.06] border border-white/[0.06]">
                  <Icon className="w-3.5 h-3.5 text-white/30" />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col, i) => (
            <div key={i}>
              <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link, j) => (
                  <li key={j}><button className="text-xs text-white/25 hover:text-white/60 transition-colors">{link}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[0.6rem] text-white/15">
            © 2026 Empire AI Group — Tutti i diritti riservati
          </p>
          <div className="flex gap-4">
            {[{ l: "Privacy", p: "/privacy" }, { l: "Cookie", p: "/cookie-policy" }, { l: "Termini", p: "#" }].map((item) => (
              <button key={item.l} onClick={() => navigate(item.p)} className="text-[0.6rem] text-white/15 hover:text-white/30 transition">{item.l}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
