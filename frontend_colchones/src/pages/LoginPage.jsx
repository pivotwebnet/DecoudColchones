import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import GoogleAuthButton from '../components/GoogleAuthButton';

const LoginPage = () => {
    try {
        const { loginUser, loading } = useAuth();
        const navigate = useNavigate();

        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [showPassword, setShowPassword] = useState(false);
        const [error, setError] = useState(null);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setError(null);
            try {
                await loginUser(email, password);
                navigate('/');
            } catch (err) {
                setError(err.detail || 'Credenciales incorrectas. Intentá de nuevo.');
            }
        };

        return (
            <AuthLayout title="Bienvenido de nuevo" subtitle="Ingresá a tu cuenta para gestionar tus pedidos.">
                <form onSubmit={handleSubmit} style={s.form}>

                    {error && (
                        <div style={s.errorBox}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Google */}
                    <GoogleAuthButton label="Iniciar sesión con Google" />

                    {/* Separador */}
                    <div style={s.divider}>
                        <span style={s.dividerLine} />
                        <span style={s.dividerText}>o con tu email</span>
                        <span style={s.dividerLine} />
                    </div>

                    {/* Email */}
                    <div style={s.group}>
                        <label style={s.label}>Email</label>
                        <div style={s.inputWrap}>
                            <svg style={s.icon} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                            </svg>
                            <input
                                type="email"
                                placeholder="nombre@ejemplo.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={s.input}
                            />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div style={s.group}>
                        <label style={s.label}>Contraseña</label>
                        <div style={s.inputWrap}>
                            <svg style={s.icon} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                style={{ ...s.input, paddingRight: '44px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                style={s.eyeBtn}
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={s.submitBtn}>
                        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>

                    <p style={s.footer}>
                        ¿No tenés cuenta? <Link to="/register" style={s.link}>Crear cuenta</Link>
                    </p>
                </form>
            </AuthLayout>
        );
    } catch (e) {
        console.error("Critical error in LoginPage:", e);
        return <div style={{padding: '50px', textAlign: 'center'}}>Error al cargar el login. Por favor, recargá la página.</div>;
    }
};

const s = {
    form: { display: 'flex', flexDirection: 'column', gap: '18px' },
    errorBox: {
        background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c',
        padding: '11px 14px', borderRadius: '8px', fontSize: '0.85rem',
        display: 'flex', alignItems: 'center', gap: '8px',
    },
    divider: { display: 'flex', alignItems: 'center', gap: '10px', margin: '2px 0' },
    dividerLine: { flex: 1, height: '1px', backgroundColor: 'var(--border-color)' },
    dividerText: { fontSize: '0.78rem', color: 'var(--color-text-dark)', opacity: 0.45, whiteSpace: 'nowrap' },
    group: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '0.82rem', fontWeight: '600', color: 'var(--color-text-dark)' },
    inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
    icon: { position: 'absolute', left: '14px', pointerEvents: 'none' },
    input: {
        width: '100%', padding: '13px 14px 13px 42px',
        borderRadius: '10px', border: '1.5px solid var(--border-color)',
        backgroundColor: 'var(--content-bg)', color: 'var(--color-text-dark)',
        fontSize: '0.93rem', outline: 'none', transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    },
    eyeBtn: {
        position: 'absolute', right: '12px', background: 'none', border: 'none',
        cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center',
    },
    submitBtn: {
        backgroundColor: 'var(--decoud-blue)', color: 'white',
        border: 'none', padding: '14px', borderRadius: '10px',
        fontWeight: '700', fontSize: '0.92rem', cursor: 'pointer',
        transition: 'all 0.2s', letterSpacing: '0.02em', marginTop: '4px',
    },
    footer: { textAlign: 'center', fontSize: '0.88rem', color: 'var(--color-text-dark)', opacity: 0.75 },
    link: { color: 'var(--decoud-blue)', fontWeight: '700', textDecoration: 'none' },
};

export default LoginPage;
