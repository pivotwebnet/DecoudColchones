// src/components/ProductLines.jsx
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const lines = [
    { id: 1, name: "LINEA DESEO", image: "/lines/box-prime.png", link: "/colchones?linea=box-prime" },
    { id: 2, name: "LINEA CATARATA", image: "/lines/box-plus.png", link: "/colchones?linea=box-plus" },
    { id: 3, name: "LINEA HORTENCIA", image: "/lines/manhattan.png", link: "/colchones?linea=manhattan" },
    { id: 4, name: "LINEA NUBE", image: "/lines/dubai.png", link: "/colchones?linea=dubai" },
    // Puedes agregar más aquí si tienes
];

const ProductLines = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const scrollAmount = 500; // Cantidad de pixeles que mueve cada flecha
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div style={{ width: '100%', backgroundColor: 'white', padding: '50px 0' }}>
            
            {/* Título de la Sección */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ 
                    fontSize: '2rem', 
                    color: '#334155', // Gris azulado oscuro (Slate)
                    fontWeight: 'bold', 
                    margin: 0 
                }}>
                    Líneas de productos
                </h2>
                <div style={{ width: '500px', height: '3px', backgroundColor: '#1e3a8a', margin: '10px auto' }}></div>
            </div>

            {/* Contenedor del Slider (Flecha Izq + Carrusel + Flecha Der) */}
            <div style={styles.sliderContainer}>
                
                {/* Botón Izquierda */}
                <button onClick={() => scroll('left')} style={styles.arrowBtn}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>

                {/* Lista de Imágenes (Scrollable) */}
                <div ref={scrollRef} style={styles.scrollArea}>
                    {lines.map((line) => (
                        <div key={line.id} style={styles.itemCard}>
                            {/* Imagen */}
                            <div style={styles.imageWrapper}>
                                <img 
                                    src={line.image} 
                                    alt={line.name} 
                                    style={styles.image} 
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                            
                            {/* Botón Nombre (Pill Shape) */}
                            <Link to={line.link} style={styles.pillButton}>
                                {line.name}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Botón Derecha */}
                <button onClick={() => scroll('right')} style={styles.arrowBtn}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>

            </div>
        </div>
    );
};

const styles = {
    sliderContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        maxWidth: '1900px', // MÁS ANCHO que el contenedor normal (usualmente 1100px)
        margin: '0 auto',
        padding: '0 20px',
    },
    arrowBtn: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '10px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.3s',
        color: '#333',
        minWidth: '40px'
    },
    scrollArea: {
        display: 'flex',
        gap: '30px',
        overflowX: 'auto',
        scrollBehavior: 'smooth',
        paddingBottom: '20px', // Espacio para que no se corte la sombra
        scrollbarWidth: 'none', // Ocultar barra de scroll en Firefox
        width: '100%',
        msOverflowStyle: 'none', // Ocultar en IE/Edge
    },
    itemCard: {
        minWidth: '400px', // Ancho fijo de cada item
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
    },
    imageWrapper: {
        width: '100%',
        height: '400px',
        borderRadius: '4px', // Borde sutil como en la foto
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        backgroundColor: '#f1f1f1' // Fondo gris por si la imagen es transparente
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover', // Para que llene todo el cuadro (zoom a la textura)
        transition: 'transform 0.3s ease'
    },
    pillButton: {
        textDecoration: 'none',
        border: '1px solid #333',
        borderRadius: '30px', // Forma de pastilla
        padding: '8px 25px',
        color: '#333',
        fontSize: '0.9rem',
        fontWeight: '600',
        backgroundColor: 'white',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap'
    }
};

export default ProductLines;