import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <>
            <button
                onClick={scrollUp}
                title="Volver arriba"
                style={{
                    ...s.btn,
                    opacity: visible ? 1 : 0,
                    pointerEvents: visible ? 'auto' : 'none',
                    transform: visible ? 'translateY(0)' : 'translateY(12px)',
                }}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15" />
                </svg>
            </button>
            <style>{`
                .scroll-top-btn:hover {
                    background-color: #0F213A !important;
                    transform: translateY(-3px) !important;
                }
            `}</style>
        </>
    );
};

const s = {
    btn: {
        position: 'fixed',
        bottom: '100px',
        right: '20px',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        backgroundColor: '#1B365D',
        color: '#FEFAF4',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        boxShadow: '0 4px 16px rgba(27,54,93,0.3)',
        transition: 'opacity 0.3s ease, transform 0.3s ease, background-color 0.2s ease',
    },
};

export default ScrollToTopButton;
