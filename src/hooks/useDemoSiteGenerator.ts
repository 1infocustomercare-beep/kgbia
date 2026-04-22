/**
 * useDemoSiteGenerator — Hook unificato per generare e gestire siti demo Full Power.
 * Integra Branding Kit corrente + blueprint settoriale + invocazione edge function.
 */
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useBrandingKitSettings } from "@/hooks/useBrandingKitSettings";
import { findBlueprintBySector } from "@/lib/demo-site-blueprints";
import { toast } from "@/hooks/use-toast";

export interface GenerateDemoSiteParams {
  leadId?: string;
  businessName: string;
  sector: string;
  subSector?: string;
  websiteUrl?: string;
  templateVariant?: string;
  reuseSourceId?: string;
  /** Se true e Branding Kit è lockato, usa i suoi valori. Default: true. */
  useBrandingKit?: boolean;
}

export interface DemoSite {
  id: string;
  owner_id: string;
  lead_id: string | null;
  business_name: string;
  sector: string;
  sub_sector: string | null;
  public_slug: string;
  status: string;
  preview_url: string | null;
  admin_url: string | null;
  admin_email: string | null;
  admin_password: string | null;
  whatsapp_message: string | null;
  whatsapp_link: string | null;
  branding_snapshot: any;
  agents_activated: any;
  modules_enabled: any;
  view_count: number;
  cta_click_count: number;
  conversion_status: string | null;
  template_variant: string | null;
  reuse_count: number;
  generated_at: string | null;
  created_at: string;
}

export function useDemoSiteGenerator() {
  const { user } = useAuth();
  const { settings: brandingKit } = useBrandingKitSettings();
  const [generating, setGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<DemoSite | null>(null);

  const generate = useCallback(
    async (params: GenerateDemoSiteParams): Promise<DemoSite | null> => {
      if (!user?.id) {
        toast({ title: "Login richiesto", variant: "destructive" });
        return null;
      }

      const blueprint = findBlueprintBySector(params.sector);
      if (!blueprint) {
        toast({
          title: "Settore non supportato",
          description: `Nessun blueprint trovato per "${params.sector}".`,
          variant: "destructive",
        });
        return null;
      }

      setGenerating(true);
      try {
        const useBK = params.useBrandingKit !== false && brandingKit.brandLocked;

        const { data, error } = await supabase.functions.invoke("demo-site-generator", {
          body: {
            lead_id: params.leadId,
            business_name: params.businessName,
            sector: params.sector,
            sub_sector: params.subSector,
            website_url: params.websiteUrl,
            template_variant: params.templateVariant,
            blueprint_slug: blueprint.slug,
            reuse_source_id: params.reuseSourceId,
            branding: useBK
              ? {
                  primaryColor: brandingKit.primaryColor,
                  fontHead: brandingKit.fontHead,
                  fontBody: brandingKit.fontBody,
                }
              : undefined,
          },
        });

        if (error) {
          toast({
            title: "Errore generazione",
            description: error.message ?? "Impossibile generare il sito demo.",
            variant: "destructive",
          });
          return null;
        }

        if (!data?.success) {
          const errCode = data?.error;
          const friendly =
            errCode === "insufficient_credits"
              ? `Crediti insufficienti. Servono 25 crediti (saldo: ${data?.balance ?? 0}).`
              : errCode === "monthly_cap_reached"
              ? `Tetto mensile raggiunto.`
              : data?.error || "Generazione fallita";
          toast({ title: "Generazione bloccata", description: friendly, variant: "destructive" });
          return null;
        }

        const site = data.demo_site as DemoSite;
        setLastResult(site);
        toast({
          title: "🚀 Sito Demo Generato!",
          description: `${site.business_name} — pronto per essere mostrato. -${data.credits_used} crediti.`,
        });
        return site;
      } catch (err: any) {
        toast({ title: "Errore", description: err.message, variant: "destructive" });
        return null;
      } finally {
        setGenerating(false);
      }
    },
    [user?.id, brandingKit]
  );

  return { generate, generating, lastResult };
}
