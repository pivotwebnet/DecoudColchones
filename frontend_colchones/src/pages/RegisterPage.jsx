// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            await registerUser(formData);
            setSuccess(true);
            
            // Loguear al usuario automáticamente
            await loginUser(formData.email, formData.password);
            
            navigate('/'); 

        } catch (err) {
            console.error("Registro fallido:", err);
            
            let errorMessage = "Error en el registro. Verifica que las contraseñas coincidan.";
            if (err.detail) {
                errorMessage = err.detail; 
            } else if (typeof err === 'object') {
                errorMessage = Object.keys(err).map(key => {
                    return `${key.replace('_', ' ')}: ${err[key][0]}`;
                }).join(' | ');
            }
            
            setError(errorMessage);
        }
    };

    return (
        // Aplicamos un estilo simple para centrar y dar tamaño DENTRO del .content-area
        <div style={styles.formContainer}>
            <h2 style={styles.title}>Crear Cuenta</h2>
            
            {/* Mensajes de Estado */}
            {error && (
                <div style={styles.errorBox}>
                    <span>Error: {error}</span>
                </div>
            )}
            
            {success && (
                 <div style={styles.successBox}>
                    Registro exitoso! Redirigiendo...
                 </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                
                {/* Email */}
                <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                
                {/* Nombre y Apellido */}
                <div style={styles.nameGroup}>
                    <div style={{ flex: 1 }}>
                        <label style={styles.label} htmlFor="first_name">Nombre</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={styles.label} htmlFor="last_name">Apellido</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                </div>

                {/* Contraseña */}
                <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                
                {/* Confirmar Contraseña */}
                <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="password2">Confirmar Contraseña</label>
                    <input
                        type="password"
                        name="password2"
                        value={formData.password2}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>

                {/* Usamos la clase global .btn-primary */}
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary" 
                    style={styles.buttonFullWidth}
                >
                    {loading ? 'Registrando...' : 'Registrarme'}
                </button>
            </form>

            <p style={styles.linkText}>
                ¿Ya tienes una cuenta? 
                <Link to="/login" style={styles.link}>
                    Inicia Sesión
                </Link>
            </p>
        </div>
    );
};

// Estilos Puros para centrado y diseño coherente
const styles = {
    formContainer: {
        margin: '0 auto',
        maxWidth: '450px',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Sombra ligera adicional
        backgroundColor: 'var(--color-background-light)', // Un toque de fondo claro
    },
    title: {
        fontSize: '2em',
        textAlign: 'center',
        marginBottom: '20px',
        color: 'var(--color-primary)',
    },
    errorBox: {
        backgroundColor: '#fecaca',
        border: '1px solid #f87171',
        color: '#b91c1c',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '15px',
        fontSize: '0.9em'
    },
    successBox: {
        backgroundColor: 'var(--color-success)',
        color: 'white',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '15px',
        fontSize: '0.9em'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    formGroup: {
        marginBottom: '10px',
    },
    nameGroup: {
        display: 'flex',
        gap: '20px',
        marginBottom: '10px',
    },
    label: {
        display: 'block',
        fontSize: '0.9em',
        marginBottom: '5px',
        color: '#555',
        fontWeight: '600'
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box',
    },
    buttonFullWidth: {
        width: '100%',
        marginTop: '15px',
    },
    linkText: {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '0.9em',
    },
    link: {
        color: 'var(--color-accent)',
        textDecoration: 'none',
        fontWeight: 'bold',
        marginLeft: '5px'
    }
};

export default RegisterPage;