import React from 'react';

export default function ErrorBoundaryFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#050505] p-6 text-white text-center">
      <h2 className="mb-4 text-3xl font-bold tracking-tight text-[#d4ff4f]">Something went wrong</h2>
      <p className="mb-6 max-w-md text-zinc-400">
        We encountered an unexpected error. You can try refreshing the page or contact support if the issue persists.
      </p>
      <pre className="mb-8 max-w-full overflow-auto rounded border border-zinc-800 bg-zinc-900 p-4 text-sm text-red-400 text-left">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="rounded-full bg-[#d4ff4f] px-6 py-2 text-sm font-medium text-black transition-transform hover:scale-105"
      >
        Try Again
      </button>
    </div>
  );
}
