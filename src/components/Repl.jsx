import { useEffect, useRef, useState } from 'react';
import { experiments, modelCard, profile } from '../data/content';
import { herd } from '../lib/herd';

// A small, honest-to-goodness REPL: type at it. It knows a handful of commands, does
// arithmetic, and answers hemanth.predict() with suspicious confidence.

const str = (s) => ({ k: 'str', t: `'${s.replace(/'/g, "\\'")}'` });
const com = (t) => ({ k: 'com', t: `# ${t}` });
const out = (t) => ({ k: 'out', t });
const err = (t) => ({ k: 'err', t });

const SEED = [
    { k: 'in', t: `hemanth = Engineer.from_pretrained("${profile.handle}")` },
    { k: 'in', t: 'hemanth.predict("Should we work together?")' },
    str('Yes.'),
    com('p = 0.98 — and yes, it’s calibrated.'),
    com('Your turn: type help() and press Enter.'),
];

const SUGGEST = ['help()', 'hemanth.now()', 'hemanth.predict("Can you join our team?")', 'agents()', 'import this'];

const HELP = [
    com('Things to try:'),
    out('hemanth.predict("…")   ask the model anything'),
    out('hemanth.now()          what I’m doing now'),
    out('hemanth.projects()     featured experiments'),
    out('hemanth.stack          what I reach for'),
    out('hemanth.contact()      how to reach me'),
    out('agents()               the two agents on this page'),
    out('clear()                start over'),
];

const ZEN = [
    com('The Zen of Hemanth'),
    out('Baselines first.'),
    out('Hold data out.'),
    out('More than one seed beats one lucky one.'),
    out('Write down what didn’t work.'),
    out('If it only runs in the notebook, it doesn’t run.'),
    out('Ship it — then measure it.'),
];

const ANSWERS = [
    'Depends on the data. Send it over.',
    'Ship a baseline first. Then we talk.',
    'Yes — after an honest eval.',
    'Probably. Run more than one seed.',
    'Not with that validation set.',
];

const hash = (s) => {
    let h = 2166136261;
    for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return h >>> 0;
};

function predict(q) {
    const text = q.trim();
    if (!text) return [err('ValueError: the model needs an input.')];
    if (/hir(e|ing)|work (with|together)|join|team|role|job|position|interview|collab|contract|freelanc|available/i.test(text)) {
        return [str('Yes.'), com('p = 0.98 — calibrated, as always.')];
    }
    if (/coffee|chai|tea\b/i.test(text)) return [str('Always.'), com('p = 1.00')];
    if (/\bagi\b|sentient|conscious/i.test(text)) return [str('Not yet. But the baseline is ready.')];
    const h = hash(text.toLowerCase());
    return [str(ANSWERS[h % ANSWERS.length]), com(`p = 0.${70 + (h % 26)}`)];
}

class ZeroDivision extends Error {}
class Overflow extends Error {}

// + - * / % ** and parentheses, Python-style: "/" always gives a float.
function calc(src) {
    if (/[\d.]\s+[\d.]/.test(src)) throw new SyntaxError(); // "2 3" is not 23
    const s = src.replace(/\s+/g, '');
    let i = 0;
    const fail = () => {
        throw new SyntaxError();
    };
    const atom = () => {
        if (s[i] === '(') {
            i++;
            const v = sum();
            if (s[i++] !== ')') fail();
            return v;
        }
        const m = /^\d+(\.\d+)?/.exec(s.slice(i));
        if (!m) fail();
        i += m[0].length;
        return parseFloat(m[0]);
    };
    // ** binds tighter than a leading minus, and its exponent may be negative: -2**2 == -4, 2**-1 == 0.5
    const power = () => {
        const v = atom();
        if (s.startsWith('**', i)) {
            i += 2;
            const e = unary();
            if (v === 0 && e < 0) throw new ZeroDivision('0.0 cannot be raised to a negative power');
            return v ** e;
        }
        return v;
    };
    const unary = () => {
        if (s[i] === '-') {
            i++;
            return -unary();
        }
        if (s[i] === '+') {
            i++;
            return unary();
        }
        return power();
    };
    const product = () => {
        let v = unary();
        while ((s[i] === '*' && s[i + 1] !== '*') || s[i] === '/' || s[i] === '%') {
            const op = s[i++];
            const r = unary();
            if (op !== '*' && r === 0) throw new ZeroDivision('division by zero');
            v = op === '*' ? v * r : op === '/' ? v / r : ((v % r) + r) % r;
        }
        return v;
    };
    const sum = () => {
        let v = product();
        while (s[i] === '+' || s[i] === '-') v = s[i++] === '+' ? v + product() : v - product();
        return v;
    };
    const v = sum();
    if (i !== s.length) fail();
    if (!Number.isFinite(v)) throw new Overflow();
    return Number.isInteger(v) && /[/.]/.test(s) ? v.toFixed(1) : String(v);
}

function agentsOut() {
    const s = herd.get();
    if (!s.enabled) return [com('The agents are asleep. Wake them from the live figure in the experiments.')];
    return ['claude', 'codex'].map((id) => {
        const v = s[id];
        return out(`${id.padEnd(7)} ${v.state.padEnd(8)} ${String(Math.round(v.used)).padStart(3)}% of limit · ctx ${Math.round(v.ctx * 100)}% · ${v.doing || '—'}`);
    });
}

const short = (url) => url.replace(/^https?:\/\/(www\.)?/, '');

function run(src) {
    const c = src.trim().replace(/\s+/g, ' ');
    const p = /^hemanth\.predict\(\s*(["'])(.*)\1\s*\)$/i.exec(c);
    if (p) return predict(p[2]);
    if (/^hemanth\.predict\b/i.test(c)) return [err('TypeError: predict() takes a string, like hemanth.predict("…")')];
    const pr = /^print\(\s*(["'])(.*)\1\s*\)$/.exec(c);
    if (pr) return [out(pr[2])];
    if (/^[\d\s+\-*/%().]+$/.test(c) && /\d/.test(c)) {
        try {
            return [out(calc(c))];
        } catch (e) {
            if (e instanceof ZeroDivision) return [err(`ZeroDivisionError: ${e.message}`)];
            if (e instanceof Overflow) return [err('OverflowError: that’s a big number')];
            if (e instanceof RangeError) return [err('RecursionError: maximum recursion depth exceeded')];
            return [err('SyntaxError: invalid syntax')];
        }
    }
    const key = c.toLowerCase().replace(/\(\s*\)$/, '');
    switch (key) {
        case 'help':
            return HELP;
        case 'hemanth':
            return [out(`<Engineer '${profile.handle}': AI/ML · data scientist @ PlayVision>`)];
        case 'hemanth.now':
            return [str('Data Scientist @ PlayVision')];
        case 'hemanth.stack':
        case 'hemanth.skills':
            return [out(`[${modelCard.tags.filter((t) => !t.includes(':')).map((t) => `'${t}'`).join(', ')}]`)];
        case 'hemanth.projects':
            return [out(`[${experiments.map((e) => `'${e.title}'`).join(', ')}]`), com('Scroll up to Experiments for the write-ups.')];
        case 'hemanth.contact':
        case 'contact':
            return [out(`{'email': '${profile.email}',`), out(` 'linkedin': '${short(profile.links.linkedin)}',`), out(` 'github': '${short(profile.links.github)}'}`)];
        case 'hire(hemanth)':
        case 'hemanth.hire':
        case 'hire':
            return [str('Excellent choice.'), com(`→ ${profile.email}`)];
        case 'whoami':
            return [str(`${profile.name} — AI/ML engineer, IIT (BHU) ’26`)];
        case 'agents':
        case 'herd':
            return agentsOut();
        case 'import this':
            return ZEN;
        case 'import antigravity':
            return [com('You’re flying. Now try hemanth.predict("…").')];
        case 'exit':
        case 'quit':
            return [str('Nice try. The only way out is the email button.')];
        default:
    }
    if (/^(ls|cd|pwd|sudo|rm|git|npm|pip|cat|echo)\b/i.test(c)) return [err('This is Python, not bash — but nice reflexes.')];
    const name = /^[a-z_]\w*/i.exec(c);
    if (name) return [err(`NameError: name '${name[0]}' is not defined. Try help()`)];
    return [err('SyntaxError: invalid syntax. Try help()')];
}

const TONE = { in: 'text-paper/90', out: 'text-paper/85', str: 'text-[#8fc6ea]', com: 'text-paper/45', err: 'text-[#ff9a8f]' };

export default function Repl() {
    const ids = useRef(0);
    const tag = (rows) => rows.map((r) => ({ ...r, id: ++ids.current }));
    const [lines, setLines] = useState(() => tag(SEED));
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const history = useRef([]);
    const cursor = useRef(0);
    const log = useRef(null);
    const field = useRef(null);
    const timer = useRef(0);

    useEffect(() => {
        if (log.current) log.current.scrollTop = log.current.scrollHeight;
    }, [lines]);
    useEffect(() => () => clearInterval(timer.current), []);

    const exec = (src) => {
        const c = src.trim();
        if (c) {
            history.current = [...history.current, c].slice(-50);
            cursor.current = history.current.length;
        }
        if (/^(clear|cls)(\(\s*\))?$/i.test(c)) {
            setLines([]);
            return;
        }
        const rows = tag([{ k: 'in', t: c }, ...(c ? run(c) : [])]);
        setLines((prev) => [...prev, ...rows].slice(-80));
    };

    const submit = (e) => {
        e.preventDefault();
        if (typing) return;
        exec(input);
        setInput('');
    };

    const onKey = (e) => {
        const h = history.current;
        if (e.key === 'ArrowUp' && h.length) {
            e.preventDefault();
            cursor.current = Math.max(0, cursor.current - 1);
            setInput(h[cursor.current]);
        } else if (e.key === 'ArrowDown' && h.length) {
            e.preventDefault();
            cursor.current = Math.min(h.length, cursor.current + 1);
            setInput(h[cursor.current] ?? '');
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            setLines([]);
        }
    };

    // Suggestions type themselves out, then run.
    const suggest = (cmd) => {
        if (typing) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            exec(cmd);
            return;
        }
        setTyping(true);
        let n = 0;
        timer.current = setInterval(() => {
            n += 1;
            setInput(cmd.slice(0, n));
            if (n >= cmd.length) {
                clearInterval(timer.current);
                setTimeout(() => {
                    exec(cmd);
                    setInput('');
                    setTyping(false);
                }, 160);
            }
        }, 22);
    };

    return (
        <div>
            <div
                className="border border-ink/80 bg-ink p-5 font-mono text-[13px] leading-[1.75] text-paper/90 shadow-[6px_6px_0_rgb(255_127_14/0.9)] [overflow-wrap:anywhere] focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-plot-blue"
                onClick={(e) => {
                    if (!window.getSelection()?.toString() && e.target.tagName !== 'BUTTON') field.current?.focus();
                }}
            >
                <div className="label mb-2 flex items-center justify-between text-[10px] text-paper/50">
                    <span>Inference · Python 3</span>
                    <span className="normal-case tracking-normal">Try help()</span>
                </div>
                <div ref={log} className="max-h-[19rem] overflow-y-auto pr-1 [scrollbar-width:thin]" role="log" aria-live="polite" aria-label="Python session">
                    {lines.map((l) =>
                        l.k === 'in' ? (
                            <div key={l.id} className="whitespace-pre-wrap">
                                <span className="text-plot-orange">&gt;&gt;&gt;</span> {l.t}
                            </div>
                        ) : (
                            <div key={l.id} className={`whitespace-pre-wrap ${TONE[l.k]}`}>
                                {l.t}
                            </div>
                        ),
                    )}
                </div>
                <form onSubmit={submit} className="flex items-center gap-2">
                    <span className="text-plot-orange" aria-hidden="true">
                        &gt;&gt;&gt;
                    </span>
                    <input
                        ref={field}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onKey}
                        readOnly={typing}
                        className="min-w-0 flex-1 bg-transparent text-[16px] text-paper caret-plot-orange outline-none placeholder:text-paper/30 sm:text-[13px]"
                        placeholder="help()"
                        aria-label="Python prompt. Type help() and press Enter."
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                        enterKeyHint="go"
                    />
                </form>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-[12px]">
                <span className="text-ink-3">Try:</span>
                {SUGGEST.map((cmd) => (
                    <button
                        key={cmd}
                        type="button"
                        onClick={() => suggest(cmd)}
                        aria-disabled={typing}
                        className="border border-ink/25 bg-paper-card px-2 py-1 text-ink-2 transition-colors hover:border-ink hover:text-ink aria-disabled:opacity-50"
                    >
                        {cmd}
                    </button>
                ))}
            </div>
        </div>
    );
}
