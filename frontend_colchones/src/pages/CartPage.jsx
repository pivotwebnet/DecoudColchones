// src/pages/CartPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { cartItems, removeFromCart, total } = useCart();
    
    // Formateador de moneda argentina
    const formatPrice = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);

    if (cartItems.length === 0) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
                <h2 style={{ color: 'var(--color-text-dark)', marginBottom: '20px', transition: 'color 0.3s ease' }}>Tu carrito está vacío</h2>
                <Link to="/colchones" className="btn-primary">Ir al Catálogo</Link>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 0', transition: 'background-color 0.3s ease' }}>
            <div className="container-centered">
                <h1 style={{ marginBottom: '30px', fontSize: 'clamp(1.4rem, 4vw, 2rem)', color: 'var(--decoud-blue)', transition: 'color 0.3s ease' }}>Tu Carrito</h1>

                <div style={styles.gridContainer}>
                    {/* Lista de Items */}
                    <div style={styles.itemsColumn}>
                        {cartItems.map((item) => (
                            <div key={item.uniqueId} style={styles.itemCard}>
                                <div style={styles.itemImage}>
                                    {item.imagen ? <img src={item.imagen} alt={item.nombre} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span>IMG</span>}
                                </div>
                                <div style={styles.itemInfo}>
                                    <h3 style={styles.itemName}>{item.nombre}</h3>
                                    <p style={styles.itemVariant}>Medida: {item.medida}</p>
                                    <button onClick={() => removeFromCart(item.uniqueId)} style={styles.removeBtn}>Eliminar</button>
                                </div>
                                <div style={styles.itemMeta}>
                                    <span style={styles.quantity}>x{item.cantidad}</span>
                                    <span style={styles.price}>{formatPrice(item.precio * item.cantidad)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resumen */}
                    <div style={styles.summaryColumn}>
                        <div style={styles.summaryCard}>
                            <h3 style={styles.summaryTitle}>Resumen</h3>
                            <div style={styles.summaryRow}><span>Subtotal</span><span>{formatPrice(total)}</span></div>
                            <div style={styles.summaryRow}><span>Envío</span><span style={{ color: 'var(--color-success)' }}>A coordinar</span></div>
                            <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid var(--border-color)' }} />
                            <div style={styles.summaryRowTotal}><span>Total</span><span>{formatPrice(total)}</span></div>
                            
                            {/* --- CAMBIO AQUÍ: --- */}
                            {/* Antes iba a /checkout, ahora va a /confirmar-pedido */}
                            <Link 
                                to="/confirmar-pedido" 
                                className="btn-primary" 
                                style={{ display: 'block', textAlign: 'center', marginTop: '20px', width: '100%', boxSizing: 'border-box' }}
                            >
                                CONTINUAR COMPRA
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 'clamp(15px, 3vw, 30px)', alignItems: 'start' },
    itemsColumn: { width: '100%' },
    itemCard: { display: 'flex', alignItems: 'center', backgroundColor: 'var(--content-bg)', padding: '20px', borderRadius: '8px', marginBottom: '15px', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'background-color 0.3s ease, border-color 0.3s ease' },
    itemImage: { width: '80px', height: '80px', backgroundColor: 'var(--border-color)', borderRadius: '6px', marginRight: '20px', overflow:'hidden', flexShrink: 0, transition: 'background-color 0.3s ease' },
    itemInfo: { flex: 1 },
    itemName: { fontSize: '1.1rem', margin: '0 0 5px 0', color: 'var(--decoud-blue)', fontWeight: '600', transition: 'color 0.3s ease' },
    itemVariant: { fontSize: '0.9rem', color: '#64748b', margin: 0 },
    removeBtn: { background: 'none', border: 'none', color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer', padding: 0, marginTop: '8px', textDecoration: 'underline' },
    itemMeta: { textAlign: 'right', minWidth: '100px' },
    quantity: { display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' },
    price: { display: 'block', fontSize: '1.2rem', fontWeight: 'bold', color: '#D4AF37' }, // Precio en Dorado Decoud
    summaryColumn: { width: '100%' },
    summaryCard: { backgroundColor: 'var(--content-bg)', padding: '30px', borderRadius: '8px', border: '1px solid var(--border-color)', position: 'sticky', top: '100px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', transition: 'background-color 0.3s ease, border-color 0.3s ease' },
    summaryTitle: { fontSize: '1.3rem', marginBottom: '20px', color: 'var(--decoud-blue)', borderBottom: '2px solid #D4AF37', paddingBottom: '10px', display: 'inline-block', transition: 'color 0.3s ease' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '1rem', color: 'var(--color-text-dark)', transition: 'color 0.3s ease' },
    summaryRowTotal: { display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--decoud-blue)', marginTop: '10px', transition: 'color 0.3s ease' }
};

export default CartPage;