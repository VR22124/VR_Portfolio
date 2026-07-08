import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
type Chapter = {
  num: string;
  code: string;
  tag: string;
  name: string;
  full: string;
  description: string;
  keywords: string[];
};

const CHAPTERS: Chapter[] = [
  {
    num: '01',
    code: 'SCP',
    tag: 'Core',
    name: 'SCP Platform',
    full: 'ShepherEd Campus Platform',
    description:
      'The operational backbone of the ecosystem. Manages students, faculty, academics, attendance, departments, examinations, communication, and institutional workflows through a scalable multi-tenant architecture.',
    keywords: [
      'Academic Management',
      'Administration',
      'Departments',
      'Students',
      'Faculty',
      'Courses',
      'Attendance',
      'Examinations',
      'Institution Operations',
    ],
  },
  {
    num: '02',
    code: 'SIP',
    tag: 'Identity',
    name: 'SIP Platform',
    full: 'ShepherEd Identity Platform',
    description:
      'A standalone identity and access management platform responsible for authentication, authorization, onboarding, account lifecycle, invitations, sessions, roles, permissions, and tenant management across the ecosystem.',
    keywords: [
      'Authentication',
      'Authorization',
      'RBAC',
      'Identity',
      'SSO Ready',
      'Tenant Management',
      'User Lifecycle',
      'Security',
    ],
  },
  {
    num: '03',
    code: 'SOP',
    tag: 'Insight',
    name: 'SOP Platform',
    full: 'ShepherEd Observability Platform',
    description:
      'A centralized monitoring and diagnostics platform that collects structured logs, metrics, traces, and health information to provide complete visibility across every ShepherEd service.',
    keywords: [
      'Logging',
      'Monitoring',
      'Tracing',
      'Health Checks',
      'Diagnostics',
      'Performance',
      'Infrastructure',
      'Observability',
    ],
  },
  {
    num: '04',
    code: '△',
    tag: 'Network',
    name: 'Architecture',
    full: 'Ecosystem Architecture',
    description:
      'Built using a modular architecture where every platform can evolve independently while sharing secure communication patterns and consistent user experiences.',
    keywords: [
      'Modular Design',
      'Independent Deployments',
      'Scalable Services',
      'Shared Design System',
      'API-first',
      'Future-ready',
    ],
  },
];

export default function ShepherEd() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // Intro
      const introEls = root.querySelectorAll('[data-shep-intro]');
      if (introEls.length > 0) {
        gsap.from(introEls, {
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
      }

      // Chapters
      const chapters = gsap.utils.toArray<HTMLElement>('[data-shep-chapter]');
      chapters.forEach((el) => {
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
        const chips = el.querySelectorAll('[data-shep-chip]');
        if (chips.length > 0) {
          gsap.from(chips, {
            opacity: 0,
            y: 8,
            duration: reduced ? 0 : 0.5,
            ease: 'power2.out',
            stagger: 0.04,
            scrollTrigger: {
              trigger: el,
              start: 'top 78%',
              once: true,
            },
          });
        }
      });

      // Progress rail fill based on scroll through the right column
      const rail = root.querySelector<HTMLElement>('[data-shep-rail]');
      const rightCol = root.querySelector<HTMLElement>('[data-shep-right]');
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

  return (
    <section
      ref={rootRef}
      id="shephered"
      className="section-frame section-padding relative"
    >
      <div className="container-layout">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Sticky Header */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-7">
            <span
              data-shep-intro
              className="inline-flex items-center gap-2 text-[#d4ff4f] text-xs font-display tracking-[0.28em] uppercase"
            >
              <span className="text-[10px]">●</span> Featured Platform
            </span>

            <h2
              data-shep-intro
              className="font-display font-bold uppercase text-[#f5f5f2] leading-[0.9] tracking-tighter text-5xl sm:text-6xl md:text-7xl"
            >
              Building
              <br />
              ShepherEd
            </h2>

            <p
              data-shep-intro
              className="text-[#8c8c94] text-base sm:text-lg leading-relaxed max-w-md"
            >
              An enterprise-grade educational platform ecosystem designed from the ground
              up for modern institutions.
            </p>

            <p
              data-shep-intro
              className="text-[#8c8c94]/90 text-sm sm:text-base leading-relaxed max-w-md border-l border-[#f5f5f2]/10 pl-4"
            >
              ShepherEd is not a single application. It is a complete ecosystem of
              independent platforms that work together to manage identity, administration,
              learning, operations, and observability — modular, scalable, connected.
            </p>

            <div data-shep-intro className="pt-4 flex flex-col items-start gap-5">
              <div className="inline-flex items-center gap-3 py-2.5 px-5 rounded-full border border-[#f5f5f2]/10 bg-white/[0.04] backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4ff4f] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4ff4f]" />
                </span>
                <span className="text-[#f5f5f2] font-display text-[11px] uppercase tracking-[0.2em]">
                  Status · In Active Development
                </span>
              </div>

              <Link
                to="/case-studies/shephered"
                className="group relative inline-flex items-center gap-3 px-6 py-3.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#d4ff4f]/40 text-[#f5f5f2] rounded-full overflow-hidden transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4ff4f]/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
                <span className="font-display font-medium text-sm tracking-wide uppercase group-hover:text-[#d4ff4f] transition-colors">
                  Read Engineering Case Study
                </span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/40 group-hover:text-[#d4ff4f] transition-all group-hover:translate-x-1">
                  <path d="M2.91669 7H11.0834M11.0834 7L7.00002 2.91667M11.0834 7L7.00002 11.0833" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Scrolling Chapters */}
          <div
            data-shep-right
            className="lg:col-span-7 relative space-y-8 md:space-y-10"
          >
            {/* Progress rail */}
            <div
              aria-hidden
              className="hidden lg:block absolute -left-6 top-2 bottom-2 w-px bg-[#f5f5f2]/10 overflow-hidden"
            >
              <div
                data-shep-rail
                className="w-full h-full origin-top bg-[#d4ff4f]/70"
                style={{ transform: 'scaleY(0)' }}
              />
            </div>

            {CHAPTERS.map((c) => (
              <article
                key={c.code + c.num}
                data-shep-chapter
                className="group relative p-6 sm:p-8 rounded-2xl border border-[#f5f5f2]/10 bg-white/[0.02] backdrop-blur-md transition-colors duration-500 hover:border-[#d4ff4f]/30"
              >
                <div className="flex justify-between items-start gap-4 mb-5">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display font-bold text-4xl sm:text-5xl text-[#f5f5f2]/15 group-hover:text-[#d4ff4f]/40 transition-colors duration-500 leading-none">
                      {c.num}
                    </span>
                    <span className="font-display text-[#f5f5f2]/60 text-xs sm:text-sm uppercase tracking-[0.22em]">
                      {c.code}
                    </span>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 text-[10px] border border-[#d4ff4f]/40 text-[#d4ff4f] rounded-full uppercase font-display tracking-[0.18em]">
                    {c.tag}
                  </span>
                </div>

                <h3 className="font-display font-bold uppercase text-[#f5f5f2] text-xl sm:text-2xl mb-1.5 tracking-tight">
                  {c.full}
                </h3>
                <p className="text-[#8c8c94] leading-relaxed text-sm sm:text-base mb-6 max-w-[62ch]">
                  {c.description}
                </p>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {c.keywords.map((k) => (
                    <span
                      key={k}
                      data-shep-chip
                      className="text-[10px] sm:text-[11px] text-[#f5f5f2]/80 font-body uppercase tracking-[0.16em] bg-[#f5f5f2]/[0.04] border border-[#f5f5f2]/8 px-2.5 py-1 rounded"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </article>
            ))}

            {/* Closing statement */}
            <div
              data-shep-chapter
              className="pt-10 mt-2 border-t border-[#f5f5f2]/10"
            >
              <p className="font-display text-[#f5f5f2] text-lg sm:text-2xl leading-snug uppercase tracking-tight max-w-2xl">
                Building software isn't only about writing code. It's about designing
                systems that remain{' '}
                <span className="text-[#d4ff4f]">maintainable, scalable, and reliable</span>{' '}
                as they grow.
              </p>
              <p className="text-[#8c8c94] text-sm sm:text-base mt-4 max-w-xl leading-relaxed">
                ShepherEd is my ongoing journey toward building software at enterprise
                scale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
