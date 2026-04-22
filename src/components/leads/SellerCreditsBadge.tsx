import { motion } from "framer-motion";
import { Coins, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  balance: number;
  spent30d?: number;
  compact?: boolean;
}

/**
 * Pill saldo crediti sempre visibile nell'header LeadsPage.
 * Cambia colore a <10 crediti. Linka al profilo per ricaricare.
 */
export default function SellerCreditsBadge({ balance, spent30d = 0, compact }: Props) {
  const low = balance < 10;
  const empty = balance <= 0;

  return (
    <Link
      to="/partner/profile?tab=credits"
      className="group inline-flex items-center gap-2 no-underline"
      title={`Saldo crediti AI · Spesi 30g: €${spent30d.toFixed(2)}`}
    >
      <motion.div
        className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 h-9 sm:h-9 md:h-10 rounded-xl sm:rounded-full border transition ${
          empty
            ? "bg-red-500/15 border-red-500/40 text-red-300"
            : low
            ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
        }`}
        whileHover={{ scale: 1.03 }}
        animate={empty ? { boxShadow: ["0 0 0 0 hsl(var(--destructive)/0.4)", "0 0 0 6px hsl(var(--destructive)/0)"] } : {}}
        transition={empty ? { duration: 1.4, repeat: Infinity } : {}}
      >
        <Coins className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
        <span className="text-[12px] sm:text-xs font-bold leading-none">{balance}</span>
        {!compact && <span className="hidden sm:inline text-[10px] opacity-70">crediti AI</span>}
        <Plus className="hidden sm:inline w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
      </motion.div>
    </Link>
  );
}
