// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { getProductos } from '../api/api';

// Componentes
import ImageCarousel from '../components/ImageCarousel'; 
import CategoryCards from '../components/CategoryCards'; // <--- El nuevo carrusel de categorías
import ProductLines from '../components/ProductLines';
import ColchonCard from '../components/ColchonCard';

const HomePage = () => {
    const [latestProducts, setLatestProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewest = async () => {
            try {
                // Traemos productos y mostramos los últimos 4
                const data = await getProductos();
                const newest = data.slice(-4).reverse();
                setLatestProducts(newest);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando productos:", error);
                setLoading(false);
            }
        };
        fetchNewest();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            
            {/* 1. BANNER PRINCIPAL (Carrusel de Imágenes) */}
            <section style={{ width: '100%', padding: 0 }}>
                <ImageCarousel />
            </section>

            {/* 2. CATEGORÍAS DESTACADAS (Nuestro nuevo diseño estilo Netflix) */}
            {/* Quitamos el padding extra para que el carrusel maneje su propio ancho */}
            <section style={{ width: '100%' }}> 
                 <CategoryCards />
            </section>
           
            {/* 3. LÍNEAS DE PRODUCTOS (Logos de marcas) */}
            <section style={{ width: '100%', marginTop: '20px' }}>
                <ProductLines />
            </section>

            {/* 4. ¡LO NUEVO! (Últimos ingresos) */}
            <section className="container-centered" style={{ marginTop: '80px', marginBottom: '80px', padding: '0 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '2.5rem', color: '#1B365D', marginBottom: '10px', fontWeight: 'bold' }}>
                        ¡Lo Nuevo!
                    </h2>
                    {/* Línea decorativa dorada */}
                    <div style={{ width: '60px', height: '4px', backgroundColor: '#D4AF37', margin: '0 auto' }}></div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Cargando novedades...</div>
                ) : (
                    <div style={styles.productsGrid}>
                        {latestProducts.map(product => (
                            <ColchonCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

const styles = {
    productsGrid: {
        display: 'grid',
        // Responsive: se ajusta automáticamente según el ancho
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
        width: '100%',
    }
};

export default HomePage;