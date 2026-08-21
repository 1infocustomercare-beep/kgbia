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
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div
        className={`flex h-16 items-center justify-between gap-3 px-4 transition-colors duration-500 sm:h-20 sm:px-8 lg:px-14 ${
          scrolled ? "border-b border-primary/15 jet-dock backdrop-blur-2xl" : "border-b border-transparent"
        }`}
      >
        <a href="#top" className="ml-12 flex items-center gap-3 sm:ml-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/45 bg-background/55 backdrop-blur-xl">
            <Plane className="h-5 w-5 text-primary" />
          </span>
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.22em]">Aurea Jet</span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Private Aviation</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 rounded-2xl border border-primary/15 bg-background/50 p-1 backdrop-blur-xl lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-xl px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:bg-primary/12 hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-xl border border-primary/20 bg-background/55 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-xl md:inline-flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Flight desk · {clock}
          </span>
          <Button
            asChild
            size="sm"
            className="hidden min-h-11 rounded-xl px-5 uppercase tracking-[0.14em] sm:inline-flex"
          >
            <a href="#preventivo">
              Richiedi un volo <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
          <button
            type="button"
            aria-label={open ? "Chiudi menu" : "Apri menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex h-11 w-11 items-center justify-center jet-dock rounded-xl text-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-b border-primary/15 bg-[hsl(30_10%_5%/0.96)] px-5 pb-6 pt-3 backdrop-blur-2xl lg:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center justify-between border-b border-border/40 text-xs font-semibold uppercase tracking-[0.22em] text-foreground/80"
            >
              {l.label}
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </a>
          ))}
          <Button asChild size="lg" className="mt-5 min-h-12 w-full rounded-xl uppercase tracking-[0.14em]">
            <a href="#preventivo" onClick={() => setOpen(false)}>Richiedi un volo</a>
          </Button>
        </div>
      )}
    </header>
  );
}
