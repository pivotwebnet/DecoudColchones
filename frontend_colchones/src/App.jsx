// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Páginas del E-commerce
import HomePage from './pages/HomePage';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage'; // Asegúrate de crear este componente

// Páginas de Autenticación y Usuario
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage'; // Asegúrate de crear este componente/placeholder

// Componente Wrapper: Aplica el estilo de fondo blanco y centrado
const ContentWrapper = ({ element: Component, ...rest }) => (
    // Aplicamos la clase CSS global ".content-area" para el fondo blanco con sombra.
    // Esto se centra sobre el degradado azul oscuro definido en index.css (body).
    <div className="content-area">
        <Component {...rest} />
    </div>
);


const App = () => {
    
    // Lista de componentes a importar para el ContentWrapper
    const pages = {
        ProductList,
        ProductDetail,
        CartPage,
        CheckoutPage,
        LoginPage,
        RegisterPage,
        ProfilePage
    };

    return (
        <>
            <Header />
            
            {/* El elemento <main> envuelve la aplicación, permitiendo que el fondo degradado del <body> se vea */}
            <main style={{ flexGrow: 1, display: 'flex' }}> 
                <Routes>
                    
                    {/* 1. Ruta Especial: HomePage (Permanece fuera del ContentWrapper para usar el degrade en el fondo principal) */}
                    <Route path="/" element={<HomePage />} />
                    
                    {/* 2. Rutas Principales del E-commerce (Usan ContentWrapper) */}
                    <Route path="/colchones" element={<ContentWrapper element={pages.ProductList} />} />
                    <Route path="/colchones/:slug" element={<ContentWrapper element={pages.ProductDetail} />} />
                    <Route path="/carrito" element={<ContentWrapper element={pages.CartPage} />} />
                    <Route path="/checkout" element={<ContentWrapper element={pages.CheckoutPage} />} />

                    {/* 3. Rutas de Autenticación y Perfil (Usan ContentWrapper) */}
                    <Route path="/login" element={<ContentWrapper element={pages.LoginPage} />} />
                    <Route path="/register" element={<ContentWrapper element={pages.RegisterPage} />} />
                    <Route path="/profile" element={<ContentWrapper element={pages.ProfilePage} />} />
                    
                    {/* 4. Ruta 404 (Not Found) */}
                    <Route path="*" element={<ContentWrapper element={() => (<h1 className="text-4xl text-red-600">404 | Página no encontrada</h1>)} />} />

                </Routes>
            </main>
            
            <Footer />
        </>
    );
};

export default App;