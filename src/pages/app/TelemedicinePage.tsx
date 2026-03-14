import { useIndustry } from "@/hooks/useIndustry";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Calendar, FileText, Phone, Clock, User } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function TelemedicinePage() {
  const { companyId } = useIndustry();

  const { data: appointments = [] } = useQuery({
    queryKey: ["tele-appointments", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("appointments").select("*")
        .eq("company_id", companyId!).order("scheduled_at", { ascending: true }).limit(20);
      return data || [];
    },
  });

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Video className="w-6 h-6 text-primary" />Telemedicina
        </h1>
        <Button size="sm"><Calendar className="w-4 h-4 mr-1" />Nuova Visita Tele</Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: "Visite oggi", value: appointments.filter((a: any) => new Date(a.scheduled_at).toDateString() === new Date().toDateString()).length, icon: Video },
          { label: "Questa settimana", value: appointments.length, icon: Calendar },
          { label: "Prescrizioni emesse", value: "12", icon: FileText },
        ].map(s => (
          <Card key={s.label} className="border-border/30">
            <CardContent className="p-3 text-center">
              <s.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Prossime Visite Tele</h3>
        {appointments.length === 0 ? (
          <Card className="border-border/50"><CardContent className="p-8 text-center text-muted-foreground">Nessuna visita tele programmata</CardContent></Card>
        ) : appointments.map((a: any) => (
          <Card key={a.id} className="border-border/30 hover:border-primary/30 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{a.client_name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {new Date(a.scheduled_at).toLocaleDateString("it")} ore {new Date(a.scheduled_at).toLocaleTimeString("it", { hour: "2-digit", minute: "2-digit" })}
                  {a.service_name && <><span>•</span><span>{a.service_name}</span></>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => toast.info("Generazione prescrizione...")}>
                  <FileText className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" onClick={() => window.open("https://meet.jit.si/empire-" + a.id.slice(-8), "_blank")}>
                  <Video className="w-3.5 h-3.5 mr-1" />Avvia
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
