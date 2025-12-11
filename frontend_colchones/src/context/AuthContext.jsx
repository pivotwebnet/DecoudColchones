
// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api'; // Importamos la instancia de Axios modificada
import { jwtDecode } from 'jwt-decode'; // Necesitas instalar esta librería!

// Instalar el decodificador de tokens: npm install jwt-decode
// Nota: en React 19, podrías usar useMemo o useReducer para optimizar esto.

// 1. Crear el Contexto
const AuthContext = createContext();

// Hook personalizado
export const useAuth = () => {
    return useContext(AuthContext);
};

// 2. Crear el Proveedor (Provider) del Contexto
export const AuthProvider = ({ children }) => {
    
    // Inicializar el estado de la autenticación
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem('accessToken') ? {
            access: localStorage.getItem('accessToken'),
            refresh: localStorage.getItem('refreshToken')
        } : null
    );
    
    const [user, setUser] = useState(() => 
        localStorage.getItem('accessToken') ? jwtDecode(localStorage.getItem('accessToken')) : null
    );
    const [loading, setLoading] = useState(false);


    // ------------------------------------------
    // Funciones de Autenticación
    // ------------------------------------------

    const loginUser = async (email, password) => {
        setLoading(true);
        try {
            // Llama al endpoint de tokens de Django (Login)
            const response = await api.post('token/', { 
                username: email, // Django espera 'username', usamos el email
                password: password 
            });

            const data = response.data;
            
            // Almacenar tokens y decodificar el usuario
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            
            // Persistir tokens en el Local Storage
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            setLoading(false);
            return true; 
            
        } catch (error) {
            setLoading(false);
            // Manejo de errores de login (ej: credenciales inválidas)
            console.error("Error al iniciar sesión:", error.response?.data);
            throw error.response?.data || { detail: "Error de red o servidor." };
        }
    };
    
    const registerUser = async (formData) => {
        setLoading(true);
        try {
            // Llama al endpoint de registro de la app users
            const response = await api.post('register/', formData); 
            setLoading(false);
            // Después del registro exitoso, se podría llamar a loginUser(email, password)
            return response.data; 
        } catch (error) {
            setLoading(false);
            console.error("Error al registrar:", error.response?.data);
            throw error.response?.data || { detail: "Error de red o servidor." };
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Redirigir si es necesario
    };
    
    // Contexto de la Aplicación
    const contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
        registerUser: registerUser,
        loading: loading,
        // Aquí iría la lógica de refresh token, si es necesaria
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};