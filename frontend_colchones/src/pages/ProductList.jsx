// src/pages/CatalogPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { getProductos } from '../api/api'; 
import { useCart } from '../context/CartContext';

const CatalogPage = () => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();

    // --- ESTADOS DE FILTROS ---
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [sortOrder, setSortOrder] = useState('newest'); 
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [lineFilter, setLineFilter] = useState('');

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

    // Detectar cambios en la URL
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
            setLineFilter(''); 
        }
    }, [location.search]);

    const categories = useMemo(() => {
        const cats = products.map(p => p.categoria?.nombre || 'Otros');
        return ['Todas', ...new Set(cats)];
    }, [products]);

    // --- LÓGICA DE FILTRADO MAESTRA ---
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // A. Filtro por Categoría
        if (selectedCategory !== 'Todas') {
            result = result.filter(p => (p.categoria?.nombre || 'Otros') === selectedCategory);
        }

        // B. Filtro por LÍNEA (CORREGIDO Y MEJORADO)
        if (lineFilter) {
            // "linea-catarata" se convierte en "catarata"
            // "box-prime" se convierte en "box prime"
            const cleanTerm = lineFilter
                .toLowerCase()
                .replace(/-/g, ' ')       // Reemplaza guiones por espacios
                .replace(/^linea\s+/, '') // Quita "linea " solo si está al principio
                .replace(/\s+linea$/, '') // Quita " linea" al final
                .replace('linea', '')     // Opcional: quita linea en cualquier lado si prefieres
                .trim();

            // Buscamos si el nombre del producto incluye el término limpio
            result = result.filter(p => {
                const prodName = p.nombre.toLowerCase();
                // Verificamos si "catarata" está en "colchón catarata 2 plazas"
                return prodName.includes(cleanTerm);
            });
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
            <div className="catalog-header">
                <h1>Nuestros Colchones</h1>
                
                {lineFilter ? (
                    <div style={{marginTop: '10px'}}>
                        <span style={{
                            backgroundColor: '#e0f2fe', 
                            color:'#0284c7', 
                            padding:'8px 20px', 
                            borderRadius:'30px', 
                            fontSize:'1rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            Viendo línea: <b>{lineFilter.replace(/-/g, ' ').toUpperCase()}</b>
                            <button 
                                onClick={() => { setLineFilter(''); window.history.pushState({}, '', '/colchones'); }}
                                style={{
                                    border:'none', background:'white', width:'24px', height:'24px', 
                                    borderRadius:'50%', cursor:'pointer', color:'#0284c7', fontWeight:'bold',
                                    display:'flex', alignItems:'center', justifyContent:'center'
                                }}
                                title="Quitar filtro"
                            >
                                ✕
                            </button>
                        </span>
                    </div>
                ) : (
                    <p>Encontrá el descanso perfecto para vos</p>
                )}
            </div>

            <div className="catalog-layout">
                <aside className="filters-sidebar">
                    <div className="filter-group">
                        <h3>Categorías</h3>
                        <ul>
                            {categories.map(cat => (
                                <li key={cat}>
                                    <button 
                                        className={selectedCategory === cat ? 'active' : ''}
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
                                <Link to={`/colchones/${product.slug}`} key={product.id} className="product-card">
                                    <div className="card-image">
                                        {product.imagen ? (
                                            <img src={product.imagen} alt={product.nombre} />
                                        ) : (
                                            <div className="no-img">Sin Imagen</div>
                                        )}
                                        {product.precio_anterior && <span className="badge-offer">OFERTA</span>}
                                    </div>
                                    <div className="card-info">
                                        <span className="card-category">{product.categoria?.nombre || 'General'}</span>
                                        <h3>{product.nombre}</h3>
                                        <div className="card-price-row">
                                            <div>
                                                <span className="price">${Number(product.precio).toLocaleString('es-AR')}</span>
                                                {product.precio_anterior && (
                                                    <span className="old-price">${Number(product.precio_anterior).toLocaleString('es-AR')}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="card-installments">
                                            12 cuotas de <b>${Math.round(product.precio / 12).toLocaleString('es-AR')}</b>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <p>No encontramos productos para "{lineFilter.replace(/-/g, ' ')}". 😔</p>
                            <button onClick={() => { setSelectedCategory('Todas'); setPriceRange({min:'', max:''}); setLineFilter(''); }}>
                                Ver todos los productos
                            </button>
                        </div>
                    )}
                </main>
            </div>

            <style>{`
                .catalog-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: 'Helvetica', sans-serif; }
                .loader-container { padding: 100px; text-align: center; font-size: 1.5rem; color: #666; }
                .catalog-header { text-align: center; margin-bottom: 50px; }
                .catalog-header h1 { font-size: 2.5rem; color: #1e3a8a; margin-bottom: 10px; }
                .catalog-header p { color: #64748b; font-size: 1.1rem; }
                .catalog-layout { display: flex; gap: 40px; }
                .filters-sidebar { flex: 0 0 250px; } 
                .filter-group { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
                .filter-group h3 { margin-bottom: 15px; font-size: 1.1rem; color: #333; }
                .filters-sidebar ul { list-style: none; padding: 0; }
                .filters-sidebar li { margin-bottom: 10px; }
                .filters-sidebar button { background: none; border: none; cursor: pointer; font-size: 1rem; color: #666; transition: 0.2s; text-align: left; padding: 0; }
                .filters-sidebar button:hover { color: #1e3a8a; }
                .filters-sidebar button.active { color: #1e3a8a; font-weight: bold; text-decoration: underline; }
                .price-inputs { display: flex; align-items: center; gap: 10px; }
                .price-inputs input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
                .reset-btn { width: 100%; padding: 10px; background: #f1f5f9; border: none; border-radius: 4px; cursor: pointer; color: #64748b; font-weight: bold; }
                .reset-btn:hover { background: #e2e8f0; color: #333; }
                .products-main { flex: 1; }
                .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
                .sort-box select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-left: 10px; cursor: pointer; }
                .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 30px; }
                .product-card { display: block; text-decoration: none; color: inherit; background: white; border: 1px solid #eee; border-radius: 8px; transition: transform 0.2s, box-shadow 0.2s; overflow: hidden; }
                .product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
                .card-image { height: 250px; background: #f9f9f9; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
                .card-image img { width: 100%; height: 100%; object-fit: cover; }
                .badge-offer { position: absolute; top: 10px; left: 10px; background: #e11d48; color: white; padding: 4px 8px; font-size: 0.7rem; font-weight: bold; border-radius: 4px; }
                .card-info { padding: 15px; }
                .card-category { font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
                .card-info h3 { margin: 5px 0 10px 0; font-size: 1.1rem; color: #333; }
                .card-price-row { display: flex; justify-content: space-between; align-items: flex-end; }
                .price { font-size: 1.4rem; font-weight: bold; color: #1e3a8a; }
                .old-price { font-size: 0.9rem; color: #999; text-decoration: line-through; margin-left: 10px; }
                .card-installments { font-size: 0.85rem; color: #00a650; margin-top: 5px; }
                .no-results { text-align: center; padding: 50px; color: #666; }
                .no-results button { background: #1e3a8a; color: white; border: none; padding: 10px 20px; border-radius: 4px; margin-top: 15px; cursor: pointer; }
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

export default CatalogPage;