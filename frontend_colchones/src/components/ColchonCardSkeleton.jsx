import React from 'react';

const ColchonCardSkeleton = () => (
    <div style={s.card}>
        <div style={s.image} />
        <div style={s.body}>
            <div style={s.lineShort} />
            <div style={s.lineLong} />
            <div style={s.lineMedium} />
            <div style={s.priceBar} />
            <div style={s.btn} />
        </div>
        <style>{`
            @keyframes skeletonPulse {
                0%   { opacity: 0.55; }
                50%  { opacity: 1; }
                100% { opacity: 0.55; }
            }
        `}</style>
    </div>
);

const pulse = 'skeletonPulse 1.6s ease-in-out infinite';

const s = {
    card: {
        backgroundColor: 'var(--content-bg)',
        borderRadius: '14px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
    },
    image: {
        width: '100%',
        height: '220px',
        backgroundColor: 'var(--border-color)',
        animation: pulse,
    },
    body: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    lineShort: {
        width: '40%',
        height: '11px',
        backgroundColor: 'var(--border-color)',
        borderRadius: '6px',
        animation: pulse,
    },
    lineLong: {
        width: '85%',
        height: '14px',
        backgroundColor: 'var(--border-color)',
        borderRadius: '6px',
        animation: pulse,
    },
    lineMedium: {
        width: '60%',
        height: '11px',
        backgroundColor: 'var(--border-color)',
        borderRadius: '6px',
        animation: pulse,
    },
    priceBar: {
        width: '50%',
        height: '20px',
        backgroundColor: 'var(--border-color)',
        borderRadius: '6px',
        marginTop: '6px',
        animation: pulse,
    },
    btn: {
        width: '100%',
        height: '38px',
        backgroundColor: 'var(--border-color)',
        borderRadius: '8px',
        marginTop: '4px',
        animation: pulse,
    },
};

export default ColchonCardSkeleton;
