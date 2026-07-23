
# Revisione Totale Piattaforma Empire — Piano operativo

Nessun Publish. Nessuna modifica ad auth/Supabase/RLS/edge functions core. Solo front-end + pulizia route + copy.

## Fase 1 — Mappatura (read-only, ~15 file)

Leggo in parallelo per costruire l'inventario reale:
- `src/App.tsx` (tutte le route + guard)
- `src/pages/OnboardingPage.tsx` + step Brand (bug segnalato ancora aperto)
- `src/pages/JoinPartnerPage.tsx`, `src/pages/vendor/VendorSignup.tsx`, `src/pages/vendor/VendorDashboard.tsx`
- `src/pages/CustomProjectBrief.tsx` (pacchetto completo)
- `src/pages/BasePackagePurchase.tsx` + `SetupCheckoutPage.tsx` + `SetupSuccessPage.tsx` (base self-service)
- `src/pages/partner/*` (autopilot, api-connections, profile, team) + `src/components/partner/*`
- `src/pages/superadmin/*`
- `src/components/empire-home/prestige/PrestigeConversion.tsx`, `PrestigeFooter.tsx`, `PrestigeFinalCTA.tsx`, `PrestigeLeadForm.tsx`
- `src/components/leads/*` (identifico duplicati LeadSearchPanel vs LeadCommandPanel vs LeadIntelligenceLauncher)

Output: matrice "route → componente → importatori → stato (attiva/orfana/duplicata)".

## Fase 2 — Deduplica & pulizia

Regola: due sistemi che fanno la stessa cosa → tengo il migliore, l'altro diventa redirect (mai delete di file, per la regola "sviluppo non distruttivo"). Elenco atteso di aree con duplicazione da consolidare:

- Home legacy wrappers (CinematicHero21, HeroExplosion, ecc.) → verifico che siano tutti alias di `EmpirePrestigeHome`.
- Route `/home`, `/index`, `/main-home`, `/landing` → redirect a `/`.
- Mockup generator: mantengo il flusso unificato "Mockup + Sito 1:1" (`custom-preview` con `autoStart+autoBuildSite`), rimuovo bottoni/entry-point paralleli dal cockpit partner se presenti.
- Lead intelligence: consolido su un solo pannello principale, gli altri diventano wrapper.
- Pagine demo pubbliche: verifico che il routing `/r/` (food) e `/b/` (altri) non abbia doppioni.

Per ogni file neutralizzato: commento in testa + redirect / export dell'alias attivo. Elenco finale nel report.

## Fase 3 — Funnel acquisizione clienti (home + pacchetti)

Home `/` verifica end-to-end che ogni sezione abbia CTA verso `#pricing`, `#lead` (call), o `/onboarding` (base) / `/brief-progetto` (completo). Nessun vicolo cieco.

Sezione Prezzi (`PrestigeConversion`):
- Verifico i 3 piani corretti (Digital Start 1.997+49 · Growth AI 4.997+29 · Empire Domination 7.997+0).
- Bottone "Attiva" → `/onboarding` (base self-service).
- Aggiungo link "Vuoi tutto su misura?" → `/brief-progetto`.

Base self-service (`/onboarding` → `/checkout-setup` → success):
- Fix step Brand vuoto (se ancora presente): fallback quando `content.brand` è null.
- Selettore stile dal catalogo mockup (57 stili Lowengeld) integrato allo step design.
- Autopersonalizzazione logo/nome/colori confermata.
- Copy pulito: "in omaggio", "senza impegno". Nessun "gratis".

Pacchetto completo (`/brief-progetto`):
- Verifico che il form salvi su `custom_briefs` e mandi notifica.
- Pubblico fino al submit (no auth wall preventiva).

## Fase 4 — Acquisizione venditori & sottovenditori

Pagina unica pubblica `/join` (`JoinPartnerPage`) raggiungibile da:
- Footer home ("Diventa Partner")
- Sticky CTA / voce nascosta in nav

Contenuto:
- Value prop, commissioni %, esempi guadagno.
- CTA "Registrati" → flusso venditore end-to-end (email + password, ruolo auto-assegnato via metadata come da memoria `auth-resilience-and-reconciliation`).
- Referral capture: verifico `useReferralCapture` funzionante (sottovenditori ereditano parent tramite `?ref=`).

Dashboard venditore `/vendor/dashboard`:
- Link referral personale copiabile.
- Tabella commissioni: da `commissions` (leggo schema per confermare struttura, no modifiche).
- Sotto-team: elenco figli con loro conversioni.

Admin: verifico che ci sia un pannello in super admin per configurare la % commissione (se manca il pannello, l'aggiungo come additivo lato UI leggendo la tabella `commission_rates` o simile — solo se già esiste in DB; altrimenti segnalo).

## Fase 5 — Funzioni Partner (priorità massima)

Passaggio in rassegna di ogni pagina `src/pages/partner/*`:
1. Ricerca lead (`LeadSearchPanel` + multi-source) — verifico che fingerprint/cache funzioni, che i canali con API mancante mostrino badge SBLOCCA (come da memoria).
2. Mockup generator (mobile+desktop, 57 stili) — verifico device toggle, style picker, autoStart+autoBuildSite.
3. Generazione siti web da mockup — verifico che parta solo con preview approvato (constraint memoria).
4. Commissioni & referral — dashboard operativa.
5. Autopilot — pausa settori, cockpit, ROI.
6. API connections — deep-link funzionante da badge SBLOCCA.

Ogni voce: click test, error state, empty state, mobile 375px.

## Fase 6 — Super Admin

Rassegna `src/pages/superadmin/*`:
- Media Library, Brand Assets, Homepage Media Manager: verifico interoperabilità (una sola fonte di verità per media).
- Sellers management: PII protetta.
- Feature Requests, Network, Voice Orchestrator, Outreach Health.

Deduplica se trovo doppioni tra Media Library / Asset CMS / Brand Assets: consolido su uno, gli altri diventano tab/redirect.

## Fase 7 — Coerenza copy & palette

- Grep di `gratis|gratuit|prova gratuita` in tutto `src/` → sostituzione con "in omaggio" / "senza impegno".
- Grep di classi/token blu residui in home/onboarding/vendor (`sky-|blue-|indigo-|cyan-` che non siano intenzionali per stati sistem) → migrazione a emerald/gold/ivory della palette prestige.
- Verifica dati societari: solo placeholder ("Empire · Agenzia AI · Italia"), nessun VAT/indirizzo inventato.

## Fase 8 — QA finale

- `tsgo` typecheck.
- Playwright headless: apro `/`, scroll fino in fondo, controllo che ogni bottone principale abbia href/onClick valido, screenshot mobile 375 + desktop 1280.
- Console errors capture.
- Overflow orizzontale: check con `document.documentElement.scrollWidth > innerWidth` in headless.

## Deliverable finale (nel messaggio di chiusura)

Report strutturato:
1. **File toccati** (lista completa).
2. **Sistemi deduplicati** (X → Y, motivo).
3. **Bug trovati/risolti** (con file:linea).
4. **Warning residui** (cose che richiedono decisione utente o accesso backend).
5. **Screenshot QA** allegati come path.

## Dettagli tecnici

- Redirect route: uso `<Route path="/x" element={<Navigate to="/y" replace />} />` in `App.tsx`.
- Neutralizzazione componenti orfani: header comment `// @deprecated — see <replacement>` + re-export.
- Nessuna migrazione DB. Se serve un campo che non esiste, lo segnalo nel report anziché crearlo.
- Nessuna chiamata al tool `preview_ui--publish`.

## Scope-out (non farò)

- Non tocco `src/integrations/supabase/client.ts`, `types.ts`, `.env`, `supabase/config.toml`.
- Non tocco edge functions se non per bug bloccanti (in tal caso chiedo prima).
- Non elimino file (solo redirect/alias, come da memoria "Sviluppo Non Distruttivo").
- Non pubblico.

Confermi e procedo? Se ok, in autonomia — non farò altre domande a meno di bloccanti reali.
