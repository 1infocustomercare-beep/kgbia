/* ─── Seller export utilities: CSV download + bulk WhatsApp link generation ─── */

import type { PipelineLead } from "@/hooks/useSellerPipeline";

/* CSV escape: wrap if contains comma/quote/newline, escape quotes */
const csvEscape = (val: any): string => {
  if (val == null) return "";
  const s = String(val);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

export function exportLeadsToCSV(leads: PipelineLead[], filename = "empire-leads.csv") {
  const headers = [
    "Nome", "Settore", "Città", "Indirizzo", "Telefono", "Email", "Sito", "Instagram",
    "Stato", "Score AI", "Rating Google", "Recensioni", "Valore stimato (€)",
    "Ultimo contatto", "Prossimo follow-up", "Note", "Interazioni totali", "Creato il"
  ];
  const rows = leads.map(l => [
    l.name,
    l.sector || "",
    l.city || "",
    l.full_address || "",
    l.phone || "",
    l.email || "",
    l.website || "",
    l.instagram || "",
    l.status,
    l.ai_score ?? "",
    l.google_rating ?? "",
    l.google_reviews ?? "",
    l.estimated_value || 0,
    l.last_contacted_at ? new Date(l.last_contacted_at).toLocaleString("it-IT") : "",
    l.next_followup_at ? new Date(l.next_followup_at).toLocaleString("it-IT") : "",
    (l.notes || "").replace(/\n/g, " | "),
    l.interactions.length,
    new Date(l.created_at).toLocaleString("it-IT"),
  ]);
  const csv = [headers, ...rows].map(r => r.map(csvEscape).join(",")).join("\n");
  // BOM for Excel UTF-8 compatibility
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* Build clean E.164-ish digits for wa.me */
export function normalizePhoneForWa(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  // Italian fallback: 10-digit mobile starting with 3 → prepend 39
  if (/^3\d{9}$/.test(digits)) digits = "39" + digits;
  if (digits.length < 7) return null;
  return digits;
}

export function buildWhatsAppLink(phone: string | null | undefined, message: string): string | null {
  const num = normalizePhoneForWa(phone);
  if (!num) return null;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

/* Default outreach message template for bulk operations */
export function buildOutreachMessage(lead: PipelineLead, demoLink: string): string {
  const sectorLabel = lead.sector || "la tua attività";
  return [
    `Ciao ${lead.name},`,
    ``,
    `Sono di Empire AI Group. Aiutiamo realtà come ${lead.name} a digitalizzare ${sectorLabel} con un sistema completo: sito, prenotazioni, CRM e AI.`,
    ``,
    `Ti ho preparato una preview personalizzata: ${demoLink}`,
    ``,
    `Hai 3 minuti per darle un'occhiata?`,
  ].join("\n");
}
