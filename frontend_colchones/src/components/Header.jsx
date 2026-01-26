// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { totalItems } = useCart();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/colchones?search=${searchTerm}`);
    };

    // LINKS DE REDES
    const socialLinks = {
        instagram: "https://www.instagram.com/decoudcolchones",
        facebook: "https://www.facebook.com/decoudcolchones",
        whatsapp: "https://wa.me/5493492123456" 
    };

    return (
        <header style={{ position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            
            {/* 1. BARRA SUPERIOR (Top Bar) */}
            <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '8px 0', fontSize: '0.85rem' }}>
                <div className="container-centered" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{opacity: 0.9, fontSize: '0.8rem'}}>🚚 Envíos gratis en Rafaela y zona</span>
                    
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        {/* WhatsApp */}
                        <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" style={styles.topLink}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '5px'}}>
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                            3492-123456
                        </a>
                        <div style={{ width: '1px', height: '12px', backgroundColor: '#334155' }}></div>
                        {/* Instagram */}
                        <a href={socialLinks.instagram} target="_blank" rel="noreferrer" style={styles.iconOnly} title="Instagram">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                        {/* Facebook */}
                        <a href={socialLinks.facebook} target="_blank" rel="noreferrer" style={styles.iconOnly} title="Facebook">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* 2. HEADER PRINCIPAL */}
            <div style={{ backgroundColor: 'white', padding: '20px 0' }}>
                <div className="container-centered" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center' }}>
                    
                    {/* IZQUIERDA: LOGO */}
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Link to="/" style={styles.logo}>
                            DECOUD
                        </Link>
                    </div>

                    {/* CENTRO: BUSCADOR */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <form onSubmit={handleSearch} style={styles.searchForm}>
                            <button type="submit" style={styles.searchBtn}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:'#64748b'}}>
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </button>
                            <input 
                                type="text" 
                                placeholder="Buscar productos..." 
                                style={styles.searchInput} 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                    </div>

                    {/* DERECHA: ICONOS DE ACCIÓN */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '25px' }}>
                        
                        {/* Usuario */}
                        <Link to={user ? "/profile" : "/login"} style={styles.iconBtn} title="Mi Cuenta">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            {user && <span style={{fontSize:'0.8rem', marginLeft:'5px'}}>{user.first_name}</span>}
                        </Link>

                        {/* Carrito */}
                        <Link to="/checkout" style={{...styles.iconBtn, position: 'relative'}} title="Carrito">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {totalItems > 0 && (
                                <span style={styles.badge}>{totalItems}</span>
                            )}
                        </Link>
                    </div>

                </div>
            </div>

            {/* 3. BARRA DE NAVEGACIÓN */}
            <div style={{ backgroundColor: 'white', borderTop: '1px solid #f1f5f9', padding: '12px 0' }}>
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
    topLink: {
        color: '#cbd5e1',
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'color 0.2s',
        display: 'flex', 
        alignItems: 'center',
        fontSize: '0.8rem'
    },
    iconOnly: {
        color: '#cbd5e1',
        display: 'flex',
        alignItems: 'center',
        transition: 'color 0.2s',
    },
    // Estilos del Buscador
    searchForm: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: '30px',
        padding: '8px 20px', // Un poco más grande para ser el centro
        border: '1px solid #e2e8f0',
        width: '100%',
        maxWidth: '400px', // Permitimos que sea más ancho en el centro
        transition: 'border-color 0.2s, box-shadow 0.2s'
    },
    searchInput: {
        border: 'none',
        backgroundColor: 'transparent',
        outline: 'none',
        padding: '0 10px',
        fontSize: '0.95rem',
        width: '100%',
        color: '#334155'
    },
    searchBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        alignItems: 'center'
    },
    // Estilo Logo
    logo: {
        textDecoration: 'none',
        color: '#1e3a8a',
        fontSize: '2rem',
        fontWeight: 'bold',
        letterSpacing: '3px',
        fontFamily: 'serif',
    },
    // Navegación
    navLink: {
        textDecoration: 'none',
        color: '#334155',
        fontWeight: '600',
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        transition: 'color 0.2s'
    },
    iconBtn: {
        textDecoration: 'none',
        color: '#334155',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        transition: 'color 0.2s'
    },
    badge: {
        position: 'absolute',
        top: '-8px',
        right: '-10px',
        backgroundColor: '#e11d48',
        color: 'white',
        borderRadius: '50%',
        width: '18px',
        height: '18px',
        fontSize: '0.7rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold'
    }
};

export default Header;