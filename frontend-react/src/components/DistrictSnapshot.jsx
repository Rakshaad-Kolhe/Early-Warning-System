import { motion } from 'framer-motion';

const BADGE_MAP = { LOW: 'badge-low', MEDIUM: 'badge-medium', HIGH: 'badge-high' };

export default function DistrictSnapshot({ snapshot }) {
    const entries = Object.entries(snapshot);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card h-full"
        >
            <div className="section-label">District Risk Snapshot</div>

            <div className="flex flex-wrap gap-3">
                {entries.map(([name, info], i) => (
                    <motion.div
                        key={name}
                        className="snapshot-tile flex items-center gap-3 rounded-xl px-4 py-2.5 cursor-default"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
                        style={{
                            /* Step 5 — glassy pill: blur + sharp border, no glow */
                            background: 'rgba(0, 230, 242, 0.07)',
                            backdropFilter: 'blur(6px)',
                            WebkitBackdropFilter: 'blur(6px)',
                            border: '1px solid rgba(0, 230, 242, 0.20)',
                        }}
                    >
                        <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            minWidth: '60px',
                        }}>
                            {name}
                        </span>
                        <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 500,
                            color: 'var(--text-muted)',
                        }}>
                            {info.score}
                        </span>
                        <span className={`badge ${BADGE_MAP[info.category] || 'badge-low'}`}>
                            {info.category}
                        </span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
