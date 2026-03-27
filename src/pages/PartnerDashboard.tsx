import { useState, useEffect, useRef } from "react";
import empireMonkeyMascot from "@/assets/empire-monkey.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, DollarSign, LogOut,
  Crown, Trophy,
  Sparkles, Target,
  Eye, EyeOff, Users,
  Copy, CheckCircle, UserPlus, ChevronRight,
  ExternalLink, ChefHat, Smartphone, ArrowLeft,
  Mail, MapPin, Instagram, Send, RefreshCw,
  Pencil, Upload, Save, X as XIcon,
  Globe, MessageCircle, Link2, Wand2, Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageGuide from "@/components/ui/page-guide";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { INDUSTRY_CONFIGS } from "@/config/industry-config";
import PartnerVoiceAgent from "@/components/partner/PartnerVoiceAgent";
import BonusProgressRing from "@/components/partner/BonusProgressRing";
import ROICalculator from "@/components/partner/ROICalculator";
import DemoCreditsWallet from "@/components/partner/DemoCreditsWallet";
import ProjectDetailOverlay from "@/components/partner/ProjectDetailOverlay";
import { toast } from "@/hooks/use-toast";
import { usePartnerDemoRestaurant } from "@/hooks/usePartnerDemoRestaurant";
import { PORTFOLIO_PROJECTS } from "@/data/portfolio-showcase-data";
import { SECTOR_PORTFOLIO } from "@/data/sector-mockup-images";
import { DEMO_SLUGS } from "@/data/demo-industries";

/* Helper: resolve demo URLs — all use /demo/:slug pattern for consistency */
const getDemoSiteUrl = (sectorId: string) => {
  if (sectorId === "food") return "/r/impero-roma";
  if (sectorId === "ncc") return "/b/amalfi-luxury-transfer";
  const slug = DEMO_SLUGS[sectorId as keyof typeof DEMO_SLUGS] || sectorId;
  return `/demo/${slug}`;
};
const getDemoAdminUrl = (sectorId: string) => {
  if (sectorId === "food") return "/dashboard";
  if (sectorId === "ncc") return "/app";
  const slug = DEMO_SLUGS[sectorId as keyof typeof DEMO_SLUGS] || sectorId;
  return `/demo/${slug}/admin`;
};

/* ═══════════════════════════════════════════
   ACQUISITION CHANNELS
   ═══════════════════════════════════════════ */
const ACQUISITION_CHANNELS = [
  { id: "instagram", icon: Instagram, label: "DM Instagram", desc: "Messaggi brevi e diretti per i social", color: "#E4405F" },
  { id: "whatsapp", icon: MessageCircle, label: "WhatsApp", desc: "Messaggio diretto al titolare", color: "#25D366" },
  { id: "email", icon: Mail, label: "Email", desc: "Template professionali pronti da inviare", color: "#3B82F6" },
  { id: "field", icon: MapPin, label: "Porta a Porta", desc: "Pitch dal vivo con script e obiezioni", color: "#F59E0B" },
  { id: "site", icon: Link2, label: "Link Sito", desc: "Condividi il link della demo direttamente", color: "#10B981" },
] as const;

/* ═══════════════════════════════════════════
   SECTOR-SPECIFIC SALES TEMPLATES (conversion-optimized)
   ═══════════════════════════════════════════ */
const SECTOR_TEMPLATES: Record<string, { dm: string; whatsapp: string; email: string; pitch: string; objections: string[] }> = {
  food: {
    dm: `Ciao [NOME]! 🍽️ Ho visto le foto del vostro locale — complimenti!\n\nVolevo chiedervi: quanto tempo perdete ogni giorno tra chiamate per prenotazioni, menu da aggiornare e ordini scritti a mano?\n\nHo qualcosa che vi farà risparmiare 3 ore al giorno e aumentare gli ordini del 35%. Vi mando un link per vedere come funziona? 👇`,
    whatsapp: `Buongiorno! 👋 Sono [TUO NOME] di Empire.\n\nHo notato [NOME] e vorrei farvi vedere qualcosa di speciale: un'app personalizzata con il vostro brand dove i clienti ordinano dal tavolo con QR code, prenotano 24/7 e voi gestite tutto da UN unico pannello.\n\n🔥 I ristoranti che la usano vedono +35% ordini e -70% chiamate.\n\nPosso mandarvi un link per provarla in 2 minuti? È completamente gratuito.`,
    email: `Oggetto: [NOME] — Più ordini, zero stress (proposta riservata)\n\nBuongiorno,\n\nMi chiamo [TUO NOME] e mi occupo di digitalizzazione per ristoranti.\n\nHo analizzato il vostro locale e credo che stiate perdendo almeno il 30% degli ordini possibili. Ecco perché:\n\n❌ I clienti chiamano e trovano occupato → prenotazione persa\n❌ Il menu cartaceo non mostra foto → scontrino medio basso\n❌ Nessun sistema per riportare i clienti che non tornano\n\nLa nostra piattaforma risolve tutto questo:\n\n✅ Menu digitale con QR — ordini diretti dal tavolo (+22% scontrino medio)\n✅ Prenotazioni online 24/7 — mai più chiamate perse\n✅ Sistema "Clienti Persi" — recupera il 30% dei clienti inattivi automaticamente\n✅ Kitchen Display — zero ordini persi, cucina sincronizzata\n✅ Review Shield — solo le recensioni migliori diventano pubbliche\n\n🎯 Tutto brandizzato con il VOSTRO logo e colori. I clienti vedono solo [NOME], mai il nostro nome.\n\n💰 Investimento: da €79/mese — si ripaga con 2 ordini in più al giorno.\n\nPosso mostrarvi una demo dal vivo in 10 minuti? Nessun impegno.`,
    pitch: `APERTURA: "Buongiorno! Mi chiamo [TUO NOME]. Non vendo pubblicità né volantini. Ho una domanda veloce: quante prenotazioni perdete al mese per telefonate senza risposta?"\n\nPROBLEMA: "Il 70% dei ristoranti perde 15-20 prenotazioni al mese. Ogni prenotazione persa = €50-80 di fatturato. Sono €1.000/mese che volano via."\n\nSOLUZIONE: "Noi diamo a [NOME] un'app personalizzata dove i clienti ordinano dal tavolo, prenotano 24/7, e voi gestite tutto da un pannello. Tutto con il vostro brand."\n\nPROVA: [Mostra demo dal telefono]\n\nCHIUSURA: "L'investimento è €79/mese — meno di 2 coperti. Si ripaga dal primo giorno. Possiamo attivarlo questa settimana."`,
    objections: [
      "\"Costa troppo\" → \"€79/mese sono meno di 2 coperti. In media i ristoranti recuperano €1.200/mese di prenotazioni perse. ROI dal primo giorno.\"",
      "\"Ho già JustEat/Glovo\" → \"Perfetto, ma loro prendono il 30% di commissione. Con noi solo il 2%. Su €3.000/mese di ordini risparmi €840.\"",
      "\"Non ho tempo\" → \"Proprio per questo serve: automatizza prenotazioni, ordini e marketing. Vi libera 3 ore al giorno.\"",
      "\"Devo pensarci\" → \"Capisco! Vi lascio il link alla demo — provatela con calma. Nessun impegno, nessun dato richiesto. La richiamo tra 2 giorni?\""
    ],
  },
  beauty: {
    dm: `Ciao [NOME]! 💅 Il vostro salone è fantastico!\n\nDomanda veloce: quanti appuntamenti perdete a settimana per no-show o chiamate senza risposta?\n\nHo qualcosa che elimina il problema e vi porta +40% clienti ricorrenti. Vi mando un link? ✨`,
    whatsapp: `Buongiorno! Sono [TUO NOME] di Empire.\n\nHo visto [NOME] e volevo proporvi una cosa: un'app personalizzata con il vostro brand dove i clienti prenotano 24/7, scelgono l'operatore, e accumulano punti fedeltà.\n\n✂️ I saloni che la usano riducono i no-show del 60%.\n\nVi mando il link per provarla?`,
    email: `Oggetto: [NOME] — Zero no-show, +40% clienti ricorrenti\n\nBuongiorno,\n\nOgni no-show vi costa €50-100. Con 5 no-show a settimana, sono €1.500/mese persi.\n\nLa nostra app per [NOME] risolve tutto:\n\n✅ Prenotazione online 24/7 con scelta operatore e servizio\n✅ Promemoria automatici WhatsApp/Push (addio no-show!)\n✅ Programma fedeltà integrato (+40% clienti ricorrenti)\n✅ Gestione agenda smart per tutto lo staff\n\n💰 Da €79/mese — si ripaga eliminando 2 no-show a settimana.\n\nDemo gratuita in 10 minuti?`,
    pitch: `APERTURA: "Buongiorno! Domanda veloce: quanti appuntamenti saltano ogni settimana senza preavviso?"\n\nPROBLEMA: "In media un salone perde 5-8 no-show a settimana. A €60 di media, sono €1.500/mese."\n\nSOLUZIONE: "Con la nostra app i clienti prenotano online, ricevono promemoria automatici, e accumulano punti. I no-show calano del 60%."\n\nCHIUSURA: "€79/mese. Si ripaga eliminando 2 no-show a settimana. Attivabile in 24 ore."`,
    objections: [
      "\"Uso già Instagram per le prenotazioni\" → \"Instagram non manda promemoria, non gestisce l'agenda, e non fidelizza. Con noi i no-show calano del 60%.\"",
      "\"I clienti preferiscono chiamare\" → \"Il 73% dei clienti under 45 preferisce prenotare online. Chi chiama e trova occupato, va altrove.\"",
    ],
  },
  ncc: {
    dm: `Ciao [NOME]! 🚗 Ho visto il vostro servizio NCC.\n\nQuanto tempo perdete ogni giorno tra preventivi via email, coordinamento autisti e pagamenti da rincorrere?\n\nAbbiamo un sistema che automatizza tutto — prenotazione, pricing, fleet management. Vi mostro? 🏎️`,
    whatsapp: `Buongiorno! Sono [TUO NOME].\n\nHo una proposta per [NOME]: un'app dove i clienti prenotano transfer in 30 secondi, vedono la flotta, e pagano online.\n\nVoi gestite autisti, tariffe e prenotazioni da un unico pannello.\n\n📈 +50% prenotazioni, zero tempo perso in preventivi.\n\nVi mando il link della demo?`,
    email: `Oggetto: [NOME] — Prenotazioni automatiche, flotta sotto controllo\n\nGentili,\n\nOgni preventivo via email vi porta via 10-15 minuti. Con 10 richieste al giorno, sono 2+ ore perse.\n\nLa nostra piattaforma per [NOME]:\n\n✅ Prenotazione transfer con calcolo automatico prezzo\n✅ Gestione flotta e autisti in tempo reale\n✅ Pagamenti online sicuri e fatturazione automatica\n✅ App cliente premium con tracking veicolo\n\n💰 Da €99/mese — si ripaga con 1 transfer in più a settimana.\n\nDemo in 10 minuti?`,
    pitch: `APERTURA: "Quante ore al giorno passate a fare preventivi via email o WhatsApp?"\n\nPROBLEMA: "10 minuti per preventivo × 10 richieste = quasi 2 ore al giorno. Più il coordinamento autisti e i pagamenti da rincorrere."\n\nSOLUZIONE: "La nostra app calcola i prezzi automaticamente, il cliente prenota e paga in 30 secondi, e voi vedete tutto su un pannello."\n\nCHIUSURA: "€99/mese. Un transfer in più a settimana e siete in positivo."`,
    objections: [
      "\"Lavoro solo con il telefono\" → \"Perfetto, ma quante chiamate perdete mentre guidate? L'app lavora per voi 24/7, anche di notte.\"",
    ],
  },
  fitness: {
    dm: `Ciao [NOME]! 💪 La vostra palestra è top!\n\nQuanti iscritti non rinnovano l'abbonamento ogni mese? Con un'app personalizzata potete aumentare la retention del 45% e ottenere +30% nuovi iscritti da referral.\n\nVi mostro come? 🏋️`,
    whatsapp: `Buongiorno! Sono [TUO NOME].\n\n[NOME] ha un potenziale enorme. Con la nostra app i membri prenotano corsi, tracciano progressi e partecipano a sfide gamificate.\n\n💪 +45% retention, +30% nuovi iscritti.\n\nLink demo?`,
    email: `Oggetto: [NOME] — +45% retention, meno abbandoni\n\nBuongiorno,\n\nLa sfida più grande: mantenere i membri attivi. Il 50% abbandona nei primi 3 mesi.\n\nLa nostra app per [NOME]:\n\n✅ Prenotazione corsi e personal trainer\n✅ Tracking progressi con sfide gamificate\n✅ Rinnovo abbonamento automatico\n✅ Community e social features\n\n💰 Da €79/mese — si ripaga mantenendo 2 iscritti in più.\n\nDemo in 10 minuti?`,
    pitch: `APERTURA: "Quale percentuale dei vostri iscritti rinnova l'abbonamento?"\n\nPROBLEMA: "La media è 40-50%. Ogni iscritto perso = €500-1.000/anno."\n\nSOLUZIONE: "La nostra app crea engagement: corsi prenotabili, progressi tracciati, sfide tra membri. La retention sale al 70-80%."\n\nCHIUSURA: "€79/mese. Basta mantenere 2 iscritti in più per essere in positivo."`,
    objections: [
      "\"Abbiamo già un gestionale\" → \"Non è un gestionale, è un'app per i VOSTRI clienti. Il gestionale gestisce voi, l'app fidelizza loro.\"",
    ],
  },
  healthcare: {
    dm: `Ciao! 🏥 Gestite uno studio medico?\n\nQuante ore al giorno passa la segretaria al telefono per prenotazioni? Con la nostra app i pazienti prenotano online, ricevono referti e comunicano in modo sicuro.\n\n-70% chiamate, +30% soddisfazione pazienti. Vi interessa? 👨‍⚕️`,
    whatsapp: `Buongiorno! Sono [TUO NOME].\n\nProposta per [NOME]: un'app GDPR compliant dove i pazienti prenotano visite, ricevono referti e comunicano con voi in modo sicuro.\n\n🏥 -70% chiamate, -50% no-show.\n\nPosso mostrarvi la demo?`,
    email: `Oggetto: [NOME] — Meno code, più efficienza (GDPR compliant)\n\nGentile Dottore/Dottoressa,\n\nLa segretaria passa 4+ ore al giorno al telefono. Ogni chiamata = 3-5 minuti. Il 30% dei pazienti non riesce a prenotare.\n\nLa nostra piattaforma:\n\n✅ Prenotazione visite online 24/7\n✅ Cartella paziente digitale (GDPR compliant)\n✅ Telemedicina integrata\n✅ Promemoria automatici\n\n💰 Da €99/mese — si ripaga liberando ore della segretaria.\n\nDemo in 10 minuti?`,
    pitch: `APERTURA: "Quanto tempo passa la segretaria al telefono ogni giorno?"\n\nPROBLEMA: "In media 4 ore. Il 30% dei pazienti non riesce a prenotare perché trova occupato."\n\nSOLUZIONE: "I pazienti prenotano dall'app, ricevono promemoria, e i referti arrivano digitali. La segretaria è libera per attività a valore."\n\nCHIUSURA: "€99/mese. GDPR compliant. Attivabile in 48 ore."`,
    objections: [
      "\"I miei pazienti sono anziani\" → \"L'app è semplicissima, grandi pulsanti. E chi chiama continua a chiamare — l'app serve per il 60% che preferisce prenotare online.\"",
    ],
  },
  hotel: {
    dm: `Ciao [NOME]! 🏨 Il vostro hotel è splendido!\n\nSapevate che il 40% del revenue extra (spa, ristorante, escursioni) si perde perché gli ospiti non sanno cosa offrite?\n\nCon un'app personalizzata recuperate tutto. Vi mostro? ⭐`,
    whatsapp: `Buongiorno! Sono [TUO NOME].\n\nProposta per [NOME]: un'app dove gli ospiti fanno check-in digitale, ordinano room service e prenotano esperienze.\n\n🏨 +25% revenue da servizi ancillari.\n\nVi mando la demo?`,
    email: `Oggetto: [NOME] — +25% revenue da servizi ancillari\n\nGentili,\n\nIl 40% del revenue da servizi extra si perde perché gli ospiti non sanno cosa offrite.\n\nLa nostra app:\n\n✅ Check-in/check-out digitale\n✅ Room service e concierge in-app\n✅ Prenotazione spa, ristorante, escursioni\n✅ Comunicazione diretta con lo staff\n\n💰 Da €149/mese — si ripaga con 3-4 room service in più.\n\nDemo personalizzata in 15 minuti?`,
    pitch: `APERTURA: "Quale percentuale dei vostri ospiti usa il room service o prenota la spa?"\n\nPROBLEMA: "In media il 20-30%. Il resto non sa cosa offrite o non vuole chiamare la reception."\n\nSOLUZIONE: "Con l'app vedono tutto: room service, spa, escursioni. Prenotano con un tocco. Revenue ancillari +25%."\n\nCHIUSURA: "€149/mese. Con 3-4 room service in più siete già in positivo."`,
    objections: [
      "\"Abbiamo già un booking engine\" → \"Non è un booking engine, è un concierge digitale per CHI È GIÀ IN HOTEL. Complementa il vostro sistema.\"",
    ],
  },
};

const DEFAULT_TEMPLATES = {
  dm: `Ciao [NOME]! 🤩 Ho notato la vostra attività — complimenti!\n\nDomanda veloce: quanto tempo perdete ogni giorno in prenotazioni telefoniche e gestione manuale?\n\nAbbiamo un'app personalizzata con il VOSTRO brand che automatizza tutto. Vi mostro in 2 minuti? 👉`,
  whatsapp: `Buongiorno! Sono [TUO NOME] di Empire.\n\n[NOME] potrebbe beneficiare enormemente della nostra piattaforma: un'app brandizzata dove i clienti prenotano 24/7, pagano online, e voi gestite tutto da un pannello.\n\n📈 +40% prenotazioni, -50% tempo amministrativo.\n\nVi mando il link della demo?`,
  email: `Oggetto: [NOME] — Più clienti, meno stress (proposta riservata)\n\nBuongiorno,\n\nMi chiamo [TUO NOME] e aiuto attività come la vostra a crescere con la tecnologia.\n\nI vostri potenziali clienti:\n\n❌ Chiamano e trovano occupato → prenotazione persa\n❌ Non vi trovano facilmente online → vanno dalla concorrenza\n❌ Non tornano → nessun sistema di fidelizzazione\n\nLa nostra piattaforma risolve tutto:\n\n✅ App personalizzata con il VOSTRO brand\n✅ Prenotazioni online 24/7\n✅ Gestione clienti e CRM integrato\n✅ Marketing automatizzato\n\n💰 Da €79/mese — si ripaga con 2 clienti in più al mese.\n\nDemo gratuita in 10 minuti?`,
  pitch: `APERTURA: "Buongiorno! Non vendo pubblicità. Una domanda: quanti clienti perdete ogni mese perché non riescono a contattarvi?"\n\nPROBLEMA: "Il 40% dei potenziali clienti non riesce a prenotare al primo tentativo. Ognuno vale €50-100."\n\nSOLUZIONE: "Noi creiamo un'app con il VOSTRO brand dove i clienti prenotano 24/7, pagano online, e voi gestite tutto da un pannello."\n\nCHIUSURA: "€79/mese. Si ripaga con 2 clienti in più. Possiamo attivarlo questa settimana."`,
  objections: [
    "\"Costa troppo\" → \"€79/mese sono meno di una cena. In media le attività recuperano €800-1.200/mese di prenotazioni perse.\"",
    "\"Non ho tempo per imparare\" → \"Il setup lo facciamo noi in 24 ore. L'app è intuitiva come WhatsApp.\"",
    "\"Devo pensarci\" → \"Capisco! Vi lascio il link alla demo gratuita — provatela con calma, zero impegno. La richiamo tra 2 giorni?\"",
  ],
};

/* ═══════════════════════════════════════════
   SECTOR CARDS — ALL industries + custom
   ═══════════════════════════════════════════ */
const ALL_INDUSTRY_IDS = Object.keys(INDUSTRY_CONFIGS) as (keyof typeof INDUSTRY_CONFIGS)[];

const SECTOR_CARDS = ALL_INDUSTRY_IDS.map(key => {
  const config = INDUSTRY_CONFIGS[key];
  const project = PORTFOLIO_PROJECTS[key as keyof typeof PORTFOLIO_PROJECTS];
  const portfolio = SECTOR_PORTFOLIO.find(sp => sp.sectorId === key);
  const firstBrand = portfolio?.brands?.[0];
  const firstStyle = firstBrand?.styles?.[0];
  const screens = firstStyle?.screens?.slice(0, 3) || [];
  return {
    id: key,
    name: project?.name || config.label,
    description: project?.description || config.description,
    tags: project?.tags || [config.label],
    screens,
    accent: project?.accent || "#a78bfa",
    emoji: config.emoji,
  };
});

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
const PartnerDashboard = () => {
  const navigate = useNavigate();
  const { signOut, isTeamLeader, user } = useAuth();
  const [showROI, setShowROI] = useState(false);
  const [demoMode, setDemoMode] = useState(() => sessionStorage.getItem("partner_demo_mode") === "true");
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [teamSales, setTeamSales] = useState<any[]>([]);
  const [salesCount, setSalesCount] = useState(0);
  const [monthlyBonuses, setMonthlyBonuses] = useState<any[]>([]);
  const [inviteCopied, setInviteCopied] = useState(false);
  const { demoRestaurant, loading: demoLoading, refetch: refetchDemo } = usePartnerDemoRestaurant();
  const [resettingDemo, setResettingDemo] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [editingDemo, setEditingDemo] = useState(false);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("#C8963E");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [savingDemo, setSavingDemo] = useState(false);
  const logoFileRef = useRef<HTMLInputElement>(null);

  const [activeChannel, setActiveChannel] = useState<string>("instagram");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showEarnings, setShowEarnings] = useState(false);
  const [showFullPortfolio, setShowFullPortfolio] = useState(false);
  const [detailProject, setDetailProject] = useState<string | null>(null);

  // Smart messaging state
  const [targetIg, setTargetIg] = useState("");
  const [targetWebsite, setTargetWebsite] = useState("");
  const [messageVariant, setMessageVariant] = useState(0);
  const [agencyEmail, setAgencyEmail] = useState("info@empireaigroup.com");
  const [agencyPhone, setAgencyPhone] = useState("");
  const [useNames, setUseNames] = useState(false);
  const [scanningProspect, setScanningProspect] = useState(false);
  const [aiGeneratedMessage, setAiGeneratedMessage] = useState<string | null>(null);

  // Persist demoMode
  useEffect(() => { sessionStorage.setItem("partner_demo_mode", demoMode ? "true" : "false"); }, [demoMode]);

  // Sync edit fields
  useEffect(() => {
    if (demoRestaurant) {
      setEditName(demoRestaurant.name);
      setEditColor(demoRestaurant.primary_color || "#C8963E");
    }
  }, [demoRestaurant]);

  // Get dynamic template based on selected project + channel + variant
  const sectorLabel = selectedProject
    ? (INDUSTRY_CONFIGS[selectedProject as keyof typeof INDUSTRY_CONFIGS]?.label || selectedProject)
    : "attività";
  const demoLink = selectedProject
    ? `${window.location.origin}${getDemoSiteUrl(selectedProject)}`
    : "{{DEMO_LINK}}";
  const igMention = targetIg ? `@${targetIg.replace("@", "")}` : "";
  const siteMention = targetWebsite || "";
  const hasAnalysis = !!(targetIg || targetWebsite);
  const contactInfo = agencyPhone ? `📞 ${agencyPhone}` : `📩 ${agencyEmail}`;

  // AI scan function
  const handleScanProspect = async () => {
    if (!targetIg && !targetWebsite) {
      toast({ title: "Inserisci un profilo", description: "Inserisci l'Instagram o il sito web del prospect.", variant: "destructive" });
      return;
    }
    setScanningProspect(true);
    setAiGeneratedMessage(null);
    try {
      const { data, error } = await supabase.functions.invoke("scan-prospect", {
        body: { instagram: targetIg, website: targetWebsite, sector: sectorLabel },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      let msg = data.message || "";
      // Replace placeholders
      msg = msg.replace(/\{\{DEMO_LINK\}\}/g, demoLink);
      msg = msg.replace(/\{\{CONTACT_INFO\}\}/g, contactInfo);
      setAiGeneratedMessage(msg);
      toast({ title: "🤖 Messaggio AI generato!", description: "Messaggio ultra-personalizzato pronto." });
    } catch (err: any) {
      console.error("Scan error:", err);
      toast({ title: "Errore scansione", description: err.message || "Riprova.", variant: "destructive" });
    } finally {
      setScanningProspect(false);
    }
  };

  // Smart prefix that injects IG/website context into any template
  const analysisPrefix = (() => {
    if (!hasAnalysis) return "";
    const parts: string[] = [];
    if (igMention) parts.push(`Ho analizzato il vostro profilo ${igMention}`);
    if (siteMention) parts.push(`ho visitato il vostro sito (${siteMention})`);
    return parts.join(" e ") + " — ";
  })();

  const currentTemplates = selectedProject
    ? (SECTOR_TEMPLATES[selectedProject] || DEFAULT_TEMPLATES)
    : DEFAULT_TEMPLATES;

  const DM_VARIANTS = [
    ...(aiGeneratedMessage ? [aiGeneratedMessage] : []),
    hasAnalysis
      ? `Ciao [NOME]! 👋 ${analysisPrefix}Complimenti per quello che fate nel ${sectorLabel}!\n\n${currentTemplates.dm.split('\n\n').slice(1).join('\n\n')}\n\n🎯 Ecco una demo del vostro settore: ${demoLink}\n${contactInfo}`
      : currentTemplates.dm,
    `Ciao [NOME]! 👋 ${igMention ? `Ho appena visto il profilo ${igMention} — ` : ""}Lavorate nel settore ${sectorLabel}${siteMention ? ` e ho dato un'occhiata al vostro sito (${siteMention})` : ""}.\n\nHo una domanda: state usando qualche strumento digitale per gestire prenotazioni e clienti?\n\nAbbiamo creato qualcosa di specifico per ${sectorLabel} che vi farebbe risparmiare ore ogni giorno. Ecco una demo gratuita: ${demoLink}\n\n${contactInfo}`,
    `Hey [NOME]! 🔥 ${igMention ? `Seguo ${igMention} da un po' — ` : ""}Complimenti per quello che fate!\n\nVi faccio una proposta diretta: ho un'app personalizzata per ${sectorLabel} che automatizza prenotazioni, pagamenti e fidelizzazione clienti.\n\n🎯 Guardate questa demo creata per il vostro settore: ${demoLink}\n\nSe vi interessa, scrivetemi — ${contactInfo}. Vi mostro tutto in 5 minuti!`,
  ];
  const WA_VARIANTS = [
    ...(aiGeneratedMessage ? [aiGeneratedMessage] : []),
    hasAnalysis
      ? `Buongiorno! 👋 Sono [TUO NOME] di Empire.\n\n${analysisPrefix}${(currentTemplates as any).whatsapp?.split('\n\n').slice(1).join('\n\n') || DEFAULT_TEMPLATES.whatsapp.split('\n\n').slice(1).join('\n\n')}\n\n👉 Demo: ${demoLink}\n${contactInfo}`
      : ((currentTemplates as any).whatsapp || DEFAULT_TEMPLATES.whatsapp),
    `Buongiorno! 👋 Sono [TUO NOME] di Empire.\n\n${siteMention ? `Ho visitato il vostro sito (${siteMention}) e ` : ""}Ho una proposta specifica per [NOME] nel settore ${sectorLabel}.\n\n🚀 Abbiamo un'app personalizzata con il VOSTRO brand che include:\n• Prenotazioni 24/7 automatiche\n• Gestione clienti e CRM\n• Marketing automatizzato\n\n👉 Provate la demo: ${demoLink}\n\n${contactInfo}\n\nPosso mostrarvi tutto in 2 minuti?`,
    `Ciao! Sono [TUO NOME]. Vi contatto perché lavoriamo con diverse realtà nel ${sectorLabel}.\n\n${igMention ? `Ho visto ${igMention} e credo che ` : ""}[NOME] potrebbe beneficiare enormemente della nostra piattaforma.\n\n✅ Demo gratuita: ${demoLink}\n✅ ${contactInfo}\n\nNessun impegno — date un'occhiata e ditemi cosa ne pensate!`,
  ];
  const EMAIL_VARIANTS = [
    ...(aiGeneratedMessage ? [aiGeneratedMessage] : []),
    hasAnalysis
      ? currentTemplates.email.replace(
          /Buongiorno,\n\n/,
          `Buongiorno,\n\n${analysisPrefix.charAt(0).toUpperCase() + analysisPrefix.slice(1)}e volevo presentarvi una proposta.\n\n`
        )
      : currentTemplates.email,
    `Oggetto: [NOME] — Proposta digitalizzazione ${sectorLabel} (demo inclusa)\n\nBuongiorno,\n\nMi chiamo [TUO NOME] e mi occupo di digitalizzazione per il settore ${sectorLabel}.\n\n${siteMention ? `Ho analizzato il vostro sito (${siteMention}) e ` : ""}Credo che [NOME] stia perdendo opportunità per mancanza di strumenti digitali adeguati.\n\nAbbiamo creato una piattaforma specifica per ${sectorLabel} che include:\n\n✅ App personalizzata con il VOSTRO brand\n✅ Prenotazioni online 24/7\n✅ CRM e gestione clienti automatizzata\n✅ Marketing e fidelizzazione integrati\n\n🎯 Guardate la demo del vostro settore: ${demoLink}\n\n💰 Investimento: da €79/mese — si ripaga in pochi giorni.\n\n${contactInfo}\n\nRestiamo a disposizione per una presentazione di 10 minuti.\n\nCordiali saluti,\n[TUO NOME]\nEmpire AI Group`,
    `Oggetto: Esclusiva per [NOME] — ${sectorLabel} digitale\n\nGentili,\n\n${siteMention ? `Ho visitato ${siteMention} e ` : ""}Volevo presentarvi una soluzione su misura per ${sectorLabel}.\n\nI numeri parlano chiaro:\n📈 +35% prenotazioni\n⏰ -70% tempo gestione\n💰 ROI dal primo mese\n\n🔗 Demo interattiva: ${demoLink}\n${contactInfo}\n\nNessun impegno — la demo è gratuita.\n\n[TUO NOME] — Empire AI Group`,
  ];
  const PITCH_VARIANTS = [
    ...(aiGeneratedMessage ? [aiGeneratedMessage] : []),
    hasAnalysis
      ? currentTemplates.pitch.replace(
          /APERTURA: "/,
          `APERTURA: "${analysisPrefix}`
        )
      : currentTemplates.pitch,
    `APERTURA: "Buongiorno! ${siteMention ? `Ho visto il vostro sito — ` : ""}Una domanda: quanto fatturato perdete ogni mese per inefficienze nella gestione?"\n\nPROBLEMA: "Nel settore ${sectorLabel}, le attività perdono il 30-40% dei potenziali clienti per mancanza di strumenti digitali."\n\nSOLUZIONE: "Noi creiamo un'app con il VOSTRO brand specifica per ${sectorLabel}. I clienti prenotano, pagano e tornano — tutto automatizzato."\n\nDEMO: "Guardate: ${demoLink} — è una demo reale del vostro settore."\n\nCHIUSURA: "${contactInfo}. Possiamo attivare tutto in 48 ore."`,
  ];

  const getVariants = () => {
    if (activeChannel === "email") return EMAIL_VARIANTS;
    if (activeChannel === "field") return PITCH_VARIANTS;
    if (activeChannel === "whatsapp") return WA_VARIANTS;
    if (activeChannel === "site") return [];
    return DM_VARIANTS;
  };
  const variants = getVariants();
  const currentTemplate = variants[messageVariant % Math.max(variants.length, 1)] || "";

  const currentObjections = activeChannel === "field"
    ? ((currentTemplates as any).objections || DEFAULT_TEMPLATES.objections || [])
    : [];

  const templateLabel = activeChannel === "email" ? "TEMPLATE EMAIL"
    : activeChannel === "field" ? "PITCH SCRIPT"
    : activeChannel === "whatsapp" ? "TEMPLATE WHATSAPP"
    : activeChannel === "site" ? "LINK SITO"
    : "TEMPLATE DM";

  const handleRegenerate = () => {
    setMessageVariant(prev => prev + 1);
    toast({ title: "🔄 Nuovo messaggio generato!", description: "Variante diversa pronta." });
  };

  const handleResetDemo = async () => {
    if (resettingDemo) return;
    setShowResetConfirm(false);
    setResettingDemo(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reset-partner-demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Reset failed");
      toast({ title: "✅ Demo Resettata", description: "Tutti i dati demo sono stati ricreati." });
      refetchDemo();
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    } finally { setResettingDemo(false); }
  };

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !demoRestaurant) return;
    setUploadingLogo(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${demoRestaurant.id}/logo.${ext}`;
      const { error: upErr } = await supabase.storage.from("restaurant-logos").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("restaurant-logos").getPublicUrl(path);
      const logoUrl = urlData.publicUrl + "?t=" + Date.now();
      await supabase.from("restaurants").update({ logo_url: logoUrl }).eq("id", demoRestaurant.id);
      toast({ title: "Logo caricato!" });
      refetchDemo();
    } catch (err: any) {
      toast({ title: "Errore upload", description: err.message, variant: "destructive" });
    } finally { setUploadingLogo(false); }
  };

  const handleSaveDemoCustomization = async () => {
    if (!demoRestaurant || savingDemo) return;
    setSavingDemo(true);
    try {
      const { error } = await supabase.from("restaurants").update({
        name: editName.trim() || demoRestaurant.name,
        primary_color: editColor,
      }).eq("id", demoRestaurant.id);
      if (error) throw error;
      toast({ title: "✅ Personalizzazione salvata!" });
      setEditingDemo(false);
      refetchDemo();
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    } finally { setSavingDemo(false); }
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchPartnerData();
    if (!isTeamLeader) return;
    const channel = supabase
      .channel('team-recruits')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'partner_teams', filter: `team_leader_id=eq.${user.id}` },
        async (payload) => {
          const newPartnerId = (payload.new as any).partner_id;
          const { data: profile } = await supabase.from('profiles').select('full_name, email').eq('user_id', newPartnerId).maybeSingle();
          const name = profile?.full_name || profile?.email || 'Nuovo partner';
          toast({ title: "🎉 Nuovo Partner nel Team!", description: `${name} si è registrato tramite il tuo link di invito.` });
          fetchPartnerData();
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id, isTeamLeader]);

  const fetchPartnerData = async () => {
    if (!user?.id) return;
    const { data: sales } = await supabase.from("partner_sales").select("id").eq("partner_id", user.id);
    setSalesCount(sales?.length || 0);
    if (isTeamLeader) {
      const { data: team } = await supabase.from("partner_teams").select("*").eq("team_leader_id", user.id);
      if (team && team.length > 0) {
        const memberIds = team.map((t: any) => t.partner_id);
        const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email").in("user_id", memberIds);
        setTeamMembers(team.map((t: any) => ({ ...t, profiles: profiles?.find((p: any) => p.user_id === t.partner_id) || null })));
        const { data: tSales } = await supabase.from("partner_sales").select("*").in("partner_id", memberIds);
        setTeamSales(tSales || []);
      } else { setTeamMembers([]); }
    }
    const { data: bonuses } = await supabase.from("performance_bonuses").select("*").eq("partner_id", user.id).order("bonus_month", { ascending: false }).limit(6);
    setMonthlyBonuses(bonuses || []);
  };

  const handleLogout = async () => { await signOut(); navigate("/auth"); };

  const handleCopyInviteLink = () => {
    const link = `${window.location.origin}/auth?role=partner&ref=${user?.id}`;
    navigator.clipboard.writeText(link);
    setInviteCopied(true);
    toast({ title: "Link copiato!", description: "Chi si registra con questo link sarà nel tuo team." });
    setTimeout(() => setInviteCopied(false), 2000);
  };

  const handleCopyTemplate = () => {
    let text = currentTemplate;
    if (!useNames) {
      text = text.replace(/\[NOME\]/g, "").replace(/\[TUO NOME\]/g, "").replace(/  +/g, " ").trim();
    }
    navigator.clipboard.writeText(text);
    toast({ title: "✅ Copiato!", description: `${templateLabel} copiato negli appunti.` });
  };

  const totalBonuses = monthlyBonuses.reduce((s, b) => s + Number(b.bonus_amount), 0);
  const estimatedCommissions = salesCount * 997;
  const calculateOverrides = () => {
    if (!isTeamLeader || teamMembers.length === 0) return 0;
    let total = 0;
    for (const member of teamMembers) {
      const memberSalesCount = teamSales.filter((s: any) => s.partner_id === member.partner_id).length;
      total += Math.max(0, memberSalesCount - 4) * 50;
    }
    return total;
  };
  const totalOverrides = calculateOverrides();
  const netEarnings = estimatedCommissions + totalBonuses + totalOverrides;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthBonus = monthlyBonuses.find(b => b.bonus_month === currentMonth);
  const currentMonthSales = currentMonthBonus?.sales_count || 0;
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Partner";

  const selectedProjectName = selectedProject
    ? PORTFOLIO_PROJECTS[selectedProject as keyof typeof PORTFOLIO_PROJECTS]?.name || selectedProject
    : null;

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: "#0a0a14" }}>
      
      {/* ═══════ TOP NAV BAR ═══════ */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 h-14 border-b safe-top"
        style={{ background: "rgba(10,10,20,0.97)", borderColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#a78bfa" }}>
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>
          <span className="text-sm font-bold text-white ml-2">Partner Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold uppercase" style={{ background: "rgba(167,139,250,0.2)", color: "#a78bfa" }}>
              {userName.charAt(0)}
            </div>
            <span className="text-xs text-white font-medium max-w-[120px] truncate">{userName}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Esci</span>
          </button>
        </div>
      </div>

      {/* ═══════ SCROLLABLE CONTENT ═══════ */}
      <div className="flex-1 overflow-y-auto">
        
        {/* ═══════ HERO SECTION ═══════ */}
        <section className="relative px-4 sm:px-8 pt-10 pb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(circle, #7c3aed, transparent 65%)", filter: "blur(120px)" }} />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 max-w-5xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <motion.div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden"
                  style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <img src={empireMonkeyMascot} alt="Empire" className="w-12 h-12 object-contain" />
                </motion.div>
                <div>
                  <p className="text-xs" style={{ color: "#9ca3af" }}>Benvenuto,</p>
                  <h1 className="text-xl font-bold text-white">{userName}</h1>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {!demoMode && (
                  <button onClick={() => setShowEarnings(!showEarnings)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: showEarnings ? "rgba(16,185,129,0.15)" : "rgba(167,139,250,0.12)", border: `1px solid ${showEarnings ? "rgba(16,185,129,0.3)" : "rgba(167,139,250,0.25)"}` }}>
                    <DollarSign className="w-4 h-4" style={{ color: showEarnings ? "#10b981" : "#a78bfa" }} />
                    <span className="text-white">Guadagni</span>
                  </button>
                )}
                <button onClick={() => navigate("/home?from=partner")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Globe className="w-4 h-4" style={{ color: "#9ca3af" }} />
                  <span style={{ color: "#d1d5db" }}>Mostra Sito</span>
                </button>
                <button onClick={() => setDemoMode(!demoMode)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: demoMode ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${demoMode ? "rgba(245,158,11,0.35)" : "rgba(255,255,255,0.1)"}`
                  }}>
                  {demoMode ? <EyeOff className="w-4 h-4" style={{ color: "#f59e0b" }} /> : <Eye className="w-4 h-4" style={{ color: "#9ca3af" }} />}
                  <span style={{ color: demoMode ? "#f59e0b" : "#d1d5db" }}>{demoMode ? "Modalità Live" : "Modalità Demo"}</span>
                </button>
              </div>
            </div>

            <div className="text-left sm:text-right max-w-md">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-3"
                style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", color: "#a78bfa" }}>
                <LayoutDashboard className="w-3 h-3" /> Area Partner
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Il tuo catalogo app,<br />
                <span style={{ color: "#a78bfa" }}>pronto da mostrare.</span>
              </h2>
              <p className="text-sm mt-2" style={{ color: "#9ca3af" }}>
                Sfoglia i progetti, seleziona uno stile e mostra le preview direttamente al cliente.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════ DEMO MODE BANNER ═══════ */}
        <AnimatePresence>
          {demoMode && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden" style={{ background: "rgba(245,158,11,0.08)", borderTop: "1px solid rgba(245,158,11,0.2)", borderBottom: "1px solid rgba(245,158,11,0.2)" }}>
              <div className="px-4 py-2.5 flex items-center gap-2 max-w-5xl mx-auto">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#f59e0b" }} />
                <p className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: "#f59e0b" }}>Modalità Presentazione — Dati sensibili nascosti</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════ EARNINGS SECTION ═══════ */}
        {!demoMode && (
          <AnimatePresence>
            {showEarnings && (
              <motion.section initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-4">
                  <div className="p-5 rounded-2xl relative overflow-hidden" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#6ee7b7" }}>Guadagni Netti</p>
                    <p className="text-4xl font-bold text-white">€{netEarnings.toLocaleString()}</p>
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "#34d399" }} /><span className="text-[10px]" style={{ color: "#9ca3af" }}>Commissioni €{estimatedCommissions.toLocaleString()}</span></div>
                      {isTeamLeader && totalOverrides > 0 && <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "#38bdf8" }} /><span className="text-[10px]" style={{ color: "#9ca3af" }}>Override €{totalOverrides.toLocaleString()}</span></div>}
                      {totalBonuses > 0 && <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "#fbbf24" }} /><span className="text-[10px]" style={{ color: "#9ca3af" }}>Bonus €{totalBonuses.toLocaleString()}</span></div>}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Trophy, value: salesCount, label: "Vendite", color: "#a78bfa" },
                      { icon: DollarSign, value: "€997", label: "Per Vendita", color: "#34d399" },
                      { icon: isTeamLeader ? Users : Target, value: isTeamLeader ? teamMembers.length : `${salesCount}/4`, label: isTeamLeader ? "Team" : "a Team Leader", color: "#38bdf8" },
                    ].map((s, i) => (
                      <div key={i} className="p-3.5 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <s.icon className="w-4 h-4 mb-1 mx-auto" style={{ color: s.color }} />
                        <p className="text-xl font-bold text-white">{s.value}</p>
                        <p className="text-[10px]" style={{ color: "#9ca3af" }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-white flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" style={{ color: "#a78bfa" }} /> Bonus Mensile</h3>
                      <span className="text-[10px]" style={{ color: "#6b7280" }}>{currentMonth}</span>
                    </div>
                    <div className="flex items-center justify-around">
                      <BonusProgressRing salesCount={currentMonthSales} milestone={3} label="€500" reward={currentMonthSales >= 3 ? "✓ Sbloccato" : `${3 - currentMonthSales} mancanti`} unlocked={currentMonthSales >= 3} />
                      <BonusProgressRing salesCount={currentMonthSales} milestone={5} label="€1.500" reward={currentMonthSales >= 5 ? "✓ Sbloccato" : `${5 - currentMonthSales} mancanti`} unlocked={currentMonthSales >= 5} />
                    </div>
                  </div>
                  <DemoCreditsWallet userId={user?.id} />
                  <button onClick={() => setShowEarnings(false)} className="w-full py-2.5 text-xs text-center transition-colors" style={{ color: "#6b7280" }}>
                    Chiudi sezione guadagni ↑
                  </button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        )}

        {/* ═══════ CANALE DI ACQUISIZIONE ═══════ */}
        {!demoMode && (
        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#9ca3af" }}>Canale di Acquisizione</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {ACQUISITION_CHANNELS.map(ch => {
              const isActive = activeChannel === ch.id;
              return (
                <motion.button key={ch.id} onClick={() => setActiveChannel(ch.id)} whileTap={{ scale: 0.97 }}
                  className="flex-shrink-0 p-3 sm:p-4 rounded-xl text-left transition-all relative overflow-hidden min-w-[90px] sm:min-w-[130px]"
                  style={{
                    background: isActive ? `${ch.color}18` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? `${ch.color}50` : "rgba(255,255,255,0.06)"}`,
                  }}>
                  <ch.icon className="w-5 h-5 mb-2" style={{ color: isActive ? ch.color : "#6b7280" }} />
                  <p className="text-[11px] font-semibold" style={{ color: isActive ? "#ffffff" : "#d1d5db" }}>{ch.label}</p>
                  {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: ch.color }} />}
                </motion.button>
              );
            })}
          </div>
        </section>
        )}

        {/* ═══════ SELEZIONA PROGETTO + TEMPLATES ═══════ */}
        {!demoMode && (
        <>
        {/* ═══════ SELEZIONA PROGETTO ═══════ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-4">
          <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#9ca3af" }}>
              Seleziona Settore {selectedProjectName && <span style={{ color: "#a78bfa" }}>— {selectedProjectName}</span>}
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[400px] overflow-y-auto pr-1">
              {SECTOR_CARDS.map(card => {
                const isSelected = selectedProject === card.id;
                return (
                  <motion.button key={card.id} onClick={() => setSelectedProject(isSelected ? null : card.id)} whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all"
                    style={{
                      background: isSelected ? `${card.accent}20` : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isSelected ? `${card.accent}50` : "rgba(255,255,255,0.06)"}`,
                    }}>
                    {card.screens[0] ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                        <img src={card.screens[0]} alt={card.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: `${card.accent}15` }}>
                        {card.emoji}
                      </div>
                    )}
                    <span className="text-[9px] font-semibold text-center leading-tight line-clamp-2" style={{ color: isSelected ? "#ffffff" : "#d1d5db" }}>
                      {card.name.split("&")[0].trim().split(" ").slice(0, 2).join(" ")}
                    </span>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full" style={{ background: card.accent }} />}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════ TEMPLATE / SITE LINK ═══════ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-4">
          {activeChannel === "site" ? (
            <div className="p-5 rounded-2xl space-y-4" style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
                  <Link2 className="w-5 h-5" style={{ color: "#34d399" }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Link Demo Diretto</p>
                  <p className="text-[10px]" style={{ color: "#9ca3af" }}>Condividi al cliente per fargli provare la demo</p>
                </div>
              </div>
              {selectedProject ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="text-[10px] mb-1 font-medium" style={{ color: "#6b7280" }}>Link Sito Demo:</p>
                    <p className="text-xs font-mono break-all select-all" style={{ color: "#34d399" }}>{window.location.origin}{getDemoSiteUrl(selectedProject!)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => { navigator.clipboard.writeText(`${window.location.origin}${getDemoSiteUrl(selectedProject!)}`); toast({ title: "✅ Link Sito copiato!" }); }}
                      className="py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}>
                      <Copy className="w-3.5 h-3.5" /> Copia Link Sito
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => { navigator.clipboard.writeText(`${window.location.origin}${getDemoAdminUrl(selectedProject!)}`); toast({ title: "✅ Link Admin copiato!" }); }}
                      className="py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2" style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", color: "#a78bfa" }}>
                      <Copy className="w-3.5 h-3.5" /> Copia Link Admin
                    </motion.button>
                  </div>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => {
                    const siteUrl = `${window.location.origin}${getDemoSiteUrl(selectedProject!)}`;
                    const adminUrl = `${window.location.origin}${getDemoAdminUrl(selectedProject!)}`;
                    const text = `Ciao! 👋 Ecco la demo del tuo sito personalizzato:\n\n🌐 Sito: ${siteUrl}\n⚙️ Admin: ${adminUrl}\n\nProvalo gratis, nessun impegno!`;
                    navigator.clipboard.writeText(text); toast({ title: "✅ Messaggio + link copiato!" });
                  }} className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2" style={{ background: "#7c3aed", color: "#ffffff" }}>
                    <Send className="w-3.5 h-3.5" /> Copia Messaggio con Link
                  </motion.button>
                </div>
              ) : (
                <p className="text-[10px] text-center py-3 rounded-lg" style={{ background: "rgba(245,158,11,0.08)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.15)" }}>☝️ Seleziona un settore sopra per generare i link demo</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* ── Smart Analysis Inputs ── */}
              <div className="p-4 rounded-2xl space-y-3" style={{ background: hasAnalysis ? "rgba(16,185,129,0.06)" : "rgba(99,102,241,0.06)", border: `1px solid ${hasAnalysis ? "rgba(16,185,129,0.2)" : "rgba(99,102,241,0.15)"}`, transition: "all 0.3s" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4" style={{ color: hasAnalysis ? "#34d399" : "#818cf8" }} />
                  <span className="text-xs font-bold text-white">Analisi Target</span>
                  {hasAnalysis && (
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                      ✓ Attiva — messaggi personalizzati
                    </span>
                  )}
                </div>
                <p className="text-[10px]" style={{ color: "#9ca3af" }}>
                  {hasAnalysis
                    ? "I messaggi sotto sono ora personalizzati con i dati del prospect — più persuasivi e mirati."
                    : "Inserisci l'Instagram o il sito web del prospect: il messaggio si adatterà automaticamente con riferimenti diretti alla loro attività."
                  }
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#E4405F" }} />
                    <input
                      type="text"
                      placeholder="@nomeprofilo (es. @ristorantebella)"
                      value={targetIg}
                      onChange={e => setTargetIg(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-transparent outline-none placeholder:text-gray-600 transition-all"
                      style={{ border: `1px solid ${targetIg ? "rgba(228,64,95,0.4)" : "rgba(255,255,255,0.1)"}`, color: "#d1d5db" }}
                    />
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#10B981" }} />
                    <input
                      type="text"
                      placeholder="www.sitoattivita.it (es. www.bellaroma.it)"
                      value={targetWebsite}
                      onChange={e => setTargetWebsite(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-transparent outline-none placeholder:text-gray-600 transition-all"
                      style={{ border: `1px solid ${targetWebsite ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)"}`, color: "#d1d5db" }}
                    />
                  </div>
                </div>
                {/* AI Scan Button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleScanProspect}
                  disabled={scanningProspect || (!targetIg && !targetWebsite)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold disabled:opacity-40 transition-all"
                  style={{ background: "linear-gradient(135deg, rgba(129,140,248,0.2), rgba(16,185,129,0.2))", border: "1px solid rgba(129,140,248,0.3)", color: "#a5b4fc" }}
                >
                  {scanningProspect ? (
                    <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Scansione IA in corso...</>
                  ) : (
                    <><Wand2 className="w-3.5 h-3.5" /> 🤖 Scansiona & Genera Messaggio AI</>
                  )}
                </motion.button>
                {aiGeneratedMessage && (
                  <div className="p-3 rounded-xl text-[10px]" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", color: "#34d399" }}>
                    ✅ Messaggio AI personalizzato generato — è la prima variante nei template
                  </div>
                )}
                {hasAnalysis && (
                  <button
                    onClick={() => { setTargetIg(""); setTargetWebsite(""); setAiGeneratedMessage(null); }}
                    className="text-[9px] font-medium px-2 py-1 rounded-lg transition-all"
                    style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.15)" }}
                  >
                    ✕ Rimuovi analisi
                  </button>
                )}
              </div>

              {/* ── Template Message ── */}
              <div className="p-5 rounded-2xl space-y-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{templateLabel}</span>
                    {selectedProjectName && <span className="px-2 py-0.5 rounded text-[9px] font-semibold" style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}>{selectedProjectName}</span>}
                    <span className="px-2 py-0.5 rounded text-[9px]" style={{ background: "rgba(255,255,255,0.05)", color: "#6b7280" }}>v{(messageVariant % Math.max(variants.length, 1)) + 1}/{variants.length}</span>
                  </div>
                  <button onClick={handleRegenerate} title="Genera variante diversa" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <RefreshCw className="w-3 h-3" style={{ color: "#34d399" }} /><span style={{ color: "#34d399" }}>Rigenera</span>
                  </button>
                </div>

                {/* Toggle: con/senza nomi */}
                <div className="flex items-center justify-between p-2.5 rounded-xl" style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.12)" }}>
                  <span className="text-[10px] font-medium" style={{ color: "#9ca3af" }}>Personalizza con [NOME] e [TUO NOME]</span>
                  <button
                    onClick={() => setUseNames(!useNames)}
                    className="px-3 py-1 rounded-lg text-[10px] font-bold transition-all"
                    style={{
                      background: useNames ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${useNames ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.1)"}`,
                      color: useNames ? "#c4b5fd" : "#6b7280",
                    }}
                  >
                    {useNames ? "✓ Attivo — modifica i nomi" : "Off — pronto da inviare"}
                  </button>
                </div>

                <div className="text-xs leading-relaxed whitespace-pre-line" style={{ color: "#d1d5db" }}>
                  {useNames
                    ? currentTemplate.split(/(\[(?:NOME|TUO NOME)\])/).map((part: string, i: number) =>
                        part.match(/\[(?:NOME|TUO NOME)\]/) ? (
                          <span key={i} className="px-1 py-0.5 rounded font-bold" style={{ background: "rgba(167,139,250,0.2)", color: "#c4b5fd" }}>{part}</span>
                        ) : part
                      )
                    : currentTemplate.replace(/\[NOME\]/g, "").replace(/\[TUO NOME\]/g, "").replace(/  +/g, " ").trim()
                  }
                </div>

                {/* Demo link preview */}
                {selectedProject ? (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}>
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#34d399" }} />
                    <span className="text-[10px] font-mono break-all" style={{ color: "#34d399" }}>{window.location.origin}{getDemoSiteUrl(selectedProject)}</span>
                  </div>
                ) : (
                  <p className="text-[9px] italic" style={{ color: "#6b7280" }}>💡 Seleziona un settore per includere il link demo nel messaggio</p>
                )}

                {/* Editable contact info */}
                <div className="space-y-2 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>Contatto nei messaggi</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3" style={{ color: "#818cf8" }} />
                      <input type="email" value={agencyEmail} onChange={e => setAgencyEmail(e.target.value)}
                        placeholder="Email contatto"
                        className="w-full pl-8 pr-3 py-2 rounded-lg text-[11px] bg-transparent outline-none transition-all"
                        style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#d1d5db" }} />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3" style={{ color: "#34d399" }} />
                      <input type="tel" value={agencyPhone} onChange={e => setAgencyPhone(e.target.value)}
                        placeholder="Cellulare (opzionale — sostituisce email)"
                        className="w-full pl-8 pr-3 py-2 rounded-lg text-[11px] bg-transparent outline-none transition-all"
                        style={{ border: `1px solid ${agencyPhone ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)"}`, color: "#d1d5db" }} />
                    </div>
                  </div>
                  <p className="text-[8px]" style={{ color: "#4b5563" }}>{agencyPhone ? "📞 Il numero sarà usato come contatto nei messaggi" : "📩 L'email sarà usata come contatto nei messaggi"}</p>
                </div>

                {useNames && (
                  <p className="text-[9px] italic" style={{ color: "#6b7280" }}>💡 Sostituisci [NOME] con il nome dell'attività e [TUO NOME] con il tuo nome</p>
                )}
                {!selectedProject && (
                  <p className="text-[10px] text-center py-2 rounded-lg" style={{ background: "rgba(245,158,11,0.08)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.15)" }}>💡 Seleziona un settore sopra per template personalizzati</p>
                )}
                <div className="flex flex-wrap gap-2 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleCopyTemplate}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold" style={{ background: "#7c3aed", color: "#ffffff" }}>
                    <Copy className="w-4 h-4" /> Copia & Invia
                  </motion.button>
                  {activeChannel === "instagram" && (
                    <motion.a whileTap={{ scale: 0.97 }} href={targetIg ? `https://www.instagram.com/${targetIg.replace("@", "")}/` : "https://www.instagram.com/direct/inbox/"} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold" style={{ background: "linear-gradient(135deg, #833AB4, #E4405F, #FCAF45)", color: "#fff" }}>
                      <Instagram className="w-4 h-4" /> {targetIg ? `Apri @${targetIg.replace("@", "")}` : "Apri Instagram DM"}
                    </motion.a>
                  )}
                  {activeChannel === "whatsapp" && (
                    <motion.a whileTap={{ scale: 0.97 }} href="https://wa.me/" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold" style={{ background: "#25D366", color: "#fff" }}>
                      <MessageCircle className="w-4 h-4" /> Apri WhatsApp
                    </motion.a>
                  )}
                  {activeChannel === "email" && (
                    <motion.a whileTap={{ scale: 0.97 }} href={`mailto:?subject=${encodeURIComponent(currentTemplate.split('\n')[0].replace('Oggetto: ', ''))}&body=${encodeURIComponent(currentTemplate)}`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold" style={{ background: "#3B82F6", color: "#fff" }}>
                      <Mail className="w-4 h-4" /> Componi Email
                    </motion.a>
                  )}
                  {activeChannel === "field" && selectedProject && (
                    <motion.a whileTap={{ scale: 0.97 }} href={getDemoSiteUrl(selectedProject)} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold" style={{ background: "#F59E0B", color: "#000" }}>
                      <Smartphone className="w-4 h-4" /> Apri Demo
                    </motion.a>
                  )}
                </div>
              </div>
              {activeChannel === "field" && currentObjections.length > 0 && (
                <div className="p-5 rounded-2xl space-y-3" style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.12)" }}>
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4" style={{ color: "#f59e0b" }} />
                    <p className="text-xs font-bold text-white">Gestione Obiezioni</p>
                  </div>
                  <div className="space-y-2">
                    {currentObjections.map((obj: string, i: number) => (
                      <div key={i} className="p-3 rounded-xl text-[11px] leading-relaxed" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#d1d5db" }}>{obj}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
        </>
        )}

        {/* ═══════ DEMO PERSONALIZZATA — UNIVERSALE ═══════ */}
        {!demoMode && (
          <section className="max-w-5xl mx-auto px-4 sm:px-8 py-4">
            <div className="p-5 rounded-2xl space-y-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: selectedProject ? `${PORTFOLIO_PROJECTS[selectedProject as keyof typeof PORTFOLIO_PROJECTS]?.accent || "#a78bfa"}15` : "rgba(167,139,250,0.1)" }}>
                    <Sparkles className="w-5 h-5" style={{ color: selectedProject ? (PORTFOLIO_PROJECTS[selectedProject as keyof typeof PORTFOLIO_PROJECTS]?.accent || "#a78bfa") : "#a78bfa" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Demo Personalizzata</h3>
                    <p className="text-[10px]" style={{ color: "#9ca3af" }}>
                      {selectedProject ? `Settore: ${selectedProjectName}` : "Seleziona un settore sopra"} · Pronta da mostrare
                    </p>
                  </div>
                </div>
                <button onClick={() => setEditingDemo(!editingDemo)} className="p-2 rounded-lg transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {editingDemo ? <XIcon className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} /> : <Pencil className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />}
                </button>
              </div>

              {/* Customization panel */}
              <AnimatePresence>
                {editingDemo && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#a78bfa" }}>
                        Personalizza per il cliente
                      </p>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-medium" style={{ color: "#9ca3af" }}>Nome Attività del Cliente</label>
                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                          placeholder="Es: Ristorante Da Mario, Salone Bella, NCC Luxury..."
                          className="w-full px-3 py-2 rounded-lg text-sm bg-white !text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-medium" style={{ color: "#9ca3af" }}>Colori Brand</label>
                        <div className="flex items-center gap-2 flex-wrap">
                          <input type="color" value={editColor} onChange={e => setEditColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent" style={{ border: "1px solid rgba(255,255,255,0.15)" }} />
                          {["#C8963E", "#1A1A2E", "#E74C3C", "#2ECC71", "#3498DB", "#8E44AD", "#ec4899", "#f97316"].map(c => (
                            <button key={c} onClick={() => setEditColor(c)} className={`w-6 h-6 rounded-lg transition-all ${editColor === c ? "scale-110 ring-2 ring-white" : ""}`} style={{ backgroundColor: c, border: editColor === c ? "2px solid white" : "2px solid transparent" }} />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-medium" style={{ color: "#9ca3af" }}>Logo del Cliente</label>
                        <input type="file" accept="image/*" ref={logoFileRef} onChange={handleUploadLogo} className="hidden" />
                        <button onClick={() => logoFileRef.current?.click()} disabled={uploadingLogo}
                          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed text-xs"
                          style={{ borderColor: "rgba(255,255,255,0.15)", color: "#d1d5db" }}>
                          <Upload className={`w-3.5 h-3.5 ${uploadingLogo ? "animate-pulse" : ""}`} />
                          {uploadingLogo ? "Caricamento..." : "Carica Logo Cliente"}
                        </button>
                      </div>
                      {demoRestaurant && (
                        <button onClick={handleSaveDemoCustomization} disabled={savingDemo}
                          className="w-full py-2.5 rounded-xl font-semibold text-xs disabled:opacity-50 flex items-center justify-center gap-2"
                          style={{ background: "#7c3aed", color: "#ffffff" }}>
                          <Save className={`w-3.5 h-3.5 ${savingDemo ? "animate-spin" : ""}`} />
                          {savingDemo ? "Salvataggio..." : "Salva Personalizzazione"}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons — universal for any sector */}
              <div className="grid grid-cols-2 gap-3">
                <a href={selectedProject ? getDemoSiteUrl(selectedProject) : "#"}
                  target="_blank" rel="noopener noreferrer"
                  onClick={e => { if (!selectedProject) { e.preventDefault(); toast({ title: "Seleziona un settore", description: "Scegli un progetto dal catalogo sopra per aprire la demo." }); }}}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all text-center group"
                  style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
                    <Globe className="w-5 h-5" style={{ color: "#34d399" }} />
                  </div>
                  <span className="text-xs font-bold text-white">Sito Cliente</span>
                  <span className="text-[9px]" style={{ color: "#6b7280" }}>Mostra al cliente come appare</span>
                </a>
                <a href={selectedProject ? getDemoAdminUrl(selectedProject) : "#"}
                  target="_blank" rel="noopener noreferrer"
                  onClick={e => { if (!selectedProject) { e.preventDefault(); toast({ title: "Seleziona un settore", description: "Scegli un progetto dal catalogo sopra per aprire l'admin." }); }}}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all text-center group"
                  style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(167,139,250,0.15)" }}>
                    <LayoutDashboard className="w-5 h-5" style={{ color: "#a78bfa" }} />
                  </div>
                  <span className="text-xs font-bold text-white">Dashboard Admin</span>
                  <span className="text-[9px]" style={{ color: "#6b7280" }}>Mostra le funzionalità</span>
                </a>
              </div>

              {/* Food demo restaurant quick links */}
              {demoRestaurant && selectedProject === "food" && (
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#d4af37" }}>🍽️ Demo Ristorante Personalizzata</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Cliente", emoji: "👤", href: `/r/${demoRestaurant.slug}` },
                      { label: "Admin", emoji: "⚙️", href: `/dashboard` },
                      { label: "Cucina", emoji: "👨‍🍳", href: `/kitchen` },
                    ].map((link, i) => (
                      <a key={i} href={link.href} target="_blank" rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all text-center"
                        style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}>
                        <span className="text-lg">{link.emoji}</span>
                        <span className="text-[10px] font-semibold text-white">{link.label}</span>
                      </a>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[9px]" style={{ color: "#6b7280" }}>PIN Cucina: <span className="font-mono font-bold text-white">1234</span></p>
                    <button onClick={() => setShowResetConfirm(true)} disabled={resettingDemo}
                      className="flex items-center gap-1 text-[9px] font-medium px-2 py-1 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af" }}>
                      <RefreshCw className={`w-3 h-3 ${resettingDemo ? "animate-spin" : ""}`} /> Reset Demo
                    </button>
                  </div>
                </div>
              )}

              {!selectedProject && (
                <p className="text-[10px] text-center py-2 rounded-lg" style={{ background: "rgba(245,158,11,0.06)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.12)" }}>
                  ☝️ Seleziona un settore dal catalogo per attivare la demo personalizzata
                </p>
              )}
            </div>
          </section>
        )}

        {/* ═══════ RECRUITMENT SECTION ═══════ */}
        {!demoMode && (
          <section className="max-w-5xl mx-auto px-4 sm:px-8 py-4">
            <div className="p-5 rounded-2xl space-y-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" style={{ color: "#a78bfa" }} />
                <h3 className="text-sm font-bold text-white">Recluta Sotto-Venditori</h3>
              </div>
              <p className="text-xs" style={{ color: "#9ca3af" }}>Condividi il tuo link personale. Chi si registra verrà assegnato al tuo team.</p>
              <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[10px] mb-1 font-medium" style={{ color: "#6b7280" }}>Il tuo link:</p>
                <p className="text-xs font-mono break-all select-all" style={{ color: "#d1d5db" }}>{window.location.origin}/auth?role=partner&ref={user?.id}</p>
              </div>
              <motion.button onClick={handleCopyInviteLink} whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{ background: "#7c3aed", color: "#ffffff" }}>
                {inviteCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {inviteCopied ? "Link Copiato!" : "Copia Link di Reclutamento"}
              </motion.button>
            </div>
          </section>
        )}

        {/* ═══════ TEAM LEADER SECTION ═══════ */}
        {isTeamLeader && !demoMode && (
          <section className="max-w-5xl mx-auto px-4 sm:px-8 py-4 space-y-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#9ca3af" }}>Il Tuo Team ({teamMembers.length} membri)</h3>
            {(() => {
              const isActive = salesCount >= 4 && teamMembers.length >= 2;
              return (
                <div className="p-4 rounded-2xl" style={{ background: isActive ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${isActive ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${isActive ? "animate-pulse" : ""}`} style={{ background: isActive ? "#34d399" : "#ef4444" }} />
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: isActive ? "#34d399" : "#ef4444" }}>{isActive ? "Leader Attivo" : "Leader Sospeso"}</span>
                    </div>
                    <Crown className="w-5 h-5" style={{ color: isActive ? "#34d399" : "rgba(239,68,68,0.5)" }} />
                  </div>
                </div>
              );
            })()}
            <div className="p-5 rounded-2xl" style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)" }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#7dd3fc" }}>Revenue da Management</p>
              <p className="text-3xl font-bold text-white">€{totalOverrides.toLocaleString()}</p>
              <p className="text-[10px] font-medium mt-2" style={{ color: "#38bdf8" }}>€50 × vendite idonee (dalla 5ª per membro)</p>
            </div>
            {teamMembers.length > 0 && (
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>
                  <span className="col-span-5">Partner</span><span className="col-span-2 text-center">Vendite</span><span className="col-span-3 text-center">Override</span><span className="col-span-2 text-center">Stato</span>
                </div>
                {teamMembers.map((member) => {
                  const memberSales = teamSales.filter((s: any) => s.partner_id === member.partner_id).length;
                  const eligibleOverrides = Math.max(0, memberSales - 4);
                  return (
                    <div key={member.id} className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="col-span-5 flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(56,189,248,0.1)" }}><Users className="w-3.5 h-3.5" style={{ color: "#38bdf8" }} /></div>
                        <p className="text-xs font-semibold text-white truncate">{(member.profiles as any)?.full_name || "Partner"}</p>
                      </div>
                      <p className="col-span-2 text-center text-sm font-bold text-white">{memberSales}</p>
                      <p className="col-span-3 text-center text-sm font-bold" style={{ color: "#a78bfa" }}>€{(eligibleOverrides * 50).toLocaleString()}</p>
                      <div className="col-span-2 flex justify-center">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{
                          background: memberSales >= 5 ? "rgba(16,185,129,0.1)" : "transparent",
                          color: memberSales >= 5 ? "#34d399" : "#6b7280"
                        }}>
                          {memberSales >= 5 ? "Attivo" : "🔒"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ═══════ PORTFOLIO GRID — Click opens detail overlay ═══════ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-6" style={{ color: "#9ca3af" }}>{demoMode ? "Catalogo Principale — Preview Settori" : "Portfolio Progetti — Clicca per esplorare"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTOR_CARDS.map((card, i) => (
              <motion.div key={card.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl overflow-hidden cursor-pointer group transition-all hover:scale-[1.02]"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                onClick={() => setDetailProject(card.id)}>
                <div className="p-4 flex gap-2 justify-center overflow-hidden h-[160px] items-end" style={{ background: `linear-gradient(135deg, ${card.accent}15, rgba(10,10,20,0.9))` }}>
                  {card.screens.slice(0, 3).map((src, j) => (
                    <div key={j} className={`${j === 1 ? "w-[80px]" : "w-[65px]"} aspect-[9/19.5] rounded-[12px] overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105`} style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                      <img src={src} alt="" className="w-full h-full object-cover object-top" loading="lazy" />
                    </div>
                  ))}
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {card.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider" style={{ background: `${card.accent}25`, color: card.accent }}>{tag}</span>
                    ))}
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">{card.name}</h4>
                  <p className="text-[11px] line-clamp-2" style={{ color: "#9ca3af" }}>{card.description}</p>
                  <p className="text-[10px] font-semibold flex items-center gap-1" style={{ color: "#a78bfa" }}>
                    Vedi tutti gli stili <ChevronRight className="w-3 h-3" />
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
        </section>

        {/* ═══════ CTA SECTION ═══════ */}
        <section className="relative py-16 text-center overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(124,58,237,0.06) 0%, rgba(10,10,20,0.5) 100%)" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(ellipse, #7c3aed, transparent 70%)", filter: "blur(80px)" }} />
          </div>
          <div className="relative z-10 max-w-xl mx-auto px-4 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", color: "#a78bfa" }}>
              <Send className="w-3 h-3" /> Pronto?
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Il cliente è interessato?<br />
              <span style={{ color: "#a78bfa" }}>Passiamo all'azione.</span>
            </h2>
            <p className="text-sm" style={{ color: "#9ca3af" }}>Condividi il link del progetto o contattaci per una demo personalizzata.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button onClick={() => navigate("/home?from=partner")} whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{ background: "#7c3aed", color: "#ffffff" }}>
                <Send className="w-4 h-4" /> Mostra al Cliente
              </motion.button>
              <motion.button onClick={() => setShowFullPortfolio(true)} whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", color: "#a78bfa" }}>
                <ExternalLink className="w-4 h-4" /> Vedi Portfolio Completo
              </motion.button>
            </div>
          </div>
        </section>

        <footer className="py-8 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-12 h-0.5 rounded-full mx-auto mb-4" style={{ background: "rgba(255,255,255,0.1)" }} />
          <p className="text-[11px]" style={{ color: "#6b7280" }}>Riservato ai partner commerciali — Empire © {new Date().getFullYear()}</p>
        </footer>
      </div>

      {/* ═══════ PROJECT DETAIL OVERLAY ═══════ */}
      <AnimatePresence>
        {detailProject && (
          <ProjectDetailOverlay sectorId={detailProject} onClose={() => setDetailProject(null)} />
        )}
      </AnimatePresence>

      <PartnerVoiceAgent activeTab="dashboard" demoMode={demoMode} />
      <ROICalculator open={showROI} onClose={() => setShowROI(false)} />

      <AnimatePresence>
        {showResetConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowResetConfirm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()} className="w-full max-w-sm p-6 rounded-2xl shadow-2xl"
              style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)" }}>
              <h3 className="text-base font-bold text-white mb-2">Resetta Demo?</h3>
              <p className="text-xs mb-5" style={{ color: "#9ca3af" }}>Tutti i dati demo saranno ricreati da zero.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ background: "rgba(255,255,255,0.08)", color: "#d1d5db" }}>Annulla</button>
                <button onClick={handleResetDemo} className="flex-1 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#ef4444", color: "#ffffff" }}>Resetta tutto</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PageGuide />
    </div>
  );
};

export default PartnerDashboard;
