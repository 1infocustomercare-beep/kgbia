import { motion } from "framer-motion";
import { Download, FileText, Palette, Image as ImageIcon, Presentation, BookOpen } from "lucide-react";

const assets = [
  {
    icon: <Presentation className="w-5 h-5" />,
    name: "Sales Deck Empire",
    desc: "Presentazione 12 slide per vendere in appuntamento",
    type: "PDF",
    gradient: "from-primary/20 to-amber-500/20",
  },
  {
    icon: <Palette className="w-5 h-5" />,
    name: "Branding Kit",
    desc: "Logo, colori, font e linee guida del brand Empire",
    type: "ZIP",
    gradient: "from-violet-500/20 to-fuchsia-500/20",
  },
  {
    icon: <ImageIcon className="w-5 h-5" />,
    name: "Logo Bakery Demo",
    desc: "Logo HD per personalizzare la sandbox demo",
    type: "PNG",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    name: "Script di Vendita",
    desc: "Copione testato per la chiamata a freddo e il follow-up",
    type: "PDF",
    gradient: "from-sky-500/20 to-blue-500/20",
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    name: "Obiezioni & Risposte",
    desc: "Le 15 obiezioni più comuni con risposte pronte",
    type: "PDF",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
];

const AssetVault = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-foreground">Asset Vault</h2>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold">{assets.length} file</span>
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
              <button className="w-9 h-9 rounded-xl bg-card/80 border border-border/50 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <Download className="w-4 h-4" />
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
