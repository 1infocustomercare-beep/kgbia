# Empire — Ricostruzione pulita (Empire v2)

## La mia raccomandazione: ripartire da un progetto nuovo

Ho misurato questo progetto: 643 file di codice, 160 rotte, 77 funzioni backend, 958 MB di file
tra immagini e video. Dentro ci sono interi pezzi che oggi non vuoi più: registrazione clienti,
carrello e pagamento del pacchetto, dashboard cliente, pannello ristorante, gestionale tavoli,
piani a prezzo fisso. Sono intrecciati con le pagine che invece vuoi tenere.

In più questo progetto ha una regola storica "non cancellare nulla": è il motivo per cui le
duplicazioni si sono accumulate. Pulire qui significherebbe smontare più di quanto costruiamo,
e ogni pagina buona resterebbe agganciata a codice morto. Il backend di questo progetto è anche
in pausa e non si riesce a riattivare, quindi gli accessi non funzionano comunque.

Quindi: **costruiamo Empire v2 in un progetto nuovo**, e non ricominciamo da zero davvero —
ci portiamo dietro il lavoro già buono, copiato pezzo per pezzo:

- la homepage vetrina attuale (struttura e sezioni che ti piacciono) come punto di partenza
- Arianna (chat + voce)
- i mockup già venuti bene, scartando i brutti
- i 4 siti demo da tenere: Aurea Jet, NCC, Aurelia Motori, ristorazione/food
- le pagine legali già scritte (privacy, termini, cookie, note fiscali regime forfettario)

Questo piano descrive **cosa costruiremo** e **in che ordine**. Lo eseguiamo nel progetto nuovo.

## Cosa contiene Empire v2 (niente altro)

1. **Home vetrina agenzia** — servizi (web app, siti, gestionali, automazioni IA, agenti IA),
   settori, mockup, casi, metodo, FAQ, prova sociale. **Nessun prezzo, nessun pacchetto fisso.**
   Ogni CTA porta a **prenota una call**.
2. **Hero interattiva con presentatrice UGC** — video verticale di una persona reale generato da
   noi che dà il benvenuto e racconta i servizi. Parte in muto con un solo tocco per l'audio,
   sempre chiudibile, non riparte se l'hai chiusa, e non si carica affatto su connessioni lente.
3. **Arianna** — chat testuale + voce, in un pannello leggero che si carica solo quando la apri
   (è così che togliamo i rallentamenti attuali).
4. **Pagina Mockup** — galleria in stile Lowengeld: per ogni settore molti stili diversi, ognuno
   con il percorso completo di schermate (home, accesso, registrazione, catalogo/menu, dettaglio,
   prenotazione, pagamento, area personale) coerenti con quel mestiere. Apertura a tutto schermo
   con frecce.
5. **Pagina Siti demo** — i siti navigabili, ricostruiti 1:1 dai riferimenti che mi hai dato,
   cambiando solo nome, logo, foto e testi.
6. **Pagine legali italiane** — privacy, cookie con banner e pannello preferenze, termini,
   note legali e nota fiscale regime forfettario.
7. **Prenota call** — modulo che raccoglie settore, esigenza, budget indicativo e contatti, e
   crea un lead.
8. **Il tuo account admin** — leads, venditori, provvigioni, call, schede progetto consegnate dai
   venditori, libreria immagini/video, editor contenuti della home.
9. **Account venditore** — ricerca e gestione lead, pipeline, esiti call, invio della scheda
   progetto a te, provvigioni.

**Fuori dal progetto, definitivamente:** registrazione clienti, checkout, area cliente,
gestionali dei clienti, pannelli ristorante. I progetti dei clienti li costruisci a parte.

## I 20 siti da ricostruire 1:1

Da rifare uno a uno dai link (design, sezioni, animazioni, scroll, audio dove c'è), cambiando
solo brand, logo, foto e testi: docmo portfolio, the-prime-original, solara-light-intro, exorent,
ivory-tooth, atlas-orthopaedie, axon-pitch, prive-chauffeur, evermore-photography, brace-pizza,
the-doener, noir-brew, villa-scroll, jayden-walkthrough, cinematic-product, lustre-detailing,
cleanfox, lumen-dental, obsidian-motors, six-brothers-selfcut.

Li facciamo a lotti di 3-4 per volta: ogni lotto viene studiato dal sito originale, ricostruito e
verificato su desktop e telefono prima di passare al successivo. Non tutti in una botta: è così
che si perdono qualità e crediti.

## Ordine di lavoro

**Fase 1 — Fondamenta** (progetto nuovo)
Identità visiva Empire, navigazione, backend nuovo, ruoli admin/venditore, pagine legali,
modulo prenota call.

**Fase 2 — Home vetrina**
Sezioni e testi presi dai competitor (docmo, areaseb, inferentia, codestack) rielaborati in
chiave Empire, senza prezzi. Hero UGC + Arianna.

**Fase 3 — Admin e venditori**
Il tuo pannello, il pannello venditore, il passaggio della scheda progetto, provvigioni.

**Fase 4 — Mockup**
Galleria per settore, con selezione delle schermate migliori già esistenti e rigenerazione di
quelle brutte, a lotti per settore.

**Fase 5 — Siti demo**
Prima i 4 da tenere, poi i 20 nuovi a lotti.

## Note tecniche

- Stack: React + Vite + Tailwind, backend Lovable Cloud nuovo (il vecchio è in pausa e non
  riattivabile).
- Dati: `leads`, `sellers`, `commissions`, `calls`, `project_briefs`, `media_assets`,
  `homepage_content`. RLS: venditore vede solo i propri lead, admin vede tutto.
- Migrazione asset: copio solo i file effettivamente usati dai mockup e dai 4 siti demo tenuti,
  via CDN asset pointer, così il progetto nuovo non nasce con 958 MB di peso morto.
- Hero UGC: video generato con il generatore video, servito muto/autoplay/loop, `poster` statico,
  audio solo su gesto utente, stato "chiuso" ricordato nel browser.
- Arianna: pannello a caricamento differito, streaming delle risposte, voce femminile italiana
  coerente col nome.
- Siti demo: uno per rotta, motion isolato per sito, nessun effetto globale condiviso.
- Questo progetto resta intatto come archivio di riferimento da cui copiare.

## Cosa mi serve da te

- Conferma che andiamo su progetto nuovo.
- Ordine di priorità dei 20 siti (o parto io dai primi 4 e me li confermi).
