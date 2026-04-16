import { useAuth } from "@/context/AuthContext";
import PartnerProfileSection from "@/components/partner/PartnerProfileSection";
import PartnerIntegrationsSetup from "@/components/partner/PartnerIntegrationsSetup";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Shield, Calendar, Sparkles } from "lucide-react";

export default function PartnerProfilePage() {
  const { user, isTeamLeader } = useAuth();
  const [partnerAvatar, setPartnerAvatar] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from("profiles").select("avatar_url, full_name").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data?.avatar_url) setPartnerAvatar(data.avatar_url);
      if (data?.full_name) setProfileName(data.full_name);
    });
  }, [user?.id]);

  const userName = profileName || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Partner";
  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString("it-IT", { year: "numeric", month: "long", day: "numeric" }) : "—";

  return (
    <div className="space-y-6 px-4 pt-6 pb-8 max-w-2xl lg:max-w-5xl mx-auto">
      <motion.h2 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="text-lg font-bold text-foreground flex items-center gap-2">
        Il Mio Profilo
        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
          <Sparkles className="w-4 h-4" style={{ color: "#a78bfa", opacity: 0.5 }} />
        </motion.div>
      </motion.h2>

      {/* ═══ INFO CARD — Premium Animated ═══ */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="p-5 rounded-2xl space-y-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(18,18,42,0.97), rgba(14,14,35,0.98))", border: "1px solid rgba(167,139,250,0.12)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
        {/* Animated accent */}
        <motion.div className="absolute top-0 left-0 right-0 h-[2px]" animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent)" }} />
        <motion.div className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-[0.04] pointer-events-none"
          animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ border: "1.5px solid rgba(167,139,250,0.5)" }} />
        <div className="flex items-center gap-4 relative z-10">
          <motion.div className="w-[68px] h-[68px] rounded-2xl flex items-center justify-center overflow-hidden shrink-0"
            whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
            style={{ background: "linear-gradient(135deg, rgba(20,22,44,0.96), rgba(16,18,36,0.96))", border: "1.5px solid rgba(167,139,250,0.2)", boxShadow: "0 8px 24px rgba(0,0,0,0.26)" }}>
            {partnerAvatar ? (
              <img src={partnerAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8" style={{ color: "#a78bfa" }} />
            )}
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-foreground truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <motion.span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold"
                animate={{ boxShadow: ["0 0 0px rgba(167,139,250,0.1)", "0 0 12px rgba(167,139,250,0.2)", "0 0 0px rgba(167,139,250,0.1)"] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ background: "rgba(20,22,44,0.96)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)" }}>
                <Shield className="w-3 h-3" /> {isTeamLeader ? "Team Leader" : "Partner"}
              </motion.span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 relative z-10">
          {[
            { icon: Mail, label: "Email", value: user?.email || "—", color: "#818cf8" },
            { icon: Calendar, label: "Iscritto dal", value: createdAt, color: "#34d399" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ scale: 1.03, y: -2 }}
              className="p-3 rounded-xl relative overflow-hidden group cursor-default"
              style={{ background: "rgba(18,20,40,0.96)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 6px 16px rgba(0,0,0,0.2)" }}>
              <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `radial-gradient(circle at 50% 50%, ${item.color}08, transparent 70%)` }} />
              <item.icon className="w-3.5 h-3.5 mb-1" style={{ color: item.color }} />
              <p className="text-[10px] text-muted-foreground">{item.label}</p>
              <p className="text-xs font-medium text-foreground truncate">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══ INTEGRAZIONI & PAGAMENTI ═══ */}
      {user?.id && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <PartnerIntegrationsSetup userId={user.id} userEmail={user.email || ""} />
        </motion.div>
      )}

      {/* ═══ PROFILE EDIT ═══ */}
      {user?.id && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <PartnerProfileSection
            userId={user.id}
            userName={userName}
            userEmail={user.email || ""}
            onAvatarChange={(url) => setPartnerAvatar(url)}
            onNameChange={(name) => setProfileName(name)}
          />
        </motion.div>
      )}

    </div>
  );
}
