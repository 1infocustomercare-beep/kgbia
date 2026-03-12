import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Building, User, Palette, Globe, Settings, Save, Database, Loader2 } from "lucide-react";
import { useIndustry } from "@/hooks/useIndustry";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";

export default function NCCSettingsPage() {
  const { company, companyId } = useIndustry();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Company tab
  const [companyForm, setCompanyForm] = useState({
    name: "", phone: "", address: "", city: "", email: "",
  });

  // Extended settings
  const { data: settings } = useQuery({
    queryKey: ["company-settings", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("company_settings").select("*").eq("company_id", companyId!).maybeSingle();
      return data;
    },
  });

  const [extForm, setExtForm] = useState({
    vat: "", whatsapp: "", instagram_url: "", facebook_url: "", hours: "",
    confirmation_message: "", email_template: "",
    bookings_enabled: true, require_deposit: false, deposit_percentage: "30", currency: "EUR",
  });

  // Profile tab
  const [profileForm, setProfileForm] = useState({ full_name: "", avatar_url: "" });

  // Brand tab
  const [brandForm, setBrandForm] = useState({ primary_color: "#D4A017", secondary_color: "#1A1A2E" });

  // SEO
  const { data: seo } = useQuery({
    queryKey: ["seo-settings", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("seo_settings").select("*").eq("company_id", companyId!).maybeSingle();
      return data;
    },
  });

  const [seoForm, setSeoForm] = useState({ meta_title: "", meta_description: "", og_image_url: "", keywords: "" });

  useEffect(() => {
    if (!company) return;
    setCompanyForm({
      name: company.name || "", phone: (company as any).phone || "",
      address: (company as any).address || "", city: (company as any).city || "",
      email: (company as any).email || "",
    });
    setBrandForm({
      primary_color: company.primary_color || "#D4A017",
      secondary_color: company.secondary_color || "#1A1A2E",
    });
  }, [company]);

  useEffect(() => {
    if (!settings) return;
    setExtForm({
      vat: (settings as any).vat || "", whatsapp: (settings as any).whatsapp || "",
      instagram_url: (settings as any).instagram_url || "", facebook_url: (settings as any).facebook_url || "",
      hours: (settings as any).hours || "", confirmation_message: (settings as any).confirmation_message || "",
      email_template: (settings as any).email_template || "",
      bookings_enabled: (settings as any).bookings_enabled ?? true,
      require_deposit: (settings as any).require_deposit ?? false,
      deposit_percentage: String((settings as any).deposit_percentage ?? 30),
      currency: (settings as any).currency || "EUR",
    });
  }, [settings]);

  useEffect(() => {
    if (!seo) return;
    setSeoForm({
      meta_title: (seo as any).meta_title || "", meta_description: (seo as any).meta_description || "",
      og_image_url: (seo as any).og_image_url || "", keywords: (seo as any).keywords || "",
    });
  }, [seo]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, avatar_url").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data) setProfileForm({ full_name: data.full_name || "", avatar_url: data.avatar_url || "" }); });
  }, [user]);

  const saveCompany = async () => {
    if (!companyId) return;
    await supabase.from("companies").update({
      name: companyForm.name, phone: companyForm.phone || null,
      address: companyForm.address || null, city: companyForm.city || null,
      email: companyForm.email || null,
    }).eq("id", companyId);

    // Upsert extended settings
    await supabase.from("company_settings").upsert({
      company_id: companyId, vat: extForm.vat || null,
      whatsapp: extForm.whatsapp || null, instagram_url: extForm.instagram_url || null,
      facebook_url: extForm.facebook_url || null, hours: extForm.hours || null,
      confirmation_message: extForm.confirmation_message || null,
      email_template: extForm.email_template || null,
      bookings_enabled: extForm.bookings_enabled,
      require_deposit: extForm.require_deposit,
      deposit_percentage: parseFloat(extForm.deposit_percentage) || 30,
      currency: extForm.currency,
    }, { onConflict: "company_id" });

    toast.success("Dati azienda salvati!");
    queryClient.invalidateQueries({ queryKey: ["company-settings"] });
  };

  const saveProfile = async () => {
    if (!user) return;
    await supabase.from("profiles").update({ full_name: profileForm.full_name || null }).eq("user_id", user.id);
    toast.success("Profilo aggiornato!");
  };

  const saveBranding = async () => {
    if (!companyId) return;
    await supabase.from("companies").update({ primary_color: brandForm.primary_color, secondary_color: brandForm.secondary_color }).eq("id", companyId);
    toast.success("Branding salvato!");
  };

  const saveSeo = async () => {
    if (!companyId) return;
    await supabase.from("seo_settings").upsert({
      company_id: companyId, meta_title: seoForm.meta_title || null,
      meta_description: seoForm.meta_description || null,
      og_image_url: seoForm.og_image_url || null, keywords: seoForm.keywords || null,
    }, { onConflict: "company_id" });
    toast.success("SEO salvato!");
    queryClient.invalidateQueries({ queryKey: ["seo-settings"] });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold font-heading">Impostazioni</h1>
      <Tabs defaultValue="company">
        <TabsList className="bg-secondary/50 overflow-x-auto flex-nowrap">
          <TabsTrigger value="company" className="text-xs sm:text-sm"><Building className="w-3.5 h-3.5 mr-1 hidden sm:inline" />Azienda</TabsTrigger>
          <TabsTrigger value="profile" className="text-xs sm:text-sm"><User className="w-3.5 h-3.5 mr-1 hidden sm:inline" />Profilo</TabsTrigger>
          <TabsTrigger value="branding" className="text-xs sm:text-sm"><Palette className="w-3.5 h-3.5 mr-1 hidden sm:inline" />Brand</TabsTrigger>
          <TabsTrigger value="seo" className="text-xs sm:text-sm"><Globe className="w-3.5 h-3.5 mr-1 hidden sm:inline" />SEO</TabsTrigger>
          <TabsTrigger value="seed" className="text-xs sm:text-sm"><Database className="w-3.5 h-3.5 mr-1 hidden sm:inline" />Seed Dati</TabsTrigger>
        </TabsList>

        {/* ── Azienda ── */}
        <TabsContent value="company" className="mt-6 space-y-6">
          <Card className="border-border/40">
            <CardHeader><CardTitle className="text-sm">Dati Azienda</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Nome Azienda</Label><Input value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} className="h-11" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><Label>Partita IVA</Label><Input value={extForm.vat} onChange={(e) => setExtForm({ ...extForm, vat: e.target.value })} className="h-11" placeholder="02651120616" /></div>
                <div><Label>Indirizzo</Label><Input value={companyForm.address} onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })} className="h-11" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><Label>Telefono</Label><Input value={companyForm.phone} onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })} className="h-11" /></div>
                <div><Label>Email</Label><Input value={companyForm.email} onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })} className="h-11" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><Label>WhatsApp</Label><Input value={extForm.whatsapp} onChange={(e) => setExtForm({ ...extForm, whatsapp: e.target.value })} className="h-11" placeholder="3248306593" /></div>
                <div><Label>Orari di Servizio</Label><Input value={extForm.hours} onChange={(e) => setExtForm({ ...extForm, hours: e.target.value })} className="h-11" placeholder="06:00–23:00" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><Label>Instagram URL</Label><Input value={extForm.instagram_url} onChange={(e) => setExtForm({ ...extForm, instagram_url: e.target.value })} className="h-11" /></div>
                <div><Label>Facebook URL</Label><Input value={extForm.facebook_url} onChange={(e) => setExtForm({ ...extForm, facebook_url: e.target.value })} className="h-11" /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader><CardTitle className="text-sm">Prenotazioni & Pagamenti</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Switch checked={extForm.bookings_enabled} onCheckedChange={(v) => setExtForm({ ...extForm, bookings_enabled: v })} />
                <Label>Abilita prenotazioni online dal sito</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={extForm.require_deposit} onCheckedChange={(v) => setExtForm({ ...extForm, require_deposit: v })} />
                <Label>Richiedi acconto obbligatorio</Label>
              </div>
              {extForm.require_deposit && (
                <div><Label>Percentuale acconto (%)</Label><Input type="number" value={extForm.deposit_percentage} onChange={(e) => setExtForm({ ...extForm, deposit_percentage: e.target.value })} className="h-11 w-32" /></div>
              )}
              <div><Label>Messaggio Conferma</Label><Input value={extForm.confirmation_message} onChange={(e) => setExtForm({ ...extForm, confirmation_message: e.target.value })} className="h-11" placeholder="Grazie per la tua prenotazione!" /></div>
              <div>
                <Label>Template Email Conferma</Label>
                <p className="text-xs text-muted-foreground mb-1">Variabili: {"{{nome_cliente}}"}, {"{{tratta}}"}, {"{{data}}"}, {"{{ora}}"}, {"{{veicolo}}"}, {"{{autista}}"}, {"{{prezzo}}"}</p>
                <Textarea value={extForm.email_template} onChange={(e) => setExtForm({ ...extForm, email_template: e.target.value })} rows={5} />
              </div>
              <Button className="h-11 min-h-[44px]" onClick={saveCompany}><Save className="w-4 h-4 mr-2" />Salva Impostazioni</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Profilo ── */}
        <TabsContent value="profile" className="mt-6">
          <Card className="border-border/40">
            <CardHeader><CardTitle className="text-sm">Profilo Personale</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Nome Completo</Label><Input value={profileForm.full_name} onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })} className="h-11" /></div>
              <div><Label>Email</Label><Input value={user?.email || ""} disabled className="opacity-60 h-11" /></div>
              <Button className="h-11 min-h-[44px]" onClick={saveProfile}><Save className="w-4 h-4 mr-2" />Salva Profilo</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Branding ── */}
        <TabsContent value="branding" className="mt-6">
          <Card className="border-border/40">
            <CardHeader><CardTitle className="text-sm">Branding & Colori</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Colore Primario (Oro)</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <input type="color" value={brandForm.primary_color} onChange={(e) => setBrandForm({ ...brandForm, primary_color: e.target.value })} className="w-10 h-10 rounded border-0 cursor-pointer" />
                    <Input value={brandForm.primary_color} onChange={(e) => setBrandForm({ ...brandForm, primary_color: e.target.value })} className="flex-1 h-11" />
                  </div>
                </div>
                <div><Label>Colore Sfondo</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <input type="color" value={brandForm.secondary_color} onChange={(e) => setBrandForm({ ...brandForm, secondary_color: e.target.value })} className="w-10 h-10 rounded border-0 cursor-pointer" />
                    <Input value={brandForm.secondary_color} onChange={(e) => setBrandForm({ ...brandForm, secondary_color: e.target.value })} className="flex-1 h-11" />
                  </div>
                </div>
              </div>
              <Button className="h-11 min-h-[44px]" onClick={saveBranding}><Save className="w-4 h-4 mr-2" />Salva Branding</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── SEO ── */}
        <TabsContent value="seo" className="mt-6 space-y-6">
          <Card className="border-border/40">
            <CardHeader><CardTitle className="text-sm">SEO & Open Graph</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between"><Label>Meta Title</Label><span className="text-xs text-muted-foreground">{seoForm.meta_title.length}/60</span></div>
                <Input value={seoForm.meta_title} onChange={(e) => setSeoForm({ ...seoForm, meta_title: e.target.value.slice(0, 60) })} className="h-11" placeholder="NCC Telese Viaggi - Transfer Costiera Amalfitana" />
              </div>
              <div>
                <div className="flex justify-between"><Label>Meta Description</Label><span className="text-xs text-muted-foreground">{seoForm.meta_description.length}/160</span></div>
                <Textarea value={seoForm.meta_description} onChange={(e) => setSeoForm({ ...seoForm, meta_description: e.target.value.slice(0, 160) })} rows={3} />
              </div>
              <div><Label>URL Immagine Open Graph</Label><Input value={seoForm.og_image_url} onChange={(e) => setSeoForm({ ...seoForm, og_image_url: e.target.value })} className="h-11" placeholder="https://..." /></div>
              <div><Label>Keywords (separati da virgola)</Label><Input value={seoForm.keywords} onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })} className="h-11" placeholder="NCC, transfer, costiera amalfitana, Ravello" /></div>
              <Button className="h-11 min-h-[44px]" onClick={saveSeo}><Save className="w-4 h-4 mr-2" />Salva SEO</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
