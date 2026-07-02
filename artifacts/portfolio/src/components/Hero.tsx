import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ started = false }: { started?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);

  // Trigger entrance shortly after mount (or when `started` flips true)
  useEffect(() => {
    const t = setTimeout(() => setPlay(true), started ? 80 : 320);
    return () => clearTimeout(t);
  }, [started]);

  // Staggered entrance for hero content
  useEffect(() => {
    if (!play || !contentRef.current) return;
    const els = contentRef.current.querySelectorAll<HTMLElement>('[data-hero-anim]');
    gsap.fromTo(
      els,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.09,
      }
    );
  }, [play]);

  // Chevron scroll fade
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=200',
      scrub: true,
      onUpdate: (self) => {
        if (chevronRef.current) {
          chevronRef.current.style.opacity = String(Math.max(0, 1 - self.progress * 5));
        }
      },
    });
    return () => trigger.kill();
  }, []);

  const { name, role, location, tagline, ctaPrimary, ctaSecondary, socials } = data.hero as any;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center pt-28 pb-16"
    >
      <div className="hero-text-scrim" aria-hidden="true" />

      <div className="container-layout w-full relative z-10">
        <div ref={contentRef} className="max-w-[820px]">

          {/* Role · divider · Location */}
          <div
            data-hero-anim
            className="flex flex-wrap items-center gap-4 mb-8"
            style={{ opacity: 0 }}
          >
            <span className="text-[#d4ff4f] text-[11px] font-medium uppercase tracking-[0.3em]">
              {role}
            </span>
            <div className="h-[1px] w-8 bg-[#2e2e36]" />
            <span className="text-[#8c8c94] text-[11px] font-medium uppercase tracking-[0.25em]">
              {location}
            </span>
          </div>

          {/* Name — single line, uppercase, glitch (red/black split) */}
          <h1
            data-hero-anim
            className="font-display font-bold uppercase tracking-[-0.02em] leading-[0.95] text-[#f5f5f2] whitespace-nowrap"
            style={{
              opacity: 0,
              fontSize: 'clamp(2.4rem, 7.2vw, 5.75rem)',
            }}
          >
            <span
              className="glitch"
              data-text={`${name.first} ${name.accent} ${name.last}`.toUpperCase()}
            >
              {name.first} <span className="text-[#d4ff4f]">{name.accent}</span> {name.last}
            </span>
          </h1>

          {/* Tagline */}
          <p
            data-hero-anim
            className="mt-8 max-w-[520px] text-lg md:text-xl text-[#8c8c94] leading-relaxed"
            style={{ opacity: 0 }}
          >
            {tagline.prefix}
            <span className="text-[#f5f5f2]">{tagline.accent}</span>
            {tagline.suffix}
          </p>

          {/* CTAs */}
          <div
            data-hero-anim
            className="mt-12 flex flex-wrap gap-4"
            style={{ opacity: 0 }}
          >
            <a
              href={ctaPrimary.target}
              className="bg-[#d4ff4f] text-[#08080a] px-8 py-4 text-sm font-semibold rounded-[2px] hover:bg-[#c8f03d] transition-colors"
            >
              {ctaPrimary.label}
            </a>
            <a
              href={ctaSecondary.target}
              className="border border-[#2e2e36] text-[#f5f5f2] px-8 py-4 text-sm font-semibold rounded-[2px] hover:border-[#4a4a52] hover:bg-[#111114] transition-colors"
            >
              {ctaSecondary.label}
            </a>
          </div>

          {/* Socials */}
          <div
            data-hero-anim
            className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3"
            style={{ opacity: 0 }}
          >
            {(socials || []).map((s: { label: string; href: string }) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[#8c8c94] hover:text-[#d4ff4f] text-[11px] font-medium uppercase tracking-[0.25em] transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={chevronRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#4a4a52] pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-[1px] h-10 bg-gradient-to-b from-transparent to-[#4a4a52]" />
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 1l4 4 4-4" />
        </svg>
      </div>
    </section>
  );
}
