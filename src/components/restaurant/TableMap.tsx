import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";

interface TableData {
  id: string;
  table_number: number;
  status: string;
  seats: number | null;
  label: string | null;
  pos_x?: number;
  pos_y?: number;
}

const STATUS_CONFIG: Record<string, { bg: string; border: string; dot: string; label: string }> = {
  free: { bg: "bg-green-500/10", border: "border-green-500/30", dot: "bg-green-400", label: "Libero" },
  waiting: { bg: "bg-amber-500/10", border: "border-amber-500/30", dot: "bg-amber-400", label: "In attesa" },
  served: { bg: "bg-blue-500/10", border: "border-blue-500/30", dot: "bg-blue-400", label: "Servito" },
  occupied: { bg: "bg-primary/10", border: "border-primary/30", dot: "bg-primary", label: "Occupato" },
  bill: { bg: "bg-violet-500/10", border: "border-violet-500/30", dot: "bg-violet-400", label: "Conto" },
  paid: { bg: "bg-muted", border: "border-border", dot: "bg-muted-foreground", label: "Pagato" },
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
    const newX = Math.max(5, Math.min(95, ((table.pos_x || 0) / 100 * rect.width + info.offset.x) / rect.width * 100));
    const newY = Math.max(5, Math.min(95, ((table.pos_y || 0) / 100 * rect.height + info.offset.y) / rect.height * 100));
    onPositionChange(tableId, Math.round(newX), Math.round(newY));
    setDraggingId(null);
  };

  const hasPositions = tables.some(t => (t.pos_x || 0) > 5 || (t.pos_y || 0) > 5);

  const getAutoPosition = (index: number, total: number) => {
    const cols = Math.ceil(Math.sqrt(total));
    const row = Math.floor(index / cols);
    const col = index % cols;
    const spacingX = 100 / (cols + 1);
    const spacingY = 100 / (Math.ceil(total / cols) + 1);
    return { x: spacingX * (col + 1), y: spacingY * (row + 1) };
  };

  const legend = Object.entries(STATUS_CONFIG);

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col safe-top safe-bottom">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <p className="text-sm font-semibold text-foreground">Planimetria Sala</p>
          <button onClick={() => setFullscreen(false)} className="p-2 rounded-xl bg-secondary min-w-[40px] min-h-[40px] flex items-center justify-center">
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 px-4 py-2 border-b border-border/30">
          {legend.map(([key, cfg]) => (
            <span key={key} className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          ))}
        </div>
        <div ref={mapRef} className="flex-1 relative overflow-hidden"
          style={{ backgroundImage: "radial-gradient(circle, hsla(var(--border)) 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
          {tables.map((table, index) => {
            const cfg = STATUS_CONFIG[table.status] || STATUS_CONFIG.free;
            const pos = hasPositions ? { x: table.pos_x || 0, y: table.pos_y || 0 } : getAutoPosition(index, tables.length);
            return (
              <motion.div key={table.id} className="absolute" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
                drag={editMode} dragMomentum={false}
                onDragStart={() => setDraggingId(table.id)}
                onDragEnd={(_, info) => handleDragEnd(table.id, info)}
                whileTap={editMode ? { scale: 1.1 } : { scale: 0.92 }}>
                <div onClick={() => !editMode && onStatusChange(table.id, nextStatus[table.status] || "free")}
                  className={`relative w-14 h-14 rounded-2xl ${cfg.bg} ${cfg.border} border-2 flex flex-col items-center justify-center ${
                    draggingId === table.id ? "ring-2 ring-primary shadow-lg" : ""
                  } ${editMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}>
                  <span className="text-base font-display font-bold text-foreground leading-none">{table.table_number}</span>
                  <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${cfg.dot}`} />
                  {table.seats && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-[7px] text-muted-foreground flex items-center justify-center border border-border font-medium">
                      {table.seats}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        <p className="text-[10px] text-muted-foreground text-center py-2">
          {editMode ? "Trascina per posizionare · Salva quando hai finito" : "Tocca un tavolo per cambiare stato"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Legend row + fullscreen button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-x-2.5 gap-y-1 min-w-0">
          {legend.map(([key, cfg]) => (
            <span key={key} className="flex items-center gap-1 text-[9px] text-muted-foreground whitespace-nowrap">
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0`} />
              {cfg.label}
            </span>
          ))}
        </div>
        <button onClick={() => setFullscreen(true)} className="p-2 rounded-lg hover:bg-secondary transition-colors flex-shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center">
          <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Map - compact for mobile */}
      <div ref={mapRef} className="relative rounded-2xl border border-border bg-card/50 overflow-hidden h-[320px] sm:h-[360px]"
        style={{ backgroundImage: "radial-gradient(circle, hsla(var(--border)) 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-secondary/80 text-[8px] text-muted-foreground uppercase tracking-wider z-10">
          Planimetria
        </div>
        {tables.map((table, index) => {
          const cfg = STATUS_CONFIG[table.status] || STATUS_CONFIG.free;
          const pos = hasPositions ? { x: table.pos_x || 0, y: table.pos_y || 0 } : getAutoPosition(index, tables.length);
          return (
            <motion.div key={table.id} className="absolute" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
              drag={editMode} dragMomentum={false}
              onDragStart={() => setDraggingId(table.id)}
              onDragEnd={(_, info) => handleDragEnd(table.id, info)}
              whileTap={editMode ? { scale: 1.1 } : { scale: 0.92 }}>
              <div onClick={() => !editMode && onStatusChange(table.id, nextStatus[table.status] || "free")}
                className={`relative w-12 h-12 rounded-xl ${cfg.bg} ${cfg.border} border-[1.5px] flex flex-col items-center justify-center ${
                  draggingId === table.id ? "ring-2 ring-primary shadow-lg" : ""
                } ${editMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}>
                <span className="text-sm font-display font-bold text-foreground leading-none">{table.table_number}</span>
                <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${cfg.dot}`} />
                {table.seats && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-secondary text-[7px] text-muted-foreground flex items-center justify-center border border-border">
                    {table.seats}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-[9px] text-muted-foreground text-center">
        {editMode ? "Trascina per posizionare · Salva quando hai finito" : "Tocca un tavolo per cambiare stato"}
      </p>
    </div>
  );
};

export default TableMap;
