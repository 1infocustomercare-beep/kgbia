/**
 * ═══ JET FILM PORTAL ═══
 * Adattamento 1:1 del blocco "film" del sito di riferimento: fotogramma
 * fermo con didascalia editoriale e riproduzione a schermo pieno del film.
 *
 * ADDITIVO — solo presentazione.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import cabinFilm from "@/assets/aurea-jet/cabin-scrub.mp4.asset.json";
import filmStill from "@/assets/aurea-jet/cabin-night.jpg";
import { LuxeCorners } from "@/components/public/luxe";

export default function JetFilmPortal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section className="relative bg-background px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <div>
          <h3 className="font-heading text-3xl font-semibold leading-tight sm:text-5xl">
            Ogni rotta ha la sua <span className="italic text-primary">ora</span>.
          </h3>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Un film di 10 secondi girato a bordo della cabina Aurea: la luce che cambia mentre
            il fuso orario si sposta e il servizio resta identico.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Rivedi il film, 10 secondi"
            className="group relative block w-full overflow-hidden border border-border/60"
          >
            <LuxeCorners />
            <img
              src={filmStill}
              width={1280}
              height={720}
              alt="Fotogramma del film a bordo della cabina Aurea"
              loading="lazy"
              decoding="async"
              className="aspect-video w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/15 to-transparent" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/60 bg-background/55 backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
              <Play className="ml-0.5 h-5 w-5 text-primary" />
            </span>
          </button>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            Il film «Ogni rotta ha la sua ora», 10 secondi.
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="min-h-9 border-b border-primary/60 text-primary"
            >
              Rivedi il film
            </button>
          </p>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-background/95 px-4 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Film Aurea Jet"
          >
            <motion.div
              className="relative w-full max-w-5xl"
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={cabinFilm.url}
                poster={filmStill}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="aspect-video w-full border border-border/60 bg-card object-cover"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Chiudi il film"
                className="absolute -top-14 right-0 flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-card/70 backdrop-blur-md"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
