import { motion } from 'framer-motion';
import { EPOCHS } from '../data/content';

// "EPOCH 02/06 ─────────── EXPERIMENTS" rule that opens every section.
export default function SectionHeader({ id }) {
    const index = EPOCHS.findIndex((e) => e.id === id);
    const epoch = EPOCHS[index];
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="label flex items-center gap-4"
        >
            <span className="text-ink">
                Epoch {String(index + 1).padStart(2, '0')}
                <span className="text-ink-3">/{String(EPOCHS.length).padStart(2, '0')}</span>
            </span>
            <motion.span
                aria-hidden="true"
                className="h-px flex-1 origin-left bg-ink/25"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
            />
            <span>{epoch.label}</span>
        </motion.div>
    );
}
