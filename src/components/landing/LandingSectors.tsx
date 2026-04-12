import { useState } from "react";

const SB = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups/";
const SECTORS = [
  { name: "Ristorazione", img: "flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png", desc: "App ordini, menu QR, prenotazioni, delivery" },
  { name: "Fitness", img: "City%20Padel%20Milano/mobile-fresh-azzurro-home.png", desc: "Prenotazioni corsi, schede, abbonamenti" },
  { name: "Beauty", img: "Aura%20Milano%20Spa/mobile-luce-pura-home.png", desc: "Booking trattamenti, fidelity, prodotti" },
  { name: "Hotel", img: "COTE%20Miami/a-obsidian-mobile-home.png", desc: "Check-in, room service, concierge AI" },
  { name: "Pet Care", img: "Aloha%20Pet%20Resorts/mobile-a-home.png", desc: "Prenotazioni, profili animali, veterinario" },
  { name: "Sport", img: "Top%20Golf%20Bay%20App/a-official-home.png", desc: "Campi, tornei, leaderboard, shop" },
  { name: "Sushi", img: "Paperfish%20Sushi/a-sakura-home.png", desc: "Ordini, all-you-can-eat, delivery" },
  { name: "NCC", img: "LuxDrive/style-a-home.png", desc: "Prenotazioni, tracking, pagamenti" },
  { name: "Charter", img: "Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png", desc: "Booking barche, itinerari, crew" },
  { name: "Luxury", img: "Tatush%20Hair%20Fragrance/mobile-home.png", desc: "Catalogo, checkout, brand premium" },
  { name: "Immobiliare", img: "DIMORA%20Milano/eleganza-milanese-home-mobile.png", desc: "Annunci, virtual tour, CRM" },
  { name: "Nail Art", img: "Neo%20Nails%20Brickell/frosted-glass-home.png", desc: "Galleria, booking, loyalty" },
  { name: "Fast Food", img: "STRAPIZZAMI/stile-a-home.png", desc: "Ordini rapidi, combo, fidelity" },
];

export default function LandingSectors() {
  const [active, setActive] = useState(0);
  const s = SECTORS[active];
  return (
    <section className="py-16 sm:py-[100px]" id="settori" style={{ background: "#020204" }}>
      <div className="max-w-[1320px] mx-auto px-6 text-center">
        <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-4 before:content-[''] before:w-5 before:h-[1.5px] before:bg-[#7eb7be]">I NOSTRI SETTORI</span>
        <h2 className="text-[#f0f0f5] mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 700 }}>Un sistema. <em className="not-italic" style={{ background: "linear-gradient(135deg,#7eb7be,#6c3ce0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Infiniti settori.</em></h2>
        <p className="text-[rgba(240,240,245,0.55)] max-w-[620px] mx-auto text-[15px] leading-[1.7] mb-6">App, siti web, gestionali e automazioni IA personalizzati per ogni tipo di business.</p>
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {SECTORS.map((sec, i) => (
            <button key={sec.name} onClick={() => setActive(i)} className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${i === active ? "text-white" : "text-[rgba(240,240,245,0.55)] hover:border-[#7eb7be] hover:text-[#7eb7be]"}`} style={{ border: i === active ? "1px solid transparent" : "1px solid rgba(255,255,255,0.07)", background: i === active ? "linear-gradient(135deg,#7eb7be,#6c3ce0)" : "transparent", fontFamily: "'Space Grotesk',sans-serif" }}>{sec.name}</button>
          ))}
        </div>
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <div className="w-[200px] rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}><img src={`${SB}${s.img}`} alt={s.name} className="w-full block" loading="lazy" /></div>
          <div className="max-w-[340px] text-left">
            <h3 className="text-[1.2rem] font-bold text-[#f0f0f5] mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{s.name}</h3>
            <p className="text-[rgba(240,240,245,0.55)] text-sm leading-[1.7] mb-3">{s.desc}. App dedicata con AI, dashboard gestionale e agenti inclusi.</p>
            <button onClick={() => document.querySelector("#prezzi")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-xs text-white" style={{ background: "linear-gradient(135deg,#7eb7be,#6c3ce0)", fontFamily: "'Space Grotesk',sans-serif" }}>Scopri il Piano →</button>
          </div>
        </div>
      </div>
    </section>
  );
}
