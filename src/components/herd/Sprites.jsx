// Two pixel agents on a 12×9 grid. Original drawings: a coral critter for Claude,
// a little terminal on legs for Codex. `eyesRef` lets the cursor layer move the eyes.

const Legs = ({ fill }) => (
    <>
        <g className="herd-legs-a" fill={fill}>
            <rect x="2" y="7" width="1" height="2" />
            <rect x="7" y="7" width="1" height="2" />
        </g>
        <g className="herd-legs-b" fill={fill}>
            <rect x="4" y="7" width="1" height="2" />
            <rect x="9" y="7" width="1" height="2" />
        </g>
    </>
);

export function ClaudeSprite({ eyesRef, size = 36 }) {
    return (
        <svg viewBox="0 0 12 9" width={size} height={(size * 9) / 12} shapeRendering="crispEdges" aria-hidden="true" className="block overflow-visible">
            <g fill="#d97757">
                <rect x="2" y="0" width="8" height="1" />
                <rect x="1" y="1" width="10" height="5" />
                <rect x="0" y="2" width="1" height="3" />
                <rect x="11" y="2" width="1" height="3" />
                <rect x="2" y="6" width="8" height="1" />
            </g>
            <g ref={eyesRef}>
                <g className="herd-blink" fill="#17150f">
                    <rect x="3" y="2" width="2" height="2" />
                    <rect x="7" y="2" width="2" height="2" />
                </g>
            </g>
            <Legs fill="#d97757" />
        </svg>
    );
}

// `onDark` lifts the body off a dark background (it's ink-coloured on paper).
export function CodexSprite({ eyesRef, size = 36, onDark = false }) {
    const body = onDark ? '#45423b' : '#17150f';
    return (
        <svg viewBox="0 0 12 9" width={size} height={(size * 9) / 12} shapeRendering="crispEdges" aria-hidden="true" className="block overflow-visible">
            <g fill={body}>
                <rect x="2" y="0" width="8" height="1" />
                <rect x="1" y="1" width="10" height="5" />
                <rect x="2" y="6" width="8" height="1" />
            </g>
            {/* the face is a prompt: > and a blinking _ */}
            <g ref={eyesRef}>
                <g fill="#10a37f">
                    <rect x="3" y="2" width="1" height="1" />
                    <rect x="4" y="3" width="1" height="1" />
                    <rect x="3" y="4" width="1" height="1" />
                    <rect className="herd-caret" x="6" y="4" width="3" height="1" />
                </g>
            </g>
            <Legs fill={body} />
        </svg>
    );
}

export function Sprite({ id, onDark, ...props }) {
    return id === 'claude' ? <ClaudeSprite {...props} /> : <CodexSprite onDark={onDark} {...props} />;
}
