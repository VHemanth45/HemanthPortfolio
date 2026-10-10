import { AnimatePresence, motion } from 'framer-motion';
import { AGENTS, fmtEta, herd, levelColor, useHerd } from '../../lib/herd';
import { FINE_POINTER, useMedia } from '../../lib/useMedia';
import { Sprite } from './Sprites';

// Bottom-left: the agents' usage, the way the plugin puts it in Herdr's tab bar — plus the
// switch to send them to sleep. Desktop only: once they've started following you, or straight
// away if they were put to sleep on an earlier visit (so they can be woken up).
export default function HerdDock() {
    const s = useHerd();
    const fine = useMedia(FINE_POINTER);
    if (!fine || (!s.active && s.enabled)) return null;

    const latest = s.events[0] && s.now - s.events[0].at < 5000 ? s.events[0] : null;

    return (
        <div className="fixed bottom-4 left-4 z-[57] hidden font-mono text-[11px] md:block">
            <AnimatePresence>
                {latest && s.enabled && (
                    <motion.div
                        key={latest.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mb-2 w-max max-w-[19rem] border border-ink/80 bg-paper-card px-3 py-2 text-ink shadow-[3px_3px_0_rgb(23_21_15/0.85)]"
                    >
                        <span style={{ color: latest.level === 'err' ? '#b8201f' : latest.level === 'warn' ? '#a85400' : '#1f7a1f' }}>●</span> {latest.text}
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex items-stretch border border-ink/80 bg-paper-card text-ink-2 shadow-[3px_3px_0_rgb(255_127_14/0.9)]"
            >
                <a
                    href="#herdr"
                    className="flex items-center gap-3 px-3 py-2 transition-colors hover:bg-ink/[0.04]"
                    title="Live usage of the two agents on this page — the idea behind herdr_agents_tracker"
                >
                    {s.enabled ? (
                        AGENTS.map((a) => {
                            const v = s[a.id];
                            return (
                                <span key={a.id} className="flex items-center gap-1.5">
                                    <Sprite id={a.id} size={18} />
                                    <span className="relative block h-1.5 w-9 bg-ink/10" aria-hidden="true">
                                        <span
                                            className="absolute inset-y-0 left-0 transition-[width] duration-300"
                                            style={{ width: `${v.used}%`, background: levelColor(v.used, a.color) }}
                                        />
                                    </span>
                                    <span className="tabular-nums text-ink">
                                        {v.state === 'blocked' ? `0:${String(v.resetsIn).padStart(2, '0')}` : `${Math.round(v.used)}%`}
                                    </span>
                                    <span className="sr-only">
                                        {a.name}: {Math.round(v.used)}% of its limit{v.eta ? `, 100% in ${fmtEta(v.eta)}` : ''}.
                                    </span>
                                </span>
                            );
                        })
                    ) : (
                        <span className="flex items-center gap-2 text-ink-3">
                            <span className="flex gap-1 opacity-50">
                                <Sprite id="claude" size={18} />
                                <Sprite id="codex" size={18} />
                            </span>
                            Agents asleep
                        </span>
                    )}
                </a>
                <button
                    type="button"
                    onClick={() => herd.setEnabled(!s.enabled)}
                    className="border-l border-ink/15 px-3 text-ink-3 transition-colors hover:bg-ink hover:text-paper"
                    aria-label={s.enabled ? 'Hide the agents that follow your cursor' : 'Wake the agents up'}
                >
                    {s.enabled ? 'Hide' : 'Wake'}
                </button>
            </motion.div>
        </div>
    );
}
