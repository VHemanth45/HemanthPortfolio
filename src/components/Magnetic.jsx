import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

// Leans toward the cursor while it's over the element, then springs back. Mouse only.
export default function Magnetic({ children, strength = 0.22, max = 9, className = '' }) {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
    const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });
    const cap = (v) => Math.max(-max, Math.min(max, v));

    const onMove = (e) => {
        if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set(cap((e.clientX - (r.left + r.width / 2)) * strength));
        y.set(cap((e.clientY - (r.top + r.height / 2)) * strength));
    };
    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.span ref={ref} className={`inline-flex ${className}`} style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset}>
            {children}
        </motion.span>
    );
}
