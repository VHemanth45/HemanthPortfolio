import { motion } from 'framer-motion';
import { profile, references } from '../data/content';
import SectionHeader from './SectionHeader';
import { Note } from './hand/Hand';

export default function References() {
    return (
        <section id="writing" className="mx-auto max-w-page px-5 py-20 md:px-8 md:py-24" data-herd="the references">
            <SectionHeader id="writing" />

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
                            I write to understand things. <span className="italic">Then</span> to explain them.
                        </motion.h2>
                        <p className="mt-6 max-w-[28rem] text-pretty text-[17px] leading-relaxed text-ink-2">{profile.writingBlurb}</p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <a href={profile.links.medium} target="_blank" rel="noopener noreferrer" className="btn-line px-4 py-2 text-[14px]">
                                Medium ↗
                            </a>
                            <a href={profile.links.kaggle} target="_blank" rel="noopener noreferrer" className="btn-line px-4 py-2 text-[14px]">
                                Kaggle ↗
                            </a>
                        </div>
                        <Note className="mt-6 hidden -rotate-1 text-ink-3 lg:block">Cite responsibly ;)</Note>
                    </div>
                </div>

                <ol className="min-w-0 border-t border-ink lg:col-span-7">
                    {references.map((r, i) => (
                        <motion.li
                            key={r.href}
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.5, delay: (i % 4) * 0.05 }}
                        >
                            <a
                                href={r.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group grid grid-cols-[2.4rem_1fr_auto] gap-x-3 border-b border-ink/15 py-6 transition-colors hover:bg-ink/[0.03] sm:grid-cols-[3rem_1fr_auto] sm:gap-x-4"
                            >
                                <span className="pt-1.5 font-mono text-[13px] text-ink-3">[{i + 1}]</span>
                                <span>
                                    <span className="block font-serif text-[26px] leading-[1.08] tracking-[-0.01em] transition-colors group-hover:text-plot-blue sm:text-[30px]">
                                        {r.title}
                                    </span>
                                    <span className="mt-2 block text-pretty text-[15px] leading-relaxed text-ink-2">{r.gist}</span>
                                    <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink-3">
                                        <span className={r.venue === 'Kaggle' ? 'text-pen-blue' : 'text-ink'}>{r.venue}</span>
                                        {r.date && (
                                            <>
                                                <span aria-hidden="true">·</span>
                                                <span>{r.date}</span>
                                            </>
                                        )}
                                        {r.topic && (
                                            <>
                                                <span aria-hidden="true">·</span>
                                                <span>{r.topic}</span>
                                            </>
                                        )}
                                    </span>
                                </span>
                                <span className="pt-1 font-mono text-[18px] text-ink-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink">
                                    ↗
                                </span>
                            </a>
                        </motion.li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
