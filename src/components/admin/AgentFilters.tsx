import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { AgentType, AgentStatus } from "@/hooks/useAdminAgents";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  typeFilter: AgentType;
  onType: (v: AgentType) => void;
  statusFilter: AgentStatus;
  onStatus: (v: AgentStatus) => void;
}

const types: { value: AgentType; label: string }[] = [
  { value: "all", label: "Tutti" },
  { value: "universal", label: "Universali" },
  { value: "sector-specific", label: "Settore" },
];
const statuses: { value: AgentStatus; label: string; dot: string }[] = [
  { value: "all", label: "Tutti", dot: "" },
  { value: "active", label: "Attivi", dot: "bg-emerald-400" },
  { value: "beta", label: "Beta", dot: "bg-amber-400" },
  { value: "inactive", label: "Inattivi", dot: "bg-red-400" },
];

export default function AgentFilters({ search, onSearch, typeFilter, onType, statusFilter, onStatus }: Props) {
  const pill = (active: boolean) =>
    active
      ? "bg-primary text-primary-foreground"
      : "bg-white/5 text-muted-foreground hover:bg-white/10";

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cerca agente..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9 bg-white/5 border-white/10"
        />
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {types.map((t) => (
          <button
            key={t.value}
            onClick={() => onType(t.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${pill(typeFilter === t.value)}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => onStatus(s.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${pill(statusFilter === s.value)}`}
          >
            {s.dot && <span className={`w-2 h-2 rounded-full ${s.dot}`} />}
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
