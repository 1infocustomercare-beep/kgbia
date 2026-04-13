import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const AGENTS = [
  { emoji: "🧠", name: "Menu AI / Catalogo AI", desc: "Genera menu e cataloghi da foto. Traduzione multilingua.", tag: "Incluso in Growth", tagColor: "teal" },
  { emoji: "📝", name: "Content AI Engine", desc: "Post social, email, copy generato automaticamente.", tag: "Incluso in Growth", tagColor: "teal" },
  { emoji: "🤖", name: "Concierge AI", desc: "Chatbot 24/7 addestrato sul tuo business.", tag: "Incluso in Empire", tagColor: "gold" },
  { emoji: "🛡️", name: "Review Shield", desc: "Filtra negative in privato, amplifica 4-5★ Google.", tag: "Incluso in Empire", tagColor: "gold" },
  { emoji: "🔍", name: "LeadEngine Scout", desc: "Trova clienti in target da Maps e social.", tag: "Incluso in Empire", tagColor: "gold" },
  { emoji: "👻", name: "GhostManager", desc: "Recupera clienti persi con campagne automatiche.", tag: "Incluso in Empire", tagColor: "gold" },
  { emoji: "📸", name: "Visual AI Studio", desc: "Foto professionali del piatto generate dall'IA.", tag: "€29/mese", tagColor: "purple" },
  { emoji: "📊", name: "Analytics Predittivi", desc: "Previsioni vendite, trend e suggerimenti automatici.", tag: "€29/mese", tagColor: "purple" },
];

// Neural network canvas
function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    const resize = () => { const p = cv.parentElement; if (p) { W = cv.width = p.offsetWidth; H = cv.height = p.offsetHeight; }};
    resize();
    window.addEventListener("resize", resize);

    class Node { x: number; y: number; vx: number; vy: number; r: number; p: number;
      constructor() { this.x = Math.random() * W; this.y = Math.random() * H; this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3; this.r = Math.random() * 3 + 1.5; this.p = Math.random() * 6.28; }
      update() { this.x += this.vx; this.y += this.vy; this.p += 0.02; if (this.x < 0 || this.x > W) this.vx *= -1; if (this.y < 0 || this.y > H) this.vy *= -1; }
      draw() { const s = 1 + Math.sin(this.p) * 0.3; ctx!.beginPath(); ctx!.arc(this.x, this.y, this.r * s, 0, 6.28); ctx!.fillStyle = "rgba(108,60,224,0.3)"; ctx!.fill(); }
    }

    const nodes = Array.from({ length: 25 }, () => new Node());
    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach(n => { n.update(); n.draw(); });
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.strokeStyle = `rgba(108,60,224,${0.05 * (1 - d / 180)})`; ctx.lineWidth = 0.7; ctx.stroke(); }
      }
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
}

export default function LandingAgents() {
  return (
    <section id="agenti" className="relative overflow-hidden py-16 lg:py-24"
      style={{ background: "linear-gradient(180deg, #080810, #111128, #080810)" }}>
      <NeuralCanvas />
      <div className="relative z-[1] max-w-[1320px] mx-auto px-5">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-5">
            <span className="w-5 h-[1.5px] bg-[#7eb7be]" />AGENTI IA
          </span>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold">
            I Tuoi <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">Agenti Intelligenti</span>
          </h2>
          <p className="text-white/55 max-w-[620px] mx-auto text-[15px] mt-2">5 inclusi in Empire · Altri a €29/mese · Sconto 30% clienti attivi</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {AGENTS.map((a, i) => (
            <motion.div key={a.name}
              className="rounded-3xl p-6 border border-white/[0.07] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-white/[0.14] relative overflow-hidden"
              style={{ background: "rgba(13,13,24,0.85)" }}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.06 }}>
              <div className="text-3xl mb-3">{a.emoji}</div>
              <h4 className="text-sm font-heading font-bold mb-1.5 text-white">{a.name}</h4>
              <p className="text-[11px] text-white/55 leading-[1.6] mb-3">{a.desc}</p>
              <span className={`inline-block text-[10px] px-2.5 py-1 rounded-lg font-semibold ${
                a.tagColor === "teal" ? "bg-[rgba(126,183,190,0.12)] text-[#7eb7be]" :
                a.tagColor === "gold" ? "bg-[rgba(212,168,85,0.12)] text-[#d4a855]" :
                "bg-[rgba(108,60,224,0.12)] text-[#8b5cf6]"
              }`}>{a.tag}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
