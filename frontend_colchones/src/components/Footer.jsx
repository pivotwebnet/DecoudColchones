// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const socialLinks = {
    instagram: "https://www.instagram.com/decoudcolchones",
    facebook: "https://www.facebook.com/decoudcolchones",
    whatsapp: "https://wa.me/5493492123456",
    email: "mailto:contacto@decoud.com"
  };

  return (
    <footer style={{ 
        backgroundColor: 'var(--decoud-blue-dark)', 
        color: '#f8fafc', 
        padding: '60px 0 30px 0',
        marginTop: 'auto',
        borderTop: '1px solid #1e293b'
    }}>
      <div className="container-centered">
        
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '40px',
            marginBottom: '40px'
        }}>
            
            {/* 1. MARCA Y REDES */}
            <div>
                <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '15px', fontWeight: 'bold', letterSpacing: '1px' }}>
                    DECOUD COLCHONES
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '20px' }}>
                    Especialistas en descanso. Calidad y confort directo a tu hogar en Rafaela y zona.
                </p>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <a href={socialLinks.instagram} target="_blank" rel="noreferrer" style={styles.socialIcon} title="Instagram">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href={socialLinks.facebook} target="_blank" rel="noreferrer" style={styles.socialIcon} title="Facebook">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" style={styles.socialIcon} title="WhatsApp">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    </a>
                </div>
            </div>

            {/* 2. ENLACES RÁPIDOS */}
            <div>
                <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '15px', fontWeight: '600' }}>
                    Navegación
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link to="/" style={styles.link}>Inicio</Link>
                    <Link to="/colchones" style={styles.link}>Catálogo</Link>
                    <Link to="/preguntas-frecuentes" style={styles.link}>Ayuda</Link>
                </div>
            </div>

            {/* 3. CONTACTO */}
            <div>
                <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '15px', fontWeight: '600' }}>
                    Contacto
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={styles.contactItem}>
                        <span style={{fontSize: '1.1rem'}}>📍</span>
                        <span style={styles.text}>Rafaela, Santa Fe</span>
                    </div>
                    <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" style={styles.contactLink}>
                        <span style={{fontSize: '1.1rem'}}>📱</span>
                        <span style={styles.text}>3492 - 123456 (WhatsApp)</span>
                    </a>
                    <a href={socialLinks.email} style={styles.contactLink}>
                        <span style={{fontSize: '1.1rem'}}>📧</span>
                        <span style={styles.text}>contacto@decoud.com</span>
                    </a>
                </div>
            </div>

            {/* 4. UBICACIÓN (MAPA) */}
            <div style={{ minHeight: '150px' }}>
                <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '15px', fontWeight: '600' }}>
                    Ubicación
                </h4>
                <div style={{ 
                    width: '100%', 
                    height: '120px', 
                    borderRadius: '8px', 
                    overflow: 'hidden',
                    border: '1px solid #334155'
                }}>
                    <iframe 
                        title="Ubicación Decoud"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54483.50426839352!2d-61.533261646738595!3d-31.256242502302316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95caae403444259b%3A0xa19777592476b779!2sRafaela%2C%20Santa%20Fe!5e0!3m2!1ses-419!2sar!4v1711000000000!5m2!1ses-419!2sar" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
        
        <div style={{ 
            borderTop: '1px solid #334155', 
            paddingTop: '20px', 
            textAlign: 'center', 
            fontSize: '0.8rem',
            color: '#94a3b8' 
        }}>
            © {new Date().getFullYear()} Decoud Colchones. Todos los derechos reservados.
        </div>  
      </div>
    </footer>
  );
};

const styles = {
    link: {
        color: '#cbd5e1', 
        textDecoration: 'none',
        fontSize: '0.9rem',
        transition: 'color 0.2s',
        display: 'inline-block'
    },
    contactLink: {
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'opacity 0.2s'
    },
    contactItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    text: {
        color: '#cbd5e1',
        fontSize: '0.9rem'
    },
    socialIcon: {
        color: 'white',
        opacity: 0.8,
        transition: 'opacity 0.1s, transform 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};

export default Footer;