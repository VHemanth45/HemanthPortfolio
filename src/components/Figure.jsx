import { motion } from 'framer-motion';
import { Tape } from './hand/Hand';

// A figure pinned to the page: card, tape, caption. Straightens when you hover it.
export default function Figure({ n, caption, tilt = -1.2, children, className = '' }) {
    return (
        <motion.figure
            className={`group relative ${className}`}
            initial={{ opacity: 0, y: 24, rotate: tilt * 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: tilt }}
            whileHover={{ rotate: 0, transition: { duration: 0.4 } }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.2, 0.7, 0.1, 1] }}
        >
            <Tape className="-top-3 left-6 -rotate-6" />
            <Tape className="-top-3 right-6 rotate-[5deg]" />
            <div className="border border-ink/15 bg-paper-card p-3 shadow-[0_18px_40px_-24px_rgb(23_21_15/0.45)] sm:p-4">
                {children}
                <figcaption className="mt-3 flex items-baseline gap-2 font-hand text-[15px] leading-snug text-ink-2">
                    <span className="shrink-0 font-mono text-[11px] text-ink">Fig. {n}</span>
                    <span>{caption}</span>
                </figcaption>
            </div>
        </motion.figure>
    );
}
