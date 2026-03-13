import { useIndustry } from "@/hooks/useIndustry";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp, Receipt, CreditCard, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { it } from "date-fns/locale";
import { motion } from "framer-motion";

const cardV = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function FinancePage() {
  const { companyId, industry } = useIndustry();

  // Get orders for food, ncc_bookings for ncc, appointments for beauty etc.
  const { data: revenueData, isLoading } = useQuery({
    queryKey: ["finance-revenue", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const now = new Date();
      const monthStart = startOfMonth(now).toISOString();
      const monthEnd = endOfMonth(now).toISOString();
      const lastMonthStart = startOfMonth(subMonths(now, 1)).toISOString();
      const lastMonthEnd = endOfMonth(subMonths(now, 1)).toISOString();
      const weekStart = subDays(now, 7).toISOString();

      // Try orders first (food), then ncc_bookings, then appointments
      let thisMonth = 0, lastMonth = 0, thisWeek = 0, today = 0, count = 0;

      if (industry === "food") {
        const { data: orders } = await supabase.from("orders")
          .select("total, created_at")
          .eq("restaurant_id", companyId!)
          .gte("created_at", lastMonthStart);
        
        if (orders) {
          const todayStr = format(now, "yyyy-MM-dd");
          orders.forEach(o => {
            const d = o.created_at;
            if (d >= monthStart && d <= monthEnd) { thisMonth += o.total; count++; }
            if (d >= lastMonthStart && d < monthStart) lastMonth += o.total;
            if (d >= weekStart) thisWeek += o.total;
            if (d.startsWith(todayStr)) today += o.total;
          });
        }
      } else if (industry === "ncc") {
        const { data: bookings } = await supabase.from("ncc_bookings")
          .select("total_price, created_at")
          .eq("company_id", companyId!)
          .gte("created_at", lastMonthStart);
        
        if (bookings) {
          const todayStr = format(now, "yyyy-MM-dd");
          bookings.forEach(b => {
            const price = b.total_price || 0;
            const d = b.created_at;
            if (d >= monthStart && d <= monthEnd) { thisMonth += price; count++; }
            if (d >= lastMonthStart && d < monthStart) lastMonth += price;
            if (d >= weekStart) thisWeek += price;
            if (d.startsWith(todayStr)) today += price;
          });
        }
      } else {
        const { data: appts } = await supabase.from("appointments")
          .select("price, created_at")
          .eq("company_id", companyId!)
          .gte("created_at", lastMonthStart);
        
        if (appts) {
          const todayStr = format(now, "yyyy-MM-dd");
          appts.forEach(a => {
            const price = a.price || 0;
            const d = a.created_at || "";
            if (d >= monthStart && d <= monthEnd) { thisMonth += price; count++; }
            if (d >= lastMonthStart && d < monthStart) lastMonth += price;
            if (d >= weekStart) thisWeek += price;
            if (d.startsWith(todayStr)) today += price;
          });
        }
      }

      const growth = lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0;

      // Build chart data (last 30 days)
      const days: { date: string; revenue: number }[] = [];
      for (let i = 29; i >= 0; i--) {
        days.push({ date: format(subDays(now, i), "dd MMM", { locale: it }), revenue: 0 });
      }

      return { thisMonth, lastMonth, thisWeek, today, growth, count, fee: Math.round(thisMonth * 0.02), chartData: days };
    },
  });

  const r = revenueData || { thisMonth: 0, lastMonth: 0, thisWeek: 0, today: 0, growth: 0, count: 0, fee: 0, chartData: [] };

  const kpis = [
    { label: "Oggi", value: `€${r.today.toLocaleString("it")}`, icon: DollarSign, color: "text-green-400" },
    { label: "Settimana", value: `€${r.thisWeek.toLocaleString("it")}`, icon: TrendingUp, color: "text-blue-400" },
    { label: "Mese", value: `€${r.thisMonth.toLocaleString("it")}`, icon: Receipt, color: "text-purple-400", trend: r.growth },
    { label: "Fee Empire (2%)", value: `€${r.fee}`, icon: CreditCard, color: "text-primary" },
  ];

  const exportCSV = () => {
    const csv = "Data,Revenue\n" + r.chartData.map(d => `${d.date},${d.revenue}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "finance-export.csv"; a.click();
  };

  return (
    <motion.div className="space-y-6" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-heading">💰 Finanza & Contabilità</h1>
        <Button variant="outline" size="sm" onClick={exportCSV}><Download className="w-4 h-4 mr-1" />Export CSV</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <motion.div key={i} variants={cardV}>
            <Card className="border-border/50 bg-card/60 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <k.icon className={`w-4 h-4 ${k.color}`} />
                  <span className="text-xs text-muted-foreground">{k.label}</span>
                </div>
                {isLoading ? <Skeleton className="h-8 w-20" /> : (
                  <div className="flex items-end gap-2">
                    <p className="text-xl sm:text-2xl font-bold">{k.value}</p>
                    {k.trend !== undefined && (
                      <Badge variant={k.trend >= 0 ? "default" : "destructive"} className="text-xs">
                        {k.trend >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                        {k.trend}%
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div variants={cardV}>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-4">Revenue Ultimi 30 Giorni</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={r.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transazioni</TabsTrigger>
          <TabsTrigger value="invoices">Fatture</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-muted-foreground text-sm text-center py-8">
                {r.count > 0 ? `${r.count} transazioni questo mese per un totale di €${r.thisMonth.toLocaleString("it")}` : "Nessuna transazione questo mese"}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invoices">
          <Card className="border-border/50">
            <CardContent className="p-4 text-center text-muted-foreground py-8">
              Le fatture verranno generate automaticamente a fine mese.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
