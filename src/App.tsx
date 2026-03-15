import React, { useState, useEffect, Suspense, lazy } from 'react';
import SplashScreen from "@/components/SplashScreen";
import DNATransition from "@/components/DNATransition";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Detect mobile for tighter safety timeouts
const IS_MOBILE = typeof window !== "undefined" && (
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
  window.innerWidth < 768
);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setShowDNA(true);
  };

  return (
  <QueryClientProvider client={queryClient}>
    {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
    {showDNA && <DNATransition onComplete={() => setShowDNA(false)} />}
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
                <Route path="/admin/agents" element={
                  <ProtectedRoute requiredRole="super_admin">
                    <AdminAgentsPage />
                  </ProtectedRoute>
                } />
                <Route path="/superadmin/media" element={
                  <ProtectedRoute requiredRole="super_admin">
                    <MediaVaultPage />
                  </ProtectedRoute>
                } />
                <Route path="/superadmin/brand-assets" element={
                  <ProtectedRoute requiredRole="super_admin">
                    <BrandAssetsPage />
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
                  <ProtectedRoute requiredRole="restaurant_admin" blockRole="super_admin">
                    <AdminDashboard />
                  </ProtectedRoute>
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
                  <Route path="ncc-expiry" element={<NCCExpiryPage />} />
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
                  <Route path="webhub" element={<WebHubPage />} />
                  <Route path="feature-requests" element={<FeatureRequestsPage />} />
                  <Route path="subscription" element={<SubscriptionPage />} />
                  {/* Part 6 — AI Marketplace + Sector pages */}
                  <Route path="ai-marketplace" element={<AIMarketplacePage />} />
                  <Route path="agents" element={<AgentMarketplace />} />
                  <Route path="agents/:id" element={<AgentDetailPage />} />
                  <Route path="kitchen-display" element={<KitchenDisplayPage />} />
                  <Route path="live-map" element={<LiveFleetMapPage />} />
                  <Route path="loyalty" element={<LoyaltyPage />} />
                  <Route path="telemedicine" element={<TelemedicinePage />} />
                  <Route path="project-timeline" element={<ProjectTimelinePage />} />
                  <Route path="field-dispatch" element={<FieldDispatchPage />} />
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
