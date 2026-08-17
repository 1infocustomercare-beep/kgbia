import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";
import { supabase } from "@/integrations/supabase/client";
import { getReferralSlug } from "@/hooks/useReferralCapture";
import { toast } from "sonner";
import { ArrowLeft, Send } from "lucide-react";

export default function CustomProjectBrief() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    sector: "",
    brandStory: "",
    toneOfVoice: "",
    competitors: "",
    goals: "",
    target: "",
    contents: "",
    references: "",
    features: [] as string[],
    budgetRange: "",
    timing: "",
  });

  const toggleFeature = (f: string) => {
    setForm((p) => ({
      ...p,
      features: p.features.includes(f)
        ? p.features.filter((x) => x !== f)
        : [...p.features, f],
    }));
  };

  const submit = async () => {
    if (!form.businessName || !form.contactName || !form.contactEmail) {
      toast.error("Compila i campi obbligatori");
      return;
    }
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
      const { error } = await supabase.from("custom_project_briefs").insert({
        submitted_by: userRes.user?.id ?? null,
        seller_id: sellerId,
        business_name: form.businessName,
        contact_name: form.contactName,
        contact_email: form.contactEmail,
        contact_phone: form.contactPhone || null,
        sector: form.sector || null,
        budget_range: form.budgetRange || null,
        payload: {
          brandStory: form.brandStory,
          toneOfVoice: form.toneOfVoice,
          competitors: form.competitors,
          goals: form.goals,
          target: form.target,
          contents: form.contents,
          references: form.references,
          features: form.features,
          timing: form.timing,
        },
      });
      if (error) throw error;
      toast.success("Brief inviato! Ti contatteremo entro 24h.");
      navigate("/");
    } catch (e: any) {
      toast.error(e.message || "Errore");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg bg-white text-black text-sm";
  const areaCls = "w-full px-3 py-2 rounded-lg bg-white text-black text-sm min-h-[80px]";
  const label = "text-xs font-semibold uppercase tracking-wider opacity-90 block mb-1";

  const FEATURES = [
    "Prenotazioni online",
    "E-commerce",
    "Area riservata clienti",
    "Multilingua",
    "Integrazioni CRM",
    "App mobile",
    "Blog / Magazine",
    "WhatsApp / Chatbot",
    "Analytics avanzate",
  ];

  return (
    <>
      <PrestigeTheme />
      <div className="prestige-root prestige-section min-h-screen p-4 sm:p-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="text-sm opacity-70 hover:opacity-100 mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-2">
              Pacchetto Completo — Su Misura
            </h1>
            <p className="opacity-80">
              Raccontaci il tuo progetto. Ti ricontattiamo entro 24h con un preventivo dedicato.
            </p>
          </div>

          <div className="space-y-6">
            {/* Contact */}
            <section className="rounded-2xl border border-white/10 p-5 bg-white/5 space-y-3">
              <h2 className="font-bold text-lg">Contatti</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><span className={label}>Nome attività *</span><input className={inputCls} value={form.businessName} onChange={e=>setForm({...form,businessName:e.target.value})} /></div>
                <div><span className={label}>Settore</span><input className={inputCls} value={form.sector} onChange={e=>setForm({...form,sector:e.target.value})} placeholder="es. Ristorazione, Beauty..." /></div>
                <div><span className={label}>Referente *</span><input className={inputCls} value={form.contactName} onChange={e=>setForm({...form,contactName:e.target.value})} /></div>
                <div><span className={label}>Email *</span><input type="email" className={inputCls} value={form.contactEmail} onChange={e=>setForm({...form,contactEmail:e.target.value})} /></div>
                <div><span className={label}>Telefono / WhatsApp</span><input className={inputCls} value={form.contactPhone} onChange={e=>setForm({...form,contactPhone:e.target.value})} /></div>
              </div>
            </section>

            {/* Brand */}
            <section className="rounded-2xl border border-white/10 p-5 bg-white/5 space-y-3">
              <h2 className="font-bold text-lg">Il tuo brand</h2>
              <div><span className={label}>Storia / valori</span><textarea className={areaCls} value={form.brandStory} onChange={e=>setForm({...form,brandStory:e.target.value})} /></div>
              <div><span className={label}>Tone of voice</span><input className={inputCls} value={form.toneOfVoice} onChange={e=>setForm({...form,toneOfVoice:e.target.value})} placeholder="Elegante, diretto, giocoso..." /></div>
              <div><span className={label}>Competitor principali</span><textarea className={areaCls} value={form.competitors} onChange={e=>setForm({...form,competitors:e.target.value})} /></div>
            </section>

            {/* Goals */}
            <section className="rounded-2xl border border-white/10 p-5 bg-white/5 space-y-3">
              <h2 className="font-bold text-lg">Obiettivi</h2>
              <div><span className={label}>Cosa vuoi ottenere</span><textarea className={areaCls} value={form.goals} onChange={e=>setForm({...form,goals:e.target.value})} placeholder="Aumentare prenotazioni, vendite online..." /></div>
              <div><span className={label}>Target / area geografica</span><textarea className={areaCls} value={form.target} onChange={e=>setForm({...form,target:e.target.value})} /></div>
            </section>

            {/* Contents */}
            <section className="rounded-2xl border border-white/10 p-5 bg-white/5 space-y-3">
              <h2 className="font-bold text-lg">Contenuti disponibili</h2>
              <div><span className={label}>Testi, foto, video, servizi/prodotti</span><textarea className={areaCls} value={form.contents} onChange={e=>setForm({...form,contents:e.target.value})} placeholder="Descrivi o incolla link a Drive/Dropbox..." /></div>
              <div><span className={label}>Riferimenti / siti che ti ispirano</span><textarea className={areaCls} value={form.references} onChange={e=>setForm({...form,references:e.target.value})} placeholder="3-5 URL" /></div>
            </section>

            {/* Features */}
            <section className="rounded-2xl border border-white/10 p-5 bg-white/5 space-y-3">
              <h2 className="font-bold text-lg">Funzionalità richieste</h2>
              <div className="flex flex-wrap gap-2">
                {FEATURES.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFeature(f)}
                    className={`inline-flex items-center min-h-[40px] px-4 py-2 rounded-full text-xs border transition-all ${
                      form.features.includes(f)
                        ? "bg-[hsl(var(--pr-gold))] text-[hsl(var(--pr-emerald-deep))] border-transparent"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </section>

            {/* Budget */}
            <section className="rounded-2xl border border-white/10 p-5 bg-white/5 space-y-3">
              <h2 className="font-bold text-lg">Budget & timing</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <span className={label}>Budget indicativo</span>
                  <select className={inputCls} value={form.budgetRange} onChange={e=>setForm({...form,budgetRange:e.target.value})}>
                    <option value="">Seleziona</option>
                    <option value="3-5k">€3.000 — €5.000</option>
                    <option value="5-10k">€5.000 — €10.000</option>
                    <option value="10-20k">€10.000 — €20.000</option>
                    <option value="20k+">Oltre €20.000</option>
                  </select>
                </div>
                <div><span className={label}>Timing desiderato</span><input className={inputCls} value={form.timing} onChange={e=>setForm({...form,timing:e.target.value})} placeholder="es. entro 60 giorni" /></div>
              </div>
            </section>

            <button
              disabled={loading}
              onClick={submit}
              className="w-full h-12 rounded-lg bg-gradient-to-r from-[hsl(var(--pr-gold-light))] to-[hsl(var(--pr-gold-deep))] text-[hsl(var(--pr-emerald-deep))] font-bold flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
              {loading ? "Invio..." : "Invia richiesta"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
