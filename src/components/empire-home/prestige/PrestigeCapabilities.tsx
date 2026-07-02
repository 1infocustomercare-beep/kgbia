import { useEffect, useRef } from "react";
import { useT } from "./PrestigeLang";

/**
 * PrestigeCapabilities — Editorial magazine take.
 * NO icon tiles, NO metric badges, NO grid-of-cards feel.
 * Layout: giant serif roman numeral, asymmetric two-column entries,
 * hairline gold rules, editorial pull-quotes, alternating alignment.
 * Reads like a printed dossier — not a SaaS feature list.
 */

type Entry = {
  n: string;
  kickerIt: string;
  kickerEn: string;
  titleIt: string;
  titleEn: string;
  bodyIt: string;
  bodyEn: string;
  pullIt: string;
  pullEn: string;
  attribIt: string;
  attribEn: string;
};

const ENTRIES: Entry[] = [
  {
    n: "I",
    kickerIt: "Il sito",
    kickerEn: "The website",
    titleIt: "Non una vetrina. Una macchina che vende mentre dormi.",
    titleEn: "Not a showcase. A machine that sells while you sleep.",
    bodyIt:
      "Fotografia diretta, tipografia editoriale, tempo di caricamento sotto il secondo. Prenotazioni, pagamenti e SEO tecnica integrati alla radice, non incollati dopo. Il sito parla il tuo mestiere, non il vocabolario di un'agenzia.",
    bodyEn:
      "Direct photography, editorial typography, sub-second load. Bookings, payments and technical SEO built into the root, not glued on later. It speaks your craft, not an agency's vocabulary.",
    pullIt: "Il primo cliente è arrivato prima che finissimo il caffè.",
    pullEn: "The first customer arrived before we finished our coffee.",
    attribIt: "— Onyx Brace, steakhouse, Milano",
    attribEn: "— Onyx Brace, steakhouse, Milan",
  },
  {
    n: "II",
    kickerIt: "WhatsApp",
    kickerEn: "WhatsApp",
    titleIt: "Una voce sola, in tre lingue, alle quattro del mattino.",
    titleEn: "One voice, three languages, at four in the morning.",
    bodyIt:
      "L'assistente conosce menu, prezzi, disponibilità, e sa quando è meglio passarti la palla. Prenota, conferma, upselling, incassa il deposito. Il weekend smette di essere un imbuto.",
    bodyEn:
      "The assistant knows the menu, prices, availability, and knows when to hand off. Books, confirms, upsells, collects the deposit. Weekends stop being a funnel.",
    pullIt: "Abbiamo tolto il numero personale dal frigo. Finalmente.",
    pullEn: "We took the personal number off the fridge. Finally.",
    attribIt: "— Sakura Paperfish, sushi bar, Roma",
    attribEn: "— Sakura Paperfish, sushi bar, Rome",
  },
  {
    n: "III",
    kickerIt: "Il centralino",
    kickerEn: "The switchboard",
    titleIt: "Rispondere al primo squillo, ogni volta.",
    titleEn: "Answering on the first ring. Every time.",
    bodyIt:
      "Voce naturale, cadenza umana, filtra il rumore e ti passa solo ciò che merita il tuo tempo. Le corse, i tavoli, gli appuntamenti si registrano da soli. Nessun operatore da formare, nessun turno da coprire.",
    bodyEn:
      "Natural voice, human cadence, filters noise and hands you only what deserves your time. Rides, tables, appointments book themselves. No operator to train, no shift to cover.",
    pullIt: "In dodici settimane, zero chiamate perse tra le 22 e le 8.",
    pullEn: "Twelve weeks in, zero calls lost between 10pm and 8am.",
    attribIt: "— Batey Pacifico, NCC, Sardegna",
    attribEn: "— Batey Pacifico, chauffeur service, Sardinia",
  },
  {
    n: "IV",
    kickerIt: "La sala macchine",
    kickerEn: "The engine room",
    titleIt: "Una sola cabina di regia. Il resto sparisce.",
    titleEn: "A single cockpit. Everything else disappears.",
    bodyIt:
      "Incassi, agenda, staff, stock, KPI, marketing, recensioni: tutto in un pannello vivo, aggiornato al secondo. Nessun tab da tenere aperto, nessun foglio da compilare. Apri, capisci, agisci.",
    bodyEn:
      "Revenue, calendar, staff, stock, KPIs, marketing, reviews: all in one living panel, updated to the second. No tabs to keep open, no sheet to fill. Open, understand, act.",
    pullIt: "Ho chiuso Excel per la prima volta in nove anni.",
    pullEn: "I closed Excel for the first time in nine years.",
    attribIt: "— Strapizzami, pizzeria napoletana, Milano",
    attribEn: "— Strapizzami, Neapolitan pizzeria, Milan",
  },
  {
    n: "V",
    kickerIt: "L'ecosistema",
    kickerEn: "The ecosystem",
    titleIt: "Dodici agenti, un solo stipendio, zero riunioni.",
    titleEn: "Twelve agents, one payroll, zero meetings.",
    bodyIt:
      "Vendite, marketing, HR, contabilità, HACCP, flotta, social, recensioni, concierge multilingua. Ognuno con un mestiere, tutti sotto la tua supervisione. Non sostituiscono il tuo team — lo liberano dal rumore.",
    bodyEn:
      "Sales, marketing, HR, accounting, HACCP, fleet, social, reviews, multilingual concierge. Each with a craft, all under your supervision. They don't replace your team — they free it from noise.",
    pullIt: "I miei ragazzi ora fanno il mestiere per cui li ho assunti.",
    pullEn: "My people now do the job I actually hired them for.",
    attribIt: "— La Casa del Riccio, hotel boutique, Toscana",
    attribEn: "— La Casa del Riccio, boutique hotel, Tuscany",
  },
];

export default function PrestigeCapabilities() {
  const t = useT();
  const rootRef = useRef<HTMLDivElement>(null);

  // Subtle scroll-linked reveal per entry (staggered vertical translate).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-entry]"));
    if (reduced) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      data-section="prestige-capabilities"
      data-no-reveal
      className="prestige-section prestige-light relative"
      style={{
        paddingTop: "clamp(96px, 14svh, 160px)",
        paddingBottom: "clamp(96px, 14svh, 160px)",
      }}
    >
      <div className="relative mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-16" ref={rootRef}>
        {/* Editorial masthead */}
        <header className="grid grid-cols-12 gap-x-6 gap-y-6 pb-16 sm:pb-24 border-b" style={{ borderColor: "hsl(var(--pr-emerald) / 0.14)" }}>
          <div className="col-span-12 md:col-span-4">
            <div
              className="prestige-eyebrow-indexed"
              data-index="IV"
              style={{ color: "hsl(var(--pr-gold-deep))" }}
            >
              {t({ it: "Il dossier", en: "The dossier" })}
            </div>
            <div
              className="mt-6 text-[11px] uppercase tracking-[0.32em] font-semibold"
              style={{ color: "hsl(var(--pr-emerald) / 0.7)" }}
            >
              {t({ it: "Cinque capitoli · un solo sistema", en: "Five chapters · one system" })}
            </div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2
              className="prestige-display"
              style={{
                fontSize: "clamp(2.1rem, 5.4vw, 4.6rem)",
                lineHeight: 1.04,
                color: "hsl(var(--pr-emerald-deep))",
              }}
            >
              {t({
                it: "Come Empire ",
                en: "How Empire ",
              })}
              <span className="prestige-italic" style={{ color: "hsl(var(--pr-gold-deep))" }}>
                {t({ it: "lavora al posto tuo,", en: "works in your place," })}
              </span>{" "}
              {t({
                it: "senza mai sembrare un software.",
                en: "without ever feeling like software.",
              })}
            </h2>
          </div>
        </header>

        {/* Entries */}
        <ol className="mt-4">
          {ENTRIES.map((e, i) => {
            const flip = i % 2 === 1;
            return (
              <li
                key={e.n}
                data-entry
                className="cap-entry grid grid-cols-12 gap-x-6 gap-y-8 py-16 sm:py-24 border-b"
                style={{
                  borderColor: "hsl(var(--pr-emerald) / 0.12)",
                  opacity: 0,
                  transform: "translateY(28px)",
                  transition: "opacity 900ms cubic-bezier(.22,1,.36,1), transform 900ms cubic-bezier(.22,1,.36,1)",
                  transitionDelay: `${Math.min(i, 3) * 60}ms`,
                }}
              >
                {/* Roman numeral — huge serif */}
                <div
                  className={`col-span-12 md:col-span-3 ${flip ? "md:order-3 md:text-right" : ""}`}
                >
                  <div
                    className="prestige-display"
                    style={{
                      fontFamily: "'DM Serif Display', Georgia, serif",
                      fontSize: "clamp(4rem, 9vw, 8rem)",
                      lineHeight: 0.85,
                      color: "hsl(var(--pr-gold-deep))",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {e.n}
                  </div>
                  <div
                    className="mt-4 text-[11px] uppercase tracking-[0.34em] font-semibold"
                    style={{ color: "hsl(var(--pr-emerald) / 0.75)" }}
                  >
                    {t({ it: e.kickerIt, en: e.kickerEn })}
                  </div>
                </div>

                {/* Title + body */}
                <div className={`col-span-12 md:col-span-6 ${flip ? "md:order-2" : ""}`}>
                  <h3
                    className="prestige-display"
                    style={{
                      fontFamily: "'DM Serif Display', Georgia, serif",
                      fontSize: "clamp(1.55rem, 2.9vw, 2.5rem)",
                      lineHeight: 1.08,
                      color: "hsl(var(--pr-emerald-deep))",
                      letterSpacing: "-0.012em",
                    }}
                  >
                    {t({ it: e.titleIt, en: e.titleEn })}
                  </h3>

                  {/* Hairline gold rule */}
                  <div
                    className="my-6 h-px w-16"
                    style={{
                      background:
                        "linear-gradient(90deg, hsl(var(--pr-gold-deep)), transparent)",
                    }}
                  />

                  <p
                    className="text-[15.5px] sm:text-[16.5px] leading-[1.7]"
                    style={{
                      color: "hsl(var(--pr-emerald) / 0.9)",
                      fontFamily: "'Fira Sans', sans-serif",
                      fontWeight: 400,
                      maxWidth: "36em",
                    }}
                  >
                    {t({ it: e.bodyIt, en: e.bodyEn })}
                  </p>
                </div>

                {/* Pull-quote column */}
                <aside
                  className={`col-span-12 md:col-span-3 ${flip ? "md:order-1 md:text-right" : ""}`}
                >
                  <div
                    className="relative pl-4"
                    style={{
                      borderLeft: flip ? "none" : "1px solid hsl(var(--pr-gold-deep) / 0.4)",
                      borderRight: flip ? "1px solid hsl(var(--pr-gold-deep) / 0.4)" : "none",
                      paddingLeft: flip ? 0 : "1rem",
                      paddingRight: flip ? "1rem" : 0,
                    }}
                  >
                    <p
                      className="prestige-italic"
                      style={{
                        fontFamily: "'DM Serif Display', Georgia, serif",
                        fontSize: "clamp(1.05rem, 1.55vw, 1.35rem)",
                        lineHeight: 1.35,
                        color: "hsl(var(--pr-emerald-deep))",
                      }}
                    >
                      &laquo;{t({ it: e.pullIt, en: e.pullEn })}&raquo;
                    </p>
                    <div
                      className="mt-3 text-[11px] uppercase tracking-[0.22em] font-semibold"
                      style={{ color: "hsl(var(--pr-emerald) / 0.6)" }}
                    >
                      {t({ it: e.attribIt, en: e.attribEn })}
                    </div>
                  </div>
                </aside>
              </li>
            );
          })}
        </ol>

        {/* Colophon-style closer */}
        <div className="mt-20 sm:mt-28 grid grid-cols-12 gap-x-6 gap-y-8 items-end">
          <div className="col-span-12 md:col-span-7">
            <p
              className="prestige-italic"
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)",
                lineHeight: 1.25,
                color: "hsl(var(--pr-emerald-deep))",
              }}
            >
              {t({
                it: "Non vendiamo software. Vendiamo un impero che smette di dipendere da te per funzionare — e che ti restituisce la parte migliore della giornata.",
                en: "We don't sell software. We sell an empire that stops depending on you to run — and gives back the best part of your day.",
              })}
            </p>
          </div>
          <div className="col-span-12 md:col-span-5 md:text-right">
            <a
              href="#prestige-lead-form"
              onClick={(ev) => {
                ev.preventDefault();
                document.getElementById("prestige-lead-form")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="prestige-cta"
            >
              {t({ it: "Costruisci il tuo dossier", en: "Build your dossier" })}
            </a>
            <div
              className="mt-4 text-[11px] uppercase tracking-[0.28em] font-semibold"
              style={{ color: "hsl(var(--pr-emerald) / 0.65)" }}
            >
              {t({
                it: "24h · mockup gratuito · zero impegno",
                en: "24h · free mockup · zero commitment",
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cap-entry.is-in { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>
    </section>
  );
}
