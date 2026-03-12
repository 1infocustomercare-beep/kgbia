import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "super_admin" | "staff" | "restaurant_admin" | "partner" | "team_leader";
  blockRole?: "super_admin" | "staff" | "restaurant_admin" | "partner" | "team_leader";
}

const ProtectedRoute = ({ children, requiredRole, blockRole }: ProtectedRouteProps) => {
  const { user, loading, roles } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  // Redirect partners/team_leaders to their dashboard if they land on a non-partner route
  if ((roles.includes("partner") || roles.includes("team_leader")) && requiredRole !== "partner") {
    return <Navigate to="/partner" replace />;
  }

  // Block specific roles from accessing this route
  if (blockRole && roles.includes(blockRole)) {
    if (blockRole === "super_admin" || roles.includes("super_admin")) {
      return <Navigate to="/superadmin" replace />;
    }
    return <Navigate to="/app" replace />;
  }

  // Check required role (super_admin bypasses all except blockRole, team_leader can access partner routes)
  if (requiredRole && !roles.includes(requiredRole) && !roles.includes("super_admin")) {
    // team_leader can access partner routes
    if (requiredRole === "partner" && roles.includes("team_leader")) {
      return <>{children}</>;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
