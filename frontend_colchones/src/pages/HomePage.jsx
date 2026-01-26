// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import ColchonCard from '../components/ColchonCard'; // <--- Importamos la tarjeta
import { getProductos } from '../api/api'; // <--- Importamos la API
import CategoryCards from '../components/CategoryCards';
import ProductLines from '../components/ProductLines';


const HomePage = () => {
    const [latestProducts, setLatestProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewest = async () => {
            try {
                const data = await getProductos();
                // Lógica para "Lo Nuevo":
                // Tomamos los últimos 4 productos del array (asumiendo que los últimos agregados están al final)
                // Y los invertimos para que el más nuevo quede primero a la izquierda.
                const newest = data.slice(-4).reverse();
                setLatestProducts(newest);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando productos destacados:", error);
                setLoading(false);
            }
        };
        fetchNewest();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            
            {/* 1. Carrusel Full Width */}
            <section style={{ width: '100%', padding: 0 }}>
                <ImageCarousel />
            </section>

            {/* 2. NUEVO: TARJETAS DE CATEGORÍA AZULES */}
            <section style={{ marginTop: '20px', position: 'relative', zIndex: 10 }}> 
                {/* El margen negativo hace que se "monte" un poquito sobre el carrusel si quisieras, 
                    o déjalo en '20px' para separar normal. Probemos '40px' normal. */}
                
                <div style={{ marginTop: '40px' }}>
                     <CategoryCards />
                </div>
            </section>
           
            
{/* --- AGREGAR AQUÍ LA NUEVA SECCIÓN --- */}
<section style={{ width: '100%', marginTop: '60px' }}>
    <ProductLines />
</section>
{/* ------------------------------------- */}

<section className="container-centered" style={{ marginTop: '60px', marginBottom: '20px' }}></section>
            {/* 2. SECCIÓN: LO NUEVO (Agregada) */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ 
                        fontSize: '2.5rem', 
                        color: '#e6e1e1ff', 
                        marginBottom: '10px',
                        fontWeight: 'bold'
                    }}>
                        ¡Lo Nuevo!
                    </h2>
                    <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--color-accent)', margin: '0 auto' }}></div>
                </div>
            <section className="container-centered" style={{ marginTop: '50px', marginBottom: '20px' }}>
                {loading ? (
                    <p style={{ textAlign: 'center' }}>Cargando novedades...</p>
                ) : (
                    <div style={styles.productsGrid}>
                        {latestProducts.map(product => (
                            <ColchonCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* 3. Banner de Bienvenida / Características */}
            <section className="container-centered content-area" style={{ marginTop: '40px', marginBottom: '60px' }}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '10px' }}>
                        Bienvenido a Decoud Colchones
                    </h2>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '30px 0' }}>
                        <Link to="/colchones" className="btn-primary">Ver Catálogo Completo</Link>
                    </div>

                    <div style={styles.featureGrid}>
                        <div style={styles.featureItem}>
                            <h4 style={styles.featTitle}>Calidad</h4>
                            <p style={{ color: '#666' }}>Materiales de primera línea.</p>
                        </div>
                        <div style={styles.featureItem}>
                            <h4 style={styles.featTitle}>Envíos</h4>
                            <p style={{ color: '#666' }}>A todo Santa Fe.</p>
                        </div>
                        <div style={styles.featureItem}>
                            <h4 style={styles.featTitle}>Garantía</h4>
                            <p style={{ color: '#666' }}>Confianza asegurada.</p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

const styles = {
    // Grilla para los productos (Responsiva)
    productsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
        width: '100%',
    },
    // Estilos de la sección de características
    featureGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '30px',
        marginTop: '40px'
    },
    featureItem: {
        textAlign: 'center',
        padding: '10px'
    },
    featTitle: {
        fontSize: '1.2rem',
        marginBottom: '10px',
        color: 'var(--color-accent)'
    }
};

export default HomePage;