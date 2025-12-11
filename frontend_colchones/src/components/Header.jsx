// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Hook del carrito conectado

const Header = () => {
    const { user, logoutUser } = useAuth();
    
    // Obtenemos los items del carrito para calcular el total
    const { cartItems } = useCart(); 
    
    // Sumamos la cantidad de cada item (ej: 2 almohadas + 1 colchón = 3)
    const cartCount = cartItems.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <header style={{ width: '100%', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
            
            {/* 1. BARRA SUPERIOR (Redes Sociales) */}
            <div style={styles.topBar}>
                <div className="container-centered" style={{ display: 'flex', gap: '15px' }}>
                    <SocialIcon path="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M19,5A1,1 0 0,1 20,6A1,1 0 0,1 19,7A1,1 0 0,1 18,6A1,1 0 0,1 19,5Z" />
                    <SocialIcon path="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.15 5.96C15.21 5.96 16.12 6.04 16.39 6.08V8.7H14.86C13.65 8.7 13.41 9.28 13.41 10.12V12.06H16.32L15.86 14.96H13.41V21.96C18.19 21.21 21.86 17.06 21.86 12.06C21.86 6.53 17.35 2.04 12 2.04Z" />
                    <SocialIcon path="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z" />
                </div>
            </div>

            {/* 2. BARRA PRINCIPAL (Logo, Buscador, Carrito) */}
            <div className="container-centered" style={styles.mainHeader}>
                
                {/* Izquierda: Buscador */}
                <div style={{ flex: 1 }}>
                    <button style={styles.searchButton}>
                        <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24">
                            <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                        </svg>
                    </button>
                </div>

                {/* Centro: Logo */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <Link to="/" style={styles.logoText}>
                        <span style={{ display: 'block', lineHeight: '1' }}>DECOUD</span>
                        <span style={styles.logoSubtext}>COLCHONES & SOMMIERS</span>
                    </Link>
                </div>

                {/* Derecha: Usuario y Carrito */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                    
                    {/* Botón de Usuario */}
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Hola, {user.first_name || 'Usuario'}</span>
                            <button onClick={logoutUser} style={styles.iconButton} title="Cerrar Sesión">
                                <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M17,17.25V14H10V10H17V6.75L22.25,12L17,17.25M13,2A2,2 0 0,1 15,4V8H13V4H4V20H13V16H15V20A2,2 0 0,1 13,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2H13Z" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" style={styles.iconButton}>
                            <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                            </svg>
                        </Link>
                    )}

                    {/* Botón de Carrito (CON CONTADOR DINÁMICO) */}
                    <Link to="/carrito" style={styles.cartButton}>
                        <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                            <path fill="currentColor" d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.25,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.59 17.3,11.97L21.16,4.96L19.42,4H19.41L18.31,6L15.55,11H8.53L8.4,10.73L6.16,6L5.21,4L4.27,2H1M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z" />
                        </svg>
                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>({cartCount})</span>
                    </Link>
                </div>
            </div>

            {/* 3. BARRA DE NAVEGACIÓN */}
            <div style={styles.navBar}>
                <div className="container-centered" style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
                    <NavLink to="/colchones">Sommiers</NavLink>
                    <NavLink to="/colchones">Colchones</NavLink>
                    <NavLink to="/colchones">Almohadas</NavLink>
                    <NavLink to="/colchones">Ropa de Cama</NavLink>
                    <NavLink to="/colchones">Venta Mayorista</NavLink>
                </div>
            </div>

        </header>
    );
};

// Componentes auxiliares
const SocialIcon = ({ path }) => (
    <svg style={{ width: '16px', height: '16px', cursor: 'pointer', fill: '#555' }} viewBox="0 0 24 24">
        <path d={path} />
    </svg>
);

const NavLink = ({ to, children }) => (
    <Link to={to} style={styles.navLink}>
        {children}
    </Link>
);

const styles = {
    topBar: { backgroundColor: '#f5f5f5', padding: '8px 0', borderBottom: '1px solid #e0e0e0' },
    mainHeader: { padding: '20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    searchButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '35px', borderRadius: '20px', border: '1px solid #333', backgroundColor: 'transparent', cursor: 'pointer', color: '#333' },
    logoText: { fontSize: '2rem', fontWeight: 'normal', letterSpacing: '2px', color: '#1e3a8a', textDecoration: 'none', fontFamily: 'serif' },
    logoSubtext: { fontSize: '0.6rem', letterSpacing: '4px', color: '#666', textTransform: 'uppercase', marginTop: '5px', display: 'block' },
    iconButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '45px', height: '35px', borderRadius: '20px', border: '1px solid #333', backgroundColor: 'white', cursor: 'pointer', color: '#333', textDecoration: 'none' },
    cartButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0 15px', height: '35px', borderRadius: '20px', border: '1px solid #333', backgroundColor: 'white', cursor: 'pointer', color: '#333', textDecoration: 'none' },
    navBar: { borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '15px 0' },
    navLink: { textDecoration: 'none', color: '#333', fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px', transition: 'color 0.2s' }
};

export default Header;