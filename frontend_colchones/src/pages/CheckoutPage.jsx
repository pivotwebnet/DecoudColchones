// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createPedido } from '../api/api';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
    // *ADVERTENCIA*: Asegúrate de que setCartItems esté expuesto en tu CartContext
    const { cartItems, cartTotal, setCartItems } = useCart(); 
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre_completo: '',
        email: '',
        direccion_envio: '',
        ciudad: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderError, setOrderError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setOrderError(null);
        
        // ... (Lógica para mapear ítems y llamar a createPedido - Ver respuesta anterior) ...
        
        const items = cartItems.map(item => ({
            variant_id: item.variant_id,
            quantity: item.quantity,
        }));
        const pedidoData = { ...formData, items };

        try {
            const response = await createPedido(pedidoData);
            alert(`Pedido #${response.id} creado exitosamente por $${response.total}`);
            // Simular limpieza del carrito (DEBE ESTAR IMPLEMENTADO EN CartContext)
            // setCartItems([]); 
            navigate('/'); 
        } catch (error) {
            setOrderError("Error al finalizar el pedido. Revisa datos y stock.");
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return <div style={{textAlign: 'center'}}>Tu carrito está vacío. <Link to="/colchones">Comprar ahora</Link></div>
    }

    return (
        <div style={checkoutStyles.container}>
            <h2>Finalizar Compra</h2>
            <div style={checkoutStyles.grid}>
                
                {/* 4.1 Formulario de Envío */}
                <div style={checkoutStyles.formSection}>
                    <h3>1. Datos de Envío</h3>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Nombre Completo:
                            <input type="text" name="nombre_completo" value={formData.nombre_completo} onChange={handleChange} required style={checkoutStyles.input} />
                        </label>
                        <label>
                            Email:
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={checkoutStyles.input} />
                        </label>
                        <label>
                            Dirección de Envío:
                            <input type="text" name="direccion_envio" value={formData.direccion_envio} onChange={handleChange} required style={checkoutStyles.input} />
                        </label>
                        <label>
                            Ciudad:
                            <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} required style={checkoutStyles.input} />
                        </label>
                        
                        {orderError && <p style={{color: 'red', marginTop: '10px'}}>{orderError}</p>}
                    </form>
                </div>
                
                {/* 4.2 Resumen del Pedido */}
                <div style={checkoutStyles.summarySection}>
                    <h3>2. Resumen y Pago</h3>
                    {cartItems.map(item => (
                        <div key={item.id} style={checkoutStyles.itemRow}>
                            <span>{item.quantity} x {item.product_name} ({item.variant_description})</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <hr/>
                    <div style={checkoutStyles.totalRow}>
                        <strong>TOTAL:</strong>
                        <strong>${cartTotal.toFixed(2)}</strong>
                    </div>
                    
                    <button 
                        onClick={handleSubmit} 
                        disabled={isProcessing || cartItems.length === 0} 
                        style={checkoutStyles.button}
                    >
                        {isProcessing ? 'Procesando Pago...' : `Confirmar y Pagar $${cartTotal.toFixed(2)}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

const checkoutStyles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '20px' },
    grid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px', flexWrap: 'wrap' },
    formSection: { padding: '20px', border: '1px solid #ddd', borderRadius: '8px' },
    summarySection: { padding: '20px', border: '1px solid #ddd', borderRadius: '8px', height: 'fit-content' },
    input: { width: '100%', padding: '10px', margin: '8px 0 15px 0', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' },
    itemRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
    totalRow: { display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '1.1em', fontWeight: 'bold' },
    button: { width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }
};

export default CheckoutPage;