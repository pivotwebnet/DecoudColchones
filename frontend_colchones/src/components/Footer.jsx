// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    // REEMPLAZA ESTOS LINKS POR LOS TUYOS REALES
    const socialLinks = {
        instagram: "https://www.instagram.com/decoudcolchones", 
        facebook: "https://www.facebook.com/decoudcolchones",
        whatsapp: "https://wa.me/5493492123456" 
    };

    return (
        <footer style={styles.footerContainer}>
            <div className="container-centered" style={styles.gridContainer}>
                
                {/* Columna 1: Marca y Redes */}
                <div style={styles.column}>
                    <h3 style={styles.brandTitle}>DECOUD</h3>
                    <p style={styles.brandText}>
                        Especialistas en descanso. Fabricamos y distribuimos colchones de alta densidad con la mejor tecnología de Santa Fe.
                    </p>
                    
                    {/* REDES SOCIALES CON ICONOS SVG */}
                    <h4 style={styles.colTitle}>Sigamos Conectados</h4>
                    <div style={styles.socialIcons}>
                        
                        {/* Instagram */}
                        <a href={socialLinks.instagram} target="_blank" rel="noreferrer" style={styles.iconLink}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>

                        {/* Facebook */}
                        <a href={socialLinks.facebook} target="_blank" rel="noreferrer" style={styles.iconLink}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>

                        {/* WhatsApp */}
                        <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" style={styles.iconLink}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                        </a>

                    </div>
                </div>

                {/* Columna 2: Navegación */}
                <div style={styles.column}>
                    <h4 style={styles.colTitle}>Navegación</h4>
                    <ul style={styles.linkList}>
                        <li><Link to="/" style={styles.link}>Inicio</Link></li>
                        <li><Link to="/colchones" style={styles.link}>Catálogo</Link></li>
                        <li><Link to="/colchones" style={styles.link}>Ofertas</Link></li>
                        <li><Link to="/login" style={styles.link}>Mi Cuenta</Link></li>
                    </ul>
                </div>

                {/* Columna 3: Ayuda */}
                <div style={styles.column}>
                    <h4 style={styles.colTitle}>Ayuda</h4>
                    <ul style={styles.linkList}>
                        <li><Link to="/contacto" style={styles.link}>Contacto</Link></li>
                        <li><Link to="/preguntas-frecuentes" style={styles.link}>Cómo comprar</Link></li>
                        <li><Link to="/preguntas-frecuentes" style={styles.link}>Preguntas Frecuentes</Link></li>
                    </ul>
                </div>

                {/* Columna 4: Contacto */}
                <div style={styles.column}>
                    <h4 style={styles.colTitle}>Contacto</h4>
                    <p style={styles.contactItem}>
                        <strong>📍 Showroom:</strong><br />
                        Ituzaingó 194, Rafaela, Santa Fe
                    </p>
                    <p style={styles.contactItem}>
                        <strong>📞 Teléfono:</strong><br />
                        <a href={socialLinks.whatsapp} style={{color:'white', textDecoration:'none'}}>3492 - 123456</a>
                    </p>
                    <p style={styles.contactItem}>
                        <strong>✉️ Email:</strong><br />
                        ventas@decoud.com
                    </p>
                </div>

            </div>

            <div style={styles.bottomBar}>
                <div className="container-centered" style={styles.bottomContent}>
                    <p style={{ margin: 0 }}>© 2025 Decoud Colchones. Todos los derechos reservados.</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>Desarrollado con ❤️ en Rafaela</p>
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footerContainer: {
        background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
        color: 'white',
        paddingTop: '60px',
        marginTop: 'auto',
    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '40px',
        paddingBottom: '40px',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
    },
    brandTitle: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        marginBottom: '15px',
        letterSpacing: '2px',
        fontFamily: 'serif',
    },
    brandText: {
        fontSize: '0.9rem',
        lineHeight: '1.6',
        opacity: 0.8,
        marginBottom: '20px',
    },
    socialIcons: {
        display: 'flex',
        gap: '12px', // Un poco más de espacio entre iconos
    },
    // Estilo para el botón redondo del link
    iconLink: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(255,255,255,0.2)',
    },
    colTitle: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        marginBottom: '20px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    linkList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    link: {
        textDecoration: 'none',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '0.95rem',
        transition: 'color 0.2s',
    },
    contactItem: {
        fontSize: '0.95rem',
        marginBottom: '15px',
        color: 'rgba(255,255,255,0.8)',
        lineHeight: '1.5',
    },
    bottomBar: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)', 
        padding: '20px 0',
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.6)',
    },
    bottomContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    }
};

export default Footer;