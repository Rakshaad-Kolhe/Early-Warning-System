import { motion } from 'framer-motion';

// Gradient bars — startup analytics, 8px pill height
const GRAD_POS = 'linear-gradient(90deg, #00E6F2, #4C7EFF)';
const GRAD_NEG = 'linear-gradient(90deg, #FF4D6D, #FF7A7A)';

export default function ContributingFactors({ contributors }) {
    if (!contributors || contributors.length === 0) return null;

    const data = contributors.map((c) => ({
        name: c.feature.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        value: c.contribution,
    }));

    const maxAbs = Math.max(...data.map((d) => Math.abs(d.value)), 0.001);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-card"
        >
            <div className="section-label">Contributing Factors</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {data.map((item, i) => {
                    const pct = Math.abs(item.value) / maxAbs;
                    const isPos = item.value >= 0;
                    const gradient = isPos ? GRAD_POS : GRAD_NEG;
                    const valColor = isPos
                        ? 'rgba(0,230,242,0.9)'
                        : 'rgba(255,77,109,0.85)';

                    return (
                        <div key={item.name}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>
                                    {item.name}
                                </span>
                                <span style={{ fontSize: '0.58rem', color: valColor, fontWeight: 600 }}>
                                    {item.value > 0 ? '+' : ''}{item.value.toFixed(3)}
                                </span>
                            </div>

                            {/* 8px pill bar — gradient, no glow */}
                            <div style={{
                                height: '8px',
                                borderRadius: '999px',
                                background: 'rgba(255,255,255,0.04)',
                                overflow: 'hidden',
                            }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct * 100}%` }}
                                    transition={{ duration: 0.7, delay: 0.3 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                                    style={{
                                        height: '100%',
                                        borderRadius: '999px',
                                        background: gradient,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
