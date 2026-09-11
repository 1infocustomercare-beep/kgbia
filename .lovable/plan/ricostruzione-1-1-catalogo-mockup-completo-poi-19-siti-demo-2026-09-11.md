# Ricostruzione 1:1 — catalogo mockup completo, poi 19 siti demo

Obiettivo: rifare **tutti** gli stili del riferimento (59 set, 853 schermate: 486 verticali + 367 desktop), correggendo i set deboli allineandoli ai migliori. Poi ricostruire i 19 siti demo indicati, identici in struttura ed effetti, cambiando solo brand, logo, nomi, descrizioni e foto.

Regola ferma: nessun tentativo a vuoto. Ogni schermata si genera una volta, con la scheda tecnica del riferimento davanti, e passa un controllo automatico prima di entrare nel catalogo.

## Fase 1 — Schede tecniche di tutte le schermate (nessuna immagine generata)

1. Analisi automatica delle 853 immagini già scaricate: per ognuna una scheda con funzione della schermata, palette esatta, tipografia, geometria, griglia, componenti visibili, stile fotografico, dettagli distintivi.
2. Punteggio di qualità per set: completezza sequenza, densità interfaccia, coerenza cromatica. I set debolii non vengono scartati: ereditano le regole dei set migliori dello stesso settore (griglia, spaziature, gerarchia) mantenendo la loro identità di colore.
3. Nomi brand italiani inventati, uno per stile, coerenti col settore e mai uguali all'originale. Il set completo va in un registro rivisto a mano prima di generare.

Output: registro stili + schede tecniche. Costo immagini: zero.

## Fase 2 — Generazione a lotti chiusi

- Ordine per settore: food, hospitality, beauty/wellness, medical/dental, pet, sport/fitness, kids, auto/noleggio, nautica, casa/edilizia, impianti, retail, servizi, gestionali.
- Lotto = un settore alla volta. Ogni lotto si chiude con verifica visiva tua prima di passare al successivo. Un lotto approvato non si rigenera più.
- Verticali: solo contenuto schermo 9:19.5, nessuna cornice telefono dentro l'immagine.
- Desktop: solo contenuto browser 16:10, la cornice la mette il componente della pagina.
- Controllo automatico per ogni schermata: proporzione, assenza di cornice interna, nessun testo tagliato o troncato, densità di interfaccia reale, testi tutti in italiano, logo del brand presente, fedeltà cromatica al riferimento. Chi non passa non entra nel catalogo.

## Fase 3 — Catalogo, pagine settore e homepage

- Registro unico per stile: settore, brand, palette, sequenza verticale, sequenza desktop.
- Pagina settore in stile editoriale: hero, filtri stile, righe complete di schermate mobile con etichette funzione, riga desktop nativa, viewer a schermo pieno con frecce, contatore e chiusura con Esc.
- Homepage: galleria mockup con effetti scroll e anteprime navigabili dei siti demo.

## Fase 4 — 19 siti demo ricostruiti 1:1

Per ogni link: cattura di tutte le sezioni a più risoluzioni, mappa di struttura, tipografia, spaziature, animazioni e comportamenti scroll; poi ricostruzione con brand, logo, testi e foto nuovi ma coerenti, e confronto affiancato col riferimento prima di chiudere.

Elenco: the-prime-original, solara-light-intro, exorent, ivory-tooth, atlas-orthopaedie, axon-pitch, prive-chauffeur, evermore-photography, brace-pizza, the-doener, noir-brew-beige, villa-scroll-demo, jayden-walkthrough, cinematic-product-template, lustre-detailing, cleanfox-delta, lumen-dental-one, obsidian-motors, six-brothers-selfcut.

## Nota su tempi e costi

853 schermate sono un volume grande: si lavora per settori, un lotto per volta, e ogni lotto è definitivo una volta approvato. Le schede tecniche della Fase 1 servono esattamente a evitare rigenerazioni.

## Dettagli tecnici

- `scripts/ref-describe.py`: schede tecniche da riferimento (Gemini vision) — estensione a tutti i 59 slug.
- `scripts/ref-recreate.py`: generazione screen-only con prompt derivato dalla scheda, retry guidato dal controllo, cartella scarti separata.
- `scripts/screen-qa.py`: gate verticale 9:19.5 già operativo; si aggiunge una modalità desktop 16:10.
- Nuovo `src/data/mockup-registry.ts` come unica fonte per catalogo, pagine settore e homepage.
