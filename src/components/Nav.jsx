import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EPOCHS, profile } from '../data/content';
import { TrainingMonitor } from './TrainingMonitor';

const LINKS = ['work', 'about', 'writing', 'stack'].map((id) => EPOCHS.find((e) => e.id === id));

export default function Nav({ active }) {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKey);
        };
    }, [open]);

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
                scrolled ? 'border-ink/10 bg-paper/85 backdrop-blur-md' : 'border-transparent bg-transparent'
            }`}
        >
            <nav className="mx-auto flex h-16 max-w-page items-center justify-between px-5 md:px-8" aria-label="Main">
                <a href="#top" className="font-serif text-[27px] leading-none tracking-[-0.01em]" aria-label="Hemanth Vankudoth, back to top">
                    Hemanth<span className="text-plot-orange">.</span>
                </a>

                <TrainingMonitor active={active} />

                <ul className="hidden items-center gap-7 md:flex lg:gap-8">
                    {LINKS.map((link) => (
                        <li key={link.id}>
                            <a
                                href={`#${link.id}`}
                                className={`relative text-[14px] transition-colors ${active === link.id ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
                            >
                                {link.nav}
                                {active === link.id && (
                                    <motion.span layoutId="nav-dot" className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-plot-orange" />
                                )}
                            </a>
                        </li>
                    ))}
                    <li>
                        <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="text-[14px] text-ink-2 transition-colors hover:text-ink">
                            GitHub ↗
                        </a>
                    </li>
                    <li>
                        <a href="#contact" className="btn-ink px-4 py-2 text-[14px]">
                            Let&rsquo;s talk
                        </a>
                    </li>
                </ul>

                <button
                    type="button"
                    className="label -mr-2 p-2 text-ink md:hidden"
                    onClick={() => setOpen(true)}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                >
                    Menu
                </button>
            </nav>

            <AnimatePresence>
                {open && (
                    <motion.div
                        id="mobile-menu"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[70] flex flex-col bg-paper px-5 pb-8 md:hidden"
                    >
                        <div className="flex h-16 items-center justify-between">
                            <span className="font-serif text-[27px] leading-none">
                                Hemanth<span className="text-plot-orange">.</span>
                            </span>
                            <button type="button" className="label -mr-2 p-2 text-ink" onClick={() => setOpen(false)} autoFocus>
                                Close
                            </button>
                        </div>
                        <ul className="mt-8 space-y-1">
                            {EPOCHS.map((e, i) => (
                                <motion.li
                                    key={e.id}
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.04 * i + 0.05 }}
                                >
                                    <a href={`#${e.id}`} onClick={() => setOpen(false)} className="flex items-baseline gap-4 border-b border-ink/10 py-3">
                                        <span className="font-mono text-[11px] text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                                        <span className="font-serif text-[40px] leading-none">{e.nav}</span>
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                        <div className="mt-auto flex gap-3">
                            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="btn-line flex-1">
                                GitHub ↗
                            </a>
                            <a href={`mailto:${profile.email}`} className="btn-ink flex-1">
                                Email me
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
