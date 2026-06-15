// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SearchBar from './SearchBar';

const IconTruck = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
);
const IconCard = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
);
const IconPercent = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
);
const IconStar = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
);

const TopBarItem = ({ icon, text }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', padding: '0 4px' }}>
        <span style={{ opacity: 0.85 }}>{icon}</span>
        <span>{text}</span>
    </span>
);

const TopBarSep = () => (
    <span style={{ margin: '0 20px', opacity: 0.35 }}>|</span>
);

const Header = () => {
    const { totalItems, setIsCartOpen } = useCart();
    const { user } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            // Aumentamos el umbral para evitar que "baile" en el borde
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else if (window.scrollY < 10) {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
        <header style={{ 
            position: 'sticky', top: 0, zIndex: 1000, backgroundColor: 'var(--header-bg)',
            boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.08)' : 'none',
            transition: 'box-shadow 0.3s ease, background-color 0.3s ease'
        }}>
            
            {/* TOP BAR - Ticker animado */}
            <div style={{
                backgroundColor: 'var(--topbar-bg)', color: 'white',
                height: isScrolled ? '28px' : '34px',
                overflow: 'hidden', transition: 'height 0.4s ease-in-out',
                display: 'flex', alignItems: 'center',
            }}>
                <div className="topbar-ticker">
                    {[...Array(3)].map((_, rep) => (
                        <div key={rep} className="topbar-track" aria-hidden={rep > 0}>
                            <TopBarItem icon={<IconTruck />} text="Envío sin cargo en Rafaela y zona" />
                            <TopBarSep />
                            <TopBarItem icon={<IconCard />} text="12 cuotas sin interés" />
                            <TopBarSep />
                            <TopBarItem icon={<IconPercent />} text="10% de descuento pagando con transferencia" />
                            <TopBarSep />
                            <TopBarItem icon={<IconStar />} text="Colchones fabricados en Rafaela" />
                            <TopBarSep />
                        </div>
                    ))}
                </div>
            </div>

            {/* MAIN HEADER */}
            <div style={{ 
                background: 'linear-gradient(90deg, var(--decoud-blue) 0%, #2a4e85 100%)',
                padding: isScrolled ? '8px 0' : '15px 0', 
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                transition: 'padding 0.4s ease-in-out'
            }}>
                <div className="container-centered" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                    
                    {/* Hamburguer Mobile */}
                    <button onClick={toggleMobileMenu} style={{...styles.mobileMenuBtn, stroke: 'white'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>

                    {/* LOGO */}
                    <Link to="/" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            borderRadius: '12px',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img
                                src="/logotipo.png"
                                alt="Decoud Colchones"
                                style={{
                                    height: isScrolled ? '50px' : '70px',
                                    transition: 'height 0.3s ease',
                                    display: 'block',
                                }}
                            />
                        </div>
                    </Link>

                    {/* SEARCH (Hidden on mobile, shown on desktop) */}
                    <div style={styles.searchDesktop}>
                        <SearchBar />
                    </div>

                    {/* ACTIONS */}
                    <div className="header-actions-gap" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {/* Dark Mode Toggle */}
                        <button onClick={toggleDarkMode} style={{...styles.iconBtn, background:'none', border:'none', cursor:'pointer'}} title="Cambiar tema">
                            {darkMode ? (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--decoud-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                            ) : (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                            )}
                        </button>

                        <Link to={user ? "/profile" : "/login"} style={{...styles.iconBtn, color: 'white'}} title={user ? "Mi Perfil" : "Iniciar Sesión"}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            {user && <span style={{ fontSize: '0.8rem', marginLeft: '5px', fontWeight: '600' }}>{user.first_name || 'Perfil'}</span>}
                        </Link>

                        <button 
                            onClick={(e) => { e.preventDefault(); setIsCartOpen(true); }} 
                            style={{...styles.cartBtn, background:'none', border:'none', cursor:'pointer'}}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                            {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
                        </button>
                    </div>
                </div>
            </div>

            {/* NAVIGATION (Desktop) */}
            <nav style={{...styles.desktopNav, backgroundColor: 'var(--header-bg)', borderBottom: '1px solid var(--border-color)'}}>
                <div className="container-centered" style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
                    <Link to="/" style={styles.navLink}>Inicio</Link>
                    <Link to="/colchones" style={styles.navLink}>Catálogo</Link>
                    <Link to="/colchones?oferta=true" style={styles.navLink}>Ofertas</Link>
                    <Link to="/nuestra-historia" style={styles.navLink}>Nuestra Historia</Link>
                    <Link to="/preguntas-frecuentes" style={styles.navLink}>Ayuda</Link>
                </div>
            </nav>

            {/* MOBILE MENU OVERLAY */}
            <div style={{
                ...styles.mobileDrawer,
                backgroundColor: 'var(--header-bg)',
                transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)'
            }}>
                <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                    <img src="/logotipo.png" alt="Decoud" style={{ height: '36px', filter: darkMode ? 'invert(1) grayscale(1) brightness(1.5)' : 'none' }} />
                    <button onClick={toggleMobileMenu} style={{ background: 'none', border: 'none' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--decoud-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div style={{ padding: '20px' }}>
                    <div style={{ marginBottom: '30px' }}><SearchBar /></div>
                    <Link to="/" onClick={toggleMobileMenu} style={styles.mobileLink}>Inicio</Link>
                    <Link to="/colchones" onClick={toggleMobileMenu} style={styles.mobileLink}>Catálogo</Link>
                    <Link to="/colchones?oferta=true" onClick={toggleMobileMenu} style={styles.mobileLink}>Ofertas</Link>
                    <Link to="/nuestra-historia" onClick={toggleMobileMenu} style={styles.mobileLink}>Nuestra Historia</Link>
                    <Link to="/preguntas-frecuentes" onClick={toggleMobileMenu} style={styles.mobileLink}>Ayuda</Link>
                </div>
            </div>
            {mobileMenuOpen && <div onClick={toggleMobileMenu} style={styles.overlay}></div>}

        </header>
    );
};

const styles = {
    searchDesktop: { flex: 1, maxWidth: '500px', display: 'block' },
    iconBtn: { textDecoration: 'none', display: 'flex', alignItems: 'center', color: 'var(--decoud-blue)' },
    cartBtn: { position: 'relative', textDecoration: 'none', display: 'flex', alignItems: 'center' },
    badge: { 
        position: 'absolute', 
        top: '-8px', 
        right: '-8px', 
        backgroundColor: '#D4AF37', 
        color: 'white', 
        borderRadius: '50%', 
        width: '18px', 
        height: '18px', 
        fontSize: '0.65rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontWeight: '900', 
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        border: '1.5px solid var(--decoud-blue)',
        lineHeight: '1',
        padding: '0'
    },
    desktopNav: { backgroundColor: 'white', padding: '12px 0', borderBottom: '1px solid #f1f5f9' },
    navLink: { textDecoration: 'none', color: 'var(--decoud-blue)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', transition: 'color 0.2s' },
    mobileMenuBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'none' },
    mobileDrawer: { position: 'fixed', top: 0, left: 0, height: '100vh', width: '280px', backgroundColor: 'white', zIndex: 2000, transition: 'transform 0.3s ease', boxShadow: '10px 0 30px rgba(0,0,0,0.1)' },
    mobileLink: { display: 'block', padding: '15px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--decoud-blue)', textDecoration: 'none', borderBottom: '1px solid var(--border-color)' },
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
    .navLink:hover { color: var(--decoud-gold) !important; }
    @media (max-width: 360px) {
        .header-actions-gap { gap: 8px !important; }
    }

    /* ── Ticker animado topbar ── */
    .topbar-ticker {
        display: flex;
        width: 100%;
        overflow: hidden;
    }
    .topbar-track {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.4px;
        animation: ticker-scroll 30s linear infinite;
    }
    @keyframes ticker-scroll {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-100%); }
    }
    .topbar-ticker:hover .topbar-track {
        animation-play-state: paused;
    }
`;
document.head.appendChild(styleSheet);

export default Header;