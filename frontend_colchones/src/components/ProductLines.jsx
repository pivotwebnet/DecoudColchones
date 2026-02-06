// src/components/ProductLines.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLineas } from '../api/api'; // <--- Importamos la función nueva

const ProductLines = () => {
    const [lines, setLines] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    // 1. CARGAR DATOS DESDE EL BACKEND
    useEffect(() => {
        const fetchLines = async () => {
            try {
                const data = await getLineas();
                // Transformamos los datos para que encajen con tu diseño
                const formattedLines = data.map(line => ({
                    id: line.id,
                    name: line.nombre,
                    image: line.imagen_url,
                    // Generamos el link dinámicamente usando el slug
                    link: `/colchones?linea=${line.slug}`
                }));
                setLines(formattedLines);
            } catch (error) {
                console.error("Error cargando líneas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLines();
    }, []);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const scrollAmount = 420; 
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Si está cargando o no hay líneas, no mostramos nada (o podrías poner un loader)
    if (!loading && lines.length === 0) return null;
            
    return (
        <div style={{ width: '100%', backgroundColor: 'white', padding: '60px 0' }}>
            
            {/* Título */}
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h2 style={{ fontSize: '2.2rem', color: '#1e3a8a', fontWeight: '800', margin: 0, letterSpacing: '-1px' }}>
                    Nuestras Líneas
                </h2>
                <div style={{ width: '80px', height: '4px', backgroundColor: '#ffd700', margin: '15px auto 0', borderRadius: '2px' }}></div>
            </div>

            {/* Slider Container */}
            <div style={styles.sliderContainer}>
                
                {/* Flecha Izquierda (Solo si hay muchas líneas) */}
                {lines.length > 3 && (
                    <button onClick={() => scroll('left')} style={styles.arrowBtn}>←</button>
                )}

                {/* Lista Scrollable */}
                <div ref={scrollRef} style={styles.scrollArea}>
                    {loading ? (
                        <p>Cargando líneas...</p>
                    ) : (
                        lines.map((line) => (
                            <div key={line.id} style={styles.itemCard}>
                                <div style={styles.imageWrapper}>
                                    {line.image ? (
                                        <img 
                                            src={line.image} 
                                            alt={line.name} 
                                            style={styles.image} 
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    ) : (
                                        <div style={{...styles.image, display:'flex', alignItems:'center', justifyContent:'center', background:'#eee', color:'#999'}}>
                                            Sin Imagen
                                        </div>
                                    )}
                                </div>
                                <Link to={line.link} style={styles.pillButton}>
                                    {line.name}
                                </Link>
                            </div>
                        ))
                    )}
                </div>

                {/* Flecha Derecha */}
                {lines.length > 3 && (
                    <button onClick={() => scroll('right')} style={styles.arrowBtn}>→</button>
                )}

            </div>
        </div>
    );
};

// TUS MISMOS ESTILOS (Sin cambios)
const styles = {
    sliderContainer: {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px',
        maxWidth: '1400px', margin: '0 auto', padding: '0 20px', position: 'relative'
    },
    arrowBtn: {
        backgroundColor: 'white', border: '1px solid #eee', cursor: 'pointer',
        width: '50px', height: '50px', borderRadius: '50%', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)', zIndex: 2, color: '#333', transition: '0.2s'
    },
    scrollArea: {
        display: 'flex', gap: '30px', overflowX: 'auto', scrollBehavior: 'smooth',
        padding: '20px 5px', scrollbarWidth: 'none', width: '100%',
    },
    itemCard: {
        minWidth: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'
    },
    imageWrapper: {
        width: '100%', height: '350px', borderRadius: '12px', overflow: 'hidden',
        boxShadow: '0 10px 20px rgba(0,0,0,0.08)', backgroundColor: '#f8fafc'
    },
    image: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' },
    pillButton: {
        textDecoration: 'none', border: '2px solid #1e3a8a', borderRadius: '50px',
        padding: '10px 30px', color: '#1e3a8a', fontSize: '0.9rem', fontWeight: '700',
        backgroundColor: 'white', transition: 'all 0.3s', textTransform: 'uppercase', letterSpacing: '1px'
    }
};

export default ProductLines;