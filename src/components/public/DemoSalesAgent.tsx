// DemoSalesAgent — Ultra-persuasive AI sales agent with scroll-aware narration
import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, X, Sparkles, Pause, Play, MessageCircle, Send, Mic, MicOff, Square, ChevronDown, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";

const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-tts`;
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-voice-agent`;

type Msg = { role: "user" | "assistant"; content: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

// ── Scroll-aware section narrations per sector ──
// Each section triggers a contextual explanation as the user scrolls through the demo site

interface ScrollSection {
  selector: string; // CSS selector or section keyword to detect
  label: string;
  pitch: string;
}

const SCROLL_SECTIONS: Record<string, ScrollSection[]> = {
  default: [
    { selector: "hero", label: "🏠 Hero", pitch: "Quello che vedi è solo la vetrina. Dietro ci sono oltre duecento funzionalità invisibili che lavorano per te ventiquattro ore su ventiquattro. Questo sito NON è un template — è un sistema operativo completo costruito SU MISURA per il tuo business dal nostro team in sole ventiquattro ore." },
    { selector: "menu,catalogo,servizi,services", label: "📋 Servizi", pitch: "Guarda questa sezione: ogni servizio che vedi è gestito dall'IA. Traduzione automatica in otto lingue, foto professionali generate dall'intelligenza artificiale, prezzi dinamici. Un tuo competitor sta già usando sistemi così — chi non si digitalizza nel duemilaventisei è come andare in autostrada con un carretto." },
    { selector: "prenot,booking,reservation,agenda", label: "📅 Prenotazioni", pitch: "Le prenotazioni funzionano ventiquattro ore su ventiquattro, anche mentre dormi. L'IA manda reminder automatici via WhatsApp, gestisce le cancellazioni, riempie i buchi con la lista d'attesa. Un nostro cliente ha eliminato il cento per cento dei no-show in due settimane." },
    { selector: "review,recens,testimoni", label: "⭐ Recensioni", pitch: "Ecco Review Shield, la nostra arma segreta. Una recensione negativa da due stelle? Non finisce MAI su Google. L'IA la intercetta, la trasforma in feedback privato, e tu risolvi il problema prima che diventi pubblico. La tua media resta perfetta. Nessun competitor ha questa tecnologia." },
    { selector: "contact,contatt,cta", label: "📞 Contatti", pitch: "Vedi il form di contatto? Con Empire non è un semplice form — è un Concierge IA che risponde in tempo reale, qualifica i lead, genera preventivi automatici, e fissa appuntamenti. Anche alle tre di notte. Un nostro cliente si è svegliato con duecentoventi euro guadagnati dall'IA mentre dormiva." },
    { selector: "about,chi-siamo,storia", label: "ℹ️ Chi Siamo", pitch: "La sezione Chi Siamo non è testo statico — è una storia viva. L'IA aggiorna automaticamente le statistiche, i risultati, le testimonianze. Ogni settimana il tuo sito diventa più persuasivo senza che tu faccia nulla. Aggiornamenti settimanali gratuiti, per sempre." },
    { selector: "gallery,foto,portfolio", label: "📸 Gallery", pitch: "Queste foto le puoi generare con la nostra IA in sessanta secondi. Non servono fotografi professionisti. L'IA crea immagini professionali dei tuoi prodotti e servizi, ottimizzate per social e sito. Un click e hai un catalogo da rivista." },
    { selector: "faq,domand", label: "❓ FAQ", pitch: "Le FAQ non sono solo testo — l'IA le aggiorna automaticamente basandosi sulle domande più frequenti dei tuoi clienti. E se qualcuno chiede qualcosa che non è nelle FAQ? Il Concierge IA risponde in tempo reale, ventiquattro ore su ventiquattro." },
    { selector: "price,prezz,tariff,listino", label: "💰 Prezzi", pitch: "I prezzi che vedi sono dinamici. L'IA può modificarli in base alla domanda, al giorno della settimana, alla stagione. Dynamic pricing intelligente che massimizza il tuo fatturato automaticamente. I tuoi competitor fissano i prezzi una volta e li dimenticano — tu li ottimizzi ogni giorno." },
    { selector: "footer,social", label: "🔗 Footer", pitch: "Hai scrollato tutto il sito — e hai visto solo il cinque per cento di Empire. Dietro questo sito ci sono CRM avanzato, fatturazione elettronica, marketing automatico, analytics predittivi, gestione staff, inventario IA, e molto altro. Duecento funzionalità, zero costi mensili. Vuoi saperne di più?" },
  ],
  food: [
    { selector: "hero", label: "🏠 Hero", pitch: "Benvenuto nel futuro della ristorazione. Quello che stai guardando NON è un semplice sito — è un sistema operativo completo per il tuo ristorante. Menu digitale QR in otto lingue, ordini al tavolo, Kitchen Display, Review Shield, fidelizzazione, marketing automatico. Tutto in un unico sistema costruito su misura dal nostro team in ventiquattro ore." },
    { selector: "menu,piatt,dish", label: "🍽️ Menu", pitch: "Questo menu digitale si traduce da solo in otto lingue. Il turista tedesco legge in tedesco, il giapponese in giapponese. L'IA genera le descrizioni dei piatti, suggerisce gli abbinamenti vino, calcola allergeni. Un tuo cliente ordina la carbonara? L'IA suggerisce automaticamente un Pecorino di Amatrice e un calice di vino bianco — upselling intelligente che alza lo scontrino medio del venticinque per cento." },
    { selector: "order,ordin,carrell,cart", label: "📋 Ordini", pitch: "Il cliente ordina dal QR al tavolo, l'ordine arriva DIRETTO in cucina sul Kitchen Display. Zero camerieri che sbagliano, zero attese, zero carta. Sabato sera, sala piena: il vecchio sistema crolla. Con Empire? Centoventi ordini gestiti senza un errore. E tu paghi solo il due per cento — non il trenta per cento di JustEat o Deliveroo." },
    { selector: "review,recens", label: "⭐ Review Shield", pitch: "Ecco la funzione che vale da sola il prezzo di tutto il sistema. Review Shield. Un cliente scrive una recensione da due stelle? Con le piattaforme normali finisce su Google e ti distrugge la media. Con Empire? L'IA la intercetta, la converte in feedback privato. Tu risolvi il problema, il cliente è contento, la recensione negativa non esiste. La tua media resta a quattro virgola otto stelle." },
    { selector: "prenot,reserv,tavol", label: "📅 Prenotazioni", pitch: "Prenotazioni ventiquattro ore su ventiquattro con conferma automatica WhatsApp. Un habitué non torna da venticinque giorni? L'IA se ne accorge e gli manda un messaggio personalizzato con uno sconto sulla sua carbonara preferita. È tornato il giorno dopo con tutta la famiglia — quattro coperti invece di uno. Il ristoratore non ha fatto nulla." },
    { selector: "contact,contatt", label: "📞 Contatti", pitch: "Dietro quel form c'è un Concierge IA che risponde istantaneamente. Sono le ventitré, un cliente vuole prenotare per domani? L'IA gestisce tutto: verifica disponibilità, conferma, manda reminder. Tu dormi, l'IA lavora." },
    { selector: "about,chi-siamo,storia", label: "ℹ️ La Nostra Storia", pitch: "Questa sezione racconta la tua storia — ma con Empire diventa un'arma di vendita. L'IA aggiorna le statistiche in tempo reale: piatti serviti, clienti soddisfatti, anni di attività. Ogni dato costruisce fiducia automaticamente." },
    { selector: "gallery,foto", label: "📸 Gallery", pitch: "Le foto del tuo ristorante? L'IA le genera in sessanta secondi. Piatti fotografati come su una rivista Michelin. Non servono fotografi — un click e hai un catalogo professionale che fa venire l'acquolina." },
    { selector: "footer,social,faq", label: "🔗 Chiusura", pitch: "Hai visto tutto — e questo è solo il cinque per cento. Dietro ci sono Kitchen Display per la cucina, gestione staff con PIN, HACCP digitale, inventario IA, fatturazione SDI, analytics predittivi. Duecento funzionalità, costruite su misura in ventiquattro ore, zero costi mensili per sempre." },
  ],
  ncc: [
    { selector: "hero", label: "🏠 Hero", pitch: "Stai guardando il futuro del trasporto premium. Gestione flotta, prenotazioni real-time, assegnazione autisti automatica, CRM clienti VIP, tariffario dinamico, scadenzario documenti — tutto in un'unica piattaforma luxury costruita su misura per la tua attività NCC." },
    { selector: "fleet,flotta,veicol,vehicle", label: "🚘 Flotta", pitch: "Ogni veicolo della tua flotta gestito dall'IA. Scadenze assicurazione, revisione, tagliando — l'IA ti avvisa quindici giorni prima. Un click e blocchi l'assegnazione del veicolo. Nessun rischio, nessuna multa, nessuna dimenticanza. Un nostro cliente ha evitato tremila euro di sanzioni in sei mesi." },
    { selector: "route,tratt,destin,tour", label: "🗺️ Tratte", pitch: "Matrice prezzi automatica per ogni tratta. Napoli-Positano? Centocinquanta euro. Ma il turista americano vuole anche un tour in barca a Capri? L'IA suggerisce automaticamente: più trecentocinquanta euro al carrello. Cross-selling che funziona da solo, ventiquattro ore su ventiquattro." },
    { selector: "book,prenot,reserv", label: "📅 Prenotazioni", pitch: "Il concierge del Grand Hotel chiama per un transfer urgente. Tu sei in viaggio. Con Empire? Il concierge prenota dal sito, il sistema assegna l'autista più vicino, il cliente riceve conferma con nome e foto del veicolo. Tu ricevi solo la notifica: nuova corsa confermata, centoventi euro. Non hai fatto nulla." },
    { selector: "review,recens", label: "⭐ Recensioni", pitch: "Nel settore NCC le recensioni sono tutto. Un cliente insoddisfatto può distruggere la tua reputazione su Google in un minuto. Review Shield intercetta le recensioni negative e le gestisce privatamente. La tua media resta perfetta, i nuovi clienti prenotano con fiducia." },
    { selector: "contact,contatt,cta", label: "📞 Contatti", pitch: "Il form di contatto è un Concierge IA premium. Un turista scrive alle due di notte in inglese? L'IA risponde in inglese, verifica disponibilità, genera un preventivo, invia conferma. Tu ti svegli con la corsa già confermata e pagata." },
    { selector: "footer,faq", label: "🔗 Chiusura", pitch: "Hai visto il sito — ma dietro c'è un impero di funzionalità: GPS live fleet map, dispatch autisti, fatturazione B2B, scadenzario intelligente, analytics. Tutto costruito su misura in ventiquattro ore. Zero costi mensili, per sempre." },
  ],
  beauty: [
    { selector: "hero", label: "🏠 Hero", pitch: "Benvenuta nel futuro del beauty. Agenda multi-operatore, prenotazioni ventiquattro ore su ventiquattro, anti no-show, schede cliente, fidelizzazione, marketing IA — tutto in un sistema elegante come il tuo salone, costruito su misura dal nostro team." },
    { selector: "serviz,tratament,service", label: "💅 Servizi", pitch: "Ogni trattamento prenotabile online, con descrizione, durata, prezzo e foto. La cliente sceglie, prenota e paga in un tap. L'agenda si aggiorna in tempo reale per ogni operatore. Zero telefonate, zero sovrapposizioni, zero stress." },
    { selector: "book,prenot,agenda", label: "📅 Prenotazioni", pitch: "Ecco dove Empire fa la magia. Lunedì mattina, tre clienti non si presentano? Con Empire il sistema manda reminder automatici WhatsApp ventiquattro e due ore prima. Se la cliente non conferma, l'IA propone lo slot a chi è in lista d'attesa. Buchi in agenda? Zero. Un nostro salone ha eliminato il cento per cento dei no-show." },
    { selector: "review,recens", label: "⭐ Recensioni", pitch: "Una cliente insoddisfatta scrive una recensione negativa? Review Shield la intercetta. Tu rispondi in privato, risolvi il problema, offri un trattamento omaggio. La recensione negativa non esiste pubblicamente. La tua media resta perfetta." },
    { selector: "gallery,foto,portfolio", label: "📸 Portfolio", pitch: "Il tuo portfolio professionale aggiornato dall'IA. Foto prima e dopo, stili più richiesti, tendenze. Le clienti sfogliano, si ispirano, prenotano. L'IA genera anche contenuti per Instagram automaticamente." },
    { selector: "contact,contatt", label: "📞 Contatti", pitch: "Domani è il compleanno di Giulia, una tua cliente top. L'IA le ha già mandato gli auguri con un trattamento viso in omaggio. Giulia ha prenotato entusiasta e porta un'amica. Due clienti, zero sforzo tuo. Questo è Empire." },
    { selector: "footer,faq", label: "🔗 Chiusura", pitch: "Hai visto il sito — ma dietro c'è CRM avanzato, wallet fedeltà, marketing automation WhatsApp, analytics, fatturazione. Sara non viene da quarantacinque giorni? L'IA lo nota e la riconquista con un'offerta personalizzata. Senza Empire, l'avresti persa per sempre." },
  ],
  healthcare: [
    { selector: "hero", label: "🏠 Hero", pitch: "Il futuro della sanità digitale. Agenda pazienti, cartelle digitali, telemedicina, promemoria, fatturazione, comunicazioni automatiche — un ecosistema completo per il tuo studio medico, costruito su misura in ventiquattro ore." },
    { selector: "serviz,service,special", label: "🏥 Specialità", pitch: "Ogni specializzazione con la sua logica: follow-up post-visita automatici, prescrizioni digitali, richiami vaccinali. L'IA sa che il paziente deve tornare tra sei mesi e glielo ricorda automaticamente." },
    { selector: "book,prenot,agenda", label: "📅 Appuntamenti", pitch: "Il signor Rossi dimentica sempre gli appuntamenti. Con Empire riceve un SMS quarantotto ore prima e un WhatsApp due ore prima. Se non conferma, lo slot viene liberato. Zero buchi, zero stress. L'IA gestisce quaranta pazienti alla settimana meglio di qualsiasi segretaria." },
    { selector: "contact,contatt", label: "📞 Contatti", pitch: "Un paziente chiama alle ventidue per un'urgenza. Il Concierge IA risponde, fa un triage iniziale, e prenota una visita urgente per domani. Tu ricevi il riassunto al mattino con tutti i dettagli." },
    { selector: "footer,faq", label: "🔗 Chiusura", pitch: "Cartelle digitali GDPR compliant, fatturazione TSE, follow-up automatici, comunicazioni ai pazienti — tutto integrato. Hai visitato quaranta pazienti questa settimana e non sai chi deve fare il follow-up? L'IA lo sa." },
  ],
  fitness: [
    { selector: "hero", label: "🏠 Hero", pitch: "Il futuro del fitness. Abbonamenti, prenotazione corsi, check-in QR, schede allenamento, pagamenti ricorrenti — tutto integrato per la tua palestra." },
    { selector: "cors,class,lesson", label: "🏋️ Corsi", pitch: "Il corso di yoga delle diciotto è sempre pieno? Con Empire: prenotazione online con posti in tempo reale, lista d'attesa automatica. Niente più caos all'ingresso. E se un membro cancella? Il primo in lista viene notificato istantaneamente." },
    { selector: "book,prenot,member", label: "📅 Membership", pitch: "Luca ha l'abbonamento ma non viene da tre settimane. L'IA lo nota e gli manda: il corso HIIT del martedì ha due posti, prenota ora! Luca torna. Senza Empire avrebbe disdetto il mese dopo. Il tasso di rinnovo dei nostri clienti è salito all'ottantasette per cento." },
    { selector: "footer,faq,contact", label: "🔗 Chiusura", pitch: "Check-in QR, analytics retention, pagamenti ricorrenti Stripe, schede allenamento personalizzate, marketing per membri inattivi. Tutto incluso, zero costi mensili." },
  ],
  hotel: [
    { selector: "hero", label: "🏠 Hero", pitch: "Il futuro dell'ospitalità premium. Prenotazioni dirette, concierge IA ventiquattro ore su ventiquattro, upselling automatico, housekeeping digitale — risparmi migliaia di euro in commissioni OTA." },
    { selector: "room,camer,suite", label: "🛏️ Camere", pitch: "Un ospite trova il tuo hotel su Google. Normalmente va su Booking e tu paghi il diciotto per cento. Con Empire? Prenota direttamente con solo il due per cento. Su cento notti a centocinquanta euro risparmi ventiquattromila euro l'anno. Ventiquattromila euro." },
    { selector: "book,prenot,reserv", label: "📅 Prenotazioni", pitch: "Prenotazioni dirette con conferma istantanea, check-in digitale, upselling automatico. Sono le ventitré, un ospite guarda il menu in camera. L'IA suggerisce colazione con upgrade a champagne. L'ospite clicca sì. Hai guadagnato mentre dormivi." },
    { selector: "footer,faq,contact", label: "🔗 Chiusura", pitch: "Concierge IA che risponde in otto lingue, housekeeping digitale, analytics occupancy, revenue management. Tutto costruito su misura, zero costi mensili." },
  ],
  hospitality: [
    { selector: "hero", label: "🏠 Hero", pitch: "Prenotazioni dirette, concierge IA, upselling notturno, housekeeping — il tuo hotel diventa premium e risparmia migliaia in commissioni." },
    { selector: "footer,faq,contact", label: "🔗 Chiusura", pitch: "Ventiquattromila euro risparmiati passando dalle OTA alle prenotazioni dirette. Solo il due per cento." },
  ],
  beach: [
    { selector: "hero", label: "🏠 Hero", pitch: "Mappa interattiva ombrelloni, prenotazioni online, abbonamenti stagionali, gestione bar, push notification — il tuo lido diventa digitale e premium." },
    { selector: "map,mapp,spot,ombrellon", label: "🏖️ Mappa", pitch: "Ogni ombrellone prenotabile online con prezzi dinamici. È lunedì, occupazione al trenta per cento? L'IA lancia una push: domani ombrellone a metà prezzo! Risultato: occupazione al settanta per cento. Senza Empire? Un lunedì morto." },
    { selector: "book,prenot,reserv", label: "📅 Prenotazioni", pitch: "Il cliente è sdraiato sotto l'ombrellone, ha sete, non vuole alzarsi. Apre l'app, ordina un Aperol Spritz, il barista lo porta. Cliente felice, tu incassi di più — tutto dal telefono." },
    { selector: "footer,faq,contact", label: "🔗 Chiusura", pitch: "Abbonamenti stagionali, pass giornalieri, gestione bar, fedeltà. Tutto automatizzato, tutto premium." },
  ],
  retail: [
    { selector: "hero", label: "🏠 Hero", pitch: "Catalogo digitale, e-commerce, inventario con barcode, CRM, fedeltà, marketing automatico — tutto unificato per il tuo negozio, costruito su misura." },
    { selector: "product,prodott,catalog", label: "🛍️ Catalogo", pitch: "Stai per rimanere senza le sneakers taglia quarantadue, il prodotto più venduto. Non te ne accorgi. Ma l'IA sì: alert scorte basse, suggerisce riordino. Un click e l'ordine parte. Senza Empire? Cliente deluso, vendita persa." },
    { selector: "contact,contatt,cta", label: "📞 Contatti", pitch: "Maria ha speso cinquecento euro quest'anno. L'IA le manda: hai raggiunto cinquecento punti, ecco un buono da venticinque euro! Maria torna entro la settimana. Fidelizzazione automatica, zero sforzo." },
    { selector: "footer,faq", label: "🔗 Chiusura", pitch: "Inventario IA, loyalty wallet, marketing automation, e-commerce integrato, analytics predittivi. Tutto incluso, zero costi mensili." },
  ],
  plumber: [
    { selector: "hero", label: "🏠 Hero", pitch: "Gestione interventi, preventivi digitali, schede cliente, calendario condiviso, foto prima e dopo, fatturazione, GPS dispatch — tutto dal telefono. Il tuo business artigianale diventa una macchina da guerra digitale." },
    { selector: "serviz,service,intervent", label: "🔧 Servizi", pitch: "Sono le tre di notte. Il signor Bianchi ha un tubo rotto. Apre la TUA app, fa una foto, scrive nella chat. L'IA Concierge risponde immediatamente: gli dice di chiudere la valvola, genera un preventivo automatico, fissa l'appuntamento per le otto. Tu ti svegli e trovi tutto pronto. Hai guadagnato duecentoventi euro dormendo." },
    { selector: "contact,contatt,cta", label: "📞 Contatti", pitch: "L'IA organizza la tua giornata: cinque interventi ottimizzati per percorso, risparmi due ore al giorno. Quarantaquattro ore al mese. Quasi sei giornate lavorative regalate dall'intelligenza artificiale." },
    { selector: "footer,faq", label: "🔗 Chiusura", pitch: "Preventivi IA con firma digitale, foto prima e dopo, fatturazione elettronica, CRM clienti, reminder manutenzioni. Tu dormi, l'IA lavora. Questo è Empire." },
  ],
};

const getScrollSections = (industry: string): ScrollSection[] =>
  SCROLL_SECTIONS[industry] || SCROLL_SECTIONS.default;

// Opening pitch — first thing the agent says when entering a demo site
// Must immediately reference the sector, give powerful examples, highlight killer features
const OPENING_PITCHES: Record<string, string> = {
  default: "Ciao! Stai guardando un sito demo del settore business — ma fermati un secondo. Questo NON è un semplice sito. È un sistema operativo completo con oltre duecento funzionalità invisibili che lavorano per te. Esempio? Un imprenditore come te ha attivato Empire tre mesi fa: oggi il suo fatturato è cresciuto del trentadue per cento, i clienti persi sono stati riconquistati dall'IA, e le recensioni negative? Intercettate TUTTE prima di finire su Google grazie a Review Shield. Scorri il sito — ti spiego sezione per sezione cosa può fare per te.",
  food: "Ciao! Stai guardando un ristorante demo — ma quello che vedi è solo la punta dell'iceberg. Dietro questo sito c'è un sistema completo che ha rivoluzionato centinaia di ristoranti come il tuo. Ti faccio tre esempi reali: primo, il menu si traduce DA SOLO in otto lingue — il turista tedesco ordina in tedesco, il giapponese in giapponese. Secondo, Review Shield: una recensione negativa? Non arriva MAI su Google, l'IA la intercetta e la trasforma in feedback privato. Terzo, un ristoratore di Napoli si è svegliato con duecentoventi euro guadagnati dall'IA mentre dormiva grazie al Concierge automatico. Scorri il sito e ti mostro funzione per funzione come Empire rivoluzionerà il tuo locale.",
  ncc: "Ciao! Stai guardando un sito NCC demo — ma dietro c'è una piattaforma che gestisce flotte intere in tutta Italia. Ascolta: un nostro cliente NCC a Roma ha evitato tremila euro di sanzioni in sei mesi perché l'IA gli ricorda scadenze assicurazione e revisione quindici giorni prima. Ma non è tutto: il concierge del Grand Hotel chiama per un transfer urgente, tu sei in viaggio — l'IA accetta la prenotazione, assegna l'autista più vicino, il cliente riceve nome e foto del veicolo. Tu ricevi solo la notifica: nuova corsa confermata, centoventi euro. E la funzione killer? Il cross-selling automatico: il turista prenota Napoli-Positano e l'IA suggerisce il tour in barca a Capri — trecentocinquanta euro extra al carrello senza che tu faccia nulla. Scorri e ti mostro tutto.",
  beauty: "Ciao! Stai guardando un salone beauty demo — e ti racconto subito cosa fa Empire per i saloni come il tuo. Primo dato: un nostro salone ha eliminato il CENTO per cento dei no-show con i reminder automatici WhatsApp. Cento per cento. Zero buchi in agenda. Secondo: Sara, una cliente top, non veniva da quarantacinque giorni — l'IA l'ha notato e le ha mandato un'offerta personalizzata per il suo trattamento preferito. Sara è tornata il giorno dopo e ha portato un'amica. Terzo: è il compleanno di Giulia? L'IA le manda gli auguri con un trattamento viso in omaggio. Giulia prenota entusiasta. Due clienti, zero sforzo tuo. E Review Shield protegge la tua reputazione da ogni recensione negativa. Scorri il sito e ti mostro tutto nel dettaglio.",
  healthcare: "Ciao! Stai guardando uno studio medico demo — ma dietro c'è una rivoluzione nella gestione sanitaria. L'IA sa che il signor Rossi deve tornare tra sei mesi per il controllo e glielo ricorda automaticamente. Un paziente chiama alle ventidue per un'urgenza? Il Concierge IA risponde, fa un triage iniziale, prenota la visita per domani. Tu trovi tutto pronto al mattino. E le cartelle digitali? GDPR compliant, fatturazione TSE integrata, follow-up automatici. Un medico che usa Empire gestisce quaranta pazienti a settimana meglio di qualsiasi segretaria. Scorri e ti mostro come ogni sezione risolve i tuoi problemi.",
  fitness: "Ciao! Stai guardando una palestra demo — e ti dico subito i numeri che contano. Il tasso di rinnovo abbonamenti dei nostri clienti fitness è salito all'ottantasette per cento. Come? L'IA monitora chi non viene da tre settimane e lo riconquista: Luca, il corso HIIT del martedì ha due posti, prenota ora! Luca torna. Senza Empire avrebbe disdetto il mese dopo. In più: check-in QR, prenotazione corsi con posti in tempo reale, lista d'attesa automatica, pagamenti ricorrenti Stripe. Un membro cancella lo yoga? Il primo in lista viene notificato istantaneamente. Scorri e scopri tutto.",
  hotel: "Ciao! Stai guardando un hotel demo — e ti do subito un numero che ti farà riflettere: ventiquattromila euro. Sono i soldi che un nostro cliente hotel risparmia OGNI ANNO passando dalle commissioni OTA alle prenotazioni dirette. Con Empire paghi solo il due per cento invece del diciotto di Booking. Ma c'è di più: sono le ventitré, un ospite guarda il menu in camera, l'IA suggerisce colazione con upgrade a champagne. L'ospite clicca sì — hai guadagnato mentre dormivi. Concierge IA che risponde in otto lingue, check-in digitale, housekeeping automatizzato. Scorri e ti mostro tutto.",
  hospitality: "Ciao! Stai guardando una struttura ricettiva demo. Ventiquattromila euro risparmiati passando dalle OTA alle prenotazioni dirette. Concierge IA ventiquattro ore su ventiquattro, upselling notturno automatico. Scorri e ti racconto tutto.",
  beach: "Ciao! Stai guardando uno stabilimento balneare demo — e ascolta questa: è lunedì, occupazione al trenta per cento. Giornata morta, giusto? NON con Empire. L'IA lancia una push notification: domani ombrellone a metà prezzo! Risultato: occupazione al settanta per cento. E il cliente sotto l'ombrellone ha sete ma non vuole alzarsi? Apre l'app, ordina un Aperol Spritz, il barista lo porta. Cliente felice, tu incassi di più. In più: mappa interattiva ombrelloni prenotabili online, abbonamenti stagionali, pass giornalieri, gestione bar integrata. Scorri e ti mostro tutto.",
  retail: "Ciao! Stai guardando un negozio demo — e ti racconto cosa succede senza Empire: le sneakers taglia quarantadue, il tuo prodotto più venduto, stanno finendo. Tu non te ne accorgi. Il cliente arriva, non le trova, se ne va deluso. Con Empire? L'IA ti avvisa: scorte basse, suggerisce riordino automatico. Un click e l'ordine parte. E poi c'è Maria: ha speso cinquecento euro quest'anno, l'IA le manda un messaggio — hai raggiunto cinquecento punti, ecco un buono da venticinque euro! Maria torna entro la settimana. Fidelizzazione automatica, zero sforzo. Scorri e scopri tutto.",
  plumber: "Ciao! Stai guardando un sito da artigiano demo — e ascolta questa storia vera. Sono le tre di notte, il signor Bianchi ha un tubo rotto. Apre la TUA app, fa una foto, scrive nella chat. L'IA Concierge risponde IMMEDIATAMENTE: gli dice di chiudere la valvola, genera un preventivo automatico, fissa l'appuntamento per le otto del mattino. Tu ti svegli e trovi tutto pronto — duecentoventi euro guadagnati dormendo. E l'IA organizza la tua giornata: cinque interventi ottimizzati per percorso, risparmi due ore al giorno. Quarantaquattro ore al mese. Quasi sei giornate lavorative regalate dall'intelligenza artificiale. Scorri e ti mostro tutto.",
  bakery: "Ciao! Stai guardando una pasticceria demo — e il profumo lo senti quasi, vero? Ma dietro questo sito c'è un sistema che trasforma la tua pasticceria in una macchina da incassi. Ordini online per torte personalizzate con anticipo, l'IA suggerisce abbinamenti — prendi il tiramisù? Perfetto con un caffè specialty! Upselling automatico che alza lo scontrino del venticinque per cento. E un cliente non torna da trenta giorni? L'IA gli manda: ci manchi! Ecco uno sconto del dieci per cento sulla tua brioche preferita. Torna il giorno dopo. Scorri e ti mostro tutto.",
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
  // Check all sections on page, find the one most in viewport
  const allSections = document.querySelectorAll("section, [data-section], [id]");
  for (const section of sections) {
    const keywords = section.selector.split(",").map(s => s.trim().toLowerCase());
    for (const el of allSections) {
      const id = (el.id || "").toLowerCase();
      const dataSection = el.getAttribute("data-section")?.toLowerCase() || "";
      const className = (el.className || "").toLowerCase();
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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<InstanceType<NonNullable<typeof SpeechRecognition>> | null>(null);
  const messagesRef = useRef<Msg[]>([]);
  const isSpeakingRef = useRef(false);
  const scrollNarrationRef = useRef(true);

  const sections = getScrollSections(industry);
  const openingPitch = OPENING_PITCHES[industry] || OPENING_PITCHES.default;

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);
  useEffect(() => { scrollNarrationRef.current = scrollNarrationActive; }, [scrollNarrationActive]);

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
    if (narrationQueue.length === 0 || isSpeakingRef.current || abortRef.current) return;
    const text = narrationQueue[0];
    
    const speak = async () => {
      abortRef.current = false;
      setIsSpeaking(true);
      await speakText(text, audioRef, abortRef);
      if (!abortRef.current) {
        setIsSpeaking(false);
        setNarrationQueue(prev => prev.slice(1));
        // Mark section as narrated
        const section = sections.find(s => s.pitch === text);
        if (section) {
          setNarratedSections(prev => new Set([...prev, section.selector]));
        }
      }
    };
    speak();
  }, [narrationQueue, sections]);

  // Scroll detection — detect section changes and auto-narrate
  useEffect(() => {
    if (dismissed) return;
    let lastSection: string | null = null;
    
    const onScroll = () => {
      if (!scrollNarrationRef.current || isSpeakingRef.current || chatMode) return;
      
      const visible = detectVisibleSection(sections);
      if (visible && visible.selector !== lastSection) {
        lastSection = visible.selector;
        setCurrentSection(visible);
        
        // Auto-narrate new sections
        setNarratedSections(prev => {
          if (!prev.has(visible.selector) && !isSpeakingRef.current) {
            setNarrationQueue(q => [...q, visible.pitch]);
            return new Set([...prev, visible.selector]);
          }
          return prev;
        });
      }
    };
    
    // Debounced scroll listener
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
  }, [dismissed, sections, chatMode]);

  // Load voices early
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      abortRef.current = true;
      audioRef.current?.pause();
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

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
    setDismissed(true);
    setIsVisible(false);
    setIsOpen(false);
  }, [stopAll]);

  // Send message (from text or voice)
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    stopAll();
    abortRef.current = false;
    setScrollNarrationActive(false); // Stop scroll narration when user engages

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

  // Voice recognition
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
          className="fixed bottom-20 right-4 z-[9999] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${gold}, ${gold}cc)`,
            boxShadow: `0 0 30px ${gold}40`,
          }}
        >
          {isSpeaking ? (
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Volume2 className="w-6 h-6 text-black" />
            </motion.div>
          ) : isListening ? (
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
              <Mic className="w-6 h-6 text-black" />
            </motion.div>
          ) : (
            <Sparkles className="w-6 h-6 text-black" />
          )}
          {/* Section indicator badge */}
          {currentSection && scrollNarrationActive && !chatMode && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -left-2 px-1.5 py-0.5 rounded-full text-[8px] font-bold whitespace-nowrap"
              style={{ background: gold, color: "#000" }}
            >
              {currentSection.label.split(" ")[0]}
            </motion.div>
          )}
          {(isSpeaking || isListening) && (
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full"
              style={{ background: isListening ? "#ef4444" : gold }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          )}
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
                  animate={isSpeaking && !isPaused ? { opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] } : { opacity: 0.2, scale: 1 }}
                  transition={{ duration: 1.4, repeat: isSpeaking && !isPaused ? Infinity : 0 }}
                />
                <div className="relative w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${gold}20` }}>
                  <Sparkles className="w-4 h-4" style={{ color: gold }} />
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                  style={{
                    borderColor: "rgba(15,15,15,0.97)",
                    background: isListening ? "#ef4444" : isSpeaking ? "#22c55e" : isLoading ? "#3b82f6" : `${gold}60`,
                  }}
                />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Empire AI — Consulente</p>
                <p className="text-[10px]" style={{ color: `${gold}80` }}>
                  {isListening ? "🎙️ Ti ascolto..." : isSpeaking ? `🔊 ${currentSection?.label || "Sto parlando..."}` : isLoading ? "✨ Sto pensando..." : currentSection && scrollNarrationActive ? `👁️ ${currentSection.label}` : "Esperto del tuo settore"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Toggle scroll narration */}
              {!chatMode && (
                <button
                  onClick={() => {
                    if (scrollNarrationActive) stopAll();
                    setScrollNarrationActive(!scrollNarrationActive);
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition"
                  title={scrollNarrationActive ? "Pausa guida scroll" : "Riattiva guida scroll"}
                >
                  <Eye className={`w-3.5 h-3.5 ${scrollNarrationActive ? "text-white/80" : "text-white/30"}`} />
                </button>
              )}
              {isSpeaking && (
                <button onClick={togglePause} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                  {isPaused ? <Play className="w-3.5 h-3.5 text-white/60" /> : <Pause className="w-3.5 h-3.5 text-white/60" />}
                </button>
              )}
              {isSpeaking && (
                <button onClick={stopAll} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                  <Square className="w-3.5 h-3.5 text-white/60" />
                </button>
              )}
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition"
              >
                {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-white/60" /> : <VolumeX className="w-3.5 h-3.5 text-white/60" />}
              </button>
              <button onClick={() => { stopAll(); setChatMode(!chatMode); setScrollNarrationActive(false); }} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                <MessageCircle className="w-3.5 h-3.5 text-white/60" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                <X className="w-3.5 h-3.5 text-white/60" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "360px" }}>
            {!chatMode ? (
              <>
                {/* Active narration display */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  {/* Opening pitch */}
                  <div className="flex gap-2">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ background: `${gold}15` }}>
                      <Sparkles className="w-3 h-3" style={{ color: gold }} />
                    </div>
                    <p className={`text-xs leading-relaxed ${narratedSections.size === 0 && isSpeaking ? "text-white" : "text-white/70"}`}>
                      {openingPitch}
                    </p>
                  </div>

                  {/* Narrated sections */}
                  {sections.filter(s => narratedSections.has(s.selector)).map((section, i) => (
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

                  {/* Scroll hint */}
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

                {/* Action buttons */}
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
                {/* Chat messages */}
                {messages.length === 0 && (
                  <div className="text-center py-4 space-y-3">
                    <p className="text-xs text-white/40 font-semibold">
                      Chiedimi qualsiasi cosa su Empire
                    </p>
                    <div className="space-y-1.5">
                      {[
                        "Cosa può fare per il mio settore?",
                        "Come funziona l'IA?",
                        "Quanto costa davvero?",
                        "Che vantaggi ho rispetto ai competitor?",
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
                    {hasMic && (
                      <p className="text-[10px] text-white/20">
                        🎙️ Premi il microfono per parlare a voce
                      </p>
                    )}
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

          {/* Input area */}
          {chatMode && (
            <div className="p-3 border-t flex items-center gap-2" style={{ borderColor: `${gold}15` }}>
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
          )}

          {/* Bottom CTA when not in chat mode */}
          {!chatMode && (
            <div className="p-3 border-t space-y-2" style={{ borderColor: `${gold}15` }}>
              <div className="flex gap-2">
                {hasMic && (
                  <button
                    onClick={() => {
                      stopAll();
                      setChatMode(true);
                      setScrollNarrationActive(false);
                      setTimeout(() => startListening(), 300);
                    }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold transition hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ background: `${gold}20`, color: gold, border: `1px solid ${gold}30` }}
                  >
                    <Mic className="w-3.5 h-3.5" /> Parla con me
                  </button>
                )}
                <button
                  onClick={() => { stopAll(); setChatMode(true); setScrollNarrationActive(false); }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold transition hover:opacity-90"
                  style={{ background: `linear-gradient(135deg, ${gold}, ${gold}cc)`, color: "#000" }}
                >
                  💬 Chiedimi di più
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoSalesAgent;
