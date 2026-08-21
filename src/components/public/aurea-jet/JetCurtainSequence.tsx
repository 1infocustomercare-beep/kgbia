/**
 * ═══ JET CURTAIN SEQUENCE ═══
 * Sequenza editoriale con le primitive del kit di scroll: testo rivelato
 * parola-per-parola, immagini a tendina (clip-path) sfalsate e contatori
 * che salgono all'ingresso in viewport.
 *
 * ADDITIVO — solo presentazione.
 */
import tarmacLimo from "@/assets/aurea-jet/tarmac-limo.jpg";
import crewService from "@/assets/aurea-jet/crew-service.jpg";
import destinationCoast from "@/assets/aurea-jet/destination-coast.jpg";
import { LuxeTag } from "@/components/public/luxe";
import { ClipCurtain, LineWipe, ScrollCounter, ScrollWords } from "./JetScrollKit";

const NUMBERS = [
  { to: 5200, suffix: "+", label: "Aeroporti raggiungibili" },
  { to: 118, suffix: " min", label: "Attivazione media" },
  { to: 42, suffix: "", label: "Operatori partner certificati" },
  { to: 99.4, suffix: "%", decimals: 1, label: "Puntualità sui charter 2025" },
];

export default function JetCurtainSequence() {
  return (
    <section className="relative bg-background px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <LuxeTag>Standard Aurea</LuxeTag>

        <ScrollWords
          text="Non vendiamo ore di volo: costruiamo finestre di tempo che nessun altro può restituirti."
          accent={[7, 8, 9]}
          className="mt-8 max-w-4xl font-heading text-[clamp(1.9rem,4.6vw,3.6rem)] font-semibold leading-[1.06]"
        />

        <LineWipe className="mt-14" />

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          <ClipCurtain
            src={tarmacLimo}
            alt="Berlina sotto l'ala del jet"
            caption="01 · Auto sotto l'ala, nessun controllo in fila"
            className="h-[52svh] min-h-[300px] sm:mt-0"
          />
          <ClipCurtain
            src={crewService}
            alt="Servizio champagne a bordo"
            caption="02 · Servizio dedicato, champagne in quota"
            className="h-[52svh] min-h-[300px] sm:mt-14"
            from="left"
          />
          <ClipCurtain
            src={destinationCoast}
            alt="Costa mediterranea vista dall'alto"
            caption="03 · Atterri dove inizia la tua estate"
            className="h-[52svh] min-h-[300px] sm:mt-6"
          />
        </div>

        <div className="mt-20 grid grid-cols-2 gap-px border border-border/50 bg-border/40 sm:grid-cols-4">
          {NUMBERS.map((n) => (
            <div key={n.label} className="bg-background px-5 py-8">
              <p className="font-heading text-[clamp(1.8rem,3.4vw,3rem)] font-semibold leading-none text-primary">
                <ScrollCounter to={n.to} suffix={n.suffix} decimals={n.decimals ?? 0} />
              </p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-foreground/50">{n.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
