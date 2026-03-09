# Ground

**Ground** is a work-in-progress financial analysis platform built as a production-minded monorepo.

It combines a serverless-ready frontend, a containerized API, asynchronous Python workers, and a market-data pipeline designed for local iteration now and cloud deployment later.

> Status: active prototype. The core development loop is working locally, but the product surface, analysis depth, auth, and operational hardening are still in progress.

## Why This Exists

Ground is structured to model a realistic financial systems stack without collapsing everything into a single service.

- `Next.js` for the product UI
- `ASP.NET Core` for API orchestration and business logic
- `Redis` for lightweight job queueing
- `Python` workers for ingestion and analysis tasks
- `PostgreSQL + TimescaleDB` for market time-series storage
- `Alpaca` integration points for market data and paper trading

## Architecture

![Ground architecture](./architecture.png)

```text
Next.js UI
  -> typed SDK
  -> ASP.NET API
  -> Redis queue
  -> Python workers
  -> TimescaleDB
  -> Alpaca APIs
```

This repository is intentionally split by responsibility so the frontend, API, workers, and shared packages can evolve independently.

## Repository Layout

```text
ground-platform/
  apps/
    web/            # Next.js application
    api/            # ASP.NET Core API
  services/
    workers/        # Python worker processes
  packages/
    sdk/            # Typed frontend client for the API
    shared-types/   # Shared DTOs and contracts
  infra/
    docker/
    compose/
  scripts/
  docs/
```

## Current Scope

Today, the prototype includes:

- a dashboard that loads tracked symbols from the API
- a symbol detail page with candle data
- a typed SDK consumed by the frontend
- an API endpoint to queue analysis jobs
- a Redis-backed worker pipeline
- analysis result persistence into PostgreSQL
- local infrastructure with Docker Compose

Not done yet:

- real authentication and authorization
- richer analytics and portfolio workflows
- production deployment configuration
- observability, retries, and job lifecycle visibility in the UI

## Local Development

### Prerequisites

- Docker with `docker compose`
- Node.js `20+`
- npm `10+`

### 1. Configure environment

From the repo root:

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
```

If you want workers to fetch live data when local candles are missing, add `ALPACA_API_KEY` and `ALPACA_SECRET_KEY` to `.env`.

### 2. Start the backend stack

```bash
cd infra/compose
docker compose --env-file ../../.env up --build
```

Or from the repo root:

```bash
./scripts/dev-up.sh
```

Services started by Compose:

- `postgres`
- `redis`
- `api`
- `workers`

### 3. Start the frontend

In a second terminal:

```bash
npm install
npm run dev:web
```

### 4. Open the app

- Frontend: `http://localhost:3000/dashboard`
- API health: `http://localhost:8080/health`
- API symbols: `http://localhost:8080/api/v1/symbols`

## API Surface

- `GET /api/v1/symbols`
- `GET /api/v1/candles/{symbol}`
- `POST /api/v1/analysis/run`

Example:

```bash
curl -X POST http://localhost:8080/api/v1/analysis/run \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","analysisType":"basic"}'
```

That request queues a Redis job on `analysis_jobs`, which is then consumed by the Python worker for analysis and persistence.

## Data Model

Primary time-series table:

- `market_candles(symbol, ts, open, high, low, close, volume)`

The table is initialized as a Timescale hypertable.

Analysis output table:

- `analysis_results(symbol, analysis_type, computed_at, rsi, sma_20, sma_50)`

## Engineering Notes

- The frontend calls the backend through [`packages/sdk`](/Users/aladdinali/Development/pulse/ground-platform/packages/sdk), not raw `fetch()` calls spread across the app.
- The API includes placeholder JWT middleware so auth can be tightened without rewriting the request pipeline.
- Workers are deliberately isolated from the API process so ingestion and analysis logic can scale independently.
- Seed candle data is included so the local environment is useful immediately after startup.

## WIP Direction

The next phase is not more scaffolding. It is deeper product behavior:

- better analysis workflows and result retrieval
- Alpaca-backed ingestion paths beyond fallback fetches
- user/account boundaries
- execution and paper-trading flows
- stronger operational visibility across queue, workers, and API
