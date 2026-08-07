#!/usr/bin/env python3
"""
Mockup QA — controllo automatico qualità schermate mockup.

Verifica, PRIMA di spendere altri crediti AI, che ogni schermata generata sia:
  1. senza TESTO TRONCATO  (ellissi "…"/"...", parole tagliate al bordo, OCR a bassa confidenza sul bordo)
  2. senza OVERFLOW        (contenuto che tocca / esce dai bordi immagine, righe che continuano oltre il canvas)
  3. senza DECORI FUORI SAFE AREA (ink ad alto contrasto nelle bande di margine)
  4. con TIPOGRAFIA LEGGIBILE (altezza minima glifi, testo non gigante da poster)

Uso:
  # valida una cartella (ricorsivo) e stampa il report
  python scripts/mockup-qa.py src/assets/mockups/portfolio-lowengeld

  # valida singoli file
  python scripts/mockup-qa.py out/1-home.png out/2-menu.png

  # modalità GATE: exit 1 se una sola schermata fallisce (per bloccare la pipeline)
  python scripts/mockup-qa.py --gate out/

  # report JSON (per il runner di generazione)
  python scripts/mockup-qa.py --json report.json out/

Uso come libreria dentro il runner di generazione (prima di salvare / prima del batch):
  from importlib.machinery import SourceFileLoader
  qa = SourceFileLoader("mockup_qa", "scripts/mockup-qa.py").load_module()
  res = qa.validate_image("/tmp/probe/food-1.png")
  if not res["pass"]:
      # rigenera con retry_prompt invece di continuare a bruciare crediti
      print(res["issues"], res["retry_hint"])

Dipendenze: PIL, pytesseract (+ binario tesseract) — già presenti in sandbox.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys

from PIL import Image, ImageFilter, ImageOps

try:
    import pytesseract
    from pytesseract import Output as _TessOutput
except Exception:  # pragma: no cover
    pytesseract = None
    _TessOutput = None

# ---------------------------------------------------------------- soglie
# Tutte le soglie sono in PUNTI LOGICI (CSS px @1x) e vengono scalate sul DPR
# reale dell'immagine: un mockup iPhone Pro Max 1179x2556 ha dpr ≈ 3.

LOGICAL_WIDTH = 393             # iPhone 15/16 Pro Max in punti logici
SAFE_SIDE_PT = 14               # gutter laterale minimo
SAFE_TOP_PT = 12                # sopra: la status bar è contenuto legittimo
SAFE_BOTTOM_PT = 10             # sotto: home indicator / tab bar
FRAMED_SAFE_MARGIN_PT = 40      # mockup su canvas (telefono dentro sfondo): margine più severo

EDGE_INK_THRESHOLD = 40         # luminanza edge oltre cui il pixel è "ink"
BAND_INK_RATIO_MAX = 0.020      # ink max in una banda di margine (solo mockup su canvas)
RING_INK_RATIO_FRAMED = 0.006   # ink nel ring esterno sotto cui l'immagine è "su canvas"
BORDER_TOUCH_PX = 2             # distanza dal bordo = contenuto tagliato
MIN_GLYPH_PT = 7                # altezza minima box parola in punti logici
MAX_GLYPH_PT = 96               # oltre = titolo da poster, non da UI reale
OCR_CONF_MIN = 45               # confidenza OCR minima
OCR_LANGS = "ita+eng"
ANALYSIS_WIDTH = 786            # larghezza di analisi (2x): OCR rapido, soglie in pt invariate

TRUNCATION_MARKERS = ("…", "...", "‥")
WORD_RE = re.compile(r"[A-Za-zÀ-ÿ0-9€%.,'’&/+-]{2,}")



# ---------------------------------------------------------------- helpers

def _edge_map(img: Image.Image) -> Image.Image:
    """Mappa di contrasto locale: isola testo/bordi/decori dal background pieno."""
    gray = ImageOps.grayscale(img)
    return gray.filter(ImageFilter.FIND_EDGES)


def _band_ink_ratio(edges: Image.Image, box: tuple[int, int, int, int]) -> float:
    band = edges.crop(box)
    px = band.load()
    w, h = band.size
    if w <= 0 or h <= 0:
        return 0.0
    ink = 0
    step = 2  # sotto-campionamento: 4x più veloce, stessa sensibilità
    counted = 0
    for y in range(0, h, step):
        for x in range(0, w, step):
            counted += 1
            if px[x, y] >= EDGE_INK_THRESHOLD:
                ink += 1
    return ink / max(counted, 1)


def _ocr_words(img: Image.Image) -> list[dict]:
    if pytesseract is None:
        return []
    try:
        data = pytesseract.image_to_data(img, lang=OCR_LANGS, output_type=_TessOutput.DICT)
    except Exception:
        try:
            data = pytesseract.image_to_data(img, output_type=_TessOutput.DICT)
        except Exception:
            return []
    out = []
    n = len(data.get("text", []))
    for i in range(n):
        text = (data["text"][i] or "").strip()
        if not text:
            continue
        try:
            conf = float(data["conf"][i])
        except (TypeError, ValueError):
            conf = -1.0
        out.append({
            "text": text,
            "conf": conf,
            "left": int(data["left"][i]),
            "top": int(data["top"][i]),
            "width": int(data["width"][i]),
            "height": int(data["height"][i]),
        })
    return out


# ---------------------------------------------------------------- geometria

def _geometry(img: Image.Image, edges: Image.Image) -> dict:
    """Determina DPR, tipo di mockup (full-bleed vs su canvas) e safe area in px."""
    W, H = img.size
    dpr = max(W / LOGICAL_WIDTH, 1.0)

    # ring esterno di 6px: se è quasi privo di ink, il telefono è dentro un canvas
    ring = min(max(int(min(W, H) * 0.005), 3), 12)
    ring_ink = max(
        _band_ink_ratio(edges, (0, 0, W, ring)),
        _band_ink_ratio(edges, (0, H - ring, W, H)),
        _band_ink_ratio(edges, (0, 0, ring, H)),
        _band_ink_ratio(edges, (W - ring, 0, W, H)),
    )
    framed = ring_ink < RING_INK_RATIO_FRAMED

    if framed:
        m = int(FRAMED_SAFE_MARGIN_PT * dpr)
        safe = {"left": m, "right": m, "top": m, "bottom": m}
    else:
        safe = {
            "left": int(SAFE_SIDE_PT * dpr),
            "right": int(SAFE_SIDE_PT * dpr),
            "top": int(SAFE_TOP_PT * dpr),
            "bottom": int(SAFE_BOTTOM_PT * dpr),
        }
    return {"dpr": dpr, "framed": framed, "safe": safe, "ring_ink": ring_ink}


# ---------------------------------------------------------------- checks

def _check_safe_area(edges: Image.Image, W: int, H: int, geo: dict) -> list[dict]:
    """Decori fuori safe area. Ha senso solo sui mockup su canvas: in una
    schermata full-bleed il background arriva legittimamente ai bordi."""
    if not geo["framed"]:
        return []
    issues: list[dict] = []
    s = geo["safe"]
    bands = {
        "top": (0, 0, W, s["top"]),
        "bottom": (0, H - s["bottom"], W, H),
        "left": (0, 0, s["left"], H),
        "right": (W - s["right"], 0, W, H),
    }
    for name, box in bands.items():
        ratio = _band_ink_ratio(edges, box)
        if ratio > BAND_INK_RATIO_MAX:
            issues.append({
                "type": "decor_outside_safe_area",
                "severity": "blocker",
                "where": name,
                "detail": f"ink {ratio:.2%} nella banda {name} (max {BAND_INK_RATIO_MAX:.1%}) — decori/testo fuori safe area",
            })
    return issues


def _check_overflow_and_truncation(words: list[dict], W: int, H: int, geo: dict) -> list[dict]:
    issues: list[dict] = []
    s = geo["safe"]
    dpr = geo["dpr"]

    for w in words:
        right = w["left"] + w["width"]
        bottom = w["top"] + w["height"]
        label = w["text"][:32]
        pt = w["height"] / dpr
        # token spuri (punteggiatura, 1-2 caratteri) non sono testo valutabile
        meaningful = bool(WORD_RE.fullmatch(w["text"])) and len(w["text"]) >= 3

        # 1. contenuto tagliato dal bordo immagine
        if (w["left"] <= BORDER_TOUCH_PX or w["top"] <= BORDER_TOUCH_PX
                or right >= W - BORDER_TOUCH_PX or bottom >= H - BORDER_TOUCH_PX):
            issues.append({
                "type": "text_clipped_by_canvas",
                "severity": "blocker",
                "detail": f"«{label}» tocca il bordo immagine ({w['left']},{w['top']})-({right},{bottom})",
            })
        # 2. testo dentro la banda di safe area
        elif w["left"] < s["left"] or w["top"] < s["top"] or right > W - s["right"] or bottom > H - s["bottom"]:
            issues.append({
                "type": "text_outside_safe_area",
                "severity": "warning",
                "detail": f"«{label}» dentro il margine di safe area ({s['left']}/{s['top']}px)",
            })

        # 3. troncamento esplicito
        if any(m in w["text"] for m in TRUNCATION_MARKERS):
            issues.append({
                "type": "text_truncated",
                "severity": "blocker",
                "detail": f"marcatore di troncamento in «{label}»",
            })

        # 4. tipografia illeggibile / da poster
        if meaningful and pt < MIN_GLYPH_PT and w["conf"] >= OCR_CONF_MIN:
            issues.append({
                "type": "text_too_small",
                "severity": "warning",
                "detail": f"«{label}» alto {pt:.0f}pt logici — sotto il minimo leggibile ({MIN_GLYPH_PT}pt)",
            })
        elif meaningful and pt > MAX_GLYPH_PT:
            issues.append({
                "type": "text_poster_scale",
                "severity": "warning",
                "detail": f"«{label}» alto {pt:.0f}pt logici — scala da poster, non da UI reale",
            })

        # 5. parola illeggibile appiccicata al margine = quasi sempre glifo tagliato
        if meaningful and w["conf"] < OCR_CONF_MIN and (right > W - s["right"] or w["left"] < s["left"]):
            issues.append({
                "type": "text_unreadable_at_edge",
                "severity": "warning",
                "detail": f"«{label}» conf {w['conf']:.0f} a filo di margine — probabile glifo tagliato",
            })

    return issues



def _check_density(words: list[dict], W: int, H: int) -> list[dict]:
    """Una schermata app reale ha densità testuale: poche parole = mockup 'poster'."""
    readable = [w for w in words if w["conf"] >= OCR_CONF_MIN]
    if pytesseract is None:
        return [{"type": "ocr_unavailable", "severity": "warning", "detail": "pytesseract non disponibile: check testuali saltati"}]
    if len(readable) < 8:
        return [{
            "type": "low_ui_density",
            "severity": "warning",
            "detail": f"solo {len(readable)} parole leggibili — schermata poco densa per una webapp reale",
        }]
    return []


def _retry_hint(issues: list[dict]) -> str:
    kinds = {i["type"] for i in issues}
    hints = []
    if {"text_clipped_by_canvas", "text_outside_safe_area", "decor_outside_safe_area"} & kinds:
        hints.append("mantieni TUTTO il contenuto e i decori dentro un margine di 48px su ogni lato, niente elementi tagliati dal bordo")
    if "text_truncated" in kinds:
        hints.append("nessun testo troncato con puntini di sospensione: accorcia le stringhe invece di tagliarle")
    if "text_poster_scale" in kinds:
        hints.append("scala tipografica da app reale: hero max 64px, titoli 28-34px, body 16-18px")
    if "text_too_small" in kinds or "text_unreadable_at_edge" in kinds:
        hints.append("nessun testo sotto 14px, glifi completi e nitidi")
    if "low_ui_density" in kinds:
        hints.append("densità UI di produzione: status bar iOS, header, contenuto multi-riga, tab bar in basso")
    return " · ".join(hints)


# ---------------------------------------------------------------- API

def validate_image(path: str) -> dict:
    """Valida una singola schermata. Ritorna {pass, score, issues[], retry_hint}."""
    try:
        img = Image.open(path).convert("RGB")
    except Exception as err:
        return {
            "file": path, "pass": False, "score": 0,
            "issues": [{"type": "unreadable_file", "severity": "blocker", "detail": str(err)}],
            "retry_hint": "file immagine non leggibile: rigenera",
        }

    original_size = img.size
    # analisi su copia normalizzata a 2x: OCR molto più rapido, soglie in pt invariate
    if img.width > ANALYSIS_WIDTH:
        img = img.resize(
            (ANALYSIS_WIDTH, max(1, round(img.height * ANALYSIS_WIDTH / img.width))),
            Image.LANCZOS,
        )
    W, H = img.size

    edges = _edge_map(img)
    words = _ocr_words(img)
    geo = _geometry(img, edges)

    issues = []
    issues += _check_safe_area(edges, W, H, geo)
    issues += _check_overflow_and_truncation(words, W, H, geo)
    issues += _check_density(words, W, H)

    blockers = [i for i in issues if i["severity"] == "blocker"]
    warnings = [i for i in issues if i["severity"] != "blocker"]
    score = max(0, 100 - 25 * len(blockers) - min(30, 3 * len(warnings)))

    return {
        "file": path,
        "size": list(original_size),
        "mode": "canvas" if geo["framed"] else "full-bleed",
        "dpr": round(geo["dpr"], 2),
        "words": len(words),
        "pass": not blockers and score >= 70,
        "score": score,
        "blockers": len(blockers),
        "warnings": len(warnings),
        "issues": issues,
        "retry_hint": _retry_hint(issues),
    }



def validate_paths(paths: list[str]) -> list[dict]:
    files: list[str] = []
    for p in paths:
        if os.path.isdir(p):
            for root, _dirs, names in os.walk(p):
                for n in sorted(names):
                    if n.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                        files.append(os.path.join(root, n))
        elif os.path.isfile(p):
            files.append(p)
    return [validate_image(f) for f in sorted(files)]


# ---------------------------------------------------------------- CLI

def main() -> int:
    ap = argparse.ArgumentParser(description="QA automatico schermate mockup (troncamenti, overflow, safe area)")
    ap.add_argument("paths", nargs="+", help="file o cartelle da validare")
    ap.add_argument("--gate", action="store_true", help="exit 1 se almeno una schermata non passa")
    ap.add_argument("--json", dest="json_out", help="scrive il report JSON su file")
    ap.add_argument("--quiet", action="store_true", help="stampa solo le schermate che non passano")
    args = ap.parse_args()

    results = validate_paths(args.paths)
    if not results:
        print("nessuna immagine trovata")
        return 1

    failed = [r for r in results if not r["pass"]]
    for r in results:
        if args.quiet and r["pass"]:
            continue
        mark = "PASS" if r["pass"] else "FAIL"
        print(f"[{mark}] {r['score']:3d}  {r['file']}  ({r['words']} parole)")
        for i in r["issues"]:
            print(f"        - {i['severity']:8s} {i['type']}: {i['detail']}")
        if not r["pass"] and r["retry_hint"]:
            print(f"        → retry: {r['retry_hint']}")

    print(f"\n{len(results) - len(failed)}/{len(results)} schermate passano il QA")

    if args.json_out:
        with open(args.json_out, "w", encoding="utf-8") as fh:
            json.dump({"total": len(results), "failed": len(failed), "results": results}, fh, ensure_ascii=False, indent=2)
        print(f"report JSON → {args.json_out}")

    return 1 if (args.gate and failed) else 0


if __name__ == "__main__":
    sys.exit(main())
