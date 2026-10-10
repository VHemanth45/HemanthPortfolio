// Shared maths for every loss curve on the page, so the hero plot and the
// scroll monitor tell the same story.

// Deterministic wobble: looks like minibatch noise but is identical on every render.
const jitter = (t, seed) =>
    Math.sin(t * 37.1 + seed) * 0.5 +
    Math.sin(t * 91.7 + seed * 2.3) * 0.3 +
    Math.sin(t * 211.3 + seed * 0.7) * 0.2;

// Starts at exactly ln(10) ≈ 2.303 — the loss of a 10-class model guessing at random.
export const trainLoss = (t) =>
    2.258 * Math.exp(-4.1 * t) + 0.045 + 0.05 * jitter(t, 1) * Math.exp(-2.2 * t) * (1 - Math.exp(-60 * t));

// Validation tracks train with a gap, plus one overfitting bump early on.
export const valLoss = (t) =>
    trainLoss(t) + 0.07 + 0.3 * Math.exp(-((t - 0.36) ** 2) / 0.0035) + 0.025 * jitter(t, 4);

export function sample(fn, n = 90) {
    return Array.from({ length: n + 1 }, (_, i) => {
        const t = i / n;
        return [t, fn(t)];
    });
}

// Log-scale y mapping (losses are plotted on log axes for a reason).
export const makeY = ({ y0, y1, min, max }) => {
    const a = Math.log10(min);
    const b = Math.log10(max);
    return (v) => y1 - ((Math.log10(Math.min(Math.max(v, min), max)) - a) / (b - a)) * (y1 - y0);
};

export const makeX = ({ x0, x1 }) => (t) => x0 + t * (x1 - x0);

export const toBox = (pts, box) => {
    const x = makeX(box);
    const y = makeY(box);
    return pts.map(([t, v]) => [x(t), y(v)]);
};

// Catmull-Rom spline through the points, emitted as cubic Béziers.
export function smoothPath(points) {
    if (points.length < 2) return '';
    const f = (n) => n.toFixed(2);
    let d = `M${f(points[0][0])},${f(points[0][1])}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;
        const c1x = p1[0] + (p2[0] - p0[0]) / 6;
        const c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6;
        const c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ` C${f(c1x)},${f(c1y)} ${f(c2x)},${f(c2y)} ${f(p2[0])},${f(p2[1])}`;
    }
    return d;
}

// The hero plot's x-axis is real time: t = 0 is July 2022 (joined IIT BHU), t = 1 is now.
export const T_START = 2022.55;
export const T_END = 2026.8;
export const tOf = (yearFraction) => (yearFraction - T_START) / (T_END - T_START);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// "Sep 2024" for a point on the time axis; the last stretch is just "Now".
export const dateOf = (t) => {
    if (t > 0.985) return 'Now';
    const y = T_START + t * (T_END - T_START);
    return `${MONTHS[Math.min(11, Math.floor((y % 1) * 12))]} ${Math.floor(y)}`;
};

// The hero plot's geometry (a 600×440 viewBox), shared with the agents that ride its curves.
export const HERO = { W: 600, H: 440, BOX: { x0: 58, x1: 572, y0: 30, y1: 372, min: 0.03, max: 3 } };
export const heroX = makeX(HERO.BOX);
export const heroY = makeY(HERO.BOX);
