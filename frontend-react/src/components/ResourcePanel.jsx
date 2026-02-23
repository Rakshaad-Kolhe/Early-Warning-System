export default function ResourcePanel({ resources }) {
    if (!resources) return null;

    return (
        <div style={{
            background: 'var(--bg-secondary, rgba(255,255,255,0.03))',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '24px',
            marginTop: '24px'
        }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Resource Estimation Recommendation
            </h3>
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                <ResourceItem label="Field Teams" value={`+${resources.teams}`} />
                <ResourceItem label="Fogging Units" value={`+${resources.fogging_units}`} />
                <ResourceItem label="Response Time" value={resources.estimated_response_time} />
                <ResourceItem label="Protocol Template" value={resources.template} />
            </div>
        </div>
    );
}

function ResourceItem({ label, value }) {
    return (
        <div style={{
            flex: 1,
            minWidth: '130px',
            background: 'var(--bg-tertiary, rgba(0,0,0,0.25))',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
        }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                {label}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)' }}>
                {value}
            </div>
        </div>
    );
}
