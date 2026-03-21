// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';

const Header = () => {
    const { totalItems, setIsCartOpen } = useCart();
    const { user } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
        <header style={{ 
            position: 'sticky', top: 0, zIndex: 1000, backgroundColor: 'white',
            transition: 'all 0.3s ease',
            boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.08)' : 'none'
        }}>
            
            {/* TOP BAR - Beneficios */}
            <div style={{ 
                backgroundColor: '#1B365D', color: 'white', fontSize: '0.7rem', 
                height: isScrolled ? '0' : '35px', overflow: 'hidden', transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', letterSpacing: '0.5px'
            }}>
                🚚 ENVÍO SIN CARGO EN RAFAELA Y ZONA • 💳 12 CUOTAS SIN INTERÉS
            </div>

            {/* MAIN HEADER */}
            <div style={{ padding: isScrolled ? '10px 0' : '15px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div className="container-centered" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                    
                    {/* Hamburguer Mobile */}
                    <button onClick={toggleMobileMenu} style={styles.mobileMenuBtn}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B365D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>

                    {/* LOGO */}
                    <Link to="/" style={{ flex: '0 0 auto' }}>
                        <img src="/logotipo.png" alt="Decoud" style={{ height: isScrolled ? '35px' : '45px', transition: 'height 0.3s' }} />
                    </Link>

                    {/* SEARCH (Hidden on mobile, shown on desktop) */}
                    <div style={styles.searchDesktop}>
                        <SearchBar />
                    </div>

                    {/* ACTIONS */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Link to={user ? "/profile" : "/login"} style={styles.iconBtn} title="Mi Cuenta">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B365D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </Link>
                        <button 
                            onClick={(e) => { e.preventDefault(); setIsCartOpen(true); }} 
                            style={{...styles.cartBtn, background:'none', border:'none', cursor:'pointer'}}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B365D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                            {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
                        </button>
                    </div>
                </div>
            </div>

            {/* NAVIGATION (Desktop) */}
            <nav style={styles.desktopNav}>
                <div className="container-centered" style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
                    <Link to="/" style={styles.navLink}>Inicio</Link>
                    <Link to="/colchones" style={styles.navLink}>Catálogo</Link>
                    <Link to="/colchones?oferta=true" style={styles.navLink}>Ofertas</Link>
                    <Link to="/preguntas-frecuentes" style={styles.navLink}>Ayuda</Link>
                </div>
            </nav>

            {/* MOBILE MENU OVERLAY */}
            <div style={{
                ...styles.mobileDrawer,
                transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)'
            }}>
                <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                    <img src="/logotipo.png" alt="Decoud" style={{ height: '30px' }} />
                    <button onClick={toggleMobileMenu} style={{ background: 'none', border: 'none' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B365D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div style={{ padding: '20px' }}>
                    <div style={{ marginBottom: '30px' }}><SearchBar /></div>
                    <Link to="/" onClick={toggleMobileMenu} style={styles.mobileLink}>Inicio</Link>
                    <Link to="/colchones" onClick={toggleMobileMenu} style={styles.mobileLink}>Catálogo</Link>
                    <Link to="/colchones?oferta=true" onClick={toggleMobileMenu} style={styles.mobileLink}>Ofertas</Link>
                    <Link to="/preguntas-frecuentes" onClick={toggleMobileMenu} style={styles.mobileLink}>Ayuda</Link>
                </div>
            </div>
            {mobileMenuOpen && <div onClick={toggleMobileMenu} style={styles.overlay}></div>}

        </header>
    );
};

const styles = {
    searchDesktop: { flex: 1, maxWidth: '500px', display: 'block' },
    iconBtn: { textDecoration: 'none', display: 'flex', alignItems: 'center' },
    cartBtn: { position: 'relative', textDecoration: 'none', display: 'flex', alignItems: 'center' },
    badge: { position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#D4AF37', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
    desktopNav: { backgroundColor: 'white', padding: '12px 0', borderBottom: '1px solid #f1f5f9' },
    navLink: { textDecoration: 'none', color: '#1B365D', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', transition: 'color 0.2s' },
    mobileMenuBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'none' },
    mobileDrawer: { position: 'fixed', top: 0, left: 0, height: '100vh', width: '280px', backgroundColor: 'white', zIndex: 2000, transition: 'transform 0.3s ease', boxShadow: '10px 0 30px rgba(0,0,0,0.1)' },
    mobileLink: { display: 'block', padding: '15px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1B365D', textDecoration: 'none', borderBottom: '1px solid #f8fafc' },
    overlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1999 },
    
    // Media queries simulated
    '@media (max-width: 768px)': {
        mobileMenuBtn: { display: 'block' },
        searchDesktop: { display: 'none' },
        desktopNav: { display: 'none' }
    }
};

// Necesitamos inyectar los estilos reales para media queries
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @media (max-width: 768px) {
        .search-desktop { display: none !important; }
        .desktop-nav { display: none !important; }
        .mobile-menu-btn { display: block !important; }
    }
    @media (min-width: 769px) {
        .mobile-menu-btn { display: none !important; }
    }
`;
document.head.appendChild(styleSheet);

export default Header;