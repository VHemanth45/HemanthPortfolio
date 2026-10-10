import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { experiments, runs, RUN_FILTERS, shipped } from '../data/content';
import SectionHeader from './SectionHeader';
import Figure from './Figure';
import PipelineFigure from './PipelineFigure';
import BarFigure from './BarFigure';
import EchoFigure from './EchoFigure';
import HerdrFigure from './HerdrFigure';
import { Note } from './hand/Hand';

function FigureBody({ figure }) {
    switch (figure.type) {
        case 'herdr':
            return <HerdrFigure figure={figure} />;
        case 'image':
            return (
                <img
                    src={figure.src}
                    alt={figure.alt}
                    width={figure.width}
                    height={figure.height}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full border border-ink/10"
                />
            );
        case 'bars':
            return <BarFigure {...figure} />;
        case 'echo':
            return <EchoFigure before={figure.before} after={figure.after} />;
        default:
            return <PipelineFigure stages={figure.stages} label="Architecture" />;
    }
}

const Links = ({ links, note }) => (
    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        {links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link-u font-mono text-[13px]">
                {l.label} ↗
            </a>
        ))}
        {note && <Note className="text-ink-3">{note}</Note>}
    </div>
);

function ExperimentCard({ exp, index }) {
    const flip = index % 2 === 1;
    return (
        <article id={exp.anchor} className="grid gap-x-14 gap-y-10 lg:grid-cols-12" data-herd={exp.title} data-herd-say={exp.herd?.claude} data-herd-codex={exp.herd?.codex}>
            <div className="label flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-ink/20 pt-4 lg:col-span-12">
                <span className="text-ink">Exp-{String(index + 1).padStart(2, '0')}</span>
                <span aria-hidden="true">·</span>
                <span className="normal-case tracking-normal">{exp.repo}</span>
                <span className="ml-auto flex items-center gap-3">
                    <span>{exp.domain}</span>
                    <span aria-hidden="true">·</span>
                    <span>{exp.year}</span>
                </span>
            </div>

            <div className={`min-w-0 lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
                <Figure n={index + 2} caption={exp.caption} tilt={flip ? 1.1 : -1.1}>
                    <FigureBody figure={exp.figure} />
                </Figure>
            </div>

            <motion.div
                className={`min-w-0 lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: 0.1 }}
            >
                <h3 className="font-serif text-[clamp(2.3rem,4.2vw,3.4rem)] leading-[0.98] tracking-[-0.015em]">{exp.title}</h3>
                <p className="mt-4 text-pretty text-[17px] leading-relaxed text-ink-2">{exp.summary}</p>

                <dl className="mt-8 border-t border-ink/15">
                    {exp.spec.map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 border-b border-ink/15 py-3 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
                            <dt className="label pt-[3px]">{k}</dt>
                            <dd className="text-pretty text-[15px] leading-relaxed text-ink">{v}</dd>
                        </div>
                    ))}
                    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 border-b border-ink/15 py-3 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
                        <dt className="label pt-[5px]">Stack</dt>
                        <dd className="flex flex-wrap gap-1.5">
                            {exp.stack.map((s) => (
                                <span key={s} className="border border-ink/20 bg-paper-card px-2 py-0.5 font-mono text-[11.5px] text-ink-2">
                                    {s}
                                </span>
                            ))}
                        </dd>
                    </div>
                </dl>

                <Links links={exp.links} note={exp.note} />
            </motion.div>
        </article>
    );
}

// Tools and apps that shipped, beyond the models.
function Shipped({ offset }) {
    return (
        <div className="mt-28 md:mt-36">
            <div className="label flex items-center gap-4 border-t border-ink/20 pt-4">
                <span className="text-ink">Also shipped</span>
                <span className="normal-case tracking-normal text-ink-3">— tools &amp; apps, not just models</span>
            </div>
            <div className="mt-12 space-y-20">
                {shipped.map((s, i) => (
                    <article key={s.title} className="grid items-center gap-x-14 gap-y-10 lg:grid-cols-12" data-herd={s.title}>
                        <div className="min-w-0 lg:col-span-6">
                            <Figure n={offset + i} caption={s.caption} tilt={i % 2 ? 1 : -1}>
                                <FigureBody figure={s.figure} />
                            </Figure>
                        </div>
                        <div className="min-w-0 lg:col-span-5 lg:col-start-8">
                            <div className="label flex items-center gap-3">
                                <span>{s.kind}</span>
                                <span aria-hidden="true">·</span>
                                <span>{s.year}</span>
                            </div>
                            <h3 className="mt-2 font-serif text-[clamp(2.3rem,4.2vw,3.4rem)] leading-none tracking-[-0.015em]">{s.title}</h3>
                            <p className="mt-4 text-pretty text-[17px] leading-relaxed text-ink-2">{s.summary}</p>
                            <ul className="mt-5 flex flex-wrap gap-1.5">
                                {s.facts.map((f) => (
                                    <li key={f} className="border border-ink/20 bg-paper-card px-2 py-0.5 font-mono text-[11.5px] text-ink-2">
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Links links={s.links} />
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

// Every project as rows in an experiment tracker.
function RunsTable() {
    const [filter, setFilter] = useState('all');
    const visible = runs.filter((r) => filter === 'all' || r.tags.includes(filter));

    return (
        <div className="mt-28 md:mt-36" data-herd="the runs table" data-herd-codex="Running the test suites…">
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <h3 className="font-serif text-[clamp(2rem,3.6vw,2.8rem)] leading-none">
                        All runs <span className="italic text-ink-3">({runs.length})</span>
                    </h3>
                    <Note className="mt-2 text-ink-3">Every project, logged the way an experiment tracker would.</Note>
                </div>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter runs">
                    {RUN_FILTERS.map((f) => (
                        <button
                            key={f.id}
                            type="button"
                            onClick={() => setFilter(f.id)}
                            aria-pressed={filter === f.id}
                            className={`border px-3 py-1.5 font-mono text-[12px] transition-colors ${
                                filter === f.id ? 'border-ink bg-ink text-paper' : 'border-ink/25 text-ink-2 hover:border-ink hover:text-ink'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-8 border-t border-ink">
                <div className="label hidden grid-cols-[2.25rem_1.3fr_2fr_1.5fr_3.5rem] gap-4 border-b border-ink/20 py-2.5 md:grid">
                    <span />
                    <span>Run</span>
                    <span>What it does</span>
                    <span>Method · signal</span>
                    <span className="text-right">Year</span>
                </div>
                <AnimatePresence initial={false}>
                    {visible.map((r) => (
                        <motion.a
                            key={r.name}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            href={r.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group grid grid-cols-[1.5rem_minmax(0,1fr)_auto] gap-x-3 gap-y-1 border-b border-ink/15 py-4 transition-colors hover:bg-ink/[0.03] md:grid-cols-[2.25rem_1.3fr_2fr_1.5fr_3.5rem] md:items-baseline md:gap-4 ${
                                r.tags.includes('early') ? 'opacity-75 hover:opacity-100' : ''
                            }`}
                        >
                            <span
                                className="mt-[7px] h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-150 md:mt-0 md:translate-y-[1px] md:self-baseline"
                                style={{ background: r.color }}
                                aria-hidden="true"
                            />
                            <span className="break-words font-mono text-[14px] text-ink group-hover:text-pen-blue">
                                {r.name} <span className="inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                            </span>
                            <span className="text-right font-mono text-[12px] text-ink-3 md:hidden">{r.year}</span>
                            <span className="col-start-2 col-end-4 text-[15px] leading-snug text-ink-2 md:col-auto">{r.what}</span>
                            <span className="col-start-2 col-end-4 font-mono text-[12px] leading-snug text-ink-3 md:col-auto">{r.method}</span>
                            <span className="hidden text-right font-mono text-[12px] text-ink-3 md:block">{r.year}</span>
                        </motion.a>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function Experiments() {
    return (
        <section id="work" className="mx-auto max-w-page px-5 py-20 md:px-8 md:py-24">
            <SectionHeader id="work" />

            <div className="mt-10 flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
                <motion.h2
                    className="max-w-[15ch] font-serif text-[clamp(2.6rem,6vw,5rem)] leading-[0.95] tracking-[-0.02em]"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    Experiments that made it <span className="italic">out of the notebook.</span>
                </motion.h2>
                <Note className="max-w-[17rem] -rotate-1 pb-2 text-ink-3">(The ones that didn&rsquo;t are still on my hard drive, being &ldquo;almost done&rdquo;.)</Note>
            </div>

            <div className="mt-20 space-y-28 md:space-y-36">
                {experiments.map((exp, i) => (
                    <ExperimentCard key={exp.repo} exp={exp} index={i} />
                ))}
            </div>

            <Shipped offset={experiments.length + 2} />

            <RunsTable />
        </section>
    );
}
