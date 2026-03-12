import {
  BookOpen, ShoppingBag, ChefHat, LayoutGrid, Calendar, Star,
  Users, Wallet, Package, ClipboardCheck, Car, Route, MapPin,
  BarChart3, Settings, Target, MessageSquare, Store, CreditCard,
  Home, Briefcase, Receipt, PenTool, Sparkles, UserCog
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
  Home, Briefcase, Receipt, PenTool, Sparkles, UserCog,
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
    { title: "CRM Clienti", icon: "Users", url: "/app/crm" },
    { title: "Inventario", icon: "Package", url: "/app/inventory" },
    { title: "HACCP", icon: "ClipboardCheck", url: "/app/haccp" },
  ],
  ncc: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Flotta", icon: "Car", url: "/app/fleet" },
    { title: "Tratte", icon: "Route", url: "/app/routes" },
    { title: "Prenotazioni", icon: "Calendar", url: "/app/bookings" },
    { title: "Destinazioni", icon: "MapPin", url: "/app/destinations" },
    { title: "Autisti", icon: "Users", url: "/app/drivers" },
    { title: "Recensioni", icon: "Star", url: "/app/reviews" },
  ],
  beauty: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Appuntamenti", icon: "Calendar", url: "/app/appointments" },
    { title: "Servizi", icon: "Sparkles", url: "/app/services" },
    { title: "Clienti", icon: "Users", url: "/app/clients" },
    { title: "Operatori", icon: "UserCog", url: "/app/operators" },
    { title: "Prodotti", icon: "Package", url: "/app/products" },
  ],
  healthcare: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Agenda", icon: "Calendar", url: "/app/appointments" },
    { title: "Pazienti", icon: "Users", url: "/app/patients" },
    { title: "Prestazioni", icon: "ClipboardCheck", url: "/app/treatments" },
    { title: "Fatturazione", icon: "Receipt", url: "/app/billing" },
  ],
  retail: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Catalogo", icon: "Store", url: "/app/catalog" },
    { title: "Ordini", icon: "ShoppingBag", url: "/app/orders" },
    { title: "Magazzino", icon: "Package", url: "/app/inventory" },
    { title: "Clienti", icon: "Users", url: "/app/clients" },
  ],
  fitness: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Corsi", icon: "Calendar", url: "/app/classes" },
    { title: "Membri", icon: "Users", url: "/app/members" },
    { title: "Trainer", icon: "UserCog", url: "/app/trainers" },
    { title: "Abbonamenti", icon: "CreditCard", url: "/app/subscriptions" },
  ],
  hospitality: [
    { title: "Dashboard", icon: "Home", url: "/app" },
    { title: "Camere", icon: "LayoutGrid", url: "/app/rooms" },
    { title: "Prenotazioni", icon: "Calendar", url: "/app/reservations" },
    { title: "Ospiti", icon: "Users", url: "/app/guests" },
    { title: "Housekeeping", icon: "Sparkles", url: "/app/housekeeping" },
  ],
};

const COMMON_NAV = [
  { title: "Staff", icon: "Briefcase", url: "/app/staff" },
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

  const industryItems = INDUSTRY_NAV[industry] || INDUSTRY_NAV.food;

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
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
        <SidebarGroup defaultOpen>
          <SidebarGroupLabel>
            {collapsed ? "" : "Moduli"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {industryItems.map((item) => {
                const Icon = ICON_MAP[item.icon] || Home;
                const active = location.pathname === item.url;
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
        <SidebarGroup defaultOpen>
          <SidebarGroupLabel>
            {collapsed ? "" : "Gestione"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {COMMON_NAV.map((item) => {
                const Icon = ICON_MAP[item.icon] || Settings;
                const active = location.pathname === item.url;
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
