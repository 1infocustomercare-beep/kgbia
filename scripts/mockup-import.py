#!/usr/bin/env python3
"""
Importa nel progetto le schermate mockup APPROVATE dai gate QA.

- sorgente: cartella di output del runner (es. /tmp/mockups/wave1), solo i PNG
  in radice (quelli in _rejected/ NON entrano mai nel catalogo)
- destinazione: src/assets/mockups/identities/<identityId>/<index>-<screenKey>.webp
  (WebP qualità alta: stessa resa visiva, ~6× più leggero del PNG)
- per ogni identità scrive meta.json con brand, settore, stile, palette,
  descrizione e label delle schermate, letti dal manifest.

Uso:
  python scripts/mockup-import.py --manifest /tmp/mockups/manifest.json \
      --src /tmp/mockups/wave1 [--src /tmp/mockups/wave2] [--quality 88]
"""

from __future__ import annotations

import argparse
import json
import os
import re

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DEST = os.path.join(ROOT, "src", "assets", "mockups", "identities")

SCREEN_LABELS = {
    "home": ("Vetrina", "Home dell'app: identità di brand, funzioni chiave e CTA principale."),
    "hero": ("Vetrina", "Schermata d'ingresso con hero editoriale e call to action."),
    "menu": ("Catalogo", "Listino completo con categorie, foto reali e prezzi in euro."),
    "catalog": ("Catalogo", "Catalogo navigabile con filtri e schede prodotto."),
    "detail": ("Dettaglio", "Scheda di dettaglio con contenuti, opzioni e aggiunta al carrello."),
    "booking": ("Prenotazione", "Flusso di prenotazione in pochi tap con conferma immediata."),
    "checkout": ("Checkout", "Pagamento in-app con riepilogo trasparente."),
    "profile": ("Profilo", "Area cliente con storico, fidelity e preferenze."),
    "loyalty": ("Fidelity", "Programma fedeltà con punti e premi automatici."),
    "chat": ("Assistente AI", "Chat con l'agente AI che risponde e converte 24/7."),
    "admin": ("Admin", "Pannello di gestione con metriche operative in tempo reale."),
    "calendar": ("Agenda", "Agenda live multi-operatore con slot intelligenti."),
    "map": ("Mappa", "Mappa interattiva con percorsi e disponibilità."),
    "gallery": ("Galleria", "Galleria immersiva con contenuti editoriali."),
}


def label_for(key: str) -> tuple[str, str]:
    return SCREEN_LABELS.get(key, (key.replace("-", " ").title(), f"Schermata {key}."))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--manifest", required=True)
    ap.add_argument("--src", action="append", required=True)
    ap.add_argument("--quality", type=int, default=88)
    ap.add_argument("--max-width", type=int, default=896)
    args = ap.parse_args()

    with open(args.manifest) as f:
        manifest = json.load(f)
    jobs = {
        f"{j['identityId']}-{j['index']}-{j['screenKey']}": j
        for j in manifest["jobs_list"]
    }

    os.makedirs(DEST, exist_ok=True)
    imported, skipped, per_identity = 0, 0, {}

    for src_dir in args.src:
        if not os.path.isdir(src_dir):
            continue
        for fname in sorted(os.listdir(src_dir)):
            if not fname.endswith(".png"):
                continue
            stem = fname[:-4]
            job = jobs.get(stem)
            if not job:
                m = re.match(r"^(.+)-(\d+)-([a-z0-9-]+)$", stem)
                if not m:
                    skipped += 1
                    continue
                job = {"identityId": m.group(1), "index": int(m.group(2)),
                       "screenKey": m.group(3), "sector": "food", "brand": m.group(1)}

            ident_dir = os.path.join(DEST, job["identityId"])
            os.makedirs(ident_dir, exist_ok=True)
            out = os.path.join(ident_dir, f"{job['index']}-{job['screenKey']}.webp")

            im = Image.open(os.path.join(src_dir, fname)).convert("RGB")
            if im.width > args.max_width:
                im = im.resize(
                    (args.max_width, round(im.height * args.max_width / im.width)),
                    Image.LANCZOS,
                )
            im.save(out, "WEBP", quality=args.quality, method=4)
            imported += 1
            per_identity.setdefault(job["identityId"], []).append(job)

    # meta.json per identità
    for identity_id, rows in per_identity.items():
        rows.sort(key=lambda r: r["index"])
        first = rows[0]
        labels, captions = [], []
        for r in rows:
            lab, cap = label_for(r["screenKey"])
            labels.append(lab)
            captions.append(cap)
        brand = first.get("brand") or identity_id
        style = (first.get("styleSignature") or first.get("family") or "Empire Studio")
        meta = {
            "identityId": identity_id,
            "sector": first.get("sector", "food"),
            "brand": brand,
            "style": style if isinstance(style, str) else str(style),
            "family": first.get("family", identity_id),
            "palette": first.get("surface") or "Palette dedicata al settore",
            "description": (
                f"{brand}: webapp su misura con {len(rows)} schermate coerenti — "
                "tipografia, palette, componenti e micro-interazioni disegnati su questo settore."
            ),
            "labels": labels,
            "captions": captions,
            "features": labels,
        }
        with open(os.path.join(DEST, identity_id, "meta.json"), "w") as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)

    print(f"importate {imported} schermate · {len(per_identity)} identità · scartate {skipped}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
