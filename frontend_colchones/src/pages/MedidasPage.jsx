import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const sizes = [
    {
        id: '1_plaza',
        label: '1 Plaza',
        width: 90,
        height: 190,
        color: '#e0e7ff',
        border: '#818cf8',
        ideal: 'Uso individual',
        room: 'Habitaciones pequeñas',
        desc: 'Ideal para niños, adolescentes o adultos que duermen solos. Ocupa poco espacio y es perfecta para cuartos de huéspedes.',
        tips: ['90 × 190 cm', 'Cuarto individual', 'Niños y adolescentes'],
    },
    {
        id: '1_y_media',
        label: '1½ Plaza',
        width: 105,
        height: 190,
        color: '#fef9c3',
        border: '#ca8a04',
        ideal: 'Individual confort',
        room: 'Habitaciones medianas',
        desc: 'Más espacio que la 1 plaza sin llegar a ser doble. Muy elegida por adultos que duermen solos y quieren mayor comodidad.',
        tips: ['105 × 190 cm', 'Adulto solo', 'Mayor espacio'],
    },
    {
        id: '2_plazas',
        label: '2 Plazas',
        width: 140,
        height: 190,
        color: '#dcfce7',
        border: '#16a34a',
        ideal: 'Pareja estándar',
        room: 'Habitaciones medianas/grandes',
        desc: 'La medida más vendida para parejas. Brinda buen espacio para dos personas y entra bien en la mayoría de los dormitorios.',
        tips: ['140 × 190 cm', 'Pareja', 'La más popular'],
        popular: true,
    },
    {
        id: 'queen',
        label: 'Queen',
        width: 160,
        height: 200,
        color: '#fce7f3',
        border: '#db2777',
        ideal: 'Pareja premium',
        room: 'Habitaciones amplias',
        desc: 'Mayor amplitud para parejas que buscan confort superior. 20 cm más ancha que la 2 plazas para moverse con libertad durante la noche.',
        tips: ['160 × 200 cm', 'Pareja confort', '+20 cm de ancho'],
    },
    {
        id: 'king',
        label: 'King',
        width: 180,
        height: 200,
        color: '#ffe4e6',
        border: '#e11d48',
        ideal: 'Máximo confort',
        room: 'Habitaciones grandes',
        desc: 'El máximo en espacio y confort. Perfecta para parejas que quieren el mayor descanso posible o para habitaciones master amplias.',
        tips: ['180 × 200 cm', 'Suite / Master', 'Máximo espacio'],
    },
];

const BASE_H = 220;
const MAX_CM_H = 200;
const MAX_CM_W = 180;
const SCALE = BASE_H / MAX_CM_H;

const MedidasPage = () => {
    const [active, setActive] = useState('2_plazas');
    const selected = sizes.find(s => s.id === active);

    return (
        <div style={s.page}>

            {/* ── HERO ── */}
            <div style={s.hero}>
                <div style={s.heroBadge}>Guía de compra</div>
                <h1 style={s.heroTitle}>Guía de Medidas</h1>
                <p style={s.heroSub}>
                    Elegí el tamaño correcto para tu dormitorio y tu forma de dormir.
                </p>
            </div>

            {/* ── COMPARATIVA VISUAL ── */}
            <div style={s.section}>
                <h2 style={s.sectionTitle}>Comparativa de tamaños</h2>
                <p style={s.sectionSub}>Hacé clic en cada medida para ver los detalles</p>

                <div style={s.visualWrap}>
                    {/* Siluetas */}
                    <div style={s.visualRow}>
                        {sizes.map(size => {
                            const w = Math.round(size.width * SCALE * 1.1);
                            const h = Math.round(size.height * SCALE);
                            const isActive = active === size.id;
                            return (
                                <button
                                    key={size.id}
                                    onClick={() => setActive(size.id)}
                                    style={{
                                        ...s.sizeBtn,
                                        width: `${w}px`,
                                        height: `${h}px`,
                                        backgroundColor: isActive ? size.color : 'var(--border-color)',
                                        borderColor: isActive ? size.border : 'var(--border-color)',
                                        boxShadow: isActive ? `0 0 0 3px ${size.border}40, 0 8px 24px rgba(0,0,0,0.12)` : 'none',
                                        transform: isActive ? 'translateY(-6px)' : 'none',
                                    }}
                                >
                                    <span style={{ ...s.sizeBtnLabel, color: isActive ? size.border : 'var(--color-text-dark)', fontWeight: isActive ? '800' : '600' }}>
                                        {size.label}
                                    </span>
                                    <span style={{ ...s.sizeBtnDims, color: isActive ? size.border : '#94a3b8' }}>
                                        {size.width}×{size.height}
                                    </span>
                                    {size.popular && (
                                        <span style={s.popularBadge}>
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle', marginTop: '-2px' }}>
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                            Más vendido
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Panel de info del seleccionado */}
                    {selected && (
                        <div style={{ ...s.infoPanel, borderColor: selected.border, backgroundColor: selected.color }}>
                            <div style={s.infoPanelGrid}>
                                <div>
                                    <div style={s.infoPanelLabel}>Medida</div>
                                    <div style={{ ...s.infoPanelValue, color: selected.border }}>
                                        {selected.width} × {selected.height} cm
                                    </div>
                                </div>
                                <div>
                                    <div style={s.infoPanelLabel}>Ideal para</div>
                                    <div style={s.infoPanelValue}>{selected.ideal}</div>
                                </div>
                                <div>
                                    <div style={s.infoPanelLabel}>Habitación</div>
                                    <div style={s.infoPanelValue}>{selected.room}</div>
                                </div>
                            </div>
                            <p style={s.infoPanelDesc}>{selected.desc}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── TABLA COMPLETA ── */}
            <div style={{ ...s.section, backgroundColor: 'var(--content-bg)' }}>
                <div style={s.tableWrap}>
                    <h2 style={s.sectionTitle}>Tabla de medidas</h2>
                    <div style={s.table}>
                        <div style={s.tableHeader}>
                            <span>Tamaño</span>
                            <span>Ancho</span>
                            <span>Largo</span>
                            <span>Ideal para</span>
                        </div>
                        {sizes.map(size => (
                            <div
                                key={size.id}
                                style={{
                                    ...s.tableRow,
                                    backgroundColor: active === size.id ? size.color : 'transparent',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setActive(size.id)}
                            >
                                <span style={{ fontWeight: '700', color: 'var(--decoud-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: size.border, flexShrink: 0, display: 'inline-block' }} />
                                    {size.label}
                                    {size.popular && <span style={s.popularBadgeInline}>Popular</span>}
                                </span>
                                <span style={s.tableCellVal}>{size.width} cm</span>
                                <span style={s.tableCellVal}>{size.height} cm</span>
                                <span style={{ ...s.tableCellVal, color: '#64748b' }}>{size.ideal}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── TIPS ── */}
            <div style={s.section}>
                <div style={s.tipsWrap}>
                    <h2 style={s.sectionTitle}>¿Cómo elegir tu colchón?</h2>
                    <div style={s.tipsGrid}>
                        {[
                            { 
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="8" x="2" y="8" rx="2" />
                                        <path d="M6 12v4" />
                                        <path d="M10 12v4" />
                                        <path d="M14 12v4" />
                                        <path d="M18 12v4" />
                                    </svg>
                                ), 
                                title: 'Medí tu habitación', 
                                text: 'Dejá al menos 60 cm libres a los costados y al pie de la cama para circular cómodamente.' 
                            },
                            { 
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                ), 
                                title: 'Pensá quién lo usa', 
                                text: 'Una persona: 1 plaza o 1½. Pareja: 2 plazas como mínimo. Para mayor confort, Queen o King.' 
                            },
                            { 
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m8 18 4 4 4-4" />
                                        <path d="M12 2v20" />
                                        <path d="m16 6-4-4-4 4" />
                                    </svg>
                                ), 
                                title: 'Considerá el largo', 
                                text: 'Si medís más de 1,80 m, optá por modelos de 200 cm de largo (Queen o King).' 
                            },
                            { 
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                                        <path d="M9 18h6" />
                                        <path d="M10 22h4" />
                                    </svg>
                                ), 
                                title: '¿Dudas?', 
                                text: 'Escribinos por WhatsApp. Te asesoramos para encontrar el colchón ideal según tu dormitorio.' 
                            },
                        ].map((tip, i) => (
                            <div key={i} style={s.tipCard}>
                                <span style={s.tipIcon}>{tip.icon}</span>
                                <h3 style={s.tipTitle}>{tip.title}</h3>
                                <p style={s.tipText}>{tip.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── CTA ── */}
            <div style={s.ctaSection}>
                <p style={s.ctaTitle}>¿Ya sabés qué medida necesitás?</p>
                <p style={s.ctaSub}>Explorá nuestro catálogo y encontrá el colchón perfecto.</p>
                <Link to="/colchones" style={s.ctaBtn}>Ver catálogo completo</Link>
            </div>
        </div>
    );
};

const s = {
    page: {
        backgroundColor: 'var(--bg-color)',
        minHeight: '100vh',
        transition: 'background-color 0.3s ease',
    },

    /* Hero */
    hero: {
        background: 'linear-gradient(135deg, #1B365D 0%, #0F213A 100%)',
        padding: 'clamp(48px, 8vw, 80px) 20px clamp(40px, 6vw, 64px)',
        textAlign: 'center',
    },
    heroBadge: {
        display: 'inline-block',
        backgroundColor: 'rgba(212,175,55,0.18)',
        color: '#D4AF37',
        border: '1px solid rgba(212,175,55,0.4)',
        borderRadius: '100px',
        padding: '4px 16px',
        fontSize: '0.78rem',
        fontWeight: '700',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: '18px',
    },
    heroTitle: {
        color: '#FEFAF4',
        fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
        fontWeight: '800',
        margin: '0 0 12px',
    },
    heroSub: {
        color: 'rgba(254,250,244,0.72)',
        fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
        margin: 0,
    },

    /* Sections */
    section: {
        padding: 'clamp(40px, 6vw, 72px) 20px',
        transition: 'background-color 0.3s ease',
    },
    sectionTitle: {
        textAlign: 'center',
        color: 'var(--decoud-blue)',
        fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
        fontWeight: '800',
        margin: '0 0 8px',
        transition: 'color 0.3s ease',
    },
    sectionSub: {
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '0.9rem',
        margin: '0 0 36px',
    },

    /* Visual comparativa */
    visualWrap: {
        maxWidth: '900px',
        margin: '0 auto',
    },
    visualRow: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '28px',
        flexWrap: 'wrap',
        minHeight: `${BASE_H + 20}px`,
    },
    sizeBtn: {
        border: '2px solid',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        transition: 'all 0.25s ease',
        position: 'relative',
        padding: '8px 4px',
        minWidth: '70px',
    },
    sizeBtnLabel: {
        fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
        transition: 'color 0.2s ease',
    },
    sizeBtnDims: {
        fontSize: '0.68rem',
        transition: 'color 0.2s ease',
    },
    popularBadge: {
        position: 'absolute',
        top: '-22px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#D4AF37',
        color: '#1B365D',
        fontSize: '0.6rem',
        fontWeight: '800',
        padding: '2px 8px',
        borderRadius: '100px',
        whiteSpace: 'nowrap',
    },

    /* Info panel */
    infoPanel: {
        border: '2px solid',
        borderRadius: '12px',
        padding: '20px 24px',
        transition: 'all 0.3s ease',
    },
    infoPanelGrid: {
        display: 'flex',
        gap: '32px',
        flexWrap: 'wrap',
        marginBottom: '12px',
    },
    infoPanelLabel: {
        fontSize: '0.72rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: '#64748b',
        marginBottom: '4px',
    },
    infoPanelValue: {
        fontSize: '1rem',
        fontWeight: '800',
        color: 'var(--color-text-dark)',
    },
    infoPanelDesc: {
        margin: 0,
        fontSize: '0.9rem',
        color: '#475569',
        lineHeight: 1.6,
    },

    /* Tabla */
    tableWrap: {
        maxWidth: '700px',
        margin: '0 auto',
    },
    table: {
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        marginTop: '24px',
    },
    tableHeader: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 2fr',
        padding: '12px 20px',
        backgroundColor: 'var(--decoud-blue)',
        color: '#FEFAF4',
        fontSize: '0.78rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        gap: '8px',
    },
    tableRow: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 2fr',
        padding: '13px 20px',
        borderBottom: '1px solid var(--border-color)',
        gap: '8px',
        alignItems: 'center',
        transition: 'background-color 0.2s ease',
    },
    tableCellVal: {
        fontSize: '0.9rem',
        color: 'var(--color-text-dark)',
        fontWeight: '600',
    },
    popularBadgeInline: {
        backgroundColor: '#D4AF37',
        color: '#1B365D',
        fontSize: '0.6rem',
        fontWeight: '800',
        padding: '2px 7px',
        borderRadius: '100px',
    },

    /* Tips */
    tipsWrap: {
        maxWidth: '900px',
        margin: '0 auto',
    },
    tipsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
        marginTop: '28px',
    },
    tipCard: {
        backgroundColor: 'var(--content-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '20px',
        transition: 'all 0.3s ease',
    },
    tipIcon: {
        display: 'flex',
        alignItems: 'center',
        height: '32px',
        marginBottom: '10px',
    },
    tipTitle: {
        color: 'var(--decoud-blue)',
        fontWeight: '700',
        fontSize: '0.95rem',
        margin: '0 0 8px',
        transition: 'color 0.3s ease',
    },
    tipText: {
        color: '#64748b',
        fontSize: '0.85rem',
        lineHeight: 1.6,
        margin: 0,
    },

    /* CTA */
    ctaSection: {
        background: 'linear-gradient(135deg, #1B365D 0%, #0F213A 100%)',
        padding: 'clamp(36px, 6vw, 64px) 20px',
        textAlign: 'center',
    },
    ctaTitle: {
        color: '#FEFAF4',
        fontWeight: '800',
        fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
        margin: '0 0 8px',
    },
    ctaSub: {
        color: 'rgba(254,250,244,0.72)',
        fontSize: '0.95rem',
        margin: '0 0 24px',
    },
    ctaBtn: {
        display: 'inline-block',
        backgroundColor: '#D4AF37',
        color: '#1B365D',
        fontWeight: '700',
        fontSize: '0.95rem',
        padding: '13px 32px',
        borderRadius: '8px',
        textDecoration: 'none',
        transition: 'background-color 0.2s ease',
    },
};

export default MedidasPage;
