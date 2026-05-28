// src/api/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL, 
  timeout: 8000,
});

// INTERCEPTOR DE PETICIÓN: Añade el token si existe
api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

// INTERCEPTOR DE RESPUESTA: Maneja la expiración del token (401)
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Si el error es 401 y no hemos reintentado ya...
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    // Intentamos obtener un nuevo access token
                    const response = await axios.post(`${API_URL}/token/refresh/`, {
                        refresh: refreshToken
                    });

                    const { access } = response.data;
                    localStorage.setItem('accessToken', access);

                    // Reintentamos la petición original con el nuevo token
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // Si el refresh token también expiró, cerramos sesión
                    console.error("Sesión expirada totalmente.");
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// ENDPOINTS DE PRODUCTOS
export const getProductos = async (params = {}) => {   
    const response = await api.get('/colchones/', { params }); 
    return response.data;
};

export const getProductoBySlug = async (slug) => { 
    const response = await api.get(`/colchones/${slug}/`);
    return response.data;
};

// ENDPOINTS DE USUARIOS
export const getCategorias = async () => {
    const response = await api.get('/categorias/');
    return response.data;
};

export const getLineas = async () => {
    const response = await api.get('/lineas/');
    return response.data;
};

export const createPedido = async (pedidoData) => {
    const response = await api.post('/crear-pedido/', pedidoData);
    return response.data;
};

export const getBanners = async () => {
    const response = await api.get('/banners/');
    return response.data;
};

export const googleLogin = async (accessToken) => {
    const response = await api.post('/auth/google/', { access_token: accessToken });
    return response.data;
};