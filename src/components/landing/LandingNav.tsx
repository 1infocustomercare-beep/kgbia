import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import empireLogo from "@/assets/empire-logo-full.png";

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

      <nav className={`fixed top-[3px] z-[1000] w-full transition-all duration-500 ${scrolled ? "py-2.5" : "py-4"}`}>
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 sm:px-5 lg:px-10">
          <div className={`w-full rounded-full border px-4 sm:px-5 transition-all duration-500 ${scrolled ? "border-border/80 bg-background/70 shadow-[0_24px_72px_-42px_hsl(0_0%_0%_/_0.85)] backdrop-blur-2xl" : "border-transparent bg-transparent"}`}>
            <div className="flex items-center justify-between py-2.5">
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex items-center gap-2.5 font-heading text-base font-extrabold tracking-normal text-foreground sm:gap-3 sm:text-xl"
            aria-label="Empire AI — Home"
          >
            <span className="grid h-9 w-[118px] place-items-center overflow-hidden rounded-2xl border border-primary/30 bg-[linear-gradient(135deg,hsl(var(--primary)/0.18),hsl(var(--empire-violet)/0.18),hsl(var(--gold)/0.16))] px-3 shadow-[0_18px_38px_-20px_hsl(var(--primary)/0.8)] sm:h-10 sm:w-[140px]">
              <img
                src={empireLogo}
                alt="Empire AI"
                className="h-6 w-full object-contain sm:h-7"
                loading="eager"
                decoding="async"
              />
            </span>
          </a>

          <ul className="hidden lg:flex gap-7">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <button onClick={() => scrollTo(l.href)} className="text-[13px] font-medium text-foreground/60 transition-colors hover:text-foreground">{l.label}</button>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex gap-3 items-center">
            <button onClick={() => navigate("/auth")} className="text-[13px] font-medium text-foreground/60 transition-colors hover:text-foreground">Accedi</button>
            <button onClick={() => scrollTo("#contatti")} className="landing-button-primary px-6 py-2.5 text-sm font-semibold">Inizia Ora</button>
          </div>

          <button className="text-foreground lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
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
            <button onClick={() => { setMenuOpen(false); scrollTo("#contatti"); }} className="landing-button-primary mt-2 px-6 py-3 text-center text-sm font-semibold">Inizia Ora</button>
          </motion.div>
        )}
      </nav>
    </>
  );
}
