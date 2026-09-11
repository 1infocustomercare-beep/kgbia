# EMPIRE V2 — Cosa copiare dal progetto vecchio

Elenco preciso dei percorsi da riportare nel progetto nuovo. Tutto il resto **non si copia**.

---

## 1. Siti demo da tenere (4)

| Demo | Rotta vecchia | File principali |
|---|---|---|
| Aurea Jet | `/demo/aurea-jet` | `src/pages/public/PrivateJetPublicSite.tsx`, `src/lib/jet-motion.ts`, `src/assets/aurea-jet/**` (incl. `aurea-journey.mp4.asset.json`, `cabin-scrub.mp4.asset.json`) |
| Aurelia Motori | `/demo/aurelia-motori` | `src/pages/public/AutoDealerPublicSite.tsx`, `src/components/public/aurelia/AureliaApp.tsx`, `src/components/public/aurelia/AureliaLivePhone.tsx` |
| NCC | `/demo/ncc` | `src/pages/public/NCCPublicSite.tsx`, `src/pages/NCCDemoPage.tsx` |
| Ristorazione / Food | `/demo/food` | `src/pages/public/FoodPublicSite.tsx` + template completi: `src/components/templates/strapizzami/**`, `src/components/templates/paperfish/**`, `src/components/templates/batey/**` |

Da **non** portare: `VariantSiteRenderer.tsx` (dipende dal sistema multi-tenant), e tutti gli altri
`src/pages/public/*PublicSite.tsx` (Bakery, Beach, Beauty, Fitness, Healthcare, Hotel, Luxury,
Retail, Trades, PortfolioShowcase) — quelli vengono rifatti dai nuovi riferimenti.

---

## 2. Home vetrina — sezioni riutilizzabili

Da `src/components/empire-home/prestige/`, riportare solo:

`PrestigeTheme.tsx` · `PrestigeHero.tsx` · `PrestigeProofBar.tsx` · `PrestigeServices.tsx` ·
`PrestigeIndustries.tsx` · `PrestigePortfolio.tsx` · `PrestigeAgents.tsx` · `PrestigeFAQ` e
`PrestigeHowItWorks` (dentro `PrestigeConversion.tsx`) · `PrestigeFinalCTA.tsx` ·
`PrestigeFooter.tsx` · `PrestigeProgressBar.tsx` · `PrestigeEffects.tsx`

Da `PrestigeConversion.tsx` **scartare** `PrestigePricing` (niente prezzi in vetrina) e
`PrestigeRoiCalculator` se cita cifre di pacchetto.

Da **non** portare (duplicati e versioni morte): `PrestigeHeroImmersive`, `PrestigeStoryPinned`,
`PrestigeStorytelling`, `PrestigeUnifiedNarrative`, `PrestigeCinematic3D`, `PrestigeParallaxCarousel`,
`PrestigePortfolioCarousel`, `PrestigeStyleGallery`, `PrestigeCapabilities`, `PrestigeProof`,
`PrestigeDemoHub`, `PrestigeSectorLive`, `PrestigeCTA`, `PrestigeProcess`, `PrestigeMarquee`,
`PrestigeAgentScene`, `PrestigeAgentStudio`, `PrestigeGlassSkin`, `EmpireMockupScreens`.

Supporto scroll: `src/lib/lenis-singleton.ts` e `src/components/empire-home/ScrollDirector.tsx`
(un solo gestore dello scroll, niente pin GSAP che rubano lo scroll).

---

## 3. Arianna

- `src/components/public/EmpireVoiceAgent.tsx` — base del pannello, da **riscrivere con
  caricamento differito** (è la causa dei rallentamenti attuali).
- `src/config/ariannaPrompt.ts` — istruzioni dell'agente: da ripulire togliendo prezzi,
  pacchetti e riferimenti alla piattaforma clienti.
- `src/lib/italian-female-voice.ts` — voce femminile italiana coerente col nome.
- `src/lib/arianna-session-memory.ts` — memoria della conversazione.
- `src/lib/voice-agent-mutex.ts` — un solo canale audio per volta (serve col video hero).

Da **non** portare: tutte le varianti Arianna legate a partner/lead/autopilot
(`src/components/leads/Arianna*`, `src/components/partner/*Voice*`, `src/components/superadmin/*Voice*`,
`src/components/restaurant/RestaurantVoiceAgent.tsx`, `src/components/public/DemoSalesAgent.tsx`).

---

## 4. Pagine legali e cookie

`src/pages/PrivacyPolicy.tsx` · `src/pages/CookiePolicy.tsx` · `src/pages/TerminiCondizioni.tsx` ·
`src/pages/NoteLegali.tsx` · `src/components/gdpr/CookieBanner.tsx` · `src/lib/cookie-consent.ts` ·
`src/config/legal.ts`

Ritocchi obbligatori nel nuovo progetto:
- Privacy: togliere le parti che parlano del cliente ristoratore e dei suoi utenti finali; resta
  Empire AI Group titolare per visitatori, lead e moduli di contatto.
- Termini: togliere ogni riferimento a pacchetti, checkout, abbonamento cliente.
- Confermare la nota forfettario (art. 1 commi 54-89, L. 190/2014) e l'assenza di "IVA 22%".

---

## 5. Mockup

- Set completi già buoni: `src/assets/mockups/portfolio-lowengeld/**` (49 cartelle, molte con
  le 6 schermate `1…6-payment.png`) — questi sono i migliori, si portano tutti.
- `src/assets/mockups/catalog/**` (197 MB): **non copiare in blocco.** Prima si guardano in
  galleria, si tengono solo gli stili approvati, il resto si rigenera.
- Singoli file sciolti in `src/assets/mockups/*.png` (accounting, agriturismo, beach, cleaning…):
  utili come punto di partenza, ma incompleti — vanno completati fino a 6-8 schermate o rifatti.
- Cornici da riportare: `src/components/mockups/IPhoneProMaxFrame.tsx`,
  `IPadProFrame.tsx`, `DesktopBrowserFrame.tsx`, `CaseScreenLightbox.tsx`
  (il visualizzatore va montato in portale sul `body`, con larghezza `min(84vw, 34vh, 340px)`).
- Registri di identità: `src/lib/mockup-identity-registry.ts` e le espansioni
  `mockup-identity-expansion-*.ts` — utili come elenco degli stili per settore, da ripulire dai
  nomi copiati dai riferimenti.

Da **non** portare: `src/data/sector-mockups.ts`, `catalog-mockup-registry.ts`,
`catalog-companions-registry.ts` (logica di scoperta automatica che ha generato i doppioni:
in Empire v2 la galleria usa un elenco curato a mano).

---

## 6. Immagini di marca

`src/assets/empire-logo.jpeg.asset.json` e i file di marca in `src/assets/` usati dalla vetrina.

---

## 7. Da lasciare qui, senza eccezioni

Tutto ciò che riguarda la piattaforma clienti e le sue diramazioni:

`src/pages/app/**` · `src/pages/admin/**` (versione vecchia) · `src/pages/partner/**` ·
`src/pages/superadmin/**` · `src/pages/vendor/**` · `src/components/restaurant/**` ·
`src/components/leads/**` · `src/components/partner/**` · `src/components/autopilot/**` ·
`src/components/admin/**` · `src/components/demo/**` · `src/components/templates/VariantSiteRenderer.tsx` ·
`src/_legacy/**` · `CheckoutPage` · `SetupCheckoutPage` · `SetupSuccessPage` ·
`BasePackagePurchase` · `GuidedSetup` · `TenantLogin*` · `SetupPaidGuard` · `TenantGuard` ·
`KitchenView` · `StaffPanel` · tutte le 77 funzioni backend (in v2 se ne scrivono 4-5 nuove:
lead dalla call, chat Arianna, voce Arianna, contenuti home, invito venditore).
