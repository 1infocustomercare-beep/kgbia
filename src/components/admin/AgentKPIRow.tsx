import { motion } from "framer-motion";
import { Bot, Download, TrendingUp, DollarSign } from "lucide-react";

interface Props {
  activeCount: number;
  totalInstalls: number;
  successRate: number;
  monthlyRevenue: number;
}

const cards = [
  { key: "active", label: "Attivi", icon: Bot, text: "text-emerald-400" },
  { key: "installs", label: "Installs", icon: Download, text: "text-blue-400" },
  { key: "success", label: "Success", icon: TrendingUp, text: "text-violet-400" },
  { key: "revenue", label: "Revenue", icon: DollarSign, text: "text-amber-400" },
] as const;

export default function AgentKPIRow({ activeCount, totalInstalls, successRate, monthlyRevenue }: Props) {
  const values: Record<string, string> = {
    active: String(activeCount),
    installs: String(totalInstalls),
    success: `${successRate}%`,
    revenue: `€${monthlyRevenue.toLocaleString()}`,
  };

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {cards.map((c, i) => (
        <motion.div
          key={c.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="bg-secondary/40 border border-border/40 rounded-xl p-2 text-center"
        >
          <c.icon className={`w-3 h-3 mx-auto mb-0.5 ${c.text}`} />
          <p className={`text-sm font-bold ${c.text}`}>{values[c.key]}</p>
          <p className="text-[0.5rem] text-muted-foreground">{c.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
