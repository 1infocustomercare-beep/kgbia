import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const AGENTS = [
  { icon: "📋", accent: "#22d3ee", name: "Menu AI / Catalogo AI", desc: "Genera menu e cataloghi professionali da una foto. Traduzione in 12 lingue in un click.", tag: "Incluso in Growth" },
  { icon: "✍️", accent: "#a78bfa", name: "Content AI Engine", desc: "Post social, email, blog e copy pubblicitari. Generati nel tuo tono di voce, pronti da pubblicare.", tag: "Incluso in Growth" },
  { icon: "💬", accent: "#ec4899", name: "Concierge AI", desc: "Chatbot 24/7 addestrato sul tuo business. Risponde ai clienti, prende prenotazioni e vende per te.", tag: "Incluso in Empire" },
  { icon: "⭐", accent: "#f59e0b", name: "Review Shield", desc: "Intercetta le recensioni negative in privato e amplifica le 4-5★ su Google. La tua reputazione è al sicuro.", tag: "Incluso in Empire" },
  { icon: "🎯", accent: "#ef4444", name: "LeadEngine Scout", desc: "Trova nuovi clienti in target analizzando Google Maps, social e directory. Lead qualificati ogni giorno.", tag: "Incluso in Empire" },
  { icon: "👻", accent: "#4ade80", name: "GhostManager", desc: "Recupera il 94% dei clienti persi con campagne WhatsApp e email automatiche e personalizzate.", tag: "Incluso in Empire" },
  { icon: "📸", accent: "#f472b6", name: "Visual AI Studio", desc: "Foto professionali dei tuoi prodotti generate dall'IA. Qualità da shooting, costo zero.", tag: "€29/mese" },
  { icon: "📈", accent: "#60a5fa", name: "Analytics Predittivi", desc: "Previsioni vendite, trend settimanali e suggerimenti automatici per massimizzare il fatturato.", tag: "€29/mese" },
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
        ctx!.fillStyle = "rgba(167,139,250,0.2)"; ctx!.fill();
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
            ctx.strokeStyle = `rgba(167,139,250,${0.04 * (1 - d / 180)})`; ctx.lineWidth = 0.7; ctx.stroke();
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
      {/* Deep violet atmosphere */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #020208 0%, #0e0820 30%, #140c30 50%, #020208 100%)",
      }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />
      <NeuralCanvas />

      <div className="relative z-[1] max-w-[1320px] mx-auto px-5">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-violet-400 font-bold mb-5">
            <span className="w-6 h-[2px] bg-gradient-to-r from-violet-400 to-transparent" />98 AGENTI INTELLIGENTI
          </span>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-white">
            Il Tuo Team AI. <span className="text-violet-400">Sempre Operativo.</span>
          </h2>
          <p className="text-white/55 max-w-[620px] mx-auto text-[15px] mt-3 leading-[1.7]">
            Ogni agente è specializzato in un compito. Lavorano insieme, imparano dal tuo business e migliorano ogni giorno.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AGENTS.map((a, i) => (
            <motion.div
              key={a.name}
              className="rounded-3xl p-6 border border-white/[0.06] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-white/[0.14] relative overflow-hidden group"
              style={{ background: "linear-gradient(180deg, rgba(20,12,48,0.85), rgba(8,6,20,0.92))" }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.06 }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
                style={{ background: a.accent }} />

              {/* Icon badge */}
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 border border-white/[0.06]"
                style={{ background: `${a.accent}10`, boxShadow: `0 0 16px ${a.accent}08` }}>
                {a.icon}
              </div>

              <h4 className="text-sm font-heading font-bold mb-1.5 text-white/90">{a.name}</h4>
              <p className="text-[12px] text-white/55 leading-[1.7] mb-3">{a.desc}</p>
              <span className="inline-block text-[10px] px-2.5 py-1 rounded-lg font-semibold border"
                style={{ borderColor: `${a.accent}20`, background: `${a.accent}08`, color: a.accent }}>
                {a.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
