import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Menu, X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import empireLogoNew from "@/assets/empire-logo-new.png";

const NAV_LINKS = [
  { href: "#industries", label: "Settori" },
  { href: "#services", label: "Funzionalità" },
  { href: "#pricing", label: "Prezzi" },
];

export default function LandingNav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 pt-[env(safe-area-inset-top)]`}>
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundColor: scrolled ? "hsla(230,12%,6%,0.94)" : "hsla(230,12%,6%,0.75)",
          backdropFilter: scrolled ? "blur(40px) saturate(1.8)" : "blur(20px) saturate(1.4)",
        }}
        transition={{ duration: 0.8 }}
      />

      {/* Top accent line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[1.5px]"
        style={{
          background: "linear-gradient(90deg, transparent, hsla(38,50%,55%,0.5) 30%, hsla(38,50%,55%,0.3) 70%, transparent)",
          backgroundSize: "300% 100%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "300% 0%"], opacity: scrolled ? 1 : 0 }}
        transition={{ backgroundPosition: { duration: 5, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.6 } }}
      />

      {/* Bottom line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        animate={{ opacity: scrolled ? 1 : 0 }}
        style={{ background: "linear-gradient(90deg, transparent 2%, hsla(38,50%,55%,0.3) 25%, hsla(38,50%,55%,0.2) 50%, hsla(38,50%,55%,0.3) 75%, transparent 98%)" }}
      />

      {/* Scanning beam */}
      {scrolled && (
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] w-32 pointer-events-none rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, hsla(35,50%,60%,0.6), hsla(38,55%,58%,0.9), transparent)", boxShadow: "0 0 16px hsla(38,55%,58%,0.5)" }}
          animate={{ x: ["-15vw", "115vw"] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "linear", repeatDelay: 0.8 }}
        />
      )}

      <div className="relative max-w-[1200px] mx-auto px-3 sm:px-6 flex items-center justify-between h-14 sm:h-[4.5rem] py-[14px]">
        {/* Desktop left links */}
        <div className="hidden lg:flex items-center gap-1 flex-1">
          {NAV_LINKS.slice(0, 2).map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="px-5 py-2.5 text-[0.68rem] font-medium text-white/70 hover:text-white transition-all tracking-[0.18em] uppercase rounded-xl"
              whileHover={{ backgroundColor: "hsla(38,45%,55%,0.08)" }}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* Centered Logo */}
        <a href="#hero" className="flex items-center gap-3 group absolute left-1/2 -translate-x-1/2 z-10">
          <motion.div
            className="absolute -inset-14 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, hsla(38,40%,55%,0.12), transparent 60%)" }}
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(145deg, hsla(38,45%,20%,1), hsla(35,40%,14%,1), hsla(30,35%,10%,1))",
              boxShadow: "0 0 0 2px hsla(38,50%,50%,0.3), 0 0 40px hsla(38,50%,50%,0.15), 0 8px 32px hsla(0,0%,0%,0.4)",
            }}
            whileHover={{ scale: 1.12, rotate: -5 }}
          >
            <motion.div
              className="absolute -inset-1 rounded-full pointer-events-none"
              style={{ border: "1px solid transparent", borderTopColor: "hsla(38,45%,55%,0.35)" }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            <img src={empireLogoNew} alt="Empire AI" className="w-[85%] h-[85%] rounded-full object-cover" />
            <motion.div
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full z-10"
              style={{ backgroundColor: "hsla(160,50%,50%,0.9)", boxShadow: "0 0 8px hsla(160,50%,50%,0.6)" }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <div className="flex flex-col leading-none gap-1">
            <motion.span
              className="font-heading font-bold text-[0.9rem] sm:text-[1.1rem] tracking-[0.4em] uppercase"
              style={{
                background: "linear-gradient(135deg, hsla(0,0%,95%,1), hsla(38,30%,78%,1), hsla(0,0%,95%,1))",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              EMPIRE
            </motion.span>
            <span className="text-[0.42rem] sm:text-[0.52rem] tracking-[0.45em] uppercase font-medium text-center" style={{ color: "hsla(38,35%,58%,0.7)" }}>
              AUTONOMOUS AI
            </span>
          </div>
        </a>

        {/* Desktop right links + CTA */}
        <div className="hidden lg:flex items-center gap-1 flex-1 justify-end">
          {NAV_LINKS.slice(2).map((link) => (
            <motion.a key={link.href} href={link.href} className="px-5 py-2.5 text-[0.68rem] font-medium text-white/70 hover:text-white transition-all tracking-[0.18em] uppercase rounded-xl" whileHover={{ backgroundColor: "hsla(38,45%,55%,0.08)" }}>
              {link.label}
            </motion.a>
          ))}
          <motion.button onClick={() => navigate("/auth?mode=login")} className="ml-3 px-6 py-3 rounded-full text-white/80 text-[0.65rem] font-medium tracking-[0.18em] uppercase" style={{ background: "hsla(0,0%,100%,0.06)", border: "1px solid hsla(0,0%,100%,0.12)" }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
            <span className="flex items-center gap-2"><Lock className="w-3.5 h-3.5 opacity-70" /> Accedi</span>
          </motion.button>
          <motion.button
            onClick={() => navigate("/auth")}
            className="ml-2 px-8 py-3 rounded-full text-primary-foreground text-[0.65rem] font-bold tracking-[0.22em] uppercase relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsla(38,55%,48%,1), hsla(34,50%,42%,1), hsla(30,45%,38%,1))",
              boxShadow: "0 4px 28px hsla(38,55%,50%,0.3), 0 0 0 1px hsla(38,55%,60%,0.2)",
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.35) 46%, transparent 75%)" }} animate={{ x: ["-130%", "230%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }} />
            <span className="relative z-10 flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> Inizia Ora</span>
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <motion.button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2.5 text-foreground rounded-xl" whileTap={{ scale: 0.92 }}>
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="w-5 h-5" /></motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Menu className="w-5 h-5" /></motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden" style={{ backgroundColor: "hsla(230,12%,5%,0.94)", backdropFilter: "blur(40px)" }}>
            <div className="flex flex-col items-center gap-1 py-6 px-5">
              {NAV_LINKS.map((link, i) => (
                <motion.a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="w-full text-center py-3.5 text-xs font-medium text-white/60 hover:text-white rounded-xl transition-all tracking-[0.2em] uppercase">
                  {link.label}
                </motion.a>
              ))}
              <div className="w-full h-px my-2" style={{ background: "linear-gradient(90deg, transparent, hsla(38,50%,55%,0.2), transparent)" }} />
              <motion.button onClick={() => { setMenuOpen(false); navigate("/auth?mode=login"); }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="w-full py-3 rounded-xl text-xs font-heading font-semibold tracking-wider uppercase text-white/60" style={{ border: "1px solid hsla(0,0%,100%,0.08)", background: "hsla(0,0%,100%,0.04)" }}>
                <Lock className="w-3 h-3 inline mr-2 opacity-60" />Accedi
              </motion.button>
              <motion.button onClick={() => { setMenuOpen(false); navigate("/auth"); }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full py-3.5 rounded-xl text-xs font-heading font-bold tracking-wider uppercase text-primary-foreground relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsla(38,55%,48%,1), hsla(30,45%,38%,1))", boxShadow: "0 4px 28px hsla(38,55%,50%,0.25)" }}>
                <motion.div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)" }} animate={{ x: ["-200%", "300%"] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }} />
                <span className="relative z-10"><Sparkles className="w-3.5 h-3.5 inline mr-2" />Inizia Ora</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
