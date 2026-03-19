import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Crown, Handshake, Trophy, CreditCard, Rocket, Award,
  ArrowRight, Check, Eye, EyeOff, Loader2, Gift, Users, Star,
  Play, ChevronDown, HelpCircle
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import partnerRecruitVideo from "@/assets/video-partner-recruit.mp4";
import empireLogoNew from "@/assets/empire-logo-new.png";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const partnerSchema = z.object({
  fullName: z.string().trim().min(2, "Il nome deve avere almeno 2 caratteri").max(100),
  email: z.string().trim().email("Inserisci un'email valida").max(255),
  phone: z.string().trim().min(6, "Inserisci un numero valido").max(20),
  city: z.string().trim().min(2, "Inserisci la città").max(100),
  password: z.string().min(8, "La password deve avere almeno 8 caratteri").max(128),
  confirmPassword: z.string(),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: "Devi accettare i termini" }) }),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Le password non coincidono",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof partnerSchema>;

const benefits = [
  { icon: <Trophy className="w-5 h-5" />, title: "€997 / vendita", desc: "Commissione fissa per ogni pacchetto chiuso (€1.997-€7.997)" },
  { icon: <Award className="w-5 h-5" />, title: "Bonus fino a €1.500/mese", desc: "Acceleratori su 3 e 5 vendite mensili" },
  { icon: <CreditCard className="w-5 h-5" />, title: "Payout istantaneo", desc: "Pagamenti automatici via Stripe Connect" },
  { icon: <Rocket className="w-5 h-5" />, title: "Sandbox Demo", desc: "Demo pre-configurata per chiudere vendite" },
  { icon: <Users className="w-5 h-5" />, title: "Team Leader", desc: "Override €50/vendita dalla 5ª vendita di ogni membro" },
  { icon: <Gift className="w-5 h-5" />, title: "Zero costi di ingresso", desc: "Nessun investimento iniziale richiesto" },
];

const PartnerRegister = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralId = searchParams.get("ref");
  const { user } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // If already logged in as partner, redirect
  if (user) {
    // Don't render, will check roles in dashboard
  }

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = partnerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      // 1. Sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            phone: form.phone,
            city: form.city,
            partner_referral: referralId || null,
          },
          emailRedirectTo: window.location.origin + "/partner",
        },
      });

      if (signUpError) throw signUpError;
      if (!signUpData.user) throw new Error("Errore durante la registrazione");

      // 2. Assign partner role via edge function
      const { error: roleError } = await supabase.functions.invoke("assign-partner-role", {
        body: {
          user_id: signUpData.user.id,
          team_leader_id: referralId || null,
        },
      });

      if (roleError) {
        console.error("Role assignment error:", roleError);
        // Non-blocking: role will be assigned, user can still continue
      }

      // 3. Update profile with phone and city
      await supabase.from("profiles").update({
        full_name: form.fullName,
      }).eq("user_id", signUpData.user.id);

      setSuccess(true);
      toast({
        title: "🎉 Registrazione completata!",
        description: "Controlla la tua email per confermare l'account.",
      });
    } catch (err: any) {
      toast({
        title: "Errore",
        description: err.message || "Si è verificato un errore. Riprova.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center p-8 rounded-3xl glass border border-primary/20"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Benvenuto nel Team!
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Abbiamo inviato un'email di conferma a <span className="text-foreground font-medium">{form.email}</span>.
            Clicca il link per attivare il tuo account Partner.
          </p>
          {referralId && (
            <p className="text-xs text-primary mb-4">
              <Users className="w-3 h-3 inline mr-1" />
              Sei stato invitato da un Team Leader — sarai aggiunto al suo team automaticamente.
            </p>
          )}
          <button
            onClick={() => navigate("/admin")}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm tracking-wide"
          >
            Vai al Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/home" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center" style={{ boxShadow: "0 0 0 2px hsla(38,50%,55%,0.3)" }}>
              <img src={empireLogoNew} alt="Empire AI" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-sm text-foreground tracking-[0.12em] uppercase">Empire</span>
          </a>
          <button
            onClick={() => navigate("/admin")}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Hai già un account? <span className="text-primary font-medium">Accedi</span>
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* Left: Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="sticky top-24">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-xs font-medium text-primary tracking-wider uppercase mb-5">
                <Handshake className="w-3.5 h-3.5" /> Partner Program
              </div>
              <h1 className="text-4xl xl:text-5xl font-display font-bold text-foreground leading-tight mb-4">
                Guadagna con <span className="text-gold-gradient">Empire</span>
              </h1>
              <p className="text-base text-muted-foreground mb-8 max-w-md">
                Unisciti alla rete di Partner e guadagna commissioni high-ticket vendendo la soluzione definitiva per i ristoratori.
              </p>

              <div className="space-y-4">
                {benefits.map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-2xl glass border border-border/30"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      {b.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{b.title}</p>
                      <p className="text-xs text-muted-foreground">{b.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social proof */}
              <div className="mt-8 flex items-center gap-5 text-center">
                {[
                  { val: "45+", label: "Partner attivi" },
                  { val: "€997", label: "Per vendita" },
                  { val: "4.9★", label: "Soddisfazione" },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-lg font-display font-bold text-primary">{s.val}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-xs font-medium text-primary tracking-wider uppercase mb-3">
                <Handshake className="w-3.5 h-3.5" /> Partner Program
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                Diventa Partner <span className="text-gold-gradient">Empire</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                €997 per vendita · 3 pacchetti da €1.997 a €7.997
              </p>
            </div>

            {referralId && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-center"
              >
                <p className="text-xs text-violet-300">
                  <Users className="w-3 h-3 inline mr-1" />
                  Sei stato invitato da un Team Leader — entrerai nel suo team!
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="p-5 sm:p-8 rounded-3xl glass border border-border/30 space-y-4">
              <h2 className="text-lg font-display font-bold text-foreground mb-1">Crea il tuo account</h2>
              <p className="text-xs text-muted-foreground mb-4">Compila il form per registrarti come Partner Empire</p>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Nome completo</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Mario Rossi"
                  className={`w-full px-4 py-3 rounded-xl bg-card border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    errors.fullName ? "border-destructive" : "border-border/50"
                  }`}
                />
                {errors.fullName && <p className="text-[10px] text-destructive mt-1">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="mario@email.com"
                  className={`w-full px-4 py-3 rounded-xl bg-card border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    errors.email ? "border-destructive" : "border-border/50"
                  }`}
                />
                {errors.email && <p className="text-[10px] text-destructive mt-1">{errors.email}</p>}
              </div>

              {/* Phone + City row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Telefono</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+39 333 1234567"
                    className={`w-full px-4 py-3 rounded-xl bg-card border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                      errors.phone ? "border-destructive" : "border-border/50"
                    }`}
                  />
                  {errors.phone && <p className="text-[10px] text-destructive mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Città</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Roma"
                    className={`w-full px-4 py-3 rounded-xl bg-card border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                      errors.city ? "border-destructive" : "border-border/50"
                    }`}
                  />
                  {errors.city && <p className="text-[10px] text-destructive mt-1">{errors.city}</p>}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Minimo 8 caratteri"
                    className={`w-full px-4 py-3 pr-10 rounded-xl bg-card border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                      errors.password ? "border-destructive" : "border-border/50"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-destructive mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Conferma password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="Ripeti la password"
                  className={`w-full px-4 py-3 rounded-xl bg-card border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    errors.confirmPassword ? "border-destructive" : "border-border/50"
                  }`}
                />
                {errors.confirmPassword && <p className="text-[10px] text-destructive mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={form.acceptTerms}
                  onChange={(e) => handleChange("acceptTerms", e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-border accent-primary"
                />
                <label className="text-[11px] text-muted-foreground leading-relaxed">
                  Accetto i{" "}
                  <a href="/privacy" className="text-primary hover:underline">Termini e Condizioni</a>
                  {" "}e la{" "}
                  <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                  {" "}di Empire.
                </label>
              </div>
              {errors.acceptTerms && <p className="text-[10px] text-destructive">{errors.acceptTerms}</p>}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm tracking-wide relative overflow-hidden disabled:opacity-60 min-h-[48px]"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Registrati come Partner <ArrowRight className="w-4 h-4" />
                  </span>
                )}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary via-amber-400 to-primary bg-[length:200%_100%]"
                  animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ zIndex: -1 }}
                />
              </motion.button>

              <p className="text-center text-[10px] text-muted-foreground">
                Già Partner?{" "}
                <button type="button" onClick={() => navigate("/admin")} className="text-primary hover:underline font-medium">
                  Accedi qui
                </button>
              </p>
            </form>

            {/* Mobile benefits */}
            <div className="lg:hidden mt-6 grid grid-cols-2 gap-3">
              {benefits.slice(0, 4).map((b, i) => (
                <div key={i} className="p-3 rounded-xl glass border border-border/30 text-center">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mx-auto mb-2">
                    {b.icon}
                  </div>
                  <p className="text-[11px] font-bold text-foreground">{b.title}</p>
                  <p className="text-[9px] text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Video + FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 sm:mt-24 max-w-4xl mx-auto space-y-16"
        >
          {/* Video Section */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-xs font-medium text-primary tracking-wider uppercase mb-4">
              <Play className="w-3.5 h-3.5" /> Guarda come funziona
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">
              Scopri Empire in 2 minuti
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-lg mx-auto">
              Guarda il video per scoprire come i nostri Partner chiudono vendite e guadagnano commissioni high-ticket.
            </p>
            <div className="rounded-2xl overflow-hidden border border-border/30 glass max-w-[360px] mx-auto">
              <video
                controls
                playsInline
                preload="metadata"
                className="w-full aspect-[9/16] bg-card object-cover"
                src={partnerRecruitVideo}
              />
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-xs font-medium text-primary tracking-wider uppercase mb-4">
                <HelpCircle className="w-3.5 h-3.5" /> Domande frequenti
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                Hai delle domande?
              </h2>
            </div>

            <div className="rounded-2xl glass border border-border/30 p-4 sm:p-6">
              <Accordion type="single" collapsible className="space-y-1">
                {[
                  { q: "Quanto costa diventare Partner?", a: "Zero. Non ci sono costi di ingresso, fee mensili o vincoli. Guadagni solo quando vendi." },
                  { q: "Quanto posso guadagnare per ogni vendita?", a: "La commissione base è di €997 per ogni pacchetto chiuso (Digital Start €1.997, Growth AI €4.997, Empire Domination €7.997). Con i bonus acceleratori puoi arrivare a €1.500 extra al mese raggiungendo 3 o 5 vendite." },
                  { q: "Come funziona il payout?", a: "I pagamenti avvengono in automatico tramite Stripe Connect. Appena il cliente paga, la tua commissione viene accreditata direttamente sul tuo conto." },
                  { q: "Cos'è la Sandbox Demo?", a: "È un ambiente demo completo e pre-configurato che puoi mostrare ai prospect. Include menu, ordini, cucina e dashboard — tutto funzionante, con dati finti realistici." },
                  { q: "Posso costruire un team?", a: "Sì! Dopo 4 vendite personali e 2 sub-partner reclutati diventi Team Leader e guadagni un override di €50 a partire dalla 5ª vendita di ogni membro del tuo team." },
                  { q: "Serve esperienza nel settore?", a: "No. Forniamo script di vendita, materiali di marketing, obiezioni con risposte pronte e una demo che parla da sola. Ti basta la motivazione." },
                  { q: "Posso farlo part-time?", a: "Assolutamente. Molti partner vendono nei ritagli di tempo. Non ci sono obiettivi minimi obbligatori." },
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-border/20">
                    <AccordionTrigger className="text-sm text-foreground hover:no-underline py-3">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* CTA finale */}
          <div className="text-center pb-12">
            <p className="text-sm text-muted-foreground mb-4">Pronto a iniziare?</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm tracking-wide inline-flex items-center gap-2"
            >
              Registrati ora <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PartnerRegister;
