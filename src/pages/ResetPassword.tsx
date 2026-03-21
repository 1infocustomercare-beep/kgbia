import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { KeyRound, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      // No recovery token — redirect to login
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("La password deve avere almeno 6 caratteri"); return; }
    if (password !== confirm) { setError("Le password non corrispondono"); return; }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setDone(true);
      toast({ title: "Password aggiornata!", description: "Verrai reindirizzato al login." });
      setTimeout(() => navigate("/admin", { replace: true }), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div className="w-full max-w-sm space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-vibrant-gradient flex items-center justify-center mb-4 vibrant-glow">
            {done ? <Check className="w-8 h-8 text-primary-foreground" /> : <KeyRound className="w-8 h-8 text-primary-foreground" />}
          </div>
          <h1 className="text-2xl font-heading font-bold text-vibrant-gradient">
            {done ? "Password Aggiornata" : "Nuova Password"}
          </h1>
        </div>

        {!done && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground/70 uppercase tracking-wider block mb-2">Nuova password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                required minLength={6} placeholder="Almeno 6 caratteri" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground/70 uppercase tracking-wider block mb-2">Conferma password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                required minLength={6} placeholder="Ripeti password" />
            </div>
            {error && <p className="text-sm text-accent text-center">{error}</p>}
            <motion.button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-vibrant-gradient text-primary-foreground font-semibold vibrant-glow disabled:opacity-50 min-h-[48px]"
              whileTap={{ scale: 0.97 }}>
              {loading ? "Salvataggio..." : "Salva Nuova Password"}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}