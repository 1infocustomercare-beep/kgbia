import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useIndustry } from "@/hooks/useIndustry";
import {
  Home, ShoppingBag, BookOpen, Calendar, Car, Users, LayoutGrid,
  Wrench, Package, Settings, Umbrella, Camera, ClipboardCheck,
  Zap, Heart, Star, Scale, Leaf, MoreHorizontal, X, Route, CreditCard,
  Target, Briefcase, Sparkles, Receipt, BarChart3, PenTool, Lightbulb,
  Store, MapPin, UserCog, FileText, Shield, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const ICON_MAP: Record<string, any> = {
  Home, ShoppingBag, BookOpen, Calendar, Car, Users, LayoutGrid,
  Wrench, Package, Settings, Umbrella, Camera, ClipboardCheck,
  Zap, Heart, Star, Scale, Leaf, Route, CreditCard, Target,
  Briefcase, Sparkles, Receipt, BarChart3, PenTool, Lightbulb,
  Store, MapPin, UserCog, FileText, Shield, Clock, MoreHorizontal,
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

// All extra modules accessible from "More" menu, per industry
const MORE_MENU: Record<string, NavItem[]> = {
  ncc: [
    { label: "Tratte", icon: "Route", path: "/app/routes" },
    { label: "Prezzi", icon: "CreditCard", path: "/app/pricing" },
    { label: "Cross-Selling", icon: "Target", path: "/app/cross-selling" },
    { label: "Clienti CRM", icon: "UserCog", path: "/app/clients" },
    { label: "Recensioni", icon: "Star", path: "/app/reviews" },
    { label: "Sito Web", icon: "Store", path: "/app/webhub" },
    { label: "Team", icon: "Briefcase", path: "/app/team" },
    { label: "Scadenzario", icon: "Shield", path: "/app/ncc-expiry" },
    { label: "Automazioni", icon: "Sparkles", path: "/app/automations" },
    { label: "Payroll", icon: "Receipt", path: "/app/payroll" },
    { label: "Finanza", icon: "BarChart3", path: "/app/finance" },
    { label: "Leads", icon: "Target", path: "/app/leads" },
    { label: "Social", icon: "PenTool", path: "/app/social" },
    { label: "Abbonamento", icon: "CreditCard", path: "/app/subscription" },
    { label: "Richieste", icon: "Lightbulb", path: "/app/feature-requests" },
    { label: "Impostazioni", icon: "Settings", path: "/app/settings" },
  ],
};

const DEFAULT_MORE: NavItem[] = [
  { label: "Team", icon: "Briefcase", path: "/app/team" },
  { label: "Automazioni", icon: "Sparkles", path: "/app/automations" },
  { label: "Finanza", icon: "BarChart3", path: "/app/finance" },
  { label: "Payroll", icon: "Receipt", path: "/app/payroll" },
  { label: "Leads", icon: "Target", path: "/app/leads" },
  { label: "Abbonamento", icon: "CreditCard", path: "/app/subscription" },
  { label: "Impostazioni", icon: "Settings", path: "/app/settings" },
];

export function BottomNav() {
  const location = useLocation();
  const { industry } = useIndustry();
  const [moreOpen, setMoreOpen] = useState(false);

  const items = BOTTOM_NAV[industry] || DEFAULT_NAV;
  const moreItems = MORE_MENU[industry] || DEFAULT_MORE;

  // Check if any "more" item is active
  const moreActive = moreItems.some(m => location.pathname.startsWith(m.path));

  return (
    <>
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
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-w-0 transition-all duration-300 ${
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

        {/* More button */}
        <button
          onClick={() => setMoreOpen(true)}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-w-0 transition-all duration-300 ${
            moreActive ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <div className="relative">
            <MoreHorizontal className={`w-5 h-5 transition-transform duration-300 ${moreActive ? 'scale-110' : ''}`} />
            {moreActive && (
              <motion.span
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary"
              />
            )}
          </div>
          <span className={`text-[10px] uppercase tracking-wider font-medium transition-all duration-300 ${moreActive ? 'text-primary' : ''}`}>
            Altro
          </span>
        </button>
      </motion.nav>

      {/* More menu sheet */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="max-h-[70vh] rounded-t-2xl pb-safe">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-sm font-bold uppercase tracking-wider">Tutti i Moduli</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-4 gap-3 pb-6 overflow-y-auto max-h-[50vh]">
            {moreItems.map(item => {
              const Icon = ICON_MAP[item.icon] || Settings;
              const active = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path + item.label}
                  to={item.path}
                  onClick={() => setMoreOpen(false)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                    active 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-secondary/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    active ? "bg-primary/15" : "bg-secondary/60"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium text-center leading-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
