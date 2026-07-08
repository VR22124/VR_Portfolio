import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import engineeringWithAI from '../data/engineeringWithAI.json';

export default function EngineeringWithAI() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // Intro animations
      gsap.from('[data-ai-intro]', {
        opacity: 0,
        y: 24,
        duration: reduced ? 0 : 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: root,
          start: 'top 75%',
          once: true,
        },
      });

      // Chapter/Card animations
      const cards = gsap.utils.toArray<HTMLElement>('[data-ai-card]');
      cards.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: reduced ? 0 : 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            once: true,
          },
        });
      });

      // Progress rail fill based on scroll through the right column
      const rail = root.querySelector<HTMLElement>('[data-ai-rail]');
      const rightCol = root.querySelector<HTMLElement>('[data-ai-right]');
      if (rail && rightCol) {
        gsap.to(rail, {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: rightCol,
            start: 'top 60%',
            end: 'bottom 70%',
            scrub: true,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  const { heroHeading, heroStatement, heroSubStatement, practices } = engineeringWithAI as any;

  return (
    <section
      ref={rootRef}
      id="engineering-with-ai"
      className="section-frame section-padding relative z-10"
    >
      <div className="container-layout">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Sticky Header Left Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-7">
            <span
              data-ai-intro
              className="inline-flex items-center gap-2 text-[#d4ff4f] text-xs font-display tracking-[0.28em] uppercase"
            >
              <span className="text-[10px]">●</span> Methodology
            </span>

            <h2
              data-ai-intro
              className="font-display font-bold uppercase text-[#f5f5f2] leading-[0.9] tracking-tighter text-4xl sm:text-5xl md:text-6xl lg:text-7xl whitespace-pre-wrap break-words"
            >
              {heroHeading}
            </h2>

            <p
              data-ai-intro
              className="text-[#8c8c94] text-base sm:text-lg leading-relaxed max-w-md"
            >
              {heroStatement}
            </p>

            <p
              data-ai-intro
              className="text-[#8c8c94]/90 text-sm sm:text-base leading-relaxed max-w-md border-l border-[#f5f5f2]/10 pl-4"
            >
              {heroSubStatement}
            </p>

            <div data-ai-intro className="pt-4">
              <div className="inline-flex items-center gap-3 py-2.5 px-5 rounded-full border border-[#f5f5f2]/10 bg-white/[0.04] backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4ff4f] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4ff4f]" />
                </span>
                <span className="text-[#f5f5f2] font-display text-[11px] uppercase tracking-[0.2em]">
                  Workflow · Production Ready
                </span>
              </div>
            </div>
          </div>

          {/* Scrolling Cards Right Column */}
          <div
            data-ai-right
            className="lg:col-span-7 relative space-y-8 md:space-y-10"
          >
            {/* Progress rail */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute -left-6 top-2 bottom-2 w-px bg-[#f5f5f2]/10 overflow-hidden"
            >
              <div
                data-ai-rail
                className="w-full h-full origin-top bg-[#d4ff4f]/70"
                style={{ transform: 'scaleY(0)' }}
              />
            </div>

            {practices.map((practice: any) => (
              <article
                key={practice.id}
                data-ai-card
                className="group relative p-6 sm:p-8 rounded-2xl border border-[#f5f5f2]/10 bg-white/[0.02] backdrop-blur-md transition-colors duration-500 hover:border-[#d4ff4f]/30"
              >
                <div className="flex justify-between items-start gap-4 mb-5">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display font-bold text-4xl sm:text-5xl text-[#f5f5f2]/15 group-hover:text-[#d4ff4f]/40 transition-colors duration-500 leading-none">
                      {practice.id}
                    </span>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 text-[10px] border border-[#d4ff4f]/40 text-[#d4ff4f] rounded-full uppercase font-display tracking-[0.18em]">
                    {practice.tag}
                  </span>
                </div>

                <h3 className="font-display font-bold uppercase text-[#f5f5f2] text-xl sm:text-2xl mb-1.5 tracking-tight">
                  {practice.title}
                </h3>
                <p className="text-[#8c8c94] leading-relaxed text-sm sm:text-base max-w-[62ch]">
                  {practice.content}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
