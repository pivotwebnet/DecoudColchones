// src/pages/ProductList.jsx (VERSION MEJORADA con espacio para Filtros)

import React, { useState, useEffect } from 'react';
import { getProductos } from '../api/api';
import ColchonCard from '../components/ColchonCard';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // (Aquí se integrarían los parámetros de filtro en el futuro)
                const data = await getProductos(); 
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError('No se pudo cargar el listado de colchones. Asegúrate de que el backend esté funcionando en :8000.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div style={listStyles.loading}>Cargando Catálogo de Descanso...</div>;
    if (error) return <div style={listStyles.error}>Error: {error}</div>;

    return (
        <div style={listStyles.container}>
            <h1 style={listStyles.header}>Nuestros Colchones y Líneas</h1>
            
            <div style={listStyles.mainContent}>
                
                {/* Columna Lateral para Filtros (Próximo paso) */}
                <aside style={listStyles.sidebar}>
                    <h3 style={listStyles.sidebarHeader}>🔍 Filtros (Próximamente)</h3>
                    <p>Aquí se añadirán filtros por Densidad, Soporte y Composición.</p>
                </aside>
                
                {/* Columna Principal de Productos */}
                <section style={listStyles.productGrid}>
                    {products.length > 0 ? (
                        products.map(product => (
                            <ColchonCard key={product.id} product={product} /> 
                        ))
                    ) : (
                        <p>No hay líneas de colchones disponibles para mostrar.</p>
                    )}
                </section>
            </div>
        </div>
    );
};

const listStyles = {
    container: { maxWidth: '1400px', margin: '0 auto', padding: '20px' },
    header: { fontSize: '2.5em', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333' },
    mainContent: { display: 'flex', gap: '30px' },
    sidebar: {
        width: '250px',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        height: 'fit-content', // Para que no ocupe todo el alto
    },
    sidebarHeader: { fontSize: '1.2em', marginBottom: '15px', color: '#555' },
    productGrid: {
        flexGrow: 1,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px', // Espacio entre las tarjetas
    },
    loading: { textAlign: 'center', fontSize: '1.5em', padding: '50px' },
    error: { textAlign: 'center', color: 'red', fontSize: '1.2em', padding: '50px' },
};

export default ProductList;