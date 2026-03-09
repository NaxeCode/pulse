# Render free-tier setup (CLI-first)

This path targets a near-zero-cost prototype:

- Frontend on Vercel (`apps/web`)
- API + Postgres on Render free tier
- Queue processing disabled (no paid background worker required)

## Important free-tier limits

- Render free web services spin down after inactivity.
- Render free Postgres expires after 30 days.
- This is for a prototype/demo environment, not production durability.

## 1) Create Render resources from blueprint

This repo includes a Render blueprint at `render.yaml`:

- web service: `ground-api`
- free Postgres: `ground-db`
- queue mode disabled via `ANALYSIS_QUEUE_ENABLED=false`

Install and log in to Render CLI (Ubuntu):

```bash
curl -fsSL https://raw.githubusercontent.com/render-oss/cli/refs/heads/main/bin/install.sh | sh
export PATH="$PATH:$HOME/.local/bin"
render login
render workspaces -o text
render workspace set <WORKSPACE_ID_OR_NAME>
render workspace current -o text
```

Install .NET SDK locally (no sudo required, used for API build checks):

```bash
cd /tmp
curl -fsSL https://dot.net/v1/dotnet-install.sh -o dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel 8.0 --install-dir /home/naxe/Development/pulse/.dotnet
export PATH="$PATH:/home/naxe/Development/pulse/.dotnet"
export DOTNET_CLI_HOME=/home/naxe/Development/pulse/.dotnet
```

Validate blueprint config locally:

```bash
cd /home/naxe/Development/pulse
render blueprints validate render.yaml
```

Create/sync the blueprint once in Render Dashboard:

1. Go to Render Dashboard.
2. New -> Blueprint.
3. Select this repo and branch.
4. Confirm `render.yaml`.
5. Set required `sync: false` vars when prompted:
- `ALLOWED_ORIGIN`: your Vercel web URL, e.g. `https://your-app.vercel.app`
- `JWT_SIGNING_KEY`: long random secret

Blueprint apply/sync is done from the Render Dashboard in this CLI version.

## 2) Initialize database schema

When `ground-db` is ready, find its database service ID:

```bash
render services -o json
```

Apply the SQL init script with `psql` passthrough flags:

```bash
render psql <DATABASE_ID> -- --file=/home/naxe/Development/pulse/infra/compose/initdb/init.sql
```

Verify the API is healthy:

```bash
render services list
```

Then open your Render API URL and check:

```bash
curl -i https://<ground-api-url>/health
```

## 3) Point Vercel frontend at Render API

In Vercel project env vars, set:

```bash
NEXT_PUBLIC_API_BASE_URL=https://<ground-api-url>
```

Redeploy web after updating env vars.

## 4) Notes on analysis runs in free mode

`POST /api/v1/analysis/run` still returns accepted/queued-style responses for UI flow, but with queue disabled it does not publish jobs to Redis.

To enable real async processing later:

1. Set `ANALYSIS_QUEUE_ENABLED=true`
2. Provide `REDIS_CONNECTION_STRING`
3. Deploy worker service (`services/workers`) on a host that supports always-on background jobs
