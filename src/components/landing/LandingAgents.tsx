import { useEffect, useRef } from "react";

const AGENTS = [
  { emoji: "🧠", name: "Menu AI / Catalogo AI", desc: "Genera menu e cataloghi da foto. Traduzione multilingua automatica.", tag: "Incluso in Growth", tagType: "gr" },
  { emoji: "📝", name: "Content AI Engine", desc: "Post social, email, copy pubblicitario generato automaticamente.", tag: "Incluso in Growth", tagType: "gr" },
  { emoji: "🤖", name: "Concierge AI", desc: "Chatbot 24/7 addestrato sul tuo business. Risposte, prenotazioni, FAQ.", tag: "Incluso in Empire", tagType: "em" },
  { emoji: "🛡️", name: "Review Shield", desc: "Filtra negative in privato, amplifica 4-5★ su Google.", tag: "Incluso in Empire", tagType: "em" },
  { emoji: "🔍", name: "LeadEngine Scout", desc: "Trova clienti in target da Google Maps e social automaticamente.", tag: "Incluso in Empire", tagType: "em" },
  { emoji: "👻", name: "GhostManager", desc: "Identifica clienti persi e lancia campagne di recupero automatiche.", tag: "Incluso in Empire", tagType: "em" },
  { emoji: "📊", name: "Analytics AI", desc: "Previsioni vendite, insights automatici, suggerimenti data-driven.", tag: "Incluso in Empire", tagType: "em" },
  { emoji: "💬", name: "WhatsApp AI", desc: "Risposte automatiche WhatsApp Business, conferme, reminder.", tag: "€29/mese singolo", tagType: "ad" },
];

const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  gr: { bg: "rgba(126,183,190,0.12)", color: "#7eb7be" },
  em: { bg: "rgba(212,168,85,0.12)", color: "#d4a855" },
  ad: { bg: "rgba(108,60,224,0.12)", color: "#8b5cf6" },
};

export default function LandingAgents() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    let W = 0, H = 0, animId = 0;
    const resize = () => { const p = cv.parentElement; W = cv.width = p?.offsetWidth || 800; H = cv.height = p?.offsetHeight || 600; };
    resize(); window.addEventListener("resize", resize);

    class N { x = 0; y = 0; vx = 0; vy = 0; r = 0; p = 0;
      constructor() { this.x = Math.random() * W; this.y = Math.random() * H; this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3; this.r = Math.random() * 3 + 1.5; this.p = Math.random() * Math.PI * 2; }
      update() { this.x += this.vx; this.y += this.vy; this.p += 0.02; if (this.x < 0 || this.x > W) this.vx *= -1; if (this.y < 0 || this.y > H) this.vy *= -1; }
      draw() { const s = 1 + Math.sin(this.p) * 0.3; ctx!.beginPath(); ctx!.arc(this.x, this.y, this.r * s, 0, Math.PI * 2); ctx!.fillStyle = "rgba(108,60,224,0.35)"; ctx!.fill(); ctx!.beginPath(); ctx!.arc(this.x, this.y, this.r * s * 0.5, 0, Math.PI * 2); ctx!.fillStyle = "rgba(126,183,190,0.5)"; ctx!.fill(); }
    }
    const nodes = Array.from({ length: 30 }, () => new N());
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach(n => { n.update(); n.draw(); });
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.strokeStyle = `rgba(108,60,224,${0.05 * (1 - d / 180)})`; ctx.lineWidth = 0.7; ctx.stroke(); }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section className="relative overflow-hidden py-[100px]" id="agenti" style={{ background: "linear-gradient(180deg, #08080f, #111128, #08080f)" }}>
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
      <div className="max-w-[1320px] mx-auto px-6 relative z-[1]">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-4 before:content-[''] before:w-5 before:h-[1.5px] before:bg-[#7eb7be]">AGENTI IA</span>
          <h2 className="text-[#f0f0f5]" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 700 }}>
            I Tuoi <em className="not-italic" style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Agenti Intelligenti</em>
          </h2>
          <p className="text-[rgba(240,240,245,0.55)] text-[15px] mt-2">5 inclusi in Empire · Altri a €29/mese ciascuno · Sconto 30% per clienti attivi</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AGENTS.map((ag, i) => {
            const ts = TAG_STYLES[ag.tagType];
            return (
              <div key={i} className="rounded-3xl p-6 backdrop-blur-[8px] transition-all duration-500 hover:translate-y-[-6px] relative overflow-hidden group" style={{ background: "rgba(13,13,24,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="absolute inset-[-1px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-[1]" style={{ background: "conic-gradient(from 0deg, transparent 60%, rgba(126,183,190,0.08), transparent 80%, rgba(108,60,224,0.08), transparent)" }} />
                <div className="text-[2rem] mb-3">{ag.emoji}</div>
                <h4 className="text-[0.95rem] font-bold text-[#f0f0f5] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{ag.name}</h4>
                <p className="text-xs text-[rgba(240,240,245,0.55)] leading-relaxed">{ag.desc}</p>
                <span className="inline-block text-[10px] px-2.5 py-0.5 rounded-lg mt-3 font-semibold" style={{ background: ts.bg, color: ts.color }}>{ag.tag}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
