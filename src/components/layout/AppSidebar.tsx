import {
  BookOpen, ShoppingBag, ChefHat, LayoutGrid, Calendar, Star,
  Users, Wallet, Package, ClipboardCheck, Car, Route, MapPin,
  BarChart3, Settings, Target, MessageSquare, Store, CreditCard,
  Home, Briefcase, Receipt, PenTool, Sparkles, UserCog, Wrench,
  Zap, Leaf, Heart, Camera, Truck, Umbrella, Cog, FileText,
  Clock, GraduationCap, Baby, Scale
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useIndustry } from "@/hooks/useIndustry";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const ICON_MAP: Record<string, any> = {
  BookOpen, ShoppingBag, ChefHat, LayoutGrid, Calendar, Star,
  Users, Wallet, Package, ClipboardCheck, Car, Route, MapPin,
  BarChart3, Settings, Target, MessageSquare, Store, CreditCard,
  Home, Briefcase, Receipt, PenTool, Sparkles, UserCog, Wrench,
  Zap, Leaf, Heart, Camera, Truck, Umbrella, Cog, FileText,
  Clock, GraduationCap, Baby, Scale,
};

// Modules per industry
const INDUSTRY_NAV: Record<string, { title: string; icon: string; url: string }[]> = {
  food: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Menu", icon: "BookOpen", url: "/app/menu" },
    { title: "Ordini", icon: "ShoppingBag", url: "/app/orders" },
    { title: "Cucina", icon: "ChefHat", url: "/app/kitchen" },
    { title: "Tavoli", icon: "LayoutGrid", url: "/app/tables" },
    { title: "Prenotazioni", icon: "Calendar", url: "/app/reservations" },
    { title: "Recensioni", icon: "Star", url: "/app/reviews" },
    { title: "Clienti", icon: "Users", url: "/app/clients" },
    { title: "Inventario", icon: "Package", url: "/app/inventory" },
    { title: "HACCP", icon: "ClipboardCheck", url: "/app/haccp" },
  ],
  ncc: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Flotta", icon: "Car", url: "/app/fleet" },
    { title: "Tratte", icon: "Route", url: "/app/routes" },
    { title: "Prenotazioni", icon: "Calendar", url: "/app/bookings" },
    { title: "Autisti", icon: "Users", url: "/app/drivers" },
    { title: "Recensioni", icon: "Star", url: "/app/reviews" },
  ],
  beauty: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Appuntamenti", icon: "Calendar", url: "/app/appointments" },
    { title: "Clienti", icon: "Users", url: "/app/clients" },
  ],
  healthcare: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Agenda", icon: "Calendar", url: "/app/appointments" },
    { title: "Pazienti", icon: "Users", url: "/app/clients" },
  ],
  retail: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Ordini", icon: "ShoppingBag", url: "/app/orders" },
    { title: "Inventario", icon: "Package", url: "/app/inventory" },
    { title: "Clienti", icon: "Users", url: "/app/clients" },
  ],
  fitness: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Corsi", icon: "Calendar", url: "/app/appointments" },
    { title: "Membri", icon: "Users", url: "/app/clients" },
  ],
  hospitality: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Prenotazioni", icon: "Calendar", url: "/app/reservations" },
    { title: "Ospiti", icon: "Users", url: "/app/clients" },
  ],
  beach: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Spiaggia Live", icon: "Umbrella", url: "/app/beach-map" },
    { title: "Prenotazioni", icon: "Calendar", url: "/app/beach-bookings" },
    { title: "Ospiti", icon: "Users", url: "/app/clients" },
  ],
  plumber: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Interventi", icon: "Wrench", url: "/app/interventions" },
    { title: "Clienti", icon: "Users", url: "/app/clients" },
    { title: "Magazzino", icon: "Package", url: "/app/inventory" },
  ],
  electrician: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Lavori", icon: "Zap", url: "/app/interventions" },
    { title: "Clienti", icon: "Users", url: "/app/clients" },
    { title: "Materiali", icon: "Package", url: "/app/inventory" },
  ],
  agriturismo: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Prenotazioni", icon: "Calendar", url: "/app/reservations" },
    { title: "Ospiti", icon: "Users", url: "/app/clients" },
  ],
  cleaning: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Servizi", icon: "ClipboardCheck", url: "/app/interventions" },
    { title: "Clienti", icon: "Users", url: "/app/clients" },
  ],
  legal: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Pratiche", icon: "FileText", url: "/app/interventions" },
    { title: "Appuntamenti", icon: "Calendar", url: "/app/appointments" },
    { title: "Clienti", icon: "Users", url: "/app/clients" },
  ],
  accounting: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Scadenze", icon: "Clock", url: "/app/interventions" },
    { title: "Appuntamenti", icon: "Calendar", url: "/app/appointments" },
    { title: "Clienti", icon: "Users", url: "/app/clients" },
  ],
  garage: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Lavorazioni", icon: "Wrench", url: "/app/interventions" },
    { title: "Clienti", icon: "Users", url: "/app/clients" },
    { title: "Ricambi", icon: "Package", url: "/app/inventory" },
  ],
  photography: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Shooting", icon: "Camera", url: "/app/appointments" },
    { title: "Clienti", icon: "Users", url: "/app/clients" },
  ],
  construction: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Cantieri", icon: "Wrench", url: "/app/interventions" },
    { title: "Committenti", icon: "Users", url: "/app/clients" },
    { title: "Materiali", icon: "Package", url: "/app/inventory" },
  ],
  gardening: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Lavori", icon: "Leaf", url: "/app/interventions" },
    { title: "Clienti", icon: "Users", url: "/app/clients" },
    { title: "Materiali", icon: "Package", url: "/app/inventory" },
  ],
  veterinary: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Visite", icon: "Calendar", url: "/app/appointments" },
    { title: "Proprietari", icon: "Users", url: "/app/clients" },
  ],
  tattoo: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Appuntamenti", icon: "Calendar", url: "/app/appointments" },
    { title: "Clienti", icon: "Users", url: "/app/clients" },
  ],
  childcare: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Prenotazioni", icon: "Calendar", url: "/app/appointments" },
    { title: "Famiglie", icon: "Users", url: "/app/clients" },
  ],
  education: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Corsi", icon: "GraduationCap", url: "/app/appointments" },
    { title: "Studenti", icon: "Users", url: "/app/clients" },
  ],
  events: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Eventi", icon: "Calendar", url: "/app/interventions" },
    { title: "Clienti", icon: "Users", url: "/app/clients" },
  ],
  logistics: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Spedizioni", icon: "Truck", url: "/app/interventions" },
    { title: "Flotta", icon: "Car", url: "/app/fleet" },
    { title: "Clienti", icon: "Users", url: "/app/clients" },
  ],
  custom: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Ordini", icon: "ClipboardCheck", url: "/app/interventions" },
    { title: "Clienti", icon: "Users", url: "/app/clients" },
  ],
};

const COMMON_NAV = [
  { title: "Team", icon: "Briefcase", url: "/app/team" },
  { title: "Payroll", icon: "Receipt", url: "/app/payroll" },
  { title: "Finanza", icon: "BarChart3", url: "/app/finance" },
  { title: "Leads", icon: "Target", url: "/app/leads" },
  { title: "Social", icon: "PenTool", url: "/app/social" },
  { title: "Impostazioni", icon: "Settings", url: "/app/settings" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { industry, company } = useIndustry();

  const industryItems = INDUSTRY_NAV[industry] || INDUSTRY_NAV.custom;

  return (
    <Sidebar collapsible="icon" className="border-r border-border hidden md:flex">
      <SidebarContent>
        {/* Company name */}
        {!collapsed && (
          <div className="px-4 py-4 border-b border-border">
            <h2 className="font-heading font-bold text-sm text-foreground truncate">
              {company?.name || "Empire"}
            </h2>
            <p className="text-xs text-muted-foreground capitalize">{industry}</p>
          </div>
        )}

        {/* Industry-specific modules */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {collapsed ? "" : "Moduli"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {industryItems.map((item) => {
                const Icon = ICON_MAP[item.icon] || Home;
                const active = item.url === "/app" ? location.pathname === "/app" : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/app"}
                        className={`hover:bg-muted/50 ${active ? "bg-primary/10 text-primary" : ""}`}
                        activeClassName="bg-primary/10 text-primary font-medium"
                      >
                        <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Common modules */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {collapsed ? "" : "Gestione"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {COMMON_NAV.map((item) => {
                const Icon = ICON_MAP[item.icon] || Settings;
                const active = location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`hover:bg-muted/50 ${active ? "bg-primary/10 text-primary" : ""}`}
                        activeClassName="bg-primary/10 text-primary font-medium"
                      >
                        <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
