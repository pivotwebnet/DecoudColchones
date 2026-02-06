// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
    return context;
};

export const CartProvider = ({ children }) => {
    // 1. Carga inicial
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCart = localStorage.getItem('cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Error al leer el carrito local:", error);
            return [];
        }
    });
    const [shippingData, setShippingData] = useState({
        nombre: '', apellido: '', dni: '', telefono: '', 
        direccion: '', ciudad: '', provincia: 'Santa Fe'
    });

    // 2. Guardar en LocalStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // 3. Función AGREGAR
    const addToCart = (product) => {
        if (!product || !product.id) {
            console.error("Intento de agregar producto inválido:", product);
            return;
        }

        setCartItems(prevItems => {
            // Buscamos si ya existe el producto (por ID de variante)
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                // Si existe, sumamos la cantidad
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, cantidad: item.cantidad + product.cantidad }
                        : item
                );
            } else {
                // Si no existe, lo agregamos. 
                // Aseguramos que tenga uniqueId para el manejo en el frontend
                const newItem = {
                    ...product,
                    uniqueId: product.uniqueId || `${product.id}-${Date.now()}`
                };
                return [...prevItems, newItem];
            }
        });
    };

    // 4. Función REMOVER (Corregida para usar uniqueId si existe)
    const removeFromCart = (id) => {
        setCartItems(prevItems => 
            prevItems.filter(item => (item.uniqueId || item.id) !== id)
        );
    };

    // 5. Función LIMPIAR TODO
    const clearCart = () => {
        setCartItems([]);
    };

    // 6. Función ACTUALIZAR CANTIDAD
    const updateQuantity = (id, amount) => {
        setCartItems(prevItems => 
            prevItems.map(item => {
                // Comparamos con uniqueId si es posible, sino id normal
                if ((item.uniqueId || item.id) === id) {
                    const newQuantity = Math.max(1, item.cantidad + amount);
                    return { ...item, cantidad: newQuantity };
                }
                return item;
            })
        );
    };

    // --- CÁLCULOS (Aquí estaba el problema de nombre) ---
    const totalItems = cartItems.reduce((acc, item) => acc + (item.cantidad || 1), 0);
    
    // Cambiamos el nombre de la constante interna para ser claros, 
    // pero lo importante es cómo lo exportamos abajo en el value.
    const calculatedTotal = cartItems.reduce((acc, item) => acc + (item.precio * (item.cantidad || 1)), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            cart: cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            updateQuantity,
            totalItems,
            total: calculatedTotal,
            
            // EXPORTAMOS LA NUEVA DATA
            shippingData, 
            setShippingData 
        }}>
            {children}
        </CartContext.Provider>
    );
};