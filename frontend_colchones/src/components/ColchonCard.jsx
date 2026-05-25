// src/components/ColchonCard.jsx
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const MAX_TILT = 5;

const ColchonCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef  = useRef(null);
    const shineRef = useRef(null);

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotY =  ((x / rect.width)  - 0.5) * MAX_TILT * 2;
        const rotX = -((y / rect.height) - 0.5) * MAX_TILT * 2;
        card.style.transition = 'transform 0.1s linear, box-shadow 0.1s linear';
        card.style.transform  = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.015,1.015,1.015)`;
        card.style.boxShadow  = '0 12px 28px rgba(27,54,93,0.13)';
        if (shineRef.current) {
            shineRef.current.style.opacity = '1';
            shineRef.current.style.background = `radial-gradient(circle at ${(x/rect.width)*100}% ${(y/rect.height)*100}%, rgba(255,255,255,0.15) 0%, transparent 65%)`;
        }
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s ease';
        card.style.transform  = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        card.style.boxShadow  = '';
        if (shineRef.current) shineRef.current.style.opacity = '0';
        setIsHovered(false);
    };
    
    const displayPrice   = parseFloat(product.precio) || 0;
    const previousPrice  = product.precio_anterior ? parseFloat(product.precio_anterior) : null;
    const hasDiscount    = previousPrice !== null && displayPrice < previousPrice;
    const discountPct    = hasDiscount ? Math.round((1 - displayPrice / previousPrice) * 100) : 0;
    const isDestacado    = product.destacado;
    const isOnSale       = hasDiscount || isDestacado;

    const displayName  = product.nombre;
    const secondImage  = product.imagenes_extra && product.imagenes_extra.length > 0
        ? product.imagenes_extra[0].imagen
        : null;

    const formatPrice = (price) =>
        new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(price);

    const linkTarget = product.slug ? `/colchones/${product.slug}` : '#';

    return (
        <Link
            to={linkTarget}
            style={styles.cardLink}
            onMouseEnter={() => setIsHovered(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div ref={cardRef} style={{...styles.card, border: isOnSale ? '2px solid var(--decoud-gold)' : '1px solid var(--border-color)'}} className="product-card-hover">
                <div style={styles.imageContainer}>
                    {/* Brillo dinámico 3D */}
                    <div ref={shineRef} style={styles.shine} />

                    {/* Badge descuento % */}
                    {hasDiscount && (
                        <div style={styles.discountBadge}>
                            -{discountPct}%
                        </div>
                    )}

                    {/* Badge destacado (cuando no hay descuento numérico) */}
                    {isDestacado && !hasDiscount && (
                        <div style={styles.destacadoBadge}>
                            ★ DESTACADO
                        </div>
                    )}

                    <div style={styles.shippingBadge}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '5px'}}><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                        ENVÍO GRATIS
                    </div>
                    
                    <div style={styles.imageWrapper}>
                        {product.imagen ? (
                            <>
                                <img 
                                    src={product.imagen} 
                                    alt={displayName} 
                                    style={{ 
                                        ...styles.productImg, 
                                        opacity: (isHovered && secondImage) ? 0 : 1 
                                    }} 
                                />
                                {secondImage && (
                                    <img 
                                        src={secondImage} 
                                        alt={`${displayName} detalle`} 
                                        style={{ 
                                            ...styles.productImg, 
                                            position: 'absolute', 
                                            top: 0, 
                                            left: 0, 
                                            opacity: isHovered ? 1 : 0 
                                        }} 
                                    />
                                )}
                            </>
                        ) : (
                            <span style={{ fontSize: '4rem', color: '#d1d5db' }}>{product.nombre.charAt(0)}</span>
                        )}
                    </div>
                </div>

                <div style={styles.content}>
                    <p style={styles.category}>{product.categoria?.nombre || 'Colchones'}</p>
                    <h3 style={styles.title}>{displayName}</h3>
                    
                    <div style={styles.benefitRow}>
                        <div style={styles.benefitItem}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                            <span>{product.cuotas || 12} Cuotas</span>
                        </div>
                        <div style={styles.benefitItem}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            <span>{product.garantia || '1 año'} Gtía.</span>
                        </div>
                    </div>

                    <div style={styles.priceContainer}>
                        {hasDiscount && (
                            <p style={styles.oldPrice}>{formatPrice(previousPrice)}</p>
                        )}
                        <p style={{...styles.price, color: hasDiscount ? '#D4AF37' : 'var(--decoud-blue)'}}>
                            {formatPrice(displayPrice)}
                        </p>
                        {hasDiscount && (
                            <p style={styles.savingLine}>
                                Ahorrás <strong>{formatPrice(previousPrice - displayPrice)}</strong>
                            </p>
                        )}
                        <p style={styles.installments}>
                            Hasta <span style={{fontWeight: 'bold', color: 'var(--decoud-blue)'}}>{product.cuotas || 12} pagos</span> sin interés
                        </p>
                    </div>

                    <button style={styles.button} className="btn-card-action">Ver Detalles</button>
                </div>
            </div>

            <style>{`
                .product-card-hover { transition: border-color 0.3s ease; }
                .product-card-hover:hover { border-color: var(--decoud-blue) !important; }
                .btn-card-action { background-color: var(--border-color); color: var(--decoud-blue); border: none; padding: 12px; border-radius: 6px; font-weight: 700; width: 100%; transition: all 0.3s ease; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; font-size: 0.8rem; }
                .product-card-hover:hover .btn-card-action { background-color: var(--decoud-blue); color: white; }
            `}</style>
        </Link>
    );
};

const styles = {
    cardLink: { textDecoration: 'none', color: 'inherit', display: 'block' },
    card: { backgroundColor: 'var(--content-bg)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', transition: 'background-color 0.3s ease, border-color 0.3s ease', willChange: 'transform' },
    shine: { position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.4s ease', zIndex: 10 },
    imageContainer: { height: 'clamp(160px, 25vw, 240px)', backgroundColor: 'var(--content-bg)', position: 'relative', overflow: 'hidden', transition: 'background-color 0.3s ease' },
    imageWrapper: { width: '100%', height: '100%', position: 'relative' },
    productImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.5s ease-in-out' },
    shippingBadge: { position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(255,255,255,0.95)', color: '#059669', fontSize: '0.65rem', fontWeight: '800', padding: '5px 10px', borderRadius: '20px', zIndex: 10, display: 'flex', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', backdropFilter: 'blur(4px)' },
    content: { padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' },
    category: { fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px' },
    title: { fontSize: '1.15rem', fontWeight: '700', color: 'var(--color-text-dark)', marginBottom: '12px', lineHeight: '1.3', minHeight: '2.6em', transition: 'color 0.3s ease' },
    benefitRow: { display: 'flex', gap: '12px', marginBottom: '15px' },
    benefitItem: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#64748b', fontWeight: '500' },
    priceContainer: { marginTop: 'auto', marginBottom: '15px' },
    price: { fontSize: '1.6rem', fontWeight: '800', margin: 0, transition: 'color 0.3s ease' },
    oldPrice: { fontSize: '0.95rem', color: '#94a3b8', textDecoration: 'line-through', margin: '0 0 2px', fontWeight: '500' },
    savingLine: { fontSize: '0.78rem', color: '#16a34a', fontWeight: '600', margin: '3px 0 0' },
    installments: { fontSize: '0.85rem', color: '#64748b', marginTop: '4px' },
    discountBadge: {
        position: 'absolute', top: '12px', right: '12px', zIndex: 10,
        backgroundColor: '#D4AF37', color: '#1B365D',
        fontSize: '0.75rem', fontWeight: '900', letterSpacing: '0.5px',
        padding: '5px 10px', borderRadius: '20px',
        boxShadow: '0 2px 10px rgba(212,175,55,0.3)',
    },
    destacadoBadge: {
        position: 'absolute', top: '12px', right: '12px', zIndex: 10,
        background: 'linear-gradient(135deg, #D4AF37, #f0c93a)',
        color: '#1B365D',
        fontSize: '0.68rem', fontWeight: '900', letterSpacing: '1px',
        padding: '5px 10px', borderRadius: '20px',
        boxShadow: '0 2px 8px rgba(212,175,55,0.45)',
    },
    button: { marginTop: '5px' }
};

export default ColchonCard;