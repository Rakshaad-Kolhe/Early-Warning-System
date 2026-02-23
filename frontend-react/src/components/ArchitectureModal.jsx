import { motion, AnimatePresence } from 'framer-motion';

const ICONS = {
    'Stateless API': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
    'Container-Ready Backend': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>,
    'No PII Storage': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
    'District-Level Aggregation': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
};

export default function ArchitectureModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(5, 11, 20, 0.7)',
                    backdropFilter: 'blur(12px)',
                    zIndex: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="glass-card"
                    style={{
                        width: '100%',
                        maxWidth: '520px',
                        padding: '32px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>System Architecture</h2>
                        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>&times;</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <FeatureBlock icon={ICONS['Stateless API']} title="Stateless API" desc="The backend evaluates risk per request without maintaining prediction sessions, allowing seamless horizontal scaling." />
                        <FeatureBlock icon={ICONS['Container-Ready Backend']} title="Container-Ready Backend" desc="Fully isolated Python microservices and endpoints built for easy Docker containerization." />
                        <FeatureBlock icon={ICONS['No PII Storage']} title="No PII Storage" desc="System processes aggregate climatic and district-level metrics only. Zero personal identifiable information is ingested or logged." />
                        <FeatureBlock icon={ICONS['District-Level Aggregation']} title="District-Level Aggregation" desc="Predictions and resources are strictly mapped and batched by district entities to orchestrate public health response effectively." />
                    </div>

                    <div style={{ marginTop: '32px', textAlign: 'right' }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '8px 24px',
                                background: 'var(--accent, #00e6f2)',
                                color: '#000',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Got it
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function FeatureBlock({ icon, title, desc }) {
    return (
        <div style={{
            padding: '16px',
            background: 'var(--bg-tertiary, rgba(0,0,0,0.2))',
            borderRadius: '12px',
            borderLeft: '4px solid var(--accent, #00E0B8)',
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start'
        }}>
            <div style={{ marginTop: '2px' }}>{icon}</div>
            <div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</div>
            </div>
        </div>
    );
}
