import { useState, useEffect, useRef } from "react";

const BASE = import.meta.env.BASE_URL;

const ARTWORK = [
  { id: "001", src: `${BASE}images/site/artwork-001.jpg`, title: "Fisherman at dusk" },
  { id: "002", src: `${BASE}images/site/artwork-002.jpg`, title: "Lighthouse on the bay" },
  { id: "003", src: `${BASE}images/site/artwork-003.jpg`, title: "Rowboat on blue water" },
  { id: "004", src: `${BASE}images/site/artwork-004.jpg`, title: "Lighthouse over turquoise sea" },
  { id: "005", src: `${BASE}images/site/artwork-005.jpg`, title: "Path through the dunes" },
  { id: "006", src: `${BASE}images/site/artwork-006.jpg`, title: "Skier on a snowfield" },
  { id: "007", src: `${BASE}images/site/artwork-007.jpg`, title: "Light breaking over the lake" },
  { id: "008", src: `${BASE}images/site/artwork-008.jpg`, title: "Green island on the horizon" },
  { id: "009", src: `${BASE}images/site/artwork-009.jpg`, title: "Moonlit beach" },
  { id: "010", src: `${BASE}images/site/artwork-010.jpg`, title: "Gull over the shoreline" },
].map((a) => ({ ...a, artist: "Patrice Pelissier", caption: "Original artwork by Patrice Pelissier — inquire for details and pricing." }));

const SERVICES = [
  "Frame Selection",
  "Mat Selection",
  "Canvas Stretching",
  "Art and Mirror Hanging",
  "Art Restoration and Repair",
  "and Much More!",
];

function ArtworkTile({ item, tileRef, autoOpen = false }) {
  const [lightbox, setLightbox] = useState(autoOpen);
  useEffect(() => { if (autoOpen) setLightbox(true); }, [autoOpen]);
  return (
    <>
      <div className="tile" ref={tileRef} onClick={() => setLightbox(true)} style={{ cursor: "pointer" }}>
        <img src={item.src} alt={`${item.title}, painting by ${item.artist}`} draggable="false" />
      </div>
      {lightbox && (
        <div onClick={() => setLightbox(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--mas-white)", padding: 32, maxWidth: 640, width: "100%" }}>
            <img src={item.src} alt={item.title} style={{ width: "100%", height: "auto", display: "block", marginBottom: 20 }} />
            <div style={{ fontFamily: "var(--mas-serif)", fontSize: 22, color: "var(--mas-ink)", marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontSize: 13, color: "var(--mas-ink-body)", marginBottom: 20 }}>{item.caption}</div>
            <a
              href={`mailto:info@mobileartservices.com?subject=Inquiry: ${item.title}&body=I am interested in "${item.title}" by ${item.artist}. Please provide details and pricing.`}
              style={{ display: "inline-block", background: "var(--mas-black)", color: "var(--mas-white)", padding: "13px 28px", fontSize: 13, fontFamily: "var(--mas-futura)", textDecoration: "none" }}
            >
              Inquire about this piece
            </a>
            <button onClick={() => setLightbox(false)} style={{ marginLeft: 12, background: "transparent", border: "1px solid var(--mas-ink)", color: "var(--mas-ink)", padding: "13px 20px", fontSize: 13, fontFamily: "var(--mas-futura)", cursor: "pointer" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function AboutSection() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetch(`${BASE}data/about.json`)
      .then((r) => r.json())
      .then(setAbout)
      .catch(() => setAbout(null));
  }, []);

  if (!about || !about.published) return null;

  return (
    <section className="about" id="about">
      <div className="about-inner">
        <div className="about-box">
          <div
            className="about-photo"
            role="img"
            aria-label="Owner photo placeholder"
            style={about.photo ? { background: `#dcd8cf url("${BASE}images/site/${about.photo}") center / cover no-repeat`, color: "transparent" } : undefined}
          >
            {!about.photo && "[Owner photo]"}
          </div>
          <div className="about-text">
            <h2>About</h2>
            <p>
              Mobile Art Services is a Black-owned art services business <span className="ph">{about.ownerLine}</span>. Since{" "}
              <span className="ph">{about.foundedYear}</span>, we have brought <span className="ph">{about.yearsExperience}</span> years of
              experience in frame design, art hanging and restoration to homes and businesses across Port Chester, Westchester County and
              Greenwich, CT.
            </p>
            <p>
              <span className="ph">{about.story}</span>
            </p>
            <dl className="about-facts">
              <dt>Owned by</dt>
              <dd><span className="ph">{about.ownedBy}</span></dd>
              <dt>Founded</dt>
              <dd><span className="ph">{about.foundedYear}</span></dd>
              <dt>Serving</dt>
              <dd>{about.serving}</dd>
              <dt>Insurance</dt>
              <dd><span className="ph">{about.insurance}</span></dd>
              <dt>Certification</dt>
              <dd><span className="ph">{about.certification}</span></dd>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MobileArtServices() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", subject: "", message: "" });
  const [autoOpenId, setAutoOpenId] = useState(null);

  const trackRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const barRef = useRef(null);
  const tileRefs = useRef({});

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const piece = new URLSearchParams(window.location.search).get("piece");
    if (piece) {
      setAutoOpenId(piece);
      setTimeout(() => {
        document.getElementById("auctions")?.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          tileRefs.current[piece]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }, 300);
      }, 100);
    }
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const prev = prevRef.current;
    const next = nextRef.current;
    const bar = barRef.current;
    if (!track || !prev || !next || !bar) return;

    function step() {
      const tile = track.querySelector(".tile");
      if (!tile) return 0;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const per = Math.max(1, Math.floor((track.clientWidth + gap) / (tile.offsetWidth + gap)));
      return per * (tile.offsetWidth + gap);
    }
    function update() {
      const max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
      const visible = track.clientWidth / track.scrollWidth;
      bar.style.width = visible * 100 + "%";
      bar.style.transform = "translateX(" + (max > 0 ? (track.scrollLeft / max) * ((1 - visible) / visible) * 100 : 0) + "%)";
    }
    const onPrev = () => track.scrollBy({ left: -step() });
    const onNext = () => track.scrollBy({ left: step() });
    const onKey = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); track.scrollBy({ left: step() }); }
      if (e.key === "ArrowLeft") { e.preventDefault(); track.scrollBy({ left: -step() }); }
    };
    prev.addEventListener("click", onPrev);
    next.addEventListener("click", onNext);
    track.addEventListener("keydown", onKey);
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      prev.removeEventListener("click", onPrev);
      next.removeEventListener("click", onNext);
      track.removeEventListener("keydown", onKey);
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const sendInquiry = () => {
    window.location.href = `mailto:info@mobileartservices.com?subject=${form.subject || "Consultation Request"}&body=Name: ${form.name}%0APhone: ${form.phone}%0AEmail: ${form.email}%0AService: ${form.service}%0AMessage: ${form.message}`;
  };

  return (
    <div style={{ background: "var(--mas-white)", minHeight: "100vh", color: "var(--mas-ink)", fontFamily: "var(--mas-futura)" }}>
      <style>{`
        :root {
          --mas-white: #ffffff;
          --mas-cream: #EFECE2;
          --mas-ink: #111111;
          --mas-ink-body: #1c1c1c;
          --mas-nav-ink: #2b2b2b;
          --mas-panel: rgba(88, 88, 88, 0.58);
          --mas-black: #000000;
          --mas-script: 'ScriptLocal', 'Brush Script MT', cursive;
          --mas-serif: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
          --mas-futura: 'JostLocal', 'Futura', 'Century Gothic', 'Trebuchet MS', sans-serif;
        }
        @font-face {
          font-family: 'JostLocal';
          src: url("${BASE}fonts/Jost.woff2") format('woff2');
          font-weight: 100 900; font-style: normal; font-display: swap;
        }
        @font-face {
          font-family: 'ScriptLocal';
          src: url("${BASE}fonts/DancingScript.woff2") format('woff2');
          font-weight: 400; font-style: normal; font-display: swap;
        }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--mas-futura); font-weight: 400; background: var(--mas-white); color: var(--mas-ink); }
        html { scroll-behavior: smooth; }

        .sec-nav { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 20; background: var(--mas-white); }
        .nav-inner {
          max-width: 1550px; margin: 0 auto;
          padding-block: 32px;
          padding-left: max(16px, min(80px, 5.2vw), env(safe-area-inset-left, 0px));
          padding-right: max(16px, min(80px, 5.2vw), env(safe-area-inset-right, 0px));
          display: flex; align-items: center; gap: 24px;
        }
        .wordmark {
          font-family: var(--mas-futura); font-weight: 550; font-size: 1.55rem;
          letter-spacing: -0.055em; color: var(--mas-ink); text-decoration: none; white-space: nowrap;
          margin-right: auto; cursor: pointer; background: none; border: none;
        }
        .nav-links { display: flex; gap: 20px; list-style: none; margin-right: 94px; }
        .nav-links button { font-size: .9rem; font-weight: 400; color: var(--mas-nav-ink); text-decoration: none; background: none; border: none; cursor: pointer; font-family: var(--mas-futura); padding: 0; }
        .nav-links button:hover { opacity: .6; }
        .nav-social { display: flex; gap: 14px; align-items: center; margin-right: 76px; }
        .nav-social a { color: var(--mas-ink); display: flex; }
        .nav-social svg { width: 16px; height: 16px; fill: currentColor; }
        nav a:focus-visible, nav button:focus-visible { outline: 1px solid var(--mas-ink); outline-offset: 4px; }

        .hero { position: relative; clip-path: inset(0); display: flex; justify-content: flex-end; }
        .hero-photo {
          position: fixed; inset: 0; z-index: -1;
          background: #e8e8e8 url("${BASE}images/site/hero.jpg") center / cover no-repeat;
        }
        .hero-panel {
          width: min(42%, 620px); min-height: 130vh; background: var(--mas-panel);
          display: flex; flex-direction: column; justify-content: center; align-items: flex-end;
          text-align: right;
          padding-block: 120px;
          padding-left: 48px;
          padding-right: max(48px, env(safe-area-inset-right, 0px));
        }
        .hero-title {
          font-family: var(--mas-serif); font-weight: 400;
          font-size: clamp(2.8rem, 6vw, 5.6rem); line-height: .98;
          letter-spacing: .05em; text-transform: uppercase; color: var(--mas-white); text-wrap: balance;
        }
        .hero-tagline { margin-top: 28px; max-width: 320px; font-size: 1rem; font-weight: 300; line-height: 1.7; color: rgba(255,255,255,.92); }

        .consult { background: var(--mas-white); position: relative; }
        .consult-inner {
          max-width: 1550px; margin: 0 auto;
          padding-block: 80px;
          padding-left: max(16px, min(80px, 5.2vw), env(safe-area-inset-left, 0px));
          padding-right: max(16px, min(80px, 5.2vw), env(safe-area-inset-right, 0px));
        }
        .consult-box { display: grid; grid-template-columns: 1fr 1fr; min-height: 620px; }
        .consult-text {
          background: var(--mas-cream); min-width: 0;
          display: flex; flex-direction: column; justify-content: center;
          padding-block: 64px;
          padding-left: 17%; padding-right: 10%;
        }
        .consult-text h2 {
          font-family: var(--mas-futura); font-weight: 340;
          font-size: clamp(2rem, 3vw, 2.75rem); line-height: 1.22; color: var(--mas-ink);
          max-width: 14ch; margin-bottom: 40px;
        }
        .consult-text p { font-size: .94rem; line-height: 1.86; color: var(--mas-ink-body); max-width: 432px; }
        .consult-link {
          margin-top: 28px; align-self: flex-start;
          font-size: .94rem; color: var(--mas-ink-body); text-decoration: none;
          background: none; border: none; cursor: pointer; font-family: var(--mas-futura); padding: 0;
        }
        .consult-link:hover { opacity: .6; }
        .consult-photo { background: #ddd url("${BASE}images/site/consultation.jpg") center / cover no-repeat; min-height: 320px; }

        .services { background: var(--mas-white); position: relative; }
        .services-inner {
          max-width: 1550px; margin: 0 auto;
          padding-block: 22px 80px;
          padding-left: max(16px, min(80px, 5.2vw), env(safe-area-inset-left, 0px));
          padding-right: max(16px, min(80px, 5.2vw), env(safe-area-inset-right, 0px));
          text-align: center;
        }
        .services h2 {
          font-family: var(--mas-futura); font-weight: 340;
          font-size: clamp(1.9rem, 2.7vw, 2.5rem); line-height: 1.2; color: var(--mas-ink);
          margin-bottom: 30px;
        }
        .services-list { list-style: none; display: grid; gap: 0; }
        .services-list li { font-size: .94rem; line-height: 1.86; letter-spacing: .02em; color: var(--mas-ink-body); }
        .services-photo {
          margin-top: 80px;
          aspect-ratio: 1230 / 390; max-width: 100%;
          background: #eee url("${BASE}images/site/services-band.jpg") center / cover no-repeat;
        }

        .about { background: var(--mas-white); position: relative; }
        .about-inner {
          max-width: 1550px; margin: 0 auto;
          padding-block: 0 80px;
          padding-left: max(16px, min(80px, 5.2vw), env(safe-area-inset-left, 0px));
          padding-right: max(16px, min(80px, 5.2vw), env(safe-area-inset-right, 0px));
        }
        .about-box { display: grid; grid-template-columns: 1fr 1fr; min-height: 560px; }
        .about-photo {
          background: #dcd8cf; display: flex; align-items: center; justify-content: center;
          min-height: 320px; color: #6d685f; font-size: .85rem; letter-spacing: .08em; text-transform: uppercase;
        }
        .about-text {
          background: var(--mas-cream); min-width: 0;
          display: flex; flex-direction: column; justify-content: center;
          padding-block: 64px; padding-left: 12%; padding-right: 12%;
        }
        .about-text h2 {
          font-family: var(--mas-futura); font-weight: 340;
          font-size: clamp(1.9rem, 2.7vw, 2.5rem); line-height: 1.2; color: var(--mas-ink); margin-bottom: 28px;
        }
        .about-text p { font-size: .94rem; line-height: 1.86; color: var(--mas-ink-body); max-width: 460px; }
        .about-text p + p { margin-top: 16px; }
        .about-facts { margin-top: 32px; display: grid; grid-template-columns: max-content 1fr; gap: 10px 28px; max-width: 460px; }
        .about-facts dt { font-size: .78rem; letter-spacing: .08em; text-transform: uppercase; color: #6d685f; padding-top: 3px; }
        .about-facts dd { font-size: .94rem; color: var(--mas-ink-body); }
        .ph { background: #f4e3a6; padding: 0 4px; border-radius: 2px; }

        .contact { background: var(--mas-black); color: var(--mas-white); position: relative; }
        .contact-inner {
          max-width: 1550px; margin: 0 auto;
          padding-block: 80px;
          padding-left: max(16px, min(80px, 5.2vw), env(safe-area-inset-left, 0px));
          padding-right: max(16px, min(80px, 5.2vw), env(safe-area-inset-right, 0px));
          display: grid; grid-template-columns: 1fr 1fr; align-items: center;
        }
        .contact-photo { aspect-ratio: 693 / 664; max-width: 100%; background: #222 url("${BASE}images/site/contact.jpg") center / cover no-repeat; }
        .contact-form-wrap { min-width: 0; padding-left: 17%; padding-bottom: 50px; }
        .contact-form-wrap h2 {
          font-family: var(--mas-futura); font-weight: 340;
          font-size: clamp(1.9rem, 2.7vw, 2.5rem); line-height: 1.2; color: var(--mas-white);
          margin-bottom: 4px;
        }
        .contact-form { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 10px; max-width: 460px; }
        .contact-form .full { grid-column: 1 / -1; }
        .contact-form input, .contact-form textarea, .contact-form select {
          width: 100%; background: transparent; color: var(--mas-white);
          border: 0; border-bottom: 1px solid var(--mas-white); border-radius: 0;
          font-family: var(--mas-futura); font-weight: 400; font-size: .9rem;
          padding: 10px 11px; height: 40px; outline: none;
        }
        .contact-form select { appearance: none; }
        .contact-form select option { color: var(--mas-ink); }
        .contact-form textarea { height: 124px; resize: none; padding: 14px 15px; }
        .contact-form ::placeholder { color: var(--mas-white); opacity: 1; }
        .contact-form input:focus, .contact-form textarea:focus, .contact-form select:focus { border-bottom-width: 2px; }
        .contact-submit {
          margin-top: 25px; height: 50px; width: 100%;
          background: var(--mas-white); color: var(--mas-black); border: 0; cursor: pointer;
          font-family: var(--mas-script); font-size: 1.15rem;
        }
        .contact-submit:hover { background: #e9e9e9; }
        .contact-submit:focus-visible { outline: 2px solid var(--mas-white); outline-offset: 3px; }

        .gallery { background: var(--mas-white); position: relative; }
        .gallery-inner {
          max-width: 1550px; margin: 0 auto;
          padding-block: 80px;
          padding-left: max(16px, min(80px, 5.2vw), env(safe-area-inset-left, 0px));
          padding-right: max(16px, min(80px, 5.2vw), env(safe-area-inset-right, 0px));
        }
        .carousel { position: relative; }
        .track {
          --per: 4; --gap: 6px;
          display: flex; gap: var(--gap);
          overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth;
          scrollbar-width: none; overscroll-behavior-x: contain;
        }
        .track::-webkit-scrollbar { display: none; }
        .tile {
          flex: 0 0 calc((100% - (var(--per) - 1) * var(--gap)) / var(--per));
          aspect-ratio: 1; max-width: 100%;
          scroll-snap-align: start; overflow: hidden; background: #f2f2f2;
        }
        .tile img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .6s ease; user-select: none; }
        .tile:hover img { transform: scale(1.04); }
        .tile.label { background: var(--mas-black); display: flex; align-items: center; justify-content: center; padding: 24px; cursor: default; }
        .tile.label span {
          font-family: var(--mas-futura); font-weight: 300; text-transform: uppercase; text-align: center;
          font-size: clamp(1.1rem, 1.9vw, 1.75rem); line-height: 1.25; letter-spacing: .02em; color: #b9b9b9;
        }
        .car-btn {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 46px; height: 46px; border-radius: 50%; border: 0; cursor: pointer;
          background: rgba(255,255,255,.92); color: var(--mas-ink);
          box-shadow: 0 2px 14px rgba(0,0,0,.18);
          display: flex; align-items: center; justify-content: center;
          transition: opacity .25s, background .2s;
        }
        .car-btn:hover { background: var(--mas-white); }
        .car-btn:focus-visible { outline: 2px solid var(--mas-ink); outline-offset: 3px; }
        .car-btn[disabled] { opacity: 0; pointer-events: none; }
        .car-btn svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 1.6; }
        .car-prev { left: 14px; }
        .car-next { right: 14px; }
        .car-progress { margin: 28px auto 0; width: 160px; height: 2px; background: #e4e4e4; position: relative; overflow: hidden; }
        .car-progress span { position: absolute; inset: 0 auto 0 0; width: 25%; background: var(--mas-ink); transition: transform .3s ease; }
        .ebay-cta { display: flex; justify-content: center; margin-top: 40px; }
        .ebay-cta a {
          font-family: var(--mas-futura); font-size: .9rem; color: var(--mas-ink); text-decoration: none;
          border: 1px solid var(--mas-ink); padding: 14px 34px; transition: background .2s, color .2s;
        }
        .ebay-cta a:hover { background: var(--mas-ink); color: var(--mas-white); }
        @media (max-width: 1000px) { .track { --per: 3; } }
        @media (max-width: 640px) {
          .track { --per: 1.35; }
          .car-btn { display: none; }
          .gallery-inner { padding-block: 48px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .track { scroll-behavior: auto; }
          .tile img { transition: none; }
        }

        @media (max-width: 900px) {
          .nav-links { margin-right: 0; }
          .nav-social { margin-right: 0; display: none; }
        }
        @media (max-width: 768px) {
          .nav-inner { padding-block: 18px; gap: 16px; }
          .wordmark { font-size: 1.2rem; }
          .nav-links { gap: 14px; }
          .nav-links button { font-size: .8rem; }
          .hero { align-items: flex-end; }
          .hero-photo { background-position: 38% center; }
          .hero-panel {
            width: 100%; min-height: 0; margin-top: 70vh;
            padding-block: 40px 56px;
            padding-left: max(24px, env(safe-area-inset-left, 0px));
            padding-right: max(24px, env(safe-area-inset-right, 0px));
          }
          .consult-inner { padding-block: 40px; }
          .consult-box { grid-template-columns: 1fr; min-height: 0; }
          .consult-text { padding: 48px 28px; }
          .consult-photo { aspect-ratio: 693 / 620; min-height: 0; max-width: 100%; }
          .contact-inner { grid-template-columns: 1fr; gap: 40px; padding-block: 48px; }
          .contact-form-wrap { padding-left: 0; padding-bottom: 0; }
          .contact-form { max-width: none; }
          .services-photo { margin-top: 48px; aspect-ratio: 4 / 3; background-position: 60% top; }
          .about-box { grid-template-columns: 1fr; min-height: 0; }
          .about-photo { aspect-ratio: 4 / 3; min-height: 0; max-width: 100%; }
          .about-text { padding: 48px 28px; }
          .about-inner { padding-block: 0 48px; }
        }
      `}</style>

      <nav className="sec-nav">
        <div className="nav-inner">
          <button className="wordmark" onClick={() => go("home")}>Mobile Art Services</button>
          <ul className="nav-links">
            <li><button onClick={() => go("home")}>Home</button></li>
            <li><button onClick={() => go("auctions")}>Auctions</button></li>
            <li><button onClick={() => go("contact")}>Contact</button></li>
          </ul>
          <div className="nav-social">
            <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M14 8V6.2c0-.8.5-1.2 1.2-1.2H17V1.5h-2.6C11.6 1.5 10.5 3.3 10.5 6v2H8v3.6h2.5V22.5H14V11.6h2.8l.4-3.6z"/></svg></a>
            <a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24"><path d="M23 4.6c-.8.4-1.7.6-2.6.7.9-.6 1.6-1.4 2-2.5-.9.5-1.9.9-2.9 1.1A4.5 4.5 0 0 0 11.8 8 12.8 12.8 0 0 1 2.5 3.3a4.5 4.5 0 0 0 1.4 6 4.4 4.4 0 0 1-2-.6v.1a4.5 4.5 0 0 0 3.6 4.4 4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 18.3 12.8 12.8 0 0 0 7.9 20.3c8.3 0 12.8-6.9 12.8-12.8v-.6c.9-.6 1.6-1.4 2.3-2.3z"/></svg></a>
            <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M2.5 8.5h4v13h-4zM4.5 2a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6zM9 8.5h3.8v1.8h.1c.5-1 1.8-2.1 3.8-2.1 4 0 4.8 2.7 4.8 6.1v7.2h-4v-6.4c0-1.5 0-3.5-2.1-3.5s-2.5 1.7-2.5 3.4v6.5H9z"/></svg></a>
          </div>
        </div>
      </nav>

      <section id="home" className="hero" aria-label="Mobile Art Services">
        <div className="hero-photo" role="img" aria-label="Living room with a gallery wall of black frames" />
        <div className="hero-panel">
          <h1 className="hero-title">Mobile Art<br />Services</h1>
          <p className="hero-tagline">Welcome to Mobile Art Services. The one stop shop for your Frame Design needs.</p>
        </div>
      </section>

      <section className="consult" id="consultation">
        <div className="consult-inner">
          <div className="consult-box">
            <div className="consult-text">
              <h2>Call us Today for a Consultation</h2>
              <p>Mobile Art Services provides professional frame design and art hanging services. With over 20 years experience our professional Artist will help you pick out the perfect frame and mat to elevate your artwork. In addition, we offer Art and Mirror hanging, Art Restoration and Cleaning, Frame repair and much more!</p>
              <button className="consult-link" onClick={() => go("contact")}>Make An Appointment Today!</button>
            </div>
            <div className="consult-photo" role="img" aria-label="Framed prints on a wall behind a wooden table" />
          </div>
        </div>
      </section>

      <section className="services" id="services">
        <div className="services-inner">
          <h2>Services</h2>
          <ul className="services-list">
            {SERVICES.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <div className="services-photo" role="img" aria-label="Empty picture frames in gold, silver and wood hanging on a white wall" />
        </div>
      </section>

      <AboutSection />

      <section className="contact" id="contact">
        <div className="contact-inner">
          <div className="contact-photo" role="img" aria-label="Close-up of ornate carved wooden picture frames" />
          <div className="contact-form-wrap">
            <h2>Contact</h2>
            <div className="contact-form">
              <input placeholder="Name" aria-label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Phone" aria-label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="full" type="email" placeholder="Email" aria-label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <select className="full" aria-label="Service needed" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
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
              <input className="full" placeholder="Subject" aria-label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              <textarea className="full" placeholder="Type your message here..." aria-label="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              <button type="button" className="contact-submit full" onClick={sendInquiry}>Submit</button>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery" id="auctions" aria-label="Artwork by Patrice Pelissier">
        <div className="gallery-inner">
          <div className="carousel">
            <div className="track" id="track" ref={trackRef} tabIndex={0} aria-label="Artwork carousel. Use the arrow buttons or scroll sideways.">
              <div className="tile label"><span>Artwork by<br />Patrice Pelissier</span></div>
              {ARTWORK.map((item) => (
                <ArtworkTile
                  key={item.id}
                  item={item}
                  autoOpen={item.id === autoOpenId}
                  tileRef={(el) => { tileRefs.current[item.id] = el; }}
                />
              ))}
            </div>
            <button className="car-btn car-prev" ref={prevRef} aria-label="Previous artwork" disabled><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" /></svg></button>
            <button className="car-btn car-next" ref={nextRef} aria-label="Next artwork"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg></button>
          </div>
          <div className="car-progress" aria-hidden="true"><span ref={barRef} /></div>
          <div className="ebay-cta"><a href="https://www.ebay.com/str/mobileartservices" target="_blank" rel="noopener">View All Listings on eBay</a></div>
        </div>
      </section>
    </div>
  );
}
