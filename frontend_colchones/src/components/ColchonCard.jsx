// src/components/ColchonCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ColchonCard = ({ product }) => {
    const displayPrice = parseFloat(product.precio) || 0;
    const displayName = product.nombre;
    
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(price);
    };

    const linkTarget = product.slug ? `/colchones/${product.slug}` : '#';

    return (
        <Link to={linkTarget} style={styles.cardLink}>
            <div style={styles.card}>
                <div style={styles.imageContainer}>
                    <span style={styles.badge}>Envío Gratis</span>
                    <div style={styles.placeholderImage}>
                        {product.imagen ? (
                            <img src={product.imagen} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: '4rem', color: '#d1d5db' }}>{product.nombre.charAt(0)}</span>
                        )}
                    </div>
                </div>

                <div style={styles.content}>
                    <p style={styles.category}>{product.categoria?.nombre || 'Producto'}</p>
                    <h3 style={styles.title}>{displayName}</h3>
                    
                    <div style={styles.specs}>
                        {product.densidad && <span>Densidad {product.densidad}</span>}
                        {product.altura && <span> • Altura {product.altura}cm</span>}
                    </div>

                    <div style={styles.priceContainer}>
                        <p style={styles.price}>{formatPrice(displayPrice)}</p>
                        <p style={styles.installments}>
                            <span style={{color: '#00a650', fontWeight: 'bold'}}>{product.cuotas || 12} cuotas</span> sin interés
                        </p>
                    </div>

                    <button className="btn-primary" style={styles.button}>Ver Detalles</button>
                </div>
            </div>
        </Link>
    );
};

const styles = {
    cardLink: { textDecoration: 'none', color: 'inherit' },
    card: { backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee', transition: 'transform 0.2s', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' },
    imageContainer: { height: '220px', backgroundColor: '#fff', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    placeholderImage: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
    badge: { position: 'absolute', top: '10px', left: '10px', backgroundColor: '#00a650', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', zIndex: 2 },
    content: { padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' },
    category: { fontSize: '0.85rem', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    title: { fontSize: '1.1rem', fontWeight: 'bold', color: '#1B365D', marginBottom: '10px', lineHeight: '1.3', minHeight: '2.6em' },
    specs: { fontSize: '0.9rem', color: '#555', marginBottom: '15px' },
    priceContainer: { marginTop: 'auto' },
    price: { fontSize: '1.8rem', fontWeight: '800', color: '#333', margin: '5px 0' },
    installments: { fontSize: '0.9rem', color: '#555', marginBottom: '15px' },
    button: { width: '100%', textAlign: 'center', padding: '10px', fontSize: '0.9rem', backgroundColor: '#1B365D', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};

export default ColchonCard;