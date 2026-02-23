import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchHealth } from '../api/client';

export default function StatusBar() {
    const [health, setHealth] = useState(null);

    useEffect(() => {
        fetchHealth().then(setHealth).catch(() => setHealth(null));
        const id = setInterval(() => {
            fetchHealth().then(setHealth).catch(() => setHealth(null));
        }, 30000);
        return () => clearInterval(id);
    }, []);

    const now = new Date();
    const syncTime = health?.last_sync
        ? new Date(health.last_sync).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false,
        }) + ' IST'
        : now.toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false,
        }) + ' IST';

    const isOnline = health?.status === 'operational';

    const items = [
        { label: 'Active Districts', value: health?.active_districts ?? 24 },
        { label: 'Model', value: health?.model_version ?? 'v2.1.4' },
        { label: 'Synced', value: syncTime },
        {
            label: 'Status',
            value: isOnline ? 'Operational' : 'Connecting…',
            dot: isOnline ? 'var(--accent)' : 'var(--amber)',
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '50px',
                padding: '0 20px',
                borderRadius: '10px',
                background: 'rgba(7, 22, 32, 0.6)',
                border: '1px solid rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
            }}
        >
            {items.map((item, i) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {i > 0 && (
                        <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.04)', marginRight: '8px' }} />
                    )}
                    <span style={{
                        fontSize: '0.5rem',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: '1.5px',
                        color: 'var(--text-muted)',
                    }}>
                        {item.label}
                    </span>
                    <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                    }}>
                        {item.dot && (
                            <span style={{
                                display: 'inline-block',
                                width: '5px', height: '5px',
                                borderRadius: '50%',
                                background: item.dot,
                                // No glow — operational, not flashy
                            }} />
                        )}
                        {item.value}
                    </span>
                </div>
            ))}
        </motion.div>
    );
}
