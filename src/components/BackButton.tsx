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
    dark: "bg-black/80 text-white border-white/10 hover:bg-black/90",
    light: "bg-white/90 text-gray-900 border-gray-200 hover:bg-white shadow-lg",
    glass: "bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20",
  };

  if (variant === "floating") {
    return (
      <motion.button
        onClick={handleClick}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className={`fixed top-[72px] left-3 z-[60] flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-medium transition-all duration-300 shadow-lg ${themeStyles[theme]} ${className}`}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{label}</span>
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
