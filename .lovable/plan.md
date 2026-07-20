# Ristrutturazione pacchetti + Rete venditori

## Obiettivo
Due percorsi commerciali distinti + rete venditori con link referral e commissioni.

---

## 1. PACCHETTO BASE — Self-service

**Flusso cliente**
```
Landing → "Acquista Base" → Checkout Stripe → Onboarding guidato:
 1. Sceglie stile visivo (galleria da sector-mockups.ts)
 2. Carica logo + nome + colore primario + font
 3. Anteprima live → Conferma → Consegna automatica sito webapp
```

**Nuove pagine / componenti**
- `src/pages/BasePackagePurchase.tsx` — landing dedicata con prezzo, cosa è incluso, CTA acquisto.
- `src/pages/BaseStyleSelector.tsx` — gallery filtrabile per settore che riusa i mockup di `src/data/sector-mockups.ts` (sfrutta già `PremiumMockupGallery`). Click su variante → salva `selectedVariantId` nel wizard.
- Estensione di `OnboardingPage.tsx` (o nuovo `BaseOnboardingWizard.tsx`) con step: Stile → Brand → Contenuti minimi → Publish.
- Edge function `deploy-base-site`: legge la variante scelta, applica brand overrides (logo/nome/colori) su `public_site_config`, crea record `companies`, ritorna URL `/b/:slug`.

**Dati/DB**
- Tabella `base_orders(id, user_id, seller_id nullable, variant_id, brand_json, stripe_session_id, status, company_id, created_at)`.
- Colonna `public_site_config.template_variant_id` per tracciare lo stile scelto.

---

## 2. PACCHETTO COMPLETO — Su misura (no acquisto diretto)

**Flusso cliente**
```
Landing → "Richiedi progetto Completo" → Modulo lungo → Submit
 → Notifica admin/venditore → Contatto umano per preventivo/pagamento offline
```

**Modulo (`src/pages/CustomProjectBrief.tsx`)** — sezioni:
1. Brand: nome, storia, tone of voice, valori, competitor, moodboard (upload).
2. Obiettivi: KPI, target, mercato geografico.
3. Contenuti: testi esistenti (upload/paste), foto/video, servizi/prodotti (elenco), FAQ.
4. Riferimenti: 3-5 siti che ispirano + note stilistiche.
5. Feature richieste: booking, e-commerce, area riservata, multilingua, integrazioni (checkbox).
6. Budget indicativo + timing + referente (nome, email, telefono, WhatsApp).

**Dati/DB**
- Tabella `custom_project_briefs(id, submitted_by user_id nullable, seller_id nullable, payload jsonb, files_urls jsonb, status enum[new,contacted,quoted,won,lost], created_at)`.
- Storage bucket `project-briefs` con RLS strict (solo owner + admin + seller assegnato).
- Edge function `submit-custom-brief`: valida, salva, invia email admin + eventuale seller.

**Admin**
- Pagina `src/pages/admin/CustomBriefsInbox.tsx` con lista, filtri, assegnazione seller, cambio stato.

---

## 3. RETE VENDITORI

**Account & ruolo**
- Nuovo enum ruolo `seller` nella tabella `user_roles` esistente (memory: user-roles pattern rispettato).
- Signup dedicato `/vendor/signup` che crea profilo + assegna ruolo seller.

**Link referral personale**
- Tabella `sellers(id, user_id unique, slug unique, commission_pct numeric default 15, active bool, iban, fiscal_data jsonb, created_at)`.
- Link pubblico: `https://empireia.lovable.app/?ref=<slug>` (funziona su tutte le landing).
- Middleware/hook `useReferralCapture` in `App.tsx`: al mount legge `?ref=`, salva in `localStorage.empire_ref` + cookie 30gg.
- Al checkout/submit brief il referral corrente viene letto e salvato in `base_orders.seller_id` / `custom_project_briefs.seller_id`.

**Commissioni**
- Tabella `seller_commissions(id, seller_id, source_type enum[base_order,custom_project], source_id, gross_amount, pct, commission_amount, status enum[pending,approved,paid], paid_at, created_at)`.
- Trigger DB: alla creazione/completamento di `base_orders` con `seller_id != null` crea riga in `seller_commissions` con `pct = sellers.commission_pct`.
- Per `custom_project_briefs`: la commissione si genera solo quando l'admin marca `status=won` e inserisce l'importo fatturato.

**Configurazione admin**
- Pagina `src/pages/admin/SellersManagement.tsx`:
  - Lista venditori con vendite/commissioni totali.
  - Edit `commission_pct` per singolo venditore (default globale in `platform_settings.default_commission_pct`).
  - Attiva/disattiva account.
  - Segna commissioni come `paid` (batch payout tracking).

**Dashboard venditore (`/vendor/dashboard`)**
- Card KPI: vendite mese, vendite totali, commissioni pending, commissioni pagate.
- Tabella ordini/brief con status.
- Copia link referral + QR code + link diretto pagina Base / Custom.
- Bottone "Compila brief per cliente" → apre `CustomProjectBrief` in modalità venditore (associa automaticamente `seller_id`).
- Toggle vista prospect (partner-content-surfaces per densità dati, coerente con memory).

**RLS**
- Ogni venditore vede SOLO le proprie righe (`user_id = auth.uid()` via join a `sellers`).
- Admin (has_role admin/super_admin) vede tutto.
- Tutte le tabelle nuove: GRANT authenticated + service_role, no anon.

---

## 4. PAGAMENTI REALI (Stripe) — solo predisposizione

Non attivare in questa fase. Serviranno:

1. **Provider consigliato**: Stripe (già abilitabile via `payments--enable_stripe_payments` seamless — no chiavi manuali).
2. **Prodotti Stripe**: 1 prezzo one-shot per il pacchetto Base (es. €1.997) + eventuali add-on. Nessun prezzo per Completo (fatturazione manuale).
3. **Edge functions da preparare**:
   - `create-base-checkout` → crea Checkout Session con `client_reference_id = base_orders.id` e `metadata.seller_id`.
   - `stripe-webhook` → su `checkout.session.completed` marca `base_orders.status=paid`, trigger commissione, invia email cliente + venditore, lancia deploy sito.
4. **Secrets richiesti** (se BYOK): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`. Con integrazione seamless non servono.
5. **Payout venditori**: fase 1 = manuale (admin bonifico e marca `paid`). Fase 2 opzionale = Stripe Connect Express per split automatici.
6. **Fatturazione**: riusare `Fiscal Vault 2026` esistente (memory) per emettere fattura B2B al cliente e ricevuta commissione al venditore.

---

## 5. Rollout consigliato (ordine implementazione)
1. Schema DB + RLS + GRANT (base_orders, custom_project_briefs, sellers, seller_commissions).
2. Referral capture globale (`useReferralCapture`).
3. Pagina Base + selector stile + wizard.
4. Modulo Completo + inbox admin.
5. Signup venditore + dashboard venditore + gestione admin.
6. (Successivo) attivazione Stripe reale + webhook + deploy automatico.

## 6. Impatto su codice esistente
- Nessuna cancellazione (memory: sviluppo non distruttivo).
- `PrestigeConversion.tsx` aggiornato con 2 CTA distinti (Base "Acquista ora" / Completo "Richiedi progetto").
- `OnboardingPage.tsx` resta per utenti già attivi; nuovo wizard Base è separato per non rompere il flusso esistente.
