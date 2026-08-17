import React, { Suspense, useEffect, useRef, useState } from "react";

/**
 * DeferredSection — monta i figli solo quando la sezione si avvicina al viewport.
 *
 * Serve a ridurre il costo di TBT/LCP della home: le sezioni sotto la piega
 * (portfolio, agents, prezzi, footer…) non vengono renderizzate — né i loro
 * chunk scaricati — fino a ~800px prima di entrare in vista.
 *
 * Per non introdurre CLS il placeholder riserva `minHeight` esattamente come
 * il contenuto reale, e l'altezza viene rilasciata solo dopo il mount.
 */
export default function DeferredSection({
  children,
  minHeight = 480,
  rootMargin = "800px 0px",
  className,
  id,
}: {
  children: React.ReactNode;
  minHeight?: number | string;
  rootMargin?: string;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, rootMargin]);

  return (
    <div
      ref={ref}
      id={id}
      className={className}
      style={visible ? undefined : { minHeight }}
    >
      {visible ? (
        <Suspense fallback={<div style={{ minHeight }} aria-hidden />}>{children}</Suspense>
      ) : null}
    </div>
  );
}

/** Monta i figli quando il browser è idle (o dopo `delay` ms come fallback). */
export function IdleMount({
  children,
  delay = 2500,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const go = () => !cancelled && setReady(true);
    const ric = (window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;
    const timer = window.setTimeout(go, delay);
    if (ric) ric(go, { timeout: delay });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [delay]);

  if (!ready) return null;
  return <Suspense fallback={null}>{children}</Suspense>;
}
