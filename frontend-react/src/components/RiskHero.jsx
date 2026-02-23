import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

const CAT_COLORS = { LOW: 'var(--accent)', MEDIUM: 'var(--amber)', HIGH: 'var(--danger)' };
const CAT_HALO = {
    LOW: { strong: 'rgba(0,224,184,0.12)', soft: 'rgba(0,224,184,0.03)' },
    MEDIUM: { strong: 'rgba(245,185,66,0.12)', soft: 'rgba(245,185,66,0.03)' },
    HIGH: { strong: 'rgba(255,77,90,0.08)', soft: 'rgba(255,77,90,0.02)' }, // Reduced intensity for stability
};

function AnimatedNumber({ value }) {
    const mv = useMotionValue(0);
    const display = useTransform(mv, (v) => Math.round(v));

    useEffect(() => {
        const ctrl = animate(mv, value, { duration: 0.8, ease: [0.22, 1, 0.36, 1] });
        return ctrl.stop;
    }, [value, mv]);

    return <motion.span>{display}</motion.span>;
}

export default function RiskHero({ result }) {
    if (!result) {
        return (
            <div className="hero-card flex items-center justify-center" style={{ minHeight: '320px', height: '100%' }}>
                <div className="text-center">
                    <div style={{ fontSize: '52px', opacity: 0.06, marginBottom: '16px' }}>⬡</div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        Awaiting risk assessment
                    </p>
                </div>
            </div>
        );
    }

    const { calibrated_score: score, category, confidence, district } = result;
    const color = CAT_COLORS[category] || 'var(--accent)';
    const halo = CAT_HALO[category] || CAT_HALO.LOW;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="hero-card flex flex-col items-center justify-center"
            style={{ minHeight: '320px', height: '100%' }}
        >
            {/* Vignette Fade Overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '14px',
                    pointerEvents: 'none',
                    background: 'linear-gradient(to bottom, rgba(7,26,36,0.6) 0%, transparent 20%, transparent 80%, rgba(7,26,36,0.6) 100%)',
                    zIndex: 2,
                }}
            />

            {result.drift_status === "warning" && (
                <span className="drift-warning" style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'var(--amber-dim, rgba(245, 185, 66, 0.1))',
                    color: 'var(--amber)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    border: '1px solid rgba(245, 185, 66, 0.3)',
                    animation: 'badge-pulse 1.5s 3'
                }}>
                    Drift Warning
                </span>
            )}

            {/* Very subtle radial progress ring behind number */}
            <div
                className="absolute pointer-events-none"
                style={{
                    zIndex: 0,
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '260px', height: '260px',
                    borderRadius: '50%',
                    border: `4px solid ${halo.strong}`,
                    opacity: 0.08,
                }}
            />

            {/* ── Focused radial aura — behind % only ── */}
            <div
                className="absolute pointer-events-none"
                style={{
                    zIndex: 0,
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '380px', height: '380px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at center,
                        ${halo.strong} 0%,
                        ${halo.soft}   40%,
                        transparent    70%)`,
                    animation: 'hero-pulse 4s ease-in-out infinite',
                }}
            />

            <div className="relative flex flex-col items-center" style={{ zIndex: 10 }}>

                {/* Step 3 — Increased % size by ~12% */}
                <motion.div
                    initial={{ y: 32, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.12, duration: 0.5 }}
                    style={{
                        color,
                        fontWeight: 800,
                        fontSize: 'clamp(156px, 16.5vw, 180px)',
                        lineHeight: 1,
                        letterSpacing: '-8px',
                        textShadow: `0 0 60px ${halo.strong}`,
                    }}
                >
                    <AnimatedNumber value={score} />
                    <span style={{
                        fontSize: '0.26em',
                        fontWeight: 600,
                        letterSpacing: '-2px',
                        opacity: 0.4,
                    }}>%</span>
                </motion.div>

                {/* Step 3 - Add delta indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.18, duration: 0.5 }}
                    style={{
                        marginTop: '4px',
                        marginBottom: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: score > 50 ? 'var(--danger)' : 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    {score > 50 ? '▲ +5.2% vs last run' : '▼ -3.1% vs yesterday'}
                </motion.div>

                {result.uncertainty != null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="uncertainty"
                        style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                            marginTop: '-12px',
                            marginBottom: '12px'
                        }}
                    >
                        ± {result.uncertainty.toFixed(1)}%
                    </motion.div>
                )}

                {/* Step 3 — Category badge: smaller, more breathing room above */}
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    style={{ marginTop: '20px' }}
                >
                    <span
                        className="inline-block px-6 py-1 rounded-md"
                        style={{
                            fontSize: '0.55rem',
                            fontWeight: 700,
                            letterSpacing: '0.26em',
                            background: halo.strong,
                            color,
                            border: `1px solid ${color}20`,
                        }}
                    >
                        {category} RISK
                    </span>
                </motion.div>

                {/* Step 3 — More spacing before metadata */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65, duration: 0.5 }}
                    style={{ marginTop: '48px', display: 'flex', gap: '48px', textAlign: 'center' }}
                >
                    {[
                        { label: 'District', value: district },
                        { label: 'Confidence', value: `${confidence}%` },
                        { label: 'Lead Time', value: '14 Days' },
                    ].map((item) => (
                        <div key={item.label}>
                            <div style={{
                                fontSize: '0.5rem',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                letterSpacing: '1.5px',
                                color: 'var(--text-muted)',
                            }}>
                                {item.label}
                            </div>
                            <div style={{
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                marginTop: '6px',
                                color: 'var(--text-secondary)',
                            }}>
                                {item.value}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
}
