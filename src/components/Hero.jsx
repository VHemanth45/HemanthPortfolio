import { motion } from 'framer-motion';
import { profile } from '../data/content';
import { Circled, Underline } from './hand/Hand';
import LossChart from './LossChart';
import Magnetic from './Magnetic';

const rise = {
    hidden: { y: '105%' },
    show: (i) => ({ y: '0%', transition: { delay: 0.12 + i * 0.09, duration: 0.9, ease: [0.2, 0.7, 0.1, 1] } }),
};

const Line = ({ i, children, className = '' }) => (
    <span className={`block overflow-hidden pb-[0.08em] ${className}`}>
        <motion.span className="block" custom={i} variants={rise}>
            {children}
        </motion.span>
    </span>
);

const ELSEWHERE = [
    ['LinkedIn', profile.links.linkedin],
    ['GitHub', profile.links.github],
    ['Kaggle', profile.links.kaggle],
];

export default function Hero() {
    return (
        <section id="top" className="relative mx-auto max-w-page px-5 pb-10 pt-28 md:px-8 md:pt-32">
            <motion.div
                className="label flex flex-wrap items-center gap-x-3 gap-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <img
                    src={profile.photo.src}
                    alt=""
                    width="28"
                    height="28"
                    decoding="async"
                    className="h-7 w-7 rounded-full border border-ink/20 object-cover object-[50%_28%]"
                />
                <span className="text-ink">{profile.name}</span>
                <span aria-hidden="true">/</span>
                <span>{profile.role}</span>
                <span aria-hidden="true">/</span>
                <span>{profile.school}</span>
            </motion.div>

            <div className="mt-10 grid items-center gap-16 lg:mt-12 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
                <div>
                    <motion.h1
                        className="font-serif text-[clamp(2.75rem,5.4vw,4.85rem)] leading-[0.95] tracking-[-0.022em]"
                        initial="hidden"
                        animate="show"
                    >
                        <Line i={0}>Pretrained on</Line>
                        <Line i={1}>mechanical engineering.</Line>
                        <Line i={2} className="relative overflow-visible">
                            <span className="italic">
                                <Circled delay={1.25}>Fine-tuned</Circled>
                            </span>{' '}
                            on
                        </Line>
                        <Line i={3} className="-mb-[0.18em] !pb-[0.26em]">
                            <Underline color="#1f77b4" delay={1.7}>
                                machine learning.
                            </Underline>
                        </Line>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.75, duration: 0.8 }}
                    >
                        <p className="mt-8 max-w-[34rem] text-pretty text-[17px] leading-relaxed text-ink-2 md:text-[18px]">{profile.intro}</p>

                        <div className="mt-9 flex flex-wrap items-center gap-3">
                            <Magnetic>
                                <a href="#work" className="btn-ink">
                                    See the experiments <span aria-hidden="true">↓</span>
                                </a>
                            </Magnetic>
                            <Magnetic>
                                <a href="#contact" className="btn-line">
                                    Let&rsquo;s talk <span aria-hidden="true">→</span>
                                </a>
                            </Magnetic>
                        </div>

                        <p className="mt-8 flex items-center gap-2 font-mono text-[12px] text-ink-2">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-plot-green opacity-50" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-plot-green" />
                            </span>
                            {profile.status}
                        </p>
                        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[12px] text-ink-3">
                            <span>Elsewhere:</span>
                            {ELSEWHERE.map(([label, href]) => (
                                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="link-u text-ink-2 hover:text-ink">
                                    {label} ↗
                                </a>
                            ))}
                        </p>
                    </motion.div>
                </div>

                <div className="relative pt-4 lg:pt-0">
                    <LossChart />
                </div>
            </div>

            <motion.a
                href="#work"
                className="label mt-14 hidden items-center gap-3 lg:inline-flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.4 }}
            >
                <motion.span animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
                    ↓
                </motion.span>
                Scroll to keep training
            </motion.a>
        </section>
    );
}
