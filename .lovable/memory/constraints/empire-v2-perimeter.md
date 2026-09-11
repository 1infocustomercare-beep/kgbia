---
name: Empire v2 Perimeter
description: Empire v2 è solo vetrina agenzia + mockup + siti demo + legali + admin + venditori. Vietati registrazione clienti, checkout, prezzi in vetrina, area cliente
type: constraint
---

Empire v2 (progetto nuovo, blueprint in `EMPIRE_V2_BLUEPRINT.md`) contiene SOLO:
home vetrina, `/mockup`, `/demo`, `/call`, pagine legali, `/accedi`, `/admin/*`, `/venditore/*`.

Vietato, mai riaggiungere:
- registrazione pubblica o iscrizione clienti
- carrello, checkout, pagamenti, pacchetti a prezzo fisso, **prezzi in vetrina**
- area cliente / dashboard tenant / gestionali dei clienti (ristorante, tavoli, magazzino)
- multi-tenant e login per cliente

**Why:** il progetto precedente è collassato (643 file, 160 rotte, 77 funzioni, 958 MB) proprio
per l'intreccio tra vetrina e piattaforma clienti. I progetti dei clienti si costruiscono a parte.

**How to apply:** ogni domanda su costi porta a "Prenota una call". Il progetto vecchio resta
archivio di riferimento: si copia solo ciò che è elencato in `EMPIRE_V2_ASSET_INVENTORY.md`.
