// src/components/ColchonCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ColchonCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const displayPrice = parseFloat(product.precio) || 0;
    const displayName = product.nombre;
    const secondImage = product.imagenes_extra && product.imagenes_extra.length > 0 
        ? product.imagenes_extra[0].imagen 
        : null;
    
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(price);
    };

    const linkTarget = product.slug ? `/colchones/${product.slug}` : '#';

    return (
        <Link 
            to={linkTarget} 
            style={styles.cardLink}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={styles.card} className="product-card-hover">
                <div style={styles.imageContainer}>
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
                        <p style={styles.price}>{formatPrice(displayPrice)}</p>
                        <p style={styles.installments}>
                            Hasta <span style={{fontWeight: 'bold', color: '#1B365D'}}>{product.cuotas || 12} pagos</span> sin interés
                        </p>
                    </div>

                    <button style={styles.button} className="btn-card-action">Ver Detalles</button>
                </div>
            </div>

            <style>{`
                .product-card-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .product-card-hover:hover { transform: translateY(-8px); box-shadow: 0 12px 30px rgba(0,0,0,0.12) !important; border-color: #1B365D !important; }
                .btn-card-action { background-color: #f1f5f9; color: #1B365D; border: none; padding: 12px; border-radius: 6px; font-weight: 700; width: 100%; transition: all 0.2s; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; font-size: 0.8rem; }
                .product-card-hover:hover .btn-card-action { background-color: #1B365D; color: white; }
            `}</style>
        </Link>
    );
};

const styles = {
    cardLink: { textDecoration: 'none', color: 'inherit', display: 'block' },
    card: { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' },
    imageContainer: { height: '240px', backgroundColor: '#fff', position: 'relative', overflow: 'hidden' },
    imageWrapper: { width: '100%', height: '100%', position: 'relative' },
    productImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.5s ease-in-out' },
    shippingBadge: { position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(255,255,255,0.95)', color: '#059669', fontSize: '0.65rem', fontWeight: '800', padding: '5px 10px', borderRadius: '20px', zIndex: 10, display: 'flex', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', backdropFilter: 'blur(4px)' },
    content: { padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' },
    category: { fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px' },
    title: { fontSize: '1.15rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px', lineHeight: '1.3', minHeight: '2.6em' },
    benefitRow: { display: 'flex', gap: '12px', marginBottom: '15px' },
    benefitItem: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#64748b', fontWeight: '500' },
    priceContainer: { marginTop: 'auto', marginBottom: '15px' },
    price: { fontSize: '1.6rem', fontWeight: '800', color: '#1B365D', margin: 0 },
    installments: { fontSize: '0.85rem', color: '#64748b', marginTop: '4px' },
    button: { marginTop: '5px' }
};

export default ColchonCard;