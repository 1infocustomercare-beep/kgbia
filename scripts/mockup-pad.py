#!/usr/bin/env python3
"""
Normalizza il margine di scena PRIMA del gate QA.

I generatori consegnano spesso il telefono a filo del bordo superiore/inferiore:
il gate `mockup-frame-qa.py` lo marca come "clipped". Questo passaggio aggiunge
un margine bianco uniforme (default 6% dell'altezza) senza toccare i pixel della
UI, così l'inquadratura rispetta il contratto "telefono interamente dentro
l'inquadratura con margine libero su tutti i lati".

Uso:
  python scripts/mockup-pad.py /tmp/mockups/wave-food-a [--ratio 0.06]
"""

from __future__ import annotations

import argparse
import glob
import os

from PIL import Image


def pad_image(path: str, ratio: float) -> tuple[int, int]:
    im = Image.open(path).convert("RGB")
    w, h = im.size
    pad = max(8, int(h * ratio))
    canvas = Image.new("RGB", (w + 2 * pad, h + 2 * pad), (255, 255, 255))
    canvas.paste(im, (pad, pad))
    canvas.save(path)
    return canvas.size


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("src", help="cartella con i PNG generati")
    ap.add_argument("--ratio", type=float, default=0.06)
    args = ap.parse_args()

    files = sorted(glob.glob(os.path.join(args.src, "*.png")))
    if not files:
        print("nessun PNG da normalizzare")
        return 0
    for f in files:
        size = pad_image(f, args.ratio)
        print(f"pad → {os.path.basename(f)} {size[0]}x{size[1]}")
    print(f"{len(files)} immagini normalizzate (margine {args.ratio:.0%})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
