import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const DISTRICTS = [
    'Pune', 'Nashik', 'Mumbai', 'Nagpur',
    'Aurangabad', 'Thane', 'Solapur', 'Kolhapur',
];

export default function InputPanel({ values, onChange, onRun, loading }) {
    const [activeSlider, setActiveSlider] = useState(null);

    const sliders = [
        { key: 'rainfall_dev', label: 'Rainfall Deviation', unit: 'mm', min: -60, max: 80, step: 1 },
        { key: 'temperature', label: 'Temperature', unit: '°C', min: 18, max: 42, step: 0.5 },
        { key: 'case_growth', label: 'Case Growth', unit: '%', min: -20, max: 80, step: 1 },
        { key: 'baseline', label: 'Baseline Cases', unit: '', min: 10, max: 120, step: 1 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="glass-card"
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            {/* ── Panel Header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <div className="section-label" style={{ marginBottom: '4px' }}>Interactive Control Panel</div>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', opacity: 0.5, letterSpacing: '0.5px' }}>
                        Configure prediction parameters
                    </div>
                </div>
                {/* Accent dot — matches reference */}
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    boxShadow: '0 0 8px rgba(0,255,194,0.6)',
                    marginTop: '2px',
                    flexShrink: 0,
                }} />
            </div>

            {/* ── District Selector ── */}
            <div style={{ marginBottom: '20px' }}>
                <label
                    style={{
                        display: 'block',
                        fontSize: '0.58rem',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: '1.5px',
                        color: 'var(--text-muted)',
                        marginBottom: '8px',
                    }}
                >
                    District
                </label>
                <select
                    value={values.district}
                    onChange={(e) => onChange({ ...values, district: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        outline: 'none',
                        cursor: 'pointer',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                    }}
                >
                    {DISTRICTS.map((d) => (
                        <option key={d} value={d} style={{ background: '#0a1a28' }}>{d}</option>
                    ))}
                </select>
            </div>

            {/* ── Sliders ── */}
            {sliders.map((s) => (
                <div key={s.key} style={{ marginBottom: '20px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label
                            style={{
                                fontSize: '0.58rem',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                letterSpacing: '1.5px',
                                color: activeSlider === s.key ? 'var(--accent)' : 'var(--text-muted)',
                                transition: 'color 0.2s ease'
                            }}
                        >
                            {s.label}
                        </label>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                            {values[s.key]}{s.unit}
                        </span>
                    </div>

                    {/* Bubble on active/drag */}
                    <AnimatePresence>
                        {activeSlider === s.key && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                animate={{ opacity: 1, y: -24, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                transition={{ duration: 0.15 }}
                                style={{
                                    position: 'absolute',
                                    left: `${((values[s.key] - s.min) / (s.max - s.min)) * 100}%`,
                                    transform: 'translateX(-50%)',
                                    top: '10px',
                                    background: 'var(--accent)',
                                    color: '#000',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    pointerEvents: 'none',
                                    zIndex: 10,
                                }}
                            >
                                {values[s.key]}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <input
                        type="range"
                        min={s.min} max={s.max} step={s.step}
                        value={values[s.key]}
                        onMouseDown={() => setActiveSlider(s.key)}
                        onMouseUp={() => setActiveSlider(null)}
                        onTouchStart={() => setActiveSlider(s.key)}
                        onTouchEnd={() => setActiveSlider(null)}
                        onChange={(e) => onChange({ ...values, [s.key]: parseFloat(e.target.value) })}
                    />
                </div>
            ))}

            {/* Spacer — pushes button + tagline to bottom */}
            <div style={{ flex: 1 }} />

            {/* ── Run Button ── */}
            <motion.button
                whileHover={{ scale: 1.02, y: -2, boxShadow: '0 12px 30px rgba(0,230,242,0.35)' }}
                whileTap={{ scale: 0.98 }}
                onClick={onRun}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    letterSpacing: '1.2px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.4 : 1,
                    background: 'linear-gradient(90deg, #00E0B8, #00B8FF)',
                    color: '#050B14',
                    border: 'none',
                    boxShadow: '0 8px 25px rgba(0,224,184,0.28)',
                    marginBottom: '16px',
                }}
            >
                {loading ? 'ANALYZING…' : 'RUN PREDICTION'}
            </motion.button>

            {/* ── Bottom Tagline (like "SIMULATING ALTERNATE FUTURES") ── */}
            <div style={{
                textAlign: 'center',
                fontSize: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: 'var(--text-muted)',
                opacity: 0.4,
            }}>
                Monitoring Risk Signals
            </div>
        </motion.div >
    );
}
