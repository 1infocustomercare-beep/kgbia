import { Search, Users, UserX } from "lucide-react";
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
  { value: "universal", label: "🌐 Universali" },
  { value: "sector-specific", label: "🎯 Settore" },
];
const statuses: { value: AgentStatus; label: string; dot: string }[] = [
  { value: "all", label: "Tutti", dot: "" },
  { value: "active", label: "Attivi", dot: "bg-emerald-400" },
  { value: "beta", label: "Beta", dot: "bg-amber-400" },
  { value: "inactive", label: "Off", dot: "bg-red-400" },
];

const usageOptions: { value: UsageFilter; label: string; icon: typeof Users | null }[] = [
  { value: "all", label: "Tutti", icon: null },
  { value: "installed", label: "In uso", icon: Users },
  { value: "not-installed", label: "Non usati", icon: UserX },
];

const CATEGORY_ORDER: AgentCategory[] = ["all", "concierge", "analytics", "content", "sales", "operations", "compliance"];

export default function AgentFilters({
  search, onSearch, typeFilter, onType, statusFilter, onStatus,
  categoryFilter, onCategory, categoryCounts, usageFilter, onUsage,
}: Props) {
  const pill = (active: boolean) =>
    active
      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
      : "bg-white/5 text-muted-foreground hover:bg-white/10";

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cerca agente..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9 bg-white/5 border-white/10 rounded-xl"
        />
      </div>

      {/* Category filter */}
      <div>
        <p className="text-[0.6rem] uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">Categoria</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORY_ORDER.map((c) => {
            const catInfo = c === "all" ? null : CATEGORY_LABELS[c];
            return (
              <button
                key={c}
                onClick={() => onCategory(c)}
                className={`px-2.5 py-1.5 rounded-xl text-[0.65rem] font-medium whitespace-nowrap transition-all flex items-center gap-1 ${pill(categoryFilter === c)}`}
              >
                {catInfo ? (
                  <>
                    <span>{catInfo.icon}</span>
                    <span>{catInfo.label}</span>
                  </>
                ) : "Tutte"}
                <span className={`text-[0.55rem] px-1 py-0.5 rounded-full ${categoryFilter === c ? "bg-white/20" : "bg-white/10"}`}>
                  {categoryCounts[c] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Type + Status + Usage row */}
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {/* Type */}
        <div className="flex gap-1 shrink-0">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => onType(t.value)}
              className={`px-2.5 py-1 rounded-lg text-[0.6rem] font-medium transition-colors ${pill(typeFilter === t.value)}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="w-px bg-white/10 shrink-0" />

        {/* Status */}
        <div className="flex gap-1 shrink-0">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => onStatus(s.value)}
              className={`px-2.5 py-1 rounded-lg text-[0.6rem] font-medium transition-colors flex items-center gap-1 ${pill(statusFilter === s.value)}`}
            >
              {s.dot && <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />}
              {s.label}
            </button>
          ))}
        </div>

        <div className="w-px bg-white/10 shrink-0" />

        {/* Usage */}
        <div className="flex gap-1 shrink-0">
          {usageOptions.map((u) => (
            <button
              key={u.value}
              onClick={() => onUsage(u.value)}
              className={`px-2.5 py-1 rounded-lg text-[0.6rem] font-medium transition-colors flex items-center gap-1 ${pill(usageFilter === u.value)}`}
            >
              {u.icon && <u.icon className="w-3 h-3" />}
              {u.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
