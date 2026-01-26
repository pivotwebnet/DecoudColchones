// src/components/HeroSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    // 1. LISTA DE IMÁGENES DE FONDO (Reemplazalas por las tuyas reales)
    const backgroundImages = [
        "https://images.unsplash.com/photo-1505693416388-b034680c5006?q=80&w=2071&auto=format&fit=crop", // Dormitorio luminoso
        "https://images.unsplash.com/photo-1505691938895-1758d7bab58c?q=80&w=2070&auto=format&fit=crop", // Cama detalle
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop"  // Hotel luxury vibe
    ];

    // 2. LÓGICA DEL CARRUSEL
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        }, 5000); // Cambia cada 5 segundos
        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    return (
        <section style={styles.heroContainer}>
            
            {/* --- FONDO DINÁMICO (CARRUSEL) --- */}
            {backgroundImages.map((img, index) => (
                <div 
                    key={index}
                    style={{
                        ...styles.backgroundImage,
                        backgroundImage: `url(${img})`,
                        opacity: index === currentIndex ? 1 : 0, // Solo mostramos la actual
                    }}
                />
            ))}

            {/* --- CAPA OSCURA (OVERLAY) --- */}
            {/* Oscurece las fotos para que el texto resalte */}
            <div style={styles.overlay}></div>

            {/* --- CONTENIDO PRINCIPAL (TEXTO) --- */}
            <div className="container-centered" style={styles.contentWrapper}>
                
                <div style={styles.textContent}>
                    <h2 style={styles.subtitleSmall}>BIENVENIDO A DECOUD</h2>
                    <h1 style={styles.title}>
                        El descanso que buscás,<br />
                        <span style={styles.highlight}>directo de fábrica.</span>
                    </h1>
                    <p style={styles.description}>
                        Fabricamos en Rafaela con materiales de primera línea. 
                        Tecnología, confort y durabilidad para que duermas como merecés.
                    </p>
                    
                    <Link to="/colchones" style={styles.ctaButton}>
                        Ver Catálogo Completo
                    </Link>
                </div>

                {/* Íconos de características */}
                <div style={styles.featuresContainer}>
                    <div style={styles.featureItem}>
                        <div style={styles.iconBox}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        </div>
                        <div>
                            <h3 style={styles.featureTitle}>Calidad Premium</h3>
                            <p style={styles.featureText}>Espumas de alta densidad.</p>
                        </div>
                    </div>

                    <div style={styles.featureItem}>
                        <div style={styles.iconBox}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                        </div>
                        <div>
                            <h3 style={styles.featureTitle}>Envíos Rápidos</h3>
                            <p style={styles.featureText}>A todo Santa Fe y zona.</p>
                        </div>
                    </div>

                    <div style={styles.featureItem}>
                        <div style={styles.iconBox}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        </div>
                        <div>
                            <h3 style={styles.featureTitle}>Garantía Oficial</h3>
                            <p style={styles.featureText}>Respaldo directo de fábrica.</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

const styles = {
    heroContainer: {
        position: 'relative',
        minHeight: '600px', // Altura mínima para que luzcan las fotos
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        color: 'white',
    },
    // Estilo para las imágenes de fondo
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'opacity 1s ease-in-out', // Transición suave (Fade)
        zIndex: 0
    },
    // Capa negra semitransparente
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.7)', // Azul oscuro muy transparente
        zIndex: 1
    },
    contentWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2, // Asegura que el texto esté encima de todo
        padding: '60px 20px'
    },
    subtitleSmall: {
        color: '#94a3b8', 
        fontSize: '0.9rem',
        fontWeight: '700',
        letterSpacing: '2px',
        marginBottom: '10px',
        textTransform: 'uppercase'
    },
    title: {
        fontSize: '3.5rem', // Un poco más grande para impactar
        fontWeight: '800',
        lineHeight: '1.1',
        marginBottom: '20px',
        letterSpacing: '-1px',
        textShadow: '0 2px 10px rgba(0,0,0,0.3)' // Sombra para legibilidad
    },
    highlight: {
        color: '#60a5fa', 
    },
    description: {
        fontSize: '1.25rem',
        color: '#e2e8f0', 
        maxWidth: '650px',
        marginBottom: '40px',
        lineHeight: '1.6',
        textShadow: '0 1px 5px rgba(0,0,0,0.5)'
    },
    ctaButton: {
        backgroundColor: '#ffffff',
        color: '#1e3a8a',
        padding: '16px 45px',
        borderRadius: '50px',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        marginBottom: '60px',
        display: 'inline-block'
    },
    // FEATURES (Igual que antes)
    featuresContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '30px',
        marginTop: '20px',
        borderTop: '1px solid rgba(255,255,255,0.2)',
        paddingTop: '40px',
        width: '100%'
    },
    featureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        textAlign: 'left',
        backgroundColor: 'rgba(0,0,0,0.4)', // Fondo semitransparente para cada cajita
        padding: '15px 25px',
        borderRadius: '12px',
        minWidth: '280px',
        backdropFilter: 'blur(5px)' // Efecto vidrio esmerilado (moderno)
    },
    iconBox: {
        color: '#60a5fa', 
        display: 'flex',
        alignItems: 'center'
    },
    featureTitle: {
        fontSize: '1rem',
        fontWeight: 'bold',
        margin: 0,
        color: 'white'
    },
    featureText: {
        fontSize: '0.85rem',
        margin: 0,
        color: '#cbd5e1'
    }
};

export default HeroSection;