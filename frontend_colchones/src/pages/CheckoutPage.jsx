import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

// INICIALIZACIÓN (Tu clave pública)
initMercadoPago('TEST-9b98613c-74d8-478a-b84e-2c6b985ee3b6', { locale: 'es-AR' });

const CheckoutPage = () => {
    const { cartItems, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // 1. ESTADO DE TUS INPUTS
    const [formData, setFormData] = useState({
        telefono: '',
        direccion: '',
        ciudad: '',
        provincia: 'Santa Fe',
    });

    // 2. EL ESPEJO (useRef)
    // Esto guarda los datos sin que el componente de pago se entere
    const formDataRef = useRef(formData);
    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    // 3. CONFIGURACIÓN DEL BRICK (Memorizada)
    const initialization = useMemo(() => ({
        amount: Number(total) > 0 ? Number(total) : 100, // Nunca puede ser 0
        payer: {
            email: user?.email || 'test_user_999@test.com',
            entity_type: 'individual', 
        },
    }), [total, user?.email]);

    const customization = useMemo(() => ({
        paymentMethods: {
            creditCard: "all",
            debitCard: "all",
            mercadoPago: "all",
        },
    }), []);

    // 4. FUNCIÓN DE PAGO
    const handlePaymentSubmit = useCallback(async ({ formData: paymentData }) => {
        const currentFormData = formDataRef.current; // Leemos del espejo

        // Validamos TUS campos
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
                transaction_amount: total,
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
    }, [total, cartItems, user, clearCart, navigate]);

    if (!user) return null;
    if (cartItems.length === 0) return <div style={{padding:'50px', textAlign:'center'}}>Carrito vacío</div>;

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 0' }}>
            <div className="container-centered">
                <h1 style={{ marginBottom: '30px', color: '#1e3a8a' }}>Finalizar Compra</h1>
                
                <div style={{display:'flex', gap:'30px', flexWrap:'wrap'}}>
                    
                    <div style={{flex: 2, minWidth:'300px'}}>
                        
                        {/* INPUTS DE ENVÍO */}
                        <div style={{backgroundColor:'white', padding:'25px', borderRadius:'8px 8px 0 0', border:'1px solid #eee', borderBottom:'none'}}>
                            <h3 style={{marginTop:0, color:'#333', fontSize:'1.1rem'}}>📍 ¿Dónde recibes el pedido?</h3>
                            
                            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'15px'}}>
                                <input 
                                    type="text" 
                                    placeholder="Dirección" 
                                    className="input-checkout"
                                    value={formData.direccion} 
                                    onChange={e=>setFormData({...formData, direccion:e.target.value})} 
                                />
                                <input 
                                    type="tel" 
                                    placeholder="Teléfono" 
                                    className="input-checkout"
                                    value={formData.telefono} 
                                    onChange={e=>setFormData({...formData, telefono:e.target.value})} 
                                />
                            </div>
                            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                                <input 
                                    type="text" 
                                    placeholder="Ciudad" 
                                    className="input-checkout"
                                    value={formData.ciudad} 
                                    onChange={e=>setFormData({...formData, ciudad:e.target.value})} 
                                />
                                <input 
                                    type="text" 
                                    placeholder="Provincia" 
                                    className="input-checkout"
                                    value={formData.provincia} 
                                    onChange={e=>setFormData({...formData, provincia:e.target.value})} 
                                />
                            </div>
                        </div>

                        {/* BRICK DE PAGO */}
                        <div style={{backgroundColor:'white', padding:'25px', borderRadius:'0 0 8px 8px', border:'1px solid #eee', borderTop:'1px dashed #ddd'}}>
                            <h3 style={{marginTop:0, color:'#333', fontSize:'1.1rem'}}>💳 Pago Seguro</h3>
                            
                            {/* EL COMPONENTE ESTÁTICO */}
                            <Payment
                                key="static-brick-v1" 
                                initialization={initialization}
                                customization={customization}
                                onSubmit={handlePaymentSubmit}
                            />
                        </div>
                    </div>

                    <div style={{flex: 1, minWidth:'300px'}}>
                        <div style={{backgroundColor:'white', padding:'20px', borderRadius:'8px', border:'1px solid #eee', position: 'sticky', top: '20px'}}>
                            <h3>Resumen</h3>
                            <div style={{display:'flex', justifyContent:'space-between', fontSize:'1.2rem', fontWeight:'bold', marginBottom: '20px'}}>
                                <span>Total</span>
                                <span>${Number(total).toLocaleString('es-AR')}</span>
                            </div>

                            {/* --- AVISO RESALTADO DE ENVÍO --- */}
                            <div style={{
                                backgroundColor: '#fff3cd', 
                                color: '#856404', 
                                padding: '15px', 
                                borderRadius: '6px', 
                                border: '1px solid #ffeeba',
                                fontSize: '0.95rem',
                                lineHeight: '1.4',
                                textAlign: 'center'
                            }}>
                                <strong>⚠️ ATENCIÓN:</strong><br/>
                                Después de la compra, se tienen que comunicar por WhatsApp para coordinar el envío.
                            </div>
                            {/* -------------------------------- */}

                        </div>
                    </div>
                </div>
            </div>
             <style>{`
                .input-checkout {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 1rem;
                    background-color: #f9f9f9;
                }
                .input-checkout:focus {
                    border-color: #009ee3;
                    outline: none;
                    background-color: #fff;
                }
            `}</style>
        </div>
    );
};

export default CheckoutPage;