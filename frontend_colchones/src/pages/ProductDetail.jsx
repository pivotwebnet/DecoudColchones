// src/pages/ProductDetail.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getProductoBySlug } from '../api/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { slug } = useParams();
    const { addItem } = useCart();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estado para la selección del usuario
    const [selectedMedida, setSelectedMedida] = useState('');
    const [selectedAltura, setSelectedAltura] = useState('');
    const [quantity, setQuantity] = useState(1);
    
    // ----------------------------------------------------
    // 1. Carga de Datos
    // ----------------------------------------------------
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductoBySlug(slug);
                setProduct(data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar el producto.');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    // ----------------------------------------------------
    // 2. Lógica de Variantes (Memorización de Opciones)
    // ----------------------------------------------------
    
    // 2a. Obtener la variante actualmente seleccionada por el usuario
    const selectedVariant = useMemo(() => {
        if (!product || !selectedMedida || !selectedAltura) return null;
        
        return product.variantes.find(v => 
            v.medida === selectedMedida && v.altura === selectedAltura
        );
    }, [product, selectedMedida, selectedAltura]);

    // 2b. Obtener todas las opciones únicas de medida disponibles
    const availableMedidas = useMemo(() => {
        if (!product) return [];
        const medidasSet = new Set(product.variantes.map(v => v.medida));
        return Array.from(medidasSet);
    }, [product]);

    // 2c. Obtener las opciones únicas de altura disponibles para la medida actual
    const availableAlturas = useMemo(() => {
        if (!product || !selectedMedida) {
            // Muestra todas las alturas si aún no se selecciona la medida
            const alturasSet = new Set(product ? product.variantes.map(v => v.altura) : []);
            return Array.from(alturasSet);
        }
        
        // Filtra las alturas que SÍ existen para la medida seleccionada
        const filteredAlturas = product.variantes
            .filter(v => v.medida === selectedMedida)
            .map(v => v.altura);
            
        return [...new Set(filteredAlturas)];
    }, [product, selectedMedida]);


    // ----------------------------------------------------
    // 3. Manejo del Carrito
    // ----------------------------------------------------
    const handleAddToCart = () => {
        if (selectedVariant && selectedVariant.stock >= quantity) {
            addItem(product, selectedVariant, quantity);
            alert(`Añadido: ${quantity} x ${product.nombre} (${selectedVariant.medida})`);
        } else {
            alert('Por favor, selecciona una combinación válida con stock.');
        }
    };


    if (loading) return <div>Cargando detalle del colchón...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return <div>Producto no encontrado.</div>;


    // ----------------------------------------------------
    // 4. Renderizado
    // ----------------------------------------------------
    return (
        <div className="product-detail-container">
            <h1>{product.nombre}</h1>
            <p><strong>Línea:</strong> {product.categoria_nombre}</p>
            <p><strong>Descripción:</strong> {product.descripcion_base}</p>
            <p><strong>Densidad:</strong> {product.densidad} kg/m³</p>
            <p><strong>Soporte:</strong> {product.peso_max_min}kg a {product.peso_max_max}kg</p>

            <hr />

            {/* Selector de Medida */}
            <div>
                <h3>1. Selecciona Medida:</h3>
                {availableMedidas.map(medida => (
                    <button
                        key={medida}
                        onClick={() => setSelectedMedida(medida)}
                        style={{ background: selectedMedida === medida ? 'blue' : 'gray', color: 'white', margin: '5px' }}
                    >
                        {medida}
                    </button>
                ))}
            </div>

            {/* Selector de Altura */}
            {selectedMedida && (
                <div>
                    <h3>2. Selecciona Altura/Pillow:</h3>
                    {availableAlturas.map(altura => (
                        <button
                            key={altura}
                            onClick={() => setSelectedAltura(altura)}
                            style={{ background: selectedAltura === altura ? 'blue' : 'gray', color: 'white', margin: '5px' }}
                        >
                            {altura}
                        </button>
                    ))}
                </div>
            )}

            {/* Precio y Stock */}
            {selectedVariant ? (
                <div>
                    <h2>Precio: ${selectedVariant.precio}</h2>
                    <p style={{ color: selectedVariant.stock > 0 ? 'green' : 'red' }}>
                        Stock disponible: {selectedVariant.stock}
                    </p>
                    
                    {/* Cantidad y Botón de Carrito */}
                    {selectedVariant.stock > 0 && (
                        <>
                            <input 
                                type="number" 
                                min="1" 
                                max={selectedVariant.stock} 
                                value={quantity} 
                                onChange={(e) => setQuantity(Math.min(e.target.value, selectedVariant.stock))}
                                style={{ width: '60px', marginRight: '10px' }}
                            />
                            <button onClick={handleAddToCart}>
                                Añadir al Carrito
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <p>Por favor, selecciona Medida y Altura para ver precio y stock.</p>
            )}
        </div>
    );
};

export default ProductDetail;