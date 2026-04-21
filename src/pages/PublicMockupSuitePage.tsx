import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { MockupSuiteViewer, type SuiteScreen } from "@/components/partner/MockupSuiteViewer";

function normalizeScreens(raw: any): SuiteScreen[] {
  const arr = Array.isArray(raw) ? raw : (raw?.screens || []);
  return arr.map((sc: any, i: number): SuiteScreen => {
    if (typeof sc === "string") {
      return { type: ["home", "menu", "booking", "profile"][i] || `screen_${i}`, title: `Screen ${i + 1}`, image_url: sc, render_mode: "ai" };
    }
    return {
      type: sc?.type || ["home", "menu", "booking", "profile"][i] || `screen_${i}`,
      title: sc?.title || `Screen ${i + 1}`,
      image_url: sc?.image_url || sc?.url || null,
      render_mode: sc?.render_mode || (sc?.image_url ? "ai" : "react"),
      template_variant: sc?.template_variant,
      engine: sc?.engine,
    };
  });
}

export default function PublicMockupSuitePage() {
  const { slug } = useParams<{ slug: string }>();
  const [suite, setSuite] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase
        .from("seller_mockup_suites")
        .select("*")
        .eq("share_slug", slug)
        .eq("status", "complete")
        .maybeSingle();
      setSuite(data);
      setLoading(false);
      if (data) {
        await supabase.from("seller_mockup_suites").update({ view_count: (data.view_count || 0) + 1 }).eq("id", data.id);
      }
    })();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!suite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Suite non trovata o non ancora pronta.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: suite.primary_color }}>{suite.business_name}</h1>
          <p className="text-muted-foreground mt-1">{suite.business_sector} · {suite.business_city}</p>
          <p className="text-xs text-muted-foreground mt-2">Anteprima app personalizzata · 4 schermate iPhone</p>
        </div>

        <MockupSuiteViewer
          screens={normalizeScreens(suite.screens)}
          templateVariant={suite.template_variant}
          businessName={suite.business_name}
          businessSector={suite.business_sector}
          businessCity={suite.business_city}
          primaryColor={suite.primary_color}
          suiteId={suite.id}
        />

        <p className="text-center text-xs text-muted-foreground mt-12">
          Realizzato con <strong>Empire AI</strong>
        </p>
      </div>
    </div>
  );
}
