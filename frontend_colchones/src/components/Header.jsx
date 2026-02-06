// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';

const Header = () => {
    const { totalItems } = useCart();
    const { user } = useAuth();
    
    // 1. ESTADO PARA DETECTAR SCROLL
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Si bajamos más de 10px, activamos el modo compacto
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // LINKS DE REDES
    const socialLinks = {
        instagram: "https://www.instagram.com/decoudcolchones",
        facebook: "https://www.facebook.com/decoudcolchones",
        whatsapp: "https://wa.me/5493492123456" 
    };

    return (
        <header 
            style={{ 
                position: 'sticky', 
                top: 0, 
                zIndex: 1000, 
                backgroundColor: 'white',
                transition: 'all 0.3s ease-in-out',
                boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
            }}
        >
            
            {/* 1. BARRA SUPERIOR (TOP BAR) - Azul Oscuro (Noche) */}
            <div 
                style={{ 
                    backgroundColor: 'var(--decoud-blue-dark)', // CAMBIO: Variable CSS
                    color: 'white', 
                    fontSize: '0.75rem', 
                    transition: 'all 0.4s ease-in-out', 
                    overflow: 'hidden',
                    maxHeight: isScrolled ? '0px' : '40px', 
                    opacity: isScrolled ? 0 : 1,
                    padding: isScrolled ? '0 0' : '6px 0' 
                }}
            >
                <div className="container-centered" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{opacity: 0.9, letterSpacing: '0.5px'}}>🚚 Envíos gratis en Rafaela y zona</span>
                    
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" style={styles.topLink}>
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '5px'}}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            3492-123456
                        </a>
                        <div style={{ width: '1px', height: '10px', backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
                        <a href={socialLinks.instagram} target="_blank" rel="noreferrer" style={styles.topLink} title="Instagram">
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href={socialLinks.facebook} target="_blank" rel="noreferrer" style={styles.topLink} title="Facebook">
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* 2. HEADER PRINCIPAL (Blanco) */}
            <div style={{ 
                backgroundColor: 'var(--decoud-blue)', // CAMBIO: Variable CSS
                padding: isScrolled ? '10px 0' : '15px 0', 
                transition: 'padding 0.3s ease' 
            }}>
                <div className="container-centered" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center', gap: '20px' }}>
                    
                    {/* LOGO DECOUD BICOLOR */}
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                            <span style={{ color: 'var(--decoud-white', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '1px' }}>DECOUD</span>
                            <span style={{ color: 'var(--decoud-gold)', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '3px', marginLeft: '2px' }}>COLCHONES</span>
                        </Link>
                    </div>

                    {/* BUSCADOR */}
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <div style={{ width: '100%', maxWidth: '500px' }}>
                            <SearchBar />
                        </div>
                    </div>

                    {/* ICONOS (Azul Decoud) */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
                         <Link to={user ? "/profile" : "/login"} style={styles.iconBtn} title="Mi Cuenta">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            {user && <span style={{fontSize:'0.8rem', marginLeft:'6px', fontWeight: '600'}}>{user.first_name}</span>}
                        </Link>
                        <Link to="/carrito" style={{...styles.iconBtn, position: 'relative'}} title="Carrito">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            {/* BADGE DORADO */}
                            {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
                        </Link>
                    </div>
                </div>
            </div>

            {/* 3. BARRA DE NAVEGACIÓN - Azul Decoud (Fondo sólido) */}
            <div style={{ 
                backgroundColor: 'var(--decoud-blue)', // CAMBIO: Fondo Azul Marca
                borderTop: '1px solid rgba(255,255,255,0.1)', 
                padding: '10px 0' 
            }}>
                <nav className="container-centered" style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
                    <Link to="/" style={styles.navLink}>Inicio</Link>
                    <Link to="/colchones" style={styles.navLink}>Catálogo</Link>
                    <Link to="/colchones" style={styles.navLink}>Ofertas</Link>
                    <Link to="/preguntas-frecuentes" style={styles.navLink}>Ayuda</Link>
                </nav>
            </div>

        </header>
    );
};

const styles = {
    // Links del Top Bar (Blanco sobre azul oscuro)
    topLink: { color: '#e2e8f0', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s', display: 'flex', alignItems: 'center', fontSize: '0.8rem' },
    
    // Links de Navegación (Blanco sobre azul principal)
    navLink: { 
        textDecoration: 'none', 
        color: '#ffffff', // CAMBIO: Texto blanco
        fontWeight: '600', 
        fontSize: '0.9rem', 
        textTransform: 'uppercase', 
        letterSpacing: '1px', 
        transition: 'color 0.2s, transform 0.2s',
        display: 'inline-block'
    },
    
    // Botones de Iconos (Azul Decoud sobre blanco)
    iconBtn: { 
        textDecoration: 'none', 
        color: 'white', // CAMBIO: Variable CSS
        fontWeight: '500', 
        display: 'flex', 
        alignItems: 'center', 
        transition: 'color 0.2s' 
    },
    
    // Badge del Carrito (Dorado)
    badge: { 
        position: 'absolute', 
        top: '-6px', 
        right: '-8px', 
        backgroundColor: 'var(--decoud-gold)', // CAMBIO: Dorado marca
        color: 'var(--decoud-blue)', // Texto azul para contraste premium
        borderRadius: '50%', 
        width: '18px', 
        height: '18px', 
        fontSize: '0.7rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }
};

export default Header;