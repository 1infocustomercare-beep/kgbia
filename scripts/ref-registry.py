#!/usr/bin/env python3
"""
Registro degli stili da ricostruire: settore, brand italiano inventato,
punteggio di qualità del set e sequenza di schermate (mobile + desktop).

Il registro è la fonte unica per la generazione a lotti e per il catalogo
dell'app. Nessuna immagine viene generata qui.

Uso:
  python scripts/ref-registry.py                # scrive /tmp/reference/registry.json
  python scripts/ref-registry.py --sector food  # stampa solo un settore
"""
from __future__ import annotations

import unicodedata
import argparse, json, os

REF = "/tmp/reference"

# slug di riferimento → (settore, brand italiano inventato, etichetta stile)
CATALOG: dict[str, tuple[str, str, str]] = {
    "flame-kebab":                    ("food", "Brace d'Anatolia", "Griglia notturna"),
    "strapizzami":                    ("food", "Napoli Slice", "Pizzeria da asporto"),
    "orygano-pizzeria-gourmet":       ("food", "Origano Reale", "Pizzeria gourmet"),
    "paperfish-sushi":                ("food", "Kaido Sushi", "Sushi notturno"),
    "otomaki-sushi":                  ("food", "Onda Maki", "Sushi minimal"),
    "pokewaii-brescia":               ("food", "Poke Riviera", "Poke tropicale"),
    "batey-cevicheria-urbana":        ("food", "Pacifico Ceviche", "Cevicheria urbana"),
    "la-vang-vietnamese-luxury":      ("food", "Loto d'Oriente", "Asiatico luxury"),
    "meraki-greek-bistro":            ("food", "Egeo Bistrot", "Bistrot greco"),
    "midtown-kosher":                 ("food", "Bottega Levante", "Deli metropolitano"),
    "cote-miami":                     ("food", "Riviera Côte", "Fine dining costiero"),
    "la-patrona":                     ("food", "Tacos Reales", "Cantina messicana"),
    "tiramistu":                      ("food", "Dolce Cucchiaio", "Pasticceria dessert"),
    "papagua":                        ("food", "Agua Verde", "Bar tropicale"),
    "alma-regina-relais-5-styles":    ("hospitality", "Palazzo Novecento", "Relais 5 stili"),
    "dimora-milano":                  ("hospitality", "Dimora Ambrosiana", "Residenza urbana"),
    "asinara-charter":                ("nautica", "Cala Corallo Charter", "Charter mediterraneo"),
    "miami-boats-rental":             ("nautica", "Riviera Boats", "Noleggio barche"),
    "miami-watersports":              ("nautica", "Onda Sport", "Sport acquatici"),
    "aura-milano-spa":                ("beauty", "Aura Terme Milano", "Spa urbana"),
    "aura-concept-store":             ("retail", "Aura Concept", "Concept store"),
    "neo-nails-brickell":             ("beauty", "Nails Atelier", "Nail studio"),
    "tatush-hair-fragrance":          ("beauty", "Chioma Nera", "Hair & fragranze"),
    "six-brothers-selfcut":           ("beauty", "Sei Fratelli Barber", "Barber shop"),
    "luxury-car-wash":                ("auto", "Lustro Detailing", "Detailing luxury"),
    "luxdrive-car-rental":            ("auto", "Aurelia Drive", "Noleggio luxury"),
    "meridia-rental-car":             ("auto", "Meridia Rent", "Autonoleggio"),
    "prato-noleggi":                  ("auto", "Noleggi Toscani", "Noleggio veicoli"),
    "far-medical-solutions":          ("medical", "Aurora Medical", "Poliambulatorio"),
    "annalisa-longobardi-dental-app": ("medical", "Studio Sorriso", "Dentista app"),
    "dental-masters-admin-suite":     ("medical", "Sorriso Suite", "Gestionale dentale"),
    "gestionale-studio-longobardi":   ("medical", "Studio Sereno", "Gestionale studio"),
    "pawcare":                        ("pet", "Casa Zampa", "Cura animali"),
    "pawparadise":                    ("pet", "Zampe Felici", "Pet resort"),
    "aloha-pet-resorts":              ("pet", "Oasi Zampe", "Pet resort luxury"),
    "little-diamond-nursery":         ("kids", "Bimbo Sole", "Nido d'infanzia"),
    "little-stars-daycare":           ("kids", "Stelline Asilo", "Asilo"),
    "ashleys-playhouse":              ("kids", "Casa Gioco", "Ludoteca"),
    "texas-horse-ranch-5-styles":     ("sport", "Maneggio Aurora", "Ranch 5 stili"),
    "city-padel-milano":              ("sport", "Padel Club Milano", "Club padel"),
    "reformer-pilates":               ("sport", "Prana Studio", "Pilates reformer"),
    "topgolf-bay-app":                ("sport", "Green Bay Golf", "Golf app"),
    "bmp-piscine":                    ("casa", "Piscine Aurora", "Piscine"),
    "dr-costruzioni":                 ("casa", "Costruzioni Doria", "Impresa costruzioni"),
    "edil-prato-sito":                ("casa", "Edil Toscana", "Edilizia sito"),
    "edil-prato-gestionale":          ("casa", "Edil Toscana Suite", "Edilizia gestionale"),
    "edilprogress-matera":            ("casa", "Edil Progresso", "Edilizia lucana"),
    "arredissima":                    ("casa", "Arredo Bellini", "Arredamento"),
    "domus-clima":                    ("impianti", "Domus Clima Italia", "Climatizzazione"),
    "green-system-sito-web":          ("impianti", "Verde Sistemi", "Energie rinnovabili"),
    "termoacciai-sito":               ("impianti", "Termo Acciai", "Termoidraulica sito"),
    "termoacciai-matera":             ("impianti", "Termo Acciai Suite", "Termoidraulica gestionale"),
    "studio-elettro-impianti":        ("impianti", "Elettro Studio", "Impianti elettrici"),
    "idraulica-carrieri":             ("impianti", "Idraulica Carrera", "Idraulica"),
    "nicks-plumbing-ac":              ("impianti", "Pronto Idraulico", "Idraulica H24"),
    "cleanfox-delta":                 ("servizi", "Pulizie Delta", "Impresa pulizie"),
    "agarty-atelier-digitale":        ("servizi", "Atelier Digitale", "Agenzia digitale"),
    "associard-le-convenzioni":       ("servizi", "Convenzioni Italia", "Convenzioni soci"),
    "gold-vento-real-estate":         ("immobiliare", "Vento d'Oro Immobili", "Immobiliare luxury"),
    "mmi-resident-hub":               ("immobiliare", "Residenza Hub", "Portale residenti"),
    "voceai-voice-agent":             ("servizi", "Voce Viva", "Agente vocale"),
}

SECTOR_ORDER = ["food", "hospitality", "beauty", "medical", "pet", "sport", "kids",
                "auto", "nautica", "casa", "impianti", "retail", "servizi", "immobiliare"]


def brand_folder(brand: str) -> str:
    brand = "".join(c for c in unicodedata.normalize("NFKD", brand) if not unicodedata.combining(c))
    keep = [c.lower() if (c.isalnum() and c.isascii()) else "-" for c in brand]
    slug = "".join(keep)
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug.strip("-")


def score(items: list[dict], specs: list[dict]) -> dict:
    """Punteggio 0-100: completezza sequenza, varietà di funzioni, schede disponibili."""
    mobile = [i for i in items if i["kind"] == "phone"]
    desktop = [i for i in items if i["kind"] != "phone"]
    funcs = {s.get("screen_function") for s in specs if s.get("screen_function")}
    completeness = min(len(mobile) / 6, 1.0) * 40 + min(len(desktop) / 4, 1.0) * 20
    variety = min(len(funcs) / 6, 1.0) * 25
    documented = (len(specs) / max(len(items), 1)) * 15
    total = round(completeness + variety + documented)
    tier = "forte" if total >= 70 else ("medio" if total >= 45 else "debole")
    return {"score": total, "tier": tier, "functions": sorted(f for f in funcs if f)}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sector")
    args = ap.parse_args()

    inv = json.load(open(f"{REF}/inventory.json"))
    spec_dir = f"{REF}/specs"
    registry: dict[str, dict] = {}

    for slug, items in inv.items():
        if slug not in CATALOG:
            continue
        sector, brand, style = CATALOG[slug]
        specs = []
        for it in items:
            base = os.path.basename(it["file"]).rsplit(".", 1)[0]
            p = f"{spec_dir}/{slug}__{base}.json"
            if os.path.exists(p):
                try:
                    s = json.load(open(p))
                    s["_file"] = it["file"]
                    s["_kind"] = s.get("_kind", it["kind"])
                    specs.append(s)
                except Exception:
                    pass
        registry[slug] = {
            "slug": slug, "sector": sector, "brand": brand, "style": style,
            "folder": f"{sector}/{brand_folder(brand)}",
            "mobile": [i["file"] for i in items if i["kind"] == "phone"],
            "desktop": [i["file"] for i in items if i["kind"] != "phone"],
            "quality": score(items, specs),
        }

    json.dump(registry, open(f"{REF}/registry.json", "w"), indent=1, ensure_ascii=False)

    rows = [r for r in registry.values() if not args.sector or r["sector"] == args.sector]
    rows.sort(key=lambda r: (SECTOR_ORDER.index(r["sector"]) if r["sector"] in SECTOR_ORDER else 99, -r["quality"]["score"]))
    for r in rows:
        q = r["quality"]
        print(f"{r['sector']:12s} {r['brand']:24s} {q['score']:3d} {q['tier']:6s} "
              f"mob={len(r['mobile']):2d} desk={len(r['desktop']):2d}  {r['style']}")
    tot_m = sum(len(r["mobile"]) for r in rows)
    tot_d = sum(len(r["desktop"]) for r in rows)
    print(f"\n{len(rows)} stili · {tot_m} schermate mobile · {tot_d} desktop → {REF}/registry.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
