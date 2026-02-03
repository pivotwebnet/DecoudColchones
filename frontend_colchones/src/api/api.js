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
    const response = await api.get('/colchones/'); 
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};

// ¡CRÍTICO! Usar 'export' aquí
export const getProductoBySlug = async (slug) => { 
  try {
    const response = await api.get(`/colchones/${slug}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener producto con slug ${slug}:`, error);
    throw error;
  }
};

// Función para crear el pedido en el backend
export const createPedido = async (pedidoData) => {
    try {
        // AHORA SÍ: Hacemos la petición POST real a Django
        // Django espera recibir los datos en la URL /api/pedidos/
        const response = await api.post('/pedidos/', pedidoData);
        
        console.log("Pedido guardado en BD:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error creating order:", error.response?.data || error.message);
        throw error; // Lanzamos el error para que el CheckoutPage lo detecte
    }
};

export const getBanners = async () => {
    try {
        const response = await api.get('/banners/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener banners:", error);
        return []; // Si falla, devuelve array vacío
    }
};