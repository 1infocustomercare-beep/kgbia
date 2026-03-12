import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, RotateCcw, Smartphone, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveSitePreviewProps {
  slug: string;
  primaryColor?: string | null;
  companyName: string;
  onExpand?: () => void;
}

export function LiveSitePreview({ slug, primaryColor, companyName, onExpand }: LiveSitePreviewProps) {
  const [key, setKey] = useState(0);
  const previewUrl = `${window.location.origin}/b/${slug}`;
  const accent = primaryColor || "hsl(var(--primary))";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 25 }}
      className="flex flex-col items-center gap-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2 w-full max-w-[280px]">
        <div className="flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground/80">Live Preview</span>
        </div>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setKey(k => k + 1)}>
          <RotateCcw className="w-3 h-3" />
        </Button>
        {onExpand && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onExpand}>
            <Maximize2 className="w-3 h-3" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => window.open(previewUrl, "_blank")}
        >
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>

      {/* iPhone 16 Pro Frame */}
      <div className="relative group">
        {/* Ambient glow */}
        <div
          className="absolute -inset-4 rounded-[56px] opacity-20 blur-2xl pointer-events-none transition-opacity group-hover:opacity-30"
          style={{ background: accent }}
        />

        {/* Phone body */}
        <div className="relative w-[260px] h-[532px] rounded-[44px] border-[3px] border-foreground/15 bg-foreground/5 shadow-2xl overflow-hidden">
          {/* Dynamic Island */}
          <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-foreground rounded-full z-20" />
          
          {/* Side buttons */}
          <div className="absolute -left-[4px] top-[100px] w-[3px] h-[28px] bg-foreground/20 rounded-l-full" />
          <div className="absolute -left-[4px] top-[140px] w-[3px] h-[44px] bg-foreground/20 rounded-l-full" />
          <div className="absolute -left-[4px] top-[190px] w-[3px] h-[44px] bg-foreground/20 rounded-l-full" />
          <div className="absolute -right-[4px] top-[130px] w-[3px] h-[60px] bg-foreground/20 rounded-r-full" />

          {/* Screen */}
          <div className="absolute inset-[3px] rounded-[40px] overflow-hidden bg-background">
            <iframe
              key={key}
              src={previewUrl}
              className="w-[393px] h-[852px] border-0 origin-top-left"
              style={{ transform: "scale(0.648)", transformOrigin: "top left" }}
              title={`Anteprima ${companyName}`}
            />
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[110px] h-[4px] bg-foreground/25 rounded-full z-20" />
        </div>
      </div>

      {/* Label */}
      <p className="text-[10px] text-muted-foreground text-center">
        iPhone 16 Pro • Aggiornamento in tempo reale
      </p>
    </motion.div>
  );
}
