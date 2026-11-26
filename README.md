<img src=".github/brand/logo.svg" width="80" alt="" />

# Ground

A prototype financial-analysis platform: a Next.js workspace over an ASP.NET Core API that queues analysis jobs to Python workers through Redis and stores market data in TimescaleDB.

[![status](https://img.shields.io/badge/status-wip-dbbc7f?style=flat&labelColor=2d353b)](#status)
![.NET](https://img.shields.io/badge/ASP.NET_Core-8-7fbbb3?style=flat&labelColor=2d353b&logo=dotnet&logoColor=d3c6aa)
![Next.js](https://img.shields.io/badge/Next.js-16-7fbbb3?style=flat&labelColor=2d353b&logo=nextdotjs&logoColor=d3c6aa)
![Python](https://img.shields.io/badge/Python-workers-7fbbb3?style=flat&labelColor=2d353b&logo=python&logoColor=d3c6aa)
![Redis](https://img.shields.io/badge/Redis-queue-7fbbb3?style=flat&labelColor=2d353b&logo=redis&logoColor=d3c6aa)
![TimescaleDB](https://img.shields.io/badge/TimescaleDB-pg16-7fbbb3?style=flat&labelColor=2d353b&logo=postgresql&logoColor=d3c6aa)
[![demo](https://img.shields.io/badge/demo-live-a7c080?style=flat&labelColor=2d353b)](https://ground.naxe.dev)

## What it does

- Serves a workspace UI (dashboard, symbol, portfolio, analysis, alerts, settings) from a Next.js App Router app that talks to the API only through a typed SDK package.
- Exposes a versioned minimal API (`/api/v1/...`) for symbols, candles, dashboard, portfolio, analysis, alerts and settings, plus `/health`.
- Reads OHLCV candles from a TimescaleDB hypertable (`market_candles`, primary key `(symbol, ts)`).
- Validates the symbol on `POST /api/v1/analysis/run` and returns `202 Accepted` after Redis acknowledges the list push.
- Runs a Python worker that consumes jobs, backfills missing candles from Alpaca market data when configured, computes RSI and 20/50-period SMAs with pandas, and writes the result to `analysis_results`.

## How it works

```mermaid
flowchart LR
    W[Next.js web<br/>apps/web] -->|@ground/sdk| A[ASP.NET Core API<br/>apps/api]
    A -->|SELECT candles| DB[(Postgres + TimescaleDB<br/>market_candles hypertable<br/>analysis_results)]
    A -->|LPUSH analysis_jobs| Q[(Redis)]
    Q -->|BRPOP| K[Python worker<br/>services/workers]
    K -->|read candles| DB
    K -->|missing data| AL[Alpaca market data API]
    K -->|upsert candles<br/>insert results| DB
```

Mechanisms that exist in the code today:

- **Background worker over a queue.** The API publishes JSON jobs to the `analysis_jobs` Redis list (`RedisQueuePublisher`); the worker blocks on `BRPOP` with a 5 s timeout, and a failed job is logged and followed by a 2 s pause instead of killing the loop (`services/workers/main.py`).
- **Graceful degradation.** If `ANALYSIS_QUEUE_ENABLED` is false or the Redis connection string is empty, a valid run request returns `503 Service Unavailable`. The Render blueprint uses this mode.
- **Idempotent writes and schema setup.** Candle backfills use `INSERT ... ON CONFLICT (symbol, ts) DO UPDATE`, so re-fetching the same bars is safe. On startup the API runs `CREATE ... IF NOT EXISTS`, `create_hypertable(..., if_not_exists => TRUE)` and a seed with `ON CONFLICT DO NOTHING`, so repeated boots converge on the same schema.
- **Bounded external calls.** Alpaca requests use a 20 s timeout.
- **Operational basics.** JSON console logging, a single-origin CORS policy, `postgres://` URL normalization for hosted databases, and Docker health checks gating API and worker startup.

Contracts shared between the web app and SDK live in `packages/shared-types`. The data model is two tables: `market_candles(symbol, ts, open, high, low, close, volume)` and `analysis_results(symbol, analysis_type, computed_at, rsi, sma_20, sma_50)`.

## Getting started

Requires Docker with `docker compose`, Node.js 20+ and npm 10+.

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
npm run compose:up          # Postgres/TimescaleDB, Redis, API, worker
```

In a second terminal:

```bash
npm install
npm run dev:web             # http://localhost:3000/dashboard
```

The local web example sets `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8080`. If an existing setup points to `localhost` and the API listens only on IPv4, set that value in `apps/web/.env.local` and restart the web app. Reads can fall back to IPv4 automatically. An analysis POST uses the configured address once because the API may have enqueued the job before the connection dropped.

The API listens on `http://localhost:8080` (`/health`, Swagger in Development). Queue an analysis job:

```bash
curl -X POST http://localhost:8080/api/v1/analysis/run \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","analysisType":"basic"}'
```

A blank symbol returns `400 Bad Request`. With the default queue enabled, a successful push returns `202` with `{"status":"queued","queue":"analysis_jobs"}`. Worker processing happens separately. A lost HTTP response leaves the submission outcome unknown.

To check the route, run `dotnet test tests/Ground.Api.Tests` with the .NET 8 SDK. The HTTP tests use the disabled publisher and a recording publisher. To check the SDK’s handling of `503` and lost responses, run `node --test packages/sdk/test/analysis.test.mjs` with Node.js 22.18 or newer.

Set `ALPACA_API_KEY` and `ALPACA_SECRET_KEY` in `.env` to let the worker fetch candles that are not in the database. Other scripts: `npm run build:web`, `npm run lint:web`, `npm run compose:down`.

Deployment notes: [docs/vercel-deployment.md](docs/vercel-deployment.md) for the frontend, [docs/render-free-cli-setup.md](docs/render-free-cli-setup.md) and `render.yaml` for the API.

## Status

Work in progress. The system boundaries are real: web to SDK to API, API to Redis to worker, worker to TimescaleDB and Alpaca. Much of the product surface is not yet backed by real data.

- Real: candle reads, the analysis queue, the worker and its indicator math, schema setup.
- Placeholder: dashboard, symbol workspace, portfolio, analysis workspace, alerts and settings responses (`PlaceholderPlatformService`), and auth (`PlaceholderJwtMiddleware` only tags requests; it does not validate tokens).
- Not yet: reliable-queue semantics (a job popped by a worker that crashes mid-run is lost), retries on worker failures, analysis history in the UI, execution flows.

The live demo serves the frontend shell with prototype data.

## How this project is run

[![tracked in Linear](.github/brand/badges/run-linear.svg)](https://linear.app) [![AI-reviewed · Codex](.github/brand/badges/run-codex.svg)](#how-this-project-is-run) [![PR-only main](.github/brand/badges/run-main.svg)](#how-this-project-is-run)

- **Planning:** tracked in Linear as initiatives → projects → milestones → issues; branch names and PR titles carry the issue ID.
- **Review:** every pull request gets a Codex review before merge.
- **Guardrails:** the default branch changes only through pull requests (GitHub ruleset).

## License

MIT. See [LICENSE](LICENSE).

---
<sub>Built by [Aladdin Ali](https://github.com/NaxeCode) · [naxecode.github.io](https://naxe.dev/?utm_source=github&utm_medium=readme&utm_campaign=portfolio&utm_content=ground)</sub>
