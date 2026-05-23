// src/pages/OrderConfirmationMP.jsx
// Pantalla de resultado después del checkout de Mobbex.
// Mobbex redirige a: /confirmacion-pago?pedido_id=X  (y puede agregar parámetros propios)
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Mobbex usa códigos numéricos: 200 = aprobado, 3xx = pendiente, 4xx = rechazado
const resolveStatus = (params) => {
    const code = params.get('status') || params.get('payment_status') || '';
    if (!code) return 'pending';                 // sin parámetro → en proceso
    if (code === '200' || code === 'approved') return 'success';
    if (code.startsWith('4') || code === 'failure' || code === 'rejected') return 'failure';
    return 'pending';
};

const OrderConfirmationMP = () => {
    const location = useLocation();
    const { clearCart } = useCart();
    const [result, setResult]   = useState(null);   // 'success' | 'failure' | 'pending'
    const [pedidoId, setPedidoId] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id     = params.get('pedido_id');
        const st     = resolveStatus(params);

        setPedidoId(id);
        setResult(st);

        if (st === 'success') {
            clearCart();
        }
    }, [location, clearCart]);

    const handleWhatsApp = () => {
        const numVendedor = '5493492638470';
        const msg =
            `Hola Decoud! 👋 Acabo de pagar mi pedido por Mobbex.\n\n` +
            `*📦 PEDIDO #${pedidoId}*\n` +
            `*Estado:* PAGO CONFIRMADO ✅\n\n` +
            `Les envío este aviso para coordinar el envío. ¡Gracias!`;
        window.open(`https://wa.me/${numVendedor}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    // ── RECHAZADO ──
    if (result === 'failure') {
        return (
            <div className="container-centered" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <div style={{ fontSize: '4rem' }}>❌</div>
                <h2 style={{ color: '#e11d48' }}>El pago no pudo procesarse</h2>
                <p style={{ color: 'var(--color-text-dark)' }}>
                    Hubo un problema con tu tarjeta o la transacción fue cancelada por Mobbex.
                </p>
                <Link to="/checkout" style={btnStyle('#e11d48')}>Reintentar Pago</Link>
            </div>
        );
    }

    // ── PENDIENTE ──
    if (result === 'pending') {
        return (
            <div className="container-centered" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <div style={{ fontSize: '4rem' }}>⏳</div>
                <h2 style={{ color: 'var(--decoud-blue)' }}>Pago en proceso</h2>
                <p style={{ color: 'var(--color-text-dark)', maxWidth: '480px', margin: '0 auto 30px' }}>
                    Tu pago está siendo procesado. Te notificaremos cuando se confirme.
                    {pedidoId && <><br/><strong>Pedido #{pedidoId}</strong></>}
                </p>
                <Link to="/" style={btnStyle('#6c3ce1')}>Volver a la tienda</Link>
            </div>
        );
    }

    // ── APROBADO ──
    return (
        <div className="container-centered" style={{ textAlign: 'center', padding: '100px 20px' }}>
            <div style={{ fontSize: '4rem' }}>✅</div>
            <h2 style={{ color: 'var(--decoud-blue)' }}>¡Gracias por tu compra!</h2>
            <p style={{ fontSize: '1.1rem', color: '#64748b' }}>
                Tu pedido <strong>#{pedidoId}</strong> fue procesado exitosamente.
            </p>

            <div style={{
                maxWidth: '500px', margin: '40px auto', padding: '30px',
                backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0',
            }}>
                <p style={{ color: '#166534', fontWeight: 'bold', marginBottom: '20px' }}>
                    ¡Último paso! Avisanos por WhatsApp para coordinar el envío.
                </p>
                <button onClick={handleWhatsApp} style={{
                    backgroundColor: '#25D366', color: 'white', padding: '18px 30px',
                    borderRadius: '8px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold',
                    cursor: 'pointer', width: '100%',
                }}>
                    ENVIAR AVISO POR WHATSAPP
                </button>
            </div>

            <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Volver a la tienda</Link>
        </div>
    );
};

const btnStyle = (bg) => ({
    display: 'inline-block', marginTop: '20px', padding: '14px 32px',
    backgroundColor: bg, color: 'white', borderRadius: '8px',
    textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem',
});

export default OrderConfirmationMP;
