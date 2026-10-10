import { useEffect, useRef } from 'react';
import { HERO, heroX, heroY, trainLoss, valLoss } from '../../lib/curve';
import { herd, useHerdEnabled } from '../../lib/herd';
import { Sprite } from './Sprites';

// The herd: Claude and Codex live on this page. Until you move, they ride the hero plot —
// Claude on the train curve, Codex on validation. Move the cursor and they follow it; stop and
// they wander and think; leave the window and they go back to the plot. On touch screens they
// ride the plot and come to your finger when you drag across it.
//
// Positions are in page coordinates on a layer the size of the document, so the plot and the
// agents riding it scroll together. One rAF loop writes transforms straight to the DOM.

const IDS = ['claude', 'codex'];
const RIDE = {
    claude: { curve: trainLoss, lap: 16, start: 0.08 }, // seconds per lap
    codex: { curve: valLoss, lap: 21, start: 0 },
};
// Share of the limit spent per pixel travelled, and per second while riding or thinking.
const BURN = { claude: { px: 0.0021, s: 0.12 }, codex: { px: 0.0016, s: 0.08 } };
const MAX_SPEED = 2600;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const PREFIX = { claude: '✻ ', codex: '› ' };

// They pop in once the hero curves have drawn themselves (~2.3 s after load); later mounts are instant.
const APPEAR_AT = performance.now() + 2300;

export default function Herd() {
    const enabled = useHerdEnabled();
    const layer = useRef(null);
    const els = useRef({ claude: {}, codex: {} });

    useEffect(() => {
        if (!enabled) return undefined;
        const E = els.current;
        const plot = document.querySelector('[data-herd-home]');
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const appearAt = APPEAR_AT;

        let W = layer.current.clientWidth;
        let H = layer.current.clientHeight;
        let measured = 0;

        // A point on an agent's curve, in page coordinates, plus the slope there.
        const ridePoint = (id, u) => {
            if (!plot) return { x: 40, y: window.scrollY + window.innerHeight - 40, slope: 0 };
            const r = plot.getBoundingClientRect();
            const s = r.width / HERO.W;
            const f = RIDE[id].curve;
            const t = clamp(u, 0, 1);
            const t1 = clamp(t - 0.03, 0, 0.94);
            const t2 = t1 + 0.06;
            const slope = Math.atan2(heroY(f(t2)) - heroY(f(t1)), heroX(t2) - heroX(t1));
            return { x: r.left + window.scrollX + heroX(t) * s, y: r.top + window.scrollY + heroY(f(t)) * s, slope };
        };

        const A = {};
        for (const id of IDS) {
            const p = ridePoint(id, reduce ? (id === 'claude' ? 1 : 0.96) : RIDE[id].start);
            A[id] = {
                id,
                x: p.x,
                y: p.y,
                vx: 0,
                vy: 0,
                u: RIDE[id].start,
                rest: 0,
                locked: true,
                angle: 0,
                dir: [1, 0],
                wander: null,
                sayUntil: 0,
                sayFree: 0,
                queued: null,
                on: null,
                walk: null,
                edge: null,
                look: null,
                blocked: false,
                burn: 0,
            };
        }

        const setOn = (id, on) => {
            if (A[id].on === on) return;
            A[id].on = on;
            E[id].root.dataset.on = on ? '1' : '0';
            E[id].say.dataset.on = on ? '1' : '0';
        };

        const place = (id, rot = 0, sx = 1, sy = 1) => {
            const a = A[id];
            const at = `translate3d(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px, 0)`;
            E[id].root.style.transform = at;
            E[id].say.style.transform = at;
            E[id].body.style.transform = `translateX(-50%) rotate(${rot.toFixed(2)}deg) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
        };

        // Reduced motion: the agents sit at the end of their curves and stay there.
        if (reduce) {
            const settle = () => {
                for (const id of IDS) {
                    const p = ridePoint(id, id === 'claude' ? 1 : 0.96);
                    Object.assign(A[id], { x: p.x, y: p.y });
                    place(id);
                    setOn(id, true);
                }
            };
            settle();
            herd.status('claude', 'idle', 'Resting at the end of the curve');
            herd.status('codex', 'idle', 'Resting at the end of the curve');
            // The plot moves when web fonts swap in or anything above it reflows, not only on resize.
            const ro = new ResizeObserver(settle);
            ro.observe(document.body);
            if (plot) ro.observe(plot);
            document.fonts?.ready.then(settle);
            window.addEventListener('resize', settle);
            return () => {
                ro.disconnect();
                window.removeEventListener('resize', settle);
            };
        }

        const say = (id, text, ms = 2400) => {
            const a = A[id];
            const now = performance.now();
            if (now < a.sayFree) {
                a.queued = { text, ms };
                return;
            }
            E[id].bubble.textContent = PREFIX[id] + text;
            E[id].say.dataset.say = '1';
            a.sayUntil = now + ms;
            a.sayFree = now + 650;
            a.queued = null;
        };

        // Pointer state, in client coordinates.
        const P = { x: 0, y: 0, last: -1e9, seen: false, inside: false, down: false, el: null };
        const onMove = (e) => {
            if (e.pointerType === 'touch' && !P.down) return;
            P.x = e.clientX;
            P.y = e.clientY;
            P.last = performance.now();
            P.inside = true;
            P.el = e.target;
            if (!P.seen && e.pointerType !== 'touch') {
                P.seen = true;
                herd.activate();
            }
        };
        const onDown = (e) => {
            if (e.pointerType === 'mouse' || !e.target.closest?.('[data-herd-home]')) return;
            P.down = true;
            onMove(e);
        };
        const onUp = () => {
            if (!P.down) return;
            P.down = false;
            P.last = performance.now();
        };
        const onOut = (e) => {
            if (!e.relatedTarget) P.inside = false;
        };
        const onBlur = () => {
            P.inside = false;
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerdown', onDown, { passive: true });
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
        document.addEventListener('pointerout', onOut);
        window.addEventListener('blur', onBlur);

        let mode = 'home';
        let modeSince = performance.now();
        let label = null;
        let host = null;
        let lastEl = null;
        let greeted = false;
        let flushAt = 0;
        let codexBelow = false;
        const seen = new Set();
        const later = []; // [{ at, fn }]

        const statusFor = (id) => {
            if (mode === 'home') return ['working', id === 'claude' ? 'Riding the train curve' : 'Riding the val curve'];
            if (mode === 'idle') return ['idle', id === 'claude' ? 'Thinking' : 'Waiting for input'];
            if (id === 'claude' || A.claude.blocked) return ['working', id === 'claude' && label ? `Reading ${label}` : 'Following you'];
            return ['working', 'Following Claude'];
        };

        const onHost = (h) => {
            if (!h) return;
            const l = h.dataset.herd;
            if (!seen.has(l)) {
                seen.add(l);
                herd.read('claude', 5000 + l.length * 700);
                herd.read('codex', 3000 + l.length * 350);
            }
            if (!A.claude.blocked) say('claude', h.dataset.herdSay || `Reading ${l}…`);
            if (h.dataset.herdCodex && !A.codex.blocked) {
                const line = h.dataset.herdCodex;
                later.push({ at: performance.now() + 900, fn: () => say('codex', line) });
            }
        };

        let raf = 0;
        let prev = performance.now();
        let sx0 = window.scrollX;
        let sy0 = window.scrollY;

        const frame = (now) => {
            raf = requestAnimationFrame(frame);
            const dt = Math.min(0.033, (now - prev) / 1000);
            prev = now;

            if (now - measured > 600) {
                measured = now;
                W = layer.current.clientWidth;
                H = layer.current.clientHeight;
            }

            for (let i = later.length - 1; i >= 0; i--) {
                if (now >= later[i].at) {
                    later[i].fn();
                    later.splice(i, 1);
                }
            }

            // What mode is the herd in?
            let next;
            if (fine) next = !P.seen || !P.inside ? 'home' : now - P.last > 2600 ? 'idle' : 'follow';
            else next = P.down || now - P.last < 1800 ? 'follow' : 'home';
            if (next !== mode) {
                const was = mode;
                mode = next;
                modeSince = now;
                if (mode === 'follow' && !greeted) {
                    greeted = true;
                    say('claude', 'Hi! I’m Claude.', 2200);
                    A.claude.sayFree = now + 2000;
                    later.push({ at: now + 1100, fn: () => say('codex', '…and I’m Codex.', 2200) });
                }
                if (mode === 'home') for (const id of IDS) A[id].locked = false;
                if (mode === 'idle' || was === 'idle') for (const id of IDS) A[id].wander = null;
                if (mode === 'idle') {
                    const since = modeSince;
                    const still = () => mode === 'idle' && modeSince === since;
                    later.push({ at: now + 1400, fn: () => still() && !A.claude.blocked && say('claude', 'Thinking…', 2600) });
                    later.push({ at: now + 5200, fn: () => still() && !A.codex.blocked && say('codex', 'Waiting for input', 2400) });
                }
            }

            // Off the plot, the agents keep their place on screen while the page scrolls.
            const dsx = window.scrollX - sx0;
            const dsy = window.scrollY - sy0;
            sx0 = window.scrollX;
            sy0 = window.scrollY;
            if (mode !== 'home' && (dsx || dsy)) {
                for (const id of IDS) {
                    A[id].x += dsx;
                    A[id].y += dsy;
                    if (A[id].wander) {
                        A[id].wander.x += dsx;
                        A[id].wander.y += dsy;
                    }
                }
            }

            // Which section is the cursor over? (Claude reads it.)
            if (fine && P.el !== lastEl) {
                lastEl = P.el;
                const h = P.el?.closest?.('[data-herd]') || null;
                if (h !== host) {
                    host = h;
                    label = h ? h.dataset.herd : null;
                    if (mode === 'follow') onHost(h);
                }
            }

            const px = P.x + window.scrollX;
            const py = P.y + window.scrollY;

            for (const id of IDS) {
                const a = A[id];
                const el = E[id];
                if (!el.root) continue;

                const blocked = herd.isBlocked(id);
                if (blocked !== a.blocked) {
                    a.blocked = blocked;
                    a.locked = false;
                    if (blocked) say(id, 'Limit hit. Napping till it resets.', 3200);
                    else say(id, 'Limit reset. Back to work.', 2200);
                }

                let tx = a.x;
                let ty = a.y;
                let k = 90;
                let zeta = 0.72;
                let riding = false;

                if (blocked) {
                    k = 30;
                    zeta = 1;
                } else if (mode === 'home') {
                    riding = true;
                    if (a.locked) {
                        if (a.u >= 1) {
                            a.rest += dt;
                            if (a.rest > 0.05 && a.rest - dt <= 0.05) say(id, id === 'claude' ? 'Converged ✓' : 'Val loss holds ✓', 1800);
                            if (a.rest > 2.4) setOn(id, false);
                            if (a.rest > 2.75) {
                                a.u = 0;
                                a.rest = 0;
                            }
                        } else {
                            const before = a.u;
                            a.u = Math.min(1, a.u + dt / RIDE[id].lap);
                            if (id === 'codex' && before < 0.31 && a.u >= 0.31) say('codex', 'Overfitting… briefly.', 2200);
                        }
                    }
                    const p = ridePoint(id, a.u);
                    tx = p.x;
                    ty = p.y;
                    a.angle += ((p.slope * 180) / Math.PI * 0.6 - a.angle) * 0.12;
                } else if (mode === 'follow') {
                    const leader = id === 'claude' || A.claude.blocked;
                    if (leader) {
                        tx = px + (fine ? 26 : 0);
                        ty = py + (fine ? 46 : -28);
                    } else {
                        const c = A.claude;
                        tx = c.x - c.dir[0] * 44 + c.dir[1] * 10;
                        // never above Claude: that's where Claude's speech bubble goes
                        ty = Math.max(c.y - 6, c.y - c.dir[1] * 44 - c.dir[0] * 4);
                        k = 64;
                        zeta = 0.78;
                    }
                } else {
                    // idle: wander near the cursor, inside the viewport
                    if (!a.wander || now > a.wander.until) {
                        const ang = Math.random() * Math.PI * 2;
                        const rad = 56 + Math.random() * 70;
                        a.wander = {
                            x: clamp(px + Math.cos(ang) * rad, window.scrollX + 30, window.scrollX + window.innerWidth - 30),
                            y: clamp(py + 30 + Math.sin(ang) * rad * 0.7, window.scrollY + 70, window.scrollY + window.innerHeight - 24),
                            until: now + 1800 + Math.random() * 2600,
                        };
                    }
                    tx = a.wander.x;
                    ty = a.wander.y;
                    k = 18;
                    zeta = 0.95;
                }

                // Move.
                const ox = a.x;
                const oy = a.y;
                let jumped = false;
                if (riding && a.locked) {
                    a.x = tx;
                    a.y = ty;
                    a.vx = 0;
                    a.vy = 0;
                } else {
                    const dx = tx - a.x;
                    const dy = ty - a.y;
                    const dist = Math.hypot(dx, dy);
                    const far = window.innerHeight * 1.6;
                    if (dist > far) {
                        // too far to run: appear most of the way there
                        a.x = tx - (dx / dist) * window.innerHeight * 0.45;
                        a.y = ty - (dy / dist) * window.innerHeight * 0.45;
                        a.vx = 0;
                        a.vy = 0;
                        jumped = true;
                    } else {
                        const c = 2 * Math.sqrt(k) * zeta;
                        a.vx += (dx * k - a.vx * c) * dt;
                        a.vy += (dy * k - a.vy * c) * dt;
                        const sp = Math.hypot(a.vx, a.vy);
                        if (sp > MAX_SPEED) {
                            a.vx *= MAX_SPEED / sp;
                            a.vy *= MAX_SPEED / sp;
                        }
                        a.x += a.vx * dt;
                        a.y += a.vy * dt;
                        if (riding && dist < 3) a.locked = true;
                    }
                }
                a.x = clamp(a.x, 14, Math.max(14, W - 14));
                a.y = clamp(a.y, 40, Math.max(40, H - 2));

                const speed = Math.hypot(a.vx, a.vy);
                if (speed > 60) {
                    const nx = a.vx / speed;
                    const ny = a.vy / speed;
                    const d0 = a.dir[0] + (nx - a.dir[0]) * 0.08;
                    const d1 = a.dir[1] + (ny - a.dir[1]) * 0.08;
                    const n = Math.hypot(d0, d1) || 1;
                    a.dir = [d0 / n, d1 / n];
                }

                // Spend the limit: distance while following, time while riding or thinking.
                const moved = jumped ? 0 : Math.hypot(a.x - ox, a.y - oy);
                if (!blocked) a.burn += mode === 'follow' ? moved * BURN[id].px : BURN[id].s * dt;

                // Draw.
                const rot = riding && a.locked ? a.angle : blocked ? 0 : clamp(a.vx / 45, -16, 16);
                const stretch = Math.min(speed / 2600, 0.14);
                place(id, rot, 1 + stretch, 1 - stretch * 0.8);

                const walk = speed > 50 || (riding && a.locked && a.u < 1);
                if (walk !== a.walk) {
                    a.walk = walk;
                    el.root.dataset.walk = walk ? '1' : '0';
                }
                const edge = a.x > W - 150 ? 'r' : a.x < 150 ? 'l' : 'c';
                if (edge !== a.edge) {
                    a.edge = edge;
                    el.say.dataset.edge = edge;
                }
                const look = Math.abs(tx - a.x) > 24 ? Math.sign(tx - a.x) : 0;
                if (look !== a.look && el.eyes) {
                    a.look = look;
                    el.eyes.setAttribute('transform', `translate(${look} 0)`);
                }
                if (now >= appearAt && (a.rest <= 2.4 || !riding)) setOn(id, true);
                if (a.queued && now >= a.sayFree) say(id, a.queued.text, a.queued.ms);
                if (el.say.dataset.say === '1' && now > a.sayUntil) el.say.dataset.say = '0';

                const [state, doing] = statusFor(id);
                herd.status(id, state, doing);
            }

            // Both talking, side by side? Codex's bubble drops below it so the two don't collide.
            const below =
                E.claude.say?.dataset.say === '1' && Math.abs(A.codex.x - A.claude.x) < 200 && Math.abs(A.codex.y - A.claude.y) < 80;
            if (below !== codexBelow && E.codex.say) {
                codexBelow = below;
                E.codex.say.dataset.below = below ? '1' : '0';
            }

            // Report spending a few times a second, not every frame.
            if (now > flushAt) {
                flushAt = now + 250;
                for (const id of IDS) {
                    // small amounts carry over until they add up
                    if (A[id].burn > 0.02) {
                        herd.burn(id, A[id].burn);
                        A[id].burn = 0;
                    }
                }
            }
        };

        for (const id of IDS) place(id);
        raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerdown', onDown);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
            document.removeEventListener('pointerout', onOut);
            window.removeEventListener('blur', onBlur);
        };
    }, [enabled]);

    if (!enabled) return null;

    const bind = (id, key) => (el) => {
        els.current[id][key] = el;
    };

    return (
        <div ref={layer} className="pointer-events-none absolute inset-0 z-40 overflow-hidden" aria-hidden="true">
            {IDS.map((id) => (
                <div key={id} ref={bind(id, 'root')} className="herd-agent" data-on="0">
                    <span className="herd-tag">{id}</span>
                    <div ref={bind(id, 'body')} className="herd-body">
                        <Sprite id={id} eyesRef={bind(id, 'eyes')} />
                    </div>
                </div>
            ))}
            {/* speech bubbles ride above both sprites */}
            {IDS.map((id) => (
                <div key={id} ref={bind(id, 'say')} className="herd-say" data-on="0">
                    <span ref={bind(id, 'bubble')} className="herd-bubble" />
                </div>
            ))}
        </div>
    );
}
