import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, Clock, Car, Users, Calendar, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIndustry } from "@/hooks/useIndustry";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type FilterType = "all" | "expired" | "expiring" | "ok";

function getDaysUntil(date: string | null) {
  if (!date) return null;
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}

function getStatus(days: number | null): { label: string; color: string; icon: any; priority: number } {
  if (days === null) return { label: "N/D", color: "text-muted-foreground", icon: Clock, priority: 3 };
  if (days < 0) return { label: "SCADUTO", color: "text-red-400", icon: AlertTriangle, priority: 0 };
  if (days <= 30) return { label: `${days}gg`, color: "text-yellow-400", icon: AlertTriangle, priority: 1 };
  if (days <= 60) return { label: `${days}gg`, color: "text-amber-300", icon: Clock, priority: 2 };
  return { label: "OK", color: "text-green-400", icon: CheckCircle, priority: 3 };
}

export default function NCCExpiryPage() {
  const { companyId } = useIndustry();
  const [filter, setFilter] = useState<FilterType>("all");

  const { data: drivers = [], isLoading: driversLoading } = useQuery({
    queryKey: ["ncc-expiry-drivers", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("drivers")
        .select("id, first_name, last_name, license_expiry, has_cqc, cqc_expiry, status")
        .eq("company_id", companyId!);
      return (data || []) as any[];
    },
  });

  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ["ncc-expiry-vehicles", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("fleet_vehicles")
        .select("id, name, category, revision_expiry, insurance_expiry, is_active")
        .eq("company_id", companyId!)
        .eq("is_active", true);
      return (data || []) as any[];
    },
  });

  const isLoading = driversLoading || vehiclesLoading;

  // Build unified expiry list
  type ExpiryItem = { id: string; entity: string; type: string; category: "driver" | "vehicle"; date: string | null; days: number | null; status: ReturnType<typeof getStatus> };

  const items: ExpiryItem[] = [
    ...drivers.flatMap(d => {
      const entries: ExpiryItem[] = [];
      const licDays = getDaysUntil(d.license_expiry);
      entries.push({
        id: `${d.id}-lic`, entity: `${d.first_name} ${d.last_name}`, type: "Patente",
        category: "driver", date: d.license_expiry, days: licDays, status: getStatus(licDays),
      });
      if (d.has_cqc) {
        const cqcDays = getDaysUntil(d.cqc_expiry);
        entries.push({
          id: `${d.id}-cqc`, entity: `${d.first_name} ${d.last_name}`, type: "CQC",
          category: "driver", date: d.cqc_expiry, days: cqcDays, status: getStatus(cqcDays),
        });
      }
      return entries;
    }),
    ...vehicles.flatMap(v => {
      const entries: ExpiryItem[] = [];
      const revDays = getDaysUntil(v.revision_expiry);
      entries.push({
        id: `${v.id}-rev`, entity: v.name, type: "Revisione",
        category: "vehicle", date: v.revision_expiry, days: revDays, status: getStatus(revDays),
      });
      const insDays = getDaysUntil(v.insurance_expiry);
      entries.push({
        id: `${v.id}-ins`, entity: v.name, type: "Assicurazione",
        category: "vehicle", date: v.insurance_expiry, days: insDays, status: getStatus(insDays),
      });
      return entries;
    }),
  ].sort((a, b) => (a.status.priority - b.status.priority) || ((a.days ?? 999) - (b.days ?? 999)));

  const filtered = items.filter(item => {
    if (filter === "all") return true;
    if (filter === "expired") return item.days !== null && item.days < 0;
    if (filter === "expiring") return item.days !== null && item.days >= 0 && item.days <= 60;
    if (filter === "ok") return item.days === null || item.days > 60;
    return true;
  });

  const expired = items.filter(i => i.days !== null && i.days < 0).length;
  const expiring = items.filter(i => i.days !== null && i.days >= 0 && i.days <= 60).length;
  const ok = items.filter(i => i.days === null || i.days > 60).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading">Scadenzario</h1>
        <p className="text-sm text-muted-foreground">Patenti, revisioni e assicurazioni</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className={`border-red-500/30 bg-red-500/5 cursor-pointer ${filter === "expired" ? "ring-2 ring-red-500/50" : ""}`} onClick={() => setFilter(f => f === "expired" ? "all" : "expired")}>
          <CardContent className="p-3 text-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-red-400">{expired}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Scaduti</p>
          </CardContent>
        </Card>
        <Card className={`border-yellow-500/30 bg-yellow-500/5 cursor-pointer ${filter === "expiring" ? "ring-2 ring-yellow-500/50" : ""}`} onClick={() => setFilter(f => f === "expiring" ? "all" : "expiring")}>
          <CardContent className="p-3 text-center">
            <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-yellow-400">{expiring}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">In Scadenza</p>
          </CardContent>
        </Card>
        <Card className={`border-green-500/30 bg-green-500/5 cursor-pointer ${filter === "ok" ? "ring-2 ring-green-500/50" : ""}`} onClick={() => setFilter(f => f === "ok" ? "all" : "ok")}>
          <CardContent className="p-3 text-center">
            <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-400">{ok}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">In Regola</p>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <Card className="border-border/40 bg-card/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Documenti ({filtered.length})
            {filter !== "all" && (
              <Button size="sm" variant="ghost" className="ml-auto text-xs h-7" onClick={() => setFilter("all")}>
                Mostra tutti
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center">
              <Shield className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">Nessun documento trovato</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filtered.map((item, i) => {
                const StatusIcon = item.status.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      item.category === "driver" ? "bg-blue-500/10" : "bg-amber-500/10"
                    }`}>
                      {item.category === "driver" ? (
                        <Users className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Car className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.entity}</p>
                      <p className="text-[11px] text-muted-foreground">{item.type}</p>
                    </div>
                    <div className="text-right flex-shrink-0 flex items-center gap-2">
                      {item.date && (
                        <span className="text-[11px] text-muted-foreground hidden sm:block">
                          {new Date(item.date).toLocaleDateString("it-IT")}
                        </span>
                      )}
                      <Badge variant="outline" className={`text-[10px] ${item.status.color} border-current/20`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {item.status.label}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
