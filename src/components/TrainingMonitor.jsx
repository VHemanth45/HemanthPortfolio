import { useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { makeY, sample, smoothPath, toBox, trainLoss, valLoss } from '../lib/curve';
import { EPOCHS } from '../data/content';

// The page is the training run: scroll progress drives a live loss curve in the nav.
const BOX = { x0: 2, x1: 94, y0: 3, y1: 21, min: 0.03, max: 3 };
const TRAIN = smoothPath(toBox(sample(trainLoss, 60), BOX));
const VAL = smoothPath(toBox(sample(valLoss, 60), BOX));
const yOf = makeY(BOX);
const clamp = (v) => Math.min(1, Math.max(0, v));
const pad = (n) => String(n).padStart(2, '0');

function useProgress() {
    const { scrollYProgress } = useScroll();
    return useSpring(scrollYProgress, { stiffness: 140, damping: 32, restDelta: 0.0005 });
}

export function TrainingMonitor({ active }) {
    const progress = useProgress();
    const [stats, setStats] = useState({ loss: trainLoss(0), done: false });

    useMotionValueEvent(progress, 'change', (v) => {
        const t = clamp(v);
        const loss = Math.round(trainLoss(t) * 1000) / 1000;
        const done = t > 0.985;
        setStats((s) => (s.loss === loss && s.done === done ? s : { loss, done }));
    });

    const cx = useTransform(progress, (v) => BOX.x0 + clamp(v) * (BOX.x1 - BOX.x0));
    const cy = useTransform(progress, (v) => yOf(trainLoss(clamp(v))));

    const index = EPOCHS.findIndex((e) => e.id === active);
    const phase = stats.done ? 'early stop ✓' : index < 0 ? 'warmup' : `epoch ${pad(index + 1)}/${pad(EPOCHS.length)}`;

    return (
        <a
            href="#contact"
            className="group hidden items-center gap-3 border border-ink/15 bg-paper-card/70 py-1.5 pl-3 pr-3.5 font-mono text-[11px] text-ink-2 transition-colors hover:border-ink/40 lg:flex"
            aria-label={`Training monitor: ${phase}, loss ${stats.loss.toFixed(3)}. Jump to contact.`}
        >
            <span className="flex items-center gap-1.5 uppercase tracking-[0.12em] text-ink">
                <span className={`h-1.5 w-1.5 rounded-full ${stats.done ? 'bg-plot-green' : 'motion-safe:animate-pulse bg-plot-orange'}`} />
                <span className="hidden xl:inline">{stats.done ? 'converged' : 'training'}</span>
            </span>
            <span className="hidden tabular-nums uppercase tracking-[0.12em] text-ink-3 xl:inline">{phase}</span>
            <svg viewBox="0 0 96 24" className="h-6 w-24" aria-hidden="true">
                <line x1="0" x2="96" y1="12" y2="12" stroke="#17150f" strokeOpacity="0.08" />
                <motion.path d={VAL} fill="none" stroke="#ff7f0e" strokeWidth="1.1" strokeOpacity="0.75" style={{ pathLength: progress }} />
                <motion.path d={TRAIN} fill="none" stroke="#1f77b4" strokeWidth="1.5" style={{ pathLength: progress }} />
                <motion.circle r="2.2" fill="#1f77b4" style={{ cx, cy }} />
            </svg>
            <span className="tabular-nums">
                loss <span className="text-ink">{stats.loss.toFixed(3)}</span>
            </span>
        </a>
    );
}

// Phones: just a thin progress line across the top.
export function ScrollLine() {
    const progress = useProgress();
    return (
        <motion.div
            aria-hidden="true"
            className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-plot-blue lg:hidden"
            style={{ scaleX: progress }}
        />
    );
}
