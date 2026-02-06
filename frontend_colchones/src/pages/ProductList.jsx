// src/pages/ProductList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { getProductos } from '../api/api'; 
import ColchonCard from '../components/ColchonCard';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();

    // --- ESTADOS DE FILTROS ---
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [sortOrder, setSortOrder] = useState('newest'); 
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [lineFilter, setLineFilter] = useState('');

    // 1. Cargar Productos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProductos();
                setProducts(data);
            } catch (error) {
                console.error("Error cargando catálogo:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 2. Leer URL (detectar si viene de Home con ?categoria=... o ?linea=...)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const linea = params.get('linea'); 
        const categoria = params.get('categoria');

        if (linea) {
            setLineFilter(linea); 
            setSelectedCategory('Todas');
        } else {
            setLineFilter('');
        }

        if (categoria) {
            // Buscamos que coincida el slug o nombre
            setSelectedCategory(capitalize(categoria)); 
            setLineFilter(''); 
        }
    }, [location.search]);

    // Helper para mayúsculas
    const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

    // 3. Obtener lista única de categorías para el sidebar
    const categories = useMemo(() => {
        const cats = products.map(p => p.categoria?.nombre || 'Otros');
        return ['Todas', ...new Set(cats)];
    }, [products]);

    // 4. LÓGICA DE FILTRADO (El corazón del catálogo)
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // A. Filtro por Categoría
        if (selectedCategory !== 'Todas') {
            // Comparamos ignorando mayúsculas/minúsculas para evitar errores
            result = result.filter(p => 
                (p.categoria?.nombre || 'Otros').toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        // B. Filtro por LÍNEA (ej: "oro", "catarata")
        if (lineFilter) {
            const cleanTerm = lineFilter.toLowerCase().replace(/-/g, ' ').trim();
            result = result.filter(p => p.nombre.toLowerCase().includes(cleanTerm));
        }

        // C. Filtro por Precio
        if (priceRange.min !== '') {
            result = result.filter(p => parseFloat(p.precio) >= parseFloat(priceRange.min));
        }
        if (priceRange.max !== '') {
            result = result.filter(p => parseFloat(p.precio) <= parseFloat(priceRange.max));
        }

        // D. Ordenar
        if (sortOrder === 'price-asc') {
            result.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
        } else if (sortOrder === 'price-desc') {
            result.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
        } else if (sortOrder === 'newest') {
            result.sort((a, b) => b.id - a.id);
        }

        return result;
    }, [products, selectedCategory, sortOrder, priceRange, lineFilter]);


    if (loading) return <div className="loader-container">Cargando catálogo...</div>;

    return (
        <div className="catalog-container">
            {/* TÍTULO PRINCIPAL */}
            <div className="catalog-header">
                <h1>Catálogo de Productos</h1>
                
                {/* Badge si hay un filtro de línea activo */}
                {lineFilter ? (
                    <div style={{marginTop: '10px'}}>
                        <span className="filter-badge">
                            Viendo línea: <b>{lineFilter.toUpperCase().replace(/-/g, ' ')}</b>
                            <button 
                                onClick={() => { setLineFilter(''); window.history.pushState({}, '', '/colchones'); }}
                                title="Quitar filtro"
                            >✕</button>
                        </span>
                    </div>
                ) : (
                    <p>Encontrá el descanso perfecto para vos</p>
                )}
            </div>

            <div className="catalog-layout">
                {/* --- SIDEBAR IZQUIERDO (FILTROS) --- */}
                <aside className="filters-sidebar">
                    <div className="filter-group">
                        <h3>Categorías</h3>
                        <ul>
                            {categories.map(cat => (
                                <li key={cat}>
                                    <button 
                                        className={selectedCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}
                                        onClick={() => { setSelectedCategory(cat); setLineFilter(''); }}
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="filter-group">
                        <h3>Precio</h3>
                        <div className="price-inputs">
                            <input 
                                type="number" placeholder="Mín" 
                                value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                            />
                            <span>-</span>
                            <input 
                                type="number" placeholder="Máx" 
                                value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    <button 
                        className="reset-btn"
                        onClick={() => { setSelectedCategory('Todas'); setPriceRange({ min: '', max: '' }); setLineFilter(''); }}
                    >
                        Limpiar Todo
                    </button>
                </aside>

                {/* --- GRILLA DE PRODUCTOS --- */}
                <main className="products-main">
                    <div className="top-bar">
                        <span>Mostrando {filteredProducts.length} resultados</span>
                        <div className="sort-box">
                            <label>Ordenar por:</label>
                            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                <option value="newest">Más Nuevos</option>
                                <option value="price-asc">Menor Precio</option>
                                <option value="price-desc">Mayor Precio</option>
                            </select>
                        </div>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="products-grid">
                            {filteredProducts.map(product => (
                                <ColchonCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <p>No encontramos productos con estos filtros. 😔</p>
                            <button onClick={() => { setSelectedCategory('Todas'); setPriceRange({min:'', max:''}); setLineFilter(''); }}>
                                Ver todos los productos
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {/* ESTILOS CSS */}
            <style>{`
                .catalog-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: 'Helvetica', sans-serif; }
                .loader-container { padding: 100px; text-align: center; font-size: 1.5rem; color: #666; }
                .catalog-header { text-align: center; margin-bottom: 50px; }
                .catalog-header h1 { font-size: 2.5rem; color: #1B365D; margin-bottom: 10px; }
                .catalog-header p { color: #64748b; font-size: 1.1rem; }
                
                .filter-badge {
                    background-color: #e0f2fe; color:#0284c7; padding: 8px 20px; 
                    border-radius: 30px; fontSize: 1rem; display: inline-flex; 
                    align-items: center; gap: 10px;
                }
                .filter-badge button {
                    border: none; background: white; width: 24px; height: 24px; 
                    border-radius: 50%; cursor: pointer; color: #0284c7; fontWeight: bold;
                    display: flex; alignItems: center; justifyContent: center;
                }

                .catalog-layout { display: flex; gap: 40px; }
                .filters-sidebar { flex: 0 0 250px; } 
                .filter-group { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
                .filter-group h3 { margin-bottom: 15px; font-size: 1.1rem; color: #333; }
                .filters-sidebar ul { list-style: none; padding: 0; }
                .filters-sidebar li { margin-bottom: 10px; }
                .filters-sidebar button { background: none; border: none; cursor: pointer; font-size: 1rem; color: #666; transition: 0.2s; text-align: left; padding: 0; }
                .filters-sidebar button:hover { color: #1B365D; }
                .filters-sidebar button.active { color: #1B365D; font-weight: bold; text-decoration: underline; }
                
                .price-inputs { display: flex; align-items: center; gap: 10px; }
                .price-inputs input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
                .reset-btn { width: 100%; padding: 10px; background: #f1f5f9; border: none; border-radius: 4px; cursor: pointer; color: #64748b; font-weight: bold; }
                .reset-btn:hover { background: #e2e8f0; color: #333; }

                .products-main { flex: 1; }
                .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
                .sort-box select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-left: 10px; cursor: pointer; }
                
                .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 30px; }
                
                .no-results { text-align: center; padding: 50px; color: #666; }
                .no-results button { background: #1B365D; color: white; border: none; padding: 10px 20px; border-radius: 4px; margin-top: 15px; cursor: pointer; }

                @media (max-width: 768px) {
                    .catalog-layout { flex-direction: column; }
                    .filters-sidebar { width: 100%; flex: none; display: flex; flex-wrap: wrap; gap: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
                    .filter-group { border: none; margin: 0; }
                    .top-bar { flex-direction: column; gap: 10px; align-items: flex-start; }
                }
            `}</style>
        </div>
    );
};

export default ProductList;