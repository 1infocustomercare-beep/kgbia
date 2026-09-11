# Roadmap Empire v2

Questo progetto è ora **archivio di riferimento**. La costruzione avviene in un progetto nuovo
("Empire v2"), seguendo `EMPIRE_V2_BLUEPRINT.md`.

## Da fare nel progetto nuovo

- [ ] Fase 1 — Fondamenta: identità visiva, navigazione, backend, ruoli admin/venditore, pagine legali, modulo prenota call
- [ ] Fase 2 — Home vetrina senza prezzi + hero UGC + Arianna
- [ ] Fase 3 — Pannello admin + pannello venditore + scheda progetto + provvigioni
- [ ] Fase 4 — Galleria mockup per settore (selezione + rigenerazione)
- [ ] Fase 5 — Siti demo: prima i 4 da tenere, poi i 20 nuovi a lotti di 3-4

## Regola anti-spreco (vale per ogni fase)

1. Prima si **copia** ciò che esiste già (immagini approvate, cornici, visualizzatore, Arianna,
   pagine legali, i 4 siti demo finiti). Zero generazione.
2. Poi si fa l'**inventario delle schermate mancanti** stile per stile.
3. Solo allora si **genera a lotti** con lo script `scripts/mockup-generate.py` (2 gate QA +
   retry automatico): le schermate non conformi non entrano nel catalogo.
4. Ogni lotto si chiude con verifica a 375px e desktop. **Un lotto approvato non si ritocca più.**
5. Prima di ogni lotto di siti demo: 5 righe di conferma su cosa replico dall'originale.
6. Registro mockup **curato a mano**, mai auto-discovery (causa di duplicati e incoerenze).

## Aperto — serve una tua azione

- [ ] **Creare il progetto nuovo su Lovable** (io non posso crearlo da qui) e incollare nel primo
      messaggio il contenuto di `EMPIRE_V2_BLUEPRINT.md`.
- [ ] Confermare l'ordine di priorità dei 20 siti demo.

## Fatto qui

- [x] Analisi duplicazioni e decisione strategica (progetto nuovo)
- [x] Blueprint completo di consegna: `EMPIRE_V2_BLUEPRINT.md`
- [x] Inventario di ciò che va copiato da questo progetto: `EMPIRE_V2_ASSET_INVENTORY.md`
