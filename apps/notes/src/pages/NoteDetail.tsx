import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { ArrowLeft, Clock, Hash, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { MarkdownRenderer } from '@platform/shared/src/markdown';
import { calculateReadingTime, ThemeToggle } from '@platform/shared';
import { fetchNote } from '../lib/api';

export function NoteDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['note', slug],
    queryFn: () => fetchNote(slug as string),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base px-6 py-24 animate-pulse">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-8 w-24 bg-bg-elevated rounded"></div>
          <div className="h-16 bg-bg-elevated rounded"></div>
          <div className="h-96 bg-bg-elevated rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6 text-center font-body">
        <h1 className="text-4xl font-display font-bold mb-4 text-text-primary">Note not found</h1>
        <p className="text-text-secondary mb-8">The note you're looking for doesn't exist or has been moved.</p>
        <Link href="/">
          <a className="inline-flex items-center gap-2 px-6 py-3 bg-text-primary text-bg-base font-medium rounded-full hover:opacity-90 transition-opacity">
            <ArrowLeft className="w-4 h-4" /> Back to Notes
          </a>
        </Link>
      </div>
    );
  }

  const { note, prev, next } = data;

  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-body selection:bg-accent/30 selection:text-bg-base transition-colors duration-400 pb-24">
      {/* Top Nav */}
      <nav className="sticky top-0 z-10 bg-bg-base/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 bg-accent flex items-center justify-center rounded shadow-sm">
                <span className="font-display font-bold text-bg-base text-xs leading-none tracking-tight">
                  VR
                </span>
              </div>
              <span className="hidden sm:block font-medium text-text-primary group-hover:text-accent transition-colors">
                Notes
              </span>
            </Link>
            <div className="w-px h-4 bg-border hidden sm:block"></div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent transition-colors">
              <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back to all notes</span><span className="sm:hidden">Back</span>
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-16">
        {/* Header */}
        <header className="mb-12">
          {note.category && (
            <div className="inline-flex items-center gap-1.5 text-sm font-medium text-text-primary mb-4 bg-bg-elevated px-3 py-1 rounded-full border border-border">
              <Hash className="w-3.5 h-3.5 text-accent" />
              {note.category}
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight mb-6 text-text-primary leading-tight">
            {note.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary border-b border-border pb-8">
            <time className="flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4" />
              {new Date(note.publishedAt || note.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-border" />
              {calculateReadingTime(note.content)}
            </span>
          </div>
        </header>

        {/* Content */}
        <article className="mb-16">
          <MarkdownRenderer content={note.content} />
        </article>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap mb-16 pt-8 border-t border-border">
            <Tag className="w-4 h-4 text-text-tertiary" />
            {note.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-bg-elevated border border-border rounded-full text-xs font-medium text-text-secondary">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Prev / Next Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-8">
          {prev ? (
            <Link href={`/${prev.slug}`} className="group flex flex-col p-4 rounded-2xl border border-border hover:border-accent/50 bg-bg-elevated hover:bg-bg-elevated-2 transition-all text-left">
              <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2 flex items-center gap-1">
                <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Previous Note
              </span>
              <span className="font-medium text-text-primary font-display line-clamp-2">
                {prev.title}
              </span>
            </Link>
          ) : <div />}
          
          {next ? (
            <Link href={`/${next.slug}`} className="group flex flex-col p-4 rounded-2xl border border-border hover:border-accent/50 bg-bg-elevated hover:bg-bg-elevated-2 transition-all text-right items-end">
              <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2 flex items-center gap-1">
                Next Note <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="font-medium text-text-primary font-display line-clamp-2">
                {next.title}
              </span>
            </Link>
          ) : <div />}
        </div>
      </main>
    </div>
  );
}
