# Mockup ricostruiti 1:1 dal riferimento — metodo preciso, senza tentativi

Hai ragione su due cose: molti mockup già presenti qui non sono all'altezza, e il modo "a occhio"
costa e sbaglia. Ecco il metodo che elimina l'improvvisazione.

## Il punto di partenza cambia: si legge il riferimento, non si immagina

Ho verificato: la pagina del riferimento carica le immagini via codice, quindi non basta "leggerla".
Si apre invece con un browser automatico dentro il sandbox e si raccolgono **tutte** le schede di
tutti i settori e **tutte** le immagini di ogni scheda, alla massima risoluzione disponibile,
mobile e desktop.

Risultato: una cartella locale con l'inventario reale — quanti stili esistono, quante schermate per
stile, quali funzioni mostrano. Non si parte più da una stima.

## Da immagine a prompt: descrizione dettaglio per dettaglio

Per ogni schermata raccolta guardo l'immagine e ne estraggo una **scheda tecnica scritta**:

- colori esatti (fondo, superfici, testo, accento), tipografia, raggio degli angoli, spessore bordi
- struttura precisa: cosa c'è in alto, al centro, in basso; quante card, in che griglia, con quali
  etichette e quali cifre
- stile fotografico, luce, tipo di illustrazione, ombre, densità
- funzione della schermata (home, accesso, registrazione, catalogo, dettaglio, prenotazione,
  pagamento, area personale)

Questa scheda diventa il prompt di generazione. È il passaggio che rende la copia fedele:
non "fai una app di ristorante bella", ma la ricostruzione descritta riga per riga.

**Cosa si cambia sempre:** nome del brand (italiano inventato), logo, foto e testi. Struttura,
colori, griglia, effetti restano identici. Il nome non deve mai richiamare il brand originale.

## Controllo automatico, così non paghiamo gli scarti

Ogni immagine generata passa due controlli già scritti e funzionanti prima di essere accettata:
inquadratura (un solo iPhone frontale, intero, niente telefono dentro il telefono) e contenuto
(nessun testo tagliato, area sicura, leggibilità). Chi non passa viene rigenerato da solo con la
correzione, e se non passa nemmeno così viene **scartato e non entra nel catalogo**.

Aggiungo un terzo controllo nuovo: **confronto con il riferimento** — palette e struttura devono
combaciare, altrimenti scarto. È questo che evita i mockup che non ti piacciono.

## Il vecchio materiale: si tiene solo il meglio, scelto da te

Non riuso niente a caso. Preparo una pagina di selezione con le miniature di tutto quello che
esiste già, settore per settore, affiancate al riferimento corrispondente. Tu spunti cosa tenere.
Tutto il resto viene rigenerato. Nessun mockup che non hai approvato finisce in vetrina.

## Home Empire: mockup con effetti + siti in anteprima

Nella home principale restano e migliorano:

- la galleria mockup con gli effetti (scorrimento 3D in profondità, apertura a tutto schermo con
  frecce, contatore, chiusura con Esc)
- una sezione **"Siti live"** con l'anteprima navigabile di alcuni siti demo dentro una cornice
  browser e una cornice telefono, con il sito vero che scorre dentro
- ogni anteprima porta alla pagina del settore e alla call

## Ordine dei lotti

1. Raccolta completa dal riferimento + inventario (nessuna generazione, quindi costo minimo)
2. Pagina di selezione: tu scegli cosa salvare del vecchio
3. Generazione settore per settore, un settore per lotto, con i tre controlli attivi
4. Home: galleria con effetti + sezione siti in anteprima
5. Siti demo 1:1 a lotti di 3-4

Ogni lotto si chiude con verifica su telefono e desktop. Un lotto approvato non si tocca più.

## Dettagli tecnici

- Raccolta con Playwright headless nel sandbox: crawl dell'indice portfolio, estrazione degli href
  dei case, per ogni case raccolta di `img[src]`/`srcset` alla risoluzione massima e degli asset
  desktop; salvataggio in `/tmp/reference/<settore>/<stile>/<n>-<funzione>.png` + `index.json`.
- Analisi immagine → scheda tecnica JSON per schermata (palette campionata dai pixel, layout
  descritto in linguaggio naturale), usata come prompt in `scripts/mockup-generate.py`.
- Terzo gate QA nuovo: distanza colore media sulla palette dominante e verifica presenza dei
  blocchi strutturali attesi; sotto soglia → scarto.
- Registro mockup curato a mano (liste esplicite), mai auto-discovery.
- Anteprime siti live in `iframe` isolato dentro cornice desktop/telefono, audio spento e nessuna
  intro cinematografica in anteprima.
