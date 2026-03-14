import { useIndustry } from "@/hooks/useIndustry";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CalendarRange, Flag, CheckCircle, Clock, Camera } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const PHASES = [
  { id: "1", name: "Demolizioni", start: "2026-01-15", end: "2026-02-01", progress: 100, milestone: false },
  { id: "2", name: "Fondazioni", start: "2026-02-01", end: "2026-03-01", progress: 100, milestone: true },
  { id: "3", name: "Struttura", start: "2026-03-01", end: "2026-04-15", progress: 65, milestone: false },
  { id: "4", name: "Impianti", start: "2026-04-15", end: "2026-05-30", progress: 20, milestone: false },
  { id: "5", name: "Finiture", start: "2026-06-01", end: "2026-07-15", progress: 0, milestone: false },
  { id: "6", name: "Consegna", start: "2026-07-15", end: "2026-07-30", progress: 0, milestone: true },
];

export default function ProjectTimelinePage() {
  const [selected, setSelected] = useState<any>(null);
  const totalProgress = Math.round(PHASES.reduce((s, p) => s + p.progress, 0) / PHASES.length);

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <CalendarRange className="w-6 h-6 text-primary" />Timeline Cantiere
        </h1>
        <Badge variant="secondary">Completamento: {totalProgress}%</Badge>
      </div>

      <Card className="border-border/30">
        <CardContent className="p-4">
          <Progress value={totalProgress} className="h-3 mb-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Gen 2026</span><span>Lug 2026</span>
          </div>
        </CardContent>
      </Card>

      {/* Gantt-like bars */}
      <div className="space-y-3">
        {PHASES.map(phase => (
          <Card
            key={phase.id}
            className="border-border/30 hover:border-primary/30 transition-colors cursor-pointer"
            onClick={() => setSelected(phase)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                {phase.milestone ? (
                  <Flag className="w-4 h-4 text-amber-400" />
                ) : phase.progress === 100 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Clock className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="font-medium text-sm flex-1">{phase.name}</span>
                <Badge variant={phase.progress === 100 ? "default" : "secondary"} className="text-xs">
                  {phase.progress}%
                </Badge>
              </div>
              <div className="relative h-6 rounded-full bg-muted/20 overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    phase.progress === 100 ? "bg-emerald-500/60" : phase.progress > 0 ? "bg-primary/60" : "bg-muted/10"
                  }`}
                  style={{ width: `${phase.progress}%` }}
                />
                <div className="absolute inset-0 flex items-center px-3 text-xs text-muted-foreground">
                  {phase.start.slice(5)} → {phase.end.slice(5)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent>
          {selected && (
            <div className="space-y-4">
              <SheetHeader><SheetTitle>{selected.name}</SheetTitle></SheetHeader>
              <div className="space-y-3">
                <div className="text-sm"><strong>Inizio:</strong> {selected.start}</div>
                <div className="text-sm"><strong>Fine:</strong> {selected.end}</div>
                <Progress value={selected.progress} className="h-2" />
                <p className="text-sm text-muted-foreground">Completamento: {selected.progress}%</p>
                <div className="h-32 rounded-lg bg-muted/20 border border-dashed border-border/30 flex items-center justify-center text-sm text-muted-foreground">
                  <Camera className="w-5 h-5 mr-2" />Foto cantiere (fase)
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
