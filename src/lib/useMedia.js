import { useSyncExternalStore } from 'react';

// Whether a media query matches, kept up to date.
export function useMedia(query) {
    return useSyncExternalStore(
        (onChange) => {
            const m = window.matchMedia(query);
            m.addEventListener('change', onChange);
            return () => m.removeEventListener('change', onChange);
        },
        () => window.matchMedia(query).matches,
        () => false,
    );
}

export const FINE_POINTER = '(hover: hover) and (pointer: fine)';
