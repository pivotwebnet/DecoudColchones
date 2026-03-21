// src/pages/ProductList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom'; 
import { getProductos, getCategorias, getLineas } from '../api/api'; 
import ColchonCard from '../components/ColchonCard';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [lines, setLines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchingProducts, setFetchingProducts] = useState(false);

    const location = useLocation();

    // FILTROS
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedLine, setSelectedLine] = useState(null);
    const [sortOrder, setSortOrder] = useState('-creado_en'); 
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [minSupport, setMinSupport] = useState('');

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const catsData = await getCategorias();
                // Si la API devuelve paginación, los datos están en .results
                const catsArray = Array.isArray(catsData) ? catsData : (catsData.results || []);
                setCategories(catsArray);

                const linesData = await getLineas();
                const linesArray = Array.isArray(linesData) ? linesData : (linesData.results || []);
                setLines(linesArray);
            } catch (error) {
                console.error("Error cargando filtros:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFilters();
    }, []);

    // 2. Función para cargar productos desde el servidor
    const fetchProductsFromServer = useCallback(async () => {
        setFetchingProducts(true);
        try {
            const params = {};
            if (selectedCategory) params.categoria = selectedCategory;
            if (selectedLine) params.linea = selectedLine;
            if (priceRange.min) params.precio_min = priceRange.min;
            if (priceRange.max) params.precio_max = priceRange.max;
            if (minSupport) params.soporte_min = minSupport;
            if (sortOrder) params.ordering = sortOrder;

            const data = await getProductos(params);
            setProducts(data);
        } catch (error) {
            console.error("Error cargando productos:", error);
        } finally {
            setFetchingProducts(false);
        }
    }, [selectedCategory, selectedLine, priceRange, sortOrder, minSupport]);

    useEffect(() => {
        fetchProductsFromServer();
    }, [fetchProductsFromServer]);

    // 3. Leer URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const linea = params.get('linea'); 
        const categoria = params.get('categoria');
        if (linea) setSelectedLine(linea);
        if (categoria) setSelectedCategory(categoria);
    }, [location.search]);

    if (loading) return <div className="loader-container">Cargando catálogo...</div>;

    return (
        <div className="catalog-container">
            <div className="catalog-header">
                <h1>Catálogo de Productos</h1>
            </div>

            <div className="catalog-layout">
                <aside className="filters-sidebar">
                    
                    {/* FILTRO DE CATEGORÍAS */}
                    <div className="filter-group">
                        <h3>Categorías</h3>
                        <ul>
                            <li>
                                <button 
                                    className={!selectedCategory ? 'active' : ''} 
                                    onClick={() => setSelectedCategory(null)}
                                >
                                    Todas
                                </button>
                            </li>
                            {categories && categories.length > 0 ? (
                                categories.map(cat => (
                                    <li key={cat.id}>
                                        <button 
                                            className={selectedCategory === cat.slug ? 'active' : ''} 
                                            onClick={() => setSelectedCategory(cat.slug)}
                                        >
                                            {cat.nombre}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li style={{fontSize: '0.8rem', color: '#999'}}>No hay categorías</li>
                            )}
                        </ul>
                    </div>

                    {/* FILTRO DE LÍNEAS */}
                    <div className="filter-group">
                        <h3>Líneas</h3>
                        <ul>
                            <li><button className={!selectedLine ? 'active' : ''} onClick={() => setSelectedLine(null)}>Todas las líneas</button></li>
                            {lines && lines.length > 0 ? (
                                lines.map(line => (
                                    <li key={line.id}>
                                        <button className={selectedLine === line.slug ? 'active' : ''} onClick={() => setSelectedLine(line.slug)}>{line.nombre}</button>
                                    </li>
                                ))
                            ) : (
                                <li style={{fontSize: '0.8rem', color: '#999'}}>No hay líneas</li>
                            )}
                        </ul>
                    </div>

                    {/* FILTRO DE SOPORTE */}
                    <div className="filter-group">
                        <h3>Soporte Máximo</h3>
                        <select 
                            value={minSupport} 
                            onChange={(e) => setMinSupport(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                            <option value="">Cualquier peso</option>
                            <option value="80">Más de 80 kg</option>
                            <option value="100">Más de 100 kg</option>
                            <option value="120">Más de 120 kg</option>
                            <option value="150">Más de 150 kg</option>
                        </select>
                    </div>

                    {/* FILTRO DE PRECIO */}
                    <div className="filter-group">
                        <h3>Precio</h3>
                        <div className="price-inputs">
                            <input type="number" placeholder="Mín" value={priceRange.min} onChange={(e) => setPriceRange(p => ({...p, min: e.target.value}))} />
                            <span>-</span>
                            <input type="number" placeholder="Máx" value={priceRange.max} onChange={(e) => setPriceRange(p => ({...p, max: e.target.value}))} />
                        </div>
                    </div>

                    <button className="reset-btn" onClick={() => { 
                        setSelectedCategory(null); setSelectedLine(null); setPriceRange({ min: '', max: '' }); setMinSupport(''); setSortOrder('-creado_en'); 
                    }}>Limpiar Filtros</button>
                </aside>

                <main className="products-main">
                    <div className="top-bar">
                        <span>Mostrando {products.length} productos</span>
                        <div className="sort-box">
                            <label>Ordenar por:</label>
                            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                <option value="-creado_en">Más Nuevos</option>
                                <option value="precio">Menor Precio</option>
                                <option value="-precio">Mayor Precio</option>
                            </select>
                        </div>
                    </div>

                    {fetchingProducts ? (
                        <div className="fetching-indicator">Actualizando lista...</div>
                    ) : (
                        <div className="products-grid">
                            {products.length > 0 ? (
                                products.map(product => (
                                    <ColchonCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#666'}}>
                                    No se encontraron productos con estos filtros.
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            <style>{`
                .catalog-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: sans-serif; }
                .catalog-layout { display: flex; gap: 40px; }
                .filters-sidebar { flex: 0 0 250px; } 
                .filter-group { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
                .filter-group h3 { font-size: 1.1rem; color: #1B365D; margin-bottom: 15px; }
                .products-main { flex: 1; }
                .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 30px; }
                .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
                .filters-sidebar button { background: none; border: none; cursor: pointer; font-size: 1rem; color: #666; transition: 0.2s; text-align: left; padding: 0; display: block; margin-bottom: 10px; }
                .filters-sidebar button.active { color: #1B365D; font-weight: bold; text-decoration: underline; }
                .price-inputs { display: flex; align-items: center; gap: 10px; }
                .price-inputs input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
                .reset-btn { width: 100%; padding: 10px; background: #f1f5f9; border: none; border-radius: 4px; cursor: pointer; color: #64748b; font-weight: bold; }
                .loader-container { padding: 100px; text-align: center; }
                .fetching-indicator { text-align: center; padding: 50px; color: #1B365D; font-style: italic; }
            `}</style>
        </div>
    );
};

export default ProductList;