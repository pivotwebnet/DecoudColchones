// src/components/ColchonCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ColchonCard = ({ product }) => {
    // 1. Lógica de precios
    const prices = product.variantes.map(v => parseFloat(v.precio)).filter(p => p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    
    // 2. Formateador de moneda
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(price);
    };

    // 3. SEGURIDAD: Validar que el slug exista para evitar errores de ruta
    const linkTarget = product.slug ? `/colchones/${product.slug}` : '#';

    // Opcional: Avisar en consola si falta el slug para que puedas corregirlo en el admin
    if (!product.slug) {
        console.warn(`⚠️ El producto "${product.nombre}" no tiene SLUG. El enlace no funcionará.`);
    }

    return (
        <Link to={linkTarget} style={styles.cardLink}>
            <div style={styles.card}>
                
                <div style={styles.imageContainer}>
                    <span style={styles.badge}>Envío Gratis</span>
                    <div style={styles.placeholderImage}>
                        {/* 4. MEJORA: Mostrar imagen real si existe, sino el placeholder */}
                        {product.imagen ? (
                            <img 
                                src={product.imagen} 
                                alt={product.nombre} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        ) : (
                            <span style={{ fontSize: '4rem', color: '#d1d5db' }}>
                                {product.nombre.charAt(0)}
                            </span>
                        )}
                    </div>
                </div>

                <div style={styles.content}>
                    <p style={styles.category}>{product.categoria_nombre || 'Colchones'}</p>
                    <h3 style={styles.title}>{product.nombre}</h3>
                    
                    {/* Especificaciones rápidas (con validación por si faltan datos) */}
                    <div style={styles.specs}>
                        {product.densidad && <span>{product.densidad} kg/m³</span>}
                        {product.peso_max_min && <span> • Soporta {product.peso_max_min}kg</span>}
                    </div>

                    <div style={styles.priceContainer}>
                        <p style={styles.priceLabel}>Desde</p>
                        <p style={styles.price}>{formatPrice(minPrice)}</p>
                        <p style={styles.installments}>
                            <span style={{color: 'var(--color-success)', fontWeight: 'bold'}}>12 cuotas</span> sin interés
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
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #eee',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    imageContainer: {
        height: '220px',
        backgroundColor: '#f4f4f5',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden' // Importante para que la imagen no se salga
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
    },
    badge: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: 'var(--color-success)',
        color: 'white',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        padding: '4px 8px',
        borderRadius: '4px',
        textTransform: 'uppercase',
        zIndex: 2, // Asegura que esté sobre la imagen
    },
    content: {
        padding: '20px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    category: {
        fontSize: '0.85rem',
        color: '#6b7280',
        marginBottom: '5px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    title: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: 'var(--color-primary)',
        marginBottom: '10px',
        lineHeight: '1.3',
    },
    specs: {
        fontSize: '0.9rem',
        color: '#555',
        marginBottom: '15px',
    },
    priceContainer: {
        marginTop: 'auto',
    },
    priceLabel: {
        fontSize: '0.8rem',
        color: '#888',
        margin: 0,
    },
    price: {
        fontSize: '1.8rem',
        fontWeight: '800',
        color: '#333',
        margin: '5px 0',
    },
    installments: {
        fontSize: '0.9rem',
        color: '#555',
        marginBottom: '15px',
    },
    button: {
        width: '100%',
        textAlign: 'center',
        padding: '10px',
        fontSize: '0.9rem',
    }
};

export default ColchonCard;