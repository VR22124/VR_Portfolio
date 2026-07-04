# Codebase Cleanup Log

This file tracks all scaffolding, unused code, unused assets, and unused dependencies removed during the cleanup.

## Phase 1 — Platform Scaffolding Cleanup (Replit / Lovable)
- Removed `.replit`, `.replitignore`, and `replit.md` from the root directory.
- Removed `.replit-artifact` folder from `artifacts/portfolio`.
- Removed `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`, and `@replit/vite-plugin-runtime-error-modal` from `artifacts/portfolio/package.json` and `pnpm-workspace.yaml`.
- Removed Replit-specific plugin usage from `artifacts/portfolio/vite.config.ts`.

## Phase 2 — Unused Dependency Audit
Removed the following dependencies identified as unused via `depcheck` and manual code audit:
- `@react-three/drei`
- `@hookform/resolvers`
- `@tanstack/react-query`
- `@workspace/api-client-react` (Also removed project reference from `tsconfig.json`)
- `date-fns`
- `framer-motion` (Also removed from `manualChunks` in Vite config)
- `tw-animate-css`
- `wouter`
- `zod`
