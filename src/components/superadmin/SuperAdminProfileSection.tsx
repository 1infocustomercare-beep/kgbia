import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  User, Camera, Save, Phone, MapPin, Mail, Globe, Crown,
  Building, Loader2, X, ShieldCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Props {
  userId: string;
  userName: string;
  userEmail: string;
  onAvatarChange?: (url: string | null) => void;
}

interface ProfileData {
  full_name: string;
  avatar_url: string;
  phone: string;
  city: string;
  bio: string;
  website: string;
  company_name: string;
  email: string;
}

const EMPTY: ProfileData = {
  full_name: "", avatar_url: "", phone: "", city: "",
  bio: "", website: "", company_name: "", email: "",
};

export default function SuperAdminProfileSection({ userId, userName, userEmail, onAvatarChange }: Props) {
  const [profile, setProfile] = useState<ProfileData>({ ...EMPTY, full_name: userName, email: userEmail });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!userId || loaded) return;
    supabase
      .from("profiles")
      .select("full_name, avatar_url, phone, city, bio, website, company_name, email")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfile({
            full_name: data.full_name || userName,
            avatar_url: data.avatar_url || "",
            phone: data.phone || "",
            city: data.city || "",
            bio: data.bio || "",
            website: data.website || "",
            company_name: data.company_name || "",
            email: data.email || userEmail,
          });
        }
        setLoaded(true);
      });
  }, [userId]);

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast({ title: "File troppo grande", description: "Max 4MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const path = `${userId}/superadmin-avatar.${ext}`;
      const { error: upErr } = await supabase.storage.from("partner-assets").upload(path, file, { upsert: true, cacheControl: "3600" });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("partner-assets").getPublicUrl(path);
      const url = urlData.publicUrl + "?t=" + Date.now();
      setProfile(p => ({ ...p, avatar_url: url }));
      await supabase.from("profiles").update({ avatar_url: url }).eq("user_id", userId);
      onAvatarChange?.(url);
      toast({ title: "✅ Foto profilo aggiornata" });
    } catch (err: any) {
      toast({ title: "Errore upload", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setProfile(p => ({ ...p, avatar_url: "" }));
    await supabase.from("profiles").update({ avatar_url: null }).eq("user_id", userId);
    onAvatarChange?.(null);
    toast({ title: "Foto rimossa" });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        user_id: userId,
        full_name: profile.full_name || null,
        phone: profile.phone || null,
        city: profile.city || null,
        bio: profile.bio || null,
        website: profile.website || null,
        company_name: profile.company_name || null,
        email: profile.email || null,
      };
      const { data: updated, error: updateErr } = await supabase
        .from("profiles").update(payload).eq("user_id", userId).select("id").maybeSingle();
      if (updateErr) throw updateErr;
      if (!updated) {
        const { error: insertErr } = await supabase.from("profiles").insert(payload);
        if (insertErr) throw insertErr;
      }
      if (profile.full_name) {
        await supabase.auth.updateUser({ data: { full_name: profile.full_name } });
      }
      toast({ title: "✅ Profilo salvato" });
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof ProfileData, v: string) => setProfile(p => ({ ...p, [k]: v }));

  const completionPercent = Math.round(
    ([profile.full_name, profile.phone, profile.avatar_url, profile.city, profile.bio, profile.company_name]
      .filter(Boolean).length / 6) * 100
  );

  return (
    <section className="max-w-5xl mx-auto">
      <div className="p-5 sm:p-6 rounded-2xl space-y-5"
        style={{
          background: "linear-gradient(160deg, rgba(167,139,250,0.06), rgba(38,30,80,0.4))",
          border: "1px solid rgba(167,139,250,0.18)",
          boxShadow: "0 24px 60px rgba(124,58,237,0.18), inset 0 1px 0 rgba(167,139,250,0.18)",
        }}>

        {/* Header con badge owner */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #C8963E, #E2B567)" }}>
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Account Owner</p>
            <p className="text-[10px] text-purple-200/70">Gestisci il tuo profilo Super Admin</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold"
            style={{ background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}>
            <ShieldCheck className="w-3 h-3" /> VERIFICATO
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#a78bfa" }}>Completamento profilo</p>
            <span className="text-[10px] font-bold" style={{ color: completionPercent === 100 ? "#34d399" : "#fbbf24" }}>{completionPercent}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div className="h-full rounded-full" animate={{ width: `${completionPercent}%` }}
              style={{ background: completionPercent === 100 ? "#34d399" : "linear-gradient(90deg, #7c3aed, #a78bfa)" }} />
          </div>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0"
              style={{
                background: "rgba(167,139,250,0.1)",
                border: "2px solid rgba(167,139,250,0.35)",
                boxShadow: "0 12px 30px rgba(124,58,237,0.3)"
              }}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-10 h-10" style={{ color: "#a78bfa" }} />
                </div>
              )}
            </div>
            <input type="file" accept="image/*" ref={fileRef} onChange={handleUploadAvatar} className="hidden" />
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)", border: "2px solid #0a0a14", boxShadow: "0 4px 12px rgba(124,58,237,0.5)" }}>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Camera className="w-4 h-4 text-white" />}
            </button>
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-bold text-white">Foto Profilo</p>
            <p className="text-[10px]" style={{ color: "#9ca3af" }}>JPG, PNG • max 4MB. Visibile in alto a sinistra.</p>
            {profile.avatar_url && (
              <button onClick={handleRemoveAvatar} className="text-[10px] flex items-center gap-1" style={{ color: "#f87171" }}>
                <X className="w-3 h-3" /> Rimuovi foto
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field icon={User} label="Nome Completo" value={profile.full_name} onChange={v => set("full_name", v)} placeholder="Kevin Bernardini" />
          <Field icon={Building} label="Azienda" value={profile.company_name} onChange={v => set("company_name", v)} placeholder="Empire AI Group" />
          <Field icon={Phone} label="Telefono" value={profile.phone} onChange={v => set("phone", v)} placeholder="+39 333 1234567" type="tel" />
          <Field icon={Mail} label="Email Contatto" value={profile.email} onChange={v => set("email", v)} placeholder="info@empireaigroup.com" type="email" />
          <Field icon={MapPin} label="Città" value={profile.city} onChange={v => set("city", v)} placeholder="Milano" />
          <Field icon={Globe} label="Sito Web" value={profile.website} onChange={v => set("website", v)} placeholder="empireaigroup.com" />
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#a78bfa" }}>Bio breve</label>
          <textarea
            value={profile.bio}
            onChange={e => set("bio", e.target.value)}
            placeholder="CEO di Empire AI Group · Architetto di ecosistemi digitali"
            rows={2}
            className="w-full px-3 py-2 rounded-lg text-xs text-white outline-none resize-none"
            style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)" }}
          />
        </div>

        {/* Save */}
        <div className="flex justify-end pt-2">
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)", boxShadow: "0 8px 24px rgba(124,58,237,0.4)" }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Salvataggio..." : "Salva Profilo"}
          </button>
        </div>
      </div>
    </section>
  );
}

function Field({ icon: Icon, label, value, onChange, placeholder, type = "text" }: {
  icon: any; label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: "#a78bfa" }}>
        <Icon className="w-3 h-3" /> {label}
      </label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg text-xs text-white outline-none transition-colors"
        style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)" }}
      />
    </div>
  );
}
