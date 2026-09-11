#!/usr/bin/env python3
"""
Da immagine di riferimento a SCHEDA TECNICA scritta (dettaglio per dettaglio).

Per ogni schermata raccolta dal portfolio di riferimento produce un JSON con:
  funzione della schermata, tema, palette esatta, tipografia, geometria,
  struttura zona per zona, contenuti (etichette, cifre, numero di card),
  stile fotografico. La scheda è il prompt di ricostruzione.

Uso:
  python scripts/ref-describe.py --slug flame-kebab
  python scripts/ref-describe.py --all --workers 4
"""
from __future__ import annotations

import argparse, base64, json, os, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor

CHAT = "https://ai.gateway.lovable.dev/v1/chat/completions"
MODEL = os.environ.get("DESCRIBE_MODEL", "google/gemini-2.5-flash")
REF = "/tmp/reference"

ASK = """Analizza questa schermata di app mobile e restituisci SOLO JSON valido, senza commenti.

{
 "screen_function": "home|login|signup|catalog|detail|booking|order|payment|tracking|loyalty|profile|chat|schedule|team|report|map|gallery|review|quote|admin",
 "screen_title_it": "titolo breve in italiano",
 "theme": "dark|light",
 "palette": {"bg":"#hex","surface":"#hex","text":"#hex","muted":"#hex","accent":"#hex","accent2":"#hex"},
 "typography": {"display":"descrizione carattere titoli","body":"descrizione carattere testo","case":"maiuscolo|normale","tracking":"stretto|normale|larga"},
 "geometry": {"radius":"px o descrizione","border":"descrizione bordi","grid":"descrizione griglia","density":"compatta|media|arieggiata"},
 "layout_zones": [{"zone":"top|upper|middle|lower|bottom","content":"descrizione precisa di cosa c'è, quante card, in che disposizione"}],
 "components": ["elenco componenti visibili con testo/etichette e cifre esatte"],
 "photography": "stile immagini: soggetto, luce, taglio, sfondo",
 "signature_details": ["dettagli distintivi da replicare: ombre, glow, badge, illustrazioni, pattern"],
 "brand_marks_to_replace": ["testi/loghi del brand originale che vanno sostituiti"]
}

Sii estremamente specifico su numeri, posizioni e colori. Descrivi ciò che vedi, non ciò che immagini."""


def describe(path: str, api_key: str) -> dict:
    b64 = base64.b64encode(open(path, "rb").read()).decode()
    body = json.dumps({
        "model": MODEL,
        "messages": [{"role": "user", "content": [
            {"type": "text", "text": ASK},
            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}},
        ]}],
    }).encode()
    req = urllib.request.Request(CHAT, data=body, headers={
        "Authorization": f"Bearer {api_key}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=180) as res:
        payload = json.load(res)
    txt = payload["choices"][0]["message"]["content"].strip()
    if txt.startswith("```"):
        txt = txt.split("```")[1]
        txt = txt[4:] if txt.startswith("json") else txt
    return json.loads(txt)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--kind", default="phone", choices=["phone", "desktop", "both"])
    ap.add_argument("--workers", type=int, default=4)
    ap.add_argument("--limit", type=int, default=0)
    args = ap.parse_args()

    api_key = os.environ.get("LOVABLE_API_KEY")
    if not api_key:
        print("LOVABLE_API_KEY assente", file=sys.stderr)
        return 1

    inv = json.load(open(f"{REF}/inventory.json"))
    slugs = list(inv) if args.all else [args.slug]
    os.makedirs(f"{REF}/specs", exist_ok=True)

    jobs = []
    for slug in slugs:
        for it in inv.get(slug, []):
            if args.kind != "both" and it["kind"] != args.kind:
                continue
            out = f"{REF}/specs/{slug}__{os.path.basename(it['file']).rsplit('.', 1)[0]}.json"
            if not os.path.exists(out):
                jobs.append((slug, it["file"], out))
    if args.limit:
        jobs = jobs[: args.limit]
    print(f"schede da produrre: {len(jobs)}")

    def run(job):
        slug, src, out = job
        for attempt in range(3):
            try:
                spec = describe(src, api_key)
                spec["_source"] = os.path.basename(src)
                spec["_slug"] = slug
                json.dump(spec, open(out, "w"), indent=1, ensure_ascii=False)
                print(f"  ✓ {os.path.basename(out)} · {spec.get('screen_function')} · {spec.get('theme')}")
                return True
            except Exception as exc:
                if attempt == 2:
                    print(f"  ✗ {os.path.basename(out)}: {str(exc)[:140]}")
                    return False
                time.sleep(3 * (attempt + 1))

    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        ok = sum(1 for r in pool.map(run, jobs) if r)
    print(f"\n{ok}/{len(jobs)} schede tecniche prodotte in {REF}/specs")
    return 0 if ok == len(jobs) else 2


if __name__ == "__main__":
    sys.exit(main())
