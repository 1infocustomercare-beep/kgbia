import teamCeo from "@/assets/team/team-ceo.jpg";
import teamCto from "@/assets/team/team-cto.jpg";
import teamDesign from "@/assets/team/team-design.jpg";
import teamSales from "@/assets/team/team-sales.jpg";
import teamAi from "@/assets/team/team-ai.jpg";
import teamSuccess from "@/assets/team/team-success.jpg";

const MEMBERS = [
  { img: teamCeo, name: "Kevin Bernardini", role: "Founder & CEO", bio: "Visione, strategia, trattative chiave. 10 anni a costruire prodotti SaaS." },
  { img: teamCto, name: "Marco R.", role: "CTO & AI Lead", bio: "Architettura, sicurezza, modelli LLM custom per ogni settore." },
  { img: teamDesign, name: "Giulia M.", role: "Creative Director", bio: "Identità, mockup iPhone, esperienze utente che convertono." },
  { img: teamSales, name: "Luca F.", role: "Head of Sales", bio: "Onboarding clienti enterprise, consulenza go-to-market." },
  { img: teamAi, name: "Sara P.", role: "AI Specialist", bio: "Training agent verticali, prompt engineering, tono di voce brand." },
  { img: teamSuccess, name: "Chiara V.", role: "Head of Customer Success", bio: "Account manager dedicati, supporto e crescita continua." },
];

export default function V2Team() {
  return (
    <section id="v2-team" className="v2-section relative">
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="v2-eyebrow">DIETRO EMPIRE</div>
          <h2 className="v2-display mt-3 text-4xl font-semibold sm:text-5xl">
            Persone vere. <span className="v2-gold-text">Codice serio</span>.
          </h2>
          <div className="v2-divider mx-auto mt-5" />
          <p className="mt-4 text-base" style={{ color: "hsl(var(--v2-text-muted))" }}>
            Un team italiano specializzato in AI, gestionali e design premium.
            Niente outsourcing. Account manager dedicato per ogni cliente Empire Pro.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 lg:gap-6">
          {MEMBERS.map((m) => (
            <div key={m.name} className="v2-card overflow-hidden p-0">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={m.img}
                  alt={m.name}
                  loading="lazy"
                  width={768}
                  height={960}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 50%, hsl(var(--v2-emerald-deep) / 0.95) 100%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="text-base font-semibold">{m.name}</div>
                  <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "hsl(var(--v2-gold-light))" }}>
                    {m.role}
                  </div>
                </div>
              </div>
              <div className="p-4 text-[13px] leading-snug" style={{ color: "hsl(var(--v2-text-muted))" }}>
                {m.bio}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
