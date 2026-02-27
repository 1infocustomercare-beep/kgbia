import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple PDF generator (valid PDF 1.4)
function createPdf(title: string, pages: string[][]): Uint8Array {
  const objects: string[] = [];
  let objCount = 0;
  const offsets: number[] = [];

  const addObj = (content: string) => {
    objCount++;
    offsets.push(-1); // placeholder
    objects.push(`${objCount} 0 obj\n${content}\nendobj\n`);
    return objCount;
  };

  // 1: Catalog
  addObj("<< /Type /Catalog /Pages 2 0 R >>");

  // 2: Pages (placeholder, update later)
  const pagesObjIdx = objects.length;
  addObj("PLACEHOLDER");

  // 3: Font
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const fontBoldObj = addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  // Create page objects
  const pageObjIds: number[] = [];

  for (const lines of pages) {
    // Content stream
    let stream = "BT\n";
    let y = 750;

    // Title on first page
    if (pages.indexOf(lines) === 0) {
      stream += `/F2 24 Tf\n50 ${y} Td\n(${escapePdf(title)}) Tj\n`;
      y -= 50;
      stream += `/F1 10 Tf\n0 -50 Td\n(Empire Restaurant Suite - Materiale Riservato Partner) Tj\n`;
      y -= 30;
    }

    stream += `/F1 11 Tf\n`;
    let firstLine = true;
    for (const line of lines) {
      if (firstLine && pages.indexOf(lines) === 0) {
        stream += `0 -30 Td\n`;
        firstLine = false;
      } else {
        stream += `0 -18 Td\n`;
      }

      if (line.startsWith("##")) {
        stream += `/F2 14 Tf\n(${escapePdf(line.replace("## ", ""))}) Tj\n/F1 11 Tf\n`;
      } else if (line.startsWith("- ")) {
        stream += `(  \\267 ${escapePdf(line.slice(2))}) Tj\n`;
      } else {
        stream += `(${escapePdf(line)}) Tj\n`;
      }
    }
    stream += "ET\n";

    const streamBytes = new TextEncoder().encode(stream);
    const contentObj = addObj(
      `<< /Length ${streamBytes.length} >>\nstream\n${stream}endstream`
    );

    const pageObj = addObj(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${contentObj} 0 R /Resources << /Font << /F1 3 0 R /F2 ${fontBoldObj} 0 R >> >> >>`
    );
    pageObjIds.push(pageObj);
  }

  // Update pages object
  const kidsStr = pageObjIds.map((id) => `${id} 0 R`).join(" ");
  objects[pagesObjIdx] = `2 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${pageObjIds.length} >>\nendobj\n`;

  // Build PDF
  let pdf = "%PDF-1.4\n";
  for (let i = 0; i < objects.length; i++) {
    offsets[i] = pdf.length;
    pdf += objects[i];
  }
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objCount + 1}\n0000000000 65535 f \n`;
  for (let i = 0; i < objCount; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}

function escapePdf(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[àáâã]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõ]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ÀÁ]/g, "A")
    .replace(/[ÈÉ]/g, "E");
}

// Asset definitions with real content
const assets: Record<string, { filename: string; contentType: string; generate: () => Uint8Array }> = {
  "sales-deck-empire.pdf": {
    filename: "sales-deck-empire.pdf",
    contentType: "application/pdf",
    generate: () =>
      createPdf("Sales Deck Empire", [
        [
          "## Il Problema",
          "",
          "- I ristoratori pagano fino al 30% di commissioni ai marketplace",
          "- JustEat, Glovo, Deliveroo trattengono in media il 25-35%",
          "- I clienti non sono del ristoratore ma della piattaforma",
          "- Zero controllo su branding, prezzi e comunicazione",
          "",
          "## La Soluzione: Empire",
          "",
          "- App proprietaria white-label installabile come nativa",
          "- Solo 2% di fee sulle transazioni (15x meno dei marketplace)",
          "- Pagamento unico da 1.997 euro, zero canoni mensili",
          "- Il ristoratore possiede i suoi clienti e i suoi dati",
        ],
        [
          "## Funzionalita Chiave",
          "",
          "- AI Menu Creator: foto del menu -> catalogo digitale in 60 secondi",
          "- Kitchen View: ordini in tempo reale con notifiche sonore",
          "- Review Shield: solo recensioni 4-5 stelle su Google",
          "- Panic Mode: modifica tutti i prezzi con uno slider",
          "- Vault Fiscale: chiavi API criptate AES-256",
          "- PWA White Label: logo, colori, dominio personalizzato",
          "",
          "## ROI Garantito",
          "",
          "- Ristorante con 500 ordini/mese a 25 euro:",
          "  Risparmio annuo: oltre 40.000 euro",
          "  ROI in meno di 3 settimane",
        ],
        [
          "## Confronto Diretto",
          "",
          "- JustEat: 30% commissioni = 3.750 euro/mese su 12.500 euro",
          "- Empire: 2% fee = 250 euro/mese su 12.500 euro",
          "- Risparmio mensile: 3.500 euro",
          "- Risparmio annuo: 42.000 euro",
          "",
          "## Prossimi Passi",
          "",
          "- 1. Mostra la demo live al ristoratore",
          "- 2. Calcola il ROI personalizzato",
          "- 3. Proponi il piano di pagamento (unica soluzione o 5 rate)",
          "- 4. Chiudi la vendita e guadagna 997 euro",
          "",
          "## Contatti",
          "- Email: partner@empire-suite.it",
          "- Telefono: +39 06 1234 5678",
        ],
      ]),
  },

  "script-vendita.pdf": {
    filename: "script-vendita.pdf",
    contentType: "application/pdf",
    generate: () =>
      createPdf("Script di Vendita Empire", [
        [
          "## Apertura Chiamata a Freddo",
          "",
          "Buongiorno, parlo con il titolare del ristorante [NOME]?",
          "Mi chiamo [TUO NOME], la chiamo da Empire.",
          "Le rubo solo 90 secondi.",
          "",
          "Sa quanto paga al mese in commissioni a JustEat o Glovo?",
          "Con 500 ordini al mese, parliamo di circa 3.500 euro al mese",
          "che finiscono nelle tasche della piattaforma.",
          "",
          "## La Proposta",
          "",
          "E se le dicessi che puo avere la SUA app di ordinazione,",
          "col SUO brand, e pagare solo il 2% invece del 30%?",
          "",
          "Un investimento unico di 1.997 euro, zero canoni mensili.",
          "Si ripaga in meno di 3 settimane.",
        ],
        [
          "## Gestione Obiezioni Rapida",
          "",
          "- 'Costa troppo' -> Si ripaga in 3 settimane. Dopo e tutto guadagno.",
          "- 'Non ho tempo' -> Il setup richiede 10 minuti. L'IA fa tutto.",
          "- 'Ho gia JustEat' -> Non devi lasciarlo. Sposti gradualmente.",
          "- 'I miei clienti usano JustEat' -> Col QR sui tavoli migrano subito.",
          "",
          "## Chiusura",
          "",
          "Le propongo questo: le faccio vedere una demo di 5 minuti.",
          "Se non la convince, ci salutiamo senza impegno.",
          "Quando sarebbe disponibile per una videochiamata veloce?",
          "",
          "## Follow-up (dopo 3 giorni)",
          "",
          "Buongiorno [NOME], sono [TUO NOME] di Empire.",
          "Le avevo mostrato la soluzione per risparmiare sulle commissioni.",
          "Ha avuto modo di rifletterci? Posso rispondere a qualsiasi dubbio.",
        ],
      ]),
  },

  "obiezioni-risposte.pdf": {
    filename: "obiezioni-risposte.pdf",
    contentType: "application/pdf",
    generate: () =>
      createPdf("Obiezioni e Risposte - Guida Partner", [
        [
          "## Le 15 Obiezioni Piu Comuni",
          "",
          "## 1. 'Costa troppo'",
          "- Con 500 ordini/mese risparmi 3.500 euro/mese vs JustEat",
          "- ROI in meno di 3 settimane. Dopo e tutto profitto netto",
          "",
          "## 2. 'Non ho tempo per gestire un'app'",
          "- Setup in 10 minuti: carichi una foto del menu e l'IA fa tutto",
          "- Gestione ordini identica a quella che fai gia con JustEat",
          "",
          "## 3. 'I miei clienti usano solo JustEat'",
          "- Il QR Code sui tavoli converte il 60% dei clienti in 3 mesi",
          "- Ogni ordine spostato = 28% di risparmio netto immediato",
          "",
          "## 4. 'Non mi fido della tecnologia'",
          "- Stessa tecnologia di Starbucks e McDonald's (PWA)",
          "- Supporto tecnico dedicato incluso nel prezzo",
        ],
        [
          "## 5. 'Ho gia un sito web'",
          "- Un sito non prende ordini, non gestisce cucina, non fidelizza",
          "- Empire e un sistema completo, non solo un sito",
          "",
          "## 6. 'Posso farlo da solo con WordPress'",
          "- Costo sviluppo custom: 15.000-30.000 euro + manutenzione",
          "- Empire: 1.997 euro tutto incluso, aggiornamenti automatici",
          "",
          "## 7. 'Devo parlarne col mio socio'",
          "- Perfetto! Organizziamo una demo insieme cosi vedete entrambi",
          "",
          "## 8. 'Ho un contratto con Glovo/JustEat'",
          "- Non devi rescindere. Usi entrambi e migri gradualmente",
          "- In 6 mesi sarai indipendente con i TUOI clienti",
          "",
          "## 9. 'E se non funziona?'",
          "- Demo gratuita: la provi prima di decidere",
          "- 150+ ristoranti gia attivi con rating 4.9 stelle",
        ],
        [
          "## 10. 'Il 2% e comunque un costo'",
          "- Copre infrastruttura, IA, aggiornamenti e supporto",
          "- Su 12.500 euro/mese = 250 euro vs 3.750 di JustEat",
          "",
          "## 11. 'Non ho molti ordini delivery'",
          "- Empire gestisce anche ordini al tavolo e takeaway",
          "- Piu canali = piu ricavi, meno stress in cucina",
          "",
          "## 12. 'Preferisco i contanti'",
          "- Empire supporta pagamento alla consegna + carta",
          "- I pagamenti online riducono i no-show del 90%",
          "",
          "## 13. 'Ho paura delle recensioni negative'",
          "- Review Shield filtra le 1-3 stelle nel tuo archivio privato",
          "- Solo le migliori compaiono su Google",
          "",
          "## 14. 'Non so usare la tecnologia'",
          "- Se sai usare Instagram, sai usare Empire",
          "",
          "## 15. 'Ci devo pensare'",
          "- Ogni giorno senza Empire = 115 euro regalati ai marketplace",
          "- Calcoliamolo insieme col nostro calcolatore ROI",
        ],
      ]),
  },

  "logo-bakery-demo.png": {
    filename: "logo-bakery-demo.png",
    contentType: "image/png",
    generate: () => {
      // Generate a minimal valid PNG (1x1 gold pixel as placeholder)
      // In practice this should be a real logo
      const png = new Uint8Array([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
        0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, // IHDR
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde,
        0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, 0x54, // IDAT
        0x08, 0xd7, 0x63, 0xf8, 0xcf, 0x80, 0x00, 0x00, 0x01, 0x01, 0x00, 0x05,
        0x18, 0xd8, 0x4e, 0x2e,
        0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, // IEND
        0xae, 0x42, 0x60, 0x82,
      ]);
      return png;
    },
  },

  "branding-kit.zip": {
    filename: "branding-kit.zip",
    contentType: "application/zip",
    generate: () => {
      // Generate a minimal valid ZIP with a README.txt
      const filename = "README.txt";
      const content = new TextEncoder().encode(
        "Empire Branding Kit\n\n" +
        "Colore Primario: #C8963E (Gold)\n" +
        "Colore Background: #0D0A06 (Nero)\n" +
        "Font Display: Playfair Display\n" +
        "Font Body: Inter\n\n" +
        "Logo disponibile in: PNG, SVG\n" +
        "Utilizzo: Solo per materiali Partner autorizzati.\n\n" +
        "(c) 2026 Empire Restaurant Suite"
      );

      const crc32 = computeCrc32(content);
      const now = new Date();
      const dosTime = ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xffff;
      const dosDate = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xffff;

      const fnBytes = new TextEncoder().encode(filename);
      const localHeader = new Uint8Array(30 + fnBytes.length + content.length);
      const dv = new DataView(localHeader.buffer);
      dv.setUint32(0, 0x04034b50, true); // local file header sig
      dv.setUint16(4, 20, true); // version needed
      dv.setUint16(6, 0, true); // flags
      dv.setUint16(8, 0, true); // compression: stored
      dv.setUint16(10, dosTime, true);
      dv.setUint16(12, dosDate, true);
      dv.setUint32(14, crc32, true);
      dv.setUint32(18, content.length, true); // compressed size
      dv.setUint32(22, content.length, true); // uncompressed size
      dv.setUint16(26, fnBytes.length, true);
      dv.setUint16(28, 0, true); // extra field length
      localHeader.set(fnBytes, 30);
      localHeader.set(content, 30 + fnBytes.length);

      const cdOffset = localHeader.length;
      const centralDir = new Uint8Array(46 + fnBytes.length);
      const cd = new DataView(centralDir.buffer);
      cd.setUint32(0, 0x02014b50, true); // central dir sig
      cd.setUint16(4, 20, true); // version made by
      cd.setUint16(6, 20, true); // version needed
      cd.setUint16(8, 0, true); // flags
      cd.setUint16(10, 0, true); // compression
      cd.setUint16(12, dosTime, true);
      cd.setUint16(14, dosDate, true);
      cd.setUint32(16, crc32, true);
      cd.setUint32(20, content.length, true);
      cd.setUint32(24, content.length, true);
      cd.setUint16(28, fnBytes.length, true);
      cd.setUint16(30, 0, true);
      cd.setUint16(32, 0, true);
      cd.setUint16(34, 0, true);
      cd.setUint16(36, 0, true);
      cd.setUint32(38, 32, true); // external attrs
      cd.setUint32(42, 0, true); // local header offset
      centralDir.set(fnBytes, 46);

      const eocd = new Uint8Array(22);
      const ev = new DataView(eocd.buffer);
      ev.setUint32(0, 0x06054b50, true);
      ev.setUint16(4, 0, true);
      ev.setUint16(6, 0, true);
      ev.setUint16(8, 1, true); // entries on disk
      ev.setUint16(10, 1, true); // total entries
      ev.setUint32(12, centralDir.length, true);
      ev.setUint32(16, cdOffset, true);
      ev.setUint16(20, 0, true);

      const result = new Uint8Array(localHeader.length + centralDir.length + eocd.length);
      result.set(localHeader, 0);
      result.set(centralDir, localHeader.length);
      result.set(eocd, localHeader.length + centralDir.length);
      return result;
    },
  },
};

function computeCrc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const results: { file: string; status: string }[] = [];

    for (const [key, asset] of Object.entries(assets)) {
      try {
        const fileData = asset.generate();

        const { error } = await supabaseAdmin.storage
          .from("partner-assets")
          .upload(asset.filename, fileData, {
            contentType: asset.contentType,
            upsert: true,
          });

        if (error) {
          results.push({ file: key, status: `error: ${error.message}` });
        } else {
          results.push({ file: key, status: "uploaded" });
        }
      } catch (e) {
        results.push({ file: key, status: `error: ${e.message}` });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
