import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { label: "Settori", href: "#settori" },
  { label: "Servizi", href: "#servizi" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Prezzi", href: "#prezzi" },
  { label: "AI Agents", href: "#agenti" },
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
      <div className="fixed top-0 left-0 h-[3px] z-[10002]" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #c9a84c, #e8c47a)", borderRadius: "0 2px 2px 0" }} />

      <nav className={`fixed top-[3px] w-full z-[1000] transition-all duration-500 ${scrolled ? "py-2.5 bg-[rgba(6,8,24,0.95)] backdrop-blur-[24px] border-b border-white/[0.06]" : "py-3.5"}`}>
        <div className="flex items-center justify-between max-w-[1400px] mx-auto px-5 lg:px-10">
          <a href="#hero" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex items-center gap-2.5 font-heading font-extrabold text-xl text-white">
            <div className="w-9 h-9 rounded-xl grid place-items-center text-black text-sm font-extrabold shadow-lg" style={{ background: "linear-gradient(135deg, #c9a84c, #e8c47a)", boxShadow: "0 4px 16px rgba(201,168,76,0.3)" }}>E</div>
            EMPIRE.AI
          </a>

          <ul className="hidden lg:flex gap-7">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <button onClick={() => scrollTo(l.href)} className="text-white/55 text-[13px] font-medium hover:text-[#c9a84c] transition-colors">{l.label}</button>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex gap-3 items-center">
            <button onClick={() => navigate("/auth")} className="text-white/55 text-[13px] font-medium hover:text-white transition-colors">Accedi</button>
            <button onClick={() => scrollTo("#prezzi")} className="px-6 py-2.5 rounded-full text-black font-bold text-sm" style={{ background: "linear-gradient(135deg, #c9a84c, #e8c47a)" }}>Inizia Ora</button>
          </div>

          <button className="lg:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="lg:hidden absolute top-full left-0 right-0 bg-[rgba(6,8,24,0.98)] backdrop-blur-[20px] border-b border-white/[0.06] py-6 px-5 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="text-white/70 text-sm font-medium hover:text-[#c9a84c] transition-colors text-left">{l.label}</button>
            ))}
            <button onClick={() => { setMenuOpen(false); scrollTo("#prezzi"); }} className="mt-2 px-6 py-3 rounded-full text-black font-bold text-sm text-center" style={{ background: "linear-gradient(135deg, #c9a84c, #e8c47a)" }}>Inizia Ora</button>
          </motion.div>
        )}
      </nav>
    </>
  );
}
