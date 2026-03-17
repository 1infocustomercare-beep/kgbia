// PartnerVoiceAgent — Full-featured AI assistant with scroll-aware Guide Mode
import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, X, MessageSquare, Send, Play, Square, Pause, Sparkles, Bot, Navigation } from "lucide-react";
import voiceAgentAvatar from "@/assets/voice-agent-avatar.png";
import ReactMarkdown from "react-markdown";
import { claimVoiceAgent, releaseVoiceAgent } from "@/lib/voice-agent-mutex";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-voice-agent`;

const normalizeTextForSpeech = (text: string) =>
  text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/#{1,6}\s?/g, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[>*_~]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 700);

// ── Best Italian female voice from Web Speech API ──
let cachedItalianVoice: SpeechSynthesisVoice | null = null;

function getBestItalianFemaleVoice(): SpeechSynthesisVoice | null {
  if (cachedItalianVoice) return cachedItalianVoice;
  const voices = window.speechSynthesis?.getVoices() || [];
  const priorities = [
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /alice/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /federica/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /google/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /elsa|isabella/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it"),
  ];
  for (const test of priorities) {
    const match = voices.find(test);
    if (match) { cachedItalianVoice = match; return match; }
  }
  return null;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => { cachedItalianVoice = null; getBestItalianFemaleVoice(); };
}

function speakWithBrowserTTS(text: string, abortRef: React.MutableRefObject<boolean>): Promise<boolean> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis || abortRef.current) { resolve(false); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getBestItalianFemaleVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = "it-IT";
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    utterance.onend = () => resolve(true);
    utterance.onerror = () => resolve(false);
    if (abortRef.current) { resolve(false); return; }
    window.speechSynthesis.speak(utterance);
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

// ── Stream chat helper ──
async function streamChat({ messages, onDelta, onDone, activeTab, demoMode }: {
  messages: Msg[];
  onDelta: (t: string) => void;
  onDone: () => void;
  activeTab?: string;
  demoMode?: boolean;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ 
      messages, 
      mode: "partner-assistant",
      sectionId: activeTab || "dashboard",
      pageContent: demoMode ? "demo-mode-active" : undefined,
    }),
  });

  if (!resp.ok) {
    let errorMessage = `Errore (${resp.status})`;
    try { const err = await resp.json(); errorMessage = err?.error || errorMessage; } catch {}
    throw new Error(errorMessage);
  }
  if (!resp.body) throw new Error("Nessun flusso ricevuto");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "" || !line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { streamDone = true; break; }
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "" || !raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {}
    }
  }
  onDone();
}

// ── GUIDE MODE: Section narrations ──
const SECTION_NARRATIONS: Record<string, string> = {
  // Dashboard sections
  "net-earnings": "Ecco i tuoi guadagni netti in tempo reale. Qui vedi il totale delle commissioni, gli override dal tuo team e i bonus performance. Ogni vendita ti porta 997 euro netti. Con Empire, i tuoi guadagni crescono esponenzialmente man mano che costruisci il tuo portafoglio clienti. Immagina: 5 vendite questo mese, sono quasi 5.000 euro solo di commissioni, più eventuali bonus Elite da 1.500 euro. Stiamo parlando di oltre 6.000 euro in un mese!",
  "stats-row": "Queste sono le tue metriche chiave: vendite totali, commissione per vendita e il tuo progresso verso la promozione a Team Leader. Raggiungi 4 vendite personali e recluta 2 partner per sbloccare gli override passivi — 200 euro per ogni vendita del tuo team! È il momento di accelerare.",
  "bonus-progress": "Il sistema bonus premia chi si impegna: 3 vendite al mese ti danno 500 euro bonus, 5 vendite un bonus Elite da 1.500 euro. Sono soldi extra, oltre alle commissioni. Immagina: 5 vendite a 997 euro più il bonus Elite — quasi 6.500 euro in un solo mese! E non c'è tetto: più vendi, più guadagni. Il sistema è progettato per farti crescere senza limiti.",
  "demo-credits": "I crediti demo ti permettono di creare dimostrazioni live per i tuoi potenziali clienti. Ogni demo personalizzata lascia il cliente senza parole: vede la SUA attività già digitalizzata con il SUO brand. L'impatto emotivo è devastante e accelera la chiusura della vendita. Usa ogni credito strategicamente!",
  "demo-restaurant": "Questo è il tuo ristorante demo personalizzabile. Inserisci il nome e il logo del tuo cliente per mostrargli l'app già pronta con il suo brand. L'impatto emotivo è devastante: vedono la loro attività già digitalizzata! Il PIN cucina è 1234, e puoi resettare tutto con un click. Durante la presentazione, mostra il menu, gli ordini in tempo reale, la mappa tavoli — il cliente rimane a bocca aperta.",
  "leaderboard": "La classifica vendite. Vedi come ti posizioni rispetto agli altri partner. La competizione sana motiva tutti a dare il massimo. I top seller ricevono riconoscimenti e accesso prioritario a nuove funzionalità. Punta alla top 10 — è lì che i migliori costruiscono il loro network e la loro reputazione!",
  
  // Demo mode dashboard
  "enterprise-preview": "Questa è la modalità presentazione Enterprise. Tutti i tuoi dati sensibili sono nascosti — guadagni, commissioni, dettagli bancari. Mostra questo al cliente per dargli una visione professionale della piattaforma. È come avere un vestito su misura per ogni appuntamento commerciale.",
  "platform-stats": "Questi numeri parlano da soli: oltre 127 ristoranti attivi, 98% di soddisfazione, più di 200 funzionalità integrate e una crescita media del 34% per i clienti. Usa questi dati per rafforzare la credibilità durante la vendita. I numeri non mentono — e quando il cliente li vede, la fiducia sale immediatamente.",
  
  // Tab sections — detailed and persuasive
  "tab-dashboard": "Questa è la tua base operativa — il centro di controllo della tua attività commerciale. Da qui hai una visione d'insieme immediata: guadagni, vendite, bonus in corso e posizione in classifica. Ogni numero qui rappresenta una opportunità. Controlla i tuoi KPI ogni mattina e pianifica la giornata in base agli obiettivi.",
  "tab-sandbox": "Benvenuto nella Sandbox Demo! Questa è la tua arma più potente nelle trattative. Puoi personalizzare il ristorante demo con il nome, il logo e i colori del TUO cliente. Immagina: apri il telefono davanti al cliente e gli mostri la SUA app già funzionante. Il cliente vede il suo nome, il suo brand — e dice 'Quando partiamo?' La Sandbox ha 16 piatti nel menu, 8 tavoli con mappa interattiva, ordini campione e recensioni. Il PIN cucina è 1234. Puoi resettare tutto con un click per la prossima demo.",
  "tab-showcase": "Lo Showcase Settori è la tua arma segreta nella vendita. Mostra al cliente il sito demo del suo settore specifico — ristorazione, hotel, beauty, NCC, edilizia, veterinario e oltre 25 settori. Ogni settore ha funzionalità dedicate che risolvono problemi REALI. Quando il cliente vede il SUO settore con le SUE funzionalità, la vendita è quasi chiusa. Usa il mockup iPhone per un effetto wow professionale: 'Ecco come apparirebbe la TUA app.'",
  "tab-pricing": "Ecco la presentazione dell'investimento — la pagina che chiude le vendite! La licenza lifetime costa 2.997 euro — zero canoni mensili per sempre. Confronta: un gestionale tradizionale costa 100-300 euro al mese. In un anno il cliente ha già risparmiato. In due anni è tutto guadagnato! Presenta sempre il confronto: '2.997 una tantum o 36.000 euro in 10 anni con un canone?' La scelta è ovvia. E c'è anche l'opzione 3 rate da 1.099 euro per chi preferisce rateizzare.",
  "tab-earnings": "Sezione Guadagni: qui trovi il dettaglio completo delle tue commissioni, i bonifici ricevuti e le previsioni di guadagno. Tutto trasparente, tutto tracciato via Stripe Connect. Ogni vendita da 997 euro appare qui con stato e data di accredito. Se sei Team Leader, vedi anche gli override di 200 euro per ogni vendita del tuo team. Questo pannello è la prova che il sistema funziona — mostralo ai potenziali partner per reclutarli!",
  "tab-projects": "Le Bozze Demo ti permettono di preparare presentazioni personalizzate per ogni cliente. Crea una bozza con il brand del cliente, scegli il settore e lancia una demo brandizzata che lascia senza parole. Il segreto dei top seller? Arrivano all'appuntamento con la demo GIÀ preparata. Il cliente si siede, apre il telefono e vede la SUA app. Game over.",
  "tab-team": "La sezione Team è il cuore della tua crescita passiva e scalabile. Qui gestisci i partner che hai reclutato, monitori le loro vendite e guadagni gli override — 200 euro per ogni vendita di ogni membro del team. Più il team cresce, più guadagni dormendo! Un team di 5 partner attivi che fanno 2 vendite al mese ciascuno = 10 vendite × 200 euro = 2.000 euro di override passivo. Ogni mese. Senza vendere tu.",
  "tab-investment": "La sezione Crescita mostra ai clienti il ritorno sull'investimento con numeri concreti e indiscutibili. Un ristorante medio recupera l'investimento in 45 giorni grazie all'aumento degli ordini diretti, alla riduzione delle commissioni delle piattaforme e al recupero automatico dei clienti persi. Usa il calcolatore ROI per personalizzare i numeri sul caso specifico del cliente — è la prova matematica che Empire si paga da solo.",
  "tab-toolkit": "Il Sales Toolkit è il tuo arsenale di vendita completo e professionale. Qui trovi: script di vendita pronti parola per parola, gestione delle 9 obiezioni più comuni con risposte killer, guide di presentazione per settore, pitch deck professionali e strategie testate sul campo dai migliori venditori. Non improvvisare mai — usa questi materiali e la chiusura è garantita.",
  "tab-vault": "L'Asset Vault contiene tutti i materiali scaricabili professionali: presentazioni eleganti, brochure per settore, video demo, loghi e immagini brandizzate Empire. Ogni materiale è stato creato per impressionare. Scarica, personalizza e usa nelle tue presentazioni. I partner che usano i materiali professionali hanno un tasso di chiusura 3 volte superiore.",
  "tab-recruitment": "La sezione Reclutamento ti aiuta a costruire il tuo team — la chiave per i guadagni passivi illimitati. Condividi il tuo link di invito personalizzato e quando un nuovo partner si registra, viene automaticamente assegnato al tuo team. Ogni partner reclutato è una fonte di reddito passivo: 200 euro per ogni sua vendita. Recluta 2 partner attivi e diventi Team Leader con accesso a bonus potenziati e materiali esclusivi.",

  // Team Leader sections
  "leader-status": "Questo badge mostra il tuo stato di Team Leader — il livello più alto della rete commerciale Empire. Per mantenere gli override attivi, devi avere almeno 4 vendite personali e 2 partner nel team. È un sistema meritocratico che premia chi guida con l'esempio. Il Team Leader non è solo un titolo: è una macchina di reddito passivo.",
  "override-revenue": "Ecco i tuoi guadagni passivi da management. 200 euro per ogni vendita idonea dei tuoi partner. Più partner attivi hai, più questo numero cresce automaticamente, ogni mese, senza sforzo. Immagina 10 partner nel team: anche se ognuno fa solo 1 vendita al mese, sono 2.000 euro passivi. Ogni mese. Mentre dormi.",
  "recruit-engine": "Il motore di reclutamento. Copia il tuo link personalizzato e condividilo ovunque — LinkedIn, WhatsApp, social, eventi. Riceverai una notifica in tempo reale quando un nuovo partner si registra tramite il tuo link. Il segreto? Non cercare venditori — cerca imprenditori ambiziosi che vogliono un secondo reddito.",
  "team-ledger": "Il registro del team mostra le performance di ogni membro: vendite, override generati e stato di attivazione. Usa queste informazioni per supportare i tuoi partner, identificare chi ha bisogno di coaching e massimizzare i risultati del team. I migliori Team Leader fanno un check settimanale con ogni partner.",
};

// ── Dynamic quick actions per tab ──
const TAB_QUICK_ACTIONS: Record<string, Array<{ label: string; prompt: string }>> = {
  dashboard: [
    { label: "📊 Panoramica vendite", prompt: "Fammi una panoramica completa delle mie metriche e dimmi cosa devo migliorare questa settimana" },
    { label: "🎯 Strategia settimanale", prompt: "Pianifica la mia settimana di vendita: quante chiamate, demo e follow-up devo fare per raggiungere il bonus?" },
    { label: "🔥 Motivazione", prompt: "Ho bisogno di energia! Ricordami il mio potenziale di guadagno e dammi un boost motivazionale" },
    { label: "👑 Roadmap Team Leader", prompt: "A che punto sono nel percorso verso Team Leader? Cosa mi manca e qual è la strategia più rapida?" },
  ],
  sandbox: [
    { label: "🎮 Come fare una demo perfetta", prompt: "Guidami passo-passo su come usare la Sandbox per fare una demo che chiude la vendita al 100%" },
    { label: "🎨 Personalizzare la demo", prompt: "Come personalizzo la demo con il brand del cliente? Voglio l'effetto wow massimo" },
    { label: "📱 Cosa mostrare prima", prompt: "In che ordine devo mostrare le funzionalità della demo per massimizzare l'impatto? Dammi la sequenza vincente" },
    { label: "🍕 Tour completo demo", prompt: "Fammi un tour completo di tutte le funzionalità della Sandbox Demo: menu, ordini, cucina, tavoli, tutto" },
  ],
  showcase: [
    { label: "🏪 Settore più facile", prompt: "Qual è il settore più facile da vendere adesso e perché? Dammi lo script specifico" },
    { label: "🎯 Pitch per ristorante", prompt: "Dammi un pitch di vendita perfetto per un ristorante, parola per parola, con scenari d'impatto" },
    { label: "💇 Pitch per beauty", prompt: "Dammi un pitch di vendita completo per un centro estetico con obiezioni e risposte" },
    { label: "🚗 Pitch per NCC", prompt: "Dammi un pitch di vendita specifico per un'azienda NCC/transfer con scenari concreti" },
    { label: "🔧 Pitch per artigiano", prompt: "Dammi un pitch completo per un idraulico/elettricista con lo scenario dell'emergenza notturna" },
    { label: "🏨 Pitch per hotel", prompt: "Pitch completo per un hotel/B&B: scenari di risparmio sulle OTA e upselling automatico" },
  ],
  pricing: [
    { label: "💰 Come presentare il prezzo", prompt: "Qual è il modo migliore per presentare il prezzo di €2.997 senza far scappare il cliente? Dammi la tecnica" },
    { label: "🆚 Confronto competitor", prompt: "Fammi un confronto dettagliato: quanto costa Empire vs le alternative tradizionali? I numeri devono essere schiaccianti" },
    { label: "📊 Calcolo ROI per il cliente", prompt: "Aiutami a calcolare il ROI per un cliente tipo: quanto risparmia e in quanto tempo recupera l'investimento?" },
    { label: "❌ Obiezione 'costa troppo'", prompt: "Il cliente dice 'costa troppo'. Dammi la risposta killer definitiva con numeri e confronti" },
  ],
  earnings: [
    { label: "💵 Previsione guadagni", prompt: "Quanti soldi posso realisticamente guadagnare nei prossimi 3, 6 e 12 mesi? Fammi i calcoli" },
    { label: "📈 Come aumentare le vendite", prompt: "Quali sono le 5 strategie più efficaci per aumentare le mie vendite questo mese?" },
    { label: "🏆 Obiettivo bonus Elite", prompt: "Come raggiungo il Bonus Elite da €1.500? Dammi un piano d'azione concreto giorno per giorno" },
  ],
  projects: [
    { label: "📋 Creare bozza vincente", prompt: "Come creo una bozza demo che fa dire 'WOW' al cliente? Quali dettagli personalizzare?" },
    { label: "🎯 Preparare l'appuntamento", prompt: "Ho un appuntamento domani con un cliente. Come preparo la bozza demo perfetta per impressionarlo?" },
  ],
  team: [
    { label: "👥 Costruire il team", prompt: "Come recluto i partner migliori? Dove li trovo e cosa dico per convincerli?" },
    { label: "🎓 Coaching team", prompt: "Come faccio coaching efficace ai miei sub-partner per aumentare le loro vendite?" },
    { label: "💎 Massimizzare override", prompt: "Come massimizzo i guadagni passivi dal mio team? Quanti partner mi servono e che risultati aspettarmi?" },
  ],
  investment: [
    { label: "📊 ROI da mostrare", prompt: "Dammi i numeri ROI più convincenti da mostrare al cliente nella sezione Crescita" },
    { label: "🎯 Come usare il calcolatore", prompt: "Come uso al meglio il calcolatore ROI durante la presentazione per chiudere la vendita?" },
  ],
  toolkit: [
    { label: "📝 Script chiamata a freddo", prompt: "Dammi uno script completo parola per parola per una chiamata a freddo a un potenziale cliente" },
    { label: "❌ Top 5 obiezioni", prompt: "Quali sono le 5 obiezioni più comuni e come le gestisco in modo definitivo?" },
    { label: "🎯 Tecniche di chiusura", prompt: "Insegnami le 3 tecniche di chiusura più efficaci per chiudere la vendita al primo appuntamento" },
    { label: "📞 Follow-up perfetto", prompt: "Come faccio il follow-up dopo la demo se il cliente dice 'ci penso'? Dammi la strategia completa" },
  ],
  vault: [
    { label: "📁 Materiali migliori", prompt: "Quali materiali dell'Asset Vault devo usare per ogni tipo di cliente e in quale ordine?" },
    { label: "🎬 Video per la vendita", prompt: "Come uso i video demo durante la presentazione? Quali mostro e quando?" },
  ],
  recruitment: [
    { label: "🤝 Script reclutamento", prompt: "Dammi uno script completo per reclutare un nuovo partner. Come lo contatto e cosa dico?" },
    { label: "🎯 Dove trovare partner", prompt: "Dove trovo le persone giuste da reclutare nel mio team? Quali canali funzionano meglio?" },
    { label: "💰 Pitch guadagni team", prompt: "Come presento l'opportunità di guadagno a un potenziale partner? Quali numeri uso?" },
  ],
};

// Default quick actions
const DEFAULT_QUICK_ACTIONS = [
  { label: "📊 Commissioni", prompt: "Spiegami nel dettaglio come funzionano le commissioni, i bonus Pro ed Elite, e i guadagni del Team Leader" },
  { label: "🎯 Script vendita", prompt: "Dammi uno script di vendita completo, parola per parola, per chiamare un potenziale cliente e chiudere la vendita" },
  { label: "❌ Obiezioni", prompt: "Elenca tutte le obiezioni comuni dei clienti e dammi le risposte killer per ognuna" },
  { label: "👑 Team Leader", prompt: "Come divento Team Leader? Quali sono i requisiti, i vantaggi e la roadmap completa?" },
  { label: "💡 Guida demo", prompt: "Guidami passo-passo su come fare una demo efficace al cliente usando la mia Dashboard" },
  { label: "🏪 Settori", prompt: "Quali settori sono più facili da vendere, perché, e cosa dico specificamente per ognuno?" },
  { label: "🧭 Dashboard", prompt: "Spiegami tutte le sezioni della mia Dashboard Partner e come usarle al meglio" },
  { label: "🔥 Motivami", prompt: "Ho bisogno di motivazione! Ricordami quanto posso guadagnare e dammi una strategia per questa settimana" },
];

interface PartnerVoiceAgentProps {
  activeTab?: string;
  demoMode?: boolean;
}

const PartnerVoiceAgent: React.FC<PartnerVoiceAgentProps> = ({ activeTab, demoMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"voice" | "chat">("chat");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Ciao! 👋 Sono **ATLAS PRO**, il tuo consulente IA a **massima potenza**.\n\nConosco ogni aspetto di Empire: vendite, commissioni, demo, settori, obiezioni, dashboard, tecniche avanzate — **tutto, nel dettaglio**.\n\n🎯 **Chiedimi qualsiasi cosa** — ti guido passo-passo con risposte concrete e azionabili.\n\n💡 **Attiva la Guida Vocale** per farmi spiegare ogni sezione mentre navighi!" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [inputText, setInputText] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [guideMode, setGuideMode] = useState(false);

  const recognitionRef = useRef<InstanceType<NonNullable<typeof SpeechRecognition>> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);
  const messagesRef = useRef<Msg[]>([]);
  const voiceEnabledRef = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const guideModeRef = useRef(false);
  const lastNarratedSection = useRef<string>("");
  const narratingRef = useRef(false);

  // Current quick actions based on tab
  const currentQuickActions = useMemo(() => {
    return TAB_QUICK_ACTIONS[activeTab || "dashboard"] || DEFAULT_QUICK_ACTIONS;
  }, [activeTab]);

  // Stop homepage voice agent on mount to prevent overlap
  useEffect(() => {
    if ((window as any).__empireVoiceAgentStopAll) {
      (window as any).__empireVoiceAgentStopAll();
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { voiceEnabledRef.current = voiceEnabled; }, [voiceEnabled]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (!SpeechRecognition) setMode("chat"); }, []);
  useEffect(() => { if (isOpen && mode === "chat") setTimeout(() => inputRef.current?.focus(), 150); }, [isOpen, mode]);
  useEffect(() => { guideModeRef.current = guideMode; }, [guideMode]);

  // ── GUIDE MODE: Tab change narration ──
  useEffect(() => {
    if (!guideMode || !activeTab || narratingRef.current) return;
    const tabKey = `tab-${activeTab}`;
    if (tabKey === lastNarratedSection.current) return;
    
    const timer = setTimeout(() => {
      if (!guideModeRef.current) return;
      const narration = SECTION_NARRATIONS[tabKey];
      if (narration && tabKey !== lastNarratedSection.current) {
        lastNarratedSection.current = tabKey;
        narrateSection(tabKey, narration);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [activeTab, guideMode]);

  // ── GUIDE MODE: IntersectionObserver for scroll sections ──
  useEffect(() => {
    if (!guideMode) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!guideModeRef.current || narratingRef.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const sectionId = (entry.target as HTMLElement).dataset.guideSection;
            if (sectionId && sectionId !== lastNarratedSection.current && SECTION_NARRATIONS[sectionId]) {
              lastNarratedSection.current = sectionId;
              narrateSection(sectionId, SECTION_NARRATIONS[sectionId]);
            }
          }
        }
      },
      { threshold: 0.5, rootMargin: "-10% 0px -10% 0px" }
    );

    const elements = document.querySelectorAll("[data-guide-section]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [guideMode, activeTab]);

  const narrateSection = useCallback(async (sectionId: string, text: string) => {
    if (narratingRef.current) return;
    narratingRef.current = true;
    abortRef.current = false;

    if (window.speechSynthesis) window.speechSynthesis.cancel();

    const guideMsg: Msg = { role: "assistant", content: `🎙️ **${getSectionTitle(sectionId)}**\n\n${text}` };
    setMessages(prev => [...prev, guideMsg]);
    
    setIsSpeaking(true);
    await speakWithBrowserTTS(text, abortRef);
    if (!abortRef.current) {
      setIsSpeaking(false);
    }
    narratingRef.current = false;
  }, []);

  const stopAll = useCallback(() => {
    abortRef.current = true;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
    setIsSpeaking(false);
    setIsPaused(false);
    setIsListening(false);
    setLiveTranscript("");
    narratingRef.current = false;
  }, []);

  const togglePause = useCallback(() => {
    if (window.speechSynthesis) {
      if (isPaused) { window.speechSynthesis.resume(); setIsPaused(false); }
      else { window.speechSynthesis.pause(); setIsPaused(true); }
    }
  }, [isPaused]);

  const toggleGuideMode = useCallback(() => {
    const next = !guideMode;
    setGuideMode(next);
    if (next) {
      lastNarratedSection.current = "";
      narratingRef.current = false;
      setMessages(prev => [...prev, { role: "assistant", content: "🧭 **Guida Vocale Attivata!**\n\nOra ti spiegherò ogni sezione della dashboard mentre scorri e navighi tra le tab. Muoviti liberamente, io ti accompagno con spiegazioni dettagliate e consigli strategici! 🚀" }]);
      if (activeTab) {
        const tabKey = `tab-${activeTab}`;
        if (SECTION_NARRATIONS[tabKey]) {
          lastNarratedSection.current = tabKey;
          setTimeout(() => narrateSection(tabKey, SECTION_NARRATIONS[tabKey]), 800);
        }
      }
    } else {
      stopAll();
      setMessages(prev => [...prev, { role: "assistant", content: "⏹️ Guida Vocale disattivata. Puoi sempre riattivare o chiedimi qualsiasi cosa nella chat!" }]);
    }
  }, [guideMode, activeTab, narrateSection, stopAll]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    stopAll();
    abortRef.current = false;

    const userMsg: Msg = { role: "user", content: text };
    const allMessages = [...messagesRef.current, userMsg];
    setMessages(allMessages);
    setIsLoading(true);
    setInputText("");

    let full = "";
    const upsert = (chunk: string) => {
      full += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: full } : m));
        }
        return [...prev, { role: "assistant", content: full }];
      });
    };

    try {
      await streamChat({
        messages: allMessages,
        onDelta: upsert,
        activeTab,
        demoMode,
        onDone: async () => {
          setIsLoading(false);
          if (voiceEnabledRef.current && full.length > 0 && full.length < 2000 && !abortRef.current) {
            setIsSpeaking(true);
            const normalized = normalizeTextForSpeech(full);
            await speakWithBrowserTTS(normalized, abortRef);
            if (!abortRef.current) setIsSpeaking(false);
          }
        },
      });
    } catch (error) {
      setIsLoading(false);
      const msg = error instanceof Error ? error.message : "Errore, riprova.";
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
    }
  }, [isLoading, stopAll, activeTab, demoMode]);

  const startListening = useCallback(async () => {
    if (!SpeechRecognition) { setMode("chat"); return; }
    stopAll();
    abortRef.current = false;

    try { await navigator.mediaDevices.getUserMedia({ audio: true }); } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Abilita l'accesso al microfono per usare la voce." }]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "it-IT";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setLiveTranscript(interim);
      if (final) { setLiveTranscript(""); setIsListening(false); sendMessage(final); }
    };
    recognition.onerror = () => { setIsListening(false); setLiveTranscript(""); };
    recognition.onend = () => { setIsListening(false); setLiveTranscript(""); };

    try { recognition.start(); setIsListening(true); } catch { setIsListening(false); }
  }, [sendMessage, stopAll]);

  // Tab label for header subtitle
  const tabLabel = useMemo(() => {
    const labels: Record<string, string> = {
      dashboard: "Dashboard", sandbox: "Sandbox Demo", showcase: "Showcase Settori",
      pricing: "Pricing & Closing", earnings: "Guadagni", projects: "Bozze Demo",
      team: "Gestione Team", investment: "Crescita & ROI", toolkit: "Sales Toolkit",
      vault: "Asset Vault", recruitment: "Reclutamento",
    };
    return labels[activeTab || "dashboard"] || "Dashboard";
  }, [activeTab]);

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-3 z-[201] touch-manipulation"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileTap={{ scale: 0.94 }}
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-1.5 rounded-full bg-primary/25 blur-md"
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-xl border-2 border-primary/30 bg-background">
                <img src={voiceAgentAvatar} alt="ATLAS" className="w-full h-full object-cover" />
                {(isSpeaking && !isPaused) && (
                  <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-background" />
                )}
              </div>
              <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                {guideMode ? <Navigation className="w-3 h-3 text-primary-foreground" /> : <Sparkles className="w-3 h-3 text-primary-foreground" />}
              </div>
              {guideMode && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[7px] font-bold text-white whitespace-nowrap"
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  GUIDA ON
                </motion.div>
              )}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Agent Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-0 right-0 z-[200] w-full sm:w-[400px] sm:bottom-4 sm:right-4 max-h-[80dvh] sm:max-h-[650px] flex flex-col rounded-t-2xl sm:rounded-2xl border border-primary/10 bg-background/95 backdrop-blur-2xl shadow-[0_0_60px_hsla(var(--primary)/0.15)]"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <motion.div
                    className="absolute -inset-1 rounded-full bg-primary/20 blur-sm"
                    animate={isSpeaking && !isPaused ? { opacity: [0.25, 0.5, 0.25], scale: [1, 1.1, 1] } : { opacity: 0.15, scale: 1 }}
                    transition={{ duration: 1.4, repeat: isSpeaking ? Infinity : 0 }}
                  />
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30">
                    <img src={voiceAgentAvatar} alt="ATLAS" className="w-full h-full object-cover" />
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                    isPaused ? "bg-amber-400" : isSpeaking ? "bg-green-400" : isListening ? "bg-amber-400" : isLoading ? "bg-blue-400" : guideMode ? "bg-emerald-400" : "bg-primary/60"
                  }`} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    ATLAS <span className="text-[0.55rem] font-normal text-primary/60 bg-primary/10 px-1.5 py-0.5 rounded-full">PRO</span>
                  </h3>
                  <p className="text-[0.55rem] text-muted-foreground tracking-wider uppercase">
                    {isPaused ? "⏸ In pausa" : isSpeaking ? "🔊 Sta parlando..." : isListening ? "🎙️ Ti ascolta..." : isLoading ? "💭 Sta pensando..." : guideMode ? "🧭 Guida Vocale Attiva" : `📍 ${tabLabel}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {isSpeaking && (
                  <button onClick={togglePause}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/[0.05]">
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                )}
                {isSpeaking && (
                  <button onClick={stopAll}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:text-red-400 hover:bg-red-400/10">
                    <Square className="w-3.5 h-3.5" />
                  </button>
                )}
                <button onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${voiceEnabled ? "text-primary bg-primary/10" : "text-foreground/40 hover:text-foreground hover:bg-foreground/[0.05]"}`}
                  title={voiceEnabled ? "Disattiva voce" : "Attiva voce"}>
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                {SpeechRecognition && (
                  <button onClick={() => setMode(mode === "voice" ? "chat" : "voice")}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/[0.05]"
                    title={mode === "voice" ? "Passa a chat" : "Passa a voce"}>
                    {mode === "voice" ? <MessageSquare className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}
                <button onClick={() => { stopAll(); setIsOpen(false); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/[0.05]">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Guide Mode Toggle */}
            <div className="px-3 pt-2">
              <motion.button
                onClick={toggleGuideMode}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  guideMode
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_hsla(160,80%,45%,0.15)]"
                    : "bg-foreground/[0.04] text-muted-foreground border border-foreground/[0.08] hover:bg-foreground/[0.08] hover:text-foreground"
                }`}
                whileTap={{ scale: 0.97 }}
              >
                <Navigation className={`w-4 h-4 ${guideMode ? "text-emerald-400" : ""}`} />
                {guideMode ? "🧭 Guida Vocale Attiva — Tocca per disattivare" : "🧭 Attiva Guida Vocale (spiega ogni sezione)"}
              </motion.button>
            </div>

            {/* Quick Actions — dynamic per tab */}
            {messages.length <= 1 && !isLoading && !guideMode && (
              <div className="px-3 pt-3 flex flex-wrap gap-1.5">
                {currentQuickActions.map((action) => (
                  <motion.button key={action.label}
                    onClick={() => sendMessage(action.prompt)}
                    className="px-2.5 py-1.5 rounded-full text-[0.6rem] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/10"
                    whileTap={{ scale: 0.95 }}>
                    {action.label}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[120px] max-h-[350px] sm:max-h-[420px] overscroll-contain">
              {messages.map((msg, i) => (
                <motion.div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-[1.6] ${
                    msg.role === "user"
                      ? "bg-primary/15 text-foreground rounded-br-md"
                      : "bg-foreground/[0.04] text-foreground/80 rounded-bl-md border border-foreground/[0.05]"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:m-0 [&_p]:text-xs [&_strong]:text-primary/80 [&_li]:text-xs">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <motion.div className="flex gap-1.5 px-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="w-2 h-2 rounded-full bg-primary/40"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </motion.div>
              )}

              {liveTranscript && (
                <motion.div className="text-[0.65rem] text-foreground/30 italic px-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  🎙️ {liveTranscript}...
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Voice Wave */}
            {isSpeaking && !isPaused && (
              <div className="flex items-center justify-center gap-[3px] py-2 px-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div key={i} className="w-[3px] rounded-full bg-primary/50"
                    animate={{ height: [4, 8 + ((i * 7) % 14), 4] }}
                    transition={{ duration: 0.6 + ((i % 4) * 0.12), repeat: Infinity, delay: i * 0.03 }} />
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t border-border/30">
              {mode === "voice" ? (
                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    onClick={isListening ? () => { recognitionRef.current?.stop(); setIsListening(false); } : startListening}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      isListening
                        ? "bg-red-500/20 text-red-400 border-2 border-red-500/40"
                        : "bg-primary/15 text-primary border-2 border-primary/30 hover:bg-primary/25"
                    }`}
                    whileTap={{ scale: 0.9 }}
                    disabled={isLoading}>
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </motion.button>
                  <p className="text-[0.6rem] text-muted-foreground max-w-[140px]">
                    {isListening ? "Sto ascoltando..." : "Tocca per parlare"}
                  </p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(inputText); }}
                  className="flex items-center gap-2">
                  <input ref={inputRef} value={inputText} onChange={(e) => setInputText(e.target.value)}
                    placeholder="Chiedimi qualsiasi cosa..."
                    disabled={isLoading}
                    className="flex-1 bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:ring-1 focus:ring-primary/30 min-h-[44px]" />
                  <motion.button type="submit" disabled={!inputText.trim() || isLoading}
                    className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center disabled:opacity-30 hover:bg-primary/25 transition-all"
                    whileTap={{ scale: 0.9 }}>
                    <Send className="w-4 h-4" />
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Helper: get section title from ID
function getSectionTitle(sectionId: string): string {
  const titles: Record<string, string> = {
    "net-earnings": "💰 Guadagni Netti",
    "stats-row": "📊 Metriche Chiave",
    "bonus-progress": "🏆 Bonus Performance",
    "demo-credits": "🎟️ Crediti Demo",
    "demo-restaurant": "🍕 Ristorante Demo",
    "leaderboard": "🥇 Classifica",
    "enterprise-preview": "🎭 Modalità Presentazione",
    "platform-stats": "📈 Statistiche Piattaforma",
    "tab-dashboard": "🏠 Dashboard",
    "tab-sandbox": "🎮 Sandbox Demo",
    "tab-showcase": "🏪 Showcase Settori",
    "tab-pricing": "💳 Investimento & Pricing",
    "tab-earnings": "💵 Guadagni",
    "tab-projects": "📋 Bozze Demo",
    "tab-team": "👥 Gestione Team",
    "tab-investment": "📈 Crescita & ROI",
    "tab-toolkit": "🛠️ Sales Toolkit",
    "tab-vault": "📁 Asset Vault",
    "tab-recruitment": "🤝 Reclutamento",
    "leader-status": "👑 Stato Leader",
    "override-revenue": "💎 Revenue Passiva",
    "recruit-engine": "🚀 Motore Reclutamento",
    "team-ledger": "📒 Registro Team",
  };
  return titles[sectionId] || "📌 Sezione";
}

export default PartnerVoiceAgent;
