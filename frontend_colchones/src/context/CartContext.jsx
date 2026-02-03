// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
    return context;
};

export const CartProvider = ({ children }) => {
    // 1. Carga inicial segura (evita errores con datos viejos)
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCart = localStorage.getItem('cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Error al leer el carrito local:", error);
            return [];
        }
    });

    // 2. Guardar en LocalStorage cada vez que cambia el carrito
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // 3. Función AGREGAR (Blindada contra errores)
    const addToCart = (product) => {
        if (!product || !product.id) {
            console.error("Intento de agregar producto inválido:", product);
            return;
        }

        setCartItems(prevItems => {
            // Buscamos si ya existe el ID
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                // Si existe, sumamos la cantidad
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, cantidad: item.cantidad + product.cantidad }
                        : item
                );
            } else {
                // Si no existe, lo agregamos
                return [...prevItems, product];
            }
        });
    };

    // 4. Función REMOVER
    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    // 5. Función LIMPIAR TODO
    const clearCart = () => {
        setCartItems([]);
    };

    // 6. Función ACTUALIZAR CANTIDAD (+ / -)
    const updateQuantity = (id, amount) => {
        setCartItems(prevItems => 
            prevItems.map(item => {
                if (item.id === id) {
                    const newQuantity = Math.max(1, item.cantidad + amount);
                    return { ...item, cantidad: newQuantity };
                }
                return item;
            })
        );
    };

    // Cálculos automáticos
    const totalItems = cartItems.reduce((acc, item) => acc + (item.cantidad || 1), 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.precio * (item.cantidad || 1)), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            updateQuantity,
            totalItems,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};