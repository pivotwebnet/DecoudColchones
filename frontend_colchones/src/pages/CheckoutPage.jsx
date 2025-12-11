// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom'; // Importamos useLocation
import { createPedido } from '../api/api'; 

const CheckoutPage = () => {
    const { cartItems, total, clearCart } = useCart();
    const { user } = useAuth(); // Obtenemos el usuario del contexto
    const navigate = useNavigate();
    
    // Estados del formulario
    const [formData, setFormData] = useState({
        nombre: user?.first_name || '',
        apellido: user?.last_name || '',
        email: user?.email || '',
        telefono: '',
        direccion: '',
        ciudad: '',
        provincia: 'Santa Fe',
    });
    const [loading, setLoading] = useState(false);

    // --- PROTECCIÓN DE RUTA ---
    useEffect(() => {
        // Si no hay usuario logueado...
        if (!user) {
            alert("Para finalizar la compra, necesitas iniciar sesión o registrarte.");
            // Lo mandamos al Login
            navigate('/login');
        }
    }, [user, navigate]);

    // Si no hay usuario, retornamos null para que no se vea el formulario ni un milisegundo
    if (!user) return null;
    // ---------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Construimos el objeto exacto que espera Django
            const pedidoData = { 
                items: cartItems.map(item => ({
                    variant_id: item.variantId, // ID de la variante (asegúrate que tu CartContext guarde esto)
                    quantity: item.cantidad
                })),
                // Datos del comprador
                nombre_completo: `${formData.nombre} ${formData.apellido}`,
                email: formData.email,
                direccion_envio: `${formData.direccion}, ${formData.ciudad}, ${formData.provincia}`,
                ciudad: formData.ciudad
            };

            await createPedido(pedidoData);
            
            clearCart();
            alert("¡Pedido realizado con éxito! Nos contactaremos contigo.");
            navigate('/');
        } catch (err) {
            console.error(err);
            alert("Hubo un error al procesar el pedido. Revisa que tu sesión no haya expirado.");
            setLoading(false);
        }
    };

    if (cartItems.length === 0) return <div style={{padding:'50px', textAlign:'center'}}>No hay items en el carrito.</div>;

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 0' }}>
            <div className="container-centered">
                <h1 style={{ marginBottom: '30px', color: '#1e3a8a' }}>Finalizar Compra</h1>
                
                <div style={{display:'flex', gap:'30px', flexWrap:'wrap'}}>
                    <div style={{flex: 2, minWidth:'300px'}}>
                        {/* Aviso de Envío */}
                        <div style={{backgroundColor: '#fef9c3', border: '1px solid #facc15', borderRadius: '8px', padding: '20px', marginBottom: '25px', color: '#854d0e'}}>
                            <strong>🚚 Coordinación de Envío:</strong> Al finalizar, nos comunicaremos al teléfono indicado para coordinar el transporte.
                        </div>

                        <form onSubmit={handleSubmit} style={{backgroundColor:'white', padding:'30px', borderRadius:'8px', border:'1px solid #eee'}}>
                            <h3 style={{marginTop:0, color:'#333'}}>Tus Datos</h3>
                            <div style={{display:'flex', gap:'10px', marginBottom:'15px'}}>
                                <input type="text" placeholder="Nombre" required name="nombre" value={formData.nombre} onChange={e=>setFormData({...formData, nombre:e.target.value})} style={{flex:1, padding:'10px', border:'1px solid #ccc', borderRadius:'4px'}} />
                                <input type="text" placeholder="Apellido" required name="apellido" value={formData.apellido} onChange={e=>setFormData({...formData, apellido:e.target.value})} style={{flex:1, padding:'10px', border:'1px solid #ccc', borderRadius:'4px'}} />
                            </div>

                            <div style={{marginBottom:'15px'}}>
                                <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>Teléfono (Crucial)</label>
                                <input type="tel" required name="telefono" value={formData.telefono} onChange={e=>setFormData({...formData, telefono:e.target.value})} style={{width:'100%', padding:'10px', border:'1px solid #ccc', borderRadius:'4px'}} placeholder="Ej: 3492..." />
                            </div>

                            <div style={{marginBottom:'15px'}}>
                                <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>Dirección de Entrega</label>
                                <input type="text" required name="direccion" value={formData.direccion} onChange={e=>setFormData({...formData, direccion:e.target.value})} style={{width:'100%', padding:'10px', border:'1px solid #ccc', borderRadius:'4px'}} />
                            </div>

                            <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
                                <input type="text" placeholder="Ciudad" required name="ciudad" value={formData.ciudad} onChange={e=>setFormData({...formData, ciudad:e.target.value})} style={{flex:1, padding:'10px', border:'1px solid #ccc', borderRadius:'4px'}} />
                                <input type="text" placeholder="Provincia" required name="provincia" value={formData.provincia} onChange={e=>setFormData({...formData, provincia:e.target.value})} style={{flex:1, padding:'10px', border:'1px solid #ccc', borderRadius:'4px'}} />
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary" style={{width:'100%', fontSize:'1.1rem'}}>
                                {loading ? 'Procesando...' : 'Confirmar Pedido'}
                            </button>
                        </form>
                    </div>

                    {/* Resumen Lateral */}
                    <div style={{flex: 1, minWidth:'300px'}}>
                        <div style={{backgroundColor:'white', padding:'20px', borderRadius:'8px', border:'1px solid #eee'}}>
                            <h3 style={{marginTop:0}}>Resumen</h3>
                            {cartItems.map(item => (
                                <div key={item.uniqueId} style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', fontSize:'0.9rem'}}>
                                    <span>{item.cantidad}x {item.nombre} <small>({item.medida})</small></span>
                                    <b>${(item.precio * item.cantidad).toLocaleString('es-AR')}</b>
                                </div>
                            ))}
                            <hr style={{margin:'15px 0', borderTop:'1px solid #eee'}} />
                            <div style={{display:'flex', justifyContent:'space-between', fontSize:'1.2rem', fontWeight:'bold'}}>
                                <span>Total</span>
                                <span>${total.toLocaleString('es-AR')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;