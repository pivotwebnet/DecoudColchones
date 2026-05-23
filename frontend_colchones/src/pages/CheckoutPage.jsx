// src/pages/CheckoutPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { useCart } from '../context/CartContext';
import { createPedido } from '../api/api';
import CheckoutSteps from '../components/CheckoutSteps';

const Checkout = () => {
  const { cartItems, total, clearCart, shippingData } = useCart(); 
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  // DATOS BANCARIOS (Personaliza estos datos)
  const bankDetails = {
      banco: "Banco Nación",
      titular: "Decoud Colchones S.H.",
      cbu: "0110432120043216543210",
      alias: "DECOUD.COLCHONES",
      cuit: "30-12345678-9"
  };

  useEffect(() => {
    if (!shippingData.nombre || !shippingData.telefono) {
        navigate('/confirmar-pedido');
    }
  }, [shippingData, navigate]);

  const generateWhatsAppLink = (pedidoId, metodoPago, isTransfer = false) => {
      const numVendedor = "5493492123456"; 
      let mensaje = `Hola Decoud! 👋 Acabo de realizar un pedido en la web.\n\n`;
      mensaje += `*📦 PEDIDO #${pedidoId}*\n`;
      mensaje += `*Cliente:* ${shippingData.nombre} ${shippingData.apellido}\n`;
      mensaje += `*Método de Pago:* ${metodoPago}\n`;
      mensaje += `*Total:* $${total.toLocaleString('es-AR')}\n\n`;
      
      if (isTransfer) {
          mensaje += `✅ *Ya realicé la transferencia.* En breve les envío el comprobante por aquí.\n\n`;
      }

      mensaje += `*Productos:*\n`;
      cartItems.forEach(item => {
          mensaje += `- ${item.cantidad}x ${item.nombre}\n`;
      });
      mensaje += `\n*Dirección:* ${shippingData.direccion}, ${shippingData.ciudad}\n`;

      return `https://wa.me/${numVendedor}?text=${encodeURIComponent(mensaje)}`;
  };

  const handleFinalizeOrder = async (metodo) => {
    setIsProcessing(true);
    try {
        const orderData = {
            usuario_data: shippingData,
            items: cartItems.map(item => ({
                producto_id: item.id,
                cantidad: item.cantidad,
                precio: item.precio,
            })),
            total: total,
            metodo_pago: metodo,
        };

        const response = await createPedido(orderData);

        if (metodo === 'Mobbex' && response.checkout_url) {
            // Redirigimos al checkout de Mobbex
            window.location.href = response.checkout_url;
        } else {
            // Flujo transferencia
            const waLink = generateWhatsAppLink(response.id, metodo, true);
            clearCart();
            window.open(waLink, '_blank');
            alert("¡Pedido registrado! Por favor enviá el comprobante por WhatsApp.");
            navigate('/');
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error al procesar el pago. Por favor intentá de nuevo.");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="container-centered" style={{ padding: '20px 20px 40px', maxWidth: '800px', transition: 'all 0.3s ease' }}>
       <CheckoutSteps />

       <h2 style={{ color: 'var(--decoud-blue)', marginBottom: '30px', borderBottom: '2px solid var(--decoud-gold)', display: 'inline-block', transition: 'color 0.3s ease' }}>
        3. Finalizar Pago
      </h2>

      <div style={{ backgroundColor: 'var(--content-bg)', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', transition: 'all 0.3s ease' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <p style={{fontSize: '1rem', color: 'var(--color-text-dark)', transition: 'color 0.3s ease'}}>Total a pagar:</p>
              <strong style={{color: 'var(--decoud-gold)', fontSize: '2.5rem', lineHeight: 1, transition: 'color 0.3s ease'}}>
                  ${(total || 0).toLocaleString('es-AR')}
              </strong>
          </div>

          <h3 style={{marginBottom: '20px', fontSize: '1.1rem', color: 'var(--color-text-dark)', textAlign: 'center', transition: 'color 0.3s ease'}}>Elegí cómo querés pagar:</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '15px', marginBottom: '30px' }}>

              {/* MOBBEX */}
              <div
                onClick={() => setSelectedMethod('Mobbex')}
                style={{
                    ...styles.methodCard,
                    borderColor: selectedMethod === 'Mobbex' ? '#6c3ce1' : 'var(--border-color)',
                    backgroundColor: selectedMethod === 'Mobbex' ? 'rgba(108,60,225,0.07)' : 'var(--content-bg)',
                }}>
                  {/* Logo Mobbex */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="40" height="40" rx="8" fill="#6c3ce1"/>
                      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
                        style={{ fill: '#fff', fontSize: '16px', fontWeight: 'bold', fontFamily: 'Arial' }}>
                        M
                      </text>
                    </svg>
                  </div>
                  <span style={{fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-text-dark)'}}>Mobbex</span>
                  <small style={{color: '#6c3ce1', marginTop: '2px'}}>Tarjeta / Débito / QR</small>
              </div>

              {/* TRANSFERENCIA */}
              <div
                onClick={() => setSelectedMethod('Transferencia')}
                style={{
                    ...styles.methodCard,
                    borderColor: selectedMethod === 'Transferencia' ? 'var(--decoud-blue)' : 'var(--border-color)',
                    backgroundColor: selectedMethod === 'Transferencia' ? 'var(--bg-color)' : 'var(--content-bg)',
                }}>
                  <div style={{fontSize: '2rem', marginBottom: '5px'}}>🏦</div>
                  <span style={{fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-text-dark)'}}>Transferencia</span>
                  <small style={{color: '#059669'}}>10% OFF</small>
              </div>
          </div>

          {/* DETALLE MOBBEX */}
          {selectedMethod === 'Mobbex' && (
              <div style={{textAlign: 'center'}}>
                  <div style={{
                      padding: '16px', borderRadius: '10px', marginBottom: '20px',
                      backgroundColor: 'rgba(108,60,225,0.06)', border: '1px solid rgba(108,60,225,0.2)',
                  }}>
                      <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--color-text-dark)', lineHeight: '1.6'}}>
                          Serás redirigido al checkout seguro de <strong>Mobbex</strong> para pagar con
                          tarjeta de crédito, débito, billeteras virtuales o QR.
                      </p>
                  </div>
                  <button
                    onClick={() => handleFinalizeOrder('Mobbex')}
                    disabled={isProcessing}
                    style={styles.btnMobbex}>
                      {isProcessing ? 'Generando checkout...' : 'PAGAR CON MOBBEX'}
                  </button>
              </div>
          )}

          {/* DETALLE TRANSFERENCIA */}
          {selectedMethod === 'Transferencia' && (
              <div style={styles.bankBox}>
                  <h4 style={{margin: '0 0 15px 0', color: 'var(--color-text-dark)'}}>Datos para la transferencia:</h4>
                  <p><strong>Banco:</strong> {bankDetails.banco}</p>
                  <p><strong>Titular:</strong> {bankDetails.titular}</p>
                  <p><strong>CBU:</strong> {bankDetails.cbu}</p>
                  <p><strong>Alias:</strong> <span style={{color: 'var(--decoud-blue)', fontWeight: '800'}}>{bankDetails.alias}</span></p>
                  <p><strong>CUIT:</strong> {bankDetails.cuit}</p>

                  <div style={{marginTop: '20px', padding: '15px', backgroundColor: 'var(--content-bg)', borderRadius: '6px', border: '1px dashed var(--border-color)', transition: 'all 0.3s ease'}}>
                      <p style={{margin: 0, fontSize: '0.85rem', color: 'var(--color-text-dark)', opacity: 0.8}}>
                          Una vez realizada la transferencia, hacé clic en el botón de abajo para enviarnos
                          el comprobante por WhatsApp y confirmar tu pedido.
                      </p>
                  </div>

                  <button
                    onClick={() => handleFinalizeOrder('Transferencia')}
                    disabled={isProcessing}
                    style={styles.btnConfirm}>
                      {isProcessing ? 'Procesando...' : 'YA TRANSFERÍ, ENVIAR AVISO'}
                  </button>
              </div>
          )}

          {!selectedMethod && (
              <p style={{textAlign: 'center', color: 'var(--color-text-dark)', opacity: 0.6, fontStyle: 'italic'}}>Seleccioná un método para continuar</p>
          )}

          <Link to="/confirmar-pedido" style={{ display: 'block', textAlign: 'center', marginTop: '40px', color: 'var(--color-text-dark)', opacity: 0.8, textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s ease' }}>
              ← Volver a datos de envío
          </Link>
      </div>
    </div>
  );
};

const styles = {
    methodCard: {
        border: '2px solid', padding: '20px', borderRadius: '12px', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.3s ease'
    },
    bankBox: {
        backgroundColor: 'var(--bg-color)', padding: '25px', borderRadius: '12px', border: '1px solid var(--border-color)', color: 'var(--color-text-dark)', transition: 'all 0.3s ease'
    },
    btnConfirm: {
        width: '100%', marginTop: '20px', backgroundColor: '#25D366', color: 'white', padding: '16px',
        borderRadius: '8px', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease',
    },
    btnMobbex: {
        width: '100%', backgroundColor: '#6c3ce1', color: 'white', padding: '16px',
        borderRadius: '8px', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease',
    },
};

export default Checkout;