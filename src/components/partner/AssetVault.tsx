import { motion } from "framer-motion";
import { Download, FileText, Palette, Image as ImageIcon, Presentation, BookOpen, Loader2, Check } from "lucide-react";
import InfoGuide from "@/components/ui/info-guide";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Asset {
  icon: React.ReactNode;
  name: string;
  desc: string;
  type: string;
  gradient: string;
  storagePath: string;
}

const assets: Asset[] = [
  {
    icon: <Presentation className="w-5 h-5" />,
    name: "Sales Deck Empire",
    desc: "Presentazione 12 slide per vendere in appuntamento",
    type: "PDF",
    gradient: "from-primary/20 to-amber-500/20",
    storagePath: "sales-deck-empire.pdf",
  },
  {
    icon: <Palette className="w-5 h-5" />,
    name: "Branding Kit",
    desc: "Logo, colori, font e linee guida del brand Empire",
    type: "ZIP",
    gradient: "from-violet-500/20 to-fuchsia-500/20",
    storagePath: "branding-kit.zip",
  },
  {
    icon: <ImageIcon className="w-5 h-5" />,
    name: "Logo Bakery Demo",
    desc: "Logo HD per personalizzare la sandbox demo",
    type: "PNG",
    gradient: "from-emerald-500/20 to-teal-500/20",
    storagePath: "logo-bakery-demo.png",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    name: "Script di Vendita",
    desc: "Copione testato per la chiamata a freddo e il follow-up",
    type: "PDF",
    gradient: "from-sky-500/20 to-blue-500/20",
    storagePath: "script-vendita.pdf",
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    name: "Obiezioni & Risposte",
    desc: "Le 15 obiezioni più comuni con risposte pronte",
    type: "PDF",
    gradient: "from-amber-500/20 to-orange-500/20",
    storagePath: "obiezioni-risposte.pdf",
  },
];

const AssetVault = () => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());

  const handleDownload = async (asset: Asset) => {
    setDownloading(asset.storagePath);

    try {
      const { data } = supabase.storage
        .from("partner-assets")
        .getPublicUrl(asset.storagePath);

      if (!data?.publicUrl) {
        throw new Error("URL non disponibile");
      }

      // Check if file exists by doing a HEAD request
      const res = await fetch(data.publicUrl, { method: "HEAD" });

      if (!res.ok) {
        toast({
          title: "📁 File in arrivo",
          description: `"${asset.name}" sarà disponibile a breve. Il team sta caricando i materiali.`,
          variant: "default",
        });
        setDownloading(null);
        return;
      }

      // Trigger download
      const link = document.createElement("a");
      link.href = data.publicUrl;
      link.download = asset.storagePath;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloaded((prev) => new Set(prev).add(asset.storagePath));
      toast({
        title: "✅ Download avviato",
        description: `"${asset.name}" scaricato con successo.`,
      });
    } catch {
      toast({
        title: "📁 File in arrivo",
        description: `"${asset.name}" sarà disponibile a breve. Il team sta caricando i materiali.`,
        variant: "default",
      });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-foreground">Asset Vault</h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold">{assets.length} file</span>
          <InfoGuide
            title="Asset Vault"
            description="Materiale marketing professionale pronto per le presentazioni: sales deck, script di vendita, branding kit e loghi."
            steps={[
              "Scarica i file con il pulsante download",
              "Genera automaticamente nuovi asset con l'IA",
              "Usa il sales deck durante le presentazioni ai clienti",
            ]}
          />
        </div>
      </div>

      <div className="space-y-3">
        {assets.map((asset, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`p-4 rounded-2xl bg-gradient-to-r ${asset.gradient} border border-border/30 flex items-center gap-3`}
          >
            <div className="w-11 h-11 rounded-xl bg-background/50 flex items-center justify-center text-primary flex-shrink-0">
              {asset.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{asset.name}</p>
              <p className="text-[10px] text-muted-foreground">{asset.desc}</p>
            </div>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <button
                onClick={() => handleDownload(asset)}
                disabled={downloading === asset.storagePath}
                className="w-9 h-9 rounded-xl bg-card/80 border border-border/50 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50"
              >
                {downloading === asset.storagePath ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : downloaded.has(asset.storagePath) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>
              <span className="text-[8px] text-muted-foreground font-semibold">{asset.type}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border/50 text-center">
        <p className="text-[10px] text-muted-foreground">
          🔒 Materiali riservati ai Partner Empire. Non condividere con terzi.
        </p>
      </div>
    </motion.div>
  );
};

export default AssetVault;
