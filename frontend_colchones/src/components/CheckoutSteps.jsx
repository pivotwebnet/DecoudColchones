import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const CheckoutSteps = () => {
    const location = useLocation();
    
    // Definimos los pasos y sus rutas
    const steps = [
        { num: 1, label: 'Carrito', path: '/carrito' },
        { num: 2, label: 'Datos de Envío', path: '/confirmar-pedido' },
        { num: 3, label: 'Pago', path: '/checkout' }
    ];

    // Función para saber si el paso está activo o ya pasó
    const getStatus = (stepPath) => {
        if (location.pathname === stepPath) return 'active';
        // Lógica simple: si estoy en checkout, carrito y datos son "completed"
        if (location.pathname === '/checkout' && stepPath !== '/checkout') return 'completed';
        if (location.pathname === '/confirmar-pedido' && stepPath === '/carrito') return 'completed';
        return 'inactive';
    };

    return (
        <div style={styles.container}>
            {steps.map((step, index) => {
                const status = getStatus(step.path);
                const isClickable = status === 'completed' || status === 'active';

                return (
                    <div key={step.num} style={styles.stepWrapper}>
                        {/* Círculo con Número */}
                        <Link 
                            to={isClickable ? step.path : '#'} 
                            style={{ 
                                ...styles.circle, 
                                ...(status === 'active' ? styles.activeCircle : {}),
                                ...(status === 'completed' ? styles.completedCircle : {}),
                                cursor: isClickable ? 'pointer' : 'default'
                            }}
                            onClick={(e) => !isClickable && e.preventDefault()}
                        >
                            {status === 'completed' ? '✓' : step.num}
                        </Link>
                        
                        {/* Texto */}
                        <span style={{ 
                            ...styles.label, 
                            fontWeight: status === 'active' ? 'bold' : 'normal',
                            color: status === 'inactive' ? '#94a3b8' : '#1B365D'
                        }}>
                            {step.label}
                        </span>

                        {/* Línea conectora (excepto en el último) */}
                        {index < steps.length - 1 && (
                            <div style={styles.line}></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', marginBottom: '40px', marginTop: '20px' },
    stepWrapper: { display: 'flex', alignItems: 'center', position: 'relative' },
    circle: {
        width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#e2e8f0',
        color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', textDecoration: 'none', marginRight: '10px', transition: 'all 0.3s'
    },
    activeCircle: { backgroundColor: '#1B365D', color: '#D4AF37', boxShadow: '0 0 0 3px rgba(212, 175, 55, 0.3)' },
    completedCircle: { backgroundColor: '#D4AF37', color: 'white' }, // Dorado Decoud
    label: { fontSize: '0.9rem', marginRight: '20px' },
    line: { width: '50px', height: '2px', backgroundColor: '#e2e8f0', marginRight: '20px', display: 'block' }
};

export default CheckoutSteps;