import { Link } from "react-router-dom";
import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";

export default function TerminiCondizioni() {
  return (
    <>
      <PrestigeTheme />
      <div className="prestige-root prestige-section prestige-light min-h-screen py-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-neutral">
          <Link to="/" className="text-sm underline">← Torna alla home</Link>
          <h1 className="font-heading text-4xl mt-4">Termini e Condizioni di vendita</h1>
          <p className="text-xs opacity-60">Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}</p>

          <h2>1. Titolare</h2>
          <p>
            I presenti Termini regolano i rapporti tra <strong>[RAGIONE SOCIALE]</strong>, P.IVA <strong>[P.IVA]</strong>,
            con sede in <strong>[SEDE]</strong> (di seguito "Fornitore"), e il Cliente che acquista servizi digitali
            attraverso il sito.
          </p>

          <h2>2. Oggetto</h2>
          <p>
            Il Fornitore realizza e fornisce siti web, web-app, automazioni AI e servizi di consulenza digitale.
            La descrizione, il prezzo e il perimetro del singolo servizio sono definiti nell'ordine confermato via email.
          </p>

          <h2>3. Conclusione del contratto</h2>
          <p>
            Il contratto si perfeziona quando il Cliente accetta esplicitamente l'offerta o completa il pagamento. Le
            informazioni fornite dal Cliente devono essere veritiere e complete.
          </p>

          <h2>4. Prezzi e pagamento</h2>
          <p>
            I prezzi sono espressi in Euro, IVA esclusa salvo diversa indicazione. Il pagamento avviene tramite i metodi
            indicati in fase di ordine. In caso di ritardato pagamento si applicano gli interessi di legge (D.Lgs. 231/2002).
          </p>

          <h2>5. Diritto di recesso (D.Lgs. 206/2005)</h2>
          <p>
            Per i Clienti consumatori è previsto il diritto di recesso entro 14 giorni dalla conclusione del contratto,
            salvo il caso in cui l'esecuzione del servizio sia iniziata con il consenso espresso del consumatore e con
            l'accettazione della perdita del diritto di recesso a servizio completato (art. 59, lett. a e o).
            Per esercitare il recesso: <strong>[EMAIL]</strong>.
          </p>

          <h2>6. Obblighi del Cliente</h2>
          <p>
            Il Cliente si impegna a fornire tempestivamente contenuti, accessi e feedback necessari alla lavorazione.
            I ritardi imputabili al Cliente non danno luogo a rimborsi.
          </p>

          <h2>7. Proprietà intellettuale</h2>
          <p>
            Il Cliente diventa proprietario del sito consegnato al saldo integrale del compenso. Rimangono di proprietà
            del Fornitore i framework, i template interni, le librerie e il know-how utilizzati.
          </p>

          <h2>8. Limitazione di responsabilità</h2>
          <p>
            Il Fornitore non risponde di danni indiretti, mancati guadagni o interruzioni di servizio dovute a fattori
            esterni (hosting di terzi, API di terze parti, forza maggiore). La responsabilità è comunque limitata
            all'importo pagato per il singolo servizio contestato.
          </p>

          <h2>9. Foro competente e legge applicabile</h2>
          <p>
            Il contratto è regolato dalla legge italiana. Per le controversie con Clienti consumatori è competente il
            foro di residenza del consumatore; negli altri casi il foro esclusivo è quello di <strong>[SEDE]</strong>.
          </p>

          <h2>10. ODR</h2>
          <p>
            Il Cliente consumatore può accedere alla piattaforma europea per la risoluzione online delle controversie:{" "}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer">ec.europa.eu/consumers/odr</a>.
          </p>

          <p className="text-xs opacity-60 mt-8">
            Documento redatto come modello di riferimento. I dati fra parentesi quadre devono essere sostituiti con i
            dati reali del Titolare prima della pubblicazione definitiva.
          </p>
        </div>
      </div>
    </>
  );
}
