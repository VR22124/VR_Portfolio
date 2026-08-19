import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ChevronLeft, Clock, Tag } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import notes from '../../data/notesData.json';

/* ─── helpers ─── */
function readingTime(text: string): string {
  const words = text.replace(/[#*`_\[\]()]/g, '').split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
}

function fmtLong(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/* ─── markdown ─── */
function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*(.+?)\*\*)|(\[(.+?)\]\((.+?)\))|(`(.+?)`)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<strong key={m.index} className="font-semibold text-[var(--text-primary)]">{m[2]}</strong>);
    else if (m[3]) parts.push(<a key={m.index} href={m[5]} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline underline-offset-4 hover:opacity-80 transition-opacity">{m[4]}</a>);
    else if (m[6]) parts.push(<code key={m.index} className="bg-[var(--bg-elevated-2)] px-1.5 py-0.5 rounded text-[0.88em] text-[var(--text-primary)] font-mono">{m[7]}</code>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts.length > 0 ? parts : text}</>;
}

function Markdown({ content }: { content: string }) {
  return (
    <div className="flex flex-col gap-5">
      {content.split('\n\n').map((para, i) => {
        if (para.startsWith('- ')) {
          const items = para.split('\n').filter(l => l.startsWith('- '));
          return (
            <ul key={i} className="pl-5 m-0 flex flex-col gap-1.5 list-disc text-[var(--text-secondary)] leading-relaxed text-[1.0625rem]">
              {items.map((item, j) => <li key={j}><RichText text={item.replace(/^- /, '')} /></li>)}
            </ul>
          );
        }
        const lines = para.split('\n');
        return (
          <p key={i} className="m-0 text-[var(--text-secondary)] leading-relaxed text-[1.0625rem]">
            {lines.map((line, j) => <span key={j}>{j > 0 && <br />}<RichText text={line} /></span>)}
          </p>
        );
      })}
    </div>
  );
}

/* ─── components ─── */
function Pill({ label, count, active, onClick }: { label: string; count?: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 shrink-0 border ${
        active
          ? 'bg-[var(--text-primary)] text-[var(--bg-base)] border-[var(--text-primary)]'
          : 'bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)]'
      }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className={`px-1.5 rounded-full text-[10px] ${active ? 'bg-[var(--bg-base)] text-[var(--text-primary)]' : 'bg-[var(--bg-elevated-2)]'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

/* ─── main ─── */
type Note = (typeof notes)[number];

export default function NotesPage() {
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState<string | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const paneRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let r = notes as Note[];
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.category.toLowerCase().includes(q) || n.tags.some(t => t.toLowerCase().includes(q)));
    }
    if (cat) r = r.filter(n => n.categorySlug === cat);
    return r;
  }, [search, cat]);

  const categories = useMemo(() => {
    const m = new Map<string, { slug: string; name: string; count: number }>();
    for (const n of notes) { const e = m.get(n.categorySlug); if (e) e.count++; else m.set(n.categorySlug, { slug: n.categorySlug, name: n.category, count: 1 }); }
    return Array.from(m.values()).sort((a, b) => b.count - a.count);
  }, []);

  const active = useMemo(() => activeSlug ? notes.find(n => n.slug === activeSlug) ?? null : null, [activeSlug]);

  useEffect(() => { if (!activeSlug && filtered.length > 0 && window.innerWidth >= 768) setActiveSlug(filtered[0].slug); }, [activeSlug, filtered]);
  useEffect(() => { paneRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }, [activeSlug]);

  const open = useCallback((slug: string) => { setActiveSlug(slug); setMobileOpen(true); }, []);

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)] font-sans flex">

      {/* =========================================================================
          MOBILE REDESIGN: Card Feed & Bottom Sheet (Visible only on mobile)
          ========================================================================= */}
      <div className="md:hidden flex flex-col w-full h-full relative overflow-hidden">
        
        {/* --- Home View: Card Feed --- */}
        <div className={`flex flex-col w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileOpen ? 'scale-[0.93] opacity-40' : 'scale-100 opacity-100'}`}>
          {/* Header */}
          <div className="px-5 pt-8 pb-4 shrink-0 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-3xl tracking-tight text-[var(--text-primary)] m-0">Notes</h1>
              <Link to="/" className="w-8 h-8 bg-[var(--accent)] flex items-center justify-center rounded-lg shadow-lg hover:opacity-80 transition-opacity">
                <span className="font-bold text-[var(--bg-base)] text-xs tracking-tighter">VR</span>
              </Link>
            </div>
            
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-[var(--text-primary)] transition-colors" />
              <input 
                type="text" 
                placeholder="Search notes..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="w-full py-3 pl-10 pr-10 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-[15px] outline-none focus:border-[var(--accent)] transition-all placeholder:text-[var(--text-tertiary)] shadow-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          {!search && (
            <div className="px-5 pb-2 flex gap-2 overflow-x-auto shrink-0 scrollbar-hide">
              <Pill label="All" active={cat === null} onClick={() => setCat(null)} />
              {categories.map(c => <Pill key={c.slug} label={c.name} count={c.count} active={cat === c.slug} onClick={() => setCat(c.slug)} />)}
            </div>
          )}

          {/* Feed */}
          <div className="flex-1 overflow-y-auto px-5 pb-24 pt-2 scrollbar-hide">
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-medium text-sm text-[var(--text-secondary)] m-0">No notes found.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map(note => (
                  <button 
                    key={note.slug} 
                    onClick={() => open(note.slug)}
                    className="w-full text-left p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all active:scale-[0.98] overflow-hidden relative group"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent)] opacity-5 blur-[30px] rounded-full translate-x-1/3 -translate-y-1/3 transition-opacity" />
                    
                    <p className="m-0 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--accent)]">{note.category}</p>
                    <h2 className="font-bold text-[17px] leading-snug text-[var(--text-primary)] mb-3 pr-2">{note.title}</h2>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.tags.slice(0, 3).map(t => (
                        <span key={t} className="px-2 py-0.5 bg-[var(--bg-elevated-2)] rounded text-[10px] font-medium text-[var(--text-secondary)]">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] border-t border-[var(--border)] pt-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {readingTime(note.content)}
                      </span>
                      <span>{fmtLong(note.publishedAt || note.createdAt)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Theme Toggle */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)] to-transparent flex justify-center pointer-events-none z-10">
            <button 
              onClick={toggleTheme} 
              className="pointer-events-auto p-3.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-lg active:scale-95 transition-transform"
            >
              {theme === 'dark'
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
            </button>
          </div>
        </div>

        {/* --- Reading View: Bottom Sheet --- */}
        <div 
          className={`absolute inset-0 z-50 bg-[var(--bg-base)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)] ${mobileOpen ? 'translate-y-0' : 'translate-y-full'}`}
        >
          {active && (
            <>
              {/* Floating Sheet Header */}
              <div className="sticky top-0 z-50 px-5 pt-6 pb-4 bg-[var(--bg-base)]/80 backdrop-blur-xl border-b border-[var(--border)] flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--accent)] truncate max-w-[200px]">{active.category}</span>
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sheet Content */}
              <div className="flex-1 overflow-y-auto px-5 py-8 pb-24 scrollbar-hide">
                <h1 className="font-bold text-3xl leading-[1.15] tracking-tight text-[var(--text-primary)] m-0 mb-5">{active.title}</h1>
                
                <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)] mb-8 pb-8 border-b border-[var(--border)]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {fmtLong(active.publishedAt || active.createdAt)}
                  </span>
                  <span className="opacity-30">•</span>
                  <span>{readingTime(active.content)}</span>
                </div>

                <article>
                  <Markdown content={active.content} />
                </article>

                {active.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap mt-12 pt-8 border-t border-[var(--border)]">
                    <Tag className="w-4 h-4 text-[var(--accent)] opacity-70" />
                    {active.tags.map(t => (
                      <span key={t} className="px-3 py-1 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-full text-xs font-semibold text-[var(--accent)] tracking-wide">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* =========================================================================
          DESKTOP REDESIGN: Dual Pane (Visible only on md+)
          ========================================================================= */}
      <aside className="hidden md:flex flex-col h-full w-[320px] shrink-0 border-r border-[var(--border)] bg-[var(--bg-elevated)] z-10">
        
        {/* Header */}
        <div className="p-4 shrink-0 border-b border-[var(--border)] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-7 h-7 bg-[var(--accent)] flex items-center justify-center rounded">
                <span className="font-bold text-[var(--bg-base)] text-xs tracking-tighter">VR</span>
              </div>
              <h1 className="font-bold text-lg tracking-tight text-[var(--text-primary)] m-0">Notes</h1>
            </Link>
            <span className="text-[10px] text-[var(--text-tertiary)] font-medium bg-[var(--bg-base)] px-2 py-0.5 rounded-full border border-[var(--border)]">
              {notes.length} total
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-[var(--text-primary)] transition-colors" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="w-full py-2 pl-9 pr-8 bg-[var(--bg-base)] border border-transparent rounded-lg text-[var(--text-primary)] text-sm outline-none focus:border-[var(--border-bright)] transition-all placeholder:text-[var(--text-tertiary)]"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        {!search && (
          <div className="px-4 py-3 flex gap-2 overflow-x-auto shrink-0 scrollbar-hide border-b border-[var(--border)]">
            <Pill label="All" active={cat === null} onClick={() => setCat(null)} />
            {categories.map(c => <Pill key={c.slug} label={c.name} count={c.count} active={cat === c.slug} onClick={() => setCat(c.slug)} />)}
          </div>
        )}

        {/* Note List */}
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-transparent">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-medium text-sm text-[var(--text-secondary)] m-0">No notes found.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {filtered.map(note => {
                const isActive = activeSlug === note.slug;
                return (
                  <button 
                    key={note.slug} 
                    onClick={() => open(note.slug)}
                    className={`relative w-full text-left px-4 py-4 md:py-3 rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? 'bg-[var(--bg-elevated-2)]' 
                        : 'hover:bg-[var(--bg-elevated-2)]/50'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                    )}
                    <div className="font-medium text-[13px] text-[var(--text-primary)] truncate pr-4">{note.title}</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] font-medium text-[var(--accent)] uppercase tracking-wider">{note.category}</span>
                      <span className="text-[11px] text-[var(--text-tertiary)] truncate">{fmtLong(note.publishedAt || note.createdAt)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 shrink-0 border-t border-[var(--border)] flex items-center justify-between bg-[var(--bg-elevated)]">
          <Link to="/" className="text-xs text-[var(--text-secondary)] font-medium flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors group">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--bg-base)] border border-[var(--border)] group-hover:border-[var(--text-secondary)] transition-colors">←</span>
            Portfolio
          </Link>
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-lg border border-[var(--border)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-all"
          >
            {theme === 'dark'
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
          </button>
        </div>
      </aside>

      {/* ══ READING PANE ══ */}
      <main 
        ref={paneRef} 
        className="hidden md:flex flex-col flex-1 h-full overflow-y-auto bg-[var(--bg-base)] relative z-0"
      >
        {/* Watermark */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col items-center font-black text-[clamp(6rem,12vw,10rem)] leading-[0.85] pointer-events-none select-none z-0"
             style={{ 
               color: theme === 'dark' ? 'var(--accent)' : '#000', 
               opacity: theme === 'dark' ? 0.03 : 0.03,
               textShadow: theme === 'dark' ? '0 0 40px var(--accent)' : 'none'
             }}>
          <span>N</span><span>O</span><span>T</span><span>E</span><span>S</span>
        </div>

        {active ? (
          <div className="w-full max-w-3xl mx-auto px-12 py-16 relative z-10 flex flex-col min-h-full">
            
            <div className="flex-1 flex flex-col">
              {/* Note Header */}
              <div className="mb-12 border-b border-[var(--border)] pb-8">
                <p className="m-0 mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">{active.category}</p>
                <h1 className="font-bold text-5xl leading-tight tracking-tight text-[var(--text-primary)] m-0 mb-6">{active.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-tertiary)]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {fmtLong(active.publishedAt || active.createdAt)}
                </span>
                <span className="opacity-30">•</span>
                <span>{readingTime(active.content)} read</span>
              </div>
            </div>

            {/* Note Content */}
            <article>
              {active.slug === 'semantic-versioning-semver' && (
                <div className="mb-8 p-6 bg-[var(--bg-elevated-2)] border border-[var(--border)] rounded-2xl flex flex-col items-center">
                  <div className="text-sm font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-6">Semantic Versioning</div>
                  <div className="flex gap-2 md:gap-8 items-start justify-center">
                    <div className="flex flex-col items-center gap-3 w-24 md:w-28">
                      <span className="text-5xl font-black text-[var(--text-primary)] font-mono tracking-tighter">2</span>
                      <div className="h-4 w-px bg-[var(--border)]"></div>
                      <div className="h-px w-full bg-[var(--border)]"></div>
                      <span className="text-[10px] md:text-xs font-bold text-center mt-2 text-[var(--accent)] uppercase">MAJOR</span>
                      <span className="text-[9px] md:text-[10px] text-center text-[var(--text-tertiary)] leading-tight">Bump for incompatible API changes</span>
                    </div>
                    <span className="text-4xl md:text-5xl font-black text-[var(--text-tertiary)] pt-1 leading-none">.</span>
                    <div className="flex flex-col items-center gap-3 w-24 md:w-28">
                      <span className="text-5xl font-black text-[var(--text-primary)] font-mono tracking-tighter">7</span>
                      <div className="h-4 w-px bg-[var(--border)]"></div>
                      <div className="h-px w-full bg-[var(--border)]"></div>
                      <span className="text-[10px] md:text-xs font-bold text-center mt-2 text-[var(--accent)] uppercase">MINOR</span>
                      <span className="text-[9px] md:text-[10px] text-center text-[var(--text-tertiary)] leading-tight">Bump for backward-compatible new features</span>
                    </div>
                    <span className="text-4xl md:text-5xl font-black text-[var(--text-tertiary)] pt-1 leading-none">.</span>
                    <div className="flex flex-col items-center gap-3 w-24 md:w-28">
                      <span className="text-5xl font-black text-[var(--text-primary)] font-mono tracking-tighter">123</span>
                      <div className="h-4 w-px bg-[var(--border)]"></div>
                      <div className="h-px w-full bg-[var(--border)]"></div>
                      <span className="text-[10px] md:text-xs font-bold text-center mt-2 text-[var(--accent)] uppercase">PATCH</span>
                      <span className="text-[9px] md:text-[10px] text-center text-[var(--text-tertiary)] leading-tight">Bump for backward-compatible bug fixes</span>
                    </div>
                  </div>
                </div>
              )}
              
              {active.slug === 'pride-versioning' && (
                <div className="mb-8 p-6 bg-[var(--bg-elevated-2)] border border-[var(--border)] rounded-2xl flex flex-col items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] opacity-[0.03] blur-3xl rounded-full pointer-events-none" />
                  <div className="text-sm font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-6 relative z-10">Pride Versioning</div>
                  <div className="flex gap-2 md:gap-8 items-start justify-center relative z-10">
                    <div className="flex flex-col items-center gap-3 w-24 md:w-28">
                      <span className="text-5xl font-black text-[var(--text-primary)] font-mono tracking-tighter">2</span>
                      <div className="h-4 w-px bg-[var(--border)]"></div>
                      <div className="h-px w-full bg-[var(--border)]"></div>
                      <span className="text-[10px] md:text-xs font-bold text-center mt-2 text-[var(--text-primary)] uppercase">PROUD</span>
                      <span className="text-[9px] md:text-[10px] text-center text-[var(--text-tertiary)] leading-tight">Bump when you are proud of the release</span>
                    </div>
                    <span className="text-4xl md:text-5xl font-black text-[var(--text-tertiary)] pt-1 leading-none">.</span>
                    <div className="flex flex-col items-center gap-3 w-24 md:w-28">
                      <span className="text-5xl font-black text-[var(--text-primary)] font-mono tracking-tighter">7</span>
                      <div className="h-4 w-px bg-[var(--border)]"></div>
                      <div className="h-px w-full bg-[var(--border)]"></div>
                      <span className="text-[10px] md:text-xs font-bold text-center mt-2 text-[var(--text-secondary)] uppercase">DEFAULT</span>
                      <span className="text-[9px] md:text-[10px] text-center text-[var(--text-tertiary)] leading-tight">Just normal / okay releases</span>
                    </div>
                    <span className="text-4xl md:text-5xl font-black text-[var(--text-tertiary)] pt-1 leading-none">.</span>
                    <div className="flex flex-col items-center gap-3 w-24 md:w-32">
                      <span className="text-5xl font-black text-[var(--text-primary)] font-mono tracking-tighter">123</span>
                      <div className="h-4 w-px bg-[var(--border)]"></div>
                      <div className="h-px w-full bg-[var(--border)]"></div>
                      <span className="text-[10px] md:text-xs font-bold text-center mt-2 text-rose-500 uppercase">SHAME</span>
                      <span className="text-[9px] md:text-[10px] text-center text-[var(--text-tertiary)] leading-tight">Bump when fixing things too embarrassing to admit</span>
                    </div>
                  </div>
                </div>
              )}

              <Markdown content={active.content} />
            </article>

              {/* Tags */}
              {active.tags.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap mt-16 pt-8 border-t border-[var(--border)]">
                  <Tag className="w-4 h-4 text-[var(--accent)] opacity-70" />
                  {active.tags.map(t => (
                    <span key={t} className="px-3 py-1 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-full text-xs font-semibold text-[var(--accent)] tracking-wide">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 relative z-10 text-center">
            <div className="w-16 h-16 mb-6 rounded-2xl bg-[var(--bg-elevated)] flex items-center justify-center border border-[var(--border)]">
              <span className="font-bold text-xl text-[var(--text-tertiary)]">VR</span>
            </div>
            <p className="font-bold text-xl text-[var(--text-secondary)] m-0 mb-2">Select a note</p>
            <p className="text-sm text-[var(--text-tertiary)] m-0">Choose a note from the sidebar to start reading.</p>
          </div>
        )}
      </main>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
