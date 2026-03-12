import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building, User, Palette } from "lucide-react";
import { useIndustry } from "@/hooks/useIndustry";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SettingsPage() {
  const { company, companyId } = useIndustry();
  const { user } = useAuth();

  // Company tab state
  const [companyForm, setCompanyForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    email: "",
  });

  // Profile tab state
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    avatar_url: "",
  });

  // Branding tab state
  const [brandForm, setBrandForm] = useState({
    primary_color: "#C8963E",
    secondary_color: "#1a1a2e",
  });

  // FIX C: pre-populate form when company data loads
  useEffect(() => {
    if (!company) return;
    setCompanyForm({
      name: company.name || "",
      phone: (company as any).phone || "",
      address: (company as any).address || "",
      city: (company as any).city || "",
      email: (company as any).email || "",
    });
    setBrandForm({
      primary_color: company.primary_color || "#C8963E",
      secondary_color: company.secondary_color || "#1a1a2e",
    });
  }, [company]);

  // Load profile data
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, avatar_url").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data) setProfileForm({ full_name: data.full_name || "", avatar_url: data.avatar_url || "" });
      });
  }, [user]);

  const saveCompany = async () => {
    if (!companyId) return;
    const { error } = await supabase
      .from("companies" as any)
      .update({
        name: companyForm.name,
        phone: companyForm.phone || null,
        address: companyForm.address || null,
        city: companyForm.city || null,
        email: companyForm.email || null,
      })
      .eq("id", companyId);

    if (error) {
      await supabase.from("restaurants").update({
        name: companyForm.name,
        phone: companyForm.phone || null,
        address: companyForm.address || null,
        city: companyForm.city || null,
        email: companyForm.email || null,
      }).eq("id", companyId);
    }
    toast.success("Dati azienda salvati!");
  };

  const saveProfile = async () => {
    if (!user) return;
    await supabase.from("profiles").update({
      full_name: profileForm.full_name || null,
      avatar_url: profileForm.avatar_url || null,
    }).eq("user_id", user.id);
    toast.success("Profilo aggiornato!");
  };

  const saveBranding = async () => {
    if (!companyId) return;
    await supabase.from("companies" as any).update({
      primary_color: brandForm.primary_color,
      secondary_color: brandForm.secondary_color,
    }).eq("id", companyId);
    toast.success("Branding salvato!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold font-heading">Impostazioni</h1>

      <Tabs defaultValue="company">
        <TabsList className="bg-secondary/50 overflow-x-auto">
          <TabsTrigger value="company" className="flex items-center gap-2"><Building className="w-4 h-4" />Azienda</TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2"><User className="w-4 h-4" />Profilo</TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2"><Palette className="w-4 h-4" />Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-6">
          <Card className="glass border-border/50">
            <CardHeader><CardTitle>Dati Azienda</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Nome Azienda</Label><Input value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} className="h-11 min-h-[44px]" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><Label>Telefono</Label><Input value={companyForm.phone} onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })} className="h-11 min-h-[44px]" /></div>
                <div><Label>Email</Label><Input value={companyForm.email} onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })} className="h-11 min-h-[44px]" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><Label>Indirizzo</Label><Input value={companyForm.address} onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })} className="h-11 min-h-[44px]" /></div>
                <div><Label>Città</Label><Input value={companyForm.city} onChange={(e) => setCompanyForm({ ...companyForm, city: e.target.value })} className="h-11 min-h-[44px]" /></div>
              </div>
              <Button className="bg-vibrant-gradient text-white h-11 min-h-[44px]" onClick={saveCompany}>Salva</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <Card className="glass border-border/50">
            <CardHeader><CardTitle>Profilo Personale</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Nome Completo</Label><Input value={profileForm.full_name} onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })} className="h-11 min-h-[44px]" /></div>
              <div><Label>Email</Label><Input value={user?.email || ""} disabled className="opacity-60 h-11 min-h-[44px]" /></div>
              <Button className="bg-vibrant-gradient text-white h-11 min-h-[44px]" onClick={saveProfile}>Salva Profilo</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="mt-6">
          <Card className="glass border-border/50">
            <CardHeader><CardTitle>Branding & Colori</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Colore Primario</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <input type="color" value={brandForm.primary_color} onChange={(e) => setBrandForm({ ...brandForm, primary_color: e.target.value })} className="w-10 h-10 rounded border-0 cursor-pointer" />
                    <Input value={brandForm.primary_color} onChange={(e) => setBrandForm({ ...brandForm, primary_color: e.target.value })} className="flex-1 h-11 min-h-[44px]" />
                  </div>
                </div>
                <div>
                  <Label>Colore Secondario</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <input type="color" value={brandForm.secondary_color} onChange={(e) => setBrandForm({ ...brandForm, secondary_color: e.target.value })} className="w-10 h-10 rounded border-0 cursor-pointer" />
                    <Input value={brandForm.secondary_color} onChange={(e) => setBrandForm({ ...brandForm, secondary_color: e.target.value })} className="flex-1 h-11 min-h-[44px]" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-lg" style={{ background: brandForm.primary_color }}>
                <span style={{ color: "#fff" }} className="font-bold">Anteprima Primario</span>
              </div>
              <Button className="bg-vibrant-gradient text-white h-11 min-h-[44px]" onClick={saveBranding}>Salva Branding</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
