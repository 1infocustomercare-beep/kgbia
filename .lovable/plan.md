# Rifinitura finale Aurea Jet — sincronizzazione e lusso immersivo

## Obiettivo
Trasformare `/demo/aurea-jet` in un’esperienza fluida e credibile: gli effetti devono iniziare quando la scena entra davvero nel viewport, concludersi prima che l’utente la lasci e non mostrare più immagini o testi in ritardo. Il linguaggio visivo riprende la precisione editoriale e meccanica del riferimento Ruzza, adattandola al charter privato senza copiarne marchio o contenuti.

## Interventi

### 1. Regia dello scroll unica e sincronizzata
- Ridurre le sezioni sticky oggi troppo lunghe e rimappare ogni animazione su una finestra visibile precisa: ingresso, sviluppo, uscita.
- Correggere offset e soglie di `useScroll`, reveal e clip curtain, eliminando contenuti che compaiono quando la relativa sezione è già passata.
- Rendere le transizioni contigue: ogni scena consegna visivamente la successiva senza vuoti neri, scatti o sovrapposizioni.
- Su mobile usare durate più corte e movimenti meno ampi, mantenendo però l’esperienza completa.

### 2. Sostituzione completa di “Film · Cabina Aurea”
- Rimuovere dall’esperienza il film attuale dei sedili e il relativo poster, giudicati incoerenti e ripetitivi.
- Creare una nuova sequenza premium originale con scene distinte: avvicinamento al jet, ingresso in cabina, dettagli materiali, servizio e vista in quota.
- Pilotare la nuova sequenza in modo deterministico con lo scroll, con fallback fotografico elegante e caricamento progressivo.
- Evitare qualsiasi riuso dello stesso asset nelle altre sezioni visibili del sito.

### 3. Effetti ispirati al linguaggio Ruzza, adattati al jet
- Intro con profondità controllata e avvicinamento cinematografico, non semplice zoom.
- Reveal tipografici a maschera, dettagli che si compongono come un movimento meccanico e immagini che entrano solo dentro la finestra attiva.
- Migliorare “vista esplosa”, “window dive”, tendine fotografiche e marquee con curve, scale e timing coerenti tra loro.
- Conservare CTA, concierge e funzioni operative sempre leggibili e sopra gli effetti.

### 4. Pulizia editoriale e asset
- Inventario di tutte le immagini/video usati nella pagina e assegnazione univoca per sezione.
- Eliminare dall’interfaccia ripetizioni visive, immagini generiche o poco realistiche e scene che sembrano appartenere a jet differenti senza una ragione narrativa.
- Uniformare color grading, contrasto, taglio fotografico, tipografia, spaziature e didascalie in un’unica direzione ultra-lusso.

### 5. Verifica completa desktop e mobile
- Testare l’intero percorso con scroll lento, veloce e inverso a 375 px e desktop.
- Controllare: nessun overflow orizzontale, nessun testo tagliato, sticky che rilasciano correttamente, video/frame pronti prima dell’ingresso, CTA non coperte e concierge senza collisioni.
- Verificare anche `prefers-reduced-motion`, caricamento lento e fallback media.

## Dettagli tecnici
- Centralizzare le finestre di progressione in una piccola regia condivisa invece di soglie indipendenti sparse.
- Limitare gli aggiornamenti video al periodo in cui la scena è attiva e sospenderli fuori viewport.
- Precaricare solo la prossima scena necessaria; immagini successive in lazy loading.
- Usare trasformazioni GPU (`transform`, `opacity`, `clip-path`) ed evitare animazioni che causano layout continuo.
- Non modificare auth, backend, route protette o gli altri siti demo. Non pubblicare.
