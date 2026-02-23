import { useState } from 'react';
import { motion } from 'framer-motion';
import { fetchPrediction } from '../api/client';
import RiskHero from './RiskHero';
import InputPanel from './InputPanel';

export default function ScenarioPanel({ baseInputs, baseResult }) {
    const [scenarioInputs, setScenarioInputs] = useState({ ...baseInputs });
    const [scenarioResult, setScenarioResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRunScenario = async () => {
        setLoading(true);
        try {
            const data = await fetchPrediction(scenarioInputs);
            setScenarioResult(data);
        } catch (err) {
            console.error("Scenario prediction failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                marginTop: '24px',
                padding: '24px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px'
            }}
        >
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '20px' }}>Simulation Scenario</h3>

            <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ flex: 1, minWidth: '280px', maxWidth: '320px' }}>
                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.85rem' }}>Adjust Scenario Inputs</h4>
                    <InputPanel
                        values={scenarioInputs}
                        onChange={setScenarioInputs}
                        onRun={handleRunScenario}
                        loading={loading}
                    />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.85rem' }}>Scenario Risk</h4>
                    <div style={{ flex: 1 }}>
                        <RiskHero result={scenarioResult} />
                    </div>
                </div>

                {/* Animated Connecting Glow Line */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>
                    {scenarioResult && (
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            style={{
                                width: '40px',
                                height: '2px',
                                background: 'linear-gradient(90deg, var(--accent) 0%, rgba(0,224,184,0) 100%)',
                                boxShadow: '0 0 8px var(--accent)',
                                transformOrigin: 'left',
                            }}
                        />
                    )}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.85rem' }}>Baseline Risk</h4>
                    <div style={{ flex: 1 }}>
                        <RiskHero result={baseResult} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
