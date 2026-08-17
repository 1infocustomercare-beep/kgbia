import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard, GlassButton } from "@/components/glass";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

export default function VendorSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    phone: "",
    password: "",
    slug: "",
  });

  const submit = async () => {
    if (!form.email || !form.password || !form.displayName) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }
    setLoading(true);
    try {
      const slug = form.slug || slugify(form.displayName);
      // Sign up
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}/vendor/dashboard`,
          data: { role: "seller", display_name: form.displayName },
        },
      });
      if (authErr) throw authErr;
      const userId = authData.user?.id;
      if (!userId) {
        toast.success("Registrato! Controlla l'email per confermare.");
        navigate("/auth");
        return;
      }
      // Best-effort: create seller row + role (may require session)
      // Note: 'seller' identity is defined by the sellers row (user_id); role in user_roles is optional
      await supabase.from("sellers").insert({
        user_id: userId,
        slug,
        display_name: form.displayName,
        email: form.email,
        phone: form.phone || null,
      });
      toast.success("Account venditore creato!");
      navigate("/vendor/dashboard");
    } catch (e: any) {
      toast.error(e.message || "Errore");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "auth-white-input w-full h-12 px-3 rounded-xl bg-white text-black border border-white/40 outline-none focus:border-[hsl(var(--pr-aqua))] focus:ring-2 focus:ring-[hsl(var(--pr-aqua))]/35 placeholder:text-black/45";

  return (
    <>
      <PrestigeTheme />
      <div className="prestige-root prestige-section pglass-scope pglass-app min-h-screen flex items-center justify-center p-4">
        <GlassCard lift={false} className="w-full max-w-md rounded-3xl p-6 space-y-4">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[hsl(var(--pr-gold-light))] to-[hsl(var(--pr-gold-deep))] flex items-center justify-center mb-3">
              <UserPlus className="w-7 h-7 text-[hsl(var(--pr-emerald-deep))]" />
            </div>
            <h1 className="text-2xl font-bold font-heading">Diventa Venditore</h1>
            <p className="text-sm opacity-70 mt-1">Guadagna commissioni sulle vendite</p>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Nome completo *</label>
            <input className={inputCls} value={form.displayName} onChange={e=>setForm({...form,displayName:e.target.value,slug:slugify(e.target.value)})} />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Slug referral</label>
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-60">/?ref=</span>
              <input className={inputCls} value={form.slug} onChange={e=>setForm({...form,slug:slugify(e.target.value)})} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Email *</label>
            <input type="email" className={inputCls} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Telefono</label>
            <input className={inputCls} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Password *</label>
            <input type="password" className={inputCls} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
          </div>
          <GlassButton loading={loading} loadingText="Creazione..." onClick={submit} block size="lg">
            {"Crea account venditore"}
          </GlassButton>
          <p className="text-xs text-center opacity-60">
            Hai già un account? <a href="/auth" className="underline">Accedi</a>
          </p>
        </GlassCard>
      </div>
    </>
  );
}
