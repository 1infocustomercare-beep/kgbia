import { ArrowRight, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MinimalFinalCTA() {
  const navigate = useNavigate();
  return (
    <section className="relative w-full overflow-hidden bg-black py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(251,191,36,0.18), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <span className="inline-block rounded-full border border-amber-400/30 bg-amber-400/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-300">
          Inizia oggi
        </span>
        <h2 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-6xl">
          Smetti di perdere clienti.{" "}
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
            Inizia a guadagnare 24/7.
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-white/60 sm:text-lg">
          Setup in 24 ore. 90 giorni gratis. Zero rischio.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={() => navigate("/onboarding")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 px-6 py-4 text-sm font-bold text-black shadow-[0_15px_40px_-10px_rgba(251,191,36,0.6)] transition-all hover:-translate-y-0.5 sm:w-auto"
          >
            Inizia la tua trasformazione <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href="https://wa.me/393000000000"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10 sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" /> Scrivici su WhatsApp
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/40">
          <span>★ 4.9/5 · 3.500+ aziende</span>
          <span>· Setup in 24h</span>
          <span>· 90 giorni gratis</span>
          <span>· Cancelli quando vuoi</span>
        </div>
      </div>
    </section>
  );
}
