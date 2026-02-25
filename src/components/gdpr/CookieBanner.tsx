import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Cookie, ChevronDown, ChevronUp, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CONSENT_KEY = "gdpr_cookie_consent";
const SESSION_KEY = "gdpr_session_id";

function getSessionId(): string {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

const CookieBanner = ({ restaurantId }: { restaurantId?: string }) => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (!saved) {
      setVisible(true);
    }
  }, []);

  const saveConsent = async (c: CookieConsent) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
    setVisible(false);

    // Persist to DB
    try {
      await supabase.from("gdpr_consents" as any).insert({
        restaurant_id: restaurantId || null,
        session_id: getSessionId(),
        consent_necessary: c.necessary,
        consent_analytics: c.analytics,
        consent_marketing: c.marketing,
      } as any);
    } catch {}
  };

  const acceptAll = () => saveConsent({ necessary: true, analytics: true, marketing: true });
  const acceptNecessary = () => saveConsent({ necessary: true, analytics: false, marketing: false });
  const acceptSelected = () => saveConsent(consent);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[9999] p-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="max-w-lg mx-auto rounded-2xl glass-strong border border-border/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Cookie className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-display font-bold text-foreground">Cookie & Privacy</h3>
                <p className="text-[10px] text-muted-foreground">Conforme al Garante Privacy Italiano</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Utilizziamo cookie tecnici necessari e, con il tuo consenso, cookie analitici e di marketing. 
              Ai sensi del Reg. UE 2016/679 (GDPR) e del D.Lgs. 196/2003, puoi scegliere quali accettare.
            </p>
          </div>

          {/* Details toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-5 py-2 flex items-center justify-between text-xs text-primary hover:bg-primary/5 transition-colors"
          >
            <span className="font-medium">Personalizza preferenze</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                className="px-5 pb-3 space-y-2.5"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                {/* Necessary */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                  <div>
                    <p className="text-xs font-semibold text-foreground">🔒 Necessari</p>
                    <p className="text-[10px] text-muted-foreground">Sessione, sicurezza, funzionamento base</p>
                  </div>
                  <div className="w-10 h-5 rounded-full bg-primary/30 flex items-center justify-end px-0.5">
                    <div className="w-4 h-4 rounded-full bg-primary" />
                  </div>
                </div>

                {/* Analytics */}
                <button
                  onClick={() => setConsent(p => ({ ...p, analytics: !p.analytics }))}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                >
                  <div className="text-left">
                    <p className="text-xs font-semibold text-foreground">📊 Analitici</p>
                    <p className="text-[10px] text-muted-foreground">Statistiche anonime di utilizzo</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${consent.analytics ? "bg-primary/30 justify-end" : "bg-muted justify-start"}`}>
                    <div className={`w-4 h-4 rounded-full transition-colors ${consent.analytics ? "bg-primary" : "bg-muted-foreground/40"}`} />
                  </div>
                </button>

                {/* Marketing */}
                <button
                  onClick={() => setConsent(p => ({ ...p, marketing: !p.marketing }))}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                >
                  <div className="text-left">
                    <p className="text-xs font-semibold text-foreground">📣 Marketing</p>
                    <p className="text-[10px] text-muted-foreground">Promozioni personalizzate, remarketing</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${consent.marketing ? "bg-primary/30 justify-end" : "bg-muted justify-start"}`}>
                    <div className={`w-4 h-4 rounded-full transition-colors ${consent.marketing ? "bg-primary" : "bg-muted-foreground/40"}`} />
                  </div>
                </button>

                <button
                  onClick={acceptSelected}
                  className="w-full py-2.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium"
                >
                  Salva preferenze
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="px-5 pb-5 pt-2 flex gap-2">
            <button
              onClick={acceptNecessary}
              className="flex-1 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium"
            >
              Solo necessari
            </button>
            <button
              onClick={acceptAll}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold gold-glow"
            >
              Accetta tutti
            </button>
          </div>

          {/* Links */}
          <div className="px-5 pb-4 flex items-center justify-center gap-4">
            <a href="/privacy" target="_blank" className="text-[10px] text-muted-foreground hover:text-primary underline">
              Privacy Policy
            </a>
            <a href="/cookie-policy" target="_blank" className="text-[10px] text-muted-foreground hover:text-primary underline">
              Cookie Policy
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieBanner;
