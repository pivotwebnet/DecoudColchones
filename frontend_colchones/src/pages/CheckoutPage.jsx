import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createPedido } from '../api/api';
import CheckoutSteps from '../components/CheckoutSteps';
import { useToast } from '../components/Toast';

// ── SVG Icons ────────────────────────────────────────────────────────────────
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconCreditCard = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const IconBank = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22"/>
    <line x1="6" y1="18" x2="6" y2="11"/>
    <line x1="10" y1="18" x2="10" y2="11"/>
    <line x1="14" y1="18" x2="14" y2="11"/>
    <line x1="18" y1="18" x2="18" y2="11"/>
    <polygon points="12 2 20 7 4 7"/>
  </svg>
);

const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const IconCopy = ({ copied }) => copied ? (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
) : (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const IconWhatsApp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

// ── Componente copy-to-clipboard para datos bancarios ────────────────────────
const CopyField = ({ label, value }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dark)', opacity: 0.6 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontWeight: '700', color: 'var(--color-text-dark)', fontFamily: 'monospace', fontSize: '0.95rem' }}>{value}</span>
        <button onClick={copy} title="Copiar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#16a34a' : 'var(--color-text-dark)', opacity: copied ? 1 : 0.4, padding: '2px', display: 'flex', transition: 'all 0.2s' }}>
          <IconCopy copied={copied} />
        </button>
      </div>
    </div>
  );
};

// ── Página principal ─────────────────────────────────────────────────────────
const Checkout = () => {
  const { cartItems, total, clearCart, shippingData } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const { showToast, ToastNode } = useToast();

  const bankDetails = {
    banco: "Banco Nación",
    titular: "Decoud Colchones S.H.",
    cbu: "0110432120043216543210",
    alias: "DECOUD.COLCHONES",
    cuit: "30-12345678-9",
  };

  useEffect(() => {
    if (!shippingData.nombre || !shippingData.telefono) navigate('/confirmar-pedido');
  }, [shippingData, navigate]);

  const generateWhatsAppLink = (pedidoId, metodoPago) => {
    const numVendedor = "5493492123456";
    let msg = `Hola Decoud, acabo de realizar un pedido en la web.\n\n`;
    msg += `*PEDIDO #${pedidoId}*\n`;
    msg += `*Cliente:* ${shippingData.nombre} ${shippingData.apellido}\n`;
    msg += `*Método de Pago:* ${metodoPago}\n`;
    msg += `*Total:* $${total.toLocaleString('es-AR')}\n\n`;
    msg += `*Productos:*\n`;
    cartItems.forEach(item => { msg += `- ${item.cantidad}x ${item.nombre}\n`; });
    msg += `\n*Dirección:* ${shippingData.direccion}, ${shippingData.ciudad}\n`;
    msg += `\nYa realicé la transferencia. En breve les envío el comprobante.`;
    return `https://wa.me/${numVendedor}?text=${encodeURIComponent(msg)}`;
  };

  const handleFinalizeOrder = async (metodo) => {
    setIsProcessing(true);
    try {
      const orderData = {
        usuario_data: shippingData,
        items: cartItems.map(item => ({ producto_id: item.id, cantidad: item.cantidad, precio: item.precio })),
        total,
        metodo_pago: metodo,
      };
      const response = await createPedido(orderData);
      if (metodo === 'Mobbex' && response.checkout_url) {
        window.location.href = response.checkout_url;
      } else {
        const waLink = generateWhatsAppLink(response.id, metodo);
        clearCart();
        window.open(waLink, '_blank');
        navigate('/');
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Ocurrió un error al procesar el pago. Por favor intentá de nuevo.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container-centered" style={{ padding: '20px 20px 60px', maxWidth: '780px', transition: 'all 0.3s ease' }}>
      {ToastNode}
      <CheckoutSteps />

      {/* Encabezado */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ color: 'var(--decoud-blue)', borderBottom: '2px solid var(--decoud-gold)', display: 'inline-block', marginBottom: '8px' }}>
          Finalizar Pago
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontSize: '0.82rem', fontWeight: '600' }}>
          <IconLock /> Sitio seguro — tus datos están protegidos
        </div>
      </div>

      {/* Total */}
      <div style={{ backgroundColor: 'var(--content-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '20px 24px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s ease' }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-dark)', opacity: 0.6 }}>Total a pagar</p>
          <strong style={{ color: 'var(--decoud-gold)', fontSize: '2rem', lineHeight: 1.2 }}>
            ${(total || 0).toLocaleString('es-AR')}
          </strong>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.82rem', color: 'var(--color-text-dark)', opacity: 0.55 }}>
          <p style={{ margin: '0 0 2px 0' }}>{cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}</p>
          <p style={{ margin: 0 }}>{shippingData.nombre} {shippingData.apellido}</p>
        </div>
      </div>

      {/* Selector de método */}
      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-dark)', opacity: 0.7, marginBottom: '12px' }}>
        Seleccioná tu método de pago:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: '12px', marginBottom: '24px' }}>

        {/* MOBBEX */}
        <button
          onClick={() => setSelectedMethod('Mobbex')}
          style={{
            ...methodBtn,
            borderColor: selectedMethod === 'Mobbex' ? '#6c3ce1' : 'var(--border-color)',
            backgroundColor: selectedMethod === 'Mobbex' ? 'rgba(108,60,225,0.06)' : 'var(--content-bg)',
            boxShadow: selectedMethod === 'Mobbex' ? '0 0 0 3px rgba(108,60,225,0.15)' : 'none',
          }}>
          <div style={{ color: '#6c3ce1', marginBottom: '8px' }}><IconCreditCard /></div>
          <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-text-dark)' }}>Mobbex</span>
          <span style={{ fontSize: '0.78rem', color: '#6c3ce1', marginTop: '2px' }}>Tarjeta · Débito · QR</span>
          {selectedMethod === 'Mobbex' && (
            <span style={{ position: 'absolute', top: 10, right: 10, color: '#6c3ce1' }}><IconCheck /></span>
          )}
        </button>

        {/* TRANSFERENCIA */}
        <button
          onClick={() => setSelectedMethod('Transferencia')}
          style={{
            ...methodBtn,
            borderColor: selectedMethod === 'Transferencia' ? 'var(--decoud-blue)' : 'var(--border-color)',
            backgroundColor: selectedMethod === 'Transferencia' ? 'rgba(27,54,93,0.05)' : 'var(--content-bg)',
            boxShadow: selectedMethod === 'Transferencia' ? '0 0 0 3px rgba(27,54,93,0.12)' : 'none',
          }}>
          <div style={{ color: 'var(--decoud-blue)', marginBottom: '8px' }}><IconBank /></div>
          <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-text-dark)' }}>Transferencia bancaria</span>
          <span style={{ fontSize: '0.78rem', color: '#059669', marginTop: '2px', fontWeight: '600' }}>10% de descuento</span>
          {selectedMethod === 'Transferencia' && (
            <span style={{ position: 'absolute', top: 10, right: 10, color: 'var(--decoud-blue)' }}><IconCheck /></span>
          )}
        </button>
      </div>

      {/* Panel MOBBEX */}
      {selectedMethod === 'Mobbex' && (
        <div style={{ backgroundColor: 'var(--content-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '24px', marginBottom: '16px', transition: 'all 0.3s ease' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '20px', padding: '14px', borderRadius: '8px', backgroundColor: 'rgba(108,60,225,0.05)', border: '1px solid rgba(108,60,225,0.15)' }}>
            <div style={{ color: '#6c3ce1', marginTop: '1px', flexShrink: 0 }}><IconLock /></div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-dark)', lineHeight: '1.5' }}>
              Serás redirigido al entorno seguro de <strong>Mobbex</strong>. Podés pagar con tarjeta de crédito, débito, billeteras virtuales o código QR.
            </p>
          </div>
          <button
            onClick={() => handleFinalizeOrder('Mobbex')}
            disabled={isProcessing}
            style={{ ...actionBtn, backgroundColor: '#6c3ce1', opacity: isProcessing ? 0.7 : 1 }}>
            {isProcessing ? 'Generando enlace de pago...' : 'Continuar con Mobbex'}
          </button>
        </div>
      )}

      {/* Panel TRANSFERENCIA */}
      {selectedMethod === 'Transferencia' && (
        <div style={{ backgroundColor: 'var(--content-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '24px', marginBottom: '16px', transition: 'all 0.3s ease' }}>
          <p style={{ margin: '0 0 16px 0', fontWeight: '600', color: 'var(--color-text-dark)', fontSize: '0.95rem' }}>
            Datos para la transferencia
          </p>
          <div style={{ borderRadius: '8px', border: '1px solid var(--border-color)', padding: '0 16px', marginBottom: '20px', backgroundColor: 'var(--bg-color)' }}>
            <CopyField label="Banco" value={bankDetails.banco} />
            <CopyField label="Titular" value={bankDetails.titular} />
            <CopyField label="CBU" value={bankDetails.cbu} />
            <CopyField label="Alias" value={bankDetails.alias} />
            <CopyField label="CUIT" value={bankDetails.cuit} />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '12px 14px', borderRadius: '8px', backgroundColor: 'rgba(27,54,93,0.05)', border: '1px solid rgba(27,54,93,0.12)', marginBottom: '20px' }}>
            <div style={{ color: 'var(--decoud-blue)', marginTop: '1px', flexShrink: 0 }}><IconLock /></div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-dark)', lineHeight: '1.5', opacity: 0.8 }}>
              Una vez realizada la transferencia, hacé clic en el botón para avisarnos por WhatsApp y adjuntarnos el comprobante.
            </p>
          </div>

          <button
            onClick={() => handleFinalizeOrder('Transferencia')}
            disabled={isProcessing}
            style={{ ...actionBtn, backgroundColor: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: isProcessing ? 0.7 : 1 }}>
            <IconWhatsApp />
            {isProcessing ? 'Procesando...' : 'Ya transferí, avisar por WhatsApp'}
          </button>
        </div>
      )}

      {!selectedMethod && (
        <p style={{ textAlign: 'center', color: 'var(--color-text-dark)', opacity: 0.45, fontSize: '0.9rem', padding: '8px 0' }}>
          Seleccioná un método para continuar
        </p>
      )}

      {/* Sellos de confianza */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', margin: '28px 0 20px', padding: '16px', borderTop: '1px solid var(--border-color)' }}>
        {[
          { icon: <IconShield />, label: 'Compra segura' },
          { icon: <IconLock />, label: 'Datos protegidos' },
          { icon: <IconCheck />, label: 'Pago verificado' },
        ].map(({ icon, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-text-dark)', opacity: 0.45, fontSize: '0.78rem' }}>
            {icon} {label}
          </div>
        ))}
      </div>

      <Link to="/confirmar-pedido" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-text-dark)', opacity: 0.6, textDecoration: 'none', fontSize: '0.88rem', transition: 'opacity 0.2s' }}>
        <IconArrowLeft /> Volver a datos de envío
      </Link>
    </div>
  );
};

const methodBtn = {
  position: 'relative',
  border: '2px solid',
  padding: '20px 16px',
  borderRadius: '12px',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'all 0.2s ease',
  background: 'none',
  fontFamily: 'inherit',
  textAlign: 'center',
};

const actionBtn = {
  width: '100%',
  color: 'white',
  padding: '15px',
  borderRadius: '8px',
  border: 'none',
  fontSize: '1rem',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  letterSpacing: '0.01em',
};

export default Checkout;
