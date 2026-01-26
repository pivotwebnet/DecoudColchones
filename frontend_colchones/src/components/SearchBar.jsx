// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null); 

    // Efecto para buscar con "Debounce"
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length > 1) { 
                try {
                    // Asegúrate de que este puerto sea el correcto (8000)
                    const response = await fetch(`http://127.0.0.1:8000/api/productos/search/?q=${query}`);
                    const data = await response.json();
                    setSuggestions(data);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Error buscando:", error);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300); 

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Cerrar sugerencias si haces clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- CORRECCIÓN CLAVE AQUÍ ---
    const handleSelectProduct = (product) => {
        // Usamos el SLUG para navegar, ya que App.jsx espera /colchones/:slug
        // Si por alguna razón no hay slug, usamos el ID como respaldo
        const identifier = product.slug || product.id;
        
        navigate(`/colchones/${identifier}`); 
        
        setShowSuggestions(false);
        setQuery(''); 
    };

    return (
        <div ref={searchRef} style={styles.searchContainer}>
            <div style={styles.inputWrapper}>
                <input
                    type="text"
                    placeholder="Buscar colchón..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 1 && setShowSuggestions(true)}
                    style={styles.input}
                />
                <span style={styles.icon}>🔍</span>
            </div>

            {/* Lista desplegable de resultados */}
            {showSuggestions && suggestions.length > 0 && (
                <ul style={styles.resultsList}>
                    {suggestions.map((prod) => (
                        <li 
                            key={prod.id} 
                            // --- CAMBIO AQUÍ: Pasamos el objeto 'prod' entero ---
                            onClick={() => handleSelectProduct(prod)}
                            style={styles.resultItem}
                        >
                            <img src={prod.imagen} alt={prod.nombre} style={styles.miniImage} />
                            <div style={styles.textInfo}>
                                <span style={styles.prodName}>{prod.nombre}</span>
                                <span style={styles.prodPrice}>${prod.precio}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const styles = {
    searchContainer: {
        position: 'relative', 
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto' 
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: '25px',
        padding: '5px 15px',
        border: '1px solid #ccc'
    },
    input: {
        border: 'none',
        outline: 'none',
        width: '100%',
        padding: '8px',
        fontSize: '1rem'
    },
    icon: {
        fontSize: '1.2rem',
        cursor: 'pointer'
    },
    resultsList: {
        position: 'absolute',
        top: '100%', 
        left: 0,
        width: '100%',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        listStyle: 'none',
        padding: 0,
        margin: '5px 0 0 0',
        zIndex: 1000, 
        overflow: 'hidden'
    },
    resultItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 15px',
        cursor: 'pointer',
        borderBottom: '1px solid #eee',
        transition: 'background 0.2s'
    },
    miniImage: {
        width: '40px',
        height: '40px',
        objectFit: 'cover',
        borderRadius: '4px',
        marginRight: '10px'
    },
    textInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    prodName: {
        fontWeight: 'bold',
        fontSize: '0.9rem',
        color: '#333'
    },
    prodPrice: {
        fontSize: '0.8rem',
        color: '#228B22' 
    }
};

export default SearchBar;