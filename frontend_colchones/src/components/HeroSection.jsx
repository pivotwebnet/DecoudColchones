// src/components/HeroSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
    {
        id: 1,
        title: "Tu descanso merece lo mejor",
        subtitle: "Descubrí la nueva línea Glaciar con tecnología de última generación.",
        cta: "Ver Catálogo",
        link: "/colchones",
        bg: "linear-gradient(rgba(27, 54, 93, 0.7), rgba(27, 54, 93, 0.7)), url('https://images.unsplash.com/photo-1505693419148-ad3b471e4c57?q=80&w=2070&auto=format&fit=crop')"
    },
    {
        id: 2,
        title: "12 Cuotas Sin Interés",
        subtitle: "Llevate hoy el colchón que siempre soñaste y pagalo cómodamente.",
        cta: "Aprovechar Ofertas",
        link: "/colchones?oferta=true",
        bg: "linear-gradient(rgba(212, 175, 55, 0.6), rgba(27, 54, 93, 0.8)), url('https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop')"
    },
    {
        id: 3,
        title: "Envíos Sin Cargo",
        subtitle: "Llegamos a Rafaela y zona con logística propia y entrega inmediata.",
        cta: "Saber Más",
        link: "/preguntas-frecuentes",
        bg: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop')"
    }
];

const HeroSection = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section style={styles.hero}>
            {slides.map((slide, index) => (
                <div key={slide.id} style={{
                    ...styles.slide,
                    backgroundImage: slide.bg,
                    opacity: index === current ? 1 : 0,
                    visibility: index === current ? 'visible' : 'hidden',
                    transform: index === current ? 'scale(1)' : 'scale(1.05)'
                }}>
                    <div className="container-centered" style={styles.content}>
                        <h1 style={styles.title}>{slide.title}</h1>
                        <p style={styles.subtitle}>{slide.subtitle}</p>
                        <div style={styles.btnGroup}>
                            <Link to={slide.link} className="hero-btn-primary">{slide.cta}</Link>
                            <Link to="/colchones" className="hero-btn-outline">Ver Líneas</Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* DOTS */}
            <div style={styles.dots}>
                {slides.map((_, i) => (
                    <button 
                        key={i} 
                        onClick={() => setCurrent(i)}
                        style={{
                            ...styles.dot,
                            backgroundColor: i === current ? '#D4AF37' : 'rgba(255,255,255,0.5)',
                            width: i === current ? '30px' : '10px'
                        }}
                    ></button>
                ))}
            </div>

            <style>{`
                .hero-btn-primary { 
                    background-color: #D4AF37; color: white; padding: 16px 35px; 
                    border-radius: 8px; font-weight: 700; text-decoration: none; 
                    text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem;
                    transition: all 0.3s; border: 2px solid #D4AF37;
                }
                .hero-btn-primary:hover { background-color: transparent; border-color: white; }
                
                .hero-btn-outline { 
                    background-color: transparent; color: white; padding: 16px 35px; 
                    border-radius: 8px; font-weight: 700; text-decoration: none; 
                    text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem;
                    transition: all 0.3s; border: 2px solid rgba(255,255,255,0.5);
                }
                .hero-btn-outline:hover { background-color: white; color: #1B365D; border-color: white; }
            `}</style>
        </section>
    );
};

const styles = {
    hero: { position: 'relative', height: '80vh', minHeight: '550px', width: '100%', overflow: 'hidden', backgroundColor: '#1B365D' },
    slide: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', alignItems: 'center' },
    content: { textAlign: 'left', color: 'white', maxWidth: '700px', padding: '0 20px' },
    title: { fontSize: '3.5rem', fontWeight: '900', marginBottom: '20px', lineHeight: '1.1', textShadow: '0 2px 10px rgba(0,0,0,0.3)' },
    subtitle: { fontSize: '1.2rem', marginBottom: '40px', opacity: 0.9, lineHeight: '1.6' },
    btnGroup: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
    dots: { position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 10 },
    dot: { height: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }
};

export default HeroSection;