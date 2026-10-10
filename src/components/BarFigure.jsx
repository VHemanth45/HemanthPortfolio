import { motion } from 'framer-motion';
import { arrowPaths } from '../lib/arrow';

// Grouped bar chart in matplotlib's default style, drawn from real numbers.
const W = 600;
const H = 380;
const BOX = { x0: 56, x1: 584, y0: 24, y1: 300 };

const drawIn = (delay, duration) => ({
    hidden: { pathLength: 0, opacity: 0 },
    show: { pathLength: 1, opacity: 1, transition: { pathLength: { delay, duration }, opacity: { delay, duration: 0.01 } } },
});

export default function BarFigure({ groups, series, max, ticks, note }) {
    const y = (v) => BOX.y1 - (v / max) * (BOX.y1 - BOX.y0);
    const slot = (BOX.x1 - BOX.x0) / groups.length;
    const barW = Math.min(44, (slot * 0.62) / series.length);
    const barX = (gi, si) => BOX.x0 + slot * (gi + 0.5) - (barW * series.length) / 2 + si * barW;

    // The note points at the last group's first series — the number the whole pipeline is for.
    const last = groups.length - 1;
    const target = [barX(last, 0) + barW / 2, y(series[0].values[last]) - 22];
    const arrow = note && arrowPaths([BOX.x1 - 92, 168], target, -0.28, 2);

    return (
        <div className="bg-paper-card px-1 pt-2">
            <motion.svg
                viewBox={`0 0 ${W} ${H}`}
                className="h-auto w-full overflow-visible"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                role="img"
                aria-label={groups.map((g, gi) => `${g.label}: ${series.map((s) => `${s.name} ${s.values[gi]}`).join(', ')}`).join('; ')}
            >
                {ticks.map((t) => (
                    <g key={t}>
                        <line x1={BOX.x0} x2={BOX.x1} y1={y(t)} y2={y(t)} stroke="#17150f" strokeOpacity={t === 0 ? 0 : 0.09} strokeDasharray="2 5" />
                        <line x1={BOX.x0 - 5} x2={BOX.x0} y1={y(t)} y2={y(t)} stroke="#17150f" strokeWidth="1.2" />
                        <text x={BOX.x0 - 10} y={y(t) + 4.5} textAnchor="end" className="fill-ink-3 font-mono text-[13px]">
                            {t.toFixed(1)}
                        </text>
                    </g>
                ))}
                <path d={`M${BOX.x0} ${BOX.y0 - 6} V${BOX.y1} H${BOX.x1}`} fill="none" stroke="#17150f" strokeWidth="1.2" />

                {groups.map((g, gi) => (
                    <g key={g.label}>
                        {series.map((s, si) => {
                            const v = s.values[gi];
                            const x = barX(gi, si);
                            return (
                                <g key={s.name}>
                                    <motion.rect
                                        x={x + 1}
                                        width={barW - 2}
                                        y={y(v)}
                                        height={BOX.y1 - y(v)}
                                        fill={s.color}
                                        style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
                                        variants={{
                                            hidden: { scaleY: 0 },
                                            show: { scaleY: 1, transition: { delay: 0.15 + gi * 0.16 + si * 0.06, duration: 0.7, ease: [0.2, 0.7, 0.1, 1] } },
                                        }}
                                    />
                                    <motion.text
                                        x={x + barW / 2}
                                        y={y(v) - 7}
                                        textAnchor="middle"
                                        className="fill-ink font-mono text-[12px]"
                                        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.7 + gi * 0.16 } } }}
                                    >
                                        {v.toFixed(3).replace(/^0/, '')}
                                    </motion.text>
                                </g>
                            );
                        })}
                        <text x={BOX.x0 + slot * (gi + 0.5)} y={BOX.y1 + 24} textAnchor="middle" className="fill-ink font-mono text-[13px]">
                            {g.label}
                        </text>
                        <text x={BOX.x0 + slot * (gi + 0.5)} y={BOX.y1 + 42} textAnchor="middle" className="fill-ink-3 font-mono text-[12px]">
                            {g.sub}
                        </text>
                    </g>
                ))}

                {/* legend */}
                <g transform={`translate(${BOX.x1 - 104} ${BOX.y0})`}>
                    <rect width="104" height={18 + series.length * 19} fill="#fbfaf6" stroke="#17150f" strokeOpacity="0.22" rx="3" />
                    {series.map((s, i) => (
                        <g key={s.name} transform={`translate(12 ${18 + i * 19})`}>
                            <rect y="-9" width="16" height="10" fill={s.color} />
                            <text x="26" y="0" className="fill-ink font-mono text-[13px]">
                                {s.name}
                            </text>
                        </g>
                    ))}
                </g>

                {/* handwritten callout — too small to read on phones, so it only appears from sm up */}
                {note && (
                    <g className="hidden sm:inline">
                        <motion.text
                            x={BOX.x1}
                            y={150}
                            textAnchor="end"
                            className="fill-ink-2 font-hand text-[17px]"
                            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 1.1, duration: 0.5 } } }}
                        >
                            {note}
                        </motion.text>
                        <motion.path d={arrow.shaft} fill="none" stroke="#6d685e" strokeWidth="1.5" strokeLinecap="round" variants={drawIn(1.3, 0.6)} />
                        <motion.path d={arrow.tip} fill="none" stroke="#6d685e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" variants={drawIn(1.85, 0.2)} />
                    </g>
                )}
            </motion.svg>
        </div>
    );
}
