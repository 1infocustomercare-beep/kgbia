import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * DEPRECATED — la pagina /partner/custom-preview è stata unificata.
 *
 * Tutta la generazione (mockup iPhone Suite + sito demo Full Power 1:1)
 * vive ora in due posti dedicati con ruoli chiari:
 *
 *   • /partner/leads        → genera siti demo 1:1 dal mockup (flusso lead → preview → sito)
 *   • /partner/demo-studio  → catalogo mockup approvati + creazione nuovo Mockup Suite
 *
 * Questa rotta sopravvive solo come redirect per non rompere link esistenti
 * (onboarding wizard, coach, vecchi bookmark, link WhatsApp).
 */
export default function PartnerCustomPreviewPage() {
  useEffect(() => {
    toast.info("Custom Preview unificato in Leads & Demo Studio", {
      description:
        "I mockup iPhone si creano dal Demo Studio. I siti demo dal flusso Leads.",
      duration: 4500,
    });
  }, []);

  return <Navigate to="/partner/leads" replace />;
}
