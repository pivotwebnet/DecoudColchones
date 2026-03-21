// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductoBySlug } from '../api/api'; 
import { useCart } from '../context/CartContext'; 

const ProductDetail = () => {
    const { slug } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [toast, setToast] = useState({ show: false, msg: '' });

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await getProductoBySlug(slug);
                setProduct(data);
                setMainImage(data.imagen);
            } catch (error) {
                console.error("Error cargando producto:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    if (loading) return <div style={{padding:'100px', textAlign:'center'}}>Cargando...</div>;
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
        <div className="product-page-container"> 
            <div className={`toast-notification ${toast.show ? 'show' : ''}`}>
                <p>{toast.msg}</p>
                <Link to="/carrito" className="toast-btn">Ver Carrito</Link>
            </div>

            <div className="product-layout">
                <div className="gallery-section">
                    <img src={mainImage} alt={product.nombre} className="main-img" />
                    <div className="thumbs">
                        <img src={product.imagen} onClick={() => setMainImage(product.imagen)} alt="thumb" />
                        {product.imagenes_extra?.map(img => (
                            <img key={img.id} src={img.imagen} onClick={() => setMainImage(img.imagen)} alt="thumb" />
                        ))}
                    </div>
                </div>

                <div className="info-section">
                    <h1 className="title">{product.nombre}</h1>
                    <p className="category">{product.categoria?.nombre}</p>
                    <p className="price">${Number(product.precio).toLocaleString('es-AR')}</p>
                    <p className="installments">💳 12 cuotas de ${Math.round(product.precio/12).toLocaleString('es-AR')}</p>
                    
                    <div className="actions">
                        <div className="qty">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)}>+</button>
                        </div>
                        <button className="btn-add" onClick={handleAddToCart}>AGREGAR AL CARRITO</button>
                    </div>
                </div>
            </div>

            <div className="specs">
                <h2>Especificaciones</h2>
                <table>
                    <tbody>
                        <tr><th>Densidad</th><td>{product.densidad}</td></tr>
                        <tr><th>Altura</th><td>{product.altura} cm</td></tr>
                        <tr><th>Garantía</th><td>{product.garantia}</td></tr>
                        <tr><th>Peso Soportado</th><td>{product.peso_max_min}kg - {product.peso_max_max}kg</td></tr>
                        <tr><th>Top Pillow</th><td>{product.tiene_top_pillow ? 'Sí' : 'No'}</td></tr>
                    </tbody>
                </table>
                <div className="desc">
                    <h3>Descripción</h3>
                    <p>{product.descripcion_base}</p>
                </div>
            </div>

            <style>{`
                .product-page-container { max-width: 1200px; margin: 0 auto; padding: 120px 20px; font-family: sans-serif; }
                .product-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
                @media(max-width:768px){ .product-layout { grid-template-columns: 1fr; } }
                .main-img { width: 100%; border-radius: 8px; }
                .thumbs { display: flex; gap: 10px; margin-top: 10px; }
                .thumbs img { width: 60px; height: 60px; object-fit: cover; cursor: pointer; border-radius: 4px; }
                .title { font-size: 2.5rem; margin: 0; }
                .price { font-size: 2rem; font-weight: bold; color: #333; margin: 20px 0; }
                .actions { display: flex; gap: 20px; margin-top: 30px; }
                .qty { display: flex; border: 1px solid #ccc; border-radius: 4px; }
                .qty button { width: 40px; border: none; background: #eee; cursor: pointer; }
                .qty span { width: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; }
                .btn-add { flex: 1; background: #1B365D; color: white; border: none; padding: 15px; border-radius: 4px; font-weight: bold; cursor: pointer; }
                .toast-notification { position: fixed; top: 100px; right: 20px; background: white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); padding: 20px; border-radius: 8px; display: flex; gap: 20px; align-items: center; transform: translateX(150%); transition: 0.3s; }
                .toast-notification.show { transform: translateX(0); }
                .specs { margin-top: 60px; border-top: 1px solid #eee; padding-top: 40px; }
                .specs table { width: 100%; max-width: 500px; border-collapse: collapse; }
                .specs th, .specs td { text-align: left; padding: 10px 0; border-bottom: 1px solid #eee; }
            `}</style>
        </div>
    );
};

export default ProductDetail;