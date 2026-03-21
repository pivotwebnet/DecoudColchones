// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const LoginPage = () => {
    const { loginUser, loading } = useAuth();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await loginUser(email, password);
            navigate('/'); 
        } catch (err) {
            setError(err.detail || "Credenciales incorrectas. Intenta de nuevo.");
        }
    };

    return (
        <AuthLayout 
            title="Bienvenido de nuevo" 
            subtitle="Ingresá tus credenciales para acceder a tu cuenta."
        >
            <form onSubmit={handleSubmit} className="modern-form">
                {error && (
                    <div className="error-alert">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        <span>{error}</span>
                    </div>
                )}

                <div className="input-group">
                    <label>Email</label>
                    <div className="input-wrapper">
                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        <input
                            type="email"
                            placeholder="nombre@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>
                
                <div className="input-group">
                    <label>Contraseña</label>
                    <div className="input-wrapper">
                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="auth-submit-btn">
                    {loading ? (
                        <span className="loader-dots">Cargando...</span>
                    ) : (
                        "INICIAR SESIÓN"
                    )}
                </button>

                <p className="auth-footer-text">
                    ¿No tenés una cuenta? <Link to="/register">Crear cuenta</Link>
                </p>
            </form>

            <style>{`
                .modern-form { display: flex; flex-direction: column; gap: 20px; }
                .input-group { display: flex; flex-direction: column; gap: 8px; }
                .input-group label { font-size: 0.85rem; font-weight: 600; color: #475569; }
                
                .input-wrapper { position: relative; display: flex; align-items: center; }
                .input-icon { position: absolute; left: 15px; }
                .input-wrapper input { width: 100%; padding: 14px 15px 14px 45px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 0.95rem; outline: none; transition: all 0.2s; }
                .input-wrapper input:focus { border-color: #1B365D; box-shadow: 0 0 0 4px rgba(27, 54, 93, 0.05); }

                .auth-submit-btn { background: #1B365D; color: white; border: none; padding: 16px; border-radius: 10px; font-weight: 800; font-size: 0.9rem; cursor: pointer; transition: all 0.3s; margin-top: 10px; letter-spacing: 1px; }
                .auth-submit-btn:hover { background: #152a4a; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(27, 54, 93, 0.15); }
                .auth-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

                .error-alert { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 12px 15px; border-radius: 10px; font-size: 0.85rem; display: flex; align-items: center; gap: 10px; }
                .auth-footer-text { text-align: center; font-size: 0.9rem; color: #64748b; margin-top: 10px; }
                .auth-footer-text a { color: #1B365D; font-weight: 700; text-decoration: none; }
                
                @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
                .loader-dots { animation: pulse 1s infinite; }
            `}</style>
        </AuthLayout>
    );
};

export default LoginPage;