// DemoSalesAgent — Professional AI consultant with live phone call & scroll-aware narration
import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, X, Pause, Play, MessageCircle, Send, Mic, MicOff, Square, ChevronDown, Eye, Phone, PhoneOff } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useConversation } from "@elevenlabs/react";
import { supabase } from "@/integrations/supabase/client";
import { claimVoiceAgent, releaseVoiceAgent } from "@/lib/voice-agent-mutex";

const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-tts`;
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-voice-agent`;

type Msg = { role: "user" | "assistant"; content: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

// ── Industry display names (Italian) ──
const INDUSTRY_NAMES: Record<string, string> = {
  food: "Ristorazione",
  ncc: "NCC & Trasporto Premium",
  beauty: "Beauty & Wellness",
  healthcare: "Sanità & Studi Medici",
  fitness: "Fitness & Sport",
  hotel: "Hospitality & Hotel",
  hospitality: "Strutture Ricettive",
  beach: "Stabilimenti Balneari",
  retail: "Retail & Negozi",
  plumber: "Idraulica & Impiantistica",
  electrician: "Elettricisti & Tecnici",
  bakery: "Pasticceria & Panificazione",
  construction: "Edilizia & Costruzioni",
  veterinary: "Veterinaria",
  tattoo: "Tatuaggio & Piercing",
  cleaning: "Imprese di Pulizie",
  legal: "Studi Legali",
  accounting: "Commercialisti",
  garage: "Autofficine",
  photography: "Fotografia & Video",
  gardening: "Giardinaggio & Verde",
  childcare: "Asili & Baby-sitting",
  education: "Formazione & Corsi",
  events: "Organizzazione Eventi",
  logistics: "Trasporti & Logistica",
};

const getIndustryName = (industry: string): string =>
  INDUSTRY_NAMES[industry] || industry.charAt(0).toUpperCase() + industry.slice(1);

// ── Scroll-aware section narrations per sector ──
interface ScrollSection {
  selector: string;
  label: string;
  pitch: string;
}

const SCROLL_SECTIONS: Record<string, ScrollSection[]> = {
  default: [
    { selector: "hero", label: "🏠 Panoramica", pitch: "Quello che stai osservando è una demo live della piattaforma Empire per il tuo settore. Non è un template statico — è un ecosistema completo con oltre duecento funzionalità integrate che automatizzano prenotazioni, marketing, CRM, pagamenti e comunicazione clienti. Tutto personalizzato per la tua attività specifica." },
    { selector: "menu,catalogo,servizi,services", label: "📋 Servizi", pitch: "Ogni servizio è gestito dall'intelligenza artificiale. Traduzione automatica in otto lingue, foto professionali generate dall'IA, prezzi dinamici. Il sistema si adatta automaticamente al tuo mercato e ai tuoi clienti." },
    { selector: "prenot,booking,reservation,agenda", label: "📅 Prenotazioni", pitch: "Le prenotazioni funzionano ventiquattro ore su ventiquattro. Reminder automatici via WhatsApp, gestione cancellazioni, lista d'attesa intelligente. I nostri clienti hanno eliminato il cento per cento dei no-show nelle prime due settimane." },
    { selector: "review,recens,testimoni", label: "⭐ Reputazione", pitch: "Review Shield è la nostra tecnologia proprietaria. Intercetta le recensioni negative prima che raggiungano Google, le trasforma in feedback privato gestibile. La tua media online resta protetta. Nessun competitor offre questa funzionalità." },
    { selector: "contact,contatt,cta", label: "📞 Comunicazione", pitch: "Il Concierge IA risponde ai tuoi clienti in tempo reale, ventiquattro ore su ventiquattro. Qualifica lead, genera preventivi, fissa appuntamenti — anche alle tre di notte. Un nostro cliente ha generato duecentoventi euro di fatturato extra mentre dormiva." },
    { selector: "about,chi-siamo,storia", label: "ℹ️ Identità", pitch: "La sezione Chi Siamo si aggiorna automaticamente con statistiche reali. Ogni settimana il tuo sito diventa più persuasivo senza che tu debba intervenire." },
    { selector: "gallery,foto,portfolio", label: "📸 Gallery", pitch: "Le immagini professionali possono essere generate dall'IA in sessanta secondi. Catalogo fotografico da rivista, ottimizzato per social e sito, senza bisogno di fotografi." },
    { selector: "faq,domand", label: "❓ FAQ", pitch: "Le FAQ si aggiornano automaticamente in base alle domande più frequenti dei tuoi clienti. E se qualcuno chiede qualcosa di nuovo, il Concierge IA risponde immediatamente." },
    { selector: "price,prezz,tariff,listino", label: "💰 Prezzi", pitch: "I prezzi possono essere dinamici. L'IA li ottimizza in base alla domanda, al giorno della settimana, alla stagione. Revenue management intelligente che massimizza il fatturato automaticamente." },
    { selector: "footer,social", label: "🔗 Conclusione", pitch: "Hai visto solo la superficie. Dietro questo sito ci sono CRM avanzato, fatturazione elettronica, marketing automatico, analytics predittivi, gestione staff, inventario IA. Duecento funzionalità, configurabili in ventiquattro ore." },
  ],
  food: [
    { selector: "hero", label: "🏠 Panoramica", pitch: "Questa è una demo live della piattaforma Empire per la ristorazione. Menu digitale QR in otto lingue, ordini al tavolo, Kitchen Display, Review Shield, fidelizzazione, marketing automatico — tutto integrato in un unico sistema configurabile in ventiquattro ore." },
    { selector: "menu,piatt,dish", label: "🍽️ Menu Digitale", pitch: "Il menu si traduce automaticamente in otto lingue. L'IA genera descrizioni dei piatti, suggerisce abbinamenti vino, calcola allergeni. L'upselling intelligente aumenta lo scontrino medio del venticinque per cento: il cliente ordina la carbonara e il sistema suggerisce un calice di Pecorino di Amatrice." },
    { selector: "order,ordin,carrell,cart", label: "📋 Ordini", pitch: "Il cliente ordina dal QR al tavolo, l'ordine arriva diretto in cucina sul Kitchen Display. Zero errori, zero attese. In una serata piena, il sistema gestisce centoventi ordini senza un singolo errore. E paghi solo il due per cento — non il trenta per cento delle piattaforme di delivery." },
    { selector: "review,recens", label: "⭐ Review Shield", pitch: "Review Shield intercetta le recensioni negative prima che raggiungano Google. Il cliente scrive una recensione da due stelle? Tu la gestisci privatamente, risolvi il problema, e la tua media resta intatta. Una funzionalità che da sola giustifica l'intero investimento." },
    { selector: "prenot,reserv,tavol", label: "📅 Prenotazioni", pitch: "Prenotazioni ventiquattro ore su ventiquattro con conferma automatica WhatsApp. L'IA monitora i clienti abituali: se qualcuno non torna da venticinque giorni, riceve un messaggio personalizzato con un'offerta sul suo piatto preferito. Risultato: quattro coperti invece di uno." },
    { selector: "contact,contatt", label: "📞 Concierge", pitch: "Il Concierge IA gestisce le richieste dei clienti a qualsiasi ora. Un cliente vuole prenotare alle ventitré? Il sistema verifica disponibilità, conferma via WhatsApp, manda il reminder. Tu trovi tutto pronto al mattino." },
    { selector: "about,chi-siamo,storia", label: "ℹ️ La Storia", pitch: "Questa sezione si aggiorna automaticamente con statistiche reali: piatti serviti, clienti soddisfatti, anni di attività. Ogni dato costruisce fiducia e credibilità." },
    { selector: "gallery,foto", label: "📸 Gallery", pitch: "L'IA genera foto professionali dei tuoi piatti in sessanta secondi. Qualità da rivista Michelin, senza bisogno di un fotografo professionista." },
    { selector: "footer,social,faq", label: "🔗 Conclusione", pitch: "Dietro questa interfaccia ci sono Kitchen Display, gestione staff con PIN, HACCP digitale, inventario IA, fatturazione SDI, analytics predittivi. Tutto configurato su misura in ventiquattro ore." },
  ],
  ncc: [
    { selector: "hero", label: "🏠 Panoramica", pitch: "Questa è una demo della piattaforma Empire per il settore NCC. Gestione flotta, prenotazioni real-time, assegnazione autisti, CRM clienti VIP, tariffario dinamico, scadenzario documenti — un ecosistema completo per il trasporto premium." },
    { selector: "fleet,flotta,veicol,vehicle", label: "🚘 Flotta", pitch: "Ogni veicolo della flotta è monitorato dall'IA. Scadenze assicurazione, revisione, tagliando — notifica automatica quindici giorni prima. Un nostro cliente ha evitato tremila euro di sanzioni in sei mesi grazie a questa funzionalità." },
    { selector: "route,tratt,destin,tour", label: "🗺️ Tratte", pitch: "Matrice prezzi automatica per ogni tratta. Il cross-selling intelligente suggerisce servizi aggiuntivi: il turista prenota Napoli-Positano e il sistema propone il tour in barca a Capri — trecentocinquanta euro extra al carrello, automaticamente." },
    { selector: "book,prenot,reserv", label: "📅 Prenotazioni", pitch: "Un concierge d'hotel chiama per un transfer urgente mentre tu sei in viaggio. Il sistema accetta la prenotazione, assegna l'autista più vicino, il cliente riceve conferma con dettagli del veicolo. Tu ricevi solo la notifica: nuova corsa confermata." },
    { selector: "review,recens", label: "⭐ Reputazione", pitch: "Nel settore NCC le recensioni sono fondamentali. Review Shield protegge la tua reputazione intercettando i feedback negativi prima che diventino pubblici." },
    { selector: "contact,contatt,cta", label: "📞 Concierge", pitch: "Il Concierge IA premium risponde in otto lingue. Un turista scrive alle due di notte? Il sistema risponde, verifica disponibilità, genera preventivo e invia conferma automaticamente." },
    { selector: "footer,faq", label: "🔗 Conclusione", pitch: "GPS live fleet map, dispatch autisti, fatturazione B2B, scadenzario intelligente, analytics completi. Tutto personalizzato per la tua attività NCC." },
  ],
  beauty: [
    { selector: "hero", label: "🏠 Panoramica", pitch: "Questa è una demo della piattaforma Empire per il settore beauty. Agenda multi-operatore, prenotazioni ventiquattro ore su ventiquattro, anti no-show, schede cliente personalizzate, fidelizzazione e marketing IA." },
    { selector: "serviz,tratament,service", label: "💅 Servizi", pitch: "Ogni trattamento è prenotabile online con descrizione, durata, prezzo e foto. La cliente sceglie, prenota e paga in un tap. L'agenda si aggiorna in tempo reale per ogni operatore." },
    { selector: "book,prenot,agenda", label: "📅 Prenotazioni", pitch: "Reminder automatici WhatsApp ventiquattro e due ore prima dell'appuntamento. Se la cliente non conferma, lo slot viene proposto alla lista d'attesa. I nostri clienti hanno eliminato il cento per cento dei no-show." },
    { selector: "review,recens", label: "⭐ Reputazione", pitch: "Review Shield protegge la tua reputazione. Una cliente insoddisfatta? Gestisci il feedback privatamente, risolvi il problema, offri un trattamento omaggio. La recensione negativa non diventa mai pubblica." },
    { selector: "gallery,foto,portfolio", label: "📸 Portfolio", pitch: "Portfolio professionale aggiornato dall'IA. Foto prima e dopo, tendenze, stili più richiesti. Le clienti sfogliano, si ispirano e prenotano direttamente." },
    { selector: "contact,contatt", label: "📞 Fidelizzazione", pitch: "L'IA monitora le clienti: se qualcuna non torna da quarantacinque giorni, riceve un'offerta personalizzata. Il compleanno di una cliente top? Auguri automatici con un trattamento in omaggio." },
    { selector: "footer,faq", label: "🔗 Conclusione", pitch: "CRM avanzato, wallet fedeltà, marketing automation WhatsApp, analytics, fatturazione. Tutto integrato per far crescere il tuo salone." },
  ],
  healthcare: [
    { selector: "hero", label: "🏠 Panoramica", pitch: "Questa è una demo della piattaforma Empire per studi medici. Agenda pazienti, cartelle digitali GDPR compliant, telemedicina, promemoria automatici, fatturazione TSE integrata." },
    { selector: "serviz,service,special", label: "🏥 Specialità", pitch: "Ogni specializzazione con la sua logica: follow-up post-visita automatici, prescrizioni digitali, richiami vaccinali. L'IA programma automaticamente i ricontrolli." },
    { selector: "book,prenot,agenda", label: "📅 Appuntamenti", pitch: "Reminder automatici SMS e WhatsApp. Se il paziente non conferma, lo slot viene liberato. L'IA gestisce efficacemente quaranta pazienti a settimana, senza errori." },
    { selector: "contact,contatt", label: "📞 Triage IA", pitch: "Un paziente chiama alle ventidue? Il Concierge IA risponde, effettua un triage iniziale, prenota la visita urgente. Tu trovi il riassunto completo al mattino." },
    { selector: "footer,faq", label: "🔗 Conclusione", pitch: "Cartelle digitali, fatturazione TSE, follow-up automatici, comunicazioni ai pazienti — tutto integrato e conforme GDPR." },
  ],
  fitness: [
    { selector: "hero", label: "🏠 Panoramica", pitch: "Questa è una demo della piattaforma Empire per il fitness. Abbonamenti, prenotazione corsi, check-in QR, schede allenamento, pagamenti ricorrenti — tutto integrato." },
    { selector: "cors,class,lesson", label: "🏋️ Corsi", pitch: "Prenotazione online con posti in tempo reale, lista d'attesa automatica. Un membro cancella? Il primo in lista viene notificato immediatamente." },
    { selector: "book,prenot,member", label: "📅 Membership", pitch: "L'IA monitora i membri inattivi e li riconquista con messaggi personalizzati. Il tasso di rinnovo dei nostri clienti fitness è salito all'ottantasette per cento." },
    { selector: "footer,faq,contact", label: "🔗 Conclusione", pitch: "Check-in QR, analytics retention, pagamenti ricorrenti, schede personalizzate. Tutto incluso nella piattaforma." },
  ],
  hotel: [
    { selector: "hero", label: "🏠 Panoramica", pitch: "Questa è una demo della piattaforma Empire per l'hospitality. Prenotazioni dirette, concierge IA ventiquattro ore su ventiquattro, upselling automatico, housekeeping digitale." },
    { selector: "room,camer,suite", label: "🛏️ Camere", pitch: "Prenotazioni dirette con solo il due per cento di commissione, invece del diciotto di Booking. Su cento notti a centocinquanta euro, il risparmio è di ventiquattromila euro l'anno." },
    { selector: "book,prenot,reserv", label: "📅 Prenotazioni", pitch: "Check-in digitale, upselling automatico notturno. Un ospite guarda il menu in camera alle ventitré? L'IA suggerisce l'upgrade colazione con champagne." },
    { selector: "footer,faq,contact", label: "🔗 Conclusione", pitch: "Concierge IA multilingue, housekeeping digitale, analytics occupancy, revenue management. Tutto personalizzato per la tua struttura." },
  ],
  hospitality: [
    { selector: "hero", label: "🏠 Panoramica", pitch: "Prenotazioni dirette, concierge IA, upselling notturno, housekeeping — la tua struttura ricettiva diventa premium e risparmia migliaia in commissioni OTA." },
    { selector: "footer,faq,contact", label: "🔗 Conclusione", pitch: "Risparmio medio di ventiquattromila euro l'anno passando dalle OTA alle prenotazioni dirette." },
  ],
  beach: [
    { selector: "hero", label: "🏠 Panoramica", pitch: "Questa è una demo della piattaforma Empire per stabilimenti balneari. Mappa interattiva ombrelloni, prenotazioni online, abbonamenti stagionali, gestione bar, push notification." },
    { selector: "map,mapp,spot,ombrellon", label: "🏖️ Mappa", pitch: "Ogni ombrellone prenotabile online con prezzi dinamici. Lunedì con occupazione bassa? L'IA lancia una push notification con offerta speciale. Risultato: occupazione raddoppiata." },
    { selector: "book,prenot,reserv", label: "📅 Prenotazioni", pitch: "Il cliente sdraiato sotto l'ombrellone ordina dall'app — un Aperol Spritz, il barista lo porta. Esperienza premium, incasso maggiore." },
    { selector: "footer,faq,contact", label: "🔗 Conclusione", pitch: "Abbonamenti stagionali, pass giornalieri, gestione bar, fedeltà. Tutto automatizzato e premium." },
  ],
  retail: [
    { selector: "hero", label: "🏠 Panoramica", pitch: "Questa è una demo della piattaforma Empire per il retail. Catalogo digitale, e-commerce, inventario con barcode, CRM clienti, loyalty wallet, marketing automatico." },
    { selector: "product,prodott,catalog", label: "🛍️ Catalogo", pitch: "L'IA monitora le scorte in tempo reale. Alert automatico quando un prodotto bestseller sta finendo, suggerimento di riordino con un click." },
    { selector: "contact,contatt,cta", label: "📞 Fidelizzazione", pitch: "Programma fedeltà automatico. Una cliente raggiunge cinquecento punti? Riceve un buono da venticinque euro. Torna entro la settimana." },
    { selector: "footer,faq", label: "🔗 Conclusione", pitch: "Inventario IA, loyalty wallet, marketing automation, e-commerce integrato, analytics predittivi. Tutto in un'unica piattaforma." },
  ],
  plumber: [
    { selector: "hero", label: "🏠 Panoramica", pitch: "Questa è una demo della piattaforma Empire per artigiani e impiantisti. Gestione interventi, preventivi digitali, schede cliente, calendario condiviso, GPS dispatch." },
    { selector: "serviz,service,intervent", label: "🔧 Interventi", pitch: "Emergenza alle tre di notte? Il cliente apre l'app, descrive il problema, l'IA Concierge risponde immediatamente con le istruzioni di emergenza e genera un preventivo automatico per l'intervento del mattino." },
    { selector: "contact,contatt,cta", label: "📞 Pianificazione", pitch: "L'IA ottimizza la giornata: cinque interventi organizzati per percorso, risparmio di due ore al giorno. Quarantaquattro ore al mese di tempo recuperato." },
    { selector: "footer,faq", label: "🔗 Conclusione", pitch: "Preventivi con firma digitale, foto prima e dopo, fatturazione elettronica, CRM clienti, reminder manutenzioni programmate." },
  ],
  bakery: [
    { selector: "hero", label: "🏠 Panoramica", pitch: "Questa è una demo della piattaforma Empire per pasticcerie e panifici. Ordini online, prenotazione torte personalizzate, upselling intelligente, fidelizzazione automatica." },
    { selector: "menu,prodott,catalog", label: "🧁 Prodotti", pitch: "L'IA suggerisce abbinamenti automatici: un cliente ordina il tiramisù? Il sistema propone un caffè specialty. Upselling che aumenta lo scontrino medio del venticinque per cento." },
    { selector: "footer,faq,contact", label: "🔗 Conclusione", pitch: "Ordini anticipati, fidelizzazione IA, catalogo professionale, marketing automatico. Tutto per trasformare la tua pasticceria in un'esperienza premium." },
  ],
};

const getScrollSections = (industry: string): ScrollSection[] =>
  SCROLL_SECTIONS[industry] || SCROLL_SECTIONS.default;

// Opening pitches — professional, authoritative, sector-specific
const getOpeningPitch = (industry: string): string => {
  const name = getIndustryName(industry);
  const specific = OPENING_PITCHES[industry];
  if (specific) return specific;
  return `Benvenuto. Stai esplorando una demo live della piattaforma Empire per il settore ${name}. Quello che vedi è solo la superficie — dietro questa interfaccia ci sono oltre duecento funzionalità integrate che automatizzano ogni aspetto della tua attività. Dal CRM alla fatturazione, dalle prenotazioni al marketing IA. In tre mesi i nostri clienti hanno registrato un incremento medio del trentadue per cento del fatturato. Scorri il sito — ti illustro ogni sezione nel dettaglio.`;
};

const OPENING_PITCHES: Record<string, string> = {
  food: "Benvenuto. Stai esplorando una demo live di Empire per la ristorazione. Dietro questo sito c'è un sistema che ha trasformato centinaia di ristoranti in tutta Italia. Il menu si traduce automaticamente in otto lingue, Review Shield protegge la tua reputazione online da ogni recensione negativa, e il Concierge IA genera fatturato anche a locale chiuso. Scorri e ti illustro ogni funzionalità nel dettaglio.",
  ncc: "Benvenuto. Stai esplorando una demo live di Empire per il settore NCC. Una piattaforma che gestisce flotte intere: scadenzario documenti con notifiche automatiche, prenotazioni in tempo reale con assegnazione autisti intelligente, e cross-selling che genera ricavi extra senza intervento umano. Scorri e ti mostro come funziona nel concreto.",
  beauty: "Benvenuto. Stai esplorando una demo live di Empire per il settore beauty e wellness. Il sistema ha permesso ai nostri saloni di eliminare il cento per cento dei no-show, riconquistare clienti inattive con offerte personalizzate, e proteggere la reputazione online con Review Shield. Scorri e ti illustro ogni funzionalità.",
  healthcare: "Benvenuto. Stai esplorando una demo live di Empire per studi medici e strutture sanitarie. Gestione pazienti completa con cartelle digitali GDPR compliant, follow-up automatici, triage IA notturno, fatturazione TSE integrata. Scorri e ti mostro come ogni sezione risolve problemi concreti del tuo studio.",
  fitness: "Benvenuto. Stai esplorando una demo live di Empire per il settore fitness e sport. Il tasso di rinnovo abbonamenti dei nostri clienti è salito all'ottantasette per cento grazie al monitoraggio IA dei membri inattivi. Check-in QR, prenotazione corsi in tempo reale, pagamenti ricorrenti. Scorri per scoprire tutto.",
  hotel: "Benvenuto. Stai esplorando una demo live di Empire per l'hospitality. Un dato significativo: i nostri clienti hotel risparmiano mediamente ventiquattromila euro l'anno passando dalle commissioni OTA alle prenotazioni dirette. Concierge IA multilingue, upselling automatico, housekeeping digitale. Scorri e ti mostro i dettagli.",
  hospitality: "Benvenuto. Stai esplorando una demo live di Empire per strutture ricettive. Prenotazioni dirette con commissioni ridotte al due per cento, concierge IA ventiquattro ore su ventiquattro, upselling automatico notturno. Scorri per approfondire.",
  beach: "Benvenuto. Stai esplorando una demo live di Empire per stabilimenti balneari. Mappa interattiva ombrelloni, prenotazioni online, push notification per riempire le giornate morte, ordini bar dall'ombrellone. Scorri e ti mostro come funziona.",
  retail: "Benvenuto. Stai esplorando una demo live di Empire per il settore retail. Inventario IA con alert scorte, programma fedeltà automatico, catalogo digitale con e-commerce integrato. Scorri e ti illustro ogni funzionalità.",
  plumber: "Benvenuto. Stai esplorando una demo live di Empire per artigiani e impiantisti. Gestione interventi con preventivi digitali, Concierge IA che risponde alle emergenze notturne, ottimizzazione percorsi che ti fa risparmiare due ore al giorno. Scorri e ti mostro come funziona.",
  bakery: "Benvenuto. Stai esplorando una demo live di Empire per pasticcerie e panifici. Ordini online anticipati, upselling intelligente che aumenta lo scontrino del venticinque per cento, fidelizzazione IA automatica. Scorri e ti mostro ogni dettaglio.",
};

// Web Speech API fallback TTS
function speakWithBrowserTTS(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(false); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "it-IT";
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const itVoice = voices.find(v => v.lang.startsWith("it")) || voices[0];
    if (itVoice) utterance.voice = itVoice;
    utterance.onend = () => resolve(true);
    utterance.onerror = () => resolve(false);
    window.speechSynthesis.speak(utterance);
  });
}

// TTS with ElevenLabs + browser fallback
async function speakText(
  text: string,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  abortRef: React.MutableRefObject<boolean>,
): Promise<boolean> {
  if (abortRef.current) return false;
  try {
    const resp = await fetch(TTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ text }),
    });
    if (!resp.ok || abortRef.current) {
      if (!abortRef.current) return speakWithBrowserTTS(text);
      return false;
    }
    const data = await resp.json();
    const audioContent = data?.audioContent;
    if (!audioContent || abortRef.current) {
      if (!abortRef.current) return speakWithBrowserTTS(text);
      return false;
    }
    return await new Promise<boolean>((resolve) => {
      const audio = new Audio(`data:audio/mpeg;base64,${audioContent}`);
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = audio;
      audio.onended = () => resolve(true);
      audio.onerror = () => { speakWithBrowserTTS(text).then(resolve); };
      audio.play().catch(() => { speakWithBrowserTTS(text).then(resolve); });
    });
  } catch {
    if (!abortRef.current) return speakWithBrowserTTS(text);
    return false;
  }
}

// Chat stream
async function streamChat({
  messages, onDelta, onDone, industry,
}: {
  messages: Msg[]; onDelta: (t: string) => void; onDone: () => void; industry: string;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, mode: "demo-sales", sectionId: industry }),
  });
  if (!resp.ok || !resp.body) throw new Error("Stream failed");
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { onDone(); return; }
      try {
        const c = JSON.parse(json).choices?.[0]?.delta?.content;
        if (c) onDelta(c);
      } catch { buf = line + "\n" + buf; break; }
    }
  }
  onDone();
}

// ── Detect which section is currently visible ──
function detectVisibleSection(sections: ScrollSection[]): ScrollSection | null {
  const allSections = document.querySelectorAll("section, [data-section], [id]");
  for (const section of sections) {
    const keywords = section.selector.split(",").map(s => s.trim().toLowerCase());
    for (const el of allSections) {
      const id = (el.id || "").toLowerCase();
      const dataSection = el.getAttribute("data-section")?.toLowerCase() || "";
      const rawClass = el.className;
      const className = (typeof rawClass === "string" ? rawClass : (rawClass as unknown as {baseVal?: string})?.baseVal || "").toLowerCase();
      const textContent = el.textContent?.slice(0, 200).toLowerCase() || "";
      
      for (const kw of keywords) {
        if (id.includes(kw) || dataSection.includes(kw) || className.includes(kw) || textContent.includes(kw)) {
          const rect = el.getBoundingClientRect();
          const inView = rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.2;
          if (inView) return section;
        }
      }
    }
  }
  return null;
}

interface DemoSalesAgentProps {
  industry: string;
  companyName: string;
  accentColor?: string;
}

const DemoSalesAgent: React.FC<DemoSalesAgentProps> = ({ industry, companyName, accentColor = "#C9A84C" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  // Scroll-aware state
  const [currentSection, setCurrentSection] = useState<ScrollSection | null>(null);
  const [narratedSections, setNarratedSections] = useState<Set<string>>(new Set());
  const [scrollNarrationActive, setScrollNarrationActive] = useState(true);
  const [narrationQueue, setNarrationQueue] = useState<string[]>([]);

  // ElevenLabs ConvAI states
  const [callActive, setCallActive] = useState(false);
  const [callConnecting, setCallConnecting] = useState(false);
  const [elevenlabsAvailable, setElevenlabsAvailable] = useState<boolean | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<InstanceType<NonNullable<typeof SpeechRecognition>> | null>(null);
  const messagesRef = useRef<Msg[]>([]);
  const isSpeakingRef = useRef(false);
  const scrollNarrationRef = useRef(true);
  const ringToneRef = useRef<{ ctx: AudioContext; intervalId: ReturnType<typeof setInterval> } | null>(null);

  const sections = getScrollSections(industry);
  const openingPitch = getOpeningPitch(industry);
  const industryName = getIndustryName(industry);

  // ElevenLabs ConvAI hook
  const conversation = useConversation({
    onConnect: () => {
      setCallActive(true);
      setCallConnecting(false);
      stopRingTone();
      setMessages(prev => [...prev, { role: "assistant", content: `📞 Consulente Empire in linea — settore ${industryName}. Parlami pure, ti ascolto...` }]);
    },
    onDisconnect: () => {
      setCallActive(false);
      setCallConnecting(false);
    },
    onMessage: (message: any) => {
      if (message?.type === "user_transcript") {
        const text = message?.user_transcription_event?.user_transcript;
        if (text) setMessages(prev => [...prev, { role: "user", content: text }]);
      } else if (message?.type === "agent_response") {
        const text = message?.agent_response_event?.agent_response;
        if (text) setMessages(prev => [...prev, { role: "assistant", content: text }]);
      }
    },
    onError: () => {
      setElevenlabsAvailable(false);
      setCallActive(false);
      setCallConnecting(false);
      stopRingTone();
    },
  });

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);
  useEffect(() => { scrollNarrationRef.current = scrollNarrationActive; }, [scrollNarrationActive]);

  // ── Stop all other voice agents on mount via mutex ──
  useEffect(() => {
    if ((window as any).__empireVoiceAgentStopAll) {
      (window as any).__empireVoiceAgentStopAll();
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      abortRef.current = true;
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      stopRingTone();
      try { conversation.endSession(); } catch { /* noop */ }
    };
  }, []);

  // Check ElevenLabs availability
  useEffect(() => {
    if (elevenlabsAvailable !== null) return;
    let mounted = true;
    const timer = setTimeout(async () => {
      try {
        const { data, error } = await supabase.functions.invoke("elevenlabs-conversation-token", { body: {} });
        if (!mounted) return;
        setElevenlabsAvailable(!error && !!data?.token);
      } catch {
        if (mounted) setElevenlabsAvailable(false);
      }
    }, 1500);
    return () => { mounted = false; clearTimeout(timer); };
  }, [elevenlabsAvailable]);

  // Show after 2s
  useEffect(() => {
    if (dismissed) return;
    const t = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(t);
  }, [dismissed]);

  // Auto-start opening narration after 3s
  useEffect(() => {
    if (dismissed || hasStarted) return;
    const t = setTimeout(() => {
      setHasStarted(true);
      setNarrationQueue([openingPitch]);
    }, 3000);
    return () => clearTimeout(t);
  }, [dismissed, hasStarted, openingPitch]);

  // Process narration queue
  useEffect(() => {
    if (narrationQueue.length === 0 || isSpeakingRef.current || abortRef.current || callActive) return;
    const text = narrationQueue[0];
    
    const speak = async () => {
      abortRef.current = false;
      setIsSpeaking(true);
      await speakText(text, audioRef, abortRef);
      if (!abortRef.current) {
        setIsSpeaking(false);
        setNarrationQueue(prev => prev.slice(1));
        const section = sections.find(s => s.pitch === text);
        if (section) {
          setNarratedSections(prev => new Set([...prev, section.selector]));
        }
      }
    };
    speak();
  }, [narrationQueue, sections, callActive]);

  // Scroll detection
  useEffect(() => {
    if (dismissed) return;
    let lastSection: string | null = null;
    
    const onScroll = () => {
      if (!scrollNarrationRef.current || isSpeakingRef.current || chatMode || callActive) return;
      
      const visible = detectVisibleSection(sections);
      if (visible && visible.selector !== lastSection) {
        lastSection = visible.selector;
        setCurrentSection(visible);
        
        setNarratedSections(prev => {
          if (!prev.has(visible.selector) && !isSpeakingRef.current) {
            setNarrationQueue(q => [...q, visible.pitch]);
            return new Set([...prev, visible.selector]);
          }
          return prev;
        });
      }
    };
    
    let timeout: ReturnType<typeof setTimeout>;
    const debouncedScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(onScroll, 800);
    };
    
    window.addEventListener("scroll", debouncedScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", debouncedScroll);
      clearTimeout(timeout);
    };
  }, [dismissed, sections, chatMode, callActive]);

  // Load voices
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // ── Realistic Italian phone ring tone ──
  const playRingTone = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const playBurst = () => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.value = 425;
        osc2.type = "sine";
        osc2.frequency.value = 350;
        gain.gain.value = 0;
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
        gain.gain.setValueAtTime(0.1, now + 0.9);
        gain.gain.linearRampToValueAtTime(0, now + 1.0);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.1);
        osc2.stop(now + 1.1);
      };
      playBurst();
      const intervalId = setInterval(playBurst, 2000);
      ringToneRef.current = { ctx, intervalId };
      setTimeout(() => stopRingTone(), 6000);
    } catch { /* noop */ }
  }, []);

  const stopRingTone = useCallback(() => {
    if (ringToneRef.current) {
      try {
        clearInterval(ringToneRef.current.intervalId);
        ringToneRef.current.ctx.close();
      } catch { /* noop */ }
      ringToneRef.current = null;
    }
  }, []);

  const stopAll = useCallback(() => {
    abortRef.current = true;
    audioRef.current?.pause();
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setIsListening(false);
    setLiveTranscript("");
    setNarrationQueue([]);
  }, []);

  // Register with global mutex after stopAll is defined
  useEffect(() => {
    claimVoiceAgent("demo-sales", stopAll);
    return () => { releaseVoiceAgent("demo-sales"); };
  }, [stopAll]);

  const togglePause = useCallback(() => {
    if (!audioRef.current) return;
    if (isPaused) {
      audioRef.current.play();
      setIsPaused(false);
    } else {
      audioRef.current.pause();
      setIsPaused(true);
    }
  }, [isPaused]);

  const handleDismiss = useCallback(() => {
    stopAll();
    stopRingTone();
    if (callActive) { try { conversation.endSession(); } catch { /* noop */ } }
    setDismissed(true);
    setIsVisible(false);
    setIsOpen(false);
  }, [stopAll, stopRingTone, callActive, conversation]);

  // ── Phone call action ──
  const handleCallAction = useCallback(async () => {
    if (callActive) {
      try { await conversation.endSession(); } catch { /* noop */ }
      setCallActive(false);
      stopRingTone();
      return;
    }

    // Stop narration, start ring
    stopAll();
    abortRef.current = false;
    setScrollNarrationActive(false);
    playRingTone();
    setMessages(prev => [...prev, { role: "assistant", content: `📞 Sto collegando il consulente Empire per ${industryName}...` }]);
    setIsOpen(true);
    setCallConnecting(true);

    // Try ElevenLabs ConvAI
    if (elevenlabsAvailable !== false) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const { data, error } = await supabase.functions.invoke("elevenlabs-conversation-token", { body: {} });
        if (!error && data?.token) {
          await conversation.startSession({
            conversationToken: data.token,
            connectionType: "webrtc",
          });
          return; // onConnect callback handles the rest
        }
      } catch { /* fallthrough */ }
    }

    // Fallback to legacy
    stopRingTone();
    setCallConnecting(false);
    if (SpeechRecognition) {
      setMessages(prev => [...prev, { role: "assistant", content: `📞 Consulente Empire in linea — settore ${industryName}. Parlami pure! 🎙️` }]);
      setChatMode(true);
      setTimeout(() => startListening(), 500);
    } else {
      setMessages(prev => [...prev, { role: "assistant", content: `Ciao! Sono il consulente Empire per ${industryName}. Scrivi la tua domanda qui sotto 💬` }]);
      setChatMode(true);
    }
  }, [callActive, conversation, stopAll, playRingTone, stopRingTone, elevenlabsAvailable, industryName]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    stopAll();
    abortRef.current = false;
    setScrollNarrationActive(false);

    const userMsg: Msg = { role: "user", content: text.trim() };
    const allMessages = [...messagesRef.current, userMsg];
    setMessages(allMessages);
    setInputText("");
    setIsLoading(true);

    if (!chatMode) setChatMode(true);

    let full = "";
    const upsert = (chunk: string) => {
      full += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: full } : m);
        }
        return [...prev, { role: "assistant", content: full }];
      });
    };

    try {
      await streamChat({
        messages: allMessages,
        industry,
        onDelta: upsert,
        onDone: () => {
          setIsLoading(false);
          if (voiceEnabled && full.length > 0 && full.length < 2000 && !abortRef.current) {
            setIsSpeaking(true);
            speakText(full, audioRef, abortRef).then(() => {
              if (!abortRef.current) setIsSpeaking(false);
            });
          }
        },
      });
    } catch {
      setIsLoading(false);
      setMessages(prev => [...prev, { role: "assistant", content: "Mi scuso, c'è stato un problema. Riprova tra un momento." }]);
    }
  }, [isLoading, industry, chatMode, voiceEnabled, stopAll]);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) return;
    stopAll();
    abortRef.current = false;
    setScrollNarrationActive(false);

    const recognition = new SpeechRecognition();
    recognition.lang = "it-IT";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setLiveTranscript(interim);
      if (final) {
        setLiveTranscript("");
        setIsListening(false);
        sendMessage(final);
      }
    };
    recognition.onerror = () => { setIsListening(false); setLiveTranscript(""); };
    recognition.onend = () => { setIsListening(false); setLiveTranscript(""); };
    recognition.start();
    setIsListening(true);

    if (!isOpen) setIsOpen(true);
  }, [sendMessage, stopAll, isOpen]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setLiveTranscript("");
  }, []);

  if (dismissed || !isVisible) return null;

  const gold = accentColor;
  const hasMic = !!SpeechRecognition;

  return (
    <AnimatePresence>
      {/* Floating bubble */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-[9999] group touch-manipulation"
        >
          {/* Pulsing ring when speaking or on call */}
          {(isSpeaking || callActive) && (
            <motion.div
              className="absolute -inset-2 rounded-full"
              style={{ border: `2px solid ${gold}40` }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative"
            style={{
              background: `linear-gradient(135deg, ${gold}, ${gold}cc)`,
              boxShadow: `0 0 30px ${gold}40`,
            }}
          >
            {callActive ? (
              <Phone className="w-6 h-6 text-black" />
            ) : isSpeaking ? (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <Volume2 className="w-6 h-6 text-black" />
              </motion.div>
            ) : isListening ? (
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                <Mic className="w-6 h-6 text-black" />
              </motion.div>
            ) : (
              <Phone className="w-6 h-6 text-black" />
            )}
            {/* Section badge */}
            {currentSection && scrollNarrationActive && !chatMode && !callActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -left-2 px-1.5 py-0.5 rounded-full text-[8px] font-bold whitespace-nowrap"
                style={{ background: gold, color: "#000" }}
              >
                {currentSection.label.split(" ")[0]}
              </motion.div>
            )}
            {/* Active indicator */}
            {(isSpeaking || isListening || callActive) && (
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2"
                style={{
                  borderColor: "#000",
                  background: callActive ? "#22c55e" : isListening ? "#ef4444" : gold,
                }}
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            )}
          </div>
          {/* Sector label below bubble */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${gold}20`, color: gold, border: `1px solid ${gold}30` }}
          >
            {callActive ? "In linea" : industryName}
          </motion.div>
        </motion.button>
      )}

      {/* Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-20 right-4 z-[9999] w-[360px] max-w-[calc(100vw-2rem)] max-h-[520px] rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: "rgba(15,15,15,0.97)",
            border: `1px solid ${gold}30`,
            backdropFilter: "blur(20px)",
            boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${gold}15`,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: `${gold}20` }}>
            <div className="flex items-center gap-2">
              <div className="relative">
                <motion.div
                  className="absolute -inset-1 rounded-full blur-sm"
                  style={{ background: `${gold}30` }}
                  animate={(isSpeaking && !isPaused) || callActive ? { opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] } : { opacity: 0.2, scale: 1 }}
                  transition={{ duration: 1.4, repeat: (isSpeaking && !isPaused) || callActive ? Infinity : 0 }}
                />
                <div className="relative w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${gold}20` }}>
                  <Phone className="w-4 h-4" style={{ color: gold }} />
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                  style={{
                    borderColor: "rgba(15,15,15,0.97)",
                    background: callActive ? "#22c55e" : isListening ? "#ef4444" : isSpeaking ? "#22c55e" : isLoading ? "#3b82f6" : `${gold}60`,
                  }}
                />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Empire AI — {industryName}</p>
                <p className="text-[10px]" style={{ color: `${gold}80` }}>
                  {callActive
                    ? conversation.isSpeaking ? "🔊 Consulente parla..." : "🎙️ Ti ascolta..."
                    : callConnecting ? "📞 Connessione in corso..."
                    : isListening ? "🎙️ Ti ascolto..."
                    : isSpeaking ? `🔊 ${currentSection?.label || "Sta parlando..."}`
                    : isLoading ? "✨ Sta elaborando..."
                    : currentSection && scrollNarrationActive ? `👁️ ${currentSection.label}`
                    : `Consulente ${industryName}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!chatMode && !callActive && (
                <button
                  onClick={() => {
                    if (scrollNarrationActive) stopAll();
                    setScrollNarrationActive(!scrollNarrationActive);
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition"
                  title={scrollNarrationActive ? "Pausa guida" : "Riattiva guida"}
                >
                  <Eye className={`w-3.5 h-3.5 ${scrollNarrationActive ? "text-white/80" : "text-white/30"}`} />
                </button>
              )}
              {isSpeaking && !callActive && (
                <button onClick={togglePause} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                  {isPaused ? <Play className="w-3.5 h-3.5 text-white/60" /> : <Pause className="w-3.5 h-3.5 text-white/60" />}
                </button>
              )}
              {isSpeaking && !callActive && (
                <button onClick={stopAll} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                  <Square className="w-3.5 h-3.5 text-white/60" />
                </button>
              )}
              {!callActive && (
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition"
                >
                  {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-white/60" /> : <VolumeX className="w-3.5 h-3.5 text-white/60" />}
                </button>
              )}
              {!callActive && (
                <button onClick={() => { stopAll(); setChatMode(!chatMode); setScrollNarrationActive(false); }} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                  <MessageCircle className="w-3.5 h-3.5 text-white/60" />
                </button>
              )}
              <button
                onClick={() => { stopAll(); stopRingTone(); if (callActive) { try { conversation.endSession(); } catch { /* */ } setCallActive(false); } setIsOpen(false); }}
                className="p-1.5 rounded-lg hover:bg-white/10 transition"
                title="Chiudi chat"
              >
                <ChevronDown className="w-3.5 h-3.5 text-white/60" />
              </button>
              <button onClick={handleDismiss} className="p-1.5 rounded-lg hover:bg-white/10 transition" title="Chiudi definitivamente">
                <X className="w-3.5 h-3.5 text-white/40" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "320px" }}>
            {!chatMode && !callActive ? (
              <>
                {/* Narration display */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ background: `${gold}15` }}>
                      <Phone className="w-3 h-3" style={{ color: gold }} />
                    </div>
                    <p className={`text-xs leading-relaxed ${narratedSections.size === 0 && isSpeaking ? "text-white" : "text-white/70"}`}>
                      {openingPitch}
                    </p>
                  </div>

                  {sections.filter(s => narratedSections.has(s.selector)).map((section) => (
                    <motion.div
                      key={section.selector}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="flex gap-2"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ background: `${gold}15` }}>
                        <span className="text-[10px]">{section.label.split(" ")[0]}</span>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold mb-0.5" style={{ color: `${gold}90` }}>{section.label}</p>
                        <p className={`text-xs leading-relaxed ${currentSection?.selector === section.selector && isSpeaking ? "text-white" : "text-white/50"}`}>
                          {section.pitch}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {scrollNarrationActive && narratedSections.size < sections.length && !isSpeaking && (
                    <motion.div
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="flex items-center justify-center gap-2 py-2"
                    >
                      <ChevronDown className="w-3 h-3" style={{ color: `${gold}60` }} />
                      <span className="text-[10px]" style={{ color: `${gold}50` }}>Scorri per scoprire di più...</span>
                      <ChevronDown className="w-3 h-3" style={{ color: `${gold}60` }} />
                    </motion.div>
                  )}
                </motion.div>

                {/* Replay button */}
                {hasStarted && !isSpeaking && (
                  <div className="flex flex-col gap-2 mt-2 pt-2 border-t" style={{ borderColor: `${gold}10` }}>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => {
                        setNarratedSections(new Set());
                        setScrollNarrationActive(true);
                        setNarrationQueue([openingPitch]);
                      }}
                      className="text-[11px] font-semibold flex items-center gap-1 hover:opacity-80 transition"
                      style={{ color: gold }}
                    >
                      <Play className="w-3 h-3" /> Riascolta da capo
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Call active view */}
                {callActive && (
                  <div className="flex flex-col items-center justify-center py-4 gap-3">
                    {/* Voice wave */}
                    <div className="flex items-center justify-center gap-[3px]">
                      {Array.from({ length: 16 }).map((_, i) => {
                        const peak = 6 + ((i * 5) % 12);
                        const isActive = conversation.isSpeaking;
                        return (
                          <motion.div
                            key={i}
                            className="w-[2.5px] rounded-full"
                            style={{ background: `${gold}80` }}
                            animate={isActive ? { height: [3, peak, 3] } : { height: 3 }}
                            transition={{ duration: 0.5 + ((i % 4) * 0.1), repeat: isActive ? Infinity : 0, delay: i * 0.03, ease: "easeInOut" }}
                          />
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium">
                      {conversation.isSpeaking ? `🔊 Consulente ${industryName}` : "🎙️ Ti ascolta..."}
                    </p>
                  </div>
                )}

                {/* Chat messages */}
                {!callActive && messages.length === 0 && (
                  <div className="text-center py-4 space-y-3">
                    <p className="text-xs text-white/40 font-semibold">
                      Chiedimi tutto su Empire per {industryName}
                    </p>
                    <div className="space-y-1.5">
                      {[
                        `Cosa può fare Empire per ${industryName.toLowerCase()}?`,
                        "Come funziona l'intelligenza artificiale?",
                        "Quanto costa il pacchetto completo?",
                        "Che risultati avete ottenuto?",
                      ].map((q, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(q)}
                          className="block w-full text-left px-3 py-2 rounded-lg text-[11px] transition hover:opacity-80"
                          style={{ background: `${gold}10`, color: `${gold}cc`, border: `1px solid ${gold}15` }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className="max-w-[85%] rounded-xl px-3 py-2 text-xs"
                      style={{
                        background: m.role === "user" ? `${gold}25` : "rgba(255,255,255,0.05)",
                        color: "white",
                      }}
                    >
                      <div className="prose prose-xs prose-invert"><ReactMarkdown>{m.content}</ReactMarkdown></div>
                    </div>
                  </div>
                ))}
                {isListening && liveTranscript && (
                  <div className="flex justify-end">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="max-w-[85%] rounded-xl px-3 py-2 text-xs italic"
                      style={{ background: `${gold}15`, color: `${gold}cc` }}
                    >
                      🎙️ {liveTranscript}...
                    </motion.div>
                  </div>
                )}
                {isLoading && (
                  <div className="flex gap-1 px-2">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: gold }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Bottom action area */}
          <div className="p-3 border-t space-y-2" style={{ borderColor: `${gold}15` }}>
            {/* Call controls */}
            {callActive ? (
              <div className="flex items-center justify-center">
                <button
                  onClick={handleCallAction}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition hover:opacity-90"
                  style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}
                >
                  <PhoneOff className="w-4 h-4" /> Chiudi chiamata
                </button>
              </div>
            ) : chatMode ? (
              <div className="flex items-center gap-2">
                {hasMic && (
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: isListening ? "#ef4444" : `${gold}20`,
                      boxShadow: isListening ? "0 0 20px rgba(239,68,68,0.4)" : "none",
                    }}
                  >
                    {isListening ? (
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                        <MicOff className="w-4 h-4 text-white" />
                      </motion.div>
                    ) : (
                      <Mic className="w-4 h-4" style={{ color: gold }} />
                    )}
                  </button>
                )}
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(inputText)}
                  placeholder={isListening ? "Sto ascoltando..." : "Scrivi o parla..."}
                  className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/25 outline-none border border-white/10 focus:border-white/20"
                  disabled={isListening}
                />
                <button
                  onClick={() => sendMessage(inputText)}
                  disabled={isLoading || !inputText.trim() || isListening}
                  className="p-2 rounded-lg transition disabled:opacity-30"
                  style={{ background: `${gold}20` }}
                >
                  <Send className="w-3.5 h-3.5" style={{ color: gold }} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                {/* Phone call button - PRIMARY action */}
                <button
                  onClick={handleCallAction}
                  disabled={callConnecting}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold transition hover:opacity-90 flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${gold}, ${gold}cc)`,
                    color: "#000",
                    boxShadow: `0 4px 20px ${gold}30`,
                  }}
                >
                  {callConnecting ? (
                    <motion.div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                  ) : (
                    <Phone className="w-3.5 h-3.5" />
                  )}
                  {callConnecting ? "Connessione..." : "Chiama consulente"}
                </button>
                <button
                  onClick={() => { stopAll(); setChatMode(true); setScrollNarrationActive(false); }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold transition hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ background: `${gold}20`, color: gold, border: `1px solid ${gold}30` }}
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Chat
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoSalesAgent;
