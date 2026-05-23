// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const socialLinks = {
  instagram: "https://www.instagram.com/decoudcolchones",
  facebook:  "https://www.facebook.com/decoudcolchones",
  whatsapp:  "https://wa.me/5493492638470",
  email:     "mailto:contacto@decoud.com"
};

const Footer = () => (
  <footer className="decoud-footer">

    {/* ── GRID PRINCIPAL ── */}
    <div className="footer-main">
      <div className="container-centered">
        <div className="footer-grid">

          {/* MARCA */}
          <div className="footer-col">
            <h3 className="footer-brand">DECOUD<br/>COLCHONES</h3>
            <p className="footer-tagline">
              Especialistas en descanso. Calidad y confort directo a tu hogar
              en Rafaela y zona.
            </p>
            <div className="footer-socials">
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer"
                className="social-btn social-ig" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href={socialLinks.facebook} target="_blank" rel="noreferrer"
                className="social-btn social-fb" title="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1
                    1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer"
                className="social-btn social-wa" title="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6
                    4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0
                    0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1
                    3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* NAVEGACIÓN */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navegación</h4>
            <nav className="footer-nav">
              <Link to="/"         className="footer-link">Inicio</Link>
              <Link to="/colchones" className="footer-link">Catálogo</Link>
              <Link to="/preguntas-frecuentes" className="footer-link">Ayuda / FAQ</Link>
              <Link to="/login"    className="footer-link">Mi cuenta</Link>
            </nav>
          </div>

          {/* CONTACTO */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contacto</h4>
            <div className="footer-contact">
              <div className="contact-row">
                <span className="contact-icon">📍</span>
                <span className="contact-text">Rafaela, Santa Fe</span>
              </div>
              <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer"
                className="contact-row contact-link">
                <span className="contact-icon">📱</span>
                <span className="contact-text">3492-638470 (WhatsApp)</span>
              </a>
              <a href={socialLinks.email} className="contact-row contact-link">
                <span className="contact-icon">📧</span>
                <span className="contact-text">contacto@decoud.com</span>
              </a>
            </div>
          </div>

          {/* MAPA */}
          <div className="footer-col">
            <h4 className="footer-col-title">Ubicación</h4>
            <div className="footer-map">
              <iframe
                title="Ubicación Decoud"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d-61.50470420077963!3d-31.232493083196466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDEzJzU3LjAiUyA2McKwMzAnMTYuOSJX!5e0!3m2!1ses-419!2sar!4v1711000000000!5m2!1ses-419!2sar"
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>
      </div>
    </div>

    {/* ── COPYRIGHT ── */}
    <div className="footer-bottom">
      <div className="container-centered footer-bottom-inner">
        <span>© {new Date().getFullYear()} Decoud Colchones — Todos los derechos reservados.</span>
        <span className="footer-made">Hecho con amor en Rafaela 🇦🇷</span>
      </div>
    </div>

    <style>{`
      /* ── BASE ── */
      .decoud-footer {
        background-color: var(--topbar-bg);
        color: var(--color-text-light);
        margin-top: auto;
        transition: background-color 0.3s ease;
      }

      /* ── GRID PRINCIPAL ── */
      .footer-main { padding: 50px 0 35px; }
      .footer-grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr 1.2fr 1.2fr;
        gap: 40px;
      }

      /* Marca */
      .footer-brand {
        font-size: 1.15rem;
        font-weight: 900;
        color: #fff;
        letter-spacing: 2px;
        margin: 0 0 14px;
        line-height: 1.3;
      }
      .footer-tagline { font-size: 0.85rem; color: #94a3b8; line-height: 1.65; margin: 0 0 22px; }

      /* Redes */
      .footer-socials { display: flex; gap: 10px; }
      .social-btn {
        width: 38px; height: 38px;
        border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        background: rgba(255,255,255,0.07);
        color: #cbd5e1;
        transition: background 0.25s, color 0.25s, transform 0.25s;
      }
      .social-btn:hover { transform: translateY(-4px); }
      .social-ig:hover { background: #e1306c; color: #fff; }
      .social-fb:hover { background: #1877f2; color: #fff; }
      .social-wa:hover { background: #25d366; color: #fff; }

      /* Títulos de columna */
      .footer-col-title {
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--decoud-gold);
        margin: 0 0 18px;
      }

      /* Navegación */
      .footer-nav { display: flex; flex-direction: column; gap: 10px; }
      .footer-link {
        color: #94a3b8;
        text-decoration: none;
        font-size: 0.88rem;
        display: inline-flex;
        align-items: center;
        gap: 0;
        transition: color 0.2s, gap 0.2s, padding-left 0.2s;
        padding-left: 0;
      }
      .footer-link::before {
        content: '›';
        color: var(--decoud-gold);
        font-size: 1rem;
        opacity: 0;
        transform: translateX(-8px);
        transition: opacity 0.2s, transform 0.2s;
        margin-right: 0;
        width: 0;
        overflow: hidden;
        transition: opacity 0.2s, transform 0.2s, width 0.2s;
      }
      .footer-link:hover { color: #fff; padding-left: 6px; }
      .footer-link:hover::before { opacity: 1; transform: translateX(0); width: 12px; }

      /* Contacto */
      .footer-contact { display: flex; flex-direction: column; gap: 14px; }
      .contact-row {
        display: flex; align-items: center; gap: 10px;
        text-decoration: none;
      }
      .contact-link { transition: opacity 0.25s; }
      .contact-link:hover { opacity: 1; }
      .contact-icon { font-size: 1rem; flex-shrink: 0; }
      .contact-text {
        color: #94a3b8;
        font-size: 0.85rem;
        position: relative;
        display: inline-block;
        transition: color 0.25s;
      }
      .contact-text::after {
        content: '';
        position: absolute;
        bottom: -2px; left: 0;
        width: 100%; height: 1px;
        background: var(--decoud-gold);
        transform: scaleX(0);
        transform-origin: left center;
        transition: transform 0.3s ease;
      }
      .contact-link:hover .contact-text { color: #fff; }
      .contact-link:hover .contact-text::after { transform: scaleX(1); }

      /* Mapa */
      .footer-map {
        width: 100%; height: 130px;
        border-radius: 10px; overflow: hidden;
        border: 1px solid rgba(255,255,255,0.08);
        transition: border-color 0.3s, box-shadow 0.3s;
      }
      .footer-map:hover {
        border-color: rgba(212,175,55,0.4);
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      }

      /* ── BOTTOM ── */
      .footer-bottom {
        border-top: 1px solid rgba(255,255,255,0.07);
        padding: 18px 0;
      }
      .footer-bottom-inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.78rem;
        color: #475569;
        flex-wrap: wrap;
        gap: 8px;
      }
      .footer-made { color: #475569; }

      /* ── RESPONSIVE ── */
      @media (max-width: 900px) {
        .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
        .footer-main { padding: 35px 0 25px; }
      }
      @media (max-width: 560px) {
        .footer-grid { grid-template-columns: 1fr; gap: 28px; }
        .footer-bottom-inner { flex-direction: column; text-align: center; }
      }
    `}</style>
  </footer>
);

export default Footer;
