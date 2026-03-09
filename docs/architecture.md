# Ground Architecture

## Runtime Flow

1. User loads Next.js dashboard (`apps/web`).
2. Frontend calls ASP.NET Core API via `@ground/sdk`.
3. API reads/writes market data and pushes analysis jobs to Redis queue `analysis_jobs`.
4. Python workers consume jobs from Redis.
5. Workers fetch candles from Postgres (or Alpaca if needed), compute indicators, and persist results.
6. Frontend can display updated candle/analysis data through API endpoints.

## Service Boundaries

- `apps/web`: presentation layer only.
- `packages/sdk`: typed transport client.
- `apps/api`: orchestration, validation, persistence access, queue publish.
- `services/workers`: async processing and indicator computation.
- `infra/compose`: local environment provisioning.
