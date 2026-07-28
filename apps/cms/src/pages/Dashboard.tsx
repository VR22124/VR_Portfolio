import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Plus, Edit2, CheckCircle2, Circle, LogOut, FileText, Globe, Upload } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import { calculateReadingTime, ThemeToggle } from '@platform/shared';

export function Dashboard() {
  const { logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: notes, isLoading } = useQuery({
    queryKey: ['admin-notes'],
    queryFn: api.getNotes,
  });

  const handleCreate = async () => {
    try {
      const note = await api.createNote({
        title: 'New Note ' + new Date().toLocaleTimeString(),
        content: '# New Note\n\nStart writing here...',
      });
      setLocation(`/notes/${note._id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    try {
      setIsImporting(true);
      const data = JSON.parse(importJson);
      const notesToImport = Array.isArray(data) ? data : [data];
      
      for (const note of notesToImport) {
        await api.createNote({
          title: note.title || 'Untitled',
          content: note.content || '',
          category: note.category || '',
          tags: note.tags || [],
          published: false // Ensure imported notes appear only after clicking publish
        });
      }
      
      setImportJson('');
      setIsImportModalOpen(false);
      window.location.reload(); // Refresh to see the new notes
    } catch (error) {
      console.error('Import failed', error);
      alert('Invalid JSON structure. Ensure it is an array of notes or a single note object.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-body flex h-screen overflow-hidden selection:bg-accent/30 selection:text-bg-base transition-colors duration-400">
      {/* Sidebar */}
      <aside className="w-64 bg-bg-elevated border-r border-border flex flex-col hidden sm:flex">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-display font-bold tracking-tight flex items-center gap-3">
            <div className="w-9 h-9 bg-accent flex items-center justify-center rounded-lg shadow-sm">
              <span className="font-display font-bold text-bg-base text-sm leading-none tracking-tight">
                VR
              </span>
            </div>
            Studio
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 bg-bg-elevated-2 text-text-primary rounded-lg font-medium">
            <FileText className="w-4 h-4" /> Notes
          </Link>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated-2 rounded-lg font-medium transition-colors">
            <Globe className="w-4 h-4" /> Blog <span className="text-[10px] ml-auto uppercase tracking-wider bg-bg-elevated-2 px-1.5 py-0.5 rounded">Soon</span>
          </a>
        </nav>
        <div className="p-4 border-t border-border">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-3 py-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 px-6 sm:px-8 flex items-center justify-between border-b border-border bg-bg-base/50 backdrop-blur-md">
          <h2 className="text-lg font-semibold font-display">Notes</h2>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-bg-elevated-2 text-text-primary text-sm font-medium rounded-full hover:bg-bg-elevated transition-colors shadow-sm border border-border"
            >
              <Upload className="w-4 h-4" /> Import JSON
            </button>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-text-primary text-bg-base text-sm font-medium rounded-full hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Note
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 sm:p-8">
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-bg-elevated rounded-2xl animate-pulse border border-border" />
                ))}
              </div>
            ) : notes?.length === 0 ? (
              <div className="text-center py-20 bg-bg-elevated rounded-3xl border border-dashed border-border">
                <FileText className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">No notes yet</h3>
                <p className="text-text-secondary mb-6">Create your first note to get started.</p>
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-text-primary text-bg-base text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" /> Create Note
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {notes?.map((note: any) => (
                  <Link key={note._id} href={`/notes/${note._id}`} className="group flex items-center justify-between p-4 bg-bg-elevated rounded-2xl border border-border hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/5">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="shrink-0 pt-1">
                          {note.published ? (
                            <CheckCircle2 className="w-5 h-5 text-accent" />
                          ) : (
                            <Circle className="w-5 h-5 text-text-tertiary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-text-primary font-display truncate pr-4 group-hover:text-accent transition-colors">
                            {note.title || 'Untitled Note'}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-text-secondary mt-1">
                            <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                            {note.category && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span>{note.category}</span>
                              </>
                            )}
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span>{calculateReadingTime(note.content)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-2 bg-bg-elevated-2 rounded-full text-text-secondary">
                          <Edit2 className="w-4 h-4" />
                        </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* JSON Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-bg-elevated border border-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-display font-semibold text-text-primary">Import Notes from JSON</h2>
              <p className="text-sm text-text-secondary mt-1">
                Paste an array of note objects. They will be imported as Drafts.
              </p>
            </div>
            <div className="p-6">
              <textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder='[\n  {\n    "title": "My Note",\n    "content": "Markdown...",\n    "category": "Backend"\n  }\n]'
                className="w-full h-64 bg-bg-base border border-border rounded-xl p-4 font-mono text-sm text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-bg-elevated-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-lg font-medium text-text-secondary hover:text-text-primary transition-colors"
                disabled={isImporting}
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={isImporting || !importJson.trim()}
                className="px-4 py-2 rounded-lg font-medium bg-text-primary text-bg-base disabled:opacity-50 transition-opacity"
              >
                {isImporting ? 'Importing...' : 'Import Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
