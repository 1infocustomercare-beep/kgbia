import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import empireLogo from "@/assets/empire-logo-full.png";
import { PrestigeLangToggle } from "@/components/empire-home/prestige/PrestigeLang";


const NAV_LINKS = [
  { label: "Settori", href: "#sectors" },
  { label: "Mockup", href: "#mockups" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "AI Agents", href: "#agents" },
  { label: "Contatti", href: "#contatti" },
];

export default function LandingNav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div
        className="fixed left-0 top-0 z-[10002] h-[3px] rounded-r-full"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--empire-violet)), hsl(var(--gold)))",
        }}
      />

      <nav className={`fixed top-[3px] z-[10000] w-full transition-all duration-500 ${scrolled ? "py-2" : "py-3"}`}>
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-3 sm:px-5 lg:px-10">
          <div className="w-full rounded-full border border-white/10 bg-[hsl(162_30%_8%/0.82)] px-3 shadow-[0_18px_48px_-28px_hsl(0_0%_0%/0.7)] backdrop-blur-2xl transition-all duration-500 sm:px-5">

            <div className="flex items-center justify-between py-2.5">
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex items-center gap-2 font-heading text-base font-extrabold tracking-tight text-foreground sm:text-lg"
            aria-label="Empire AI — Home"
          >
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--gold)), hsl(var(--primary)), hsl(var(--empire-violet)))" }}
            >
              EMPIRE
            </span>
            <span className="hidden text-foreground/80 sm:inline">·</span>
            <span className="hidden text-foreground/70 sm:inline text-sm font-medium">AI</span>
          </a>


          <ul className="hidden lg:flex gap-7">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <button onClick={() => scrollTo(l.href)} className="text-[13px] font-medium text-foreground/60 transition-colors hover:text-foreground">{l.label}</button>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex gap-3 items-center">
            <PrestigeLangToggle />
            <button onClick={() => navigate("/auth")} className="text-[13px] font-medium text-foreground/60 transition-colors hover:text-foreground">Accedi</button>
            <button onClick={() => scrollTo("#contatti")} className="landing-button-primary !text-black px-6 py-2.5 text-sm font-semibold">Inizia Ora</button>
          </div>


          <button className="text-foreground lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute left-4 right-4 top-full mt-2 flex flex-col gap-4 rounded-[28px] border border-border/80 bg-background/90 px-5 py-6 shadow-[0_30px_90px_-40px_hsl(0_0%_0%_/_0.92)] backdrop-blur-2xl lg:hidden">
            {NAV_LINKS.map((l) => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="text-left text-sm font-medium text-foreground/74 transition-colors hover:text-foreground">{l.label}</button>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <span className="text-[11px] uppercase tracking-wider text-foreground/55 font-semibold">Lingua</span>
              <PrestigeLangToggle />
            </div>
            <button onClick={() => { setMenuOpen(false); navigate("/auth"); }} className="text-left text-sm font-medium text-foreground/74 transition-colors hover:text-foreground">Accedi</button>
            <button onClick={() => { setMenuOpen(false); scrollTo("#contatti"); }} className="landing-button-primary !text-black mt-1 px-6 py-3 text-center text-sm font-semibold">Inizia Ora</button>
          </motion.div>
        )}

      </nav>
    </>
  );
}
