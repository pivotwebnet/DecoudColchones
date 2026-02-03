// src/components/CategoryCards.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
    {
        id: 1,
        // Enlace optimizado automáticamente
        image: "https://res.cloudinary.com/djv3eauty/image/upload/f_auto,q_auto/v1770127181/Gemini_Generated_Image_13c9vi13c9vi13c9_xyxwrd.png", 
        link: "/colchones?categoria=espuma"
    },
    {
        id: 2,
        // Enlace optimizado automáticamente
        image: "https://res.cloudinary.com/djv3eauty/image/upload/f_auto,q_auto/v1770127181/Gemini_Generated_Image_u6pbwhu6pbwhu6pb_tyog8t.png",
        link: "/colchones?categoria=caja"
    },
    {
        id: 3,
        // Enlace optimizado automáticamente
        image: "https://res.cloudinary.com/djv3eauty/image/upload/f_auto,q_auto/v1770127180/Gemini_Generated_Image_6u1sm16u1sm16u1s_kqo6df.png",
        link: "/colchones?categoria=sommier"
    }
];

const CategoryCards = () => {
    return (
        <div className="container-centered" style={{ margin: '80px auto' }}>
            
            {/* CSS INTERNO PARA HOVER Y ANIMACIONES */}
            <style>
                {`
                    .category-card {
                        transition: transform 0.4s ease, box-shadow 0.4s ease;
                    }
                    .category-card:hover {
                        transform: translateY(-10px);
                        box-shadow: 0 25px 30px -10px rgba(0, 0, 0, 0.3) !important;
                    }
                    /* Zoom suave en la imagen al pasar el mouse */
                    .category-card:hover .bg-image {
                        transform: scale(1.08);
                    }
                    /* El botón cambia de color */
                    .category-card:hover .explore-btn {
                        background-color: #f8fafc;
                        color: #1e3a8a;
                    }
                `}
            </style>

            <div style={styles.grid}>
                {categories.map((cat) => (
                    <Link to={cat.link} key={cat.id} style={styles.cardLink}>
                        <div className="category-card" style={styles.card}>
                            
                            {/* 1. IMAGEN DE FONDO (Ocupa todo) */}
                            <div style={styles.imageWrapper}>
                                <img 
                                    src={cat.image} 
                                    alt={cat.title} 
                                    className="bg-image"
                                    style={styles.bgImage}
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                                {/* Capa oscura para que se lea el texto */}
                                
                            </div>
                            
                            {/* 2. TEXTO SUPERPUESTO */}
                            <div style={styles.textOverlay}>
                                <h3 style={styles.title}>{cat.title}</h3>
                                <p style={styles.subtitle}>{cat.subtitle}</p>
                                
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
        // Tarjetas responsive: mínimo 300px de ancho
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        justifyContent: 'center',
    },
    cardLink: {
        textDecoration: 'none',
        height: '450px', // Altura fija para uniformidad
        display: 'block',
    },
    card: {
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        height: '100%',
        backgroundColor: '#0f172a', // Fondo de respaldo
    },
    imageWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    bgImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover', // CLAVE: Hace que la imagen llene la tarjeta sin deformarse
        transition: 'transform 0.6s ease',
    },
    darkOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        // Gradiente negro transparente (más oscuro abajo para el texto)
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)',
    },
    textOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: '40px 30px',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    title: {
        fontSize: '2.2rem',
        fontWeight: '800',
        color: 'white',
        margin: '0 0 10px 0',
        letterSpacing: '-0.5px',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    },
    subtitle: {
        fontSize: '1rem',
        color: 'rgba(255,255,255,0.95)',
        margin: '0 0 25px 0',
        fontWeight: '500',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'white',
        color: '#1e3a8a',
        padding: '12px 28px',
        borderRadius: '50px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    },
    buttonText: {
        fontSize: '0.85rem',
        fontWeight: '700',
        letterSpacing: '1px',
    },
    arrow: {
        fontSize: '1.2rem',
    }
};

export default CategoryCards;