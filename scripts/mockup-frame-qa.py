#!/usr/bin/env python3
"""
Mockup FRAME QA — verifica automatica dell'inquadratura, PRIMA di accettare
un mockup e prima di generare le schermate successive.

Controlli (blocker):
  1. FRONTALITA'   → il telefono deve essere perfettamente verticale/frontale
                     (rotazione dei bordi < MAX_TILT_DEG, larghezze simmetriche)
  2. CONTENIMENTO  → il corpo del telefono interamente dentro il canvas con
                     margine libero su tutti i 4 lati
  3. FUORI DISPLAY → nessun elemento UI (testo/riquadri ad alto contrasto) nella
                     scena attorno al telefono e nessuna cornice extra
  4. PROPORZIONI   → aspect ratio del corpo coerente con un iPhone Pro Max
  5. NO NESTING    → nessun secondo telefono / cornice dentro il display

Uso:
  python scripts/mockup-frame-qa.py out/food-home.png            # report
  python scripts/mockup-frame-qa.py --gate out/                   # exit 1 se fallisce
  python scripts/mockup-frame-qa.py --json report.json out/

Come libreria (usato dal runner di generazione):
  from importlib.machinery import SourceFileLoader
  fq = SourceFileLoader("frame_qa", "scripts/mockup-frame-qa.py").load_module()
  res = fq.validate_frame("/tmp/probe/food-1.png")
  if not res["pass"]: regenerate(res["retry_hint"])
"""

from __future__ import annotations

import argparse
import json
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

MAX_TILT_DEG = 1.6          # rotazione massima tollerata del corpo telefono
MIN_MARGIN_RATIO = 0.015    # margine libero minimo per lato (frazione del lato)
ASPECT_MIN, ASPECT_MAX = 0.40, 0.56   # w/h del corpo telefono
SIDE_SYMMETRY_MAX = 0.045   # differenza max tra margine sx e dx (frazione larghezza)
SCENE_INK_MAX = 0.030       # ink ad alto contrasto ammesso nella scena esterna
NESTED_EDGE_MAX = 0.055     # densità di bordo verticale continua = telefono annidato
ANALYSIS_W = 720


def _load(path: str) -> Image.Image:
    img = Image.open(path).convert("RGB")
    if img.width > ANALYSIS_W:
        img = img.resize((ANALYSIS_W, max(1, round(img.height * ANALYSIS_W / img.width))), Image.LANCZOS)
    return img


def _edges(img: Image.Image) -> np.ndarray:
    g = img.convert("L").filter(ImageFilter.GaussianBlur(0.6))
    e = np.asarray(g.filter(ImageFilter.FIND_EDGES), dtype=np.float32)
    return e


def _phone_box(edges: np.ndarray) -> dict:
    """Bounding box del soggetto principale (corpo telefono) via energia di bordo."""
    H, W = edges.shape
    ink = edges > 28
    col = ink.mean(axis=0)
    row = ink.mean(axis=1)

    def span(profile: np.ndarray, floor: float) -> tuple[int, int]:
        idx = np.where(profile > floor)[0]
        if idx.size == 0:
            return 0, len(profile) - 1
        return int(idx[0]), int(idx[-1])

    x0, x1 = span(col, max(0.02, col.max() * 0.16))
    y0, y1 = span(row, max(0.02, row.max() * 0.16))
    return {"x0": x0, "x1": x1, "y0": y0, "y1": y1, "W": W, "H": H,
            "w": max(1, x1 - x0), "h": max(1, y1 - y0)}


def _tilt_deg(edges: np.ndarray, box: dict) -> float:
    """Stima rotazione: per ogni riga trova il bordo sinistro del corpo e fitta una retta."""
    ink = edges > 28
    ys, xs = [], []
    y_start = box["y0"] + int(box["h"] * 0.15)
    y_end = box["y0"] + int(box["h"] * 0.85)
    for y in range(y_start, max(y_start + 1, y_end)):
        row = np.where(ink[y, box["x0"]:box["x1"] + 1])[0]
        if row.size:
            ys.append(y)
            xs.append(row[0])
    if len(ys) < 20:
        return 0.0
    slope = np.polyfit(np.array(ys, dtype=np.float32), np.array(xs, dtype=np.float32), 1)[0]
    return float(abs(np.degrees(np.arctan(slope))))


def _scene_ink(edges: np.ndarray, box: dict) -> float:
    """Ink ad alto contrasto fuori dal corpo telefono (elementi UI fuori dal display)."""
    mask = np.ones_like(edges, dtype=bool)
    mask[box["y0"]:box["y1"] + 1, box["x0"]:box["x1"] + 1] = False
    outside = edges[mask]
    if outside.size == 0:
        return 0.0
    return float((outside > 60).mean())


def _nested_frame(edges: np.ndarray, box: dict) -> float:
    """Cerca un secondo bordo verticale continuo dentro il display (telefono nel telefono)."""
    inner_x0 = box["x0"] + int(box["w"] * 0.10)
    inner_x1 = box["x1"] - int(box["w"] * 0.10)
    inner_y0 = box["y0"] + int(box["h"] * 0.12)
    inner_y1 = box["y1"] - int(box["h"] * 0.12)
    if inner_x1 <= inner_x0 or inner_y1 <= inner_y0:
        return 0.0
    region = edges[inner_y0:inner_y1, inner_x0:inner_x1] > 55
    colwise = region.mean(axis=0)
    # un telefono annidato produce 2 colonne quasi piene di bordo
    strong = np.sort(colwise)[-2:]
    return float(strong.min()) if strong.size == 2 else 0.0


def validate_frame(path: str) -> dict:
    img = _load(path)
    e = _edges(img)
    box = _phone_box(e)
    W, H = box["W"], box["H"]

    tilt = _tilt_deg(e, box)
    ml, mr = box["x0"] / W, (W - 1 - box["x1"]) / W
    mt, mb = box["y0"] / H, (H - 1 - box["y1"]) / H
    aspect = box["w"] / box["h"]
    scene = _scene_ink(e, box)
    nested = _nested_frame(e, box)

    issues: list[dict] = []
    add = lambda code, sev, msg: issues.append({"code": code, "severity": sev, "message": msg})

    if tilt > MAX_TILT_DEG:
        add("tilt", "blocker", f"telefono ruotato di ~{tilt:.1f}° (max {MAX_TILT_DEG}°)")
    if min(ml, mr, mt, mb) < MIN_MARGIN_RATIO:
        add("clipped", "blocker", f"telefono a filo/tagliato dal bordo (margini l{ml:.3f} r{mr:.3f} t{mt:.3f} b{mb:.3f})")
    if abs(ml - mr) > SIDE_SYMMETRY_MAX:
        add("asymmetry", "warning", f"margini laterali asimmetrici ({ml:.3f} vs {mr:.3f}) → possibile prospettiva")
    if not (ASPECT_MIN <= aspect <= ASPECT_MAX):
        add("aspect", "blocker", f"proporzioni corpo non da iPhone Pro Max (w/h {aspect:.2f})")
    if scene > SCENE_INK_MAX:
        add("outside-ui", "blocker", f"elementi grafici/testo fuori dal display (ink scena {scene:.3f})")
    if nested > NESTED_EDGE_MAX:
        add("nested-phone", "blocker", f"cornice/telefono annidato dentro il display ({nested:.3f})")

    blockers = [i for i in issues if i["severity"] == "blocker"]
    hints = {
        "tilt": "iPhone perfettamente frontale e verticale, zero rotazione e zero prospettiva",
        "clipped": "inquadra il telefono intero con margine libero su tutti i lati",
        "asymmetry": "vista ortogonale centrata, margini laterali identici",
        "aspect": "un solo iPhone 17 Pro Max in proporzioni reali (circa 1:2.16)",
        "outside-ui": "TUTTA la UI dentro il display: nessun riquadro, badge o testo nella scena",
        "nested-phone": "nessuna cornice di telefono dentro lo schermo, solo la UI",
    }
    return {
        "file": path,
        "pass": not blockers,
        "tilt_deg": round(tilt, 2),
        "aspect": round(aspect, 3),
        "margins": {"l": round(ml, 3), "r": round(mr, 3), "t": round(mt, 3), "b": round(mb, 3)},
        "scene_ink": round(scene, 4),
        "nested": round(nested, 4),
        "issues": issues,
        "retry_hint": " · ".join(hints[i["code"]] for i in blockers) or None,
    }


def validate_all(paths: list[str]) -> list[dict]:
    files: list[str] = []
    for p in paths:
        if os.path.isdir(p):
            for root, _, names in os.walk(p):
                files += [os.path.join(root, n) for n in sorted(names)
                          if n.lower().endswith((".png", ".jpg", ".jpeg", ".webp"))]
        else:
            files.append(p)
    return [validate_frame(f) for f in files]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("paths", nargs="+")
    ap.add_argument("--gate", action="store_true", help="exit 1 se un mockup fallisce")
    ap.add_argument("--json", dest="json_out")
    args = ap.parse_args()

    results = validate_all(args.paths)
    failed = 0
    for r in results:
        flag = "OK  " if r["pass"] else "FAIL"
        print(f"{flag} {os.path.basename(r['file'])}  tilt={r['tilt_deg']}° aspect={r['aspect']} "
              f"scena={r['scene_ink']} margini={r['margins']}")
        for i in r["issues"]:
            print(f"      [{i['severity']}] {i['code']}: {i['message']}")
        if not r["pass"]:
            failed += 1

    print(f"\n{len(results) - failed}/{len(results)} mockup conformi all'inquadratura")
    if args.json_out:
        with open(args.json_out, "w") as f:
            json.dump(results, f, indent=2)
    return 1 if (args.gate and failed) else 0


if __name__ == "__main__":
    sys.exit(main())
