import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import principles from '../data/principles.json';

gsap.registerPlugin(ScrollTrigger);

// ─── Types ───────────────────────────────────────────────────────────────────
type Principle = (typeof principles)[number] & {
  evolutionStages?: string[];
};

// ─── Principles in Practice table data ───────────────────────────────────────
const PRACTICE_ROWS = [
  {
    principle: 'Understand Before Building',
    example: 'Reframed ShepherEd from an ERP into a modular platform ecosystem.',
  },
  {
    principle: 'Build the Foundation First',
    example: 'Prioritized identity, onboarding, and academic structure before operational modules.',
  },
  {
    principle: 'Let Architecture Evolve',
    example:
      'Progressed from a single application to a client-server architecture, then to platform boundaries and a monorepo.',
  },
  {
    principle: 'Verify Before Trusting',
    example:
      'Validated AI recommendations before adopting tools, patterns, or architectural changes.',
  },
  {
    principle: 'Build Beyond the Demo',
    example:
      'Introduced testing, documentation, security, and production-readiness as core parts of development.',
  },
];

// ─── PrincipleCard ────────────────────────────────────────────────────────────
function PrincipleCard({ p, index }: { p: Principle; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <article
      ref={cardRef}
      id={`principle-${p.num}`}
      className="scroll-mt-32"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Number + Title */}
      <header style={{ marginBottom: 'clamp(2rem, 4vh, 3rem)' }}>
        <div
          style={{
            fontFamily: 'Menlo, monospace',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#d4ff4f',
            opacity: 0.6,
            marginBottom: '1rem',
          }}
        >
          Principle {p.num}
        </div>
        <h2
          className="font-display"
          style={{
            fontWeight: 900,
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            letterSpacing: '-0.035em',
            lineHeight: 1.0,
            color: '#f5f5f2',
            margin: 0,
          }}
        >
          {p.title.split(p.accentWord).map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span style={{ color: '#d4ff4f' }}>{p.accentWord}</span>
              )}
            </span>
          ))}
        </h2>
      </header>

      {/* Content grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(2rem, 4vw, 4rem)',
        }}
      >
        {/* Why */}
        <div>
          <div
            style={{
              fontFamily: 'Menlo, monospace',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#d4ff4f',
              opacity: 0.5,
              marginBottom: '0.75rem',
            }}
          >
            Why
          </div>
          <p
            className="font-body"
            style={{
              fontSize: 'clamp(15px, 1.1vw, 17px)',
              lineHeight: 1.8,
              color: '#8c8c94',
              margin: 0,
            }}
          >
            {p.why}
          </p>
        </div>

        {/* Where It Changed My Thinking */}
        <div>
          <div
            style={{
              fontFamily: 'Menlo, monospace',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#d4ff4f',
              opacity: 0.5,
              marginBottom: '0.75rem',
            }}
          >
            Where It Changed My Thinking
          </div>
          <p
            className="font-body"
            style={{
              fontSize: 'clamp(15px, 1.1vw, 17px)',
              lineHeight: 1.8,
              color: '#8c8c94',
              margin: '0 0 1rem 0',
            }}
          >
            {p.evolution}
          </p>

          {/* Optional architectural stages list */}
          {p.evolutionStages && p.evolutionStages.length > 0 && (
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {p.evolutionStages.map((stage) => (
                <li
                  key={stage}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontFamily: 'Menlo, monospace',
                    fontSize: 'clamp(11px, 0.9vw, 13px)',
                    color: '#6a6a74',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: '#d4ff4f',
                      opacity: 0.5,
                      flexShrink: 0,
                    }}
                  />
                  {stage}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Today */}
        <div
          style={{
            gridColumn: '1 / -1',
            borderLeft: '2px solid rgba(212,255,79,0.25)',
            paddingLeft: 'clamp(1.25rem, 2vw, 2rem)',
          }}
        >
          <div
            style={{
              fontFamily: 'Menlo, monospace',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#d4ff4f',
              opacity: 0.5,
              marginBottom: '0.75rem',
            }}
          >
            Today
          </div>
          <p
            className="font-body"
            style={{
              fontSize: 'clamp(16px, 1.2vw, 18px)',
              lineHeight: 1.7,
              color: '#f5f5f2',
              opacity: 0.85,
              margin: 0,
              fontWeight: 400,
            }}
          >
            {p.today}
          </p>
        </div>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EngineeringPrinciples() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [practiceVisible, setPracticeVisible] = useState(false);
  const [closingVisible, setClosingVisible] = useState(false);
  const practiceRef = useRef<HTMLElement>(null);
  const closingRef = useRef<HTMLElement>(null);

  // Hero entrance
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Sections visibility
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) { setPracticeVisible(true); setClosingVisible(true); return; }

    const sections = [
      { ref: practiceRef, setter: setPracticeVisible },
      { ref: closingRef, setter: setClosingVisible },
    ];
    const cleanups = sections.map(({ ref, setter }) => {
      const el = ref.current;
      if (!el) return () => {};
      const obs = new IntersectionObserver(
        (entries) => { if (entries[0].isIntersecting) { setter(true); obs.disconnect(); } },
        { threshold: 0.06 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  // Progress rail
  useEffect(() => {
    const ctx = gsap.context(() => {
      const rail = document.querySelector('[data-progress-rail]');
      const contentCol = document.querySelector('[data-content-col]');
      if (rail && contentCol) {
        gsap.to(rail, {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: contentCol,
            start: 'top 50%',
            end: 'bottom 80%',
            scrub: true,
          },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-[#0a0a0a] text-[#f5f5f2] selection:bg-[#d4ff4f] selection:text-black font-body overflow-x-hidden relative"
    >
      <Helmet>
        <title>Engineering Principles | Vishnu Rohith</title>
        <meta
          name="description"
          content="The engineering principles that guide how Vishnu Rohith designs systems, makes technical decisions, and approaches software."
        />
        <link rel="canonical" href="https://vishnurohith.com/principles" />
      </Helmet>

      {/* Nav Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 backdrop-blur-md bg-[#0a0a0a]/50 border-b border-white/5 flex items-center justify-between">
        <a
          href="/#principles"
          className="group inline-flex items-center gap-2 text-[#8c8c94] hover:text-[#f5f5f2] transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-1"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="font-display text-sm tracking-widest uppercase">Back to Portfolio</span>
        </a>
        <div className="font-display font-bold text-[#d4ff4f] tracking-widest uppercase text-xs">
          Engineering Principles
        </div>
      </header>

      {/* Hero */}
      <section
        className="min-h-screen flex flex-col justify-center px-6 md:px-12 container-layout relative"
        style={{ paddingTop: 'clamp(7rem, 15vh, 10rem)', paddingBottom: 'clamp(4rem, 8vh, 6rem)' }}
      >
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div
            style={{
              fontFamily: 'Menlo, monospace',
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#d4ff4f',
              opacity: heroVisible ? 0.85 : 0,
              marginBottom: '1.5rem',
              transition: 'opacity 0.5s ease 0.1s',
            }}
          >
            Engineering Journal
          </div>

          {/* Title */}
          <h1
            className="font-display"
            style={{
              fontWeight: 900,
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              color: '#f5f5f2',
              margin: '0 0 clamp(2rem, 4vh, 3rem) 0',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.7s ease 0.2s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s',
            }}
          >
            Engineering<br />
            <span style={{ color: '#d4ff4f' }}>Principles</span>
            <span style={{ color: '#d4ff4f' }}>.</span>
          </h1>

          {/* Subtitle block */}
          <div
            style={{
              borderLeft: '2px solid rgba(212,255,79,0.2)',
              paddingLeft: 'clamp(1.25rem, 2vw, 2rem)',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.7s ease 0.4s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s',
            }}
          >
            <p
              className="font-body"
              style={{
                fontSize: 'clamp(16px, 1.4vw, 20px)',
                lineHeight: 1.75,
                color: '#8c8c94',
                margin: '0 0 0.75rem 0',
                maxWidth: '640px',
              }}
            >
              These principles weren't written before I started building software.
            </p>
            <p
              className="font-body"
              style={{
                fontSize: 'clamp(16px, 1.4vw, 20px)',
                lineHeight: 1.75,
                color: '#8c8c94',
                margin: 0,
                maxWidth: '640px',
              }}
            >
              They emerged through iterations, architectural changes, engineering trade-offs, and lessons learned while building real systems.
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-6 md:left-12"
          style={{
            opacity: heroVisible ? 0.45 : 0,
            transition: 'opacity 0.5s ease 0.9s',
          }}
        >
          <div
            style={{
              fontFamily: 'Menlo, monospace',
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#8c8c94',
              marginBottom: '0.5rem',
            }}
          >
            Scroll to read
          </div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d4ff4f"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>
      </section>

      {/* Content — Two-column with progress rail on large screens */}
      <section
        className="px-6 md:px-12 pb-24 container-layout"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 relative">
          {/* Sticky progress rail */}
          <div className="hidden lg:block lg:col-span-3 relative">
            <div className="sticky top-32">
              <div
                style={{
                  fontFamily: 'Menlo, monospace',
                  fontSize: '9px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#f5f5f2',
                  opacity: 0.35,
                  marginBottom: '2rem',
                }}
              >
                Principles
              </div>

              {/* Rail line */}
              <div className="absolute left-[3px] top-12 bottom-0 w-[2px] bg-white/5 rounded-full overflow-hidden">
                <div
                  data-progress-rail
                  className="w-full h-full bg-[#d4ff4f] transform-gpu scale-y-0 origin-top"
                />
              </div>

              <div className="space-y-5 relative z-10 pl-6">
                {principles.map((p) => (
                  <a
                    key={p.num}
                    href={`#principle-${p.num}`}
                    style={{
                      fontFamily: 'Menlo, monospace',
                      fontSize: '10px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                    }}
                    className="group text-[#8c8c94] hover:text-[#d4ff4f] flex items-center gap-3 transition-colors block"
                  >
                    <span className="opacity-40 group-hover:opacity-100 transition-opacity">{p.num}</span>
                    <span className="truncate max-w-[160px]">{p.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div
            data-content-col
            className="lg:col-span-9 max-w-3xl"
            style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(5rem, 10vh, 8rem)' }}
          >
            {/* Divider before first principle */}
            <div style={{ height: '1px', background: '#1e1e28' }} />

            {(principles as Principle[]).map((p, i) => (
              <div key={p.num}>
                <PrincipleCard p={p} index={i} />
                <div style={{ height: '1px', background: '#1e1e28', marginTop: 'clamp(5rem, 10vh, 8rem)' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles in Practice */}
      <section
        ref={practiceRef}
        className="px-6 md:px-12 pb-24 container-layout"
        style={{
          opacity: practiceVisible ? 1 : 0,
          transform: practiceVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div className="max-w-5xl">
          {/* Section header */}
          <div style={{ marginBottom: 'clamp(2.5rem, 5vh, 4rem)' }}>
            <div
              style={{
                fontFamily: 'Menlo, monospace',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#d4ff4f',
                opacity: 0.6,
                marginBottom: '1rem',
              }}
            >
              Application
            </div>
            <h2
              className="font-display"
              style={{
                fontWeight: 900,
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                letterSpacing: '-0.035em',
                lineHeight: 1.0,
                color: '#f5f5f2',
                margin: '0 0 1rem 0',
              }}
            >
              Principles in <span style={{ color: '#d4ff4f' }}>Practice</span>
            </h2>
            <p
              className="font-body"
              style={{
                fontSize: 'clamp(15px, 1.1vw, 17px)',
                color: '#8c8c94',
                lineHeight: 1.75,
                margin: 0,
                maxWidth: '520px',
              }}
            >
              These principles are reflected in the decisions I've made throughout my projects.
            </p>
          </div>

          {/* Table */}
          <div
            style={{
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr',
                gap: '0',
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div
                style={{
                  padding: 'clamp(0.75rem, 1.5vh, 1rem) clamp(1rem, 2vw, 1.5rem)',
                  fontFamily: 'Menlo, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#d4ff4f',
                  opacity: 0.5,
                }}
              >
                Principle
              </div>
              <div
                style={{
                  padding: 'clamp(0.75rem, 1.5vh, 1rem) clamp(1rem, 2vw, 1.5rem)',
                  fontFamily: 'Menlo, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#d4ff4f',
                  opacity: 0.5,
                  borderLeft: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                Example
              </div>
            </div>

            {/* Table rows */}
            {PRACTICE_ROWS.map((row, i) => (
              <div
                key={row.principle}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr',
                  borderBottom: i < PRACTICE_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(212,255,79,0.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <div
                  style={{
                    padding: 'clamp(1rem, 2vh, 1.5rem) clamp(1rem, 2vw, 1.5rem)',
                    fontFamily: 'Menlo, monospace',
                    fontSize: 'clamp(11px, 0.9vw, 13px)',
                    color: '#f5f5f2',
                    opacity: 0.75,
                    lineHeight: 1.6,
                    borderRight: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  {row.principle}
                </div>
                <div
                  style={{
                    padding: 'clamp(1rem, 2vh, 1.5rem) clamp(1rem, 2vw, 1.5rem)',
                    fontFamily: 'Menlo, monospace',
                    fontSize: 'clamp(11px, 0.9vw, 13px)',
                    color: '#8c8c94',
                    lineHeight: 1.6,
                  }}
                >
                  {row.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Statement */}
      <section
        ref={closingRef}
        className="px-6 md:px-12 container-layout"
        style={{
          paddingBottom: 'clamp(6rem, 12vh, 10rem)',
          paddingTop: 'clamp(2rem, 4vh, 3rem)',
          opacity: closingVisible ? 1 : 0,
          transform: closingVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div
          className="max-w-4xl"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: 'clamp(3rem, 6vh, 5rem)',
          }}
        >
          <div
            style={{
              fontFamily: 'Menlo, monospace',
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#d4ff4f',
              opacity: 0.5,
              marginBottom: '2rem',
            }}
          >
            Closing Reflection
          </div>

          <blockquote style={{ margin: 0 }}>
            <p
              className="font-display"
              style={{
                fontWeight: 500,
                fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                color: '#f5f5f2',
                margin: '0 0 1.5rem 0',
              }}
            >
              Every project changes the way I think about software engineering
              <span style={{ color: '#d4ff4f' }}>.</span>
            </p>
            <p
              className="font-body"
              style={{
                fontSize: 'clamp(15px, 1.2vw, 18px)',
                color: '#8c8c94',
                lineHeight: 1.8,
                margin: 0,
                maxWidth: '560px',
              }}
            >
              These principles continue to evolve with every architectural decision, every challenge, and every system I build.
            </p>
          </blockquote>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10 px-6 md:px-12 text-center">
        <p
          style={{
            fontFamily: 'Menlo, monospace',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#5a5a64',
            marginBottom: '1.5rem',
          }}
        >
          End of Engineering Principles
        </p>
        <a
          href="/#principles"
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-display font-bold uppercase text-sm tracking-widest rounded-full hover:bg-[#d4ff4f] transition-colors"
        >
          Return to Portfolio
        </a>
      </footer>
    </div>
  );
}
