import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, Smartphone, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { MockupReactScreen, type ColorStyle } from "./MockupReactScreen";
import { MockupFullscreenViewer } from "./MockupFullscreenViewer";

export interface SuiteScreen {
  type: string;
  title: string;
  image_url: string | null;
  render_mode?: "react" | "ai";
  template_variant?: string;
  engine?: string;
  /** True quando lo screen è una preview React temporanea in attesa dell'upgrade AI 4K/8K */
  is_preview?: boolean;
  variation_seed?: number;
  variant_index?: number;
}

interface Props {
  screens: SuiteScreen[];
  templateVariant: string;
  businessName: string;
  businessSector?: string;
  businessCity?: string;
  primaryColor?: string;
  suiteId?: string;
  compact?: boolean;
  /** 0–100 — propagato a MockupReactScreen (BottomNav glass). Default 60. */
  glassIntensity?: number;
  /** vivid (default) | muted | pastel | mono. */
  colorStyle?: ColorStyle;
  /** Safe-area px (margine interno). Default 0. */
  safeAreaPx?: number;
  /** Type scale 0.85–1.20. Default 1.00. */
  typeScale?: number;
  /** Boost contrasto AA su testo e muted. Default false. */
  boostContrast?: boolean;
}

// ──────────────────────────────────────────────────────────────────────────────
// iPhone 16 Pro Max — proporzioni reali fisse: 9 : 19.5
// Usiamo dimensioni fisse calcolate da una larghezza base + aspect ratio.
// In questo modo CAMBIANDO TEMPLATE/COLORI il frame resta SEMPRE proporzionato
// e il contenuto interno scala 1:1 senza mai distorcersi.
// ──────────────────────────────────────────────────────────────────────────────
const IPHONE_RATIO = 19.5 / 9; // height / width

export function MockupSuiteViewer({
  screens,
  templateVariant,
  businessName,
  businessSector = "",
  businessCity = "",
  primaryColor = "#C8963E",
  compact = false,
  glassIntensity = 60,
  colorStyle = "vivid",
  safeAreaPx = 0,
  typeScale = 1,
  boostContrast = false,
}: Props) {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const downloadScreen = async (idx: number) => {
    const el = containerRefs.current[idx];
    if (!el) return;
    setDownloading(idx);
    try {
      const canvas = await html2canvas(el, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `${businessName.replace(/\s+/g, "_")}_${screens[idx].type}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success(`Scaricato ${screens[idx].title}`);
    } catch (e: any) {
      toast.error(`Errore download: ${e.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const downloadAll = async () => {
    for (let i = 0; i < screens.length; i++) {
      await downloadScreen(i);
      await new Promise(r => setTimeout(r, 300));
    }
  };

  // Frame dimensions — derivati da una larghezza base, con aspect ratio reale iPhone
  const frameWidth = compact ? 220 : 280;
  const frameHeight = Math.round(frameWidth * IPHONE_RATIO); // 220→477 / 280→607
  const borderThickness = compact ? 3 : 4;
  // Inner screen è sempre frameWidth - 2*border (mai distorto)
  const screenWidth = frameWidth - borderThickness * 2;
  const screenHeight = frameHeight - borderThickness * 2;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Smartphone className="h-4 w-4" />
          <span>4 schermate iPhone 16 Pro Max · proporzioni reali 9:19.5</span>
          <Badge variant="outline" className="text-xs">{templateVariant.replace(/_/g, " ")}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFullscreenIndex(0)}
            disabled={!screens.length}
            title="Visualizza a schermo intero"
          >
            <Maximize2 className="h-3 w-3 mr-1" /> Full-screen
          </Button>
          <Button variant="outline" size="sm" onClick={downloadAll} disabled={downloading !== null}>
            <Download className="h-3 w-3 mr-1" /> Scarica tutti
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
        {screens.map((screen, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <div
              ref={el => { containerRefs.current[idx] = el; }}
              className="relative group cursor-zoom-in"
              style={{ width: frameWidth, height: frameHeight }}
              onClick={() => setFullscreenIndex(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") setFullscreenIndex(idx); }}
              title="Apri a schermo intero"
            >
              {/* Ambient glow personalizzato sul colore brand */}
              <div
                className="absolute -inset-3 rounded-[48px] opacity-20 blur-2xl pointer-events-none transition-opacity group-hover:opacity-40"
                style={{ background: primaryColor }}
              />

              {/* iPhone titanium frame — proporzioni reali, mai distorte */}
              <div
                className="relative rounded-[42px] shadow-2xl overflow-hidden"
                style={{
                  width: frameWidth,
                  height: frameHeight,
                  borderWidth: borderThickness,
                  borderStyle: "solid",
                  borderColor: "hsl(var(--foreground) / 0.18)",
                  background: "hsl(var(--foreground) / 0.05)",
                  boxSizing: "border-box",
                }}
              >
                {/* Dynamic Island — proporzionata al frame */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full z-30"
                  style={{
                    top: Math.round(frameWidth * 0.035),
                    width: Math.round(frameWidth * 0.30),
                    height: Math.round(frameWidth * 0.085),
                  }}
                />

                {/* Side titanium buttons */}
                <div
                  className="absolute bg-foreground/25 rounded-l-full"
                  style={{ left: -borderThickness, top: frameHeight * 0.14, width: borderThickness, height: 22 }}
                />
                <div
                  className="absolute bg-foreground/25 rounded-l-full"
                  style={{ left: -borderThickness, top: frameHeight * 0.20, width: borderThickness, height: 38 }}
                />
                <div
                  className="absolute bg-foreground/25 rounded-l-full"
                  style={{ left: -borderThickness, top: frameHeight * 0.28, width: borderThickness, height: 38 }}
                />
                <div
                  className="absolute bg-foreground/25 rounded-r-full"
                  style={{ right: -borderThickness, top: frameHeight * 0.20, width: borderThickness, height: 56 }}
                />

                {/* Screen — riempie esattamente l'area interna, niente distorsioni */}
                <div
                  className="absolute overflow-hidden bg-background"
                  style={{
                    top: borderThickness,
                    left: borderThickness,
                    width: screenWidth,
                    height: screenHeight,
                    borderRadius: 38,
                  }}
                >
                  {screen.render_mode === "ai" && screen.image_url ? (
                    <img
                      src={screen.image_url}
                      alt={screen.title}
                      className="w-full h-full animate-in fade-in duration-700"
                      draggable={false}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        display: "block",
                      }}
                    />
                  ) : (
                    <MockupReactScreen
                      type={screen.type}
                      templateVariant={templateVariant}
                      businessName={businessName}
                      businessSector={businessSector}
                      businessCity={businessCity}
                      primaryColor={primaryColor}
                      width={screenWidth}
                      height={screenHeight}
                      glassIntensity={glassIntensity}
                      colorStyle={colorStyle}
                      safeAreaPx={safeAreaPx}
                      typeScale={typeScale}
                      boostContrast={boostContrast}
                    />
                  )}

                  {/* Overlay shimmer + badge quando è una preview rapida in attesa di upgrade AI */}
                  {screen.is_preview && (
                    <>
                      {/* Shimmer sweep diagonale */}
                      <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-mockup-sweep"
                        />
                      </div>
                      {/* Badge "Anteprima rapida" */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
                        <div className="px-2 py-0.5 rounded-full bg-foreground/80 backdrop-blur-md text-[8px] font-bold text-background flex items-center gap-1 shadow-lg">
                          <Loader2 className="h-2 w-2 animate-spin" />
                          ANTEPRIMA · 4K IN ARRIVO
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Home indicator */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 bg-foreground/30 rounded-full z-20"
                  style={{
                    bottom: Math.max(5, Math.round(frameWidth * 0.025)),
                    width: Math.round(frameWidth * 0.34),
                    height: 3,
                  }}
                />
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs font-semibold">{screen.title}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{screen.type}</p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => downloadScreen(idx)}
              disabled={downloading !== null}
            >
              {downloading === idx ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <><Download className="h-3 w-3 mr-1" /> PNG</>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
