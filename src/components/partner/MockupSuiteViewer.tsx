import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, Smartphone } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { MockupReactScreen } from "./MockupReactScreen";

export interface SuiteScreen {
  type: string;
  title: string;
  image_url: string | null;
  render_mode?: "react" | "ai";
  template_variant?: string;
  engine?: string;
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
}

/**
 * Renderizza 4 mockup iPhone affiancati.
 * - Per render_mode='ai': mostra l'immagine generata dentro la cornice iPhone
 * - Per render_mode='react': renderizza il template React (Paperfish/Strapizzami/etc) dentro la cornice iPhone
 */
export function MockupSuiteViewer({
  screens,
  templateVariant,
  businessName,
  businessSector = "",
  businessCity = "",
  primaryColor = "#C8963E",
  compact = false,
}: Props) {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [downloading, setDownloading] = useState<number | null>(null);

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

  const phoneSize = compact
    ? { w: 220, h: 460, scale: 0.55 }
    : { w: 280, h: 580, scale: 0.71 };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Smartphone className="h-4 w-4" />
          <span>4 schermate iPhone 16 Pro</span>
          <Badge variant="outline" className="text-xs">{templateVariant.replace("_", " ")}</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={downloadAll} disabled={downloading !== null}>
          <Download className="h-3 w-3 mr-1" /> Scarica tutti
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
        {screens.map((screen, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <div
              ref={el => { containerRefs.current[idx] = el; }}
              className="relative group"
            >
              {/* Ambient glow */}
              <div
                className="absolute -inset-3 rounded-[48px] opacity-20 blur-2xl pointer-events-none transition-opacity group-hover:opacity-40"
                style={{ background: primaryColor }}
              />

              {/* iPhone frame */}
              <div
                className="relative rounded-[40px] border-[3px] border-foreground/15 bg-foreground/5 shadow-2xl overflow-hidden"
                style={{ width: phoneSize.w, height: phoneSize.h }}
              >
                {/* Dynamic Island */}
                <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[80px] h-[22px] bg-black rounded-full z-30" />

                {/* Side buttons */}
                <div className="absolute -left-[3px] top-[80px] w-[3px] h-[24px] bg-foreground/20 rounded-l-full" />
                <div className="absolute -left-[3px] top-[112px] w-[3px] h-[36px] bg-foreground/20 rounded-l-full" />
                <div className="absolute -left-[3px] top-[156px] w-[3px] h-[36px] bg-foreground/20 rounded-l-full" />
                <div className="absolute -right-[3px] top-[110px] w-[3px] h-[52px] bg-foreground/20 rounded-r-full" />

                {/* Screen content */}
                <div className="absolute inset-[3px] rounded-[36px] overflow-hidden bg-background">
                  {screen.render_mode === "ai" && screen.image_url ? (
                    <img
                      src={screen.image_url}
                      alt={screen.title}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "center top" }}
                    />
                  ) : (
                    <MockupReactScreen
                      type={screen.type}
                      templateVariant={templateVariant}
                      businessName={businessName}
                      businessSector={businessSector}
                      businessCity={businessCity}
                      primaryColor={primaryColor}
                      width={phoneSize.w - 6}
                      height={phoneSize.h - 6}
                    />
                  )}
                </div>

                {/* Home indicator */}
                <div className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[90px] h-[3px] bg-foreground/25 rounded-full z-20" />
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
