// src/components/CategoryCards.jsx
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const categories = [
    {
        id: 1,
        title: "Colchones",
        image: "https://res.cloudinary.com/djv3eauty/image/upload/f_auto,q_auto/v1770127181/Gemini_Generated_Image_13c9vi13c9vi13c9_xyxwrd.png", 
        link: "/colchones?categoria=colchones"
    },
    {
        id: 2,
        title: "Sommiers",
        image: "https://res.cloudinary.com/djv3eauty/image/upload/f_auto,q_auto/v1770127180/Gemini_Generated_Image_6u1sm16u1sm16u1s_kqo6df.png",
        link: "/colchones?categoria=sommiers"
    },
    {
        id: 3,
        title: "Espuma",
        image: "https://res.cloudinary.com/djv3eauty/image/upload/f_auto,q_auto/v1770127181/Gemini_Generated_Image_u6pbwhu6pbwhu6pb_tyog8t.png",
        link: "/colchones?categoria=espuma"
    }
];

const CategoryCards = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const scrollAmount = current.clientWidth / 2;
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section style={styles.section}>
            {/* Título más discreto */}
            <h2 style={styles.mainTitle}>Categorías Destacadas</h2>
            
            <div style={styles.carouselContainer}>
                <button onClick={() => scroll('left')} className="nav-btn left">‹</button>

                <div ref={scrollRef} style={styles.track} className="track">
                    {categories.map((cat) => (
                        <Link to={cat.link} key={cat.id} style={styles.card} className="category-card">
                            <div style={styles.imageWrapper} className="img-wrapper">
                                <img
                                    src={cat.image}
                                    alt={cat.title}
                                    style={styles.image}
                                />
                                <div style={styles.overlay} />
                            </div>
                            <h3 style={styles.categoryTitle}>{cat.title}</h3>
                        </Link>
                    ))}
                </div>

                <button onClick={() => scroll('right')} className="nav-btn right">›</button>
            </div>

            <style>{`
                .track::-webkit-scrollbar { display: none; }
                
                .img-wrapper img { transition: transform 0.7s ease; }
                .category-card:hover .img-wrapper img { transform: scale(1.05); }

                /* Flechas más pequeñas */
                .nav-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: var(--header-bg);
                    border: none;
                    width: 35px; height: 35px; /* Más chicas */
                    border-radius: 50%;
                    font-size: 1.5rem;
                    color: var(--decoud-blue);
                    cursor: pointer;
                    z-index: 10;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    display: flex; align-items: center; justify-content: center;
                    padding-bottom: 4px;
                    opacity: 0; 
                    transition: opacity 0.3s, background-color 0.3s, color 0.3s;
                    pointer-events: none;
                }
                
                .carouselContainer:hover .nav-btn { opacity: 0.9; pointer-events: auto; }
                .nav-btn:hover { background: var(--decoud-blue); color: white; }
                .nav-btn.left { left: 10px; }
                .nav-btn.right { right: 10px; }

                @media (max-width: 768px) {
                    .nav-btn { display: none; }
                }
            `}</style>
        </section>
    );
};

const styles = {
    section: {
        width: '100%',     
        maxWidth: '100%',  
        margin: '30px 0', // Menos margen vertical
        padding: '0',      
        fontFamily: "'Helvetica', sans-serif",
        position: 'relative'
    },
    mainTitle: {
        color: 'var(--decoud-blue)',
        textAlign: 'center',
        fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
        marginBottom: '20px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        transition: 'color 0.3s ease'
    },
    carouselContainer: {
        position: 'relative',
        width: '100%',
        className: 'carouselContainer'
    },
    track: {
        display: 'flex',
        width: '100%',
        height: 'clamp(160px, 30vw, 280px)',
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        scrollbarWidth: 'none',
        scrollBehavior: 'smooth',
        gap: '2px',
    },
    card: {
        flex: '1',
        minWidth: 'clamp(160px, 40vw, 260px)',
        height: '100%',
        position: 'relative',
        textDecoration: 'none',
        scrollSnapAlign: 'start',
        backgroundColor: 'var(--bg-color)',
        overflow: 'hidden',
        transition: 'background-color 0.3s ease',
    },
    imageWrapper: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover', // Se recorta automáticamente para encajar en la nueva altura
    },
    overlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        // Gradiente un poco más fuerte para que el texto se lea bien en formato pequeño
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)',
    },
    categoryTitle: {
        position: 'absolute',   
        top: '20px',
        right: '20px',
        margin: 0,
        color: '#fff', 
        // Texto más chico y proporcional
        fontSize: '1.4rem', 
        fontWeight: '700', 
        textShadow: '0 2px 8px rgba(0,0,0,0.6)',
        textAlign: 'right',
        zIndex: 2,
        letterSpacing: '0.5px',
        textTransform: 'uppercase'
    }
};

export default CategoryCards;