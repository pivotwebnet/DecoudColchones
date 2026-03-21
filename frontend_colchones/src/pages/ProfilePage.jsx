// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const ProfilePage = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    
    // Estados para edición de datos
    const [profileData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || ''
    });
    const [msg, setMsg] = useState({ type: '', text: '' });

    // Cargar pedidos al montar
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/pedidos/');
                setOrders(response.data);
            } catch (err) {
                console.error("Error cargando pedidos:", err);
            } finally {
                setLoadingOrders(false);
            }
        };
        if (activeTab === 'orders') fetchOrders();
    }, [activeTab]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.patch('/me/', profileData);
            setMsg({ type: 'success', text: 'Datos actualizados correctamente.' });
        } catch (err) {
            setMsg({ type: 'error', text: 'No se pudieron actualizar los datos.' });
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="user-info-brief">
                    <div className="avatar-circle">{user?.first_name?.charAt(0) || 'U'}</div>
                    <div>
                        <h1>Hola, {user?.first_name || 'Usuario'}</h1>
                        <p>{user?.email}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="btn-logout-pro">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    CERRAR SESIÓN
                </button>
            </div>

            <div className="profile-tabs">
                <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>MIS PEDIDOS</button>
                <button className={activeTab === 'data' ? 'active' : ''} onClick={() => setActiveTab('data')}>MIS DATOS</button>
                <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>SEGURIDAD</button>
            </div>

            <div className="profile-content">
                {msg.text && <div className={`alert-box ${msg.type}`}>{msg.text}</div>}

                {/* TAB: PEDIDOS */}
                {activeTab === 'orders' && (
                    <div className="orders-section">
                        {loadingOrders ? <p>Cargando pedidos...</p> : (
                            orders.length > 0 ? (
                                <div className="orders-list">
                                    {orders.map(order => (
                                        <div key={order.id} className="order-card-pro">
                                            <div className="order-main-info">
                                                <span className="order-number">PEDIDO #{order.id}</span>
                                                <span className="order-date">{new Date(order.fecha_creacion).toLocaleDateString()}</span>
                                                <span className={`order-status ${order.estado}`}>{order.estado.toUpperCase()}</span>
                                            </div>
                                            <div className="order-details">
                                                <p><b>Total:</b> ${Number(order.total_neto).toLocaleString('es-AR')}</p>
                                                <p><b>Pago:</b> {order.metodo_pago}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="empty-msg">Aún no realizaste ningún pedido.</p>
                        )}
                    </div>
                )}

                {/* TAB: DATOS */}
                {activeTab === 'data' && (
                    <form onSubmit={handleUpdateProfile} className="profile-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nombre</label>
                                <input type="text" value={profileData.first_name} onChange={(e) => setFormData({...profileData, first_name: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Apellido</label>
                                <input type="text" value={profileData.last_name} onChange={(e) => setFormData({...profileData, last_name: e.target.value})} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={profileData.email} onChange={(e) => setFormData({...profileData, email: e.target.value})} />
                        </div>
                        <button type="submit" className="btn-save-pro">GUARDAR CAMBIOS</button>
                    </form>
                )}

                {/* TAB: SEGURIDAD (PASSWORD) */}
                {activeTab === 'security' && (
                    <ChangePasswordForm setMsg={setMsg} />
                )}
            </div>

            <style>{`
                .profile-container { max-width: 1000px; margin: 40px auto; padding: 40px; background: white; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }
                .profile-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 1px solid #f1f5f9; }
                .user-info-brief { display: flex; align-items: center; gap: 20px; }
                .avatar-circle { width: 60px; height: 60px; background: #1B365D; color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 1.5rem; font-weight: 800; }
                .profile-header h1 { font-size: 1.8rem; margin: 0; color: #1B365D; }
                .profile-header p { margin: 0; color: #64748b; }

                .btn-logout-pro { display: flex; align-items: center; gap: 8px; background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
                .btn-logout-pro:hover { background: #b91c1c; color: white; }

                .profile-tabs { display: flex; gap: 30px; margin-bottom: 40px; border-bottom: 2px solid #f1f5f9; }
                .profile-tabs button { background: none; border: none; padding: 15px 0; color: #94a3b8; font-weight: 700; font-size: 0.9rem; cursor: pointer; position: relative; }
                .profile-tabs button.active { color: #1B365D; }
                .profile-tabs button.active::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 2px; background: #1B365D; }

                .order-card-pro { padding: 20px; background: #f8fafc; border-radius: 12px; margin-bottom: 15px; border: 1px solid #f1f5f9; }
                .order-main-info { display: flex; align-items: center; gap: 20px; margin-bottom: 10px; }
                .order-number { font-weight: 800; color: #1B365D; }
                .order-status { padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 800; }
                .order-status.pendiente { background: #fef3c7; color: #92400e; }
                .order-status.entregado { background: #d1fae5; color: #065f46; }

                .profile-form { max-width: 500px; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .form-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
                .form-group label { font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
                .form-group input { padding: 12px; border-radius: 8px; border: 1.5px solid #e2e8f0; font-size: 1rem; outline: none; }
                .btn-save-pro { background: #1B365D; color: white; border: none; padding: 15px 30px; border-radius: 8px; font-weight: 800; cursor: pointer; }

                .alert-box { padding: 15px; border-radius: 8px; margin-bottom: 30px; font-size: 0.9rem; font-weight: 600; }
                .alert-box.success { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
                .alert-box.error { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
                .empty-msg { text-align: center; color: #94a3b8; padding: 40px; }
            `}</style>
        </div>
    );
};

const ChangePasswordForm = ({ setMsg }) => {
    const [passData, setPassData] = useState({ old_password: '', new_password: '' });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/change-password/', passData);
            setMsg({ type: 'success', text: 'Contraseña cambiada exitosamente.' });
            setPassData({ old_password: '', new_password: '' });
        } catch (err) {
            setMsg({ type: 'error', text: 'La contraseña actual es incorrecta.' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
                <label>Contraseña Actual</label>
                <input type="password" value={passData.old_password} onChange={(e) => setPassData({...passData, old_password: e.target.value})} required />
            </div>
            <div className="form-group">
                <label>Nueva Contraseña</label>
                <input type="password" value={passData.new_password} onChange={(e) => setPassData({...passData, new_password: e.target.value})} required />
            </div>
            <button type="submit" className="btn-save-pro">ACTUALIZAR CONTRASEÑA</button>
        </form>
    );
};

export default ProfilePage;