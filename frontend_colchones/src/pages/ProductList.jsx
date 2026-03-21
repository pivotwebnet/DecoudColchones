// src/pages/ProductList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom'; 
import { getProductos, getCategorias, getLineas } from '../api/api'; 
import ColchonCard from '../components/ColchonCard';

// Componente Interno para el Skeleton (La silueta de carga)
const ProductSkeleton = () => (
    <div style={skeletonStyles.card}>
        <div style={skeletonStyles.image}></div>
        <div style={skeletonStyles.content}>
            <div style={skeletonStyles.lineShort}></div>
            <div style={skeletonStyles.lineLong}></div>
            <div style={skeletonStyles.lineMedium}></div>
            <div style={{...skeletonStyles.lineLong, marginTop: '20px', height: '30px'}}></div>
        </div>
    </div>
);

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

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const linea = params.get('linea'); 
        const categoria = params.get('categoria');
        if (linea) setSelectedLine(linea);
        if (categoria) setSelectedCategory(categoria);
    }, [location.search]);

    if (loading) return <div className="loader-container" style={{padding: '100px', textAlign: 'center'}}>Cargando...</div>;

    return (
        <div className="catalog-container">
            <div className="catalog-header">
                <h1>Catálogo de Productos</h1>
                <p>Encuentra el descanso perfecto para vos</p>
            </div>

            <div className="catalog-layout">
                <aside className="filters-sidebar">
                    <div className="filter-group">
                        <h3>Categorías</h3>
                        <ul>
                            <li><button className={!selectedCategory ? 'active' : ''} onClick={() => setSelectedCategory(null)}>Todas</button></li>
                            {categories.map(cat => (
                                <li key={cat.id}>
                                    <button className={selectedCategory === cat.slug ? 'active' : ''} onClick={() => setSelectedCategory(cat.slug)}>{cat.nombre}</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="filter-group">
                        <h3>Líneas</h3>
                        <ul>
                            <li><button className={!selectedLine ? 'active' : ''} onClick={() => setSelectedLine(null)}>Todas las líneas</button></li>
                            {lines.map(line => (
                                <li key={line.id}>
                                    <button className={selectedLine === line.slug ? 'active' : ''} onClick={() => setSelectedLine(line.slug)}>{line.nombre}</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="filter-group">
                        <h3>Soporte Máximo</h3>
                        <select value={minSupport} onChange={(e) => setMinSupport(e.target.value)} className="filter-select">
                            <option value="">Cualquier peso</option>
                            <option value="80">Más de 80 kg</option>
                            <option value="100">Más de 100 kg</option>
                            <option value="120">Más de 120 kg</option>
                            <option value="150">Más de 150 kg</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <h3>Precio</h3>
                        <div className="price-inputs">
                            <input type="number" placeholder="Mín" value={priceRange.min} onChange={(e) => setPriceRange(p => ({...p, min: e.target.value}))} />
                            <input type="number" placeholder="Máx" value={priceRange.max} onChange={(e) => setPriceRange(p => ({...p, max: e.target.value}))} />
                        </div>
                    </div>

                    <button className="reset-btn" onClick={() => { 
                        setSelectedCategory(null); setSelectedLine(null); setPriceRange({ min: '', max: '' }); setMinSupport(''); setSortOrder('-creado_en'); 
                    }}>Limpiar Filtros</button>
                </aside>

                <main className="products-main">
                    
                    {/* ETIQUETAS DE FILTROS ACTIVOS */}
                    <div className="active-filters">
                        {(selectedCategory || selectedLine || minSupport || priceRange.min || priceRange.max) && (
                            <span className="filter-label">Filtros activos:</span>
                        )}
                        
                        {selectedCategory && (
                            <div className="filter-tag">
                                Categoría: {categories.find(c => c.slug === selectedCategory)?.nombre}
                                <button onClick={() => setSelectedCategory(null)}>×</button>
                            </div>
                        )}
                        
                        {selectedLine && (
                            <div className="filter-tag">
                                Línea: {lines.find(l => l.slug === selectedLine)?.nombre}
                                <button onClick={() => setSelectedLine(null)}>×</button>
                            </div>
                        )}

                        {minSupport && (
                            <div className="filter-tag">
                                Soporte: +{minSupport}kg
                                <button onClick={() => setMinSupport('')}>×</button>
                            </div>
                        )}

                        {(priceRange.min || priceRange.max) && (
                            <div className="filter-tag">
                                Precio: {priceRange.min || 0} - {priceRange.max || 'max'}
                                <button onClick={() => setPriceRange({min:'', max:''})}>×</button>
                            </div>
                        )}
                    </div>

                    <div className="top-bar">
                        <span className="results-count"><b>{products.length}</b> productos encontrados</span>
                        <div className="sort-box">
                            <label>Ordenar:</label>
                            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                <option value="-creado_en">Más Nuevos</option>
                                <option value="precio">Menor Precio</option>
                                <option value="-precio">Mayor Precio</option>
                            </select>
                        </div>
                    </div>

                    <div className="products-grid">
                        {fetchingProducts ? (
                            // Mostramos 6 Skeletons mientras carga la API
                            [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
                        ) : (
                            products.length > 0 ? (
                                products.map(product => (
                                    <ColchonCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="no-results">No se encontraron productos con estos filtros.</div>
                            )
                        )}
                    </div>
                </main>
            </div>

            <style>{`
                .catalog-container { max-width: 1300px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; }
                .catalog-header { margin-bottom: 40px; }
                .catalog-header h1 { font-size: 2.2rem; color: #1B365D; margin-bottom: 5px; font-weight: 800; }
                .catalog-header p { color: #64748b; font-size: 1rem; }
                
                .catalog-layout { display: grid; grid-template-columns: 260px 1fr; gap: 40px; }
                .filters-sidebar { position: sticky; top: 100px; height: fit-content; }
                
                .filter-group { margin-bottom: 30px; }
                .filter-group h3 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: #1B365D; margin-bottom: 15px; font-weight: 700; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; }
                .filters-sidebar button { background: none; border: none; cursor: pointer; font-size: 0.95rem; color: #64748b; transition: all 0.2s; text-align: left; padding: 6px 0; display: block; width: 100%; }
                .filters-sidebar button:hover { color: #1B365D; padding-left: 5px; }
                .filters-sidebar button.active { color: #1B365D; font-weight: 700; }
                
                .filter-select { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; color: #475569; outline: none; }
                .price-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .price-inputs input { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; outline: none; }
                
                .reset-btn { width: 100%; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; color: #64748b; font-weight: 600; margin-top: 10px; transition: all 0.2s; }
                .reset-btn:hover { background: #f1f5f9; color: #1B365D; }

                .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding: 15px 20px; background: #f8fafc; border-radius: 12px; }
                
                .active-filters { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 20px; min-height: 35px; }
                .filter-label { font-size: 0.85rem; color: #94a3b8; font-weight: 600; }
                .filter-tag { background: white; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; color: #1B365D; font-weight: 700; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
                .filter-tag button { background: none; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer; line-height: 1; padding: 0; transition: color 0.2s; }
                .filter-tag button:hover { color: #e11d48; }

                .results-count { font-size: 0.95rem; color: #475569; }
                .sort-box { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; color: #64748b; }
                .sort-box select { border: none; background: none; font-weight: 700; color: #1B365D; cursor: pointer; outline: none; }

                .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
                .no-results { grid-column: 1/-1; text-align: center; padding: 80px; color: #94a3b8; font-size: 1.1rem; border: 2px dashed #f1f5f9; border-radius: 20px; }

                @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }

                @media (max-width: 900px) {
                    .catalog-layout { grid-template-columns: 1fr; }
                    .filters-sidebar { display: none; } /* Idealmente aquí iría un botón para abrir filtros en mobile */
                }
            `}</style>
        </div>
    );
};

const skeletonStyles = {
    card: { backgroundColor: 'white', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden', height: '450px' },
    image: { width: '100%', height: '240px', backgroundColor: '#f1f5f9', animation: 'pulse 1.5s infinite ease-in-out' },
    content: { padding: '20px' },
    lineShort: { width: '40%', height: '12px', backgroundColor: '#f1f5f9', marginBottom: '10px', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' },
    lineLong: { width: '90%', height: '18px', backgroundColor: '#f1f5f9', marginBottom: '10px', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' },
    lineMedium: { width: '60%', height: '12px', backgroundColor: '#f1f5f9', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }
};

export default ProductList;