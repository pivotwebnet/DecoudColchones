import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import GoogleAuthButton from '../components/GoogleAuthButton';

const RegisterPage = () => {
    const { registerUser, loginUser, loading } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '', first_name: '', last_name: '', password: '', password2: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.password2) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            await registerUser(formData);
            await loginUser(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            let msg = 'Error en el registro. Verificá los datos.';
            if (typeof err === 'object') msg = Object.values(err).flat().join(' | ');
            setError(msg);
        }
    };

    return (
        <AuthLayout title="Crear una cuenta" subtitle="Unite a Decoud y gestioná tus pedidos fácilmente.">
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
                <GoogleAuthButton label="Registrarse con Google" />

                {/* Separador */}
                <div style={s.divider}>
                    <span style={s.dividerLine} />
                    <span style={s.dividerText}>o completá el formulario</span>
                    <span style={s.dividerLine} />
                </div>

                {/* Nombre y Apellido */}
                <div style={s.grid}>
                    <Field label="Nombre">
                        <input name="first_name" placeholder="Juan" value={formData.first_name} onChange={handleChange} required style={s.input} />
                    </Field>
                    <Field label="Apellido">
                        <input name="last_name" placeholder="Pérez" value={formData.last_name} onChange={handleChange} required style={s.input} />
                    </Field>
                </div>

                {/* Email */}
                <Field label="Email">
                    <input type="email" name="email" placeholder="nombre@ejemplo.com" value={formData.email} onChange={handleChange} required style={s.input} />
                </Field>

                {/* Contraseñas */}
                <div style={s.grid}>
                    <Field label="Contraseña">
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Mínimo 8 caracteres"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={{ ...s.input, paddingRight: '40px' }}
                            />
                            <button type="button" onClick={() => setShowPassword(p => !p)} style={s.eyeBtn} tabIndex={-1}>
                                <EyeIcon show={showPassword} />
                            </button>
                        </div>
                    </Field>
                    <Field label="Repetir contraseña">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password2"
                            placeholder="••••••••"
                            value={formData.password2}
                            onChange={handleChange}
                            required
                            style={s.input}
                        />
                    </Field>
                </div>

                <button type="submit" disabled={loading} style={s.submitBtn}>
                    {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>

                <p style={s.footer}>
                    ¿Ya tenés cuenta? <Link to="/login" style={s.link}>Iniciá sesión</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

const Field = ({ label, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--color-text-dark)' }}>{label}</label>
        {children}
    </div>
);

const EyeIcon = ({ show }) => show ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
);

const s = {
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    errorBox: {
        background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c',
        padding: '11px 14px', borderRadius: '8px', fontSize: '0.85rem',
        display: 'flex', alignItems: 'center', gap: '8px',
    },
    divider: { display: 'flex', alignItems: 'center', gap: '10px', margin: '2px 0' },
    dividerLine: { flex: 1, height: '1px', backgroundColor: 'var(--border-color)' },
    dividerText: { fontSize: '0.78rem', color: 'var(--color-text-dark)', opacity: 0.45, whiteSpace: 'nowrap' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
    input: {
        width: '100%', padding: '12px 14px',
        borderRadius: '10px', border: '1.5px solid var(--border-color)',
        backgroundColor: 'var(--content-bg)', color: 'var(--color-text-dark)',
        fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    },
    eyeBtn: {
        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex',
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

export default RegisterPage;
