import { useState } from 'react';
import App from './App';
import PredictionPage from './pages/PredictionPage';

export default function AppWithRouting() {
    const [currentPage, setCurrentPage] = useState('prediction'); // 'map' or 'prediction'

    return (
        <div>
            {/* Navigation Bar */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: 'rgba(7, 26, 36, 0.95)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--border)',
                padding: '12px 24px'
            }}>
                <div style={{
                    maxWidth: '1800px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: 'var(--accent)',
                        letterSpacing: '-0.02em'
                    }}>
                         Outbreak Intelligence
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => setCurrentPage('prediction')}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: currentPage === 'prediction' ? '1px solid var(--accent)' : '1px solid var(--border)',
                                background: currentPage === 'prediction' ? 'rgba(0,224,184,0.1)' : 'transparent',
                                color: currentPage === 'prediction' ? 'var(--accent)' : 'var(--text-muted)',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            🎯 Prediction System
                        </button>
                        <button
                            onClick={() => setCurrentPage('map')}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: currentPage === 'map' ? '1px solid var(--accent)' : '1px solid var(--border)',
                                background: currentPage === 'map' ? 'rgba(0,224,184,0.1)' : 'transparent',
                                color: currentPage === 'map' ? 'var(--accent)' : 'var(--text-muted)',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            🗺️ National Overview
                        </button>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <div style={{ paddingTop: '60px' }}>
                {currentPage === 'prediction' ? <PredictionPage /> : <App />}
            </div>
        </div>
    );
}
