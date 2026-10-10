import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { trainingLog } from '../data/content';
import SectionHeader from './SectionHeader';
import { Note } from './hand/Hand';

const TAG = {
    init: 'text-pen-purple',
    lead: 'text-ink-2',
    eval: 'text-pen-green',
    write: 'text-pen-orange',
    ship: 'text-pen-blue',
    ckpt: 'text-pen-red',
    oss: 'text-[#8c564b]',
    intern: 'text-[#0b6f78]',
    deploy: 'text-[#0b6f78]',
};

export default function TrainingLog() {
    // Clicking a [tag] greps the log for it.
    const [tag, setTag] = useState(null);
    const term = useRef(null);
    const rows = tag ? trainingLog.filter((r) => r.tag === tag) : trainingLog;
    const clear = () => {
        setTag(null);
        term.current?.focus(); // the Clear button is about to disappear; don't drop focus on <body>
    };
    const cmd = tag ? `grep -F "[${tag}]" training.log` : `tail -n ${trainingLog.length} training.log`;

    return (
        <section id="log" className="mx-auto max-w-page px-5 py-20 md:px-8 md:py-24" data-herd="the training log" data-herd-codex="grep-ing the log…">
            <SectionHeader id="log" />

            <div className="mt-12 grid gap-12 lg:grid-cols-12">
                <div className="min-w-0 lg:col-span-4">
                    <div className="lg:sticky lg:top-28">
                        <motion.h2
                            className="font-serif text-[clamp(2.6rem,5.4vw,4.4rem)] leading-[0.95] tracking-[-0.02em]"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            The training <span className="italic">log.</span>
                        </motion.h2>
                        <Note className="mt-4 max-w-[18rem] text-ink-3">
                            No learning-rate schedule. Just curiosity, and a lot of <span className="font-mono text-[13px]">pip install</span>.
                        </Note>
                        <Note className="mt-3 max-w-[18rem] text-ink-3">
                            Click any <span className="font-mono text-[13px] text-pen-blue">[tag]</span> to grep the log for it.
                        </Note>
                    </div>
                </div>

                <div className="min-w-0 lg:col-span-8">
                    <div ref={term} tabIndex={-1} className="border border-ink/80 bg-paper-card focus:outline-none">
                        <div className="flex items-center gap-2 border-b border-ink/80 px-4 py-2.5">
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-ink/40" />
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-ink/40" />
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-ink/40" />
                            <span className="ml-3 min-w-0 truncate font-mono text-[12px] text-ink-3" aria-live="polite">
                                ~/hemanth $ {cmd}
                                {tag && <span className="text-ink-2"> · {rows.length} {rows.length === 1 ? 'match' : 'matches'}</span>}
                            </span>
                            {tag && (
                                <button type="button" onClick={clear} className="ml-auto shrink-0 font-mono text-[12px] text-ink-2 transition-colors hover:text-ink">
                                    × Clear
                                </button>
                            )}
                        </div>
                        <ol className="px-4 py-3 font-mono text-[13px] sm:px-5">
                            <AnimatePresence>
                                {rows.map((row, i) => (
                                    <motion.li
                                        key={`${row.when}-${row.tag}-${row.text}`}
                                        layout="position"
                                        className="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-x-3 border-b border-dashed border-ink/10 py-3 last:border-b-0 sm:grid-cols-[5.5rem_4.75rem_minmax(0,1fr)] sm:gap-x-4"
                                        initial={{ opacity: 0, x: -8 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                        viewport={{ once: true, margin: '-40px' }}
                                        transition={{ delay: tag ? 0 : i * 0.06, duration: 0.4 }}
                                    >
                                        {/* phones: date and tag stack in one column; wider screens: two columns */}
                                        <span className="flex flex-col items-start gap-0.5 sm:contents">
                                            <span className="tabular-nums text-ink-3">{row.when}</span>
                                            <span>
                                                <button
                                                    type="button"
                                                    onClick={() => setTag(tag === row.tag ? null : row.tag)}
                                                    aria-pressed={tag === row.tag}
                                                    aria-label={tag === row.tag ? 'Show the whole log' : `Show only ${row.tag} entries`}
                                                    className={`${TAG[row.tag]} underline-offset-4 transition-colors hover:underline ${tag === row.tag ? 'bg-ink/[0.06]' : ''}`}
                                                >
                                                    [{row.tag}]
                                                </button>
                                            </span>
                                        </span>
                                        <span className="font-sans text-[15px] leading-snug text-ink">
                                            {row.text}
                                            {row.detail && <span className="mt-1 block text-[13.5px] text-ink-3">{row.detail}</span>}
                                        </span>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                            <li className="flex items-center gap-2 pt-3 text-ink-3">
                                <span>›</span>
                                <span className="inline-block h-4 w-2 motion-safe:animate-pulse bg-ink/70" aria-hidden="true" />
                                <span className="sr-only">Log continues</span>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    );
}
