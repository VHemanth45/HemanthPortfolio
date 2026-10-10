import { motion } from 'framer-motion';

// Pencil-and-pen marks: arrows, circles and underlines that draw themselves in.

const draw = (delay = 0, duration = 0.9) => ({
    hidden: { pathLength: 0, opacity: 0 },
    show: {
        pathLength: 1,
        opacity: 1,
        transition: { pathLength: { delay, duration, ease: [0.65, 0, 0.35, 1] }, opacity: { delay, duration: 0.01 } },
    },
});

const ARROWS = {
    // Each: [shaft, head] in a 100×60 box, tip at the end of the shaft.
    'curve-left': ['M92 8 C 70 4, 40 14, 16 44', 'M14 30 L16 44 L30 40'],
    'curve-right': ['M8 8 C 30 4, 60 14, 84 44', 'M70 40 L84 44 L86 30'],
    'curve-down': ['M20 4 C 52 6, 70 24, 62 54', 'M52 46 L62 54 L70 43'],
    'loop-down': ['M86 6 C 40 2, 30 30, 54 30 C 74 30, 66 8, 46 16 C 28 24, 22 40, 26 56', 'M18 47 L26 56 L33 46'],
    'short-left': ['M90 30 C 70 22, 40 24, 12 32', 'M22 22 L12 32 L24 40'],
    'short-right': ['M10 30 C 30 22, 60 24, 88 32', 'M78 22 L88 32 L76 40'],
    'up-right': ['M8 54 C 34 54, 62 40, 86 10', 'M72 12 L86 10 L85 24'],
    'up-left': ['M92 54 C 66 54, 38 40, 14 10', 'M15 24 L14 10 L28 12'],
};

export function Arrow({ variant = 'curve-left', className = '', delay = 0, color = 'currentColor', strokeWidth = 1.6 }) {
    const [shaft, head] = ARROWS[variant];
    return (
        <motion.svg
            viewBox="0 0 100 60"
            fill="none"
            aria-hidden="true"
            className={className}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
        >
            <motion.path d={shaft} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" variants={draw(delay, 0.8)} />
            <motion.path d={head} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" variants={draw(delay + 0.7, 0.25)} />
        </motion.svg>
    );
}

// A hand-drawn loop around an inline word: <Circled>fine-tuned</Circled>
export function Circled({ children, delay = 0.9, color = '#d62728', className = '' }) {
    return (
        <span className={`relative inline-block ${className}`}>
            {children}
            <motion.svg
                viewBox="0 0 200 80"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-[9%] -inset-y-[18%] h-[136%] w-[118%] overflow-visible"
                initial="hidden"
                animate="show"
            >
                <motion.path
                    d="M150 9 C 104 -2, 26 4, 9 34 C -6 62, 66 78, 128 72 C 186 66, 204 42, 186 22 C 172 8, 132 4, 96 7"
                    stroke={color}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    variants={draw(delay, 1.1)}
                />
            </motion.svg>
        </span>
    );
}

// Scribbled underline, drawn on scroll.
export function Underline({ children, color = '#ff7f0e', delay = 0.2, className = '' }) {
    return (
        <span className={`relative inline-block ${className}`}>
            {children}
            <motion.svg
                viewBox="0 0 200 14"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-[0.18em] left-0 h-[0.38em] w-full overflow-visible"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
            >
                <motion.path
                    d="M3 9 C 40 4, 80 11, 120 6 C 150 3, 176 8, 197 5"
                    stroke={color}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    variants={draw(delay, 0.7)}
                />
            </motion.svg>
        </span>
    );
}

// Margin note in handwriting.
export function Note({ children, className = '', as: Tag = 'p' }) {
    return <Tag className={`font-hand text-[15px] leading-snug text-ink-2 ${className}`}>{children}</Tag>;
}

// Strip of masking tape for pinned figures.
export function Tape({ className = '' }) {
    return (
        <span
            aria-hidden="true"
            className={`absolute z-10 block h-6 w-24 bg-[#e9dfc4]/80 shadow-[0_1px_1px_rgb(0_0_0/0.06)] backdrop-blur-[1px] ${className}`}
            style={{
                clipPath:
                    'polygon(0 8%, 6% 0, 13% 9%, 21% 1%, 30% 8%, 40% 0, 52% 7%, 63% 1%, 74% 8%, 86% 0, 94% 7%, 100% 2%, 100% 94%, 92% 100%, 82% 92%, 70% 100%, 58% 93%, 46% 100%, 34% 92%, 22% 100%, 12% 93%, 4% 100%, 0 92%)',
            }}
        />
    );
}
