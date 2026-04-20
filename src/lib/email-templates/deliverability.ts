/**
 * Email deliverability scoring & best practice engine.
 *
 * Calcola un punteggio 0-100 e ritorna warning + tips contestuali per:
 *  - parole spam (italiano + inglese)
 *  - rapporto testo/link
 *  - lunghezza soggetto
 *  - eccesso di MAIUSCOLE
 *  - punteggiatura aggressiva (!!!, ???)
 *  - emoji eccessive
 *  - assenza di firma o opt-out
 */

export type DeliverabilityIssue = {
  level: "critical" | "warning" | "info";
  code: string;
  message: string;
  fix?: string;
};

export type DeliverabilityResult = {
  score: number;                 // 0-100
  rating: "excellent" | "good" | "fair" | "poor";
  issues: DeliverabilityIssue[];
  positives: string[];
  inboxLikelihood: string;       // descrizione human-readable
};

const SPAM_WORDS_IT = [
  "gratis", "100%", "garantito", "guadagna", "rimborso", "offerta limitata",
  "click qui", "cliccare qui", "compra ora", "vinci", "prezzo speciale",
  "occasione unica", "soldi facili", "senza rischio", "promozione esclusiva",
  "atto urgente", "non perdere", "ultima possibilità", "investi subito",
];
const SPAM_WORDS_EN = [
  "free", "buy now", "click here", "limited time", "act now", "earn money",
  "guarantee", "no risk", "winner", "cash bonus", "miracle", "discount",
];

const POSITIVE_PHRASES = [
  "personalizzata", "preview", "su misura", "analisi", "consulenza",
  "domanda", "feedback", "idea", "proposta",
];

export function analyzeEmailDeliverability(input: {
  subject: string;
  body: string;
  hasUnsubscribe?: boolean;
  hasSignature?: boolean;
  recipientLanguage?: "it" | "en";
}): DeliverabilityResult {
  const subject = (input.subject || "").trim();
  const body = (input.body || "").trim();
  const lcSubject = subject.toLowerCase();
  const lcBody = body.toLowerCase();
  const issues: DeliverabilityIssue[] = [];
  const positives: string[] = [];
  let score = 100;

  // 1) Soggetto
  if (subject.length === 0) {
    issues.push({ level: "critical", code: "subject_empty", message: "Soggetto vuoto", fix: "Aggiungi un soggetto di 30-50 caratteri." });
    score -= 30;
  } else if (subject.length < 12) {
    issues.push({ level: "warning", code: "subject_short", message: "Soggetto troppo corto", fix: "Punta a 30-50 caratteri per un'apertura migliore." });
    score -= 8;
  } else if (subject.length > 70) {
    issues.push({ level: "warning", code: "subject_long", message: "Soggetto troppo lungo, verrà tagliato sui mobile", fix: "Riduci sotto i 50 caratteri." });
    score -= 6;
  } else {
    positives.push("Soggetto di lunghezza ottimale");
  }

  // 2) Maiuscole eccessive nel soggetto
  const upperRatio = subject.replace(/[^A-Za-zÀ-ÿ]/g, "").length > 0
    ? subject.replace(/[^A-Z]/g, "").length / Math.max(1, subject.replace(/[^A-Za-zÀ-ÿ]/g, "").length)
    : 0;
  if (upperRatio > 0.5) {
    issues.push({ level: "critical", code: "subject_caps", message: "Troppe MAIUSCOLE nel soggetto", fix: "Usa Capitalizzazione naturale." });
    score -= 15;
  }

  // 3) Punteggiatura aggressiva
  if (/!{2,}|\?{2,}|\.{4,}/.test(subject)) {
    issues.push({ level: "warning", code: "subject_punct", message: "Punteggiatura aggressiva nel soggetto (!!!, ???)", fix: "Usa al massimo un punto esclamativo." });
    score -= 6;
  }

  // 4) Spam words
  const spamHits: string[] = [];
  const lex = input.recipientLanguage === "en" ? SPAM_WORDS_EN : [...SPAM_WORDS_IT, ...SPAM_WORDS_EN];
  for (const w of lex) {
    if (lcSubject.includes(w) || lcBody.includes(w)) spamHits.push(w);
  }
  if (spamHits.length > 0) {
    issues.push({
      level: spamHits.length >= 3 ? "critical" : "warning",
      code: "spam_words",
      message: `Parole ad alto rischio spam rilevate: ${spamHits.slice(0, 4).join(", ")}${spamHits.length > 4 ? "…" : ""}`,
      fix: "Rimuovi o sostituisci con sinonimi neutri.",
    });
    score -= Math.min(25, spamHits.length * 5);
  }

  // 5) Lunghezza body
  const bodyChars = body.replace(/<[^>]*>/g, "").length;
  if (bodyChars < 80) {
    issues.push({ level: "warning", code: "body_short", message: "Corpo troppo corto, può sembrare spam", fix: "Aggiungi contesto: come hai trovato il lead, perché scrivi." });
    score -= 6;
  } else if (bodyChars > 1500) {
    issues.push({ level: "info", code: "body_long", message: "Email molto lunga, le risposte calano oltre i 200 parole", fix: "Riduci a 120-200 parole, link a una pagina di approfondimento." });
    score -= 3;
  } else {
    positives.push("Lunghezza corpo bilanciata");
  }

  // 6) Rapporto link/testo
  const linkCount = (body.match(/https?:\/\/[^\s"<]+/g) || []).length + (body.match(/<a\s/gi) || []).length / 2;
  if (linkCount > 4) {
    issues.push({ level: "warning", code: "too_many_links", message: `Troppi link (${linkCount})`, fix: "Riduci a max 2 link per non triggerare i filtri." });
    score -= 8;
  } else if (linkCount === 0 && bodyChars > 200) {
    issues.push({ level: "info", code: "no_link", message: "Nessuna CTA chiara con link", fix: "Aggiungi una sola CTA primaria." });
    score -= 3;
  }

  // 7) Emoji eccessive
  const emojiCount = (body.match(/[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}]/gu) || []).length
    + (subject.match(/[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}]/gu) || []).length;
  if (emojiCount > 4) {
    issues.push({ level: "warning", code: "emoji_overload", message: `Troppe emoji (${emojiCount})`, fix: "Massimo 1-2 emoji in tutta l'email." });
    score -= 6;
  }

  // 8) Personalizzazione
  const hasPositive = POSITIVE_PHRASES.some((p) => lcBody.includes(p));
  if (hasPositive) positives.push("Linguaggio consulenziale rilevato");

  // 9) Firma + unsubscribe
  if (input.hasSignature === false) {
    issues.push({ level: "warning", code: "no_signature", message: "Firma assente", fix: "Aggiungi nome + ruolo per credibilità." });
    score -= 5;
  }
  if (input.hasUnsubscribe === false) {
    issues.push({ level: "info", code: "no_unsubscribe", message: "Manca un opt-out chiaro", fix: "Anche una riga \"rispondi STOP\" basta." });
    score -= 4;
  }

  // 10) Token non sostituiti (placeholder dimenticati)
  if (/\{\{[a-zA-Z_]+\}\}/.test(subject + body)) {
    issues.push({ level: "critical", code: "unfilled_tokens", message: "Sono presenti placeholder non sostituiti (es. {{recipientName}})", fix: "Compila tutte le variabili prima di inviare." });
    score -= 20;
  }

  score = Math.max(0, Math.min(100, score));
  const rating: DeliverabilityResult["rating"] =
    score >= 85 ? "excellent" : score >= 70 ? "good" : score >= 50 ? "fair" : "poor";
  const inboxLikelihood =
    score >= 85 ? "Consegna in inbox molto probabile su Gmail/Outlook" :
    score >= 70 ? "Consegna in inbox probabile, ma può finire in Promozioni" :
    score >= 50 ? "Rischio Promozioni/Spam — sistema almeno i critical" :
    "Rischio spam alto — non inviare prima di correggere";

  return { score, rating, issues, positives, inboxLikelihood };
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Best practice content (per il pannello guida nella UI)                    */
/* ────────────────────────────────────────────────────────────────────────── */

export type BestPracticeSection = {
  id: string;
  title: string;
  description: string;
  tips: { label: string; detail: string }[];
};

export const DELIVERABILITY_BEST_PRACTICES: BestPracticeSection[] = [
  {
    id: "domain",
    title: "Reputazione del dominio",
    description: "Gmail e Outlook decidono dove finisce la tua email in base a chi sei, non solo a cosa scrivi.",
    tips: [
      { label: "Usa un dominio dedicato", detail: "Manda outreach da un sotto-dominio (es. mail.tuobrand.it), così se un giorno c'è un problema non rovini il dominio principale." },
      { label: "SPF, DKIM, DMARC attivi", detail: "Sono i 3 record DNS che dicono ai provider \"questa email è autentica\". Senza, vai dritto in spam." },
      { label: "Riscalda il dominio", detail: "Se è nuovo, parti con 20-30 email/giorno e cresci gradualmente. Mai 500 email il primo giorno." },
    ],
  },
  {
    id: "content",
    title: "Contenuto che converte e non finisce in spam",
    description: "Le persone aprono per il soggetto, rispondono per il corpo. I filtri leggono entrambi.",
    tips: [
      { label: "Soggetto 30-50 caratteri", detail: "Personale, mai promozionale. Esempio buono: \"Una nota su Pizzeria Da Luigi\"." },
      { label: "Niente parole trigger", detail: "Evita: gratis, garantito, 100%, click qui, offerta limitata. I filtri li conoscono benissimo." },
      { label: "Massimo 2 link", detail: "Più link = più sospetto. Una sola CTA primaria converte di più." },
      { label: "Sempre testo + HTML", detail: "Manda entrambe le versioni: alcuni client mostrano solo testo, ed è un segnale di legittimità." },
    ],
  },
  {
    id: "behavior",
    title: "Comportamento di invio",
    description: "Non basta un'email perfetta — anche come la mandi conta.",
    tips: [
      { label: "Personalizza ogni email", detail: "Almeno 2 dettagli reali (nome attività, città, dato pubblico). Le email \"copia-incolla\" si vedono." },
      { label: "Distanzia gli invii", detail: "Mai 100 email in 5 minuti. Spalma su 1-2 ore, sembri un essere umano." },
      { label: "Pulisci la lista", detail: "Rimuovi indirizzi che bouncano, non rispondono mai e quelli che ti chiedono di smettere. La pulizia migliora il tasso di consegna." },
      { label: "Misura le risposte", detail: "Una buona campagna B2B ha 8-15% di reply. Sotto il 3% c'è qualcosa che non va." },
    ],
  },
  {
    id: "compliance",
    title: "Conformità & opt-out",
    description: "Il GDPR italiano richiede legittimo interesse + opt-out facile. Anche un \"rispondi STOP\" è sufficiente.",
    tips: [
      { label: "Identifica chi sei", detail: "Nome reale + azienda + recapito. Niente mittenti generici tipo \"Team Sales\"." },
      { label: "Spiega perché scrivi", detail: "Una riga: \"la tua attività è pubblicata online e ho preparato qualcosa\". Trasparenza = fiducia." },
      { label: "Opt-out in chiaro", detail: "Una riga finale tipo \"se non vuoi più sentirmi, basta rispondere stop\" è semplice e sufficiente." },
      { label: "Rispetta lo stop", detail: "Quando uno chiede di non ricevere più, mettilo in blacklist subito. Costa meno di una multa." },
    ],
  },
];
