// src/context/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

// 1. Crear el Contexto
const CartContext = createContext();

// Hook personalizado para usar el contexto fácilmente
export const useCart = () => {
    return useContext(CartContext);
};

// 2. Crear el Proveedor (Provider) del Contexto
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Función para agregar un producto (con su variante) al carrito
    const addItem = (product, variant, quantity) => {
        const itemIdentifier = `${product.id}-${variant.id}`;
        
        setCartItems(prevItems => {
            // Verificar si la variante ya existe en el carrito
            const existingItem = prevItems.find(item => item.id === itemIdentifier);

            if (existingItem) {
                // Si existe, actualiza la cantidad
                return prevItems.map(item =>
                    item.id === itemIdentifier
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Si no existe, añade el nuevo ítem
                const newItem = {
                    id: itemIdentifier,
                    product_id: product.id,
                    product_name: product.nombre,
                    variant_id: variant.id,
                    variant_description: `${variant.medida} - ${variant.altura}`,
                    price: parseFloat(variant.precio),
                    quantity: quantity,
                    max_stock: variant.stock,
                };
                return [...prevItems, newItem];
            }
        });
    };

    // Función para calcular el total
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const contextValue = {
        cartItems,
        addItem,
        cartTotal,
        cartCount,
        // Aquí puedes añadir removeItem, updateItemQuantity, clearCart, etc.
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};