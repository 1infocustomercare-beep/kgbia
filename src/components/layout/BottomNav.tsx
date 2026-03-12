import { useLocation, Link } from "react-router-dom";
import { useIndustry } from "@/hooks/useIndustry";
import {
  Home, ShoppingBag, BookOpen, Calendar, Car, Users, LayoutGrid,
  Wrench, Package, Settings, Umbrella, Camera, ClipboardCheck,
  Zap, Heart, Star, Scale, Leaf
} from "lucide-react";
import { motion } from "framer-motion";

const ICON_MAP: Record<string, any> = {
  Home, ShoppingBag, BookOpen, Calendar, Car, Users, LayoutGrid,
  Wrench, Package, Settings, Umbrella, Camera, ClipboardCheck,
  Zap, Heart, Star, Scale, Leaf,
};

type NavItem = { label: string; icon: string; path: string };

const BOTTOM_NAV: Record<string, NavItem[]> = {
  ncc: [
    { label: "Home", icon: "Home", path: "/app" },
    { label: "Corse", icon: "Calendar", path: "/app/bookings" },
    { label: "Flotta", icon: "Car", path: "/app/fleet" },
    { label: "Autisti", icon: "Users", path: "/app/drivers" },
  ],
  beauty: [
    { label: "Home", icon: "Home", path: "/app" },
    { label: "Agenda", icon: "Calendar", path: "/app/appointments" },
    { label: "Servizi", icon: "Heart", path: "/app/services" },
    { label: "Clienti", icon: "Users", path: "/app/clients" },
  ],
  beach: [
    { label: "Spiaggia", icon: "Umbrella", path: "/app/beach-map" },
    { label: "Prenota", icon: "Calendar", path: "/app/beach-bookings" },
    { label: "Abbonamenti", icon: "Users", path: "/app/beach-passes" },
    { label: "Impostazioni", icon: "Settings", path: "/app/settings" },
  ],
  plumber: [
    { label: "Home", icon: "Home", path: "/app" },
    { label: "Interventi", icon: "Wrench", path: "/app/interventions" },
    { label: "Clienti", icon: "Users", path: "/app/clients" },
    { label: "Magazzino", icon: "Package", path: "/app/inventory" },
  ],
  electrician: [
    { label: "Home", icon: "Home", path: "/app" },
    { label: "Lavori", icon: "Zap", path: "/app/interventions" },
    { label: "Clienti", icon: "Users", path: "/app/clients" },
    { label: "Materiali", icon: "Package", path: "/app/inventory" },
  ],
  legal: [
    { label: "Home", icon: "Home", path: "/app" },
    { label: "Pratiche", icon: "Scale", path: "/app/interventions" },
    { label: "Agenda", icon: "Calendar", path: "/app/appointments" },
    { label: "Clienti", icon: "Users", path: "/app/clients" },
  ],
  garage: [
    { label: "Home", icon: "Home", path: "/app" },
    { label: "Lavori", icon: "Wrench", path: "/app/interventions" },
    { label: "Clienti", icon: "Users", path: "/app/clients" },
    { label: "Ricambi", icon: "Package", path: "/app/inventory" },
  ],
  gardening: [
    { label: "Home", icon: "Home", path: "/app" },
    { label: "Lavori", icon: "Leaf", path: "/app/interventions" },
    { label: "Clienti", icon: "Users", path: "/app/clients" },
    { label: "Materiali", icon: "Package", path: "/app/inventory" },
  ],
};

const DEFAULT_NAV: NavItem[] = [
  { label: "Home", icon: "Home", path: "/app" },
  { label: "Ordini", icon: "ClipboardCheck", path: "/app/interventions" },
  { label: "Clienti", icon: "Users", path: "/app/clients" },
  { label: "Impostazioni", icon: "Settings", path: "/app/settings" },
];

export function BottomNav() {
  const location = useLocation();
  const { industry } = useIndustry();

  const items = BOTTOM_NAV[industry] || DEFAULT_NAV;

  return (
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="flex md:hidden fixed bottom-0 inset-x-0 z-50 h-16 bg-background/80 backdrop-blur-2xl border-t border-border/40"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {items.map(item => {
        const Icon = ICON_MAP[item.icon] || Home;
        const active = item.path === "/app"
          ? location.pathname === "/app"
          : location.pathname.startsWith(item.path);

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-w-[60px] transition-all duration-300 ${
              active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : ''}`} />
              {active && (
                <motion.span
                  layoutId="bottomNavIndicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>
            <span className={`text-[10px] uppercase tracking-wider font-medium transition-all duration-300 ${active ? 'text-primary' : ''}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </motion.nav>
  );
}
