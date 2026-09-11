#!/usr/bin/env python3
"""
QA per schermate FULL-BLEED (solo contenuto dello schermo, senza cornice telefono).

I gate storici (`mockup-frame-qa.py`) validano l'inquadratura di un telefono dentro
una scena: su una schermata pura darebbero falsi negativi. Qui si controlla:

  1. proporzione verticale da iPhone (9:19.5 circa)
  2. assenza di cornice/telefono disegnato dentro l'immagine (no phone-in-phone)
  3. testo tagliato dai bordi (destra tollerata: i caroselli sconfinano di proposito)
  4. troncamenti espliciti (… / ...)
  5. densità di UI reale e lessico italiano senza placeholder

Uso:
  python scripts/screen-qa.py img1.png img2.png
"""
from __future__ import annotations

import json
import os
import sys
from importlib.machinery import SourceFileLoader

from PIL import Image, ImageOps, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
base = SourceFileLoader("mockup_qa", os.path.join(HERE, "mockup-qa.py")).load_module()

ASPECT_MIN, ASPECT_MAX = 0.40, 0.56
BORDER_TOUCH_PX = 2
RIGHT_BLEED_TOLERANCE = 4          # parole tollerate a filo destro (caroselli)
RING_INK_FRAMED = 0.006            # ring esterno quasi privo di ink = cornice/canvas


def _ring_ink(edges: Image.Image, W: int, H: int) -> float:
    ring = min(max(int(min(W, H) * 0.006), 3), 12)
    return max(
        base._band_ink_ratio(edges, (0, 0, W, ring)),
        base._band_ink_ratio(edges, (0, H - ring, W, H)),
        base._band_ink_ratio(edges, (0, 0, ring, H)),
        base._band_ink_ratio(edges, (W - ring, 0, W, H)),
    )


def validate_screen(path: str) -> dict:
    try:
        img = Image.open(path).convert("RGB")
    except Exception as err:
        return {"path": path, "pass": False, "issues": [
            {"type": "unreadable_file", "severity": "blocker", "detail": str(err)}], "retry_hint": None}

    W, H = img.size
    issues: list[dict] = []
    edges = ImageOps.grayscale(img).filter(ImageFilter.FIND_EDGES)

    # 1. proporzione
    aspect = W / H
    if not (ASPECT_MIN <= aspect <= ASPECT_MAX):
        issues.append({"type": "aspect", "severity": "blocker",
                       "detail": f"proporzione {aspect:.3f} fuori range verticale iPhone"})

    # 2. cornice disegnata dentro l'immagine
    if _ring_ink(edges, W, H) < RING_INK_FRAMED:
        issues.append({"type": "frame_present", "severity": "blocker",
                       "detail": "bordi senza contenuto: sembra un telefono dentro una scena, non una schermata piena"})

    # 3/4. testo tagliato e troncato
    work = img if W <= base.ANALYSIS_WIDTH else img.resize(
        (base.ANALYSIS_WIDTH, int(H * base.ANALYSIS_WIDTH / W)), Image.LANCZOS)
    words = base._ocr_words(work)
    w2, h2 = work.size
    right_bleed = 0
    for w in words:
        right, bottom = w["left"] + w["width"], w["top"] + w["height"]
        label = w["text"][:32]
        if w["left"] <= BORDER_TOUCH_PX or w["top"] <= BORDER_TOUCH_PX or bottom >= h2 - BORDER_TOUCH_PX:
            issues.append({"type": "text_clipped_by_canvas", "severity": "blocker",
                           "detail": f"«{label}» tagliato dal bordo"})
        elif right >= w2 - BORDER_TOUCH_PX:
            right_bleed += 1
        if any(m in w["text"] for m in base.TRUNCATION_MARKERS):
            issues.append({"type": "text_truncated", "severity": "blocker",
                           "detail": f"marcatore di troncamento in «{label}»"})
    if right_bleed > RIGHT_BLEED_TOLERANCE:
        issues.append({"type": "right_edge_overflow", "severity": "blocker",
                       "detail": f"{right_bleed} parole tagliate sul bordo destro"})

    # 5. densità e lessico
    issues += base._check_density(words, w2, h2)
    issues += base._check_lexicon(words)

    blockers = [i for i in issues if i["severity"] == "blocker"]
    hints = {
        "aspect": "resa verticale 9:19.5, solo il contenuto dello schermo",
        "frame_present": "nessuna cornice di telefono: riempi tutta l'immagine con la sola interfaccia",
        "text_clipped_by_canvas": "nessun testo a contatto con i bordi: rientra tutti i testi",
        "right_edge_overflow": "nessun testo tagliato a destra: chiudi le card dentro la larghezza",
        "text_truncated": "nessun testo troncato con i puntini: accorcia le etichette",
        "low_ui_density": "più elementi di interfaccia reali: liste, prezzi, etichette, tab bar",
        "placeholder_text": "nessun testo segnaposto: usa contenuti italiani reali",
        "not_italian_copy": "tutti i testi in italiano",
    }
    return {
        "path": path, "pass": not blockers, "aspect": round(aspect, 3),
        "issues": issues,
        "retry_hint": " · ".join(dict.fromkeys(hints.get(i["type"], "") for i in blockers if hints.get(i["type"]))) or None,
    }


def main() -> int:
    paths = sys.argv[1:]
    if not paths:
        print(__doc__)
        return 1
    out = [validate_screen(p) for p in paths]
    print(json.dumps(out, indent=1, ensure_ascii=False))
    return 0 if all(r["pass"] for r in out) else 2


if __name__ == "__main__":
    sys.exit(main())
