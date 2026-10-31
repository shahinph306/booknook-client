<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project

BookNook: a fresh Next.js 16.4 App Router app (TypeScript, Tailwind CSS v4, shadcn "base-nova" UI). Use npm (`package-lock.json`). No test runner, CI, or env files exist yet.

## Commands

- `npm run dev`, `npm run build`, `npm run lint`
- Typecheck: `npx tsc --noEmit` (no script; `next build` also runs TypeScript)
- Verify changes with `npx tsc --noEmit` and `npm run build`; there is no test command.

## Gotchas

- `npm run lint` currently fails only on generated code: `src/components/ui/carousel.tsx:98` and `src/hooks/use-mobile.ts:14` (`react-hooks/set-state-in-effect`). Treat these as pre-existing, not regressions, and don't disable the rule unless asked. `npm run build` passes.
- UI primitives are built on `@base-ui/react`, not Radix. Match the existing `src/components/ui/*` pattern when adding or changing components.
- Import the class helper as `import { cn } from "cn"` (the `cn` package). `components.json` aliases `@/lib/utils`, but that file does not exist.
- `src/app/globals.css` is still the create-next-app default, so shadcn tokens (`--primary`, `--border`, `--ring`, etc.) are undefined even though components use them. Define theme tokens in `globals.css` before trusting the UI styling.
- Shiki highlighting lives in `src/lib/highlighter.tsx`; languages are lazy-loaded — add new ones to the `languages` map there.
- Path alias `@/*` maps to `src/*`. Next 16 route-type helpers such as `LayoutProps<"/">` and `PageProps` are available (see `src/app/layout.tsx`).

## Git

- `booknook` has no `.git` of its own. The enclosing repo root is `C:\Users\SHAHIN`, and this directory is untracked there. Scope git commands, e.g. `git -C "C:\Users\SHAHIN" status -- "Desktop/Assignment-8/booknook"`, and never run `git add -A`/`git add .` from the repo root.
