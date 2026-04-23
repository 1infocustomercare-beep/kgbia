---
name: Mockup Catalog Fidelity
description: AI image-to-image con 42 reference da public/mockup-references/, auto-upgrade a Nano Banana Pro quando esiste reference, fallback React garantito su fallimento AI
type: feature
---

# Mockup Catalog Fidelity (lead-mockup-suite)

I mockup AI generati per i lead replicano FEDELMENTE i 42 mockup approvati del catalogo (`public/mockup-references/`) usando image-to-image.

## Pipeline
1. **Catalog reference**: per ogni schermata cerchiamo il mockup catalogo affine via `findCatalogReference(sector, screenType)` (mappa 16 settori × tipi schermata).
2. **Image-to-image**: la reference viene passata a Nano Banana come `image_url` multimodale → l'AI replica layout/densità/stile, sostituendo solo brand+contenuti.
3. **Auto-upgrade Pro**: quando esiste una reference, forziamo SEMPRE `google/gemini-3-pro-image-preview` (qualità top per replica fedele).
4. **Prompt rinforzato**: directive `📸 IMMAGINE DI RIFERIMENTO (REGOLA #1)` istruisce l'AI a replicare struttura visiva, sostituendo solo brand/contenuti/palette.
5. **React fallback per-screen**: se una singola schermata AI fallisce dopo 5 tentativi, quella diventa `render_mode: "react"` (template fedele al catalogo). Le altre AI restano.
6. **React full fallback**: se l'AI è totalmente offline (rate limit / payment_required / errore fatale), TUTTE le 4 schermate diventano React. Status finale `complete_react_fallback`. Il vendor riceve sempre 4 mockup, mai un errore vuoto.

## Settori mappati a catalogo
legal, accounting, agriturismo, beach, cleaning, construction, education, electrician, events, garage, gardening, logistics, photography, retail, tattoo (15 settori, 42 file PNG totali).

Settori senza catalogo (food, beauty, ncc, fitness…) usano i template variants esistenti (paperfish, strapizzami, batey, modern_dark…) con prompt standard senza reference.

## File chiave
- `supabase/functions/lead-mockup-suite/index.ts` — pipeline completa
- `public/mockup-references/*.png` — 42 mockup catalogo serviti come HTTPS asset al gateway AI
- URL reference: `https://empireia.lovable.app/mockup-references/<file>.png`
