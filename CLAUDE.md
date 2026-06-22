# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev       # Start dev server (Vite, localhost:5173)
yarn build     # Type-check + production build
yarn lint      # ESLint
yarn preview   # Preview production build
```

No test suite is configured.

## Deployment

Hosted on Vercel at `idun.otterbjork.se`. Vercel is connected to the GitHub repo (`Ojvind/idun`) and auto-deploys on every push to `master`. To deploy: push to `origin master`.

## Environment

Requires a `.env` file with:
```
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-key>
```

## Architecture

React 19 + TypeScript + Vite app for tracking body measurements. UI is entirely in Swedish. Dark-themed with Tailwind CSS 4 (stone palette, teal accent).

**Auth flow:** `App.tsx` listens to `supabase.auth.onAuthStateChange`. Unauthenticated users see `LoginGate` (email/password via Supabase). Authenticated users get `AuthenticatedApp` which passes `userId` down.

**Data flow:** A single `useMeasurements(userId)` hook (`src/hooks/useMeasurements.ts`) owns all state. It fetches from the Supabase `measurements` table and exposes `addEntry`, `updateEntry`, `deleteEntry`, `mergeEntries`. The hook is instantiated once in `AuthenticatedApp` and its return values are passed as props throughout.

**Routing:** React Router v7 with four routes — `/` (Dashboard), `/historik` (HistoryView with Recharts line chart + list), `/ny` (MeasurementForm, new), `/redigera/:id` (MeasurementForm, edit).

**Measurement fields:** Defined centrally in `src/utils/fields.ts` as a `FIELDS` array. The `MeasurementKey` union type in `src/types/index.ts` is the source of truth for the 9 tracked metrics (weight, navel, waist, chest, biceps×2, thighs×2, hips). Values stored as `Partial<Record<MeasurementKey, number>>` in a JSONB column.

**Supabase schema:** Single `measurements` table with columns `id`, `user_id`, `date`, `note`, `values` (JSONB). RLS is configured in the Supabase console (not in code).

**Import/Export:** `src/utils/storage.ts` handles JSON file export/import as a local backup mechanism (separate from Supabase persistence).
