// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { getProductos } from '../api/api';

// Componentes
import ImageCarousel from '../components/ImageCarousel';
import CategoryCards from '../components/CategoryCards';
import ProductLines from '../components/ProductLines';
import ColchonCard from '../components/ColchonCard';
import ColchonCardSkeleton from '../components/ColchonCardSkeleton';
import Testimonios from '../components/Testimonios';
import NuestraHistoria from '../components/NuestraHistoria';

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
            <section className="container-centered" style={{ marginTop: 'clamp(40px, 6vw, 80px)', marginBottom: 'clamp(40px, 6vw, 80px)', padding: '0 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', color: 'var(--decoud-blue)', marginBottom: '10px', fontWeight: 'bold', transition: 'color 0.3s ease' }}>
                        ¡Lo Nuevo!
                    </h2>
                    {/* Línea decorativa dorada */}
                    <div style={{ width: '60px', height: '4px', backgroundColor: '#D4AF37', margin: '0 auto' }}></div>
                </div>

                <div style={styles.productsGrid}>
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => <ColchonCardSkeleton key={i} />)
                        : latestProducts.map(product => <ColchonCard key={product.id} product={product} />)
                    }
                </div>
            </section>

            {/* 5. TESTIMONIOS */}
            <Testimonios />

            {/* 6. NUESTRA HISTORIA */}
            <NuestraHistoria />
        </div>
    );
};

const styles = {
    productsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
        gap: 'clamp(15px, 3vw, 30px)',
        width: '100%',
    }
};

export default HomePage;