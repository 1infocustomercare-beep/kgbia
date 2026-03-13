import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useIndustry } from "@/hooks/useIndustry";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const MONTHS = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

const EXTRA_KEYS = [
  { key: "stop", label: "Sosta panoramica (€ a sosta)", isPct: false },
  { key: "waiting", label: "Attesa extra (€/ora oltre 30min)", isPct: false },
  { key: "night", label: "Supplemento notturno 22:00-06:00 (%)", isPct: true },
  { key: "baby_seat", label: "Baby seat (€)", isPct: false },
  { key: "extra_luggage", label: "Portabagagli extra (€ a bagaglio)", isPct: false },
  { key: "holiday", label: "Supplemento festivi (%)", isPct: true },
];

export default function NCCPricingPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();

  // Routes & vehicles
  const { data: routes = [] } = useQuery({
    queryKey: ["pricing-routes", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("ncc_routes").select("id, origin, destination").eq("company_id", companyId!).eq("is_active", true).order("created_at");
      return data || [];
    },
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ["pricing-vehicles", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("fleet_vehicles").select("id, name").eq("company_id", companyId!).eq("is_active", true).order("name");
      return data || [];
    },
  });

  // Route prices matrix
  const { data: routePrices = {}, isLoading: loadingPrices } = useQuery({
    queryKey: ["route-prices", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const routeIds = routes.map((r: any) => r.id);
      if (routeIds.length === 0) return {};
      const { data } = await (supabase as any).from("route_prices").select("*").in("route_id", routeIds);
      const map: Record<string, number> = {};
      (data || []).forEach((rp: any) => { map[`${rp.route_id}_${rp.vehicle_id}`] = rp.base_price; });
      return map;
    },
  });

  const [priceEdits, setPriceEdits] = useState<Record<string, string>>({});

  const savePricesMutation = useMutation({
    mutationFn: async () => {
      const upserts = Object.entries(priceEdits).map(([key, val]) => {
        const [route_id, vehicle_id] = key.split("_");
        return { route_id, vehicle_id, base_price: parseFloat(val) || 0 };
      });
      if (upserts.length === 0) return;
      const { error } = await (supabase as any).from("route_prices").upsert(upserts, { onConflict: "route_id,vehicle_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Prezzi salvati con successo!");
      queryClient.invalidateQueries({ queryKey: ["route-prices"] });
      setPriceEdits({});
    },
    onError: () => toast.error("Errore nel salvataggio"),
  });

  // Seasonal prices
  const [seasonMonth, setSeasonMonth] = useState("1");
  const { data: seasonalPrices = {} } = useQuery({
    queryKey: ["seasonal-prices", companyId, seasonMonth],
    enabled: !!companyId,
    queryFn: async () => {
      const routeIds = routes.map((r: any) => r.id);
      if (routeIds.length === 0) return {};
      const { data } = await (supabase as any).from("seasonal_prices").select("*").in("route_id", routeIds).eq("month", parseInt(seasonMonth));
      const map: Record<string, number> = {};
      (data || []).forEach((sp: any) => { map[`${sp.route_id}_${sp.vehicle_id || "all"}`] = sp.price; });
      return map;
    },
  });

  const [seasonEdits, setSeasonEdits] = useState<Record<string, string>>({});

  const saveSeasonMutation = useMutation({
    mutationFn: async () => {
      const upserts = Object.entries(seasonEdits).map(([key, val]) => {
        const [route_id, vehicle_id_or_all] = key.split("_");
        return {
          route_id, month: parseInt(seasonMonth), price: parseFloat(val) || 0,
          vehicle_id: vehicle_id_or_all === "all" ? null : vehicle_id_or_all,
        };
      });
      if (upserts.length === 0) return;
      const { error } = await (supabase as any).from("seasonal_prices").upsert(upserts, { onConflict: "route_id,vehicle_id,month" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Prezzi stagionali salvati!");
      queryClient.invalidateQueries({ queryKey: ["seasonal-prices"] });
      setSeasonEdits({});
    },
    onError: () => toast.error("Errore nel salvataggio"),
  });

  // Boat prices
  const { data: destinations = [] } = useQuery({
    queryKey: ["pricing-destinations", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("ncc_destinations").select("id, name").eq("company_id", companyId!);
      return data || [];
    },
  });

  const { data: boatPrices = {} } = useQuery({
    queryKey: ["boat-prices", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const destIds = destinations.map((d: any) => d.id);
      if (destIds.length === 0) return {};
      const { data } = await supabase.from("boat_prices").select("*").in("destination_id", destIds);
      const map: Record<string, any> = {};
      (data || []).forEach((bp: any) => { map[bp.destination_id] = bp; });
      return map;
    },
  });

  const [boatEdits, setBoatEdits] = useState<Record<string, { standard: string; group: string; children: string }>>({});

  const saveBoatMutation = useMutation({
    mutationFn: async () => {
      const upserts = Object.entries(boatEdits).map(([destId, vals]) => ({
        destination_id: destId,
        standard_price: parseFloat(vals.standard) || 0,
        group_price: parseFloat(vals.group) || 0,
        children_price: parseFloat(vals.children) || 0,
      }));
      if (upserts.length === 0) return;
      const { error } = await supabase.from("boat_prices").upsert(upserts, { onConflict: "destination_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Prezzi barca salvati!");
      queryClient.invalidateQueries({ queryKey: ["boat-prices"] });
      setBoatEdits({});
    },
    onError: () => toast.error("Errore nel salvataggio"),
  });

  // Extra prices
  const { data: extras = {} } = useQuery({
    queryKey: ["extra-prices", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("extra_prices").select("*").eq("company_id", companyId!);
      const map: Record<string, number> = {};
      (data || []).forEach((ep: any) => { map[ep.key] = ep.value; });
      return map;
    },
  });

  const [extraEdits, setExtraEdits] = useState<Record<string, string>>({});

  const saveExtraMutation = useMutation({
    mutationFn: async () => {
      const upserts = EXTRA_KEYS.map((ek) => ({
        company_id: companyId!,
        key: ek.key,
        label: ek.label,
        value: parseFloat(extraEdits[ek.key] ?? String(extras[ek.key] ?? 0)) || 0,
        is_percentage: ek.isPct,
      }));
      const { error } = await supabase.from("extra_prices").upsert(upserts, { onConflict: "company_id,key" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Extra salvati!");
      queryClient.invalidateQueries({ queryKey: ["extra-prices"] });
      setExtraEdits({});
    },
    onError: () => toast.error("Errore nel salvataggio"),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold font-heading">Gestione Prezzi</h1>

      <Tabs defaultValue="matrix">
        <TabsList className="bg-secondary/50 overflow-x-auto flex-nowrap w-full">
          <TabsTrigger value="matrix" className="text-xs sm:text-sm">Prezzi Base</TabsTrigger>
          <TabsTrigger value="seasonal" className="text-xs sm:text-sm">Stagionali</TabsTrigger>
          <TabsTrigger value="boat" className="text-xs sm:text-sm">Barca</TabsTrigger>
          <TabsTrigger value="extras" className="text-xs sm:text-sm">Extra</TabsTrigger>
        </TabsList>

        {/* ── TAB 1: Price Matrix ── */}
        <TabsContent value="matrix" className="mt-4">
          <Card className="border-border/40">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Matrice Prezzi Tratta × Veicolo</CardTitle>
              <Button size="sm" className="h-9 min-h-[36px]" onClick={() => savePricesMutation.mutate()} disabled={Object.keys(priceEdits).length === 0 || savePricesMutation.isPending}>
                <Save className="w-3.5 h-3.5 mr-1" />Salva
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full text-xs border-collapse min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="text-left p-2 border-b border-border/40 sticky left-0 bg-card z-10 min-w-[180px]">Tratta</th>
                      {vehicles.map((v: any) => <th key={v.id} className="p-2 border-b border-border/40 text-center min-w-[90px]">{v.name}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((r: any) => (
                      <tr key={r.id} className="hover:bg-secondary/20">
                        <td className="p-2 border-b border-border/20 sticky left-0 bg-card z-10 text-muted-foreground">{r.origin} → {r.destination}</td>
                        {vehicles.map((v: any) => {
                          const key = `${r.id}_${v.id}`;
                          const current = priceEdits[key] ?? String(routePrices[key] ?? "");
                          return (
                            <td key={v.id} className="p-1 border-b border-border/20 text-center">
                              <Input
                                type="number"
                                className="h-8 text-center text-xs w-full min-w-[70px]"
                                placeholder="€"
                                value={current}
                                onChange={(e) => setPriceEdits({ ...priceEdits, [key]: e.target.value })}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {routes.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Aggiungi tratte e veicoli per configurare i prezzi</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── TAB 2: Seasonal ── */}
        <TabsContent value="seasonal" className="mt-4">
          <Card className="border-border/40">
            <CardHeader className="pb-2 flex flex-row items-center justify-between gap-3">
              <CardTitle className="text-sm">Variazioni Stagionali</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={seasonMonth} onValueChange={setSeasonMonth}>
                  <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>{MONTHS.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}</SelectContent>
                </Select>
                <Button size="sm" className="h-9" onClick={() => saveSeasonMutation.mutate()} disabled={Object.keys(seasonEdits).length === 0}>
                  <Save className="w-3.5 h-3.5 mr-1" />Salva
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {routes.map((r: any) => {
                  const key = `${r.id}_all`;
                  const val = seasonEdits[key] ?? String(seasonalPrices[key] ?? "");
                  return (
                    <div key={r.id} className="flex items-center gap-3 p-2 rounded bg-secondary/20">
                      <span className="text-sm flex-1 min-w-0 truncate">{r.origin} → {r.destination}</span>
                      <Input type="number" className="h-9 w-24 text-right" placeholder="€" value={val}
                        onChange={(e) => setSeasonEdits({ ...seasonEdits, [key]: e.target.value })} />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── TAB 3: Boat Prices ── */}
        <TabsContent value="boat" className="mt-4">
          <Card className="border-border/40">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Prezzi Tour Barca</CardTitle>
              <Button size="sm" className="h-9" onClick={() => saveBoatMutation.mutate()} disabled={Object.keys(boatEdits).length === 0}>
                <Save className="w-3.5 h-3.5 mr-1" />Salva Prezzi Barca
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2 border-b border-border/40">Destinazione</th>
                      <th className="p-2 border-b border-border/40 text-center">Standard (€)</th>
                      <th className="p-2 border-b border-border/40 text-center">Gruppo &gt;6 (€)</th>
                      <th className="p-2 border-b border-border/40 text-center">Bambini &lt;12 (€)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {destinations.map((d: any) => {
                      const bp: any = boatPrices[d.id] || {};
                      const edits = boatEdits[d.id] || { standard: String(bp.standard_price ?? ""), group: String(bp.group_price ?? ""), children: String(bp.children_price ?? "") };
                      return (
                        <tr key={d.id}>
                          <td className="p-2 border-b border-border/20">{d.name}</td>
                          <td className="p-1 border-b border-border/20"><Input type="number" className="h-9 text-center" value={edits.standard} onChange={(e) => setBoatEdits({ ...boatEdits, [d.id]: { ...edits, standard: e.target.value } })} /></td>
                          <td className="p-1 border-b border-border/20"><Input type="number" className="h-9 text-center" value={edits.group} onChange={(e) => setBoatEdits({ ...boatEdits, [d.id]: { ...edits, group: e.target.value } })} /></td>
                          <td className="p-1 border-b border-border/20"><Input type="number" className="h-9 text-center" value={edits.children} onChange={(e) => setBoatEdits({ ...boatEdits, [d.id]: { ...edits, children: e.target.value } })} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {destinations.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Aggiungi destinazioni barca nella sezione Tratte</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── TAB 4: Extras ── */}
        <TabsContent value="extras" className="mt-4">
          <Card className="border-border/40">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Extra e Supplementi</CardTitle>
              <Button size="sm" className="h-9" onClick={() => saveExtraMutation.mutate()}>
                <Save className="w-3.5 h-3.5 mr-1" />Salva Extra
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {EXTRA_KEYS.map((ek) => (
                <div key={ek.key} className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Label className="flex-1 text-sm">{ek.label}</Label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      className="h-10 w-24 text-right"
                      value={extraEdits[ek.key] ?? String(extras[ek.key] ?? "")}
                      onChange={(e) => setExtraEdits({ ...extraEdits, [ek.key]: e.target.value })}
                      placeholder={ek.isPct ? "%" : "€"}
                    />
                    <span className="text-xs text-muted-foreground w-4">{ek.isPct ? "%" : "€"}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
