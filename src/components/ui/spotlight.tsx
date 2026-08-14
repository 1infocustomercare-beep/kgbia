import { cn } from "@/lib/utils";

interface SpotlightProps {
  className?: string;
  /** Colore del cono di luce (qualsiasi valore CSS valido). */
  fill?: string;
}

/**
 * Spotlight — cono di luce animato usato dietro le scene 3D.
 * Nessuna dipendenza: solo SVG + animazione CSS.
 */
export function Spotlight({ className, fill = "white" }: SpotlightProps) {
  return (
    <svg
      className={cn(
        "animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] opacity-0 lg:w-[84%]",
        className,
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
      aria-hidden="true"
    >
      <g filter="url(#spotlight-blur)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill}
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id="spotlight-blur"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur" />
        </filter>
      </defs>
      <style>{`
        @keyframes spotlight-in {
          0% { opacity: 0; transform: translate(-72%, -62%) scale(0.5); }
          100% { opacity: 1; transform: translate(-50%, -40%) scale(1); }
        }
        .animate-spotlight { animation: spotlight-in 2.4s ease .35s 1 forwards; }
        @media (prefers-reduced-motion: reduce) {
          .animate-spotlight { animation: none; opacity: 1; transform: translate(-50%, -40%); }
        }
      `}</style>
    </svg>
  );
}

export default Spotlight;
