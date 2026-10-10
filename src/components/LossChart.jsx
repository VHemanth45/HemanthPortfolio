import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { dateOf, HERO, heroX as px, heroY as py, sample, smoothPath, tOf, toBox, trainLoss, valLoss } from '../lib/curve';
import { journeyNotes } from '../data/content';
import { arrowPaths } from '../lib/arrow';
import { herd, useHerdEnabled } from '../lib/herd';
import { FINE_POINTER, useMedia } from '../lib/useMedia';
import { Note } from './hand/Hand';

// Fig. 1 — the hero plot: a matplotlib-style training curve whose x-axis is my life so far.
// Hover (or drag, or arrow-key) along it to read the run; Claude and Codex ride the curves.
const { W, H, BOX } = HERO;
const TRAIN = smoothPath(toBox(sample(trainLoss, 140), BOX));
const VAL = smoothPath(toBox(sample(valLoss, 140), BOX));
const X_TICKS = [2023, 2024, 2025, 2026].map((y) => ({ label: String(y), t: tOf(y) }));
const Y_TICKS = [0.05, 0.1, 0.2, 0.5, 1, 2];
const MONTH = 1 / 51; // the axis spans 51 months

const pct = (v, total) => `${(v / total) * 100}%`;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const pointOf = (n) => [px(n.t), py(n.curve === 'val' ? valLoss(n.t) : trainLoss(n.t))];
const nearestNote = (t) =>
    journeyNotes.reduce((best, n) => (Math.abs(n.t - t) < 0.035 && (!best || Math.abs(n.t - t) < Math.abs(best.t - t)) ? n : best), null);

const line = (delay) => ({
    hidden: { pathLength: 0 },
    show: { pathLength: 1, transition: { delay, duration: 2.2, ease: [0.45, 0, 0.2, 1] } },
});

const drawIn = (delay, duration = 0.5) => ({
    hidden: { pathLength: 0, opacity: 0 },
    show: { pathLength: 1, opacity: 1, transition: { pathLength: { delay, duration }, opacity: { delay, duration: 0.01 } } },
});

// The interactive layer: a crosshair, both losses and the nearest milestone at any month.
function Scrub() {
    const [t, setT] = useState(null);
    const box = useRef(null);
    const hide = useRef(0);
    useEffect(() => () => clearTimeout(hide.current), []);

    const at = (e) => {
        const r = box.current.getBoundingClientRect();
        return clamp01((((e.clientX - r.left) / r.width) * W - BOX.x0) / (BOX.x1 - BOX.x0));
    };
    const show = (e) => {
        clearTimeout(hide.current);
        setT(at(e));
    };
    const hideIn = (ms) => {
        clearTimeout(hide.current);
        hide.current = setTimeout(() => setT(null), ms);
    };
    // Arrow keys move a month (Shift: a year). Page Up/Down and Space are left alone, so the page still scrolls.
    const onKey = (e) => {
        const dir = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
        const step = dir && dir * MONTH * (e.shiftKey ? 12 : 1);
        if (step) setT((cur) => clamp01((cur ?? 1) + step));
        else if (e.key === 'Home') setT(0);
        else if (e.key === 'End') setT(1);
        else if (e.key === 'Escape') setT(null);
        else return;
        e.preventDefault();
    };

    const tr = t === null ? 0 : trainLoss(t);
    const va = t === null ? 0 : valLoss(t);
    const near = t === null ? null : nearestNote(t);
    const left = t !== null && t > 0.5;

    return (
        <div
            ref={box}
            className="absolute inset-0 cursor-crosshair touch-pan-y touch-pinch-zoom"
            onMouseDown={(e) => e.preventDefault()} // a click shouldn't park keyboard focus here
            onPointerMove={show}
            onPointerDown={show}
            onPointerLeave={(e) => (e.pointerType === 'mouse' ? setT(null) : hideIn(1500))}
            onPointerUp={(e) => e.pointerType !== 'mouse' && hideIn(1500)}
            onPointerCancel={() => hideIn(600)}
            onKeyDown={onKey}
            onFocus={() => setT((cur) => cur ?? 1)}
            onBlur={() => setT(null)}
            tabIndex={0}
            role="slider"
            aria-label="Learning curve, month by month"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round((t ?? 1) * 100)}
            aria-valuetext={t === null ? 'Use the arrow keys to move along the curve' : `${dateOf(t)}: train loss ${tr.toFixed(3)}, validation loss ${va.toFixed(3)}${near ? `. ${near.text}` : ''}`}
        >
            {t !== null && (
                <>
                    <svg viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
                        <line x1={px(t)} x2={px(t)} y1={BOX.y0} y2={BOX.y1} stroke="#17150f" strokeOpacity="0.45" strokeDasharray="3 4" />
                        <circle cx={px(t)} cy={py(va)} r="5" fill="#ff7f0e" stroke="#fbfaf6" strokeWidth="1.5" />
                        <circle cx={px(t)} cy={py(tr)} r="5" fill="#1f77b4" stroke="#fbfaf6" strokeWidth="1.5" />
                    </svg>
                    {/* readout, pinned to the corner away from the cursor */}
                    <div
                        className="pointer-events-none absolute z-10 w-max max-w-[13rem] border border-ink/80 bg-paper-card px-2.5 py-2 font-mono text-[11.5px] leading-snug shadow-[3px_3px_0_rgb(23_21_15/0.85)] sm:max-w-[15rem]"
                        style={{ top: pct(BOX.y0, H), ...(left ? { left: pct(BOX.x0 + 8, W) } : { right: pct(W - BOX.x1, W) }) }}
                    >
                        <div className="text-ink">{dateOf(t)}</div>
                        <div className="tabular-nums text-ink-2">
                            <span className="text-pen-blue">train</span> {tr.toFixed(3)} · <span className="text-pen-orange">val</span> {va.toFixed(3)}
                        </div>
                        {near && <div className="mt-1 font-hand text-[14px] leading-snug text-ink">{near.text}</div>}
                    </div>
                </>
            )}
        </div>
    );
}

export default function LossChart() {
    const fine = useMedia(FINE_POINTER);
    const agents = useHerdEnabled();

    return (
        <figure className="relative" data-herd="the learning curve" data-herd-say="This curve is our home.">
            <div className="relative aspect-[600/440] w-full" data-herd-home>
                <motion.svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" initial="hidden" animate="show" aria-hidden="true">
                    {/* grid */}
                    {Y_TICKS.map((v) => (
                        <line key={`gy${v}`} x1={BOX.x0} x2={BOX.x1} y1={py(v)} y2={py(v)} stroke="#17150f" strokeOpacity="0.09" strokeDasharray="2 5" />
                    ))}
                    {X_TICKS.map((x) => (
                        <line key={`gx${x.label}`} x1={px(x.t)} x2={px(x.t)} y1={BOX.y0} y2={BOX.y1} stroke="#17150f" strokeOpacity="0.09" strokeDasharray="2 5" />
                    ))}

                    {/* axes */}
                    <path d={`M${BOX.x0} ${BOX.y0 - 8} V${BOX.y1} H${BOX.x1 + 8}`} fill="none" stroke="#17150f" strokeWidth="1.3" />
                    {Y_TICKS.map((v) => (
                        <g key={`ty${v}`}>
                            <line x1={BOX.x0 - 5} x2={BOX.x0} y1={py(v)} y2={py(v)} stroke="#17150f" strokeWidth="1.3" />
                            <text x={BOX.x0 - 10} y={py(v) + 4.5} textAnchor="end" className="fill-ink-3 font-mono text-[13px]">
                                {v}
                            </text>
                        </g>
                    ))}
                    {X_TICKS.map((x) => (
                        <g key={x.label}>
                            <line x1={px(x.t)} x2={px(x.t)} y1={BOX.y1} y2={BOX.y1 + 5} stroke="#17150f" strokeWidth="1.3" />
                            <text x={px(x.t)} y={BOX.y1 + 23} textAnchor="middle" className="fill-ink-3 font-mono text-[13px]">
                                {x.label}
                            </text>
                        </g>
                    ))}
                    <text x={BOX.x1 + 8} y={BOX.y1 + 23} textAnchor="end" className="fill-ink font-mono text-[13px]">
                        Now
                    </text>
                    <text x={BOX.x1} y={BOX.y1 + 50} textAnchor="end" className="fill-ink-3 font-mono text-[11px] uppercase tracking-[0.14em]">
                        Time →
                    </text>
                    <text transform={`translate(12 ${BOX.y0 + 4}) rotate(-90)`} textAnchor="end" className="fill-ink-3 font-mono text-[11px] uppercase tracking-[0.14em]">
                        Loss (log) →
                    </text>

                    {/* curves */}
                    <motion.path d={VAL} fill="none" stroke="#ff7f0e" strokeWidth="2" strokeLinecap="round" variants={line(0.55)} />
                    <motion.path d={TRAIN} fill="none" stroke="#1f77b4" strokeWidth="2.6" strokeLinecap="round" variants={line(0.35)} />

                    {/* checkpoints + arrows from their notes (arrows only where notes are shown) */}
                    {journeyNotes.map((n) => {
                        const [cx, cy] = pointOf(n);
                        const { shaft, tip } = arrowPaths(n.from, [cx, cy], n.bend);
                        const at = 1.05 + n.t * 2.1;
                        return (
                            <g key={n.id}>
                                <g className="hidden sm:inline lg:hidden xl:inline">
                                    <motion.path d={shaft} fill="none" stroke="#6d685e" strokeWidth="1.5" strokeLinecap="round" variants={drawIn(at, 0.5)} />
                                    <motion.path d={tip} fill="none" stroke="#6d685e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" variants={drawIn(at + 0.45, 0.2)} />
                                </g>
                                <motion.circle
                                    cx={cx}
                                    cy={cy}
                                    r="5.5"
                                    fill="#fbfaf6"
                                    stroke={n.curve === 'val' ? '#ff7f0e' : '#1f77b4'}
                                    strokeWidth="2.4"
                                    variants={{
                                        hidden: { scale: 0, opacity: 0 },
                                        show: { scale: 1, opacity: 1, transition: { delay: 0.5 + n.t * 2.1, type: 'spring', stiffness: 420, damping: 18 } },
                                    }}
                                />
                            </g>
                        );
                    })}

                    {/* legend, matplotlib-style */}
                    <g transform={`translate(${BOX.x1 - 112} ${BOX.y0 + 2})`}>
                        <rect width="112" height="56" fill="#fbfaf6" fillOpacity="0.92" stroke="#17150f" strokeOpacity="0.22" rx="3" />
                        <line x1="12" x2="36" y1="20" y2="20" stroke="#1f77b4" strokeWidth="2.6" />
                        <text x="45" y="24.5" className="fill-ink font-mono text-[13px]">Train</text>
                        <line x1="12" x2="36" y1="39" y2="39" stroke="#ff7f0e" strokeWidth="2" />
                        <text x="45" y="43.5" className="fill-ink font-mono text-[13px]">Val</text>
                    </g>
                </motion.svg>

                {/* handwritten annotations, positioned in chart space */}
                {journeyNotes.map((n) => (
                    <motion.div
                        key={n.id}
                        className="absolute hidden sm:block lg:hidden xl:block"
                        style={{ left: pct(n.x, W), top: pct(n.y, H), width: pct(n.w, W) }}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 + n.t * 2.1, duration: 0.5 }}
                    >
                        <Note className="text-[14.5px] leading-snug">
                            <span className="font-mono text-[11px] tracking-wider text-ink-3">{n.when}</span>
                            <br />
                            {n.text}
                        </Note>
                    </motion.div>
                ))}

                <Scrub />
            </div>

            {/* where the plot is too small for notes (phones, and the narrow two-column laptop layout): a key instead */}
            <ol className="mt-4 space-y-2 sm:hidden lg:block xl:hidden">
                {journeyNotes.map((n) => (
                    <li key={n.id} className="flex items-baseline gap-3">
                        <span
                            className="relative top-[1px] h-2.5 w-2.5 shrink-0 rounded-full border-2 bg-paper-card"
                            style={{ borderColor: n.curve === 'val' ? '#ff7f0e' : '#1f77b4' }}
                            aria-hidden="true"
                        />
                        <span className="w-16 shrink-0 font-mono text-[11px] text-ink-3">{n.when}</span>
                        <Note className="text-[14px]">{n.text}</Note>
                    </li>
                ))}
            </ol>

            <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-ink/15 pt-2.5">
                <span className="font-mono text-[11px] text-ink-3">
                    <span className="text-ink">Fig. 1</span> — Learning curve, 2022 → now. Still going down.
                </span>
                <span className="hidden font-mono text-[11px] text-ink-3 sm:inline lg:hidden xl:inline">n = 1 engineer</span>
            </figcaption>

            <motion.p
                className="mt-3 flex items-start gap-2 font-hand text-[15px] leading-snug text-ink-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.6, duration: 0.6 }}
            >
                <span aria-hidden="true">↑</span>
                <span>
                    {fine ? 'Hover the plot to read the run.' : 'Drag across the plot to read the run.'}
                    {agents &&
                        (fine
                            ? ' The two riding it are Claude and Codex — move your cursor and they’ll follow you.'
                            : ' The two riding it are Claude and Codex — they’ll come along.')}{' '}
                    <button
                        type="button"
                        onClick={() => herd.setEnabled(!agents)}
                        className="font-mono text-[12px] text-ink-2 underline decoration-ink/30 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                    >
                        {agents ? 'Hide them' : 'Bring the agents back'}
                    </button>
                </span>
            </motion.p>
        </figure>
    );
}
