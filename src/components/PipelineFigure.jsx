import { Fragment } from 'react';
import { motion } from 'framer-motion';

// Architecture diagram, drawn top-to-bottom like a figure in a paper.
// `stages` is a list of rows; each row is a list of nodes { label, sub?, kind? }.
// kind: 'data' (dashed), 'model' (the learned bit), 'llm', 'red' (the adversary), 'out' (what you get).
const KIND = {
    data: 'border-dashed border-ink/45 bg-transparent',
    step: 'border-ink/35 bg-paper-card',
    model: 'border-plot-blue bg-[#1f77b4]/[0.06] shadow-[inset_3px_0_0_#1f77b4]',
    llm: 'border-plot-orange bg-[#ff7f0e]/[0.07] shadow-[inset_3px_0_0_#ff7f0e]',
    red: 'border-plot-red bg-[#d62728]/[0.06] shadow-[inset_3px_0_0_#d62728]',
    out: 'border-ink bg-ink text-paper',
};

const DownArrow = ({ i }) => (
    <motion.svg
        viewBox="0 0 20 28"
        className="mx-auto my-1 h-6 w-4 text-ink/60"
        fill="none"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 + i * 0.12 }}
    >
        <path d="M10 2 C 9 10, 11 16, 10 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5 18 L10 25 L15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
);

export default function PipelineFigure({ stages, label }) {
    return (
        <div className="relative bg-[linear-gradient(to_right,rgb(31_119_180/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(31_119_180/0.06)_1px,transparent_1px)] bg-[size:16px_16px] px-3 py-5 sm:px-6 sm:py-7">
            {label && <span className="label absolute left-3 top-2 text-[10px]">{label}</span>}
            {stages.map((row, i) => (
                <Fragment key={i}>
                    {i > 0 && <DownArrow i={i} />}
                    <motion.div
                        className="flex flex-wrap justify-center gap-2"
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + i * 0.12, duration: 0.5 }}
                    >
                        {row.map((node) => (
                            <div
                                key={node.label}
                                className={`min-w-[7.5rem] max-w-[14rem] flex-1 border px-3 py-2 text-center sm:flex-none ${KIND[node.kind || 'step']}`}
                            >
                                <div className="font-mono text-[11.5px] font-medium leading-tight sm:text-[12px]">{node.label}</div>
                                {node.sub && (
                                    <div className={`mt-1 text-[11px] leading-snug ${node.kind === 'out' ? 'text-paper/70' : 'text-ink-3'}`}>{node.sub}</div>
                                )}
                            </div>
                        ))}
                    </motion.div>
                </Fragment>
            ))}
        </div>
    );
}
