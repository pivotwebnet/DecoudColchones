// src/pages/ProfilePage.jsx

import React from 'react';

const ProfilePage = () => {
    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Mi Perfil y Pedidos</h2>
            <p>Esta página requiere que el usuario esté autenticado.</p>
            <p>Aquí se mostrará el historial de compras usando el token JWT.</p>
        </div>
    );
};

// Estilos Placeholder
const styles = {
    container: {
        padding: '20px',
        textAlign: 'center'
    },
    title: {
        color: 'var(--color-primary)',
        marginBottom: '15px'
    }
}

// ¡CRUCIAL! Esta línea soluciona el error de "does not provide an export named 'default'"
export default ProfilePage;