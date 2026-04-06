import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  User, Camera, Save, Phone, MapPin, Mail, Globe, Instagram,
  Building, FileText, Loader2, X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Props {
  userId: string;
  userName: string;
  userEmail: string;
}

interface ProfileData {
  full_name: string;
  avatar_url: string;
  phone: string;
  address: string;
  city: string;
  bio: string;
  instagram_handle: string;
  website: string;
  company_name: string;
  email: string;
}

const EMPTY: ProfileData = {
  full_name: "", avatar_url: "", phone: "", address: "", city: "",
  bio: "", instagram_handle: "", website: "", company_name: "", email: "",
};

export default function PartnerProfileSection({ userId, userName, userEmail }: Props) {
  const [profile, setProfile] = useState<ProfileData>({ ...EMPTY, full_name: userName, email: userEmail });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!userId || loaded) return;
    supabase
      .from("profiles")
      .select("full_name, avatar_url, phone, address, city, bio, instagram_handle, website, company_name, email")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfile({
            full_name: data.full_name || userName,
            avatar_url: data.avatar_url || "",
            phone: data.phone || "",
            address: data.address || "",
            city: data.city || "",
            bio: data.bio || "",
            instagram_handle: data.instagram_handle || "",
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
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;
      const { error: upErr } = await supabase.storage.from("partner-assets").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("partner-assets").getPublicUrl(path);
      const url = urlData.publicUrl + "?t=" + Date.now();
      setProfile(p => ({ ...p, avatar_url: url }));
      await supabase.from("profiles").update({ avatar_url: url }).eq("user_id", userId);
      toast({ title: "✅ Foto aggiornata!" });
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        user_id: userId,
        full_name: profile.full_name || null,
        phone: profile.phone || null,
        address: profile.address || null,
        city: profile.city || null,
        bio: profile.bio || null,
        instagram_handle: profile.instagram_handle || null,
        website: profile.website || null,
        company_name: profile.company_name || null,
        email: profile.email || null,
      };
      // Try update first
      const { data: updated, error: updateErr } = await supabase
        .from("profiles")
        .update(payload)
        .eq("user_id", userId)
        .select("id")
        .maybeSingle();
      if (updateErr) throw updateErr;
      // If no row was updated, insert
      if (!updated) {
        const { error: insertErr } = await supabase.from("profiles").insert(payload);
        if (insertErr) throw insertErr;
      }
      toast({ title: "✅ Profilo salvato!" });
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
    <section className="max-w-5xl mx-auto px-4 sm:px-8 py-2">
      <div className="p-5 rounded-2xl space-y-5"
        style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.12)" }}>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#a78bfa" }}>Completamento Profilo</p>
            <span className="text-[10px] font-bold" style={{ color: completionPercent === 100 ? "#34d399" : "#fbbf24" }}>{completionPercent}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div className="h-full rounded-full" animate={{ width: `${completionPercent}%` }}
              style={{ background: completionPercent === 100 ? "#34d399" : "linear-gradient(90deg, #7c3aed, #a78bfa)" }} />
          </div>
        </div>

        {/* Avatar upload */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0"
              style={{ background: "rgba(167,139,250,0.1)", border: "2px solid rgba(167,139,250,0.25)" }}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8" style={{ color: "#a78bfa" }} />
                </div>
              )}
            </div>
            <input type="file" accept="image/*" ref={fileRef} onChange={handleUploadAvatar} className="hidden" />
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center transition-all"
              style={{ background: "#7c3aed", border: "2px solid #0a0a14" }}>
              {uploading ? <Loader2 className="w-3 h-3 animate-spin text-white" /> : <Camera className="w-3 h-3 text-white" />}
            </button>
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-xs font-bold text-white">Foto Profilo</p>
            <p className="text-[10px]" style={{ color: "#9ca3af" }}>JPG, PNG, max 2MB. Visibile ai clienti.</p>
            {profile.avatar_url && (
              <button onClick={async () => { setProfile(p => ({ ...p, avatar_url: "" })); await supabase.from("profiles").update({ avatar_url: null }).eq("user_id", userId); }}
                className="text-[9px] flex items-center gap-1" style={{ color: "#f87171" }}>
                <X className="w-3 h-3" /> Rimuovi foto
              </button>
            )}
          </div>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field icon={User} label="Nome Completo" value={profile.full_name} onChange={v => set("full_name", v)} placeholder="Mario Rossi" />
          <Field icon={Building} label="Agenzia / Azienda" value={profile.company_name} onChange={v => set("company_name", v)} placeholder="Empire Sales Agency" />
          <Field icon={Phone} label="Telefono" value={profile.phone} onChange={v => set("phone", v)} placeholder="+39 333 1234567" type="tel" />
          <Field icon={Mail} label="Email Contatto" value={profile.email} onChange={v => set("email", v)} placeholder="info@tuaagenzia.com" type="email" />
          <Field icon={MapPin} label="Indirizzo" value={profile.address} onChange={v => set("address", v)} placeholder="Via Roma 1" />
          <Field icon={MapPin} label="Città" value={profile.city} onChange={v => set("city", v)} placeholder="Milano" />
          <Field icon={Instagram} label="Instagram" value={profile.instagram_handle} onChange={v => set("instagram_handle", v)} placeholder="@tuoprofilo" />
          <Field icon={Globe} label="Sito Web" value={profile.website} onChange={v => set("website", v)} placeholder="www.tuosito.it" />
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10px] font-medium" style={{ color: "#9ca3af" }}>
            <FileText className="w-3 h-3" /> Bio Professionale
          </label>
          <textarea
            value={profile.bio}
            onChange={e => set("bio", e.target.value)}
            placeholder="Scrivi una breve descrizione professionale..."
            rows={3}
            maxLength={500}
            className="w-full px-3 py-2.5 rounded-xl text-xs bg-white !text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 resize-none"
          />
          <p className="text-[8px] text-right" style={{ color: "#4b5563" }}>{profile.bio.length}/500</p>
        </div>

        {/* Save button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold disabled:opacity-50 transition-all"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)", color: "#ffffff" }}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Salvataggio..." : "Salva Profilo"}
        </motion.button>
      </div>
    </section>
  );
}

/* ── Reusable field ── */
function Field({ icon: Icon, label, value, onChange, placeholder, type = "text" }: {
  icon: any; label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1.5 text-[10px] font-medium" style={{ color: "#9ca3af" }}>
        <Icon className="w-3 h-3" /> {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl text-xs bg-white !text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
      />
    </div>
  );
}
