// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SideCart from './components/SideCart';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import CloudBackground from './components/CloudBackground';

// --- IMPORTACIÓN DE PÁGINAS ---
import HomePage from './pages/HomePage';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage'; 
import OrderConfirmation from './pages/OrderConfirmation';
import Checkout from './pages/CheckoutPage'; 
import OrderConfirmationMP from './pages/OrderConfirmationMP';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import FAQPage from './pages/FAQPage';
import NuestraHistoriaPage from './pages/NuestraHistoriaPage';

// Wrapper para páginas que NECESITAN centrado extra (como Login/Register/Profile)
const ContentWrapper = ({ element: Component }) => (
    <div className="content-area">
        <Component />
    </div>
);

const App = () => {
    return (
        <>
            <CloudBackground />
            <ScrollToTop />
            <Header />
            <SideCart />
            
            <main style={{ minHeight: 'calc(100vh - 160px)', width: '100%' }}>
                <Routes>
                    {/* HOME */}
                    <Route path="/" element={<HomePage />} />

                    {/* PRODUCTOS */}
                    <Route path="/colchones" element={<ContentWrapper element={ProductList} />} />
                    <Route path="/colchones/:slug" element={<ProductDetail />} /> 

                    {/* --- FLUJO DE COMPRA --- */}
                    <Route path="/carrito" element={<CartPage />} />
                    <Route path="/confirmar-pedido" element={<OrderConfirmation />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/confirmacion-pago" element={<OrderConfirmationMP />} />

                    {/* USUARIO */}
                    <Route path="/login" element={<ContentWrapper element={LoginPage} />} />
                    <Route path="/register" element={<ContentWrapper element={RegisterPage} />} />
                    <Route path="/profile" element={<ContentWrapper element={ProfilePage} />} />
                    
                    {/* INFO */}
                    <Route path="/preguntas-frecuentes" element={<FAQPage />} />
                    <Route path="/nuestra-historia" element={<NuestraHistoriaPage />} />
                    
                    {/* 404 */}
                    <Route path="*" element={<div style={{padding: '100px', textAlign: 'center'}}><h1>404 - Página no encontrada</h1></div>} />
                </Routes>
            </main>
            
            <Footer />
            <WhatsAppButton />
        </>
    );
};

export default App;