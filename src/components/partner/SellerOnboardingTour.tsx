import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Joyride, STATUS, type Step } from "react-joyride";
type CallBackProps = { status: string };
import { getCoachForRoute } from "@/data/sellerCoach";

const TOUR_STORAGE_PREFIX = "empire_seller_tour_v1_";

export default function SellerOnboardingTour() {
  const location = useLocation();
  const chapter = getCoachForRoute(location.pathname);
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    if (!chapter.tourSteps || chapter.tourSteps.length === 0) {
      setRun(false);
      return;
    }
    const key = TOUR_STORAGE_PREFIX + chapter.routePrefix;
    if (localStorage.getItem(key) === "done") {
      setRun(false);
      return;
    }
    // Verifica che almeno il primo target esista, altrimenti aspetta render
    const timeout = setTimeout(() => {
      const firstTarget = chapter.tourSteps?.[0]?.target;
      if (firstTarget && document.querySelector(firstTarget)) {
        setSteps(
          chapter.tourSteps!.map((s) => ({
            target: s.target,
            title: s.title,
            content: s.content,
            disableBeacon: true,
          }))
        );
        setRun(true);
      }
    }, 800);
    return () => clearTimeout(timeout);
  }, [chapter.routePrefix]);

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      localStorage.setItem(TOUR_STORAGE_PREFIX + chapter.routePrefix, "done");
      setRun(false);
    }
  };

  if (!run || steps.length === 0) return null;

  const J: any = Joyride;
  return (
    <J
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleCallback}
      locale={{ back: "Indietro", close: "Chiudi", last: "Fine", next: "Avanti", skip: "Salta tour" }}
      styles={{
        tooltip: { borderRadius: 12, padding: 16, backgroundColor: "hsl(var(--card))", color: "hsl(var(--foreground))" },
        buttonNext: { borderRadius: 8, fontSize: 13, backgroundColor: "hsl(var(--primary))" },
        buttonBack: { color: "hsl(var(--muted-foreground))", fontSize: 13 },
        buttonSkip: { color: "hsl(var(--muted-foreground))", fontSize: 12 },
        overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
      }}
    />
  );
}
