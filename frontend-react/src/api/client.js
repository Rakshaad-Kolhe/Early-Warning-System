const API_BASE = '/api';

/**
 * POST /predict — returns prediction result with latency annotation.
 * Deterministic: same inputs → same output (no randomness at inference).
 */
export async function fetchPrediction(payload) {
    const t0 = performance.now();
    const res = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const latencyMs = Math.round(performance.now() - t0);

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Server error ${res.status}`);
    }
    const data = await res.json();
    // Attach latency for optional display / debugging
    data._latencyMs = latencyMs;
    return data;
}

export async function fetchAlerts() {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) return [];
    return res.json();
}

export async function fetchHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return null;
    return res.json();
}
