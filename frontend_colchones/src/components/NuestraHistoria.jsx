import React from 'react';
import { Link } from 'react-router-dom';

const historyPhotos = [
  { id: 1, src: null, caption: 'Nuestros inicios',  year: '1985' },
  { id: 2, src: null, caption: 'Creciendo juntos',  year: '2005' },
  { id: 3, src: null, caption: 'El equipo hoy',     year: '2024' },
];

const NuestraHistoria = () => (
  <div className="nosotros-section">
    <div className="container-centered">
      <div className="nosotros-grid">

        <div className="nosotros-text">
          <span className="nosotros-tag">NUESTRA HISTORIA</span>
          <h2 className="nosotros-title">Décadas cuidando<br/>tu descanso</h2>
          <p className="nosotros-desc">
            Desde nuestros inicios en Rafaela, Decoud Colchones nació con una misión
            simple: ofrecer el mejor descanso posible. Familia, tradición y compromiso
            con la calidad son los valores que nos guían desde el primer día.
          </p>
          <Link to="/nuestra-historia" className="nosotros-cta">
            Conocer más <span className="cta-arrow">→</span>
          </Link>
        </div>

        <div className="nosotros-photos">
          {historyPhotos.map(p => (
            <div key={p.id} className="photo-slot">
              {p.src
                ? <img src={p.src} alt={p.caption} className="photo-img" />
                : (
                  <div className="photo-placeholder">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1
                        2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <span>{p.caption}</span>
                  </div>
                )
              }
              <div className="photo-year">{p.year}</div>
            </div>
          ))}
        </div>

      </div>
    </div>

    <style>{`
      .nosotros-section {
        padding: 60px 0 50px;
        background: linear-gradient(135deg, #0F213A 0%, #1B365D 60%, #1e3d6e 100%);
      }
      .nosotros-grid {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 60px;
        align-items: center;
      }
      .nosotros-tag {
        display: inline-block;
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 3px;
        color: var(--decoud-gold);
        margin-bottom: 14px;
        text-transform: uppercase;
      }
      .nosotros-title {
        font-size: 2.2rem;
        font-weight: 900;
        color: #fff;
        line-height: 1.15;
        margin: 0 0 18px;
      }
      .nosotros-desc {
        font-size: 0.95rem;
        color: #94a3b8;
        line-height: 1.75;
        margin: 0 0 24px;
        max-width: 440px;
      }
      .nosotros-cta {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--decoud-gold);
        text-decoration: none;
        font-weight: 700;
        font-size: 0.9rem;
        letter-spacing: 0.5px;
        border-bottom: 1px solid transparent;
        transition: border-color 0.25s, gap 0.25s;
      }
      .nosotros-cta:hover { border-color: var(--decoud-gold); gap: 14px; }
      .cta-arrow { transition: transform 0.25s; }
      .nosotros-cta:hover .cta-arrow { transform: translateX(4px); }
      .nosotros-photos {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
      }
      .photo-slot {
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        aspect-ratio: 3/4;
        border: 1px solid rgba(212,175,55,0.25);
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
      }
      .photo-slot:hover {
        transform: translateY(-6px) scale(1.02);
        box-shadow: 0 16px 32px rgba(0,0,0,0.35);
        border-color: rgba(212,175,55,0.6);
      }
      .photo-img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .photo-placeholder {
        width: 100%; height: 100%;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        gap: 10px;
        background: rgba(255,255,255,0.04);
        color: rgba(255,255,255,0.3);
        font-size: 0.72rem;
        text-align: center;
        padding: 10px;
        cursor: default;
        transition: background 0.3s, color 0.3s;
      }
      .photo-slot:hover .photo-placeholder {
        background: rgba(212,175,55,0.08);
        color: rgba(212,175,55,0.6);
      }
      .photo-year {
        position: absolute;
        bottom: 0; left: 0; right: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        color: var(--decoud-gold);
        font-size: 0.75rem;
        font-weight: 800;
        text-align: center;
        padding: 14px 8px 8px;
        letter-spacing: 1px;
      }
      @media (max-width: 900px) {
        .nosotros-grid { grid-template-columns: 1fr; gap: 30px; }
        .nosotros-title { font-size: clamp(1.3rem, 4vw, 1.7rem); }
        .nosotros-section { padding: 40px 0 30px; }
      }
      @media (max-width: 560px) {
        .nosotros-photos { grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .nosotros-desc { font-size: 0.9rem; }
      }
      @media (max-width: 400px) {
        .nosotros-section { padding: 28px 0 20px; }
      }
    `}</style>
  </div>
);

export default NuestraHistoria;
