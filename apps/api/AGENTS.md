# AGENTS.md (apps/api)

ASP.NET Core 8 minimal API. Endpoints are in `src/Endpoints/*`, config in `src/Program.cs` / `src/Config/AppOptions.cs`, and the queue publisher is `src/Services/RedisQueuePublisher.cs` (with a `NoopAnalysisRequestPublisher` fallback). Build with `dotnet build apps/api`.

## Code Review Rules

### Always flag (P0/P1)

- **Placeholder JWT used as auth.** `PlaceholderJwtMiddleware` only tags `context.Items["AuthState"]` and never validates a token. Flag any endpoint that treats `"placeholder-valid"` as proof of identity or authorization, or that gates writes on it. Real auth must validate issuer, audience, lifetime, and signature with `JwtIssuer`/`JwtAudience`/`JwtSigningKey`.
- **Default JWT signing key.** Flag code that lets real JWT validation run with the default `"change-this-in-production"` key or an empty `JWT_SIGNING_KEY`. Startup should fail outside Development instead.
- **Unvalidated enqueue.** `POST /api/v1/analysis/run` currently checks only for a blank symbol. Flag changes that enqueue new request fields without validating them, or that pass an unnormalized symbol (it must be upper-cased and length/charset bounded, ideally checked against `SymbolCatalog`). The symbol flows into the worker's Alpaca URL path and into DB rows.
- **CORS widening.** Flag `AllowAnyOrigin`, wildcard origins, or `AllowCredentials` combined with a broad origin. The policy should stay single-origin via `ALLOWED_ORIGIN`.

### Flag when relevant

- Queue publishing that reports `queued` when nothing was enqueued. The Noop publisher must return `false` so the response says `disabled`.
- Redis connection failures that crash startup when `ANALYSIS_QUEUE_ENABLED` is off or Redis is unset. Degraded no-op mode is the expected behavior.
- `EnsureDatabaseInitializedAsync` changes that aren't idempotent, or that drop or alter existing tables on boot.
- Unbounded `limit` values taken from the request in `CandleRepository` queries.
- Swagger enabled outside `IsDevelopment()`.

### Don't flag

- `PlaceholderPlatformService` returning fake data.
- The DB init logging an error and continuing instead of crashing. This is intentional so the Render free tier can boot without a DB.
