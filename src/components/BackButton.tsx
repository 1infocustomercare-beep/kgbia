import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface BackButtonProps {
  /** Override default browser back behavior with a specific path */
  to?: string;
  /** Label text — defaults to "Indietro" */
  label?: string;
  /** Visual variant */
  variant?: "floating" | "inline" | "navbar";
  /** Color scheme */
  theme?: "dark" | "light" | "glass";
  className?: string;
}

export default function BackButton({
  to,
  label = "Indietro",
  variant = "floating",
  theme = "glass",
  className = "",
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      // Try going back, fallback to home
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }
  };

  const themeStyles = {
    dark: "bg-black/70 text-white/80 border-white/10 hover:bg-black/90 hover:text-white",
    light: "bg-white/80 text-gray-600 border-gray-200/50 hover:bg-white hover:text-gray-900 shadow-sm",
    glass: "bg-white/8 backdrop-blur-md text-white/60 border-white/10 hover:bg-white/15 hover:text-white",
  };

  if (variant === "floating") {
    return (
      <motion.button
        onClick={handleClick}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className={`fixed top-[env(safe-area-inset-top,12px)] left-3 z-[60] w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-300 ${themeStyles[theme]} ${className}`}
        style={{ marginTop: "calc(env(safe-area-inset-top, 0px) + 8px)" }}
        title={label}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
      </motion.button>
    );
  }

  if (variant === "navbar") {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${themeStyles[theme]} border ${className}`}
      >
        <ArrowLeft className="w-4 h-4" />
        {label}
      </button>
    );
  }

  // inline
  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80 ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
}
