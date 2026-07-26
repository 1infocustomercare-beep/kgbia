import { useEffect, useState } from "react";
import { Search, Sparkles, ListChecks, Briefcase } from "lucide-react";

/**
 * WorkflowTabs — barra sticky di navigazione del flusso di lavoro venditore.
 * Additiva: NON altera contenuti, solo li mette in ordine logico e li rende
 * raggiungibili con un tap. Ogni step è collegato a un `id` presente nella pagina.
 *
 *  1 Ricerca      → #wf-search      (search bar + filtri + manual add)
 *  2 Intelligence → #wf-intel       (Arianna Autopilot + Insights + Inbox)
 *  3 Risultati    → #wf-results     (griglia lead + drawer analisi/messaggio)
 *  4 Pipeline     → apre SellerCRM (evento globale)
 */
export type WorkflowStep = "search" | "intel" | "results" | "crm";

interface Props {
  resultsCount: number;
  hotCount: number;
  onOpenCRM: () => void;
}

const STEPS: {
  id: WorkflowStep;
  n: string;
  label: string;
  hint: string;
  icon: any;
  anchor?: string;
}[] = [
  { id: "search",  n: "1", label: "Ricerca",     hint: "Città · settore · filtri", icon: Search,     anchor: "wf-search" },
  { id: "intel",   n: "2", label: "Intelligence",hint: "Arianna · Insights · Inbox", icon: Sparkles,  anchor: "wf-intel" },
  { id: "results", n: "3", label: "Risultati",   hint: "Lead trovati · azioni",    icon: ListChecks, anchor: "wf-results" },
  { id: "crm",     n: "4", label: "Pipeline",    hint: "CRM · follow-up · stage",  icon: Briefcase },
];

export default function WorkflowTabs({ resultsCount, hotCount, onOpenCRM }: Props) {
  const [active, setActive] = useState<WorkflowStep>("search");

  // Highlight della sezione visibile via IntersectionObserver
  useEffect(() => {
    const targets = STEPS
      .map(s => s.anchor ? document.getElementById(s.anchor) : null)
      .filter(Boolean) as HTMLElement[];
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const step = STEPS.find(s => s.anchor === visible.target.id);
          if (step) setActive(step.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.1, 0.3, 0.6] }
    );
    targets.forEach(t => io.observe(t));
    return () => io.disconnect();
  }, []);

  const goTo = (s: typeof STEPS[number]) => {
    if (s.id === "crm") { onOpenCRM(); return; }
    if (!s.anchor) return;
    const el = document.getElementById(s.anchor);
    if (!el) return;
    setActive(s.id);
    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <nav
      className="sticky z-20 -mx-3 sm:-mx-5 md:-mx-6 lg:-mx-8 px-3 sm:px-5 md:px-6 lg:px-8 py-2 backdrop-blur-xl border-y border-white/10"
      style={{
        top: "56px",
        background: "linear-gradient(180deg, rgba(11,7,22,0.92), rgba(11,7,22,0.78))",
      }}
      aria-label="Flusso di lavoro"
    >
      <ol className="grid grid-cols-4 gap-1.5 sm:gap-2 max-w-4xl mx-auto">
        {STEPS.map(s => {
          const isActive = active === s.id;
          const badge = s.id === "results" && resultsCount > 0
            ? String(resultsCount)
            : s.id === "results" && hotCount > 0
            ? `🔥${hotCount}`
            : null;
          const Icon = s.icon;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => goTo(s)}
                aria-current={isActive ? "step" : undefined}
                className={`w-full rounded-xl px-2 py-2 sm:py-2.5 flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2 transition-all active:scale-[0.98] min-h-[52px] text-left ${isActive ? "shadow-premium" : ""}`}
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, rgba(167,139,250,0.22), rgba(20,184,166,0.14))"
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <span
                  className="flex items-center justify-center rounded-full w-6 h-6 text-[10px] font-black shrink-0"
                  style={{
                    background: isActive ? "#a78bfa" : "rgba(167,139,250,0.15)",
                    color: isActive ? "#0b0716" : "#c4b5fd",
                  }}
                >
                  {s.n}
                </span>
                <span className="flex-1 min-w-0 flex flex-col leading-tight text-center sm:text-left">
                  <span className="flex items-center justify-center sm:justify-start gap-1">
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-80" style={{ color: isActive ? "#e9d5ff" : "#9ca3af" }} />
                    <span
                      className={`text-[10px] sm:text-[12px] font-bold ${isActive ? "text-white" : "text-white/80"}`}
                    >
                      {s.label}
                    </span>
                    {badge && (
                      <span
                        className="ml-1 px-1 py-0.5 rounded text-[8px] font-bold hidden sm:inline"
                        style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5" }}
                      >
                        {badge}
                      </span>
                    )}
                  </span>
                  <span className="text-[8px] sm:text-[9px] hidden sm:block" style={{ color: isActive ? "#c4b5fd" : "#6b7280" }}>
                    {s.hint}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
