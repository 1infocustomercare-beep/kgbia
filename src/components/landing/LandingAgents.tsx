import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import LandingPremiumPanel from "@/components/landing/LandingPremiumPanel";

const AGENTS = [
  { panelEyebrow: "AI Commerce", panelCode: "AI-01", name: "Menu AI / Catalogo AI", desc: "Genera menu e cataloghi da foto. Traduzione multilingua.", tag: "Incluso in Growth", tagColor: "teal" },
  { panelEyebrow: "Content Ops", panelCode: "AI-02", name: "Content AI Engine", desc: "Post social, email, copy generato automaticamente.", tag: "Incluso in Growth", tagColor: "teal" },
  { panelEyebrow: "Client Care", panelCode: "AI-03", name: "Concierge AI", desc: "Chatbot 24/7 addestrato sul tuo business.", tag: "Incluso in Empire", tagColor: "gold" },
  { panelEyebrow: "Reputation", panelCode: "AI-04", name: "Review Shield", desc: "Filtra negative in privato, amplifica 4-5★ Google.", tag: "Incluso in Empire", tagColor: "gold" },
  { panelEyebrow: "Lead Search", panelCode: "AI-05", name: "LeadEngine Scout", desc: "Trova clienti in target da Maps e social.", tag: "Incluso in Empire", tagColor: "gold" },
  { panelEyebrow: "Retention", panelCode: "AI-06", name: "GhostManager", desc: "Recupera clienti persi con campagne automatiche.", tag: "Incluso in Empire", tagColor: "gold" },
  { panelEyebrow: "Visual Lab", panelCode: "AI-07", name: "Visual AI Studio", desc: "Foto professionali del piatto generate dall'IA.", tag: "€29/mese", tagColor: "purple" },
  { panelEyebrow: "Forecasting", panelCode: "AI-08", name: "Analytics Predittivi", desc: "Previsioni vendite, trend e suggerimenti automatici.", tag: "€29/mese", tagColor: "purple" },
];

function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    const resize = () => {
      const p = cv.parentElement;
      if (p) { W = cv.width = p.offsetWidth; H = cv.height = p.offsetHeight; }
    };
    resize();
    window.addEventListener("resize", resize);

    class Node {
      x: number; y: number; vx: number; vy: number; r: number; p: number;
      constructor() {
        this.x = Math.random() * W; this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3;
        this.r = Math.random() * 3 + 1.5; this.p = Math.random() * 6.28;
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.p += 0.02;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
      }
      draw() {
        const s = 1 + Math.sin(this.p) * 0.3;
        ctx!.beginPath(); ctx!.arc(this.x, this.y, this.r * s, 0, 6.28);
        ctx!.fillStyle = "rgba(108,60,224,0.25)"; ctx!.fill();
      }
    }

    const nodes = Array.from({ length: 25 }, () => new Node());
    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach((n) => { n.update(); n.draw(); });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 180) {
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(108,60,224,${0.04 * (1 - d / 180)})`; ctx.lineWidth = 0.7; ctx.stroke();
          }
        }
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
    <section id="agenti" className="relative overflow-hidden py-20 lg:py-28">
      {/* Premium background */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #080816 0%, #0e0e28 30%, #12123a 50%, #0a0a1e 100%)",
      }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6c3ce0]/20 to-transparent" />
      <NeuralCanvas />

      <div className="relative z-[1] max-w-[1320px] mx-auto px-5">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-bold mb-5">
            <span className="w-6 h-[2px] bg-gradient-to-r from-[#7eb7be] to-transparent" />AGENTI IA
          </span>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-white">
            I Tuoi <span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">Agenti Intelligenti</span>
          </h2>
          <p className="text-white/55 max-w-[620px] mx-auto text-[15px] mt-3 leading-[1.7]">5 inclusi in Empire · Altri a €29/mese · Sconto 30% clienti attivi</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AGENTS.map((a, i) => (
            <motion.div
              key={a.name}
              className="rounded-3xl p-6 border border-white/[0.08] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-white/[0.16] relative overflow-hidden"
              style={{ background: "linear-gradient(180deg, rgba(16,16,38,0.92), rgba(10,10,24,0.95))" }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.06 }}
            >
              <LandingPremiumPanel eyebrow={a.panelEyebrow} code={a.panelCode} title={a.name} tone={a.tagColor === "gold" ? "gold" : a.tagColor === "purple" ? "violet" : "teal"} />
              <h4 className="text-sm font-heading font-bold mb-1.5 text-white/90">{a.name}</h4>
              <p className="text-[12px] text-white/55 leading-[1.7] mb-3">{a.desc}</p>
              <span className={`inline-block text-[10px] px-2.5 py-1 rounded-lg font-semibold ${
                a.tagColor === "teal" ? "bg-[rgba(126,183,190,0.12)] text-[#7eb7be]"
                : a.tagColor === "gold" ? "bg-[rgba(212,168,85,0.12)] text-[#d4a855]"
                : "bg-[rgba(108,60,224,0.12)] text-[#8b5cf6]"
              }`}>{a.tag}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
