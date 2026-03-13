import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Crown, Image, Copy, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

import empireLogoIcon from "@/assets/empire-logo-icon.png";
import empireLogoFull from "@/assets/empire-logo-full.png";
import heroTechCommand from "@/assets/hero-tech-command.jpg";
import heroAiPlatform from "@/assets/hero-ai-platform.jpg";
import heroPartnerLuxury from "@/assets/hero-partner-luxury.jpg";

interface Asset {
  name: string;
  src: string;
  dimensions: string;
  category: string;
}

const ASSETS: Asset[] = [
  { name: "Empire Logo Icon (Crown)", src: empireLogoIcon, dimensions: "1024×1024 PNG", category: "Logo" },
  { name: "Empire Logo Full (Wordmark)", src: empireLogoFull, dimensions: "1920×640 PNG", category: "Logo" },
  { name: "Hero Tech Command", src: heroTechCommand, dimensions: "1024×1024 JPG", category: "Landing" },
  { name: "Hero AI Platform", src: heroAiPlatform, dimensions: "1024×1024 JPG", category: "Landing" },
  { name: "Hero Partner Luxury", src: heroPartnerLuxury, dimensions: "1024×1024 JPG", category: "Landing" },
];

export default function BrandAssetsPage() {
  const navigate = useNavigate();
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const downloadAsset = (asset: Asset) => {
    const link = document.createElement("a");
    link.href = asset.src;
    link.download = asset.name.toLowerCase().replace(/[^a-z0-9]/g, "-") + (asset.src.includes(".png") ? ".png" : ".jpg");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Download avviato", description: asset.name });
  };

  const copyUrl = (idx: number, src: string) => {
    navigator.clipboard.writeText(window.location.origin + src);
    setCopiedIdx(idx);
    toast({ title: "URL copiato" });
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" /> Brand Assets
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Scarica loghi, immagini e asset generati per Empire</p>
          </div>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ASSETS.map((asset, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="group relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-all duration-300"
            >
              {/* Preview */}
              <div className="relative aspect-square bg-[hsl(260,20%,8%)] flex items-center justify-center p-6 overflow-hidden">
                {/* Checkerboard pattern for transparency */}
                {asset.src.includes(".png") && (
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: "linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(-45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(var(--muted)) 75%), linear-gradient(-45deg, transparent 75%, hsl(var(--muted)) 75%)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px"
                  }} />
                )}
                <img src={asset.src} alt={asset.name} className="max-w-full max-h-full object-contain relative z-10" />
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[0.6rem] font-heading font-semibold tracking-[2px] uppercase text-primary/60 px-2 py-0.5 rounded bg-primary/[0.06]">
                    {asset.category}
                  </span>
                  <span className="text-[0.6rem] text-muted-foreground">{asset.dimensions}</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-3">{asset.name}</h3>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => downloadAsset(asset)}>
                    <Download className="w-3.5 h-3.5" /> Scarica
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => copyUrl(i, asset.src)}>
                    {copiedIdx === i ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
