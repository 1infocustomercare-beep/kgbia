import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "empire-feature-guides-enabled";

export function useFeatureGuides() {
  const [enabled, setEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === null ? true : stored === "true";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch {}
  }, [enabled]);

  const toggle = useCallback(() => setEnabled(prev => !prev), []);

  return { guidesEnabled: enabled, toggleGuides: toggle, setGuidesEnabled: setEnabled };
}
