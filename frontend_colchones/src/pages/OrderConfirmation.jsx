// src/pages/OrderConfirmation.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';

const OrderConfirmation = () => {
  const { cartItems, total, shippingData, setShippingData } = useCart();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (shippingData.telefono.length < 6) {
        alert("Por favor ingresa un teléfono válido para el envío.");
        return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) return <div className="container-centered" style={{padding:'50px'}}>Carrito vacío</div>;

  return (
    <div className="container-centered" style={{ padding: '20px 20px 60px' }}>
      
      <CheckoutSteps />

      <h2 style={{ color: '#1B365D', borderBottom: '2px solid #D4AF37', display: 'inline-block', marginBottom: '30px' }}>
        Datos de Envío
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        
        {/* COLUMNA 1: FORMULARIO */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input required name="nombre" placeholder="Nombre" value={shippingData.nombre} onChange={handleChange} className="form-input" />
                <input required name="apellido" placeholder="Apellido" value={shippingData.apellido} onChange={handleChange} className="form-input" />
            </div>
            <input required name="dni" placeholder="DNI / CUIL" value={shippingData.dni} onChange={handleChange} className="form-input" />
            <input required name="telefono" type="tel" placeholder="Teléfono (WhatsApp Obligatorio)" value={shippingData.telefono} onChange={handleChange} className="form-input" />
            <input required name="direccion" placeholder="Dirección exacta (Calle y altura)" value={shippingData.direccion} onChange={handleChange} className="form-input" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input required name="ciudad" placeholder="Ciudad (Ej: Rafaela)" value={shippingData.ciudad} onChange={handleChange} className="form-input" />
                <select required name="provincia" value={shippingData.provincia || 'Santa Fe'} onChange={handleChange} className="form-input" style={{ backgroundColor: 'white' }}>
                    <option value="Santa Fe">Santa Fe</option>
                    <option value="Córdoba">Córdoba</option>
                    <option value="Entre Ríos">Entre Ríos</option>
                    <option value="Buenos Aires">Buenos Aires</option>
                    <option value="Otra">Otra provincia...</option>
                </select>
            </div>

            {/* --- AVISO DE ENVÍO DESTACADO --- */}
            <div className="shipping-notice">
                <div className="icon-box">🚚</div>
                <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>Información sobre el Envío</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: '1.4' }}>
                        El costo de envío <strong>se coordina después de la compra</strong>. <br/>
                        Al finalizar el pago, nos contactaremos a tu WhatsApp para gestionar el transporte más conveniente y seguro para tu zona.
                    </p>
                </div>
            </div>

            {/* BOTONERA CON ANIMACIONES */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <Link to="/carrito" className="btn-secondary animated-btn">
                    ← Volver al Carrito
                </Link>
                <button type="submit" className="btn-primary animated-btn">
                    Confirmar y Pagar →
                </button>
            </div>
        </form>

        {/* COLUMNA 2: RESUMEN (Sticky para que siga al usuario) */}
        <div style={{ height: 'fit-content', position: 'sticky', top: '20px' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ marginTop: 0, color: '#1B365D' }}>Tu Pedido</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#D4AF37', margin: '10px 0' }}>
                    ${(total || 0).toLocaleString('es-AR')}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '15px' }}>
                    {cartItems.length} productos seleccionados
                </p>
                <ul style={{ paddingLeft: '20px', color: '#666', fontSize: '0.9rem', maxHeight: '300px', overflowY: 'auto' }}>
                    {cartItems.map(item => (
                        <li key={item.uniqueId} style={{ marginBottom: '8px' }}>
                            <strong>{item.nombre}</strong> <br/>
                            <span style={{fontSize: '0.85rem'}}>x{item.cantidad} - {item.medida}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>

      {/* ESTILOS CSS EN LÍNEA PARA ANIMACIONES Y DISEÑO */}
      <style>{`
        .form-input {
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #cbd5e1;
            font-size: 1rem;
            width: 100%;
            box-sizing: border-box;
            transition: border-color 0.2s, box-shadow 0.2s;
            outline: none;
        }
        .form-input:focus {
            border-color: #1B365D;
            box-shadow: 0 0 0 3px rgba(27, 54, 93, 0.1);
        }

        /* Caja de Aviso de Envío */
        .shipping-notice {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            border-left: 5px solid #0ea5e9; /* Azul informativo */
            padding: 15px;
            border-radius: 8px;
            margin-top: 10px;
            display: flex;
            gap: 15px;
            align-items: start;
        }
        .icon-box {
            font-size: 1.5rem;
            background: white;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        /* Botones Base */
        .btn-primary {
            flex: 1;
            background-color: #1B365D;
            color: white;
            padding: 15px;
            border-radius: 6px;
            border: none;
            font-size: 1.1rem;
            cursor: pointer;
            font-weight: bold;
            text-align: center;
        }
        .btn-secondary {
            flex: 1;
            background-color: white;
            color: #64748b;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #cbd5e1;
            font-size: 1rem;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 500;
        }

        /* Animaciones de Botones */
        .animated-btn {
            transition: transform 0.1s ease, box-shadow 0.2s ease, background-color 0.2s;
        }
        .animated-btn:hover {
            transform: translateY(-2px); /* Se levanta un poquito */
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .animated-btn:active {
            transform: translateY(0); /* Vuelve al lugar al hacer click */
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        /* Hover específico por color */
        .btn-primary:hover {    
            background-color: #244475; /* Un azul un poco más claro */
        }
        .btn-secondary:hover {
            border-color: #94a3b8;
            color: #334155;
            background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmation;