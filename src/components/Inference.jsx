import { useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/content';
import SectionHeader from './SectionHeader';
import Magnetic from './Magnetic';
import Repl from './Repl';
import { Arrow, Note } from './hand/Hand';

const SOCIALS = [
    ['linkedin', 'LinkedIn'],
    ['github', 'GitHub'],
    ['kaggle', 'Kaggle'],
    ['medium', 'Medium'],
    ['x', 'X / Twitter'],
];

export default function Inference() {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(profile.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            window.location.href = `mailto:${profile.email}`;
        }
    };

    return (
        <section id="contact" className="mx-auto max-w-page px-5 pb-24 pt-20 md:px-8 md:pb-28 md:pt-24" data-herd="the contact section">
            <SectionHeader id="contact" />

            <motion.h2
                className="mt-12 font-serif text-[clamp(3rem,9vw,8.2rem)] leading-[0.9] tracking-[-0.03em]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
            >
                Got messy data
                <br />
                and <span className="italic">a hard question?</span>
            </motion.h2>

            <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-16">
                <div className="min-w-0 lg:col-span-6">
                    <p className="max-w-[32rem] text-pretty text-[18px] leading-relaxed text-ink-2">{profile.contactBlurb}</p>

                    <div className="relative mt-9 flex flex-wrap items-stretch gap-2" data-herd="the email button" data-herd-say="Go on — send the email." data-herd-codex="I’d send it.">
                        <Magnetic max={7}>
                            <a href={`mailto:${profile.email}`} className="btn-ink px-6 py-4 text-[16px]">
                                {profile.email} <span aria-hidden="true">↗</span>
                            </a>
                        </Magnetic>
                        <button type="button" onClick={copy} className="btn-line px-4 py-4 font-mono text-[13px]" aria-live="polite">
                            {copied ? 'Copied ✓' : 'Copy'}
                        </button>
                        <div className="pointer-events-none absolute -right-2 top-full hidden items-start gap-1 pt-2 sm:flex lg:-right-44 lg:top-1/2 lg:-translate-y-1/2 lg:pt-0">
                            <Arrow variant="short-left" delay={0.4} className="h-8 w-12 text-ink-3" />
                            <Note className="w-36 text-ink-3">Fastest way to reach me. I actually read these.</Note>
                        </div>
                    </div>

                    <ul className="mt-16 flex flex-wrap gap-2 sm:mt-10">
                        {SOCIALS.map(([key, label]) => (
                            <li key={key}>
                                <a href={profile.links[key]} target="_blank" rel="noopener noreferrer" className="btn-line px-4 py-2 text-[14px]">
                                    {label} <span aria-hidden="true">↗</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <motion.div
                    className="min-w-0 self-end lg:col-span-5 lg:col-start-8"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7 }}
                    data-herd="the REPL"
                    data-herd-say="Psst — type help()."
                    data-herd-codex="I’d start with help()."
                >
                    <Repl />
                </motion.div>
            </div>
        </section>
    );
}
