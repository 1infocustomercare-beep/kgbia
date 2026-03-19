import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Instagram, Globe, Clock, Heart, Shield, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  company: any;
  accentColor: string;
  darkMode?: boolean;
  bgColor?: string;
  sectorLabel?: string;
  fontFamily?: string;
  columns?: { title: string; links: { label: string; href: string }[] }[];
}

const DEFAULT_COLUMNS = [
  {
    title: "Servizi",
    links: [
      { label: "I Nostri Servizi", href: "#servizi" },
      { label: "Prezzi", href: "#pricing" },
      { label: "Prenota", href: "#prenota" },
    ],
  },
  {
    title: "Azienda",
    links: [
      { label: "Chi Siamo", href: "#chi-siamo" },
      { label: "Recensioni", href: "#recensioni" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Legale",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookie-policy" },
      { label: "Termini di Servizio", href: "#" },
    ],
  },
];

export function DemoRichFooter({ company, accentColor, darkMode = true, bgColor, sectorLabel, fontFamily, columns }: Props) {
  const [email, setEmail] = useState("");
  const bg = bgColor || (darkMode ? "#050505" : "#fafafa");
  const text = darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)";
  const muted = darkMode ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)";
  const border = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const font = fontFamily || "inherit";
  const socialLinks = company.social_links as Record<string, string> | null;
  const cols = columns || DEFAULT_COLUMNS;

  const handleNewsletter = () => {
    if (!email) return;
    toast.success("Iscritto alla newsletter!");
    setEmail("");
  };

  return (
    <footer style={{ background: bg, borderTop: `1px solid ${border}`, fontFamily: font }}>
      {/* Newsletter strip */}
      <div className="border-b" style={{ borderColor: border }}>
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-base font-bold" style={{ color: darkMode ? "#fff" : "#111" }}>
              Resta Aggiornato
            </h3>
            <p className="text-xs mt-1" style={{ color: muted }}>
              Offerte esclusive e novità direttamente nella tua inbox
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto max-w-sm">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="La tua email"
              className="flex-1 h-10 rounded-lg text-sm"
              style={{
                background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                color: darkMode ? "#fff" : "#111",
              }}
            />
            <Button
              onClick={handleNewsletter}
              className="h-10 px-5 rounded-lg text-xs font-semibold text-white shrink-0"
              style={{ background: accentColor }}
            >
              Iscriviti <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {company.logo_url && (
                <img src={company.logo_url} alt="" className="w-10 h-10 rounded-xl object-cover" />
              )}
              <div>
                <p className="font-bold text-sm" style={{ color: darkMode ? "#fff" : "#111" }}>
                  {company.name}
                </p>
                {sectorLabel && (
                  <p className="text-[9px] uppercase tracking-[0.2em] font-semibold" style={{ color: accentColor }}>
                    {sectorLabel}
                  </p>
                )}
              </div>
            </div>
            {company.tagline && (
              <p className="text-xs leading-relaxed mb-4 max-w-xs" style={{ color: muted }}>
                {company.tagline}
              </p>
            )}
            <div className="space-y-2">
              {company.address && (
                <div className="flex items-center gap-2 text-xs" style={{ color: muted }}>
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                  <span>{company.address}{company.city ? `, ${company.city}` : ""}</span>
                </div>
              )}
              {company.phone && (
                <a href={`tel:${company.phone}`} className="flex items-center gap-2 text-xs hover:opacity-80" style={{ color: muted }}>
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                  <span>{company.phone}</span>
                </a>
              )}
              {company.email && (
                <a href={`mailto:${company.email}`} className="flex items-center gap-2 text-xs hover:opacity-80" style={{ color: muted }}>
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                  <span>{company.email}</span>
                </a>
              )}
            </div>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-5">
              {socialLinks?.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ background: `${accentColor}15` }}>
                  <Instagram className="w-4 h-4" style={{ color: accentColor }} />
                </a>
              )}
              {socialLinks?.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ background: `${accentColor}15` }}>
                  <Globe className="w-4 h-4" style={{ color: accentColor }} />
                </a>
              )}
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col, i) => (
            <div key={i}>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link, li) => (
                  <li key={li}>
                    <a
                      href={link.href}
                      className="text-xs hover:opacity-80 transition-opacity"
                      style={{ color: muted }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: border }}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px]" style={{ color: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }}>
            © {new Date().getFullYear()} {company.name}. Tutti i diritti riservati.
          </p>
          <div className="flex items-center gap-1 text-[10px]" style={{ color: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }}>
            <span>Made with</span>
            <Heart className="w-3 h-3 mx-0.5" style={{ color: accentColor }} />
            <span>by <strong>Empire.AI</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
