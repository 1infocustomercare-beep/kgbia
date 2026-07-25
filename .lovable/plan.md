# Piano — Caccia Lead & Generazione Mockup (Partner + Super Admin)

Nulla verrà eliminato senza il tuo OK: archiviare = spostare in `src/_legacy/` (recuperabile). Backend/auth/RLS intatti. Approccio additivo/correttivo.

## Diagnosi (dall'audit)

- `LeadsPage.tsx` = 3407 righe, 60 `useState`, tutto in un blob lineare.
- **3 entry point diversi** per "genera sito da lead" con costi crediti **diversi** (10 vs 15) → confusione economica.
- **2 sistemi Vault** paralleli (`useDemoVault` legacy + `useMockupSuiteVault` nuovo) montati nella stessa pagina.
- **2 Bottom Nav** implementate 2 volte (`PartnerLayout` inline vs `BottomNav.tsx`).
- **13 file morti** con 0 import reali (~200KB codice, incluso `PartnerSandbox` 58KB + `LeadEnginePro` 44KB + `DemoFactoryOverlay` 592r).
- Bug CSS silenzioso: `bg-[empire-violet-surface]` (classe inesistente) in 2 punti.
- Responsive: `grid-cols-5/4/3` fissi senza fallback su 375px in 8+ punti; `w-[560/1440/1600]px` non clampati; testi a `text-[8px]`.
- Colori hex hardcoded + `bg-white` letterale in 8 file → rompe tema Prestige.
- 3 CTA "genera sito" con path diversi, uno rimanda pure a `/partner/leads` invece di aprire il generatore.

## Fase 1 — Sicurezza (nessuna cancellazione, solo mappatura)

Ti mostro l'elenco definitivo dei 13 file candidati archivio con conteggio import (già a 0). Tu approvi UNA volta e sposto tutti in `src/_legacy/leads/` e `src/_legacy/partner/` conservandoli.

```text
components/leads/
  CreditConfirmDialog.tsx           dead-by-comment
  DemoFactoryOverlay.tsx  (592r)    dead-by-comment
  LeadAnalysisPanel.tsx
  LeadCommandPanel.tsx
  LeadPipelineBoard.tsx
  LeadResultCard.tsx
  LeadSearchPanel.tsx
components/partner/
  PartnerSandbox.tsx      (58KB)
  PartnerFullDemo.tsx     (dipendenza di Sandbox)
  PartnerDemoProjects.tsx
  PartnerOutreachCRM.tsx  (24KB — precursore di SellerCRM)
  LeadEnginePro.tsx       (44KB — precursore di LeadsPage/Arianna)
  PartnerPortfolio.tsx    (sostituito da PartnerPortfolioPage)
```

## Fase 2 — Unificazione generazione mockup/sito (SINGLE SOURCE OF TRUTH)

Il "canonico" è **`MockupSuiteGenerator`** in `/partner/custom-preview` (15 crediti, flusso 1:1 mockup-only già in memoria progetto).

1. `LeadIntelligenceCard.handleGenerateMockup` → non genera più localmente, ridirige il lead selezionato a `/partner/custom-preview?leadId=...&autoStart=1` (già supportato da MockupSuiteGenerator via `autoStart`+`autoBuildSite` come da memoria).
2. `ManualPreviewPicker` → resta come **selettore di template** (fase pre-generazione), ma al conferma passa il testimone al generatore ufficiale invece di chiamare `requestDemoFactory` in proprio.
3. CTA "Genera sito" in `PartnerPortfolioPage` → apre direttamente il generatore con contesto, non manda su `/partner/leads`.
4. **Risultato**: 1 solo costo crediti, 1 sola pipeline di generazione, 3 punti d'ingresso che convergono.

## Fase 3 — Vault unico

- Marchio `useDemoVault` come deprecated (banner in file, non rimosso).
- `DemoVaultPanel` riscritto per leggere SOLO da `useMockupSuiteVault`.
- Aggiungo migrazione soft: se un utente ha ancora entries legacy, le mostro con badge "Legacy" ma dallo stesso pannello (nessuna perdita dati, nessuna migrazione DB obbligatoria).

## Fase 4 — Information Architecture della pagina `LeadsPage`

Da monoblocco a **4 tab + 2 drawer**, senza cancellare logica:

```text
┌─ Tab RICERCA ────────────────────────────────────────┐
│ SmartCity + SmartSector + QuickSearch + [🔽 Sorgenti avanzate → drawer: GpsRadar, LeadSearchSources]│
├─ Tab RISULTATI ──────────────────────────────────────┤
│ Griglia lead + AriannaLeadScoutPanel collassabile a destra│
├─ Tab PIPELINE (CRM) ─────────────────────────────────┤
│ SellerCRM (unico centro follow-up/stage/note)        │
├─ Tab INTELLIGENCE ───────────────────────────────────┤
│ LeadIntelligenceInbox + drawer DeepLeadIntel on-demand│
└─ FAB unificato (SpeedDial + SalesPlaybook fusi) ─────┘
```

- Onboarding wizard/checklist → overlay one-time, non componente sempre montato.
- Nessuno stato viene perso: mantengo tutti i `useState` esistenti, li raggruppo in sotto-componenti per tab (spezzo il file da 3407→ ~800 righe orchestrator + 3-4 sub-page da 400-600 righe).

## Fase 5 — Fix responsive & visual polish

**Mobile (375-430):**
- `grid-cols-N` fissi → `grid-cols-{2|3} sm:grid-cols-N` (LeadsPage, WhatsAppABDialog, DeepLeadIntel).
- `text-[8px]` → `text-[10px]` minimo.
- `w-[Npx]` fissi → wrapper `max-w-full overflow-hidden` sistematico (7 punti).
- Fix classe no-op `bg-[empire-violet-surface]` (2 occorrenze).

**Tablet (768-1024):**
- `w-[1440/1600]px` device preview e autopilot container → `max-w-full` con `overflow-x-auto` controllato + scale factor.

**Desktop 1280+:**
- Coerenza `max-w-[1600px]` da variabile CSS, non magic number ripetuto in 3 file.

**Visual coerenza:**
- Rimpiazzo `bg-white` letterale e hex hardcoded (`#a78bfa` ecc.) con token semantici Prestige (`bg-card`, `text-primary`, ecc.) in 8 file identificati.
- z-index → introduco scala documentata `z-fab (40) | z-dock (50) | z-drawer (60) | z-modal (70) | z-toast (80) | z-voice (90)`.

## Fase 6 — Bottom Nav unificata

Estraggo pattern comune. `PartnerLayout` e `AppLayout` consumano lo stesso `<AdaptiveBottomNav variant="partner|app" />`. Nessuna rimozione: `BottomNav.tsx` diventa il canonico, `PartnerLayout` perde il duplicato inline.

## Fase 7 — Super Admin (intersezione)

- **DemoAccountsPage**: verifico se duplica logica vault → se sì, faccio leggere da `useMockupSuiteVault` con filtro `scope=all`.
- **MediaLibraryPage vs AssetCMSPage vs AssetVault**: audit dedicato, poi propongo unificazione (Fase 7b, dopo tua approvazione — non incluso in questa esecuzione).
- **OutreachHealthPage vs OutreachChannelsLiveMonitor**: unifico la query sottostante (stessa fonte dati, viste diverse).

## Ordine di esecuzione

```text
1. [FASE 1] Sposto 13 file in _legacy/ (dopo tuo OK esplicito qui sotto)
2. [FASE 5-fix critici] Fix bug CSS + responsive urgente (visibili subito)
3. [FASE 6] Bottom nav unificata (rimuove duplicato manutenzione)
4. [FASE 2] Convergenza CTA "genera mockup" (single source of truth)
5. [FASE 3] Vault unico
6. [FASE 4] IA a tab su LeadsPage (refactor grosso, ultima cosa)
7. [FASE 7] Super admin intersezioni
8. Verifica: typecheck + smoke test visivo mobile/tablet/desktop
```

## Cosa NON tocco

- Auth, RLS, tabelle Supabase, Edge Functions (nessuna migrazione DB).
- Modello dati crediti, prezzi, business logic Arianna/Autopilot.
- Homepage Prestige, portfolio pubblico, siti demo pubblici.
- Nessun `git rm`: tutto in `_legacy/`, recuperabile.

## Domanda unica prima di partire

**Confermi l'archiviazione dei 13 file listati in Fase 1?** Se sì, procedo con tutto il piano nell'ordine indicato. Se hai dubbi su uno specifico file, dimmi quale e lo lascio dov'è.
