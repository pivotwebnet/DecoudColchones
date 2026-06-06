import React, { useState } from 'react';

const testimonials = [
    {
        name: 'Martina G.',
        city: 'Rafaela',
        stars: 5,
        text: 'Compramos el colchón de dos plazas y quedamos encantados. La entrega fue rapidísima y el asesoramiento fue excelente. ¡Lo recomiendo sin dudarlo!',
        product: 'Colchón 2 Plazas',
    },
    {
        name: 'Carlos R.',
        city: 'Santa Fe',
        stars: 5,
        text: 'Llevamos años comprando en Decoud. La calidad es siempre la misma: muy buena. El colchón que compramos para el cuarto de mi hijo dura hace 6 años sin problemas.',
        product: 'Colchón 1 Plaza',
    },
    {
        name: 'Luciana M.',
        city: 'Sunchales',
        stars: 5,
        text: 'Me ayudaron a elegir el tamaño correcto para mi habitación. El equipo conoce muy bien sus productos. Muy buena atención desde el primer mensaje por WhatsApp.',
        product: 'Colchón Queen',
    },
    {
        name: 'Diego F.',
        city: 'Esperanza',
        stars: 5,
        text: 'Excelente relación precio-calidad. Nos coordinaron la entrega sin problema a domicilio. El colchón llegó en perfecto estado y muy bien embalado.',
        product: 'Colchón 2 Plazas',
    },
    {
        name: 'Sofía B.',
        city: 'Rafaela',
        stars: 5,
        text: 'Hace años que les compro y siempre salgo contenta. Esta vez pedí el colchón 1½ plaza y cumple con todo lo que esperaba. Son fabricantes de verdad.',
        product: 'Colchón 1½ Plaza',
    },
    {
        name: 'Andrés V.',
        city: 'Reconquista',
        stars: 5,
        text: 'El envío llegó a tiempo y el colchón es de muy buena calidad. Dormimos mucho mejor desde que lo cambiamos. Definitivamente volvería a comprar.',
        product: 'Colchón King',
    },
];

const Stars = ({ count }) => (
    <div style={{ display: 'flex', gap: '2px' }}>
        {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 24 24"
                fill={i < count ? '#D4AF37' : 'none'}
                stroke={i < count ? '#D4AF37' : '#cbd5e1'}
                strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ))}
    </div>
);

const Testimonios = () => {
    const [visible, setVisible] = useState(3);

    return (
        <section style={s.section}>
            <div style={s.wrap}>
                {/* Header */}
                <div style={s.header}>
                    <div style={s.badge}>Reseñas de clientes</div>
                    <h2 style={s.title}>Lo que dicen nuestros clientes</h2>
                    <div style={s.titleBar} />
                    <p style={s.sub}>Más de 30 años fabricando colchones. Estos son algunos de nuestros clientes satisfechos.</p>
                </div>

                {/* Grid */}
                <div style={s.grid}>
                    {testimonials.slice(0, visible).map((t, i) => (
                        <div key={i} style={s.card}>
                            {/* Comillas decorativas */}
                            <div style={s.quote}>"</div>

                            <p style={s.text}>{t.text}</p>

                            <div style={s.productTag}>{t.product}</div>

                            <div style={s.footer}>
                                <div style={s.avatar}>
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <div style={s.name}>{t.name}</div>
                                    <div style={s.city}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                            style={{ marginRight: '3px', verticalAlign: 'middle' }}>
                                            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        {t.city}
                                    </div>
                                </div>
                                <div style={{ marginLeft: 'auto' }}>
                                    <Stars count={t.stars} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Ver más */}
                {visible < testimonials.length && (
                    <div style={{ textAlign: 'center', marginTop: '32px' }}>
                        <button style={s.verMasBtn} onClick={() => setVisible(testimonials.length)}>
                            Ver más reseñas
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

const s = {
    section: {
        backgroundColor: 'var(--bg-color)',
        padding: 'clamp(48px, 7vw, 80px) 20px',
        transition: 'background-color 0.3s ease',
    },
    wrap: {
        maxWidth: '1100px',
        margin: '0 auto',
    },
    header: {
        textAlign: 'center',
        marginBottom: '48px',
    },
    badge: {
        display: 'inline-block',
        backgroundColor: 'rgba(212,175,55,0.12)',
        color: '#b3922a',
        border: '1px solid rgba(212,175,55,0.3)',
        borderRadius: '100px',
        padding: '4px 14px',
        fontSize: '0.75rem',
        fontWeight: '700',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: '14px',
    },
    title: {
        color: 'var(--decoud-blue)',
        fontSize: 'clamp(1.4rem, 4vw, 2rem)',
        fontWeight: '800',
        margin: '0 0 10px',
        transition: 'color 0.3s ease',
    },
    titleBar: {
        width: '56px',
        height: '4px',
        backgroundColor: '#D4AF37',
        borderRadius: '2px',
        margin: '0 auto 16px',
    },
    sub: {
        color: '#64748b',
        fontSize: '0.95rem',
        maxWidth: '520px',
        margin: '0 auto',
        lineHeight: 1.6,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: 'var(--content-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        transition: 'border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.25s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    quote: {
        position: 'absolute',
        top: '16px',
        right: '20px',
        fontSize: '4rem',
        lineHeight: 1,
        color: 'rgba(212,175,55,0.18)',
        fontFamily: 'Georgia, serif',
        fontWeight: '900',
        userSelect: 'none',
    },
    text: {
        color: 'var(--color-text-dark)',
        fontSize: '0.92rem',
        lineHeight: 1.65,
        margin: 0,
        flex: 1,
        opacity: 0.88,
        transition: 'color 0.3s ease',
    },
    productTag: {
        display: 'inline-block',
        backgroundColor: 'rgba(27,54,93,0.08)',
        color: 'var(--decoud-blue)',
        borderRadius: '6px',
        padding: '3px 10px',
        fontSize: '0.75rem',
        fontWeight: '700',
        alignSelf: 'flex-start',
        transition: 'color 0.3s ease',
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-color)',
        transition: 'border-color 0.3s ease',
    },
    avatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: '#1B365D',
        color: '#FEFAF4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '800',
        fontSize: '0.9rem',
        flexShrink: 0,
    },
    name: {
        fontWeight: '700',
        fontSize: '0.88rem',
        color: 'var(--color-text-dark)',
        transition: 'color 0.3s ease',
    },
    city: {
        fontSize: '0.75rem',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
    },
    verMasBtn: {
        backgroundColor: 'transparent',
        border: '2px solid var(--decoud-blue)',
        color: 'var(--decoud-blue)',
        padding: '10px 28px',
        borderRadius: '8px',
        fontWeight: '700',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
};

export default Testimonios;
