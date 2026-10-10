import { useState } from 'react';
import { AGENTS, fmtEta, herd, useHerd } from '../lib/herd';
import { FINE_POINTER, useMedia } from '../lib/useMedia';
import { Sprite } from './herd/Sprites';

// herdr_agents_tracker, live: the plugin's tab bar, Agents panel and account limits — redrawn
// for the two agents on this page, whose usage really does climb as they follow you around.
// The "Screenshot" view is the plugin itself, running in Herdr.

const LEVEL = (pct, base) => (pct >= 95 ? '#ff5f56' : pct >= 80 ? '#ff9f43' : base);
const STATE = {
    working: ['●', 'text-[#7bd88f]'],
    idle: ['○', 'text-paper/50'],
    blocked: ['◉', 'text-[#ff6b5e]'],
};
const CTX = (r) => (r >= 0.9 ? 'text-[#ff6b5e]' : r >= 0.7 ? 'text-[#ffb15c]' : 'text-paper/55');

const Meter = ({ pct, color, className = '' }) => (
    <span className={`relative block overflow-hidden bg-paper/10 ${className}`} aria-hidden="true">
        <span className="absolute inset-y-0 left-0 transition-[width] duration-300 ease-out" style={{ width: `${pct}%`, background: color }} />
    </span>
);

const forecast = (v) =>
    v.state === 'blocked' ? `blocked · resets in ${v.resetsIn}s` : v.eta ? `at this rate 100% in ${fmtEta(v.eta)}` : `${Math.round(100 - v.used)}% left`;

function Live({ s }) {
    const fine = useMedia(FINE_POINTER);
    const recent = s.events.filter((e) => s.now - e.at < 15000).slice(0, 2);

    return (
        <div>
            {/* the tab-bar summary: one entry per account */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-b border-paper/10 px-3 py-2.5 sm:px-4">
                {AGENTS.map((a) => {
                    const v = s[a.id];
                    return (
                        <span key={a.id} className="flex items-center gap-2">
                            <span className="text-paper">{a.name}</span>
                            <Meter pct={v.used} color={LEVEL(v.used, a.color)} className="h-2 w-14" />
                            <span className="tabular-nums" style={{ color: LEVEL(v.used, '#e8e4da') }}>
                                {Math.round(v.used)}%
                            </span>
                            {v.eta && <span className="text-paper/50">(100% in {fmtEta(v.eta)})</span>}
                        </span>
                    );
                })}
            </div>

            <div className="grid sm:grid-cols-[minmax(0,12.5rem)_minmax(0,1fr)]">
                {/* the Agents panel: a context meter under every agent */}
                <div className="border-b border-paper/10 px-3 py-3 sm:border-b-0 sm:border-r sm:px-4">
                    <div className="text-paper/45">agents</div>
                    <ul className="mt-2 space-y-3">
                        {AGENTS.map((a) => {
                            const v = s[a.id];
                            const [dot, tone] = STATE[v.state] || STATE.idle;
                            return (
                                <li key={a.id} className="grid grid-cols-[1.6rem_minmax(0,1fr)] gap-x-2">
                                    <span className="pt-1">
                                        <Sprite id={a.id} size={22} onDark />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="flex items-baseline gap-2">
                                            <span className="text-paper">{a.id}</span>
                                            <span className={tone}>
                                                {dot} {v.state}
                                            </span>
                                        </span>
                                        <span className="block truncate text-paper/55">{v.doing || '—'}</span>
                                        <span className={`block tabular-nums ${CTX(v.ctx)}`}>
                                            ⛁ {Math.round(v.ctx * 100)}% {Math.round(v.ctxTokens / 1000)}k
                                        </span>
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* account limits, with the forecast */}
                <div className="px-3 py-3 sm:px-4">
                    <div>
                        <span className="text-[#c9c94a]">ACCOUNT LIMITS</span> <span className="text-paper/45">· this page, this visit</span>
                    </div>
                    {AGENTS.map((a) => {
                        const v = s[a.id];
                        return (
                            <div key={a.id} className="mt-3">
                                <div className="text-paper">
                                    {a.name} <span className="text-paper/45">· session limit</span>
                                </div>
                                <Meter pct={v.used} color={LEVEL(v.used, '#a8a82e')} className="mt-1 h-2.5 w-full" />
                                <div className="mt-1">
                                    <span style={{ color: LEVEL(v.used, '#c9c94a') }}>{Math.round(v.used)}% used</span>{' '}
                                    <span className={v.state === 'blocked' || (v.eta && v.eta < 60) ? 'text-[#ff6b5e]' : 'text-paper/55'}>· {forecast(v)}</span>
                                </div>
                            </div>
                        );
                    })}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {/* aria-disabled rather than disabled, so a focused button keeps focus when it greys out */}
                        {AGENTS.map((a) => {
                            const off = !s.enabled || s[a.id].state === 'blocked';
                            return (
                                <button
                                    key={a.id}
                                    type="button"
                                    onClick={() => !off && herd.turn(a.id)}
                                    aria-disabled={off}
                                    className="border border-paper/25 px-2.5 py-1 text-paper/85 transition-colors hover:border-paper/70 hover:text-paper aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
                                >
                                    ▶ Run a {a.name} turn
                                </button>
                            );
                        })}
                        <button type="button" onClick={() => herd.resetAll()} className="px-2 py-1 text-paper/55 transition-colors hover:text-paper">
                            ↺ Reset
                        </button>
                        <button
                            type="button"
                            onClick={() => herd.setEnabled(!s.enabled)}
                            aria-pressed={!s.enabled}
                            className="px-2 py-1 text-paper/55 transition-colors hover:text-paper"
                        >
                            {s.enabled ? '⏸ Hide the agents' : '▶ Wake the agents'}
                        </button>
                    </div>
                </div>
            </div>

            {/* notifications: 80%, 95%, the limit, and the reset */}
            <div className="min-h-[2.75rem] space-y-0.5 border-t border-paper/10 px-3 py-2.5 sm:px-4" role="status" aria-live="polite">
                {recent.length ? (
                    recent.map((e) => (
                        <div key={e.id} className="flex gap-2">
                            <span className={e.level === 'err' ? 'text-[#ff6b5e]' : e.level === 'warn' ? 'text-[#ffb15c]' : 'text-[#7bd88f]'}>●</span>
                            <span>{e.text}</span>
                        </div>
                    ))
                ) : (
                    <span className="text-paper/45">
                        {fine
                            ? 'Move your cursor around the page: both agents follow it, and spend their limit doing it.'
                            : 'Run a turn — or drag across the plot at the top and the agents come along.'}
                    </span>
                )}
            </div>
        </div>
    );
}

export default function HerdrFigure({ figure }) {
    const [view, setView] = useState('live');
    const s = useHerd();
    const tab = (id, label) => (
        <button
            type="button"
            onClick={() => setView(id)}
            aria-pressed={view === id}
            className={`px-2.5 py-1 transition-colors ${view === id ? 'bg-paper text-ink' : 'text-paper/60 hover:text-paper'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-[#1f1d19] font-mono text-[11.5px] leading-relaxed text-paper/85 sm:text-[12px]">
            <div className="flex items-center gap-2 border-b border-paper/10 px-3 py-2 sm:px-4">
                <span className="h-2.5 w-2.5 rounded-full border border-paper/30" />
                <span className="h-2.5 w-2.5 rounded-full border border-paper/30" />
                <span className="h-2.5 w-2.5 rounded-full border border-paper/30" />
                <span className="ml-2 hidden text-paper/50 sm:inline">herdr · usage tracker</span>
                {view === 'live' && (
                    <span className="ml-2 flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.14em] text-[#7bd88f] sm:ml-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#7bd88f] motion-safe:animate-pulse" />
                        live
                    </span>
                )}
                <span className="ml-auto flex border border-paper/20" role="group" aria-label="Figure view">
                    {tab('live', 'Live')}
                    {tab('shot', 'Screenshot')}
                </span>
            </div>
            {view === 'live' ? (
                <Live s={s} />
            ) : (
                <img src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} loading="lazy" decoding="async" className="block h-auto w-full" />
            )}
        </div>
    );
}
