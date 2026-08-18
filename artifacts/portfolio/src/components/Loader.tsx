import { useEffect, useState } from 'react';
import meta from '../data/meta.json';

const OWNER = meta.name.toUpperCase();

/**
 * Kinetic Precision Loader
 * A cinematic, choreographed intro sequence:
 *   0.0s  Central lime pulse blooms
 *   0.8s  Geometric frame constructs around the origin (H + V lines)
 *   1.4s  Owner name resolves from blurred, wide-tracked ghost → sharp lime
 *   1.8s  "Initializing" caption fades in with corner brackets
 *   3.2s  Implosion + blur exit reveals the site
 *
 * Total runtime ~4.2s. Honors prefers-reduced-motion by skipping instantly.
 */
export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { onComplete(); return; }

    // Trigger fade-out slightly before onComplete so the site is visible during exit
    const exitTimer = setTimeout(() => setExiting(true), 3600);
    const doneTimer = setTimeout(onComplete, 4200);
    return () => { clearTimeout(exitTimer); clearTimeout(doneTimer); };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-[var(--bg-base)] flex items-center justify-center overflow-hidden"
      style={{
        opacity: exiting ? 0 : 1,
        transition: 'opacity 600ms cubic-bezier(0.7, 0, 0.84, 0)',
        pointerEvents: exiting ? 'none' : 'auto',
      }}
      data-testid="kinetic-loader"
    >
      <style>{`
        @keyframes kp-pulse {
          0%   { transform: scale(0); opacity: 0; }
          40%  { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes kp-line-h {
          0%   { width: 0; opacity: 0; }
          100% { width: clamp(220px, 34vw, 460px); opacity: 1; }
        }
        @keyframes kp-line-v {
          0%   { height: 0; opacity: 0; }
          100% { height: clamp(70px, 10vw, 120px); opacity: 1; }
        }
        @keyframes kp-reveal {
          0%   { opacity: 0; letter-spacing: 1em; filter: blur(14px); transform: translateY(8px); }
          100% { opacity: 1; letter-spacing: 0.22em; filter: blur(0); transform: translateY(0); }
        }
        @keyframes kp-fade-up {
          0%   { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes kp-implode {
          0%   { transform: scale(1); filter: blur(0); opacity: 1; }
          40%  { transform: scale(0.97); filter: blur(2px); opacity: 0.9; }
          100% { transform: scale(1.45); filter: blur(22px); opacity: 0; }
        }
        @keyframes kp-scan {
          0%   { top: -8%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 108%; opacity: 0; }
        }
        @keyframes kp-tick {
          0%, 100% { opacity: 0.25; }
          50%      { opacity: 1; }
        }
        .kp-pulse   { animation: kp-pulse 0.9s cubic-bezier(0.16,1,0.3,1) forwards; }
        .kp-line-h  { animation: kp-line-h 0.7s 0.7s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
        .kp-line-v  { animation: kp-line-v 0.7s 0.7s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
        .kp-reveal  { animation: kp-reveal 1.1s 1.3s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
        .kp-caption { animation: kp-fade-up 0.6s 2.0s ease-out forwards; opacity: 0; }
        .kp-corner  { animation: kp-fade-up 0.5s 2.2s ease-out forwards; opacity: 0; }
        .kp-exit    { animation: kp-implode 0.9s 3.2s cubic-bezier(0.7,0,0.84,0) forwards; }
        .kp-scan    { animation: kp-scan 3.4s linear forwards; }
        .kp-tick    { animation: kp-tick 1.2s ease-in-out infinite; }
        .kp-grid {
          background-image: radial-gradient(circle at center, color-mix(in srgb, var(--accent) 6%, transparent) 1px, transparent 1px);
          background-size: 42px 42px;
        }
      `}</style>

      {/* Ambient grid */}
      <div className="absolute inset-0 kp-grid opacity-40" />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)' }}
      />

      {/* Scanning beam */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="kp-scan absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />
      </div>

      {/* Main construct */}
      <div className="relative kp-exit">
        {/* Central origin pulse */}
        <div
          className="kp-pulse absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--accent)]"
          style={{ boxShadow: '0 0 24px var(--accent), 0 0 60px color-mix(in srgb, var(--accent) 50%, transparent)' }}
        />

        {/* Geometric frame (H + V lines emanating from center) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="kp-line-h absolute left-1/2 -translate-x-1/2 -translate-y-[60px] md:-translate-y-[80px] h-[1px] bg-[var(--accent)]/40" style={{ boxShadow: '0 0 8px color-mix(in srgb, var(--accent) 50%, transparent)' }} />
          <div className="kp-line-h absolute left-1/2 -translate-x-1/2 translate-y-[60px] md:translate-y-[80px] h-[1px] bg-[var(--accent)]/40" style={{ boxShadow: '0 0 8px color-mix(in srgb, var(--accent) 50%, transparent)' }} />
          <div className="kp-line-v absolute top-1/2 -translate-y-1/2 -translate-x-[160px] md:-translate-x-[220px] w-[1px] bg-[var(--accent)]/40" />
          <div className="kp-line-v absolute top-1/2 -translate-y-1/2 translate-x-[160px] md:translate-x-[220px] w-[1px] bg-[var(--accent)]/40" />
        </div>

        {/* Owner name */}
        <div className="relative px-8 py-10 md:px-14 md:py-12">
          <h1
            className="kp-reveal whitespace-nowrap text-2xl sm:text-3xl md:text-5xl font-bold uppercase text-[var(--accent)]"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              textShadow: '0 0 24px color-mix(in srgb, var(--accent) 35%, transparent)',
            }}
          >
            {OWNER}
          </h1>

          {/* Caption */}
          <div className="kp-caption absolute left-1/2 -translate-x-1/2 -bottom-1 w-full text-center flex items-center justify-center gap-2">
            <span className="kp-tick w-1 h-1 rounded-full bg-[var(--accent)]" />
            <span
              className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-[var(--accent)]/60"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Initializing Portfolio
            </span>
            <span className="kp-tick w-1 h-1 rounded-full bg-[var(--accent)]" style={{ animationDelay: '0.4s' }} />
          </div>

          {/* Corner brackets */}
          <div className="kp-corner absolute -top-0.5 -left-0.5 w-3 h-3 border-t border-l border-[var(--accent)]" />
          <div className="kp-corner absolute -top-0.5 -right-0.5 w-3 h-3 border-t border-r border-[var(--accent)]" />
          <div className="kp-corner absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b border-l border-[var(--accent)]" />
          <div className="kp-corner absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b border-r border-[var(--accent)]" />
        </div>
      </div>

      {/* Telemetry (top-left / bottom-right) */}
      <div
        className="kp-caption absolute top-6 left-6 text-[9px] uppercase tracking-[0.35em] text-[var(--accent)]/40"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        REF · 0808-0A
      </div>
      <div
        className="kp-caption absolute bottom-6 right-6 text-[9px] uppercase tracking-[0.35em] text-[var(--accent)]/40"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        BUILD · v.2026.07
      </div>
    </div>
  );
}
