import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Workflow,
  LayoutDashboard,
  Plug,
  Check,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { scrollToSection } from "@/lib/home-scroll";

/**
 * PrestigeAgentStudio
 * Configuratore statico (nessun 3D, nessun effetto scroll-driven) che mostra
 * come Empire compone un sistema su misura a partire dall'obiettivo di business.
 * Sostituisce la scena Spline: stabile su mobile, orientata alla conversione.
 */

type Block = { icon: LucideIcon; title: string; items: string[] };

type Goal = {
  id: string;
  label: string;
  headline: string;
  problem: string;
  blocks: Block[];
  outcome: string;
};

const GOALS: Goal[] = [
  {
    id: "leads",
    label: "Voglio più clienti",
    headline: "Un sistema che risponde, qualifica e prenota al posto tuo",
    problem:
      "Le richieste arrivano da telefono, WhatsApp, Instagram e form: chi risponde per primo vince, chi risponde dopo due ore perde il cliente.",
    blocks: [
      {
        icon: Bot,
        title: "Team di agenti",
        items: [
          "Agente commerciale addestrato su servizi, prezzi e obiezioni",
          "Agente vocale che risponde alle chiamate perse",
          "Passaggio a una persona reale quando serve davvero",
        ],
      },
      {
        icon: Workflow,
        title: "Automazioni",
        items: [
          "Follow-up e preventivi inviati senza intervento manuale",
          "Recupero delle trattative rimaste in sospeso",
          "Notifiche al team solo sui contatti pronti a chiudere",
        ],
      },
      {
        icon: LayoutDashboard,
        title: "Interfacce",
        items: [
          "Sito o landing costruiti su una sola azione",
          "Pannello con contatti, stato trattativa e fonte",
        ],
      },
    ],
    outcome: "Nessuna richiesta senza risposta, con tracciamento completo di ogni contatto.",
  },
  {
    id: "operations",
    label: "Voglio ordine nei processi",
    headline: "Il gestionale che sostituisce fogli Excel, gruppi e post-it",
    problem:
      "I dati vivono in file diversi, ogni collaboratore ha la sua versione della verità e ricostruire un ordine richiede telefonate.",
    blocks: [
      {
        icon: LayoutDashboard,
        title: "Software su misura",
        items: [
          "Gestionale con ordini, agenda, clienti e magazzino",
          "Ruoli e permessi per titolare, staff e collaboratori",
          "Storico completo di ogni operazione",
        ],
      },
      {
        icon: Workflow,
        title: "Automazioni",
        items: [
          "Documenti, fatture e report generati da soli",
          "Alert su scorte, scadenze e attività in ritardo",
        ],
      },
      {
        icon: Plug,
        title: "Integrazioni",
        items: [
          "Collegamento a gestionali, pagamenti e calendari già in uso",
          "Migrazione dei dati storici senza fermare l'attività",
        ],
      },
    ],
    outcome: "Un'unica fonte di verità, consultabile da desktop e da telefono.",
  },
  {
    id: "service",
    label: "Voglio assistenza sempre attiva",
    headline: "Supporto continuo senza aumentare il personale",
    problem:
      "Le stesse domande tornano ogni giorno e occupano ore di lavoro qualificato che potrebbe produrre ricavi.",
    blocks: [
      {
        icon: Bot,
        title: "Team di agenti",
        items: [
          "Assistenza multilingua su sito, WhatsApp e telefono",
          "Risposte basate solo sui tuoi documenti e procedure",
          "Escalation immediata sui casi delicati",
        ],
      },
      {
        icon: Workflow,
        title: "Automazioni",
        items: [
          "Ticket aperti, smistati e chiusi automaticamente",
          "Richiesta recensioni ai clienti soddisfatti",
        ],
      },
      {
        icon: LayoutDashboard,
        title: "Interfacce",
        items: [
          "Area clienti con stato pratiche e documenti",
          "Cronologia conversazioni consultabile dal team",
        ],
      },
    ],
    outcome: "Risposte immediate a ogni ora, con il team libero per il lavoro a valore.",
  },
  {
    id: "scale",
    label: "Voglio scalare",
    headline: "La stessa struttura replicata su più sedi e più canali",
    problem:
      "Quello che funziona in una sede non si replica: ogni apertura ricomincia da zero con processi diversi.",
    blocks: [
      {
        icon: LayoutDashboard,
        title: "Piattaforma multi-sede",
        items: [
          "Un pannello unico con dati separati per sede",
          "Configurazioni replicabili in pochi giorni",
          "Confronto performance tra punti vendita",
        ],
      },
      {
        icon: Bot,
        title: "Team di agenti",
        items: [
          "Agenti clonati per ogni sede con listini locali",
          "Reportistica automatica alla direzione",
        ],
      },
      {
        icon: Plug,
        title: "Infrastruttura",
        items: [
          "Architettura pronta a crescere senza riscritture",
          "Manutenzione, monitoraggio e aggiornamenti continui",
        ],
      },
    ],
    outcome: "Nuove sedi e nuovi servizi attivati su un modello già collaudato.",
  },
];

export default function PrestigeAgentStudio() {
  const [activeId, setActiveId] = useState(GOALS[0].id);
  const active = GOALS.find((g) => g.id === activeId) ?? GOALS[0];

  return (
    <motion.div
      className="prestige-agent-studio overflow-hidden rounded-[28px]"
      initial={{ opacity: 0, y: 42, rotateY: -7, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transformPerspective: 1200,
        transformOrigin: "center center",
        background:
          "linear-gradient(160deg, hsl(var(--pr-emerald-mid) / 0.72), hsl(var(--pr-emerald-deep) / 0.96))",
        border: "1px solid hsl(var(--pr-gold) / 0.24)",
        boxShadow: "0 30px 80px -44px hsl(var(--pr-gold) / 0.35)",
      }}
    >
      <div
        className="flex flex-wrap items-center gap-2 border-b px-4 py-4 sm:px-6"
        style={{ borderColor: "hsl(var(--pr-gold) / 0.16)" }}
      >
        <span
          className="mr-1 text-[10px] font-semibold uppercase tracking-[0.24em]"
          style={{ color: "hsl(var(--pr-gold-light))" }}
        >
          Il tuo obiettivo
        </span>
        {GOALS.map((g) => {
          const on = g.id === active.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveId(g.id)}
              aria-pressed={on}
              className="rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors duration-300 sm:text-xs"
              style={{
                background: on
                  ? "linear-gradient(135deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold-deep)))"
                  : "hsl(var(--pr-emerald-deep) / 0.6)",
                color: on ? "hsl(var(--pr-emerald-deep))" : "hsl(var(--pr-text-on-dark))",
                border: `1px solid ${on ? "transparent" : "hsl(var(--pr-gold) / 0.2)"}`,
              }}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={active.id}
        initial={{ opacity: 0, x: 22, filter: "blur(5px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, x: -18, filter: "blur(4px)" }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="px-4 py-5 sm:px-6 sm:py-6"
      >
        <h3 className="prestige-display text-xl sm:text-2xl">{active.headline}</h3>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
          {active.problem}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3">
          {active.blocks.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="rounded-2xl p-4"
                style={{
                  background: "hsl(var(--pr-emerald-deep) / 0.55)",
                  border: "1px solid hsl(var(--pr-gold) / 0.14)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{
                      background: "hsl(var(--pr-gold) / 0.16)",
                      color: "hsl(var(--pr-gold-light))",
                    }}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="text-sm font-semibold" style={{ color: "hsl(var(--pr-text-on-dark))" }}>
                    {b.title}
                  </span>
                </div>
                <ul className="mt-2.5 grid gap-1.5">
                  {b.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-[13px] leading-snug">
                      <Check
                        size={13}
                        strokeWidth={3}
                        className="mt-[3px] shrink-0"
                        style={{ color: "hsl(var(--pr-gold-light))" }}
                      />
                      <span style={{ color: "hsl(var(--pr-muted-on-dark))" }}>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div
          className="mt-5 rounded-2xl px-4 py-3.5"
          style={{
            background: "hsl(var(--pr-gold) / 0.09)",
            border: "1px solid hsl(var(--pr-gold) / 0.26)",
          }}
        >
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: "hsl(var(--pr-gold-light))" }}
          >
            Risultato atteso
          </div>
          <p className="mt-1 text-sm" style={{ color: "hsl(var(--pr-text-on-dark))" }}>
            {active.outcome}
          </p>
        </div>

        <button
          type="button"
          onClick={() => scrollToSection("prestige-lead")}
          className="prestige-cta mt-5 w-full justify-center"
        >
          <span>Richiedi l'analisi del tuo caso</span>
          <ArrowRight size={14} />
        </button>
      </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
