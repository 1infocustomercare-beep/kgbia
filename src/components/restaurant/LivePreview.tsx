import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Smartphone, RotateCcw, ExternalLink } from "lucide-react";

interface LivePreviewProps {
  slug: string;
  primaryColor?: string;
}

const LivePreview = ({ slug, primaryColor }: LivePreviewProps) => {
  const [key, setKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewUrl = `${window.location.origin}/r/${slug}`;

  // Send brand color to iframe via postMessage whenever it changes
  const sendBrandToIframe = useCallback(() => {
    if (!iframeRef.current?.contentWindow || !primaryColor) return;
    iframeRef.current.contentWindow.postMessage(
      { type: "brand-update", primaryColor },
      window.location.origin
    );
  }, [primaryColor]);

  useEffect(() => {
    sendBrandToIframe();
  }, [sendBrandToIframe]);

  const handleIframeLoad = () => {
    // Small delay to ensure the iframe's JS is ready
    setTimeout(sendBrandToIframe, 300);
  };

  return (
    <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center py-2">
        <Smartphone className="w-10 h-10 mx-auto mb-2 text-primary" />
        <h3 className="text-lg font-display font-bold text-foreground">Live Preview</h3>
        <p className="text-sm text-muted-foreground mt-1">Vedi le modifiche istantaneamente</p>
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
          {/* iPhone bezel */}
          <div className="w-[280px] h-[580px] bg-[#1a1a1a] rounded-[40px] p-[10px] shadow-2xl border border-[#333]">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-[#1a1a1a] rounded-b-2xl z-10" />
            {/* Status bar */}
            <div className="absolute top-[6px] left-[28px] flex items-center gap-1 z-10">
              <span className="text-[9px] text-white/60 font-medium">9:41</span>
            </div>
            {/* Screen */}
            <div className="w-full h-full rounded-[32px] overflow-hidden bg-background">
              <iframe
                ref={iframeRef}
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
                onLoad={handleIframeLoad}
              />
            </div>
            {/* Home indicator */}
            <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[100px] h-[4px] rounded-full bg-white/20" />
          </div>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        Cambia colore o tagline e guarda il risultato qui sopra ☝️
      </p>
    </motion.div>
  );
};

export default LivePreview;
