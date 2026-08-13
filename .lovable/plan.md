# Pulizia delle finte "homepage" di Empire

## Cosa sta succedendo

Nella barra di ricerca di Lovable (`/`) compaiono voci come *home-v2*, *index.html*, *empire-ai*, *home-prestige*, *casa*, *pagina iniziale*. Non sono homepage vere: sono **21 rotte alias** dichiarate in `src/App.tsx` (righe 637-655) che reindirizzano tutte a `/`. Esistono solo come rete di sicurezza per vecchi link in cache, ma vengono indicizzate come pagine e creano confusione.

La home vera resta una sola: `/` → `EmpirePrestigeHome`.

## Intervento

1. Rimuovere da `src/App.tsx` le rotte alias puramente decorative:
   `/home`, `/index`, `/index.html`, `/landing`, `/empire`, `/home-prestige`, `/landing-legacy`, `/homepage`, `/main-home`, `/old-home`, `/new-home`, `/home-v2`, `/landing-v2`, `/empire-ai`, `/ai`, `/prestige`, `/revolutionary`, `/cosmic`, `/21st`.
2. Nessuna perdita di funzionalità: `src/pages/NotFound.tsx` ha già il regex `HOME_LIKE` che intercetta tutti questi percorsi (compreso `/index.html`) e reindirizza automaticamente a `/`. Chi arriva da un vecchio link finisce comunque sulla home giusta.
3. Mantenere invariati gli alias che puntano a pagine diverse dalla home (`/mockups`, `/settori`, `/prezzi`, `/diventa-partner`, ecc.).
4. Verificare che `/`, `/portfolio`, `/join` e un percorso legacy (es. `/home-v2`) rispondano correttamente.

## Note tecniche

- Modifica limitata al blocco di `<Route>` in `src/App.tsx`; nessun tocco a backend, auth o rotte protette.
- `public/sitemap.xml` verrà controllato e, se elenca uno di questi alias, ripulito.
- Nessun file di pagina viene cancellato: gli alias erano solo redirect, non componenti.
