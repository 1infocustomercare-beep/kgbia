import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Camera, Save, Phone, MapPin, Mail, Globe, Instagram,
  Building, FileText, ChevronDown, ChevronUp, Loader2, X
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
            phone: (data as any).phone || "",
            address: (data as any).address || "",
            city: (data as any).city || "",
            bio: (data as any).bio || "",
            instagram_handle: (data as any).instagram_handle || "",
            website: (data as any).website || "",
            company_name: (data as any).company_name || "",
            email: (data as any).email || userEmail,
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
      await supabase.from("profiles").update({ avatar_url: url } as any).eq("user_id", userId);
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
      const { error } = await supabase.from("profiles").update({
        full_name: profile.full_name || null,
        phone: profile.phone || null,
        address: profile.address || null,
        city: profile.city || null,
        bio: profile.bio || null,
        instagram_handle: profile.instagram_handle || null,
        website: profile.website || null,
        company_name: profile.company_name || null,
        email: profile.email || null,
      } as any).eq("user_id", userId);
      if (error) throw error;
      toast({ title: "✅ Profilo salvato!" });
      setOpen(false);
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
      <motion.button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 rounded-2xl transition-all"
        style={{
          background: open ? "rgba(167,139,250,0.08)" : "rgba(255,255,255,0.02)",
          border: `1px solid ${open ? "rgba(167,139,250,0.25)" : "rgba(255,255,255,0.06)"}`,
        }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0"
            style={{ background: "rgba(167,139,250,0.15)", border: "2px solid rgba(167,139,250,0.3)" }}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ color: "#a78bfa" }}>
                {(profile.full_name || "P").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-white">{profile.full_name || userName}</p>
            <p className="text-[10px]" style={{ color: "#9ca3af" }}>
              {profile.company_name || "Profilo Partner"} · {completionPercent}% completo
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {completionPercent < 100 && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-semibold"
              style={{ background: "rgba(245,158,11,0.1)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.2)" }}>
              ⚡ Completa il profilo
            </div>
          )}
          {open ? <ChevronUp className="w-4 h-4" style={{ color: "#9ca3af" }} /> : <ChevronDown className="w-4 h-4" style={{ color: "#9ca3af" }} />}
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 mt-1 rounded-2xl space-y-5"
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
                    <button onClick={async () => { setProfile(p => ({ ...p, avatar_url: "" })); await supabase.from("profiles").update({ avatar_url: null } as any).eq("user_id", userId); }}
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
                  placeholder="Scrivi una breve descrizione professionale... (es. Consulente digitale specializzato in ristorazione e hospitality)"
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
          </motion.div>
        )}
      </AnimatePresence>
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
