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
            
            {/* 1. BARRA SUPERIOR (TOP BAR) - Se oculta al scrollear */}
            <div 
                style={{ 
                    backgroundColor: '#0f172a', 
                    color: 'white', 
                    fontSize: '0.75rem', // Letra un poco más chica para que sea sutil
                    transition: 'all 0.4s ease-in-out', 
                    overflow: 'hidden',
                    // Altura dinámica: se hace 0 al bajar
                    maxHeight: isScrolled ? '0px' : '40px', 
                    opacity: isScrolled ? 0 : 1,
                    // Padding dinámico: desaparece al bajar
                    padding: isScrolled ? '0 0' : '6px 0' 
                }}
            >
                <div className="container-centered" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{opacity: 0.9}}>🚚 Envíos gratis en Rafaela y zona</span>
                    
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" style={styles.topLink}>
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '5px'}}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            3492-123456
                        </a>
                        <div style={{ width: '1px', height: '10px', backgroundColor: '#334155' }}></div>
                        <a href={socialLinks.instagram} target="_blank" rel="noreferrer" style={styles.iconOnly} title="Instagram">
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href={socialLinks.facebook} target="_blank" rel="noreferrer" style={styles.iconOnly} title="Facebook">
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* 2. HEADER PRINCIPAL (LOGO Y BUSCADOR) */}
            <div style={{ 
                // AQUÍ ESTABA EL ERROR: Antes tenías 30px al hacer scroll. 
                // Ahora: 15px normal, y se reduce a 8px al bajar.
                padding: isScrolled ? '10px 0' : '15px 0', 
                transition: 'padding 0.3s ease' 
            }}>
                <div className="container-centered" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center', gap: '20px' }}>
                    
                    {/* LOGO */}
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Link to="/" style={styles.logo}>DECOUD</Link>
                    </div>

                    {/* BUSCADOR */}
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <div style={{ width: '100%', maxWidth: '500px' }}>
                            <SearchBar />
                        </div>
                    </div>

                    {/* ICONOS */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
                         <Link to={user ? "/profile" : "/login"} style={styles.iconBtn} title="Mi Cuenta">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            {user && <span style={{fontSize:'0.8rem', marginLeft:'6px', fontWeight: '600'}}>{user.first_name}</span>}
                        </Link>
                        <Link to="/checkout" style={{...styles.iconBtn, position: 'relative'}} title="Carrito">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
                        </Link>
                    </div>
                </div>
            </div>

            {/* 3. BARRA DE NAVEGACIÓN (LINKS) */}
            <div style={{ 
                backgroundColor: 'white', 
                borderTop: '1px solid #f1f5f9', 
                // Reduje esto de 12px a 8px para ganar espacio
                padding: '8px 0' 
            }}>
                <nav className="container-centered" style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
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
    topLink: { color: '#cbd5e1', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s', display: 'flex', alignItems: 'center', fontSize: '0.8rem' },
    iconOnly: { color: '#cbd5e1', display: 'flex', alignItems: 'center', transition: 'color 0.2s' },
    // Reduje el tamaño de fuente del logo de 2rem a 1.8rem
    logo: { textDecoration: 'none', color: '#1e3a8a', fontSize: '1.8rem', fontWeight: 'bold', letterSpacing: '2px', fontFamily: 'serif' },
    // Reduje el tamaño de fuente de los links de 0.9rem a 0.85rem
    navLink: { textDecoration: 'none', color: '#334155', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'color 0.2s' },
    iconBtn: { textDecoration: 'none', color: '#334155', fontWeight: '500', display: 'flex', alignItems: 'center', transition: 'color 0.2s' },
    badge: { position: 'absolute', top: '-6px', right: '-8px', backgroundColor: '#e11d48', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }
};

export default Header;