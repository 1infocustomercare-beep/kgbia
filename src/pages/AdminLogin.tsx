import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import restaurantLogo from "@/assets/restaurant-logo.png";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (email === "kevin97bernardini@gmail.com" && password === "superadmin") {
        navigate("/superadmin");
      } else if (email === "mary@empire.it" && password === "staff123") {
        navigate("/staff");
      } else if (email === "admin@impero.it" && password === "admin123") {
        navigate("/admin/dashboard");
      } else {
        setError("Credenziali non valide");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        className="w-full max-w-sm space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4">
            <img src={restaurantLogo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gold-gradient">Area Riservata</h1>
          <p className="text-sm text-muted-foreground mt-1">Accedi al pannello di gestione</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground/70 uppercase tracking-wider block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ristorante.it"
              className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground/70 uppercase tracking-wider block mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p className="text-sm text-accent text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base gold-glow disabled:opacity-50"
            whileTap={{ scale: 0.97 }}
          >
            {loading ? "Accesso in corso..." : "Accedi"}
          </motion.button>
        </form>

        <div className="space-y-1 text-xs text-muted-foreground/50 text-center">
          <p>🔑 Super Admin: kevin97bernardini@gmail.com / superadmin</p>
          <p>👩‍💼 Staff: mary@empire.it / staff123</p>
          <p>🍕 Ristoratore: admin@impero.it / admin123</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
