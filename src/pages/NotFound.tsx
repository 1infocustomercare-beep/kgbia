import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import empireLogoNew from "@/assets/empire-logo-new.png";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-6" style={{ boxShadow: "0 0 0 2px hsla(38,50%,55%,0.3), 0 0 20px hsla(265,70%,60%,0.15)" }}>
          <img src={empireLogoNew} alt="Empire AI" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-5xl font-display font-bold text-gold-gradient mb-3">404</h1>
        <p className="text-lg text-muted-foreground mb-8">Questa pagina non esiste</p>
        <motion.button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold gold-glow"
          whileTap={{ scale: 0.97 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alla Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;
