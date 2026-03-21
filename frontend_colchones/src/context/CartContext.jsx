// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCart = localStorage.getItem('cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Error al leer el carrito local:", error);
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false); // NUEVO: Control del Drawer

    const [shippingData, setShippingData] = useState({
        nombre: '', apellido: '', dni: '', telefono: '', 
        direccion: '', ciudad: '', provincia: 'Santa Fe'
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        if (!product || !product.id) return;

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, cantidad: item.cantidad + product.cantidad }
                        : item
                );
            } else {
                return [...prevItems, { ...product, uniqueId: product.uniqueId || `${product.id}-${Date.now()}` }];
            }
        });
        
        setIsCartOpen(true); // NUEVO: Abrir automáticamente al agregar
    };

    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => (item.uniqueId || item.id) !== id));
    };

    const clearCart = () => setCartItems([]);

    const updateQuantity = (id, amount) => {
        setCartItems(prevItems => 
            prevItems.map(item => {
                if ((item.uniqueId || item.id) === id) {
                    return { ...item, cantidad: Math.max(1, item.cantidad + amount) };
                }
                return item;
            })
        );
    };

    const totalItems = cartItems.reduce((acc, item) => acc + (item.cantidad || 1), 0);
    const calculatedTotal = cartItems.reduce((acc, item) => acc + (item.precio * (item.cantidad || 1)), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            updateQuantity,
            totalItems,
            total: calculatedTotal,
            shippingData, 
            setShippingData,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};