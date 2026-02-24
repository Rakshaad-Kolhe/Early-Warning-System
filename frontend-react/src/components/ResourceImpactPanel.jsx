import { motion } from 'framer-motion';

export default function ResourceImpactPanel({ result, inputs }) {
    if (!result) return null;

    const { calibrated_score: score, category, recommended_resources } = result;

    // Calculate projections based on current trajectory
    const currentBeds = 450;
    const currentICU = 45;
    const currentSupplies = 100; // days of supply

    const growthRate = inputs.case_growth / 100;
    const projectedCases14 = Math.round(inputs.baseline * Math.pow(1 + growthRate * 0.5, 14));
    
    // Resource calculations
    const bedOccupancy14 = Math.min(98, Math.round((projectedCases14 * 0.15 / currentBeds) * 100));
    const icuSaturation = Math.min(100, Math.round((projectedCases14 * 0.03 / currentICU) * 100));
    const supplyDepletion = Math.max(1, Math.round(currentSupplies / (1 + growthRate * 2)));

    const getStatusColor = (value, thresholds) => {
        if (value >= thresholds.critical) return '#f87171';
        if (value >= thresholds.warning) return '#fb923c';
        return '#4ade80';
    };

    const resources = [
        {
            name: 'Hospital Beds',
            current: currentBeds,
            projected: bedOccupancy14,
            unit: '% capacity',
            icon: '🏥',
            thresholds: { warning: 70, critical: 85 },
            detail: `${Math.round(currentBeds * bedOccupancy14 / 100)} / ${currentBeds} beds occupied`
        },
        {
            name: 'ICU Capacity',
            current: currentICU,
            projected: icuSaturation,
            unit: '% saturation',
            icon: '🚨',
            thresholds: { warning: 75, critical: 90 },
            detail: `${Math.round(currentICU * icuSaturation / 100)} / ${currentICU} ICU beds`
        },
        {
            name: 'Medical Supplies',
            current: currentSupplies,
            projected: supplyDepletion,
            unit: ' days',
            icon: '📦',
            thresholds: { warning: 14, critical: 7 },
            detail: 'Fogging chemicals, PPE, testing kits',
            inverse: true // Lower is worse
        },
        {
            name: 'Field Teams',
            current: 8,
            projected: recommended_resources?.field_teams || 5,
            unit: ' teams',
            icon: '👥',
            thresholds: { warning: 5, critical: 8 },
            detail: 'Vector control & surveillance teams'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="glass-card"
        >
            <div style={{ marginBottom: '20px' }}>
                <div className="section-label">Resource Impact Projection</div>
                <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', opacity: 0.5 }}>
                    14-day capacity forecast
                </div>
            </div>

            {/* Critical Alert Banner */}
            {(bedOccupancy14 >= 85 || icuSaturation >= 90 || supplyDepletion <= 7) && (
                <div style={{
                    background: 'rgba(248,113,113,0.1)',
                    border: '2px solid #f87171',
                    borderRadius: '10px',
                    padding: '12px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '1.5rem' }}>🔴</span>
                    <div style={{ fontSize: '0.7rem', color: '#f87171' }}>
                        <div style={{ fontWeight: 700, marginBottom: '2px' }}>CRITICAL RESOURCE STRAIN PROJECTED</div>
                        <div style={{ opacity: 0.8 }}>Immediate capacity expansion required</div>
                    </div>
                </div>
            )}

            {/* Resource Cards */}
            <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                {resources.map(resource => {
                    const color = resource.inverse 
                        ? (resource.projected <= resource.thresholds.critical ? '#f87171' : 
                           resource.projected <= resource.thresholds.warning ? '#fb923c' : '#4ade80')
                        : getStatusColor(resource.projected, resource.thresholds);

                    return (
                        <div key={resource.name} style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${color}30`,
                            borderRadius: '10px',
                            padding: '14px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '1.2rem' }}>{resource.icon}</span>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                            {resource.name}
                                        </div>
                                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                                            {resource.detail}
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    background: `${color}20`,
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    color: color
                                }}>
                                    {resource.projected}{resource.unit}
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div style={{
                                height: '6px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '3px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ 
                                        width: resource.inverse 
                                            ? `${(resource.projected / resource.current) * 100}%`
                                            : `${resource.projected}%` 
                                    }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    style={{
                                        height: '100%',
                                        background: color,
                                        borderRadius: '3px'
                                    }}
                                />
                                {/* Threshold markers */}
                                {!resource.inverse && (
                                    <>
                                        <div style={{
                                            position: 'absolute',
                                            left: `${resource.thresholds.warning}%`,
                                            top: 0,
                                            bottom: 0,
                                            width: '2px',
                                            background: '#fb923c',
                                            opacity: 0.5
                                        }} />
                                        <div style={{
                                            position: 'absolute',
                                            left: `${resource.thresholds.critical}%`,
                                            top: 0,
                                            bottom: 0,
                                            width: '2px',
                                            background: '#f87171',
                                            opacity: 0.5
                                        }} />
                                    </>
                                )}
                            </div>

                            {/* Timeline */}
                            <div style={{ marginTop: '8px', fontSize: '0.6rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Current: {resource.current}{resource.unit}</span>
                                <span>Day 14 projection</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Strategic Summary */}
            <div style={{
                background: 'rgba(0,224,184,0.05)',
                border: '1px solid rgba(0,224,184,0.2)',
                borderRadius: '8px',
                padding: '12px'
            }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '8px' }}>
                    STRATEGIC RECOMMENDATIONS
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {bedOccupancy14 >= 85 && '• Activate surge capacity protocols and coordinate with neighboring districts\n'}
                    {icuSaturation >= 75 && '• Prepare ICU overflow facilities and staff augmentation\n'}
                    {supplyDepletion <= 14 && '• Expedite supply chain orders and establish emergency stockpiles\n'}
                    {score >= 66 && '• Deploy additional field teams for vector control and surveillance\n'}
                    {score < 66 && '• Maintain current resource allocation with enhanced monitoring'}
                </div>
            </div>
        </motion.div>
    );
}
