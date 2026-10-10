import { useSyncExternalStore } from 'react';

// The two agents that live on this page, and a page-sized herdr_agents_tracker watching them:
// a usage limit per agent, a burn-rate forecast, a context meter, alerts at 80% and 95%, and a
// reset after the limit is hit. One small store shared by the cursor layer, the dock and the
// live figure in the experiments.

export const AGENTS = [
    { id: 'claude', name: 'Claude', color: '#d97757' },
    { id: 'codex', name: 'Codex', color: '#10a37f' },
];

const RESET_AFTER = 20; // seconds blocked at 100% — the page's version of a 5-hour window
const CTX_MAX = 200_000;
const KEY = 'herd:asleep';

const fresh = (ctx) => ({ used: 0, ctx, state: 'idle', doing: '', blockedUntil: 0, block: 0, rate: 0, last: 0, flash: null });
const agents = { claude: fresh(18_000), codex: fresh(9_000) };
const nameOf = (id) => AGENTS.find((a) => a.id === id).name;

let enabled = true;
try {
    enabled = localStorage.getItem(KEY) !== '1';
} catch {
    // storage blocked: agents stay on
}
let active = false; // set once the visitor first moves the pointer
let events = [];
let seq = 0;
let snapshot;
const listeners = new Set();

const build = () => {
    const now = Date.now();
    const view = (id) => {
        const a = agents[id];
        const flash = a.flash && a.flash.until > now ? a.flash : null;
        return {
            id,
            name: nameOf(id),
            used: a.used,
            ctx: a.ctx / CTX_MAX,
            ctxTokens: a.ctx,
            state: !enabled ? 'idle' : a.blockedUntil ? 'blocked' : flash ? 'working' : a.state,
            doing: !enabled ? 'Asleep' : a.blockedUntil ? 'Hit its limit' : flash ? flash.doing : a.doing,
            resetsIn: a.blockedUntil ? Math.max(0, Math.ceil((a.blockedUntil - now) / 1000)) : 0,
            // seconds until 100% at the current pace, if it's burning at all
            eta: !a.blockedUntil && a.rate > 0.02 ? (100 - a.used) / a.rate : null,
        };
    };
    snapshot = { enabled, active, events, now, claude: view('claude'), codex: view('codex') };
};
build();

// emit() notifies now; emit(true) batches everything in the next ~120 ms into one update.
let pending = 0;
const emit = (soon = false) => {
    if (soon) {
        if (!pending) pending = setTimeout(() => emit(), 120);
        return;
    }
    clearTimeout(pending);
    pending = 0;
    build();
    listeners.forEach((l) => l());
};

const push = (agent, text, level = 'info') => {
    events = [{ id: ++seq, at: Date.now(), agent, text, level }, ...events].slice(0, 5);
};

// Once a second: update each agent's burn rate (an exponential moving average, so a sudden
// burst shows up straight away and an idle agent's forecast fades out) and refresh countdowns.
setInterval(() => {
    for (const a of Object.values(agents)) {
        const delta = Math.max(0, a.used - a.last);
        a.last = a.used;
        a.rate = a.rate * 0.75 + delta * 0.25;
        if (a.rate < 0.01) a.rate = 0;
    }
    if (listeners.size) emit();
}, 1000);

const reset = (id, auto) => {
    const a = agents[id];
    a.used = 0;
    a.last = 0;
    a.rate = 0;
    a.blockedUntil = 0;
    if (auto) push(id, `${nameOf(id)} limit has reset. It can go on.`, 'ok');
};

// Bar colour by level, like the plugin's meters: the agent's own colour, then amber, then red.
export const levelColor = (pct, base) => (pct >= 95 ? '#d62728' : pct >= 80 ? '#ff7f0e' : base);

export const fmtEta = (s) => {
    const n = Math.max(1, Math.round(s));
    return n < 60 ? `${n}s` : `${Math.floor(n / 60)}m${String(n % 60).padStart(2, '0')}s`;
};

export const herd = {
    subscribe(fn) {
        listeners.add(fn);
        return () => listeners.delete(fn);
    },
    get: () => snapshot,
    isEnabled: () => enabled,
    isBlocked: (id) => agents[id].blockedUntil > 0,

    activate() {
        if (active) return;
        active = true;
        emit();
    },

    // Spend some of an agent's limit. Crossing 80% and 95% raises an alert; 100% blocks it.
    burn(id, pct) {
        const a = agents[id];
        if (!enabled || a.blockedUntil || pct <= 0) return;
        const before = a.used;
        a.used = Math.min(100, a.used + pct);
        const name = nameOf(id);
        if (before < 80 && a.used >= 80) {
            const eta = a.rate > 0.02 ? ` · at this rate 100% in ${fmtEta((100 - a.used) / a.rate)}` : '';
            push(id, `${name} at 80%${eta}`, 'warn');
        }
        if (before < 95 && a.used >= 95 && a.used < 100) push(id, `${name} at 95% of its limit`, 'warn');
        if (a.used >= 100) {
            a.blockedUntil = Date.now() + RESET_AFTER * 1000;
            const block = ++a.block;
            push(id, `${name} hit its limit · resets in ${RESET_AFTER}s`, 'err');
            setTimeout(() => {
                if (a.block !== block || !a.blockedUntil) return; // reset by hand in the meantime
                reset(id, true);
                emit();
            }, RESET_AFTER * 1000);
        }
        emit(true);
    },

    // Fill an agent's context window. Near the top, it compacts — the way Claude Code does.
    read(id, tokens) {
        const a = agents[id];
        if (!enabled) return;
        a.ctx = Math.min(CTX_MAX, a.ctx + tokens);
        if (a.ctx >= CTX_MAX * 0.95) {
            a.flash = { doing: 'Compacting conversation…', until: Date.now() + 1600 };
            push(id, `${nameOf(id)} compacted its context`, 'info');
            a.ctx = Math.round(CTX_MAX * 0.18);
        }
        emit(true);
    },

    // What an agent is up to: state is herdr's vocabulary (working / idle / blocked).
    status(id, state, doing) {
        const a = agents[id];
        if (a.state === state && a.doing === doing) return;
        a.state = state;
        a.doing = doing;
        emit(true);
    },

    // One "turn" of work, from the buttons in the live figure.
    turn(id) {
        if (!enabled || agents[id].blockedUntil) return;
        agents[id].flash = { doing: 'Running a turn…', until: Date.now() + 1400 };
        herd.read(id, id === 'claude' ? 14_000 : 9_000);
        herd.burn(id, id === 'claude' ? 9 : 7);
    },

    resetAll() {
        for (const a of AGENTS) reset(a.id, false);
        push(null, 'Window reset. Both agents can go on.', 'ok');
        emit();
    },

    setEnabled(on) {
        enabled = on;
        if (on) active = true; // waking them is activity: keep the dock up
        try {
            if (on) localStorage.removeItem(KEY);
            else localStorage.setItem(KEY, '1');
        } catch {
            // per-visit only, then
        }
        emit();
    },
};

export const useHerd = () => useSyncExternalStore(herd.subscribe, herd.get, herd.get);
export const useHerdEnabled = () => useSyncExternalStore(herd.subscribe, herd.isEnabled, herd.isEnabled);
