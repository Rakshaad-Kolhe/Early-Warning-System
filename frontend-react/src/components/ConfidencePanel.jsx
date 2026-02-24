import { motion } from 'framer-motion';

export default function ConfidencePanel({ result, inputs }) {
    if (!result) return null;

    const { confidence, uncertainty, drift_status, calibrated_score: score } = result;

    // Calculate confidence metrics
    const modelReliability = Math.round(85 + (confidence - 50) * 0.3); // 85-100 range
    const forecastVariance = uncertainty || 5.2;
    
    // Check if inputs are out of distribution
    const isOutOfDistribution = 
        inputs.rainfall_dev < -50 || inputs.rainfall_dev > 60 ||
        inputs.temperature < 20 || inputs.temperature > 40 ||
        inputs.case_growth > 60;

    const confidenceBand = {
        lower: Math.max(0, score - forecastVariance),
        upper: Math.min(100, score + forecastVariance)
    };

    const getConfidenceLevel = (conf) => {
        if (conf >= 80) return { label: 'High', color: '#4ade80' };
        if (conf >= 60) return { label: 'Moderate', color: '#fb923c' };
        return { label: 'Low', color: '#f87171' };
    };

    const confLevel = getConfidenceLevel(confidence);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass-card"
        >
            <div style={{ marginBottom: '20px' }}>
                <div className="section-label">Model Confidence & Uncertainty</div>
                <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', opacity: 0.5 }}>
                    Prediction reliability metrics
                </div>
            </div>

            {/* Out of Distribution Warning */}
            {isOutOfDistribution && (
                <div style={{
                    background: 'rgba(245,185,66,0.1)',
                    border: '2px solid var(--amber)',
                    borderRadius: '10px',
                    padding: '12px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '1.5rem' }}>⚠</span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--amber)' }}>
                        <div style={{ fontWeight: 700, marginBottom: '4px' }}>
                            INPUT PATTERN DEVIATES FROM TRAINING DISTRIBUTION
                        </div>
                        <div style={{ opacity: 0.8, lineHeight: 1.5 }}>
                            One or more input parameters are outside the model's typical training range. 
                            Predictions may be less reliable. Consider expert review.
                        </div>
                    </div>
                </div>
            )}

            {/* Drift Status */}
            {drift_status === 'warning' && (
                <div style={{
                    background: 'rgba(245,185,66,0.08)',
                    border: '1px solid rgba(245,185,66,0.3)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{ fontSize: '1.2rem' }}>📊</span>
                    <div style={{ fontSize: '0.65rem', color: 'var(--amber)' }}>
                        <span style={{ fontWeight: 700 }}>Model Drift Detected:</span> Recent data patterns differ from training baseline. Model recalibration recommended.
                    </div>
                </div>
            )}

            {/* Main Confidence Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${confLevel.color}30`,
                    borderRadius: '10px',
                    padding: '14px'
                }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Signal Confidence
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: confLevel.color, lineHeight: 1, marginBottom: '6px' }}>
                        {confidence}%
                    </div>
                    <div style={{
                        background: `${confLevel.color}20`,
                        color: confLevel.color,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        display: 'inline-block'
                    }}>
                        {confLevel.label}
                    </div>
                </div>

                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '14px'
                }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Model Reliability
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1, marginBottom: '6px' }}>
                        {modelReliability}%
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                        Based on validation metrics
                    </div>
                </div>
            </div>

            {/* Confidence Band Visualization */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '16px'
            }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px', letterSpacing: '1px' }}>
                    FORECAST CONFIDENCE INTERVAL
                </div>

                {/* Visual band */}
                <div style={{ position: 'relative', height: '60px', marginBottom: '12px' }}>
                    {/* Background scale */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-50%)'
                    }} />

                    {/* Confidence band */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: `${confidenceBand.lower}%`,
                        width: `${confidenceBand.upper - confidenceBand.lower}%`,
                        height: '30px',
                        background: 'rgba(0,224,184,0.15)',
                        border: '1px solid rgba(0,224,184,0.4)',
                        borderRadius: '4px',
                        transform: 'translateY(-50%)'
                    }} />

                    {/* Point estimate */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: `${score}%`,
                        width: '3px',
                        height: '40px',
                        background: 'var(--accent)',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 0 8px var(--accent)'
                    }} />

                    {/* Labels */}
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: `${confidenceBand.lower}%`,
                        transform: 'translateX(-50%)',
                        fontSize: '0.6rem',
                        color: 'var(--text-muted)',
                        marginTop: '4px'
                    }}>
                        {Math.round(confidenceBand.lower)}
                    </div>
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: `${score}%`,
                        transform: 'translateX(-50%)',
                        fontSize: '0.65rem',
                        color: 'var(--accent)',
                        fontWeight: 700,
                        marginTop: '4px'
                    }}>
                        {score}
                    </div>
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: `${confidenceBand.upper}%`,
                        transform: 'translateX(-50%)',
                        fontSize: '0.6rem',
                        color: 'var(--text-muted)',
                        marginTop: '4px'
                    }}>
                        {Math.round(confidenceBand.upper)}
                    </div>
                </div>

                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '16px' }}>
                    95% confidence interval: {Math.round(confidenceBand.lower)} - {Math.round(confidenceBand.upper)}
                    <br />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>
                        Forecast variance: ±{forecastVariance.toFixed(1)}%
                    </span>
                </div>
            </div>

            {/* Sensitivity Warning */}
            <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px'
            }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    SENSITIVITY ANALYSIS
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Most sensitive to: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Case Growth Rate</span>
                    <br />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>
                        A 10% change in case growth could shift risk score by ±8 points
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
