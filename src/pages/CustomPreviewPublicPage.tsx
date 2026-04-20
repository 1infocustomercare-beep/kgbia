import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function CustomPreviewPublicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data, error } = await supabase
        .from("seller_custom_previews" as any)
        .select("preview_html, generation_status, lead_name")
        .eq("public_slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error || !data) {
        setError("Preview non trovata o non più disponibile");
        setLoading(false);
        return;
      }
      const row = data as any;
      if (row.generation_status === "generating") {
        setError("La preview è ancora in generazione. Riprova tra qualche secondo.");
        setLoading(false);
        return;
      }
      if (!row.preview_html) {
        setError("Contenuto preview non disponibile");
        setLoading(false);
        return;
      }
      setHtml(row.preview_html);
      setLoading(false);
      // Track view (fire-and-forget)
      supabase.rpc("increment_custom_preview_view" as any, { p_slug: slug }).then(() => {});
      document.title = `${row.lead_name || "Preview"} — Empire AI`;
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !html) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Preview non disponibile</h1>
          <p className="text-muted-foreground">{error || "Si è verificato un errore"}</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      srcDoc={html}
      title="Preview"
      className="w-full h-screen border-0 block"
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
    />
  );
}
