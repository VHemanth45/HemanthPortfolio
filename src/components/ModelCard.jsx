import { motion } from 'framer-motion';
import { deployments, modelCard, profile } from '../data/content';
import SectionHeader from './SectionHeader';
import Figure from './Figure';
import { Arrow, Note } from './hand/Hand';

// Work history as a deployment dashboard: where the model runs in production.
function Deployments() {
    return (
        <motion.div
            className="mt-12"
            data-herd="the deployments"
            data-herd-say="Serving in production. Nice."
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <span className="label text-ink">Deployments</span>
                <Note className="text-ink-3">Where the model runs in production</Note>
            </div>
            <ul className="mt-3 border-y border-ink/80">
                {deployments.map((d) => {
                    const live = d.status === 'serving';
                    const org = d.href ? (
                        <a href={d.href} target="_blank" rel="noopener noreferrer" className="link-u decoration-ink/20">
                            {d.org}
                        </a>
                    ) : (
                        d.org
                    );
                    return (
                        <li
                            key={d.org}
                            className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-2 border-b border-ink/10 py-5 last:border-b-0 sm:grid-cols-[8.5rem_minmax(0,1fr)_auto]"
                        >
                            <span className="col-span-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] sm:col-span-1">
                                {live ? (
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-plot-green opacity-50 motion-safe:animate-ping" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-plot-green" />
                                    </span>
                                ) : (
                                    <span className="text-ink-3" aria-hidden="true">
                                        ✓
                                    </span>
                                )}
                                <span className={live ? 'text-pen-green' : 'text-ink-3'}>{d.status}</span>
                            </span>
                            <span>
                                <span className="font-serif text-[30px] leading-none tracking-[-0.01em]">{org}</span>
                                <span className="ml-3 text-[16px] text-ink-2">{d.role}</span>
                                {d.sub && <span className="mt-1 block font-mono text-[12px] text-ink-3">{d.sub}</span>}
                            </span>
                            <span className="font-mono text-[12px] tabular-nums text-ink-3">{d.when}</span>
                        </li>
                    );
                })}
            </ul>
        </motion.div>
    );
}

export default function ModelCard() {
    return (
        <section id="about" className="mx-auto max-w-page px-5 py-20 md:px-8 md:py-24" data-herd="the model card">
            <SectionHeader id="about" />

            <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-16">
                <div className="min-w-0 lg:col-span-4">
                    <div className="mx-auto max-w-[22rem] lg:sticky lg:top-28" data-herd="the photo" data-herd-say="Nice sunglasses.">
                        <Figure n={0} caption={profile.photoCaption} tilt={-2}>
                            <img
                                src={profile.photo.src}
                                alt={profile.photo.alt}
                                width={profile.photo.width}
                                height={profile.photo.height}
                                loading="lazy"
                                decoding="async"
                                className="block aspect-[4/5] h-auto w-full object-cover object-[50%_35%]"
                            />
                        </Figure>
                        <div className="mt-6 hidden items-start gap-2 pl-4 lg:flex">
                            <Arrow variant="curve-left" delay={0.3} className="mt-1 h-8 w-12 shrink-0 -scale-y-100 text-ink-3" />
                            <Note className="text-ink-3">The only model I train that needs sunglasses.</Note>
                        </div>
                    </div>
                </div>

                <div className="min-w-0 lg:col-span-8">
                    <motion.h2
                        className="font-serif text-[clamp(2.6rem,6vw,5rem)] leading-[0.95] tracking-[-0.02em]"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        The model behind <span className="italic">the models.</span>
                    </motion.h2>

                    <div className="mt-8 max-w-[40rem] space-y-5 text-pretty text-[17px] leading-relaxed text-ink-2 md:text-[18px]">
                        {modelCard.bio.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>

                    <Deployments />

                    {/* Hugging Face–style model card */}
                    <motion.div
                        className="mt-14 border border-ink/80 bg-paper-card shadow-[6px_6px_0_rgb(23_21_15/0.9)]"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/80 px-4 py-3 sm:px-5">
                            <span className="font-mono text-[13px]">
                                <span className="text-ink-3">{profile.handle}/</span>
                                <span className="font-semibold">{modelCard.id}</span>
                            </span>
                            <span className="label text-[10px]">Model card · v{new Date().getFullYear()}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 border-b border-ink/15 px-4 py-3 sm:px-5">
                            {modelCard.tags.map((t) => (
                                <span key={t} className="bg-ink/[0.06] px-2 py-0.5 font-mono text-[11.5px] text-ink-2">
                                    {t}
                                </span>
                            ))}
                        </div>
                        <dl>
                            {modelCard.rows.map(([k, v]) => (
                                <div key={k} className="grid gap-1 border-b border-ink/10 px-4 py-3 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-6 sm:px-5">
                                    <dt className="font-mono text-[12px] text-ink-3 sm:pt-[3px]">{k}</dt>
                                    <dd className="text-pretty text-[15px] leading-relaxed">{v}</dd>
                                </div>
                            ))}
                        </dl>
                        <div className="border-t border-ink/80 bg-ink px-4 py-4 font-mono text-[12.5px] leading-[1.8] text-paper/90 sm:px-5">
                            <div className="label mb-1 text-[10px] text-paper/50">How to get started with the model</div>
                            {modelCard.usage.map((l, i) => (
                                <div key={i} className="whitespace-pre-wrap [overflow-wrap:anywhere]">
                                    {l.startsWith('#') ? <span className="text-paper/45">{l}</span> : l.startsWith('>>>') ? (
                                        <>
                                            <span className="text-plot-orange">&gt;&gt;&gt;</span>
                                            {l.slice(3)}
                                        </>
                                    ) : (
                                        <span className="text-[#8fc6ea]">{l}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
