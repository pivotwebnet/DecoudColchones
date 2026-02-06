// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null); 

    // URL BASE (Ajustada a tu configuración de backend)
    const API_URL = window.location.hostname === 'localhost' 
        ? 'http://127.0.0.1:8000/api' 
        : 'https://api-colchones.onrender.com/api'; 

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length > 1) { 
                try {
                    // Usamos la ruta correcta que descubrimos: /colchones/
                    const response = await fetch(`${API_URL}/colchones/?search=${query}`);
                    
                    if (response.ok) {
                        const data = await response.json();
                        const resultados = data.results ? data.results : data;
                        setSuggestions(resultados);
                        setShowSuggestions(true);
                    }
                } catch (error) {
                    console.error("Error silencioso en búsqueda:", error);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300); 

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectProduct = (product) => {
        navigate(`/colchones/${product.slug || product.id}`); 
        setShowSuggestions(false);
        setQuery(''); 
    };

    return (
        <div ref={searchRef} style={styles.searchContainer}>
            {/* INPUT WRAPPER: Diseño moderno con borde suave */}
            <div style={styles.inputWrapper}>
                <input
                    type="text"
                    placeholder="Buscar colchón, sommier..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 1 && setShowSuggestions(true)}
                    style={styles.input}
                />
                
                {/* BOTÓN LUPA SVG (Sin emoji) */}
                <button style={styles.searchButton} aria-label="Buscar">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
            </div>

            {/* LISTA DE RESULTADOS FLOTANTE */}
            {showSuggestions && suggestions.length > 0 && (
                <ul style={styles.resultsList}>
                    {suggestions.map((prod) => (
                        <li 
                            key={prod.id} 
                            onClick={() => handleSelectProduct(prod)}
                            style={styles.resultItem}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            {prod.imagen && (
                                <div style={styles.imageContainer}>
                                    <img src={prod.imagen} alt={prod.nombre} style={styles.miniImage} />
                                </div>
                            )}
                            <div style={styles.textInfo}>
                                <span style={styles.prodName}>{prod.nombre}</span>
                                <span style={styles.prodPrice}>
                                    ${parseFloat(prod.precio).toLocaleString('es-AR')}
                                </span>
                            </div>
                            
                            {/* Flecha sutil a la derecha para indicar "Ir" */}
                            <div style={{ marginLeft: 'auto', color: '#cbd5e1' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// ESTILOS PREMIUM
const styles = {
    searchContainer: {
        position: 'relative', 
        width: '100%',
        maxWidth: '600px', // Más ancho para que luzca
        margin: '0 auto' 
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: '50px', // Borde completamente redondeado (estilo Google/Airbnb)
        padding: '6px 6px 6px 20px', // Padding asimétrico para el botón
        border: '1px solid #e2e8f0', // Borde gris muy suave
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)', // Sombra casi imperceptible
        transition: 'all 0.3s ease'
    },
    input: {
        border: 'none',
        outline: 'none',
        width: '100%',
        padding: '8px 0',
        fontSize: '0.95rem',
        color: '#334155',
        backgroundColor: 'transparent'
    },
    searchButton: {
        backgroundColor: 'var(--decoud-gold)', // Fondo Dorado
        color: 'white', // Lupa blanca
        border: 'none',
        borderRadius: '50%', // Botón circular
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s, background-color 0.2s',
        marginLeft: '10px'
    },
    resultsList: {
        position: 'absolute',
        top: '115%', 
        left: '10px', // Un poco metido hacia adentro
        right: '10px',
        backgroundColor: 'white',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', // Sombra "Elevada"
        borderRadius: '12px',
        listStyle: 'none',
        padding: '0',
        margin: '0',
        zIndex: 1000, 
        overflow: 'hidden',
        border: '1px solid #f1f5f9'
    },
    resultItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 15px',
        cursor: 'pointer',
        borderBottom: '1px solid #f8fafc',
        transition: 'background-color 0.2s',
        backgroundColor: 'white'
    },
    imageContainer: {
        width: '40px',
        height: '40px',
        borderRadius: '6px',
        overflow: 'hidden',
        marginRight: '15px',
        border: '1px solid #f1f5f9',
        flexShrink: 0
    },
    miniImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    textInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    prodName: {
        fontWeight: '600',
        fontSize: '0.9rem',
        color: '#1B365D', // Azul Decoud
        marginBottom: '2px'
    },
    prodPrice: {
        fontSize: '0.85rem',
        fontWeight: '700',
        color: '#D4AF37', // Dorado Decoud
        letterSpacing: '0.5px'
    }
};

export default SearchBar;