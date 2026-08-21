/**
 * ═══ JET CIRCLE FORM ═══
 * Iscrizione esclusiva: "Entra nel cerchio. Accedi alle rotte off-market."
 * ADDITIVO — solo presentazione, nessuna persistenza.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

export default function JetCircleForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="relative overflow-hidden border-y border-border/50 px-5 py-24 sm:px-10 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.16),transparent_60%)]" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-primary">Solo su invito</p>
        <h2 className="jet-serif mt-5 text-4xl leading-[0.96] sm:text-6xl">
          Entra nel cerchio.<br />
          <span className="italic text-primary">Accedi alle rotte off-market.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-foreground/65">
          Vuoti di posizionamento, slot notturni e disponibilità non pubblicate, comunicati prima del mercato.
        </p>

        <form
          className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.includes("@")) {
              toast.error("Inserisci un indirizzo email valido");
              return;
            }
            setDone(true);
            toast.success("Richiesta registrata. Il flight desk ti contatta a breve.");
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@dominio.com"
            aria-label="Indirizzo email"
            className="min-h-12 flex-1 border border-border bg-card/50 px-5 text-sm text-foreground placeholder:text-muted-foreground/70 backdrop-blur-xl outline-none transition-colors focus-visible:border-primary"
          />
          <button
            type="submit"
            className="group inline-flex min-h-12 items-center justify-center gap-2 border border-primary bg-primary px-7 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-foreground transition-colors hover:bg-primary/85"
          >
            {done ? <Check className="h-4 w-4" /> : null}
            {done ? "Richiesta inviata" : "Richiedi accesso"}
            {!done && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
          </button>
        </form>
        <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
          Demo Empire · nessun dato viene registrato
        </p>
      </motion.div>
    </section>
  );
}
