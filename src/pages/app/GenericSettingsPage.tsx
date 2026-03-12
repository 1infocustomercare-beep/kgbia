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

export default function GenericSettingsPage() {
  const { company, companyId } = useIndustry();
  const { user } = useAuth();

  const [companyForm, setCompanyForm] = useState({ name: "", phone: "", address: "", city: "", email: "" });
  const [profileForm, setProfileForm] = useState({ full_name: "", avatar_url: "" });
  const [brandForm, setBrandForm] = useState({ primary_color: "#C8963E", secondary_color: "#1A1A2E" });

  useEffect(() => {
    if (!company) return;
    setCompanyForm({
      name: company.name || "", phone: (company as any).phone || "",
      address: (company as any).address || "", city: (company as any).city || "",
      email: (company as any).email || "",
    });
    setBrandForm({
      primary_color: company.primary_color || "#C8963E",
      secondary_color: company.secondary_color || "#1A1A2E",
    });
  }, [company]);

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
    toast.success("Dati azienda salvati!");
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

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold font-heading">Impostazioni</h1>
      <Tabs defaultValue="company">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="company"><Building className="w-3.5 h-3.5 mr-1 hidden sm:inline" />Azienda</TabsTrigger>
          <TabsTrigger value="profile"><User className="w-3.5 h-3.5 mr-1 hidden sm:inline" />Profilo</TabsTrigger>
          <TabsTrigger value="branding"><Palette className="w-3.5 h-3.5 mr-1 hidden sm:inline" />Brand</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-6">
          <Card className="border-border/40">
            <CardHeader><CardTitle className="text-sm">Dati Azienda</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Nome</Label><Input value={companyForm.name} onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })} className="h-11" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Telefono</Label><Input value={companyForm.phone} onChange={e => setCompanyForm({ ...companyForm, phone: e.target.value })} className="h-11" /></div>
                <div><Label>Email</Label><Input value={companyForm.email} onChange={e => setCompanyForm({ ...companyForm, email: e.target.value })} className="h-11" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Indirizzo</Label><Input value={companyForm.address} onChange={e => setCompanyForm({ ...companyForm, address: e.target.value })} className="h-11" /></div>
                <div><Label>Città</Label><Input value={companyForm.city} onChange={e => setCompanyForm({ ...companyForm, city: e.target.value })} className="h-11" /></div>
              </div>
              <Button onClick={saveCompany} className="h-11">Salva</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <Card className="border-border/40">
            <CardHeader><CardTitle className="text-sm">Profilo</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Nome Completo</Label><Input value={profileForm.full_name} onChange={e => setProfileForm({ ...profileForm, full_name: e.target.value })} className="h-11" /></div>
              <div><Label>Email</Label><Input value={user?.email || ""} disabled className="opacity-60 h-11" /></div>
              <Button onClick={saveProfile} className="h-11">Salva Profilo</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="mt-6">
          <Card className="border-border/40">
            <CardHeader><CardTitle className="text-sm">Branding</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Colore Primario</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <input type="color" value={brandForm.primary_color} onChange={e => setBrandForm({ ...brandForm, primary_color: e.target.value })} className="w-10 h-10 rounded border-0 cursor-pointer" />
                    <Input value={brandForm.primary_color} onChange={e => setBrandForm({ ...brandForm, primary_color: e.target.value })} className="flex-1 h-11" />
                  </div>
                </div>
                <div><Label>Colore Secondario</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <input type="color" value={brandForm.secondary_color} onChange={e => setBrandForm({ ...brandForm, secondary_color: e.target.value })} className="w-10 h-10 rounded border-0 cursor-pointer" />
                    <Input value={brandForm.secondary_color} onChange={e => setBrandForm({ ...brandForm, secondary_color: e.target.value })} className="flex-1 h-11" />
                  </div>
                </div>
              </div>
              <Button onClick={saveBranding} className="h-11">Salva Branding</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
