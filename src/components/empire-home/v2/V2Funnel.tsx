import { useState } from "react";
import { ShieldCheck, Star, ChevronDown, ArrowRight, Phone, Mail, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ======================= GUARANTEE ======================= */
export function V2Guarantee() {
  const items = [
    { title: "90 giorni gratis totali", desc: "Nessuna carta richiesta. Provi tutto, decidi dopo." },
    { title: "Setup in 24 ore", desc: "Sei online entro un giorno lavorativo dalla call." },
    { title: "Migrazione gratuita", desc: "Ci occupiamo noi di portare clienti, ordini, prenotazioni dal vecchio gestionale." },
    { title: "Disdici quando vuoi", desc: "Senza penali, senza vincoli. Mai." },
  ];
  return (
    <section className="v2-section relative">
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <div
          className="rounded-[32px] border p-8 sm:p-12"
          style={{
            borderColor: "hsl(var(--v2-gold) / 0.3)",
            background:
              "radial-gradient(ellipse at top right, hsl(var(--v2-gold) / 0.18), transparent 60%), linear-gradient(180deg, hsl(var(--v2-emerald)), hsl(var(--v2-emerald-deep)))",
          }}
        >
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4 text-center lg:text-left">
              <div
                className="mx-auto grid h-20 w-20 place-items-center rounded-3xl lg:mx-0"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--v2-gold-light)), hsl(var(--v2-gold-deep)))",
                  boxShadow: "0 20px 50px -15px hsl(var(--v2-gold) / 0.5)",
                }}
              >
                <ShieldCheck size={40} style={{ color: "hsl(var(--v2-emerald-deep))" }} />
              </div>
              <h2 className="v2-display mt-5 text-3xl font-semibold sm:text-4xl">
                Garanzia <span className="v2-gold-text">Empire</span>.
              </h2>
              <p className="mt-3 text-sm" style={{ color: "hsl(var(--v2-text-muted))" }}>
                Mettiamo la faccia (e il portafoglio) sulla tua trasformazione.
              </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {items.map((it) => (
                <div key={it.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-base font-semibold">{it.title}</div>
                  <div className="mt-1 text-sm" style={{ color: "hsl(var(--v2-text-muted))" }}>{it.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======================= TESTIMONIALS ======================= */
const TESTI = [
  { name: "Alessandro De Luca", role: "Patron, Paperfish Sushi", text: "In 3 mesi siamo passati da 4.3★ a 4.8★ su Google. Le prenotazioni online sono triplicate. Empire ha cambiato il nostro locale." },
  { name: "Federica Rossi", role: "Owner, Atelier Aurora", text: "Non torno indietro. L'agenda si gestisce da sola, le clienti VIP si sentono coccolate. Recupero 12 ore alla settimana." },
  { name: "Marco Bianchi", role: "CEO, Rental Empire NCC", text: "Pricing dinamico + AI WhatsApp = +41% di margine sulle corse premium. Un investimento che si è ripagato in 6 settimane." },
  { name: "Giorgia Conti", role: "Direttrice, Strapizzami", text: "Il Vault Fiscale ha eliminato il caos di fine anno. Il commercialista è felice, io anche." },
];
export function V2Testimonials() {
  return (
    <section className="v2-section relative">
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="v2-eyebrow">DICONO DI EMPIRE</div>
          <h2 className="v2-display mt-3 text-4xl font-semibold sm:text-5xl">
            <span className="v2-gold-text">3.500+</span> aziende.
            <br />Una sola voce.
          </h2>
          <div className="v2-divider mx-auto mt-5" />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {TESTI.map((t) => (
            <div key={t.name} className="v2-card">
              <div className="flex items-center gap-1" style={{ color: "hsl(var(--v2-gold))" }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="mt-3 text-base leading-relaxed">"{t.text}"</p>
              <div className="mt-4">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-[12px]" style={{ color: "hsl(var(--v2-text-muted))" }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================= FAQ ======================= */
const FAQ = [
  { q: "Quanto tempo serve per essere operativi?", a: "24 ore lavorative dalla call di onboarding. Migrazione dei dati dal vecchio gestionale inclusa, gestita dal nostro team." },
  { q: "Funziona per il mio settore specifico?", a: "Empire copre 25+ settori con flussi, terminologia e documenti fiscali su misura: ristorazione, beauty, NCC, sanità, edilizia, retail, hotel e altri. Se non sei sicuro, chiedicelo nella call." },
  { q: "Quanto costa davvero a regime?", a: "Da €29/mese (Essential) a €89/mese (Empire Pro), fatturato annuale. Add-on agent IA da €29 a €89/mese. Niente costi nascosti, niente percentuali sulle vendite." },
  { q: "Devo cambiare il mio commercialista?", a: "No. Il Vault Fiscale 2026 esporta in formato standard per qualsiasi commercialista. Spesso il commercialista ti ringrazia." },
  { q: "I miei dati sono al sicuro?", a: "Server EU, conformità GDPR completa, encryption at-rest, audit log. Sei tu il proprietario dei tuoi dati, sempre." },
  { q: "Cosa succede dopo i 90 giorni gratis?", a: "Decidi tu. Continui con il piano scelto, fai upgrade/downgrade, o disdici senza penali. Niente carta richiesta in fase di prova." },
];
export function V2Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="v2-faq" className="v2-section relative">
      <div className="mx-auto max-w-3xl px-5 lg:px-10">
        <div className="text-center">
          <div className="v2-eyebrow">DOMANDE FREQUENTI</div>
          <h2 className="v2-display mt-3 text-4xl font-semibold sm:text-5xl">
            Le risposte <span className="v2-gold-text">che cerchi</span>.
          </h2>
          <div className="v2-divider mx-auto mt-5" />
        </div>
        <div className="mt-10 space-y-3">
          {FAQ.map((it, i) => {
            const isOpen = i === open;
            return (
              <div
                key={it.q}
                className="rounded-2xl border transition-all"
                style={{
                  borderColor: isOpen ? "hsl(var(--v2-gold) / 0.5)" : "hsl(var(--v2-gold) / 0.15)",
                  background: "hsl(var(--v2-emerald) / 0.4)",
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-base font-semibold sm:text-lg">{it.q}</span>
                  <ChevronDown
                    size={18}
                    className="flex-shrink-0 transition-transform"
                    style={{ transform: isOpen ? "rotate(180deg)" : "none", color: "hsl(var(--v2-gold-light))" }}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "hsl(var(--v2-text-muted))" }}>
                    {it.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ======================= FINAL CTA ======================= */
export function V2CTA() {
  const navigate = useNavigate();
  return (
    <section id="v2-contatti" className="v2-section relative">
      <div className="mx-auto max-w-5xl px-5 lg:px-10">
        <div
          className="relative overflow-hidden rounded-[40px] border p-8 text-center sm:p-14"
          style={{
            borderColor: "hsl(var(--v2-gold) / 0.4)",
            background:
              "radial-gradient(ellipse at top, hsl(var(--v2-gold) / 0.22), transparent 60%), linear-gradient(180deg, hsl(var(--v2-emerald)), hsl(var(--v2-emerald-deep)))",
          }}
        >
          <div className="v2-eyebrow">PRONTO?</div>
          <h2 className="v2-display mt-4 text-4xl font-semibold sm:text-5xl md:text-6xl">
            Costruiamo il tuo <span className="v2-gold-text italic">impero</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base" style={{ color: "hsl(var(--v2-text-muted))" }}>
            90 giorni gratis. Setup in 24h. Nessuna carta richiesta.
            Mockup iPhone su misura del tuo business in regalo.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button className="v2-cta" onClick={() => navigate("/onboarding")}>
              Inizia ora gratis <ArrowRight size={16} />
            </button>
            <a className="v2-ghost" href="https://wa.me/393500000000" target="_blank" rel="noreferrer">
              <MessageCircle size={14} /> Chatta su WhatsApp
            </a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs" style={{ color: "hsl(var(--v2-text-muted))" }}>
            <span className="flex items-center gap-1.5"><Phone size={12} /> +39 350 000 0000</span>
            <span className="flex items-center gap-1.5"><Mail size={12} /> ciao@empireia.app</span>
            <span>· Italia · EU GDPR compliant</span>
          </div>
        </div>
      </div>
    </section>
  );
}
