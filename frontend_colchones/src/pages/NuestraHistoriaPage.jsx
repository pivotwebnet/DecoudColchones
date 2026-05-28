import React from 'react';
import { Link } from 'react-router-dom';

// Reemplazar src: null con la URL real de cada imagen cuando estén disponibles
const photos = [
  {
    id: 1,
    src: null,
    alt: 'Los inicios de Decoud Colchones',
    caption: 'Nuestros inicios — 1985',
  },
  {
    id: 2,
    src: null,
    alt: 'El equipo Decoud hoy',
    caption: 'El equipo hoy — 2024',
  },
];

const milestones = [
  { year: '1985', text: 'Fundación de Decoud Colchones en Rafaela, Santa Fe, con un pequeño local familiar.' },
  { year: '1995', text: 'Ampliación del local y primera línea propia de colchones de espuma de alta densidad.' },
  { year: '2005', text: 'Incorporación de las marcas líderes del mercado nacional: Piero, Cannon y Rosen.' },
  { year: '2015', text: 'Renovación total del showroom y lanzamiento de la venta a empresas y hoteles.' },
  { year: '2024', text: 'Lanzamos nuestra tienda online para llegar a toda la región con envío sin cargo.' },
];

const NuestraHistoriaPage = () => (
  <div className="historia-page">

    {/* ── HERO ── */}
    <section className="historia-hero">
      <div className="container-centered historia-hero-inner">
        <span className="historia-tag">QUIÉNES SOMOS</span>
        <h1 className="historia-heading">Décadas cuidando<br/>tu descanso</h1>
        <p className="historia-lead">
          Desde Rafaela para toda la región. Una familia que convirtió la pasión por
          el buen descanso en un compromiso de por vida.
        </p>
      </div>
    </section>

    {/* ── FOTOS ── */}
    <section className="historia-photos-section">
      <div className="container-centered">
        <div className="historia-photos-grid">
          {photos.map(p => (
            <div key={p.id} className="historia-photo-card">
              {p.src
                ? <img src={p.src} alt={p.alt} className="historia-photo-img" />
                : (
                  <div className="historia-photo-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1
                        2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <span>Foto próximamente</span>
                  </div>
                )
              }
              <p className="historia-photo-caption">{p.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── TEXTO HISTORIA ── */}
    <section className="historia-text-section">
      <div className="container-centered historia-text-inner">
        <h2 className="historia-subtitle">Una historia de familia y confianza</h2>
        <div className="historia-body">
          <p>
            Todo comenzó en 1985, cuando la familia Decoud abrió las puertas de su
            primer local en el centro de Rafaela con una sola convicción: que dormir bien
            no es un lujo, es una necesidad. Desde ese primer día, cada colchón que
            salió de nuestro local llevó consigo el mismo cuidado y la misma dedicación
            con la que atendemos a nuestros clientes.
          </p>
          <p>
            Con los años, crecimos. Sumamos marcas, ampliamos el showroom, incorporamos
            nuevas tecnologías de descanso y, sobre todo, construimos relaciones de
            confianza con cientos de familias de la región. Hoy, casi cuatro décadas
            después, seguimos siendo el mismo negocio familiar que empezó con un sueño
            sencillo: ayudarte a descansar mejor.
          </p>
          <p>
            En 2024 dimos el salto digital para poder llegar a más hogares. Pero la
            esencia no cambió: el mismo asesoramiento personalizado, la misma calidad
            de siempre, ahora también desde tu pantalla.
          </p>
        </div>
      </div>
    </section>

    {/* ── TIMELINE ── */}
    <section className="historia-timeline-section">
      <div className="container-centered">
        <h2 className="historia-subtitle" style={{ textAlign: 'center', marginBottom: '48px' }}>
          Nuestro camino
        </h2>
        <div className="historia-timeline">
          {milestones.map((m, i) => (
            <div key={m.year} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-year">{m.year}</div>
              <div className="timeline-dot" />
              <div className="timeline-card">
                <p>{m.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CALL TO ACTION ── */}
    <section className="historia-cta-section">
      <div className="container-centered historia-cta-inner">
        <span className="historia-tag" style={{ color: 'var(--decoud-gold)' }}>NUESTROS PRODUCTOS</span>
        <h2 className="historia-cta-heading">Encontrá el colchón ideal para vos</h2>
        <p className="historia-cta-body">
          Casi cuatro décadas eligiendo calidad para que vos puedas descansar mejor.
          Explorá nuestro catálogo y encontrá el que se adapta a tu cuerpo y presupuesto.
        </p>
        <div className="historia-cta-actions">
          <Link to="/colchones" className="historia-cta-btn-primary">
            Ver catálogo completo
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
          <Link to="/colchones?oferta=true" className="historia-cta-btn-secondary">
            Ver ofertas
          </Link>
        </div>
      </div>
    </section>

    <style>{`
      /* ── PAGE BASE ── */
      .historia-page {
        background: var(--color-bg);
        color: var(--color-text-dark);
        transition: background 0.3s, color 0.3s;
      }

      /* ── HERO ── */
      .historia-hero {
        background: linear-gradient(135deg, #0F213A 0%, #1B365D 60%, #1e3d6e 100%);
        padding: 80px 0 70px;
        text-align: center;
      }
      .historia-hero-inner { max-width: 680px; margin: 0 auto; }
      .historia-tag {
        display: inline-block;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 3px;
        color: var(--decoud-gold);
        text-transform: uppercase;
        margin-bottom: 16px;
      }
      .historia-heading {
        font-size: clamp(2rem, 5vw, 3.2rem);
        font-weight: 900;
        color: #fff;
        line-height: 1.12;
        margin: 0 0 20px;
      }
      .historia-lead {
        font-size: 1.05rem;
        color: #94a3b8;
        line-height: 1.7;
        margin: 0 auto;
        max-width: 520px;
      }

      /* ── FOTOS ── */
      .historia-photos-section {
        padding: 60px 0;
        background: var(--color-bg-secondary, #f8fafc);
      }
      .historia-photos-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 28px;
        max-width: 820px;
        margin: 0 auto;
      }
      .historia-photo-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .historia-photo-img {
        width: 100%;
        aspect-ratio: 4/3;
        object-fit: cover;
        border-radius: 14px;
        display: block;
        border: 1px solid rgba(212,175,55,0.3);
        box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        transition: box-shadow 0.3s, transform 0.3s;
      }
      .historia-photo-img:hover {
        box-shadow: 0 16px 40px rgba(0,0,0,0.18);
        transform: translateY(-4px);
      }
      .historia-photo-placeholder {
        width: 100%;
        aspect-ratio: 4/3;
        border-radius: 14px;
        border: 2px dashed rgba(212,175,55,0.35);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        color: #94a3b8;
        font-size: 0.82rem;
        background: rgba(212,175,55,0.03);
        transition: border-color 0.3s, background 0.3s;
      }
      .historia-photo-placeholder:hover {
        border-color: rgba(212,175,55,0.6);
        background: rgba(212,175,55,0.06);
      }
      .historia-photo-caption {
        font-size: 0.82rem;
        color: #64748b;
        text-align: center;
        font-style: italic;
        margin: 0;
      }

      /* ── TEXTO ── */
      .historia-text-section {
        padding: 70px 0;
      }
      .historia-text-inner {
        max-width: 720px;
        margin: 0 auto;
      }
      .historia-subtitle {
        font-size: clamp(1.4rem, 3.5vw, 2rem);
        font-weight: 800;
        color: var(--decoud-blue);
        margin: 0 0 32px;
        position: relative;
        display: inline-block;
      }
      .historia-subtitle::after {
        content: '';
        display: block;
        width: 50px;
        height: 3px;
        background: var(--decoud-gold);
        margin-top: 10px;
      }
      .historia-body {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .historia-body p {
        font-size: 0.98rem;
        line-height: 1.8;
        color: var(--color-text-dark);
        margin: 0;
      }

      /* ── TIMELINE ── */
      .historia-timeline-section {
        padding: 70px 0 90px;
        background: var(--color-bg-secondary, #f8fafc);
      }
      .historia-timeline {
        position: relative;
        max-width: 760px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 0;
      }
      .historia-timeline::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 0; bottom: 0;
        width: 2px;
        background: linear-gradient(to bottom, var(--decoud-gold), rgba(212,175,55,0.2));
        transform: translateX(-50%);
      }
      .timeline-item {
        display: grid;
        grid-template-columns: 1fr 28px 1fr;
        align-items: center;
        gap: 0 20px;
        padding: 20px 0;
      }
      .timeline-item.left .timeline-year { text-align: right; order: 0; }
      .timeline-item.left .timeline-dot  { order: 1; }
      .timeline-item.left .timeline-card { order: 2; text-align: left; }

      .timeline-item.right .timeline-year { order: 2; text-align: left; }
      .timeline-item.right .timeline-dot  { order: 1; }
      .timeline-item.right .timeline-card { order: 0; text-align: right; }

      .timeline-year {
        font-size: 1.4rem;
        font-weight: 900;
        color: var(--decoud-gold);
        letter-spacing: 1px;
      }
      .timeline-dot {
        width: 14px; height: 14px;
        border-radius: 50%;
        background: var(--decoud-gold);
        border: 3px solid var(--color-bg-secondary, #f8fafc);
        box-shadow: 0 0 0 2px var(--decoud-gold);
        justify-self: center;
        flex-shrink: 0;
      }
      .timeline-card {
        background: var(--color-bg);
        border: 1px solid rgba(212,175,55,0.2);
        border-radius: 10px;
        padding: 14px 18px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      }
      .timeline-card p {
        font-size: 0.87rem;
        color: var(--color-text-dark);
        line-height: 1.65;
        margin: 0;
      }

      /* ── CALL TO ACTION ── */
      .historia-cta-section {
        background: linear-gradient(135deg, #0F213A 0%, #1B365D 60%, #1e3d6e 100%);
        padding: 90px 20px;
        text-align: center;
      }
      .historia-cta-inner {
        max-width: 620px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }
      .historia-cta-heading {
        font-size: clamp(1.8rem, 4vw, 2.6rem);
        font-weight: 900;
        color: #fff;
        line-height: 1.15;
        margin: 0;
      }
      .historia-cta-body {
        font-size: 0.98rem;
        color: #94a3b8;
        line-height: 1.75;
        margin: 0;
        max-width: 500px;
      }
      .historia-cta-actions {
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 8px;
      }
      .historia-cta-btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--decoud-gold);
        color: #1B365D;
        font-weight: 800;
        font-size: 0.95rem;
        padding: 15px 28px;
        border-radius: 10px;
        text-decoration: none;
        transition: all 0.2s ease;
        letter-spacing: 0.02em;
      }
      .historia-cta-btn-primary:hover {
        background: #c9a22e;
        transform: translateY(-2px);
        box-shadow: 0 10px 28px rgba(212,175,55,0.35);
      }
      .historia-cta-btn-primary svg {
        transition: transform 0.2s ease;
      }
      .historia-cta-btn-primary:hover svg {
        transform: translateX(4px);
      }
      .historia-cta-btn-secondary {
        display: inline-flex;
        align-items: center;
        padding: 15px 28px;
        border-radius: 10px;
        border: 1.5px solid rgba(255,255,255,0.25);
        color: #fff;
        font-weight: 600;
        font-size: 0.95rem;
        text-decoration: none;
        transition: all 0.2s ease;
      }
      .historia-cta-btn-secondary:hover {
        border-color: rgba(255,255,255,0.6);
        background: rgba(255,255,255,0.07);
      }

      /* ── RESPONSIVE ── */
      @media (max-width: 700px) {
        .historia-photos-grid { grid-template-columns: 1fr; max-width: 420px; }
        .historia-hero { padding: 60px 20px 50px; }
        .historia-text-section,
        .historia-timeline-section { padding: 50px 20px; }

        /* Timeline → stack vertical en mobile */
        .historia-timeline::before { left: 14px; transform: none; }
        .timeline-item {
          grid-template-columns: 28px 1fr;
          grid-template-rows: auto auto;
          gap: 4px 14px;
          padding: 16px 0;
        }
        .timeline-item.left .timeline-year,
        .timeline-item.right .timeline-year {
          order: 1; grid-column: 2; text-align: left;
          font-size: 1.1rem;
        }
        .timeline-item.left .timeline-dot,
        .timeline-item.right .timeline-dot  {
          order: 0; grid-column: 1; grid-row: 1 / 3;
          align-self: start; margin-top: 6px;
        }
        .timeline-item.left .timeline-card,
        .timeline-item.right .timeline-card {
          order: 2; grid-column: 2; text-align: left;
        }
      }
    `}</style>
  </div>
);

export default NuestraHistoriaPage;
