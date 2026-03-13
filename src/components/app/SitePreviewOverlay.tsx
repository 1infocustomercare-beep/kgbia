import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, Smartphone, Monitor, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SitePreviewOverlayProps {
  slug: string;
  companyName: string;
  open: boolean;
  onClose: () => void;
  industry?: string;
}

type DeviceMode = "mobile" | "tablet" | "desktop";

const DEVICE_SIZES: Record<DeviceMode, { w: number; h: number; label: string }> = {
  mobile: { w: 393, h: 852, label: "iPhone 16 Pro" },
  tablet: { w: 820, h: 1180, label: "iPad Air" },
  desktop: { w: 1280, h: 800, label: "Desktop" },
};

export function SitePreviewOverlay({ slug, companyName, open, onClose }: SitePreviewOverlayProps) {
  const [device, setDevice] = useState<DeviceMode>("mobile");
  const previewUrl = `${window.location.origin}/b/${slug}`;
  const size = DEVICE_SIZES[device];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col"
        >
          {/* Header */}
          <div className="h-14 flex items-center gap-3 px-4 border-b border-border/50 bg-card/60 backdrop-blur-xl shrink-0">
            <Button variant="ghost" size="sm" onClick={onClose} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Torna al Pannello</span>
            </Button>

            <div className="flex-1 text-center">
              <p className="text-sm font-semibold">{companyName}</p>
              <p className="text-[10px] text-muted-foreground">Anteprima Sito Web</p>
            </div>

            {/* Device switcher */}
            <div className="flex items-center gap-1 bg-secondary/40 rounded-lg p-0.5">
              {([
                { mode: "mobile" as DeviceMode, icon: Smartphone },
                { mode: "tablet" as DeviceMode, icon: Tablet },
                { mode: "desktop" as DeviceMode, icon: Monitor },
              ]).map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setDevice(mode)}
                  className={`p-1.5 rounded-md transition-colors ${
                    device === mode
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(previewUrl, "_blank")}
              className="gap-1.5 hidden sm:flex"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Apri
            </Button>
          </div>

          {/* Preview area */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <motion.div
              key={device}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative"
              style={{
                width: device === "desktop" ? "100%" : `min(${size.w}px, 100%)`,
                maxWidth: size.w,
                height: device === "desktop" ? "100%" : `min(${size.h}px, calc(100vh - 120px))`,
                maxHeight: `calc(100vh - 120px)`,
              }}
            >
              {/* iPhone frame for mobile */}
              {device === "mobile" && (
                <div className="relative w-full h-full rounded-[44px] border-[3px] border-foreground/20 bg-foreground/5 shadow-2xl overflow-hidden">
                  {/* Dynamic Island */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-foreground rounded-full z-20" />
                  {/* Screen */}
                  <div className="absolute inset-[3px] rounded-[40px] overflow-hidden bg-background">
                    <iframe
                      src={previewUrl}
                      className="w-full h-full border-0"
                      title="Anteprima sito"
                    />
                  </div>
                  {/* Home indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-foreground/30 rounded-full z-20" />
                </div>
              )}

              {/* Tablet frame */}
              {device === "tablet" && (
                <div className="relative w-full h-full rounded-[20px] border-[3px] border-foreground/20 bg-foreground/5 shadow-2xl overflow-hidden">
                  <div className="absolute inset-[3px] rounded-[16px] overflow-hidden bg-background">
                    <iframe
                      src={previewUrl}
                      className="w-full h-full border-0"
                      title="Anteprima sito"
                    />
                  </div>
                </div>
              )}

              {/* Desktop frame */}
              {device === "desktop" && (
                <div className="w-full h-full rounded-xl border border-border/50 shadow-2xl overflow-hidden bg-background">
                  <div className="h-8 bg-card/80 border-b border-border/30 flex items-center gap-1.5 px-3">
                    <div className="w-3 h-3 rounded-full bg-red-400/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                    <div className="w-3 h-3 rounded-full bg-green-400/60" />
                    <div className="flex-1 mx-3">
                      <div className="bg-secondary/50 rounded-md px-3 py-0.5 text-[10px] text-muted-foreground text-center truncate">
                        {previewUrl}
                      </div>
                    </div>
                  </div>
                  <iframe
                    src={previewUrl}
                    className="w-full border-0"
                    style={{ height: "calc(100% - 32px)" }}
                    title="Anteprima sito"
                  />
                </div>
              )}
            </motion.div>
          </div>

          {/* Footer info */}
          <div className="h-8 flex items-center justify-center text-[10px] text-muted-foreground border-t border-border/30">
            {size.label} • {size.w}×{size.h}px • Le modifiche al pannello si riflettono in tempo reale
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
