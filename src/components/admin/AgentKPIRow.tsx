import { motion } from "framer-motion";
import { Bot, Download, TrendingUp, DollarSign } from "lucide-react";

interface Props {
  activeCount: number;
  totalInstalls: number;
  successRate: number;
  monthlyRevenue: number;
}

const cards = [
  { key: "active", label: "Agenti Attivi", icon: Bot, color: "from-emerald-500/20 to-emerald-500/5", border: "border-t-emerald-500", text: "text-emerald-400" },
  { key: "installs", label: "Installazioni", icon: Download, color: "from-blue-500/20 to-blue-500/5", border: "border-t-blue-500", text: "text-blue-400" },
  { key: "success", label: "Success Rate", icon: TrendingUp, color: "from-violet-500/20 to-violet-500/5", border: "border-t-violet-500", text: "text-violet-400" },
  { key: "revenue", label: "Revenue Mensile", icon: DollarSign, color: "from-amber-500/20 to-amber-500/5", border: "border-t-amber-500", text: "text-amber-400" },
] as const;

export default function AgentKPIRow({ activeCount, totalInstalls, successRate, monthlyRevenue }: Props) {
  const values: Record<string, string> = {
    active: String(activeCount),
    installs: String(totalInstalls),
    success: `${successRate}%`,
    revenue: `€${monthlyRevenue.toLocaleString()}`,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c, i) => (
        <motion.div
          key={c.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`bg-white/5 backdrop-blur-xl border border-white/10 ${c.border} border-t-2 rounded-xl p-4`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">{c.label}</span>
            <c.icon className={`w-4 h-4 ${c.text}`} />
          </div>
          <p className={`text-2xl font-bold ${c.text}`}>{values[c.key]}</p>
        </motion.div>
      ))}
    </div>
  );
}
