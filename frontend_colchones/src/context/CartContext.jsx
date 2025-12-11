// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // 1. Iniciar estado leyendo de LocalStorage (si existe)
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCart = localStorage.getItem('decoud_cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Error al leer carrito:", error);
            return [];
        }
    });

    // 2. Guardar en LocalStorage cada vez que el carrito cambie
    useEffect(() => {
        localStorage.setItem('decoud_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Calcular Total
    const total = cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    // Función: Agregar Item
    const addToCart = (product, variant, quantity) => {
        setCartItems(prevItems => {
            // Creamos un ID único combinando producto + variante para diferenciarlos
            const uniqueId = `${product.id}-${variant.id}`;
            
            const existingItem = prevItems.find(item => item.uniqueId === uniqueId);

            if (existingItem) {
                // Si ya existe, sumamos cantidad
                return prevItems.map(item => 
                    item.uniqueId === uniqueId 
                        ? { ...item, cantidad: item.cantidad + quantity }
                        : item
                );
            } else {
                // Si es nuevo, lo agregamos con formato limpio
                return [...prevItems, {
                    id: product.id, // ID del producto real (para backend)
                    uniqueId: uniqueId, // ID interno del carrito
                    variantId: variant.id,
                    nombre: product.nombre,
                    medida: variant.medida,
                    precio: parseFloat(variant.precio),
                    imagen: product.imagen, // Asegúrate de que tu producto tenga este campo o usa placeholder
                    cantidad: quantity
                }];
            }
        });
    };

    // Función: Eliminar Item
    const removeFromCart = (uniqueId) => {
        setCartItems(prevItems => prevItems.filter(item => item.uniqueId !== uniqueId));
    };

    // Función: Vaciar Carrito
    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            clearCart, 
            total 
        }}>
            {children}
        </CartContext.Provider>
    );
};