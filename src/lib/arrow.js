// A pen-drawn arrow between two points in SVG units: a curved shaft plus a two-stroke head.
// `bend` pushes the curve sideways (relative to its length); `gap` stops short of the target.
export function arrowPaths([ax, ay], [ex, ey], bend = 0.3, gap = 9) {
    const dx = ex - ax;
    const dy = ey - ay;
    const len = Math.hypot(dx, dy) || 1;
    const tx = ex - (dx / len) * gap;
    const ty = ey - (dy / len) * gap;
    const cx = (ax + tx) / 2 - dy * bend;
    const cy = (ay + ty) / 2 + dx * bend;
    const angle = Math.atan2(ty - cy, tx - cx);
    const f = (n) => n.toFixed(1);
    const head = (a) => `${f(tx - 9 * Math.cos(angle + a))},${f(ty - 9 * Math.sin(angle + a))}`;
    return {
        shaft: `M${f(ax)},${f(ay)} Q${f(cx)},${f(cy)} ${f(tx)},${f(ty)}`,
        tip: `M${head(0.5)} L${f(tx)},${f(ty)} L${head(-0.5)}`,
    };
}
