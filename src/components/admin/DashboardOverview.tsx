import { motion } from "framer-motion";
import { LayoutDashboard, TrendingUp, ShoppingCart, DollarSign, Users } from "lucide-react";

interface DashboardOverviewProps {
  todayRevenue: number;
  todayOrderCount: number;
  activeOrderCount: number;
  menuItemCount: number;
  aiTokens: number;
  restaurantName: string;
}

const DashboardOverview = ({
  todayRevenue, todayOrderCount, activeOrderCount, menuItemCount, aiTokens, restaurantName,
}: DashboardOverviewProps) => {
  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center py-2">
        <h2 className="text-lg font-display font-bold text-foreground">{restaurantName}</h2>
        <p className="text-xs text-muted-foreground">Panoramica giornaliera</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-primary/20">
          <DollarSign className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-display font-bold text-primary">€{todayRevenue.toFixed(0)}</p>
          <p className="text-xs text-muted-foreground">Incasso oggi</p>
        </div>
        <div className="p-4 rounded-2xl bg-card">
          <ShoppingCart className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-display font-bold text-foreground">{todayOrderCount}</p>
          <p className="text-xs text-muted-foreground">Ordini oggi</p>
        </div>
        <div className="p-4 rounded-2xl bg-card">
          <TrendingUp className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-display font-bold text-foreground">{activeOrderCount}</p>
          <p className="text-xs text-muted-foreground">Ordini attivi</p>
        </div>
        <div className="p-4 rounded-2xl bg-card">
          <LayoutDashboard className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-display font-bold text-foreground">{menuItemCount}</p>
          <p className="text-xs text-muted-foreground">Piatti in menu</p>
        </div>
      </div>

      <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Users className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Gettoni IA</p>
          <p className="text-xs text-muted-foreground">Menu Creator, Foto, Traduzioni</p>
        </div>
        <span className="text-lg font-display font-bold text-primary">{aiTokens}</span>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;
