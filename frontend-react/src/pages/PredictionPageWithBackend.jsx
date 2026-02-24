import { useState } from 'react';
import { motion } from 'framer-motion';
import { predictOutbreak } from '../utils/hardcodedPredictor';
import { fetchPrediction } from '../api/client';
import InputPanel from '../components/InputPanel';
import RiskHero from '../components/RiskHero';
import DecisionTriggerPanel from '../components/DecisionTriggerPanel';
import ConfidencePanel from '../components/ConfidencePanel';
import ForecastTimeline from '../components/ForecastTimeline';
import ResourceImpactPanel from '../components/ResourceImpactPanel';
import GovernancePanel from '../components/GovernancePanel';
import ContributingFactors from '../components/ContributingFactors';
import ResponseProtocol from '../components/ResponseProtocol';
import AuditTrailPanel from '../components/AuditTrailPanel';

export default function PredictionPage() {
    const [inputs, setInputs] = useState({
        district: 'Pune',
        rainfall_dev: 15,
        temperature: 28,
        case_growth: 12,
        baseline: 45
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [useBackend, setUseBackend] = useState(false);
    const [backendAvailable, setBackendAvailable] = useState(null);

    // Check backend availability on mount
    useState(() => {
        fetch('/api/health')
            .then(res => res.ok ? setBackendAvailable(true) : setBackendAvailable(false))
            .catch(() => setBackendAvailable(false));
    }, []);

    const handleRun = async () => {
        setLoading(true);
        setError(null);
        try {
            let data;
            
            if (useBackend && backendAvailable) {
                // Use backend API
                const response = await fetchPrediction(inputs);
                
                // Transform backend response to match frontend format
                data = {
                    score: response.calibrated_score,
                    category: response.category,
                    confidence: response.confidence,
                    contributors: response.top_contributors || [],
                    response: response.response,
                    timestamp: response.timestamp,
                    uncertainty: response.uncertainty,
                    drift_status: response.drift_status,
                    resources: response.recommended_resources,
                    source: 'backend-api',
                    latency: response._latencyMs
                };
            } else {
                // Use hardcoded predictor
                await new Promise(resolve => setTimeout(resolve, 800));
                data = predictOutbreak(inputs);
                data.source = 'hardcoded';
            }
            
            setResult(data);
        } catch (err) {
            setError(err.message);
            console.error('Prediction error:', err);
            
            // Fallback to hardcoded if backend fails
            if (useBackend) {
                console.log('Backend failed, falling back to hardcoded predictor');
                try {
                    const data = predictOutbreak(inputs);
                    data.source = 'hardcoded-fallback';
                    setResult(data);
                    setError('Backend unavailable, using hardcoded predictor');
                } catch (fallbackErr) {
                    console.error('Fallback also failed:', fallbackErr);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #050B14 0%, #0a1a28 50%, #071a24 100%)',
            padding: '24px'
        }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    marginBottom: '32px',
                    textAlign: 'center'
                }}
            >
                <div style={{
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: 'var(--accent)',
                    fontWeight: 700,
                    marginBottom: '8px'
                }}>
                    District Early Warning System
                </div>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    margin: 0,
                    letterSpacing: '-0.02em'
                }}>
                    Outbreak Risk Prediction
                </h1>
                <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '8px'
                }}>
                    AI-powered decision support for public health response
                </div>
                
                {/* Backend Toggle */}
                <div style={{
                    marginTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    fontSize: '0.75rem'
                }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                        Prediction Source:
                    </span>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: backendAvailable === false ? 'not-allowed' : 'pointer',
                        opacity: backendAvailable === false ? 0.5 : 1
                    }}>
                        <input
                            type="checkbox"
                            checked={useBackend}
                            onChange={(e) => setUseBackend(e.target.checked)}
                            disabled={backendAvailable === false}
                            style={{ cursor: 'pointer' }}
                        />
                        <span style={{ color: 'var(--text-primary)' }}>
                            Use Backend API
                        </span>
                    </label>
                    {backendAvailable === false && (
                        <span style={{
                            color: '#f87171',
                            fontSize: '0.7rem'
                        }}>
                            (Backend not running)
                        </span>
                    )}
                    {backendAvailable === true && (
                        <span style={{
                            color: '#4ade80',
                            fontSize: '0.7rem'
                        }}>
                            ✓ Available
                        </span>
                    )}
                </div>
            </motion.div>

            {/* Error Banner */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'rgba(248,113,113,0.1)',
                        border: '1px solid #f87171',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        marginBottom: '24px',
                        color: '#f87171',
                        fontSize: '0.75rem',
                        maxWidth: '1800px',
                        margin: '0 auto 24px'
                    }}
                >
                    ⚠ {error}
                </motion.div>
            )}

            {/* Source Indicator */}
            {result && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        maxWidth: '1800px',
                        margin: '0 auto 16px',
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        textAlign: 'center'
                    }}
                >
                    Source: {result.source}
                    {result.latency && ` | Latency: ${result.latency}ms`}
                </motion.div>
            )}

            {/* Main Grid Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '320px 1fr',
                gap: '24px',
                maxWidth: '1800px',
                margin: '0 auto'
            }}>
                {/* Left Sidebar - Input Panel */}
                <div style={{ position: 'sticky', top: '24px', height: 'fit-content' }}>
                    <InputPanel
                        values={inputs}
                        onChange={setInputs}
                        onRun={handleRun}
                        loading={loading}
                    />
                </div>

                {/* Right Content Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Hero Risk Score */}
                    <RiskHero result={result} />

                    {/* Two Column Grid for Key Panels */}
                    {result && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '24px'
                        }}>
                            <DecisionTriggerPanel result={result} />
                            <ConfidencePanel result={result} inputs={inputs} />
                        </div>
                    )}

                    {/* Forecast Timeline - Full Width */}
                    {result && (
                        <ForecastTimeline result={result} inputs={inputs} />
                    )}

                    {/* Resource & Governance Grid */}
                    {result && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '24px'
                        }}>
                            <ResourceImpactPanel result={result} inputs={inputs} />
                            <GovernancePanel result={result} />
                        </div>
                    )}

                    {/* Contributing Factors & Response */}
                    {result && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '24px'
                        }}>
                            <ContributingFactors result={result} />
                            <ResponseProtocol result={result} />
                        </div>
                    )}

                    {/* Audit Trail - Full Width */}
                    <AuditTrailPanel result={result} inputs={inputs} />
                </div>
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                style={{
                    marginTop: '48px',
                    textAlign: 'center',
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                    opacity: 0.5
                }}
            >
                Model Version: v2.1.4 | Last Updated: Feb 2026 | Powered by AI Outbreak Intelligence
            </motion.div>
        </div>
    );
}
