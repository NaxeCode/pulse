# AGENTS.md

Ground (repo `pulse`) is a prototype financial-analysis platform. It has a Next.js web app (`apps/web`), an ASP.NET Core 8 minimal API (`apps/api`), and a Python worker (`services/workers`) that takes jobs from a Redis list and writes to Postgres/TimescaleDB. Web talks to API only through `packages/sdk`. Contracts live in `packages/shared-types` and `apps/api/src/Models/Contracts.cs`.

Run: `cp .env.example .env && npm run compose:up` (db, redis, api, worker), then `npm install && npm run dev:web`. Checks: `npm run build:web`, `npm run lint:web`, `dotnet build apps/api`.

## Code Review Rules

Repo-wide rules are below. `apps/api/AGENTS.md`, `apps/web/AGENTS.md`, and `services/workers/AGENTS.md` add rules for their own subtree. Formatting and lint are left to CI and tooling.

### Always flag (P0/P1)

- **Queue contract drift.** The job payload `{symbol, analysisType}` is produced in `apps/api/src/Services/RedisQueuePublisher.cs` and consumed in `services/workers/main.py` (`process_job`). The queue name comes from `ANALYSIS_QUEUE_NAME` (default `analysis_jobs`), and the pair is `LPUSH` + `BRPOP`. Flag changes to field names, casing, queue name, or push/pop direction on only one side.
- **API contract drift.** Flag response shape changes in `apps/api/src/Models/Contracts.cs` that aren't mirrored in `packages/shared-types/src/index.ts` and `packages/sdk/src/index.ts`, and the reverse.
- **Schema drift.** The schema is created in two places: `EnsureDatabaseInitializedAsync` in `apps/api/src/Program.cs` and `infra/compose/initdb/init.sql`. Both must stay idempotent (`IF NOT EXISTS`, `if_not_exists => TRUE`, `ON CONFLICT`) and agree with each other and with the columns `services/workers/storage.py` reads and writes.
- **Secrets.** Flag committed `.env` files, real `ALPACA_*` keys, `JWT_SIGNING_KEY` values, or connection strings with real credentials. The `ground_user`/`ground_pass` compose defaults are local-only placeholders. Any real value must come from env or the Render/Vercel dashboards.
- **SQL injection.** All SQL must stay parameterized (Npgsql parameters, psycopg2 `%s` / `execute_values`). Flag string-built SQL that includes a symbol or any other request value.

### Flag when relevant

- New cross-service calls that bypass the boundaries: web calling Postgres or Redis directly, or the worker calling the API. The only allowed paths are web → SDK → API → Redis → worker → DB/Alpaca.
- Features that claim to be "real" but still read from `PlaceholderPlatformService`, when the PR description says they are wired to data.

### Don't flag

- Placeholder data and the prototype `PlaceholderJwtMiddleware` as such. Both are documented WIP. Flag only code that *relies* on them for authorization; see `apps/api/AGENTS.md`.
- Lost jobs on worker crash (no reliable-queue semantics yet). This is a documented limitation, unless a PR claims to fix it.
- Formatting, naming, or Tailwind class order.
