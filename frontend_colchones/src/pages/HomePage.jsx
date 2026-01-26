// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { getProductos } from '../api/api';

// Componentes
import ImageCarousel from '../components/ImageCarousel'; // <--- Volvemos al Carrusel
import CategoryCards from '../components/CategoryCards';
import ProductLines from '../components/ProductLines';
import ColchonCard from '../components/ColchonCard';

// Nota: Ya no importamos HeroSection porque querés el carrusel normal.

const HomePage = () => {
    const [latestProducts, setLatestProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar productos para la sección "Lo Nuevo"
    useEffect(() => {
        const fetchNewest = async () => {
            try {
                const data = await getProductos();
                // Tomamos los últimos 4 y los invertimos
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
            
            {/* 1. CARRUSEL DE IMÁGENES (Vuelve el clásico) */}
            <section style={{ width: '100%', padding: 0 }}>
                <ImageCarousel />
            </section>

            {/* 2. TARJETAS DE CATEGORÍA */}
            {/* Le damos un margen arriba para separarlo del carrusel */}
            <section style={{ marginTop: '40px', padding: '0 20px' }}> 
                 <CategoryCards />
            </section>
           
            {/* 3. LÍNEAS DE PRODUCTOS */}
            <section style={{ width: '100%', marginTop: '60px' }}>
                <ProductLines />
            </section>

            {/* 4. SECCIÓN: LO NUEVO */}
            <section className="container-centered" style={{ marginTop: '80px', marginBottom: '80px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ 
                        fontSize: '2.5rem', 
                        color: '#1e3a8a', 
                        marginBottom: '10px',
                        fontWeight: 'bold'
                    }}>
                        ¡Lo Nuevo!
                    </h2>
                    <div style={{ width: '60px', height: '4px', backgroundColor: '#d4af37', margin: '0 auto' }}></div>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center', color: '#666' }}>Cargando novedades...</p>
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
        width: '100%',
    }
};

export default HomePage;