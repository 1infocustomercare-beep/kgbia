import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CookiePolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-10 glass-strong px-5 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-display font-bold">Cookie Policy</h1>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-base font-display font-bold text-foreground mb-2">1. Cosa sono i Cookie</h2>
          <p>I cookie sono piccoli file di testo che i siti web visitati inviano al terminale dell'utente, dove vengono memorizzati, per poi essere ritrasmessi agli stessi siti alla visita successiva (Provvedimento Garante Privacy n. 229/2014).</p>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-foreground mb-2">2. Tipologie di Cookie Utilizzati</h2>
          
          <div className="space-y-3 mt-3">
            <div className="p-3 rounded-xl bg-secondary/30">
              <p className="text-xs font-semibold text-foreground">🔒 Cookie Tecnici (Necessari)</p>
              <p className="text-xs mt-1">Essenziali per il funzionamento del sito. Includono cookie di sessione, autenticazione e preferenze. Non richiedono consenso (Art. 122.1 D.Lgs. 196/2003).</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">Durata: sessione / 12 mesi</p>
            </div>

            <div className="p-3 rounded-xl bg-secondary/30">
              <p className="text-xs font-semibold text-foreground">📊 Cookie Analitici</p>
              <p className="text-xs mt-1">Utilizzati per raccogliere informazioni aggregate sull'utilizzo del sito. I dati sono anonimizzati e utilizzati esclusivamente per migliorare il servizio.</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">Durata: massimo 13 mesi (Linee Guida Garante 10/06/2021)</p>
            </div>

            <div className="p-3 rounded-xl bg-secondary/30">
              <p className="text-xs font-semibold text-foreground">📣 Cookie di Marketing</p>
              <p className="text-xs mt-1">Utilizzati per inviare promozioni personalizzate e remarketing. Richiedono il tuo esplicito consenso e possono essere disattivati in qualsiasi momento.</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">Durata: fino a revoca del consenso</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-foreground mb-2">3. Cookie di Terze Parti</h2>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-foreground">Servizio</th>
                <th className="text-left py-2 text-foreground">Tipo</th>
                <th className="text-left py-2 text-foreground">Finalità</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr><td className="py-2">Stripe</td><td>Tecnico</td><td>Elaborazione pagamenti</td></tr>
              <tr><td className="py-2">Google Fonts</td><td>Tecnico</td><td>Caricamento font</td></tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-foreground mb-2">4. Gestione dei Cookie</h2>
          <p>Puoi modificare le tue preferenze in qualsiasi momento tramite il banner cookie o le impostazioni del tuo browser. La disattivazione dei cookie tecnici potrebbe compromettere il funzionamento del sito.</p>
          <p className="mt-2">Per informazioni sulla gestione dei cookie nei diversi browser:</p>
          <ul className="list-disc pl-5 mt-1 space-y-0.5">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" className="text-primary underline">Chrome</a></li>
            <li><a href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie" target="_blank" rel="noopener" className="text-primary underline">Firefox</a></li>
            <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener" className="text-primary underline">Safari</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-display font-bold text-foreground mb-2">5. Riferimenti Normativi</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Regolamento UE 2016/679 (GDPR)</li>
            <li>D.Lgs. 196/2003 (Codice Privacy) come modificato dal D.Lgs. 101/2018</li>
            <li>Provvedimento Garante Privacy n. 229 dell'8 maggio 2014</li>
            <li>Linee Guida Garante Privacy del 10 giugno 2021 sui cookie e altri strumenti di tracciamento</li>
          </ul>
        </section>

        <p className="text-xs text-muted-foreground/60 pt-4 border-t border-border">
          Ultimo aggiornamento: Febbraio 2026
        </p>
      </div>
    </div>
  );
};

export default CookiePolicy;
