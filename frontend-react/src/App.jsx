import { useState, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const GEO_URL = "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson";

// ── City data with state assignments ─────────────────────────────────────────
const CITIES = [
  { name: 'Delhi', state: 'Delhi', level: 'high', coordinates: [77.209, 28.614], spark: '0,18 12,14 24,12 36,10 48,8 60,6' },
  { name: 'Mumbai', state: 'Maharashtra', level: 'high', coordinates: [72.878, 19.076], spark: '0,16 12,12 24,10 36,8 48,9 60,6' },
  { name: 'Kolkata', state: 'West Bengal', level: 'medium', coordinates: [88.364, 22.573], spark: '0,14 12,12 24,12 36,10 48,9 60,9' },
  { name: 'Chennai', state: 'Tamil Nadu', level: 'high', coordinates: [80.271, 13.083], spark: '0,18 12,16 24,12 36,10 48,9 60,8' },
  { name: 'Bengaluru', state: 'Karnataka', level: 'medium', coordinates: [77.595, 12.972], spark: '0,14 12,13 24,12 36,11 48,10 60,9' },
  { name: 'Hyderabad', state: 'Telangana', level: 'high', coordinates: [78.487, 17.385], spark: '0,15 12,13 24,11 36,10 48,8 60,7' },
  { name: 'Pune', state: 'Maharashtra', level: 'medium', coordinates: [73.857, 18.520], spark: '0,12 12,11 24,10 36,9 48,9 60,8' },
  { name: 'Ahmedabad', state: 'Gujarat', level: 'medium', coordinates: [72.571, 23.023], spark: '0,13 12,12 24,11 36,11 48,10 60,9' },
  { name: 'Jaipur', state: 'Rajasthan', level: 'medium', coordinates: [75.787, 26.912], spark: '0,12 12,12 24,11 36,10 48,10 60,9' },
  { name: 'Lucknow', state: 'Uttar Pradesh', level: 'high', coordinates: [80.946, 26.847], spark: '0,16 12,14 24,12 36,10 48,9 60,8' },
  { name: 'Surat', state: 'Gujarat', level: 'medium', coordinates: [72.831, 21.170], spark: '0,12 12,11 24,10 36,10 48,9 60,9' },
  { name: 'Kanpur', state: 'Uttar Pradesh', level: 'medium', coordinates: [80.332, 26.450], spark: '0,13 12,12 24,11 36,10 48,9 60,9' },
  { name: 'Nagpur', state: 'Maharashtra', level: 'high', coordinates: [79.088, 21.146], spark: '0,15 12,14 24,12 36,10 48,9 60,8' },
  { name: 'Indore', state: 'Madhya Pradesh', level: 'medium', coordinates: [75.858, 22.720], spark: '0,12 12,12 24,11 36,10 48,10 60,9' },
  { name: 'Bhopal', state: 'Madhya Pradesh', level: 'medium', coordinates: [77.413, 23.260], spark: '0,12 12,11 24,11 36,10 48,9 60,9' },
  { name: 'Patna', state: 'Bihar', level: 'high', coordinates: [85.138, 25.594], spark: '0,15 12,14 24,12 36,11 48,10 60,9' },
  { name: 'Ranchi', state: 'Jharkhand', level: 'medium', coordinates: [85.310, 23.344], spark: '0,12 12,12 24,11 36,10 48,10 60,9' },
  { name: 'Guwahati', state: 'Assam', level: 'medium', coordinates: [91.736, 26.145], spark: '0,12 12,12 24,11 36,10 48,10 60,9' },
  { name: 'Kochi', state: 'Kerala', level: 'medium', coordinates: [76.267, 9.931], spark: '0,11 12,11 24,10 36,10 48,9 60,9' },
  { name: 'Thiruvananthapuram', state: 'Kerala', level: 'low', coordinates: [76.937, 8.524], spark: '0,10 12,10 24,9 36,9 48,8 60,8' },
  { name: 'Chandigarh', state: 'Chandigarh', level: 'low', coordinates: [76.779, 30.733], spark: '0,10 12,10 24,9 36,9 48,8 60,8' },
  { name: 'Ludhiana', state: 'Punjab', level: 'medium', coordinates: [75.857, 30.901], spark: '0,11 12,11 24,10 36,10 48,9 60,9' },
  { name: 'Vadodara', state: 'Gujarat', level: 'medium', coordinates: [73.208, 22.307], spark: '0,11 12,11 24,10 36,10 48,9 60,9' },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', level: 'medium', coordinates: [83.219, 17.687], spark: '0,12 12,11 24,11 36,10 48,9 60,9' },
  { name: 'Coimbatore', state: 'Tamil Nadu', level: 'low', coordinates: [76.956, 11.017], spark: '0,10 12,10 24,9 36,9 48,8 60,8' },
  { name: 'Agra', state: 'Uttar Pradesh', level: 'medium', coordinates: [78.008, 27.177], spark: '0,12 12,11 24,11 36,10 48,9 60,9' },
  { name: 'Nashik', state: 'Maharashtra', level: 'medium', coordinates: [73.790, 19.998], spark: '0,11 12,11 24,10 36,10 48,9 60,9' },
  { name: 'Madurai', state: 'Tamil Nadu', level: 'low', coordinates: [78.120, 9.925], spark: '0,10 12,10 24,9 36,9 48,8 60,8' },
  { name: 'Varanasi', state: 'Uttar Pradesh', level: 'medium', coordinates: [82.974, 25.318], spark: '0,12 12,11 24,11 36,10 48,9 60,9' },
  { name: 'Mysuru', state: 'Karnataka', level: 'low', coordinates: [76.639, 12.296], spark: '0,10 12,10 24,9 36,9 48,8 60,8' },
];

// ── Per-state health data ─────────────────────────────────────────────────────
const STATE_DATA = {
  'Maharashtra': { risk: 'high', cases: 4821, trend: '+12%', hospitals: 340, beds: 18400, r0: 1.34, alert: 'Surge in respiratory illness across Mumbai and Pune corridors.' },
  'Delhi': { risk: 'high', cases: 3102, trend: '+18%', hospitals: 89, beds: 9200, r0: 1.51, alert: 'Travel hub screening elevated. Dense urban spread risk high.' },
  'Uttar Pradesh': { risk: 'high', cases: 5540, trend: '+9%', hospitals: 520, beds: 22100, r0: 1.28, alert: 'Rural-urban spread detected across Lucknow and Kanpur belts.' },
  'Tamil Nadu': { risk: 'high', cases: 2870, trend: '+14%', hospitals: 210, beds: 11300, r0: 1.41, alert: 'Port cities showing elevated gastroenteritis signals.' },
  'Telangana': { risk: 'high', cases: 2310, trend: '+11%', hospitals: 145, beds: 8700, r0: 1.29, alert: 'Febrile rash cluster detected near Hyderabad outskirts.' },
  'Bihar': { risk: 'high', cases: 3780, trend: '+7%', hospitals: 180, beds: 7400, r0: 1.19, alert: 'Low testing coverage likely masking true case load.' },
  'West Bengal': { risk: 'medium', cases: 1920, trend: '+5%', hospitals: 198, beds: 9800, r0: 1.11, alert: 'Stable trend. Monitor eastern corridor closely.' },
  'Karnataka': { risk: 'medium', cases: 1640, trend: '+3%', hospitals: 178, beds: 8900, r0: 1.08, alert: 'Bengaluru tech clusters showing mild symptom uptick.' },
  'Gujarat': { risk: 'medium', cases: 1480, trend: '+6%', hospitals: 215, beds: 10200, r0: 1.14, alert: 'Industrial zones flagged for dehydration spikes.' },
  'Rajasthan': { risk: 'medium', cases: 1320, trend: '+4%', hospitals: 188, beds: 8100, r0: 1.09, alert: 'Desert climate moderating transmission rates.' },
  'Madhya Pradesh': { risk: 'medium', cases: 1710, trend: '+8%', hospitals: 210, beds: 9400, r0: 1.21, alert: 'Central corridor showing slow spread. Monitor Indore closely.' },
  'Andhra Pradesh': { risk: 'medium', cases: 1290, trend: '+5%', hospitals: 167, beds: 7800, r0: 1.12, alert: 'Coastal districts elevated. Visakhapatnam watch.' },
  'Jharkhand': { risk: 'medium', cases: 980, trend: '+4%', hospitals: 98, beds: 4200, r0: 1.07, alert: 'Mining communities flagged for respiratory illness.' },
  'Assam': { risk: 'medium', cases: 870, trend: '+3%', hospitals: 112, beds: 4800, r0: 1.05, alert: 'Northeast corridor stable.' },
  'Kerala': { risk: 'medium', cases: 920, trend: '+2%', hospitals: 134, beds: 6100, r0: 1.04, alert: 'Strong healthcare infrastructure containing spread.' },
  'Punjab': { risk: 'medium', cases: 760, trend: '+4%', hospitals: 98, beds: 4400, r0: 1.08, alert: 'Cross-border movement elevated risk slightly.' },
  'Odisha': { risk: 'medium', cases: 1050, trend: '+3%', hospitals: 142, beds: 5900, r0: 1.06, alert: 'Coastal flooding risk compounding health concerns.' },
  'Chhattisgarh': { risk: 'medium', cases: 890, trend: '+5%', hospitals: 108, beds: 4100, r0: 1.10, alert: 'Remote areas with limited case reporting.' },
  'Haryana': { risk: 'medium', cases: 980, trend: '+6%', hospitals: 112, beds: 5200, r0: 1.13, alert: 'NCR spillover driving case numbers upward.' },
  'Chandigarh': { risk: 'low', cases: 210, trend: '+1%', hospitals: 18, beds: 1200, r0: 0.98, alert: 'Below threshold. Maintain routine surveillance.' },
  'Uttarakhand': { risk: 'low', cases: 340, trend: '+2%', hospitals: 68, beds: 2800, r0: 1.01, alert: 'Mountain terrain limiting community spread.' },
  'Himachal Pradesh': { risk: 'low', cases: 210, trend: '+1%', hospitals: 52, beds: 2100, r0: 0.97, alert: 'Low transmission environment sustained.' },
  'Goa': { risk: 'low', cases: 180, trend: '-1%', hospitals: 28, beds: 1400, r0: 0.94, alert: 'Tourism season watch — imported cases possible.' },
  'Tripura': { risk: 'low', cases: 290, trend: '+2%', hospitals: 42, beds: 1800, r0: 1.02, alert: 'Northeast region maintaining low burden.' },
  'Meghalaya': { risk: 'low', cases: 190, trend: '+1%', hospitals: 34, beds: 1400, r0: 0.99, alert: 'Low and stable. No significant signals.' },
};

const DEFAULT_STATE_DATA = {
  risk: 'low', cases: 150, trend: '+1%', hospitals: 30, beds: 1200, r0: 0.96,
  alert: 'No significant signals detected. Routine surveillance ongoing.'
};

const LEVEL_COLOR = { high: '#f87171', medium: '#fb923c', low: '#4ade80' };
const RISK_FILL = { high: 'rgba(248,113,113,0.20)', medium: 'rgba(251,146,60,0.16)', low: 'rgba(74,222,128,0.10)' };
const RISK_STROKE = { high: 'rgba(248,113,113,0.65)', medium: 'rgba(251,146,60,0.60)', low: 'rgba(74,222,128,0.45)' };
const RISK_COLOR = { high: '#f87171', medium: '#fb923c', low: '#4ade80' };

const STATE_CENTERS = {
  'Delhi': [77.1, 28.65], 'Maharashtra': [76.5, 19.5], 'Uttar Pradesh': [81.0, 27.0],
  'Tamil Nadu': [78.5, 11.0], 'Telangana': [79.0, 17.8], 'Bihar': [85.5, 25.6],
  'West Bengal': [87.8, 23.0], 'Karnataka': [76.5, 15.0], 'Gujarat': [72.0, 22.5],
  'Rajasthan': [74.0, 26.5], 'Madhya Pradesh': [78.5, 23.5], 'Andhra Pradesh': [80.0, 16.0],
  'Jharkhand': [85.5, 23.5], 'Assam': [92.5, 26.2], 'Kerala': [76.5, 10.5],
  'Punjab': [75.5, 31.0], 'Odisha': [84.5, 20.5], 'Chhattisgarh': [81.5, 21.5],
  'Haryana': [76.5, 29.0], 'Uttarakhand': [79.5, 30.0], 'Himachal Pradesh': [77.5, 31.8],
  'Goa': [74.1, 15.3], 'Tripura': [91.9, 23.8], 'Meghalaya': [91.4, 25.5],
  'Chandigarh': [76.8, 30.7],
};

const SMALL_STATES = new Set(['Delhi', 'Goa', 'Chandigarh', 'Puducherry', 'Daman and Diu', 'Lakshadweep', 'Dadra and Nagar Haveli']);

function getStateRisk(name) {
  return (STATE_DATA[name] || DEFAULT_STATE_DATA).risk;
}

function Spark({ points, color }) {
  return (
    <svg viewBox="0 0 60 20" style={{ width: 60, height: 20, flexShrink: 0 }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── State detail overlay ──────────────────────────────────────────────────────
function StatePanel({ stateName, onClose }) {
  const data = STATE_DATA[stateName] || DEFAULT_STATE_DATA;
  const risk = data.risk;
  const accent = RISK_COLOR[risk];
  const stateCities = CITIES.filter(c => c.state === stateName);

  const center = STATE_CENTERS[stateName] || [82, 22];
  const scale = SMALL_STATES.has(stateName) ? 5500 : 1900;

  const weekBars = [
    { label: 'W−3', pct: 52 }, { label: 'W−2', pct: 67 }, { label: 'W−1', pct: 79 },
    { label: 'Now', pct: data.cases > 3000 ? 96 : data.cases > 1500 ? 81 : 58 },
  ];
  const maxPct = Math.max(...weekBars.map(b => b.pct));

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(4,10,22,0.80)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        animation: 'panelFade 0.22s cubic-bezier(.16,1,.3,1)',
      }}
    >
      <style>{`
        @keyframes panelFade {
          from { opacity:0; transform:scale(0.96) translateY(8px); }
          to   { opacity:1; transform:scale(1)    translateY(0); }
        }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(120,160,220,0.2); border-radius:2px; }
      `}</style>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg,#0c1829 0%,#091422 60%,#0e1f36 100%)',
          border: `1px solid ${accent}33`,
          borderRadius: 18,
          width: '100%', maxWidth: 860,
          maxHeight: '92vh', overflowY: 'auto',
          boxShadow: `0 0 80px ${accent}18, 0 32px 100px rgba(0,0,0,0.75)`,
        }}
      >
        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '26px 30px 22px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          position: 'sticky', top: 0, zIndex: 10,
          background: 'linear-gradient(145deg,#0c1829,#091422)',
        }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: accent, marginBottom: 7, fontWeight: 700 }}>
              State Outbreak Profile · Live
            </div>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#e4eeff', letterSpacing: '-0.025em' }}>
              {stateName}
            </h2>
            <div style={{ marginTop: 10, display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {[
                { text: `${risk.toUpperCase()} RISK`, bg: `${accent}20`, border: `${accent}50`, color: accent },
                { text: `R₀ ${data.r0}`, bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', color: 'rgba(190,210,245,0.8)' },
                { text: `Trend ${data.trend}`, bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', color: 'rgba(190,210,245,0.8)' },
              ].map(b => (
                <span key={b.text} style={{
                  background: b.bg, border: `1px solid ${b.border}`, borderRadius: 20,
                  padding: '4px 13px', fontSize: 10.5, color: b.color, fontWeight: 700, letterSpacing: '0.07em'
                }}>{b.text}</span>
              ))}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 9, color: 'rgba(180,205,240,0.7)', cursor: 'pointer',
            width: 36, height: 36, fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>✕</button>
        </div>

        {/* ── Alert banner ── */}
        <div style={{
          margin: '18px 30px 0',
          background: `${accent}0e`, border: `1px solid ${accent}28`,
          borderRadius: 10, padding: '11px 16px',
          fontSize: 12.5, color: 'rgba(215,228,255,0.82)', lineHeight: 1.65,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <span style={{ color: accent, fontSize: 15, flexShrink: 0, marginTop: 1 }}>⚠</span>
          {data.alert}
        </div>

        {/* ── Two-column main grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: '16px 30px' }}>

          {/* Left: zoomed state map — spans 2 rows */}
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 13, padding: '16px', gridRow: 'span 2',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(150,180,225,0.55)', marginBottom: 12, fontWeight: 700 }}>
              State Map · City Heatmap
            </div>
            <div style={{ borderRadius: 8, overflow: 'hidden', background: 'rgba(8,16,34,0.7)', flex: 1 }}>
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale, center }}
                width={340} height={330}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              >
                <Geographies geography={GEO_URL}>
                  {({ geographies }) => geographies.map(geo => {
                    const gName = geo.properties.ST_NM;
                    const isSel = gName === stateName;
                    const gRisk = getStateRisk(gName);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isSel ? RISK_FILL[gRisk] : 'rgba(255,255,255,0.02)'}
                        stroke={isSel ? RISK_STROKE[gRisk] : 'rgba(255,255,255,0.07)'}
                        strokeWidth={isSel ? 1.4 : 0.4}
                        strokeDasharray={isSel ? '0' : '3 2'}
                        style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }}
                      />
                    );
                  })}
                </Geographies>
                {stateCities.map(city => (
                  <Marker key={city.name} coordinates={city.coordinates}>
                    <circle r={8} fill={LEVEL_COLOR[city.level]} opacity={0.18} />
                    <circle r={4.5} fill={LEVEL_COLOR[city.level]} opacity={0.95} />
                    <text textAnchor="middle" y={-11}
                      style={{ fontSize: 7, fill: 'rgba(215,232,255,0.92)', fontFamily: 'sans-serif', pointerEvents: 'none', fontWeight: 600 }}>
                      {city.name}
                    </text>
                  </Marker>
                ))}
              </ComposableMap>
            </div>
            {/* dot legend */}
            <div style={{ display: 'flex', gap: 16, marginTop: 11, justifyContent: 'center' }}>
              {['high', 'medium', 'low'].map(l => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'rgba(160,185,225,0.65)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: LEVEL_COLOR[l] }} />
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </div>
              ))}
            </div>
            {stateCities.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: 'rgba(140,170,215,0.35)' }}>
                No tracked cities in this state
              </div>
            )}
          </div>

          {/* Right top: metric cards */}
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 13, padding: 16,
          }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(150,180,225,0.55)', marginBottom: 14, fontWeight: 700 }}>
              Key Metrics
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Active Cases', value: data.cases.toLocaleString(), sub: data.trend + ' this week', color: accent },
                { label: 'Reproduction (R₀)', value: data.r0, sub: data.r0 > 1 ? 'Growing' : 'Contained', color: data.r0 > 1 ? '#f87171' : '#4ade80' },
                { label: 'Hospitals', value: data.hospitals, sub: 'Reporting facilities', color: '#60a5fa' },
                { label: 'Bed Capacity', value: data.beds.toLocaleString(), sub: 'Total available beds', color: '#a78bfa' },
              ].map(m => (
                <div key={m.label} style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 9, padding: '12px 14px',
                }}>
                  <div style={{ fontSize: 9.5, color: 'rgba(140,170,215,0.55)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 5 }}>{m.label}</div>
                  <div style={{ fontSize: 23, fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.value}</div>
                  <div style={{ fontSize: 9.5, color: 'rgba(140,170,215,0.45)', marginTop: 5 }}>{m.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right bottom: 4-week bar chart */}
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 13, padding: 16,
          }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(150,180,225,0.55)', marginBottom: 14, fontWeight: 700 }}>
              4-Week Transmission Index
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 88 }}>
              {weekBars.map((b, i) => {
                const isNow = i === weekBars.length - 1;
                return (
                  <div key={b.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 9, color: 'rgba(140,170,215,0.5)', fontWeight: isNow ? 700 : 400 }}>{b.pct}%</div>
                    <div style={{
                      width: '100%', borderRadius: '3px 3px 0 0',
                      height: `${(b.pct / maxPct) * 62}px`,
                      background: isNow
                        ? `linear-gradient(to top, ${accent}, ${accent}88)`
                        : 'rgba(100,140,200,0.22)',
                      border: isNow ? `1px solid ${accent}55` : '1px solid transparent',
                    }} />
                    <div style={{ fontSize: 9, color: isNow ? accent : 'rgba(140,170,215,0.5)', fontWeight: isNow ? 700 : 400 }}>{b.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── City breakdown ── */}
        {stateCities.length > 0 && (
          <div style={{ padding: '0 30px 26px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 13, padding: 16,
            }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(150,180,225,0.55)', marginBottom: 14, fontWeight: 700 }}>
                City Signal Breakdown — {stateCities.length} tracked {stateCities.length === 1 ? 'city' : 'cities'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {stateCities.map(city => (
                  <div key={city.name} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: 'rgba(255,255,255,0.03)', border: `1px solid ${LEVEL_COLOR[city.level]}1e`,
                    borderRadius: 9, padding: '10px 15px',
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: LEVEL_COLOR[city.level], flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: 13.5, color: '#c4d6f0', fontWeight: 600 }}>{city.name}</div>
                    <span style={{
                      background: `${LEVEL_COLOR[city.level]}16`, border: `1px solid ${LEVEL_COLOR[city.level]}40`,
                      borderRadius: 12, padding: '2px 11px', fontSize: 9.5,
                      color: LEVEL_COLOR[city.level], fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', flexShrink: 0,
                    }}>{city.level}</span>
                    <Spark points={city.spark} color={LEVEL_COLOR[city.level]} />
                    <div style={{ fontSize: 9.5, color: 'rgba(130,165,215,0.4)', flexShrink: 0, textAlign: 'right' }}>
                      {city.coordinates[1].toFixed(2)}°N&nbsp;{city.coordinates[0].toFixed(2)}°E
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedState, setSelectedState] = useState(null);

  const interventions = [
    { name: 'Mosquito control drive', action: 'Immediate fogging & larva check', priority: 'Critical', confidence: '89%' },
    { name: 'Pre-position IV Fluids', action: 'Stockpile ORS and med supplies', priority: 'Elevated', confidence: '74%' },
    { name: 'Deploy Rapid Response', action: 'Dispatch medical teams to zones', priority: 'Critical', confidence: '92%' },
  ];

  const newsSignals = [
    { headline: 'Local hospitals report surge in flu-like admissions', source: 'National Health Desk', location: 'Mumbai', tags: 'fever, cough' },
    { headline: 'School closures in response to cluster of rash cases', source: 'City Gazette', location: 'Jaipur', tags: 'rash, joint pain' },
    { headline: 'Emergency wards see dehydration spike', source: 'Regional Newswire', location: 'Chennai', tags: 'vomiting, diarrhea' },
    { headline: 'Travel hub flags new respiratory screenings', source: 'Airport Health Unit', location: 'Delhi', tags: 'fever, shortness of breath' },
    { headline: 'Rural clinics report rising febrile illness', source: 'Public Health Watch', location: 'Patna', tags: 'fever, chills' },
    { headline: 'Pharmacy demand spikes for antipyretics', source: 'Supply Chain Monitor', location: 'Bengaluru', tags: 'fever, fatigue' },
  ];

  const handleStateClick = useCallback((geo) => {
    setSelectedState(geo.properties.ST_NM);
  }, []);

  return (
    <div className="app-shell">
      <div className="app-frame">
        <header className="app-header">
          <div>
            <div className="app-kicker">AI Outbreak Predictor</div>
            <h1 className="app-title">District Risk Dashboard</h1>
            <div className="app-meta">Last updated: 2026-02-24 11:30 IST • Sources: Government health portals, Open climate APIs, Kaggle/WHO datasets</div>
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
              <div className="range-row"><input type="range" min="0" max="8" defaultValue="2" /><div className="range-value">2k</div></div>
            </div>
            <div className="form-block">
              <label className="label">Testing Coverage</label>
              <div className="select">Medium - Targeted screening</div>
            </div>
            <div className="form-block">
              <label className="label">Hospital Capacity</label>
              <div className="range-row"><input type="range" min="0" max="10" defaultValue="4" /><div className="range-value">4k beds</div></div>
            </div>
            <div className="form-block">
              <label className="label">Mobility Level</label>
              <div className="range-row"><input type="range" min="0" max="10" defaultValue="6" /><div className="range-value">High</div></div>
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
            {/* Trajectory chart */}
            <section className="panel chart-panel">
              <div className="panel-header">
                <div>
                  <div className="panel-title">Short-Term Risk Prediction</div>
                  <div className="panel-subtitle">Trend-based reasoning and confidence intervals</div>
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
                    {Array.from({ length: 7 }).map((_, i) => <line key={`h${i}`} x1="40" y1={40 + i * 40} x2="820" y2={40 + i * 40} />)}
                    {Array.from({ length: 10 }).map((_, i) => <line key={`v${i}`} x1={40 + i * 80} y1="40" x2={40 + i * 80} y2="280" />)}
                  </g>
                  <polyline className="chart-line aqua" points="40,260 120,235 200,215 280,200 360,180 440,165 520,150 600,135 680,125 760,115 820,110" />
                  <polyline className="chart-line pink" points="40,260 120,210 200,185 280,165 360,150 440,135 520,125 600,115 680,105 760,95 820,88" />
                  <polyline className="chart-line gold" points="40,260 120,225 200,200 280,180 360,165 440,150 520,135 600,125 680,115 760,100 820,92" />
                  <polyline className="chart-line white dotted" points="40,260 120,258 200,257 280,256 360,255 440,254 520,253 600,252 680,251 760,250 820,249" />
                </svg>
                <div className="chart-axis">
                  <span>W0</span><span>W8</span><span>W16</span><span>W24</span><span>W32</span><span>W36</span>
                </div>
              </div>
            </section>

            <div className="card-grid">
              {/* India map */}
              <section className="panel mini-panel map-panel-wide">
                <div className="panel-title">District Risk Dashboard (Map View)</div>
                <div className="panel-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Risk scores (Low/Medium/High) & climate overlays
                  <span style={{ color: 'rgba(100,165,255,0.65)', fontSize: 11, fontStyle: 'italic' }}>
                    · click any district to drill down
                  </span>
                </div>
                <div className="heatmap">
                  <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{ scale: 1000, center: [82, 23] }}
                    width={500} height={600}
                    style={{ width: '100%', height: 'auto' }}
                  >
                    <Geographies geography={GEO_URL}>
                      {({ geographies }) => geographies.map(geo => {
                        const name = geo.properties.ST_NM;
                        const risk = getStateRisk(name);
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onClick={() => handleStateClick(geo)}
                            fill={RISK_FILL[risk]}
                            stroke="rgba(130,175,255,0.50)"
                            strokeWidth={0.5}
                            strokeDasharray="3 2"
                            style={{
                              default: { outline: 'none', cursor: 'pointer' },
                              hover: { fill: `${RISK_COLOR[risk]}30`, stroke: RISK_COLOR[risk], strokeWidth: 1.2, strokeDasharray: '0', outline: 'none', cursor: 'pointer' },
                              pressed: { outline: 'none' },
                            }}
                          />
                        );
                      })}
                    </Geographies>
                    {CITIES.map(city => (
                      <Marker key={city.name} coordinates={city.coordinates}>
                        <circle r={7} fill={LEVEL_COLOR[city.level]} opacity={0.15} style={{ pointerEvents: 'none' }} />
                        <circle r={3.8} fill={LEVEL_COLOR[city.level]} opacity={0.92} style={{ pointerEvents: 'none' }} />
                        <text textAnchor="middle" y={-9}
                          style={{ fontSize: '5px', fill: 'rgba(215,232,255,0.85)', fontFamily: 'sans-serif', pointerEvents: 'none' }}>
                          {city.name}
                        </text>
                      </Marker>
                    ))}
                  </ComposableMap>

                  {/* Risk legend */}
                  <div className="heatmap-legend" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {['high', 'medium', 'low'].map(l => (
                      <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(175,200,235,0.7)' }}>
                        <span style={{ width: 11, height: 11, borderRadius: 3, background: RISK_FILL[l], border: `1px solid ${RISK_COLOR[l]}55`, display: 'inline-block' }} />
                        {l.charAt(0).toUpperCase() + l.slice(1)} risk
                      </span>
                    ))}
                  </div>

                  <div className="heatmap-cities">
                    {CITIES.map(city => (
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
                <div className="panel-title">Intervention Panel</div>
                <div className="panel-subtitle">Suggested preventive actions based on risk</div>
                <div className="threat-list">
                  {interventions.map(item => (
                    <div key={item.name} className="threat-card" style={{ borderLeft: `3px solid ${item.priority === 'Critical' ? '#f87171' : '#fb923c'}` }}>
                      <div className="threat-name">{item.name}</div>
                      <div className="threat-meta">Action: {item.action}</div>
                      <div className="threat-meta">Resource Prioritization: {item.priority}</div>
                      <div className="threat-confidence">Confidence Level: {item.confidence}</div>
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
                {newsSignals.map(s => (
                  <div key={s.headline} className="feed-card">
                    <div className="feed-headline">{s.headline}</div>
                    <div className="feed-meta">{s.source} • {s.location}</div>
                    <div className="feed-tags">{s.tags}</div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>

      {selectedState && (
        <StatePanel stateName={selectedState} onClose={() => setSelectedState(null)} />
      )}
    </div>
  );
}