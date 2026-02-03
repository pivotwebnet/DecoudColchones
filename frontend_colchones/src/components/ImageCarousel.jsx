import React, { useState, useEffect } from 'react';
import { getBanners } from '../api/api'; // Asegúrate de importar esto

// Imágenes de prueba (Fallback por si no hay nada en el backend)
const defaultImages = [
    { imagen: '/banners/img1.jpeg', titulo: 'Default 1' },
    { imagen: '/banners/img2.jpeg', titulo: 'Default 2' },
];

const ImageCarousel = ({ interval = 5000 }) => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 1. Cargar Banners del Backend
    useEffect(() => {
        const fetchBanners = async () => {
            const data = await getBanners();
            if (data && data.length > 0) {
                setBanners(data);
            }
        };
        fetchBanners();
    }, []);

    // 2. Decidir qué mostrar (Backend o Default)
    const itemsToShow = banners.length > 0 ? banners : defaultImages;

    // 3. Rotación automática
    useEffect(() => {
        if (itemsToShow.length <= 1) return; // No rotar si hay solo una imagen

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % itemsToShow.length);
        }, interval);
        return () => clearInterval(timer);
    }, [interval, itemsToShow.length]);

    const currentItem = itemsToShow[currentIndex];

    // Protección por si acaso está cargando y no hay defaults
    if (!currentItem) return <div style={{height: '600px', background: '#f0f0f0'}}></div>;

    return (
        <div style={{ width: '100%', height: '600px', position: 'relative', overflow: 'hidden' }}>
            
            {/* Imagen de Fondo */}
            <div style={{
                width: '100%',
                height: '100%',
                // La API devuelve 'imagen', los default también los ajusté a 'imagen'
                backgroundImage: `url(${currentItem.imagen})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'background-image 0.5s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Opcional: Mostrar título si quisieras */}
                {/* <h2 style={{color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>{currentItem.titulo}</h2> */}
            </div>

            {/* Puntos de navegación (Solo si hay más de 1 imagen) */}
            {itemsToShow.length > 1 && (
                <div style={{ position: 'absolute', bottom: '20px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    {itemsToShow.map((_, index) => (
                        <span 
                            key={index} 
                            onClick={() => setCurrentIndex(index)}
                            style={{
                                width: '12px', height: '12px', borderRadius: '50%', cursor: 'pointer',
                                backgroundColor: index === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageCarousel;