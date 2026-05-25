import { useState, useEffect } from "react";

const STYLES = `
  :root {
    --mas-dark:   #1A2744;
    --mas-blue:   #1A2744;
    --mas-gold:   #C8960A;
    --mas-bg:     #F4F2EE;
    --mas-white:  #FFFFFF;
    --mas-text:   #2C2C2C;
    --mas-muted:  #706D68;
    --mas-border: #D9D5CE;
    --mas-radius: 3px;
    --mas-max:    1100px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--mas-bg);
    color: var(--mas-text);
    font-family: Georgia, 'Times New Roman', serif;
    line-height: 1.6;
  }

  a { color: var(--mas-gold); text-decoration: none; }
  a:hover { text-decoration: underline; }

  /* ── NAV ── */
  .mas-nav {
    background: var(--mas-dark);
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .mas-nav-brand {
    color: var(--mas-white);
    font-size: 1.05rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .mas-nav-brand em {
    color: var(--mas-gold);
    font-style: normal;
  }
  .mas-nav-links {
    display: flex;
    gap: 24px;
    font-family: system-ui, sans-serif;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.65);
  }
  .mas-nav-links a { color: rgba(255,255,255,0.65); }
  .mas-nav-links a:hover { color: var(--mas-gold); text-decoration: none; }

  /* ── HERO ── */
  .mas-hero {
    background: var(--mas-dark);
    color: var(--mas-white);
    padding: 96px 32px 108px;
    text-align: center;
  }
  .mas-eyebrow {
    font-family: system-ui, sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--mas-gold);
    margin-bottom: 20px;
  }
  .mas-hero h1 {
    font-size: clamp(2.25rem, 5vw, 3.75rem);
    font-weight: normal;
    letter-spacing: -0.01em;
    line-height: 1.15;
    margin-bottom: 20px;
  }
  .mas-hero-sub {
    font-family: system-ui, sans-serif;
    font-size: 1.05rem;
    color: rgba(255,255,255,0.68);
    max-width: 500px;
    margin: 0 auto 40px;
    line-height: 1.55;
  }
  .mas-hero-cta {
    display: inline-flex;
    gap: 14px;
    flex-wrap: wrap;
    justify-content: center;
  }

  /* ── BUTTONS ── */
  .btn-gold {
    background: var(--mas-gold);
    color: var(--mas-dark);
    padding: 12px 28px;
    font-family: system-ui, sans-serif;
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    border-radius: var(--mas-radius);
    transition: background 0.15s;
  }
  .btn-gold:hover { background: #b08409; text-decoration: none; color: var(--mas-dark); }

  .btn-outline {
    background: transparent;
    color: var(--mas-white);
    padding: 12px 28px;
    font-family: system-ui, sans-serif;
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    border: 1.5px solid rgba(255,255,255,0.35);
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    border-radius: var(--mas-radius);
    transition: border-color 0.15s;
  }
  .btn-outline:hover { border-color: var(--mas-white); text-decoration: none; color: var(--mas-white); }

  /* ── GALLERY ── */
  .mas-gallery-strip {
    background: var(--mas-white);
    border-top: 1px solid var(--mas-border);
    border-bottom: 1px solid var(--mas-border);
  }
  .mas-gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3px;
  }
  .mas-gallery-item {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: var(--mas-border);
  }
  .mas-gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }
  .mas-gallery-item:hover img { transform: scale(1.04); }
  .mas-gallery-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(26,39,68,0.85) 0%, transparent 55%);
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: flex-end;
    padding: 16px;
  }
  .mas-gallery-item:hover .mas-gallery-overlay { opacity: 1; }
  .mas-gallery-tag {
    display: inline-block;
    background: var(--mas-gold);
    color: var(--mas-dark);
    font-family: system-ui, sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 2px 7px;
    border-radius: 2px;
    margin-bottom: 6px;
  }
  .mas-gallery-caption {
    color: var(--mas-white);
    font-family: system-ui, sans-serif;
    font-size: 0.8rem;
  }

  /* ── SECTION SHELL ── */
  .mas-section {
    max-width: var(--mas-max);
    margin: 0 auto;
    padding: 80px 32px;
  }
  .mas-section-title {
    font-size: clamp(1.6rem, 3vw, 2.25rem);
    font-weight: normal;
    color: var(--mas-dark);
    margin-bottom: 8px;
  }
  .mas-divider {
    width: 40px;
    height: 2px;
    background: var(--mas-gold);
    margin: 18px 0 44px;
  }

  /* ── SERVICES ── */
  .mas-services-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border: 1px solid var(--mas-border);
  }
  .mas-service-row {
    display: flex;
    gap: 20px;
    padding: 28px 32px;
    border-right: 1px solid var(--mas-border);
    border-bottom: 1px solid var(--mas-border);
  }
  .mas-service-row:nth-child(even)       { border-right: none; }
  .mas-service-row:nth-last-child(-n+2)  { border-bottom: none; }
  .mas-service-num {
    font-family: system-ui, sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--mas-gold);
    flex-shrink: 0;
    width: 24px;
    margin-top: 5px;
  }
  .mas-service-body h3 {
    font-size: 1rem;
    font-weight: normal;
    color: var(--mas-dark);
    margin-bottom: 8px;
  }
  .mas-service-body p {
    font-family: system-ui, sans-serif;
    font-size: 0.865rem;
    color: var(--mas-muted);
    line-height: 1.6;
  }

  /* ── AUCTION CTA ── */
  .mas-auction {
    background: var(--mas-dark);
    color: var(--mas-white);
    padding: 80px 32px;
    text-align: center;
  }
  .mas-auction h2 {
    font-size: clamp(1.5rem, 3.5vw, 2.5rem);
    font-weight: normal;
    line-height: 1.25;
    max-width: 600px;
    margin: 16px auto 20px;
  }
  .mas-auction p {
    font-family: system-ui, sans-serif;
    font-size: 1rem;
    color: rgba(255,255,255,0.68);
    max-width: 480px;
    margin: 0 auto 36px;
    line-height: 1.6;
  }

  /* ── BOOKING FORM ── */
  .mas-form-card {
    background: var(--mas-white);
    border: 1px solid var(--mas-border);
    border-radius: var(--mas-radius);
    padding: 40px;
  }
  .mas-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .mas-form-full { grid-column: 1 / -1; }
  .mas-field { display: flex; flex-direction: column; gap: 6px; }
  .mas-field label {
    font-family: system-ui, sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--mas-muted);
    font-weight: 600;
  }
  .mas-field input,
  .mas-field select,
  .mas-field textarea {
    background: var(--mas-bg);
    border: 1px solid var(--mas-border);
    padding: 10px 14px;
    font-family: system-ui, sans-serif;
    font-size: 0.9rem;
    color: var(--mas-text);
    border-radius: var(--mas-radius);
    outline: none;
    transition: border-color 0.2s;
    appearance: none;
  }
  .mas-field input:focus,
  .mas-field select:focus,
  .mas-field textarea:focus { border-color: var(--mas-dark); }
  .mas-field textarea { resize: vertical; min-height: 120px; }
  .mas-form-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .mas-form-note {
    font-family: system-ui, sans-serif;
    font-size: 0.8rem;
    color: var(--mas-muted);
  }

  /* ── FOOTER ── */
  .mas-footer {
    background: var(--mas-dark);
    color: rgba(255,255,255,0.5);
    padding: 40px 32px;
    font-family: system-ui, sans-serif;
    font-size: 0.8rem;
  }
  .mas-footer-inner {
    max-width: var(--mas-max);
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  .mas-footer-brand {
    color: var(--mas-white);
    font-size: 0.85rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .mas-footer a { color: rgba(255,255,255,0.5); }
  .mas-footer a:hover { color: var(--mas-gold); text-decoration: none; }
  .mas-footer-contact { display: flex; gap: 24px; flex-wrap: wrap; }

  /* ── RESPONSIVE ── */
  @media (max-width: 720px) {
    .mas-nav { padding: 0 16px; }
    .mas-nav-links { display: none; }
    .mas-gallery-grid { grid-template-columns: repeat(2, 1fr); }
    .mas-services-grid { grid-template-columns: 1fr; }
    .mas-service-row { border-right: none; }
    .mas-service-row:nth-last-child(-n+2) { border-bottom: 1px solid var(--mas-border); }
    .mas-service-row:last-child { border-bottom: none; }
    .mas-form { grid-template-columns: 1fr; }
    .mas-form-card { padding: 24px; }
    .mas-section { padding: 56px 20px; }
    .mas-hero { padding: 64px 20px 72px; }
  }
`;

export default function MobileArtServices() {
  const [gallery, setGallery] = useState([]);
  const [services, setServices] = useState([]);
  const [info, setInfo] = useState(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", service: "", message: "",
  });

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/gallery.json`).then((r) => r.json()),
      fetch(`${import.meta.env.BASE_URL}data/services.json`).then((r) => r.json()),
      fetch(`${import.meta.env.BASE_URL}data/info.json`).then((r) => r.json()),
      fetch(`${import.meta.env.BASE_URL}data/testimonials.json`).then((r) => r.json()),
    ])
      .then(([g, s, i]) => {
        setGallery(g);
        setServices(s);
        setInfo(i);
      })
      .catch(console.error);
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!info) return;
    const { name, email, phone, service, message } = form;
    const subject = encodeURIComponent(`Booking Inquiry – ${service || "General"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService Needed: ${service}\n\n${message}`
    );
    window.location.href = `mailto:${info.bookingEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <style>{STYLES}</style>

      {/* NAV */}
      <nav className="mas-nav">
        <span className="mas-nav-brand">
          Mobile <em>Art</em> Services
        </span>
        {info && (
          <div className="mas-nav-links">
            <a href="#services">Services</a>
            <a href="#booking">Book a Consultation</a>
            <a href={`tel:${info.phone}`}>{info.phone}</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="mas-hero">
        {info && <div className="mas-eyebrow">{info.serviceArea}</div>}
        <h1>Art, Placed with<br />Precision.</h1>
        <p className="mas-hero-sub">
          Professional art hanging and gallery wall curation for homes, estates,
          and corporate spaces{info ? ` across ${info.serviceArea}` : ""}.
        </p>
        <div className="mas-hero-cta">
          <a href="#booking" className="btn-gold">Book a Consultation</a>
          <a href="#services" className="btn-outline">View Services</a>
        </div>
      </section>

      {/* GALLERY */}
      {gallery.length > 0 && (
        <div className="mas-gallery-strip">
          <div className="mas-gallery-grid">
            {gallery.map((item) => (
              <div className="mas-gallery-item" key={item.filename}>
                <img
                  src={`${import.meta.env.BASE_URL}images/${item.filename}`}
                  alt={item.caption}
                  loading="lazy"
                />
                <div className="mas-gallery-overlay">
                  <div>
                    <div className="mas-gallery-tag">{item.tag}</div>
                    <div className="mas-gallery-caption">{item.caption}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SERVICES */}
      <div id="services">
        <div className="mas-section">
          <div className="mas-eyebrow">What We Do</div>
          <h2 className="mas-section-title">Services</h2>
          <div className="mas-divider" />
          {services.length > 0 && (
            <div className="mas-services-grid">
              {services.map((svc, i) => (
                <div className="mas-service-row" key={svc.title}>
                  <div className="mas-service-num">{String(i + 1).padStart(2, "0")}</div>
                  <div className="mas-service-body">
                    <h3>{svc.title}</h3>
                    <p>{svc.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AUCTION BUYER CTA */}
      <section className="mas-auction">
        <div className="mas-eyebrow">For Auction Buyers</div>
        <h2>Just Won Something Beautiful?<br />We'll Get It on Your Wall.</h2>
        <p>
          From Christie's to local estate sales — we coordinate post-auction pickup,
          white-glove delivery, and professional installation so your new acquisition
          goes straight from the sale to perfectly hung.
        </p>
        <a href="#booking" className="btn-gold">Schedule Installation</a>
      </section>

      {/* BOOKING FORM */}
      <div id="booking">
        <div className="mas-section">
          <div className="mas-eyebrow">Get in Touch</div>
          <h2 className="mas-section-title">Book a Consultation</h2>
          <div className="mas-divider" />
          <div className="mas-form-card">
            <form className="mas-form" onSubmit={handleSubmit}>
              <div className="mas-field">
                <label>Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  required
                  placeholder="Your full name"
                />
              </div>
              <div className="mas-field">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div className="mas-field">
                <label>Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="(000) 000-0000"
                />
              </div>
              <div className="mas-field">
                <label>Service Needed</label>
                <select value={form.service} onChange={set("service")}>
                  <option value="">Select a service…</option>
                  {services.map((svc) => (
                    <option key={svc.title} value={svc.title}>
                      {svc.title}
                    </option>
                  ))}
                  <option value="Other / Not Sure">Other / Not Sure</option>
                </select>
              </div>
              <div className="mas-field mas-form-full">
                <label>Tell Us About Your Project</label>
                <textarea
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Number of pieces, room size, wall type, special requirements…"
                />
              </div>
              <div className="mas-form-full">
                <div className="mas-form-footer">
                  <span className="mas-form-note">
                    We respond within one business day.
                  </span>
                  <button type="submit" className="btn-gold">
                    Send Inquiry →
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mas-footer">
        <div className="mas-footer-inner">
          <div>
            <div className="mas-footer-brand">
              {info?.businessName ?? "Mobile Art Services"}
            </div>
            {info && (
              <div>
                {info.location} · Serving {info.serviceArea}
              </div>
            )}
          </div>
          {info && (
            <div className="mas-footer-contact">
              <a href={`tel:${info.phone}`}>{info.phone}</a>
              <a href={`mailto:${info.email}`}>{info.email}</a>
            </div>
          )}
        </div>
      </footer>
    </>
  );
}
