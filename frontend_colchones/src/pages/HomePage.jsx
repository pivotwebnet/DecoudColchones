// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { getProductos } from '../api/api';

// Componentes
import ImageCarousel from '../components/ImageCarousel';
import CategoryCards from '../components/CategoryCards';
import ProductLines from '../components/ProductLines';
import ColchonCard from '../components/ColchonCard';
import ColchonCardSkeleton from '../components/ColchonCardSkeleton';
import Testimonios from '../components/Testimonios';
import NuestraHistoria from '../components/NuestraHistoria';
import HomeSections from '../components/HomeSections';

const HomePage = () => {
    // ... (keep state if needed or remove if HomeSections handles it)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            
            {/* 1. BANNER PRINCIPAL (Carrusel de Imágenes) */}
            <section style={{ width: '100%', padding: 0 }}>
                <ImageCarousel />
            </section>

            {/* 2. CATEGORÍAS DESTACADAS (Nuestro nuevo diseño estilo Netflix) */}
            {/* Quitamos el padding extra para que el carrusel maneje su propio ancho */}
            <section style={{ width: '100%' }}> 
                 <CategoryCards />
            </section>
           
            {/* 3. LÍNEAS DE PRODUCTOS (Logos de marcas) */}
            <section style={{ width: '100%', marginTop: '20px' }}>
                <ProductLines />
            </section>

            {/* 4. SECCIONES POR TAMAÑO/TIPO (KIDS, TEENS, FAMILY, PREMIUM) */}
            <HomeSections />

            {/* 5. TESTIMONIOS */}
            <Testimonios />

            {/* 6. NUESTRA HISTORIA */}
            <NuestraHistoria />
        </div>
    );
};

const styles = {
    productsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
        gap: 'clamp(15px, 3vw, 30px)',
        width: '100%',
    }
};

export default HomePage;