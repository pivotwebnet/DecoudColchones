// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <p>&copy; {new Date().getFullYear()} Colchones Rafaelinos. Todos los derechos reservados.</p>
            <p>Rafaela, Santa Fe.</p>
        </footer>
    );
};

const styles = {
    footer: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #eee',
        marginTop: '20px',
    }
};

export default Footer;