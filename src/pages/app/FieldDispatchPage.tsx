import { useIndustry } from "@/hooks/useIndustry";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Clock, Wrench, ArrowRight, FileText, Camera } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const STATUS_FLOW = ["assigned", "travelling", "on_site", "completed"];
const STATUS_LABEL: Record<string, string> = { assigned: "Assegnato", travelling: "In Viaggio", on_site: "Sul Posto", completed: "Completato" };
const STATUS_COLOR: Record<string, string> = { assigned: "bg-blue-500", travelling: "bg-amber-500", on_site: "bg-violet-500", completed: "bg-emerald-500" };

export default function FieldDispatchPage() {
  const { companyId, terminology } = useIndustry();
  const queryClient = useQueryClient();

  const { data: interventions = [] } = useQuery({
    queryKey: ["field-dispatch", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase.from("interventions").select("*")
        .eq("company_id", companyId!)
        .order("scheduled_at", { ascending: true });
      return data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await supabase.from("interventions").update({ status }).eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["field-dispatch"] });
      toast.success("Stato aggiornato");
    },
  });

  const nextStatus = (current: string) => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : current;
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Wrench className="w-6 h-6 text-primary" />Dispatch Interventi
        </h1>
        <Badge variant="secondary">{interventions.length} oggi</Badge>
      </div>

      {/* Map placeholder */}
      <Card className="border-border/50">
        <CardContent className="p-0 h-48 bg-gradient-to-br from-muted/20 to-muted/5 flex items-center justify-center text-muted-foreground text-sm">
          🗺️ Mappa interventi giornalieri
        </CardContent>
      </Card>

      <div className="space-y-3">
        {interventions.length === 0 ? (
          <Card className="border-border/50"><CardContent className="p-8 text-center text-muted-foreground">Nessun intervento pianificato</CardContent></Card>
        ) : interventions.map((int: any) => {
          const status = int.status || "assigned";
          return (
            <motion.div key={int.id} layout>
              <Card className="border-border/30">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${STATUS_COLOR[status] || "bg-muted"}`} />
                      <span className="font-medium text-sm">{int.client_name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">{STATUS_LABEL[status] || status}</Badge>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2"><Wrench className="w-3 h-3" />{int.intervention_type}</div>
                    {int.address && <div className="flex items-center gap-2"><MapPin className="w-3 h-3" />{int.address}</div>}
                    {int.technician_name && <div className="flex items-center gap-2"><User className="w-3 h-3" />{int.technician_name}</div>}
                    {int.scheduled_at && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {new Date(int.scheduled_at).toLocaleString("it", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {status !== "completed" && (
                      <Button size="sm" className="flex-1 text-xs" onClick={() => updateStatus.mutate({ id: int.id, status: nextStatus(status) })}>
                        <ArrowRight className="w-3 h-3 mr-1" />{STATUS_LABEL[nextStatus(status)]}
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => toast.info("Generazione rapportino PDF...")}>
                      <FileText className="w-3 h-3 mr-1" />PDF
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => toast.info("Aggiungi foto...")}>
                      <Camera className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
