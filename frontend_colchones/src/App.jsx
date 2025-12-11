// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Páginas
import HomePage from './pages/HomePage';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';

// Wrapper para centrar el contenido en páginas que NO son la Home
const ContentWrapper = ({ element: Component }) => (
    <div className="content-area">
        <Component />
    </div>
);

const App = () => {
    return (
        <>
            <Header />
            {/* ELIMINAMOS cualquier style={{ padding }} o flex que restringiera el ancho */}
            <main style={{ minHeight: 'calc(100vh - 160px)', width: '100%' }}>
                <Routes>
                    {/* La Home va "cruda" (sin wrapper) para controlar su propio ancho */}
                    <Route path="/" element={<HomePage />} />

                    {/* Las demás páginas sí van encajonadas en el cuadro blanco centrado */}
                    <Route path="/colchones" element={<ContentWrapper element={ProductList} />} />
                    <Route path="/colchones/:slug" element={<ContentWrapper element={ProductDetail} />} />
                    <Route path="/carrito" element={<ContentWrapper element={CartPage} />} />
                    <Route path="/checkout" element={<ContentWrapper element={CheckoutPage} />} />
                    <Route path="/login" element={<ContentWrapper element={LoginPage} />} />
                    <Route path="/register" element={<ContentWrapper element={RegisterPage} />} />
                    <Route path="/profile" element={<ContentWrapper element={ProfilePage} />} />
                    
                    <Route path="*" element={<h1 className="text-white text-center mt-10">404 - Página no encontrada</h1>} />
                </Routes>
            </main>
            <Footer />
        </>
    );
};

export default App;