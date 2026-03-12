import { useLocation, Link } from "react-router-dom";
import { useIndustry } from "@/hooks/useIndustry";
import {
  Home, ShoppingBag, BookOpen, Calendar, Car, Users, LayoutGrid,
  Wrench, Package, Settings, Umbrella, Camera, ClipboardCheck
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Home, ShoppingBag, BookOpen, Calendar, Car, Users, LayoutGrid,
  Wrench, Package, Settings, Umbrella, Camera, ClipboardCheck,
};

type NavItem = { label: string; icon: string; path: string };

const BOTTOM_NAV: Record<string, NavItem[]> = {
  food: [
    { label: "Home", icon: "Home", path: "/app" },
    { label: "Ordini", icon: "ShoppingBag", path: "/app/orders" },
    { label: "Menu", icon: "BookOpen", path: "/app/menu" },
    { label: "Prenotazioni", icon: "Calendar", path: "/app/reservations" },
  ],
  ncc: [
    { label: "Home", icon: "Home", path: "/app" },
    { label: "Corse", icon: "Calendar", path: "/app/bookings" },
    { label: "Flotta", icon: "Car", path: "/app/fleet" },
    { label: "Autisti", icon: "Users", path: "/app/drivers" },
  ],
  beauty: [
    { label: "Home", icon: "Home", path: "/app" },
    { label: "Agenda", icon: "Calendar", path: "/app/appointments" },
    { label: "Servizi", icon: "ClipboardCheck", path: "/app/services" },
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
    <nav className="flex md:hidden fixed bottom-0 inset-x-0 z-50 h-16 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      {items.map(item => {
        const Icon = ICON_MAP[item.icon] || Home;
        const active = item.path === "/app"
          ? location.pathname === "/app"
          : location.pathname.startsWith(item.path);

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-w-[60px] transition-colors ${
              active ? "text-primary" : "text-slate-400"
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {active && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
            </div>
            <span className="text-[10px] uppercase tracking-wide font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
