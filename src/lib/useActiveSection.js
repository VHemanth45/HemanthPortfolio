import { useEffect, useState } from 'react';

// Id of the section currently crossing the upper third of the viewport.
export function useActiveSection(ids) {
    const [active, setActive] = useState(null);

    useEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            const line = window.innerHeight * 0.35;
            let current = null;
            for (const id of ids) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= line) current = id;
            }
            setActive(current);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [ids]);

    return active;
}
