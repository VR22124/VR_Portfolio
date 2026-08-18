import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
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
  {
    principle: 'Isolate What Matters',
    example: 'Extracted complex domains like OpenAcademia and the Observability Platform into their own isolated ecosystems to protect the core.'
  },
  {
    principle: 'Boundaries Protect the Data',
    example: 'Replaced loose database writes with strict Prisma transactions and enforced clear Dev/Test/Prod environment isolation.'
  },
  {
    principle: 'Automate What Drains You',
    example: 'Migrated 580 E2E tests from a local machine to parallel GitHub Actions VMs to prevent CPU burnout and connection timeouts.'
  },
  {
    principle: 'Accept the Trade-off',
    example: 'Moved to a monorepo structure, accepting the trade-off of complex package dependency management in exchange for shared code boundaries.'
  },
  {
    principle: 'Learn by Breaking Things',
    example: 'Fully grasped the necessity of CI/CD and distributed testing only after physically crashing local environments with massive test suites.'
  }
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EngineeringPrinciples() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  // Hero entrance
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
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
      className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] selection:bg-[var(--accent)] selection:text-black font-body relative"
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
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 backdrop-blur-md bg-[var(--bg-base)]/50 border-b border-[var(--text-primary)]/5 flex items-center justify-between">
        <Link
          to="/#principles"
          className="group inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="font-display text-sm tracking-widest uppercase">Back to Portfolio</span>
        </Link>
        <div className="font-display font-bold text-[var(--accent)] tracking-widest uppercase text-xs">
          Engineering Principles
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-12 container-layout relative">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span 
            className="inline-block mb-6 px-3 py-1.5 border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-display tracking-[0.2em] uppercase rounded-full"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s'
            }}
          >
            Engineering Journal
          </span>
          <h1 
            className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-tighter mb-8 uppercase text-[var(--text-primary)] flex flex-col items-center"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.7s ease 0.2s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s',
            }}
          >
            <span>Engineering</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-primary)]/40">Principles</span>
          </h1>
          <div
            className="text-[var(--text-secondary)] text-lg sm:text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto mt-2"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.7s ease 0.4s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s',
            }}
          >
            <p className="mb-4">These principles weren't written before I started building software.</p>
            <p>They emerged through iterations, architectural changes, engineering trade-offs, and lessons learned while building real systems.</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 md:px-12 pb-32 container-layout">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 relative">
          
          {/* Sticky Left Rail / Progress Indicator */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-40 max-h-[calc(100vh-10rem)] overflow-y-auto no-scrollbar">
              <div className="relative">
                <div className="text-[var(--text-primary)] font-display font-bold uppercase tracking-widest text-sm mb-8 opacity-50">
                  Principles
                </div>
                
                {/* Vertical Progress Rail */}
                <div className="absolute left-[3px] top-14 bottom-0 w-[2px] bg-[var(--text-primary)]/5 rounded-full overflow-hidden">
                  <div data-progress-rail className="w-full h-full bg-[var(--accent)] transform-gpu scale-y-0 origin-top" />
                </div>

                <div className="space-y-6 relative z-10 pl-6">
                  {principles.map((p) => (
                    <a 
                      key={p.num} 
                      href={`#principle-${p.num}`}
                      className="group text-xs font-display uppercase tracking-[0.15em] text-[var(--text-secondary)] hover:text-[var(--accent)] flex items-center gap-4 transition-colors cursor-pointer block"
                    >
                      <span className="opacity-40 group-hover:opacity-100 transition-opacity">{p.num}</span>
                      <span className="truncate max-w-[180px]">{p.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling Content */}
          <div data-content-col className="lg:col-span-9 space-y-24 md:space-y-32 max-w-3xl">
            {(principles as Principle[]).map((p) => (
              <article key={p.num} id={`principle-${p.num}`} className="scroll-mt-40">
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="font-display font-bold text-3xl sm:text-4xl text-[var(--accent)]/40 leading-none">
                    {p.num}
                  </span>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)] uppercase tracking-tight">
                    {p.title}
                  </h2>
                </div>
                
                <div className="prose prose-invert prose-lg max-w-none prose-p:text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)] prose-strong:text-[var(--text-primary)]">
                  <p><strong>Why:</strong> {p.why}</p>
                  <p><strong>Evolution:</strong> {p.evolution}</p>
                  
                  {p.evolutionStages && p.evolutionStages.length > 0 && (
                    <ul>
                      {p.evolutionStages.map((stage) => (
                        <li key={stage} className="text-[var(--text-secondary)]">{stage}</li>
                      ))}
                    </ul>
                  )}
                  
                  <div className="mt-8 p-6 bg-[var(--text-primary)]/[0.02] border border-[var(--text-primary)]/5 rounded-xl border-l-2 border-l-[var(--accent)]">
                    <p className="m-0 text-[var(--text-primary)] opacity-90"><strong>Today:</strong> {p.today}</p>
                  </div>
                </div>
              </article>
            ))}

            {/* Principles in Practice Section */}
            <article id="practice" className="scroll-mt-40 pt-12 border-t border-[var(--text-primary)]/10">
              <div className="mb-8">
                <div style={{ fontFamily: 'Menlo, monospace', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent)', opacity: 0.6, marginBottom: '1rem' }}>
                  Application
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)] uppercase tracking-tight mb-4">
                  Principles in Practice
                </h2>
                <p className="text-[var(--text-secondary)] text-lg">
                  These principles are reflected in the decisions I've made throughout my projects.
                </p>
              </div>

              <div className="border border-[var(--text-primary)]/5 rounded-xl overflow-hidden bg-[var(--text-primary)]/[0.02]">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-4 p-4 border-b border-[var(--text-primary)]/5 bg-[var(--text-primary)]/[0.03]">
                  <div className="text-xs font-display uppercase tracking-widest text-[var(--text-primary)]/70">Principle</div>
                  <div className="text-xs font-display uppercase tracking-widest text-[var(--text-primary)]/70 hidden md:block">Real-world Application</div>
                </div>
                
                <div className="flex flex-col">
                  {PRACTICE_ROWS.map((row, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-2 md:gap-4 p-4 md:p-6 border-b border-[var(--text-primary)]/5 last:border-b-0 hover:bg-[var(--text-primary)]/[0.01] transition-colors">
                      <div className="text-[var(--text-primary)] font-medium text-sm sm:text-base">
                        {row.principle}
                      </div>
                      <div className="text-[var(--text-secondary)] text-sm sm:text-base">
                        {row.example}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--text-primary)]/10 py-12 px-6 md:px-12 text-center">
        <p className="text-[var(--text-secondary)] font-display text-sm uppercase tracking-widest mb-6">End of Journal</p>
        <Link to="/#principles" className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-base)] font-display font-bold uppercase text-sm tracking-widest rounded-full hover:bg-[var(--accent)] transition-colors">
          Return to Portfolio
        </Link>
      </footer>
    </div>
  );
}
