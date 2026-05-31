import { useState, useEffect, useRef } from "react";

// ════════════════════════════════════════════════════════
// MOBILE ART SERVICES — BRAND PALETTE
// Update these CSS variables to retheme the entire site.
// Sand/parchment palette matching the gallery aesthetic.
// ════════════════════════════════════════════════════════
// --mas-bg:       #F4F0E8   warm parchment
// --mas-surface:  #EDE8DC   card surfaces
// --mas-dark:     #1A1714   near-black warm
// --mas-ink:      #2A2420   primary text
// --mas-ink-mid:  #4A4440   secondary text
// --mas-muted:    #8A8278   hints, labels
// --mas-gold:     #C4A962   accent gold
// --mas-border:   #D4CEC4   borders
// ════════════════════════════════════════════════════════

const WIX_IMAGES = [
  "https://static.wixstatic.com/media/db1866_9af8d91e0b8f425d8041ead2ecc72754~mv2.jpg",
  "https://static.wixstatic.com/media/db1866_06a0cd813d3a4bf0a5492a7011c1a01e~mv2.jpg",
  "https://static.wixstatic.com/media/db1866_9fb8d8ae054e4b28b3e4dbb32517356b~mv2.jpg",
  "https://static.wixstatic.com/media/db1866_0ab849c30cbc450b96ad89c8a9f656e0~mv2_d_5412_4044_s_4_2.jpg",
  "https://static.wixstatic.com/media/db1866_807de9a4e0fb4cb584503b61909b0c47~mv2.jpg",
  "https://static.wixstatic.com/media/db1866_3415b8d636ac48f8b42817e3ee324a97~mv2.jpg",
  "https://static.wixstatic.com/media/db1866_7c287d1977ef4939a3e25e8400bc95ce~mv2_d_4920_3972_s_4_2.jpg",
  "https://static.wixstatic.com/media/db1866_ba6e9650d8dd4fa396c93eb2e9b0cd06~mv2.jpg",
  "https://static.wixstatic.com/media/db1866_5c98d58fc5fa4cf0b5b9a5da54e73407~mv2.jpg",
  "https://static.wixstatic.com/media/db1866_8e306ae917cf454381ebe211b6613e6d~mv2.jpg",
];

const gallery = WIX_IMAGES.map((src, i) => ({
  id: String(i + 1).padStart(3, '0'),
  src,
  title: `Artwork ${String(i + 1).padStart(2, '0')}`,
  artist: "Patrice Pelissier",
  medium: "Mixed media",
  status: "available",
  caption: "Original artwork — inquire for details and pricing",
}));

const services = [
  { title: "Art & Mirror Hanging", desc: "Professional installation of single pieces or curated gallery walls. Every piece level, every nail precise." },
  { title: "Gallery Wall Curation", desc: "An artist's eye applied to your space. We design the arrangement, source the hardware, and install everything." },
  { title: "Frame Selection", desc: "The right frame changes everything. We source frames that complement both the work and your space." },
  { title: "Mat Selection", desc: "Precision matting that protects the work and elevates the presentation. Acid-free, archival materials." },
  { title: "Canvas Stretching", desc: "Unstretched canvases properly mounted and tensioned for long-term display without warping." },
  { title: "Art Restoration & Repair", desc: "Careful restoration of damaged pieces — cleaning, relining, inpainting — handled with respect for the original." },
];

function useReveal(t = 0.08) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: t });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return [ref, v];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, v] = useReveal();
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(20px)", transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`, ...style }}>{children}</div>;
}

function GalleryCard({ item, index }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  const [hov, setHov] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [ref, v] = useReveal();

  return (
    <>
      <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(20px)", transition: `opacity 0.6s ease ${(index % 3) * 0.08}s, transform 0.6s ease ${(index % 3) * 0.08}s` }}>
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
          <div onClick={() => setLightbox(true)} style={{ aspectRatio: "1/1", overflow: "hidden", position: "relative", background: "var(--mas-surface)", border: `0.5px solid var(--mas-border)`, cursor: "pointer" }}>
            {!err && <img src={item.src} alt={item.title} onLoad={() => setLoaded(true)} onError={() => setErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: loaded ? 1 : 0, transition: "opacity 0.4s", display: "block" }} />}
            {(!loaded && !err) && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 10, color: "var(--mas-muted)", fontFamily: "var(--mas-mono)", letterSpacing: "0.1em" }}>LOADING</span></div>}
            <div style={{ position: "absolute", inset: 0, background: "rgba(26,23,20,0.7)", opacity: hov ? 1 : 0, transition: "opacity 0.25s", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{ fontSize: 13, color: "#F4F0E8", fontFamily: "var(--mas-serif)", fontStyle: "italic" }}>{item.title}</div>
              <div style={{ fontSize: 10, color: "#C4A962", fontFamily: "var(--mas-mono)", letterSpacing: "0.1em" }}>CLICK TO INQUIRE</div>
            </div>
            <div style={{ position: "absolute", top: 10, right: 10, background: "var(--mas-gold)", color: "#1A1714", fontSize: 9, fontFamily: "var(--mas-mono)", letterSpacing: "0.08em", padding: "3px 8px", opacity: item.status === "available" ? 1 : 0 }}>AVAILABLE</div>
          </div>
          <div style={{ paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontSize: 13, color: "var(--mas-ink)", fontFamily: "var(--mas-serif)", fontStyle: "italic" }}>{item.artist}</div>
            <div style={{ fontSize: 10, color: "var(--mas-muted)", fontFamily: "var(--mas-mono)", letterSpacing: "0.06em" }}>{item.medium}</div>
          </div>
        </div>
      </div>

      {lightbox && (
        <div onClick={() => setLightbox(false)} style={{ position: "fixed", inset: 0, background: "rgba(26,23,20,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--mas-surface)", padding: 32, maxWidth: 640, width: "100%", border: `0.5px solid var(--mas-border)` }}>
            <img src={item.src} alt={item.title} style={{ width: "100%", height: "auto", display: "block", marginBottom: 20 }} />
            <div style={{ fontFamily: "var(--mas-serif)", fontSize: 20, color: "var(--mas-ink)", fontStyle: "italic", marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontSize: 13, color: "var(--mas-ink-mid)", marginBottom: 4 }}>{item.artist} · {item.medium}</div>
            <div style={{ fontSize: 12, color: "var(--mas-muted)", marginBottom: 20 }}>{item.caption}</div>
            <a href={`mailto:info@mobileartservices.com?subject=Inquiry: ${item.title}&body=I am interested in ${item.title} by ${item.artist}. Please provide details and pricing.`}
              style={{ display: "inline-block", background: "var(--mas-dark)", color: "var(--mas-bg)", padding: "12px 28px", fontSize: 11, fontFamily: "var(--mas-mono)", letterSpacing: "0.1em", textDecoration: "none", textTransform: "uppercase" }}>
              Inquire About This Piece
            </a>
            <button onClick={() => setLightbox(false)} style={{ marginLeft: 12, background: "transparent", border: `0.5px solid var(--mas-border)`, color: "var(--mas-muted)", padding: "12px 20px", fontSize: 11, fontFamily: "var(--mas-mono)", letterSpacing: "0.1em", cursor: "pointer", textTransform: "uppercase" }}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

function ServiceRow({ s, index }) {
  const [hov, setHov] = useState(false);
  const [ref, v] = useReveal();
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(14px)", transition: `opacity 0.55s ease ${index * 0.06}s, transform 0.55s ease ${index * 0.06}s` }}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 40, padding: "26px 0" }}>
        <div style={{ fontSize: 17, fontFamily: "var(--mas-serif)", fontStyle: "italic", color: hov ? "var(--mas-gold)" : "var(--mas-ink)", transition: "color 0.2s", lineHeight: 1.3 }}>{s.title}</div>
        <div style={{ fontSize: 14, color: "var(--mas-ink-mid)", lineHeight: 1.75, fontWeight: 300 }}>{s.desc}</div>
      </div>
      <div style={{ height: 1, background: "var(--mas-border)" }} />
    </div>
  );
}

export default function MobileArtServices() {
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", notes: "" });

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: "var(--mas-bg)", minHeight: "100vh", color: "var(--mas-ink)", fontFamily: "var(--mas-body)" }}>
      <style>{`
        /* ════════════════════════════════════════════════════════
           MOBILE ART SERVICES — BRAND PALETTE
           Update these CSS variables to retheme the entire site.
           Sand/parchment gallery aesthetic.
           ════════════════════════════════════════════════════════ */
        :root {
          --mas-bg:       #F4F0E8;
          --mas-surface:  #EDE8DC;
          --mas-dark:     #1A1714;
          --mas-white:    #FDFCF8;
          --mas-ink:      #2A2420;
          --mas-ink-mid:  #4A4440;
          --mas-muted:    #8A8278;
          --mas-gold:     #C4A962;
          --mas-gold-lt:  #D4BC78;
          --mas-border:   #D4CEC4;
          --mas-border-mid: #C4BEB4;
          --mas-serif:    'Cormorant Garamond', Georgia, serif;
          --mas-body:     'DM Sans', system-ui, sans-serif;
          --mas-mono:     'DM Mono', monospace;
        }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: var(--mas-border); }
        .sec { max-width: 1060px; margin: 0 auto; padding: 0 48px; }
        .nb { font-size: 11px; color: var(--mas-muted); cursor: pointer; background: none; border: none; font-family: var(--mas-mono); letter-spacing: 0.08em; text-transform: uppercase; transition: color 0.15s; padding: 0; }
        .nb:hover { color: var(--mas-ink); }
        .bp { background: var(--mas-dark); color: var(--mas-bg); border: none; padding: 13px 28px; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; font-family: var(--mas-mono); transition: background 0.2s, transform 0.15s; }
        .bp:hover { background: var(--mas-ink-mid); transform: translateY(-1px); }
        .bg { background: transparent; color: var(--mas-ink); border: 1px solid var(--mas-border-mid); padding: 13px 28px; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; font-family: var(--mas-mono); transition: border-color 0.2s; }
        .bg:hover { border-color: var(--mas-ink-mid); }
        .el { font-size: 10px; color: var(--mas-gold); font-family: var(--mas-mono); letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
        .el::before { content: ''; display: block; width: 24px; height: 1px; background: var(--mas-gold); }
        .fi { width: 100%; padding: 11px 13px; background: var(--mas-white); border: 0.5px solid var(--mas-border); font-size: 14px; font-family: var(--mas-body); color: var(--mas-ink); outline: none; transition: border-color 0.2s; border-radius: 0; }
        .fi:focus { border-color: var(--mas-gold); }
        .fl { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--mas-muted); font-family: var(--mas-mono); margin-bottom: 5px; display: block; }
        @keyframes fU { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fI { from { opacity:0; } to { opacity:1; } }
        @media (max-width: 720px) {
          .sec { padding: 0 24px; }
          .h1 { font-size: clamp(48px, 12vw, 72px) !important; }
          .tc { grid-template-columns: 1fr !important; gap: 40px !important; }
          .gg { grid-template-columns: 1fr 1fr !important; }
          .nl { display: none !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background: scrolled ? "rgba(244,240,232,0.94)" : "transparent", backdropFilter: scrolled ? "blur(14px)" : "none", borderBottom: scrolled ? `0.5px solid var(--mas-border)` : "0.5px solid transparent", transition:"all 0.3s", padding:"0 48px", display:"flex", alignItems:"center", justifyContent:"space-between", height:68 }}>
        <div onClick={() => go("home")} style={{ cursor:"pointer" }}>
          <div style={{ fontFamily:"var(--mas-serif)", fontWeight:600, fontSize:20, letterSpacing:"0.04em", color:"var(--mas-ink)", lineHeight:1, fontStyle:"italic" }}>Mobile Art Services</div>
          <div style={{ fontSize:9, letterSpacing:"0.18em", color:"var(--mas-gold)", textTransform:"uppercase", fontFamily:"var(--mas-mono)", marginTop:3 }}>Port Chester, NY · Greenwich, CT</div>
        </div>
        <div className="nl" style={{ display:"flex", gap:32, alignItems:"center" }}>
          {["services","gallery","about","contact"].map(id => <button key={id} className="nb" onClick={() => go(id)}>{id}</button>)}
          <button className="bp" style={{ padding:"8px 18px", fontSize:10 }} onClick={() => go("contact")}>Book now</button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"0 48px 80px", position:"relative", overflow:"hidden" }}>
        {/* Decorative frame motifs */}
        {[0,20,40].map(o => (
          <div key={o} style={{ position:"absolute", top:90+o, right:48+o, width:300, height:400, border:`0.5px solid ${o===40?"var(--mas-surface)":"var(--mas-border)"}`, background: o===40 ? "var(--mas-surface)" : "transparent", opacity:0, animation:`fI 1s ease ${0.4+o*0.01}s forwards`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            {o===40 && <div style={{ fontFamily:"var(--mas-mono)", fontSize:10, color:"var(--mas-muted)", letterSpacing:"0.14em", textTransform:"uppercase", textAlign:"center", lineHeight:2.2 }}>Art & Mirror Hanging<br/>Gallery Wall Curation<br/>Frame Selection<br/>Art Restoration<br/>Canvas Stretching</div>}
          </div>
        ))}
        <div className="sec" style={{ padding:0, position:"relative", zIndex:1 }}>
          <div style={{ opacity:0, animation:"fU 0.8s ease 0.1s forwards", marginBottom:20 }}><div className="el">Serving Westchester County &amp; Greenwich, CT</div></div>
          <div style={{ opacity:0, animation:"fU 0.9s ease 0.2s forwards" }}>
            <h1 className="h1" style={{ fontFamily:"var(--mas-serif)", fontWeight:300, fontStyle:"italic", fontSize:"clamp(52px,7vw,88px)", lineHeight:1.0, letterSpacing:"-0.02em", color:"var(--mas-ink)", maxWidth:660, marginBottom:20 }}>
              Art installed<br/>with an<br/><span style={{ color:"var(--mas-gold)" }}>artist's eye.</span>
            </h1>
          </div>
          <div style={{ opacity:0, animation:"fU 0.8s ease 0.32s forwards", marginBottom:20 }}>
            <p style={{ fontSize:16, color:"var(--mas-ink-mid)", maxWidth:460, lineHeight:1.8, fontWeight:300 }}>Over 20 years of experience. Former frame designer at AI Friedman. We don't just hang art — we make your space feel like it was designed this way.</p>
          </div>
          <div style={{ opacity:0, animation:"fU 0.8s ease 0.44s forwards", display:"flex", gap:12, flexWrap:"wrap" }}>
            <button className="bp" onClick={() => go("contact")}>Book a consultation</button>
            <button className="bg" onClick={() => go("gallery")}>View the collection</button>
          </div>
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, borderTop:"0.5px solid var(--mas-border)", opacity:0, animation:"fI 1s ease 0.9s forwards" }}>
          <div style={{ maxWidth:1060, margin:"0 auto", padding:"14px 48px", display:"flex", gap:40 }}>
            {["203-224-8524","info@mobileartservices.com","mobileartservices.com"].map(t => <span key={t} style={{ fontSize:10, color:"var(--mas-muted)", fontFamily:"var(--mas-mono)", letterSpacing:"0.06em" }}>{t}</span>)}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding:"96px 0", background:"var(--mas-white)" }}>
        <div className="sec">
          <Reveal>
            <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:40, flexWrap:"wrap", gap:16 }}>
              <div><div className="el">What we do</div><h2 style={{ fontFamily:"var(--mas-serif)", fontWeight:300, fontStyle:"italic", fontSize:44, letterSpacing:"-0.01em", color:"var(--mas-ink)", lineHeight:1 }}>Services</h2></div>
              <span style={{ fontSize:10, color:"var(--mas-muted)", fontFamily:"var(--mas-mono)", letterSpacing:"0.06em", alignSelf:"flex-end" }}>Port Chester · Greenwich · Westchester</span>
            </div>
          </Reveal>
          <div style={{ height:1, background:"var(--mas-border)" }}/>
          {services.map((s,i) => <ServiceRow key={s.title} s={s} index={i}/>)}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" style={{ padding:"96px 0" }}>
        <div className="sec">
          <Reveal>
            <div style={{ marginBottom:16 }}>
              <div className="el">The collection</div>
              <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
                <h2 style={{ fontFamily:"var(--mas-serif)", fontWeight:300, fontStyle:"italic", fontSize:44, letterSpacing:"-0.01em", color:"var(--mas-ink)", lineHeight:1 }}>Artwork by Patrice Pelissier</h2>
                <span style={{ fontSize:10, color:"var(--mas-muted)", fontFamily:"var(--mas-mono)", letterSpacing:"0.06em", alignSelf:"flex-end" }}>Click any piece to inquire</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}><p style={{ fontSize:15, color:"var(--mas-ink-mid)", lineHeight:1.75, fontWeight:300, maxWidth:600, marginBottom:48 }}>Original works available for purchase. Click any piece to view details and submit an inquiry. Pieces available for direct purchase — no auction house required.</p></Reveal>
          <div className="gg" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {gallery.map((item,i) => <GalleryCard key={item.id} item={item} index={i}/>)}
          </div>
          <Reveal delay={0.2}><p style={{ marginTop:36, fontSize:11, color:"var(--mas-muted)", fontFamily:"var(--mas-mono)", letterSpacing:"0.06em", textAlign:"center" }}>New works added regularly · Follow us on Facebook for the latest</p></Reveal>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding:"96px 0", background:"var(--mas-white)" }}>
        <div className="sec">
          <div className="tc" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"start" }}>
            <Reveal>
              <div className="el">About</div>
              <h2 style={{ fontFamily:"var(--mas-serif)", fontWeight:300, fontStyle:"italic", fontSize:42, letterSpacing:"-0.01em", lineHeight:1.1, marginBottom:24 }}>More than hanging.<br/><span style={{ color:"var(--mas-gold)" }}>Curating your space.</span></h2>
              <p style={{ color:"var(--mas-ink-mid)", lineHeight:1.85, fontSize:15, fontWeight:300, marginBottom:18 }}>Mobile Art Services brings a trained artist's eye to every installation. With over 20 years of experience — including time as a frame designer at the legendary AI Friedman — we understand composition, proportion, and the relationship between art and the space it inhabits.</p>
              <p style={{ color:"var(--mas-ink-mid)", lineHeight:1.85, fontSize:15, fontWeight:300, marginBottom:32 }}>From a single statement piece to a full gallery wall, from canvas stretching to art restoration, we treat every job as an opportunity to make your space look exactly the way it should.</p>
              <button className="bp" onClick={() => go("contact")}>Book a consultation</button>
            </Reveal>
            <Reveal delay={0.15}>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.5px", background:"var(--mas-border)" }}>
                {[["Serving","Westchester County, NY & Greenwich, CT"],["Experience","20+ years · Former frame designer at AI Friedman"],["Specialty","Gallery wall curation & fine art installation"],["Also offered","Canvas stretching, mat & frame selection, art restoration"],["Artist","Patrice Pelissier — original works available direct"],["Phone","203-224-8524"],["Email","info@mobileartservices.com"]].map(([l,v]) => (
                  <div key={l} style={{ background:"var(--mas-white)", padding:"18px 22px", display:"flex", gap:20, alignItems:"baseline" }}>
                    <div style={{ fontSize:10, color:"var(--mas-muted)", fontFamily:"var(--mas-mono)", letterSpacing:"0.1em", textTransform:"uppercase", minWidth:88, flexShrink:0 }}>{l}</div>
                    <div style={{ fontSize:13, color:"var(--mas-ink-mid)", lineHeight:1.5, fontWeight:300 }}>{v}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* AUCTION BUYER CTA */}
      <section style={{ padding:"72px 0", background:"var(--mas-dark)" }}>
        <div className="sec">
          <Reveal>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:36 }}>
              <div>
                <div style={{ fontSize:10, color:"var(--mas-gold)", fontFamily:"var(--mas-mono)", letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}><span style={{ display:"block", width:24, height:1, background:"var(--mas-gold)" }}/>Just won a piece at auction?</div>
                <h2 style={{ fontFamily:"var(--mas-serif)", fontWeight:300, fontStyle:"italic", fontSize:34, color:"var(--mas-bg)", letterSpacing:"-0.01em", lineHeight:1.1, maxWidth:480 }}>We hang auction purchases with the care they deserve.</h2>
              </div>
              <button onClick={() => go("contact")} style={{ background:"transparent", color:"var(--mas-bg)", border:"1px solid rgba(244,240,232,0.3)", padding:"13px 28px", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", fontFamily:"var(--mas-mono)", transition:"border-color 0.2s" }}>Get in touch</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding:"96px 0" }}>
        <div className="sec">
          <div className="tc" style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:80, alignItems:"start" }}>
            <Reveal>
              <div className="el">Get in touch</div>
              <h2 style={{ fontFamily:"var(--mas-serif)", fontWeight:300, fontStyle:"italic", fontSize:42, letterSpacing:"-0.01em", lineHeight:1.1, marginBottom:24 }}>Book a<br/><span style={{ color:"var(--mas-gold)" }}>consultation.</span></h2>
              <p style={{ color:"var(--mas-muted)", fontSize:14, lineHeight:1.8, fontWeight:300, marginBottom:28 }}>Tell us about your space and what you're working with. We'll get back to you within one business day.</p>
              {[["Phone","203-224-8524"],["Email","info@mobileartservices.com"],["Service area","Westchester County, NY · Greenwich, CT"]].map(([l,v]) => (
                <div key={l} style={{ marginBottom:14 }}>
                  <div style={{ fontSize:10, color:"var(--mas-muted)", fontFamily:"var(--mas-mono)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:3 }}>{l}</div>
                  <div style={{ fontSize:14, color:"var(--mas-ink-mid)" }}>{v}</div>
                </div>
              ))}
            </Reveal>
            <Reveal delay={0.15}>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <div><label className="fl">Name</label><input className="fi" placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
                  <div><label className="fl">Phone</label><input className="fi" placeholder="Your phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
                </div>
                <div><label className="fl">Email</label><input className="fi" placeholder="Your email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
                <div>
                  <label className="fl">Service needed</label>
                  <select className="fi" style={{ appearance:"none" }} value={form.service} onChange={e=>setForm({...form,service:e.target.value})}>
                    <option value="">Select a service</option>
                    <option>Art &amp; Mirror Hanging</option>
                    <option>Gallery Wall Curation</option>
                    <option>Frame Selection</option>
                    <option>Mat Selection</option>
                    <option>Canvas Stretching</option>
                    <option>Art Restoration &amp; Repair</option>
                    <option>Artwork Inquiry</option>
                    <option>Auction Purchase Installation</option>
                    <option>Not sure — I'd like to discuss</option>
                  </select>
                </div>
                <div><label className="fl">Tell us about your project</label><textarea className="fi" rows={4} style={{ resize:"vertical" }} placeholder="Describe your space, what you're working with..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
                <button className="bp" onClick={() => window.location.href=`mailto:info@mobileartservices.com?subject=Consultation Request&body=Name: ${form.name}%0APhone: ${form.phone}%0AEmail: ${form.email}%0AService: ${form.service}%0ANotes: ${form.notes}`}>Send inquiry</button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:"0.5px solid var(--mas-border)" }}>
        <div style={{ maxWidth:1060, margin:"0 auto", padding:"24px 48px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div style={{ fontFamily:"var(--mas-serif)", fontWeight:600, fontStyle:"italic", fontSize:16, color:"var(--mas-ink)", letterSpacing:"0.03em" }}>Mobile Art Services<span style={{ fontSize:11, color:"var(--mas-muted)", fontWeight:300, fontStyle:"normal", marginLeft:12, fontFamily:"var(--mas-body)" }}>Port Chester, NY</span></div>
          <div style={{ display:"flex", gap:24 }}>{["services","gallery","about","contact"].map(id => <button key={id} className="nb" onClick={() => go(id)}>{id}</button>)}</div>
          <div style={{ fontSize:10, color:"var(--mas-muted)", fontFamily:"var(--mas-mono)", letterSpacing:"0.08em" }}>203-224-8524</div>
        </div>
      </footer>
    </div>
  );
}
