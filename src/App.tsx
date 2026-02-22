import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import RestaurantPage from "./pages/RestaurantPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import KitchenView from "./pages/KitchenView";
import StaffPanel from "./pages/StaffPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<LandingPage />} />
              <Route path="/r/:slug" element={<RestaurantPage />} />
              <Route path="/r/:slug/checkout" element={<CheckoutPage />} />
              <Route path="/admin" element={<AdminLogin />} />
              {/* Restaurant Admin — blocked for super_admin */}
              <Route path="/dashboard" element={
                <ProtectedRoute requiredRole="restaurant_admin" blockRole="super_admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              {/* Super Admin only — Kevin */}
              <Route path="/superadmin" element={
                <ProtectedRoute requiredRole="super_admin">
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/staff" element={
                <ProtectedRoute requiredRole="staff">
                  <StaffPanel />
                </ProtectedRoute>
              } />
              <Route path="/kitchen" element={<KitchenView />} />
              {/* Legacy redirect */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
