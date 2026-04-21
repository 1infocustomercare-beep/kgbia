import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertTriangle, ExternalLink, Search, Sparkles, Globe, Instagram, Building2, Zap, Mail, MessageSquare, Facebook, CreditCard, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ApiStatus {
  key: string;
  name: string;
  description: string;
  icon: any;
  status: "connected" | "missing" | "checking";
  costPerCall: string;
  requiredFor: string[];
  setupSteps: string[];
  setupUrl?: string;
  isManaged?: boolean; // gestito da admin centrale (Empire)
}

export default function PartnerApiConnectionsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "connected" | "missing">("all");
  const [apis, setApis] = useState<ApiStatus[]>([
    {
      key: "FIRECRAWL_API_KEY",
      name: "Firecrawl",
      description: "Scraping professionale di Yelp, TripAdvisor, Pagine Gialle, Instagram, Facebook. Necessaria per l'arricchimento PRO.",
      icon: Globe,
      status: "checking",
      costPerCall: "~€0.05/scrape",
      requiredFor: ["Arricchimento PRO", "Check social", "Yelp/TripAdvisor rating"],
      setupSteps: [
        "Vai su firecrawl.dev e crea un account gratuito (500 scrape/mese inclusi)",
        "Vai su Dashboard → API Keys e copia la chiave",
        "Empire la usa già centralmente: tu paghi solo i crediti, noi gestiamo l'API",
        "Se vuoi un piano dedicato, scrivi a info@empireaigroup.com",
      ],
      setupUrl: "https://www.firecrawl.dev/app/api-keys",
      isManaged: true,
    },
    {
      key: "LOVABLE_API_KEY",
      name: "Lovable AI Gateway",
      description: "Modelli AI (Gemini 2.5 Flash, GPT-5) per analisi prospect, generazione preview e content. Già configurato.",
      icon: Sparkles,
      status: "checking",
      costPerCall: "~€0.001/1K token",
      requiredFor: ["Analisi prospect", "Preview custom", "Empire Brain"],
      setupSteps: ["Già configurato e gestito da Empire centralmente — nessuna azione richiesta."],
      isManaged: true,
    },
    {
      key: "GOOGLE_PLACES_API",
      name: "Google Places (Maps)",
      description: "Ricerca attività reali su Google Maps con dati ufficiali (rating, recensioni, telefono, indirizzo).",
      icon: Search,
      status: "missing",
      costPerCall: "~€0.017/text-search",
      requiredFor: ["Ricerca lead per zona", "Verifica rating reali"],
      setupSteps: [
        "Vai su console.cloud.google.com",
        "Crea un nuovo progetto o seleziona uno esistente",
        "Abilita 'Places API (New)' dalla libreria API",
        "Genera una chiave API in Credenziali",
        "Limita la chiave per IP/HTTP referrer per sicurezza",
        "Empire userà la sua chiave centrale: tu spendi solo crediti",
      ],
      setupUrl: "https://console.cloud.google.com/apis/library/places.googleapis.com",
      isManaged: true,
    },
    {
      key: "INSTAGRAM_GRAPH_API",
      name: "Instagram Graph API (opzionale)",
      description: "Verifica diretta presenza Instagram business. Alternativa: usiamo Firecrawl per scrape.",
      icon: Instagram,
      status: "missing",
      costPerCall: "Gratis (rate limit)",
      requiredFor: ["Check social attivo (premium)"],
      setupSteps: [
        "Crea un'app Meta su developers.facebook.com",
        "Aggiungi prodotto 'Instagram Graph API'",
        "Genera token a lungo termine",
        "OPZIONALE: Empire usa Firecrawl come fallback gratuito",
      ],
      setupUrl: "https://developers.facebook.com/apps",
      isManaged: false,
    },
    {
      key: "REGISTRO_IMPRESE_API",
      name: "Registro Imprese / P.IVA",
      description: "Lookup partita IVA su database pubblici italiani. Verifica che l'attività sia attiva e regolare.",
      icon: Building2,
      status: "missing",
      costPerCall: "~€0.10/lookup",
      requiredFor: ["Verifica P.IVA", "Stato fiscale attività"],
      setupSteps: [
        "Registrati su registroimprese.it (Infocamere)",
        "Sottoscrivi un abbonamento 'Visure online' (~€20/mese)",
        "Genera credenziali API dalla tua area riservata",
        "Empire fornisce alternativa via Firecrawl scraping pubblico (gratis ma più lento)",
      ],
      setupUrl: "https://www.registroimprese.it",
      isManaged: false,
    },
    {
      key: "RESEND_API_KEY",
      name: "Resend (Email Outreach)",
      description: "Invio email automatico ai lead da parte di Arianna Autopilot. Necessario per la sequenza multi-canale.",
      icon: Mail,
      status: "missing",
      costPerCall: "Gratis fino a 3.000 email/mese, poi $20/mese (50K)",
      requiredFor: ["Arianna Outreach Email", "Follow-up automatici", "Mockup preview email"],
      setupSteps: [
        "Vai su resend.com e crea un account gratuito",
        "Verifica un dominio email (es. tuostudio.it) seguendo la guida DNS",
        "Vai su Dashboard → API Keys → Create API Key (permessi 'Sending')",
        "Copia la chiave (inizia con re_…) e incollala nel campo qui sotto cliccando 'Aggiungi chiave'",
        "Empire userà quella chiave per inviare email a nome tuo (sender personalizzabile)",
      ],
      setupUrl: "https://resend.com/api-keys",
      isManaged: false,
    },
    {
      key: "TWILIO_API_KEY",
      name: "Twilio (WhatsApp Business)",
      description: "Invio WhatsApp automatici ai lead via Twilio API. Necessario per il canale WhatsApp di Arianna.",
      icon: MessageSquare,
      status: "missing",
      costPerCall: "~€0.005/msg WhatsApp",
      requiredFor: ["Arianna Outreach WhatsApp", "Notifiche cliente", "Follow-up vocali"],
      setupSteps: [
        "Vai su twilio.com e registrati (riceverai $15 di credito di prova)",
        "Console → Messaging → Try it out → Send a WhatsApp message → attiva sandbox",
        "Per produzione: richiedi numero WhatsApp Business approvato da Meta",
        "Account → API keys & tokens → crea Auth Token e copia anche Account SID",
        "Aggiungi qui la chiave; Empire combinerà SID + Token per autenticare",
      ],
      setupUrl: "https://console.twilio.com/us1/account/keys-credentials/api-keys",
      isManaged: false,
    },
    {
      key: "META_GRAPH_API_KEY",
      name: "Meta Graph API (Instagram + Facebook DM)",
      description: "Invio diretto messaggi Instagram DM e Facebook Messenger ai lead. Senza, generiamo solo link 'apri DM'.",
      icon: Facebook,
      status: "missing",
      costPerCall: "Gratis (rate limit Meta)",
      requiredFor: ["DM Instagram automatico", "Facebook Messenger outreach"],
      setupSteps: [
        "Vai su developers.facebook.com → My Apps → Create App → tipo 'Business'",
        "Aggiungi prodotti: 'Instagram Graph API' + 'Messenger'",
        "Collega la tua pagina Facebook business e l'account Instagram professionale",
        "Genera 'Page Access Token' a lungo termine (60 giorni → poi rinnovo automatico)",
        "Copia il token qui. Empire lo userà per inviare DM solo a chi ha già interagito (regola Meta anti-spam)",
      ],
      setupUrl: "https://developers.facebook.com/apps",
      isManaged: false,
    },
    {
      key: "STRIPE_SECRET_KEY",
      name: "Stripe (Pagamenti & Commissioni Partner)",
      description: "Necessario per Stripe Connect (pagamenti partner), checkout cliente e commissioni Empire.",
      icon: CreditCard,
      status: "missing",
      costPerCall: "1.4% + €0.25/transazione UE",
      requiredFor: ["Onboarding partner Stripe", "Checkout cliente", "Fee Empire automatica"],
      setupSteps: [
        "Vai su dashboard.stripe.com e crea un account business",
        "Completa la verifica identità (richiede documento + IBAN)",
        "Developers → API keys → copia la 'Secret key' (inizia con sk_live_…)",
        "Attiva 'Stripe Connect' in Settings → Connect → Get started",
        "Incolla la chiave qui. Empire la userà SOLO server-side, mai esposta al cliente",
      ],
      setupUrl: "https://dashboard.stripe.com/apikeys",
      isManaged: false,
    },
  ]);

  useEffect(() => {
    // Verifica stato reale via edge function (controlla env vars)
    (async () => {
      try {
        const { data } = await supabase.functions.invoke("check-api-status", { body: {} });
        if (data?.statuses) {
          setApis(prev => prev.map(api => ({
            ...api,
            status: data.statuses[api.key] ? "connected" : "missing",
          })));
        } else {
          // Fallback: marca i managed come connected, gli altri missing
          setApis(prev => prev.map(api => ({
            ...api,
            status: api.isManaged ? "connected" : "missing",
          })));
        }
      } catch {
        setApis(prev => prev.map(api => ({
          ...api,
          status: api.isManaged ? "connected" : "missing",
        })));
      }
    })();
  }, []);

  const filtered = apis.filter(api => {
    if (filter === "connected" && api.status !== "connected") return false;
    if (filter === "missing" && api.status !== "missing") return false;
    if (search && !api.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const connectedCount = apis.filter(a => a.status === "connected").length;

  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Zap className="h-7 w-7 text-primary" />
          Connessioni API
        </h1>
        <p className="text-muted-foreground">
          Tutte le fonti dati che alimentano la tua ricerca lead. Le API "gestite Empire" funzionano già senza setup —
          paghi solo in crediti per ogni utilizzo. Quelle "personali" puoi configurarle se vuoi un piano dedicato.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Attive</p>
                <p className="text-3xl font-bold text-emerald-500">{connectedCount}/{apis.length}</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-emerald-500/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Modalità Crediti</p>
              <p className="text-lg font-semibold">Markup invisibile</p>
              <p className="text-xs text-muted-foreground mt-1">Empire gestisce le API → tu paghi in crediti</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/30">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Supporto setup</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => window.open("mailto:info@empireaigroup.com")}>
                Contatta team Empire
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">Cerca</Label>
          <Input id="search" placeholder="Cerca API…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>Tutte</Button>
          <Button variant={filter === "connected" ? "default" : "outline"} size="sm" onClick={() => setFilter("connected")}>
            <CheckCircle2 className="h-4 w-4 mr-1" /> Attive
          </Button>
          <Button variant={filter === "missing" ? "default" : "outline"} size="sm" onClick={() => setFilter("missing")}>
            <AlertTriangle className="h-4 w-4 mr-1" /> Da configurare
          </Button>
        </div>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {filtered.map(api => {
          const Icon = api.icon;
          return (
            <AccordionItem key={api.key} value={api.key} className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 flex-1 text-left">
                  <div className={`p-2 rounded-lg ${api.status === "connected" ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
                    <Icon className={`h-5 w-5 ${api.status === "connected" ? "text-emerald-500" : "text-amber-500"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{api.name}</h3>
                      {api.status === "connected" ? (
                        <Badge variant="default" className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Attiva
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400">
                          Da configurare
                        </Badge>
                      )}
                      {api.isManaged && <Badge variant="secondary" className="text-xs">Gestita Empire</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{api.description}</p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs hidden sm:inline-flex">{api.costPerCall}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <p className="text-sm text-muted-foreground">{api.description}</p>

                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Necessaria per</p>
                  <div className="flex flex-wrap gap-1">
                    {api.requiredFor.map(f => <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>)}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Guida passo-passo</p>
                  <ol className="space-y-2 list-decimal list-inside text-sm">
                    {api.setupSteps.map((step, i) => (
                      <li key={i} className="text-muted-foreground"><span className="text-foreground">{step}</span></li>
                    ))}
                  </ol>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {api.setupUrl && (
                    <Button variant="outline" size="sm" onClick={() => window.open(api.setupUrl, "_blank")}>
                      <ExternalLink className="h-4 w-4 mr-1" /> Apri portale {api.name.split(" ")[0]}
                    </Button>
                  )}
                  {!api.isManaged && api.status !== "connected" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        toast.info(
                          `Per attivare ${api.name}: contatta info@empireaigroup.com con la tua chiave API. Il team la configurerà entro 1 giorno lavorativo in modo sicuro (mai esposta al frontend).`,
                          { duration: 8000 }
                        );
                        window.open(`mailto:info@empireaigroup.com?subject=Attivazione ${api.name}&body=Ciao Empire,%0A%0AVorrei attivare ${api.name} sul mio account.%0AHo già ottenuto la chiave seguendo la guida.%0A%0AGrazie!`, "_blank");
                      }}
                    >
                      <KeyRound className="h-4 w-4 mr-1" /> Attiva ora
                    </Button>
                  )}
                  {api.isManaged && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => toast.info("Empire gestisce questa API per te. Usa Arianna Autopilot direttamente nei Lead.")}
                    >
                      <Zap className="h-4 w-4 mr-1" /> Usa con crediti
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Nessuna API corrisponde ai filtri.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
