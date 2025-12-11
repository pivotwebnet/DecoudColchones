// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductoBySlug } from '../api/api';
import { useCart } from '../context/CartContext'; 

const ProductDetail = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    
    // Obtenemos la función del carrito
    const { addToCart } = useCart(); 

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductoBySlug(slug);
                setProduct(data);
                
                // Pre-seleccionar la primera variante
                if (data.variantes && data.variantes.length > 0) {
                    setSelectedVariant(data.variantes[0]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar producto:", error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    // Función para manejar el clic
    const handleAddToCart = () => {
        console.log("Botón presionado..."); // Debug en consola

        if (!selectedVariant) {
            alert("Por favor selecciona una medida.");
            return;
        }
        
        try {
            addToCart(product, selectedVariant, quantity);
            alert(`¡Listo! Agregaste ${product.nombre} al carrito.`);
        } catch (error) {
            console.error("Error al agregar:", error);
            alert("Hubo un error al agregar al carrito. Revisa la consola.");
        }
    };

    if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Cargando detalle...</div>;
    if (!product) return <div style={{padding: '50px', textAlign: 'center'}}>Producto no encontrado</div>;

    const price = selectedVariant ? parseFloat(selectedVariant.precio) : 0;
    const installmentValue = (price / 12).toFixed(2);
    const formatPrice = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 0' }}>
            <div className="container-centered">
                
                <div style={styles.breadcrumbs}>
                    <Link to="/" style={styles.breadcrumbLink}>Inicio</Link> 
                    <span style={styles.breadcrumbSeparator}>/</span>
                    <Link to="/colchones" style={styles.breadcrumbLink}>Colchones</Link>
                    <span style={styles.breadcrumbSeparator}>/</span>
                    <span style={{color: '#666'}}>{product.nombre}</span>
                </div>

                <div style={styles.mainGrid}>
                    
                    {/* Galería */}
                    <div style={styles.galleryColumn}>
                        <div style={styles.mainImageContainer}>
                            {product.imagen ? (
                                <img src={product.imagen} alt={product.nombre} style={styles.mainImage} />
                            ) : (
                                <div style={styles.placeholderMain}>
                                    <span style={{fontSize: '5rem', color: '#ccc'}}>{product.nombre.charAt(0)}</span>
                                </div>
                            )}
                            <span style={styles.badge}>Envío Gratis</span>
                        </div>
                    </div>

                    {/* Información */}
                    <div style={styles.infoColumn}>
                        <p style={styles.category}>{product.categoria_nombre || 'Categoría'}</p>
                        <h1 style={styles.title}>{product.nombre}</h1>
                        
                        <div style={styles.priceBlock}>
                            <p style={styles.price}>{formatPrice(price)}</p>
                            <p style={styles.installments}>
                                <span style={{color: 'var(--color-success)', fontWeight: 'bold'}}>12 cuotas sin interés</span> de {formatPrice(installmentValue)}
                            </p>
                        </div>

                        {/* Variantes */}
                        <div style={styles.variantSection}>
                            <p style={styles.variantLabel}>Selecciona una medida:</p>
                            <div style={styles.variantGrid}>
                                {product.variantes.map((variante) => {
                                    const isSelected = selectedVariant?.id === variante.id;
                                    return (
                                        <button
                                            key={variante.id}
                                            onClick={() => setSelectedVariant(variante)}
                                            style={{
                                                ...styles.variantButton,
                                                borderColor: isSelected ? 'var(--color-primary)' : '#ddd',
                                                backgroundColor: isSelected ? '#eff6ff' : 'white',
                                                color: isSelected ? 'var(--color-primary)' : 'black',
                                                fontWeight: isSelected ? 'bold' : 'normal',
                                                boxShadow: isSelected ? '0 0 0 1px var(--color-primary)' : 'none'
                                            }}
                                        >
                                            {variante.medida}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Acciones */}
                        <div style={styles.actionsRow}>
                            <div style={styles.quantitySelector}>
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}>-</button>
                                <span style={styles.qtyValue}>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>+</button>
                            </div>
                            
                            <button 
                                onClick={handleAddToCart} 
                                className="btn-primary" 
                                style={styles.addToCartBtn}
                            >
                                Agregar al Carrito
                            </button>
                        </div>

                        {/* Specs */}
                        <div style={styles.specsContainer}>
                            <h3 style={styles.specsTitle}>Características</h3>
                            <ul style={styles.specsList}>
                                <li><strong>Densidad:</strong> {product.densidad} kg/m³</li>
                                <li><strong>Soporte:</strong> {product.peso_max_min} - {product.peso_max_max} kg</li>
                                <li><strong>Garantía:</strong> 5 Años</li>
                            </ul>
                            <div style={{marginTop: '20px', lineHeight: '1.6', color: '#555'}}>
                                <p>{product.descripcion || "Descripción del producto..."}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    breadcrumbs: { marginBottom: '20px', fontSize: '0.9rem', color: '#888' },
    breadcrumbLink: { textDecoration: 'none', color: '#666' },
    breadcrumbSeparator: { margin: '0 10px' },
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '50px',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    },
    galleryColumn: { display: 'flex', flexDirection: 'column', gap: '20px' },
    mainImageContainer: {
        width: '100%', aspectRatio: '4/3', backgroundColor: '#f4f4f5', borderRadius: '8px',
        position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    mainImage: { width: '100%', height: '100%', objectFit: 'contain' },
    placeholderMain: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    badge: {
        position: 'absolute', top: '15px', left: '15px',
        backgroundColor: 'var(--color-success)', color: 'white',
        padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem'
    },
    infoColumn: { display: 'flex', flexDirection: 'column' },
    category: { textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', color: '#888', marginBottom: '5px' },
    title: { fontSize: '2.5rem', margin: '0 0 15px 0', color: '#1e3a8a', lineHeight: '1.1' },
    priceBlock: { marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' },
    price: { fontSize: '2.5rem', fontWeight: '800', margin: '0', color: '#333' },
    installments: { fontSize: '1.1rem', color: '#555', marginTop: '5px' },
    variantSection: { marginBottom: '30px' },
    variantLabel: { fontWeight: 'bold', marginBottom: '10px', display: 'block' },
    variantGrid: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
    
    // ESTILOS CORREGIDOS para evitar la advertencia de React (mix de border y borderColor)
    variantButton: {
        padding: '10px 20px', 
        borderWidth: '1px', 
        borderStyle: 'solid', 
        borderRadius: '6px', 
        cursor: 'pointer', 
        fontSize: '0.95rem', 
        transition: 'all 0.2s'
    },
    
    actionsRow: { display: 'flex', gap: '20px', marginBottom: '40px', height: '50px' },
    quantitySelector: { display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '6px' },
    qtyBtn: { width: '40px', height: '100%', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' },
    qtyValue: { width: '40px', textAlign: 'center', fontWeight: 'bold' },
    addToCartBtn: { flex: 1, fontSize: '1.1rem' },
    specsContainer: { backgroundColor: '#f9fafb', padding: '25px', borderRadius: '8px' },
    specsTitle: { fontSize: '1.2rem', marginBottom: '15px', color: '#333' },
    specsList: { paddingLeft: '20px', color: '#555', lineHeight: '1.8' }
};

export default ProductDetail;