// src/components/ImageCarousel.jsx
import React, { useState, useEffect } from 'react';

// Imágenes de prueba (Reemplaza con las tuyas)
const images = [
    { url: '/banners/img1.jpeg'},
    { url: '/banners/img2.jpeg'},
];

const ImageCarousel = ({ interval = 5000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, interval);
        return () => clearInterval(timer);
    }, [interval]);

    const currentImage = images[currentIndex];

    return (
        // ESTILO CLAVE: width 100%, sin margins, sin border-radius
        <div style={{ width: '100%', height: '600px', position: 'relative', overflow: 'hidden' }}>
            
            {/* Imagen de Fondo */}
            <div style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${currentImage.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'background-image 0.5s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            </div>

            {/* Puntos de navegación */}
            <div style={{ position: 'absolute', bottom: '20px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {images.map((_, index) => (
                    <span 
                        key={index} 
                        onClick={() => setCurrentIndex(index)}
                        style={{
                            width: '12px', height: '12px', borderRadius: '50%', cursor: 'pointer',
                            backgroundColor: index === currentIndex ? 'white' : 'rgba(255,255,255,0.5)'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;