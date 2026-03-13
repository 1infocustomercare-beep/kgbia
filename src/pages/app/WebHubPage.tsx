import { useState } from "react";
import { useIndustry } from "@/hooks/useIndustry";
import { LiveSitePreview } from "@/components/app/LiveSitePreview";
import { SitePreviewOverlay } from "@/components/app/SitePreviewOverlay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, Palette, Type, QrCode, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { buildPublicSiteUrl } from "@/lib/public-site-path";

export default function WebHubPage() {
  const { company, config } = useIndustry();
  const [fullPreview, setFullPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const siteUrl = company?.slug
    ? buildPublicSiteUrl(company.slug, company.industry)
    : null;

  const handleCopy = () => {
    if (!siteUrl) return;
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    toast.success("Link copiato!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Caricamento...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading">Sito Web</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestisci e visualizza il tuo sito pubblico
          </p>
        </div>
        {siteUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(siteUrl, "_blank")}
            className="gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Apri Sito
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Preview */}
        <div className="lg:col-span-2 flex items-center justify-center">
          {company.slug && (
            <LiveSitePreview
              slug={company.slug}
              primaryColor={company.primary_color}
              companyName={company.name}
              onExpand={() => setFullPreview(true)}
              industry={company.industry}
            />
          )}
        </div>

        {/* Info Cards */}
        <div className="space-y-4">
          {/* Site URL */}
          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                URL del Sito
              </CardTitle>
            </CardHeader>
            <CardContent>
              {siteUrl && (
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-secondary/50 rounded-lg px-3 py-2 truncate">
                    {siteUrl}
                  </code>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleCopy}>
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Brand */}
          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg border border-border/50"
                  style={{ backgroundColor: company.primary_color || "#C8963E" }}
                />
                <div>
                  <p className="text-xs font-medium">Colore Primario</p>
                  <p className="text-[10px] text-muted-foreground">{company.primary_color || "#C8963E"}</p>
                </div>
              </div>
              {company.secondary_color && (
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg border border-border/50"
                    style={{ backgroundColor: company.secondary_color }}
                  />
                  <div>
                    <p className="text-xs font-medium">Colore Secondario</p>
                    <p className="text-[10px] text-muted-foreground">{company.secondary_color}</p>
                  </div>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => window.location.href = "/app/settings"}
              >
                Modifica Branding
              </Button>
            </CardContent>
          </Card>

          {/* Settore */}
          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Type className="w-4 h-4 text-primary" />
                Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-lg">{config.emoji}</span>
                <div>
                  <p className="text-sm font-medium">{config.label}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">
                    Template {company.industry} luxury
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Preview Overlay */}
      {company.slug && (
        <SitePreviewOverlay
          slug={company.slug}
          companyName={company.name}
          industry={company.industry}
          open={fullPreview}
          onClose={() => setFullPreview(false)}
        />
      )}
    </div>
  );
}
