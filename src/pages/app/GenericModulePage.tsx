import { useParams, useLocation } from "react-router-dom";
import { useIndustry } from "@/hooks/useIndustry";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

// Catch-all for industry-specific modules that don't have dedicated pages yet
const MODULE_LABELS: Record<string, string> = {
  kitchen: "Vista Cucina",
  tables: "Mappa Tavoli",
  crm: "CRM Clienti",
  destinations: "Gestione Destinazioni",
  drivers: "Gestione Autisti",
  appointments: "Gestione Appuntamenti",
  services: "Catalogo Servizi",
  clients: "Anagrafica Clienti",
  operators: "Gestione Operatori",
  products: "Catalogo Prodotti",
  patients: "Anagrafica Pazienti",
  treatments: "Prestazioni Mediche",
  billing: "Fatturazione",
  catalog: "Catalogo Prodotti",
  members: "Gestione Membri",
  trainers: "Gestione Trainer",
  subscriptions: "Abbonamenti",
  rooms: "Gestione Camere",
  guests: "Registro Ospiti",
  housekeeping: "Housekeeping",
  classes: "Corsi & Lezioni",
  marketplace: "Marketplace Moduli",
  concierge: "Concierge AI",
  webhub: "WebHub",
  lab: "Lab Sperimentale",
};

export default function GenericModulePage() {
  const location = useLocation();
  const { config } = useIndustry();
  const segment = location.pathname.split("/").pop() || "";
  const label = MODULE_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-heading">{label}</h1>
      <Card className="border-border/50">
        <CardContent className="p-12 text-center">
          <Construction className="w-12 h-12 mx-auto mb-4 text-primary opacity-60" />
          <h2 className="text-lg font-semibold mb-2">Modulo in Sviluppo</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Il modulo <strong>{label}</strong> per il settore <strong>{config.label}</strong> è
            in fase di implementazione. Sarà disponibile a breve con tutte le funzionalità complete.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
