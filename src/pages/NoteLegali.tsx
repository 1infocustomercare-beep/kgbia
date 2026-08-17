import { Link } from "react-router-dom";
import GlassBackButton from "@/components/glass/GlassBackButton";
import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";

export default function NoteLegali() {
  return (
    <>
      <PrestigeTheme />
      <div className="prestige-root prestige-section prestige-light min-h-screen py-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-neutral">
          <GlassBackButton to="/" label="Torna alla home" variant="inline" className="px-4 text-xs" />
          <h1 className="font-heading text-4xl mt-4">Note Legali</h1>
          <p className="text-xs opacity-60">Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}</p>

          <h2>Titolare del sito</h2>
          <ul>
            <li>Ragione sociale: <strong>[RAGIONE SOCIALE]</strong></li>
            <li>Sede legale: <strong>[SEDE]</strong></li>
            <li>P.IVA / C.F.: <strong>[P.IVA]</strong></li>
            <li>REA / Registro Imprese: <strong>[REA]</strong></li>
            <li>Email: <strong>[EMAIL]</strong></li>
            <li>PEC: <strong>[PEC]</strong></li>
          </ul>

          <h2>Contenuti</h2>
          <p>
            Testi, grafiche, marchi e software presenti sul sito sono di proprietà del Titolare o dei rispettivi
            aventi diritto. Qualsiasi riproduzione, anche parziale, richiede autorizzazione scritta.
          </p>

          <h2>Link esterni</h2>
          <p>
            Il sito può contenere link a risorse esterne. Il Titolare non è responsabile dei contenuti né delle
            politiche di privacy di siti di terze parti.
          </p>

          <h2>Segnalazioni</h2>
          <p>
            Per segnalare contenuti illeciti o violazioni scrivere a <strong>[EMAIL]</strong>.
          </p>
        </div>
      </div>
    </>
  );
}
