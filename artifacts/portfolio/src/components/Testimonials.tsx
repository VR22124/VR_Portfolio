import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

const ACCENT = '#d4ff4f';
const AUTO_MS = 8000;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const attrRef = useRef<HTMLDivElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const pausedRef = useRef(false);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const advanceTimeoutRef = useRef<number | null>(null);

  const testimonials = data.testimonials;
  const t = testimonials[active];
  const total = testimonials.length;

  const [roleTitle, roleCompany] = useMemo(() => {
    const parts = t.role.split(/[,·|]/).map(s => s.trim());
    return [parts[0] ?? t.role, parts.slice(1).join(' / ')];
  }, [t.role]);

  const indexLabel = String(active + 1).padStart(2, '0');
  const totalLabel = String(total).padStart(2, '0');

  // Section entrance
  useEffect(() => {
    if (!sectionRef.current || !cardRef.current) return;
    const el = sectionRef.current;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap
          .timeline({ onComplete: () => setEntered(true) })
          .to(el, { opacity: 1, duration: 0.5, ease: 'power2.out' })
          .from(cardRef.current, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0);
      },
    });
    return () => st.kill();
  }, []);

  // Animate quote in on active change
  useEffect(() => {
    if (!entered) return;
    const tl = gsap.timeline();
    tl.fromTo(
      indexRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    )
      .fromTo(
        quoteRef.current,
        { opacity: 0, y: 18, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
        '-=0.35',
      )
      .fromTo(
        attrRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.4',
      );
    return () => {
      tl.kill();
    };
  }, [active, entered]);

  // Progress + auto-advance
  useEffect(() => {
    if (!entered || !accentLineRef.current) return;
    gsap.set(accentLineRef.current, { width: '0%' });
    const start = window.setTimeout(() => {
      progressTweenRef.current = gsap.to(accentLineRef.current, {
        width: '100%',
        duration: AUTO_MS / 1000,
        ease: 'none',
        paused: pausedRef.current,
        onComplete: () => setActive(i => (i + 1) % total),
      });
    }, 400);
    advanceTimeoutRef.current = start;
    return () => {
      window.clearTimeout(start);
      progressTweenRef.current?.kill();
      progressTweenRef.current = null;
    };
  }, [active, entered, total]);

  const handleEnter = () => {
    pausedRef.current = true;
    progressTweenRef.current?.pause();
  };
  const handleLeave = () => {
    pausedRef.current = false;
    progressTweenRef.current?.resume();
  };

  const goTo = (i: number) => {
    if (i === active) return;
    progressTweenRef.current?.kill();
    if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
    const tl = gsap.timeline({ onComplete: () => setActive(i) });
    tl.to([quoteRef.current, attrRef.current, indexRef.current], {
      opacity: 0,
      y: -10,
      filter: 'blur(4px)',
      duration: 0.3,
      ease: 'power2.in',
      stagger: 0.04,
    });
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="container-layout section-padding relative"
      style={{ opacity: 0 }}
    >
      {/* Eyebrow */}
      <div
        className="mb-10 flex items-center gap-3 text-xs uppercase"
        style={{
          color: '#8c8c94',
          letterSpacing: '0.28em',
          fontFamily: 'var(--font-mono, ui-monospace, monospace)',
        }}
      >
        <span aria-hidden style={{ color: ACCENT }}>●</span>
        <span>What others say</span>
      </div>

      <div
        ref={cardRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="relative grid grid-cols-12 overflow-hidden"
        style={{
          border: '1px solid rgba(245,245,242,0.08)',
          background: 'transparent',
          borderRadius: 2,
        }}
      >
        {/* Outlined index — top right */}
        <div className="pointer-events-none absolute top-0 right-0 select-none" style={{ padding: '20px 28px' }}>
          <span
            ref={indexRef}
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(56px, 8vw, 112px)',
              lineHeight: 0.9,
              color: 'transparent',
              WebkitTextStroke: `1px ${ACCENT}`,
              opacity: 0.28,
              letterSpacing: '-0.02em',
              display: 'inline-block',
            }}
          >
            {indexLabel}
          </span>
        </div>

        {/* Left rail — vertical label */}
        <div
          className="hidden md:flex col-span-1 flex-col items-center justify-center"
          style={{ borderRight: '1px solid rgba(245,245,242,0.08)', padding: '48px 0' }}
        >
          <span
            className="font-semibold"
            style={{
              color: '#8c8c94',
              fontSize: 9,
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              writingMode: 'vertical-lr',
              transform: 'rotate(180deg)',
              fontFamily: 'var(--font-mono, ui-monospace, monospace)',
            }}
          >
            Verified Perspective
          </span>
        </div>

        {/* Main content */}
        <div
          className="col-span-12 md:col-span-11 relative flex flex-col justify-center"
          style={{ padding: 'clamp(28px, 5vw, 72px)' }}
        >
          {/* Tag */}
          <div className="mb-10 inline-flex items-center gap-4">
            <div style={{ width: 48, height: 1, background: ACCENT }} />
            <span
              className="font-display font-bold"
              style={{
                color: ACCENT,
                fontSize: 10,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
              }}
            >
              Testimonial
            </span>
          </div>

          {/* Quote */}
          <blockquote className="max-w-4xl">
            <p
              ref={quoteRef}
              className="font-display"
              style={{
                color: '#f5f5f2',
                fontSize: 'clamp(20px, 2.2vw, 32px)',
                lineHeight: 1.35,
                fontWeight: 300,
                letterSpacing: '-0.01em',
              }}
            >
              <span style={{ color: ACCENT, fontStyle: 'italic', marginRight: 4 }}>&ldquo;</span>
              {t.quote}
              <span style={{ color: ACCENT, fontStyle: 'italic', marginLeft: 4 }}>&rdquo;</span>
            </p>
          </blockquote>

          {/* Attribution + navigation */}
          <div
            ref={attrRef}
            className="mt-12 flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div className="flex items-center gap-5">
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 999,
                  border: '1px solid rgba(245,245,242,0.16)',
                  padding: 4,
                  background: '#111114',
                }}
              >
                <div
                  className="flex h-full w-full items-center justify-center font-display font-bold"
                  style={{
                    borderRadius: 999,
                    background: 'rgba(212,255,79,0.10)',
                    color: ACCENT,
                    fontSize: 13,
                    letterSpacing: '0.05em',
                  }}
                >
                  {initials(t.author)}
                </div>
              </div>
              <div className="flex flex-col">
                <cite
                  className="font-display font-semibold not-italic"
                  style={{
                    color: '#f5f5f2',
                    fontSize: 14,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                  }}
                >
                  {t.author}
                </cite>
                <span
                  style={{
                    color: '#8c8c94',
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    marginTop: 4,
                    fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                  }}
                >
                  {roleTitle}
                  {roleCompany ? ` / ${roleCompany}` : ''}
                </span>
              </div>
            </div>

            {/* Dash pagination + count */}
            <div className="flex items-center gap-5">
              <span
                style={{
                  color: '#8c8c94',
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                }}
              >
                <span style={{ color: ACCENT }}>{indexLabel}</span>
                <span style={{ margin: '0 6px' }}>/</span>
                {totalLabel}
              </span>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Testimonial ${i + 1}`}
                      className="transition-all duration-300"
                      style={{
                        height: 2,
                        width: isActive ? 32 : 10,
                        background: isActive ? ACCENT : 'rgba(245,245,242,0.22)',
                        boxShadow: isActive ? `0 0 10px ${ACCENT}80` : 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent progress line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: 1,
            width: '100%',
            background: 'rgba(245,245,242,0.06)',
          }}
        >
          <div
            ref={accentLineRef}
            style={{
              height: '100%',
              width: '0%',
              background: ACCENT,
              boxShadow: `0 0 12px ${ACCENT}66`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
