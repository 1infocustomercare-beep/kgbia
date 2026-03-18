import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import UnifiedIntro from "@/components/UnifiedIntro";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import EmpireDNABackground from "@/components/EmpireDNABackground";

// Detect mobile for tighter safety timeouts
const IS_MOBILE = typeof window !== "undefined" && (
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
  window.innerWidth < 768
);

type ExtendedNavigator = Navigator & {
  connection?: {
    effectiveType?: string;
    saveData?: boolean;
    addEventListener?: (type: "change", listener: () => void) => void;
    removeEventListener?: (type: "change", listener: () => void) => void;
  };
  deviceMemory?: number;
};

const isConstrainedNetwork = () => {
  if (typeof navigator === "undefined") return false;

  const nav = navigator as ExtendedNavigator;
  const effectiveType = nav.connection?.effectiveType?.toLowerCase();
  const lowBandwidth = effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g";
  const saveDataEnabled = !!nav.connection?.saveData;
  const lowMemoryDevice = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
  const offline = navigator.onLine === false;

  return lowBandwidth || saveDataEnabled || lowMemoryDevice || offline;
};

// Keep cinematic intro, but never trap users on splash
const INTRO_FAILSAFE_MS = IS_MOBILE ? 8000 : 9000;
const INTRO_HARD_WATCHDOG_MS = IS_MOBILE ? 10000 : 12000;
// Skip intro on client/demo routes and constrained environments to avoid mobile startup stalls
const SHOULD_SKIP_INTRO_DEFAULT = typeof window !== "undefined" && (
  /^\/(r|b|demo)\//.test(window.location.pathname) ||
  IS_MOBILE ||
  isConstrainedNetwork()
);

const loadIndex = () => import("./pages/Index");
const loadLandingPage = () => import("./pages/LandingPage");

const IMPORT_ATTEMPT_TIMEOUT_MS = IS_MOBILE ? 20000 : 12000;

const isImportTimeoutError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  return /import timed out|timeout while loading module/i.test(message);
};

const isRetryableImportError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  return /failed to fetch dynamically imported module|importing a module script failed|load failed|loading chunk [\w-]+ failed|chunkloaderror|dynamically imported module|import timed out|timeout while loading module/i.test(message);
};

const CHUNK_RECOVERY_FLAG = "empire_chunk_recovery_once";

const clearChunkRecoveryFlag = () => {
  try {
    window.sessionStorage.removeItem(CHUNK_RECOVERY_FLAG);
  } catch {
    // ignore storage availability issues
  }
};

const tryRecoverFromChunkError = (error: unknown): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  // Un timeout su rete lenta non è un chunk corrotto: evita hard reload/cancel SW aggressivo.
  if (isImportTimeoutError(error)) {
    return false;
  }

  if (!isRetryableImportError(error)) {
    return false;
  }

  try {
    if (window.sessionStorage.getItem(CHUNK_RECOVERY_FLAG) === "1") {
      return false;
    }
    window.sessionStorage.setItem(CHUNK_RECOVERY_FLAG, "1");
  } catch {
    return false;
  }

  const performReload = () => {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("chunk_recovery", Date.now().toString());
    window.location.replace(nextUrl.toString());
  };

  if ("serviceWorker" in navigator) {
    void navigator.serviceWorker.getRegistrations().then((registrations) => {
      void Promise.all(registrations.map((registration) => registration.unregister())).finally(() => {
        if ("caches" in window) {
          void caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))).finally(performReload);
          return;
        }
        performReload();
      });
    }).catch(performReload);
    return true;
  }

  performReload();
  return true;
};

const withImportTimeout = <T,>(promise: Promise<T>, timeoutMs: number) =>
  new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error(`Import timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise.then(
      (value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timeoutId);
        reject(error);
      },
    );
  });

const delay = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const importWithRetry = async <T,>(
  importer: () => Promise<T>,
  maxAttempts = IS_MOBILE ? 4 : 3,
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await withImportTimeout(importer(), IMPORT_ATTEMPT_TIMEOUT_MS);
    } catch (error) {
      lastError = error;

      const lastAttempt = attempt === maxAttempts;
      if (lastAttempt) {
        tryRecoverFromChunkError(error);
        throw error;
      }

      if (!isRetryableImportError(error)) {
        throw error;
      }

      await delay((IS_MOBILE ? 450 : 350) * attempt);
    }
  }

  throw lastError;
};

const preloadRoute = async (importer: () => Promise<unknown>) => {
  try {
    await importWithRetry(importer);
  } catch (error) {
    console.warn("Route preload failed (will retry on navigation):", error);
  }
};

// Lazy-loaded pages for code splitting
const Index = lazy(() => importWithRetry(loadIndex));
const LandingPage = lazy(() => importWithRetry(loadLandingPage));
const RestaurantPage = lazy(() => importWithRetry(() => import("./pages/RestaurantPage")));
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
const NCCExpiryPage = lazy(() => import("./pages/app/NCCExpiryPage"));
const MenuPage = lazy(() => import("./pages/app/MenuPage"));
const OrdersPage = lazy(() => import("./pages/app/OrdersPage"));
const InventoryPage = lazy(() => import("./pages/app/InventoryPage"));
const PayrollPage = lazy(() => import("./pages/app/PayrollPage"));
const FinancePage = lazy(() => import("./pages/app/FinancePage"));
const SocialPage = lazy(() => import("./pages/app/SocialPage"));
const ReservationsPage = lazy(() => import("./pages/app/ReservationsPage"));
const ReviewsPage = lazy(() => import("./pages/app/ReviewsPage"));
const GenericModulePage = lazy(() => import("./pages/app/GenericModulePage"));
const WebHubPage = lazy(() => import("./pages/app/WebHubPage"));

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
const WhatsAppPage = lazy(() => import("./pages/app/WhatsAppPage"));
const FeatureRequestsPage = lazy(() => import("./pages/app/FeatureRequestsPage"));
const SubscriptionPage = lazy(() => import("./pages/app/SubscriptionPage"));

// Demo pages
const IndustryDemoPage = lazy(() => import("./pages/demo/IndustryDemoPage"));
const DemoDirectoryPage = lazy(() => import("./pages/demo/DemoDirectoryPage"));
const AgentsPage = lazy(() => import("./pages/admin/AgentsPage"));
const MediaVaultPage = lazy(() => import("./pages/admin/MediaVaultPage"));
const BrandAssetsPage = lazy(() => import("./pages/superadmin/BrandAssetsPage"));

// Part 6 — AI Marketplace + Sector pages
const AIMarketplacePage = lazy(() => import("./pages/app/AIMarketplacePage"));
const KitchenDisplayPage = lazy(() => import("./pages/app/KitchenDisplayPage"));
const LiveFleetMapPage = lazy(() => import("./pages/app/LiveFleetMapPage"));
const LoyaltyPage = lazy(() => import("./pages/app/LoyaltyPage"));
const TelemedicinePage = lazy(() => import("./pages/app/TelemedicinePage"));
const ProjectTimelinePage = lazy(() => import("./pages/app/ProjectTimelinePage"));
const FieldDispatchPage = lazy(() => import("./pages/app/FieldDispatchPage"));

// Agent Marketplace
const AgentMarketplace = lazy(() => import("./pages/AgentMarketplace"));
const AgentDetailPage = lazy(() => import("./pages/AgentDetail"));
const AdminAgentsPage = lazy(() => import("./pages/admin/AdminAgents"));
const AdminWhatsApp = lazy(() => import("./pages/admin/AdminWhatsApp"));

const queryClient = new QueryClient();

const PAGE_LOADER_STALL_MS = 8000;

const PageLoader = () => {
  const [stalled, setStalled] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setStalled(true), PAGE_LOADER_STALL_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-xs text-muted-foreground tracking-wide">Caricamento…</p>
      {stalled && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-medium"
        >
          Riprova ora
        </button>
      )}
    </div>
  );
};

type RouteErrorBoundaryState = {
  hasError: boolean;
};

class RouteErrorBoundary extends React.Component<{ children: ReactNode }, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RouteErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (tryRecoverFromChunkError(error)) {
      return;
    }
    console.error("Route loading error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
          <div className="max-w-sm w-full rounded-2xl border border-border bg-card p-5 text-center space-y-3">
            <h2 className="text-base font-semibold">Errore di caricamento</h2>
            <p className="text-sm text-muted-foreground">Il modulo non si è caricato al primo tentativo. Riprova ora.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full rounded-xl bg-primary text-primary-foreground py-2 text-sm font-medium"
            >
              Riprova
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

type IntroErrorBoundaryState = {
  hasError: boolean;
};

class IntroErrorBoundary extends React.Component<{ children: ReactNode; onFail: () => void }, IntroErrorBoundaryState> {
  state: IntroErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): IntroErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Intro rendering error:", error, errorInfo);
    this.props.onFail();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

/** Hide Empire DNA background only on client public sites (their branded pages) */
const CLIENT_SITE_PATTERN = /^\/(b|r|ncc-demo|demo)\//;

function ConditionalDNABackground() {
  const { pathname } = useLocation();
  if (CLIENT_SITE_PATTERN.test(pathname)) return null;
  return <EmpireDNABackground />;
}

function App() {
  const [introCompleted, setIntroCompleted] = useState(() => SHOULD_SKIP_INTRO_DEFAULT);
  const handleIntroComplete = useCallback(() => setIntroCompleted(true), []);

  useEffect(() => {
    const startedAt = performance.now();
    let introReleased = false;

    const completeIntroSafely = (reason: string) => {
      if (introReleased) return;
      introReleased = true;

      setIntroCompleted((prev) => {
        if (!prev) {
          console.warn(`[Intro] Forced completion via ${reason}`);
        }
        return true;
      });
    };

    // Network constraints no longer skip intro — let the watchdog handle timeouts naturally

    const introFailsafe = window.setTimeout(() => {
      completeIntroSafely("timeout");
    }, INTRO_FAILSAFE_MS);

    let rafId = 0;
    const watchdogLoop = () => {
      if (performance.now() - startedAt >= INTRO_HARD_WATCHDOG_MS) {
        completeIntroSafely("watchdog");
        return;
      }
      rafId = window.requestAnimationFrame(watchdogLoop);
    };
    rafId = window.requestAnimationFrame(watchdogLoop);

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      if (performance.now() - startedAt >= INTRO_FAILSAFE_MS) {
        completeIntroSafely("visibility");
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearTimeout(introFailsafe);
      window.cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  // Preload critical route chunk while splash is running (especially useful on mobile/4G)
  useEffect(() => {
    const path = window.location.pathname;
    const constrained = isConstrainedNetwork();
    const shouldDeferPreloads = IS_MOBILE || constrained;
    let deferredPreload: number | null = null;

    // On mobile/slow connections, avoid eager preloads to reduce startup contention
    if (shouldDeferPreloads) {
      return;
    }

    if (path === "/") {
      void preloadRoute(loadIndex);
      deferredPreload = window.setTimeout(() => {
        void preloadRoute(loadLandingPage);
      }, 900);
    } else if (path === "/home") {
      void preloadRoute(loadLandingPage);
      deferredPreload = window.setTimeout(() => {
        void preloadRoute(loadIndex);
      }, 900);
    } else if (path.startsWith("/r/")) {
      void preloadRoute(() => import("./pages/RestaurantPage"));
    } else if (path.startsWith("/admin")) {
      void preloadRoute(() => import("./pages/AdminLogin"));
    }

    return () => {
      if (deferredPreload !== null) {
        window.clearTimeout(deferredPreload);
      }
    };
  }, []);

  useEffect(() => {
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (!tryRecoverFromChunkError(event.reason)) return;
      event.preventDefault();
    };

    const onPreloadError = (event: Event) => {
      const customEvent = event as CustomEvent<{ payload?: unknown }>;
      const payload = customEvent.detail?.payload ?? (event as { payload?: unknown }).payload;
      const fallbackReason = (event as { reason?: unknown }).reason;
      if (!tryRecoverFromChunkError(payload ?? fallbackReason ?? event)) return;
      if (typeof event.preventDefault === "function") event.preventDefault();
    };

    window.addEventListener("unhandledrejection", onUnhandledRejection);
    window.addEventListener("vite:preloadError", onPreloadError as EventListener);

    return () => {
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("vite:preloadError", onPreloadError as EventListener);
    };
  }, []);

  // If app booted successfully, allow future chunk recovery attempts
  useEffect(() => {
    if (!introCompleted) return;
    const timer = window.setTimeout(() => {
      clearChunkRecoveryFlag();
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [introCompleted]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen relative">
        <TooltipProvider>
          <AuthProvider>
            <CartProvider>
              <Toaster />
              <Sonner />

              {/* Cinematic Intro — shown on first load for / and /home */}
              {!introCompleted && (
                <IntroErrorBoundary onFail={handleIntroComplete}>
                  <UnifiedIntro onComplete={handleIntroComplete} />
                </IntroErrorBoundary>
              )}

              <BrowserRouter>
                <ConditionalDNABackground />
                <RouteErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/index" element={<Index />} />
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
                      <Route path="/admin/whatsapp" element={
                        <ProtectedRoute requiredRole="super_admin">
                          <AdminWhatsApp />
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
                        <Route path="whatsapp" element={<WhatsAppPage />} />
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
                </RouteErrorBoundary>
              </BrowserRouter>
            </CartProvider>
          </AuthProvider>
        </TooltipProvider>
      </div>

    </QueryClientProvider>
  );
}

export default App;
