import { useState, useMemo, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import notes from '../data/engineeringNotes.json';

// ─── Types ────────────────────────────────────────────────────────────────────
type Note = (typeof notes)[number];

// ─── All unique categories in order ──────────────────────────────────────────
const ALL_CATEGORIES = [
  'All',
  'Architecture',
  'Planning',
  'AI Engineering',
  'Backend',
  'Database',
  'Production',
  'Testing',
  'Development',
  'ShepherEd Lessons',
  'Personal Rules',
  'Pre-Development',
];

// ─── Category accent map — subtle tint per group ─────────────────────────────
const CATEGORY_COLOR: Record<string, string> = {
  Architecture:       'rgba(212,255,79,0.12)',
  Planning:           'rgba(120,180,255,0.10)',
  'AI Engineering':   'rgba(200,130,255,0.10)',
  Backend:            'rgba(255,180,80,0.10)',
  Database:           'rgba(80,220,180,0.10)',
  Production:         'rgba(255,100,100,0.10)',
  Testing:            'rgba(100,220,100,0.10)',
  Development:        'rgba(180,180,255,0.10)',
  'ShepherEd Lessons':'rgba(212,255,79,0.07)',
  'Personal Rules':   'rgba(255,255,255,0.05)',
  'Pre-Development':  'rgba(255,200,80,0.10)',
};

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
};

// ─── NoteCard ────────────────────────────────────────────────────────────────
function NoteCard({ note }: { note: Note }) {
  const [hovered, setHovered] = useState(false);
  const isChecklist = note.id === 'pre-01';
  const dot = CATEGORY_DOT[note.category] ?? '#d4ff4f';
  const bg  = CATEGORY_COLOR[note.category] ?? 'transparent';

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? bg : 'rgba(255,255,255,0.018)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.055)'}`,
        borderRadius: '10px',
        padding: 'clamp(1.1rem, 2vw, 1.5rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        transition: 'background 0.22s ease, border-color 0.22s ease',
        cursor: 'default',
        breakInside: 'avoid',
      }}
    >
      {/* Category badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
        <span
          aria-hidden="true"
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: dot,
            flexShrink: 0,
            opacity: 0.85,
          }}
        />
        <span
          style={{
            fontFamily: 'Menlo, "Cascadia Code", monospace',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: dot,
            opacity: 0.7,
          }}
        >
          {note.category}
        </span>
      </div>

      {/* Title */}
      <h3
        className="font-display"
        style={{
          fontSize: 'clamp(13px, 1.1vw, 15px)',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          lineHeight: 1.3,
          color: '#f5f5f2',
          margin: 0,
        }}
      >
        {note.title}
      </h3>

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isChecklist ? '0.35rem' : '0.18rem',
          flex: 1,
        }}
      >
        {note.lines.map((line, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              fontFamily: 'Menlo, "Cascadia Code", monospace',
              fontSize: 'clamp(11.5px, 0.9vw, 13px)',
              lineHeight: 1.65,
              color: '#8c8c94',
            }}
          >
            {isChecklist && (
              <span
                aria-hidden="true"
                style={{
                  color: dot,
                  opacity: 0.5,
                  flexShrink: 0,
                  marginTop: '0.05em',
                  fontSize: '10px',
                }}
              >
                ✓
              </span>
            )}
            <span>{line}</span>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.35rem',
          marginTop: '0.25rem',
        }}
      >
        {note.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: 'Menlo, "Cascadia Code", monospace',
              fontSize: '9.5px',
              letterSpacing: '0.08em',
              color: '#5a5a64',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '4px',
              padding: '1px 7px',
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}

// ─── SearchBar ───────────────────────────────────────────────────────────────
function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: / to focus
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
    <div style={{ position: 'relative', width: '100%', maxWidth: '520px' }}>
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
          left: '14px',
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
        placeholder="Search notes…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search engineering notes"
        style={{
          width: '100%',
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          padding: '10px 40px 10px 38px',
          fontFamily: 'Menlo, "Cascadia Code", monospace',
          fontSize: '13px',
          color: '#f5f5f2',
          outline: 'none',
          caretColor: '#d4ff4f',
          transition: 'border-color 0.2s ease',
          WebkitAppearance: 'none',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(212,255,79,0.35)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(255,255,255,0.08)';
        }}
      />

      {/* Keyboard hint */}
      {!value && (
        <kbd
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: 'Menlo, monospace',
            fontSize: '10px',
            color: '#3a3a44',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '3px',
            padding: '1px 5px',
            pointerEvents: 'none',
          }}
        >
          /
        </kbd>
      )}

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#5a5a64',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── CategoryFilter ───────────────────────────────────────────────────────────
function CategoryFilter({
  active,
  onChange,
  counts,
}: {
  active: string;
  onChange: (c: string) => void;
  counts: Record<string, number>;
}) {
  return (
    <div
      role="group"
      aria-label="Filter by category"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.4rem',
      }}
    >
      {ALL_CATEGORIES.map((cat) => {
        const isActive = cat === active;
        const count = cat === 'All' ? notes.length : (counts[cat] ?? 0);
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            aria-pressed={isActive}
            style={{
              fontFamily: 'Menlo, "Cascadia Code", monospace',
              fontSize: '11px',
              letterSpacing: '0.08em',
              padding: '5px 12px',
              borderRadius: '6px',
              border: isActive
                ? '1px solid rgba(212,255,79,0.5)'
                : '1px solid rgba(255,255,255,0.07)',
              backgroundColor: isActive
                ? 'rgba(212,255,79,0.1)'
                : 'transparent',
              color: isActive ? '#d4ff4f' : '#5a5a64',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#a0a0aa';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#5a5a64';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
              }
            }}
          >
            {cat}
            <span
              style={{
                marginLeft: '5px',
                opacity: 0.5,
                fontSize: '9px',
              }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EngineeringNotes() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Count per category (unfiltered)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach((n) => {
      counts[n.category] = (counts[n.category] ?? 0) + 1;
    });
    return counts;
  }, []);

  // Filtered notes
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return notes.filter((n) => {
      const matchCat = activeCategory === 'All' || n.category === activeCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        n.lines.some((l) => l.toLowerCase().includes(q)) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, activeCategory]);

  // Group filtered notes by category for the masonry-style layout
  const groupedByCategory = useMemo(() => {
    const map: Record<string, Note[]> = {};
    filtered.forEach((n) => {
      if (!map[n.category]) map[n.category] = [];
      map[n.category].push(n);
    });
    return map;
  }, [filtered]);

  const categoryOrder = ALL_CATEGORIES.filter((c) => c !== 'All');

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#f5f5f2',
        fontFamily: 'var(--font-body, sans-serif)',
        overflowX: 'hidden',
      }}
    >
      <Helmet>
        <title>Engineering Notes</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* ── Top Nav ────────────────────────────────────────────────────────── */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: '0 clamp(1.5rem, 5vw, 3rem)',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(10,10,10,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          {/* Notebook icon */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d4ff4f"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span
            style={{
              fontFamily: 'Menlo, monospace',
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#d4ff4f',
              opacity: 0.8,
            }}
          >
            Engineering Notes
          </span>
        </div>

        <span
          style={{
            fontFamily: 'Menlo, monospace',
            fontSize: '10px',
            letterSpacing: '0.12em',
            color: '#3a3a44',
          }}
        >
          {notes.length} notes
        </span>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          paddingTop: 'calc(56px + clamp(3rem, 8vh, 5rem))',
          paddingBottom: 'clamp(2rem, 4vh, 3rem)',
          paddingLeft: 'clamp(1.5rem, 5vw, 3rem)',
          paddingRight: 'clamp(1.5rem, 5vw, 3rem)',
          maxWidth: '800px',
        }}
      >
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            color: '#f5f5f2',
            margin: '0 0 0.85rem 0',
          }}
        >
          Engineering Notes
          <span style={{ color: '#d4ff4f' }}>.</span>
        </h1>
        <p
          style={{
            fontFamily: 'Menlo, "Cascadia Code", monospace',
            fontSize: 'clamp(12px, 1vw, 13.5px)',
            lineHeight: 1.75,
            color: '#5a5a64',
            margin: 0,
            maxWidth: '480px',
          }}
        >
          A personal collection of engineering observations, architectural decisions,
          debugging notes, and reminders collected while building software.
        </p>
      </div>

      {/* ── Controls ───────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'sticky',
          top: '56px',
          zIndex: 40,
          backgroundColor: 'rgba(10,10,10,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          padding: 'clamp(0.85rem, 1.5vh, 1.25rem) clamp(1.5rem, 5vw, 3rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}
      >
        <SearchBar value={query} onChange={setQuery} />
        <CategoryFilter
          active={activeCategory}
          onChange={(c) => setActiveCategory(c)}
          counts={categoryCounts}
        />
      </div>

      {/* ── Notes ──────────────────────────────────────────────────────────── */}
      <main
        style={{
          padding: 'clamp(1.5rem, 3vh, 2.5rem) clamp(1.5rem, 5vw, 3rem)',
          paddingBottom: 'clamp(4rem, 8vh, 6rem)',
        }}
      >
        {filtered.length === 0 ? (
          /* Empty state */
          <div
            style={{
              textAlign: 'center',
              padding: 'clamp(4rem, 10vh, 7rem) 1rem',
              color: '#3a3a44',
            }}
          >
            <div
              style={{
                fontFamily: 'Menlo, monospace',
                fontSize: '12px',
                letterSpacing: '0.1em',
              }}
            >
              No notes found for "{query}"
            </div>
          </div>
        ) : activeCategory !== 'All' ? (
          /* Single category — simple masonry grid */
          <section aria-label={activeCategory}>
            <div
              style={{
                columns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                columnGap: 'clamp(0.75rem, 1.5vw, 1.25rem)',
                columnFill: 'balance',
              }}
            >
              {filtered.map((note) => (
                <div
                  key={note.id}
                  style={{
                    breakInside: 'avoid',
                    marginBottom: 'clamp(0.75rem, 1.5vw, 1.25rem)',
                    display: 'inline-block',
                    width: '100%',
                  }}
                >
                  <NoteCard note={note} />
                </div>
              ))}
            </div>
          </section>
        ) : (
          /* All categories — grouped by category */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(3rem, 6vh, 4.5rem)' }}>
            {categoryOrder
              .filter((cat) => groupedByCategory[cat]?.length > 0)
              .map((cat) => (
                <section key={cat} aria-label={cat}>
                  {/* Section header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      marginBottom: 'clamp(1rem, 2vh, 1.5rem)',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: CATEGORY_DOT[cat] ?? '#d4ff4f',
                        flexShrink: 0,
                      }}
                    />
                    <h2
                      style={{
                        fontFamily: 'Menlo, monospace',
                        fontSize: '11px',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: CATEGORY_DOT[cat] ?? '#d4ff4f',
                        opacity: 0.7,
                        margin: 0,
                        fontWeight: 400,
                      }}
                    >
                      {cat}
                    </h2>
                    <span
                      aria-label={`${groupedByCategory[cat].length} notes`}
                      style={{
                        fontFamily: 'Menlo, monospace',
                        fontSize: '9px',
                        color: '#3a3a44',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {groupedByCategory[cat].length}
                    </span>
                  </div>

                  {/* Masonry grid for this category */}
                  <div
                    style={{
                      columns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                      columnGap: 'clamp(0.75rem, 1.5vw, 1.25rem)',
                      columnFill: 'balance',
                    }}
                  >
                    {groupedByCategory[cat].map((note) => (
                      <div
                        key={note.id}
                        style={{
                          breakInside: 'avoid',
                          marginBottom: 'clamp(0.75rem, 1.5vw, 1.25rem)',
                          display: 'inline-block',
                          width: '100%',
                        }}
                      >
                        <NoteCard note={note} />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
          padding: 'clamp(1.5rem, 3vh, 2rem) clamp(1.5rem, 5vw, 3rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            fontFamily: 'Menlo, monospace',
            fontSize: '10px',
            color: '#2a2a32',
            letterSpacing: '0.1em',
          }}
        >
          {notes.length} notes across {ALL_CATEGORIES.length - 1} categories
        </span>
        <span
          style={{
            fontFamily: 'Menlo, monospace',
            fontSize: '10px',
            color: '#2a2a32',
            letterSpacing: '0.1em',
          }}
        >
          Press / to search
        </span>
      </footer>
    </div>
  );
}
