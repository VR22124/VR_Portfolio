import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

const ACCENT = '#d4ff4f';
const AUTO_MS = 7000;
const LABEL = 'WHAT OTHERS SAY';

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const quoteMarkRef = useRef<HTMLDivElement>(null);
  const wordsWrapRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const attrRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const pausedRef = useRef(false);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const advanceTimeoutRef = useRef<number | null>(null);

  const testimonials = data.testimonials;
  const t = testimonials[active];

  const words = useMemo(() => t.quote.split(/(\s+)/), [t.quote]);

  // Split role: "CTO, Nimbus Systems" -> role="CTO", company="Nimbus Systems"
  const [roleTitle, roleCompany] = useMemo(() => {
    const parts = t.role.split(',').map(s => s.trim());
    return [parts[0] ?? t.role, parts.slice(1).join(', ')];
  }, [t.role]);

  // Section entrance — only fade in once
  useEffect(() => {
    if (!sectionRef.current) return;
    const el = sectionRef.current;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' });
        // Type the section label char by char
        if (labelRef.current) {
          const chars = labelRef.current.querySelectorAll<HTMLSpanElement>('[data-char]');
          gsap.to(chars, {
            opacity: 1,
            duration: 0.01,
            stagger: 0.035,
            ease: 'none',
            onComplete: () => setHasEntered(true),
          });
        } else {
          setHasEntered(true);
        }
      },
    });
    return () => st.kill();
  }, []);

  // Assemble the active quote whenever it changes (after entered)
  useEffect(() => {
    if (!hasEntered) return;

    const wordEls = wordsWrapRef.current?.querySelectorAll<HTMLSpanElement>('[data-word]') ?? [];
    const tl = gsap.timeline();

    // Reset states
    gsap.set(quoteMarkRef.current, { opacity: 0, scale: 0, rotate: -15 });
    gsap.set(wordEls, { opacity: 0, y: 18 });
    gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: '0% 50%' });
    gsap.set(attrRef.current, { opacity: 0, y: 12 });

    tl.to(quoteMarkRef.current, {
      opacity: 1,
      scale: 1,
      rotate: 0,
      duration: 0.7,
      ease: 'back.out(2)',
    })
      .to(
        wordEls,
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.055 },
        '-=0.3',
      )
      .to(ruleRef.current, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, '-=0.1')
      .to(attrRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');

    return () => {
      tl.kill();
    };
  }, [active, hasEntered]);

  // Auto-advance with progress bar
  useEffect(() => {
    if (!hasEntered) return;
    if (!progressRef.current) return;

    // Estimate assemble duration to delay progress start
    const wordCount = words.filter(w => w.trim().length > 0).length;
    const assembleDur = 0.7 + wordCount * 0.055 + 0.6;

    gsap.set(progressRef.current, { scaleX: 0, transformOrigin: '0% 50%' });

    const startProgress = () => {
      if (!progressRef.current) return;
      progressTweenRef.current = gsap.to(progressRef.current, {
        scaleX: 1,
        duration: AUTO_MS / 1000,
        ease: 'none',
        paused: pausedRef.current,
        onComplete: () => {
          setActive(i => (i + 1) % testimonials.length);
        },
      });
    };

    advanceTimeoutRef.current = window.setTimeout(startProgress, assembleDur * 1000);

    return () => {
      if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
      progressTweenRef.current?.kill();
      progressTweenRef.current = null;
    };
  }, [active, hasEntered, testimonials.length, words]);

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
    // Disassemble current quote — words scatter up & fade
    const wordEls = wordsWrapRef.current?.querySelectorAll<HTMLSpanElement>('[data-word]') ?? [];
    progressTweenRef.current?.kill();

    const tl = gsap.timeline({
      onComplete: () => setActive(i),
    });
    tl.to(wordEls, {
      opacity: 0,
      y: -14,
      duration: 0.3,
      ease: 'power2.in',
      stagger: { each: 0.02, from: 'end' },
    })
      .to(ruleRef.current, { scaleX: 0, duration: 0.3, ease: 'power2.inOut' }, '-=0.25')
      .to(attrRef.current, { opacity: 0, y: -8, duration: 0.25, ease: 'power2.in' }, '-=0.35')
      .to(quoteMarkRef.current, { opacity: 0, scale: 0.6, duration: 0.25, ease: 'power2.in' }, '-=0.2');
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="container-layout section-padding relative"
      style={{ opacity: 0 }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Section label — typed character by character on first entry */}
      <div
        ref={labelRef}
        className="mb-14 flex items-center gap-2 text-xs tracking-[0.24em] uppercase"
        style={{ color: '#8c8c94', fontFamily: 'var(--font-mono, ui-monospace, monospace)' }}
      >
        <span aria-hidden="true" style={{ color: ACCENT, opacity: 0 }} data-char>●</span>
        <span aria-hidden="true" data-char>&nbsp;</span>
        {LABEL.split('').map((c, i) => (
          <span key={i} data-char style={{ opacity: 0, display: 'inline-block', whiteSpace: 'pre' }}>
            {c}
          </span>
        ))}
      </div>

      {/* Quote block — full width */}
      <div className="relative">
        <div
          ref={quoteMarkRef}
          aria-hidden="true"
          className="font-display font-bold leading-none select-none"
          style={{
            color: ACCENT,
            fontSize: 'clamp(80px, 12vw, 180px)',
            lineHeight: 0.8,
            marginBottom: '0.1em',
            display: 'inline-block',
            transformOrigin: '0% 100%',
          }}
        >
          &ldquo;
        </div>

        <blockquote
          ref={wordsWrapRef}
          className="font-display font-medium"
          style={{
            color: '#f5f5f2',
            fontSize: 'clamp(28px, 4.6vw, 68px)',
            lineHeight: 1.18,
            letterSpacing: '-0.02em',
            marginBottom: '2.5rem',
          }}
        >
          {words.map((w, i) =>
            /^\s+$/.test(w) ? (
              <span key={i}>{w}</span>
            ) : (
              <span
                key={i}
                data-word
                style={{ display: 'inline-block', willChange: 'transform, opacity' }}
              >
                {w}
              </span>
            ),
          )}
        </blockquote>

        {/* Horizontal rule drawn left-to-right */}
        <div
          ref={ruleRef}
          className="mb-6"
          style={{ height: 1, width: '100%', background: '#2e2e36', transformOrigin: '0% 50%' }}
        />

        {/* Attribution */}
        <div ref={attrRef} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              style={{ color: ACCENT, fontSize: '10px', lineHeight: 1 }}
            >
              ●
            </span>
            <span
              className="font-display font-semibold"
              style={{ color: '#f5f5f2', fontSize: 'clamp(18px, 1.6vw, 22px)', letterSpacing: '-0.01em' }}
            >
              {t.author}
            </span>
          </div>
          <span
            style={{
              color: '#8c8c94',
              fontSize: '12px',
              letterSpacing: '0.08em',
              fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
              marginLeft: '20px',
            }}
          >
            {roleTitle}
            {roleCompany ? ` — ${roleCompany}` : ''}
          </span>
        </div>
      </div>

      {/* Progress + dash navigation */}
      <div className="mt-16 flex flex-col gap-5">
        <div
          style={{
            height: 1,
            width: '100%',
            background: '#1f1f24',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            ref={progressRef}
            style={{
              position: 'absolute',
              inset: 0,
              background: ACCENT,
              transformOrigin: '0% 50%',
              transform: 'scaleX(0)',
              boxShadow: `0 0 12px ${ACCENT}66`,
            }}
          />
        </div>

        <div className="flex items-center gap-3">
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
                  width: isActive ? 32 : 14,
                  background: isActive ? ACCENT : '#2e2e36',
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
    </section>
  );
}
