// src/components/CategoryCards.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
    {
        id: 1,
        title: "Colchones",
        subtitle: "Espuma y Resortes de alta densidad",
        image: "/categories/colchon.png", 
        link: "/colchones?categoria=espuma"
    },
    {
        id: 2,
        title: "En Caja",
        subtitle: "La comodidad lista para llevar",
        image: "/categories/caja.png",
        link: "/colchones?categoria=caja"
    },
    {
        id: 3,
        title: "Sommiers",
        subtitle: "Conjuntos completos y bases",
        image: "/categories/sommier.png",
        link: "/colchones?categoria=sommier"
    }
];

const CategoryCards = () => {
    return (
        <div className="container-centered" style={{ margin: '60px auto' }}>
            {/* Estilos CSS internos para el efecto Hover */}
            <style>
                {`
                    .category-card {
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                    }
                    .category-card:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                    }
                    .category-card:hover .explore-arrow {
                        transform: translateX(5px);
                        color: var(--color-accent);
                    }
                `}
            </style>

            <div style={styles.grid}>
                {categories.map((cat) => (
                    <Link to={cat.link} key={cat.id} style={styles.cardLink}>
                        <div className="category-card" style={styles.card}>
                            
                            {/* Mitad Superior: Imagen con fondo suave */}
                            <div style={styles.imageContainer}>
                                <img 
                                    src={cat.image} 
                                    alt={cat.title} 
                                    style={styles.image}
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                            
                            {/* Mitad Inferior: Texto limpio */}
                            <div style={styles.textContainer}>
                                <div>
                                    <h3 style={styles.title}>{cat.title}</h3>
                                    <p style={styles.subtitle}>{cat.subtitle}</p>
                                </div>
                                <div style={styles.actionRow}>
                                    <span style={styles.exploreText}>Ver colección</span>
                                    <span className="explore-arrow" style={styles.arrow}>→</span>
                                </div>
                            </div>

                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        justifyContent: 'center',
    },
    cardLink: {
        textDecoration: 'none',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '16px', // Bordes redondeados pero sutiles
        overflow: 'hidden',
        border: '1px solid #f3f4f6',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    imageContainer: {
        backgroundColor: '#f8fafc', // Gris muy claro, casi blanco
        height: '240px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        borderBottom: '1px solid #f3f4f6',
    },
    image: {
        maxWidth: '85%',
        maxHeight: '200px',
        objectFit: 'contain',
        filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))', // Sombra suave solo a la imagen
    },
    textContainer: {
        padding: '25px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '20px',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#1e3a8a', // Azul corporativo
        margin: '0 0 8px 0',
        letterSpacing: '-0.5px',
    },
    subtitle: {
        fontSize: '0.95rem',
        color: '#64748b', // Gris azulado para texto secundario
        margin: 0,
        lineHeight: '1.5',
    },
    actionRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginTop: 'auto',
    },
    exploreText: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#334155',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    arrow: {
        fontSize: '1.2rem',
        transition: 'transform 0.2s ease, color 0.2s ease',
        color: '#94a3b8',
    }
};

export default CategoryCards;