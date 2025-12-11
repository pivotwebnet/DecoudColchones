// src/pages/ProductList.jsx

import React, { useState, useEffect } from 'react';
import { getProductos } from '../api/api'; // <--- IMPORTANTE: Usamos getProductos (PLURAL)
import ColchonCard from '../components/ColchonCard';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Aquí llamamos a la API para traer TODOS los productos
                const data = await getProductos(); 
                setProducts(data);
                setLoading(false);
            } catch (err) {
                console.error("Error cargando el catálogo:", err);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '50px' }}>
            
            <div style={styles.pageHeader}>
                <div className="container-centered">
                    <h1 style={styles.headerTitle}>Catálogo de Colchones</h1>
                    <p style={styles.headerSubtitle}>Encuentra el soporte ideal para tu descanso</p>
                </div>
            </div>

            <div className="container-centered" style={styles.mainLayout}>
                
                {/* Sidebar Filtros */}
                <aside style={styles.sidebar}>
                    <div style={styles.filterGroup}>
                        <h4 style={styles.filterTitle}>Categorías</h4>
                        <ul style={styles.filterList}>
                            <li><label><input type="checkbox" /> Espuma</label></li>
                            <li><label><input type="checkbox" /> Resortes</label></li>
                        </ul>
                    </div>
                </aside>

                {/* Grilla de Productos */}
                <main style={{ flex: 1 }}>
                    {loading ? (
                        <p style={{textAlign: 'center', padding: '40px'}}>Cargando productos...</p>
                    ) : (
                        <div style={styles.productGrid}>
                            {products.length > 0 ? (
                                products.map(product => (
                                    <ColchonCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div style={{textAlign: 'center', width: '100%'}}>
                                    <h3>No se encontraron productos.</h3>
                                    <p>Verifica que el backend esté corriendo.</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
};

const styles = {
    pageHeader: {
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '40px 0',
        marginBottom: '30px',
    },
    headerTitle: { fontSize: '2rem', color: 'var(--color-primary)', margin: 0 },
    headerSubtitle: { color: '#6b7280', marginTop: '10px' },
    mainLayout: { display: 'flex', gap: '40px', alignItems: 'flex-start' },
    sidebar: {
        width: '250px', flexShrink: 0, backgroundColor: 'white', padding: '20px',
        borderRadius: '8px', border: '1px solid #e5e7eb', display: 'none'
    },
    filterGroup: { marginBottom: '25px' },
    filterTitle: { fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', color: '#333' },
    filterList: { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', color: '#555' },
    productGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '25px',
        width: '100%'
    },
};

styles.sidebar.display = 'block'; // Hack visual desktop

export default ProductList;