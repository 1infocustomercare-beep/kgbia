import React, { useState, useEffect, Suspense, lazy } from 'react';
import SplashScreen from "@/components/SplashScreen";
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
const PartnerDashboard = lazy(() => import("./pages/PartnerDashboard"));
const PartnerRegister = lazy(() => import("./pages/PartnerRegister"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const GuidedSetup = lazy(() => import("./pages/GuidedSetup"));
const MarketingPage = lazy(() => import("./pages/MarketingPage"));
const NCCDemoPage = lazy(() => import("./pages/NCCDemoPage"));
const BusinessPage = lazy(() => import("./pages/BusinessPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// App layout + adaptive pages
const AppLayout = lazy(() => import("./components/layout/AppLayout"));
const AdaptiveDashboard = lazy(() => import("./pages/app/AdaptiveDashboard"));
const LeadsPage = lazy(() => import("./pages/LeadsPage"));
const StaffPage = lazy(() => import("./pages/app/StaffPage"));
const HACCPPage = lazy(() => import("./pages/app/HACCPPage"));
const SettingsPage = lazy(() => import("./pages/app/SettingsPage"));
const NCCFleetPage = lazy(() => import("./pages/app/NCCFleetPage"));
const NCCRoutesPage = lazy(() => import("./pages/app/NCCRoutesPage"));
const NCCBookingsPage = lazy(() => import("./pages/app/NCCBookingsPage"));
const NCCDriversPage = lazy(() => import("./pages/app/NCCDriversPage"));
const NCCPricingPage = lazy(() => import("./pages/app/NCCPricingPage"));
const NCCCrossSellingPage = lazy(() => import("./pages/app/NCCCrossSellingPage"));
const NCCSettingsPage = lazy(() => import("./pages/app/NCCSettingsPage"));
const MenuPage = lazy(() => import("./pages/app/MenuPage"));
const OrdersPage = lazy(() => import("./pages/app/OrdersPage"));
const InventoryPage = lazy(() => import("./pages/app/InventoryPage"));
const PayrollPage = lazy(() => import("./pages/app/PayrollPage"));
const FinancePage = lazy(() => import("./pages/app/FinancePage"));
const SocialPage = lazy(() => import("./pages/app/SocialPage"));
const ReservationsPage = lazy(() => import("./pages/app/ReservationsPage"));
const ReviewsPage = lazy(() => import("./pages/app/ReviewsPage"));
const GenericModulePage = lazy(() => import("./pages/app/GenericModulePage"));

// New pages
const KitchenPage = lazy(() => import("./pages/app/KitchenPage"));
const TablesPage = lazy(() => import("./pages/app/TablesPage"));
const AppointmentsPage = lazy(() => import("./pages/app/AppointmentsPage"));
const ClientsCRMPage = lazy(() => import("./pages/app/ClientsCRMPage"));
const InterventionsPage = lazy(() => import("./pages/app/InterventionsPage"));
const BeachMapPage = lazy(() => import("./pages/app/BeachMapPage"));
const NCCBeachBookingsPage = lazy(() => import("./pages/app/NCCBeachBookingsPage"));
const TeamPage = lazy(() => import("./pages/app/TeamPage"));
const AutomationsPage = lazy(() => import("./pages/app/AutomationsPage"));
const FeatureRequestsPage = lazy(() => import("./pages/app/FeatureRequestsPage"));
const SubscriptionPage = lazy(() => import("./pages/app/SubscriptionPage"));

// Demo pages
const IndustryDemoPage = lazy(() => import("./pages/demo/IndustryDemoPage"));
const DemoDirectoryPage = lazy(() => import("./pages/demo/DemoDirectoryPage"));
const AgentsPage = lazy(() => import("./pages/admin/AgentsPage"));
const MediaVaultPage = lazy(() => import("./pages/admin/MediaVaultPage"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Safety timeout: force dismiss after 2s no matter what
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<LandingPage />} />
                <Route path="/marketing" element={<MarketingPage />} />
                <Route path="/ncc-demo/:slug" element={<NCCDemoPage />} />
                <Route path="/b/:slug" element={<BusinessPage />} />
                <Route path="/demo" element={<DemoDirectoryPage />} />
                <Route path="/demo/:slug" element={<IndustryDemoPage />} />
                <Route path="/r/:slug" element={<RestaurantPage />} />
                <Route path="/r/:slug/checkout" element={<CheckoutPage />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/kitchen" element={<KitchenView />} />
                <Route path="/partner/register" element={<PartnerRegister />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Onboarding */}
                <Route path="/onboarding" element={
                  <ProtectedRoute><OnboardingPage /></ProtectedRoute>
                } />

                {/* Legacy protected routes (kept intact) */}
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
                <Route path="/superadmin/agents" element={
                  <ProtectedRoute requiredRole="super_admin">
                    <AgentsPage />
                  </ProtectedRoute>
                } />
                <Route path="/superadmin/media" element={
                  <ProtectedRoute requiredRole="super_admin">
                    <MediaVaultPage />
                  </ProtectedRoute>
                } />
                <Route path="/staff" element={
                  <ProtectedRoute requiredRole="staff">
                    <StaffPanel />
                  </ProtectedRoute>
                } />
                <Route path="/partner" element={
                  <ProtectedRoute requiredRole="partner">
                    <PartnerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute><AdminDashboard /></ProtectedRoute>
                } />
                <Route path="/setup" element={
                  <ProtectedRoute><GuidedSetup /></ProtectedRoute>
                } />

                {/* ═══ Adaptive App Routes (industry-aware) ═══ */}
                <Route path="/app" element={
                  <ProtectedRoute><AppLayout /></ProtectedRoute>
                }>
                  <Route index element={<AdaptiveDashboard />} />
                  {/* Food modules */}
                  <Route path="menu" element={<MenuPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="kitchen" element={<KitchenPage />} />
                  <Route path="tables" element={<TablesPage />} />
                  <Route path="reservations" element={<ReservationsPage />} />
                  <Route path="reviews" element={<ReviewsPage />} />
                  <Route path="inventory" element={<InventoryPage />} />
                  {/* NCC modules */}
                  <Route path="fleet" element={<NCCFleetPage />} />
                  <Route path="routes" element={<NCCRoutesPage />} />
                  <Route path="bookings" element={<NCCBookingsPage />} />
                  <Route path="drivers" element={<NCCDriversPage />} />
                  <Route path="pricing" element={<NCCPricingPage />} />
                  <Route path="cross-selling" element={<NCCCrossSellingPage />} />
                  {/* Multi-sector modules */}
                  <Route path="appointments" element={<AppointmentsPage />} />
                  <Route path="clients" element={<ClientsCRMPage />} />
                  <Route path="interventions" element={<InterventionsPage />} />
                  <Route path="beach-map" element={<BeachMapPage />} />
                  <Route path="beach-bookings" element={<NCCBeachBookingsPage />} />
                  <Route path="team" element={<TeamPage />} />
                  <Route path="automations" element={<AutomationsPage />} />
                  {/* Common modules */}
                  <Route path="leads" element={<LeadsPage />} />
                  <Route path="staff" element={<StaffPage />} />
                  <Route path="haccp" element={<HACCPPage />} />
                  <Route path="payroll" element={<PayrollPage />} />
                  <Route path="finance" element={<FinancePage />} />
                  <Route path="social" element={<SocialPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="feature-requests" element={<FeatureRequestsPage />} />
                  <Route path="subscription" element={<SubscriptionPage />} />
                  {/* Catch-all for industry modules in development */}
                  <Route path="*" element={<GenericModulePage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
); }

export default App;
