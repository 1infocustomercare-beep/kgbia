import React from "react";
import { Link } from "react-router-dom";
import { EmpireLogo, EmpireWordmark } from "@/lib/empire-brand";
import { LEGAL, AI_DISCLAIMER_IT, legalIdentityLines } from "@/config/legal";

/**
 * PrestigeFooter — footer pulito e statico per la home Empire.
 * Niente position:fixed/clip-path. Niente sezioni vuote.
 */
export default function PrestigeFooter() {
  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="prestige-dark relative w-full border-t border-white/10 bg-[#0b1410] text-white/80 overflow-hidden">
      {/* Glow morbido di sfondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, hsl(var(--primary)/0.18), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-16">
        {/* Brand lockup */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <EmpireLogo size={56} rounded="xl" glow />
          <EmpireWordmark size={22} serif />
        </div>

        {/* CTA finale */}
        <div className="flex flex-col items-center text-center gap-6">
          <h2 className="font-serif text-4xl lg:text-6xl tracking-tight text-white">
            Pronto a iniziare?
          </h2>
          <p className="max-w-xl text-sm md:text-base text-white/65">
            Setup in 7 giorni. Parliamone insieme e valutiamo se Empire fa al caso tuo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--gold,42_60%_55%))] px-7 py-3 text-sm font-semibold text-black shadow-[0_10px_40px_-10px_hsl(var(--gold,42_60%_55%)/0.6)] hover:scale-[1.02] transition-transform"
            >
              Inizia ora
              <span aria-hidden="true">→</span>
            </Link>
            <a
              href="#lead"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
            >
              Parla con un consulente
            </a>
          </div>
        </div>

        {/* Link grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/50 mb-4">
              Piattaforma
            </h3>
            <ul className="space-y-2">
              <li><a href="#services" className="hover:text-white">Servizi</a></li>
              <li><a href="#sectors" className="hover:text-white">Settori</a></li>
              <li><a href="#portfolio" className="hover:text-white">Portfolio</a></li>
              <li><a href="#agents" className="hover:text-white">AI Agents</a></li>
              <li><a href="#pricing" className="hover:text-white">Prezzi</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/50 mb-4">
              Risorse
            </h3>
            <ul className="space-y-2">
              <li><a href="#how" className="hover:text-white">Come funziona</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
              <li><Link to="/join" className="hover:text-white">Diventa Partner</Link></li>
              <li><a href="#lead" className="hover:text-white">Contatti</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/50 mb-4">
              Legale
            </h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-white">Cookie Policy</Link></li>
              <li><Link to="/termini" className="hover:text-white">Termini e Condizioni</Link></li>
              <li><Link to="/note-legali" className="hover:text-white">Note Legali</Link></li>
              <li>
                <button
                  type="button"
                  onClick={() => import("@/lib/cookie-consent").then((m) => m.openCookiePreferences())}
                  className="hover:text-white text-left"
                >
                  Gestisci cookie
                </button>
              </li>
              <li><span className="text-white/40">Dati in EU · GDPR</span></li>
            </ul>
          </div>
        </div>

        {/* Identità del titolare + trasparenza AI (D.lgs. 70/2003 · AI Act art. 50) */}
        <div className="mt-12 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[11px] leading-relaxed text-white/55">
          <p>
            <span className="font-semibold text-white/75">{LEGAL.legalName ?? LEGAL.brandName}</span>
            {legalIdentityLines().filter((r) => r !== LEGAL.legalName).length > 0 && (
              <span> · {legalIdentityLines().filter((r) => r !== LEGAL.legalName).join(" · ")}</span>
            )}
          </p>
          <p>{AI_DISCLAIMER_IT}</p>
          <p>
            Titolare del trattamento dei dati:{" "}
            <span className="text-white/70">{LEGAL.legalName ?? LEGAL.brandName}</span> · Dati ospitati
            nell'Unione Europea · Diritti degli interessati (artt. 15–22 GDPR) esercitabili scrivendo a{" "}
            <a className="underline hover:text-white" href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
          </p>
          <p>
            Prezzi indicati IVA 22% esclusa. Le stime di risultato mostrate nel sito sono indicative e non
            costituiscono garanzia di rendimento.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="text-[11px] tracking-[0.18em] uppercase text-white/45">
            © 2026 Empire AI Group · Tutti i diritti riservati
          </div>
          <div className="text-[11px] tracking-[0.18em] uppercase text-white/55">
            Made with precision in Italy
          </div>
          <button
            onClick={scrollTop}
            className="inline-flex items-center gap-2 text-xs text-white/55 hover:text-white"
            aria-label="Torna in cima"
          >
            <span>Torna in cima</span>
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
