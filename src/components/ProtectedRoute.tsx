import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "super_admin" | "staff" | "restaurant_admin" | "partner" | "team_leader";
  blockRole?: "super_admin" | "staff" | "restaurant_admin" | "partner" | "team_leader";
}

const ProtectedRoute = ({ children, requiredRole, blockRole }: ProtectedRouteProps) => {
  const { user, loading, roles, rolesReady } = useAuth();

  if (loading || (user && !rolesReady)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Block specific roles from accessing this route
  // super_admin is always blocked when explicitly set as blockRole
  if (blockRole && roles.includes(blockRole)) {
    const canBypassBlockedRole =
      blockRole !== "super_admin" && !!requiredRole && roles.includes(requiredRole);

    if (canBypassBlockedRole) {
      // User has both blocked role AND required role — allow access
    } else if (blockRole === "super_admin" || roles.includes("super_admin")) {
      return <Navigate to="/superadmin" replace />;
    } else {
      const partnerOnly = (roles.includes("partner") || roles.includes("team_leader")) && !roles.includes("restaurant_admin");
      return <Navigate to={partnerOnly ? "/partner" : "/app"} replace />;
    }
  }

  // Redirect partners/team_leaders ONLY when trying to access protected non-partner areas
  if (
    (roles.includes("partner") || roles.includes("team_leader")) &&
    !!requiredRole &&
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
    // partner-only users trying to access restaurant_admin routes → redirect to app
    if (roles.includes("partner") || roles.includes("team_leader")) {
      return <Navigate to="/partner" replace />;
    }
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;