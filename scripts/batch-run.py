#!/usr/bin/env python3
"""
Esegue un LOTTO di ricostruzione: tutti gli stili di un settore del registro.

Ogni stile viene ricostruito con scripts/ref-recreate.py (schede tecniche +
immagine di riferimento + gate di qualità). Le immagini restano in staging fuori
dal progetto finché il lotto non è approvato; la pubblicazione è un passo separato.

Uso:
  python scripts/batch-run.py --sector food
  python scripts/batch-run.py --sector food --kind desktop --workers 3
"""
from __future__ import annotations

import argparse, json, os, subprocess, sys

REF = "/tmp/reference"
HERE = os.path.dirname(os.path.abspath(__file__))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sector", required=True)
    ap.add_argument("--kind", default="both", choices=["phone", "desktop", "both"])
    ap.add_argument("--out", default="/tmp/mockups/v2")
    ap.add_argument("--workers", type=int, default=3)
    ap.add_argument("--retries", type=int, default=2)
    ap.add_argument("--fidelity", type=float, default=0.45)
    ap.add_argument("--only", default="", help="lista di slug separati da virgola")
    args = ap.parse_args()

    reg = json.load(open(f"{REF}/registry.json"))
    only = {s.strip() for s in args.only.split(",") if s.strip()}
    styles = [r for r in reg.values() if r["sector"] == args.sector and (not only or r["slug"] in only)]
    styles.sort(key=lambda r: -r["quality"]["score"])
    if not styles:
        print(f"nessuno stile per il settore {args.sector}", file=sys.stderr)
        return 1

    print(f"LOTTO {args.sector}: {len(styles)} stili\n")
    summary = []
    for r in styles:
        target_id = r["folder"].split("/", 1)[1]
        cmd = [sys.executable, os.path.join(HERE, "ref-recreate.py"),
               "--slug", r["slug"], "--brand", r["brand"], "--sector", args.sector,
               "--target-id", target_id, "--out", args.out, "--kind", args.kind,
               "--workers", str(args.workers), "--retries", str(args.retries),
               "--fidelity", str(args.fidelity)]
        print(f"── {r['brand']} ({r['style']}, qualità {r['quality']['tier']})")
        code = subprocess.call(cmd)
        rep = os.path.join(args.out, args.sector, target_id, "qa-report.json")
        ok = tot = 0
        if os.path.exists(rep):
            d = json.load(open(rep)); ok, tot = d.get("ok", 0), d.get("total", 0)
        summary.append({"slug": r["slug"], "brand": r["brand"], "ok": ok, "total": tot, "exit": code})
        print()

    out = os.path.join(args.out, args.sector, "_batch.json")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    json.dump({"sector": args.sector, "kind": args.kind, "styles": summary},
              open(out, "w"), indent=1, ensure_ascii=False)
    done = sum(s["ok"] for s in summary); total = sum(s["total"] for s in summary)
    print(f"LOTTO {args.sector}: {done}/{total} schermate conformi → {out}")
    return 0 if done == total else 2


if __name__ == "__main__":
    raise SystemExit(main())
