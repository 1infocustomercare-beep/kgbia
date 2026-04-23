1: # Memory: index.md
2: Updated: just now
3: 
4: # Project Memory
5: 
6: ## Core
7: - **No Deletions**: Additive/corrective development only. Never delete files or components.
8: - **Mobile First**: `useIsMobile` always true. Base 375px. 44x44px touch targets.
9: - **Tech Stack**: React Query + Supabase. No mock data. Strict RLS.
10: - **Routing**: `/r/` (food), `/b/` (others). Legacy auth redirects to `/auth`. New users to `/onboarding`.
11: - **Data Model**: `restaurants` for food, `companies` for 25+ other industries.
12: - **Theming**: "Luxury Dark Empire" (#11141a). High-contrast. Opaque admin backgrounds to block animations.
13: - **Forms**: Auth forms MUST use solid white backgrounds with black text for legibility.
14: - **UI Offsets**: Interactive FABs require bottom offset >= 6rem, z-index 9998. Hide trigger when open.
15: - **Voice Agent**: Arianna's performance is non-negotiable; do not disable features for scroll optimization.
16: - **Lovable Limit**: Do not modify Lovable platform settings natively; use source code for assets.
17: - **Demo Factory**: Auto-trigger nei leads (top 3 con sito/telefono), persistenza completa su `leads.demo_*`, admin URL sempre `/demo-admin/:slug?variant=X&sub=Y`.
18: - **Demo Site 1:1 Mockup-Only**: Ogni sito demo nasce SOLO da un mockup approvato. `generate-demo-from-lead` è l'unica edge function; rifiuta `422 preview_required` senza preview. No template standard/basic.
19: - **Single Super Admin**: Solo `kevin97bernardini@gmail.com` (uid `1da0ee45-094a-4728-996e-6143d55a7f9d`) è super_admin. Trigger DB blocca altri. Bypass crediti illimitato solo a lui.
20: - **Mockup Fidelity**: lead-mockup-suite usa image-to-image con 42 reference da `public/mockup-references/`, auto-upgrade a Pro su reference, fallback React garantito.
21: 
22: ## Memories
23: - [Mockup Catalog Fidelity](mem://features/mockup-catalog-fidelity) — AI image-to-image con 42 reference catalog, Pro forzato, React fallback per garantire sempre 4 mockup
24: - [Demo Factory Architecture](mem://features/demo-factory-architecture) — Auto-trigger nei leads, persistenza preview/admin/whatsapp sul lead, admin URL personalizzato per template iPhone via ?variant=
25: - [GDPR Compliance](mem://constraints/gdpr-compliance) — Strict EU data localization and granular cookie consent
26: - [Fiscal Vault 2026](mem://features/fiscal-vault-2026) — Italian tax compliance, B2B invoicing, and auto-send disclaimers
27: - [Technical Requirements](mem://constraints/technical-requirements) — React Query, Supabase, mobile-first viewports, loading skeletons
28: - [Sviluppo Non Distruttivo](mem://constraints/sviluppo-non-distruttivo) — Never delete existing code; additive and corrective only
29: - [Multi-Tenant Data Model](mem://architecture/multi-tenant-data-model-final) — Sector data isolation, super admin access via unique slugs
30: - [Data Encryption](mem://security/data-encryption-standards) — Encrypt health and fiscal data at rest with pgcrypto
31: - [Premium Visual Identity](mem://style/premium-alien-visual-identity) — B2B showcase uses professional gradient robot icons, not cartoons
32: - [Role-Based Access](mem://auth/role-based-access-control) — Test accounts with real operational data and universal password
33: - [Command Agent](mem://features/empire-command-agent) — Cross-sector automation via WhatsApp/In-app with Action Whitelisting
34: - [Tenant Privacy Hardening](mem://architecture/tenant-privacy-hardening) — Absolute isolation in Edge Function prompts and JWT checks
35: - [Pricing and Commissions](mem://payments/pricing-and-commissions) — Subscription packages, rates, and partner commission details
36: - [Tenant Lifecycle](mem://features/tenant-lifecycle-management) — 5-state kill-switch system blocking access on payment failure
37: - [Voice Agent Mutex](mem://architecture/voice-agent-mutex-system) — Exclusive audio channel ownership to prevent overlapping speech
38: - [Intro Suppression](mem://architecture/route-based-intro-suppression) — Bypassing cinematic intros on iframes, demo, and auth/admin routes
39: - [NCC Industry Verticals](mem://features/industry-verticals-ncc) — Gold Luxury aesthetic and fleet management tools for NCC
40: - [Business Splash Logic](mem://features/business-site-splash-logic) — Personalized cinematic intros for demos, bypassed in iframes
41: - [Voice Agent Priority](mem://constraints/voice-agent-performance-priority) — Arianna mobile features must not degrade for scroll performance
42: - [Home Page Resilience](mem://architecture/home-page-visibility-resilience) — Fallbacks for Framer Motion visibility issues
43: - [Lovable Limitations](mem://constraints/lovable-platform-limitations) — Manage platform settings manually, assets via code
44: - [Adaptive Design System](mem://style/industry-adaptive-design-architecture) — 8 visual archetypes and typography rules for different sectors
45: - [Neural Network Showcase](mem://style/ai-agents-neural-network-showcase-v6-contrast-fix) — High contrast UI for AI workflows, dark glassmorphism
46: - [Auth Resilience](mem://auth/auth-resilience-and-reconciliation) — Retry mechanics for partner role assignment during signup
47: - [Unified Demo Ecosystem](mem://features/demo-ecosystem-unified) — Password-less sector demos, universal configuration with reverse lookup
48: - [Redirect Resilience](mem://architecture/dashboard-redirect-resilience) — Holding routes to prevent infinite loops during onboarding
49: - [Session Refresh Logic](mem://architecture/onboarding-session-refresh-logic) — Explicit session refresh needed after company creation
50: - [Premium Visual Standards](mem://style/standard-visivi-premium) — Dark theme rules, 3D transforms, and contrast accessibility
51: - [Unified Onboarding](mem://features/onboarding-unificato) — Metadata-driven business setup, auto-routing based on sector
52: - [Sector Routing Constraints](mem://architecture/routing-settoriale-e-ruoli) — Specific paths based on entity type and business records
53: - [Food Luxury Theme](mem://style/tema-food-luxury-cote-miami) — Warm black and copper/gold accents for Food sector
54: - [Auth Form Readability](mem://style/auth-form-readability-standards) — White backgrounds and black text for authentication inputs
55: - [Stripe Configuration](mem://constraints/stripe-backend-configuration) — STRIPE_SECRET_KEY requirement in Supabase for payments
56: - [Admin Opaque Style](mem://admin/dashboard-premium-opaque-style-v4) — Opaque backgrounds in admin dashboards to prevent visual noise
57: - [Partner Recruitment](mem://marketing/partner-recruitment-isolation) — Dedicated `/join` page for recruitment, hidden from main site
58: - [Food Structural Init](mem://architecture/food-structural-initialization) — Default configurations for new Food accounts, PIN 1234
59: - [Prospect Scanner AI](mem://features/ai-prospect-scanner) — Gemini 2.5 Flash personalized sales messages, strict anti-spam rules
60: - [Agency Contact Info](mem://brand/agency-contact-info) — Official brand name and default contact details
61: - [Mobile-First Standard](mem://architecture/mobile-first-standard-performance) — Strictly mobile-only layouts, grid-cols-4, and micro-text
62: - [Mockup Visual Suite](mem://features/mockup-visual-suite) — Resilient project overlay structure and 3D mockups
63: - [Arianna Sales Agent](mem://features/arianna-unified-sales-agent) — "Never Say No" philosophy, 1800ms settle timer for dictation
64: - [Social Publishing AI](mem://features/social-publishing-ai-suite) — Local fallbacks and dynamic character counters for social media
65: - [Outreach Conversion](mem://marketing/outreach-conversion-hooks) — Primary 90-day free trial and starting price hooks
66: - [Interactive Overlays](mem://style/interactive-overlay-standards) — Strict z-index and spacing constraints for floating actions
67: - [Lead Engine Scout](mem://features/lead-engine-scout-system) — Overpass API vs Google Places, 0-100 scoring
68: - [Restricted AI Tools](mem://auth/restricted-ai-tools-access) — Advanced AI limited to Partners and Super Admins
69: - [Static Marketing Pages](mem://features/static-marketing-pages) — Public HTML assets served via iframe components
70: - [API Key Interfaces](mem://constraints/standard-interfaccia-api-keys) — Required UI structure for all external integration settings
71: - [Partner Dashboard Modes](mem://features/partner-dashboard) — Swipe gesture for live mode to hide sensitive metrics
72: - [Dark Mode Global](mem://style/dark-mode-global-support) — `next-themes` implementation with `#11141a` background
73: - [Storage Access Control](mem://security/storage-access-control-policies) — Strict RLS scoping by `auth.uid()` for all file uploads
74: - [Pizzeria Strapizzami Template](mem://features/pizzeria-strapizzami-template) — Cream/terracotta template fedele alle 4 preview iPhone, auto-match per pizzeria tradizionale vs luxury
75: - [Auto-Match Preview Sub-Sector](mem://features/auto-match-preview-subsector) — Universal sub-sector detection (food/beauty/ncc/fitness/hospitality) maps lead to best-matching iPhone preview template variant
76: - [Paperfish Sakura Template](mem://features/paperfish-sakura-template) — Dark sushi/giapponese template replicato 1:1 dai mockup Paperfish, auto-match per sushi standard vs luxury
77: - [Batey Pacifico Template](mem://features/batey-pacifico-template) — Azure caraibico (deep ocean + sand + coral) per pescherie/seafood/yacht/boat — variant: batey-pacifico, asinara-azure, miami-boats
78: - [Single Super Admin Owner](mem://auth/single-super-admin-owner) — Solo Kevin (kevin97bernardini@gmail.com) è super_admin, trigger DB blocca altri, bypass crediti hardcoded
79: - [Demo Site 1:1 Mockup-Only](mem://features/demo-site-1to1-mockup-only) — Constraint: ogni sito demo Full Power nasce solo da un mockup approvato (manual o auto-match), edge function rifiuta preview mancante, no template standard
80: - [Demo Studio Presentation Mode](mem://features/demo-studio-presentation-mode) — Modalità "Pronta da mostrare" fullscreen 60s (Hero→Preview→Wow→CTA) per vendita cliente, mostra solo mockup, nasconde tutto il resto
81: - [Partner Naming Convention](mem://style/partner-naming-convention) — Etichette ufficiali: Lead+Demo (auto-genera), Mockup su Misura (manuale), Vetrina (catalogo). Mai "Custom Preview" o "Anteprima Personalizzata"
82: - [Vendor Workflow Clarity](mem://features/vendor-workflow-clarity) — VendorWorkflowWizard sulla home + PartnerFlowStepper su 3 pagine + TutorialPopup contestuali per chiarire quale dei 3 entry point Partner usare
