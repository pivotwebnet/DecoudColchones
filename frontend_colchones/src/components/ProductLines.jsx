// src/components/ProductLines.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLineas } from '../api/api';

const MAX_TILT = 5;

/* Tarjeta individual con tilt 3D + brillo */
const LineCard = ({ line }) => {
    const cardRef  = useRef(null);
    const shineRef = useRef(null);

    const handleMove = (e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotY =  ((x / rect.width)  - 0.5) * MAX_TILT * 2;
        const rotX = -((y / rect.height) - 0.5) * MAX_TILT * 2;
        card.style.transition = 'transform 0.1s linear, box-shadow 0.1s linear';
        card.style.transform  = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
        card.style.boxShadow  = '0 18px 36px rgba(27,54,93,0.16)';
        if (shineRef.current) {
            shineRef.current.style.opacity = '1';
            shineRef.current.style.background =
                `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255,255,255,0.15) 0%, transparent 65%)`;
        }
    };

    const handleLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s ease';
        card.style.transform  = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        card.style.boxShadow  = '0 10px 20px rgba(0,0,0,0.08)';
        if (shineRef.current) shineRef.current.style.opacity = '0';
    };

    return (
        <div
            ref={cardRef}
            style={{ ...styles.itemCard, willChange: 'transform' }}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
        >
            <div style={styles.imageWrapper}>
                {/* Brillo dinámico */}
                <div ref={shineRef} style={styles.shine} />

                {line.image ? (
                    <img
                        src={line.image}
                        alt={line.name}
                        style={styles.image}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                ) : (
                    <div style={{ ...styles.image, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', background: 'var(--border-color)',
                        color: 'var(--color-text-dark)' }}>
                        Sin Imagen
                    </div>
                )}
            </div>

            <Link to={line.link} className="line-pill-btn">
                {line.name}
            </Link>
        </div>
    );
};

/* ─────────────────────────────────────── */

const ProductLines = () => {
    const [lines, setLines]     = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchLines = async () => {
            try {
                const data = await getLineas();
                setLines(data.map(line => ({
                    id:    line.id,
                    name:  line.nombre,
                    image: line.imagen_url,
                    link:  `/colchones?linea=${line.slug}`
                })));
            } catch (err) {
                console.error('Error cargando líneas:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLines();
    }, []);

    const scroll = (dir) => {
        scrollRef.current?.scrollBy({ left: dir === 'left' ? -420 : 420, behavior: 'smooth' });
    };

    if (!loading && lines.length === 0) return null;

    return (
        <div style={{ width: '100%', backgroundColor: 'var(--content-bg)', padding: 'clamp(30px, 5vw, 60px) 0', transition: 'background-color 0.3s ease' }}>

            <div style={{ textAlign: 'center', marginBottom: 'clamp(25px, 4vw, 50px)' }}>
                <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', color: 'var(--decoud-blue)', fontWeight: '800',
                    margin: 0, letterSpacing: '-1px', transition: 'color 0.3s ease' }}>
                    Nuestras Líneas
                </h2>
                <div style={{ width: '80px', height: '4px', backgroundColor: '#ffd700',
                    margin: '15px auto 0', borderRadius: '2px' }} />
            </div>

            <div style={styles.sliderContainer}>
                {lines.length > 3 && (
                    <button onClick={() => scroll('left')} style={styles.arrowBtn}>←</button>
                )}

                <div ref={scrollRef} style={styles.scrollArea}>
                    {loading ? (
                        <p style={{ color: 'var(--color-text-dark)' }}>Cargando líneas...</p>
                    ) : (
                        lines.map(line => <LineCard key={line.id} line={line} />)
                    )}
                </div>

                {lines.length > 3 && (
                    <button onClick={() => scroll('right')} style={styles.arrowBtn}>→</button>
                )}
            </div>

            <style>{`
                /* Pill button con shimmer y hover */
                .line-pill-btn {
                    text-decoration: none;
                    border: 2px solid var(--decoud-blue);
                    border-radius: 50px;
                    padding: 10px 30px;
                    color: var(--decoud-blue);
                    font-size: 0.9rem;
                    font-weight: 700;
                    background-color: var(--content-bg);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    position: relative;
                    overflow: hidden;
                    display: inline-block;
                    transition: background-color 0.3s ease, color 0.3s ease,
                                transform 0.3s ease, box-shadow 0.3s ease;
                }
                .line-pill-btn::after {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%;
                    width: 60%; height: 100%;
                    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
                    transform: skewX(-15deg);
                    transition: left 0.45s ease;
                    pointer-events: none;
                }
                .line-pill-btn:hover::after { left: 160%; }
                .line-pill-btn:hover {
                    background-color: var(--decoud-blue);
                    color: white;
                    transform: translateY(-3px);
                    box-shadow: 0 6px 16px rgba(27,54,93,0.3);
                }
                .line-pill-btn:active { transform: translateY(-1px); }

                /* Ocultar scrollbar */
                div::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
};

const styles = {
    sliderContainer: {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px',
        maxWidth: '1400px', margin: '0 auto', padding: '0 20px', position: 'relative'
    },
    arrowBtn: {
        backgroundColor: 'var(--content-bg)', border: '1px solid var(--border-color)',
        cursor: 'pointer', width: '50px', height: '50px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', zIndex: 2,
        color: 'var(--color-text-dark)', transition: 'all 0.3s ease', flexShrink: 0
    },
    scrollArea: {
        display: 'flex', gap: '30px', overflowX: 'auto', scrollBehavior: 'smooth',
        padding: '20px 5px', scrollbarWidth: 'none', width: '100%'
    },
    itemCard: {
        minWidth: 'clamp(180px, 40vw, 350px)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '20px',
        borderRadius: '12px',
    },
    imageWrapper: {
        width: '100%', height: 'clamp(180px, 30vw, 350px)', borderRadius: '12px', overflow: 'hidden',
        boxShadow: '0 10px 20px rgba(0,0,0,0.08)', backgroundColor: 'var(--border-color)',
        transition: 'background-color 0.3s ease', position: 'relative'
    },
    shine: {
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: 0, transition: 'opacity 0.4s ease', zIndex: 2
    },
    image: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' },
};

export default ProductLines;
