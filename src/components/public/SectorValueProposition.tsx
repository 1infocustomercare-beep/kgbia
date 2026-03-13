import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Brain, Zap, TrendingUp, Shield, Smartphone, Bot, Clock,
  CheckCircle, ArrowRight, Sparkles, Target, DollarSign,
  Users, Calendar, Bell, BarChart3, Wallet, MessageCircle,
  Star, Workflow, Cpu, Lock, Globe, Package, CreditCard,
  Palette, QrCode, ClipboardCheck, Heart, Layers,
  Route, Car, Scissors, Dumbbell, Stethoscope, ShoppingBag,
  UtensilsCrossed, Umbrella, Wrench, Building, Cake, Bed,
  FileText, RefreshCw, Mail, Camera
} from "lucide-react";

/* ═══════════════════════════════════════════
   SECTOR DATA — Pain Points + Solutions + AI Features
   ═══════════════════════════════════════════ */

interface SectorData {
  painPoints: { icon: React.ReactNode; problem: string; solution: string }[];
  features: { icon: React.ReactNode; title: string; desc: string }[];
  aiFeatures: { title: string; desc: string }[];
}

const SECTOR_DATA: Record<string, SectorData> = {
  beauty: {
    painPoints: [
      { icon: <Calendar className="w-5 h-5" />, problem: "Appuntamenti gestiti su carta o WhatsApp con errori e doppie prenotazioni", solution: "Agenda digitale intelligente con prenotazione online 24/7, conferme automatiche e reminder via SMS/WhatsApp" },
      { icon: <Users className="w-5 h-5" />, problem: "Clienti che non tornano perché non hai un sistema di follow-up", solution: "CRM con storico trattamenti, preferenze e campagne automatiche di riattivazione" },
      { icon: <DollarSign className="w-5 h-5" />, problem: "Non sai quali trattamenti generano più profitto", solution: "Analytics avanzati per servizio, operatore e fascia oraria con suggerimenti IA" },
    ],
    features: [
      { icon: <Calendar className="w-5 h-5" />, title: "Prenotazione Online 24/7", desc: "I clienti prenotano da soli, scelgono servizio, operatore e orario. Zero telefonate." },
      { icon: <Bell className="w-5 h-5" />, title: "Reminder Automatici", desc: "SMS e WhatsApp automatici 24h e 1h prima. Riduzione no-show del 85%." },
      { icon: <Wallet className="w-5 h-5" />, title: "Programma Fedeltà", desc: "Punti, cashback e reward digitali. I clienti tornano più spesso e spendono di più." },
      { icon: <Users className="w-5 h-5" />, title: "CRM Clienti", desc: "Storico completo: trattamenti, preferenze, allergie, spesa totale, frequenza visite." },
      { icon: <Star className="w-5 h-5" />, title: "Review Shield™", desc: "Intercetta recensioni negative prima che arrivino su Google. Proteggi la tua reputazione." },
      { icon: <BarChart3 className="w-5 h-5" />, title: "Analytics Profitto", desc: "Analisi per operatore, servizio, giorno e fascia oraria. Ottimizza i ricavi." },
      { icon: <Palette className="w-5 h-5" />, title: "Sito Web Premium", desc: "Sito professionale personalizzato con il tuo brand, servizi, gallery e prenotazione online." },
      { icon: <MessageCircle className="w-5 h-5" />, title: "Marketing Automatizzato", desc: "Campagne email e WhatsApp per compleanni, riattivazione clienti e promozioni stagionali." },
    ],
    aiFeatures: [
      { title: "Suggerimenti Upselling IA", desc: "L'intelligenza artificiale suggerisce trattamenti complementari basati sullo storico del cliente" },
      { title: "Ottimizzazione Agenda", desc: "L'IA riempie i buchi in agenda suggerendo orari alternativi ai clienti con offerte mirate" },
      { title: "Analisi Trend", desc: "Previsione della domanda per stagione e identificazione dei trattamenti in crescita" },
      { title: "Generazione Contenuti", desc: "Creazione automatica di post social, descrizioni servizi e newsletter con IA" },
    ],
  },
  food: {
    painPoints: [
      { icon: <DollarSign className="w-5 h-5" />, problem: "30% dei ricavi persi in commissioni ai marketplace terzi", solution: "App proprietaria con QR code, ordini diretti e zero commissioni predatorie — solo 2% Empire" },
      { icon: <ClipboardCheck className="w-5 h-5" />, problem: "Ordini a voce con errori, comande perse e tempi di attesa lunghi", solution: "Ordini digitali dal tavolo via QR, invio diretto in cucina in tempo reale" },
      { icon: <Users className="w-5 h-5" />, problem: "Non sai chi sono i tuoi clienti e non puoi ricontattarli", solution: "CRM completo con storico ordini, preferenze e campagne WhatsApp automatizzate" },
    ],
    features: [
      { icon: <QrCode className="w-5 h-5" />, title: "Menu Digitale & QR", desc: "Menu interattivo multilingua con foto, allergeni, ordini diretti dal tavolo al tavolo." },
      { icon: <Package className="w-5 h-5" />, title: "Gestione Cucina Live", desc: "Dashboard cucina in tempo reale con priorità ordini, timer e notifiche smart." },
      { icon: <Wallet className="w-5 h-5" />, title: "Loyalty & Cashback", desc: "Programma fedeltà digitale con punti, livelli e reward. I clienti tornano il 40% in più." },
      { icon: <CreditCard className="w-5 h-5" />, title: "Pagamenti Integrati", desc: "Pagamenti al tavolo, online e in cassa. Stripe Connect, contanti, carte — tutto tracciato." },
      { icon: <Star className="w-5 h-5" />, title: "Review Shield™", desc: "Le recensioni negative vengono intercettate. Solo quelle positive arrivano su Google." },
      { icon: <BarChart3 className="w-5 h-5" />, title: "Analisi Profitto per Piatto", desc: "Scopri quali piatti generano più margine e quali eliminare dal menu." },
      { icon: <FileText className="w-5 h-5" />, title: "Fatturazione Automatica", desc: "Fatture elettroniche generate e inviate automaticamente. Zero errori, zero stress." },
      { icon: <Bell className="w-5 h-5" />, title: "Push & Marketing", desc: "Notifiche push, promozioni mirate e campagne per i clienti che non tornano da 30+ giorni." },
    ],
    aiFeatures: [
      { title: "Menu Generato con IA", desc: "Carica le foto dei piatti e l'IA genera nome, descrizione, prezzo suggerito e allergeni in 60 secondi" },
      { title: "Upselling Intelligente", desc: "Suggerimenti automatici di piatti complementari, bevande e dessert basati sull'ordine del cliente" },
      { title: "Traduzione Automatica", desc: "Menu tradotto in 8+ lingue automaticamente per i turisti internazionali" },
      { title: "Previsione Scorte", desc: "L'IA prevede la domanda e ti avvisa quando riordinare ingredienti" },
    ],
  },
  fitness: {
    painPoints: [
      { icon: <Calendar className="w-5 h-5" />, problem: "Iscrizioni gestite su Excel, pagamenti manuali e scadenze dimenticate", solution: "Gestione abbonamenti digitale con rinnovo automatico, reminder e pagamenti ricorrenti" },
      { icon: <Users className="w-5 h-5" />, problem: "Clienti che abbandonano dopo i primi mesi senza che tu lo sappia", solution: "CRM con tracciamento frequenza, alert automatici per inattività e campagne di riattivazione" },
      { icon: <Target className="w-5 h-5" />, problem: "Classi vuote o sovraffollate senza controllo", solution: "Prenotazione classi online con limite posti, lista d'attesa e check-in digitale" },
    ],
    features: [
      { icon: <Calendar className="w-5 h-5" />, title: "Prenotazione Classi", desc: "I soci prenotano corsi e PT online. Limite posti, lista d'attesa, cancellazione automatica." },
      { icon: <CreditCard className="w-5 h-5" />, title: "Gestione Abbonamenti", desc: "Piani mensili, trimestrali, annuali con rinnovo automatico e pagamenti ricorrenti." },
      { icon: <Users className="w-5 h-5" />, title: "CRM & Engagement", desc: "Tracciamento frequenza, obiettivi fitness, comunicazione personalizzata per ogni socio." },
      { icon: <Bell className="w-5 h-5" />, title: "Notifiche Smart", desc: "Reminder corsi, scadenze abbonamento, promozioni personalizzate via push e WhatsApp." },
      { icon: <BarChart3 className="w-5 h-5" />, title: "Analytics Occupazione", desc: "Tasso di occupazione per classe, orario, trainer. Ottimizza il palinsesto." },
      { icon: <Star className="w-5 h-5" />, title: "Review & Feedback", desc: "Raccolta feedback post-classe, NPS automatico e gestione recensioni online." },
      { icon: <Smartphone className="w-5 h-5" />, title: "App White Label", desc: "La TUA app brandizzata con prenotazioni, profilo socio, pagamenti e notifiche." },
      { icon: <Workflow className="w-5 h-5" />, title: "Automazione Totale", desc: "Dalla lead generation all'iscrizione, dal rinnovo al follow-up — tutto automatizzato." },
    ],
    aiFeatures: [
      { title: "Previsione Churn", desc: "L'IA identifica i soci a rischio abbandono e attiva campagne di retention automatiche" },
      { title: "Ottimizzazione Palinsesto", desc: "Analisi dei dati per suggerire gli orari migliori per ogni tipo di classe" },
      { title: "Personal Marketing IA", desc: "Messaggi personalizzati per ogni socio basati su comportamento e preferenze" },
      { title: "Analisi ROI Campagne", desc: "Misura automaticamente il ritorno di ogni promozione e suggerisce ottimizzazioni" },
    ],
  },
  healthcare: {
    painPoints: [
      { icon: <Calendar className="w-5 h-5" />, problem: "Telefono che squilla continuamente per prenotazioni e conferme", solution: "Prenotazione online 24/7 con agenda digitale, conferme automatiche e teleconsulto integrato" },
      { icon: <FileText className="w-5 h-5" />, problem: "Documentazione cartacea, referti persi e processi lenti", solution: "Cartella clinica digitale, referti online e firma digitale per consenso informato" },
      { icon: <Users className="w-5 h-5" />, problem: "No-show e buchi in agenda che costano centinaia di euro al giorno", solution: "Reminder automatici multipli via SMS/WhatsApp con riduzione no-show dell'85%" },
    ],
    features: [
      { icon: <Calendar className="w-5 h-5" />, title: "Prenotazione Online", desc: "I pazienti prenotano visite e controlli da soli, 24/7, scegliendo specialista e orario." },
      { icon: <Bell className="w-5 h-5" />, title: "Reminder Multi-canale", desc: "SMS, WhatsApp e email automatici 48h, 24h e 2h prima della visita." },
      { icon: <FileText className="w-5 h-5" />, title: "Referti Digitali", desc: "Invio referti online, accesso paziente sicuro e storico completo documentazione." },
      { icon: <Shield className="w-5 h-5" />, title: "Privacy & GDPR", desc: "Crittografia AES-256, consenso digitale, audit trail completo. Conforme a tutte le normative." },
      { icon: <Users className="w-5 h-5" />, title: "CRM Pazienti", desc: "Anagrafica completa, storico visite, prescrizioni, allergie e note cliniche." },
      { icon: <Star className="w-5 h-5" />, title: "Reputazione Online", desc: "Gestione recensioni Google, raccolta feedback post-visita e NPS automatico." },
      { icon: <CreditCard className="w-5 h-5" />, title: "Fatturazione Sanitaria", desc: "Fatture conformi, gestione codici prestazione e invio automatico al Sistema Tessera Sanitaria." },
      { icon: <MessageCircle className="w-5 h-5" />, title: "Comunicazione Paziente", desc: "Chat sicura, invio istruzioni pre/post intervento e follow-up automatizzati." },
    ],
    aiFeatures: [
      { title: "Triage IA", desc: "L'intelligenza artificiale pre-valuta le richieste e assegna priorità e specialista appropriato" },
      { title: "Ottimizzazione Agenda", desc: "L'IA distribuisce le visite per tipo, durata e specialista massimizzando l'efficienza" },
      { title: "Follow-up Intelligente", desc: "Reminder automatici per controlli periodici basati su patologia e storico paziente" },
      { title: "Analisi Predittiva", desc: "Previsione affluenza, identificazione trend patologie e ottimizzazione risorse" },
    ],
  },
  retail: {
    painPoints: [
      { icon: <ShoppingBag className="w-5 h-5" />, problem: "Vendite limitate al negozio fisico senza presenza online", solution: "E-commerce integrato con catalogo digitale, ordini online e ritiro in negozio" },
      { icon: <Users className="w-5 h-5" />, problem: "Clienti che comprano una volta e non tornano mai più", solution: "Programma fedeltà digitale, cashback automatico e promozioni personalizzate" },
      { icon: <Package className="w-5 h-5" />, problem: "Inventario gestito a mano con errori, rotture di stock e sprechi", solution: "Gestione magazzino automatica con alert scorte, riordino intelligente e analytics vendite" },
    ],
    features: [
      { icon: <ShoppingBag className="w-5 h-5" />, title: "E-commerce Integrato", desc: "Catalogo online, carrello, pagamenti e spedizioni. Vendi online senza marketplace." },
      { icon: <Package className="w-5 h-5" />, title: "Gestione Inventario", desc: "Stock in tempo reale, alert scorte minime, storico movimenti e report." },
      { icon: <Wallet className="w-5 h-5" />, title: "Loyalty Program", desc: "Tessera digitale, punti, livelli e reward. Aumenta la frequenza di acquisto del 40%." },
      { icon: <CreditCard className="w-5 h-5" />, title: "Pagamenti Omnichannel", desc: "In negozio, online, con link — tutti i metodi di pagamento in un unico sistema." },
      { icon: <Bell className="w-5 h-5" />, title: "Marketing Automation", desc: "Email e WhatsApp automatici per nuovi arrivi, saldi, compleanni e clienti inattivi." },
      { icon: <BarChart3 className="w-5 h-5" />, title: "Analytics Vendite", desc: "Report per prodotto, categoria, periodo. Scopri i best seller e ottimizza gli ordini." },
      { icon: <Palette className="w-5 h-5" />, title: "Sito & App Brandizzati", desc: "La tua presenza digitale professionale con il tuo brand, zero marchi terzi." },
      { icon: <Star className="w-5 h-5" />, title: "Gestione Recensioni", desc: "Raccolta feedback, gestione recensioni e protezione della reputazione online." },
    ],
    aiFeatures: [
      { title: "Catalogo IA", desc: "Fotografa i prodotti e l'IA genera titolo, descrizione, categoria e prezzo suggerito" },
      { title: "Raccomandazioni Smart", desc: "Suggerimenti prodotti personalizzati per ogni cliente basati su acquisti precedenti" },
      { title: "Previsione Domanda", desc: "L'IA prevede i trend di vendita e suggerisce quando riordinare e quanto" },
      { title: "Pricing Dinamico", desc: "Suggerimenti automatici di prezzo basati su domanda, stagione e concorrenza" },
    ],
  },
  hotel: {
    painPoints: [
      { icon: <Bed className="w-5 h-5" />, problem: "Prenotazioni sparse tra OTA, telefono e email senza un unico sistema", solution: "Channel manager integrato con booking diretto, calendario unificato e pagamenti sicuri" },
      { icon: <DollarSign className="w-5 h-5" />, problem: "Commissioni OTA del 15-25% che erodono completamente il margine", solution: "Sistema di booking diretto con la TUA app/sito e zero commissioni a terzi" },
      { icon: <Star className="w-5 h-5" />, problem: "Recensioni negative su Booking/TripAdvisor senza possibilità di intervento", solution: "Review Shield™ intercetta il feedback negativo prima della pubblicazione online" },
    ],
    features: [
      { icon: <Calendar className="w-5 h-5" />, title: "Booking Engine", desc: "Prenotazione diretta con calendario disponibilità, tariffe dinamiche e conferma istantanea." },
      { icon: <Bed className="w-5 h-5" />, title: "Gestione Camere", desc: "Stato camere in tempo reale, housekeeping digitale, manutenzione e check-in/out." },
      { icon: <Users className="w-5 h-5" />, title: "Guest CRM", desc: "Profilo ospite completo con preferenze, storico soggiorni e comunicazione personalizzata." },
      { icon: <UtensilsCrossed className="w-5 h-5" />, title: "Servizi Aggiuntivi", desc: "Upselling automatico: spa, ristorante, transfer, esperienze — tutto dal device dell'ospite." },
      { icon: <Bell className="w-5 h-5" />, title: "Comunicazione Ospite", desc: "Pre-stay email, welcome message, mid-stay check e post-stay review request." },
      { icon: <BarChart3 className="w-5 h-5" />, title: "Revenue Analytics", desc: "ADR, RevPAR, occupazione, analisi per canale. Dashboard decisionale in tempo reale." },
      { icon: <CreditCard className="w-5 h-5" />, title: "Pagamenti & Fatture", desc: "Check-in con pagamento automatico, fatturazione elettronica e gestione depositi." },
      { icon: <Smartphone className="w-5 h-5" />, title: "App Ospite", desc: "Check-in mobile, richieste room service, informazioni hotel e chat diretta." },
    ],
    aiFeatures: [
      { title: "Revenue Management IA", desc: "Tariffe dinamiche calcolate dall'IA basate su domanda, eventi e competitor" },
      { title: "Concierge Virtuale", desc: "Chatbot IA che risponde alle domande degli ospiti 24/7 in ogni lingua" },
      { title: "Previsione Occupazione", desc: "L'IA prevede i periodi di alta/bassa stagione per ottimizzare prezzi e personale" },
      { title: "Personalizzazione Soggiorno", desc: "Suggerimenti automatici basati sulle preferenze dell'ospite (cuscino, minibar, attività)" },
    ],
  },
  beach: {
    painPoints: [
      { icon: <Umbrella className="w-5 h-5" />, problem: "Prenotazioni ombrelloni gestite con telefonate e quadernoni", solution: "Mappa interattiva con prenotazione online, pagamento anticipato e conferma istantanea" },
      { icon: <DollarSign className="w-5 h-5" />, problem: "Abbonamenti stagionali tracciati su carta con errori e dispute", solution: "Gestione abbonamenti digitale con scadenze, rinnovi automatici e storico completo" },
      { icon: <Package className="w-5 h-5" />, problem: "Servizi bar/ristorante spiaggia con ordini a voce e comande perse", solution: "Ordini digitali dall'ombrellone via QR con invio diretto al bar/cucina" },
    ],
    features: [
      { icon: <Umbrella className="w-5 h-5" />, title: "Mappa Postazioni", desc: "Mappa interattiva dello stabilimento con disponibilità in tempo reale e prenotazione online." },
      { icon: <Calendar className="w-5 h-5" />, title: "Prenotazione Online", desc: "I clienti prenotano ombrellone, lettino e servizi extra 24/7 dal loro smartphone." },
      { icon: <CreditCard className="w-5 h-5" />, title: "Abbonamenti Digitali", desc: "Giornalieri, settimanali, mensili e stagionali con gestione automatica e pagamenti ricorrenti." },
      { icon: <QrCode className="w-5 h-5" />, title: "Ordini dal Lettino", desc: "Menu bar/ristorante accessibile via QR dall'ombrellone. Ordini diretti senza cameriere." },
      { icon: <Users className="w-5 h-5" />, title: "CRM Clienti", desc: "Storico clienti, preferenze postazione, spesa totale e comunicazione personalizzata." },
      { icon: <Bell className="w-5 h-5" />, title: "Notifiche & Promo", desc: "Push notification per eventi, happy hour, meteo e promozioni last-minute." },
      { icon: <BarChart3 className="w-5 h-5" />, title: "Analytics Stagione", desc: "Occupazione giornaliera, ricavi per postazione, analisi servizi extra e trend." },
      { icon: <Smartphone className="w-5 h-5" />, title: "App Bagnanti", desc: "App personalizzata per prenotare, ordinare, pagare e ricevere promozioni." },
    ],
    aiFeatures: [
      { title: "Pricing Dinamico IA", desc: "Tariffe che si adattano a meteo, affluenza e domanda per massimizzare i ricavi" },
      { title: "Previsione Affluenza", desc: "L'IA prevede l'occupazione basandosi su meteo, giorno e storico per ottimizzare il personale" },
      { title: "Cross-Selling Smart", desc: "Suggerimenti automatici di servizi extra basati su profilo cliente e orario" },
      { title: "Ottimizzazione Layout", desc: "Analisi dati per suggerire la disposizione ottimale delle postazioni" },
    ],
  },
  bakery: {
    painPoints: [
      { icon: <Cake className="w-5 h-5" />, problem: "Ordini torte e prodotti speciali gestiti a voce con errori frequenti", solution: "Ordini online con catalogo visuale, personalizzazioni e pagamento anticipato" },
      { icon: <Clock className="w-5 h-5" />, problem: "Produzione senza previsione della domanda con sprechi o mancanze", solution: "Analytics vendite e previsione domanda IA per ottimizzare la produzione giornaliera" },
      { icon: <Users className="w-5 h-5" />, problem: "Clienti abituali senza fidelizzazione né possibilità di ricontatto", solution: "Programma fedeltà, tessera punti digitale e promozioni automatiche personalizzate" },
    ],
    features: [
      { icon: <ShoppingBag className="w-5 h-5" />, title: "Ordini Online", desc: "Catalogo digitale con foto, ordini per ritiro o consegna, pagamento anticipato." },
      { icon: <Cake className="w-5 h-5" />, title: "Torte Personalizzate", desc: "Configuratore torte online: gusti, dimensioni, decorazioni e data ritiro." },
      { icon: <Wallet className="w-5 h-5" />, title: "Fidelity Card", desc: "Tessera punti digitale, promozioni compleanno e cashback automatico." },
      { icon: <Bell className="w-5 h-5" />, title: "Notifiche Ordine", desc: "Aggiornamenti automatici: ordine confermato, in preparazione, pronto per ritiro." },
      { icon: <BarChart3 className="w-5 h-5" />, title: "Analisi Vendite", desc: "Best seller, trend stagionali, margini per prodotto e ottimizzazione produzione." },
      { icon: <FileText className="w-5 h-5" />, title: "Fatturazione", desc: "Scontrini digitali, fatture elettroniche e report fiscali automatici." },
      { icon: <Palette className="w-5 h-5" />, title: "Sito Vetrina Premium", desc: "Sito web con i tuoi prodotti, la tua storia e il sistema di ordini integrato." },
      { icon: <MessageCircle className="w-5 h-5" />, title: "WhatsApp Business", desc: "Conferme ordine, promozioni e comunicazioni automatiche via WhatsApp." },
    ],
    aiFeatures: [
      { title: "Catalogo IA in 60s", desc: "Fotografa i prodotti e l'IA genera nome, descrizione e prezzo per il catalogo online" },
      { title: "Previsione Produzione", desc: "L'IA analizza storico vendite e meteo per suggerire le quantità da produrre" },
      { title: "Marketing Stagionale", desc: "Campagne automatiche per Natale, Pasqua, San Valentino con contenuti generati dall'IA" },
      { title: "Ottimizzazione Menu", desc: "Suggerimenti per nuovi prodotti basati su trend del mercato e preferenze clienti" },
    ],
  },
  trades: {
    painPoints: [
      { icon: <Wrench className="w-5 h-5" />, problem: "Richieste intervento via telefono senza tracciamento né prioritizzazione", solution: "Sistema interventi digitale con richiesta online, foto, priorità e workflow completo" },
      { icon: <FileText className="w-5 h-5" />, problem: "Preventivi scritti a mano, persi o inviati in ritardo", solution: "Generazione preventivi digitali istantanei, firma online e conversione automatica in fattura" },
      { icon: <Calendar className="w-5 h-5" />, problem: "Agenda tecnici caotica con sovrapposizioni e spostamenti", solution: "Calendario condiviso con assegnazione intelligente, GPS e ottimizzazione percorsi" },
    ],
    features: [
      { icon: <ClipboardCheck className="w-5 h-5" />, title: "Gestione Interventi", desc: "Workflow completo: richiesta → preventivo → appuntamento → esecuzione → fattura." },
      { icon: <FileText className="w-5 h-5" />, title: "Preventivi Digitali", desc: "Creazione rapida, invio via WhatsApp/email, firma digitale e conversione in fattura." },
      { icon: <Calendar className="w-5 h-5" />, title: "Agenda Tecnici", desc: "Calendario condiviso con assegnazione, durata stimata e ottimizzazione percorsi." },
      { icon: <Camera className="w-5 h-5" />, title: "Documentazione Foto", desc: "Foto prima/dopo intervento, note tecniche e storico completo per ogni cliente." },
      { icon: <Users className="w-5 h-5" />, title: "CRM Clienti", desc: "Anagrafica, storico interventi, impianti, scadenze manutenzione e note tecniche." },
      { icon: <CreditCard className="w-5 h-5" />, title: "Fatturazione", desc: "Fatture elettroniche generate dall'intervento, invio automatico e tracciamento pagamenti." },
      { icon: <Bell className="w-5 h-5" />, title: "Reminder Manutenzione", desc: "Promemoria automatici per manutenzioni periodiche. Genera lavoro ricorrente." },
      { icon: <Smartphone className="w-5 h-5" />, title: "App Tecnico Mobile", desc: "I tecnici gestiscono tutto dal telefono: interventi, foto, firma cliente e incasso." },
    ],
    aiFeatures: [
      { title: "Preventivi IA", desc: "L'IA genera preventivi dettagliati basati su tipo intervento, materiali e storico prezzi" },
      { title: "Ottimizzazione Percorsi", desc: "Routing intelligente per minimizzare i tempi di spostamento tra interventi" },
      { title: "Diagnosi Assistita", desc: "Suggerimenti diagnostici basati sui sintomi descritti dal cliente" },
      { title: "Previsione Ricambi", desc: "L'IA prevede quali ricambi servono e ti avvisa quando rifornire il furgone" },
    ],
  },
  ncc: {
    painPoints: [
      { icon: <Car className="w-5 h-5" />, problem: "Prenotazioni via telefono/WhatsApp senza un sistema centralizzato", solution: "Sistema prenotazioni online con calendario, assegnazione autista e conferme automatiche" },
      { icon: <Route className="w-5 h-5" />, problem: "Tariffe calcolate ogni volta manualmente con errori e incoerenze", solution: "Matrice prezzi configurabile per tratta, veicolo, passeggeri con calcolo istantaneo" },
      { icon: <FileText className="w-5 h-5" />, problem: "Fatturazione manuale, ricevute perse e gestione caotica", solution: "Fatturazione automatica, ricevute digitali e report fiscali istantanei" },
    ],
    features: [
      { icon: <Calendar className="w-5 h-5" />, title: "Prenotazione Online", desc: "I clienti prenotano transfer, escursioni e servizi speciali 24/7 dal sito web." },
      { icon: <Car className="w-5 h-5" />, title: "Gestione Flotta", desc: "Veicoli, documenti, scadenze, manutenzione e disponibilità in tempo reale." },
      { icon: <Users className="w-5 h-5" />, title: "Gestione Autisti", desc: "Profili, disponibilità, assegnazioni, CQC e tracking documenti in scadenza." },
      { icon: <Route className="w-5 h-5" />, title: "Matrice Tariffe", desc: "Prezzi per tratta, veicolo e numero passeggeri con calcolo automatico istantaneo." },
      { icon: <CreditCard className="w-5 h-5" />, title: "Pagamenti & Fatture", desc: "Pagamento online, depositi, fatturazione automatica e ricevute digitali." },
      { icon: <Globe className="w-5 h-5" />, title: "Sito Premium Multilingua", desc: "Sito luxury personalizzato con flotta, destinazioni e booking integrato in 4+ lingue." },
      { icon: <BarChart3 className="w-5 h-5" />, title: "Analytics Corse", desc: "Revenue per tratta, autista, periodo. Dashboard completa per decisioni strategiche." },
      { icon: <Star className="w-5 h-5" />, title: "CRM & Recensioni", desc: "Profili clienti VIP, storico corse, preferenze e gestione recensioni." },
    ],
    aiFeatures: [
      { title: "Pricing Dinamico", desc: "Tariffe che si adattano automaticamente a domanda, stagione e disponibilità" },
      { title: "Assegnazione Smart", desc: "L'IA assegna automaticamente l'autista e il veicolo ottimale per ogni corsa" },
      { title: "Previsione Domanda", desc: "Anticipa i periodi di alta richiesta per preparare la flotta e il personale" },
      { title: "Comunicazione Multilingua", desc: "Messaggi automatici al cliente nella sua lingua per ogni fase del servizio" },
    ],
  },
};

const DEFAULT_SECTOR: SectorData = SECTOR_DATA.beauty;

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

interface Props {
  sectorKey: string;
  accentColor: string;
  darkMode?: boolean;
  sectorLabel: string;
}

export function SectorValueProposition({ sectorKey, accentColor, darkMode = true, sectorLabel }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const data = SECTOR_DATA[sectorKey] || DEFAULT_SECTOR;

  const bg = darkMode ? "#0a0a0a" : "#fafafa";
  const bg2 = darkMode ? "#111111" : "#f0f0f0";
  const text = darkMode ? "#ffffff" : "#1a1a1a";
  const textMuted = darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
  const cardBg = darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
  const borderColor = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";

  return (
    <>
      {/* ═══ SECTION 1: Pain Points → Solutions ═══ */}
      <section ref={ref} className="relative py-20 sm:py-28 px-5 sm:px-6 overflow-hidden" style={{ background: bg, color: text }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}30, transparent)` }} />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div className="text-center mb-14"
            initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
              style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}20` }}>
              <Target className="w-3.5 h-3.5" style={{ color: accentColor }} />
              <span className="text-[0.65rem] font-bold tracking-[2px] uppercase" style={{ color: accentColor }}>Come Ti Miglioriamo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-[1.1] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              I Problemi del Tuo {sectorLabel}?<br />
              <span style={{ color: accentColor }}>Li Risolviamo Tutti.</span>
            </h2>
            <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: textMuted }}>
              Ogni sfida che affronti quotidianamente ha una soluzione digitale. Ecco come trasformiamo il tuo business.
            </p>
          </motion.div>

          <div className="space-y-5">
            {data.painPoints.map((pp, i) => (
              <motion.div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.6 }}>
                {/* Problem */}
                <div className="p-6 sm:p-7 flex gap-4 items-start" style={{ background: darkMode ? "rgba(255,60,60,0.04)" : "rgba(255,60,60,0.04)", border: `1px solid rgba(255,60,60,0.1)`, borderRight: "none", borderRadius: "16px 0 0 16px" }}>
                  <div className="w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center" style={{ background: "rgba(255,80,80,0.12)", color: "#ff6b6b" }}>
                    {pp.icon}
                  </div>
                  <div>
                    <p className="text-[0.6rem] font-bold tracking-[2px] uppercase mb-1.5" style={{ color: "#ff6b6b" }}>❌ Il Problema</p>
                    <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{pp.problem}</p>
                  </div>
                </div>
                {/* Solution */}
                <div className="p-6 sm:p-7 flex gap-4 items-start" style={{ background: `${accentColor}06`, border: `1px solid ${accentColor}15`, borderLeft: "none", borderRadius: "0 16px 16px 0" }}>
                  <div className="w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center" style={{ background: `${accentColor}15`, color: accentColor }}>
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[0.6rem] font-bold tracking-[2px] uppercase mb-1.5" style={{ color: accentColor }}>✅ La Soluzione Empire</p>
                    <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{pp.solution}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2: All Features Grid ═══ */}
      <section className="relative py-20 sm:py-28 px-5 sm:px-6 overflow-hidden" style={{ background: bg2, color: text }}>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div className="text-center mb-14"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
              style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}20` }}>
              <Layers className="w-3.5 h-3.5" style={{ color: accentColor }} />
              <span className="text-[0.65rem] font-bold tracking-[2px] uppercase" style={{ color: accentColor }}>Funzionalità Complete</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-[1.1] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Tutto Ciò Che Serve per il Tuo <span style={{ color: accentColor }}>{sectorLabel}</span>
            </h2>
            <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: textMuted }}>
              Un ecosistema completo progettato specificamente per il tuo settore. Zero software esterni, zero costi aggiuntivi.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.features.map((f, i) => (
              <motion.div key={i} className="group p-5 sm:p-6 rounded-2xl transition-all duration-500 hover:-translate-y-1"
                style={{ background: cardBg, border: `1px solid ${borderColor}` }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${accentColor}12`, color: accentColor }}>
                  {f.icon}
                </div>
                <h4 className="font-bold text-sm mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{f.title}</h4>
                <p className="text-xs leading-[1.7]" style={{ color: textMuted }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: AI Features ═══ */}
      <section className="relative py-20 sm:py-28 px-5 sm:px-6 overflow-hidden" style={{ background: bg, color: text }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}20, transparent)` }} />
        
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full blur-[200px] pointer-events-none" style={{ background: `${accentColor}06` }} />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div className="text-center mb-14"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
              style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}20` }}>
              <Brain className="w-3.5 h-3.5" style={{ color: accentColor }} />
              <span className="text-[0.65rem] font-bold tracking-[2px] uppercase" style={{ color: accentColor }}>Intelligenza Artificiale</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-[1.1] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              L'IA che Lavora <span style={{ color: accentColor }}>per Te</span>
            </h2>
            <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: textMuted }}>
              Non un semplice software, ma un'intelligenza artificiale che impara, ottimizza e fa crescere il tuo business autonomamente.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.aiFeatures.map((ai, i) => (
              <motion.div key={i} className="group relative p-6 rounded-2xl overflow-hidden"
                style={{ background: cardBg, border: `1px solid ${borderColor}` }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}>
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)` }} />
                {/* Glow on hover */}
                <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: `${accentColor}10` }} />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${accentColor}15` }}>
                      <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
                    </div>
                    <h4 className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{ai.title}</h4>
                  </div>
                  <p className="text-xs leading-[1.7] pl-11" style={{ color: textMuted }}>{ai.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div className="text-center mt-12"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <p className="text-xs mb-5" style={{ color: textMuted }}>
              <strong style={{ color: text }}>+200 funzionalità incluse</strong> — aggiornamenti settimanali senza costi aggiuntivi
            </p>
            <motion.a href="#prenota" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold cursor-pointer group"
              style={{ color: darkMode ? "#000" : "#fff", background: accentColor }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}>
              Scopri Tutto in una Demo Gratuita <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
