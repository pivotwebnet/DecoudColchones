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
    const [filtersOpen, setFiltersOpen] = useState(false);

    const location = useLocation();

    // FILTROS
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedLine, setSelectedLine] = useState(null);
    const [selectedMeasure, setSelectedMeasure] = useState(null);
    const [sortOrder, setSortOrder] = useState('-creado_en');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [localMaxPrice, setLocalMaxPrice] = useState(1000000);
    const [minSupport, setMinSupport] = useState('');
    const [isOferta, setIsOferta] = useState(false);

    // Sincronizar localMaxPrice cuando se limpia el filtro desde fuera
    useEffect(() => {
        if (priceRange.max === '') {
            setLocalMaxPrice(1000000);
        }
    }, [priceRange.max]);

    // Debounce para el filtro de precio
    useEffect(() => {
        const timer = setTimeout(() => {
            // Solo actualizamos si el valor es diferente para evitar fetch innecesario
            if (priceRange.max !== localMaxPrice.toString()) {
                setPriceRange(p => ({ ...p, min: 0, max: localMaxPrice }));
            }
        }, 400); // 400ms de espera

        return () => clearTimeout(timer);
    }, [localMaxPrice]);

    const measures = [
        { label: '1 Plaza', value: '1_plaza' },
        { label: '1 1/2 Plaza', value: '1_y_media' },
        { label: '2 Plazas', value: '2_plazas' }
    ];

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
            // En modo Ofertas se muestran TODAS las categorías sin excepción
            if (selectedCategory && !isOferta) params.categoria = selectedCategory;
            if (selectedLine) params.linea = selectedLine;
            if (selectedMeasure) params.medida = selectedMeasure;
            if (priceRange.min) params.precio_min = priceRange.min;
            if (priceRange.max) params.precio_max = priceRange.max;
            if (minSupport) params.soporte_min = minSupport;
            if (sortOrder) params.ordering = sortOrder;
            if (isOferta) params.oferta = true;

            const data = await getProductos(params);
            setProducts(data);
        } catch (error) {
            console.error("Error cargando productos:", error);
        } finally {
            setFetchingProducts(false);
        }
    }, [selectedCategory, selectedLine, selectedMeasure, priceRange, sortOrder, minSupport, isOferta]);

    useEffect(() => {
        fetchProductsFromServer();
    }, [fetchProductsFromServer]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const linea    = params.get('linea');
        const categoria = params.get('categoria');
        const oferta   = params.get('oferta');
        if (linea)    setSelectedLine(linea);
        if (categoria) setSelectedCategory(categoria);
        if (oferta === 'true') setIsOferta(true);
    }, [location.search]);

    if (loading) return <div className="loader-container" style={{padding: '100px', textAlign: 'center'}}>Cargando...</div>;

    return (
        <div className="catalog-container">
            {isOferta ? (
                <div className="ofertas-header">
                    <div className="ofertas-header-inner">
                        <span className="ofertas-tag">PRECIOS ESPECIALES</span>
                        <h1 className="ofertas-title">🏷️ Ofertas</h1>
                        <p className="ofertas-subtitle">Productos destacados y con descuento — de todas las categorías</p>
                        <button className="ver-catalogo-btn" onClick={() => setIsOferta(false)}>
                            Ver catálogo completo →
                        </button>
                    </div>
                </div>
            ) : (
                <div className="catalog-header">
                    <h1>Catálogo de Productos</h1>
                    <p>Encuentra el descanso perfecto para vos</p>
                </div>
            )}

            <div className="catalog-layout">
                <button className="mobile-filter-btn" onClick={() => setFiltersOpen(o => !o)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                    {filtersOpen ? 'Ocultar Filtros' : 'Filtros'}
                </button>
                <aside className={`filters-sidebar${filtersOpen ? ' open' : ''}`}>
                    <div className="filter-group">
                        <h3>Categorías</h3>
                        {isOferta ? (
                            <p className="filter-oferta-note">Se muestran todas las categorías en modo Ofertas</p>
                        ) : (
                            <ul>
                                <li><button className={!selectedCategory ? 'active' : ''} onClick={() => setSelectedCategory(null)}>Todas</button></li>
                                {categories.map(cat => (
                                    <li key={cat.id}>
                                        <button className={selectedCategory === cat.slug ? 'active' : ''} onClick={() => setSelectedCategory(cat.slug)}>{cat.nombre}</button>
                                    </li>
                                ))}
                            </ul>
                        )}
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
                        <h3>Medidas</h3>
                        <ul>
                            <li><button className={!selectedMeasure ? 'active' : ''} onClick={() => setSelectedMeasure(null)}>Todas las medidas</button></li>
                            {measures.map(m => (
                                <li key={m.value}>
                                    <button className={selectedMeasure === m.value ? 'active' : ''} onClick={() => setSelectedMeasure(m.value)}>{m.label}</button>
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
                        <h3>Precio Máximo</h3>
                        <div className="price-slider-container">
                            <input 
                                type="range" 
                                min="0" 
                                max="1000000" 
                                step="10000"
                                value={localMaxPrice} 
                                onChange={(e) => setLocalMaxPrice(e.target.value)} 
                                className="price-slider"
                            />
                            <div className="price-display">
                                Hasta: <b>${Number(localMaxPrice).toLocaleString('es-AR')}</b>
                            </div>
                        </div>
                    </div>

                    <button className="reset-btn" onClick={() => {
                        setSelectedCategory(null); setSelectedLine(null); setSelectedMeasure(null);
                        setPriceRange({ min: '', max: '' }); setMinSupport(''); setSortOrder('-creado_en');
                        setIsOferta(false);
                    }}>Limpiar Filtros</button>
                </aside>

                <main className="products-main">
                    
                    {/* ETIQUETAS DE FILTROS ACTIVOS */}
                    <div className="active-filters">
                        {(selectedCategory || selectedLine || selectedMeasure || minSupport || priceRange.min || priceRange.max) && (
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

                        {selectedMeasure && (
                            <div className="filter-tag">
                                Medida: {measures.find(m => m.value === selectedMeasure)?.label}
                                <button onClick={() => setSelectedMeasure(null)}>×</button>
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
                                Precio: {priceRange.max ? `Hasta $${Number(priceRange.max).toLocaleString('es-AR')}` : 'Todos'}
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
                .catalog-container { max-width: 1300px; margin: 0 auto; padding: clamp(20px, 3vw, 40px) clamp(10px, 3vw, 20px); font-family: 'Inter', sans-serif; transition: background-color 0.3s ease, color 0.3s ease; }
                .catalog-header { margin-bottom: 30px; }
                .catalog-header h1 { font-size: clamp(1.4rem, 4vw, 2.2rem); color: var(--decoud-blue); margin-bottom: 5px; font-weight: 800; transition: color 0.3s ease; }
                .catalog-header p { color: #64748b; font-size: 1rem; }

                /* ── BANNER OFERTAS ── */
                .ofertas-header {
                    margin: -clamp(20px,3vw,40px) -clamp(10px,3vw,20px) 30px;
                    padding: 40px clamp(10px,3vw,20px);
                    background: linear-gradient(135deg, #0F213A 0%, #1B365D 55%, #7c3aed 100%);
                    position: relative;
                    overflow: hidden;
                }
                .ofertas-header::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: repeating-linear-gradient(
                        -45deg,
                        transparent,
                        transparent 18px,
                        rgba(255,255,255,0.025) 18px,
                        rgba(255,255,255,0.025) 19px
                    );
                    pointer-events: none;
                }
                .ofertas-header-inner { position: relative; z-index: 1; max-width: 1260px; margin: 0 auto; }
                .ofertas-tag {
                    display: inline-block;
                    background: var(--decoud-gold);
                    color: #0F213A;
                    font-size: 0.65rem;
                    font-weight: 900;
                    letter-spacing: 3px;
                    padding: 4px 12px;
                    border-radius: 20px;
                    margin-bottom: 12px;
                    text-transform: uppercase;
                }
                .ofertas-title {
                    font-size: clamp(1.8rem, 5vw, 3rem);
                    font-weight: 900;
                    color: #fff;
                    margin: 0 0 10px;
                    line-height: 1.1;
                }
                .ofertas-subtitle { color: #94a3b8; font-size: 1rem; margin: 0 0 20px; }
                .ver-catalogo-btn {
                    margin-top: 4px;
                    background: none;
                    border: 1px solid rgba(255,255,255,0.3);
                    color: rgba(255,255,255,0.75);
                    padding: 8px 18px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s, color 0.2s, border-color 0.2s;
                }
                .ver-catalogo-btn:hover {
                    background: rgba(255,255,255,0.1);
                    border-color: rgba(255,255,255,0.6);
                    color: #fff;
                }

                .filter-oferta-note {
                    font-size: 0.8rem;
                    color: #7c3aed;
                    background: rgba(124,58,237,0.07);
                    border: 1px solid rgba(124,58,237,0.2);
                    border-radius: 6px;
                    padding: 8px 12px;
                    margin: 0;
                    font-style: italic;
                }

                .catalog-layout { display: grid; grid-template-columns: 260px 1fr; gap: 40px; }
                .filters-sidebar { position: sticky; top: 100px; height: fit-content; }
                .mobile-filter-btn { display: none; background: var(--decoud-blue); color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; margin-bottom: 15px; }
                .mobile-filter-btn svg { vertical-align: middle; margin-right: 6px; }
                
                .filter-group { margin-bottom: 30px; }
                .filter-group h3 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: var(--decoud-blue); margin-bottom: 15px; font-weight: 700; border-bottom: 2px solid var(--border-color); padding-bottom: 8px; transition: color 0.3s ease, border-color 0.3s ease; }
                .filters-sidebar button { background: none; border: none; cursor: pointer; font-size: 0.95rem; color: #64748b; transition: all 0.2s; text-align: left; padding: 6px 0; display: block; width: 100%; }
                .filters-sidebar button:hover { color: var(--decoud-blue); padding-left: 5px; }
                .filters-sidebar button.active { color: var(--decoud-blue); font-weight: 700; }
                
                .filter-select { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); color: #475569; outline: none; background-color: var(--content-bg); transition: background-color 0.3s ease, border-color 0.3s ease; }
                
                .price-slider-container { margin-top: 10px; }
                .price-slider { width: 100%; height: 6px; background: var(--border-color); border-radius: 5px; outline: none; -webkit-appearance: none; margin: 15px 0; cursor: pointer; }
                .price-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; background: var(--decoud-blue); cursor: pointer; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
                .price-slider::-moz-range-thumb { width: 18px; height: 18px; background: var(--decoud-blue); cursor: pointer; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
                .price-display { font-size: 0.9rem; color: #64748b; }
                .price-display b { color: var(--decoud-blue); }
                
                .reset-btn { width: 100%; padding: 12px; background: var(--border-color); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; color: #64748b; font-weight: 600; margin-top: 10px; transition: all 0.3s ease; }
                .reset-btn:hover { background: var(--border-color); color: var(--decoud-blue); opacity: 0.8; }

                .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding: 15px 20px; background: var(--border-color); border-radius: 12px; transition: background-color 0.3s ease; }
                
                .active-filters { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 20px; min-height: 35px; }
                .filter-label { font-size: 0.85rem; color: #94a3b8; font-weight: 600; }
                .filter-tag { background: var(--content-bg); border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; color: var(--decoud-blue); font-weight: 700; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); transition: all 0.3s ease; }
                .filter-tag button { background: none; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer; line-height: 1; padding: 0; transition: color 0.2s; }
                .filter-tag button:hover { color: #e11d48; }

                .results-count { font-size: 0.95rem; color: var(--color-text-dark); transition: color 0.3s ease; }
                .sort-box { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; color: #64748b; }
                .sort-box select { border: none; background: none; font-weight: 700; color: var(--decoud-blue); cursor: pointer; outline: none; transition: color 0.3s ease; }

                .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr)); gap: clamp(15px, 3vw, 30px); }
                .no-results { grid-column: 1/-1; text-align: center; padding: clamp(30px, 5vw, 80px); color: #94a3b8; font-size: 1.1rem; border: 2px dashed var(--border-color); border-radius: 20px; transition: border-color 0.3s ease; }

                @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }

                @media (max-width: 900px) {
                    .catalog-layout { grid-template-columns: 1fr; }
                    .filters-sidebar { display: none; }
                    .filters-sidebar.open { display: block; background: var(--content-bg); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 20px; position: static; }
                    .mobile-filter-btn { display: inline-flex; align-items: center; }
                }
                @media (max-width: 480px) {
                    .top-bar { flex-direction: column; align-items: flex-start; gap: 10px; }
                    .products-grid { grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr)); }
                }
            `}</style>
        </div>
    );
};

const skeletonStyles = {
    card: { backgroundColor: 'var(--content-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', height: '450px', transition: 'background-color 0.3s ease, border-color 0.3s ease' },
    image: { width: '100%', height: '240px', backgroundColor: 'var(--border-color)', animation: 'pulse 1.5s infinite ease-in-out' },
    content: { padding: '20px' },
    lineShort: { width: '40%', height: '12px', backgroundColor: 'var(--border-color)', marginBottom: '10px', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' },
    lineLong: { width: '90%', height: '18px', backgroundColor: 'var(--border-color)', marginBottom: '10px', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' },
    lineMedium: { width: '60%', height: '12px', backgroundColor: 'var(--border-color)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }
};

export default ProductList;