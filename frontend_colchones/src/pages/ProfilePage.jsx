import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

// ── Íconos ────────────────────────────────────────────────────────────────────
const IconBox = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
);
const IconUser = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);
const IconLock = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
);
const IconLogout = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
);
const IconCheck = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
);
const IconClock = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
);
const IconTruck = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
);
const IconChevron = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"/>
    </svg>
);
const IconEye = ({ show }) => show ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
);

// ── Estado del pedido en español legible ──────────────────────────────────────
const estadoConfig = {
    pendiente:    { label: 'Pendiente de confirmación', color: '#92400e', bg: '#fef3c7', icon: <IconClock /> },
    confirmado:   { label: 'Confirmado',                color: '#1e40af', bg: '#dbeafe', icon: <IconCheck /> },
    enviado:      { label: 'En camino',                 color: '#065f46', bg: '#d1fae5', icon: <IconTruck /> },
    entregado:    { label: 'Entregado',                 color: '#065f46', bg: '#d1fae5', icon: <IconCheck /> },
    pagado:       { label: 'Pago recibido',             color: '#065f46', bg: '#d1fae5', icon: <IconCheck /> },
    rechazado:    { label: 'Pago rechazado',            color: '#b91c1c', bg: '#fee2e2', icon: null },
};
const getEstado = (estado = '') => {
    const key = estado.toLowerCase().split(':')[0];
    return estadoConfig[key] || { label: estado, color: '#64748b', bg: '#f1f5f9', icon: null };
};

// ── Componente Field reutilizable ─────────────────────────────────────────────
const Field = ({ label, hint, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text-dark)' }}>{label}</label>
        {hint && <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>{hint}</p>}
        {children}
    </div>
);

// ── Página principal ──────────────────────────────────────────────────────────
const ProfilePage = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [profileData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name:  user?.last_name  || '',
        email:      user?.email      || '',
    });
    const [msg, setMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        if (activeTab !== 'orders') return;
        setLoadingOrders(true);
        api.get('/pedidos/')
            .then(r => setOrders(r.data))
            .catch(() => {})
            .finally(() => setLoadingOrders(false));
    }, [activeTab]);

    useEffect(() => { setMsg({ type: '', text: '' }); }, [activeTab]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.patch('/me/', profileData);
            setMsg({ type: 'success', text: 'Tus datos fueron actualizados correctamente.' });
        } catch {
            setMsg({ type: 'error', text: 'No pudimos guardar los cambios. Intentá de nuevo.' });
        }
    };

    const handleLogout = () => { logoutUser(); navigate('/'); };

    const initials = `${user?.first_name?.charAt(0) || ''}${user?.last_name?.charAt(0) || ''}`.toUpperCase() || 'U';
    const nombre = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Usuario';

    const tabs = [
        { id: 'orders',   label: 'Mis pedidos',   desc: 'Historial de compras', icon: <IconBox /> },
        { id: 'data',     label: 'Mis datos',      desc: 'Nombre y email',       icon: <IconUser /> },
        { id: 'security', label: 'Contraseña',     desc: 'Cambiar clave',        icon: <IconLock /> },
    ];

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: 'clamp(20px,4vw,48px) 16px 60px' }}>
            <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* ── BIENVENIDA ── */}
                <div style={{ background: 'linear-gradient(135deg,#0F213A,#1B365D)', borderRadius: 16, padding: 'clamp(24px,4vw,36px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                        <div style={{ width: 58, height: 58, borderRadius: '50%', background: 'var(--decoud-gold)', color: '#1B365D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 900, flexShrink: 0 }}>
                            {initials}
                        </div>
                        <div>
                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', fontWeight: 600 }}>BIENVENIDO DE VUELTA</p>
                            <h1 style={{ margin: '2px 0 4px', color: '#fff', fontSize: 'clamp(1.2rem,3vw,1.7rem)', fontWeight: 900 }}>{nombre}</h1>
                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 18px', borderRadius: 8, fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                        <IconLogout /> Cerrar sesión
                    </button>
                </div>

                {/* ── NAVEGACIÓN POR TARJETAS ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ background: activeTab === t.id ? 'var(--decoud-blue)' : 'var(--content-bg)', border: activeTab === t.id ? '2px solid var(--decoud-blue)' : '2px solid var(--border-color)', borderRadius: 12, padding: 'clamp(14px,2vw,20px) 12px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: activeTab === t.id ? '#D4AF37' : 'var(--decoud-blue)', display: 'flex' }}>{t.icon}</span>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: activeTab === t.id ? '#fff' : 'var(--color-text-dark)' }}>{t.label}</span>
                            <span style={{ fontSize: '0.73rem', color: activeTab === t.id ? 'rgba(255,255,255,0.65)' : '#94a3b8' }}>{t.desc}</span>
                        </button>
                    ))}
                </div>

                {/* ── CONTENIDO ── */}
                <div style={{ background: 'var(--content-bg)', borderRadius: 16, border: '1px solid var(--border-color)', padding: 'clamp(20px,4vw,36px)', transition: 'all 0.3s' }}>

                    {msg.text && (
                        <div style={{ marginBottom: 24, padding: '14px 18px', borderRadius: 10, fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, background: msg.type === 'success' ? '#d1fae5' : '#fee2e2', color: msg.type === 'success' ? '#065f46' : '#b91c1c', border: `1px solid ${msg.type === 'success' ? '#6ee7b7' : '#fecaca'}` }}>
                            {msg.type === 'success' ? <IconCheck /> : null}
                            {msg.text}
                        </div>
                    )}

                    {/* PEDIDOS */}
                    {activeTab === 'orders' && (
                        <div>
                            <SectionTitle icon={<IconBox />} title="Tus pedidos" subtitle="Acá podés ver el estado de todas tus compras." />
                            {loadingOrders ? (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>Cargando tus pedidos...</div>
                            ) : orders.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '50px 20px' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.2, display: 'flex', justifyContent: 'center' }}><IconBox /></div>
                                    <p style={{ fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: 8 }}>Todavía no hiciste ningún pedido</p>
                                    <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: 24 }}>Cuando compres algo, vas a poder verlo acá.</p>
                                    <Link to="/colchones" style={{ display: 'inline-block', background: 'var(--decoud-blue)', color: '#fff', padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                                        Ver catálogo
                                    </Link>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {orders.map(order => {
                                        const est = getEstado(order.estado);
                                        return (
                                            <div key={order.id} style={{ border: '1px solid var(--border-color)', borderRadius: 12, overflow: 'hidden', transition: 'all 0.3s' }}>
                                                {/* Cabecera del pedido */}
                                                <div style={{ background: 'var(--bg-color)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, borderBottom: '1px solid var(--border-color)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                        <span style={{ fontWeight: 900, color: 'var(--decoud-blue)', fontSize: '0.95rem' }}>Pedido #{order.id}</span>
                                                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                                                            {new Date(order.fecha_creacion).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: est.bg, color: est.color, padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
                                                        {est.icon} {est.label}
                                                    </span>
                                                </div>
                                                {/* Cuerpo */}
                                                <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                                                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                                                        <div>
                                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL PAGADO</p>
                                                            <p style={{ margin: '2px 0 0', fontWeight: 900, color: 'var(--decoud-gold)', fontSize: '1.1rem' }}>${Number(order.total_neto).toLocaleString('es-AR')}</p>
                                                        </div>
                                                        <div>
                                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>FORMA DE PAGO</p>
                                                            <p style={{ margin: '2px 0 0', fontWeight: 700, color: 'var(--color-text-dark)', fontSize: '0.9rem' }}>{order.metodo_pago}</p>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: '#94a3b8' }}>
                                                        <IconTruck /> Coordinamos el envío por WhatsApp
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* MIS DATOS */}
                    {activeTab === 'data' && (
                        <div>
                            <SectionTitle icon={<IconUser />} title="Tus datos personales" subtitle="Podés cambiar tu nombre o correo electrónico cuando quieras." />
                            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <Field label="Nombre">
                                        <input style={inputStyle} value={profileData.first_name} onChange={e => setFormData({ ...profileData, first_name: e.target.value })} />
                                    </Field>
                                    <Field label="Apellido">
                                        <input style={inputStyle} value={profileData.last_name} onChange={e => setFormData({ ...profileData, last_name: e.target.value })} />
                                    </Field>
                                </div>
                                <Field label="Correo electrónico" hint="Te enviamos las confirmaciones de pedido a este correo.">
                                    <input type="email" style={inputStyle} value={profileData.email} onChange={e => setFormData({ ...profileData, email: e.target.value })} />
                                </Field>
                                <button type="submit" style={{ alignSelf: 'flex-start', background: 'var(--decoud-blue)', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: 8, fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', transition: 'opacity 0.2s' }}>
                                    Guardar cambios
                                </button>
                            </form>
                        </div>
                    )}

                    {/* CONTRASEÑA */}
                    {activeTab === 'security' && (
                        <div>
                            <SectionTitle icon={<IconLock />} title="Cambiar contraseña" subtitle="Para cambiar tu clave, primero ingresá la actual y luego la nueva." />
                            <ChangePasswordForm setMsg={setMsg} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Título de sección ────────────────────────────────────────────────────────
const SectionTitle = ({ icon, title, subtitle }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(27,54,93,0.08)', color: 'var(--decoud-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
        </div>
        <div>
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--decoud-blue)' }}>{title}</h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>{subtitle}</p>
        </div>
    </div>
);

// ── Formulario de contraseña ──────────────────────────────────────────────────
const ChangePasswordForm = ({ setMsg }) => {
    const [passData, setPassData] = useState({ old_password: '', new_password: '' });
    const [show, setShow] = useState({ old: false, new: false });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/change-password/', passData);
            setMsg({ type: 'success', text: 'Tu contraseña fue cambiada correctamente.' });
            setPassData({ old_password: '', new_password: '' });
        } catch {
            setMsg({ type: 'error', text: 'La contraseña actual que ingresaste es incorrecta.' });
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 420 }}>
            <Field label="Contraseña actual" hint="La que usás ahora para entrar a tu cuenta.">
                <div style={{ position: 'relative' }}>
                    <input type={show.old ? 'text' : 'password'} style={{ ...inputStyle, paddingRight: 44 }} value={passData.old_password} onChange={e => setPassData({ ...passData, old_password: e.target.value })} required />
                    <button type="button" onClick={() => setShow(s => ({ ...s, old: !s.old }))} style={eyeBtnStyle}><IconEye show={show.old} /></button>
                </div>
            </Field>
            <Field label="Nueva contraseña" hint="Usá al menos 8 caracteres. Podés combinar letras y números.">
                <div style={{ position: 'relative' }}>
                    <input type={show.new ? 'text' : 'password'} style={{ ...inputStyle, paddingRight: 44 }} value={passData.new_password} onChange={e => setPassData({ ...passData, new_password: e.target.value })} required minLength={8} />
                    <button type="button" onClick={() => setShow(s => ({ ...s, new: !s.new }))} style={eyeBtnStyle}><IconEye show={show.new} /></button>
                </div>
            </Field>
            <button type="submit" style={{ alignSelf: 'flex-start', background: 'var(--decoud-blue)', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: 8, fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer' }}>
                Cambiar contraseña
            </button>
        </form>
    );
};

const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 8,
    border: '1.5px solid var(--border-color)', background: 'var(--content-bg)',
    color: 'var(--color-text-dark)', fontSize: '0.95rem', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
};
const eyeBtnStyle = {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex',
};

export default ProfilePage;
