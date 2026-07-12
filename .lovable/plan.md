
# Piano: Catalogo mockup — massima qualità AI, tutti i settori, tutti gli stili

## Obiettivo
Portare le ~83 card del catalogo `/portfolio` allo stesso livello dei mockup già presenti in `src/assets/mockups/generated/` (Nano Banana Pro, iPhone screen-only, luci studio, densità UI reale). Oggi ogni card è un SVG deterministico e a colpo d'occhio si assomigliano tutte: questo è il motivo per cui "sembrano basic".

## Cosa cambia

1. **Generatore batch AI** — nuovo script `scripts/gen-catalog-mockups.mjs` che, dato l'elenco degli 83 stili (`SECTOR_PORTFOLIO`), genera per ognuno:
   - **1 thumbnail hero** (card catalogo, priorità visiva massima) → sempre AI premium
   - **fino a 4 schermate interne** (home, servizi/menu, dettaglio, booking) → AI premium
   - Totale target: ~83 hero + ~250 schermate = **~330 PNG reali**
   - Modello: `google/gemini-3-pro-image` (fedeltà catalogo, come `lead-mockup-suite`)
   - Prompt template per settore × stile, con palette del preset (obsidian-gold, sakura, azure-ocean, ecc.), brand name reale della card, densità UI concreta (chip, KPI, foto placeholder cinematografici, CTA)
   - Output salvato in `src/assets/mockups/catalog/<sector>/<style-slug>-<screen>.png.asset.json`

2. **Wiring nel catalogo**
   - Nuovo modulo `src/data/catalog-mockup-registry.ts` che mappa `(sectorId, styleSlug, screenType) → url PNG`
   - `SECTOR_PORTFOLIO` (in `src/data/portfolio-showcase-data.ts` o equivalente) legge dal registry; se il PNG esiste → usa quello, altrimenti fallback al vecchio `empireCoverFromPath` (garantisce zero card rotte durante la generazione)
   - `SECTOR_MOCKUP_IMAGES` (thumbnail carousel home) → stesso wiring, prime immagini = PNG reali

3. **Coerenza visiva**
   - Palette per stile (obsidian, sakura, azure, sage, ecc.) presa dal `EMPIRE_PALETTES` esistente → il prompt AI riceve HEX espliciti, così ogni stile è distinguibile
   - Frame iPhone: NON generato dall'AI (evita distorsioni). L'AI produce solo lo screen (390×844) e `CatalogPhonePreview` continua a wrappare con la cornice titanio
   - Tutti i mockup vietano loghi Apple/Google/Meta, testo "Empire/Lovable", parole in inglese nei contenuti (copy italiano professionale)

4. **Rollout in fasi** (per non saturare il gateway AI)
   - **Fase 1** — hero thumbnails 83 stili (il valore visivo maggiore, quello che l'utente vede scrollando)
   - **Fase 2** — schermata "home" per ogni stile (usata quando la card espande)
   - **Fase 3** — schermate residue (menu / detail / booking)

## Vincoli rispettati
- SOLO additivo: nessun file esistente rimosso, il registry sovrascrive solo dove esistono i PNG. Il generatore SVG resta come safety net.
- Nessun impatto su auth / Supabase / route protette / Phase-Final.
- Nessuna nuova parola vietata (gratis, gratuito, prova gratuita).
- Numeri hero della home (4.9/5, 3.500+ aziende, setup 7 giorni) intatti.
- Palette globale smeraldo/oro del sito invariata (le palette dei mockup sono INTERNE agli screen).

## Dettagli tecnici (per riferimento)

```text
scripts/gen-catalog-mockups.mjs
  ├─ carica SECTOR_PORTFOLIO
  ├─ per ogni (sector, style, screen):
  │    ├─ costruisce prompt premium con palette + brand + settore + tipologia schermata
  │    ├─ POST /v1/images/generations {model: google/gemini-3-pro-image, ...}
  │    ├─ salva PNG in src/assets/mockups/catalog/...
  │    └─ genera .asset.json (formato Lovable esistente)
  ├─ concorrenza 4 richieste parallele con backoff su 429
  └─ resume-safe: skippa file già presenti (rilanciabile per fasi)

src/data/catalog-mockup-registry.ts
  export const CATALOG_MOCKUPS: Record<`${sector}::${style}::${screen}`, string>
  export function catalogMockupUrl(sector, style, screen): string | null
```

Il generatore SVG attuale resta come fallback in fase di generazione e in caso di rimozione futura di un asset.

## Costo & tempi
- ~330 chiamate a Nano Banana Pro. Fase 1 sola = 83 chiamate (~15 min con parallelismo 4).
- Nessuna interazione utente durante la generazione, ma richiede più turni: **Fase 1 nel primo turno di build, Fase 2 e 3 nei turni successivi** dopo aver visto il primo risultato in preview.

## Deliverable primo turno
- Script `scripts/gen-catalog-mockups.mjs` creato ed eseguito per Fase 1 (83 hero)
- Registry creato e wired
- Nessuna pubblicazione. Preview verificata su `/portfolio`.
