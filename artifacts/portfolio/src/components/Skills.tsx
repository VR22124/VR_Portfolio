import { useEffect, useMemo, useRef, useState } from 'react';
import * as SiIcons from 'react-icons/si';
import data from '../data.json';

type Skill = (typeof data.skills)[number];

const CATEGORY_ORDER = ['Frontend', 'Language', 'Backend', 'API', 'Database', 'Infra', 'Design'];
const sorted = [...data.skills].sort(
  (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
);

const ACCENT = '#d4ff4f';

/* ------------------------------ CountUpNumber ------------------------------ */
function CountUpNumber({
  target,
  play,
  glow,
  reroll,
  isMobile,
}: {
  target: number;
  play: boolean;
  glow: boolean;
  reroll: number; // increments to trigger a re-roll
  isMobile: boolean;
}) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const hasPlayedRef = useRef(false);

  const animateTo = (from: number, to: number, duration: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (play && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      animateTo(0, target, 900);
    }
  }, [play, target]);

  useEffect(() => {
    if (reroll > 0 && hasPlayedRef.current) {
      animateTo(Math.max(0, target - 18), target, 450);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reroll]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const display = value.toString().padStart(2, '0');
  return (
    <span
      style={{
        fontFamily: 'Menlo, monospace',
        fontVariantNumeric: 'tabular-nums',
        fontSize: isMobile ? '12px' : '14px',
        minWidth: '2.4ch',
        display: 'inline-block',
        textAlign: 'right',
        color: glow ? ACCENT : '#3a3a44',
        textShadow: glow ? `0 0 10px rgba(212,255,79,0.55)` : 'none',
        transition: 'color 0.25s ease, text-shadow 0.25s ease',
      }}
      aria-label={`${target}% proficiency`}
    >
      {display}
    </span>
  );
}

/* --------------------------------- Row ------------------------------------ */
function SkillRow({
  skill,
  index,
  isRevealed,
  isHovered,
  isFiltered,
  isMobile,
  onMouseEnter,
  onMouseLeave,
}: {
  skill: Skill;
  index: number;
  isRevealed: boolean;
  isHovered: boolean;
  isFiltered: boolean; // true = hidden by filter
  isMobile: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const Icon = (SiIcons as Record<string, React.ComponentType<{ size?: number }>>)[skill.icon];
  const stagger = index * 0.09; // 90ms cascade

  const [pingKey, setPingKey] = useState(0);
  const [rerollKey, setRerollKey] = useState(0);
  const prevHover = useRef(false);
  useEffect(() => {
    if (isHovered && !prevHover.current) {
      setPingKey((k) => k + 1);
      setRerollKey((k) => k + 1);
    }
    prevHover.current = isHovered;
  }, [isHovered]);

  const nameColor = isMobile
    ? '#d4d4d0'
    : isHovered
      ? '#f5f5f2'
      : '#4a4a52';

  const iconColor = isMobile
    ? 'rgba(212,255,79,0.55)'
    : isHovered
      ? ACCENT
      : '#3a3a44';

  const tagColor = isMobile
    ? '#5a5a64'
    : isHovered
      ? ACCENT
      : '#3a3a44';

  const rowMaxHeight = isFiltered ? 0 : 200;
  const rowOpacity = isFiltered ? 0 : isRevealed ? 1 : 0;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        maxHeight: rowMaxHeight,
        opacity: rowOpacity,
        overflow: 'hidden',
        transition: 'max-height 0.6s cubic-bezier(0.7,0,0.3,1), opacity 0.5s ease',
      }}
    >
      {/* Top rule — draws left-to-right */}
      <div
        aria-hidden="true"
        style={{
          height: '1px',
          background: '#1f1f24',
          transformOrigin: 'left center',
          transform: isRevealed ? 'scaleX(1)' : 'scaleX(0)',
          transition: `transform 0.5s cubic-bezier(0.7,0,0.3,1) ${stagger}s`,
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '0.875rem' : '1.5rem',
          padding: isMobile ? '1rem 0' : '1.25rem 0',
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        {/* Icon w/ halo + entrance spin + sonar ping */}
        <span
          aria-hidden="true"
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: isMobile ? 30 : 40,
            height: isMobile ? 30 : 40,
            flexShrink: 0,
            transform: isRevealed
              ? 'translateX(0) rotate(360deg)'
              : 'translateX(-30px) rotate(0deg)',
            transition: `transform 0.75s cubic-bezier(0.34,1.56,0.64,1) ${stagger + 0.15}s`,
          }}
        >
          {/* Halo */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: isHovered
                ? 'radial-gradient(circle, rgba(212,255,79,0.22) 0%, rgba(212,255,79,0) 70%)'
                : 'radial-gradient(circle, rgba(212,255,79,0.06) 0%, rgba(212,255,79,0) 70%)',
              transition: 'background 0.3s ease',
              pointerEvents: 'none',
            }}
          />
          {/* Sonar ping */}
          {pingKey > 0 && (
            <span
              key={pingKey}
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `1px solid ${ACCENT}`,
                animation: 'skillSonarPing 0.85s ease-out forwards',
                pointerEvents: 'none',
              }}
            />
          )}
          <span
            style={{
              color: iconColor,
              display: 'flex',
              filter: isHovered ? 'drop-shadow(0 0 8px rgba(212,255,79,0.55))' : 'none',
              transition: 'color 0.25s ease, filter 0.25s ease',
            }}
          >
            {Icon && <Icon size={isMobile ? 16 : 20} />}
          </span>
        </span>

        {/* Skill name */}
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            transformOrigin: 'left center',
            transform: isRevealed
              ? isHovered ? 'translateX(0) scale(1.02)' : 'translateX(0) scale(1)'
              : 'translateX(-14px) scale(1)',
            opacity: isRevealed ? 1 : 0,
            transition: `transform 0.55s cubic-bezier(0.16,1,0.3,1) ${stagger + 0.22}s, opacity 0.5s ease ${stagger + 0.22}s`,
          }}
        >
          <h3
            className="font-display font-medium leading-none"
            style={{
              fontSize: isMobile ? 'clamp(18px, 5vw, 26px)' : 'clamp(24px, 3vw, 46px)',
              letterSpacing: '-0.02em',
              color: nameColor,
              margin: 0,
              transition: 'color 0.25s ease',
            }}
          >
            {skill.name}
          </h3>
          {/* Underline */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -4,
              height: 1,
              background: ACCENT,
              transformOrigin: 'left center',
              transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 0.4s cubic-bezier(0.7,0,0.3,1)',
              opacity: isMobile ? 0 : 1,
            }}
          />
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, minWidth: isMobile ? 12 : 24 }} />

        {/* Category + level */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem',
            flexShrink: 0,
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? 'translateX(0)' : 'translateX(20px)',
            transition: `opacity 0.45s ease ${stagger + 0.32}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${stagger + 0.32}s`,
          }}
        >
          {!isMobile && (
            <span
              style={{
                fontFamily: 'Menlo, monospace',
                fontSize: '9px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: tagColor,
                transition: 'color 0.25s ease',
              }}
            >
              {skill.category}
            </span>
          )}
          {isMobile && (
            <span
              style={{
                fontFamily: 'Menlo, monospace',
                fontSize: '8px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(212,255,79,0.5)',
                border: '1px solid rgba(212,255,79,0.14)',
                padding: '2px 6px',
                borderRadius: 2,
              }}
            >
              {skill.category}
            </span>
          )}

          <CountUpNumber
            target={skill.level}
            play={isRevealed}
            glow={isHovered || isMobile}
            reroll={rerollKey}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Header word ------------------------------- */
function WipeWord({ text, delay, visible }: { text: string; delay: number; visible: boolean }) {
  return (
    <span
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        verticalAlign: 'bottom',
        clipPath: visible ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
        transition: `clip-path 0.75s cubic-bezier(0.7,0,0.3,1) ${delay}s`,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: `transform 0.75s cubic-bezier(0.7,0,0.3,1) ${delay}s`,
        }}
      >
        {text}
      </span>
    </span>
  );
}

/* --------------------------------- Skills --------------------------------- */
export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [headerVisible, setHeaderVisible] = useState(false);
  const [revealedRows, setRevealedRows] = useState<Set<number>>(new Set());
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

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
      (entries) => { if (entries[0].isIntersecting) { setHeaderVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      setRevealedRows(new Set(sorted.map((_, i) => i)));
      return;
    }
    const cleanups: (() => void)[] = [];
    rowRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setRevealedRows((prev) => { const n = new Set(prev); n.add(i); return n; });
            obs.disconnect();
          }
        },
        { threshold: 0.05, rootMargin: '0px 0px -4% 0px' }
      );
      obs.observe(el);
      cleanups.push(() => obs.disconnect());
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    sorted.forEach((s) => set.add(s.category));
    return ['All', ...CATEGORY_ORDER.filter((c) => set.has(c))];
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="container-layout section-padding">
      <style>{`
        @keyframes skillSonarPing {
          0% { transform: scale(0.9); opacity: 0.75; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 'clamp(1.75rem, 4vh, 3rem)' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'flex-end',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'Menlo, monospace',
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: ACCENT,
                marginBottom: '1rem',
                opacity: headerVisible ? 0.85 : 0,
                transition: 'opacity 0.5s ease',
              }}
            >
              ● Skills & Tools
            </div>
            <h2
              className="font-display"
              style={{
                fontWeight: 500,
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                letterSpacing: '-0.03em',
                color: '#f5f5f2',
                margin: 0,
                lineHeight: 1.05,
              }}
            >
              <WipeWord text="The" delay={0} visible={headerVisible} />{' '}
              <WipeWord text="toolkit." delay={0.15} visible={headerVisible} />
            </h2>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              maxWidth: 280,
              textAlign: isMobile ? 'left' : 'right',
            }}
          >
            {['Picked up over six years of', 'solving real problems in production.'].map((line, i) => (
              <span
                key={line}
                style={{
                  fontSize: 'clamp(13px, 1vw, 15px)',
                  color: '#8c8c94',
                  lineHeight: 1.6,
                  opacity: headerVisible ? 1 : 0,
                  transform: headerVisible ? 'translateY(0)' : 'translateY(8px)',
                  transition: `opacity 0.55s ease ${0.45 + i * 0.12}s, transform 0.55s ease ${0.45 + i * 0.12}s`,
                }}
              >
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Category filter pills */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)',
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s',
        }}
      >
        {categories.map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                fontFamily: 'Menlo, monospace',
                fontSize: '10px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: active ? '#08080a' : '#8c8c94',
                background: active ? ACCENT : 'transparent',
                border: `1px solid ${active ? ACCENT : 'rgba(140,140,148,0.25)'}`,
                borderRadius: 999,
                padding: '6px 12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.color = '#f5f5f2';
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.color = '#8c8c94';
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Rows */}
      <div>
        {sorted.map((skill, i) => {
          const isFiltered = activeCategory !== 'All' && skill.category !== activeCategory;
          return (
            <div key={skill.name} ref={(el) => { rowRefs.current[i] = el; }}>
              <SkillRow
                skill={skill}
                index={i}
                isRevealed={revealedRows.has(i)}
                isHovered={!isMobile && hoveredIdx === i && !isLet me complete my work on the project, specifically removing the unnecessary 'isDimmed' prop from the Skills component.
                isFiltered={isFiltered}
                isMobile={isMobile}
                onMouseEnter={() => { if (!isMobile && !isFiltered) setHoveredIdx(i); }}
                onMouseLeave={() => { if (!isMobile) setHoveredIdx(null); }}
              />
            </div>
          );
        })}
        <div style={{ borderTop: '1px solid #1f1f24' }} />
      </div>
    </section>
  );
}
