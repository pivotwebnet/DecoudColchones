// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    // 1. Obtener la función de login del contexto
    const { loginUser, loading } = useAuth();
    const navigate = useNavigate();
    
    // 2. Estados del formulario y errores
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    // 3. Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Limpiar errores previos

        try {
            // Llamar a la función de login del contexto
            await loginUser(email, password);
            
            // Si el login es exitoso, redirigir al Home o donde sea necesario
            navigate('/'); 

        } catch (err) {
            // Manejar errores de la API (ej: Credenciales inválidas)
            console.error("Login fallido:", err);
            
            // Asumimos que Django devuelve un error 'detail'
            let errorMessage = "Error al iniciar sesión. Verifica tus credenciales.";
            if (err.detail) {
                errorMessage = err.detail;
            } else if (err.non_field_errors) {
                // simplejwt a veces usa non_field_errors
                errorMessage = err.non_field_errors.join(' ');
            }
            
            setError(errorMessage);
        }
    };

    return (
        // Aplicamos un estilo simple para centrar y dar tamaño DENTRO del .content-area
        <div style={styles.formContainer}> 
            <h2 style={styles.title}>Iniciar Sesión</h2>
            
            {/* Mostrar Error */}
            {error && (
                <div style={styles.errorBox}>
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                
                <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    {loading ? 'Cargando...' : 'Iniciar Sesión'}
                </button>
            </form>

            <p style={styles.linkText}>
                ¿Aún no tienes cuenta? 
                <Link to="/register" style={styles.link}>
                    Regístrate aquí
                </Link>
            </p>
        </div>
    );
};

// Estilos Puros para centrado y diseño
const styles = {
    formContainer: {
        margin: '0 auto',
        maxWidth: '400px',
        padding: '30px',
        borderRadius: '8px',
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
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    formGroup: {
        marginBottom: '10px',
    },
    label: {
        display: 'block',
        fontSize: '0.9em',
        marginBottom: '5px',
        color: '#555',
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
        marginTop: '10px',
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

export default LoginPage;