// src/components/ColchonCard.jsx (VERSION MEJORADA)

import React from 'react';
import { Link } from 'react-router-dom';

const ColchonCard = ({ product }) => {
    // Cálculo del precio mínimo y máximo (ya maneja la lógica de variantes)
    const prices = product.variantes.map(v => parseFloat(v.precio)).filter(p => p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices).toFixed(2) : 'Consultar';
    const maxPrice = prices.length > 0 ? Math.max(...prices).toFixed(2) : minPrice;

    // Obtener las especificaciones clave de la línea
    const composicion = product.categoria_nombre || 'Espuma / Resortes';
    const soporte = `${product.peso_max_min}kg - ${product.peso_max_max}kg`;
    const densidad = `${product.densidad} kg/m³`;

    return (
        <div style={styles.card}>
            {/* Espacio para la Imagen (Placeholder) */}
            <div style={styles.imagePlaceholder}>
                <p>IMAGEN DEL COLCHÓN</p>
            </div>
            
            {/* Nombre y Línea */}
            <div style={styles.content}>
                <h3 style={styles.title}>{product.nombre}</h3>
                <p style={styles.linea}>{composicion}</p>
                <hr style={styles.divider} />
                
                {/* Especificaciones Técnicas como Íconos/Tags */}
                <div style={styles.specs}>
                    <div style={styles.specItem}>
                        <span style={styles.specLabel}>Soporte:</span>
                        <span style={styles.specValue}>{soporte}</span>
                    </div>
                    <div style={styles.specItem}>
                        <span style={styles.specLabel}>Densidad:</span>
                        <span style={styles.specValue}>{densidad}</span>
                    </div>
                </div>

                {/* Sección de Precio Destacada */}
                <div style={styles.priceContainer}>
                    {minPrice !== maxPrice && (
                         <p style={styles.priceLabel}>Desde:</p>
                    )}
                    <p style={styles.priceValue}>
                        ${minPrice}
                    </p>
                </div>

                {/* Botón de Acción */}
                <Link to={`/colchones/${product.slug}`} style={styles.button}>
                    Ver Opciones y Variantes
                </Link>
            </div>
        </div>
    );
};

const styles = {
    card: {
        border: '1px solid #e0e0e0',
        margin: '15px',
        width: '320px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'transform 0.3s',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    imagePlaceholder: {
        height: '180px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '14px',
        color: '#888',
    },
    content: {
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    },
    title: {
        fontSize: '1.5em',
        fontWeight: 'bold',
        marginBottom: '5px',
        color: '#333',
    },
    linea: {
        fontSize: '0.9em',
        color: '#5a5a5a',
        marginBottom: '10px',
    },
    divider: {
        border: '0',
        height: '1px',
        backgroundColor: '#eee',
        margin: '10px 0',
    },
    specs: {
        marginBottom: '15px',
    },
    specItem: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.9em',
        marginBottom: '3px',
    },
    specLabel: {
        fontWeight: 'normal',
        color: '#777',
    },
    specValue: {
        fontWeight: 'bold',
        color: '#333',
    },
    priceContainer: {
        marginTop: 'auto',
        textAlign: 'center',
        padding: '10px 0',
    },
    priceLabel: {
        fontSize: '0.8em',
        color: '#999',
        margin: 0,
    },
    priceValue: {
        fontSize: '2.2em',
        fontWeight: 'bolder',
        color: '#007bff', // Color de descuento/atención
        margin: '0',
    },
    button: {
        display: 'block',
        textDecoration: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center',
        marginTop: '15px',
        fontWeight: 'bold',
    }
};

export default ColchonCard;