import { useIndustry } from "@/hooks/useIndustry";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, ShoppingBag, Users, DollarSign, Car, Calendar, Scissors, Heart } from "lucide-react";

const KPICard = ({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) => (
  <Card className="glass border-border/50">
    <CardContent className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

function FoodDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-heading">Dashboard Ristorazione</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Ordini Oggi" value="24" icon={ShoppingBag} color="text-blue-400" />
        <KPICard label="Revenue Oggi" value="€1.250" icon={DollarSign} color="text-green-400" />
        <KPICard label="Clienti Attivi" value="156" icon={Users} color="text-purple-400" />
        <KPICard label="Crescita" value="+12%" icon={TrendingUp} color="text-primary" />
      </div>
      <Card className="glass border-border/50">
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center py-8">
            Grafici e analytics dettagliati disponibili nella sezione Finanza.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function NCCDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-heading">Dashboard NCC</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Prenotazioni Oggi" value="8" icon={Calendar} color="text-blue-400" />
        <KPICard label="Revenue Oggi" value="€890" icon={DollarSign} color="text-green-400" />
        <KPICard label="Veicoli Attivi" value="12" icon={Car} color="text-purple-400" />
        <KPICard label="Crescita" value="+18%" icon={TrendingUp} color="text-primary" />
      </div>
      <Card className="glass border-border/50">
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center py-8">
            Panoramica prenotazioni, flotta e performance autisti.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function GenericDashboard() {
  const { config, terminology } = useIndustry();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-heading">Dashboard {config.label}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label={`${terminology.orders} Oggi`} value="15" icon={Calendar} color="text-blue-400" />
        <KPICard label="Revenue Oggi" value="€720" icon={DollarSign} color="text-green-400" />
        <KPICard label={terminology.customers} value="89" icon={Users} color="text-purple-400" />
        <KPICard label="Crescita" value="+9%" icon={TrendingUp} color="text-primary" />
      </div>
    </div>
  );
}

export default function AdaptiveDashboard() {
  const { industry } = useIndustry();

  switch (industry) {
    case "food": return <FoodDashboard />;
    case "ncc": return <NCCDashboard />;
    default: return <GenericDashboard />;
  }
}
