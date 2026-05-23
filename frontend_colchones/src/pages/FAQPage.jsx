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
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: 'clamp(30px, 5vw, 60px) 0', transition: 'background-color 0.3s ease' }}>
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
                            <div className="accordion-item" key={index} style={{ marginBottom: '10px', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', transition: 'border-color 0.3s ease' }}>
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
                                                transition: 'transform 0.3s ease, color 0.3s ease', // Animación de rotación
                                                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', // Rota si está abierto
                                                marginLeft: '15px',
                                                color: 'var(--decoud-blue)'
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
                                        transition: 'max-height 0.4s ease-in-out, opacity 0.4s ease-in-out, background-color 0.3s ease',
                                        opacity: isOpen ? 1 : 0,
                                        backgroundColor: 'var(--content-bg)'
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
    pageTitle: { fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', color: 'var(--decoud-blue)', marginBottom: '10px', fontWeight: 'bold', textAlign: 'center', transition: 'color 0.3s ease' },
    intro: { textAlign: 'center', color: 'var(--color-text-dark)', marginBottom: '40px', fontSize: '1.1rem', transition: 'color 0.3s ease' },
    
    // ESTILO IMPORTANTE DEL BOTÓN
    accordionBtn: {
        fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
        fontWeight: 'bold',
        color: 'var(--decoud-blue)',
        backgroundColor: 'var(--border-color)',
        boxShadow: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 'clamp(12px, 2vw, 15px) clamp(12px, 2vw, 20px)',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    
    subItem: { marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px dashed var(--border-color)', transition: 'border-color 0.3s ease' },
    questionTitle: { fontSize: '1.1rem', color: 'var(--color-text-dark)', fontWeight: '700', marginBottom: '8px', transition: 'color 0.3s ease' },
    answer: { fontSize: '0.95rem', color: 'var(--color-text-dark)', lineHeight: '1.6', margin: 0, transition: 'color 0.3s ease' },
    highlightItem: { backgroundColor: 'rgba(240, 253, 244, 0.1)', padding: '20px', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '25px', transition: 'background-color 0.3s ease' },
    list: { fontSize: '0.95rem', color: 'var(--color-text-dark)', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '10px', transition: 'color 0.3s ease' },
    bankBox: { backgroundColor: 'var(--border-color)', padding: '15px', borderRadius: '6px', borderLeft: '4px solid var(--decoud-blue)', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--color-text-dark)', marginTop: '10px', transition: 'all 0.3s ease' }
};

export default FAQPage;