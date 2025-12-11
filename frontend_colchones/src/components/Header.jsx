// src/components/Header.jsx (Modificar)

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- Importar AuthContext

const Header = () => {
    // 1. Obtener datos del usuario y la función de logout del contexto
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    
    // 2. Función para manejar el cierre de sesión
    const handleLogout = () => {
        logoutUser();
        // Opcional: Redirigir al inicio o a la página de login
        navigate('/login'); 
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                
                {/* Logo / Título Principal */}
                <Link to="/" className="text-2xl font-bold text-indigo-700 hover:text-indigo-800">
                    E-Commerce Colchones
                </Link>

                {/* Enlaces de Navegación */}
                <nav className="flex items-center space-x-6">
                    <Link to="/" className="text-gray-600 hover:text-indigo-700 transition duration-150">
                        Catálogo
                    </Link>
                    <Link to="/cart" className="text-gray-600 hover:text-indigo-700 transition duration-150">
                        Carrito
                    </Link>
                    
                    {/* Sección de Autenticación Condicional */}
                    {user ? (
                        // Opción 1: Usuario Logueado
                        <>
                            {/* Mostrar el nombre del usuario */}
                            <span className="text-sm font-semibold text-green-600">
                                Hola, {user.first_name || user.email.split('@')[0]}
                                {/* user.first_name viene del JWT decodificado (asumiendo que lo incluimos en el token)
                                    Si no está, usamos la parte del email antes del @ */}
                            </span>
                            
                            {/* Enlace al Perfil / Historial (Crearemos esta ruta después) */}
                            <Link to="/profile" className="text-gray-600 hover:text-indigo-700 transition duration-150">
                                Perfil
                            </Link>

                            {/* Botón de Logout */}
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded transition duration-150"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        // Opción 2: Usuario No Logueado
                        <>
                            <Link 
                                to="/login" 
                                className="text-gray-600 hover:text-indigo-700 transition duration-150"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link 
                                to="/register" 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-1 px-3 rounded transition duration-150"
                            >
                                Registrarme
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;