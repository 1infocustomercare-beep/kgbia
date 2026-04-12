export default function LandingPricing() {
  return (
    <section className="py-16 sm:py-[100px]" id="prezzi" style={{ background: "#020204" }}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold mb-4 before:content-[''] before:w-5 before:h-[1.5px] before:bg-[#7eb7be]">PIANI & PREZZI</span>
          <h2 className="text-[#f0f0f5] mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 700 }}>Scegli Come Dominare <em className="not-italic" style={{ background: "linear-gradient(135deg,#7eb7be,#6c3ce0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>il Tuo Mercato</em></h2>
          <p className="text-[rgba(240,240,245,0.55)] max-w-[600px] mx-auto text-[15px] leading-[1.7]">Pacchetto completo o abbonamento flessibile — il tuo business cambia per sempre.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-[1100px] mx-auto">
          <PC icon="⚡" name="Digital Start" price="€1.997" old="€2.880" disc="-31%" rate="oppure €666/mese x3 (TAN 0%)" after="poi €49/mese · 2% transazioni" features={["App White Label completa","Menu/Catalogo QR illimitato","Ordini & Prenotazioni","Dashboard Analytics base","Supporto Email dedicato","Setup & Onboarding guidato"]} btn="Inizia con Digital Start" bStyle="grad" urg="Setup gratuito questa settimana" uType="r" />
          <PC icon="🚀" name="Growth AI" price="€4.997" old="€7.200" disc="-31%" rate="oppure €1.666/mese x3 (TAN 0%)" after="poi €29/mese · 1% transazioni" features={["Tutto di Digital Start +","AI Engine completo","CRM & Fidelizzazione avanzata","Review Shield","Push Notification illimitate","2 Agenti IA inclusi","Commissioni ridotte 1%"]} btn="Scelgo Growth AI" bStyle="grad" urg="Solo 7 posti rimasti" uType="c" pop />
          <PC icon="👑" name="Empire Domination" price="€7.997" old="€14.400" disc="-44%" rate="oppure €2.666/mese x3 (TAN 0%)" after="€0/mese · 0% commissioni · €11/giorno x24 mesi" features={["TUTTO incluso","ZERO commissioni","ZERO canone 24 mesi","5 Agenti IA inclusi","Multi-lingua illimitato","GhostManager","Analytics predittivi IA","Account Manager VIP 7/7"]} btn="Scelgo Empire" bStyle="gold" urg="Risparmia fino a €6.403" uType="r" gld />
        </div>
      </div>
    </section>
  );
}
function PC({ icon, name, price, old, disc, rate, after, features, btn, bStyle, urg, uType, pop, gld }: any) {
  return (
    <div className={`rounded-3xl p-7 relative transition-all duration-500 hover:translate-y-[-6px] ${pop ? "lg:scale-[1.03]" : ""}`} style={{ background: pop ? "linear-gradient(180deg,rgba(126,183,190,0.04),#0d0d1a)" : "#0d0d1a", border: `1px solid ${pop ? "rgba(126,183,190,0.25)" : gld ? "rgba(212,168,85,0.25)" : "rgba(255,255,255,0.07)"}` }}>
      {pop && <div className="absolute -top-[11px] left-1/2 -translate-x-1/2 text-[9px] tracking-[2px] text-white px-3.5 py-0.5 rounded-2xl font-bold" style={{ background: "linear-gradient(135deg,#7eb7be,#6c3ce0)" }}>PIÙ POPOLARE</div>}
      {gld && <div className="absolute -top-[11px] left-1/2 -translate-x-1/2 text-[9px] tracking-[2px] text-black px-3.5 py-0.5 rounded-2xl font-bold" style={{ background: "linear-gradient(135deg,#d4a855,#e8c47a)" }}>MASSIMO RISPARMIO</div>}
      <div className="text-[2.4rem] mb-2">{icon}</div>
      <h3 className="text-[1.4rem] font-bold text-[#f0f0f5] mb-3" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{name}</h3>
      <div className="flex items-baseline gap-2 flex-wrap"><span className="text-[2.6rem] font-extrabold text-[#f0f0f5]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{price}</span><span className="text-sm text-[rgba(240,240,245,0.55)] line-through">{old}</span><span className="text-[11px] px-2 py-0.5 rounded-lg font-bold" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>{disc}</span></div>
      <div className="text-xs text-[#7eb7be] font-semibold mt-1">{rate}</div>
      <div className="text-[11px] text-[rgba(240,240,245,0.55)] mt-0.5">{after}</div>
      <div className="flex flex-col gap-2 my-5">{features.map((f: string) => (<div key={f} className="text-xs text-white/70 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-[#7eb7be] before:font-bold before:text-[11px]">{f}</div>))}</div>
      <button className="w-full py-3.5 rounded-full font-semibold text-sm transition-all hover:translate-y-[-2px]" style={{ background: bStyle === "gold" ? "linear-gradient(135deg,#d4a855,#e8c47a)" : "linear-gradient(135deg,#7eb7be,#6c3ce0)", color: bStyle === "gold" ? "#000" : "#fff", fontFamily: "'Space Grotesk',sans-serif" }}>{btn}</button>
      <div className="text-center text-[11px] mt-2 py-1 rounded-lg font-semibold" style={{ background: uType === "r" ? "rgba(239,68,68,0.08)" : "rgba(126,183,190,0.12)", color: uType === "r" ? "#ef4444" : "#7eb7be" }}>{urg}</div>
    </div>
  );
}
