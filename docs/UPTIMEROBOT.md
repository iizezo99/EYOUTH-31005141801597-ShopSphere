# UptimeRobot monitoring

UptimeRobot is the external uptime monitor for ShopSphere. The Kubernetes
`aws-simulation` and `gcp-simulation` namespaces remain local validation
simulations; they are not separate production cloud environments.

## Monitors to create

Create these HTTP(s) monitors in the UptimeRobot dashboard:

| Monitor | URL | Expected check |
| --- | --- | --- |
| Production frontend | `https://eyouth-31005141801597-shop-sphere-q.vercel.app/` | HTTP `200`, keyword `ShopVibe` |
| Production backend health | `https://eyouth-31005141801597-shop-sphere.vercel.app/health` | HTTP `200`, keyword `\"status\":\"ok\"` |
| Production backend readiness | `https://eyouth-31005141801597-shop-sphere.vercel.app/health/ready` | HTTP `200`, keyword `\"status\":\"ready\"` |
| Production review service health | `https://eyouth-31005141801597-shop-sphere-mmyb-4yvi5s338.vercel.app/health` | HTTP `200`, keyword `\"service\":\"review-service\"` |

Use a 5-minute interval, enable SSL-expiration monitoring, and add the team
email as an alert contact. Keep the readiness and review-service monitors
enabled because they detect missing production configuration even when a
Vercel function itself is reachable. The review-service deployment must allow
UptimeRobot's request through Vercel Deployment Protection; otherwise the
keyword check will correctly report it as down.

## Incident response

1. Check the failed monitor URL directly and record the time and HTTP status.
2. Inspect Vercel deployment logs using the request ID returned by the backend.
3. Check the Vercel deployment status and database provider alerts.
4. If the release is responsible, promote the last known-good Vercel deployment
   for the affected project.
5. Record impact, root cause, fix, and prevention in the incident log.

## Verification

After creating the monitors, use UptimeRobot's test alert and confirm that the
team receives it. Then verify that all three monitors show `Up` before sharing
the project.
