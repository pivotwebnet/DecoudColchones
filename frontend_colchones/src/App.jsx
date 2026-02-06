// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';

// --- IMPORTACIÓN DE PÁGINAS ---
import HomePage from './pages/HomePage';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage'; 
import OrderConfirmation from './pages/OrderConfirmation';

// AJUSTE: Importamos 'Checkout' (no CheckoutPage) si así llamaste al archivo en el paso anterior
import Checkout from './pages/CheckoutPage'; 

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import FAQPage from './pages/FAQPage';

// Wrapper para páginas que NECESITAN centrado extra (como Login/Register/Profile)
const ContentWrapper = ({ element: Component }) => (
    <div className="content-area">
        <Component />
    </div>
);

const App = () => {
    return (
        <>
            <ScrollToTop /> 
            <Header />
            
            <main style={{ minHeight: 'calc(100vh - 160px)', width: '100%' }}>
                <Routes>
                    {/* HOME */}
                    <Route path="/" element={<HomePage />} />

                    {/* PRODUCTOS */}
                    <Route path="/colchones" element={<ContentWrapper element={ProductList} />} />
                    <Route path="/colchones/:slug" element={<ProductDetail />} /> 
                    {/* Nota: ProductDetail ya tiene su propio layout/padding, le quité el Wrapper */}

                    {/* --- FLUJO DE COMPRA (Sin wrappers porque ya tienen diseño propio) --- */}
                    <Route path="/carrito" element={<CartPage />} />
                    <Route path="/confirmar-pedido" element={<OrderConfirmation />} />
                    <Route path="/checkout" element={<Checkout />} />

                    {/* USUARIO (Estos sí llevan Wrapper para quedar centrados) */}
                    <Route path="/login" element={<ContentWrapper element={LoginPage} />} />
                    <Route path="/register" element={<ContentWrapper element={RegisterPage} />} />
                    <Route path="/profile" element={<ContentWrapper element={ProfilePage} />} />
                    
                    {/* INFO */}
                    <Route path="/preguntas-frecuentes" element={<FAQPage />} />
                    
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