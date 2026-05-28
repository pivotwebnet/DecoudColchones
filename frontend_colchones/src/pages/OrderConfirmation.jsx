// src/pages/OrderConfirmation.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';

const FieldError = ({ msg }) =>
  msg ? (
    <span style={{
      color: '#ef4444', fontSize: '0.8rem', marginTop: '-8px',
      display: 'flex', alignItems: 'center', gap: '4px'
    }}>
      <span style={{
        width: 16, height: 16, borderRadius: '50%', background: '#ef4444',
        color: '#fff', fontSize: '0.7rem', fontWeight: 'bold',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>!</span>
      {msg}
    </span>
  ) : null;

const OrderConfirmation = () => {
  const { cartItems, total, shippingData, setShippingData } = useCart();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const clearError = (name) => {
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
    clearError(e.target.name);
  };

  const handleNumericChange = (e, maxLen) => {
    const soloNumeros = e.target.value.replace(/\D/g, '').slice(0, maxLen);
    setShippingData({ ...shippingData, [e.target.name]: soloNumeros });
    clearError(e.target.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    const dni = shippingData.dni || '';
    if (dni.length < 8 || dni.length > 11)
      newErrors.dni = 'Debe tener entre 8 y 11 dígitos numéricos.';

    const tel = shippingData.telefono || '';
    if (tel.length !== 10)
      newErrors.telefono = 'Debe tener exactamente 10 dígitos (sin 0 ni 15).';

    if (shippingData.provincia === 'Otra' && !shippingData.otraProvincia?.trim())
      newErrors.otraProvincia = 'Por favor indicá de qué provincia sos.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) return <div className="container-centered" style={{padding:'50px'}}>Carrito vacío</div>;

  return (
    <div className="container-centered" style={{ padding: '20px 20px 60px', transition: 'all 0.3s ease' }}>
      <CheckoutSteps />

      <h2 style={{ color: 'var(--decoud-blue)', borderBottom: '2px solid var(--decoud-gold)', display: 'inline-block', marginBottom: '30px', transition: 'color 0.3s ease' }}>
        Datos de Envío
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 'clamp(20px, 4vw, 40px)' }}>
        
        {/* COLUMNA 1: FORMULARIO */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(140px, 100%), 1fr))', gap: '15px' }}>
                <input required name="nombre" placeholder="Nombre" value={shippingData.nombre} onChange={handleChange} className="form-input" />
                <input required name="apellido" placeholder="Apellido" value={shippingData.apellido} onChange={handleChange} className="form-input" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <input
                required
                name="dni"
                placeholder="DNI / CUIL (8 a 11 dígitos)"
                value={shippingData.dni || ''}
                onChange={(e) => handleNumericChange(e, 11)}
                inputMode="numeric"
                className="form-input"
                style={errors.dni ? { borderColor: '#ef4444' } : {}}
              />
              <FieldError msg={errors.dni} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <input
                required
                name="telefono"
                type="tel"
                placeholder="Teléfono WhatsApp (10 dígitos, sin 0 ni 15)"
                value={shippingData.telefono || ''}
                onChange={(e) => handleNumericChange(e, 10)}
                inputMode="numeric"
                className="form-input"
                style={errors.telefono ? { borderColor: '#ef4444' } : {}}
              />
              <FieldError msg={errors.telefono} />
            </div>
            <input required name="direccion" placeholder="Dirección exacta (Calle y altura)" value={shippingData.direccion} onChange={handleChange} className="form-input" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(140px, 100%), 1fr))', gap: '15px' }}>
                <input required name="ciudad" placeholder="Ciudad (Ej: Rafaela)" value={shippingData.ciudad} onChange={handleChange} className="form-input" />
                <select required name="provincia" value={shippingData.provincia || 'Santa Fe'} onChange={handleChange} className="form-input" style={{ backgroundColor: 'var(--content-bg)', color: 'var(--color-text-dark)' }}>
                    <option value="Santa Fe">Santa Fe</option>
                    <option value="Córdoba">Córdoba</option>
                    <option value="Entre Ríos">Entre Ríos</option>
                    <option value="Buenos Aires">Buenos Aires</option>
                    <option value="Otra">Otra provincia...</option>
                </select>
            </div>
            {shippingData.provincia === 'Otra' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <input
                      required
                      name="otraProvincia"
                      placeholder="¿De qué provincia sos?"
                      value={shippingData.otraProvincia || ''}
                      onChange={handleChange}
                      className="form-input"
                      style={{ borderColor: errors.otraProvincia ? '#ef4444' : 'var(--decoud-gold)' }}
                  />
                  <FieldError msg={errors.otraProvincia} />
                </div>
            )}

            {/* --- AVISO DE ENVÍO DESTACADO --- */}
            <div className="shipping-notice">
                <div className="icon-box">🚚</div>
                <div>
                    <h4 style={{ margin: '0 0 5px 0', color: 'var(--color-text-dark)', transition: 'color 0.3s ease' }}>Información sobre el Envío</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-dark)', opacity: 0.8, lineHeight: '1.4', transition: 'color 0.3s ease' }}>
                        El costo de envío <strong>se coordina después de la compra</strong>. <br/>
                        Al finalizar el pago, nos contactaremos a tu WhatsApp para gestionar el transporte más conveniente y seguro para tu zona.
                    </p>
                </div>
            </div>

            {/* BOTONERA CON ANIMACIONES */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
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
            <div style={{ backgroundColor: 'var(--bg-color)', padding: '25px', borderRadius: '8px', border: '1px solid var(--border-color)', transition: 'all 0.3s ease' }}>
                <h3 style={{ marginTop: 0, color: 'var(--decoud-blue)', transition: 'color 0.3s ease' }}>Tu Pedido</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--decoud-gold)', margin: '10px 0', transition: 'color 0.3s ease' }}>
                    ${(total || 0).toLocaleString('es-AR')}
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-dark)', opacity: 0.7, marginBottom: '15px', transition: 'color 0.3s ease' }}>
                    {cartItems.length} productos seleccionados
                </p>
                <ul style={{ paddingLeft: '20px', color: 'var(--color-text-dark)', opacity: 0.8, fontSize: '0.9rem', maxHeight: '300px', overflowY: 'auto', transition: 'color 0.3s ease' }}>
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
            border: 1px solid var(--border-color);
            background-color: var(--content-bg);
            color: var(--color-text-dark);
            font-size: 1rem;
            width: 100%;
            box-sizing: border-box;
            transition: all 0.3s ease;
            outline: none;
        }
        .form-input:focus {
            border-color: var(--decoud-blue);
            box-shadow: 0 0 0 3px rgba(27, 54, 93, 0.1);
        }

        /* Caja de Aviso de Envío */
        .shipping-notice {
            background-color: rgba(14, 165, 233, 0.1);
            border: 1px solid var(--decoud-blue);
            border-left: 5px solid #0ea5e9; /* Azul informativo */
            padding: 15px;
            border-radius: 8px;
            margin-top: 10px;
            display: flex;
            gap: 15px;
            align-items: start;
            transition: all 0.3s ease;
        }
        .icon-box {
            font-size: 1.5rem;
            background: var(--content-bg);
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        }

        /* Botones Base */
        .btn-primary {
            flex: 1;
            background-color: var(--decoud-blue);
            color: var(--content-bg);
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
            background-color: var(--content-bg);
            color: var(--color-text-dark);
            padding: 15px;
            border-radius: 6px;
            border: 1px solid var(--border-color);
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
            transition: transform 0.1s ease, box-shadow 0.2s ease, background-color 0.3s, color 0.3s, border-color 0.3s;
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
            opacity: 0.9;
        }
        .btn-secondary:hover {
            border-color: var(--decoud-blue);
            background-color: var(--bg-color);
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmation;