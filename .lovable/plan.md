# Consolidamento Ruoli & Account — Empire

Obiettivo: gerarchia pulita, reale e funzionante. 4 livelli ben separati, ognuno con login, dashboard, permessi RLS, e flusso di onboarding chiaro. Niente cancellazioni: solo additivo + redirect dei flussi vecchi.

## Gerarchia finale

```text
SUPER ADMIN (1 — Kevin: kevin97bernardini@gmail.com)
   └─ VENDITORE / Partner (recluta clienti, gestisce demo)
        └─ SOTTO-VENDITORE (lavora sotto un venditore, commissione ridotta)
              └─ CLIENTE BUSINESS (titolare ristorante/NCC/beauty/ecc. — paga abbonamento Empire)
                    └─ STAFF del cliente (camerieri, autisti, dipendenti — opzionale)
```

## Step 1 — Database: ruoli unificati

Estendere `app_role` enum (additivo, non rompe nulla):
- `super_admin` — solo Kevin (già protetto da trigger)
- `partner` — venditore principale
- `sub_partner` — **NUOVO** — sotto-venditore
- `business_owner` — cliente che ha comprato (proprietario tenant)
- `business_staff` — dipendente del business
- `user` — fallback

Aggiungere:
- Tabella `sub_partners` (link `parent_partner_id` → `user_id`, commissione %, attivo)
- Colonna `parent_partner_id` su `companies`/`restaurants` per tracciare chi ha portato il cliente
- Trigger: quando un sub_partner crea un lead/demo/cliente, la commissione si splitta automaticamente (partner padre + sub)
- Funzioni `has_role`, `is_super_admin`, `is_partner_of(tenant_id)` aggiornate

## Step 2 — Flussi di registrazione separati

Una pagina di ingresso unica `/auth` con 3 percorsi chiari (no più ambiguità tra `AuthPage` / `PartnerRegister` / `OnboardingPage`):

```text
/auth
 ├─ "Sono un cliente business"  → /onboarding (business_owner)
 ├─ "Sono un venditore Empire"  → /partner/register (partner)
 └─ "Login"                      → smart redirect per ruolo
```

Smart redirect dopo login (centralizzato in `useAuthRedirect`):
- `super_admin` → `/super-admin`
- `partner` → `/partner/dashboard`
- `sub_partner` → `/partner/dashboard` (vista filtrata sui suoi lead)
- `business_owner` → `/t/:slug/admin` (sector-aware)
- `business_staff` → `/t/:slug/staff`

Il sub-partner viene **invitato** dal partner padre (no self-signup) tramite `/partner/team` → genera un link `/auth/invite?token=...`.

## Step 3 — Dashboard per ruolo (consolidamento)

Mantenere tutti i file esistenti (no delete), ma una sola **entry route ufficiale** per ruolo:

| Ruolo | Route ufficiale | Note |
|---|---|---|
| Super Admin | `/super-admin` | Già esistente, aggiungere tab "Venditori & Sotto-venditori" |
| Partner | `/partner/dashboard` | Aggiungere tab "Team" per gestire sub_partners |
| Sub-Partner | `/partner/dashboard` | Stessa UI, dati filtrati via RLS sui lead del sub |
| Business Owner | `/t/:slug/admin` | `/dashboard` e `/app` → 301 redirect verso questo |
| Business Staff | `/t/:slug/staff` | View limitata (ordini/turni, no settings) |

## Step 4 — Pagamenti & abbonamenti cliente

Il cliente business compra l'abbonamento Empire al settore. Configurazione:
- Mantenere `setup-checkout` esistente (BYOK Stripe già configurato in precedenza)
- Una sola edge function checkout: `setup-checkout` rimane canonica, `stripe-setup-checkout` → wrapper che chiama la prima (no duplicazione logica)
- `SetupPaidGuard` esteso a TUTTE le route tenant (`/t/:slug/admin/*`, `/r/:slug/admin/*`, `/b/:slug/admin/*`)
- Commissione automatica al partner (e split al sub_partner se presente) su ogni pagamento riuscito, scritta in `partner_commissions`

## Step 5 — Sezione "Team" per partner (NUOVA)

In `/partner/team`:
- Lista sotto-venditori
- Invita sotto-venditore (email + % commissione, default 50% del partner)
- Vedi performance: lead generati, demo create, clienti chiusi, commissioni maturate
- Sospendi / riattiva

## Step 6 — Super Admin: pannello "Network"

In `/super-admin`, nuova tab:
- Tutti i partner (con totali, MRR generato, n. clienti)
- Tutti i sub_partner (con padre)
- Tutti i clienti business (con settore, stato pagamento, partner)
- Override: forzare ruolo, sospendere account, refund

## Dettagli tecnici

- **RLS**: `business_staff` vede solo dati del proprio tenant; `sub_partner` vede solo i lead/demo che ha creato + commissioni proprie; `partner` vede tutto del suo team
- **Edge functions**: 1 nuova `invite-sub-partner` (genera token + invia email), 1 nuova `accept-sub-partner-invite`
- **Migration**: 1 sola migration con enum extension, nuova tabella `sub_partner_invites`, colonna `parent_partner_id`, RLS aggiornate, GRANT espliciti
- **Niente delete**: i file/route vecchi restano ma redirectano a quelli canonici

## Cosa NON faccio in questo loop
- Non tocco il design (resta Luxury Dark Empire)
- Non riscrivo le edge function `n`/`companies` (deduplicazione data-model = loop separato — già listata nell'audit precedente)
- Non cambio il provider Stripe (resta BYOK come configurato)

## Domande prima di partire

1. **Commissione default sub-partner**: 50% di quella del partner padre va bene, o vuoi un valore diverso (30%? 40%?)
2. **Sub-partner può creare altri sub-partner?** (proporrei NO — solo 2 livelli sotto super admin)
3. **Business staff**: lo includo ora o lo rimandiamo (focus solo su business_owner per ora)?
4. **Email di invito sub-partner**: usiamo Lovable Emails (richiede setup dominio) o per ora link copia-incolla?

Rispondi anche solo con i numeri (es. "1: 50%, 2: no, 3: rimanda, 4: copia link") e procedo con la migration + codice tutto in un colpo.
