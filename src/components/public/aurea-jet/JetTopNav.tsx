/**
 * ═══ JET TOP NAV ═══
 * Barra di navigazione premium: trasparente sulla hero, vetro scuro dopo lo
 * scroll, si nasconde scendendo e ricompare salendo.
 */
import { useEffect, useState } from "react";
import { Plane, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#flotta", label: "Flotta" },
  { href: "#servizi", label: "Servizi" },
  { href: "#preventivo", label: "Preventivo" },
  { href: "#richiesta", label: "Contatti" },
];

export default function JetTopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setHidden(y > 320 && y > last + 6);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div
        className={`flex h-16 items-center justify-between px-5 transition-colors duration-500 sm:h-20 sm:px-10 lg:px-16 ${
          scrolled ? "border-b border-border/40 bg-background/70 backdrop-blur-2xl" : "border-b border-transparent"
        }`}
      >
        <a href="#top" className="ml-12 flex items-center gap-3 sm:ml-0">
          <span className="flex h-10 w-10 items-center justify-center border border-primary/45 bg-background/55 backdrop-blur-xl">
            <Plane className="h-5 w-5 text-primary" />
          </span>
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.22em]">Aurea Jet</span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Private Aviation</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden min-h-11 rounded-none px-5 uppercase tracking-[0.14em] sm:inline-flex">
            <a href="#preventivo">Richiedi un volo</a>
          </Button>
          <button
            type="button"
            aria-label={open ? "Chiudi menu" : "Apri menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex h-11 w-11 items-center justify-center border border-border/60 bg-background/60 text-foreground backdrop-blur-xl lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-b border-border/40 bg-background/95 px-5 pb-6 pt-2 backdrop-blur-2xl lg:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center border-b border-border/40 text-xs font-semibold uppercase tracking-[0.22em] text-foreground/80"
            >
              {l.label}
            </a>
          ))}
          <Button asChild size="lg" className="mt-5 min-h-12 w-full rounded-none uppercase tracking-[0.14em]">
            <a href="#preventivo" onClick={() => setOpen(false)}>Richiedi un volo</a>
          </Button>
        </div>
      )}
    </header>
  );
}
