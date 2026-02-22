import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Maximize2, RotateCcw, Users } from "lucide-react";

interface TableData {
  id: string;
  table_number: number;
  status: string;
  seats: number | null;
  label: string | null;
  pos_x?: number;
  pos_y?: number;
}

const STATUS_CONFIG: Record<string, { bg: string; border: string; dot: string; label: string; emoji: string }> = {
  free: { bg: "bg-green-500/10", border: "border-green-500/30", dot: "bg-green-400", label: "Libero", emoji: "🟢" },
  waiting: { bg: "bg-amber-500/10", border: "border-amber-500/30", dot: "bg-amber-400", label: "In attesa", emoji: "🟡" },
  served: { bg: "bg-blue-500/10", border: "border-blue-500/30", dot: "bg-blue-400", label: "Servito", emoji: "🔵" },
  occupied: { bg: "bg-primary/10", border: "border-primary/30", dot: "bg-primary", label: "Occupato", emoji: "🟠" },
  bill: { bg: "bg-violet-500/10", border: "border-violet-500/30", dot: "bg-violet-400", label: "Conto", emoji: "🟣" },
  paid: { bg: "bg-muted", border: "border-border", dot: "bg-muted-foreground", label: "Pagato", emoji: "⚪" },
};

interface TableMapProps {
  tables: TableData[];
  onStatusChange: (tableId: string, newStatus: string) => void;
  onPositionChange?: (tableId: string, x: number, y: number) => void;
  editMode?: boolean;
}

const TableMap = ({ tables, onStatusChange, onPositionChange, editMode = false }: TableMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const nextStatus: Record<string, string> = {
    free: "occupied",
    occupied: "waiting",
    waiting: "served",
    served: "bill",
    bill: "paid",
    paid: "free",
  };

  const handleDragEnd = (tableId: string, info: any) => {
    if (!editMode || !mapRef.current || !onPositionChange) return;
    const rect = mapRef.current.getBoundingClientRect();
    const table = tables.find(t => t.id === tableId);
    if (!table) return;
    const newX = Math.max(0, Math.min(100, ((table.pos_x || 0) / 100 * rect.width + info.offset.x) / rect.width * 100));
    const newY = Math.max(0, Math.min(100, ((table.pos_y || 0) / 100 * rect.height + info.offset.y) / rect.height * 100));
    onPositionChange(tableId, Math.round(newX), Math.round(newY));
    setDraggingId(null);
  };

  // Auto-layout if no positions set
  const hasPositions = tables.some(t => (t.pos_x || 0) > 0 || (t.pos_y || 0) > 0);

  const getAutoPosition = (index: number, total: number) => {
    const cols = Math.ceil(Math.sqrt(total));
    const row = Math.floor(index / cols);
    const col = index % cols;
    const spacingX = 100 / (cols + 1);
    const spacingY = 100 / (Math.ceil(total / cols) + 1);
    return { x: spacingX * (col + 1), y: spacingY * (row + 1) };
  };

  const legend = Object.entries(STATUS_CONFIG);

  return (
    <div className={`space-y-3 ${fullscreen ? "fixed inset-0 z-50 bg-background p-5" : ""}`}>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {legend.map(([key, cfg]) => (
            <span key={key} className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          ))}
        </div>
        <button onClick={() => setFullscreen(!fullscreen)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Maximize2 className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className={`relative rounded-2xl border border-border bg-card/50 overflow-hidden ${
          fullscreen ? "flex-1 h-[calc(100vh-120px)]" : "h-[400px]"
        }`}
        style={{ backgroundImage: "radial-gradient(circle, hsla(var(--border)) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      >
        {/* Floor label */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-secondary/80 text-[10px] text-muted-foreground uppercase tracking-wider">
          Planimetria Sala
        </div>

        {tables.map((table, index) => {
          const cfg = STATUS_CONFIG[table.status] || STATUS_CONFIG.free;
          const pos = hasPositions
            ? { x: table.pos_x || 0, y: table.pos_y || 0 }
            : getAutoPosition(index, tables.length);

          return (
            <motion.div
              key={table.id}
              className={`absolute cursor-pointer select-none`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              drag={editMode}
              dragMomentum={false}
              onDragStart={() => setDraggingId(table.id)}
              onDragEnd={(_, info) => handleDragEnd(table.id, info)}
              whileTap={editMode ? { scale: 1.1 } : { scale: 0.95 }}
            >
              <motion.div
                onClick={() => !editMode && onStatusChange(table.id, nextStatus[table.status] || "free")}
                className={`relative w-16 h-16 rounded-2xl ${cfg.bg} ${cfg.border} border-2 flex flex-col items-center justify-center transition-all ${
                  draggingId === table.id ? "ring-2 ring-primary shadow-lg" : ""
                } ${editMode ? "cursor-grab active:cursor-grabbing" : ""}`}
                layout
              >
                <span className="text-lg font-display font-bold text-foreground">{table.table_number}</span>
                <div className="flex items-center gap-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  <span className="text-[8px] text-muted-foreground">{cfg.label}</span>
                </div>
                {table.seats && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-[8px] text-muted-foreground flex items-center justify-center border border-border">
                    {table.seats}
                  </span>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        {editMode ? "Trascina i tavoli per posizionarli · Clicca 'Salva Layout' quando hai finito" : "Tocca un tavolo per cambiare stato"}
      </p>
    </div>
  );
};

export default TableMap;
