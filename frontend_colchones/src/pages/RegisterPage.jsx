// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const RegisterPage = () => {
    const { registerUser, loginUser, loading } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        password2: '',
    });
    
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.password2) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            await registerUser(formData);
            await loginUser(formData.email, formData.password);
            navigate('/'); 
        } catch (err) {
            console.error("Registro fallido:", err);
            let msg = "Error en el registro. Verifica los datos.";
            if (typeof err === 'object') {
                msg = Object.values(err).flat().join(' | ');
            }
            setError(msg);
        }
    };

    return (
        <AuthLayout 
            title="Crear una cuenta" 
            subtitle="Unite a la comunidad Decoud y gestioná tus pedidos."
        >
            <form onSubmit={handleSubmit} className="modern-form">
                {error && (
                    <div className="error-alert">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        <span>{error}</span>
                    </div>
                )}

                <div className="form-grid">
                    <div className="input-group">
                        <label>Nombre</label>
                        <input type="text" name="first_name" placeholder="Ej: Juan" value={formData.first_name} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Apellido</label>
                        <input type="text" name="last_name" placeholder="Ej: Pérez" value={formData.last_name} onChange={handleChange} required />
                    </div>
                </div>

                <div className="input-group">
                    <label>Email</label>
                    <input type="email" name="email" placeholder="nombre@ejemplo.com" value={formData.email} onChange={handleChange} required />
                </div>
                
                <div className="form-grid">
                    <div className="input-group">
                        <label>Contraseña</label>
                        <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Repetir</label>
                        <input type="password" name="password2" placeholder="••••••••" value={formData.password2} onChange={handleChange} required />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="auth-submit-btn">
                    {loading ? "CREANDO CUENTA..." : "REGISTRARME"}
                </button>

                <p className="auth-footer-text">
                    ¿Ya tenés una cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </form>

            <style>{`
                .modern-form { display: flex; flex-direction: column; gap: 18px; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                
                .input-group { display: flex; flex-direction: column; gap: 6px; }
                .input-group label { font-size: 0.8rem; font-weight: 700; color: #475569; text-transform: uppercase; }
                .input-group input { padding: 12px 15px; border-radius: 8px; border: 1.5px solid #e2e8f0; font-size: 0.9rem; outline: none; transition: all 0.2s; }
                .input-group input:focus { border-color: #1B365D; }

                .auth-submit-btn { background: #1B365D; color: white; border: none; padding: 16px; border-radius: 10px; font-weight: 800; font-size: 0.9rem; cursor: pointer; transition: all 0.3s; margin-top: 10px; letter-spacing: 1px; }
                .auth-submit-btn:hover { background: #152a4a; transform: translateY(-2px); }
                .auth-submit-btn:disabled { opacity: 0.7; }

                .error-alert { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 12px 15px; border-radius: 10px; font-size: 0.8rem; display: flex; align-items: center; gap: 10px; }
                .auth-footer-text { text-align: center; font-size: 0.9rem; color: #64748b; }
                .auth-footer-text a { color: #1B365D; font-weight: 700; text-decoration: none; }

                @media (max-width: 500px) {
                    .form-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </AuthLayout>
    );
};

export default RegisterPage;