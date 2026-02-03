import React from 'react';

const WhatsAppButton = () => {
  // TU NÚMERO (Formato: 549 + característica sin 0 + número sin 15)
  // Ejemplo real: 5493492123456
  const telefono = "5493492000000"; 
  const mensaje = "Hola Decoud, estoy viendo la web y tengo una consulta sobre un colchón.";

  const link = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      style={styles.botonFlotante}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0px 6px 15px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.15)';
      }}
    >
      {/* SVG OFICIAL: Burbuja Verde con Teléfono Blanco */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="100%" 
        height="100%" 
        viewBox="0 0 48 48" 
        fill="none" // Importante para que el círculo verde de abajo se encargue del color
      >
        {/* 1. Fondo circular verde del logo */}
        <circle cx="24" cy="24" r="24" fill="#ffffff"/>
        
        {/* 2. El ícono del teléfono y la burbuja (Path simplificado oficial) */}
        <path 
          fill="#4fff0a" 
          d="M36.7 34.3c-.5-.3-3.1-1.5-3.6-1.7-.5-.2-.8-.3-1.1.2-.4.5-1.4 1.7-1.7 2.1-.3.4-.6.4-1.1.2-3-.9-5-2.2-7.5-6.5-.8-1.4 1.6-1.5 3.3-4.9.1-.3 0-.6-.1-.9-.1-.3-1.1-2.7-1.5-3.7-.4-.9-.8-.8-1.1-.8h-.9c-.3 0-.8.1-1.3.6-1.4 1.5-1.8 2.6-1.6 4.3.4 3.7 3.5 8.1 8.5 10.9 2.5 1.4 3.7 1.5 5.5 1.3 1.3-.1 3.1-1.3 3.5-2.5.5-1.2.5-2.2.3-2.5-.1-.2-.4-.3-.9-.6zM24 6c-9.9 0-18 8.1-18 18 0 3.4 1 6.5 2.8 9.2L6 42l9.1-2.9c2.6 1.6 5.6 2.5 8.9 2.5 9.9 0 18-8.1 18-18S33.9 6 24 6z"
        />
      </svg>
    </a>
  );
};

const styles = {
  botonFlotante: {
    position: 'fixed',
    bottom: '25px',
    right: '25px',
    width: '60px',
    height: '60px',
    // Quitamos el background color del contenedor porque el SVG ya trae su propio círculo verde
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    backgroundColor: 'transparent' // Transparente para que se vea el círculo del SVG
  }
};

export default WhatsAppButton;