import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SB = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups/";

const PHONES = [
  { img: `${SB}flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png`, alt: "Flame Kebab" },
  { img: `${SB}Aura%20Milano%20Spa/mobile-luce-pura-home.png`, alt: "Aura Spa" },
  { img: `${SB}Neo%20Nails%20Brickell/frosted-glass-home.png`, alt: "Neo Nails" },
  { img: `${SB}Top%20Golf%20Bay%20App/a-official-home.png`, alt: "Top Golf Bay" },
  { img: `${SB}DIMORA%20Milano/eleganza-milanese-home-mobile.png`, alt: "DIMORA Milano" },
];

/* Canvas particle system */
function useHeroCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    let W = 0, H = 0, mx = 0, my = 0, animId = 0;

    const resize = () => { W = cv.width = cv.parentElement?.offsetWidth || 800; H = cv.height = cv.parentElement?.offsetHeight || 600; };
    resize();
    window.addEventListener("resize", resize);
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener("mousemove", onMove);

    class P {
      x = 0; y = 0; vx = 0; vy = 0; r = 0; a = 0; color = ""; pulse = 0;
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W; this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.35; this.vy = (Math.random() - 0.5) * 0.35;
        this.r = Math.random() * 2 + 0.6; this.a = Math.random() * 0.35 + 0.1;
        this.color = Math.random() > 0.6 ? "126,183,190" : "108,60,224";
        this.pulse = Math.random() * Math.PI * 2;
      }
      update() {
        this.pulse += 0.015;
        const dx = mx - this.x, dy = my - this.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 200) { this.x -= dx * 0.003; this.y -= dy * 0.003; }
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
      }
      draw() {
        const s = 1 + Math.sin(this.pulse) * 0.2;
        ctx!.beginPath(); ctx!.arc(this.x, this.y, this.r * s, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${this.color},${this.a})`; ctx!.fill();
      }
    }

    const count = Math.min(80, Math.floor((W * H) / 14000));
    const pts = Array.from({ length: count }, () => new P());

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      if (mx > 0 && my > 0) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
        g.addColorStop(0, "rgba(126,183,190,0.04)");
        g.addColorStop(0.5, "rgba(108,60,224,0.02)");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
      pts.forEach(p => { p.update(); p.draw(); });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(126,183,190,${0.06 * (1 - d / 130)})`;
            ctx.lineWidth = 0.6; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); document.removeEventListener("mousemove", onMove); };
  }, [canvasRef]);
}

const phoneLayout = (isMob: boolean) => [
  { x: isMob ? -80 : -160, y: isMob ? 20 : 40, rot: -12, z: 5, s: isMob ? 0.85 : 1 },
  { x: isMob ? -40 : -80, y: isMob ? -10 : -20, rot: -6, z: 8, s: isMob ? 0.9 : 1.05 },
  { x: 0, y: isMob ? -20 : -40, rot: 0, z: 10, s: isMob ? 0.95 : 1.1 },
  { x: isMob ? 40 : 80, y: isMob ? -10 : -20, rot: 6, z: 8, s: isMob ? 0.9 : 1.05 },
  { x: isMob ? 80 : 160, y: isMob ? 20 : 40, rot: 12, z: 5, s: isMob ? 0.85 : 1 },
];

export default function LandingHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [isMob, setIsMob] = useState(false);

  useHeroCanvas(canvasRef);
  useEffect(() => {
    const check = () => setIsMob(window.innerWidth <= 1024);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const layout = phoneLayout(isMob);
  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ padding: isMob ? "120px 20px 60px" : "100px 40px 60px" }}>
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Grid pattern */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent)",
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 30% 40%, rgba(108,60,224,0.06) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(126,183,190,0.05) 0%, transparent 40%)" }} />
      </div>

      {/* Glows */}
      <div className="absolute rounded-full pointer-events-none z-[1] opacity-10 animate-[gf_10s_ease-in-out_infinite]" style={{ width: 500, height: 500, background: "#6c3ce0", filter: "blur(120px)", top: "5%", right: "-5%" }} />
      <div className="absolute rounded-full pointer-events-none z-[1] opacity-[0.06] animate-[gf_12s_ease-in-out_infinite_3s]" style={{ width: 400, height: 400, background: "#7eb7be", filter: "blur(120px)", bottom: "10%", right: "15%" }} />
      <div className="absolute rounded-full pointer-events-none z-[1] opacity-[0.04] animate-[gf_8s_ease-in-out_infinite_1s]" style={{ width: 300, height: 300, background: "#d4a855", filter: "blur(120px)", top: "40%", left: "-10%" }} />

      <div className={`relative z-[2] w-full max-w-[1320px] mx-auto flex ${isMob ? "flex-col items-center text-center" : "items-center"} gap-[60px]`}>
        {/* Left content */}
        <div className="flex-1 max-w-[600px]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="inline-flex items-center gap-2 text-[11px] tracking-[3px] uppercase text-[#7eb7be] font-semibold mb-8 px-[18px] py-2 rounded-full backdrop-blur-[8px]" style={{ border: "1px solid rgba(126,183,190,0.2)", background: "rgba(126,183,190,0.04)" }}>
            <div className="w-[7px] h-[7px] rounded-full bg-[#22c55e] animate-pulse" style={{ boxShadow: "0 0 6px #22c55e" }} />
            PIATTAFORMA AI ITALIANA · 25+ SETTORI
          </motion.div>

          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.8rem, 6vw, 5.6rem)", fontWeight: 800, lineHeight: 0.92, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
            <motion.span className="block overflow-hidden" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} transition={{ delay: 0.5, duration: 1.1 }}>
              <span className="text-[#f0f0f5]">TRASFORMIAMO</span>
            </motion.span>
            <motion.span className="block overflow-hidden" initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ delay: 0.7, duration: 1.1 }}>
              <span style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.3)", color: "transparent" }}>IL DIGITALE</span>
            </motion.span>
            <motion.span className="block overflow-hidden" initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} transition={{ delay: 0.9, duration: 1.1 }}>
              <span className="text-[#f0f0f5]">IN </span>
              <span style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>REVENUE</span>
            </motion.span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }} className="text-[17px] text-[rgba(240,240,245,0.55)] mb-10 max-w-[480px] leading-[1.8]" style={{ marginLeft: isMob ? "auto" : undefined, marginRight: isMob ? "auto" : undefined }}>
            La prima piattaforma AI all-in-one che gestisce, automatizza e fa crescere il tuo business. 98+ agenti IA, ROI garantito in 90 giorni.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8 }} className={`flex gap-3.5 flex-wrap ${isMob ? "justify-center" : ""}`}>
            <button onClick={() => navigate("/demo")} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm text-white cursor-pointer border-none transition-all duration-400 hover:translate-y-[-3px]" style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", fontFamily: "'Space Grotesk', sans-serif", boxShadow: "0 16px 48px rgba(126,183,190,0.25)" }}>
              Scopri i Progetti →
            </button>
            <button onClick={() => scrollTo("#prezzi")} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm text-white cursor-pointer bg-transparent transition-all duration-400 hover:border-[#7eb7be] hover:text-[#7eb7be]" style={{ border: "1px solid rgba(255,255,255,0.14)", fontFamily: "'Space Grotesk', sans-serif" }}>
              Piani & Prezzi
            </button>
          </motion.div>
        </div>

        {/* Right - 5 phones */}
        <div className="flex-1 relative flex justify-center items-center" style={{ minHeight: isMob ? 320 : 540, perspective: 1600 }}>
          {PHONES.map((phone, i) => {
            const l = layout[i];
            return (
              <motion.div key={i}
                className="absolute overflow-hidden cursor-pointer"
                style={{
                  width: isMob ? 140 : 200,
                  borderRadius: isMob ? 20 : 28,
                  border: `${isMob ? 3 : 4}px solid rgba(255,255,255,0.08)`,
                  boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
                  zIndex: l.z,
                  willChange: "transform",
                }}
                initial={{ scale: 0, rotation: l.rot * 2, y: 200 + i * 30, opacity: 0 }}
                animate={{ x: l.x, y: l.y, rotate: l.rot, scale: l.s, opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.12, duration: 1.4, type: "spring", damping: 12, stiffness: 80 }}
                whileHover={{ scale: (l.s || 1) * 1.08, zIndex: 20, boxShadow: "0 40px 100px rgba(126,183,190,0.3), 0 0 0 2px rgba(126,183,190,0.2)" }}
              >
                <img src={phone.img} alt={phone.alt} className="w-full block" loading="lazy" />
                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.3))" }} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-[3]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        <span className="text-[10px] tracking-[3px] uppercase text-[rgba(240,240,245,0.3)]">scroll</span>
        <motion.div className="w-[1px] h-8" style={{ background: "linear-gradient(#7eb7be, transparent)" }} animate={{ scaleY: [1, 0.4, 1], opacity: [1, 0.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      </motion.div>
    </section>
  );
}
