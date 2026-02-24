import { motion } from 'framer-motion';

export default function ResponseProtocol({ result }) {
    if (!result || !result.response) return null;

    const response = result.response;
    const { level, actions, timeline, escalation } = response;
    
    const urgencyColors = { 
        'Routine': 'var(--accent)', 
        'Enhanced': 'var(--amber)', 
        'Emergency': 'var(--danger)' 
    };
    const uColor = urgencyColors[level] || 'var(--text-secondary)';

    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="glass-card"
        >
            <div className="section-label">Response Protocol</div>

            {/* Compact metrics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {[
                    { label: 'Level', value: level, color: uColor },
                    { label: 'Timeline', value: timeline },
                    { label: 'Authority', value: escalation },
                ].map((m) => (
                    <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ 
                            fontSize: '0.6rem', 
                            textTransform: 'uppercase', 
                            fontWeight: 600,
                            color: 'var(--text-muted)', 
                            letterSpacing: '1.5px' 
                        }}>
                            {m.label}
                        </span>
                        <span style={{ 
                            fontSize: '0.7rem', 
                            fontWeight: 600,
                            color: m.color || 'var(--text-secondary)' 
                        }}>
                            {m.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="section-label" style={{ marginBottom: '8px' }}>Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {actions.slice(0, 4).map((action, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        style={{ 
                            fontSize: '0.65rem', 
                            paddingLeft: '12px', 
                            position: 'relative',
                            color: 'var(--text-secondary)', 
                            opacity: 0.8 
                        }}
                    >
                        <span style={{ position: 'absolute', left: 0, color: 'var(--text-muted)' }}>—</span>
                        {action}
                    </motion.div>
                ))}
                {actions.length > 4 && (
                    <div style={{ 
                        fontSize: '0.6rem', 
                        paddingLeft: '12px', 
                        marginTop: '4px',
                        color: 'var(--text-muted)', 
                        opacity: 0.6 
                    }}>
                        +{actions.length - 4} more
                    </div>
                )}
            </div>
        </motion.div>
    );
}
