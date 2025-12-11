// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={styles.footerContainer}>
            {/* Sección Principal con 4 Columnas */}
            <div className="container-centered" style={styles.gridContainer}>
                
                {/* Columna 1: Marca y Bio */}
                <div style={styles.column}>
                    <h3 style={styles.brandTitle}>DECOUD</h3>
                    <p style={styles.brandText}>
                        Especialistas en descanso. Fabricamos y distribuimos colchones de alta densidad con la mejor tecnología de Santa Fe.
                    </p>
                    <div style={styles.socialIcons}>
                        <span style={styles.icon}>IG</span>
                        <span style={styles.icon}>FB</span>
                        <span style={styles.icon}>WA</span>
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
                        <li><a href="#" style={styles.link}>Cómo comprar</a></li>
                        <li><a href="#" style={styles.link}>Envíos y Devoluciones</a></li>
                        <li><a href="#" style={styles.link}>Preguntas Frecuentes</a></li>
                    </ul>
                </div>

                {/* Columna 4: Contacto */}
                <div style={styles.column}>
                    <h4 style={styles.colTitle}>Contacto</h4>
                    <p style={styles.contactItem}>
                        <strong>📍 Showroom:</strong><br />
                        Bv. Roca 1234, Rafaela, Santa Fe
                    </p>
                    <p style={styles.contactItem}>
                        <strong>📞 Teléfono:</strong><br />
                        3492 - 123456
                    </p>
                    <p style={styles.contactItem}>
                        <strong>✉️ Email:</strong><br />
                        ventas@decoud.com
                    </p>
                </div>

            </div>

            {/* Barra Inferior Copyright */}
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
        // ELIMINADO: borderTop: '5px solid #3b82f6',
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
        gap: '10px',
    },
    icon: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '8px',
        borderRadius: '50%',
        fontSize: '0.8rem',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
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