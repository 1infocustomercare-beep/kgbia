import { Bell, Search, User, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useIndustry } from "@/hooks/useIndustry";
import { motion } from "framer-motion";

export function TopBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { company, config } = useIndustry();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-14 flex items-center gap-3 px-4 border-b border-border/50 bg-background/60 backdrop-blur-xl sticky top-0 z-30"
    >
      <SidebarTrigger className="flex-shrink-0" />

      {/* Company badge */}
      {company && (
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-secondary/40 border border-border/30">
          <span className="text-sm">{config.emoji}</span>
          <span className="text-xs font-medium text-foreground/80 truncate max-w-[120px]">{company.name}</span>
        </div>
      )}

      {/* Search */}
      <div className="relative flex-1 max-w-sm hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Cerca..." className="pl-9 h-9 bg-secondary/30 border-border/30 focus:border-primary/50 transition-colors" />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl hover:bg-secondary/50">
          <Bell className="w-4 h-4" />
          <motion.span
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 hover:bg-secondary/50">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 glass border-border/50">
            <div className="px-3 py-2">
              <p className="text-sm font-medium truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/app/settings")}>
              Impostazioni
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" /> Esci
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
