// src/pages/Checkout.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

// INICIALIZACIÓN
initMercadoPago('TEST-9b98613c-74d8-478a-b84e-2c6b985ee3b6', { locale: 'es-AR' });

const CheckoutPage = () => {
    // 1. CORRECCIÓN: Usamos 'totalPrice' y traemos 'removeFromCart' y 'updateQuantity'
    const { cartItems, totalPrice, clearCart, removeFromCart, updateQuantity } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        telefono: '',
        direccion: '',
        ciudad: '',
        provincia: 'Santa Fe',
    });

    const formDataRef = useRef(formData);
    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    // Usamos totalPrice en lugar de 'total'
    const initialization = useMemo(() => ({
        amount: Number(totalPrice) > 0 ? Number(totalPrice) : 100,
        payer: {
            email: user?.email || 'test_user_999@test.com',
            entity_type: 'individual', 
        },
    }), [totalPrice, user?.email]);

    const customization = useMemo(() => ({
        paymentMethods: {
            creditCard: "all",
            debitCard: "all",
            mercadoPago: "all",
        },
    }), []);

    const handlePaymentSubmit = useCallback(async ({ formData: paymentData }) => {
        const currentFormData = formDataRef.current;

        if (!currentFormData.telefono || !currentFormData.direccion || !currentFormData.ciudad) {
            alert("⚠️ Por favor completa la dirección de envío arriba.");
            return new Promise((resolve, reject) => reject());
        }

        try {
            const payload = {
                ...paymentData,
                ...currentFormData,
                nombre: user?.first_name,
                apellido: user?.last_name,
                email: user?.email,
                transaction_amount: totalPrice, // Corregido
                items: cartItems.map(item => ({
                    id: item.id,
                    title: item.nombre,
                    quantity: item.cantidad,
                    unit_price: item.precio
                }))
            };

            const response = await fetch("http://127.0.0.1:8000/api/procesar-pago/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok && data.status === "approved") {
                clearCart();
                alert(`¡Pago Aprobado! ID: ${data.id}`);
                navigate('/');
            } else {
                console.error("Backend Error:", data);
                alert("Pago rechazado. Revisa los datos de la tarjeta.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión.");
        }
    }, [totalPrice, cartItems, user, clearCart, navigate]);

    if (!user) return null;

    // Si el carrito está vacío, mostramos un aviso bonito
    if (cartItems.length === 0) return (
        <div style={{padding:'80px 20px', textAlign:'center', backgroundColor: '#f8fafc', minHeight: '60vh'}}>
            <h2 style={{color: '#1e3a8a', marginBottom: '20px'}}>Tu carrito está vacío 🛒</h2>
            <Link to="/" style={{
                textDecoration: 'none', 
                backgroundColor: '#ffd700', 
                color: '#333', 
                padding: '12px 25px', 
                borderRadius: '50px',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
                Volver al Catálogo
            </Link>
        </div>
    );

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 0' }}>
            <div className="container-centered">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '30px'}}>
                    <h1 style={{ color: '#1e3a8a', margin: 0 }}>Finalizar Compra</h1>
                    <Link to="/" className="continue-shopping-link">
                        ← Seguir Comprando
                    </Link>
                </div>
                
                <div className="checkout-grid">
                    
                    {/* COLUMNA IZQUIERDA: DATOS + PAGO */}
                    <div className="left-column">
                        <div className="card top-card">
                            <h3 className="card-title">📍 Datos de Envío</h3>
                            <div className="input-row">
                                <input 
                                    type="text" placeholder="Dirección" className="input-checkout"
                                    value={formData.direccion} onChange={e=>setFormData({...formData, direccion:e.target.value})} 
                                />
                                <input 
                                    type="tel" placeholder="Teléfono" className="input-checkout"
                                    value={formData.telefono} onChange={e=>setFormData({...formData, telefono:e.target.value})} 
                                />
                            </div>
                            <div className="input-row">
                                <input 
                                    type="text" placeholder="Ciudad" className="input-checkout"
                                    value={formData.ciudad} onChange={e=>setFormData({...formData, ciudad:e.target.value})} 
                                />
                                <input 
                                    type="text" placeholder="Provincia" className="input-checkout"
                                    value={formData.provincia} onChange={e=>setFormData({...formData, provincia:e.target.value})} 
                                />
                            </div>
                        </div>

                        <div className="card bottom-card">
                            <h3 className="card-title">💳 Pago Seguro</h3>
                            <Payment
                                key="static-brick-v1" 
                                initialization={initialization}
                                customization={customization}
                                onSubmit={handlePaymentSubmit}
                            />
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: RESUMEN DE PRODUCTOS */}
                    <div className="right-column">
                        <div className="summary-card">
                            <h3 style={{marginBottom:'20px'}}>Tu Pedido</h3>
                            
                            <div className="items-list">
                                {cartItems.map((item, index) => (
                                    <div key={`${item.id}-${index}`} className="cart-item">
                                        <div className="item-img-box">
                                            {item.imagen ? <img src={item.imagen} alt={item.nombre} /> : <div className="no-img">Sin img</div>}
                                        </div>
                                        
                                        <div className="item-details">
                                            <p className="item-name">{item.nombre}</p>
                                            {item.variantData && <p className="item-variant">Medida: {item.variantData.medida}</p>}
                                            
                                            <div className="item-controls">
                                                {/* Controles de Cantidad */}
                                                <div className="mini-qty-selector">
                                                    <button onClick={() => updateQuantity(item.id, -1)} disabled={item.cantidad <= 1}>-</button>
                                                    <span>{item.cantidad}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                                </div>
                                                
                                                <span className="item-price">${Number(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
                                            </div>
                                        </div>

                                        {/* Botón ELIMINAR */}
                                        <button 
                                            className="delete-btn" 
                                            onClick={() => removeFromCart(item.id)}
                                            title="Eliminar producto"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* TOTAL CORREGIDO */}
                            <div className="total-row">
                                <span>Total a Pagar</span>
                                <span>${Number(totalPrice || 0).toLocaleString('es-AR')}</span>
                            </div>

                            <div className="alert-box">
                                <strong>⚠️ IMPORTANTE:</strong><br/>
                                Al finalizar, contáctanos por WhatsApp para coordinar el horario de entrega.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

             <style>{`
                .container-centered { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
                
                .continue-shopping-link {
                    text-decoration: none; color: #666; font-size: 0.9rem; font-weight: 600;
                    transition: color 0.2s;
                }
                .continue-shopping-link:hover { color: #1e3a8a; text-decoration: underline; }

                .checkout-grid { display: flex; gap: 30px; flex-wrap: wrap; }
                .left-column { flex: 2; min-width: 300px; }
                .right-column { flex: 1; min-width: 300px; }

                .card { background: white; padding: 25px; border: 1px solid #eee; }
                .top-card { borderRadius: 8px 8px 0 0; border-bottom: none; }
                .bottom-card { borderRadius: 0 0 8px 8px; border-top: 1px dashed #ddd; }
                .card-title { margin-top: 0; color: #333; font-size: 1.1rem; margin-bottom: 20px; }

                .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
                .input-checkout {
                    width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px;
                    font-size: 1rem; background-color: #f9f9f9;
                }
                .input-checkout:focus { border-color: #009ee3; outline: none; background-color: #fff; }

                .summary-card {
                    background: white; padding: 20px; border-radius: 8px; border: 1px solid #eee;
                    position: sticky; top: 20px;
                }

                .items-list {
                    max-height: 400px; overflow-y: auto; margin-bottom: 20px;
                    padding-right: 5px;
                }
                .items-list::-webkit-scrollbar { width: 5px; }
                .items-list::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

                .cart-item {
                    display: flex; gap: 12px; margin-bottom: 15px; padding-bottom: 15px;
                    border-bottom: 1px solid #f1f1f1; position: relative;
                }
                .cart-item:last-child { border-bottom: none; }

                .item-img-box {
                    width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid #eee; flex-shrink: 0;
                }
                .item-img-box img { width: 100%; height: 100%; object-fit: cover; }
                .no-img { width: 100%; height: 100%; background: #eee; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #999; }

                .item-details { flex: 1; }
                .item-name { font-weight: 600; font-size: 0.9rem; margin: 0 0 4px 0; line-height: 1.2; color: #333; }
                .item-variant { font-size: 0.8rem; color: #888; margin: 0 0 8px 0; }
                
                .item-controls { display: flex; justify-content: space-between; align-items: center; }
                .item-price { font-weight: bold; font-size: 0.95rem; color: #333; }

                /* Botones Mini de Cantidad */
                .mini-qty-selector { display: flex; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; }
                .mini-qty-selector button {
                    border: none; background: #f5f5f5; width: 25px; height: 25px; cursor: pointer; font-weight: bold;
                }
                .mini-qty-selector button:disabled { opacity: 0.5; cursor: not-allowed; }
                .mini-qty-selector span {
                    padding: 0 8px; display: flex; align-items: center; font-size: 0.85rem; background: white;
                }

                .delete-btn {
                    background: none; border: none; cursor: pointer; font-size: 1.1rem;
                    opacity: 0.5; transition: opacity 0.2s; padding: 0 0 0 10px; align-self: center;
                }
                .delete-btn:hover { opacity: 1; }

                .total-row {
                    display: flex; justify-content: space-between; font-size: 1.3rem; font-weight: bold;
                    margin-bottom: 20px; border-top: 2px solid #eee; padding-top: 15px;
                }
                .alert-box {
                    background-color: #eef6ff; color: #1e3a8a; padding: 15px;
                    border-radius: 6px; border: 1px solid #dbeafe;
                    font-size: 0.9rem; line-height: 1.4; text-align: center;
                }

                @media (max-width: 768px) {
                    .checkout-grid { flex-direction: column-reverse; }
                    .input-row { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default CheckoutPage;