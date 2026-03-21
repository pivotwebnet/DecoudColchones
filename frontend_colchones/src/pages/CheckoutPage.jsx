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
                precio: item.precio 
            })),
            total: total,
            metodo_pago: metodo
        };

        const response = await createPedido(orderData);
        
        if (metodo === 'Mercado Pago' && response.init_point) {
            // REDIRECCIÓN A MERCADO PAGO
            window.location.href = response.init_point;
        } else {
            // FLUJO TRANSFERENCIA
            const waLink = generateWhatsAppLink(response.id, metodo, true);
            clearCart();
            window.open(waLink, '_blank');
            alert("¡Pedido registrado! Por favor enviá el comprobante por WhatsApp.");
            navigate('/');
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error. Por favor intenta de nuevo.");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="container-centered" style={{ padding: '20px 20px 40px', maxWidth: '800px' }}>
       <CheckoutSteps />

       <h2 style={{ color: '#1B365D', marginBottom: '30px', borderBottom: '2px solid #D4AF37', display: 'inline-block' }}>
        3. Finalizar Pago
      </h2>

      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <p style={{fontSize: '1rem', color: '#64748b'}}>Total a pagar:</p>
              <strong style={{color: '#D4AF37', fontSize: '2.5rem', lineHeight: 1}}>
                  ${(total || 0).toLocaleString('es-AR')}
              </strong>
          </div>

          <h3 style={{marginBottom: '20px', fontSize: '1.1rem', color: '#333', textAlign: 'center'}}>Elegí cómo querés pagar:</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
              <div 
                onClick={() => setSelectedMethod('MP')}
                style={{...styles.methodCard, borderColor: selectedMethod === 'MP' ? '#009ee3' : '#e2e8f0', backgroundColor: selectedMethod === 'MP' ? '#f0f9ff' : 'white'}}>
                  <img src="https://logotipous.com/wp-content/uploads/2021/11/mercado-pago-logo.png" alt="MP" style={{height: '30px', marginBottom: '10px'}} />
                  <span style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Mercado Pago</span>
              </div>

              <div 
                onClick={() => setSelectedMethod('Transferencia')}
                style={{...styles.methodCard, borderColor: selectedMethod === 'Transferencia' ? '#1B365D' : '#e2e8f0', backgroundColor: selectedMethod === 'Transferencia' ? '#f8fafc' : 'white'}}>
                  <div style={{fontSize: '2rem', marginBottom: '5px'}}>🏦</div>
                  <span style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Transferencia</span>
                  <small style={{color: '#059669'}}>10% OFF</small>
              </div>
          </div>

          {/* DETALLES SEGÚN SELECCIÓN */}
          {selectedMethod === 'Transferencia' && (
              <div style={styles.bankBox}>
                  <h4 style={{margin: '0 0 15px 0'}}>Datos para la transferencia:</h4>
                  <p><strong>Banco:</strong> {bankDetails.banco}</p>
                  <p><strong>Titular:</strong> {bankDetails.titular}</p>
                  <p><strong>CBU:</strong> {bankDetails.cbu}</p>
                  <p><strong>Alias:</strong> <span style={{color: '#1B365D', fontWeight: '800'}}>{bankDetails.alias}</span></p>
                  <p><strong>CUIT:</strong> {bankDetails.cuit}</p>
                  
                  <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '6px', border: '1px dashed #cbd5e1'}}>
                      <p style={{margin: 0, fontSize: '0.85rem', color: '#64748b'}}>
                          Una vez realizada la transferencia, hacé clic en el botón de abajo para enviarnos el comprobante por WhatsApp y confirmar tu pedido.
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

          {selectedMethod === 'MP' && (
              <div style={{textAlign: 'center'}}>
                  <p style={{fontSize: '0.9rem', color: '#64748b', marginBottom: '20px'}}>
                      Serás redirigido a la plataforma segura de Mercado Pago para completar tu pago con tarjeta o dinero en cuenta.
                  </p>
                  <button 
                    onClick={() => handleFinalizeOrder('Mercado Pago')}
                    disabled={isProcessing}
                    style={styles.btnMP}>
                      {isProcessing ? 'Cargando...' : 'PAGAR CON MERCADO PAGO'}
                  </button>
              </div>
          )}

          {!selectedMethod && (
              <p style={{textAlign: 'center', color: '#94a3b8', fontStyle: 'italic'}}>Selecciona un método para continuar</p>
          )}

          <Link to="/confirmar-pedido" style={{ display: 'block', textAlign: 'center', marginTop: '40px', color: '#64748b', textDecoration: 'none', fontSize: '0.9rem' }}>
              ← Volver a datos de envío
          </Link>
      </div>
    </div>
  );
};

const styles = {
    methodCard: {
        border: '2px solid', padding: '20px', borderRadius: '12px', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.2s'
    },
    bankBox: {
        backgroundColor: '#f8fafc', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#334155'
    },
    btnConfirm: {
        width: '100%', marginTop: '20px', backgroundColor: '#25D366', color: 'white', padding: '16px',
        borderRadius: '8px', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer'
    },
    btnMP: {
        width: '100%', backgroundColor: '#009ee3', color: 'white', padding: '16px',
        borderRadius: '8px', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer'
    }
};

export default Checkout;