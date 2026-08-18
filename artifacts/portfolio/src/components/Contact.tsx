import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IconMap } from './IconMap';
import contact from '../data/contact.json';
import meta from '../data/meta.json';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([badgeRef.current, headlineRef.current, subtextRef.current, emailRef.current, footerRef.current],
        { opacity: 0, y: 30 }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true
        }
      });

      tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
        .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.2')
        .to(subtextRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.35')
        .to(emailRef.current, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.25')
        .to(footerRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="contact"
      ref={sectionRef}
      className="border-t border-[var(--border)] relative overflow-hidden"
      style={{ paddingTop: '120px', paddingBottom: '60px' }}
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 100%, color-mix(in srgb, var(--accent) 4%, transparent) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="container-layout relative z-10">
        {/* Availability badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border-bright)] rounded-full mb-10"
          style={{ opacity: 0 }}
        >
          <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
          <span className="text-xs font-medium text-[var(--text-secondary)] tracking-wide uppercase">
            Open to new projects
          </span>
        </div>

        {/* Headline — the emotional close */}
        <div ref={headlineRef} className="mb-6" style={{ opacity: 0 }}>
          <h2
            className="font-display font-bold text-[var(--text-primary)] leading-[0.95]"
            style={{ fontSize: 'clamp(36px, 6vw, 88px)', letterSpacing: '-0.03em' }}
          >
            Let's build
            <br />
            <span className="text-[var(--accent)]">something that lasts.</span>
          </h2>
        </div>

        <p
          ref={subtextRef}
          className="text-body text-[var(--text-secondary)] max-w-md mb-14"
          style={{ opacity: 0 }}
        >
          {contact.subtext}
        </p>

        {/* Email CTA — the centrepiece */}
        <a
          ref={emailRef}
          href={`mailto:${contact.email}`}
          className="group inline-flex items-center gap-5 mb-24"
          style={{ opacity: 0 }}
        >
          <span
            className="font-display font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-300"
            style={{ fontSize: 'clamp(22px, 3.5vw, 52px)', letterSpacing: '-0.02em' }}
          >
            {contact.email}
          </span>
          <span
            className="flex items-center justify-center w-12 h-12 border border-[var(--border-bright)] rounded-full group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] transition-all duration-300 shrink-0"
          >
            <svg
              className="group-hover:text-[var(--bg-base)] text-[var(--text-tertiary)] transition-colors duration-300"
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </span>
        </a>

        {/* Footer strip */}
        <div
          ref={footerRef}
          className="flex flex-col gap-8 pt-10 border-t border-[var(--border)]"
          style={{ opacity: 0 }}
        >
          {/* Name + Contact — NAP consistency for SEO */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)] tracking-wide">{meta.name}</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">Full-Stack Developer · Salem, Tamil Nadu, India</p>
            </div>
            <a
              href={`mailto:${contact.email}`}
              className="text-xs text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors duration-200"
            >
              {contact.email}
            </a>
          </div>

          {/* Socials + copyright + back to top */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {contact.socials.map((social, i) => {
                const Icon = IconMap[social.icon];
                return (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-200"
                  >
                    {Icon && <Icon size={16} />}
                    <span className="text-xs font-medium tracking-wide">{social.label}</span>
                  </a>
                );
              })}
            </div>

            <div className="flex items-center gap-8 text-xs text-[var(--border-bright)]">
              <span>© {new Date().getFullYear()} {meta.name}</span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group flex items-center gap-2 hover:text-[var(--text-secondary)] transition-colors duration-200"
              >
                Back to top
                <svg
                  width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  className="group-hover:-translate-y-0.5 transition-transform duration-200"
                >
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
