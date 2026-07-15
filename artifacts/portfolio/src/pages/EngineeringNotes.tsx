import { useState, useMemo, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import notes from '../data/engineeringNotes.json';

// ─── Types ────────────────────────────────────────────────────────────────────
type Note = (typeof notes)[number];

// ─── All unique categories in order of appearance ──────────────────────────────
const uniqueCategories = Array.from(new Set(notes.map((n) => n.category)));
const ALL_CATEGORIES = ['All', ...uniqueCategories];

const CATEGORY_DOT: Record<string, string> = {
  Architecture:       '#d4ff4f',
  Planning:           '#78b4ff',
  'AI Engineering':   '#c882ff',
  Backend:            '#ffb450',
  Database:           '#50dbb4',
  Production:         '#ff6464',
  Testing:            '#64dc64',
  Development:        '#b4b4ff',
  'ShepherEd Lessons':'#d4ff4f',
  'Personal Rules':   '#888898',
  'Pre-Development':  '#ffc850',
  'Portfolio Stack':  '#ff4fd4',
  'Tool Insights':    '#4fd4ff',
  Infrastructure:     '#4fff80',
  Design:             '#ff804f',
};

// ─── NoteCard (Spatial IDE Style) ──────────────────────────────────────────
function NoteCard({ note, index = 0 }: { note: Note; index?: number }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');

  const isChecklist = note.id === 'pre-01';
  const dot = CATEGORY_DOT[note.category] ?? '#d4ff4f';

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Smooth spatial tilt (-3 to 3 degrees)
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <article
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="preserve-3d"
      style={{
        backgroundColor: 'rgba(12, 12, 16, 0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${hovered ? dot : 'rgba(255,255,255,0.08)'}`,
        boxShadow: hovered ? `0 0 30px ${dot}20` : '0 10px 30px rgba(0,0,0,0.5)',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'default',
        transform,
        transition: hovered ? 'transform 0.1s ease-out, border-color 0.3s ease, box-shadow 0.3s ease' : 'transform 0.5s ease-out, border-color 0.3s ease, box-shadow 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        willChange: 'transform',
        opacity: 0,
        animation: 'slideFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        animationDelay: `${index * 0.08}s`,
      }}
    >
      {/* IDE Window Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.25rem',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        {/* Mac OS Dots */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
        </div>
        
        {/* Tab Title */}
        <div style={{
          fontFamily: 'Menlo, monospace',
          fontSize: '11px',
          color: '#8c8c94',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          letterSpacing: '0.05em',
        }}>
          <span style={{ color: dot }}>{note.category}</span>
          <span style={{ opacity: 0.3 }}>/</span>
          <span>{note.id}.md</span>
        </div>
        
        {/* Date */}
        <div style={{
          fontFamily: 'Menlo, monospace',
          fontSize: '11px',
          color: '#5a5a64',
          letterSpacing: '0.05em',
        }}>
          {note.date}
        </div>
      </div>

      {/* Content Area */}
      <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3
          className="font-display"
          style={{
            fontSize: 'clamp(18px, 1.8vw, 22px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            margin: 0,
          }}
        >
          {note.title}
        </h3>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isChecklist ? '0.4rem' : '0.2rem',
        }}>
          {note.lines.map((line, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                fontFamily: 'Menlo, monospace',
                fontSize: '13px',
                lineHeight: 1.7,
                color: '#a0a0ab',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              <span style={{ color: '#4a4a52', userSelect: 'none', width: '20px', textAlign: 'right', flexShrink: 0 }}>
                {i + 1}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>{line}</span>
            </div>
          ))}
        </div>

        {/* Tags Footer */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
          {note.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: 'Menlo, monospace',
                fontSize: '11px',
                color: '#7a7a84',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '6px',
                padding: '4px 10px',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

// ─── Search Input ────────────────────────────────────────────────────────────
function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#5a5a64"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        ref={inputRef}
        type="search"
        placeholder="Search logs... (Press /)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          backgroundColor: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '10px 12px 10px 36px',
          fontFamily: 'Menlo, monospace',
          fontSize: '12px',
          color: '#f5f5f2',
          outline: 'none',
          transition: 'border-color 0.2s ease',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'rgba(212,255,79,0.5)')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
      />
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function EngineeringNotes() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [query, setQuery] = useState('');

  // Filtering
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return notes.filter((n) => {
      const matchCat = activeCategory === 'All' || n.category === activeCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        (n.date && n.date.toLowerCase().includes(q)) ||
        n.lines.some((l) => l.toLowerCase().includes(q)) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, activeCategory]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__INITIAL_LOAD_DONE__ = true;
    }
  }, []);

  return (
    <>
      <div className="bg-noise" />
      <div className="ambient-grid" />
      <Helmet>
        <title>Engineering Archive | Impeccable</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 backdrop-blur-md bg-[#0a0a0a]/50 border-b border-white/5 flex items-center justify-between">
        <Link to="/" className="group inline-flex items-center gap-2 text-[#8c8c94] hover:text-[#f5f5f2] transition-colors" style={{ textDecoration: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span className="font-display text-sm tracking-widest uppercase">Back to Portfolio</span>
        </Link>
        <div className="font-display font-bold text-[#d4ff4f] tracking-widest uppercase text-xs">
          System Archive
        </div>
      </header>

      <main style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', paddingTop: '80px', width: '100%' }}>
        <div className="notes-container">
          
          {/* Left Pane: Sticky Sidebar */}
          <aside className="notes-sidebar">
            <header>
              <h1 className="font-display" style={{ fontSize: '28px', fontWeight: 600, color: '#fff', marginBottom: '0.8rem', letterSpacing: '-0.03em' }}>
                Archive
              </h1>
              <p style={{ color: '#8c8c94', fontSize: '13px', lineHeight: 1.6, fontFamily: 'Menlo, monospace' }}>
                system_logs // architectural_decisions
              </p>
            </header>

            <SearchBar value={query} onChange={setQuery} />

            <h3 style={{ fontFamily: 'Menlo, monospace', fontSize: '10px', color: '#5a5a64', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem', paddingLeft: '4px' }}>
              Directories
            </h3>
            <nav className="notes-nav-list">
              {ALL_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: activeCategory === cat ? 'rgba(255,255,255,0.06)' : 'transparent',
                    color: activeCategory === cat ? '#fff' : '#8c8c94',
                    border: '1px solid',
                    borderColor: activeCategory === cat ? 'rgba(255,255,255,0.05)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Menlo, monospace', fontSize: '12px'
                  }}
                  onMouseEnter={(e) => {
                    if (activeCategory !== cat) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeCategory !== cat) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    backgroundColor: cat === 'All' ? '#fff' : CATEGORY_DOT[cat] ?? '#d4ff4f',
                    boxShadow: activeCategory === cat ? `0 0 10px ${cat === 'All' ? '#fff' : CATEGORY_DOT[cat]}` : 'none',
                    opacity: activeCategory === cat ? 1 : 0.3
                  }} />
                  {cat}
                  <span style={{ marginLeft: 'auto', fontSize: '10px', opacity: 0.4 }}>
                    {cat === 'All' ? notes.length : notes.filter(n => n.category === cat).length}
                  </span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Right Pane: Feed */}
          <section className="notes-feed">
            {filtered.length === 0 ? (
              <div style={{ color: '#5a5a64', fontFamily: 'Menlo, monospace', fontSize: '13px', padding: '2rem' }}>
                [ERR] No logs found for query.
              </div>
            ) : (
              filtered.map((note, idx) => (
                <div key={note.id} className="notes-feed-item">
                  <NoteCard note={note} index={idx} />
                </div>
              ))
            )}
          </section>

        </div>
      </main>
    </>
  );
}
