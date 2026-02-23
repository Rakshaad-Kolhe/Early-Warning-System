import { motion } from 'framer-motion';

const BADGE_MAP = { LOW: 'badge-low', MEDIUM: 'badge-medium', HIGH: 'badge-high' };

export default function AlertHistory({ alerts }) {
    if (!alerts || alerts.length === 0) {
        return (
            <div className="glass-card h-full">
                <div className="panel-label">Alert History Log</div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    No alerts logged. Run a prediction to generate data.
                </p>
            </div>
        );
    }

    const sorted = [...alerts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card h-full"
        >
            <div className="panel-label">Alert History Log</div>
            <div className="overflow-auto max-h-64">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>District</th>
                            <th>Score</th>
                            <th>Δ vs Prev</th>
                            <th>Category</th>
                            <th>Confidence</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((a, i) => {
                            const prev = sorted.slice(i + 1).find(p => p.district === a.district);
                            const delta = prev ? (a.score - prev.score).toFixed(1) : 0;
                            const isPos = delta > 0;
                            const isNeg = delta < 0;

                            return (
                                <tr key={a.id || i} className={a.category === 'HIGH' ? 'high-risk-row' : ''}>
                                    <td className="font-medium" style={{
                                        borderLeft: `3px solid ${a.category === 'HIGH' ? 'var(--danger)' : a.category === 'MEDIUM' ? 'var(--amber)' : 'var(--accent)'}`
                                    }}>
                                        <span style={{ marginLeft: '8px' }}>{a.district}</span>
                                    </td>
                                    <td>{a.score}</td>
                                    <td style={{ color: isPos ? 'var(--danger)' : isNeg ? 'var(--accent)' : 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600 }}>
                                        {prev ? (isPos ? `▲ +${delta}` : isNeg ? `▼ ${delta}` : '—') : '—'}
                                    </td>
                                    <td>
                                        <span className={`badge ${BADGE_MAP[a.category] || 'badge-low'}`}>
                                            {a.category}
                                        </span>
                                    </td>
                                    <td>{a.confidence}%</td>
                                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
                                        {new Date(a.timestamp).toLocaleString('en-IN', {
                                            day: '2-digit', month: 'short',
                                            hour: '2-digit', minute: '2-digit', hour12: false,
                                        })}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
