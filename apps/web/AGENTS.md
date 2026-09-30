# AGENTS.md (apps/web)

Next.js App Router workspace UI deployed to Vercel. All API access goes through `@ground/sdk` (`packages/sdk`), and types come from `@ground/shared-types`. Check with `npm run build:web` and `npm run lint:web` from the repo root.

## Code Review Rules

### Always flag (P0/P1)

- Direct `fetch` calls to the API from pages or components that bypass `@ground/sdk`. Add the call to the SDK instead, so contracts stay typed in one place.
- Secrets in client code. Only `NEXT_PUBLIC_API_BASE_URL` may be public. Flag any Alpaca, JWT, DB, or Redis value under `NEXT_PUBLIC_*` or imported into a `"use client"` component.
- Rendering API or user-supplied strings with `dangerouslySetInnerHTML`.

### Flag when relevant

- Pages that crash when the API is unreachable. The live demo serves the shell against an API that is often cold or absent, so SDK errors should render a fallback state.
- Data fetches that are cached, when the SDK uses `cache: "no-store"` on purpose for live market data.
- UI that presents placeholder numbers as live trading data without a prototype indicator.

### Don't flag

- Tailwind class ordering, component file layout, or copy tweaks.
