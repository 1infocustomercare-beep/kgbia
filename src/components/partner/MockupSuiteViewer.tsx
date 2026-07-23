import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, Smartphone, FileArchive } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { MockupReactScreen, type ColorStyle } from "./MockupReactScreen";

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
  /** Device del mockup: mobile (iPhone 9:19.5, default) o desktop (browser 16:10). */
  device?: "mobile" | "desktop";
}

// ──────────────────────────────────────────────────────────────────────────────
// iPhone 16 Pro Max — proporzioni reali fisse: 9 : 19.5
// Usiamo dimensioni fisse calcolate da una larghezza base + aspect ratio.
// In questo modo CAMBIANDO TEMPLATE/COLORI il frame resta SEMPRE proporzionato
// e il contenuto interno scala 1:1 senza mai distorcersi.
// ──────────────────────────────────────────────────────────────────────────────
const IPHONE_RATIO = 19.5 / 9; // height / width

// ──────────────────────────────────────────────────────────────────────────────
// AIScreenImage — img con retry esponenziale (1s/2s/4s + jitter) sui fallimenti
// di caricamento. Mentre i tentativi sono in corso (o se tutti falliscono) viene
// mostrata la preview React sotto come fallback definitivo, così l'utente non
// vede mai uno schermo vuoto.
// ──────────────────────────────────────────────────────────────────────────────
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

interface AIScreenImageProps {
  src: string;
  alt: string;
  priority: boolean;
  fallback: React.ReactNode;
}

function AIScreenImage({ src, alt, priority, fallback }: AIScreenImageProps) {
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setAttempt(0);
    setLoaded(false);
    setExhausted(false);
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, [src]);

  // Cache-buster per evitare di reincappare in risposte cached fallite (es. 502 da CDN)
  const versionedSrc = attempt === 0 ? src : `${src}${src.includes("?") ? "&" : "?"}retry=${attempt}`;

  const handleError = () => {
    if (attempt >= MAX_RETRIES) {
      setExhausted(true);
      return;
    }
    const delay = BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 300;
    timerRef.current = window.setTimeout(() => setAttempt(a => a + 1), delay);
  };

  return (
    <>
      {(!loaded || exhausted) && (
        <div className="absolute inset-0">{fallback}</div>
      )}
      {!exhausted && (
        <img
          key={attempt}
          src={versionedSrc}
          alt={alt}
          className="w-full h-full animate-in fade-in duration-700 relative z-10"
          draggable={false}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          // @ts-expect-error - fetchPriority è supportato dai browser moderni
          fetchpriority={priority ? "high" : "low"}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
            contentVisibility: priority ? "visible" : "auto",
            opacity: loaded ? 1 : 0,
            transition: "opacity 400ms ease-out",
          }}
        />
      )}
    </>
  );
}

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
  device = "mobile",
}: Props) {
  const isDesktop = device === "desktop";
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [zipping, setZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  // Preload aggressivo delle prime 2 schermate AI: appena le URL sono note,
  // iniettiamo <link rel="preload" as="image" fetchpriority="high"> nel <head>
  // così il browser inizia a scaricarle in parallelo al rendering della preview
  // React, eliminando il "lampo" durante l'upgrade preview→AI sopra la piega.
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    screens.slice(0, 2).forEach(s => {
      if (s.render_mode === "ai" && s.image_url) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = s.image_url;
        (link as any).fetchPriority = "high";
        document.head.appendChild(link);
        links.push(link);
      }
    });
    return () => { links.forEach(l => l.remove()); };
  }, [screens]);

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
    if (zipping) return;
    setZipping(true);
    setZipProgress(0);
    const safeName = businessName.replace(/\s+/g, "_") || "mockup";
    const zip = new JSZip();
    const folder = zip.folder(`${safeName}_mockup_suite`) ?? zip;

    try {
      for (let i = 0; i < screens.length; i++) {
        const el = containerRefs.current[i];
        if (!el) continue;

        const canvas = await html2canvas(el, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          logging: false,
        });

        const blob: Blob | null = await new Promise(resolve =>
          canvas.toBlob(b => resolve(b), "image/png", 1)
        );
        if (!blob) throw new Error(`Conversione PNG fallita per ${screens[i].title}`);

        const filename = `${String(i + 1).padStart(2, "0")}_${screens[i].type}.png`;
        folder.file(filename, blob);
        setZipProgress(Math.round(((i + 1) / screens.length) * 80));
      }

      const zipBlob = await zip.generateAsync(
        { type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } },
        meta => setZipProgress(80 + Math.round(meta.percent * 0.2))
      );

      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${safeName}_mockup_suite.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      toast.success(`Scaricate ${screens.length} schermate in un unico ZIP`);
    } catch (e: any) {
      toast.error(`Errore creazione ZIP: ${e.message ?? e}`);
    } finally {
      setZipping(false);
      setZipProgress(0);
    }
  };

  // Frame dimensions — derivati da una larghezza base, con aspect ratio reale device
  const DESKTOP_RATIO = 10 / 16; // height / width
  const frameWidth = isDesktop ? (compact ? 380 : 480) : (compact ? 220 : 280);
  const frameHeight = isDesktop
    ? Math.round(frameWidth * DESKTOP_RATIO) + 26 // 26px browser chrome bar
    : Math.round(frameWidth * IPHONE_RATIO);
  const borderThickness = compact ? 3 : 4;
  const screenWidth = frameWidth - borderThickness * 2;
  const screenHeight = frameHeight - borderThickness * 2;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Smartphone className="h-4 w-4" />
          <span>
            {screens.length} schermate {isDesktop ? "Desktop Web · proporzioni 16:10" : "iPhone 16 Pro Max · proporzioni reali 9:19.5"}
          </span>
          <Badge variant="outline" className="text-xs">{templateVariant.replace(/_/g, " ")}</Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadAll}
          disabled={downloading !== null || zipping}
        >
          {zipping ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ZIP {zipProgress}%
            </>
          ) : (
            <>
              <FileArchive className="h-3 w-3 mr-1" /> Scarica ZIP ({screens.length})
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
        {screens.map((screen, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <div
              ref={el => { containerRefs.current[idx] = el; }}
              className="relative group"
              style={{ width: frameWidth, height: frameHeight }}
            >
              {/* Ambient glow personalizzato sul colore brand */}
              <div
                className={`absolute -inset-3 opacity-20 blur-2xl pointer-events-none transition-opacity group-hover:opacity-40 ${isDesktop ? "rounded-[20px]" : "rounded-[48px]"}`}
                style={{ background: primaryColor }}
              />

              {/* Frame — iPhone titanium (mobile) o browser chrome (desktop) */}
              <div
                className={`relative shadow-2xl overflow-hidden ${isDesktop ? "rounded-[14px]" : "rounded-[42px]"}`}
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
                {isDesktop ? (
                  /* Browser chrome bar — 3 pallini + tab */
                  <div
                    className="absolute left-0 top-0 flex items-center gap-1.5 px-3 bg-neutral-900/95 border-b border-white/10 z-30"
                    style={{ width: screenWidth, height: 24 }}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                    <span className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                    <span className="w-2 h-2 rounded-full bg-[#28C840]" />
                    <div className="ml-3 flex-1 h-3.5 rounded-sm bg-white/10 flex items-center px-2">
                      <span className="text-[8px] text-white/60 truncate">
                        {businessName ? `${businessName.toLowerCase().replace(/[^a-z0-9]+/g, "")}.it` : "brand.it"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
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
                    <div className="absolute bg-foreground/25 rounded-l-full" style={{ left: -borderThickness, top: frameHeight * 0.14, width: borderThickness, height: 22 }} />
                    <div className="absolute bg-foreground/25 rounded-l-full" style={{ left: -borderThickness, top: frameHeight * 0.20, width: borderThickness, height: 38 }} />
                    <div className="absolute bg-foreground/25 rounded-l-full" style={{ left: -borderThickness, top: frameHeight * 0.28, width: borderThickness, height: 38 }} />
                    <div className="absolute bg-foreground/25 rounded-r-full" style={{ right: -borderThickness, top: frameHeight * 0.20, width: borderThickness, height: 56 }} />
                  </>
                )}

                {/* Screen — riempie esattamente l'area interna, niente distorsioni */}
                <div
                  className="absolute overflow-hidden bg-background"
                  style={{
                    top: borderThickness + (isDesktop ? 24 : 0),
                    left: borderThickness,
                    width: screenWidth,
                    height: screenHeight - (isDesktop ? 24 : 0),
                    borderRadius: isDesktop ? 0 : 38,
                  }}
                >
                  {screen.render_mode === "ai" && screen.image_url ? (
                    <AIScreenImage
                      src={screen.image_url}
                      alt={screen.title}
                      priority={idx < 2}
                      fallback={
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
                      }
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

                {/* Home indicator (solo mobile) */}
                {!isDesktop && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 bg-foreground/30 rounded-full z-20"
                    style={{
                      bottom: Math.max(5, Math.round(frameWidth * 0.025)),
                      width: Math.round(frameWidth * 0.34),
                      height: 3,
                    }}
                  />
                )}
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
              disabled={downloading !== null || zipping}
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
