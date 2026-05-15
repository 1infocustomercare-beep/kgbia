import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmpireLogo from "./EmpireLogo";

const NAV_LINKS = [
  { label: "Servizi", href: "#v2-services" },
  { label: "Settori", href: "#v2-sectors" },
  { label: "Catalogo", href: "#v2-portfolio" },
  { label: "Agent IA", href: "#v2-agents" },
  { label: "Pacchetti", href: "#v2-pricing" },
  { label: "Team", href: "#v2-team" },
  { label: "FAQ", href: "#v2-faq" },
];

export default function V2Nav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Scroll progress */}
      <div
        className="fixed left-0 top-0 z-[10005] h-[2px]"
        style={{
          width: `${progress}%`,
          background:
            "linear-gradient(90deg, hsl(158 70% 45%), hsl(42 75% 60%))",
          boxShadow: "0 0 10px hsl(42 75% 60% / 0.6)",
        }}
      />

      <nav
        className={`fixed inset-x-0 top-[2px] z-[1000] transition-all duration-500 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <div
            className={`flex w-full items-center justify-between rounded-full border px-4 py-2 transition-all duration-500 sm:px-5 ${
              scrolled
                ? "border-white/10 bg-[hsl(162_70%_6%/0.78)] backdrop-blur-2xl shadow-[0_24px_60px_-30px_hsl(0_0%_0%/0.9)]"
                : "border-transparent bg-transparent"
            }`}
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center"
              aria-label="Empire AI – Home"
            >
              <EmpireLogo size={34} withWordmark />
            </button>

            <ul className="hidden items-center gap-6 lg:flex">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => go(l.href)}
                    className="text-[13px] font-medium text-white/65 transition-colors hover:text-white"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="hidden items-center gap-2 lg:flex">
              <button
                onClick={() => navigate("/auth")}
                className="text-[13px] font-medium text-white/65 transition-colors hover:text-white"
              >
                Accedi
              </button>
              <button
                onClick={() => navigate("/onboarding")}
                className="rounded-full px-5 py-2 text-[13px] font-semibold text-[hsl(162_70%_8%)] shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(42 80% 76%), hsl(42 70% 56%) 60%, hsl(38 75% 42%))",
                }}
              >
                Inizia ora
              </button>
            </div>

            <button
              className="text-white lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="absolute inset-x-4 top-full mt-2 flex flex-col gap-3 rounded-3xl border border-white/10 bg-[hsl(162_70%_6%/0.95)] px-5 py-5 backdrop-blur-2xl lg:hidden">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="text-left text-sm font-medium text-white/75 hover:text-white"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                navigate("/onboarding");
              }}
              className="mt-2 rounded-full px-5 py-3 text-center text-sm font-semibold text-[hsl(162_70%_8%)]"
              style={{
                background:
                  "linear-gradient(135deg, hsl(42 80% 76%), hsl(42 70% 56%) 60%, hsl(38 75% 42%))",
              }}
            >
              Inizia ora
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
