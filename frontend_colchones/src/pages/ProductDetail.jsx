// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getProductoBySlug } from '../api/api'; 
import { useCart } from '../context/CartContext'; 

const ProductDetail = () => {
    const { slug } = useParams();
    
    // Protección por si el contexto falla
    const cartContext = useCart();
    const addToCart = cartContext ? cartContext.addToCart : () => console.error("Error: Contexto no encontrado");

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);

    // Estado para Notificación (Toast)
    const [toast, setToast] = useState({ show: false, type: 'success', msg: '' });

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await getProductoBySlug(slug);
                setProduct(data);
                setMainImage(data.imagen);
                if (data.variantes && data.variantes.length > 0) {
                    setSelectedVariant(data.variantes[0]);
                }
            } catch (error) {
                console.error("Error cargando producto:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    if (loading) return <div style={{padding:'50px', textAlign:'center'}}>Cargando...</div>;
    if (!product) return <div style={{padding:'50px', textAlign:'center'}}>Producto no encontrado.</div>;

    const currentPrice = selectedVariant?.precio ? selectedVariant.precio : product.precio;

    // --- NUEVA LÓGICA DE CUOTAS ---
    // Si el backend no manda nada, usamos 12 por defecto
    const cantidadCuotas = product.cuotas || 12; 
    const valorCuota = currentPrice / cantidadCuotas;

    const galleryImages = [
        { id: 'portada', imagen: product.imagen },
        ...(product.imagenes_extra || []) 
    ];

    const handleAddToCart = (e) => {
        if(e) { e.preventDefault(); e.stopPropagation(); }

        if (!selectedVariant) {
            setToast({ show: true, type: 'error', msg: 'Seleccioná una medida primero' });
            setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
            return;
        }
        
        try {
            addToCart({
                id: selectedVariant.id,
                nombre: `${product.nombre} ${selectedVariant.medida}`,
                precio: currentPrice,
                imagen: product.imagen,
                cantidad: quantity,
                variantData: selectedVariant
            });

            setToast({ show: true, type: 'success', msg: '¡Agregado al carrito!' });
            setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);

        } catch (error) {
            console.error("Error al agregar:", error);
            alert("Hubo un error al agregar el producto.");
        }
    };

    return (
        <div className="product-page-container noselect"> 
            
            {/* TOAST NOTIFICATION */}
            <div className={`toast-notification ${toast.show ? 'show' : ''} ${toast.type === 'error' ? 'error' : ''}`}>
                <div className="toast-content">
                    <span className="check-icon">{toast.type === 'error' ? '⚠️' : '✅'}</span>
                    <div>
                        <p className="toast-title">{toast.msg}</p>
                        {toast.type === 'success' && (
                            <p className="toast-detail">{product.nombre} {selectedVariant?.medida}</p>
                        )}
                    </div>
                </div>
                {toast.type === 'success' && (
                    <Link to="/checkout" className="toast-btn">Ir a Pagar</Link>
                )}
            </div>

            <div className="product-layout">
                {/* GALERÍA */}
                <div className="gallery-section">
                    <div className="main-image-box">
                        <img src={mainImage} alt={product.nombre} draggable="false" />
                    </div>
                    {galleryImages.length > 1 && (
                        <div className="thumbnails-row">
                            {galleryImages.map((img, index) => (
                                <img 
                                    key={img.id || index}
                                    src={img.imagen}
                                    className={`thumb ${mainImage === img.imagen ? 'active' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); setMainImage(img.imagen); }}
                                    alt="thumb"
                                    draggable="false"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* INFO */}
                <div className="info-section">
                    <h1 className="title">{product.nombre}</h1>
                    
                    <div className="price-box">
                        <span className="current-price">${Number(currentPrice).toLocaleString('es-AR')}</span>
                        {product.precio_anterior && (
                            <span className="old-price">${Number(product.precio_anterior).toLocaleString('es-AR')}</span>
                        )}
                    </div>
                    
                    {/* --- AQUÍ SE MUESTRAN LAS CUOTAS DINÁMICAS --- */}
                    <p className="installments">
                        💳 {cantidadCuotas} cuotas sin interés de <b>${Math.round(valorCuota).toLocaleString('es-AR')}</b>
                    </p>

                    {product.variantes && product.variantes.length > 0 && (
                        <div className="variants-selector">
                            <p className="label">Seleccioná una medida:</p>
                            
                            <div className="variants-grid">
                                {product.variantes.map(variant => (
                                    <button
                                        key={variant.id}
                                        type="button"
                                        className={`variant-btn ${selectedVariant?.id === variant.id ? 'selected' : ''}`}
                                        onClick={(e) => { e.preventDefault(); setSelectedVariant(variant); }}
                                    >
                                        {variant.medida}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="actions-row">
                        <div className="qty-selector">
                            <button type="button" onClick={(e) => {e.preventDefault(); setQuantity(q => Math.max(1, q - 1))}}>-</button>
                            <span>{quantity}</span>
                            <button type="button" onClick={(e) => {e.preventDefault(); setQuantity(q => q + 1)}}>+</button>
                        </div>
                        <button 
                            type="button" 
                            className="btn-add" 
                            onClick={handleAddToCart}
                        >
                            AGREGAR AL CARRITO
                        </button>
                    </div>
                </div>
            </div>

            {/* FICHA TÉCNICA */}
            <div className="specs-section">
                <h2 className="section-title">Especificaciones Técnicas</h2>
                <div className="specs-grid">
                    <table className="specs-table">
                        <tbody>
                            {selectedVariant && (
                                <>
                                    <tr><th>Medida</th><td>{selectedVariant.medida}</td></tr>
                                    <tr><th>Altura Real</th><td>{selectedVariant.altura}</td></tr>
                                    <tr><th>Tela / Cubierta</th><td>{selectedVariant.descripcion_cubierta || 'Estándar'}</td></tr>
                                </>
                            )}
                            <tr><th>Densidad</th><td>{product.densidad}</td></tr>
                            <tr><th>Peso Soportado</th><td>{product.peso_max_min}kg a {product.peso_max_max}kg</td></tr>
                            {product.garantia && <tr><th>Garantía</th><td>{product.garantia}</td></tr>}
                        </tbody>
                    </table>

                    <div className="text-description">
                        <h3>Sobre este colchón</h3>
                        <p>{product.descripcion_base}</p>
                    </div>
                </div>
            </div>

            {/* ESTILOS CSS */}
            <style>{`
                .noselect { user-select: none; -webkit-user-select: none; }
                
                .product-page-container {
                    max-width: 1200px; 
                    margin: 0 auto; 
                    /* CAMBIO 1: Aumentamos mucho el espacio arriba */
                    padding: 120px 20px 60px 20px; 
                    font-family: 'Helvetica', sans-serif; 
                    position: relative;
                }

                /* Toast (Notificación) */
                .toast-notification {
                    position: fixed; top: 140px; right: 20px; background: white; border-left: 5px solid #00a650;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.15); padding: 15px 20px; border-radius: 4px;
                    display: flex; alignItems: center; gap: 20px; zIndex: 2000; transform: translateX(120%); transition: transform 0.3s ease-out; pointer-events: auto;
                }
                .toast-notification.show { transform: translateX(0); }
                .toast-notification.error { border-left-color: #e11d48; }
                .toast-content { display: flex; alignItems: center; gap: 10px; }
                .check-icon { font-size: 1.2rem; }
                .toast-title { font-weight: bold; font-size: 0.95rem; color: #333; margin: 0; }
                .toast-detail { font-size: 0.8rem; color: #666; margin: 2px 0 0 0; }
                .toast-btn { text-decoration: none; background: #333; color: white; padding: 8px 15px; border-radius: 4px; font-size: 0.85rem; font-weight: bold; transition: background 0.2s; }
                .toast-btn:hover { background: #000; }

                /* Layout */
                .product-layout { display: grid; grid-template-columns: 1fr; gap: 40px; margin-bottom: 60px; }
                @media (min-width: 768px) { .product-layout { grid-template-columns: 1.5fr 1fr; } }

                /* Galería */
                .main-image-box { width: 100%; background: #fff; border: 1px solid #eee; border-radius: 8px; overflow: hidden; display: flex; justify-content: center; }
                .main-image-box img { width: 100%; height: auto; max-height: 500px; object-fit: contain; pointer-events: none; }
                .thumbnails-row { display: flex; gap: 10px; margin-top: 15px; overflow-x: auto; }
                .thumb { width: 70px; height: 70px; object-fit: cover; border-radius: 4px; cursor: pointer; opacity: 0.6; border: 2px solid transparent; transition: 0.2s; }
                .thumb.active, .thumb:hover { opacity: 1; border-color: #ffd700; }

                /* Info */
                .title { font-size: 2rem; margin-bottom: 10px; color: #111; user-select: text; line-height: 1.2; }
                .price-box { display: flex; align-items: baseline; gap: 15px; margin-top: 20px;}
                .current-price { font-size: 2.5rem; font-weight: bold; color: #111; }
                .old-price { text-decoration: line-through; color: #888; font-size: 1.2rem; }
                .installments { color: #00a650; margin-top: 15px; font-size: 1.1rem; font-weight: 500; }

                /* Botones de Variantes */
                .variants-selector { margin-top: 30px; }
                .variants-grid { display: flex; flex-wrap: wrap; gap: 10px; }
                .variant-btn { padding: 10px 20px; border: 1px solid #ccc; background: #fff; cursor: pointer; border-radius: 4px; font-size: 0.9rem; transition: 0.2s; outline: none !important; }
                .variant-btn:hover { border-color: #333; }
                .variant-btn.selected { border-color: #ffd700; background-color: #fffdf0; color: #000; font-weight: bold; box-shadow: 0 0 0 1px #ffd700; }

                /* Acciones y Cantidad */
                .actions-row { display: flex; gap: 15px; margin-top: 30px; height: 50px; }
                
                /* CAMBIO 2: Selector de Cantidad (Centrado Perfecto) */
                .qty-selector { 
                    display: flex; 
                    border: 1px solid #ccc; 
                    border-radius: 4px; 
                    overflow: hidden; 
                    height: 50px; /* Altura fija igual al botón de agregar */
                }
                .qty-selector button { 
                    width: 50px; 
                    height: 100%;
                    border: none; 
                    background: #f5f5f5; 
                    font-size: 1.4rem; /* Símbolo más grande */
                    cursor: pointer; 
                    outline: none !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2px; /* Sin padding extra que desalinee */
                    line-height: 1; /* Evita que el texto flote */
                }
                .qty-selector button:active { background: #e0e0e0; }
                .qty-selector span { 
                    height: 100%;
                    padding: 0 20px; 
                    display: flex; 
                    align-items: center; /* Centrado vertical del número */
                    justify-content: center;
                    font-weight: bold; 
                    font-size: 1.1rem;
                }
                
                .btn-add { flex: 1; background: #ffd700; border: none; border-radius: 4px; font-weight: bold; font-size: 1rem; cursor: pointer; transition: 0.2s; outline: none !important; }
                .btn-add:hover { background: #e6c200; }
                .btn-add:active { transform: scale(0.98); }

                /* Ficha Técnica */
                .specs-section { margin-top: 60px; border-top: 1px solid #eee; padding-top: 40px; }
                .section-title { font-size: 1.5rem; margin-bottom: 30px; border-left: 5px solid #ffd700; padding-left: 15px; }
                .specs-grid { display: grid; grid-template-columns: 1fr; gap: 50px; }
                @media(min-width: 768px) { .specs-grid { grid-template-columns: 1fr 1fr; } }
                .specs-table { width: 100%; border-collapse: collapse; margin-top: 20px;}
                .specs-table th, .specs-table td { padding: 12px 0; border-bottom: 1px solid #eee; text-align: left; }
                .text-description { line-height: 1.6; color: #444; white-space: pre-wrap; margin-top: 40px; user-select: text; }
            `}</style>
        </div>
    );
};

export default ProductDetail;