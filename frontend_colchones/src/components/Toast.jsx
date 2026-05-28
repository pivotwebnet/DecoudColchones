import React, { useEffect } from 'react';

const ICONS = {
  error: '✕',
  success: '✓',
  warning: '!',
  info: 'i',
};

const COLORS = {
  error:   { bg: '#fef2f2', border: '#ef4444', icon: '#ef4444', text: '#7f1d1d' },
  success: { bg: '#f0fdf4', border: '#22c55e', icon: '#16a34a', text: '#14532d' },
  warning: { bg: '#fffbeb', border: '#D4AF37', icon: '#D4AF37', text: '#78350f' },
  info:    { bg: 'rgba(27,54,93,0.07)', border: '#1B365D', icon: '#1B365D', text: '#1B365D' },
};

const Toast = ({ message, type = 'error', onClose }) => {
  const c = COLORS[type] || COLORS.info;

  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(-20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .decoud-toast {
          animation: toast-in 0.25s ease;
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-radius: 12px;
          border: 1.5px solid ${c.border};
          background: ${c.bg};
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          max-width: 420px;
          width: calc(100vw - 40px);
          font-family: inherit;
        }
        .decoud-toast-icon {
          width: 28px; height: 28px; border-radius: 50%;
          background: ${c.icon}; color: white;
          display: flex; align-items: center; justify-content: center;
          font-weight: bold; font-size: 0.85rem; flex-shrink: 0;
        }
        .decoud-toast-msg {
          flex: 1; font-size: 0.95rem;
          color: ${c.text}; line-height: 1.4;
        }
        .decoud-toast-close {
          background: none; border: none; cursor: pointer;
          color: ${c.text}; opacity: 0.5; font-size: 1.1rem;
          padding: 0 4px; line-height: 1;
          transition: opacity 0.2s;
        }
        .decoud-toast-close:hover { opacity: 1; }
      `}</style>
      <div className="decoud-toast" role="alert">
        <span className="decoud-toast-icon">{ICONS[type]}</span>
        <span className="decoud-toast-msg">{message}</span>
        <button className="decoud-toast-close" onClick={onClose} aria-label="Cerrar">✕</button>
      </div>
    </>
  );
};

export const useToast = () => {
  const [toast, setToast] = React.useState(null);

  const showToast = React.useCallback((message, type = 'error') => {
    setToast({ message, type, key: Date.now() });
  }, []);

  const hideToast = React.useCallback(() => setToast(null), []);

  const ToastNode = toast
    ? <Toast key={toast.key} message={toast.message} type={toast.type} onClose={hideToast} />
    : null;

  return { showToast, ToastNode };
};

export default Toast;
