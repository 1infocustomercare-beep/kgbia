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

  // Block specific roles from accessing this route
  // Exception: super_admin who also has the required role (e.g. restaurant_admin) can access
  if (blockRole && roles.includes(blockRole)) {
    if (requiredRole && roles.includes(requiredRole)) {
      // User has both blocked role AND required role — allow access
    } else if (blockRole === "super_admin" || roles.includes("super_admin")) {
      return <Navigate to="/superadmin" replace />;
    } else {
      return <Navigate to="/app" replace />;
    }
  }

  // Redirect partners/team_leaders to their dashboard ONLY if:
  // 1. The route requires a non-partner role (or no role at all with no specific requirement)
  // 2. The user ONLY has partner/team_leader roles (not also restaurant_admin)
  if (
    (roles.includes("partner") || roles.includes("team_leader")) &&
    requiredRole !== "partner" &&
    !roles.includes("restaurant_admin") &&
    !roles.includes("super_admin")
  ) {
    return <Navigate to="/partner" replace />;
  }

  // Check required role (super_admin bypasses all, team_leader can access partner routes)
  if (requiredRole && !roles.includes(requiredRole) && !roles.includes("super_admin")) {
    // team_leader can access partner routes
    if (requiredRole === "partner" && roles.includes("team_leader")) {
      return <>{children}</>;
    }
    // partner-only users trying to access restaurant_admin routes → redirect to partner
    if (roles.includes("partner") || roles.includes("team_leader")) {
      return <Navigate to="/partner" replace />;
    }
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;