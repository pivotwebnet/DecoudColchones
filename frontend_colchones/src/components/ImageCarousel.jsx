import React, { useState, useEffect } from 'react';
import { getBanners } from '../api/api'; // Asegúrate de importar esto

// Imágenes de prueba (Fallback por si no hay nada en el backend)
const defaultImages = [
    { imagen: '/banners/img1.jpeg', titulo: 'Default 1' },
    { imagen: '/banners/img2.jpeg', titulo: 'Default 2' },
];

const ImageCarousel = ({ interval = 5000 }) => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 1. Cargar Banners del Backend
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const data = await getBanners();
                if (data && data.length > 0) {
                    setBanners(data);
                }
            } catch (error) {
                console.error("Error cargando banners:", error);
            }
        };
        fetchBanners();
    }, []);

    const itemsToShow = banners.length > 0 ? banners : defaultImages;

    // 2. Rotación automática
    useEffect(() => {
        if (itemsToShow.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % itemsToShow.length);
        }, interval);
        return () => clearInterval(timer);
    }, [interval, itemsToShow.length]);

    if (itemsToShow.length === 0) return null;

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % itemsToShow.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? itemsToShow.length - 1 : prev - 1));

    return (
        <div style={styles.carouselContainer} className="carousel-wrap">
            {/* Contenedor de Imágenes */}
            <div style={styles.slidesWrapper}>
                {itemsToShow.map((item, index) => (
                    <div 
                        key={index} 
                        style={{
                            ...styles.slide,
                            opacity: index === currentIndex ? 1 : 0,
                            zIndex: index === currentIndex ? 1 : 0,
                        }}
                    >
                        <img 
                            src={item.imagen} 
                            alt={item.titulo || `Banner ${index + 1}`} 
                            style={styles.image}
                        />
                    </div>
                ))}
            </div>

            {/* Flechas de Navegación */}
            {itemsToShow.length > 1 && (
                <>
                    <button onClick={prevSlide} style={{ ...styles.arrow, left: '20px' }} className="carousel-arrow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <button onClick={nextSlide} style={{ ...styles.arrow, right: '20px' }} className="carousel-arrow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                </>
            )}

            {/* Puntos de navegación */}
            {itemsToShow.length > 1 && (
                <div style={styles.dotsContainer}>
                    {itemsToShow.map((_, index) => (
                        <span 
                            key={index} 
                            onClick={() => setCurrentIndex(index)}
                            style={{
                                ...styles.dot,
                                backgroundColor: index === currentIndex ? '#D4AF37' : 'rgba(255,255,255,0.5)',
                                transform: index === currentIndex ? 'scale(1.3)' : 'scale(1)',
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    carouselContainer: {
        width: '94%',
        maxWidth: '1300px',
        margin: '20px auto',
        aspectRatio: '16 / 6',
        maxHeight: '500px',
        position: 'relative',
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    },
    slidesWrapper: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    slide: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transition: 'opacity 0.8s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover', // Llena todo el espacio disponible
        objectPosition: 'center', // Mantiene el centro de la imagen siempre a la vista
        backgroundColor: '#f8fafc' // Fondo claro neutro por si tarda en cargar
    },
    arrow: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        color: 'white',
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 10,
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        padding: 0
    },
    dotsContainer: {
        position: 'absolute',
        bottom: '20px',
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        zIndex: 10
    },
    dot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }
};

const carouselResponsive = `
  @media (max-width: 768px) {
    .carousel-wrap { aspect-ratio: 16 / 9 !important; max-height: 260px !important; width: 100% !important; border-radius: 0 !important; margin: 0 !important; }
    .carousel-arrow { width: 36px !important; height: 36px !important; }
    .carousel-arrow svg { width: 18px !important; height: 18px !important; }
  }
  @media (max-width: 480px) {
    .carousel-wrap { aspect-ratio: 4 / 3 !important; max-height: 220px !important; }
  }
`;

const styleEl = document.createElement('style');
styleEl.innerText = carouselResponsive;
document.head.appendChild(styleEl);

export default ImageCarousel;