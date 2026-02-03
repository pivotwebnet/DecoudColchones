// src/pages/FAQPage.jsx
import React, { useState } from 'react';

const FAQPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const toggleAccordion = (index) => {
        if (activeIndex === index) {
            setActiveIndex(null);
        } else {
            setActiveIndex(index);
        }
    };

    const faqSections = [
        {
            title: "🚚 Envíos y Coordinación",
            content: (
                <>
                    <div style={styles.highlightItem}>
                        <h4 style={{ color: '#15803d', fontWeight: 'bold', marginBottom: '10px' }}>
                            ✨ Ya hice mi compra, ¿cómo coordinamos?
                        </h4>
                        <p style={styles.answer}>
                            <strong>¡Es muy sencillo!</strong> Una vez finalizada tu compra, <strong>escribinos a WhatsApp</strong> indicando tu número de pedido. Coordinamos día y hora personalmente.
                        </p>
                    </div>
                    <div style={styles.subItem}>
                        <h4 style={styles.questionTitle}>¿Realizan envíos a todo el país?</h4>
                        <p style={styles.answer}>
                            Llevamos nuestros productos desde Rafaela a gran parte del país. <br/>
                            <small style={{color:'#d9534f'}}>*NO llegamos afuera del país.</small>
                        </p>
                    </div>
                    <div style={styles.subItem}>
                        <h4 style={styles.questionTitle}>¿Cuánto demora el envío?</h4>
                        <p style={styles.answer}>
                            El plazo estimado es de <strong>1 a 7 días hábiles</strong> dependiendo del destino.
                        </p>
                    </div>
                </>
            )
        },
        {
            title: "💳 Garantía, Pagos y Facturación",
            content: (
                <>
                    <div style={styles.subItem}>
                        <h4 style={styles.questionTitle}>¿Los productos tienen garantía?</h4>
                        <p style={styles.answer}>
                            ¡Por supuesto! <strong>Somos fabricantes</strong>. Todos los productos tienen garantía escrita por defectos de fabricación.
                        </p>
                    </div>
                    <div style={styles.subItem}>
                        <h4 style={styles.questionTitle}>¿Qué medios de pago ofrecen?</h4>
                        <ul style={styles.list}>
                            <li><strong>Tarjetas:</strong> VISA, Mastercard, Amex, CABAL.</li>
                            <li><strong>Transferencia y Efectivo.</strong></li>
                        </ul>
                    </div>
                    <div style={styles.subItem}>
                        <h4 style={styles.questionTitle}>Datos para Transferencia</h4>
                        <div style={styles.bankBox}>
                            <p><strong>Banco Galicia</strong></p>
                            <p>Titular: Gustavo Antonio Decoud</p>
                            <p>CBU: 0070111830004170156834</p>
                            <p>ALIAS: BLOQUES.PLACAS</p>
                        </div>
                    </div>
                </>
            )
        },
        {
            title: "🏭 Uso y Sobre Nosotros",
            content: (
                <>
                    <div style={styles.subItem}>
                        <h4 style={styles.questionTitle}>Mantenimiento: ¿El colchón se gira?</h4>
                        <p style={styles.answer}>
                            ¡Sí! Te recomendamos girarlo <strong>cada 6 meses</strong> para mayor durabilidad.
                        </p>
                    </div>
                    <div style={styles.subItem}>
                        <h4 style={styles.questionTitle}>¿De dónde son?</h4>
                        <p style={styles.answer}>
                            Somos de <strong>Rafaela, Santa Fe</strong>. Nuestro local está en <em>B. Iturraspe al 1948</em>.
                        </p>
                    </div>
                </>
            )
        }
    ];

    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '60px 0' }}>
            <div className="container-centered" style={{ maxWidth: '800px' }}>
                
                <h1 style={styles.pageTitle}>Preguntas Frecuentes</h1>
                <p style={styles.intro}>
                    Resolvemos tus dudas sobre compras, envíos y productos.
                </p>
                
                {/* --- ACORDEÓN --- */}
                <div className="accordion" id="faqAccordion">
                    {faqSections.map((section, index) => {
                        const isOpen = activeIndex === index;
                        return (
                            <div className="accordion-item" key={index} style={{ marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                                <h2 className="accordion-header">
                                    <button 
                                        className={`accordion-button ${isOpen ? '' : 'collapsed'}`} 
                                        type="button" 
                                        onClick={() => toggleAccordion(index)}
                                        style={styles.accordionBtn} // AQUI ESTÁ LA CLAVE DEL ESTILO FLEX
                                    >
                                        {/* Título de la sección */}
                                        <span style={{ flex: 1, textAlign: 'left' }}>{section.title}</span>

                                        {/* --- FLECHA MANUAL --- */}
                                        {/* Agregamos este SVG explícito para ver la flecha sí o sí */}
                                        <svg 
                                            width="20" 
                                            height="20" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                            style={{
                                                transition: 'transform 0.3s ease', // Animación de rotación
                                                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', // Rota si está abierto
                                                marginLeft: '15px',
                                                color: '#1e3a8a'
                                            }}
                                        >
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>

                                    </button>
                                </h2>
                                
                                <div 
                                    className="accordion-collapse"
                                    style={{
                                        maxHeight: isOpen ? '1500px' : '0px', 
                                        overflow: 'hidden',
                                        transition: 'max-height 0.4s ease-in-out, opacity 0.4s ease-in-out',
                                        opacity: isOpen ? 1 : 0
                                    }}
                                >
                                    <div className="accordion-body" style={{ padding: '20px 25px' }}>
                                        {section.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

const styles = {
    pageTitle: { fontSize: '2.5rem', color: '#1e3a8a', marginBottom: '10px', fontWeight: 'bold', textAlign: 'center' },
    intro: { textAlign: 'center', color: '#64748b', marginBottom: '40px', fontSize: '1.1rem' },
    
    // ESTILO IMPORTANTE DEL BOTÓN
    accordionBtn: { 
        fontSize: '1.1rem', 
        fontWeight: 'bold', 
        color: '#1e3a8a', 
        backgroundColor: '#f8fafc', 
        boxShadow: 'none',
        display: 'flex',            // Para alinear título y flecha
        justifyContent: 'space-between', 
        alignItems: 'center',
        width: '100%',
        padding: '15px 20px',
        border: 'none',
        cursor: 'pointer'
    },
    
    subItem: { marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px dashed #eee' },
    questionTitle: { fontSize: '1.1rem', color: '#333', fontWeight: '700', marginBottom: '8px' },
    answer: { fontSize: '0.95rem', color: '#555', lineHeight: '1.6', margin: 0 },
    highlightItem: { backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '25px' },
    list: { fontSize: '0.95rem', color: '#555', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '10px' },
    bankBox: { backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #1e3a8a', fontFamily: 'monospace', fontSize: '0.9rem', color: '#334155', marginTop: '10px' }
};

export default FAQPage;