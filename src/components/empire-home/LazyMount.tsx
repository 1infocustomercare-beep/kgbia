import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Monta i children SOLO quando il wrapper entra nel viewport.
 * Indispensabile per componenti WebGL/canvas che si inizializzano una sola
 * volta nell'effect: se vengono mountati fuori viewport, il canvas resta
 * 0x0 e l'effetto non parte mai.
 *
 * Una volta montati, restano montati (no unmount on scroll-out) per evitare
 * crash `insertBefore` causati da React che ricostruisce il DOM mentre
 * Lenis/GSAP lo stanno animando.
 */
type Props = {
  children: ReactNode;
  /** Altezza minima della sezione mentre non è ancora montata (evita layout shift). */
  minHeight?: string;
  /** Margine root dell'observer — anticipa il mount prima che la sezione sia visibile. */
  rootMargin?: string;
  className?: string;
  id?: string;
};

export default function LazyMount({
  children,
  minHeight = "60vh",
  rootMargin = "300px 0px",
  className,
  id,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    const el = ref.current;
    if (!el) return;

    // Fallback se IntersectionObserver non supportato
    if (typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setMounted(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin, threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted, rootMargin]);

  return (
    <div
      ref={ref}
      id={id}
      className={className}
      style={{ minHeight }}
    >
      {mounted ? children : null}
    </div>
  );
}
