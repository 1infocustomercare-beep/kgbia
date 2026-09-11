# Empire v2 — come rifarlo senza bruciare crediti

Obiettivo: portfolio/mockup al livello di Lowengeld (tutti gli stili, tutte le interfacce) e i siti demo replicati 1:1 dai link, **senza** rifare tutto da zero e senza centinaia di messaggi.

## Il principio: si riusa, non si rigenera

Tre cose costano crediti: generare immagini, scrivere codice nuovo, e sbagliare e rifare. Le taglio così:

1. **Le immagini buone si copiano, non si rifanno.** Nel progetto attuale ci sono già 49 set di mockup completi e centinaia di schermate approvate. Si spostano come file. Costo: zero generazione.
2. **Il codice che già funziona si copia intero.** Cornici iPhone/iPad/desktop, visualizzatore a tutto schermo, pagina settore, Arianna, pagine legali, i 4 siti demo già finiti (Aurea Jet, NCC, Aurelia Motori, Food). Non si riprogetta: si trasferisce.
3. **Si genera solo il buco vero.** Prima faccio l'inventario schermata per schermata: quali stili hanno 6-8 interfacce complete e quali no. Genero solo le mancanti, a lotti, dentro il sandbox con i controlli automatici già scritti (`mockup-generate.py`): scarta e rigenera da solo le schermate storte senza chiedermi niente. Un lotto = un messaggio, non uno per immagine.

## Come evitiamo gli errori (la regola dei lotti chiusi)

- Si lavora a **lotti**: mockup per settore, siti demo a 3-4 per volta.
- Ogni lotto si chiude con **verifica visiva su desktop e telefono** che faccio io e ti mostro. Se è ok si passa avanti, se no si corregge dentro lo stesso lotto.
- **Non si tocca mai un lotto già approvato.** È questa la regola che evita di ripagare due volte lo stesso lavoro.
- Prima di ogni lotto di siti demo studio l'originale del link e ti scrivo in 5 righe cosa replico. Se ho capito male, lo dici lì: costa un messaggio, non un lotto rifatto.

## Ordine di lavoro

**Lotto 0 — Fondamenta (1 volta).** Progetto nuovo, design system Empire, navigazione, backend, ruoli admin/venditore, `/accedi`, pagine legali, cookie, modulo `/call`. Nessuna generazione di immagini.

**Lotto 1 — Home vetrina.** Sezioni dal blueprint, senza prezzi, CTA unica alla call. Poi hero UGC e Arianna (caricata solo al clic).

**Lotto 2 — Portfolio e mockup.** Galleria `/mockup` + pagina settore in stile Lowengeld + visualizzatore a tutto schermo. Import degli asset esistenti, poi un lotto di generazione per settore solo sulle schermate mancanti, con controllo automatico.

**Lotto 3 — Admin e venditori.** Lead, venditori, call, schede progetto, provvigioni, libreria media.

**Lotto 4..N — Siti demo, 3-4 per volta.** Prima i 4 già finiti (trasferimento, quasi zero costo), poi i 20 nuovi replicati 1:1 cambiando solo nome, logo, foto e testi.

## Dettagli tecnici

- Migrazione per copia di file secondo `EMPIRE_V2_ASSET_INVENTORY.md`; nessuna riscrittura dei componenti già validati.
- Generazione immagini via script sandbox (`scripts/mockup-generate.py`) con i due gate QA già esistenti (inquadratura + contenuto) e retry automatico: le schermate non conformi non entrano nel catalogo.
- Registro mockup **curato a mano** (liste esplicite), non auto-discovery: era la causa dei duplicati e delle schermate incoerenti.
- Un solo gestore dello scroll per l'app; animazioni dei demo isolate nel singolo sito.
- Verifica di ogni lotto con screenshot automatici a 375px e desktop.

## Cosa mi serve da te per partire

1. Creare il progetto nuovo su Lovable (io non posso farlo) e incollarci `EMPIRE_V2_BLUEPRINT.md`.
2. Dirmi quali 4 dei 20 siti vuoi nel primo lotto — altrimenti scelgo i più vendibili.
