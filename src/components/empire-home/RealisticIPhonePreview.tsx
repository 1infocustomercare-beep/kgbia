import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type RealisticIPhonePreviewProps = {
  src: string;
  alt: string;
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
  priority?: boolean;
  className?: string;
  screenClassName?: string;
};

const sizeClass = {
  sm: "w-[112px] sm:w-[132px]",
  md: "w-[164px] sm:w-[196px]",
  lg: "w-[210px] sm:w-[244px] md:w-[268px]",
  xl: "w-[226px] sm:w-[268px] md:w-[304px]",
};

const RealisticIPhonePreview = forwardRef<HTMLElement, RealisticIPhonePreviewProps>(function RealisticIPhonePreview({
  src,
  alt,
  label,
  size = "md",
  priority = false,
  className,
  screenClassName,
}, ref) {
  return (
    <figure ref={ref} className={cn("relative flex flex-col items-center", className)}>
      <div className={cn("relative aspect-[9/19.5] shrink-0", sizeClass[size])}>
        <div
          aria-hidden
          className="absolute -bottom-[7%] left-1/2 h-[12%] w-[78%] -translate-x-1/2 rounded-full opacity-70 blur-2xl"
          style={{ background: "radial-gradient(ellipse, hsl(var(--primary) / 0.42), transparent 68%)" }}
        />

        <div
          aria-hidden
          className="absolute -left-[2.2%] top-[18%] h-[7.8%] w-[1.5%] rounded-l-full"
          style={{ background: "linear-gradient(90deg, hsl(var(--muted)), hsl(var(--deep-black)))" }}
        />
        <div
          aria-hidden
          className="absolute -left-[2.2%] top-[29%] h-[11%] w-[1.5%] rounded-l-full"
          style={{ background: "linear-gradient(90deg, hsl(var(--muted)), hsl(var(--deep-black)))" }}
        />
        <div
          aria-hidden
          className="absolute -right-[2.2%] top-[31%] h-[14%] w-[1.5%] rounded-r-full"
          style={{ background: "linear-gradient(270deg, hsl(var(--muted)), hsl(var(--deep-black)))" }}
        />

        <div
          className="absolute inset-0 overflow-hidden rounded-[2.35rem] p-[2.8%] sm:rounded-[2.8rem]"
          style={{
            background:
              "linear-gradient(145deg, hsl(var(--foreground) / 0.24), hsl(var(--deep-black)) 38%, hsl(var(--foreground) / 0.12) 72%, hsl(var(--muted) / 0.16))",
            boxShadow:
              "0 34px 88px -34px hsl(0 0% 0% / 0.95), 0 18px 50px -32px hsl(var(--primary) / 0.7), inset 0 1px 0 hsl(var(--foreground) / 0.22)",
          }}
        >
          <div
            className="relative h-full w-full overflow-hidden rounded-[2rem] sm:rounded-[2.45rem]"
            style={{
              background: "hsl(var(--deep-black))",
              boxShadow: "inset 0 0 0 1px hsl(var(--foreground) / 0.12), inset 0 0 0 5px hsl(0 0% 0% / 0.72)",
            }}
          >
            <img
              src={src}
              alt={alt}
              className={cn("h-full w-full object-cover", screenClassName)}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
            />

            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[2.3%] z-20 h-[4.7%] w-[33%] -translate-x-1/2 rounded-full"
              style={{
                background: "hsl(0 0% 0%)",
                boxShadow: "0 0 0 1px hsl(var(--foreground) / 0.08), inset 0 -1px 1px hsl(var(--foreground) / 0.08)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10"
              style={{
                background:
                  "linear-gradient(116deg, hsl(var(--foreground) / 0.15) 0%, transparent 28%, transparent 64%, hsl(var(--foreground) / 0.06) 100%)",
                mixBlendMode: "screen",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-[1.5%] left-1/2 z-20 h-[0.8%] w-[34%] -translate-x-1/2 rounded-full"
              style={{ background: "hsl(var(--foreground) / 0.38)" }}
            />
          </div>
        </div>
      </div>

      {label ? (
        <figcaption className="mt-3 max-w-[14rem] text-center text-[10px] font-black uppercase tracking-[0.24em] text-foreground/62">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
});

export default RealisticIPhonePreview;
