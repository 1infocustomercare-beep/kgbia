#!/usr/bin/env python3
"""
Ricostruzione 1:1 di una schermata di riferimento, cambiando SOLO brand, logo, foto e testi.

Input per ogni schermata: l'immagine di riferimento + la scheda tecnica prodotta da
scripts/ref-describe.py. Il prompt viene composto dalla scheda (dettaglio per dettaglio),
l'immagine di riferimento è allegata come guida strutturale.

Gate di qualità in cascata (nessuna schermata non conforme entra nel catalogo):
  1. inquadratura  — scripts/mockup-frame-qa.py
  2. contenuto     — scripts/mockup-qa.py
  3. fedeltà       — palette e tema devono combaciare col riferimento (soglia --fidelity)

Uso:
  python scripts/ref-recreate.py --slug flame-kebab --brand "Anatolia Brace" --sector food \
      --out src/assets/mockups/v2
"""
from __future__ import annotations

import argparse, base64, json, os, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor
from importlib.machinery import SourceFileLoader

HERE = os.path.dirname(os.path.abspath(__file__))
frame_qa = SourceFileLoader("frame_qa", os.path.join(HERE, "mockup-frame-qa.py")).load_module()
content_qa = SourceFileLoader("mockup_qa", os.path.join(HERE, "mockup-qa.py")).load_module()

IMAGES = "https://ai.gateway.lovable.dev/v1/images/generations"
MODEL = os.environ.get("MOCKUP_MODEL", "google/gemini-3-pro-image")
REF = "/tmp/reference"


# ---------------------------------------------------------------- prompt

def build_prompt(spec: dict, brand: str, sector: str) -> str:
    pal = spec.get("palette", {})
    typo = spec.get("typography", {})
    geo = spec.get("geometry", {})
    zones = "\n".join(f"  - {z.get('zone')}: {z.get('content')}" for z in spec.get("layout_zones", []))
    comps = "\n".join(f"  - {c}" for c in spec.get("components", []))
    sigs = "; ".join(spec.get("signature_details", []))
    replace = ", ".join(spec.get("brand_marks_to_replace", [])) or "il logo e il nome originali"
    return f"""Screenshot UI di una app mobile iOS, ricostruzione fedele della schermata descritta qui sotto.

SCHERMATA: {spec.get('screen_title_it')} — funzione: {spec.get('screen_function')} — settore: {sector}
TEMA: {spec.get('theme')}
PALETTE ESATTA: fondo {pal.get('bg')}, superfici {pal.get('surface')}, testo {pal.get('text')},
testo secondario {pal.get('muted')}, accento {pal.get('accent')}, accento secondario {pal.get('accent2')}
TIPOGRAFIA: titoli {typo.get('display')}; testo {typo.get('body')}; {typo.get('case')}, tracking {typo.get('tracking')}
GEOMETRIA: raggio {geo.get('radius')}; bordi {geo.get('border')}; griglia {geo.get('grid')}; densità {geo.get('density')}

STRUTTURA ZONA PER ZONA (rispettala alla lettera):
{zones}

COMPONENTI VISIBILI (stesse posizioni, stesse cifre, testi tradotti in italiano):
{comps}

FOTOGRAFIA: {spec.get('photography')}
DETTAGLI DISTINTIVI DA REPLICARE: {sigs}

SOSTITUZIONI OBBLIGATORIE (unica cosa che cambia):
- il brand originale ({replace}) diventa "{brand}", con un logo nuovo e coerente al settore
- tutti i testi in italiano naturale, prezzi in euro
- foto nuove, stesso soggetto e stessa luce del riferimento
- nessun riferimento, nome o marchio dell'originale deve rimanere visibile

REGOLE DI RESA (obbligatorie):
- immagine verticale 9:19.5, SOLO il contenuto dello schermo, nessuna cornice di telefono,
  nessun telefono dentro il telefono, nessuna mano, nessun mockup fotografico
- status bar iOS in alto, tab bar in basso se prevista dalla struttura
- nessun testo tagliato o troncato, tutto leggibile, margini di sicurezza rispettati
- resa nitida, pixel-perfect, come uno screenshot reale dell'app"""


# ---------------------------------------------------------------- gateway

def generate(prompt: str, ref_path: str, api_key: str) -> bytes:
    content = [{"type": "text", "text": prompt}]
    if ref_path and os.path.exists(ref_path):
        b64 = base64.b64encode(open(ref_path, "rb").read()).decode()
        content.append({"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}})
    body = json.dumps({
        "model": MODEL,
        "messages": [{"role": "user", "content": content}],
        "modalities": ["image", "text"],
    }).encode()
    req = urllib.request.Request(IMAGES, data=body, headers={
        "Authorization": f"Bearer {api_key}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=300) as res:
        payload = json.load(res)
    data = (payload.get("data") or [{}])[0].get("b64_json")
    if not data:
        raise RuntimeError(f"nessuna immagine: {str(payload)[:300]}")
    return base64.b64decode(data)


# ---------------------------------------------------------------- gate 3: fedeltà

def _pal(path: str, n: int = 6):
    from PIL import Image
    from collections import Counter
    im = Image.open(path).convert("RGB")
    q = im.resize((60, 120)).quantize(colors=8, method=Image.MEDIANCUT).convert("RGB")
    return [c for c, _ in Counter(list(q.getdata())).most_common(n)]


def _lum(c):
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def fidelity(candidate: str, reference: str) -> tuple[float, str]:
    a, b = _pal(candidate, 6), _pal(reference, 6)
    dists = []
    for ca in a:
        dists.append(min(sum((ca[i] - cb[i]) ** 2 for i in range(3)) ** 0.5 for cb in b))
    colour = max(0.0, 1 - (sum(dists) / len(dists)) / 140)
    theme_ok = (_lum(a[0]) < 110) == (_lum(b[0]) < 110)
    score = colour * (1.0 if theme_ok else 0.5)
    hint = "" if score >= 0 else ""
    if not theme_ok:
        hint = "il tema (chiaro/scuro) non combacia col riferimento"
    elif colour < 0.7:
        hint = "la palette si discosta dal riferimento: usa i colori esatti indicati"
    return score, hint


def verify(path: str, reference: str, threshold: float) -> dict:
    frame = frame_qa.validate_frame(path)
    content = content_qa.validate_image(path)
    fid, fid_hint = fidelity(path, reference)
    issues = list(frame["issues"]) + list(content.get("issues", []))
    if fid < threshold:
        issues.append({"code": "fidelity", "severity": "blocker", "score": round(fid, 3)})
    hints = [h for h in (frame.get("retry_hint"), content.get("retry_hint"), fid_hint if fid < threshold else "") if h]
    return {"pass": bool(frame["pass"] and content.get("pass") and fid >= threshold),
            "fidelity": round(fid, 3), "issues": issues, "retry_hint": " · ".join(hints)}


# ---------------------------------------------------------------- main

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True, help="stile di riferimento (es. flame-kebab)")
    ap.add_argument("--brand", required=True, help="nome italiano inventato del nuovo brand")
    ap.add_argument("--sector", required=True)
    ap.add_argument("--target-id", default="", help="id cartella di uscita (default: brand slugificato)")
    ap.add_argument("--out", default="/tmp/mockups/v2")
    ap.add_argument("--retries", type=int, default=2)
    ap.add_argument("--workers", type=int, default=3)
    ap.add_argument("--fidelity", type=float, default=0.55)
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    specs = sorted(f for f in os.listdir(f"{REF}/specs") if f.startswith(f"{args.slug}__"))
    if args.limit:
        specs = specs[: args.limit]
    if not specs:
        print(f"nessuna scheda per {args.slug}: esegui prima scripts/ref-describe.py", file=sys.stderr)
        return 1

    tid = args.target_id or args.brand.lower().replace(" ", "-").replace("'", "")
    out_dir = os.path.join(args.out, args.sector, tid)
    rej_dir = os.path.join(out_dir, "_rejected")
    os.makedirs(rej_dir, exist_ok=True)

    api_key = os.environ.get("LOVABLE_API_KEY")
    if not api_key and not args.dry_run:
        print("LOVABLE_API_KEY assente", file=sys.stderr)
        return 1

    print(f"{args.slug} → {args.brand} ({args.sector}) · {len(specs)} schermate → {out_dir}")
    report = []

    def run(idx_spec):
        idx, sf = idx_spec
        spec = json.load(open(f"{REF}/specs/{sf}"))
        ref_img = f"{REF}/img/{args.slug}/{spec['_source']}"
        name = f"{idx}-{spec.get('screen_function', 'screen')}.png"
        target = os.path.join(out_dir, name)
        prompt = build_prompt(spec, args.brand, args.sector)
        if args.dry_run:
            print(f"\n--- {name}\n{prompt[:900]}…")
            return True
        if os.path.exists(target):
            print(f"  = {name} già presente")
            return True
        for attempt in range(args.retries + 1):
            try:
                png = generate(prompt, ref_img, api_key)
            except Exception as exc:
                msg = str(exc)
                print(f"  ! {name} gateway: {msg[:140]}")
                if any(c in msg for c in ("429", "500", "502", "503")) and attempt < args.retries:
                    time.sleep(5 * (attempt + 1)); continue
                report.append({"screen": name, "status": "gateway-error", "error": msg[:300]})
                return False
            probe = target if attempt == 0 else os.path.join(rej_dir, f"try{attempt}-{name}")
            open(probe, "wb").write(png)
            res = verify(probe, ref_img, args.fidelity)
            if res["pass"]:
                if probe != target:
                    os.replace(probe, target)
                print(f"  ✓ {name} (tentativo {attempt + 1}, fedeltà {res['fidelity']})")
                report.append({"screen": name, "status": "ok", "fidelity": res["fidelity"]})
                return True
            codes = ", ".join(str(i.get("code") or i.get("type")) for i in res["issues"] if i.get("severity") == "blocker")
            print(f"  ✗ {name} tentativo {attempt + 1}: {codes or 'qa'} (fedeltà {res['fidelity']})")
            if attempt < args.retries:
                prompt = build_prompt(spec, args.brand, args.sector) + f"\nCORREZIONI OBBLIGATORIE: {res['retry_hint']}."
            else:
                if probe == target and os.path.exists(target):
                    os.replace(target, os.path.join(rej_dir, name))
                report.append({"screen": name, "status": "rejected", "issues": res["issues"]})
        print(f"  → {name} scartato: non entra nel catalogo")
        return False

    jobs = list(enumerate(specs))
    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        ok = sum(1 for r in pool.map(run, jobs) if r)
    if not args.dry_run:
        json.dump({"slug": args.slug, "brand": args.brand, "sector": args.sector,
                   "ok": ok, "total": len(jobs), "items": report},
                  open(os.path.join(out_dir, "qa-report.json"), "w"), indent=1, ensure_ascii=False)
    print(f"\n{ok}/{len(jobs)} schermate conformi")
    return 0 if ok == len(jobs) else 2


if __name__ == "__main__":
    sys.exit(main())
