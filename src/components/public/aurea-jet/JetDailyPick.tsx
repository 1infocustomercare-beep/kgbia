/**
 * ═══ JET DAILY PICK ═══
 * Adattamento del blocco "La selezione del giorno / Cultura" del sito di
 * riferimento: data grande, numero del giorno, immagine editoriale e racconto
 * breve. Reveal a tendina sullo scroll.
 *
 * ADDITIVO — solo presentazione.
 */
import cabinDining from "@/assets/aurea-jet/cabin-dining.jpg";
import { ClipCurtain, LineWipe, ScrollWords } from "./JetScrollKit";

const NOW = new Date();
const DAY = NOW.toLocaleDateString("it-IT", { weekday: "long" });
const NUM = NOW.getDate();
const MONTH = NOW.toLocaleDateString("it-IT", { month: "long" });
const YEAR = NOW.getFullYear();

export default function JetDailyPick() {
  return (
    <section className="relative bg-background px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary">La rotta del giorno</p>
            <p className="mt-2 text-sm capitalize text-muted-foreground">{DAY} {NUM} {MONTH}</p>
          </div>
          <p className="font-heading text-2xl font-semibold sm:text-4xl">
            Cultura <span className="text-muted-foreground">· numero {NUM}</span>
          </p>
        </div>

        <LineWipe className="mt-6" />

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <p className="font-heading text-[clamp(3.4rem,12vw,7rem)] font-semibold leading-none text-primary">{NUM}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
              {MONTH} {YEAR}
            </p>
            <p className="mt-8 text-sm leading-relaxed text-foreground/70">
              Ogni giorno raccontiamo una rotta che è passata dal nostro flight desk: perché è stata scelta,
              come è stata costruita, che cosa ha salvato al cliente.
            </p>
          </div>

          <div>
            <ClipCurtain
              src={cabinDining}
              alt="Servizio a bordo durante una rotta notturna"
              caption="Milano Linate — Olbia · 55 minuti · cena in crociera"
              className="h-[46svh] min-h-[300px] w-full"
              from="left"
            />
            <ScrollWords
              text="Un consiglio di amministrazione a Milano alle 18, una cena a Porto Cervo alle 21: la stessa giornata, senza compromessi."
              accent={[4, 5]}
              className="mt-8 max-w-3xl font-heading text-[clamp(1.3rem,3.4vw,2.4rem)] font-medium leading-[1.14]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
