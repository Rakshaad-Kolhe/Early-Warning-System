import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function AuditTrailPanel({ result, inputs }) {
    const [runHistory, setRunHistory] = useState([]);

    useEffect(() => {
        if (result) {
            const newEntry = {
                id: Date.now(),
                timestamp: result.timestamp || new Date().toISOString(),
                district: result.district,
                score: result.calibrated_score,
                category: result.category,
                inputs: { ...inputs },
                user: 'System Operator', // In production, get from auth
                decision: null // Can be updated by user
            };

            setRunHistory(prev => [newEntry, ...prev].slice(0, 10)); // Keep last 10 runs
        }
    }, [result]);

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-IN', { 
            month: 'short', 
            day: 'numeric'
        });
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'HIGH': return '#f87171';
            case 'MEDIUM': return '#fb923c';
            case 'LOW': return '#4ade80';
            default: return 'var(--text-muted)';
        }
    };

    const handleAddDecision = (id, decision) => {
        setRunHistory(prev => prev.map(entry => 
            entry.id === id ? { ...entry, decision } : entry
        ));
    };

    const exportLog = () => {
        const dataStr = JSON.stringify(runHistory, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `outbreak-audit-log-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    if (runHistory.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-card"
            >
                <div style={{ marginBottom: '20px' }}>
                    <div className="section-label">Audit Trail & Run Log</div>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', opacity: 0.5 }}>
                        Decision history and accountability
                    </div>
                </div>
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '2rem', opacity: 0.3, marginBottom: '12px' }}>📋</div>
                    <div style={{ fontSize: '0.7rem' }}>No predictions run yet</div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card"
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                    <div className="section-label">Audit Trail & Run Log</div>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', opacity: 0.5 }}>
                        {runHistory.length} prediction{runHistory.length !== 1 ? 's' : ''} recorded
                    </div>
                </div>
                <button
                    onClick={exportLog}
                    style={{
                        background: 'rgba(0,224,184,0.1)',
                        border: '1px solid rgba(0,224,184,0.3)',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        color: 'var(--accent)',
                        cursor: 'pointer'
                    }}
                >
                    Export Log
                </button>
            </div>

            {/* Timeline */}
            <div style={{ position: 'relative' }}>
                {/* Vertical line */}
                <div style={{
                    position: 'absolute',
                    left: '20px',
                    top: '10px',
                    bottom: '10px',
                    width: '2px',
                    background: 'linear-gradient(to bottom, var(--accent), transparent)',
                    opacity: 0.2
                }} />

                {runHistory.map((entry, idx) => (
                    <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        style={{
                            position: 'relative',
                            marginBottom: '16px',
                            paddingLeft: '48px'
                        }}
                    >
                        {/* Timeline dot */}
                        <div style={{
                            position: 'absolute',
                            left: '14px',
                            top: '12px',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: getCategoryColor(entry.category),
                            border: '2px solid rgba(7,26,36,1)',
                            boxShadow: `0 0 8px ${getCategoryColor(entry.category)}`,
                            zIndex: 1
                        }} />

                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${getCategoryColor(entry.category)}30`,
                            borderRadius: '10px',
                            padding: '12px'
                        }}>
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                                        {entry.district} District
                                    </div>
                                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                                        {formatDate(entry.timestamp)} at {formatTime(entry.timestamp)}
                                    </div>
                                </div>
                                <div style={{
                                    background: `${getCategoryColor(entry.category)}20`,
                                    color: getCategoryColor(entry.category),
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.65rem',
                                    fontWeight: 700
                                }}>
                                    {entry.score} · {entry.category}
                                </div>
                            </div>

                            {/* Input Parameters */}
                            <div style={{
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '6px',
                                padding: '8px',
                                marginBottom: '8px'
                            }}>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                                    INPUT PARAMETERS
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.65rem' }}>
                                    <div style={{ color: 'var(--text-secondary)' }}>
                                        Rainfall: <span style={{ fontWeight: 600 }}>{entry.inputs.rainfall_dev}mm</span>
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)' }}>
                                        Temp: <span style={{ fontWeight: 600 }}>{entry.inputs.temperature}°C</span>
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)' }}>
                                        Growth: <span style={{ fontWeight: 600 }}>{entry.inputs.case_growth}%</span>
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)' }}>
                                        Baseline: <span style={{ fontWeight: 600 }}>{entry.inputs.baseline}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Decision Taken */}
                            {entry.decision ? (
                                <div style={{
                                    background: 'rgba(0,224,184,0.05)',
                                    border: '1px solid rgba(0,224,184,0.2)',
                                    borderRadius: '6px',
                                    padding: '8px',
                                    fontSize: '0.65rem',
                                    color: 'var(--text-secondary)'
                                }}>
                                    <div style={{ color: 'var(--accent)', fontWeight: 600, marginBottom: '4px' }}>
                                        DECISION RECORDED
                                    </div>
                                    {entry.decision}
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        const decision = prompt('Record decision taken:');
                                        if (decision) handleAddDecision(entry.id, decision);
                                    }}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px dashed var(--border-subtle)',
                                        borderRadius: '6px',
                                        padding: '8px',
                                        fontSize: '0.65rem',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    + Add decision record
                                </button>
                            )}

                            {/* Operator */}
                            <div style={{ marginTop: '8px', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                                Triggered by: {entry.user}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer note */}
            <div style={{
                marginTop: '16px',
                padding: '10px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                fontSize: '0.6rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
                lineHeight: 1.6
            }}>
                All predictions are logged for audit compliance and policy review.
                <br />
                Logs are retained for 90 days per health department guidelines.
            </div>
        </motion.div>
    );
}
