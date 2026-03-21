// src/pages/OrderConfirmationMP.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const OrderConfirmationMP = () => {
    const location = useLocation();
    const { clearCart } = useCart();
    const [status, setStatus] = useState(null);
    const [pedidoId, setPedidoId] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const st = queryParams.get('status');
        const id = queryParams.get('pedido_id');
        
        setStatus(st);
        setPedidoId(id);

        if (st === 'success') {
            clearCart();
        }
    }, [location, clearCart]);

    const handleWhatsApp = () => {
        const numVendedor = "5493492123456"; 
        let mensaje = `Hola Decoud! 👋 Acabo de pagar mi pedido por Mercado Pago.\n\n`;
        mensaje += `*📦 PEDIDO #${pedidoId}*\n`;
        mensaje += `*Estado:* PAGO CONFIRMADO ✅\n\n`;
        mensaje += `Les envío este aviso para coordinar el envío. Gracias!`;

        window.open(`https://wa.me/${numVendedor}?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    if (status === 'failure') {
        return (
            <div className="container-centered" style={{textAlign: 'center', padding: '100px 20px'}}>
                <div style={{fontSize: '4rem'}}>❌</div>
                <h2 style={{color: '#e11d48'}}>El pago no pudo procesarse</h2>
                <p>Hubo un problema con tu tarjeta o la transacción fue cancelada.</p>
                <Link to="/checkout" className="btn-primary" style={{display:'inline-block', marginTop: '20px', textDecoration:'none'}}>Reintentar Pago</Link>
            </div>
        );
    }

    return (
        <div className="container-centered" style={{textAlign: 'center', padding: '100px 20px'}}>
            <div style={{fontSize: '4rem'}}>✅</div>
            <h2 style={{color: '#1B365D'}}>¡Gracias por tu compra!</h2>
            <p style={{fontSize: '1.1rem', color: '#64748b'}}>Tu pedido <strong>#{pedidoId}</strong> ha sido procesado exitosamente.</p>
            
            <div style={{maxWidth: '500px', margin: '40px auto', padding: '30px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0'}}>
                <p style={{color: '#166534', fontWeight: 'bold', marginBottom: '20px'}}>
                    ¡Último paso! Para coordinar el envío, hacé clic en el botón de abajo y envianos el aviso por WhatsApp.
                </p>
                <button 
                    onClick={handleWhatsApp}
                    style={{
                        backgroundColor: '#25D366', color: 'white', padding: '18px 30px', borderRadius: '8px',
                        border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', width: '100%'
                    }}>
                    ENVIAR AVISO POR WHATSAPP
                </button>
            </div>

            <Link to="/" style={{color: '#64748b', textDecoration: 'none'}}>Volver a la tienda</Link>
        </div>
    );
};

export default OrderConfirmationMP;