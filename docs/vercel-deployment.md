# Vercel deployment

Ground is split across a frontend and a backend stack.

Vercel should host the frontend in `apps/web`.
The ASP.NET API, Redis, workers, and Postgres/TimescaleDB should be deployed somewhere else.

## What gets deployed to Vercel

- `apps/web`

## What does not get deployed to Vercel

- `apps/api`
- `services/workers`
- `redis`
- `postgres`

## Recommended setup

1. Import the repository into Vercel.
2. Create a project for the Next.js app.
3. Set the Root Directory to `apps/web`.
4. Keep the framework preset as `Next.js`.
5. Set `NEXT_PUBLIC_API_BASE_URL` to the deployed URL of the backend API.

Because this app depends on workspace packages outside `apps/web`, make sure the Vercel project is configured as a monorepo project and allowed to build with files outside the app directory when prompted by the dashboard settings.

## Environment variables

Required for the frontend project:

- `NEXT_PUBLIC_API_BASE_URL`

Example:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
```

## CLI flow

From the repo root:

```bash
npm install -g vercel
vercel login
vercel link
```

When linking, target the frontend project and use `apps/web` as the project root in Vercel.

To pull environment variables locally:

```bash
vercel env pull apps/web/.env.local
```

## Notes

- `apps/web/vercel.json` is intentionally minimal. Most of the important setup is in the Vercel project settings.
- If you want preview deployments to work correctly, the preview frontend must point at a reachable preview or shared backend API.
- If you want the backend to be deployable from this repo as well, the current architecture is better suited for a container platform such as Fly.io, Railway, Azure Container Apps, ECS, or similar.
