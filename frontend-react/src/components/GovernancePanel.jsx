import { motion } from 'framer-motion';

const GOVERNANCE_ACTIONS = {
    LOW: [
        { action: 'Routine Surveillance', status: 'active', icon: '👁️' },
        { action: 'Weekly Reporting', status: 'active', icon: '📊' },
        { action: 'Community Awareness', status: 'recommended', icon: '📢' }
    ],
    MEDIUM: [
        { action: 'Enhanced Surveillance', status: 'mandatory', icon: '🔍' },
        { action: 'School Health Advisory', status: 'recommended', icon: '🏫' },
        { action: 'Daily Situation Reports', status: 'mandatory', icon: '📋' },
        { action: 'Vector Control Activation', status: 'mandatory', icon: '🦟' },
        { action: 'Supply Chain Alert', status: 'recommended', icon: '📦' }
    ],
    HIGH: [
        { action: 'Emergency Operations Center', status: 'mandatory', icon: '🚨' },
        { action: 'School Closure Advisory', status: 'mandatory', icon: '🏫' },
        { action: 'Travel Screening', status: 'mandatory', icon: '✈️' },
        { action: 'Public Health Messaging', status: 'mandatory', icon: '📢' },
        { action: 'Supply Chain Stabilization', status: 'mandatory', icon: '⚡' },
        { action: 'Inter-District Coordination', status: 'mandatory', icon: '🤝' },
        { action: 'Media Briefing', status: 'recommended', icon: '📺' }
    ]
};

export default function GovernancePanel({ result }) {
    if (!result) return null;

    const { category, calibrated_score: score, district, timestamp } = result;
    const actions = GOVERNANCE_ACTIONS[category] || GOVERNANCE_ACTIONS.LOW;

    const getStatusColor = (status) => {
        switch (status) {
            case 'mandatory': return '#f87171';
            case 'recommended': return '#fb923c';
            case 'active': return '#4ade80';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="glass-card"
        >
            <div style={{ marginBottom: '20px' }}>
                <div className="section-label">Recommended Administrative Actions</div>
                <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', opacity: 0.5 }}>
                    Governance protocols for {category} risk level
                </div>
            </div>

            {/* Alert Banner for HIGH risk */}
            {category === 'HIGH' && (
                <div style={{
                    background: 'rgba(248,113,113,0.1)',
                    border: '2px solid #f87171',
                    borderRadius: '10px',
                    padding: '14px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                }}>
                    <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>🔴</span>
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f87171', marginBottom: '4px' }}>
                            DISTRICT RISK CRITICAL
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            Lead Time Remaining: <span style={{ fontWeight: 700, color: '#f87171' }}>6 Days</span>
                            <br />
                            Escalation to State Health Department recommended
                        </div>
                    </div>
                </div>
            )}

            {/* Action Items */}
            <div style={{ marginBottom: '16px' }}>
                {actions.map((item, idx) => (
                    <motion.div
                        key={item.action}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + idx * 0.05 }}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${getStatusColor(item.status)}30`,
                            borderRadius: '8px',
                            padding: '12px',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                            <div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {item.action}
                                </div>
                            </div>
                        </div>
                        <span style={{
                            background: `${getStatusColor(item.status)}20`,
                            color: getStatusColor(item.status),
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {item.status}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* Communication Templates */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '16px'
            }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px', letterSpacing: '1px' }}>
                    PUBLIC MESSAGING GUIDANCE
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {category === 'HIGH' && (
                        <>
                            <strong style={{ color: 'var(--text-primary)' }}>Immediate Public Advisory:</strong>
                            <br />
                            "District health authorities have activated enhanced disease surveillance protocols. Residents are advised to practice preventive measures including mosquito protection, maintaining hygiene, and seeking immediate medical attention for fever or unusual symptoms. Schools and public venues should follow health department guidelines."
                        </>
                    )}
                    {category === 'MEDIUM' && (
                        <>
                            <strong style={{ color: 'var(--text-primary)' }}>Health Advisory:</strong>
                            <br />
                            "Health monitoring has been enhanced in {district} district. Citizens should remain vigilant about vector-borne disease prevention. Report any unusual health patterns to local health centers. Routine activities may continue with standard precautions."
                        </>
                    )}
                    {category === 'LOW' && (
                        <>
                            <strong style={{ color: 'var(--text-primary)' }}>Routine Communication:</strong>
                            <br />
                            "Disease surveillance remains at normal levels. Continue practicing good hygiene and environmental sanitation. Regular health monitoring is ongoing."
                        </>
                    )}
                </div>
            </div>

            {/* Escalation Path */}
            <div style={{
                background: 'rgba(0,224,184,0.05)',
                border: '1px solid rgba(0,224,184,0.2)',
                borderRadius: '8px',
                padding: '12px'
            }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '8px' }}>
                    ESCALATION PATHWAY
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--accent)' }}>1.</span>
                        <span>District Health Officer → District Collector</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--accent)' }}>2.</span>
                        <span>District Collector → State Health Department</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--accent)' }}>3.</span>
                        <span>State Health → National Disease Control</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
