import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ForecastTimeline({ result, inputs }) {
    const [showIntervention, setShowIntervention] = useState(true);

    if (!result) return null;

    const { calibrated_score: currentScore, category } = result;

    // Generate 14-day forecast based on current trajectory
    const generateForecast = (withIntervention) => {
        const days = [];
        const growthRate = inputs.case_growth / 100;
        const interventionEffect = withIntervention ? 0.6 : 1.0; // 40% reduction with intervention

        for (let i = 0; i <= 14; i++) {
            const dayGrowth = growthRate * interventionEffect * (1 - i * 0.02); // Diminishing growth
            const score = Math.min(95, currentScore + (dayGrowth * i * 8));
            days.push({
                day: i,
                score: Math.round(score),
                cases: Math.round(inputs.baseline * Math.pow(1 + (dayGrowth * 0.5), i))
            });
        }
        return days;
    };

    const baselineForecast = generateForecast(false);
    const interventionForecast = generateForecast(true);

    const maxScore = Math.max(...baselineForecast.map(d => d.score));
    const peakDay = baselineForecast.findIndex(d => d.score === maxScore);
    const peakReduction = baselineForecast[14].score - interventionForecast[14].score;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card"
        >
            <div style={{ marginBottom: '20px' }}>
                <div className="section-label">14-Day Risk Forecast</div>
                <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', opacity: 0.5 }}>
                    Projected trajectory with/without intervention
                </div>
            </div>

            {/* Toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button
                    onClick={() => setShowIntervention(!showIntervention)}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        background: showIntervention ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                        color: showIntervention ? '#000' : 'var(--text-muted)',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Show Intervention Impact
                </button>
            </div>

            {/* Chart */}
            <div style={{ position: 'relative', height: '200px', marginBottom: '16px' }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
                    {/* Grid */}
                    {[0, 25, 50, 75, 100].map(y => (
                        <line
                            key={y}
                            x1="0" y1={y} x2="100" y2={y}
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="0.2"
                        />
                    ))}

                    {/* Baseline forecast */}
                    <polyline
                        points={baselineForecast.map((d, i) => 
                            `${(i / 14) * 100},${100 - (d.score / maxScore) * 80}`
                        ).join(' ')}
                        fill="none"
                        stroke="#f87171"
                        strokeWidth="0.8"
                        strokeDasharray={showIntervention ? "2,2" : "0"}
                        opacity={showIntervention ? 0.5 : 1}
                    />

                    {/* Intervention forecast */}
                    {showIntervention && (
                        <polyline
                            points={interventionForecast.map((d, i) => 
                                `${(i / 14) * 100},${100 - (d.score / maxScore) * 80}`
                            ).join(' ')}
                            fill="none"
                            stroke="#4ade80"
                            strokeWidth="1.2"
                        />
                    )}

                    {/* Current point */}
                    <circle
                        cx="0"
                        cy={100 - (currentScore / maxScore) * 80}
                        r="1.5"
                        fill="var(--accent)"
                    />
                </svg>

                {/* Y-axis labels */}
                <div style={{ position: 'absolute', left: '-30px', top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                    <span>{maxScore}</span>
                    <span>{Math.round(maxScore * 0.5)}</span>
                    <span>0</span>
                </div>
            </div>

            {/* X-axis */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                <span>Today</span>
                <span>Day 7</span>
                <span>Day 14</span>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Peak Risk</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f87171' }}>
                        {maxScore}
                    </div>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Day {peakDay}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '4px' }}>With Intervention</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#4ade80' }}>
                        {interventionForecast[14].score}
                    </div>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Day 14</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Peak Reduction</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)' }}>
                        -{peakReduction}
                    </div>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>points</div>
                </div>
            </div>

            {/* Projected case load */}
            <div style={{
                marginTop: '16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px'
            }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    PROJECTED CASE LOAD
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                    <div>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Day 7</div>
                        <div style={{ fontWeight: 700, color: '#f87171' }}>
                            {baselineForecast[7].cases.toLocaleString()} cases
                        </div>
                        {showIntervention && (
                            <div style={{ fontWeight: 700, color: '#4ade80', fontSize: '0.65rem' }}>
                                {interventionForecast[7].cases.toLocaleString()} with intervention
                            </div>
                        )}
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Day 14</div>
                        <div style={{ fontWeight: 700, color: '#f87171' }}>
                            {baselineForecast[14].cases.toLocaleString()} cases
                        </div>
                        {showIntervention && (
                            <div style={{ fontWeight: 700, color: '#4ade80', fontSize: '0.65rem' }}>
                                {interventionForecast[14].cases.toLocaleString()} with intervention
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
