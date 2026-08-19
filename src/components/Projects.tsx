import { useEffect, useRef, useState } from 'react';
import projects from '../data/projects.json';

type Project = (typeof projects)[number];

const ACCENT = 'var(--accent)';

function pad(n: number) {
  return String(n + 1).padStart(2, '0');
}

/* --------------------------------- Row ------------------------------------ */
type Align = 'left' | 'right' | 'center';

function alignFor(i: number): Align {
  const mod = i % 3;
  return mod === 0 ? 'left' : mod === 1 ? 'right' : 'center';
}

interface RowProps {
  project: Project;
  index: number;
  isRevealed: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  isMobile: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

function ProjectRow({
  project, index, isRevealed, isHovered, isDimmed, isMobile,
  onEnter, onLeave,
}: RowProps) {
  const align: Align = isMobile ? 'left' : alignFor(index);
  const idx = pad(index);
  const stagger = 0.06;

  const meta = (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.9rem',
        fontFamily: 'Menlo, monospace',
        fontSize: '10px',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: isHovered ? 'var(--text-secondary)' : '#5a5a64',
        marginBottom: '1rem',
        transition: 'color 0.35s ease',
        flexWrap: 'wrap',
      }}
    >
      {align === 'right' ? (
        <>
          <span>{project.subtitle?.split(' ').slice(0, 2).join(' ') || 'Case Study'}</span>
          <span style={{ color: '#2a2a30' }}>/</span>
          <span>{project.year}</span>
          <span style={{ color: ACCENT }}>{idx}</span>
        </>
      ) : align === 'center' ? (
        <>
          <span style={{ color: '#2a2a30' }}>[</span>
          <span>{project.subtitle?.split(' ').slice(0, 2).join(' ') || 'Case Study'}</span>
          <span style={{ color: '#2a2a30' }}>/</span>
          <span>{project.year}</span>
          <span style={{ color: ACCENT }}>· {idx}</span>
          <span style={{ color: '#2a2a30' }}>]</span>
        </>
      ) : (
        <>
          <span style={{ color: ACCENT }}>{idx}</span>
          <span>{project.subtitle?.split(' ').slice(0, 2).join(' ') || 'Case Study'}</span>
          <span style={{ color: '#2a2a30' }}>/</span>
          <span>{project.year}</span>
        </>
      )}
    </div>
  );

  const title = (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <h3
        className="font-display"
        style={{
          fontWeight: 300,
          fontSize: isMobile ? 'clamp(38px, 10vw, 64px)' : 'clamp(48px, 6.5vw, 112px)',
          letterSpacing: '-0.04em',
          lineHeight: 0.95,
          margin: '0 0 1.75rem',
          color: isHovered ? ACCENT : 'var(--text-primary)',
          transition: 'color 0.5s ease, letter-spacing 0.5s ease',
          cursor: 'pointer',
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
          maxWidth: '100%',
        }}
      >
        {project.title}
      </h3>
      {/* Accent underline */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '1.35rem',
          height: 1,
          background: ACCENT,
          transformOrigin: align === 'right' ? 'right center' : 'left center',
          transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 0.55s cubic-bezier(0.7,0,0.3,1)',
          opacity: 0.55,
        }}
      />
    </div>
  );

  const description = (
    <p
      style={{
        fontFamily: 'Inter, sans-serif',
        fontWeight: 300,
        fontSize: 'clamp(15px, 1.15vw, 19px)',
        lineHeight: 1.65,
        color: '#a8a8b0',
        margin: 0,
        maxWidth: '38ch',
      }}
    >
      {project.description}
    </p>
  );

  const tagsAndLink = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        alignItems:
          align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.35rem 1.1rem',
          justifyContent:
            align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start',
        }}
      >
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: 'Menlo, monospace',
              fontSize: '11px',
              color: isHovered ? '#c8c8d0' : '#5a5a64',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              transition: 'color 0.35s ease',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {align === 'center' ? (
        <a
          href={project.link}
          onClick={(e) => project.link === '#' && e.preventDefault()}
          aria-label={`View ${project.title}`}
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            border: `1px solid ${isHovered ? ACCENT : 'rgba(140,140,148,0.28)'}`,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isHovered ? 'var(--bg-base)' : ACCENT,
            background: isHovered ? ACCENT : 'transparent',
            transition: 'all 0.4s ease',
            textDecoration: 'none',
            fontSize: 18,
          }}
        >
          <span
            style={{
              transform: isHovered ? 'rotate(0deg)' : 'rotate(-45deg)',
              transition: 'transform 0.5s cubic-bezier(0.7,0,0.3,1)',
              display: 'inline-block',
            }}
          >
            ↘
          </span>
        </a>
      ) : (
        <a
          href={project.link}
          onClick={(e) => project.link === '#' && e.preventDefault()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'Menlo, monospace',
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: ACCENT,
            textDecoration: 'none',
            paddingBottom: 4,
            borderBottom: `1px solid ${isHovered ? ACCENT : 'color-mix(in srgb, var(--accent) 25%, transparent)'}`,
            transition: 'border-color 0.35s ease',
          }}
        >
          Explore project
          <span
            style={{
              display: 'inline-block',
              transform: isHovered ? 'translateX(6px)' : 'translateX(0)',
              transition: 'transform 0.4s cubic-bezier(0.7,0,0.3,1)',
            }}
          >
            →
          </span>
        </a>
      )}
    </div>
  );

  // Layout by alignment
  const articleStyle: React.CSSProperties = {
    position: 'relative',
    maxWidth: align === 'center' ? '640px' : '820px',
    marginLeft: align === 'right' ? 'auto' : align === 'center' ? 'auto' : 0,
    marginRight: align === 'center' ? 'auto' : undefined,
    textAlign: align,
    display: 'flex',
    flexDirection: 'column',
    alignItems: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start',
    opacity: isRevealed ? (isDimmed ? 0.35 : 1) : 0,
    transform: isRevealed ? 'translateY(0)' : 'translateY(40px)',
    transition: `opacity 0.7s ease ${stagger}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${stagger}s`,
    cursor: 'default',
  };

  return (
    <article
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={articleStyle}
    >
      {/* Ghost watermark numeral */}
      <div
        aria-hidden="true"
        className="font-display"
        style={{
          position: 'absolute',
          top: '50%',
          [align === 'right' ? 'left' : 'right']:
            align === 'center' ? '50%' : '-4vw',
          transform:
            align === 'center'
              ? 'translate(-50%, -50%)'
              : 'translateY(-50%)',
          fontSize: 'clamp(140px, 22vw, 340px)',
          fontWeight: 700,
          letterSpacing: '-0.06em',
          lineHeight: 1,
          color: 'var(--text-primary)',
          opacity: isHovered ? 0.12 : 0.06,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        {idx}
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {meta}
        {title}

        {align === 'center' ? (
          <>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'center' }}>
              {description}
            </div>
            {tagsAndLink}
          </>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: 'clamp(1.5rem, 3vw, 3rem)',
              alignItems: 'end',
              width: '100%',
              direction: align === 'right' ? 'rtl' : 'ltr',
            }}
          >
            <div style={{ direction: 'ltr', textAlign: 'left' }}>{description}</div>
            <div style={{ direction: 'ltr' }}>{tagsAndLink}</div>
          </div>
        )}
      </div>
    </article>
  );
}

/* --------------------------------- Projects ------------------------------- */
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [revealedRows, setRevealedRows] = useState<Set<number>>(new Set());
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHeaderVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      setRevealedRows(new Set(projects.map((_, i) => i)));
      return;
    }
    const cleanups: (() => void)[] = [];
    rowRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setRevealedRows((prev) => {
              const n = new Set(prev);
              n.add(i);
              return n;
            });
            obs.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
      );
      obs.observe(el);
      cleanups.push(() => obs.disconnect());
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="container-layout section-padding"
      style={{ background: 'transparent', position: 'relative', overflowX: 'hidden' }}
    >
      {/* Header */}
      <header
        style={{
          marginBottom: 'clamp(4rem, 10vh, 8rem)',
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div
          style={{
            fontFamily: 'Menlo, monospace',
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: ACCENT,
            marginBottom: '1.25rem',
          }}
        >
          ● Selected Work
        </div>
        <h2
          className="font-display"
          style={{
            fontWeight: 300,
            fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)',
            letterSpacing: '-0.035em',
            lineHeight: 1.05,
            color: 'var(--text-primary)',
            margin: 0,
            maxWidth: '18ch',
          }}
        >
          Digital{' '}
          <span
            style={{
              fontStyle: 'italic',
              fontWeight: 300,
              color: '#5a5a64',
            }}
          >
            artifacts
          </span>{' '}
          &<br />
          experimental interfaces.
        </h2>
      </header>

      {/* Project stream */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(6rem, 18vh, 14rem)',
        }}
      >
        {projects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => { rowRefs.current[i] = el; }}
          >
            <ProjectRow
              project={project}
              index={i}
              isRevealed={revealedRows.has(i)}
              isHovered={!isMobile && hoveredIndex === i}
              isDimmed={!isMobile && hoveredIndex !== null && hoveredIndex !== i}
              isMobile={isMobile}
              onEnter={() => !isMobile && setHoveredIndex(i)}
              onLeave={() => !isMobile && setHoveredIndex(null)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
