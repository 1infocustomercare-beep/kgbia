import { useState } from "react";
import { useIndustry } from "@/hooks/useIndustry";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Lock, Mail, MessageSquare, Bell, Gift, Package, RotateCcw, UserPlus } from "lucide-react";
import { toast } from "sonner";

const AUTOMATION_TYPES = [
  { type: "booking_confirmation", label: "Conferma prenotazione/ordine", icon: Mail, emoji: "✉️", defaultSubject: "Conferma prenotazione", defaultBody: "Ciao {nome}, la tua prenotazione per {servizio} del {data} è confermata! Ti aspettiamo. — {azienda}" },
  { type: "appointment_reminder", label: "Promemoria appuntamento (24h prima)", icon: Bell, emoji: "⏰", defaultSubject: "Promemoria appuntamento", defaultBody: "Ciao {nome}, ti ricordiamo il tuo appuntamento domani ({data}) per {servizio}. A presto! — {azienda}" },
  { type: "review_request", label: "Richiesta recensione (2h dopo)", icon: MessageSquare, emoji: "⭐", defaultSubject: "Come è stata la tua esperienza?", defaultBody: "Ciao {nome}, grazie per aver scelto {azienda}! Ci piacerebbe sapere come è andata. Lascia una recensione!" },
  { type: "birthday_wish", label: "Auguri compleanno", icon: Gift, emoji: "🎂", defaultSubject: "Buon Compleanno!", defaultBody: "Tanti auguri {nome}! 🎂 Per festeggiare, ti offriamo uno sconto speciale. — {azienda}" },
  { type: "low_stock_alert", label: "Scorta bassa (notifica interna)", icon: Package, emoji: "📦", defaultSubject: "Scorta bassa", defaultBody: "Attenzione: il prodotto ha raggiunto la soglia minima di scorta." },
  { type: "subscription_expiring", label: "Abbonamento in scadenza (7gg prima)", icon: RotateCcw, emoji: "🔄", defaultSubject: "Il tuo abbonamento sta per scadere", defaultBody: "Ciao {nome}, il tuo abbonamento scade tra 7 giorni. Rinnova ora per non perdere i vantaggi! — {azienda}" },
  { type: "welcome_new_client", label: "Benvenuto nuovo cliente", icon: UserPlus, emoji: "👋", defaultSubject: "Benvenuto!", defaultBody: "Ciao {nome}, benvenuto in {azienda}! Siamo felici di averti come cliente. — {azienda}" },
];

export default function AutomationsPage() {
  const { companyId, company } = useIndustry();
  const queryClient = useQueryClient();
  const plan = company?.subscription_plan || "essential";
  const hasPremium = plan === "smart_ia" || plan === "empire_pro";

  const { data: automations = [], isLoading } = useQuery({
    queryKey: ["automations", companyId],
    enabled: !!companyId && hasPremium,
    queryFn: async () => {
      const { data } = await supabase
        .from("automations")
        .select("*")
        .eq("company_id", companyId!);
      return data || [];
    },
  });

  const upsert = useMutation({
    mutationFn: async (auto: { automation_type: string; is_active: boolean; template_subject?: string; template_body?: string }) => {
      const existing = automations.find((a: any) => a.automation_type === auto.automation_type);
      if (existing) {
        await supabase.from("automations").update({
          is_active: auto.is_active,
          template_subject: auto.template_subject ?? existing.template_subject,
          template_body: auto.template_body ?? existing.template_body,
        }).eq("id", existing.id);
      } else {
        await supabase.from("automations").insert({
          company_id: companyId!,
          automation_type: auto.automation_type,
          is_active: auto.is_active,
          template_subject: auto.template_subject || "",
          template_body: auto.template_body || "",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      toast.success("Automazione aggiornata!");
    },
  });

  // Plan gate
  if (!hasPremium) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold font-heading">⚡ Automazioni</h1>
        <Card className="border-border/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4 p-6">
            <Lock className="w-12 h-12 text-muted-foreground" />
            <h2 className="text-lg font-bold text-center">Disponibile dal piano Smart IA</h2>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Le automazioni ti permettono di inviare email automatiche ai clienti: conferme, promemoria, richieste recensione e molto altro.
            </p>
            <Button className="h-11 min-h-[44px]" onClick={() => toast.info("Vai su Impostazioni → Piano per aggiornare")}>
              Aggiorna Piano
            </Button>
          </div>
          <CardContent className="p-6 filter blur-sm">
            <div className="space-y-4">
              {AUTOMATION_TYPES.slice(0, 3).map(a => (
                <div key={a.type} className="flex items-center gap-3 p-3 border rounded-lg border-border/30">
                  <span className="text-2xl">{a.emoji}</span>
                  <div className="flex-1"><p className="font-medium text-sm">{a.label}</p></div>
                  <Switch disabled />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) return <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold font-heading">⚡ Automazioni</h1>
      <p className="text-sm text-muted-foreground">Configura le email automatiche per i tuoi clienti</p>

      <div className="space-y-4">
        {AUTOMATION_TYPES.map(at => {
          const existing = automations.find((a: any) => a.automation_type === at.type);
          const isActive = existing?.is_active ?? false;
          const sentCount = existing?.sent_count ?? 0;

          return (
            <AutomationCard
              key={at.type}
              config={at}
              isActive={isActive}
              sentCount={sentCount}
              subject={existing?.template_subject || at.defaultSubject}
              body={existing?.template_body || at.defaultBody}
              onToggle={(active) => upsert.mutate({ automation_type: at.type, is_active: active, template_subject: existing?.template_subject || at.defaultSubject, template_body: existing?.template_body || at.defaultBody })}
              onSave={(subject, body) => upsert.mutate({ automation_type: at.type, is_active: isActive, template_subject: subject, template_body: body })}
            />
          );
        })}
      </div>
    </div>
  );
}

function AutomationCard({ config, isActive, sentCount, subject, body, onToggle, onSave }: {
  config: typeof AUTOMATION_TYPES[0];
  isActive: boolean;
  sentCount: number;
  subject: string;
  body: string;
  onToggle: (active: boolean) => void;
  onSave: (subject: string, body: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [localSubject, setLocalSubject] = useState(subject);
  const [localBody, setLocalBody] = useState(body);
  const Icon = config.icon;

  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{config.label}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-[10px]">Email</Badge>
              <Badge variant="secondary" className="text-[10px]">WhatsApp (coming soon)</Badge>
              {sentCount > 0 && <span className="text-[10px] text-muted-foreground">Inviati: {sentCount}</span>}
            </div>
          </div>
          <Switch checked={isActive} onCheckedChange={onToggle} />
        </div>

        <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Nascondi template" : "Modifica template"}
        </Button>

        {expanded && (
          <div className="mt-3 space-y-3 border-t border-border/30 pt-3">
            <div><Label className="text-xs">Oggetto</Label><Input value={localSubject} onChange={e => setLocalSubject(e.target.value)} className="h-10" /></div>
            <div>
              <Label className="text-xs">Corpo messaggio</Label>
              <Textarea value={localBody} onChange={e => setLocalBody(e.target.value)} rows={4} />
              <p className="text-[10px] text-muted-foreground mt-1">Variabili: {"{nome}"}, {"{data}"}, {"{servizio}"}, {"{importo}"}, {"{azienda}"}</p>
            </div>
            <Button size="sm" className="h-10" onClick={() => onSave(localSubject, localBody)}>Salva Template</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
