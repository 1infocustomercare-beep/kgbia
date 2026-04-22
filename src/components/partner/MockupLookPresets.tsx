import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { BookmarkPlus, Trash2, Bookmark, Check } from "lucide-react";
import { toast } from "sonner";
import type { ColorStyle } from "./MockupReactScreen";

export interface MockupLookPreset {
  id: string;
  name: string;
  templateVariant: string;
  glassIntensity: number;
  colorStyle: ColorStyle;
  safeAreaPx: number;
  typeScale: number;
  boostContrast: boolean;
  createdAt: number;
}

const STORAGE_KEY = "mockup_look_presets_v1";

function loadPresets(): MockupLookPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function savePresets(presets: MockupLookPreset[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

interface Props {
  current: Omit<MockupLookPreset, "id" | "name" | "createdAt">;
  onApply: (preset: MockupLookPreset) => void;
}

export function MockupLookPresets({ current, onApply }: Props) {
  const [presets, setPresets] = useState<MockupLookPreset[]>([]);
  const [name, setName] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => { setPresets(loadPresets()); }, []);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) { toast.error("Dai un nome al preset"); return; }
    const exists = presets.find(p => p.name.toLowerCase() === trimmed.toLowerCase());
    const preset: MockupLookPreset = {
      id: exists?.id || crypto.randomUUID(),
      name: trimmed,
      createdAt: Date.now(),
      ...current,
    };
    const next = exists
      ? presets.map(p => p.id === exists.id ? preset : p)
      : [preset, ...presets].slice(0, 30);
    setPresets(next);
    savePresets(next);
    setActiveId(preset.id);
    setName("");
    toast.success(exists ? `Preset "${trimmed}" aggiornato` : `Preset "${trimmed}" salvato`);
  };

  const handleApply = (p: MockupLookPreset) => {
    onApply(p);
    setActiveId(p.id);
    toast.success(`Look "${p.name}" applicato`);
  };

  const handleDelete = (id: string) => {
    const next = presets.filter(p => p.id !== id);
    setPresets(next);
    savePresets(next);
    if (activeId === id) setActiveId(null);
    toast.success("Preset eliminato");
  };

  return (
    <div className="rounded-xl border border-secondary/30 bg-gradient-to-br from-secondary/[0.05] to-transparent p-4 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Label className="flex items-center gap-1.5 m-0">
          <Bookmark className="h-3.5 w-3.5 text-primary" /> Preset Look
        </Label>
        <Badge variant="outline" className="text-[10px]">{presets.length}/30</Badge>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Nome preset (es. Sushi Glass Vivid)"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }}
          className="h-8 text-xs"
        />
        <Button type="button" size="sm" onClick={handleSave} className="h-8 gap-1">
          <BookmarkPlus className="h-3.5 w-3.5" /> Salva
        </Button>
      </div>

      {presets.length === 0 ? (
        <p className="text-[10px] text-muted-foreground italic">
          Nessun preset salvato. Configura template + glass + color style + safe-area, poi salvalo per riapplicarlo al volo.
        </p>
      ) : (
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
          {presets.map(p => {
            const active = activeId === p.id;
            return (
              <div
                key={p.id}
                className={`group flex items-center gap-1 rounded-full border pl-2 pr-1 py-0.5 text-[10px] transition-all ${
                  active ? "border-primary bg-primary/10 shadow-sm" : "border-border hover:border-primary/40"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleApply(p)}
                  className="flex items-center gap-1 font-semibold"
                  title={`${p.templateVariant} · glass ${p.glassIntensity}% · ${p.colorStyle} · safe ${p.safeAreaPx}px · ${p.typeScale.toFixed(2)}× · AA ${p.boostContrast ? "on" : "off"}`}
                >
                  {active && <Check className="h-2.5 w-2.5" />}
                  {p.name}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="opacity-50 hover:opacity-100 hover:text-destructive transition-opacity"
                  aria-label="Elimina preset"
                >
                  <Trash2 className="h-2.5 w-2.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
