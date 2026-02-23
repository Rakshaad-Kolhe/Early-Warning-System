import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchPrediction, fetchAlerts } from './api/client';
import StatusBar from './components/StatusBar';
import InputPanel from './components/InputPanel';
import RiskHero from './components/RiskHero';
import ContributingFactors from './components/ContributingFactors';
import ResponseProtocol from './components/ResponseProtocol';
import DistrictSnapshot from './components/DistrictSnapshot';
import AlertHistory from './components/AlertHistory';
import RiskTrend from './components/RiskTrend';
import ScenarioPanel from './components/ScenarioPanel';
import ResourcePanel from './components/ResourcePanel';
import KpiPanel from './components/KpiPanel';
import ArchitectureModal from './components/ArchitectureModal';

const DISTRICTS = [
    'Pune', 'Nashik', 'Mumbai', 'Nagpur',
    'Aurangabad', 'Thane', 'Solapur', 'Kolhapur',
];

const DEFAULT_INPUTS = {
    district: 'Pune',
    rainfall_dev: 10,
    temperature: 27,
    case_growth: 15,
    baseline: 50,
};

function buildInitialSnapshot() {
    const snap = {};
    DISTRICTS.forEach((d) => { snap[d] = { score: 0, category: 'LOW' }; });
    return snap;
}

export default function App() {
    const [inputs, setInputs] = useState(DEFAULT_INPUTS);
    const [result, setResult] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [snapshot, setSnapshot] = useState(buildInitialSnapshot);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [compareMode, setCompareMode] = useState(false);
    const [compareData, setCompareData] = useState(null);

    const [predictionCount, setPredictionCount] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchAlerts().then(setAlerts).catch(() => { });
    }, []);

    // ── In-flight guard: prevent request stacking on rapid clicks
    const inFlight = useRef(false);

    const handleRun = useCallback(async () => {
        if (inFlight.current) return;  // drop the click silently
        inFlight.current = true;
        setLoading(true);
        setError(null);
        try {
            const data = await fetchPrediction(inputs);
            // Check 4: log latency for monitoring
            console.info(`[EWS] Prediction latency: ${data._latencyMs}ms | score=${data.calibrated_score} cat=${data.category}`);
            setResult(data);
            setSnapshot((prev) => ({
                ...prev,
                [data.district]: { score: data.calibrated_score, category: data.category },
            }));
            setPredictionCount((c) => c + 1);
            const freshAlerts = await fetchAlerts();
            setAlerts(freshAlerts);
        } catch (err) {
            const msg = err.message?.includes('Failed to fetch')
                ? 'Backend unavailable — check server and retry.'
                : (err.message || 'Prediction failed.');
            setError(msg);
            // Auto-dismiss after 4 seconds
            setTimeout(() => setError(null), 4000);
        } finally {
            setLoading(false);
            inFlight.current = false;
        }
    }, [inputs]);

    return (
        <div className="min-h-screen flex flex-col px-6 py-4" style={{ maxWidth: '1600px', margin: '0 auto' }}>

            {/* ── Top Header ── */}
            <div style={{ marginBottom: '24px', paddingLeft: '4px' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                    District Surveillance Intelligence Layer
                </h1>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, marginTop: '4px' }}>
                    Climate-Aware Epidemiological Intelligence System
                </div>
            </div>

            {/* ── Status Strip ── */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <StatusBar />
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        onClick={() => setModalOpen(true)}
                        style={{
                            padding: '8px 16px',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        System Architecture
                    </button>
                    <button
                        onClick={() => setCompareMode(!compareMode)}
                        style={{
                            padding: '8px 16px',
                            background: compareMode ? 'rgba(0, 224, 184, 0.1)' : 'var(--accent)',
                            color: compareMode ? 'var(--accent)' : '#000',
                            border: compareMode ? '1px solid var(--accent)' : '1px solid transparent',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: compareMode ? 'none' : '0 4px 14px rgba(0, 224, 184, 0.3)'
                        }}
                    >
                        {compareMode ? 'Disable Scenario Comparison' : 'Enable Scenario Comparison'}
                    </button>
                </div>
            </div>

            {/* ── Error Banner ── */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            marginBottom: '16px',
                            padding: '8px 16px',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            background: 'var(--danger-dim)',
                            border: '1px solid rgba(255,77,90,0.2)',
                            color: 'var(--danger)',
                        }}
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ════════════════════════════════════════════
                MAIN LAYOUT — Left Sidebar + Right Content
                ════════════════════════════════════════════ */}
            <div style={{ display: 'flex', gap: '24px', flex: 1 }}>

                {/* ── LEFT: Control Panel (fixed 280px) ── */}
                <div style={{ width: '280px', flexShrink: 0 }}>
                    <InputPanel
                        values={inputs}
                        onChange={setInputs}
                        onRun={handleRun}
                        loading={loading}
                    />
                </div>

                {/* ── RIGHT: Main Visualization Area ── */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>

                    {/* ── TOP ROW: Hero with ambient bloom + Trend ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '40px' }}>
                        {/* Ambient bloom behind hero card only */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                inset: '-40px',
                                background: 'radial-gradient(circle at 50% 40%, rgba(0,230,242,0.06), transparent 70%)',
                                borderRadius: '50%',
                                pointerEvents: 'none',
                                zIndex: 0,
                            }} />
                            <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
                                <RiskHero result={result} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                            <KpiPanel count={predictionCount} result={result} />
                            <RiskTrend alerts={alerts} />
                        </div>
                    </div>

                    {/* ── BOTTOM ROW: 3 Equal Cards ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
                        {/* Card 1 — Contributing Factors */}
                        {result ? (
                            <ContributingFactors contributors={result.top_contributors} />
                        ) : (
                            <EmptyCard label="Contributing Factors" hint="Run a prediction to see risk drivers" />
                        )}

                        {/* Card 2 — District Snapshot */}
                        <DistrictSnapshot snapshot={snapshot} />

                        {/* Card 3 — Response Protocol */}
                        {result ? (
                            <ResponseProtocol response={result.response} />
                        ) : (
                            <EmptyCard label="Response Protocol" hint="Awaiting prediction output" />
                        )}
                    </div>
                </div>
            </div>

            <ResourcePanel resources={result?.recommended_resources} />

            {compareMode && (
                <ScenarioPanel
                    baseInputs={inputs}
                    baseResult={result}
                />
            )}

            {/* ── FULL WIDTH: Alert History ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{ marginTop: '24px', marginBottom: '48px' }}
            >
                <AlertHistory alerts={alerts} />
            </motion.div>

            <ArchitectureModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
}

function EmptyCard({ label, hint }) {
    return (
        <div
            className="glass-card flex flex-col justify-center items-center"
            style={{ minHeight: '160px' }}
        >
            <div className="section-label" style={{ marginBottom: '8px' }}>{label}</div>
            <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', opacity: 0.6, textAlign: 'center' }}>
                {hint}
            </p>
        </div>
    );
}
