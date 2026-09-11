---
name: Empire v2 — economia a lotti chiusi
description: Regola anti-spreco crediti per la ricostruzione Empire v2: prima copia, poi inventario, poi generazione a lotti con QA automatico, lotto approvato mai ritoccato
type: constraint
---
Ordine obbligatorio per ogni fase della ricostruzione Empire v2:

1. **Copiare prima di generare.** Immagini mockup già approvate, cornici iPhone/iPad/desktop,
   visualizzatore fullscreen, Arianna, pagine legali e i 4 siti demo finiti (Aurea Jet, NCC,
   Aurelia Motori, Food) si trasferiscono come file. Nessuna rigenerazione.
2. **Inventario prima di spendere.** Elencare stile per stile quali delle 6-8 schermate mancano.
   Generare solo i buchi reali.
3. **Generazione a lotti nel sandbox** con `scripts/mockup-generate.py`: gate inquadratura +
   gate contenuto + retry automatico. Le schermate non conformi finiscono in `_rejected/` e non
   entrano nel catalogo. Un lotto = un messaggio, non un messaggio per immagine.
4. **Lotti chiusi**: ogni lotto (mockup per settore, siti demo a 3-4) si chiude con verifica
   screenshot a 375px e desktop. Un lotto approvato non si tocca più.
5. **Conferma prima dei siti demo**: 5 righe su cosa si replica dall'originale, prima di costruire.
6. **Registro mockup curato a mano** (liste esplicite). Mai auto-discovery: è stata la causa di
   duplicati e schermate incoerenti nel progetto vecchio.

**Why:** rifare lavoro già approvato e generare immagini scartate sono le due voci che bruciano
crediti; questa sequenza le elimina.
