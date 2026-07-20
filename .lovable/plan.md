## Obiettivo

Ogni settore avrà **4 stili completamente distinti** (colore, layout, tipografia, componenti — non solo il colore) e ogni stile avrà **4 schermate coerenti** (Home → Lista/Menu → Dettaglio → Booking/CTA) che mostrano funzioni realmente utili per quel settore. Un solo iPhone Pro Max per mockup, lightbox fullscreen già attivo.

## Perché serve un piano iterativo

- Immagini totali: **~192 PNG Premium** (12 settori × 4 stili × 4 schermate)
- Tempo Premium: ~40s/immagine → **~2h di generazione**
- Un singolo turno agent non può reggerlo: serve batching in più turni.

## Batching proposto (1 batch = 1 turno)

Ogni batch = 1 settore completo = 16 immagini Premium (~10-12 min).

**Turno 1 — Beauty** (4 stili sector-specific):
1. `Nail Atelier Lavender` — soft lavanda/oro, tipografia serif editoriale, cabine + schede VIP
2. `Hair Editorial Noir` — nero/bordeaux, look book fotografico, agenda stylist
3. `Barber Shop Industrial` — cuoio/rame, prezzi combo, prenota poltrona
4. `MedSpa Clinical Glass` — ghiaccio/menta, trattamenti clinici, before/after

**Turno 2 — Hair + Spa** (già coperti sopra + 2 extra: Extension Studio + Day Spa Ethereal)

**Turno 3 — Fitness/Padel/Wellness**:
1. `Padel Club Sage` · 2. `Boxing Gym Industrial` · 3. `Yoga Studio Zen` · 4. `CrossFit Acid`

**Turno 4 — Healthcare/Vet/Dental**:
1. `Poliambulatorio Glass` · 2. `Dental Clinic Mint` · 3. `Pet Resort Tropico` · 4. `Physio Studio Warm`

**Turno 5 — Construction/RealEstate/Interior**:
1. `Developer Luxury Marble` · 2. `Architect Studio Mono` · 3. `Interior Boutique Warm` · 4. `Cantiere Ops Dark`

**Turno 6 (finale)** — Aggiornamento registry `sector-mockups.ts` per rimuovere tutte le sovrapposizioni tra settori (ogni settore usa **solo** i suoi PNG dedicati) + verifica lightbox.

## Tecnica

- Script Python (skill `ai-gateway`) che chiama `google/gemini-3-pro-image` Premium in loop con prompt sector-specific + reference image (stile locked per stile).
- Naming: `<sector>-<style-id>--1-home.png`, `--2-list.png`, `--3-detail.png`, `--4-booking.png`
- Upload via `lovable-assets create` → registrazione automatica nel registry glob.

## Prossimo step

Confermi che parto **subito col Turno 1 (Beauty)** e proseguiamo un settore per turno?
