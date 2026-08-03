/**
 * Arianna Session Memory
 *
 * Memoria di sessione (sessionStorage) per l'agente Arianna:
 * - conserva la conversazione durante la navigazione / refresh nella stessa tab
 * - estrae e mantiene i dettagli dell'utente (settore, città, nome, budget, dimensione)
 * - traccia le domande già poste da Arianna così non le ripete
 *
 * Nessun dato viene inviato al backend oltre al riepilogo compatto (`memory`)
 * usato per contestualizzare le risposte.
 */

export type AriannaMsg = { role: "user" | "assistant"; content: string };

export interface AriannaProfile {
  name?: string;
  sector?: string;
  city?: string;
  budget?: string;
  teamSize?: string;
  goal?: string;
  channel?: string;
}

export interface AriannaSessionMemory {
  messages: AriannaMsg[];
  profile: AriannaProfile;
  askedTopics: string[];
  updatedAt: number;
}

const KEY = "empire.arianna.session";
const MAX_MESSAGES = 40;
const TTL_MS = 6 * 60 * 60 * 1000; // 6h

const EMPTY: AriannaSessionMemory = { messages: [], profile: {}, askedTopics: [], updatedAt: 0 };

export function loadSessionMemory(): AriannaSessionMemory {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as AriannaSessionMemory;
    if (!parsed || typeof parsed !== "object") return { ...EMPTY };
    if (parsed.updatedAt && Date.now() - parsed.updatedAt > TTL_MS) {
      window.sessionStorage.removeItem(KEY);
      return { ...EMPTY };
    }
    return {
      messages: Array.isArray(parsed.messages) ? parsed.messages.slice(-MAX_MESSAGES) : [],
      profile: parsed.profile && typeof parsed.profile === "object" ? parsed.profile : {},
      askedTopics: Array.isArray(parsed.askedTopics) ? parsed.askedTopics : [],
      updatedAt: parsed.updatedAt || Date.now(),
    };
  } catch {
    return { ...EMPTY };
  }
}

function persist(memory: AriannaSessionMemory) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      KEY,
      JSON.stringify({ ...memory, messages: memory.messages.slice(-MAX_MESSAGES), updatedAt: Date.now() }),
    );
  } catch {
    /* quota / private mode — memoria solo in RAM */
  }
}

export function saveSessionMessages(messages: AriannaMsg[]) {
  const current = loadSessionMemory();
  persist({ ...current, messages });
}

export function clearSessionMemory() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {}
}

// ── Estrazione dettagli utente ──

const SECTOR_PATTERNS: Array<[RegExp, string]> = [
  [/ristorant|pizzeri|trattori|osteri|sushi|bar\b|caff|bistro|food/i, "ristorazione / food"],
  [/hotel|b&b|bed and breakfast|resort|affittacamer|ospitalit/i, "hospitality"],
  [/parrucchier|barber|estetic|nail|unghie|salone|beauty|spa\b/i, "beauty"],
  [/ncc|autonoleggi|chauffeur|limousine|transfer|taxi/i, "NCC / trasporti"],
  [/palestr|fitness|personal train|crossfit|padel|yoga|pilates/i, "fitness"],
  [/dentist|medic|studio medico|fisioterap|psicolog|clinic|veterinar/i, "healthcare"],
  [/negozi|retail|boutique|e-?commerce|shop\b/i, "retail"],
  [/immobiliar|agenzia immobil|real estate/i, "real estate"],
  [/edil|impres[ae] di costruz|idraulic|elettricist|serrament/i, "edilizia / servizi tecnici"],
  [/avvocat|commercialist|consulen|studio legale|architett/i, "studi professionali"],
];

const CITY_RE =
  /\b(?:a|ad|in|di|da)\s+(Milano|Roma|Torino|Napoli|Firenze|Bologna|Venezia|Verona|Genova|Palermo|Catania|Bari|Padova|Brescia|Bergamo|Rimini|Parma|Modena|Perugia|Cagliari|Trieste|Como|Lecce|Pescara|Ancona|Salerno|Sassari|Olbia|Alghero|Trento|Bolzano|Udine|Vicenza|Treviso|Ferrara|Livorno|Pisa|Siena|Latina|Foggia|Taranto|Reggio Calabria|Reggio Emilia|Novara|Varese|Monza|Lugano|Lucca|Terni|Prato|Ravenna|Piacenza|Cremona|Pavia|Asti|Cuneo|Savona|La Spezia|Matera|Potenza|Campobasso|Aosta|Catanzaro|Cosenza|Crotone|Messina|Siracusa|Ragusa|Trapani|Agrigento|Caltanissetta|Enna)\b/i;

const NAME_RE = /\b(?:mi chiamo|sono|il mio nome è|piacere,?)\s+([A-ZÀ-Ù][a-zà-ù]{2,}(?:\s+[A-ZÀ-Ù][a-zà-ù]{2,})?)/;

const BUDGET_RE = /(\d{1,3}(?:[.\s]?\d{3})*)\s*(?:€|euro|eur)|(?:€|euro)\s*(\d{1,3}(?:[.\s]?\d{3})*)/i;

const TEAM_RE = /\b(\d{1,3})\s*(?:dipendent|collaborator|persone|ragazz|addett|impiegat)/i;

const GOAL_PATTERNS: Array<[RegExp, string]> = [
  [/più client|nuovi client|acquisi|lead/i, "acquisire nuovi clienti"],
  [/prenotazion|appuntament|agenda/i, "automatizzare prenotazioni e agenda"],
  [/commission|ota|booking\.com|glovo|just ?eat|deliveroo/i, "ridurre commissioni piattaforme"],
  [/recension|reputazion/i, "gestire recensioni e reputazione"],
  [/whatsapp|risponder|messagg/i, "rispondere automaticamente ai messaggi"],
  [/sito|web ?app|vetrina|mockup|demo/i, "avere sito / web app su misura"],
  [/social|instagram|contenut|post/i, "contenuti e social"],
];

/** Estrae dettagli dal messaggio utente e li unisce al profilo esistente. */
export function extractProfileFacts(text: string, current: AriannaProfile = {}): AriannaProfile {
  const next: AriannaProfile = { ...current };
  if (!text) return next;

  if (!next.sector) {
    for (const [re, label] of SECTOR_PATTERNS) {
      if (re.test(text)) {
        next.sector = label;
        break;
      }
    }
  }

  if (!next.city) {
    const city = text.match(CITY_RE)?.[1];
    if (city) next.city = city.charAt(0).toUpperCase() + city.slice(1);
  }

  if (!next.name) {
    const name = text.match(NAME_RE)?.[1];
    if (name) next.name = name.trim();
  }

  if (!next.budget) {
    const m = text.match(BUDGET_RE);
    const amount = m?.[1] || m?.[2];
    if (amount) next.budget = `${amount.replace(/\s/g, "")} €`;
  }

  if (!next.teamSize) {
    const t = text.match(TEAM_RE)?.[1];
    if (t) next.teamSize = `${t} persone`;
  }

  if (!next.goal) {
    for (const [re, label] of GOAL_PATTERNS) {
      if (re.test(text)) {
        next.goal = label;
        break;
      }
    }
  }

  if (!next.channel) {
    if (/whatsapp/i.test(text)) next.channel = "WhatsApp";
    else if (/telefon|chiamat/i.test(text)) next.channel = "telefono";
    else if (/mail|email/i.test(text)) next.channel = "email";
  }

  return next;
}

const QUESTION_TOPICS: Array<[RegExp, string]> = [
  [/che settore|in che ambito|di cosa ti occupi|qual è la tua attivit/i, "settore"],
  [/dove (?:sei|siete|ti trovi)|in che citt|zona/i, "città"],
  [/come ti chiami|il tuo nome|posso chiamarti/i, "nome"],
  [/budget|quanto (?:vorresti|puoi) investir/i, "budget"],
  [/quante persone|quanti dipendent|quanto è grande/i, "dimensione del team"],
  [/obiettiv|cosa vorresti ottener|priorit/i, "obiettivo"],
  [/hai (?:già )?un sito|hai un gestional|usi (?:già )?/i, "strumenti attuali"],
  [/preferisci (?:whatsapp|essere contattat)|come preferisci/i, "canale di contatto"],
];

/** Rileva i temi delle domande poste da Arianna, per non riproporle. */
export function detectAskedTopics(assistantText: string, current: string[] = []): string[] {
  if (!assistantText || !assistantText.includes("?")) return current;
  const found = new Set(current);
  for (const [re, topic] of QUESTION_TOPICS) {
    if (re.test(assistantText)) found.add(topic);
  }
  return Array.from(found);
}

/** Aggiorna la memoria di sessione con un nuovo turno. */
export function rememberTurn(opts: {
  messages: AriannaMsg[];
  userText?: string;
  assistantText?: string;
}): AriannaSessionMemory {
  const current = loadSessionMemory();
  const profile = opts.userText ? extractProfileFacts(opts.userText, current.profile) : current.profile;
  const askedTopics = opts.assistantText
    ? detectAskedTopics(opts.assistantText, current.askedTopics)
    : current.askedTopics;
  const next: AriannaSessionMemory = {
    messages: opts.messages,
    profile,
    askedTopics,
    updatedAt: Date.now(),
  };
  persist(next);
  return next;
}

const PROFILE_LABELS: Array<[keyof AriannaProfile, string]> = [
  ["name", "Nome"],
  ["sector", "Settore"],
  ["city", "Città"],
  ["teamSize", "Team"],
  ["budget", "Budget indicato"],
  ["goal", "Obiettivo"],
  ["channel", "Canale preferito"],
];

/** Riepilogo compatto da inviare al backend come contesto. */
export function buildMemoryPayload(memory: AriannaSessionMemory = loadSessionMemory()) {
  const facts = PROFILE_LABELS.filter(([k]) => !!memory.profile[k]).map(
    ([k, label]) => `${label}: ${memory.profile[k]}`,
  );
  if (facts.length === 0 && memory.askedTopics.length === 0) return undefined;
  return {
    facts,
    askedTopics: memory.askedTopics,
    turns: memory.messages.length,
  };
}
