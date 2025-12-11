// src/pages/CartPage.jsx

import React from 'react';
import { useCart } from '../context/CartContext'; 
import { Link } from 'react-router-dom';

const CartPage = () => {
    // Necesitamos usar el hook para evitar errores, aunque el resto del código esté vacío
    const { cartItems, cartTotal } = useCart(); 
    
    // Contenido temporal básico
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>🛒 Página del Carrito</h2>
            {cartItems.length === 0 ? (
                <>
                    <p>El carrito está vacío.</p>
                    <Link to="/colchones">Ir a comprar</Link>
                </>
            ) : (
                <p>Total de ítems: {cartItems.length}. Total a pagar: ${cartTotal.toFixed(2)}</p>
                // Aquí iría el código completo de la vista del carrito
            )}
        </div>
    );
};

export default CartPage;