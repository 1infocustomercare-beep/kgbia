/**
 * PresetThemeScope
 * Wrapper che applica le CSS variables di un MockupStylePreset SOLO al suo
 * sotto-albero. Bottoni, card, menu, badge, input ereditano automaticamente
 * la palette del brand selezionato (perché usano i token semantici di Tailwind).
 *
 * Uso:
 *   <PresetThemeScope preset={preset}>
 *     <Button>Coerente col brand</Button>
 *     <Card>...</Card>
 *   </PresetThemeScope>
 */
import { useEffect, useMemo, type ReactNode } from "react";
import {
  buildPresetCssVars,
  ensurePresetGoogleFonts,
} from "@/lib/preset-theme";
import type { MockupStylePreset } from "@/lib/mockup-style-presets";
import { cn } from "@/lib/utils";

interface Props {
  preset: MockupStylePreset | null | undefined;
  children: ReactNode;
  /** se true applica anche font heading/body al container */
  applyTypography?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function PresetThemeScope({
  preset,
  children,
  applyTypography = true,
  className,
  as: Tag = "div",
}: Props) {
  const style = useMemo(() => {
    if (!preset) return undefined;
    const vars = buildPresetCssVars(preset);
    if (applyTypography) {
      (vars as Record<string, string>)["fontFamily"] =
        `"${preset.fonts.body}", sans-serif`;
    }
    return vars as React.CSSProperties;
  }, [preset, applyTypography]);

  useEffect(() => {
    if (preset) ensurePresetGoogleFonts(preset);
  }, [preset]);

  const Component = Tag as keyof JSX.IntrinsicElements;
  return (
    // @ts-expect-error dynamic tag
    <Component
      data-preset-scope={preset?.key || "none"}
      style={style}
      className={cn("preset-theme-scope", className)}
    >
      {children}
    </Component>
  );
}
