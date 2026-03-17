import { useState, useEffect, useMemo, useCallback } from "react";
import BackButton from "@/components/BackButton";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, RefreshCw, TrendingUp, DollarSign, Zap, Activity,
  Globe, Package, Camera, ScanLine, Star, BarChart3, Eye,
  Settings, Play, Download, FileSpreadsheet, AlertTriangle,
  XCircle, Info, ChevronRight, Clock, Hash, Search, Filter,
  ArrowUpRight, ArrowDownRight, Medal, ChevronDown, X, Send,
  ToggleLeft, ToggleRight, Check, Loader2, Sparkles, Mic, Volume2, Phone, MessageSquare,
  Pencil, Save, Trash2, Plus, Power, PowerOff, Copy, CheckCircle2,
  Bell, ShieldCheck, FileText, Car, Scissors, Heart, Wrench, ChefHat
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from "recharts";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Agent cartoon images
import agentHubHero from "@/assets/agent-hub-hero.png";
import agentEmpireAssistant from "@/assets/agent-empire-assistant.png";
import agentAtlasVoice from "@/assets/agent-atlas-voice.png";
import agentConciergeFood from "@/assets/agent-concierge-food.png";
import agentTts from "@/assets/agent-tts.png";
import agentMenuOcr from "@/assets/agent-menu-ocr.png";
import agentPhotoGen from "@/assets/agent-photo-gen.png";
import agentTranslator from "@/assets/agent-translator.png";
import agentInventory from "@/assets/agent-inventory.png";
import agentConciergeAi from "@/assets/agent-concierge-ai.png";
import agentAnalyticsBrain from "@/assets/agent-analytics-brain.png";
import agentSocialManager from "@/assets/agent-social-manager.png";
import agentSalesCloser from "@/assets/agent-sales-closer.png";
import agentDocumentAi from "@/assets/agent-document-ai.png";
import agentSmartNotifier from "@/assets/agent-smart-notifier.png";
import agentComplianceGuardian from "@/assets/agent-compliance-guardian.png";
import agentOpsFood from "@/assets/agent-ops-food.png";
import agentOpsNcc from "@/assets/agent-ops-ncc.png";
import agentOpsBeauty from "@/assets/agent-ops-beauty.png";
import agentOpsHealthcare from "@/assets/agent-ops-healthcare.png";
import agentOpsConstruction from "@/assets/agent-ops-construction.png";

// ─── Agent Definitions ───
interface AgentDef {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  image: string;
  color: string;
  model: string;
  modelBadgeColor: string;
  file: string;
  trigger: string;
  industries: string[];
  inputDesc: string;
  outputDesc: string;
  costPerCall: number;
  testable: boolean;
  testType: "chat" | "voice" | "custom";
}

const AGENT_IMAGES: Record<string, string> = {
  "empire-assistant": agentEmpireAssistant,
  "empire-voice-agent": agentAtlasVoice,
  "restaurant-voice-agent": agentConciergeFood,
  "empire-tts": agentTts,
  "ai-menu-ocr": agentMenuOcr,
  "ai-menu-image": agentPhotoGen,
  "ai-translate": agentTranslator,
  "ai-inventory": agentInventory,
  "concierge-ai": agentConciergeAi,
  "analytics-brain": agentAnalyticsBrain,
  "social-manager": agentSocialManager,
  "sales-closer": agentSalesCloser,
  "document-ai": agentDocumentAi,
  "smart-notifier": agentSmartNotifier,
  "compliance-guardian": agentComplianceGuardian,
  "ops-food": agentOpsFood,
  "ops-ncc": agentOpsNcc,
  "ops-beauty": agentOpsBeauty,
  "ops-healthcare": agentOpsHealthcare,
  "ops-construction": agentOpsConstruction,
};

const AGENTS: AgentDef[] = [
  {
    name: "empire-assistant",
    displayName: "Empire Assistant",
    description: "Chatbot IA contestuale 24/7 — supporto tecnico, analisi dati aziendali, consigli di gestione. Accede a ordini, menu, prenotazioni, clienti in tempo reale.",
    icon: "Brain", image: agentEmpireAssistant, color: "#C8963E",
    model: "Gemini 3 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "supabase/functions/empire-assistant/index.ts",
    trigger: "On-demand (chat utente)",
    industries: ["food", "ncc", "beauty", "healthcare", "retail", "fitness", "hospitality"],
    inputDesc: "Messaggi chat + contesto ristorante", outputDesc: "Risposta streaming in italiano",
    costPerCall: 0.003, testable: true, testType: "chat",
  },
  {
    name: "empire-voice-agent",
    displayName: "ATLAS — Voice Agent Pubblico",
    description: "Assistente vocale IA per il sito pubblico Empire. Risponde a domande su funzionalità, pricing, settori supportati e guida i prospect verso la registrazione.",
    icon: "Mic", image: agentAtlasVoice, color: "#8B5CF6",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "supabase/functions/empire-voice-agent/index.ts",
    trigger: "On-demand (voice chat landing page)",
    industries: ["food", "ncc", "beauty", "healthcare", "retail", "fitness", "hospitality"],
    inputDesc: "Messaggi vocali/testo da prospect", outputDesc: "Risposta testuale + TTS audio",
    costPerCall: 0.004, testable: true, testType: "chat",
  },
  {
    name: "restaurant-voice-agent",
    displayName: "Concierge Food — Ordini Vocali",
    description: "Assistente IA per ristoranti: prende ordini vocali/chat, conosce il menu completo con prezzi, suggerisce piatti e aggiunge automaticamente al carrello del cliente.",
    icon: "Phone", image: agentConciergeFood, color: "#10B981",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "supabase/functions/restaurant-voice-agent/index.ts",
    trigger: "On-demand (chat/voce cliente ristorante)",
    industries: ["food"],
    inputDesc: "Messaggi cliente + menu completo", outputDesc: "Risposta + ordine JSON",
    costPerCall: 0.004, testable: true, testType: "chat",
  },
  {
    name: "empire-tts",
    displayName: "Empire TTS — Text-to-Speech",
    description: "Servizio di sintesi vocale per tutti gli agenti vocali. Converte testo in audio naturale italiano con voce professionale femminile.",
    icon: "Volume2", image: agentTts, color: "#EC4899",
    model: "Google TTS API", modelBadgeColor: "bg-pink-500/20 text-pink-400",
    file: "supabase/functions/empire-tts/index.ts",
    trigger: "Automatico (chiamato da voice agents)",
    industries: ["food", "ncc", "beauty", "healthcare", "retail", "fitness", "hospitality"],
    inputDesc: "Testo da convertire", outputDesc: "Audio MP3/WAV stream",
    costPerCall: 0.001, testable: false, testType: "custom",
  },
  {
    name: "ai-menu-ocr",
    displayName: "Menu AI — OCR Scanner",
    description: "Scansiona foto di menu cartacei ed estrae automaticamente piatti, descrizioni, prezzi e categorie con vision multimodale.",
    icon: "ScanLine", image: agentMenuOcr, color: "#F97316",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "supabase/functions/ai-menu/index.ts (action: ocr)",
    trigger: "On-demand (upload foto menu)",
    industries: ["food"],
    inputDesc: "Immagine base64 di un menu cartaceo", outputDesc: "JSON piatti con nome, descrizione, prezzo",
    costPerCall: 0.005, testable: false, testType: "custom",
  },
  {
    name: "ai-menu-image",
    displayName: "Menu AI — Foto Generator",
    description: "Genera immagini food-porn iper-realistiche per ogni piatto del menu con styling adattivo per categoria.",
    icon: "Camera", image: agentPhotoGen, color: "#EF4444",
    model: "Gemini 2.5 Flash Image", modelBadgeColor: "bg-emerald-500/20 text-emerald-400",
    file: "supabase/functions/ai-menu/index.ts (action: generate-image)",
    trigger: "On-demand (genera immagine piatto)",
    industries: ["food"],
    inputDesc: "Descrizione piatto + categoria", outputDesc: "URL immagine generata",
    costPerCall: 0.008, testable: false, testType: "custom",
  },
  {
    name: "ai-translate",
    displayName: "Traduttore Menu IA",
    description: "Traduce automaticamente il menu in 10+ lingue con terminologia gastronomica naturale e appetitosa.",
    icon: "Globe", image: agentTranslator, color: "#3B82F6",
    model: "Gemini 3 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "supabase/functions/ai-translate/index.ts",
    trigger: "On-demand (traduzione menu)",
    industries: ["food"],
    inputDesc: "Array menu items + lingue target", outputDesc: "JSON traduzioni per ogni piatto",
    costPerCall: 0.004, testable: false, testType: "custom",
  },
  {
    name: "ai-inventory",
    displayName: "Inventario Predittivo IA",
    description: "Analizza ordini recenti e menu per prevedere scorte in esaurimento e suggerire il Piatto del Giorno.",
    icon: "Package", image: agentInventory, color: "#8B5CF6",
    model: "Gemini 3 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "supabase/functions/ai-inventory/index.ts",
    trigger: "On-demand (analisi inventario)",
    industries: ["food"],
    inputDesc: "Restaurant ID + ordini + menu", outputDesc: "Alert scorte, suggerimento Piatto del Giorno",
    costPerCall: 0.003, testable: false, testType: "custom",
  },
  // ═══ Part 6 — Universal Agents ═══
  {
    name: "concierge-ai",
    displayName: "Empire Concierge AI",
    description: "Receptionist AI multi-canale (WhatsApp, Chat, Email). Prenota appuntamenti in autonomia, qualifica lead, gestisce reclami, upsell contestuale. Multilingua automatico.",
    icon: "MessageSquare", image: agentConciergeAi, color: "#10B981",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/concierge-ai",
    trigger: "Autonomo (multi-canale 24/7)",
    industries: ["food", "ncc", "beauty", "healthcare", "retail", "fitness", "hospitality", "plumber", "electrician", "cleaning", "legal", "accounting", "photography", "veterinary", "tattoo", "childcare", "education", "events", "logistics"],
    inputDesc: "Messaggi cliente multi-canale + contesto aziendale", outputDesc: "Risposta automatica + azioni (prenotazione, lead, escalation)",
    costPerCall: 0.004, testable: true, testType: "chat",
  },
  {
    name: "analytics-brain",
    displayName: "Empire Analytics Brain",
    description: "Revenue forecasting 30/60/90 giorni, churn prediction, peak hour optimizer, pricing intelligence, anomaly detection. Weekly CEO Brief automatico.",
    icon: "BarChart3", image: agentAnalyticsBrain, color: "#F59E0B",
    model: "Gemini 2.5 Pro", modelBadgeColor: "bg-amber-500/20 text-amber-400",
    file: "ai-marketplace/analytics-brain",
    trigger: "Schedulato (giornaliero + on-demand)",
    industries: ["food", "ncc", "beauty", "healthcare", "retail", "fitness", "hospitality", "plumber", "electrician", "cleaning", "legal", "accounting", "photography", "veterinary", "tattoo", "childcare", "education", "events", "logistics"],
    inputDesc: "Dati vendite, clienti, ordini", outputDesc: "Report predittivi + insight + alert",
    costPerCall: 0.008, testable: false, testType: "custom",
  },
  {
    name: "social-manager",
    displayName: "Empire Social Manager AI",
    description: "Piano editoriale mensile, auto-post su Instagram/Facebook/TikTok/Google Business, risponde a TUTTE le recensioni, competitor watch. Content calendar settoriale.",
    icon: "Globe", image: agentSocialManager, color: "#EC4899",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/social-manager",
    trigger: "Schedulato (giornaliero) + on-demand",
    industries: ["food", "ncc", "beauty", "healthcare", "retail", "fitness", "hospitality", "plumber", "electrician", "cleaning", "legal", "accounting", "photography", "veterinary", "tattoo", "childcare", "education", "events", "logistics"],
    inputDesc: "Brand info + storico post + recensioni", outputDesc: "Post pronti + risposte recensioni + analytics",
    costPerCall: 0.005, testable: false, testType: "custom",
  },
  {
    name: "sales-closer",
    displayName: "Empire Sales Closer AI",
    description: "Pipeline vendite autonoma: lead scoring AI, auto follow-up (giorno 1-3-7-14-30), preventivi automatici, gestione obiezioni, referral program, payment reminder.",
    icon: "DollarSign", image: agentSalesCloser, color: "#EF4444",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/sales-closer",
    trigger: "Autonomo (pipeline continua)",
    industries: ["food", "ncc", "beauty", "healthcare", "retail", "fitness", "hospitality", "plumber", "electrician", "cleaning", "legal", "accounting", "photography", "veterinary", "tattoo", "childcare", "education", "events", "logistics"],
    inputDesc: "Lead data + interazioni + pricing rules", outputDesc: "Score lead + preventivi + follow-up automatici",
    costPerCall: 0.006, testable: false, testType: "custom",
  },
  {
    name: "document-ai",
    displayName: "Empire Document AI",
    description: "Genera fatture elettroniche (XML SDI), preventivi, contratti, report periodici, certificati, lettere formali, privacy/GDPR in automatico.",
    icon: "FileText", image: agentDocumentAi, color: "#6366F1",
    model: "Gemini 3 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/document-ai",
    trigger: "On-demand (generazione documenti)",
    industries: ["food", "ncc", "beauty", "healthcare", "retail", "fitness", "hospitality", "plumber", "electrician", "cleaning", "legal", "accounting", "photography", "veterinary", "tattoo", "childcare", "education", "events", "logistics"],
    inputDesc: "Tipo documento + dati compilazione", outputDesc: "PDF/XML documento generato",
    costPerCall: 0.003, testable: false, testType: "custom",
  },
  {
    name: "smart-notifier",
    displayName: "Empire Smart Notifier",
    description: "Notifiche intelligenti: sceglie canale migliore (email/SMS/WhatsApp/push), timing optimizer, A/B test automatico, frequency cap, escalation chain.",
    icon: "Bell", image: agentSmartNotifier, color: "#0EA5E9",
    model: "Gemini 2.5 Flash Lite", modelBadgeColor: "bg-cyan-500/20 text-cyan-400",
    file: "ai-marketplace/smart-notifier",
    trigger: "Autonomo (event-driven)",
    industries: ["food", "ncc", "beauty", "healthcare", "retail", "fitness", "hospitality", "plumber", "electrician", "cleaning", "legal", "accounting", "photography", "veterinary", "tattoo", "childcare", "education", "events", "logistics"],
    inputDesc: "Evento trigger + profilo destinatario", outputDesc: "Notifica ottimizzata su canale migliore",
    costPerCall: 0.001, testable: false, testType: "custom",
  },
  {
    name: "compliance-guardian",
    displayName: "Empire Compliance Guardian",
    description: "GDPR monitor, scadenze fiscali italiane, contratti in scadenza, certificazioni obbligatorie, backup verifier, audit trail completo.",
    icon: "ShieldCheck", image: agentComplianceGuardian, color: "#14B8A6",
    model: "Gemini 3 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/compliance-guardian",
    trigger: "Schedulato (giornaliero) + alert",
    industries: ["food", "ncc", "beauty", "healthcare", "retail", "fitness", "hospitality", "plumber", "electrician", "cleaning", "legal", "accounting", "photography", "veterinary", "tattoo", "childcare", "education", "events", "logistics"],
    inputDesc: "Dati aziendali + scadenze + normativa", outputDesc: "Alert conformità + checklist + audit log",
    costPerCall: 0.002, testable: false, testType: "custom",
  },
  // ═══ Part 6 — Operations AI (settore-specifici) ═══
  {
    name: "ops-food",
    displayName: "Operations AI — Food",
    description: "KDS, food cost calculator, waste tracker, inventory AI predittivo, HACCP monitor automatico. Gestione completa cucina e sala.",
    icon: "ChefHat", image: agentOpsFood, color: "#C8963E",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/ops-food",
    trigger: "Autonomo (real-time operations)",
    industries: ["food"],
    inputDesc: "Ordini + menu + inventario + HACCP logs", outputDesc: "Alert operativi + ottimizzazione + compliance",
    costPerCall: 0.005, testable: false, testType: "custom",
  },
  {
    name: "ops-ncc",
    displayName: "Operations AI — NCC",
    description: "Fleet map live, dynamic pricing engine, driver dispatch intelligente, flight monitor con aggiustamento automatico pickup, vehicle expense tracker.",
    icon: "Car", image: agentOpsNcc, color: "#1E3A5F",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/ops-ncc",
    trigger: "Autonomo (real-time fleet)",
    industries: ["ncc"],
    inputDesc: "Flotta + prenotazioni + GPS + voli", outputDesc: "Dispatch ottimale + pricing dinamico + alert",
    costPerCall: 0.006, testable: false, testType: "custom",
  },
  {
    name: "ops-beauty",
    displayName: "Operations AI — Beauty",
    description: "Smart booking con AI stylist, staff commission tracker, loyalty gamification (Bronze→Diamond), before/after gallery, virtual try-on.",
    icon: "Scissors", image: agentOpsBeauty, color: "#E91E8C",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/ops-beauty",
    trigger: "Autonomo (booking + loyalty)",
    industries: ["beauty"],
    inputDesc: "Appuntamenti + staff + clienti + storico", outputDesc: "Suggerimenti booking + commissioni + loyalty",
    costPerCall: 0.004, testable: false, testType: "custom",
  },
  {
    name: "ops-healthcare",
    displayName: "Operations AI — Healthcare",
    description: "AI Triage assistant, prescription manager con alert interazioni, telemedicina integrata, lab integration HL7/FHIR, GDPR Health Data Vault.",
    icon: "Heart", image: agentOpsHealthcare, color: "#10B981",
    model: "Gemini 2.5 Pro", modelBadgeColor: "bg-amber-500/20 text-amber-400",
    file: "ai-marketplace/ops-healthcare",
    trigger: "Autonomo (triage + prescrizioni)",
    industries: ["healthcare"],
    inputDesc: "Cartelle cliniche + farmaci + referti", outputDesc: "Triage score + alert interazioni + prescrizioni",
    costPerCall: 0.010, testable: false, testType: "custom",
  },
  {
    name: "ops-construction",
    displayName: "Operations AI — Construction",
    description: "Project timeline Gantt, safety compliance checker, material cost tracker, subcontractor portal, site photo journal con geolocalizzazione.",
    icon: "Wrench", image: agentOpsConstruction, color: "#F97316",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/ops-construction",
    trigger: "Autonomo (project tracking)",
    industries: ["construction"],
    inputDesc: "Cantiere + materiali + subappaltatori + sicurezza", outputDesc: "Alert budget + sicurezza + timeline",
    costPerCall: 0.005, testable: false, testType: "custom",
  },
  // ═══ Part 7 — New Sector Operations AI ═══
  {
    name: "ops-retail",
    displayName: "Operations AI — Retail",
    description: "Gestione inventario multi-sede, dynamic pricing AI, analisi sell-through, planogramma ottimizzato, alert riordino automatico, customer heatmap analytics.",
    icon: "Package", image: agentInventory, color: "#1a1a1a",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/ops-retail",
    trigger: "Autonomo (inventory + pricing)",
    industries: ["retail"],
    inputDesc: "Vendite + inventario + competitor pricing", outputDesc: "Alert stock + pricing suggerimenti + report",
    costPerCall: 0.005, testable: false, testType: "custom",
  },
  {
    name: "ops-fitness",
    displayName: "Operations AI — Fitness",
    description: "Class scheduler AI, membership churn predictor, PT matching algorithm, body progress tracker, equipment maintenance scheduler, peak hour optimizer.",
    icon: "Activity", image: agentAnalyticsBrain, color: "#F97316",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/ops-fitness",
    trigger: "Autonomo (scheduling + retention)",
    industries: ["fitness"],
    inputDesc: "Iscrizioni + classi + check-in + equipment", outputDesc: "Schedule ottimale + churn alert + manutenzione",
    costPerCall: 0.004, testable: false, testType: "custom",
  },
  {
    name: "ops-hotel",
    displayName: "Operations AI — Hospitality",
    description: "Revenue management AI, yield pricing 365gg, housekeeping dispatch, guest sentiment analyzer, upsell automatico servizi ancillari, channel equilibrator.",
    icon: "Star", image: agentConciergeAi, color: "#8B6F2E",
    model: "Gemini 2.5 Pro", modelBadgeColor: "bg-amber-500/20 text-amber-400",
    file: "ai-marketplace/ops-hotel",
    trigger: "Autonomo (revenue + operations)",
    industries: ["hospitality"],
    inputDesc: "Prenotazioni + tariffe + recensioni + OTA", outputDesc: "Pricing dinamico + housekeeping + upsell",
    costPerCall: 0.008, testable: false, testType: "custom",
  },
  {
    name: "ops-beach",
    displayName: "Operations AI — Beach Club",
    description: "Mappa interattiva ombrelloni, dynamic pricing stagionale, meteo-based auto-promos, food delivery spiaggia, pass e abbonamenti, occupancy heatmap.",
    icon: "Eye", image: agentSocialManager, color: "#06B6D4",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/ops-beach",
    trigger: "Autonomo (booking + weather)",
    industries: ["beach"],
    inputDesc: "Mappa + prenotazioni + meteo + stagione", outputDesc: "Pricing dinamico + promo meteo + alert",
    costPerCall: 0.004, testable: false, testType: "custom",
  },
  {
    name: "ops-trades",
    displayName: "Operations AI — Artigiani",
    description: "Dispatch interventi AI, preventivi automatici con foto, tracking materiali, firma digitale su iPad, fatturazione immediata post-intervento.",
    icon: "Wrench", image: agentOpsConstruction, color: "#3B82F6",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/ops-trades",
    trigger: "Autonomo (dispatch + billing)",
    industries: ["plumber", "electrician", "cleaning", "gardening"],
    inputDesc: "Richieste + disponibilità + materiali", outputDesc: "Dispatch ottimale + preventivo + fattura",
    costPerCall: 0.004, testable: false, testType: "custom",
  },
  {
    name: "ops-legal",
    displayName: "Operations AI — Studi Professionali",
    description: "Gestione pratiche AI, scadenze processuali, redazione atti automatica, time tracking per parcella, conflict checker, archiviazione intelligente.",
    icon: "FileText", image: agentDocumentAi, color: "#6366F1",
    model: "Gemini 3 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/ops-legal",
    trigger: "Autonomo (deadline + documenti)",
    industries: ["legal", "accounting"],
    inputDesc: "Pratiche + scadenze + documenti + clienti", outputDesc: "Alert scadenze + bozze atti + parcelle",
    costPerCall: 0.006, testable: false, testType: "custom",
  },
  {
    name: "ops-veterinary",
    displayName: "Operations AI — Veterinaria",
    description: "Schede pazienti animali, reminder vaccinazioni, triage telefonico AI, prescrizioni con dosaggio peso-based, photo dermatologia AI.",
    icon: "Heart", image: agentOpsHealthcare, color: "#22C55E",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/ops-veterinary",
    trigger: "Autonomo (triage + prescrizioni)",
    industries: ["veterinary"],
    inputDesc: "Cartelle animali + farmaci + vaccini", outputDesc: "Triage + reminder + prescrizioni",
    costPerCall: 0.004, testable: false, testType: "custom",
  },
  {
    name: "ops-events",
    displayName: "Operations AI — Eventi",
    description: "Timeline planner drag&drop, vendor management, budget tracker real-time, guest list con QR check-in, seating chart AI, catering optimizer.",
    icon: "Star", image: agentSalesCloser, color: "#D946EF",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/ops-events",
    trigger: "Autonomo (planning + logistics)",
    industries: ["events"],
    inputDesc: "Brief evento + fornitori + budget + ospiti", outputDesc: "Timeline + budget alert + seating",
    costPerCall: 0.005, testable: false, testType: "custom",
  },
  // ═══ Part 8 — New Universal Agents ═══
  {
    name: "reputation-manager",
    displayName: "Empire Reputation Manager",
    description: "Monitora e risponde automaticamente a recensioni Google, TripAdvisor, Trustpilot. Sentiment analysis, alert negativi in tempo reale, template risposta settoriali.",
    icon: "Star", image: agentSocialManager, color: "#F59E0B",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/reputation-manager",
    trigger: "Autonomo (polling recensioni + alert)",
    industries: ["food", "ncc", "beauty", "healthcare", "retail", "fitness", "hospitality", "plumber", "electrician", "veterinary", "tattoo", "events"],
    inputDesc: "Recensioni + storico risposte + brand voice", outputDesc: "Risposte auto + sentiment report + alert",
    costPerCall: 0.003, testable: false, testType: "custom",
  },
  {
    name: "whatsapp-commerce",
    displayName: "WhatsApp Commerce AI",
    description: "Catalogo prodotti/servizi su WhatsApp, ordini in-chat, pagamenti via link, conferme automatiche, broadcast promo segmentate, customer journey tracking.",
    icon: "MessageSquare", image: agentSmartNotifier, color: "#25D366",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/whatsapp-commerce",
    trigger: "Autonomo (WhatsApp Business API)",
    industries: ["food", "beauty", "retail", "fitness", "hospitality", "plumber", "electrician", "veterinary", "tattoo", "events"],
    inputDesc: "Catalogo + ordini + template + contatti", outputDesc: "Messaggi auto + ordini + analytics",
    costPerCall: 0.002, testable: false, testType: "custom",
  },
  {
    name: "loyalty-engine",
    displayName: "Empire Loyalty Engine",
    description: "Programma fedeltà multi-tier (Bronze→Diamond), punti automatici, referral program, birthday automation, gamification con badge e sfide, cashback intelligente.",
    icon: "Crown", image: agentSalesCloser, color: "#C8963E",
    model: "Gemini 2.5 Flash Lite", modelBadgeColor: "bg-cyan-500/20 text-cyan-400",
    file: "ai-marketplace/loyalty-engine",
    trigger: "Autonomo (event-driven per transazione)",
    industries: ["food", "beauty", "retail", "fitness", "hospitality", "beach", "veterinary", "tattoo"],
    inputDesc: "Transazioni + profilo cliente + tier rules", outputDesc: "Punti + tier upgrade + reward auto",
    costPerCall: 0.001, testable: false, testType: "custom",
  },
  {
    name: "scheduling-optimizer",
    displayName: "Empire Scheduling Optimizer",
    description: "Ottimizzazione turni staff con vincoli legali italiani, demand forecasting per fascia oraria, gestione ferie/permessi, alert straordinari, export buste paga.",
    icon: "Clock", image: agentAnalyticsBrain, color: "#6366F1",
    model: "Gemini 2.5 Flash", modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "ai-marketplace/scheduling-optimizer",
    trigger: "Schedulato (settimanale + on-demand)",
    industries: ["food", "beauty", "healthcare", "retail", "fitness", "hospitality", "beach", "cleaning", "events"],
    inputDesc: "Staff + contratti + storico presenze + demand", outputDesc: "Turni ottimizzati + alert + export payroll",
    costPerCall: 0.004, testable: false, testType: "custom",
  },
  {
    name: "payment-recovery",
    displayName: "Empire Payment Recovery",
    description: "Recupero crediti automatico: reminder escalation (gentile→formale→legale), rate di pagamento AI, solleciti multi-canale, gestione dispute, SEPA direct debit.",
    icon: "DollarSign", image: agentDocumentAi, color: "#EF4444",
    model: "Gemini 2.5 Flash Lite", modelBadgeColor: "bg-cyan-500/20 text-cyan-400",
    file: "ai-marketplace/payment-recovery",
    trigger: "Autonomo (scadenze pagamento)",
    industries: ["food", "ncc", "beauty", "healthcare", "retail", "fitness", "hospitality", "plumber", "electrician", "construction", "legal", "accounting", "events", "logistics"],
    inputDesc: "Fatture scadute + storico pagamenti + contatti", outputDesc: "Solleciti auto + piani rateali + escalation",
    costPerCall: 0.002, testable: false, testType: "custom",
  },
];

const INDUSTRY_LABELS: Record<string, string> = {
  food: "🍽 Food", ncc: "🚗 NCC", beauty: "💇 Beauty", healthcare: "🏥 Salute",
  retail: "🛍 Retail", fitness: "💪 Fitness", hospitality: "🏨 Hotel",
  plumber: "🔧 Idraulico", electrician: "⚡ Elettricista", cleaning: "🧹 Pulizie",
  legal: "⚖️ Legale", accounting: "🧮 Commercialista", photography: "📷 Foto",
  veterinary: "🐾 Veterinario", tattoo: "🎨 Tattoo", childcare: "👶 Infanzia",
  education: "🎓 Formazione", events: "🎉 Eventi", logistics: "🚚 Logistica",
  construction: "🏗 Edilizia", gardening: "🌿 Giardinaggio",
};

const PIE_COLORS = ["#C8963E", "#8B5CF6", "#10B981", "#EC4899", "#F97316", "#EF4444", "#3B82F6", "#6366F1", "#0EA5E9", "#14B8A6", "#1E3A5F", "#E91E8C", "#F59E0B", "#22C55E", "#A855F7", "#06B6D4", "#D946EF", "#84CC16", "#FB923C", "#64748B"];

// ─── Mock data ───
function generateMockData() {
  const now = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now); d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });
  const dailyData = days.map(day => {
    const isWeekend = [0, 6].includes(new Date(day).getDay());
    const base = isWeekend ? 60 : 40;
    return {
      day: day.slice(5),
      "empire-assistant": Math.floor(base * (0.8 + Math.random() * 0.4)),
      "empire-voice-agent": Math.floor(8 + Math.random() * 12),
      "restaurant-voice-agent": Math.floor(15 + Math.random() * 25),
      "empire-tts": Math.floor(20 + Math.random() * 30),
      "ai-menu-ocr": Math.floor(5 + Math.random() * 8),
      "ai-menu-image": Math.floor(10 + Math.random() * 15),
      "ai-translate": Math.floor(3 + Math.random() * 6),
      "ai-inventory": Math.floor(8 + Math.random() * 10),
      "concierge-ai": Math.floor(30 + Math.random() * 50),
      "analytics-brain": Math.floor(5 + Math.random() * 10),
      "social-manager": Math.floor(12 + Math.random() * 20),
      "sales-closer": Math.floor(8 + Math.random() * 15),
      "document-ai": Math.floor(15 + Math.random() * 25),
      "smart-notifier": Math.floor(40 + Math.random() * 60),
      "compliance-guardian": Math.floor(3 + Math.random() * 8),
      "ops-food": Math.floor(20 + Math.random() * 30),
      "ops-ncc": Math.floor(10 + Math.random() * 20),
      "ops-beauty": Math.floor(8 + Math.random() * 15),
      "ops-healthcare": Math.floor(5 + Math.random() * 12),
      "ops-construction": Math.floor(4 + Math.random() * 10),
    };
  });
  const topAccounts = [
    { name: "Ristorante Da Mario", industry: "food", calls: 1240, tokens: 1850000, cost: 18.50, trend: 12 },
    { name: "Pizzeria Vesuvio", industry: "food", calls: 890, tokens: 1200000, cost: 12.80, trend: -5 },
    { name: "NCC Executive Roma", industry: "ncc", calls: 620, tokens: 980000, cost: 9.20, trend: 23 },
    { name: "Glow Beauty Milano", industry: "beauty", calls: 450, tokens: 650000, cost: 6.10, trend: 8 },
    { name: "Trattoria Nonna Rosa", industry: "food", calls: 380, tokens: 520000, cost: 5.40, trend: -2 },
  ];
  const recentLogs = Array.from({ length: 50 }, (_, i) => {
    const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
    const account = topAccounts[Math.floor(Math.random() * topAccounts.length)];
    const d = new Date(now); d.setMinutes(d.getMinutes() - i * 12);
    return {
      id: `log-${i}`, timestamp: d.toISOString(), agent: agent.name, account: account.name,
      industry: account.industry, inputTokens: Math.floor(200 + Math.random() * 2000),
      outputTokens: Math.floor(100 + Math.random() * 1500), cost: +(0.001 + Math.random() * 0.01).toFixed(4),
      duration: Math.floor(800 + Math.random() * 3000), status: Math.random() < 0.05 ? "error" : "success",
    };
  });
  const alerts = [
    { id: "a1", type: "warning" as const, agent: "empire-assistant", message: "L'account 'Ristorante Da Mario' ha superato l'80% del budget mensile AI", isRead: false, createdAt: new Date(now.getTime() - 3600000).toISOString(), severity: "medium" as const, errorCode: "BUDGET_THRESHOLD", diagnostics: { cpuUsage: "32%", memoryUsage: "58%", lastRestart: "2h fa", uptime: "48h 12m" }, suggestedFix: "Aumenta il budget mensile o riduci la frequenza delle chiamate." },
    { id: "a2", type: "error" as const, agent: "ai-menu-image", message: "L'agente 'Foto Generator' ha avuto 12 errori nell'ultima ora", isRead: false, createdAt: new Date(now.getTime() - 7200000).toISOString(), severity: "critical" as const, errorCode: "RATE_LIMIT_EXCEEDED", diagnostics: { cpuUsage: "89%", memoryUsage: "92%", lastRestart: "6h fa", uptime: "6h 03m", errorRate: "18%", lastError: "TimeoutError: Model response exceeded 30s limit", failedCalls: 12, totalCalls: 67 }, suggestedFix: "Riavvia l'agente e verifica i limiti di rate del modello AI." },
    { id: "a3", type: "error" as const, agent: "ai-translate", message: "Connessione al modello di traduzione persa — 3 tentativi falliti", isRead: false, createdAt: new Date(now.getTime() - 1800000).toISOString(), severity: "high" as const, errorCode: "CONNECTION_LOST", diagnostics: { cpuUsage: "12%", memoryUsage: "34%", lastRestart: "12h fa", uptime: "12h 45m", errorRate: "100%", lastError: "ConnectionRefusedError: Unable to reach translation endpoint", failedCalls: 3, totalCalls: 3 }, suggestedFix: "Verifica la connettività di rete e riavvia il servizio." },
  ];
  return { dailyData, topAccounts, recentLogs, alerts };
}

// ─── Agent Avatar — Futuristic holographic style ───
function AgentAvatar({ agent, size = 48 }: { agent: AgentDef; size?: number }) {
  const imgSrc = AGENT_IMAGES[agent.name] || agent.image;
  const ringSize = size + 10;
  return (
    <div className="relative shrink-0" style={{ width: ringSize, height: ringSize }}>
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `conic-gradient(from 0deg, ${agent.color}00, ${agent.color}55, ${agent.color}00, ${agent.color}33, ${agent.color}00)`,
          filter: `blur(2px)`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      {/* Ambient glow */}
      <div
        className="absolute inset-1 rounded-[14px] blur-md opacity-40"
        style={{ background: agent.color }}
      />
      {/* Image container */}
      <div
        className="absolute inset-[5px] rounded-xl overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${agent.color}20, hsl(var(--card)))`,
          border: `1.5px solid ${agent.color}55`,
          boxShadow: `0 0 20px ${agent.color}22, inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      >
        <img src={imgSrc} alt={agent.displayName} className="w-full h-full object-cover" />
        {/* Scanning beam overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(180deg, transparent 35%, ${agent.color}18 50%, transparent 65%)` }}
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
        />
        {/* Top edge light */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${agent.color}66, transparent)` }} />
        {/* Inner ring */}
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
      </div>
      {/* Corner HUD accents */}
      <div className="absolute top-[3px] right-[3px] w-2 h-2 border-t border-r rounded-tr-md" style={{ borderColor: `${agent.color}55` }} />
      <div className="absolute bottom-[3px] left-[3px] w-2 h-2 border-b border-l rounded-bl-md" style={{ borderColor: `${agent.color}55` }} />
    </div>
  );
}

// ─── Status Badge ───
function StatusBadge({ status }: { status: "active" | "standby" | "error" | "disabled" }) {
  const config = {
    active: { label: "Attivo", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400 animate-pulse" },
    standby: { label: "Standby", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", dot: "bg-yellow-400" },
    error: { label: "Errore", className: "bg-red-500/20 text-red-400 border-red-500/30", dot: "bg-red-400 animate-ping" },
    disabled: { label: "Disabilitato", className: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground" },
  }[status];
  return (
    <Badge variant="outline" className={`${config.className} text-[10px] gap-1`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </Badge>
  );
}

// ─── Main Page ───
export default function AgentsPage() {
  const { user, roles, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedAgent, setSelectedAgent] = useState<AgentDef | null>(null);
  const [chartMode, setChartMode] = useState<"calls" | "cost">("calls");
  const [searchAccount, setSearchAccount] = useState("");
  const [testPrompt, setTestPrompt] = useState("");
  const [testResult, setTestResult] = useState("");
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  // Edit states
  const [editEnabled, setEditEnabled] = useState(true);
  const [editMaxCalls, setEditMaxCalls] = useState(100);
  const [editMaxBudget, setEditMaxBudget] = useState(20);
  const [editIndustries, setEditIndustries] = useState<string[]>([]);
  const [editPromptOverride, setEditPromptOverride] = useState("");
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editModel, setEditModel] = useState("");
  const [editCostPerCall, setEditCostPerCall] = useState(0);
  const [editTrigger, setEditTrigger] = useState("");

  // Bulk action states
  const [bulkAction, setBulkAction] = useState<"enable_all" | "disable_all" | null>(null);

  const mock = useMemo(() => generateMockData(), []);

  // Query agent configs
  const { data: agentConfigs, isLoading: configsLoading } = useQuery({
    queryKey: ["ai-agent-configs"],
    queryFn: async () => {
      const { data } = await supabase.from("ai_agent_configs").select("*");
      return data || [];
    },
  });

  const { data: todayLogs } = useQuery({
    queryKey: ["ai-usage-today"],
    queryFn: async () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString();
      const { count } = await supabase
        .from("ai_usage_logs")
        .select("*", { count: "exact", head: true })
        .gte("created_at", yesterday);
      return count || 0;
    },
  });

  // Upsert config mutation
  const upsertConfig = useMutation({
    mutationFn: async (config: {
      agent_name: string; is_enabled: boolean; max_calls_per_hour: number;
      max_monthly_budget_usd: number; allowed_industries: string[];
      system_prompt_override: string | null; display_name: string;
      description: string; icon: string; color: string;
    }) => {
      const { data: existing } = await supabase
        .from("ai_agent_configs").select("id").eq("agent_name", config.agent_name).maybeSingle();
      if (existing) {
        const { error } = await supabase.from("ai_agent_configs").update({
          is_enabled: config.is_enabled, max_calls_per_hour: config.max_calls_per_hour,
          max_monthly_budget_usd: config.max_monthly_budget_usd, allowed_industries: config.allowed_industries,
          system_prompt_override: config.system_prompt_override, display_name: config.display_name,
          description: config.description, icon: config.icon, color: config.color,
          updated_at: new Date().toISOString(),
        }).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("ai_agent_configs").insert({
          agent_name: config.agent_name, is_enabled: config.is_enabled,
          max_calls_per_hour: config.max_calls_per_hour, max_monthly_budget_usd: config.max_monthly_budget_usd,
          allowed_industries: config.allowed_industries, system_prompt_override: config.system_prompt_override,
          display_name: config.display_name, description: config.description,
          icon: config.icon, color: config.color,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-agent-configs"] });
      toast({ title: "✅ Configurazione salvata" });
    },
    onError: (e: any) => {
      toast({ title: "❌ Errore", description: e.message, variant: "destructive" });
    },
  });

  // Toggle single agent
  const toggleAgent = useMutation({
    mutationFn: async ({ agent_name, is_enabled }: { agent_name: string; is_enabled: boolean }) => {
      const { data: existing } = await supabase
        .from("ai_agent_configs").select("id").eq("agent_name", agent_name).maybeSingle();
      if (existing) {
        const { error } = await supabase.from("ai_agent_configs")
          .update({ is_enabled, updated_at: new Date().toISOString() }).eq("id", existing.id);
        if (error) throw error;
      } else {
        const agentDef = AGENTS.find(a => a.name === agent_name)!;
        const { error } = await supabase.from("ai_agent_configs").insert({
          agent_name, is_enabled, display_name: agentDef.displayName,
          description: agentDef.description, icon: agentDef.icon, color: agentDef.color,
          allowed_industries: agentDef.industries,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-agent-configs"] });
      toast({ title: "✅ Stato agente aggiornato" });
    },
  });

  const ALL_INDUSTRIES = ["food", "ncc", "beauty", "healthcare", "retail", "fitness", "hospitality", "beach", "plumber", "electrician", "agriturismo", "cleaning", "legal", "accounting", "garage", "photography", "construction", "gardening", "veterinary", "tattoo", "childcare", "education", "events", "logistics", "custom"];

  // Bulk toggle all agents
  const bulkToggle = useMutation({
    mutationFn: async (enable: boolean) => {
      for (const agent of AGENTS) {
        const { data: existing } = await supabase
          .from("ai_agent_configs").select("id").eq("agent_name", agent.name).maybeSingle();
        if (existing) {
          await supabase.from("ai_agent_configs")
            .update({ is_enabled: enable, updated_at: new Date().toISOString() }).eq("id", existing.id);
        } else {
          await supabase.from("ai_agent_configs").insert({
            agent_name: agent.name, is_enabled: enable, display_name: agent.displayName,
            description: agent.description, icon: agent.icon, color: agent.color,
            allowed_industries: agent.industries,
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-agent-configs"] });
      toast({ title: "✅ Tutti gli agenti aggiornati" });
      setBulkAction(null);
    },
  });

  // Bulk activate ALL agents in ALL industries
  const bulkActivateAll = useMutation({
    mutationFn: async () => {
      for (const agent of AGENTS) {
        const { data: existing } = await supabase
          .from("ai_agent_configs").select("id").eq("agent_name", agent.name).maybeSingle();
        if (existing) {
          await supabase.from("ai_agent_configs")
            .update({ is_enabled: true, allowed_industries: ALL_INDUSTRIES, updated_at: new Date().toISOString() }).eq("id", existing.id);
        } else {
          await supabase.from("ai_agent_configs").insert({
            agent_name: agent.name, is_enabled: true, display_name: agent.displayName,
            description: agent.description, icon: agent.icon, color: agent.color,
            allowed_industries: ALL_INDUSTRIES,
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-agent-configs"] });
      toast({ title: "🚀 Tutti gli agenti attivati su tutti i 25 settori!", description: `${AGENTS.length} agenti ora coprono ${ALL_INDUSTRIES.length} settori.` });
    },
  });

  const getAgentConfig = useCallback((agentName: string) => {
    return agentConfigs?.find((c: any) => c.agent_name === agentName);
  }, [agentConfigs]);

  const isAgentEnabled = useCallback((agentName: string) => {
    const config = getAgentConfig(agentName);
    return config ? config.is_enabled !== false : true;
  }, [getAgentConfig]);

  // Populate edit fields when selecting agent
  useEffect(() => {
    if (selectedAgent) {
      const config = getAgentConfig(selectedAgent.name);
      setEditEnabled(config ? config.is_enabled !== false : true);
      setEditMaxCalls(config?.max_calls_per_hour ?? 100);
      setEditMaxBudget(config?.max_monthly_budget_usd ?? 20);
      setEditIndustries(config?.allowed_industries ?? selectedAgent.industries);
      setEditPromptOverride(config?.system_prompt_override ?? "");
      setEditDisplayName(config?.display_name ?? selectedAgent.displayName);
      setEditDescription(config?.description ?? selectedAgent.description);
      setEditModel(selectedAgent.model);
      setEditCostPerCall(selectedAgent.costPerCall);
      setEditTrigger(selectedAgent.trigger);
      setTestPrompt(""); setTestResult("");
    }
  }, [selectedAgent, getAgentConfig]);

  useEffect(() => {
    if (!authLoading && !roles.includes("super_admin")) navigate("/app");
  }, [roles, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeCount = AGENTS.filter(a => isAgentEnabled(a.name)).length;
  const disabledCount = AGENTS.length - activeCount;
  const totalCostMonth = mock.topAccounts.reduce((s, a) => s + a.cost, 0);
  const topAccount = mock.topAccounts[0];
  const callsToday = todayLogs || Object.values(mock.dailyData[mock.dailyData.length - 1]).reduce((s: number, v) => typeof v === "number" ? s + v : s, 0);
  const successRate = mock.recentLogs.filter(l => l.status === "success").length / mock.recentLogs.length * 100;

  const pieData = AGENTS.map((a, i) => ({
    name: a.displayName.split(" — ")[0],
    value: mock.dailyData.reduce((s, d) => s + ((d as any)[a.name] || 0), 0),
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const filteredAccounts = mock.topAccounts.filter(a =>
    a.name.toLowerCase().includes(searchAccount.toLowerCase())
  );
  const unresolvedAlerts = mock.alerts.filter(a => !a.isRead);

  const handleSaveConfig = () => {
    if (!selectedAgent) return;
    upsertConfig.mutate({
      agent_name: selectedAgent.name, is_enabled: editEnabled,
      max_calls_per_hour: editMaxCalls, max_monthly_budget_usd: editMaxBudget,
      allowed_industries: editIndustries, system_prompt_override: editPromptOverride || null,
      display_name: editDisplayName || selectedAgent.displayName,
      description: editDescription || selectedAgent.description,
      icon: selectedAgent.icon, color: selectedAgent.color,
    });
  };

  const handleTest = async () => {
    if (!selectedAgent || !testPrompt.trim()) return;
    setTestLoading(true); setTestResult("");
    try {
      const functionName = selectedAgent.name === "ai-menu-ocr" || selectedAgent.name === "ai-menu-image"
        ? "ai-menu" : selectedAgent.name;
      if (selectedAgent.testType === "chat") {
        const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${functionName}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
          body: JSON.stringify({ messages: [{ role: "user", content: testPrompt }] }),
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
        const contentType = resp.headers.get("content-type") || "";
        if (contentType.includes("text/event-stream")) {
          const reader = resp.body?.getReader();
          const decoder = new TextDecoder();
          let result = "";
          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value, { stream: true });
              for (const line of chunk.split("\n")) {
                if (!line.startsWith("data: ") || line.includes("[DONE]")) continue;
                try {
                  const parsed = JSON.parse(line.slice(6));
                  const c = parsed.choices?.[0]?.delta?.content;
                  if (c) { result += c; setTestResult(result); }
                } catch {}
              }
            }
          }
          if (!result) setTestResult("(Risposta vuota)");
        } else {
          const json = await resp.json();
          setTestResult(JSON.stringify(json, null, 2));
        }
      } else {
        setTestResult("⚠ Questo agente richiede input specifici e non può essere testato con testo.");
      }
    } catch (e: any) {
      setTestResult(`❌ Errore: ${e.message}`);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header — Mobile Optimized */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-3 md:px-6 py-2.5 md:py-4">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <BackButton variant="inline" />
            <div className="min-w-0">
              <h1 className="text-base md:text-2xl font-bold flex items-center gap-1.5 truncate">
                <Brain className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0" />
                <span className="truncate">Intelligence Hub</span>
              </h1>
              <p className="text-[10px] md:text-sm text-muted-foreground mt-0.5 truncate">Gestisci e monitora gli agenti IA</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse text-[10px] md:text-xs h-5 md:h-6 px-1.5 md:px-2">
              {activeCount} attivi
            </Badge>
            <Button variant="outline" size="sm" className="gap-1 hidden md:flex" onClick={() => bulkToggle.mutate(true)}>
              <Power className="w-3.5 h-3.5 text-emerald-400" /> Tutti ON
            </Button>
            <Button variant="outline" size="sm" className="gap-1 hidden md:flex" onClick={() => bulkToggle.mutate(false)}>
              <PowerOff className="w-3.5 h-3.5 text-red-400" /> Tutti OFF
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7 md:h-8 md:w-auto md:px-3 md:gap-1" onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["ai-agent-configs"] });
              queryClient.invalidateQueries({ queryKey: ["ai-usage-today"] });
            }}>
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-xs">Aggiorna</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-3 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Hero Agent Figure + KPI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: "linear-gradient(135deg, hsl(var(--card)), hsl(var(--primary) / 0.06) 50%, hsl(var(--accent) / 0.04))",
            border: "1px solid hsl(var(--primary) / 0.15)",
          }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.6), hsl(var(--accent) / 0.5), transparent)" }} />
          {/* Corner HUD */}
          <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-primary/20 rounded-tl-sm" />
          <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-primary/20 rounded-tr-sm" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-primary/20 rounded-bl-sm" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-primary/20 rounded-br-sm" />
          {/* Ambient glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: "hsl(var(--primary))" }} />

          <div className="relative flex flex-col md:flex-row items-center gap-3 md:gap-6 p-4 md:p-6">
            {/* Animated Agent Character */}
            <motion.div
              className="relative w-28 h-28 md:w-36 md:h-36 shrink-0"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Orbital rings */}
              <motion.div
                className="absolute inset-[-12px] md:inset-[-16px] rounded-full border border-primary/15"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-[-6px] md:inset-[-8px] rounded-full border border-accent/10"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              {/* Orbiting dots */}
              <motion.div
                className="absolute w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                style={{ top: -8, left: "50%", transformOrigin: "0 68px" }}
              />
              <motion.div
                className="absolute w-1.5 h-1.5 rounded-full bg-accent shadow-lg shadow-accent/50"
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ top: -4, left: "50%", transformOrigin: "0 60px" }}
              />
              {/* Glow behind */}
              <div className="absolute inset-2 rounded-full blur-xl opacity-30" style={{ background: "hsl(var(--primary))" }} />
              {/* Character */}
              <motion.img
                src={agentHubHero}
                alt="AI Agent Hub"
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* KPI Grid */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <KPICard icon={<Brain className="w-4 h-4 md:w-5 md:h-5 text-primary" />} label="Agenti Totali" value={AGENTS.length.toString()} sub={`${activeCount} attivi / ${disabledCount} spenti`} />
                <KPICard icon={<DollarSign className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />} label="Costo Mese" value={`€${totalCostMonth.toFixed(2)}`} sub={<span className="text-emerald-400 flex items-center gap-0.5"><ArrowDownRight className="w-3 h-3" />-8%</span>} />
                <KPICard icon={<Medal className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />} label="Top Account" value={topAccount.name.split(" ").slice(0, 2).join(" ")} sub={`€${topAccount.cost}`} />
                <KPICard icon={<Zap className="w-4 h-4 md:w-5 md:h-5 text-accent" />} label="Oggi" value={callsToday.toString()} sub={`✅ ${successRate.toFixed(0)}%`} />
              </div>
              {/* Mobile bulk toggle */}
              <div className="flex gap-2 mt-3 md:hidden">
                <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] gap-1" onClick={() => bulkToggle.mutate(true)}>
                  <Power className="w-3 h-3 text-emerald-400" /> Tutti ON
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] gap-1" onClick={() => bulkToggle.mutate(false)}>
                  <PowerOff className="w-3 h-3 text-red-400" /> Tutti OFF
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alerts & Diagnostics Panel */}
        {unresolvedAlerts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full animate-ping" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full" />
                </div>
                <h3 className="text-xs font-semibold text-foreground">Problemi</h3>
                <Badge variant="destructive" className="text-[9px] h-4 px-1.5">{unresolvedAlerts.length}</Badge>
              </div>
              <Button variant="ghost" size="sm" className="h-6 text-[9px] gap-1 text-muted-foreground"
                onClick={() => { toast({ title: "Tutti archiviati" }); }}>
                <CheckCircle2 className="w-3 h-3" /> Archivia tutti
              </Button>
            </div>

            {unresolvedAlerts.map(alert => {
              const isExpanded = expandedAlert === alert.id;
              return (
              <motion.div key={alert.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl overflow-hidden border ${
                  alert.type === "error" 
                    ? "bg-destructive/5 border-destructive/20" 
                    : "bg-yellow-500/5 border-yellow-500/20"
                }`}>
                {/* Compact Header — always visible */}
                <button className="w-full px-3 py-2 flex items-center gap-2 text-left" onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                    alert.type === "error" ? "bg-destructive/15" : "bg-yellow-500/15"
                  }`}>
                    {alert.type === "error" ? <XCircle className="w-3 h-3 text-destructive" /> : <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-foreground truncate">{alert.message}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant="outline" className={`text-[8px] h-3.5 px-1 ${
                        alert.severity === "critical" ? "border-destructive/40 text-destructive" :
                        alert.severity === "high" ? "border-orange-500/40 text-orange-400" :
                        "border-yellow-500/40 text-yellow-500"
                      }`}>
                        {alert.severity === "critical" ? "🔴 Critico" : alert.severity === "high" ? "🟠 Alto" : "🟡 Medio"}
                      </Badge>
                      <span className="text-[9px] text-muted-foreground font-mono">{alert.errorCode}</span>
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {/* Expandable detail */}
                <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    {/* Diagnostics */}
                    <div className="px-3 py-1.5 bg-muted/30 border-t border-border/50 grid grid-cols-4 gap-1">
                      {[
                        { icon: <Activity className="w-2.5 h-2.5" />, label: "CPU", value: alert.diagnostics.cpuUsage, warn: parseInt(alert.diagnostics.cpuUsage) > 60 },
                        { icon: <BarChart3 className="w-2.5 h-2.5" />, label: "RAM", value: alert.diagnostics.memoryUsage, warn: parseInt(alert.diagnostics.memoryUsage) > 60 },
                        { icon: <RefreshCw className="w-2.5 h-2.5" />, label: "Restart", value: alert.diagnostics.lastRestart, warn: false },
                        { icon: <Clock className="w-2.5 h-2.5" />, label: "Up", value: alert.diagnostics.uptime, warn: false },
                      ].map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-0.5">
                          <span className="text-muted-foreground">{d.icon}</span>
                          <span className={`text-[9px] font-mono font-semibold ${
                            d.warn ? (parseInt(d.value) > 80 ? "text-destructive" : "text-yellow-500") : "text-foreground"
                          }`}>{d.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Error log */}
                    {alert.type === "error" && alert.diagnostics.lastError && (
                      <div className="px-3 py-1.5 bg-destructive/5 border-t border-destructive/10">
                        <code className="text-[9px] text-destructive/80 font-mono break-all leading-tight">{alert.diagnostics.lastError}</code>
                        {alert.diagnostics.failedCalls && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-muted-foreground">{alert.diagnostics.failedCalls}/{alert.diagnostics.totalCalls} fallite</span>
                            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden max-w-[80px]">
                              <div className="h-full bg-destructive rounded-full" style={{ width: `${(alert.diagnostics.failedCalls / (alert.diagnostics.totalCalls || 1)) * 100}%` }} />
                            </div>
                            <span className="text-[9px] font-mono text-destructive">{alert.diagnostics.errorRate}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* AI suggestion */}
                    <div className="px-3 py-1.5 border-t border-border/50 bg-primary/5">
                      <div className="flex items-start gap-1.5">
                        <Sparkles className="w-2.5 h-2.5 text-primary mt-0.5 shrink-0" />
                        <span className="text-[9px] text-primary/80"><span className="font-semibold">AI:</span> {alert.suggestedFix}</span>
                      </div>
                    </div>

                    {/* Actions — compact grid on mobile */}
                    <div className="px-3 py-2 border-t border-border/50 flex flex-wrap items-center gap-1.5">
                      {alert.type === "error" && (
                        <>
                          <Button size="sm" className="h-6 text-[9px] gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2"
                            onClick={() => toast({ title: "🔧 Auto-Repair avviato", description: `Riparazione "${alert.agent}" in corso...` })}>
                            <Wrench className="w-2.5 h-2.5" /> Repair
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 text-[9px] gap-1 px-2"
                            onClick={() => toast({ title: "Agente riavviato" })}>
                            <RefreshCw className="w-2.5 h-2.5" /> Riavvia
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 text-[9px] gap-1 px-2"
                            onClick={() => toast({ title: "Log errori" })}>
                            <Eye className="w-2.5 h-2.5" /> Log
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 text-[9px] gap-1 px-2"
                            onClick={() => toast({ title: "Rollback completato" })}>
                            <Download className="w-2.5 h-2.5" /> Rollback
                          </Button>
                        </>
                      )}
                      {alert.type === "warning" && (
                        <>
                          <Button size="sm" className="h-6 text-[9px] gap-1 bg-primary hover:bg-primary/90 text-primary-foreground px-2"
                            onClick={() => toast({ title: "Budget +20%" })}>
                            <TrendingUp className="w-2.5 h-2.5" /> +Budget
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 text-[9px] gap-1 px-2"
                            onClick={() => toast({ title: "Cliente notificato" })}>
                            <Bell className="w-2.5 h-2.5" /> Notifica
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 text-[9px] gap-1 px-2"
                            onClick={() => toast({ title: "Auto-Stop impostato" })}>
                            <ShieldCheck className="w-2.5 h-2.5" /> Auto-Stop
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" className="h-6 text-[9px] gap-1 text-muted-foreground ml-auto px-2"
                        onClick={() => toast({ title: "Archiviato" })}>
                        <CheckCircle2 className="w-2.5 h-2.5" /> Archivia
                      </Button>
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
              </motion.div>
              );
            })}
          </div>
        )}

        {/* Charts — Futuristic DNA Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="lg:col-span-2 relative overflow-hidden rounded-xl"
            style={{
              background: "linear-gradient(135deg, hsl(var(--card)), hsl(var(--card)) 60%, hsl(var(--primary) / 0.04))",
              border: "1px solid hsl(var(--primary) / 0.15)",
            }}
          >
            {/* DNA helix accent top */}
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.5), hsl(var(--accent) / 0.4), transparent)" }} />
            {/* Scanning beam */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ background: "linear-gradient(180deg, hsl(var(--primary) / 0.03) 0%, transparent 8%, transparent 92%, hsl(var(--primary) / 0.03) 100%)" }}
            />
            {/* Corner HUD accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-primary/25 rounded-tl-sm" />
            <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-primary/25 rounded-tr-sm" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-primary/25 rounded-bl-sm" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-primary/25 rounded-br-sm" />

            <div className="relative p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.12)", border: "1px solid hsl(var(--primary) / 0.2)" }}>
                    <BarChart3 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Attività AI Giornaliera</h3>
                    <p className="text-[10px] text-muted-foreground">Ultimi 14 giorni — analisi in tempo reale</p>
                  </div>
                </div>
                <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid hsl(var(--primary) / 0.2)" }}>
                  <button
                    className={`px-3.5 py-1.5 text-xs font-medium transition-all ${chartMode === "calls" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground bg-card"}`}
                    onClick={() => setChartMode("calls")}
                  >
                    <Activity className="w-3 h-3 inline mr-1" />Chiamate
                  </button>
                  <button
                    className={`px-3.5 py-1.5 text-xs font-medium transition-all ${chartMode === "cost" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground bg-card"}`}
                    onClick={() => setChartMode("cost")}
                  >
                    <DollarSign className="w-3 h-3 inline mr-1" />Costo €
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={mock.dailyData}>
                  <defs>
                    {AGENTS.slice(0, 5).map((a, i) => (
                      <linearGradient key={a.name} id={`grad-${a.name}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={PIE_COLORS[i % PIE_COLORS.length]} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={PIE_COLORS[i % PIE_COLORS.length]} stopOpacity={0.02} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
                  <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} axisLine={false} tickLine={false} width={35} />
                  <RechartsTooltip
                    contentStyle={{
                      background: "hsl(var(--card) / 0.95)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid hsl(var(--primary) / 0.2)",
                      borderRadius: 10,
                      color: "hsl(var(--foreground))",
                      fontSize: 11,
                      boxShadow: "0 8px 32px hsl(var(--primary) / 0.1)",
                    }}
                  />
                  {AGENTS.slice(0, 5).map((a, i) => (
                    <Area
                      key={a.name}
                      dataKey={a.name}
                      stackId="a"
                      fill={`url(#grad-${a.name})`}
                      stroke={PIE_COLORS[i % PIE_COLORS.length]}
                      strokeWidth={1.5}
                      name={a.displayName.split(" — ")[0]}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
              {/* Mini legend */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 justify-center">
                {AGENTS.slice(0, 5).map((a, i) => (
                  <span key={a.name} className="text-[9px] flex items-center gap-1 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full shadow-sm" style={{ background: PIE_COLORS[i % PIE_COLORS.length], boxShadow: `0 0 6px ${PIE_COLORS[i % PIE_COLORS.length]}44` }} />
                    {a.displayName.split(" — ")[0].split(" ").slice(0, 2).join(" ")}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, type: "spring" }}
            className="relative overflow-hidden rounded-xl"
            style={{
              background: "linear-gradient(160deg, hsl(var(--card)), hsl(var(--card)) 70%, hsl(var(--accent) / 0.04))",
              border: "1px solid hsl(var(--accent) / 0.15)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--accent) / 0.5), hsl(var(--primary) / 0.4), transparent)" }} />
            <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-accent/25 rounded-tl-sm" />
            <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-accent/25 rounded-tr-sm" />

            <div className="relative p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--accent) / 0.12)", border: "1px solid hsl(var(--accent) / 0.2)" }}>
                  <Activity className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Distribuzione Agenti</h3>
                  <p className="text-[10px] text-muted-foreground">Chiamate per agente — mese corrente</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} style={{ filter: `drop-shadow(0 0 4px ${entry.color}33)` }} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      background: "hsl(var(--card) / 0.95)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid hsl(var(--accent) / 0.2)",
                      borderRadius: 10,
                      color: "hsl(var(--foreground))",
                      fontSize: 11,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
                {pieData.slice(0, 8).map((p, i) => (
                  <span key={i} className="text-[9px] flex items-center gap-1.5 text-muted-foreground truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color, boxShadow: `0 0 6px ${p.color}44` }} />
                    <span className="truncate">{p.name.split(" ").slice(0, 2).join(" ")}</span>
                    <span className="ml-auto text-foreground/60 font-mono text-[8px]">{p.value}</span>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Agent Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Agenti ({AGENTS.length})
            </h2>
            <Button size="sm" className="h-7 text-[9px] gap-1.5 bg-gradient-to-r from-primary to-accent text-primary-foreground"
              disabled={bulkActivateAll.isPending}
              onClick={() => bulkActivateAll.mutate()}>
              {bulkActivateAll.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
              Attiva Tutti · {ALL_INDUSTRIES.length} Settori
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {AGENTS.map((agent, idx) => {
              const enabled = isAgentEnabled(agent.name);
              const dayData = mock.dailyData[mock.dailyData.length - 1];
              const agentCallsToday = (dayData as any)?.[agent.name] || 0;
              const callsMonth = mock.dailyData.reduce((s, d) => s + ((d as any)[agent.name] || 0), 0);
              const config = getAgentConfig(agent.name);
              return (
                <motion.div key={agent.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`relative overflow-hidden rounded-xl transition-all cursor-pointer group ${
                    enabled
                      ? "hover:shadow-xl hover:shadow-primary/10"
                      : "opacity-40 grayscale"
                  }`}
                  style={{
                    background: enabled
                      ? `linear-gradient(160deg, hsl(var(--card)), ${agent.color}08)`
                      : "hsl(var(--card))",
                    border: `1px solid ${enabled ? agent.color + "25" : "hsl(var(--border))"}`,
                  }}
                  onClick={() => setSelectedAgent(agent)}
                  whileHover={enabled ? { y: -3, borderColor: agent.color + "55" } : {}}
                >
                  {/* Top gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${agent.color}66, transparent)` }} />
                  {/* Ambient corner glow */}
                  <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700" style={{ background: agent.color }} />

                  <div className="p-4">
                    {/* Header with avatar */}
                    <div className="flex items-start gap-3 mb-3">
                      <AgentAvatar agent={agent} size={52} />
                      <div className="flex-1 min-w-0 pt-1">
                        <h3 className="font-bold text-sm truncate text-foreground">{config?.display_name || agent.displayName}</h3>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <Badge className={`${agent.modelBadgeColor} text-[9px] h-5`}>{agent.model}</Badge>
                          <StatusBadge status={enabled ? "active" : "disabled"} />
                        </div>
                      </div>
                      <Switch checked={enabled}
                        onCheckedChange={(checked) => toggleAgent.mutate({ agent_name: agent.name, is_enabled: checked })}
                        onClick={(e) => e.stopPropagation()} className="mt-1" />
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{config?.description || agent.description}</p>

                    {/* Industries */}
                    <div className="flex items-center gap-1 flex-wrap mb-2">
                      <span className="text-[10px] text-muted-foreground mr-1">🎯</span>
                      {(config?.allowed_industries || agent.industries).slice(0, 3).map((ind: string) => (
                        <Badge key={ind} variant="outline" className="text-[9px] h-4 px-1.5"
                          style={{ borderColor: `${agent.color}30`, color: `${agent.color}cc` }}>
                          {INDUSTRY_LABELS[ind]?.split(" ")[0] || ind}
                        </Badge>
                      ))}
                      {(config?.allowed_industries || agent.industries).length > 3 && (
                        <Badge variant="outline" className="text-[9px] h-4 px-1.5">+{(config?.allowed_industries || agent.industries).length - 3}</Badge>
                      )}
                    </div>

                    <div className="text-[10px] text-muted-foreground mb-3">⚡ {agent.trigger}</div>

                    {/* Stats row */}
                    <div className="border-t border-border/50 pt-2 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-xs font-bold" style={{ color: agent.color }}>€{agent.costPerCall}</div>
                        <div className="text-[9px] text-muted-foreground">per call</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground">{agentCallsToday}</div>
                        <div className="text-[9px] text-muted-foreground">oggi</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground">{callsMonth.toLocaleString()}</div>
                        <div className="text-[9px] text-muted-foreground">mese</div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-3 pt-2 border-t border-border/50">
                      {agent.testable && (
                        <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] gap-1"
                          style={{ borderColor: `${agent.color}30` }}
                          onClick={(e) => { e.stopPropagation(); setSelectedAgent(agent); }}>
                          <Play className="w-3 h-3" /> Test
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] gap-1"
                        onClick={(e) => { e.stopPropagation(); setSelectedAgent(agent); }}>
                        <BarChart3 className="w-3 h-3" /> Analytics
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] gap-1"
                        onClick={(e) => { e.stopPropagation(); setSelectedAgent(agent); }}>
                        <Pencil className="w-3 h-3" /> Modifica
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Top Accounts Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-sm">🏆 Top Account per Consumo AI</h3>
            <Input placeholder="Cerca account..." className="w-48 h-7 text-xs" value={searchAccount} onChange={e => setSearchAccount(e.target.value)} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground text-xs">
                <th className="p-3 text-left w-10">#</th><th className="p-3 text-left">Account</th>
                <th className="p-3 text-left hidden md:table-cell">Settore</th>
                <th className="p-3 text-right">Chiamate</th><th className="p-3 text-right hidden md:table-cell">Tokens</th>
                <th className="p-3 text-right">Costo</th><th className="p-3 text-right hidden lg:table-cell">Trend</th>
              </tr></thead>
              <tbody>
                {filteredAccounts.map((acc, i) => (
                  <tr key={acc.name} className="border-b border-border/50 hover:bg-muted/30 transition">
                    <td className="p-3 font-bold text-muted-foreground">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</td>
                    <td className="p-3 font-medium">{acc.name}</td>
                    <td className="p-3 hidden md:table-cell"><Badge variant="outline" className="text-[10px]">{INDUSTRY_LABELS[acc.industry] || acc.industry}</Badge></td>
                    <td className="p-3 text-right">{acc.calls.toLocaleString()}</td>
                    <td className="p-3 text-right hidden md:table-cell">{(acc.tokens / 1000).toFixed(0)}K</td>
                    <td className="p-3 text-right font-bold">€{acc.cost.toFixed(2)}</td>
                    <td className="p-3 text-right hidden lg:table-cell">
                      <span className={`flex items-center justify-end gap-0.5 text-xs ${acc.trend > 0 ? "text-red-400" : "text-emerald-400"}`}>
                        {acc.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(acc.trend)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── ElevenLabs Conversational AI Config ─── */}
        <ElevenLabsConvAIConfig />
      </div>

      {/* ─── Agent Detail Sheet (Full Edit) ─── */}
      <Sheet open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-background">
          {selectedAgent && (
            <>
              <SheetHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <AgentAvatar agent={selectedAgent} size={80} />
                  <div className="flex-1">
                    <SheetTitle className="text-lg">{getAgentConfig(selectedAgent.name)?.display_name || selectedAgent.displayName}</SheetTitle>
                    <div className="flex gap-1.5 mt-1">
                      <Badge className={selectedAgent.modelBadgeColor}>{selectedAgent.model}</Badge>
                      <StatusBadge status={isAgentEnabled(selectedAgent.name) ? "active" : "disabled"} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{getAgentConfig(selectedAgent.name)?.description || selectedAgent.description}</p>
                  </div>
                  <Switch checked={editEnabled}
                    onCheckedChange={(checked) => { setEditEnabled(checked); toggleAgent.mutate({ agent_name: selectedAgent.name, is_enabled: checked }); }} />
                </div>
              </SheetHeader>

              <Tabs defaultValue="edit" className="mt-2">
                <TabsList className="w-full grid grid-cols-5 h-9">
                  <TabsTrigger value="edit" className="text-[11px] gap-1"><Pencil className="w-3 h-3" /> Modifica</TabsTrigger>
                  <TabsTrigger value="config" className="text-[11px] gap-1"><Settings className="w-3 h-3" /> Limiti</TabsTrigger>
                  <TabsTrigger value="usage" className="text-[11px] gap-1"><BarChart3 className="w-3 h-3" /> Stats</TabsTrigger>
                  <TabsTrigger value="logs" className="text-[11px] gap-1"><Clock className="w-3 h-3" /> Log</TabsTrigger>
                  <TabsTrigger value="test" className="text-[11px] gap-1"><Play className="w-3 h-3" /> Test</TabsTrigger>
                </TabsList>

                {/* TAB: Edit */}
                <TabsContent value="edit" className="space-y-4 mt-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Nome Visualizzato</Label>
                    <Input value={editDisplayName} onChange={e => setEditDisplayName(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Descrizione</Label>
                    <Textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} className="mt-1 min-h-[80px] text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Modello AI</Label>
                      <Input value={editModel} onChange={e => setEditModel(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Costo per Chiamata (€)</Label>
                      <Input type="number" step="0.001" value={editCostPerCall} onChange={e => setEditCostPerCall(parseFloat(e.target.value) || 0)} className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Trigger / Attivazione</Label>
                    <Input value={editTrigger} onChange={e => setEditTrigger(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">System Prompt Override</Label>
                    <Textarea value={editPromptOverride} onChange={e => setEditPromptOverride(e.target.value)} className="mt-1 min-h-[100px] text-xs font-mono" placeholder="Lascia vuoto per usare il prompt di default..." />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Settori Abilitati</Label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(INDUSTRY_LABELS).map(([key, label]) => (
                        <label key={key} className={`flex items-center gap-1.5 text-xs cursor-pointer px-3 py-1.5 rounded-lg border transition-all ${
                          editIndustries.includes(key)
                            ? "bg-primary/10 border-primary/40 text-primary"
                            : "bg-muted/30 border-border text-muted-foreground"
                        }`}>
                          <input type="checkbox" className="sr-only" checked={editIndustries.includes(key)}
                            onChange={e => {
                              if (e.target.checked) setEditIndustries(prev => [...prev, key]);
                              else setEditIndustries(prev => prev.filter(i => i !== key));
                            }} />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                    <div>
                      <span className="text-sm font-medium">Agente Abilitato</span>
                      <p className="text-[10px] text-muted-foreground">Attiva o disattiva questo agente globalmente</p>
                    </div>
                    <Switch checked={editEnabled} onCheckedChange={setEditEnabled} />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2" onClick={handleSaveConfig} disabled={upsertConfig.isPending}>
                      {upsertConfig.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Salva Modifiche
                    </Button>
                  </div>
                  <div className="bg-muted/20 border border-border rounded-lg p-3 space-y-1">
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1"><span>📁</span> <code className="bg-muted px-1.5 py-0.5 rounded text-[10px]">{selectedAgent.file}</code></p>
                    <p className="text-[10px] text-muted-foreground">📥 {selectedAgent.inputDesc}</p>
                    <p className="text-[10px] text-muted-foreground">📤 {selectedAgent.outputDesc}</p>
                  </div>
                </TabsContent>

                {/* TAB: Config (Limits) */}
                <TabsContent value="config" className="space-y-4 mt-4">
                  <div className="bg-muted/20 border border-border rounded-lg p-4 space-y-4">
                    <h4 className="text-sm font-semibold flex items-center gap-2"><Settings className="w-4 h-4 text-primary" /> Limiti di Utilizzo</h4>
                    <div>
                      <Label className="text-xs text-muted-foreground">Max chiamate per ora (per account)</Label>
                      <Input type="number" value={editMaxCalls} onChange={e => setEditMaxCalls(parseInt(e.target.value) || 0)} className="mt-1" />
                      <p className="text-[10px] text-muted-foreground mt-1">Limita quante volte un singolo account può usare l'agente in un'ora</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Budget mensile max per account (€)</Label>
                      <Input type="number" step="0.5" value={editMaxBudget} onChange={e => setEditMaxBudget(parseFloat(e.target.value) || 0)} className="mt-1" />
                      <p className="text-[10px] text-muted-foreground mt-1">Budget massimo che un account può spendere su questo agente al mese</p>
                    </div>
                  </div>
                  <Button className="w-full gap-2" onClick={handleSaveConfig} disabled={upsertConfig.isPending}>
                    {upsertConfig.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Salva Limiti
                  </Button>
                </TabsContent>

                {/* TAB: Usage */}
                <TabsContent value="usage" className="space-y-4 mt-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <div className="text-lg font-bold">{mock.dailyData.reduce((s, d) => s + ((d as any)[selectedAgent.name] || 0), 0).toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground">Chiamate mese</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <div className="text-lg font-bold">1.2M</div>
                      <div className="text-[10px] text-muted-foreground">Tokens totali</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <div className="text-lg font-bold">€{(mock.dailyData.reduce((s, d) => s + ((d as any)[selectedAgent.name] || 0), 0) * selectedAgent.costPerCall).toFixed(2)}</div>
                      <div className="text-[10px] text-muted-foreground">Costo mese</div>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-3">
                    <h4 className="text-xs font-semibold mb-2">Chiamate per giorno (ultimi 30gg)</h4>
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={mock.dailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
                        <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
                        <RechartsTooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                        <Area type="monotone" dataKey={selectedAgent.name} fill={selectedAgent.color + "33"} stroke={selectedAgent.color} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                {/* TAB: Logs */}
                <TabsContent value="logs" className="mt-4">
                  <div className="space-y-1 max-h-[400px] overflow-y-auto">
                    {mock.recentLogs.filter(l => l.agent === selectedAgent.name).slice(0, 20).map(log => (
                      <div key={log.id} className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2 text-[10px]">
                        <span className={`w-1.5 h-1.5 rounded-full ${log.status === "success" ? "bg-emerald-400" : "bg-red-400"}`} />
                        <span className="text-muted-foreground w-14 shrink-0">{new Date(log.timestamp).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}</span>
                        <span className="flex-1 truncate">{log.account}</span>
                        <span className="text-muted-foreground">{log.inputTokens}→{log.outputTokens}t</span>
                        <span className="font-medium">€{log.cost}</span>
                        <span className="text-muted-foreground">{log.duration}ms</span>
                      </div>
                    ))}
                    {mock.recentLogs.filter(l => l.agent === selectedAgent.name).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">Nessun log recente per questo agente</p>
                    )}
                  </div>
                </TabsContent>

                {/* TAB: Test */}
                <TabsContent value="test" className="space-y-4 mt-4">
                  {selectedAgent.testable ? (
                    <>
                      <div className="bg-muted/20 border border-border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AgentAvatar agent={selectedAgent} size={32} />
                          <span className="text-xs font-medium">Test Live — {selectedAgent.displayName}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">Invia un messaggio di test per verificare il funzionamento dell'agente in tempo reale.</p>
                      </div>
                      <Textarea placeholder={`Scrivi un messaggio di test...`} value={testPrompt}
                        onChange={e => setTestPrompt(e.target.value)} className="min-h-[80px] text-sm" />
                      <Button className="gap-2 w-full" disabled={!testPrompt.trim() || testLoading} onClick={handleTest}>
                        {testLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        Esegui Test
                      </Button>
                    </>
                  ) : (
                    <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground text-center">
                      ⚠ Questo agente richiede input specifici (immagini, audio, upload) e non può essere testato con un prompt di testo.
                    </div>
                  )}
                  {testResult && (
                    <div className="bg-muted rounded-lg p-4 text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto font-mono text-xs">
                      {testResult}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ─── ElevenLabs Conversational AI Config Panel ───
function ElevenLabsConvAIConfig() {
  const queryClient = useQueryClient();
  const [agentId, setAgentId] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: config, isLoading } = useQuery({
    queryKey: ["elevenlabs-convai-config"],
    queryFn: async () => {
      const { data } = await supabase
        .from("ai_agent_configs")
        .select("*")
        .eq("agent_name", "elevenlabs-convai")
        .maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (config?.system_prompt_override) {
      try {
        const parsed = JSON.parse(config.system_prompt_override);
        setAgentId(parsed.agent_id || "");
      } catch {
        setAgentId(config.system_prompt_override || "");
      }
    }
  }, [config]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const configPayload = JSON.stringify({ agent_id: agentId.trim() });
      if (config) {
        await supabase.from("ai_agent_configs").update({
          system_prompt_override: configPayload,
          is_enabled: !!agentId.trim(),
          updated_at: new Date().toISOString(),
        }).eq("id", config.id);
      } else {
        await supabase.from("ai_agent_configs").insert({
          agent_name: "elevenlabs-convai",
          display_name: "ElevenLabs Conversational AI",
          description: "Agente vocale ATLAS via WebRTC — ElevenLabs SDK",
          icon: "Mic",
          color: "#8B5CF6",
          is_enabled: !!agentId.trim(),
          system_prompt_override: configPayload,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["elevenlabs-convai-config"] });
      toast({ title: "✅ Configurazione ElevenLabs salvata" });
    } catch (e: any) {
      toast({ title: "❌ Errore", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center">
          <Mic className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            🎙 ElevenLabs Conversational AI
          </h3>
          <p className="text-xs text-muted-foreground">Configura l'agente vocale ATLAS con WebRTC — bassa latenza, qualità premium</p>
        </div>
        <Badge className={config?.is_enabled ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-muted text-muted-foreground"}>
          {config?.is_enabled ? "Attivo" : "Non configurato"}
        </Badge>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <Label className="text-xs text-muted-foreground">ElevenLabs Agent ID</Label>
          <p className="text-[10px] text-muted-foreground mb-1.5">
            Trovi l'Agent ID nella dashboard ElevenLabs → Conversational AI → Il tuo agente → Settings
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="es. abc123def456..."
              value={agentId}
              onChange={e => setAgentId(e.target.value)}
              className="flex-1 font-mono text-xs"
            />
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-1.5"
              size="sm"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Salva
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-primary" /> Come configurare
          </h4>
          <ol className="text-[11px] text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Vai su <span className="font-medium text-foreground">elevenlabs.io</span> → Conversational AI</li>
            <li>Crea un nuovo agente o usa quello esistente (ATLAS / Laura)</li>
            <li>Copia l'<span className="font-medium text-foreground">Agent ID</span> dalla pagina Settings dell'agente</li>
            <li>Incollalo qui sopra e clicca <span className="font-medium text-foreground">Salva</span></li>
            <li>L'API Key ElevenLabs è già configurata nel backend ✅</li>
          </ol>
        </div>

        {config?.is_enabled && agentId && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
            <p className="text-xs text-emerald-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Agente attivo — L'SDK WebRTC è integrato nel componente Voice Agent della Landing Page
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Agent ID: <code className="font-mono text-foreground bg-muted px-1 rounded">{agentId.slice(0, 12)}...</code>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── KPI Card — Premium ───
function KPICard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-lg md:rounded-xl border border-border bg-card p-2.5 md:p-4 group hover:border-primary/30 transition-all">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-xl bg-primary/5 group-hover:bg-primary/10 transition-colors" />
      <div className="flex items-center gap-1.5 mb-1 md:mb-2">{icon}<span className="text-[10px] md:text-xs text-muted-foreground truncate">{label}</span></div>
      <div className="text-lg md:text-2xl font-bold text-foreground truncate">{value}</div>
      <div className="text-[9px] md:text-[10px] text-muted-foreground mt-0.5 md:mt-1 truncate">{sub}</div>
    </motion.div>
  );
}
