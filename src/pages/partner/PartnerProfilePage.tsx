import { useAuth } from "@/context/AuthContext";
import PartnerProfileSection from "@/components/partner/PartnerProfileSection";
import PartnerIntegrationsSetup from "@/components/partner/PartnerIntegrationsSetup";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Shield, Calendar } from "lucide-react";
import ROICalculator from "@/components/partner/ROICalculator";

export default function PartnerProfilePage() {
  const { user, isTeamLeader } = useAuth();
  const [partnerAvatar, setPartnerAvatar] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [showROI, setShowROI] = useState(false);

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
    <div className="space-y-6 px-4 pt-6 pb-8">
      <h2 className="text-lg font-bold text-foreground">Il Mio Profilo</h2>

      {/* ═══ INFO CARD ═══ */}
      <div className="p-5 rounded-2xl space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden shrink-0" style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}>
            {partnerAvatar ? (
              <img src={partnerAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8" style={{ color: "#a78bfa" }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-foreground truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}>
                <Shield className="w-3 h-3" /> {isTeamLeader ? "Team Leader" : "Partner"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <Mail className="w-3.5 h-3.5 mb-1 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground">Email</p>
            <p className="text-xs font-medium text-foreground truncate">{user?.email}</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <Calendar className="w-3.5 h-3.5 mb-1 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground">Iscritto dal</p>
            <p className="text-xs font-medium text-foreground">{createdAt}</p>
          </div>
        </div>
      </div>

      {/* ═══ INTEGRAZIONI & PAGAMENTI ═══ */}
      {user?.id && (
        <PartnerIntegrationsSetup userId={user.id} userEmail={user.email || ""} />
      )}

      {/* ═══ PROFILE EDIT ═══ */}
      {user?.id && (
        <PartnerProfileSection
          userId={user.id}
          userName={userName}
          userEmail={user.email || ""}
          onAvatarChange={(url) => setPartnerAvatar(url)}
          onNameChange={(name) => setProfileName(name)}
        />
      )}

      {/* ═══ ROI CALCULATOR ═══ */}
      <button onClick={() => setShowROI(true)}
        className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
        style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", color: "#a78bfa" }}>
        📊 Calcolatore ROI
      </button>

      <ROICalculator open={showROI} onClose={() => setShowROI(false)} />
    </div>
  );
}
