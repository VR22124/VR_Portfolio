import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import principles from '../data/principles.json';

const HEADER_WORDS = ['Engineering', 'Principles', '.'];

function splitWithAccent(title: string, accentWord: string) {
  const idx = title.indexOf(accentWord);
  if (idx === -1) return { before: title, accent: '', after: '' };
  return {
    before: title.slice(0, idx),
    accent: accentWord,
    after: title.slice(idx + accentWord.length),
  };
}

interface PrincipleRowProps {
  principle: (typeof principles)[number];
  index: number;
  isRevealed: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function PrincipleRow({
  principle,
  index,
  isRevealed,
  isHovered,
  isDimmed,
  onMouseEnter,
  onMouseLeave,
}: PrincipleRowProps) {
  const isRight = index % 2 === 1;
  const { before, accent, after } = splitWithAccent(principle.title, principle.accentWord);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative',
        padding: 'clamp(2.5rem, 5vh, 4rem) 5vw',
        opacity: isDimmed ? 0.22 : 1,
        transition: 'opacity 0.4s ease',
        cursor: 'default',
        textAlign: isRight ? 'right' : 'left',
      }}
    >
      {/* Number prefix — ghost */}
      <div
        style={{
          fontFamily: 'Menlo, monospace',
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: 'var(--accent)',
          opacity: isRevealed ? 0.35 : 0,
          marginBottom: '0.6rem',
          textAlign: isRight ? 'right' : 'left',
          transition: 'opacity 0.5s ease 0.2s',
        }}
      >
        {principle.num}
      </div>

      {/* Title — clip-path wipe reveal */}
      <div
        style={{
          clipPath: isRevealed ? 'inset(0 0% 0 0)' : (isRight ? 'inset(0 0% 0 100%)' : 'inset(0 100% 0 0)'),
          transition: 'clip-path 1.05s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <h3
          className="font-display"
          style={{
            fontWeight: 900,
            fontSize: 'clamp(38px, 6.5vw, 108px)',
            letterSpacing: '-0.04em',
            lineHeight: 1.0,
            color: 'var(--text-primary)',
            margin: 0,
            textAlign: isRight ? 'right' : 'left',
          }}
        >
          {before}
          <span
            style={{
              color: 'var(--accent)',
              display: 'inline-block',
              textShadow: isHovered
                ? '0 0 40px color-mix(in srgb, var(--accent) 55%, transparent), 0 0 80px color-mix(in srgb, var(--accent) 25%, transparent)'
                : 'none',
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
              transformOrigin: isRight ? 'right center' : 'left center',
              transition: 'text-shadow 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {accent}
          </span>
          {after}
        </h3>
      </div>

      {/* Accent underline — draws on hover */}
      <div
        aria-hidden="true"
        style={{
          height: '1.5px',
          background: 'linear-gradient(to right, color-mix(in srgb, var(--accent) 50%, transparent), transparent 70%)',
          ...(isRight
            ? {
                background: 'linear-gradient(to left, color-mix(in srgb, var(--accent) 50%, transparent), transparent 70%)',
                marginLeft: 'auto',
              }
            : {}),
          width: isHovered ? 'min(640px, 80%)' : '0px',
          marginTop: '0.6rem',
          transition: 'width 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Description — fades in after title */}
      <p
        style={{
          fontFamily: 'Menlo, monospace',
          fontSize: 'clamp(12px, 1vw, 14px)',
          color: isHovered ? '#a0a0aa' : '#5a5a64',
          lineHeight: 1.75,
          margin: '1.25rem 0 0 0',
          maxWidth: '480px',
          ...(isRight ? { marginLeft: 'auto' } : {}),
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.6s ease 0.75s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.75s, color 0.35s ease',
        }}
      >
        {principle.preview}
      </p>
    </div>
  );
}

export default function Principles() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [headerVisible, setHeaderVisible] = useState(false);
  const [revealedRows, setRevealedRows] = useState<Set<number>>(new Set());
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setHeaderVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setCtaVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      setRevealedRows(new Set(principles.slice(0, 5).map((_, i) => i)));
      return;
    }
    const cleanups: (() => void)[] = [];
    rowRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setRevealedRows((prev) => { const n = new Set(prev); n.add(i); return n; });
            obs.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      cleanups.push(() => obs.disconnect());
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section
      ref={sectionRef}
      id="principles"
      style={{ padding: 'clamp(5rem, 10vh, 9rem) 0', position: 'relative' }}
    >
      {/* Header */}
      <div style={{ padding: '0 5vw', marginBottom: 'clamp(3rem, 6vh, 5rem)' }}>
        <div
          style={{
            fontFamily: 'Menlo, monospace',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: '1.25rem',
            opacity: headerVisible ? 0.85 : 0,
            transition: 'opacity 0.5s ease',
          }}
        >
          Beliefs
        </div>

        {/* Word-rise headline */}
        <h2
          className="font-display"
          aria-label="Engineering Principles."
          style={{
            fontWeight: 500,
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: 'var(--text-primary)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.28em',
            margin: 0,
          }}
        >
          {HEADER_WORDS.map((word, i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{ overflow: 'hidden', display: 'inline-block', lineHeight: 1.05 }}
            >
              <span
                style={{
                  display: 'inline-block',
                  opacity: headerVisible ? 1 : 0,
                  transform: headerVisible ? 'translateY(0)' : 'translateY(110%)',
                  transition: `opacity 0.5s ease ${0.1 + i * 0.12}s, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.12}s`,
                  color: word === '.' ? 'var(--accent)' : undefined,
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </h2>

        <p
          style={{
            fontFamily: 'Menlo, monospace',
            fontSize: 'clamp(13px, 1.1vw, 15px)',
            color: '#5a5a64',
            lineHeight: 1.75,
            margin: 'clamp(1.2rem, 2vh, 1.75rem) 0 0 0',
            maxWidth: '520px',
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.6s ease 0.5s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.5s',
          }}
        >
          The principles that shape how I design systems, make technical decisions, and approach software engineering.
        </p>
      </div>

      {/* Top divider */}
      <div
        aria-hidden="true"
        style={{
          margin: '0 5vw',
          height: '1px',
          backgroundColor: '#1a1a22',
          opacity: headerVisible ? 1 : 0,
          transition: 'opacity 0.5s ease 0.6s',
        }}
      />

      {/* Principle rows */}
      {principles.slice(0, 5).map((p, i) => (
        <div key={i} ref={(el) => { rowRefs.current[i] = el; }}>
          <PrincipleRow
            principle={p}
            index={i}
            isRevealed={revealedRows.has(i)}
            isHovered={hoveredIndex === i}
            isDimmed={hoveredIndex !== null && hoveredIndex !== i}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          />

          {/* Divider — pulses from accent to dark as the row below reveals */}
          <div
            aria-hidden="true"
            style={{
              margin: '0 5vw',
              height: '1px',
              background: revealedRows.has(i)
                ? '#1e1e28'
                : 'transparent',
              boxShadow: revealedRows.has(i) && !revealedRows.has(i + 1)
                ? '0 0 12px color-mix(in srgb, var(--accent) 30%, transparent)'
                : 'none',
              transition: 'background 0.8s ease 1.2s, box-shadow 1.4s ease 1.2s',
            }}
          />
        </div>
      ))}

      {/* CTA */}
      <div
        ref={ctaRef}
        style={{
          padding: 'clamp(3rem, 6vh, 5rem) 5vw 0',
          opacity: ctaVisible ? 1 : 0,
          transform: ctaVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <Link
          to="/principles"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6em',
            fontFamily: 'Menlo, monospace',
            fontSize: 'clamp(11px, 0.9vw, 13px)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            textDecoration: 'none',
            borderBottom: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
            paddingBottom: '3px',
            transition: 'border-color 0.3s ease, gap 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent) 80%, transparent)';
            e.currentTarget.style.gap = '0.9em';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent) 30%, transparent)';
            e.currentTarget.style.gap = '0.6em';
          }}
        >
          Explore My Engineering Principles
          <span aria-hidden="true" style={{ fontSize: '1em' }}>→</span>
        </Link>
      </div>
    </section>
  );
}
