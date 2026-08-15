# ShopSphere production runbook

## Architecture

`frontend` is a Vite React app deployed to Vercel. `backend` is an Express API deployed to Vercel or a container platform. Supabase PostgreSQL stores users, categories, and products through Prisma. MongoDB Atlas stores shopping carts and the independent review service data. GitHub Actions runs tests, the frontend build, and Kubernetes manifest validation.

## Account setup checklist

1. **Supabase**: create a project, set the transaction pooler URI as `DATABASE_URL`, and set the session pooler URI as `DIRECT_URL` for Prisma migrations. Run `npx prisma migrate deploy` from `backend` once against the production project. Seed only deliberately; the seed script contains demo credentials.
2. **MongoDB Atlas**: create a production cluster and database user, allow only the backend egress IPs (avoid `0.0.0.0/0`), then set `MONGO_URI` to the SRV connection string. Enable backups and alerting.
3. **Vercel frontend**: import the repository, set the project root to `frontend`, and add `VITE_API_URL=https://<backend-domain>/api` for Production, Preview, and Development as appropriate.
   Add `VITE_REVIEW_API_URL=https://<review-service-domain>` so Product Details can load and submit 1–5 star reviews.
4. **Vercel backend**: import the same repository as a second project, set the root directory to `backend`, and add the variables used by the local backend configuration. `backend/vercel.json` exposes the Express app through `api/index.js`.
5. Set `FRONTEND_URL` on the backend to the exact frontend origin. Rotate `JWT_SECRET`, database passwords, and SMTP credentials through Vercel Environment Variables or a cloud secret manager; never commit them.

## Release flow

Pull requests must pass backend tests, frontend tests, the production build, and both Kustomize renders. Merge to `main` only after staging smoke tests. Promote the same commit to Production, then verify `/health`, `/health/ready`, login, product listing, cart read/write, and one admin operation.

## Rollback

1. In Vercel, promote the last known-good deployment for both frontend and backend.
2. Do not roll back database migrations automatically. Use a forward-compatible migration or an explicitly reviewed reverse migration.
3. If a release fails readiness, inspect request-ID logs, restore the previous deployment, and record the incident: time, impact, root cause, fix, and prevention.

## Monitoring and incident response

Use Vercel logs or the container log collector to search JSON fields `requestId`, `status`, `path`, and `durationMs`. Configure the three UptimeRobot monitors in [UPTIMEROBOT.md](UPTIMEROBOT.md) for the frontend, backend health, and backend readiness URLs. Alert on non-2xx responses, keyword failures, SSL expiration, or sustained latency. Configure Supabase and Atlas alerts for connection failures, CPU/storage thresholds, and backup failures. The Kubernetes manifests include readiness/liveness probes and an HPA; the `aws-simulation` and `gcp-simulation` overlays are namespace simulations for validation, not real multi-cloud production clusters.

## CDN and shared responsibility

Vercel's edge network serves frontend static assets close to users and reduces latency. The provider owns physical infrastructure, networking, and platform availability; the team owns application code, access control, database permissions, secrets, updates, and safe data handling.
