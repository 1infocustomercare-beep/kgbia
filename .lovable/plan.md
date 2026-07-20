# Ridisegno Mockup Empire — Home & Portfolio

## Obiettivo
- Ogni settore ha **6 varianti** stilistiche **realmente diverse** (colore, layout, tipografia, componenti, illustrazioni).
- Ogni mockup è **un solo iPhone Pro Max** che mostra una webapp reale del settore. **Niente iPhone dentro iPhone**, niente doppia cornice.
- Ogni schermata rappresenta **funzioni utili e coerenti** per il settore (es. Food = menu QR + ordini live + prenotazioni; NCC = fleet map + booking; Medical = agenda pazienti + refertazione).
- **Click sul mockup → apertura fullscreen** (lightbox) per vedere il mockup in grande, con swipe/frecce tra le varianti.

## Fasi

### Fase 1 — Infrastruttura (subito, ~1h)
1. **Lightbox fullscreen** condiviso (`MockupLightbox.tsx`) usato sia da Home (`MockupShowcase`, `PrestigePortfolio`, `PrestigeIndustries`, `InteractiveSectorReel`) sia da `/portfolio` (`MockupCatalog`).
   - Apertura a fullscreen su tap/click con overlay scuro, ESC per chiudere, swipe/frecce per navigare tra le varianti dello stesso settore.
   - iPhone Pro Max frame singolo, ridimensiona proporzionalmente al viewport.
2. **Cornice unificata** `IPhoneProMaxFrame.tsx`: unica sorgente di verità (dynamic island, safe area, corner radius reali). Rimuove ogni "iPhone dentro iPhone".
3. **Registry unificato** `src/data/sector-mockups.ts`: struttura `sector → variants[]` con `id, style, palette, screen, features[], imageAsset`.

### Fase 2 — Settori prioritari (batch 1, ~2h)
Ridisegno completo di **8 settori chiave** con **6 varianti ciascuno = 48 mockup**:
- Food (ristorante, pizzeria, sushi, luxury steakhouse, caffè, bistrot)
- Beauty (nails, hair, spa, estetica medica, barber, wellness)
- NCC (executive, luxury black, van tour, aeroporto, matrimoni, sportivo)
- Medical (studio, dentista, veterinario, fisioterapia, poliambulatorio, estetica)
- Fitness (palestra, personal, crossfit, yoga, padel, boxing)
- Hospitality (b&b, boutique hotel, resort, agriturismo, glamping, apartments)
- Retail (boutique fashion, gioielleria, ottica, concept store, tech, artigianato)
- Professional (avvocato, commercialista, consulente, architetto, notaio, agenzia)

Generazione via **Gemini 3 Pro Image** con prompt sector-specific: ogni prompt include palette, tipografia, componenti UI reali, features del settore.

### Fase 3 — Settori secondari (batch 2, ~2h)
Altri **12+ settori** con **6 varianti = 72+ mockup** (real estate, education, automotive, eventi, pet, wedding, sport & outdoor, cultura, servizi casa, edilizia, food delivery, farmacia…).

### Fase 4 — Integrazione UI (~1h)
- `MockupCatalog` (/portfolio): griglia con filtro settore + selector varianti, click → lightbox.
- `PrestigePortfolio` (home): mostra 1 variante hero per settore, tap → lightbox con tutte le 6.
- `PrestigeIndustries`: usa il registry, tab settore mostra hero variant.
- `MockupShowcase` / `InteractiveSectorReel`: rimuovo iPhone-in-iPhone, adotto la cornice unica.

### Fase 5 — QC e cleanup
- Ogni mockup verificato via Playwright screenshot.
- Rimosso vecchio sistema companions (`catalog-companions-registry`) e mockup generici.
- Typecheck + build.

## Costi / tempi
- ~120 immagini AI premium (Gemini 3 Pro Image), streaming durante generazione.
- Tempo stimato reale: **4–6 ore di lavoro agent** distribuite su questa e le prossime iterazioni.
- Consiglio: partire da **Fase 1 + Fase 2** in questa iterazione (viewer fullscreen + 8 settori × 6 = 48 mockup nuovi), poi Fase 3 nella prossima.

## Dettagli tecnici
- Asset esternalizzati via `lovable-assets` in `.asset.json` (nessun binario in repo).
- Nessuna modifica ad auth/backend/RLS/edge functions.
- Registry TypeScript strict, tutte le varianti tipizzate.
- Lightbox usa `Dialog` shadcn + Framer Motion, chiuso da default, `preserveAspectRatio` sull'iPhone.
- Cornice iPhone Pro Max: SVG vettoriale, dynamic island reale, safe-area corretta, screen inset preciso.

## Cosa NON viene toccato
- Auth, Supabase, edge functions, RLS.
- Route protette, onboarding, admin, demo pubblici (`/r/`, `/b/`).
- Sistema prezzi, wizard, sales agent.

## Conferma richiesta
Confermi che parto con **Fase 1 (lightbox + cornice unica) + Fase 2 (8 settori × 6 varianti = 48 mockup nuovi)** in questa iterazione? Le Fasi 3–5 seguono nelle prossime.
