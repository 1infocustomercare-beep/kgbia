import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

const STORAGE_KEY = "empire_daily_brief_shown";

export default function DailyBriefToast() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;
    const today = new Date().toISOString().split("T")[0];
    const lastShown = localStorage.getItem(STORAGE_KEY);
    if (lastShown === today) return;

    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("seller-daily-brief", {
          body: { user_id: user.id },
        });
        if (cancelled || error || !data?.actions?.length) return;

        localStorage.setItem(STORAGE_KEY, today);

        const top = data.actions.slice(0, 3);
        toast(
          <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                {data.pep_talk || "Piano della giornata"}
              </div>
              <ul className="space-y-1 text-sm">
                {top.map((a: any, i: number) => (
                  <li key={i} className="flex gap-2">
                    <span className={`shrink-0 inline-block h-1.5 w-1.5 mt-2 rounded-full ${a.priority === "alta" ? "bg-rose-500" : a.priority === "media" ? "bg-amber-500" : "bg-emerald-500"}`} />
                    <div>
                      <p>{a.action}</p>
                      <p className="text-xs text-muted-foreground">{a.why} · ~{a.estimated_minutes}min</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>,
          { duration: 12000, id: "daily-brief" }
        );
      } catch (e) {
        console.warn("[DailyBriefToast] skip", e);
      }
    })();

    return () => { cancelled = true; };
  }, [user?.id]);

  return null;
}
