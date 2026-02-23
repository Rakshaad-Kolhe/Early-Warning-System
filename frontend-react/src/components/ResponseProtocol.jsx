import { motion } from 'framer-motion';

const URGENCY_COLORS = { Routine: 'var(--accent)', Elevated: 'var(--amber)', Critical: 'var(--danger)' };

export default function ResponseProtocol({ response }) {
    if (!response) return null;

    const { urgency, actions, resources } = response;
    const uColor = URGENCY_COLORS[urgency] || 'var(--text-secondary)';

    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="glass-card"
        >
            <div className="section-label">Response Protocol</div>

            {/* Compact metrics */}
            <div className="space-y-2 mb-4">
                {[
                    { label: 'Urgency', value: urgency, color: uColor },
                    { label: 'Alert', value: resources.alert_level },
                    { label: 'Teams', value: resources.medical_teams },
                ].map((m) => (
                    <div key={m.label} className="flex justify-between items-center">
                        <span className="text-[0.6rem] uppercase font-semibold"
                            style={{ color: 'var(--text-muted)', letterSpacing: '1.5px' }}>
                            {m.label}
                        </span>
                        <span className="text-xs font-semibold"
                            style={{ color: m.color || 'var(--text-secondary)' }}>
                            {m.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="section-label" style={{ marginBottom: '8px' }}>Actions</div>
            <div className="space-y-0.5">
                {actions.slice(0, 3).map((action, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        className="text-[0.65rem] pl-3 relative"
                        style={{ color: 'var(--text-secondary)', opacity: 0.8 }}
                    >
                        <span className="absolute left-0" style={{ color: 'var(--text-muted)' }}>—</span>
                        {action}
                    </motion.div>
                ))}
                {actions.length > 3 && (
                    <div className="text-[0.6rem] pl-3 mt-1" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                        +{actions.length - 3} more
                    </div>
                )}
            </div>
        </motion.div>
    );
}
