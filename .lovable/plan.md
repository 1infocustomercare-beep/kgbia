# Piano replica portfolio Lowengeld (`/portfolio` + home Prestige)

## Obiettivo

Portare il nostro `/portfolio` allo stesso livello di **lowengeldagency.com/portfolio**: 57 progetti reali, 9 categorie filtro, ognuno con hero + 2-4 screen coerenti (mobile + desktop dove serve), palette e layout unici per ogni progetto — nulla di ripetuto. Rinominiamo solo i brand per non essere una copia 1:1.

## Categorie filtro (come Lowengeld)

`All · Food · Lifestyle · Travel · App Design · Education · Web Design · E-Commerce · Healthcare`

## Mappatura completa dei 57 progetti → nostri brand IT

Ogni progetto avrà un nome IT nuovo ma stesso concept/settore/stile del riferimento.

**Food (14)** — Flame Kebab, Otomaki Sushi, La Patrona, Papagua, Cote Miami→Cote Milano, Paperfish→Sakura Atelier, Batey→Pacifico Ceviche, Orygano, La Vang, Midtown Kosher→Levante Deli, Meraki Greek, Pokewaii→Poke Riviera, Strapizzami, Tiramistu→Tiramisù Lab.

**Lifestyle / Pet (4)** — Aloha Pet Resorts→Cuccia & Coccole, PawCare→Zampa Care, PawParadise→Paradiso Zampe, Luxury Car Wash→Autolavaggio Lusso.

**Travel / NCC / Charter (6)** — Meridia Rental Car→Riviera Rental, LuxDrive→Aurora Drive, Miami Boats→Riviera Boats, Miami Watersports→Garda Watersports, Asinara Charter, Reformer Pilates (Travel-lifestyle→lifestyle).

**App Design / Voice / Admin (5)** — VoceAI Voice Agent, Addio Dipendenti IA, Dental Masters Admin Suite→Studio Aurora Suite, Gestionale Studio Longobardi→Gestionale Aurora, Associard→Associati Card.

**Education / Kids (4)** — Little Diamond Nursery→Piccolo Diamante, Ashley's Playhouse→Piccoli Passi, Little Stars Daycare→Stelline Asilo, TopGolf Bay App→GreenClub Golf (borderline sport-education).

**Web Design / Real Estate (6)** — Alma Regina Relais (5 stili), Dimora Milano, Gold Vento Real Estate→Aurea Real Estate, Texas Horse Ranch (5 stili)→Ranch Toscana (5 stili), Agarty Atelier Digitale, Arredissima→Arredo Italia.

**E-Commerce / Beauty / Retail (6)** — Neo Nails Brickell→Atelier Unghie, Aura Milano Spa, Tatush Hair Fragrance→Essenza Fragrance, City Padel Milano, MMI Resident Hub→Residenza Aurea Hub, Edilprogress Matera→EdilProgress.

**Healthcare (4)** — FAR Medical→Studio Medico Aurora, Annalisa Longobardi Dental→Studio Longobardi Dental, La Clinica del Ciclo (già nostra), Studio Fisioterapia.

**Costruzioni / Idraulica (8)** — Nicks Plumbing→Idraulica Express, Idraulica Carrieri, Domus Clima, DR Costruzioni, Edil Prato (sito + gestionale = 2), Termoacciai Matera (sito + gestionale = 2), Studio Elettro Impianti.

Totale: 57 progetti.

## Suddivisione in turni (uno per messaggio)

Ogni turno genera i mockup AI (4 screen coerenti per progetto: Home / Servizi-Menu / Dettaglio / Booking-CTA), aggiorna il registry `sector-mockups.ts` (+ nuovo `portfolio-lowengeld-registry.ts`), e li rende visibili nel filtro categoria.

- **T1 · Food parte 1** (7 progetti: Flame Kebab, Otomaki, Sakura Atelier, Cote Milano, Pacifico Ceviche, Orygano, Strapizzami) → 28 immagini AI
- **T2 · Food parte 2** (7 progetti: La Patrona, Papagua, La Vang, Levante Deli, Meraki, Poke Riviera, Tiramisù Lab) → 28 immagini AI
- **T3 · Beauty / Retail E-com** (6 progetti) → 24 immagini
- **T4 · Travel / NCC / Charter** (6 progetti) → 24 immagini
- **T5 · Real Estate + progetti multi-stile** (Alma Regina 5, Ranch Toscana 5, Dimora, Aurea RE, Agarty, Arredo Italia) → 44 immagini (5+5+4×4 = 40+)
- **T6 · Pet / Lifestyle** (4 progetti) → 16 immagini
- **T7 · Education / Kids + Golf** (4 progetti) → 16 immagini
- **T8 · Healthcare + Dental Admin** (4 progetti + 2 admin suite) → 24 immagini
- **T9 · Costruzioni / Idraulica / Impianti** (8 progetti) → 32 immagini
- **T10 · App Design / Voice / Gestionali** (4 progetti + rifiniture desktop) → 16 immagini
- **T11 · UI portfolio finale**: nuovo layout card doppio-phone come Lowengeld, filtri 9 categorie, lightbox multi-screen mobile+desktop, hover "View Project", pagina dettaglio `/portfolio/:slug` con storia progetto (problema/soluzione/automazioni). Nessuna nuova immagine.

Totale stimato: ~250 immagini AI premium + refactor UI finale.

## Vincoli tecnici

- Ogni progetto ha **palette, tipografia e layout unici** (no template ricopiato). Uso `google/gemini-3.1-flash-image` per generare via `imagegen--generate_image` con prompt dettagliati settore per settore.
- Assets salvati in `src/assets/mockups/portfolio-lowengeld/{slug}/{screen}.png` e caricati come `.asset.json` via `lovable-assets create`.
- Nuovo registry `src/data/portfolio-lowengeld.ts` con: slug, brand IT, categoria, sotto-categoria, palette accent, 4 screens mobile + (dove serve) 2 desktop, descrizione problema/soluzione/automazioni.
- Il `MockupLightbox` esistente viene esteso per mostrare desktop screens quando presenti (già supporta `device` toggle in `DemoPreviewPage`).
- UI portfolio: nuovo `PremiumMockupGallery.tsx` con layout **card doppio-phone** identico a Lowengeld (2 iPhone affiancati leggermente sfalsati + badge categoria + titolo + descrizione + "View Project →").
- Additivo: nessun file esistente rimosso; i mockup attuali restano disponibili come varianti.

## Cosa succede al termine di ogni turno

- Type-check verde.
- Screenshot Playwright del filtro categoria appena completata su `/portfolio`.
- Progress tracker aggiornato nel commit message (es. "T3/11 — Beauty & Retail online").

## Prossimo passo

Se approvi questo piano, parto subito con **T1 · Food parte 1** (7 progetti, 28 immagini AI premium).
