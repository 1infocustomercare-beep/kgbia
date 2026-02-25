import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-10 glass-strong px-5 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-display font-bold">Privacy Policy</h1>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-base font-display font-bold text-foreground mb-2">1. Titolare del Trattamento</h2>
          <p>Il Titolare del trattamento dei dati personali è il singolo ristorante che utilizza la piattaforma Empire come intermediario tecnico. I dati di contatto del Titolare sono disponibili nella sezione "Contatti" del menu digitale del ristorante.</p>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-foreground mb-2">2. Base Giuridica e Finalità</h2>
          <p>I dati personali sono trattati ai sensi del Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003 (Codice Privacy), come modificato dal D.Lgs. 101/2018, per le seguenti finalità:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong className="text-foreground">Esecuzione del contratto</strong> (Art. 6.1.b GDPR): gestione ordini, consegne, pagamenti.</li>
            <li><strong className="text-foreground">Obbligo legale</strong> (Art. 6.1.c GDPR): adempimenti fiscali e contabili.</li>
            <li><strong className="text-foreground">Legittimo interesse</strong> (Art. 6.1.f GDPR): sicurezza, prevenzione frodi, miglioramento servizio.</li>
            <li><strong className="text-foreground">Consenso</strong> (Art. 6.1.a GDPR): marketing, profilazione, cookie analitici.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-foreground mb-2">3. Dati Raccolti</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Dati anagrafici: nome, cognome</li>
            <li>Dati di contatto: telefono, indirizzo email, indirizzo di consegna</li>
            <li>Dati di navigazione: IP (anonimizzato), cookie tecnici e analitici</li>
            <li>Dati transazionali: storico ordini, importi, metodo di pagamento (elaborato da Stripe)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-foreground mb-2">4. Conservazione dei Dati</h2>
          <p>I dati sono conservati per il tempo strettamente necessario alle finalità per cui sono stati raccolti:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Dati ordini: 24 mesi dalla data dell'ordine</li>
            <li>Dati fiscali: 10 anni (obbligo art. 2220 c.c.)</li>
            <li>Dati marketing: fino a revoca del consenso</li>
            <li>Cookie analitici: massimo 13 mesi (Provvedimento Garante 10/06/2021)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-foreground mb-2">5. Trasferimento Dati</h2>
          <p>I dati sono conservati su server localizzati nell'Unione Europea (regione Frankfurt/Ireland). Non avviene alcun trasferimento di dati verso Paesi terzi al di fuori dello Spazio Economico Europeo senza adeguate garanzie (Art. 46 GDPR).</p>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-foreground mb-2">6. Diritti dell'Interessato</h2>
          <p>Ai sensi degli Artt. 15-22 GDPR, hai diritto a:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Accesso ai tuoi dati personali</li>
            <li>Rettifica dei dati inesatti</li>
            <li>Cancellazione ("diritto all'oblio")</li>
            <li>Limitazione del trattamento</li>
            <li>Portabilità dei dati</li>
            <li>Opposizione al trattamento</li>
            <li>Revoca del consenso in qualsiasi momento</li>
          </ul>
          <p className="mt-2">Puoi esercitare i tuoi diritti contattando il ristorante o scrivendo a privacy@empire.app. Hai inoltre diritto di proporre reclamo al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it).</p>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-foreground mb-2">7. Responsabile del Trattamento</h2>
          <p>La piattaforma Empire agisce come Responsabile del trattamento (Art. 28 GDPR) per conto del ristorante (Titolare), limitatamente alle attività di intermediazione tecnica, elaborazione ordini e gestione pagamenti.</p>
        </section>

        <p className="text-xs text-muted-foreground/60 pt-4 border-t border-border">
          Ultimo aggiornamento: Febbraio 2026 — Informativa redatta ai sensi del Reg. UE 2016/679 e del Provvedimento del Garante Privacy del 10 giugno 2021.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
