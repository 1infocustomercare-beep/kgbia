import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";
import { SECTOR_MOCKUPS } from "@/data/sector-mockups";
import { supabase } from "@/integrations/supabase/client";
import { getReferralSlug } from "@/hooks/useReferralCapture";
import { toast } from "sonner";
import { Check, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

const STEPS = ["Stile", "Brand", "Contatti", "Conferma"];

export default function BasePackagePurchase() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sectorId, setSectorId] = useState<string>(SECTOR_MOCKUPS[0]?.id || "");
  const [variantId, setVariantId] = useState<string>("");
  const [form, setForm] = useState({
    businessName: "",
    primaryColor: "#C8963E",
    logo: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  const sector = useMemo(
    () => SECTOR_MOCKUPS.find((s) => s.id === sectorId),
    [sectorId]
  );
  const variant = useMemo(
    () => sector?.variants.find((v) => v.id === variantId),
    [sector, variantId]
  );

  const canNext =
    (step === 0 && variantId) ||
    (step === 1 && form.businessName) ||
    (step === 2 && form.customerName && form.customerEmail) ||
    step === 3;

  const submit = async () => {
    setLoading(true);
    try {
      const ref = getReferralSlug();
      let sellerId: string | null = null;
      if (ref) {
        const { data } = await supabase
          .from("sellers")
          .select("id")
          .eq("slug", ref)
          .eq("active", true)
          .maybeSingle();
        sellerId = data?.id ?? null;
      }
      const { data: userRes } = await supabase.auth.getUser();
      const { error } = await supabase.from("base_orders").insert({
        user_id: userRes.user?.id ?? null,
        seller_id: sellerId,
        customer_email: form.customerEmail,
        customer_name: form.customerName,
        customer_phone: form.customerPhone || null,
        business_name: form.businessName,
        sector: sectorId,
        variant_id: variantId,
        brand_json: { primaryColor: form.primaryColor, logo: form.logo },
        amount: 1997,
        status: "pending_payment",
      });
      if (error) throw error;
      toast.success("Ordine registrato! Ti contatteremo per il pagamento.");
      navigate("/");
    } catch (e: any) {
      toast.error(e.message || "Errore");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PrestigeTheme />
      <div className="prestige-root prestige-section min-h-screen p-4 sm:p-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="text-sm opacity-70 hover:opacity-100 mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </button>

          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-2">
              Pacchetto Base
            </h1>
            <p className="opacity-80">
              €1.997 una tantum — scegli lo stile, personalizza, ricevi il sito.
            </p>
          </div>

          {/* Progress */}
          <div className="flex justify-center gap-3 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    i <= step
                      ? "bg-[hsl(var(--pr-gold))] text-[hsl(var(--pr-emerald-deep))]"
                      : "bg-white/10"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-xs hidden sm:inline">{s}</span>
              </div>
            ))}
          </div>

          {/* Step content */}
          {step === 0 && (
            <div>
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {SECTOR_MOCKUPS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSectorId(s.id);
                      setVariantId("");
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                      sectorId === s.id
                        ? "bg-[hsl(var(--pr-gold))] text-[hsl(var(--pr-emerald-deep))] border-transparent"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sector?.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariantId(v.id)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                      variantId === v.id
                        ? "border-[hsl(var(--pr-gold))] scale-[1.02]"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={v.screen}
                      alt={v.brand}
                      className="w-full aspect-[9/19] object-cover"
                      loading="lazy"
                    />
                    <div className="p-2 text-left bg-black/40">
                      <div className="text-xs font-bold truncate">{v.brand}</div>
                      <div className="text-[10px] opacity-70 truncate">{v.style}</div>
                    </div>
                    {variantId === v.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[hsl(var(--pr-gold))] flex items-center justify-center">
                        <Check className="w-4 h-4 text-[hsl(var(--pr-emerald-deep))]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="max-w-lg mx-auto space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-1">Nome attività *</label>
                <input
                  className="w-full h-11 px-3 rounded-lg bg-white text-black"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1">Colore primario</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    className="w-14 h-11 rounded-lg cursor-pointer"
                    value={form.primaryColor}
                    onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                  />
                  <input
                    className="flex-1 h-11 px-3 rounded-lg bg-white text-black font-mono"
                    value={form.primaryColor}
                    onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1">URL logo (opzionale)</label>
                <input
                  className="w-full h-11 px-3 rounded-lg bg-white text-black"
                  placeholder="https://..."
                  value={form.logo}
                  onChange={(e) => setForm({ ...form, logo: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-lg mx-auto space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-1">Nome referente *</label>
                <input
                  className="w-full h-11 px-3 rounded-lg bg-white text-black"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1">Email *</label>
                <input
                  type="email"
                  className="w-full h-11 px-3 rounded-lg bg-white text-black"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1">Telefono</label>
                <input
                  className="w-full h-11 px-3 rounded-lg bg-white text-black"
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-lg mx-auto">
              <div className="rounded-2xl border border-white/10 p-6 bg-white/5 space-y-2">
                <h3 className="font-bold text-lg">Riepilogo ordine</h3>
                <div className="text-sm space-y-1 opacity-90">
                  <div>Settore: <strong>{sector?.label}</strong></div>
                  <div>Stile: <strong>{variant?.brand} — {variant?.style}</strong></div>
                  <div>Attività: <strong>{form.businessName}</strong></div>
                  <div>Referente: <strong>{form.customerName}</strong> — {form.customerEmail}</div>
                  <div className="pt-2 border-t border-white/10 text-lg font-bold">
                    Totale: €1.997
                  </div>
                </div>
                <p className="text-xs opacity-70 pt-2">
                  Registrando l'ordine ti contatteremo per il pagamento e la consegna del sito.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-between max-w-lg mx-auto mt-8">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-5 h-11 rounded-lg border border-white/20 hover:bg-white/10 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Indietro
              </button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <button
                disabled={!canNext}
                onClick={() => setStep(step + 1)}
                className="px-6 h-11 rounded-lg bg-gradient-to-r from-[hsl(var(--pr-gold-light))] to-[hsl(var(--pr-gold-deep))] text-[hsl(var(--pr-emerald-deep))] font-bold flex items-center gap-2 disabled:opacity-40"
              >
                Continua <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={submit}
                className="px-6 h-11 rounded-lg bg-gradient-to-r from-[hsl(var(--pr-gold-light))] to-[hsl(var(--pr-gold-deep))] text-[hsl(var(--pr-emerald-deep))] font-bold flex items-center gap-2 disabled:opacity-40"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? "Invio..." : "Conferma ordine"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
