import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Lazy-loaded pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const RestaurantPage = lazy(() => import("./pages/RestaurantPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const SuperAdminDashboard = lazy(() => import("./pages/SuperAdminDashboard"));
const KitchenView = lazy(() => import("./pages/KitchenView"));
const StaffPanel = lazy(() => import("./pages/StaffPanel"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<LandingPage />} />
                <Route path="/r/:slug" element={<RestaurantPage />} />
                <Route path="/r/:slug/checkout" element={<CheckoutPage />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute requiredRole="restaurant_admin" blockRole="super_admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
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
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
