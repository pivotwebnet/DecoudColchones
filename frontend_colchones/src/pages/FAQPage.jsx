// src/pages/FAQPage.jsx
import React from 'react';

const FAQPage = () => {
    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '60px 0' }}>
            <div className="container-centered" style={{ maxWidth: '800px' }}>
                
                {/* Título Principal */}
                <h1 style={styles.pageTitle}>Preguntas Frecuentes</h1>
                <p style={styles.intro}>
                    Aquí reunimos las dudas más comunes. Somos una fábrica familiar, así que si necesitás saber algo más, no dudes en escribirnos directamente.
                </p>
                
                <div style={styles.faqContainer}>
                    
                    {/* SECCIÓN: LO MÁS IMPORTANTE (ENVÍOS) */}
                    <div style={styles.sectionTitle}>Envíos y Coordinación</div>

                    {/* NUEVO: AVISO IMPORTANTE DE WHATSAPP */}
                    <div style={styles.highlightItem}>
                        <h2 style={{...styles.question, color: '#15803d'}}>✨ Ya hice mi compra, ¿cómo coordinamos el envío?</h2>
                        <p style={styles.answer}>
                            <strong>¡Es muy sencillo!</strong> Una vez finalizada tu compra, <strong>por favor escribinos a nuestro WhatsApp</strong> indicando tu número de pedido.
                            <br /><br />
                            Al ser productos de gran volumen, nos gusta coordinar personalmente con vos el día y la franja horaria de entrega para asegurarnos de que estés en casa para recibir tu nuevo descanso.
                        </p>
                    </div>

                    <div style={styles.item}>
                        <h2 style={styles.question}>¿Realizan envíos a todo el país?</h2>
                        <p style={styles.answer}>
                            Llevamos nuestros productos desde Rafaela a gran parte del país. <br/>
                            <small style={{color:'#d9534f'}}>*Actualmente NO llegamos a: Tierra del Fuego, Santa Cruz, Chubut, Río Negro, Neuquén, Salta, Jujuy, Formosa y Misiones.</small>
                        </p>
                    </div>

                    <div style={styles.item}>
                        <h2 style={styles.question}>¿Cuánto demora el envío?</h2>
                        <p style={styles.answer}>
                            El plazo estimado es de <strong>10 a 21 días hábiles</strong>. Depende de tu ubicación y la logística, pero siempre trabajamos para que llegue lo antes posible.
                        </p>
                    </div>

                    {/* SECCIÓN: GARANTÍA Y PAGOS */}
                    <div style={styles.sectionTitle}>Garantía y Pagos</div>

                    <div style={styles.item}>
                        <h2 style={styles.question}>¿Los productos tienen garantía?</h2>
                        <p style={styles.answer}>
                            ¡Por supuesto! <strong>Somos fabricantes</strong> y respaldamos nuestra calidad. Todos los productos tienen garantía directa de fábrica por cualquier defecto de elaboración que afecte su funcionalidad.
                        </p>
                    </div>

                    <div style={styles.item}>
                        <h2 style={styles.question}>¿Qué medios de pago ofrecen?</h2>
                        <ul style={styles.list}>
                            <li><strong>Tarjetas de crédito:</strong> VISA, Mastercard, Amex y Cabal (Bancos autorizados).</li>
                            <li><strong>Débito y Efectivo.</strong></li>
                            <li><strong>Transferencia bancaria.</strong></li>
                        </ul>
                    </div>

                    <div style={styles.item}>
                        <h2 style={styles.question}>¿En cuántas cuotas puedo pagar?</h2>
                        <p style={styles.answer}>
                            Hacemos un esfuerzo para ofrecerte <strong>hasta 12 cuotas sin interés</strong> con tarjetas de crédito bancarizadas. Queremos que tener un buen colchón sea posible.
                        </p>
                    </div>

                    <div style={styles.item}>
                        <h2 style={styles.question}>Datos para Transferencia</h2>
                        <div style={styles.bankBox}>
                            <p><strong>Banco Macro</strong></p>
                            <p>Titular: HARTMANN SA</p>
                            <p>CBU: 2850891540095318791348</p>
                            <p>CUIT: 30-71700117-2</p>
                            <p>Nº Cuenta: 489109531879134</p>
                            <p style={{marginTop:'10px', fontStyle:'italic', color:'#555'}}>*Recordá enviarnos el comprobante por WhatsApp.</p>
                        </div>
                    </div>

                    <div style={styles.item}>
                        <h2 style={styles.question}>¿Hacen Factura A?</h2>
                        <p style={styles.answer}>
                            Sí. Como somos agentes de retención (Santa Fe y Misiones), necesitamos que nos envíes el <strong>Formulario 1276</strong> dentro de las 24hs de la compra. De lo contrario, emitiremos Factura B para no demorar tu envío.
                        </p>
                    </div>

                    {/* SECCIÓN: USO Y SOBRE NOSOTROS */}
                    <div style={styles.sectionTitle}>Uso y Sobre Nosotros</div>

                    <div style={styles.item}>
                        <h2 style={styles.question}>Mantenimiento: ¿El colchón se gira?</h2>
                        <p style={styles.answer}>
                            ¡Sí! Te recomendamos girarlo <strong>cada 10 o 15 días</strong>. Esto ayuda a que los materiales se asienten parejo con tu peso y el colchón dure mucho más tiempo como nuevo.
                        </p>
                    </div>

                    <div style={styles.item}>
                        <h2 style={styles.question}>¿De dónde son?</h2>
                        <p style={styles.answer}>
                            Somos una empresa de <strong>Rafaela, Santa Fe</strong>. Tenemos más de 25 años de trayectoria fabricando descanso. Si andás por la ciudad, podés visitarnos en nuestro local de <em>Ituzaingó 194</em>.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

const styles = {
    pageTitle: {
        fontSize: '2.5rem',
        color: '#1e3a8a',
        marginBottom: '10px',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    intro: {
        textAlign: 'center',
        color: '#666',
        marginBottom: '50px',
        fontSize: '1.1rem'
    },
    sectionTitle: {
        fontSize: '1.5rem',
        color: '#d4af37', // Dorado
        borderBottom: '2px solid #eee',
        paddingBottom: '10px',
        marginTop: '30px',
        marginBottom: '20px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    faqContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '30px'
    },
    item: {
        paddingBottom: '20px'
    },
    highlightItem: {
        backgroundColor: '#f0fdf4', // Fondo verde muy claro
        padding: '25px',
        borderRadius: '12px',
        border: '1px solid #bbf7d0',
        marginBottom: '10px'
    },
    question: {
        fontSize: '1.3rem',
        color: '#333',
        marginBottom: '10px',
        fontWeight: '700'
    },
    answer: {
        fontSize: '1rem',
        color: '#555',
        lineHeight: '1.6',
        margin: 0
    },
    list: {
        fontSize: '1rem',
        color: '#555',
        lineHeight: '1.8',
        paddingLeft: '20px',
        marginBottom: '15px'
    },
    bankBox: {
        backgroundColor: '#f8fafc',
        padding: '20px',
        borderRadius: '8px',
        borderLeft: '4px solid #1e3a8a',
        fontFamily: 'monospace',
        fontSize: '0.95rem',
        color: '#333'
    }
};

export default FAQPage;