# EMPIRE V2 — Blueprint di consegna

> Incolla questo documento nel **primo messaggio del progetto nuovo**. Contiene tutto:
> cosa costruire, cosa NON costruire, in che ordine, con quali regole.

---

## 0. Contesto

Empire AI Group è un'agenzia italiana che vende: **siti web, web app, gestionali, automazioni IA
e agenti IA**. Il sito è una **vetrina di vendita**, non una piattaforma per i clienti.

Il progetto precedente era diventato ingestibile: 643 file, 160 rotte, 77 funzioni backend,
958 MB di asset, con dentro un'intera piattaforma clienti (registrazione, checkout, dashboard
ristorante) che non serve più. Empire v2 nasce pulito e contiene **solo** quello che segue.

---

## 1. Perimetro — cosa esiste in Empire v2

| # | Area | Rotta | Chi la vede |
|---|------|-------|-------------|
| 1 | Home vetrina | `/` | pubblico |
| 2 | Mockup per settore | `/mockup`, `/mockup/:settore` | pubblico |
| 3 | Siti demo navigabili | `/demo`, `/demo/:slug` | pubblico |
| 4 | Prenota una call | `/call` | pubblico |
| 5 | Legali | `/privacy`, `/cookie`, `/termini`, `/note-legali` | pubblico |
| 6 | Accesso interno | `/accedi` | admin + venditori |
| 7 | Pannello admin | `/admin/*` | solo admin |
| 8 | Pannello venditore | `/venditore/*` | solo venditori |

### Cosa NON deve esistere (mai riaggiungere)
- Registrazione pubblica, iscrizione clienti, inviti clienti
- Carrello, checkout, pagamenti, pacchetti a prezzo fisso, prezzi in vetrina
- Area cliente / dashboard tenant / gestionali dei clienti (ristorante, tavoli, magazzino, ecc.)
- Multi-tenant, slug per cliente, login per cliente

I progetti dei clienti vengono costruiti separatamente, fuori da questo progetto.

---

## 2. Home vetrina — struttura sezione per sezione

1. **Hero interattiva con presentatrice UGC**
   - Video verticale di una persona reale (generato da noi) che accoglie e racconta i servizi.
   - Parte **in muto**, con un tasto singolo "Attiva audio". Sempre chiudibile con una X.
   - Se chiusa, non riparte (ricordato nel browser). Non si carica su connessione lenta o
     `prefers-reduced-motion`. Ha sempre un'immagine `poster` statica.
   - Accanto: titolo, sottotitolo, un solo CTA primario → **Prenota una call**.
2. **Barra di prova** — settori serviti, tempi di consegna, tecnologie.
3. **Cosa facciamo** — 5 blocchi: Siti web, Web app, Gestionali su misura, Automazioni IA,
   Agenti IA. Ogni blocco: problema del cliente → cosa costruiamo → risultato concreto.
4. **Settori** — 25+ settori con esempi di funzioni tipiche di ciascuno.
5. **Mockup** — anteprima della galleria, porta a `/mockup`.
6. **Siti demo** — anteprima dei siti navigabili, porta a `/demo`.
7. **Il metodo** — 4 passi: call → progetto su misura → costruzione → consegna e assistenza.
8. **Automazioni e agenti IA** — esempi reali (risponde ai messaggi, prende prenotazioni,
   ricontatta i clienti, prepara preventivi, ordina il magazzino).
9. **Domande frequenti** — incluse "quanto costa" e "quanto ci vuole", risposte che rimandano
   alla call senza dare cifre fisse.
10. **CTA finale** — prenota una call.
11. **Footer** — contatti, legali, "Gestisci cookie" funzionante, nota fiscale forfettario.

### Regole ferree della vetrina
- **Nessun prezzo, nessun pacchetto.** Ogni domanda su costi porta alla call.
- **Nessuna parola vietata**: mai "gratis", "gratuito", "prova gratuita" → usa "in omaggio",
  "senza impegno".
- Nomenclatura: "Setup / Sviluppo Architettura / Canone Manutenzione".
- Nota fiscale obbligatoria: *"Prezzi indicati: operazione senza applicazione dell'IVA ai sensi
  dell'art. 1, commi 54-89, L. 190/2014"*.
- Un solo `<h1>` per pagina, titolo < 60 caratteri, meta description < 160, JSON-LD
  `Organization` + `Service`, alt su tutte le immagini.

---

## 3. Arianna (chat + voce)

- Pulsante fisso in basso a destra, offset dal bordo ≥ 6rem, z-index 9998; il pulsante si
  nasconde quando il pannello è aperto.
- **Il pannello si carica solo al primo clic** (import differito). È questo il modo di eliminare
  i rallentamenti della versione precedente.
- Chat testuale con risposte in streaming + voce **femminile italiana** (coerente col nome).
- Sa: servizi, settori, tempi, metodo, e sa portare alla prenotazione della call. Non dà prezzi.
- Una sola conversazione, salvata nel browser, con tasto "Nuova conversazione".
- Un solo canale audio per volta: se parla Arianna, il video hero si mette in muto e viceversa.

---

## 4. Pagina Mockup

Riferimento di qualità: `https://lowengeldagency.com/portfolio`, da superare.

- `/mockup`: griglia per settore, filtri, ogni scheda = uno stile (identità visiva completa).
- `/mockup/:settore`: pagina editoriale con **tutti gli stili** di quel settore, ognuno con la
  fila completa di schermate.
- Ogni stile ha da **6 a 8 schermate** coerenti col mestiere:
  `home · accesso · registrazione · catalogo/menu · dettaglio · prenotazione · pagamento · area personale`
- Ogni settore ha **almeno 20 stili diversi** (es. food: pizzeria, braceria, sushi, rosticceria,
  bistrot, caffetteria, poke, kebab, gelateria, pasticceria…), diversi per colore, tipografia,
  forma dei riquadri, densità, illustrazione.
- Nomi brand **italiani inventati**, mai copiati dai riferimenti.
- Mockup renderizzato in una **cornice iPhone Pro Max** singola (mai un telefono dentro un
  telefono) e in una cornice desktop separata dove serve.
- Clic → **visualizzatore a tutto schermo** con frecce, contatore, chiusura su sfondo, tasti
  Esc / ← / →. Il visualizzatore va montato in un portale sul `body`.

Le immagini buone si copiano dal progetto vecchio (vedi `EMPIRE_V2_ASSET_INVENTORY.md`); le
brutte si rigenerano **a lotti per settore**, con controllo visivo prima di passare al lotto dopo.

---

## 5. Siti demo

### Da riportare dal progetto vecchio (4)
Aurea Jet (jet privati), NCC, Aurelia Motori (concessionaria), Ristorazione/Food.

### Da ricostruire 1:1 dai riferimenti (20)
docmo portfolio · the-prime-original · solara-light-intro · exorent · ivory-tooth ·
atlas-orthopaedie · axon-pitch · prive-chauffeur · evermore-photography · brace-pizza ·
the-doener · noir-brew · villa-scroll · jayden-walkthrough · cinematic-product ·
lustre-detailing · cleanfox · lumen-dental · obsidian-motors · six-brothers-selfcut

**Regola 1:1:** si replica tutto — struttura, sezioni, animazioni, scroll cinematografico, 3D,
effetti sonori dove ci sono. Si cambia **solo** nome brand, logo, foto e testi (in italiano).

**Metodo:** lotti di 3-4 siti. Per ogni lotto: si studia l'originale, si ricostruisce, si verifica
su desktop e su telefono, poi si passa al successivo. Mai tutti insieme.

**Regole tecniche demo:** una rotta per sito, animazioni isolate nel singolo sito (nessun effetto
globale condiviso), niente intro cinematografica quando il sito è dentro un'anteprima, audio
sempre disattivato all'avvio e attivabile a mano.

---

## 6. Pannello admin (solo tu)

- **Lead** — tutti i lead da vetrina e da venditori: settore, esigenza, stato, venditore assegnato.
- **Venditori** — creazione account, link referral, obiettivi, stato.
- **Call** — calendario e esito delle call.
- **Schede progetto** — i briefing che i venditori ti passano dopo la call chiusa: settore,
  cosa serve, funzioni richieste, riferimenti visivi, scadenza, note. È l'input con cui costruisci.
- **Provvigioni** — maturato per venditore, stato pagamento.
- **Libreria immagini e video** — tutto il materiale generato, usato e non usato, con
  cancellazione definitiva.
- **Contenuti home** — modifica testi, immagini e sezioni della vetrina con anteprima.

## 7. Pannello venditore

- Ricerca e inserimento lead, pipeline a stati (nuovo → contattato → call fissata → chiusa/persa).
- Esito call e **invio della scheda progetto** all'admin.
- Le proprie provvigioni, il proprio link referral, i materiali di vendita (mockup e siti demo
  da mostrare in call).
- Vede **solo i propri lead**.

---

## 8. Dati e sicurezza

Tabelle: `profiles`, `user_roles`, `leads`, `sellers`, `calls`, `project_briefs`, `commissions`,
`media_assets`, `homepage_content`.

- I ruoli vivono **solo** in `user_roles` (`admin`, `seller`) con enum dedicato e funzione
  `has_role(_user_id, _role)` in `security definer`. **Mai** un campo ruolo su `profiles`.
- Ogni tabella in `public`: `CREATE TABLE` → `GRANT` → `ENABLE ROW LEVEL SECURITY` → policy.
- `leads`: il venditore vede/modifica solo le righe con il proprio `seller_id`; l'admin tutto.
- `homepage_content`: lettura pubblica del contenuto pubblicato, scrittura solo admin.
- Nessuna registrazione pubblica: gli account venditore li crea l'admin.
- Il modulo "Prenota una call" scrive un lead tramite una funzione lato server (non insert
  diretta dal browser) con protezione anti-spam.

---

## 9. Regole di design

- Stack: React + Vite + Tailwind + shadcn. Tutti i colori come **token semantici** in
  `index.css` e `tailwind.config.ts` — mai `text-white`, `bg-black`, `bg-[#...]` nei componenti.
- Identità Empire: fondo scuro profondo, vetro liquido, accento smeraldo + oro/avorio.
  Nessun viola, nessun blu generico, nessun gradiente viola-su-bianco.
- Tipografia con carattere: **mai** Inter o Poppins come font principale.
- Mobile-first: base 375px, tocco minimo 44×44px, testi leggibili, nessuno scroll orizzontale.
- Contrasto verificato in chiaro e scuro. I campi dei moduli devono restare leggibili.
- Un solo gestore dello scroll per tutta l'app (nessun pin GSAP che rubi lo scroll dopo la
  navigazione).

---

## 10. Ordine di esecuzione

**Fase 1 — Fondamenta**
Design system, navigazione, backend, ruoli admin/venditore, `/accedi`, 4 pagine legali, banner
cookie con pannello preferenze (consenso max 13 mesi) e "Gestisci cookie" funzionante,
modulo `/call`.

**Fase 2 — Home vetrina**
Tutte le sezioni del punto 2, senza prezzi. Poi hero UGC, poi Arianna.

**Fase 3 — Admin e venditori**
Pannello admin completo, pannello venditore, scheda progetto, provvigioni, libreria media.

**Fase 4 — Mockup**
Galleria + pagine settore + visualizzatore. Import degli asset buoni, rigenerazione a lotti.

**Fase 5 — Siti demo**
Prima i 4 da riportare, poi i 20 nuovi a lotti di 3-4.

Ogni fase si chiude con verifica su desktop e telefono prima di aprire la successiva.
