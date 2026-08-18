import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../contexts/ThemeContext';
import meta from '../data/meta.json';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: 'Journey',    href: '#journey' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Work',       href: '#projects' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const { theme, toggleTheme } = useTheme();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  // Scroll progress + active section tracking
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      // Scroll progress bar
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const maxScroll = doc.scrollHeight - doc.clientHeight;
      if (progressRef.current) {
        progressRef.current.style.width = `${Math.min((scrollTop / maxScroll) * 100, 100)}%`;
      }

      // Active section detection
      const sections = ['journey', 'experience', 'skills', 'projects'];
      let current = '';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Move sliding indicator to active link
  useEffect(() => {
    const activeIdx = NAV_LINKS.findIndex(l => l.href === `#${activeSection}`);
    if (activeIdx === -1 || !indicatorRef.current) return;
    const linkEl = linkRefs.current[activeIdx];
    if (!linkEl) return;
    const navEl = linkEl.closest('.nav-pill-bg') as HTMLElement;
    if (!navEl) return;
    const navRect = navEl.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();
    gsap.to(indicatorRef.current, {
      x: linkRect.left - navRect.left,
      width: linkRect.width,
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out'
    });
  }, [activeSection]);

  return (
    <>
      {/* Scroll progress bar */}
      <div
        ref={progressRef}
        className="scroll-progress-bar"
        aria-hidden="true"
      />

      <nav 
        ref={navRef} 
        className={`fixed top-0 left-0 w-full z-40 py-4 transition-all duration-300 ${
          mobileOpen 
            ? 'bg-[var(--bg-base)] border-b border-[var(--border)]' 
            : scrolled 
              ? 'bg-[var(--bg-base)]/90 backdrop-blur-md border-b border-[var(--border)]/40 md:bg-transparent md:backdrop-blur-none md:border-transparent'
              : ''
        }`}
      >
        <div className="container-layout flex items-center gap-4">

          {/* Logo / Monogram */}
          <a
            href="#"
            className="group flex items-center gap-3 shrink-0"
            onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <div className="w-9 h-9 bg-[var(--accent)] flex items-center justify-center">
              <span className="font-display font-bold text-[var(--bg-base)] text-sm leading-none tracking-tight">
                {meta.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
              </span>
            </div>
            <span className="hidden md:block font-display font-medium text-[var(--text-primary)] text-sm tracking-tight opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
              {meta.name}
            </span>
          </a>

          {/* Center floating pill — desktop */}
          <div className={`hidden md:flex relative items-center nav-pill-bg px-1.5 py-1.5 gap-0.5 mx-auto ${scrolled ? 'scrolled' : ''}`}>
            {/* Sliding active indicator */}
            <span
              ref={indicatorRef}
              className="absolute top-1.5 left-1.5 h-[calc(100%-12px)] bg-[#ffffff0d] rounded-full pointer-events-none"
              style={{ width: 0, opacity: 0 }}
              aria-hidden="true"
            />
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.label}
                ref={el => { linkRefs.current[i] = el; }}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className={`relative z-10 px-4 py-2 text-[13px] font-medium rounded-full transition-colors duration-200 ${
                  activeSection === link.href.slice(1)
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: availability + CTA */}
          <div className="hidden md:flex items-center gap-4 shrink-0 ml-auto md:ml-0">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              Available
            </div>
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, '#contact')}
              className="text-[13px] font-medium bg-[var(--accent)] text-[var(--bg-base)] px-5 py-2.5 rounded-full hover:opacity-80 transition-opacity"
            >
              Let's Talk
            </a>
            
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Right: Theme Toggle + Hamburger */}
          <div className="md:hidden ml-auto flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-primary)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center text-[var(--text-primary)]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                {mobileOpen
                  ? <><path d="M1 1L17 11"/><path d="M17 1L1 11"/></>
                  : <><line x1="0" y1="1" x2="18" y2="1"/><line x1="4" y1="6" x2="18" y2="6"/><line x1="8" y1="11" x2="18" y2="11"/></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="container-layout pt-4 pb-6 flex flex-col gap-1 border-t border-[var(--border)] mt-4">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="py-3 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border-b border-[var(--border)]/40"
                onClick={(e) => {
                  setMobileOpen(false);
                  handleScroll(e, link.href);
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-3 py-3 text-sm font-medium text-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
              onClick={(e) => {
                setMobileOpen(false);
                handleScroll(e, '#contact');
              }}
            >
              Let's Talk →
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
