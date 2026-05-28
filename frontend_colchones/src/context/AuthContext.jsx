// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { googleLogin } from '../api/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                return jwtDecode(token);
            } catch (e) {
                return null;
            }
        }
        return null;
    });
    
    const [loading, setLoading] = useState(true);

    // Sincronizar datos reales del usuario desde el backend al iniciar
    useEffect(() => {
        const fetchMe = async () => {
            if (localStorage.getItem('accessToken')) {
                try {
                    const response = await api.get('me/');
                    setUser(response.data);
                } catch (error) {
                    console.error("Error cargando perfil:", error);
                    // Si falla por 401, el interceptor de api.js manejará el refresh o logout
                }
            }
            setLoading(false);
        };
        fetchMe();
    }, []);

    const loginUser = async (email, password) => {
        try {
            const response = await api.post('token/', { 
                username: email, // Usamos email como username
                password: password 
            });

            const { access, refresh } = response.data;
            
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            
            // Obtenemos los datos completos del usuario inmediatamente
            const meResponse = await api.get('me/');
            setUser(meResponse.data);
            return true; 
            
        } catch (error) {
            console.error("Login failed:", error.response?.data);
            throw error.response?.data || { detail: "Error de conexión." };
        }
    };
    
    const registerUser = async (formData) => {
        try {
            const response = await api.post('register/', formData); 
            // Podríamos loguearlo automáticamente aquí si quisiéramos
            return response.data; 
        } catch (error) {
            throw error.response?.data || { detail: "Error al registrar." };
        }
    };

    const loginWithGoogle = async (googleAccessToken) => {
        try {
            const { access, refresh } = await googleLogin(googleAccessToken);
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            const meResponse = await api.get('me/');
            setUser(meResponse.data);
            return true;
        } catch (error) {
            console.error("Google login failed:", error.response?.data);
            throw error.response?.data || { detail: "Error al iniciar sesión con Google." };
        }
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };
    
    const contextData = {
        user,
        loginUser,
        loginWithGoogle,
        logoutUser,
        registerUser,
        loading
    };

    return (
        <AuthContext.Provider value={contextData}>
            {!loading && children}
        </AuthContext.Provider>
    );
};