import { motion } from 'framer-motion';

const RISK_THRESHOLDS = [
    {
        level: 'LOW',
        range: '0-35',
        color: '#4ade80',
        action: 'Routine Surveillance',
        deployment: 'Standard monitoring protocols',
        deadline: 'Ongoing',
        authority: 'District Health Officer',
        teams: 0
    },
    {
        level: 'MEDIUM',
        range: '36-65',
        color: '#fb923c',
        action: 'Enhanced Monitoring',
        deployment: 'Activate 2 field teams + daily reporting',
        deadline: '48 hours',
        authority: 'District Epidemiology Officer',
        teams: 2
    },
    {
        level: 'HIGH',
        range: '66-100',
        color: '#f87171',
        action: 'Vector Control Level-2',
        deployment: 'Deploy 5 field teams + emergency protocols',
        deadline: '24 hours',
        authority: 'Chief District Medical Officer',
        teams: 5
    }
];

export default function DecisionTriggerPanel({ result }) {
    if (!result) return null;

    const { calibrated_score: score, category } = result;
    const currentThreshold = RISK_THRESHOLDS.find(t => t.level === category) || RISK_THRESHOLDS[0];
    const nextThreshold = RISK_THRESHOLDS.find(t => {
        const [min] = t.range.split('-').map(Number);
        return min > score;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card"
        >
            <div style={{ marginBottom: '20px' }}>
                <div className="section-label">Decision Trigger Thresholds</div>
                <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', opacity: 0.5 }}>
                    Mandated actions by risk level
                </div>
            </div>

            {/* Current Status Banner */}
            <div style={{
                background: `${currentThreshold.color}15`,
                border: `2px solid ${currentThreshold.color}`,
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                        <div style={{ fontSize: '0.6rem', color: currentThreshold.color, fontWeight: 700, letterSpacing: '1.5px', marginBottom: '4px' }}>
                            CURRENT RISK: {currentThreshold.level}
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: currentThreshold.color }}>
                            {score}
                        </div>
                    </div>
                    <div style={{
                        background: `${currentThreshold.color}25`,
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: currentThreshold.color
                    }}>
                        Threshold: {currentThreshold.range}
                    </div>
                </div>

                <div style={{ borderTop: `1px solid ${currentThreshold.color}30`, paddingTop: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.7rem' }}>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem', marginBottom: '4px' }}>Mandated Action</div>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{currentThreshold.action}</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem', marginBottom: '4px' }}>Deployment Deadline</div>
                            <div style={{ color: currentThreshold.color, fontWeight: 700 }}>{currentThreshold.deadline}</div>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem', marginBottom: '4px' }}>Deployment Requirements</div>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{currentThreshold.deployment}</div>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem', marginBottom: '4px' }}>Escalation Authority</div>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{currentThreshold.authority}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Escalation Ladder */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px', letterSpacing: '1px' }}>
                    RISK ESCALATION LADDER
                </div>
                {RISK_THRESHOLDS.map((threshold, idx) => {
                    const isActive = threshold.level === category;
                    const [min, max] = threshold.range.split('-').map(Number);
                    const isPassed = score >= min;

                    return (
                        <div key={threshold.level} style={{
                            background: isActive ? `${threshold.color}10` : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${isActive ? threshold.color : 'var(--border-subtle)'}`,
                            borderRadius: '8px',
                            padding: '12px',
                            marginBottom: '8px',
                            opacity: isPassed ? 1 : 0.5,
                            position: 'relative'
                        }}>
                            {isActive && (
                                <div style={{
                                    position: 'absolute',
                                    left: '-8px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '4px',
                                    height: '60%',
                                    background: threshold.color,
                                    borderRadius: '2px'
                                }} />
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: threshold.color,
                                        boxShadow: isActive ? `0 0 8px ${threshold.color}` : 'none'
                                    }} />
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: threshold.color }}>
                                        {threshold.level}
                                    </span>
                                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                                        ({threshold.range})
                                    </span>
                                </div>
                                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: threshold.color }}>
                                    {threshold.teams} Teams
                                </span>
                            </div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                                {threshold.action}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Next Threshold Warning */}
            {nextThreshold && (
                <div style={{
                    background: 'rgba(245,185,66,0.08)',
                    border: '1px solid rgba(245,185,66,0.3)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '0.65rem',
                    color: 'var(--amber)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{ fontSize: '1rem' }}>⚠</span>
                    <div>
                        <div style={{ fontWeight: 700, marginBottom: '2px' }}>
                            {Math.abs(score - parseInt(nextThreshold.range.split('-')[0]))} points to {nextThreshold.level} threshold
                        </div>
                        <div style={{ opacity: 0.7 }}>
                            Next escalation: {nextThreshold.action}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
