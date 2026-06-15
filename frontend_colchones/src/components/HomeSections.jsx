// src/components/HomeSections.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const categoryData = [
    {
        id: 'kids',
        title: 'KIDS',
        subtitle: '1 Plaza',
        image: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=800&auto=format&fit=crop',
        link: '/colchones?medida=1_plaza',
        description: 'Colchones y sommiers diseñados para el descanso de los más pequeños.'
    },
    {
        id: 'teens',
        title: 'TEENS',
        subtitle: '1 1/2 Plaza',
        image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop',
        link: '/colchones?medida=1_y_media',
        description: 'El espacio ideal para el crecimiento y confort de los jóvenes.'
    },
    {
        id: 'family',
        title: 'FAMILY',
        subtitle: '2 Plazas y +',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop',
        link: '/colchones?medida=2_plazas',
        description: 'Compartir el descanso con la mejor calidad y amplitud.'
    },
    {
        id: 'premium',
        title: 'PREMIUM',
        subtitle: 'Soporte +100kg',
        image: 'https://images.unsplash.com/photo-1505693415958-a059a1143a72?q=80&w=800&auto=format&fit=crop',
        link: '/colchones?soporte_min=100',
        description: 'Tecnología de avanzada para quienes buscan el máximo soporte.'
    }
];

const CategoryCard = ({ cat }) => (
    <Link to={cat.link} style={styles.card} className="home-cat-card">
        <div style={styles.imageContainer}>
            <img src={cat.image} alt={cat.title} style={styles.image} />
            <div style={styles.overlay}>
                <div style={styles.textContainer}>
                    <h3 style={styles.title}>{cat.title}</h3>
                    <p style={styles.subtitle}>{cat.subtitle}</p>
                    <div className="cat-desc" style={styles.description}>{cat.description}</div>
                    <span style={styles.btn}>Ver Colección</span>
                </div>
            </div>
        </div>
    </Link>
);

const HomeSections = () => {
    return (
        <section className="container-centered" style={{ marginTop: '60px', marginBottom: '80px' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', color: 'var(--decoud-blue)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                    Elegí tu descanso ideal
                </h2>
                <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--decoud-gold)', margin: '0 auto', borderRadius: '2px' }}></div>
            </div>

            <div style={styles.grid}>
                {categoryData.map(cat => (
                    <CategoryCard key={cat.id} cat={cat} />
                ))}
            </div>

            <style>{`
                .home-cat-card { transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .home-cat-card:hover { transform: translateY(-10px); }
                .home-cat-card:hover .cat-desc { opacity: 1; max-height: 100px; margin-top: 10px; }
                .home-cat-card img { transition: transform 0.6s ease; }
                .home-cat-card:hover img { transform: scale(1.1); }
            `}</style>
        </section>
    );
};

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '25px',
        width: '100%'
    },
    card: {
        borderRadius: '20px',
        overflow: 'hidden',
        textDecoration: 'none',
        height: '450px',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        position: 'relative'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(to top, rgba(27, 54, 93, 0.95) 0%, rgba(27, 54, 93, 0.4) 60%, transparent 100%)',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: '100%'
    },
    textContainer: {
        color: 'white'
    },
    title: {
        fontSize: '2rem',
        fontWeight: '900',
        margin: 0,
        letterSpacing: '1px'
    },
    subtitle: {
        fontSize: '1rem',
        color: 'var(--decoud-gold)',
        fontWeight: '700',
        textTransform: 'uppercase',
        margin: '5px 0'
    },
    description: {
        fontSize: '0.9rem',
        opacity: 0,
        maxHeight: 0,
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        lineHeight: '1.4'
    },
    btn: {
        display: 'inline-block',
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: 'var(--decoud-gold)',
        color: 'var(--decoud-blue)',
        borderRadius: '50px',
        fontWeight: 'bold',
        fontSize: '0.8rem',
        textTransform: 'uppercase'
    }
};

export default HomeSections;
