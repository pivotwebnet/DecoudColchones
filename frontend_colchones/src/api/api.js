// src/api/api.js
import axios from 'axios';

// 1. URL DINÁMICA
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL, 
  timeout: 5000,
});

// Interceptor para Token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;

// --- AQUÍ ESTÁ EL CAMBIO CLAVE ---
export const getProductos = async (params = {}) => {   
  try {
    // La URL base es /colchones/
    const response = await api.get('/colchones/', { params }); 
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};

export const getProductoBySlug = async (slug) => { 
  try {
    const response = await api.get(`/colchones/${slug}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener producto con slug ${slug}:`, error);
    throw error;
  }
};

export const createPedido = async (pedidoData) => {
    try {
        const response = await api.post('/pedidos/', pedidoData);
        console.log("Pedido guardado en BD:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error.response?.data || error.message);
        throw error;
    }
};

export const getBanners = async () => {
    try {
        const response = await api.get('/banners/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener banners:", error);
        return []; 
    }
};

export const getCategorias = async () => {
    try {
        const response = await api.get('/categorias/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        return []; 
    }
};

export const getLineas = async () => {
    try {
        const response = await api.get('/lineas/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener líneas:", error);
        return [];
    }
};