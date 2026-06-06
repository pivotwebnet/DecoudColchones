// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductoBySlug, getProductos } from '../api/api';
import { useCart } from '../context/CartContext';
import ColchonCard from '../components/ColchonCard';

const ProductDetail = () => {
    const { slug } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [toast, setToast] = useState({ show: false, msg: '' });
    const [related, setRelated] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setRelated([]);
            try {
                const data = await getProductoBySlug(slug);
                setProduct(data);
                setMainImage(data.imagen);

                if (data.categoria?.slug) {
                    const rel = await getProductos({ categoria: data.categoria.slug });
                    const lista = Array.isArray(rel) ? rel : (rel.results ?? []);
                    setRelated(lista.filter(p => p.slug !== slug).slice(0, 4));
                }
            } catch (error) {
                console.error("Error cargando producto:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    if (loading) return <div style={{padding:'100px', textAlign:'center', color: '#1B365D', fontWeight: 'bold'}}>Cargando experiencia Decoud...</div>;
    if (!product) return <div style={{padding:'100px', textAlign:'center'}}>Producto no encontrado.</div>;

    const handleAddToCart = () => {
        const itemToCart = {
            id: product.id,
            uniqueId: `${product.id}-${Date.now()}`,
            nombre: product.nombre,
            precio: product.precio,
            imagen: product.imagen,
            cantidad: quantity
        };
        addToCart(itemToCart);
        setToast({ show: true, msg: '¡Agregado al carrito!' });
        setTimeout(() => setToast({ show: false, msg: '' }), 3000);
    };

    return (
        <div style={{ backgroundColor: 'var(--content-bg)', minHeight: '100vh' }}>
        <div className="product-page-pro">
            
            {/* TOAST NOTIFICATION */}
            <div className={`toast-pro ${toast.show ? 'show' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>{toast.msg}</span>
                <Link to="/carrito" className="toast-link">VER MI CARRITO</Link>
            </div>

            <div className="product-layout-grid">
                
                {/* IZQUIERDA: GALERÍA */}
                <div className="gallery-pro">
                    <div className="main-frame">
                        <img src={mainImage} alt={product.nombre} className="img-reveal" />
                    </div>
                    <div className="thumbnail-strip">
                        <div className={`thumb-box ${mainImage === product.imagen ? 'active' : ''}`} onClick={() => setMainImage(product.imagen)}>
                            <img src={product.imagen} alt="principal" />
                        </div>
                        {product.imagenes_extra?.map(img => (
                            <div key={img.id} className={`thumb-box ${mainImage === img.imagen ? 'active' : ''}`} onClick={() => setMainImage(img.imagen)}>
                                <img src={img.imagen} alt="extra" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* DERECHA: INFO */}
                <div className="info-pro">
                    <nav className="breadcrumb-pro">
                        <Link to="/">Inicio</Link>
                        <span className="breadcrumb-sep">›</span>
                        <Link to="/colchones">Catálogo</Link>
                        {product.categoria?.nombre && <>
                            <span className="breadcrumb-sep">›</span>
                            <Link to={`/colchones?categoria=${product.categoria.slug}`}>{product.categoria.nombre}</Link>
                        </>}
                        <span className="breadcrumb-sep">›</span>
                        <span className="breadcrumb-current">{product.nombre}</span>
                    </nav>
                    
                    <h1 className="product-title">{product.nombre}</h1>
                    
                    <div className="price-tag-pro">
                        <span className="price-main">${Number(product.precio).toLocaleString('es-AR')}</span>
                        {product.precio_anterior && <span className="price-old">${Number(product.precio_anterior).toLocaleString('es-AR')}</span>}
                    </div>

                    <div className="installments-pro">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                        <span>Paga hasta en <b>12 cuotas sin interés</b> de ${Math.round(product.precio/12).toLocaleString('es-AR')}</span>
                    </div>

                    {/* BENEFICIOS ICONOGRÁFICOS */}
                    <div className="tech-specs-grid">
                        <div className="tech-card">
                            <div className="tech-icon-wrapper">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B365D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            </div>
                            <div className="tech-info">
                                <span className="tech-label">Garantía</span>
                                <span className="tech-val">{product.garantia}</span>
                            </div>
                        </div>
                        <div className="tech-card">
                            <div className="tech-icon-wrapper">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B365D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
                            </div>
                            <div className="tech-info">
                                <span className="tech-label">Soporte</span>
                                <span className="tech-val">Hasta {product.peso_max_max} kg</span>
                            </div>
                        </div>
                        <div className="tech-card">
                            <div className="tech-icon-wrapper">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B365D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"></path><path d="M15 5.88V22"></path><path d="M23 12v10"></path><path d="M2 2h20"></path><path d="M2 22h20"></path></svg>
                            </div>
                            <div className="tech-info">
                                <span className="tech-label">Altura</span>
                                <span className="tech-val">{product.altura} cm</span>
                            </div>
                        </div>
                    </div>

                    <div className="buy-actions-pro">
                        <div className="qty-pro">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)}>+</button>
                        </div>
                        <button className="btn-buy-now" onClick={handleAddToCart}>
                            AGREGAR AL CARRITO
                        </button>
                    </div>

                    <div className="shipping-highlight">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                        <span>Envío <b>GRATIS</b> en Rafaela y zona</span>
                    </div>
                </div>
            </div>

            {/* BOTÓN STICKY MOBILE */}
            <div className="sticky-mobile-buy">
                <div className="sticky-info">
                    <span className="sticky-title">{product.nombre}</span>
                    <span className="sticky-price">${Number(product.precio).toLocaleString('es-AR')}</span>
                </div>
                <button className="btn-buy-now" onClick={handleAddToCart}>AGREGAR</button>
            </div>

            <div className="product-details-extra">
                <div className="description-section">
                    <h2 className="section-title">Descripción</h2>
                    <div className="desc-content" dangerouslySetInnerHTML={{ __html: product.descripcion_base }}></div>
                </div>

                <div className="specs-section">
                    <h2 className="section-title">Ficha Técnica</h2>
                    <div className="specs-table">
                        <div className="spec-row">
                            <span className="spec-name">Categoría</span>
                            <span className="spec-value">{product.categoria?.nombre}</span>
                        </div>
                        <div className="spec-row">
                            <span className="spec-name">Línea</span>
                            <span className="spec-value">{product.linea?.nombre || 'Estándar'}</span>
                        </div>
                        <div className="spec-row">
                            <span className="spec-name">Medida</span>
                            <span className="spec-value">{product.medida?.replace('_', ' ')}</span>
                        </div>
                        <div className="spec-row">
                            <span className="spec-name">Altura</span>
                            <span className="spec-value">{product.altura} cm</span>
                        </div>
                        {product.densidad && (
                            <div className="spec-row">
                                <span className="spec-name">Densidad</span>
                                <span className="spec-value">{product.densidad} kg/m³</span>
                            </div>
                        )}
                        <div className="spec-row">
                            <span className="spec-name">Soporte Máximo</span>
                            <span className="spec-value">{product.peso_max_max} kg por lado</span>
                        </div>
                        <div className="spec-row">
                            <span className="spec-name">Top Pillow</span>
                            <span className="spec-value">{product.tiene_top_pillow ? 'Sí' : 'No'}</span>
                        </div>
                        <div className="spec-row">
                            <span className="spec-name">Garantía</span>
                            <span className="spec-value">{product.garantia}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRODUCTOS RELACIONADOS */}
            {related.length > 0 && (
                <div className="related-section">
                    <div className="related-header">
                        <h2 className="section-title" style={{ marginBottom: 0 }}>Productos relacionados</h2>
                        <Link to={`/colchones?categoria=${product.categoria?.slug}`} className="related-ver-mas">
                            Ver todos
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </Link>
                    </div>
                    <div className="related-grid">
                        {related.map(p => <ColchonCard key={p.id} product={p} />)}
                    </div>
                </div>
            )}

            <style>{`
                .product-page-pro { max-width: 1200px; margin: 0 auto; padding: clamp(20px, 4vw, 60px) clamp(10px, 3vw, 20px); font-family: 'Inter', sans-serif; }
                .product-layout-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: clamp(20px, 5vw, 60px); margin-bottom: 60px; }

                /* Galería */
                .main-frame { border-radius: 16px; overflow: hidden; background: #fff; border: 1px solid #f1f5f9; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
                .main-frame img { width: 100%; height: auto; display: block; }
                .thumbnail-strip { display: flex; gap: 10px; flex-wrap: wrap; }
                .thumb-box { width: clamp(55px, 10vw, 80px); height: clamp(55px, 10vw, 80px); border-radius: 10px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; }
                .thumb-box.active { border-color: #1B365D; }
                .thumb-box img { width: 100%; height: 100%; object-fit: cover; }

                /* Info */
                .breadcrumb-pro { font-size: 0.8rem; color: #94a3b8; margin-bottom: 15px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
                .breadcrumb-pro a { color: #94a3b8; text-decoration: none; transition: color 0.2s; }
                .breadcrumb-pro a:hover { color: #1B365D; }
                .breadcrumb-sep { color: #cbd5e1; }
                .breadcrumb-current { color: #1B365D; font-weight: 600; }
                .product-title { font-size: clamp(1.5rem, 5vw, 2.8rem); font-weight: 900; color: #1B365D; margin-bottom: 20px; line-height: 1.1; }
                .price-tag-pro { display: flex; align-items: baseline; gap: 15px; margin-bottom: 25px; flex-wrap: wrap; }
                .price-main { font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 800; color: #1e293b; }
                .price-old { font-size: 1.2rem; color: #94a3b8; text-decoration: line-through; }
                .installments-pro { display: flex; align-items: center; gap: 10px; background: #fdfaf1; padding: 12px 15px; border-radius: 10px; color: #854d0e; font-size: 0.9rem; margin-bottom: 30px; border: 1px solid #fef08a; flex-wrap: wrap; }

                /* Specs Grid */
                .tech-specs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 40px; }
                .tech-card { padding: 12px; background: #f8fafc; border-radius: 12px; display: flex; align-items: center; gap: 10px; border: 1px solid #f1f5f9; }
                .tech-icon-wrapper { background: white; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.05); flex-shrink: 0; }
                .tech-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
                .tech-label { font-size: 0.6rem; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }
                .tech-val { font-size: 0.82rem; color: #1B365D; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

                /* Actions */
                .buy-actions-pro { display: flex; gap: 15px; margin-bottom: 30px; }
                .qty-pro { display: flex; align-items: center; background: #f1f5f9; border-radius: 10px; padding: 5px; }
                .qty-pro button { width: 44px; height: 44px; border: none; background: transparent; font-size: 1.5rem; cursor: pointer; color: #1B365D; }
                .qty-pro span { width: 40px; text-align: center; font-weight: 800; color: #1B365D; font-size: 1.1rem; }
                .btn-buy-now { flex: 1; background: #1B365D; color: white; border: none; border-radius: 10px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: all 0.3s; letter-spacing: 1px; box-shadow: 0 10px 20px rgba(27, 54, 93, 0.2); padding: 14px; }
                .btn-buy-now:hover { background: #152a4a; transform: translateY(-2px); box-shadow: 0 15px 25px rgba(27, 54, 93, 0.3); }

                .shipping-highlight { display: flex; align-items: center; gap: 10px; color: #059669; font-size: 0.9rem; font-weight: 500; }

                /* Details Extra */
                .product-details-extra { display: grid; grid-template-columns: 1.2fr 1fr; gap: clamp(30px, 6vw, 80px); padding-top: 60px; border-top: 1px solid #f1f5f9; }
                .section-title { font-size: clamp(1.1rem, 3vw, 1.5rem); color: #1B365D; margin-bottom: 30px; font-weight: 800; position: relative; padding-bottom: 10px; }
                .section-title::after { content: ''; position: absolute; bottom: 0; left: 0; width: 50px; height: 3px; background: #D4AF37; }

                .desc-content { color: #475569; line-height: 1.8; font-size: 1rem; }

                .specs-table { background: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #f1f5f9; }
                .spec-row { display: flex; justify-content: space-between; padding: 12px 20px; border-bottom: 1px solid #f1f5f9; gap: 10px; }
                .spec-row:last-child { border-bottom: none; }
                .spec-name { color: #64748b; font-weight: 600; font-size: 0.88rem; }
                .spec-value { color: #1B365D; font-weight: 700; font-size: 0.88rem; text-align: right; }

                /* Toast */
                .toast-pro { position: fixed; top: 100px; right: 15px; background: white; padding: 15px 20px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 12px; z-index: 2000; transform: translateX(150%); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); max-width: calc(100vw - 30px); }
                .toast-pro.show { transform: translateX(0); }
                .toast-link { background: #1B365D; color: white; padding: 8px 12px; border-radius: 6px; font-size: 0.72rem; font-weight: 800; text-decoration: none; white-space: nowrap; }

                @media (max-width: 768px) {
                    .product-layout-grid, .product-details-extra { grid-template-columns: 1fr; gap: 30px; }
                    .tech-specs-grid { grid-template-columns: repeat(3, 1fr); }
                    .buy-actions-pro { flex-direction: column; }
                    .sticky-mobile-buy { display: flex; }
                    .product-page-pro { padding-bottom: 100px; }
                }
                @media (max-width: 480px) {
                    .tech-specs-grid { grid-template-columns: 1fr 1fr; }
                    .tech-icon-wrapper { display: none; }
                }

                .sticky-mobile-buy {
                    position: fixed; bottom: 0; left: 0; width: 100%;
                    background: white; padding: 12px 16px; display: none;
                    align-items: center; justify-content: space-between;
                    box-shadow: 0 -10px 30px rgba(0,0,0,0.1); z-index: 1000;
                    border-top: 1px solid #f1f5f9; box-sizing: border-box; gap: 12px;
                }
                .sticky-info { display: flex; flex-direction: column; min-width: 0; }
                .sticky-title { font-size: 0.82rem; font-weight: 700; color: #1B365D; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .sticky-price { font-size: 1rem; font-weight: 800; color: #1e293b; }

                /* Productos relacionados */
                .related-section { margin-top: 70px; padding-top: 60px; border-top: 1px solid var(--border-color); }
                .related-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
                .related-ver-mas { display: inline-flex; align-items: center; gap: 5px; font-size: 0.85rem; font-weight: 700; color: var(--decoud-blue); text-decoration: none; transition: gap 0.2s ease; }
                .related-ver-mas:hover { gap: 9px; }
                .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr)); gap: 20px; }
                @media (max-width: 768px) {
                    .related-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
                }
            `}</style>
        </div>
        </div>
    );
};

export default ProductDetail;