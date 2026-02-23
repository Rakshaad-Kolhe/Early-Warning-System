import { motion } from 'framer-motion';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area
} from 'recharts';

// Primary: desaturated cyan; Secondary: electric blue
const COLORS = ['#00E6F2', '#4C7EFF', '#F0B429', '#FF4D6D'];

export default function RiskTrend({ alerts }) {
    if (!alerts || alerts.length < 2) {
        return (
            <div className="glass-card h-full">
                <div className="section-label">Risk Trend</div>
                <div className="flex items-center justify-center" style={{ height: '340px' }}>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', opacity: 0.6 }}>
                        Run at least 2 predictions to see trend data.
                    </p>
                </div>
            </div>
        );
    }

    const districts = [...new Set(alerts.map((a) => a.district))];
    const sorted = [...alerts].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const sliced = sorted.slice(-30);

    const chartData = sliced.map((a) => ({
        time: new Date(a.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        [a.district]: a.score,
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass-card h-full"
        >
            <div className="section-label">Risk Trend</div>

            {/* Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                {districts.map((d, i) => (
                    <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                            display: 'inline-block',
                            width: '18px',
                            height: i === 0 ? '2.5px' : '2px',
                            background: COLORS[i % COLORS.length],
                            borderRadius: '2px',
                            opacity: i === 0 ? 1 : 0.7,
                        }} />
                        <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>
                            {d}
                        </span>
                    </div>
                ))}
            </div>

            {/* Glow on primary line wrapper */}
            <div style={{ filter: 'drop-shadow(0 0 4px rgba(0,224,184,0.3))' }}>
                <ResponsiveContainer width="100%" height={340}>
                    <AreaChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                        <defs>
                            <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.15} />
                                <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        {/* Grid at 0.04 — subconscious */}
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.04)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="time"
                            tick={{ fill: 'rgba(234,246,255,0.28)', fontSize: 9 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.03)' }}
                            tickLine={false}
                            padding={{ left: 20, right: 20 }}
                        />
                        <YAxis
                            domain={[0, 100]}
                            tick={{ fill: 'rgba(234,246,255,0.28)', fontSize: 9 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.03)' }}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(5, 11, 20, 0.97)',
                                border: '1px solid rgba(0,224,184,0.10)',
                                borderRadius: 10,
                                fontSize: 11,
                                color: '#EAF6FF',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
                            }}
                            cursor={{ stroke: 'rgba(255,255,255,0.04)', strokeWidth: 1 }}
                        />
                        {districts.map((d, i) => i === 0 ? (
                            <Area
                                key={d}
                                type="monotone"
                                dataKey={d}
                                stroke={COLORS[0]}
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorPrimary)"
                                activeDot={{ r: 4.5, strokeWidth: 0, fill: COLORS[0] }}
                                dot={false}
                                connectNulls
                                animationDuration={1200}
                                animationEasing="ease-out"
                            />
                        ) : (
                            <Line
                                key={d}
                                type="monotone"
                                dataKey={d}
                                stroke={COLORS[i % COLORS.length]}
                                strokeWidth={1.5}
                                strokeOpacity={0.3}
                                activeDot={{ r: 3.5, strokeWidth: 0, fill: COLORS[i % COLORS.length] }}
                                dot={false}
                                connectNulls
                                animationDuration={1200}
                                animationEasing="ease-out"
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
