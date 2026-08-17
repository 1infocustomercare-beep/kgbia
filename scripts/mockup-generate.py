#!/usr/bin/env python3
"""
Runner di generazione mockup con VERIFICA AUTOMATICA OBBLIGATORIA.

Pipeline per ogni schermata:
  1. genera l'immagine (Lovable AI Gateway, modello image)
  2. GATE 1 — inquadratura: scripts/mockup-frame-qa.py
       (iPhone frontale, intero, nessun elemento fuori dal display, no nesting)
  3. GATE 2 — contenuto: scripts/mockup-qa.py
       (nessun testo tagliato/troncato, safe area, leggibilità)
  4. se un gate fallisce → rigenera con il retry hint (max --retries)
     dopo l'ultimo tentativo lo scarto viene salvato in _rejected/ e NON entra
     nel catalogo: nessuna schermata non conforme viene mai pubblicata.

Uso:
  bun scripts/export-mockup-manifest.ts /tmp/mockups/manifest.json
  python scripts/mockup-generate.py --manifest /tmp/mockups/manifest.json \
      --out /tmp/mockups/out --sector food --limit 4

  # dry-run: nessun credito speso, stampa solo i job e i prompt
  python scripts/mockup-generate.py --manifest ... --dry-run --sector beauty
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import time
import urllib.request
from importlib.machinery import SourceFileLoader

HERE = os.path.dirname(os.path.abspath(__file__))
frame_qa = SourceFileLoader("frame_qa", os.path.join(HERE, "mockup-frame-qa.py")).load_module()
content_qa = SourceFileLoader("mockup_qa", os.path.join(HERE, "mockup-qa.py")).load_module()

GATEWAY = "https://ai.gateway.lovable.dev/v1/images/generations"
MODEL = os.environ.get("MOCKUP_MODEL", "google/gemini-3-pro-image")


def generate(prompt: str, api_key: str) -> bytes:
    body = json.dumps({
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "modalities": ["image", "text"],
    }).encode()
    req = urllib.request.Request(
        GATEWAY, data=body,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req) as res:
        payload = json.load(res)
    data = (payload.get("data") or [{}])[0].get("b64_json")
    if not data:
        raise RuntimeError(f"nessuna immagine nella risposta: {str(payload)[:300]}")
    return base64.b64decode(data)


def verify(path: str) -> dict:
    frame = frame_qa.validate_frame(path)
    content = content_qa.validate_image(path)
    issues = list(frame["issues"]) + list(content.get("issues", []))
    hints = [h for h in (frame.get("retry_hint"), content.get("retry_hint")) if h]
    return {
        "pass": bool(frame["pass"] and content.get("pass")),
        "frame": frame, "content": content, "issues": issues,
        "retry_hint": " · ".join(hints),
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--manifest", required=True)
    ap.add_argument("--out", default="/tmp/mockups/out")
    ap.add_argument("--sector")
    ap.add_argument("--identity")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--retries", type=int, default=2)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--screen-index", type=int, default=-1, help="genera solo la schermata N (0 = hero)")
    ap.add_argument("--workers", type=int, default=1)
    ap.add_argument("--skip-existing", action="store_true")
    ap.add_argument("--shard", default="", help="partiziona i job: 'i/n' (es. 0/4)")
    args = ap.parse_args()


    with open(args.manifest) as f:
        manifest = json.load(f)
    jobs = manifest["jobs_list"]
    if args.sector:
        jobs = [j for j in jobs if j["sector"] == args.sector]
    if args.identity:
        jobs = [j for j in jobs if j["identityId"] == args.identity]
    if args.screen_index >= 0:
        jobs = [j for j in jobs if j["index"] == args.screen_index]
    if args.skip_existing:
        jobs = [j for j in jobs if not os.path.exists(
            os.path.join(args.out, f"{j['identityId']}-{j['index']}-{j['screenKey']}.png"))]
    if args.shard:
        idx, total = (int(x) for x in args.shard.split("/"))
        jobs = [j for n, j in enumerate(jobs) if n % total == idx]
    if args.limit:

        jobs = jobs[: args.limit]

    print(f"job selezionati: {len(jobs)}")
    if args.dry_run:
        for j in jobs:
            print(f"\n--- {j['identityId']}/{j['screenKey']} [{j['styleSignature']}]\n{j['prompt'][:400]}…")
        return 0

    api_key = os.environ.get("LOVABLE_API_KEY")
    if not api_key:
        print("LOVABLE_API_KEY assente: impossibile generare", file=sys.stderr)
        return 1

    os.makedirs(args.out, exist_ok=True)
    rejected_dir = os.path.join(args.out, "_rejected")
    os.makedirs(rejected_dir, exist_ok=True)
    report, ok_count = [], 0

    def run_job(j):
        name = f"{j['identityId']}-{j['index']}-{j['screenKey']}.png"
        target = os.path.join(args.out, name)
        prompt = j["prompt"]
        accepted = False
        for attempt in range(args.retries + 1):
            try:
                png = generate(prompt, api_key)
            except Exception as exc:  # 429/5xx → backoff, resto terminale
                msg = str(exc)
                print(f"  ! {name} errore gateway: {msg[:160]}")
                if any(code in msg for code in ("429", "500", "502", "503")) and attempt < args.retries:
                    time.sleep(4 * (attempt + 1))
                    continue
                report.append({"job": name, "status": "gateway-error", "error": msg[:300]})
                break

            probe = target if attempt == 0 else os.path.join(rejected_dir, f"try{attempt}-{name}")
            with open(probe, "wb") as f:
                f.write(png)
            res = verify(probe)
            if res["pass"]:
                if probe != target:
                    os.replace(probe, target)
                print(f"  ✓ {name} (tentativo {attempt + 1})")
                accepted = True
                report.append({"job": name, "status": "ok", "attempts": attempt + 1})
                break

            codes = ", ".join(str(i.get("code") or i.get("type")) for i in res["issues"] if i["severity"] == "blocker")
            print(f"  ✗ {name} tentativo {attempt + 1}: {codes or 'qa'}")
            if attempt < args.retries:
                prompt = f"{j['prompt']}\nCORREZIONI OBBLIGATORIE: {res['retry_hint']}."
            else:
                if probe == target and os.path.exists(target):
                    os.replace(target, os.path.join(rejected_dir, name))
                report.append({"job": name, "status": "rejected", "issues": res["issues"]})
        if not accepted:
            print(f"  → {name} scartato: non entra nel catalogo")
        return accepted

    from concurrent.futures import ThreadPoolExecutor
    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        for accepted in pool.map(run_job, jobs):
            if accepted:
                ok_count += 1

    with open(os.path.join(args.out, "qa-report.json"), "w") as f:
        json.dump({"ok": ok_count, "total": len(jobs), "items": report}, f, indent=2)
    print(f"\n{ok_count}/{len(jobs)} schermate conformi · report in {args.out}/qa-report.json")
    return 0 if ok_count == len(jobs) else 2


if __name__ == "__main__":
    sys.exit(main())
