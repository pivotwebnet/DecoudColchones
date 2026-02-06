// src/pages/Checkout.jsx
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importamos Link
import { useCart } from '../context/CartContext';
import api from '../api/api';
import CheckoutSteps from '../components/CheckoutSteps';

const Checkout = () => {
  // Eliminamos 'useLocation' porque ahora confiamos en el Contexto (shippingData)
  // Esto permite ir y volver sin perder la información.
  const { cartItems, total, clearCart, shippingData } = useCart(); 
  const navigate = useNavigate();

  // Protección: Si no hay datos cargados en el contexto, volver al paso anterior
  useEffect(() => {
    if (!shippingData.nombre || !shippingData.telefono) {
        navigate('/confirmar-pedido');
    }
  }, [shippingData, navigate]);

  const handleFinalizeOrder = async (metodoPago) => {
    try {
        const orderData = {
            usuario_data: shippingData, // <--- USAMOS LA DATA DEL CONTEXTO
            items: cartItems.map(item => ({ 
                producto_id: item.uniqueId || item.id, 
                cantidad: item.cantidad,
                precio: item.precio 
            })),
            total: total,
            metodo_pago: metodoPago
        };

        console.log("Enviando Pedido:", orderData);

        // AQUÍ VA TU POST AL BACKEND
        // const response = await api.post('/pedidos/crear-pedido/', orderData);
        
        // --- SIMULACIÓN DE ÉXITO ---
        if (true) { 
            let mensaje = "¡Pedido Confirmado!";
            if (metodoPago === 'Transferencia') {
                mensaje += "\n\nTe enviamos los datos bancarios por mail/WhatsApp.";
                mensaje += "\nRecordá que tenés un 10% de descuento.";
            } else {
                mensaje += "\n\nRedirigiendo a Mercado Pago...";
            }
            
            alert(mensaje);
            clearCart();
            navigate('/'); 
        }

    } catch (error) {
        console.error("Error creando pedido", error);
        alert("Hubo un error al procesar el pedido. Intenta nuevamente.");
    }
  };

  return (
    <div className="container-centered" style={{ padding: '20px 20px 40px', maxWidth: '800px' }}>
       
       {/* 1. BARRA DE PASOS (Navegación visual) */}
       <CheckoutSteps />

       <h2 style={{ color: '#1B365D', marginBottom: '30px', borderBottom: '2px solid #D4AF37', display: 'inline-block' }}>
        3. Finalizar Pago
      </h2>

      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          
          {/* Resumen de Datos con opción de EDITAR */}
          <div style={{ marginBottom: '30px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                  <h3 style={{fontSize: '1.1rem', color: '#64748b', margin: 0}}>Datos de facturación:</h3>
                  {/* BOTÓN EDITAR (Vuelve al paso 2) */}
                  <Link to="/confirmar-pedido" style={{fontSize:'0.9rem', color:'#009ee3', textDecoration:'none', fontWeight: 'bold'}}>
                      ✎ Editar
                  </Link>
              </div>

              <p style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#1B365D', margin: '5px 0'}}>
                {shippingData.nombre} {shippingData.apellido}
              </p>
              <p style={{margin: '5px 0'}}>
                  {shippingData.direccion}, {shippingData.ciudad}
              </p>
              <p style={{margin: '5px 0'}}>
                  WhatsApp: <strong>{shippingData.telefono}</strong>
              </p>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <p style={{fontSize: '1rem', color: '#64748b'}}>Total a pagar:</p>
              <strong style={{color: '#D4AF37', fontSize: '2.5rem', lineHeight: 1}}>
                  ${(total || 0).toLocaleString('es-AR')}
              </strong>
          </div>

          <h3 style={{marginBottom: '15px', fontSize: '1rem', color: '#333'}}>Elegí tu forma de pago:</h3>
          
          <div style={{ display: 'grid', gap: '15px' }}>
              {/* Opción 1: Mercado Pago */}
              <button 
                onClick={() => handleFinalizeOrder('Mercado Pago')}
                style={styles.btnMP}>
                  Pagar con Mercado Pago
              </button>

              {/* Opción 2: Transferencia */}
              <button 
                onClick={() => handleFinalizeOrder('Transferencia')}
                style={styles.btnTransf}>
                  Pagar con Transferencia (10% OFF)
              </button>
          </div>
          
          <p style={{ marginTop: '20px', fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center' }}>
            Al confirmar, aceptas que el costo de envío se coordinará posteriormente por WhatsApp.
          </p>

          {/* BOTÓN VOLVER ABAJO */}
          <Link to="/confirmar-pedido" style={{ display: 'block', textAlign: 'center', marginTop: '25px', color: '#64748b', textDecoration: 'none', fontSize: '0.9rem' }}>
              ← Volver a modificar datos
          </Link>
      </div>
    </div>
  );
};

const styles = {
    btnMP: { 
        backgroundColor: '#009ee3', color: 'white', padding: '16px', borderRadius: '8px', 
        border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', 
        transition: 'transform 0.1s'
    },
    btnTransf: { 
        backgroundColor: 'white', color: '#1B365D', padding: '16px', borderRadius: '8px', 
        border: '2px solid #1B365D', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
        transition: 'background 0.2s'
    }
};

export default Checkout;