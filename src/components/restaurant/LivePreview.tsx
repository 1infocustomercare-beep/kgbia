import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { motion } from "framer-motion";
import { Smartphone, RotateCcw, ExternalLink, Maximize2, Minimize2 } from "lucide-react";

interface LivePreviewProps {
  slug: string;
  refreshKey?: number;
  compact?: boolean;
}

export interface LivePreviewRef {
  refresh: () => void;
}

const LivePreview = forwardRef<LivePreviewRef, LivePreviewProps>(({ slug, refreshKey = 0, compact = false }, ref) => {
  const [key, setKey] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const previewUrl = `${window.location.origin}/r/${slug}`;

  // Refresh when external key changes
  useEffect(() => {
    if (refreshKey > 0) setKey(k => k + 1);
  }, [refreshKey]);

  useImperativeHandle(ref, () => ({
    refresh: () => setKey(k => k + 1),
  }));

  if (compact) {
    return (
      <div className="flex flex-col h-full">
        {/* Compact header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-card/50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">Live Preview</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setKey(k => k + 1)}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title="Ricarica">
              <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button onClick={() => window.open(previewUrl, "_blank")}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title="Apri in nuova finestra">
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Phone frame */}
        <div className="flex-1 flex items-start justify-center overflow-hidden bg-muted/30 p-3">
          <div className="relative">
            <div className="w-[240px] h-[500px] bg-[#1a1a1a] rounded-[32px] p-[8px] shadow-2xl border border-[#333]">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[24px] bg-[#1a1a1a] rounded-b-2xl z-10" />
              {/* Status bar */}
              <div className="absolute top-[5px] left-[22px] z-10">
                <span className="text-[8px] text-white/60 font-medium">9:41</span>
              </div>
              {/* Screen */}
              <div className="w-full h-full rounded-[26px] overflow-hidden bg-background">
                <iframe
                  key={key}
                  src={previewUrl}
                  className="border-0 origin-top-left"
                  style={{
                    transform: "scale(0.5973)",
                    transformOrigin: "top left",
                    width: "375px",
                    height: "812px",
                  }}
                  title="Live Preview"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              </div>
              {/* Home indicator */}
              <div className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[80px] h-[3px] rounded-full bg-white/20" />
            </div>
          </div>
        </div>

        <div className="px-3 py-1.5 border-t border-border/50 bg-card/50 flex-shrink-0">
          <p className="text-[9px] text-muted-foreground text-center">
            Le modifiche si riflettono in tempo reale
          </p>
        </div>
      </div>
    );
  }

  // Full mobile-tab version
  return (
    <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center py-2">
        <Smartphone className="w-10 h-10 mx-auto mb-2 text-primary" />
        <h3 className="text-lg font-display font-bold text-foreground">Live Preview</h3>
        <p className="text-sm text-muted-foreground mt-1">Anteprima real-time di come i clienti vedono il tuo ristorante</p>
      </div>

      <div className="flex justify-center gap-2 mb-2">
        <button
          onClick={() => setKey(k => k + 1)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium min-h-[40px]"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Ricarica
        </button>
        <button
          onClick={() => window.open(previewUrl, "_blank")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium min-h-[40px]"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Apri
        </button>
      </div>

      {/* iPhone Frame */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-[280px] h-[580px] bg-[#1a1a1a] rounded-[40px] p-[10px] shadow-2xl border border-[#333]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-[#1a1a1a] rounded-b-2xl z-10" />
            <div className="absolute top-[6px] left-[28px] flex items-center gap-1 z-10">
              <span className="text-[9px] text-white/60 font-medium">9:41</span>
            </div>
            <div className="w-full h-full rounded-[32px] overflow-hidden bg-background">
              <iframe
                key={key}
                src={previewUrl}
                className="w-[375px] h-[812px] border-0 origin-top-left"
                style={{
                  transform: "scale(0.6933)",
                  transformOrigin: "top left",
                  width: "375px",
                  height: "812px",
                }}
                title="Live Preview"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
            <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[100px] h-[4px] rounded-full bg-white/20" />
          </div>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        Le modifiche al menu, logo e impostazioni si riflettono in tempo reale
      </p>
    </motion.div>
  );
});

LivePreview.displayName = "LivePreview";

export default LivePreview;
