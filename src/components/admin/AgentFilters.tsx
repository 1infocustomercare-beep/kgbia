import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CATEGORY_LABELS } from "@/types/agent";
import type { AgentType, AgentStatus, AgentCategory, UsageFilter } from "@/hooks/useAdminAgents";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  typeFilter: AgentType;
  onType: (v: AgentType) => void;
  statusFilter: AgentStatus;
  onStatus: (v: AgentStatus) => void;
  categoryFilter: AgentCategory;
  onCategory: (v: AgentCategory) => void;
  categoryCounts: Record<string, number>;
  usageFilter: UsageFilter;
  onUsage: (v: UsageFilter) => void;
}

const types: { value: AgentType; label: string }[] = [
  { value: "all", label: "Tutti" },
  { value: "universal", label: "🌐 Univ." },
  { value: "sector-specific", label: "🎯 Settore" },
];
const statuses: { value: AgentStatus; label: string; dot: string }[] = [
  { value: "all", label: "Tutti", dot: "" },
  { value: "active", label: "Attivi", dot: "bg-emerald-400" },
  { value: "beta", label: "Beta", dot: "bg-amber-400" },
  { value: "inactive", label: "Off", dot: "bg-destructive" },
];
const usageOptions: { value: UsageFilter; label: string }[] = [
  { value: "all", label: "Tutti" },
  { value: "installed", label: "In uso" },
  { value: "not-installed", label: "Non usati" },
];
const CATEGORY_ORDER: AgentCategory[] = ["all", "concierge", "analytics", "content", "sales", "operations", "compliance"];

export default function AgentFilters({
  search, onSearch, typeFilter, onType, statusFilter, onStatus,
  categoryFilter, onCategory, categoryCounts, usageFilter, onUsage,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const pill = (active: boolean) =>
    active
      ? "bg-primary text-primary-foreground shadow-sm"
      : "bg-secondary/60 text-muted-foreground hover:bg-secondary";

  const hasActiveFilter = typeFilter !== "all" || statusFilter !== "all" || categoryFilter !== "all" || usageFilter !== "all";

  return (
    <div className="space-y-2">
      {/* Search + expand toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Cerca agente..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-8 h-9 bg-secondary/40 border-border/50 rounded-xl text-xs"
          />
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-1 px-3 h-9 rounded-xl text-[0.65rem] font-medium transition-colors border ${
            hasActiveFilter
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-secondary/40 border-border/50 text-muted-foreground"
          }`}
        >
          Filtri
          {hasActiveFilter && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
          <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Collapsed: Quick category row */}
      {!expanded && (
        <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
          {CATEGORY_ORDER.map((c) => {
            const catInfo = c === "all" ? null : CATEGORY_LABELS[c];
            return (
              <button
                key={c}
                onClick={() => onCategory(c)}
                className={`px-2 py-1 rounded-lg text-[0.6rem] font-medium whitespace-nowrap transition-all flex items-center gap-0.5 ${pill(categoryFilter === c)}`}
              >
                {catInfo ? <span>{catInfo.icon}</span> : null}
                <span>{catInfo ? catInfo.label : "Tutte"}</span>
                <span className={`text-[0.5rem] px-1 rounded-full ${categoryFilter === c ? "bg-primary-foreground/20" : "bg-foreground/10"}`}>
                  {categoryCounts[c] || 0}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Expanded: Full filters */}
      {expanded && (
        <div className="space-y-2 p-2.5 rounded-xl bg-secondary/30 border border-border/40">
          {/* Categories */}
          <div>
            <p className="text-[0.55rem] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Categoria</p>
            <div className="flex gap-1 flex-wrap">
              {CATEGORY_ORDER.map((c) => {
                const catInfo = c === "all" ? null : CATEGORY_LABELS[c];
                return (
                  <button
                    key={c}
                    onClick={() => onCategory(c)}
                    className={`px-2 py-1 rounded-lg text-[0.6rem] font-medium whitespace-nowrap transition-all flex items-center gap-0.5 ${pill(categoryFilter === c)}`}
                  >
                    {catInfo ? <span>{catInfo.icon}</span> : null}
                    <span>{catInfo ? catInfo.label : "Tutte"}</span>
                    <span className={`text-[0.5rem] px-1 rounded-full ${categoryFilter === c ? "bg-primary-foreground/20" : "bg-foreground/10"}`}>
                      {categoryCounts[c] || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Type + Status + Usage in a compact grid */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-[0.55rem] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Tipo</p>
              <div className="flex flex-col gap-0.5">
                {types.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => onType(t.value)}
                    className={`px-2 py-1 rounded-lg text-[0.6rem] font-medium transition-colors text-left ${pill(typeFilter === t.value)}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[0.55rem] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Stato</p>
              <div className="flex flex-col gap-0.5">
                {statuses.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => onStatus(s.value)}
                    className={`px-2 py-1 rounded-lg text-[0.6rem] font-medium transition-colors flex items-center gap-1 ${pill(statusFilter === s.value)}`}
                  >
                    {s.dot && <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />}
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[0.55rem] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Utilizzo</p>
              <div className="flex flex-col gap-0.5">
                {usageOptions.map((u) => (
                  <button
                    key={u.value}
                    onClick={() => onUsage(u.value)}
                    className={`px-2 py-1 rounded-lg text-[0.6rem] font-medium transition-colors ${pill(usageFilter === u.value)}`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reset */}
          {hasActiveFilter && (
            <button
              onClick={() => { onType("all"); onStatus("all"); onCategory("all"); onUsage("all"); }}
              className="text-[0.6rem] text-primary underline"
            >
              Reset filtri
            </button>
          )}
        </div>
      )}
    </div>
  );
}
