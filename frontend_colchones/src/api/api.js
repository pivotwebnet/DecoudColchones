// src/api/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', 
  timeout: 5000,
});

// Interceptor: Añade el token de acceso a cada solicitud, si existe.
api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken'); // Obtener el token del Local Storage
    if (token) {
        // Formato estándar JWT: Authorization: Bearer <token>
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});
export default api;

// ¡CRÍTICO! Usar 'export' aquí
export const getProductos = async () => {   
  try {
    const response = await api.get('colchones/'); 
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};

// ¡CRÍTICO! Usar 'export' aquí
export const getProductoBySlug = async (slug) => { 
  try {
    const response = await api.get(`colchones/${slug}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener producto con slug ${slug}:`, error);
    throw error;
  }
};

// ¡CRÍTICO! Usar 'export' aquí (si ya la definiste)
export const createPedido = async (checkoutData) => { 
  // ...
};

// Si usaste 'export default' en algún lugar, revisa su impacto.
// Para múltiples funciones, lo mejor es usar 'export const' o 'export function'.