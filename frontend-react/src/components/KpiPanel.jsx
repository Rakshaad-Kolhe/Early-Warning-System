import { motion } from 'framer-motion';

export default function KpiPanel({ count, result }) {
    const risk = result ? result.calibrated_score : '--';
    const category = result ? result.category : 'N/A';

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                padding: '16px',
            }}
        >
            <KpiMetric label="Predictions Today" value={count} />
            <KpiMetric label="Current Risk" value={risk !== '--' ? `${risk}%` : risk} />
            <KpiMetric label="Risk Category" value={category} />
            <KpiMetric label="Model Version" value="v2.1.4" />
        </motion.div>
    );
}

function KpiMetric({ label, value }) {
    return (
        <div style={{
            padding: '12px',
            background: 'var(--bg-tertiary, rgba(0,0,0,0.2))',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.03)'
        }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {label}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {value}
            </div>
        </div>
    );
}
