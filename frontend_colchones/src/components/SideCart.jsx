// src/components/SideCart.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const SideCart = () => {
    const { cartItems, removeFromCart, updateQuantity, total, isCartOpen, setIsCartOpen } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/confirmar-pedido');
    };

    return (
        <>
            {/* OVERLAY */}
            <div 
                className={`cart-overlay ${isCartOpen ? 'open' : ''}`} 
                onClick={() => setIsCartOpen(false)}
            ></div>

            {/* DRAWER */}
            <div className={`side-cart ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B365D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        <h2 style={{margin:0, fontSize:'1.2rem', color:'#1B365D'}}>Tu Carrito</h2>
                    </div>
                    <button className="close-btn" onClick={() => setIsCartOpen(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div className="cart-items">
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <div key={item.uniqueId} className="side-item">
                                <img src={item.imagen} alt={item.nombre} className="item-thumb" />
                                <div className="item-info">
                                    <h4>{item.nombre}</h4>
                                    <p className="item-price">${Number(item.precio).toLocaleString('es-AR')}</p>
                                    <div className="qty-control">
                                        <button onClick={() => updateQuantity(item.uniqueId, -1)}>-</button>
                                        <span>{item.cantidad}</span>
                                        <button onClick={() => updateQuantity(item.uniqueId, 1)}>+</button>
                                    </div>
                                </div>
                                <button className="remove-item" onClick={() => removeFromCart(item.uniqueId)}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="empty-cart-msg">
                            <div style={{fontSize:'3rem', marginBottom:'15px'}}>🛒</div>
                            <p>Tu carrito está vacío</p>
                            <button onClick={() => setIsCartOpen(false)} className="btn-secondary">Volver a la tienda</button>
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="total-row">
                            <span>Subtotal:</span>
                            <span className="total-price">${total.toLocaleString('es-AR')}</span>
                        </div>
                        <p className="footer-notice">Los costos de envío se coordinarán luego por WhatsApp.</p>
                        <button onClick={handleCheckout} className="btn-buy-now" style={{width:'100%', marginTop:'10px'}}>
                            INICIAR COMPRA
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                .cart-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.4); z-index: 2999; opacity: 0; visibility: hidden; transition: all 0.3s; backdrop-filter: blur(2px); }
                .cart-overlay.open { opacity: 1; visibility: visible; }

                .side-cart { position: fixed; top: 0; right: 0; width: 400px; height: 100vh; background: white; z-index: 3000; transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); display: flex; flex-direction: column; box-shadow: -10px 0 30px rgba(0,0,0,0.1); }
                .side-cart.open { transform: translateX(0); }

                .cart-header { padding: 25px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
                .close-btn { background: none; border: none; cursor: pointer; color: #64748b; }

                .cart-items { flex: 1; overflow-y: auto; padding: 25px; }
                .side-item { display: flex; gap: 15px; margin-bottom: 25px; align-items: center; position: relative; }
                .item-thumb { width: 70px; height: 70px; object-fit: cover; border-radius: 10px; border: 1px solid #f1f5f9; }
                .item-info { flex: 1; }
                .item-info h4 { margin: 0 0 5px 0; font-size: 0.95rem; color: #1e293b; }
                .item-price { margin: 0 0 10px 0; font-weight: 700; color: #1B365D; }
                
                .qty-control { display: flex; align-items: center; gap: 15px; background: #f8fafc; width: fit-content; padding: 4px 10px; border-radius: 6px; }
                .qty-control button { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #1B365D; font-weight: bold; }
                .qty-control span { font-weight: 700; font-size: 0.9rem; }

                .remove-item { background: none; border: none; cursor: pointer; padding: 5px; opacity: 0.6; transition: opacity 0.2s; }
                .remove-item:hover { opacity: 1; }

                .cart-footer { padding: 30px; background: #f8fafc; border-top: 1px solid #f1f5f9; }
                .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
                .total-row span:first-child { color: #64748b; font-weight: 600; }
                .total-price { font-size: 1.5rem; font-weight: 800; color: #1B365D; }
                .footer-notice { font-size: 0.75rem; color: #94a3b8; margin-bottom: 20px; }

                .empty-cart-msg { text-align: center; padding-top: 60px; color: #94a3b8; }

                @media (max-width: 450px) {
                    .side-cart { width: 100%; }
                }
            `}</style>
        </>
    );
};

export default SideCart;