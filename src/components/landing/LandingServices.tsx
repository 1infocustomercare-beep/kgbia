const FEATURES = [
  { icon: "📱", title: "App & Web App Dedicate", desc: "Applicazioni installabili con il TUO brand, dominio e colori. Design premium white-label.", pills: ["White Label", "PWA", "Su misura"] },
  { icon: "🧠", title: "Intelligenza Artificiale", desc: "98+ agenti IA che automatizzano marketing, gestione clienti, analisi dati e fatturazione.", pills: ["98+ Agenti", "24/7", "Predittivi"] },
  { icon: "📊", title: "Gestionale Completo", desc: "CRM, prenotazioni, ordini, inventario, staff, fatturazione elettronica, analytics, Stripe.", pills: ["CRM", "Fatturazione", "Stripe"] },
  { icon: "🚀", title: "Marketing Automatico", desc: "Email, social, WhatsApp auto, review management, SEO — generato dall'IA continuamente.", pills: ["Email", "WhatsApp", "Review Shield"] },
];
export default function LandingServices() {
  return (
    <section className="py-16 sm:py-[100px]" id="servizi" style={{ background: "linear-gradient(180deg,#020204 0%,#0d0d1a 50%,#020204 100%)" }}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-4 before:content-[''] before:w-5 before:h-[1.5px] before:bg-[#7eb7be]">TUTTO IN UN'UNICA PIATTAFORMA</span>
          <h2 className="text-[#f0f0f5] mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 700 }}>Creiamo App, Siti e Gestionali <em className="not-italic" style={{ background: "linear-gradient(135deg,#7eb7be,#6c3ce0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Potenziati dall'IA</em></h2>
          <p className="text-[rgba(240,240,245,0.55)] max-w-[620px] mx-auto text-[15px] leading-[1.7] mb-10">Applicazioni dedicate, web app e gestionali completi — personalizzati al 100% per il tuo settore.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <div key={i} className="rounded-3xl p-8 relative overflow-hidden transition-all duration-500 group hover:translate-y-[-6px]" style={{ background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" style={{ background: "linear-gradient(135deg,#7eb7be,#6c3ce0)" }} />
              <div className="text-[2.4rem] mb-4">{f.icon}</div>
              <h3 className="text-[1.15rem] font-bold text-[#f0f0f5] mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{f.title}</h3>
              <p className="text-[13px] text-[rgba(240,240,245,0.55)] leading-[1.7]">{f.desc}</p>
              <div className="flex gap-1.5 flex-wrap mt-4">{f.pills.map(p => (<span key={p} className="text-[10px] px-2.5 py-1 rounded-lg font-semibold text-[#7eb7be]" style={{ background: "rgba(126,183,190,0.12)", border: "1px solid rgba(126,183,190,0.1)" }}>{p}</span>))}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
