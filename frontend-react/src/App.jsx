export default function App() {
    const citySignals = [
        { name: 'Delhi', level: 'high', x: 155, y: 115, spark: '0,18 12,14 24,12 36,10 48,8 60,6' },
        { name: 'Mumbai', level: 'high', x: 120, y: 225, spark: '0,16 12,12 24,10 36,8 48,9 60,6' },
        { name: 'Kolkata', level: 'medium', x: 235, y: 170, spark: '0,14 12,12 24,12 36,10 48,9 60,9' },
        { name: 'Chennai', level: 'high', x: 200, y: 300, spark: '0,18 12,16 24,12 36,10 48,9 60,8' },
        { name: 'Bengaluru', level: 'medium', x: 170, y: 285, spark: '0,14 12,13 24,12 36,11 48,10 60,9' },
        { name: 'Hyderabad', level: 'high', x: 175, y: 245, spark: '0,15 12,13 24,11 36,10 48,8 60,7' },
        { name: 'Pune', level: 'medium', x: 135, y: 235, spark: '0,12 12,11 24,10 36,9 48,9 60,8' },
        { name: 'Ahmedabad', level: 'medium', x: 105, y: 190, spark: '0,13 12,12 24,11 36,11 48,10 60,9' },
        { name: 'Jaipur', level: 'medium', x: 135, y: 150, spark: '0,12 12,12 24,11 36,10 48,10 60,9' },
        { name: 'Lucknow', level: 'high', x: 190, y: 145, spark: '0,16 12,14 24,12 36,10 48,9 60,8' },
        { name: 'Surat', level: 'medium', x: 110, y: 210, spark: '0,12 12,11 24,10 36,10 48,9 60,9' },
        { name: 'Kanpur', level: 'medium', x: 195, y: 150, spark: '0,13 12,12 24,11 36,10 48,9 60,9' },
        { name: 'Nagpur', level: 'high', x: 170, y: 205, spark: '0,15 12,14 24,12 36,10 48,9 60,8' },
        { name: 'Indore', level: 'medium', x: 145, y: 195, spark: '0,12 12,12 24,11 36,10 48,10 60,9' },
        { name: 'Bhopal', level: 'medium', x: 155, y: 190, spark: '0,12 12,11 24,11 36,10 48,9 60,9' },
        { name: 'Patna', level: 'high', x: 220, y: 155, spark: '0,15 12,14 24,12 36,11 48,10 60,9' },
        { name: 'Ranchi', level: 'medium', x: 215, y: 175, spark: '0,12 12,12 24,11 36,10 48,10 60,9' },
        { name: 'Guwahati', level: 'medium', x: 270, y: 165, spark: '0,12 12,12 24,11 36,10 48,10 60,9' },
        { name: 'Kochi', level: 'medium', x: 165, y: 330, spark: '0,11 12,11 24,10 36,10 48,9 60,9' },
        { name: 'Thiruvananthapuram', level: 'low', x: 165, y: 355, spark: '0,10 12,10 24,9 36,9 48,8 60,8' },
        { name: 'Chandigarh', level: 'low', x: 150, y: 120, spark: '0,10 12,10 24,9 36,9 48,8 60,8' },
        { name: 'Ludhiana', level: 'medium', x: 145, y: 125, spark: '0,11 12,11 24,10 36,10 48,9 60,9' },
        { name: 'Vadodara', level: 'medium', x: 115, y: 200, spark: '0,11 12,11 24,10 36,10 48,9 60,9' },
        { name: 'Visakhapatnam', level: 'medium', x: 215, y: 250, spark: '0,12 12,11 24,11 36,10 48,9 60,9' },
        { name: 'Coimbatore', level: 'low', x: 165, y: 315, spark: '0,10 12,10 24,9 36,9 48,8 60,8' },
        { name: 'Agra', level: 'medium', x: 170, y: 145, spark: '0,12 12,11 24,11 36,10 48,9 60,9' },
        { name: 'Nashik', level: 'medium', x: 130, y: 215, spark: '0,11 12,11 24,10 36,10 48,9 60,9' },
        { name: 'Madurai', level: 'low', x: 175, y: 335, spark: '0,10 12,10 24,9 36,9 48,8 60,8' },
        { name: 'Varanasi', level: 'medium', x: 210, y: 150, spark: '0,12 12,11 24,11 36,10 48,9 60,9' },
        { name: 'Mysuru', level: 'low', x: 160, y: 295, spark: '0,10 12,10 24,9 36,9 48,8 60,8' }
    ];

    const emergingThreats = [
        {
            name: 'Novel respiratory cluster',
            firstSeen: '2026-02-18',
            symptoms: 'fever, dry cough, fatigue',
            confidence: '78%'
        },
        {
            name: 'Acute gastroenteritis signal',
            firstSeen: '2026-02-20',
            symptoms: 'vomiting, diarrhea, dehydration',
            confidence: '64%'
        },
        {
            name: 'Febrile rash outbreak',
            firstSeen: '2026-02-22',
            symptoms: 'rash, joint pain, low-grade fever',
            confidence: '71%'
        }
    ];

    const newsSignals = [
        {
            headline: 'Local hospitals report surge in flu-like admissions',
            source: 'National Health Desk',
            location: 'Mumbai',
            tags: 'fever, cough'
        },
        {
            headline: 'School closures in response to cluster of rash cases',
            source: 'City Gazette',
            location: 'Jaipur',
            tags: 'rash, joint pain'
        },
        {
            headline: 'Emergency wards see dehydration spike',
            source: 'Regional Newswire',
            location: 'Chennai',
            tags: 'vomiting, diarrhea'
        },
        {
            headline: 'Travel hub flags new respiratory screenings',
            source: 'Airport Health Unit',
            location: 'Delhi',
            tags: 'fever, shortness of breath'
        },
        {
            headline: 'Rural clinics report rising febrile illness',
            source: 'Public Health Watch',
            location: 'Patna',
            tags: 'fever, chills'
        },
        {
            headline: 'Pharmacy demand spikes for antipyretics',
            source: 'Supply Chain Monitor',
            location: 'Bengaluru',
            tags: 'fever, fatigue'
        }
    ];

    return (
        <div className="app-shell">
            <div className="app-frame">
                <header className="app-header">
                    <div>
                        <div className="app-kicker">AI Outbreak Predictor</div>
                        <h1 className="app-title">Global Outbreak Intelligence</h1>
                        <div className="app-meta">Last updated: 2026-02-24 11:30 IST • Sources: News, WHO, ICMR, Local advisories</div>
                    </div>
                    <div className="app-header-actions">
                        <button className="ghost-button">Scenario Comparison</button>
                        <button className="primary-button">Export Response Plan</button>
                    </div>
                </header>

                <div className="app-grid">
                    <aside className="panel sidebar">
                        <div className="panel-title">Signal Controls</div>

                        <div className="form-block">
                            <label className="label">Daily Case Reports</label>
                            <div className="range-row">
                                <input type="range" min="0" max="8" defaultValue="2" />
                                <div className="range-value">2k</div>
                            </div>
                        </div>

                        <div className="form-block">
                            <label className="label">Testing Coverage</label>
                            <div className="select">Medium - Targeted screening</div>
                        </div>

                        <div className="form-block">
                            <label className="label">Hospital Capacity</label>
                            <div className="range-row">
                                <input type="range" min="0" max="10" defaultValue="4" />
                                <div className="range-value">4k beds</div>
                            </div>
                        </div>

                        <div className="form-block">
                            <label className="label">Mobility Level</label>
                            <div className="range-row">
                                <input type="range" min="0" max="10" defaultValue="6" />
                                <div className="range-value">High</div>
                            </div>
                        </div>

                        <div className="form-block">
                            <label className="label">Supply Constraint</label>
                            <div className="select">High Strain</div>
                        </div>

                        <div className="divider" />

                        <div className="preset-row">
                            <div className="label">Scenario Presets</div>
                            <div className="chip-row">
                                <button className="chip">Baseline</button>
                                <button className="chip">Surge</button>
                                <button className="chip active">Targeted</button>
                            </div>
                        </div>

                        <div className="side-note">Simulating outbreak futures</div>
                    </aside>

                    <main className="main-content">
                        <section className="panel chart-panel">
                            <div className="panel-header">
                                <div>
                                    <div className="panel-title">Real-Time Outbreak Trajectory</div>
                                    <div className="panel-subtitle">Scenario Comparison vs. Containment Plan</div>
                                </div>
                                <div className="legend">
                                    <span className="legend-item aqua">Scenario A - Controlled Spread</span>
                                    <span className="legend-item pink">Scenario B - Rapid Surge</span>
                                    <span className="legend-item gold">Scenario C - Intermittent Waves</span>
                                    <span className="legend-item white">Your Projection</span>
                                </div>
                            </div>
                            <div className="chart-title">Case Load: Presets vs Plan</div>
                            <div className="chart-wrap">
                                <svg viewBox="0 0 860 320" preserveAspectRatio="none">
                                    <g className="chart-grid">
                                        {Array.from({ length: 7 }).map((_, i) => (
                                            <line key={`h-${i}`} x1="40" y1={40 + i * 40} x2="820" y2={40 + i * 40} />
                                        ))}
                                        {Array.from({ length: 10 }).map((_, i) => (
                                            <line key={`v-${i}`} x1={40 + i * 80} y1="40" x2={40 + i * 80} y2="280" />
                                        ))}
                                    </g>
                                    <polyline className="chart-line aqua" points="40,260 120,235 200,215 280,200 360,180 440,165 520,150 600,135 680,125 760,115 820,110" />
                                    <polyline className="chart-line pink" points="40,260 120,210 200,185 280,165 360,150 440,135 520,125 600,115 680,105 760,95 820,88" />
                                    <polyline className="chart-line gold" points="40,260 120,225 200,200 280,180 360,165 440,150 520,135 600,125 680,115 760,100 820,92" />
                                    <polyline className="chart-line white dotted" points="40,260 120,258 200,257 280,256 360,255 440,254 520,253 600,252 680,251 760,250 820,249" />
                                </svg>
                                <div className="chart-axis">
                                    <span>W0</span>
                                    <span>W8</span>
                                    <span>W16</span>
                                    <span>W24</span>
                                    <span>W32</span>
                                    <span>W36</span>
                                </div>
                            </div>
                        </section>

                        <div className="card-grid">
                            <section className="panel mini-panel">
                                <div className="panel-title">India Heat Map</div>
                                <div className="panel-subtitle">Severity by major city</div>
                                <div className="heatmap">
                                    <svg viewBox="0 0 360 420" preserveAspectRatio="xMidYMid meet">
                                        <path
                                            className="india-shape"
                                            d="M126 40 L146 30 L168 34 L186 46 L198 60 L210 82 L226 100 L248 118 L262 142 L272 168 L264 190 L246 198 L238 214 L224 226 L216 242 L214 262 L204 284 L192 304 L178 322 L166 340 L156 356 L150 374 L138 394 L126 384 L116 368 L118 346 L110 332 L100 318 L94 296 L88 270 L86 248 L92 226 L98 206 L98 182 L94 162 L92 140 L96 120 L106 102 L116 86 L124 66 Z"
                                        />
                                        {citySignals.map((city) => (
                                            <circle
                                                key={city.name}
                                                cx={city.x}
                                                cy={city.y}
                                                r="6"
                                                className={`heatmap-dot ${city.level}`}
                                            />
                                        ))}
                                    </svg>
                                    <div className="heatmap-legend">
                                        <span className="legend-dot high" /> High
                                        <span className="legend-dot medium" /> Moderate
                                        <span className="legend-dot low" /> Low
                                    </div>
                                    <div className="heatmap-cities">
                                        {citySignals.map((city) => (
                                            <div key={city.name} className={`city-row ${city.level}`}>
                                                <div className="city-name">{city.name}</div>
                                                <svg viewBox="0 0 60 20" className="sparkline">
                                                    <polyline points={city.spark} />
                                                </svg>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section className="panel mini-panel">
                                <div className="panel-title">Emerging Threats</div>
                                <div className="panel-subtitle">AI-classified signals</div>
                                <div className="threat-list">
                                    {emergingThreats.map((item) => (
                                        <div key={item.name} className="threat-card">
                                            <div className="threat-name">{item.name}</div>
                                            <div className="threat-meta">First seen: {item.firstSeen}</div>
                                            <div className="threat-meta">Symptoms: {item.symptoms}</div>
                                            <div className="threat-confidence">Confidence: {item.confidence}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="panel mini-panel">
                                <div className="panel-title">Clinical & News Signals</div>
                                <div className="panel-subtitle">Symptom clusters and sources</div>
                                <div className="analysis-card">
                                    <div className="analysis-item">
                                        <div className="analysis-icon">F</div>
                                        <div>
                                            <div className="analysis-title">Dominant Symptoms</div>
                                            <p>Fever, dry cough, fatigue, shortness of breath, dehydration, joint pain.</p>
                                        </div>
                                    </div>
                                    <div className="analysis-item">
                                        <div className="analysis-icon">S</div>
                                        <div>
                                            <div className="analysis-title">Signal Confidence</div>
                                            <p>High confidence in western corridor clusters. Moderate confidence in eastern corridor based on news density.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <section className="panel feed-panel">
                            <div className="panel-title">News Signal Feed</div>
                            <div className="panel-subtitle">AI-extracted outbreak hints from media</div>
                            <div className="feed-grid">
                                {newsSignals.map((signal) => (
                                    <div key={signal.headline} className="feed-card">
                                        <div className="feed-headline">{signal.headline}</div>
                                        <div className="feed-meta">{signal.source} • {signal.location}</div>
                                        <div className="feed-tags">{signal.tags}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}
