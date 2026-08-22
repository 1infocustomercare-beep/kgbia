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


def _subject_mask(img: Image.Image) -> np.ndarray:
    """Maschera del soggetto = pixel che differiscono dal fondo (campionato ai bordi)."""
    a = np.asarray(img, dtype=np.float32)
    H, W, _ = a.shape
    k = max(4, min(H, W) // 40)
    corners = np.concatenate([
        a[:k, :k].reshape(-1, 3), a[:k, -k:].reshape(-1, 3),
        a[-k:, :k].reshape(-1, 3), a[-k:, -k:].reshape(-1, 3),
    ])
    bg = np.median(corners, axis=0)
    dist = np.sqrt(((a - bg) ** 2).sum(axis=2))
    return dist > 42.0


def _blobs(mask: np.ndarray) -> list[dict]:
    from scipy import ndimage
    filled = ndimage.binary_closing(mask, structure=np.ones((7, 7)))
    filled = ndimage.binary_fill_holes(filled)
    labels, n = ndimage.label(filled)
    out = []
    H, W = mask.shape
    for idx, sl in enumerate(ndimage.find_objects(labels), start=1):
        ys, xs = sl
        area = int((labels[sl] == idx).sum())
        if area < 0.01 * H * W:
            continue
        out.append({
            "x0": int(xs.start), "x1": int(xs.stop - 1),
            "y0": int(ys.start), "y1": int(ys.stop - 1),
            "area": area,
        })
    out.sort(key=lambda b: -b["area"])
    return out


def _smooth(v: np.ndarray, k: int) -> np.ndarray:
    k = max(3, k | 1)
    kernel = np.ones(k, dtype=np.float32) / k
    return np.convolve(v, kernel, mode="same")


def _phone_box_by_edges(img: Image.Image) -> dict:
    """Fallback per scene full-bleed (marmo, brace, fondo scuro): il soggetto non
    si separa dal fondo, quindi il corpo del telefono viene individuato dai picchi
    di energia dei bordi verticali/orizzontali (telefono frontale, assi allineati)."""
    e = _edges(img)
    H, W = e.shape
    col = _smooth(e.mean(axis=0), max(3, W // 90))
    row = _smooth(e.mean(axis=1), max(3, H // 90))
    lo_x, hi_x = int(W * 0.02), int(W * 0.45)
    lo_y, hi_y = int(H * 0.02), int(H * 0.40)
    x0 = lo_x + int(np.argmax(col[lo_x:hi_x]))
    x1 = int(W - 1 - hi_x) + int(np.argmax(col[W - 1 - hi_x:W - lo_x])) if hi_x < W else W - 1
    y0 = lo_y + int(np.argmax(row[lo_y:hi_y]))
    y1 = int(H - 1 - hi_y) + int(np.argmax(row[H - 1 - hi_y:H - lo_y])) if hi_y < H else H - 1
    return {"x0": x0, "x1": max(x0 + 1, x1), "y0": y0, "y1": max(y0 + 1, y1),
            "area": (x1 - x0) * (y1 - y0)}


def _phone_box(img: Image.Image) -> tuple[dict, list[dict]]:
    mask = _subject_mask(img)
    H, W = mask.shape
    blobs = _blobs(mask)
    if not blobs:
        box = _phone_box_by_edges(img)
    else:
        box = blobs[0]
        bw = max(1, box["x1"] - box["x0"]); bh = max(1, box["y1"] - box["y0"])
        too_wide = not (ASPECT_MIN <= bw / bh <= ASPECT_MAX)
        if box["area"] > 0.40 * H * W and too_wide:
            # scena full-bleed: il blob principale è tutta l'immagine → usa i bordi
            box = _phone_box_by_edges(img)

    box.update({"W": W, "H": H,
                "w": max(1, box["x1"] - box["x0"]),
                "h": max(1, box["y1"] - box["y0"])})
    return box, blobs



def _tilt_deg(mask: np.ndarray, box: dict) -> float:
    ys, xs = [], []
    y_start = box["y0"] + int(box["h"] * 0.2)
    y_end = box["y0"] + int(box["h"] * 0.8)
    for y in range(y_start, max(y_start + 1, y_end)):
        row = np.where(mask[y, box["x0"]:box["x1"] + 1])[0]
        if row.size:
            ys.append(y)
            xs.append(row[0])
    if len(ys) < 20:
        return 0.0
    slope = np.polyfit(np.array(ys, dtype=np.float32), np.array(xs, dtype=np.float32), 1)[0]
    return float(abs(np.degrees(np.arctan(slope))))


def _scene_ink(edges: np.ndarray, box: dict) -> float:
    mask = np.ones_like(edges, dtype=bool)
    pad_x = int(box["w"] * 0.04)
    pad_y = int(box["h"] * 0.04)
    mask[max(0, box["y0"] - pad_y):box["y1"] + 1 + pad_y,
         max(0, box["x0"] - pad_x):box["x1"] + 1 + pad_x] = False
    outside = edges[mask]
    if outside.size == 0:
        return 0.0
    return float((outside > 70).mean())


def _nested_count(blobs: list[dict], box: dict) -> int:
    """Numero di ulteriori blob con proporzioni da telefono (secondo telefono in scena)."""
    n = 0
    for b in blobs[1:]:
        w = max(1, b["x1"] - b["x0"]); h = max(1, b["y1"] - b["y0"])
        if b["area"] < 0.05 * box["W"] * box["H"]:
            continue
        if ASPECT_MIN <= w / h <= ASPECT_MAX:
            n += 1
    return n


def validate_frame(path: str) -> dict:
    img = _load(path)
    e = _edges(img)
    box, blobs = _phone_box(img)
    mask = _subject_mask(img)
    W, H = box["W"], box["H"]

    tilt = _tilt_deg(mask, box)
    ml, mr = box["x0"] / W, (W - 1 - box["x1"]) / W
    mt, mb = box["y0"] / H, (H - 1 - box["y1"]) / H
    aspect = box["w"] / box["h"]
    scene = _scene_ink(e, box)
    nested = _nested_count(blobs, box)
    portrait = H >= W

    issues: list[dict] = []
    add = lambda code, sev, msg: issues.append({"code": code, "severity": sev, "message": msg})

    if not portrait:
        add("landscape", "blocker", f"immagine orizzontale {W}x{H}: serve formato verticale 3:4")
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
    if nested > 0:
        add("nested-phone", "blocker", f"{nested} telefono/i aggiuntivo/i in scena")

    blockers = [i for i in issues if i["severity"] == "blocker"]
    hints = {
        "landscape": "immagine verticale formato ritratto 3:4",
        "tilt": "iPhone perfettamente frontale e verticale, zero rotazione e zero prospettiva",
        "clipped": "inquadra il telefono intero con margine libero su tutti i lati",
        "asymmetry": "vista ortogonale centrata, margini laterali identici",
        "aspect": "un solo iPhone 17 Pro Max in proporzioni reali (circa 1:2.16)",
        "outside-ui": "TUTTA la UI dentro il display: nessun riquadro, badge o testo nella scena",
        "nested-phone": "un solo telefono nell'immagine, nessuna cornice di telefono dentro lo schermo",
    }
    return {
        "file": path,
        "pass": not blockers,
        "tilt_deg": round(tilt, 2),
        "aspect": round(aspect, 3),
        "margins": {"l": round(ml, 3), "r": round(mr, 3), "t": round(mt, 3), "b": round(mb, 3)},
        "scene_ink": round(scene, 4),
        "nested": nested,
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
