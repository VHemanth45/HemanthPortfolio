import { motion } from 'framer-motion';

// What Echo does, drawn as a tiny before/after window. Copy is Echo's own example.
const Key = ({ children }) => (
    <kbd className="inline-flex h-7 min-w-7 items-center justify-center border border-ink/30 border-b-[3px] bg-paper-card px-1.5 font-mono text-[12px] text-ink">
        {children}
    </kbd>
);

export default function EchoFigure({ before, after }) {
    return (
        <div className="border border-ink/15 bg-paper-card">
            <div className="flex items-center gap-1.5 border-b border-ink/15 px-3 py-2">
                <span className="h-2 w-2 rounded-full border border-ink/35" />
                <span className="h-2 w-2 rounded-full border border-ink/35" />
                <span className="h-2 w-2 rounded-full border border-ink/35" />
                <span className="ml-2 font-mono text-[11px] text-ink-3">Any app · selected text</span>
            </div>
            <div className="space-y-3 p-4 sm:p-5">
                <div>
                    <div className="label text-[10px]">Before</div>
                    <p className="mt-1.5 bg-[#1f77b4]/10 text-[14px] leading-relaxed text-ink-2">{before}</p>
                </div>
                <motion.div
                    className="flex items-center gap-1.5"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <Key>⌃</Key>
                    <Key>⌥</Key>
                    <Key>E</Key>
                    <span className="ml-2 font-hand text-[15px] text-ink-3">← One hotkey</span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <div className="label text-[10px] text-pen-orange">In your voice</div>
                    <p className="mt-1.5 border-l-2 border-plot-orange pl-3 text-[14px] leading-relaxed text-ink">{after}</p>
                </motion.div>
            </div>
        </div>
    );
}
