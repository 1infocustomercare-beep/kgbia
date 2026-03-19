/**
 * DemoFooterSection — Rich multi-column footer with Empire.AI branding
 */
import { motion } from "framer-motion";
import { getSectorTheme } from "@/config/sector-themes";
import { Mail, Phone, MapPin, ArrowRight, Globe, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import PremiumSectionBg from "./PremiumSectionBg";

interface Props {
  sector: string;
  accentColor: string;
  sectorName: string;
  companyName: string;
  tagline?: string;
}

export default function DemoFooterSection({ sector, accentColor, sectorName, companyName, tagline }: Props) {
  const theme = getSectorTheme(sector);
  const navigate = useNavigate();
  const isDark = theme.palette.bg.startsWith("#0") || theme.palette.bg.startsWith("rgba");

  const footerBg = isDark ? "#060608" : "#111118";

  const columns = [
    {
      title: "Prodotto",
      links: ["Dashboard", "CRM Clienti", "Prenotazioni", "Analytics", "Agenti AI", "Automazioni"],
    },
    {
      title: "Risorse",
      links: ["Centro Assistenza", "Documentazione", "Video Tutorial", "Blog", "Webinar", "API"],
    },
    {
      title: "Azienda",
      links: ["Chi Siamo", "Lavora con Noi", "Partner Program", "Press Kit", "Privacy Policy", "Termini"],
    },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #050508, #08080c)", color: "white" }}>
      <PremiumSectionBg accentColor={accentColor} variant="alt" />
      {/* Top accent line */}
      <div className="h-px w-full relative z-10" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />

      {/* Newsletter CTA strip */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-1">Resta Aggiornato</h3>
            <p className="text-xs text-white/35">Ricevi novità, guide e offerte esclusive per il tuo {sectorName.toLowerCase()}</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              type="email"
              placeholder="La tua email..."
              className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/20 h-11 w-full sm:w-64"
            />
            <Button
              className="h-11 px-6 rounded-lg font-semibold text-sm border-0 text-white shrink-0"
              style={{ background: accentColor }}
            >
              Iscriviti <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accentColor}20` }}>
                <span className="text-sm">⚡</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{companyName}</p>
                <p className="text-[0.55rem] text-white/25 uppercase tracking-wider">Powered by Empire.AI</p>
              </div>
            </div>
            <p className="text-xs text-white/30 leading-relaxed mb-4">
              {tagline || `La piattaforma AI completa per ${sectorName.toLowerCase()}`}
            </p>
            {/* Social icons */}
            <div className="flex gap-2">
              {[Instagram, Facebook, Globe].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/[0.06] border border-white/[0.06]">
                  <Icon className="w-3.5 h-3.5 text-white/30" />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col, i) => (
            <div key={i}>
              <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <button className="text-xs text-white/25 hover:text-white/60 transition-colors">
                      {link}
                    </button>
                  </li>
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
            © 2026 {companyName} — Powered by{" "}
            <button onClick={() => navigate("/")} className="text-white/25 hover:text-white/40 transition underline">
              Empire.AI
            </button>
            {" "}· Tutti i diritti riservati
          </p>
          <div className="flex gap-4">
            {["Privacy", "Cookie", "Termini"].map(l => (
              <button key={l} className="text-[0.6rem] text-white/15 hover:text-white/30 transition">{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Demo notice */}
      <div className="text-center py-3 border-t border-white/[0.03]" style={{ background: `${accentColor}05` }}>
        <p className="text-[0.55rem] text-white/15">
          🏗️ Questo è un sito demo generato automaticamente dalla piattaforma Empire.AI · Nessun dato reale
        </p>
      </div>
    </footer>
  );
}
