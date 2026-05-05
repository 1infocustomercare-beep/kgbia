
import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils"; // We'll define this or use inline

// Helper for random colors
const randomColors = (count: number) => {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
}

export const TubesBackground = React.forwardRef<HTMLDivElement, TubesBackgroundProps>(function TubesBackground({ 
  children, 
  className,
  enableClickInteraction = true 
}: TubesBackgroundProps, forwardedRef) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setRootRef = (node: HTMLDivElement | null) => {
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };
  const [isLoaded, setIsLoaded] = useState(false);
  const tubesRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        // We use the specific build from the CDN as it contains the exact effect requested
        // Using native dynamic import which works in modern browsers
        // @ts-ignore
        const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
        const TubesCursor = module.default;

        if (!mounted) return;

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#f967fb", "#53bc28", "#6958d5"],
            lights: {
              intensity: 200,
              colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
            }
          }
        });

        tubesRef.current = app;
        setIsLoaded(true);

        // Handle resize if the library doesn't automatically
        const handleResize = () => {
          // The library might handle it, but typically we ensure canvas matches container
          // For this specific lib, it likely attaches to window resize or we might need to manually resize
        };

        window.addEventListener('resize', handleResize);
        
        cleanup = () => {
          window.removeEventListener('resize', handleResize);
          try {
            app?.destroy?.();
            app?.dispose?.();
            app?.renderer?.dispose?.();
          } catch {}
          tubesRef.current = null;
        };

      } catch (error) {
        console.error("Failed to load TubesCursor:", error);
      }
    };

    initTubes();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;
    
    const colors = randomColors(3);
    const lightsColors = randomColors(4);
    
    tubesRef.current.tubes.setColors(colors);
    tubesRef.current.tubes.setLightsColors(lightsColors);
  };

  return (
    <div 
      ref={setRootRef}
      className={cn("relative w-full h-full min-h-[400px] overflow-hidden bg-background", className)}
      onClick={handleClick}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block"
        style={{ touchAction: 'none' }}
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {children}
      </div>
    </div>
  );
});

// Default export
export default TubesBackground;