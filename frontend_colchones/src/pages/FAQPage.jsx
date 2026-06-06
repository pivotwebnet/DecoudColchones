import React, { useState } from 'react';

const WHATSAPP_NUMBER = '5493492638470';
const WHATSAPP_MSG = encodeURIComponent('Hola Decoud, tengo una consulta y no encontré la respuesta en el FAQ.');
const EMAIL = 'contacto@decoud.com';

const faqSections = [
    {
        icon: '🚚',
        title: 'Envíos y Coordinación',
        items: [
            {
                q: '¿Ya hice mi compra, cómo coordinamos el envío?',
                a: '¡Es muy sencillo! Una vez finalizada tu compra, escribinos a WhatsApp indicando tu número de pedido. Coordinamos día y hora personalmente.',
            },
            {
                q: '¿Realizan envíos a todo el país?',
                a: 'Llevamos nuestros productos desde Rafaela a gran parte del país. *No realizamos envíos al exterior.',
            },
            {
                q: '¿Cuánto demora el envío?',
                a: 'El plazo estimado es de 1 a 7 días hábiles dependiendo del destino.',
            },
        ],
    },
    {
        icon: '💳',
        title: 'Garantía, Pagos y Facturación',
        items: [
            {
                q: '¿Los productos tienen garantía?',
                a: '¡Por supuesto! Somos fabricantes. Todos los productos tienen garantía escrita por defectos de fabricación.',
            },
            {
                q: '¿Qué medios de pago ofrecen?',
                a: 'Aceptamos tarjetas (VISA, Mastercard, Amex, CABAL), transferencia bancaria y efectivo.',
            },
            {
                q: '¿Cuáles son los datos para transferencia?',
                a: null,
                bankData: {
                    banco: 'Banco Galicia',
                    titular: 'Gustavo Antonio Decoud',
                    cbu: '0070111830004170156834',
                    alias: 'BLOQUES.PLACAS',
                },
            },
        ],
    },
    {
        icon: '🛏️',
        title: 'Uso y Sobre Nosotros',
        items: [
            {
                q: '¿El colchón se gira?',
                a: 'Sí, te recomendamos girarlo cada 6 meses para mayor durabilidad y conservar su forma.',
            },
            {
                q: '¿De dónde son?',
                a: 'Somos de Rafaela, Santa Fe. Nuestro local está en B. Iturraspe 1948.',
            },
        ],
    },
];

const FAQPage = () => {
    const [openSection, setOpenSection] = useState(0);
    const [openItems, setOpenItems] = useState({ '0-0': true });

    const toggleSection = (si) => {
        setOpenSection(prev => prev === si ? null : si);
    };

    const toggleItem = (key) => {
        setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div style={s.page}>

            {/* ── HERO ── */}
            <div style={s.hero}>
                <div style={s.heroBadge}>Centro de Ayuda</div>
                <h1 style={s.heroTitle}>¿En qué te podemos ayudar?</h1>
                <p style={s.heroSub}>Encontrá respuestas sobre envíos, pagos, garantía y más.</p>

                {/* Contact cards */}
                <div style={s.contactRow}>
                    <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ ...s.contactCard, ...s.contactCardWa }}
                    >
                        <span style={s.contactIcon}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.108.549 4.085 1.51 5.8L0 24l6.388-1.676A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-4.988-1.362l-.358-.213-3.714.974.991-3.622-.234-.372A9.808 9.808 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                            </svg>
                        </span>
                        <div>
                            <div style={s.contactLabel}>WhatsApp</div>
                            <div style={s.contactSub}>Respuesta rápida</div>
                        </div>
                    </a>

                    <a
                        href={`mailto:${EMAIL}`}
                        style={{ ...s.contactCard, ...s.contactCardEmail }}
                    >
                        <span style={s.contactIcon}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                        </span>
                        <div>
                            <div style={s.contactLabel}>Email</div>
                            <div style={s.contactSub}>{EMAIL}</div>
                        </div>
                    </a>
                </div>
            </div>

            {/* ── FAQ ── */}
            <div style={s.faqWrap}>
                <h2 style={s.faqHeading}>Preguntas frecuentes</h2>

                {faqSections.map((section, si) => {
                    const sectionOpen = openSection === si;
                    return (
                        <div key={si} style={{ ...s.sectionCard, ...(sectionOpen ? s.sectionCardOpen : {}) }}>
                            {/* Section header */}
                            <button style={s.sectionBtn} onClick={() => toggleSection(si)}>
                                <span style={s.sectionIcon}>{section.icon}</span>
                                <span style={s.sectionTitle}>{section.title}</span>
                                <svg
                                    width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round"
                                    style={{ ...s.chevron, transform: sectionOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {/* Items */}
                            <div style={{ ...s.itemsWrap, maxHeight: sectionOpen ? '2000px' : '0px', opacity: sectionOpen ? 1 : 0 }}>
                                <div style={s.itemsInner}>
                                    {section.items.map((item, ii) => {
                                        const key = `${si}-${ii}`;
                                        const itemOpen = !!openItems[key];
                                        return (
                                            <div key={ii} style={{ ...s.item, ...(item.highlight ? s.itemHighlight : {}) }}>
                                                <button style={s.itemBtn} onClick={() => toggleItem(key)}>
                                                    <span style={s.itemQ}>{item.q}</span>
                                                    <svg
                                                        width="16" height="16" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor" strokeWidth="2.5"
                                                        strokeLinecap="round" strokeLinejoin="round"
                                                        style={{ ...s.itemChevron, transform: itemOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
                                                    >
                                                        <polyline points="6 9 12 15 18 9" />
                                                    </svg>
                                                </button>
                                                <div style={{ ...s.itemAnswer, maxHeight: itemOpen ? '500px' : '0px', opacity: itemOpen ? 1 : 0 }}>
                                                    <div style={s.itemAnswerInner}>
                                                        {item.bankData ? (
                                                            <div style={s.bankBox}>
                                                                <p style={s.bankRow}><strong>Banco:</strong> {item.bankData.banco}</p>
                                                                <p style={s.bankRow}><strong>Titular:</strong> {item.bankData.titular}</p>
                                                                <p style={s.bankRow}><strong>CBU:</strong> <span style={s.bankMono}>{item.bankData.cbu}</span></p>
                                                                <p style={{ ...s.bankRow, marginBottom: 0 }}><strong>ALIAS:</strong> <span style={s.bankMono}>{item.bankData.alias}</span></p>
                                                            </div>
                                                        ) : (
                                                            <p style={s.answerText}>{item.a}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* ── CTA FINAL ── */}
                <div style={s.ctaBox}>
                    <p style={s.ctaTitle}>¿No encontraste lo que buscabas?</p>
                    <p style={s.ctaSub}>Escribinos directamente y te respondemos a la brevedad.</p>
                    <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={s.ctaBtn}
                    >
                        Consultar por WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
};

const s = {
    page: {
        backgroundColor: 'var(--bg-color)',
        minHeight: '100vh',
        transition: 'background-color 0.3s ease',
    },

    /* ── Hero ── */
    hero: {
        background: 'linear-gradient(135deg, #1B365D 0%, #0F213A 100%)',
        padding: 'clamp(48px, 8vw, 80px) 20px clamp(40px, 6vw, 64px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    heroBadge: {
        display: 'inline-block',
        backgroundColor: 'rgba(212,175,55,0.18)',
        color: '#D4AF37',
        border: '1px solid rgba(212,175,55,0.4)',
        borderRadius: '100px',
        padding: '4px 16px',
        fontSize: '0.78rem',
        fontWeight: '700',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: '18px',
    },
    heroTitle: {
        color: '#FEFAF4',
        fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
        fontWeight: '800',
        margin: '0 0 12px',
        lineHeight: 1.2,
    },
    heroSub: {
        color: 'rgba(254,250,244,0.72)',
        fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
        margin: '0 0 36px',
    },

    /* Contact cards */
    contactRow: {
        display: 'flex',
        gap: '14px',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    contactCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '14px 22px',
        borderRadius: '12px',
        textDecoration: 'none',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        minWidth: '200px',
    },
    contactCardWa: {
        backgroundColor: '#25D366',
        color: '#fff',
    },
    contactCardEmail: {
        backgroundColor: 'rgba(254,250,244,0.12)',
        color: '#FEFAF4',
        border: '1px solid rgba(254,250,244,0.2)',
    },
    contactIcon: {
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
    },
    contactLabel: {
        fontWeight: '700',
        fontSize: '0.95rem',
        lineHeight: 1.2,
    },
    contactSub: {
        fontSize: '0.78rem',
        opacity: 0.82,
        marginTop: '2px',
    },

    /* ── FAQ wrapper ── */
    faqWrap: {
        maxWidth: '760px',
        margin: '0 auto',
        padding: 'clamp(32px, 5vw, 56px) 20px clamp(48px, 6vw, 80px)',
    },
    faqHeading: {
        color: 'var(--decoud-blue)',
        fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
        fontWeight: '700',
        marginBottom: '24px',
        paddingBottom: '12px',
        borderBottom: '2px solid var(--border-color)',
        transition: 'color 0.3s ease',
    },

    /* Section card */
    sectionCard: {
        marginBottom: '12px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        backgroundColor: 'var(--content-bg, #FEFAF4)',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    },
    sectionCardOpen: {
        borderColor: 'var(--decoud-blue)',
        boxShadow: '0 4px 20px rgba(27,54,93,0.10)',
    },
    sectionBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        padding: 'clamp(14px, 2.5vw, 18px) clamp(16px, 3vw, 22px)',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
    },
    sectionIcon: {
        fontSize: '1.3rem',
        flexShrink: 0,
    },
    sectionTitle: {
        flex: 1,
        fontSize: 'clamp(0.95rem, 2.2vw, 1.05rem)',
        fontWeight: '700',
        color: 'var(--decoud-blue)',
        transition: 'color 0.3s ease',
    },
    chevron: {
        color: 'var(--decoud-blue)',
        transition: 'transform 0.3s ease',
        flexShrink: 0,
    },

    /* Items */
    itemsWrap: {
        overflow: 'hidden',
        transition: 'max-height 0.4s ease, opacity 0.3s ease',
    },
    itemsInner: {
        padding: '0 clamp(16px, 3vw, 22px) 12px',
        borderTop: '1px solid var(--border-color)',
    },
    item: {
        borderBottom: '1px dashed var(--border-color)',
        transition: 'border-color 0.3s ease',
    },
    itemHighlight: {
        borderRadius: '8px',
        border: '1px solid rgba(212,175,55,0.35) !important',
        backgroundColor: 'rgba(212,175,55,0.06)',
        margin: '10px 0',
        padding: '0 10px',
    },
    itemBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        width: '100%',
        padding: '14px 0',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
    },
    itemQ: {
        fontSize: 'clamp(0.875rem, 2vw, 0.95rem)',
        fontWeight: '600',
        color: 'var(--color-text-dark)',
        lineHeight: 1.4,
        transition: 'color 0.3s ease',
    },
    itemChevron: {
        color: '#D4AF37',
        transition: 'transform 0.3s ease',
    },
    itemAnswer: {
        overflow: 'hidden',
        transition: 'max-height 0.35s ease, opacity 0.3s ease',
    },
    itemAnswerInner: {
        paddingBottom: '14px',
    },
    answerText: {
        margin: 0,
        fontSize: '0.9rem',
        color: 'var(--color-text-dark)',
        lineHeight: 1.65,
        opacity: 0.88,
        transition: 'color 0.3s ease',
    },

    /* Bank box */
    bankBox: {
        backgroundColor: 'var(--border-color)',
        borderLeft: '3px solid var(--decoud-blue)',
        borderRadius: '6px',
        padding: '14px 16px',
        marginTop: '4px',
    },
    bankRow: {
        margin: '0 0 6px',
        fontSize: '0.88rem',
        color: 'var(--color-text-dark)',
        transition: 'color 0.3s ease',
    },
    bankMono: {
        fontFamily: 'monospace',
        letterSpacing: '0.04em',
    },

    /* ── CTA final ── */
    ctaBox: {
        marginTop: '40px',
        background: 'linear-gradient(135deg, #1B365D 0%, #0F213A 100%)',
        borderRadius: '16px',
        padding: 'clamp(28px, 5vw, 40px) clamp(20px, 4vw, 40px)',
        textAlign: 'center',
    },
    ctaTitle: {
        color: '#FEFAF4',
        fontWeight: '800',
        fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
        margin: '0 0 8px',
    },
    ctaSub: {
        color: 'rgba(254,250,244,0.72)',
        fontSize: '0.95rem',
        margin: '0 0 24px',
    },
    ctaBtn: {
        display: 'inline-block',
        backgroundColor: '#D4AF37',
        color: '#1B365D',
        fontWeight: '700',
        fontSize: '0.95rem',
        padding: '12px 28px',
        borderRadius: '8px',
        textDecoration: 'none',
        transition: 'background-color 0.2s ease, transform 0.15s ease',
    },
};

export default FAQPage;
