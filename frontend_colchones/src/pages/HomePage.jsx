// src/pages/HomePage.jsx (Rediseñado)
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        // La Home debe estar FUERA del .content-area para que se vea el fondo degradado
        <div style={styles.homeContainer}>
            <header style={styles.hero}>
                <h1 style={styles.heroTitle}>La Cima del Descanso en Santa Fe</h1>
                <p style={styles.heroSubtitle}>Colchones de alta densidad, resortes y tecnología de soporte, diseñados para tu bienestar.</p>
                <Link to="/colchones" className="btn-primary" style={styles.heroButton}>
                    Ver Catálogo Completo
                </Link>
            </header>
            
            <section className="content-area"> {/* Las secciones internas usan el área blanca */}
                <h2 style={styles.sectionTitle}>¿Por qué elegir Calidad y Soporte?</h2>
                <div style={styles.featureGrid}>
                    <div style={styles.featureItem}>
                        <h4>Densidad Garantizada</h4>
                        <p>Firmeza ideal para cualquier peso corporal, desde 70kg hasta 140kg.</p>
                    </div>
                    <div style={styles.featureItem}>
                        <h4>Foco en Rafaela</h4>
                        <p>Envíos rápidos y soporte local en Rafaela y toda la Provincia de Santa Fe.</p>
                    </div>
                    <div style={styles.featureItem}>
                        <h4>Variantes Personalizadas</h4>
                        <p>Elige la altura y medida exacta de tu colchón de línea premium.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

const styles = {
    homeContainer: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    hero: {
        textAlign: 'center',
        padding: '100px 20px',
        backgroundColor: 'transparent', // Transparente para ver el body degrade
        color: 'var(--color-text-light)',
        marginBottom: '20px',
        flexShrink: 0,
    },
    heroTitle: { fontSize: '3.5em', marginBottom: '10px', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' },
    heroSubtitle: { fontSize: '1.2em', marginBottom: '30px' },
    heroButton: { fontSize: '1.2em', padding: '12px 30px' },
    sectionTitle: { textAlign: 'center', fontSize: '2em', color: 'var(--color-primary)', marginBottom: '30px' },
    featureGrid: { display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' },
    featureItem: { 
        width: '30%', minWidth: '280px', padding: '20px', 
        border: '1px solid #ddd', borderRadius: '8px', margin: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }
};

export default HomePage;