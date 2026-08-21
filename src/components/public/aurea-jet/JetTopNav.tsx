/**
 * ═══ JET TOP NAV ═══
 * Header in stile web-app di ultima generazione: identità, stato flight desk
 * live, navigazione a pill segmentate, azione primaria. Trasparente sulla hero,
 * vetro scuro dopo lo scroll, si nasconde scendendo e ricompare salendo.
 */
import { useEffect, useState } from "react";
import { Plane, Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#flotta", label: "Flotta" },
  { href: "#preventivo", label: "Rotta" },
  { href: "#app", label: "Deck" },
  { href: "#servizi", label: "Servizi" },
  { href: "#richiesta", label: "Contatti" },
];

export default function JetTopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [clock, setClock] = useState("");

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

  useEffect(() => {
    const sync = () =>
      setClock(new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit" }).format(new Date()));
    sync();
    const id = window.setInterval(sync, 30000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 sm:px-6 sm:pt-4 lg:px-10 ${hidden && !open ? "-translate-y-[130%]" : "translate-y-0"}`}
    >
      <div
        className={`jet-sheen relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 overflow-hidden rounded-[26px] px-3 transition-all duration-500 sm:h-[68px] sm:px-5 ${
          scrolled || open ? "jet-dock" : "border border-primary/12 bg-[hsl(30_10%_6%/0.28)] backdrop-blur-xl"
        }`}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.5), transparent)" }}
        />

        <a href="#top" className="ml-11 flex items-center gap-3 sm:ml-0">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-primary/35 backdrop-blur-xl"
            style={{
              background: "linear-gradient(160deg, hsl(var(--primary) / 0.22), hsl(30 10% 6% / 0.6))",
              boxShadow: "inset 0 1px 0 hsl(var(--primary) / 0.35)",
            }}
          >
            <Plane strokeWidth={1.3} className="h-[18px] w-[18px] text-primary" />
          </span>
          <span>
            <span className="jet-serif block text-[15px] leading-none tracking-[0.14em]">Aurea Jet</span>
            <span className="mt-1 block text-[9px] uppercase tracking-[0.28em] text-muted-foreground">Private Aviation</span>
          </span>
        </a>

        <nav className="hidden items-center gap-0.5 rounded-[18px] border border-primary/14 bg-[hsl(30_10%_6%/0.45)] p-1 backdrop-blur-xl lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-[14px] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-all duration-300 hover:bg-primary/12 hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-[14px] border border-primary/18 bg-[hsl(30_10%_6%/0.5)] px-3 py-2 text-[9px] uppercase tracking-[0.24em] text-muted-foreground backdrop-blur-xl md:inline-flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Flight desk · {clock}
          </span>
          <Button
            asChild
            size="sm"
            className="hidden min-h-10 rounded-[14px] px-5 text-[10px] uppercase tracking-[0.2em] sm:inline-flex"
          >
            <a href="#preventivo">
              Richiedi un volo <ArrowUpRight strokeWidth={1.4} className="h-4 w-4" />
            </a>
          </Button>
          <button
            type="button"
            aria-label={open ? "Chiudi menu" : "Apri menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-primary/25 bg-[hsl(30_10%_6%/0.55)] text-foreground backdrop-blur-xl transition-colors hover:border-primary/45 lg:hidden"
          >
            {open ? <X strokeWidth={1.4} className="h-5 w-5" /> : <Menu strokeWidth={1.4} className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="jet-dock mx-auto mt-2 max-w-6xl rounded-[24px] px-5 pb-5 pt-2 lg:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center justify-between border-b border-primary/10 text-[11px] font-semibold uppercase tracking-[0.26em] text-foreground/80 transition-colors hover:text-primary"
            >
              {l.label}
              <ArrowUpRight strokeWidth={1.4} className="h-4 w-4 text-primary" />
            </a>
          ))}
          <Button asChild size="lg" className="mt-5 min-h-12 w-full rounded-[16px] text-[11px] uppercase tracking-[0.2em]">
            <a href="#preventivo" onClick={() => setOpen(false)}>Richiedi un volo</a>
          </Button>
        </div>
      )}
    </header>
  );
}

