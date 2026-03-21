// src/components/AuthLayout.jsx
import React, { useState, useEffect } from 'react';

const authAds = [
    {
        title: "Calidad Decoud",
        desc: "Colchones diseñados para un descanso profundo y reparador.",
        img: "https://images.unsplash.com/photo-1505693419148-ad3b471e4c57?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "12 Cuotas Sin Interés",
        desc: "Tu nuevo colchón es posible con nuestra financiación exclusiva.",
        img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Envío Sin Cargo",
        desc: "Llegamos a toda Rafaela y zona sin costos adicionales de logística.",
        img: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1000&auto=format&fit=crop"
    }
];

const AuthLayout = ({ children, title, subtitle }) => {
    const [currentAd, setCurrentAd] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentAd(prev => (prev === authAds.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                {/* LADO IZQUIERDO: FORMULARIO */}
                <div className="auth-form-side">
                    <div className="auth-content">
                        <h1 className="auth-title">{title}</h1>
                        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
                        {children}
                    </div>
                </div>

                {/* LADO DERECHO: CARRUSEL PUBLICITARIO */}
                <div className="auth-ad-side">
                    {authAds.map((ad, index) => (
                        <div key={index} className={`auth-ad-slide ${index === currentAd ? 'active' : ''}`} style={{ backgroundImage: `linear-gradient(rgba(27, 54, 93, 0.6), rgba(27, 54, 93, 0.8)), url(${ad.img})` }}>
                            <div className="ad-text">
                                <h2>{ad.title}</h2>
                                <p>{ad.desc}</p>
                            </div>
                        </div>
                    ))}
                    <div className="ad-dots">
                        {authAds.map((_, i) => (
                            <span key={i} className={`ad-dot ${i === currentAd ? 'active' : ''}`}></span>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .auth-wrapper { min-height: calc(100vh - 160px); display: flex; align-items: center; justify-content: center; padding: 40px 20px; background-color: var(--decoud-white); }
                .auth-card { width: 100%; max-width: 1000px; min-height: 600px; display: flex; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
                
                .auth-form-side { flex: 1; padding: 60px; display: flex; align-items: center; justify-content: center; }
                .auth-content { width: 100%; max-width: 380px; }
                .auth-title { font-size: 2rem; font-weight: 800; color: #1B365D; margin-bottom: 8px; }
                .auth-subtitle { color: #64748b; font-size: 0.95rem; margin-bottom: 30px; }

                .auth-ad-side { flex: 1.1; position: relative; display: flex; flex-direction: column; }
                .auth-ad-slide { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; transition: opacity 1s ease; opacity: 0; display: flex; align-items: flex-end; padding: 60px; }
                .auth-ad-slide.active { opacity: 1; z-index: 1; }
                
                .ad-text { color: white; z-index: 2; transform: translateY(20px); transition: all 0.8s ease; opacity: 0; }
                .auth-ad-slide.active .ad-text { transform: translateY(0); opacity: 1; }
                .ad-text h2 { font-size: 2.2rem; font-weight: 800; margin-bottom: 10px; }
                .ad-text p { font-size: 1.1rem; opacity: 0.9; line-height: 1.5; }

                .ad-dots { position: absolute; bottom: 30px; left: 60px; display: flex; gap: 8px; z-index: 10; }
                .ad-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.3); transition: all 0.3s; }
                .ad-dot.active { background: white; width: 24px; border-radius: 4px; }

                @media (max-width: 850px) {
                    .auth-ad-side { display: none; }
                    .auth-form-side { padding: 40px 20px; }
                }
            `}</style>
        </div>
    );
};

export default AuthLayout;