import { motion } from 'framer-motion';
import { requirements } from '../data/content';
import SectionHeader from './SectionHeader';
import { Note } from './hand/Hand';

// Skills as the file every ML repo starts with — annotated in pen, like a printout on a desk.
export default function Requirements() {
    const lines = requirements.lines;
    return (
        <section id="stack" className="mx-auto max-w-page px-5 py-20 md:px-8 md:py-24" data-herd="requirements.txt" data-herd-codex="pip install -r requirements.txt">
            <SectionHeader id="stack" />

            <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="min-w-0 lg:col-span-5">
                    <div className="lg:sticky lg:top-28">
                        <motion.h2
                            className="font-serif text-[clamp(2.6rem,5.4vw,4.4rem)] leading-[0.95] tracking-[-0.02em]"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            What I actually <span className="italic">reach for.</span>
                        </motion.h2>
                        <p className="mt-6 max-w-[28rem] text-pretty text-[17px] leading-relaxed text-ink-2">{requirements.blurb}</p>
                        <Note className="mt-6 max-w-[20rem] -rotate-1 text-ink-3">No icon wall. You can&rsquo;t pip install a logo.</Note>
                    </div>
                </div>

                <motion.div
                    className="min-w-0 border border-ink/80 bg-paper-card shadow-[6px_6px_0_rgb(23_21_15/0.9)] lg:col-span-7"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="flex items-center justify-between border-b border-ink/80 px-4 py-2.5 font-mono text-[12px]">
                        <span>requirements.txt</span>
                        <span className="text-ink-3">{lines.filter((l) => l.pkg).length} packages · Python</span>
                    </div>
                    <ol className="overflow-x-auto py-3 font-mono text-[13px] leading-[1.9] sm:text-[13.5px]">
                        {lines.map((l, i) => (
                            <li key={i} className="grid grid-cols-[2.6rem_1fr] pr-4 hover:bg-ink/[0.03]">
                                <span className="select-none pr-3 text-right text-ink-4">{i + 1}</span>
                                <span className="min-w-0">
                                    {l.comment && <span className="text-ink-3"># {l.comment}</span>}
                                    {l.pkg && (
                                        <>
                                            <span className="text-ink">{l.pkg}</span>
                                            {l.ver && <span className="text-pen-blue">{l.ver}</span>}
                                            {l.note && (
                                                <span className="ml-3 whitespace-nowrap font-hand text-[15px] text-pen-red">
                                                    &larr; {l.note}
                                                </span>
                                            )}
                                        </>
                                    )}
                                    {!l.comment && !l.pkg && ' '}
                                </span>
                            </li>
                        ))}
                    </ol>
                    <div className="border-t border-ink/15 px-4 py-3 font-mono text-[12px] leading-relaxed text-ink-3">
                        # Not pip-installable, sadly: {requirements.infra.join(' · ')}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
