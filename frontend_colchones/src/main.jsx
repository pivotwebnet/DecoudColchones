import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    /* <React.StrictMode>  <-- LO QUITAMOS */
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
    /* </React.StrictMode>, <-- LO QUITAMOS */
);