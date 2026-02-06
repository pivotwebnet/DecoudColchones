// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  // Enlaces a redes (mismos que en el Header)
  const socialLinks = {
    instagram: "https://www.instagram.com/decoudcolchones",
    facebook: "https://www.facebook.com/decoudcolchones",
    whatsapp: "https://wa.me/5493492123456" 
  };

  return (
    <footer style={{ 
        backgroundColor: 'var(--decoud-blue-dark)', // Fondo Azul Noche
        color: '#f8fafc', // Texto blanco suave
        padding: '60px 0 30px 0',
        marginTop: 'auto',
        borderTop: '1px solid #1e293b' // Línea sutil arriba
    }}>
      <div className="container-centered">
        
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
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

                {/* --- ICONOS DE REDES SOCIALES (RECUPERADOS) --- */}
                <div style={{ display: 'flex', gap: '15px' }}>
                    <a href={socialLinks.instagram} target="_blank" rel="noreferrer" style={styles.socialIcon} title="Instagram">
                        {/* Icono Instagram SVG */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href={socialLinks.facebook} target="_blank" rel="noreferrer" style={styles.socialIcon} title="Facebook">
                        {/* Icono Facebook SVG */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" style={styles.socialIcon} title="WhatsApp">
                        {/* Icono WhatsApp SVG */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
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
                    <Link to="/contacto" style={styles.link}>Contacto</Link>
                    <Link to="/preguntas-frecuentes" style={styles.link}>Preguntas Frecuentes</Link>
                </div>
            </div>

            {/* 3. CONTACTO */}
            <div>
                <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '15px', fontWeight: '600' }}>
                    Contacto
                </h4>
                <p style={styles.text}>📍 Rafaela, Santa Fe</p>
                <p style={styles.text}>📱 3492 - 123456</p>
                <p style={styles.text}>📧 contacto@decoud.com</p>
            </div>
        </div>
        
        {/* BARRA INFERIOR */}
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
    text: {
        color: '#cbd5e1',
        fontSize: '0.9rem',
        marginBottom: '8px'
    },
    // Estilo nuevo para los iconos
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