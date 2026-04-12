import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="fixed top-0 left-0 h-[3px] z-[10002] rounded-r-sm" style={{ width: `${scrollPct}%`, background: "linear-gradient(135deg, #7eb7be, #6c3ce0)" }} />
      <nav className={`fixed top-[3px] w-full z-[1000] transition-all duration-500 ${scrolled ? "bg-[rgba(2,2,4,0.92)] backdrop-blur-[24px] backdrop-saturate-[180%] border-b border-white/[0.07] py-2.5 px-5 sm:px-10" : "py-3.5 px-5 sm:px-10"}`}>
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5 text-xl font-extrabold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <div className="w-9 h-9 rounded-xl grid place-items-center text-white text-[15px] font-extrabold" style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", boxShadow: "0 4px 16px rgba(126,183,190,0.3)" }}>E</div>
            <span className="text-[#f0f0f5]">EMPIRE.AI</span>
          </button>
          <ul className="hidden lg:flex gap-7 list-none">
            {NAV_LINKS.map(l => (
              <li key={l.href}>
                <button onClick={() => scrollTo(l.href)} className="text-[rgba(240,240,245,0.55)] text-[13px] font-medium hover:text-[#f0f0f5] transition-colors relative group">
                  {l.label}
                  <span className="absolute bottom-[-3px] left-0 w-0 h-[1.5px] bg-[#7eb7be] group-hover:w-full transition-all duration-300" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-3 items-center">
            <button onClick={() => scrollTo("#prezzi")} className="hidden lg:inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm text-white hover:translate-y-[-3px] transition-all" style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", fontFamily: "'Space Grotesk', sans-serif", boxShadow: "0 16px 48px rgba(126,183,190,0.25)" }}>Inizia Ora</button>
            <button className="lg:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
              <span className={`block w-[22px] h-[2px] bg-[#f0f0f5] my-[5px] transition-all ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block w-[22px] h-[2px] bg-[#f0f0f5] my-[5px] transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-[22px] h-[2px] bg-[#f0f0f5] my-[5px] transition-all ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden absolute top-[60px] left-0 right-0 bg-[rgba(2,2,4,0.97)] backdrop-blur-[20px] flex flex-col p-6 gap-4 border-b border-white/[0.07]">
            {NAV_LINKS.map(l => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="text-[rgba(240,240,245,0.55)] text-sm font-medium text-left hover:text-[#7eb7be] transition-colors">{l.label}</button>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
