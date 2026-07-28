import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Search, Hash, Clock, Tag } from 'lucide-react';
import { fetchNotes, searchNotes } from '../lib/api';
import { calculateReadingTime } from '@platform/shared';
import { ThemeToggle } from '@platform/shared';

export function NoteList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes', searchQuery],
    queryFn: () => (searchQuery ? searchNotes(searchQuery) : fetchNotes()),
  });

  const categories = useMemo(() => {
    if (!notes) return [];
    const catMap = new Map<string, { slug: string; count: number; name: string }>();
    for (const n of notes) {
      if (!n.category) continue;
      const existing = catMap.get(n.categorySlug);
      if (existing) {
        existing.count++;
      } else {
        catMap.set(n.categorySlug, { slug: n.categorySlug, name: n.category, count: 1 });
      }
    }
    return Array.from(catMap.values()).sort((a, b) => b.count - a.count);
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    if (!selectedCategory) return notes;
    return notes.filter((n) => n.categorySlug === selectedCategory);
  }, [notes, selectedCategory]);

  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-body selection:bg-accent/30 selection:text-bg-base transition-colors duration-400">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        {/* Header Section */}
        <header className="mb-16 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent flex items-center justify-center rounded-lg shadow-sm">
                <span className="font-display font-bold text-bg-base text-xl leading-none tracking-tight">
                  VR
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-text-primary">
                Notes
              </h1>
            </div>
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
              A digital garden of my thoughts, learnings, and architectural decisions.
              <br />
              <a href="https://vishnurohithb.dev" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline mt-2 font-medium">
                Check out my portfolio &rarr;
              </a>
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row gap-6 mb-12">
          {/* Search */}
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-tertiary group-focus-within:text-accent transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-bg-elevated border border-border rounded-2xl text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Categories Section */}
        {categories.length > 0 && !searchQuery && (
          <div className="mb-12 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-text-primary text-bg-base shadow-md'
                  : 'bg-bg-elevated text-text-secondary hover:bg-bg-elevated-2 border border-border'
              }`}
            >
              All Notes
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-text-primary text-bg-base shadow-md'
                    : 'bg-bg-elevated text-text-secondary hover:bg-bg-elevated-2 border border-border'
                }`}
              >
                {cat.name} <span className="opacity-50 text-xs ml-1">{cat.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Notes Grid */}
        {isLoading ? (
          <div className="grid gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-bg-elevated rounded-2xl p-6 h-32 border border-border" />
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-24 px-6 rounded-3xl border border-dashed border-border">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bg-elevated text-text-tertiary mb-6">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-medium text-text-primary mb-2">No notes found</h3>
            <p className="text-text-secondary">We couldn't find anything matching your search.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredNotes.map((note) => (
              <Link key={note.slug} href={`/${note.slug}`} className="group block relative p-6 bg-bg-elevated rounded-2xl border border-border hover:border-accent/50 transition-all hover:shadow-xl hover:shadow-accent/5">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/0 to-accent/0 group-hover:from-accent/5 group-hover:to-transparent rounded-2xl transition-colors duration-500" />
                
                <div className="relative flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-4">
                  <h2 className="text-2xl sm:text-3xl font-display font-semibold text-text-primary group-hover:text-accent transition-colors tracking-tight">
                    {note.title}
                  </h2>
                  <time className="text-sm text-text-tertiary whitespace-nowrap flex items-center gap-1.5 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(note.publishedAt || note.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>

                <div className="relative flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                  {note.category && (
                    <span className="flex items-center gap-1.5 text-text-primary font-medium">
                      <Hash className="w-3.5 h-3.5 text-accent" />
                      {note.category}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {calculateReadingTime(note.content)}
                  </span>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {note.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="flex items-center gap-1 bg-bg-elevated-2 px-2 py-0.5 rounded text-xs">
                          <Tag className="w-3 h-3 text-text-tertiary" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
