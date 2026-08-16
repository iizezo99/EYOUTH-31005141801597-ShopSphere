# ShopSphere

Full-stack e-commerce application built for the ShopSphere Enterprise Cloud-Native Modernization project.

## Remote repository

- Name: `EYOUTH-31005141801597-ShopSphere`
- GitHub: [iizezo99/EYOUTH-31005141801597-ShopSphere](https://github.com/iizezo99/EYOUTH-31005141801597-ShopSphere)

## Technologies

- React 18
- Vite
- React Router
- Axios
- React Testing Library and Vitest
- Express 5
- Prisma ORM
- PostgreSQL
- MongoDB and Mongoose
- Independent Review Service
- JWT authentication
- Nodemailer
- Docker and Docker Compose
- Kubernetes and Kustomize
- Vercel
- GitHub Actions
- UptimeRobot

## Deployments

- Frontend: [ShopSphere Frontend](https://eyouth-31005141801597-shop-sphere-q.vercel.app)
- Backend: [ShopSphere Backend](https://eyouth-31005141801597-shop-sphere.vercel.app)
- Review service: [ShopSphere Review Service](https://eyouth-31005141801597-shop-sphere-mmyb-4yvi5s338.vercel.app)
- Review service health: [Review Health](https://eyouth-31005141801597-shop-sphere-mmyb-4yvi5s338.vercel.app/health)
- Backend health: [Health](https://eyouth-31005141801597-shop-sphere.vercel.app/health)
- Backend readiness: [Readiness](https://eyouth-31005141801597-shop-sphere.vercel.app/health/ready)
- Products API: [Products](https://eyouth-31005141801597-shop-sphere.vercel.app/api/products)

## Seed accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `123456` |
| Customer | `customer@example.com` | `123456` |

## Kubernetes simulation

The project simulates two cloud environments using separate Kubernetes namespaces
on one local Docker Desktop cluster:

- `aws-simulation`
- `gcp-simulation`

Deploy both environments:

```powershell
kubectl apply -k k8s/overlays/aws-simulation
kubectl apply -k k8s/overlays/gcp-simulation
```

### Port forwarding

Forward each namespace independently using a different local port:

```powershell
# AWS simulation
kubectl -n aws-simulation port-forward service/eyouth-31005141801597-shopsphere-frontend 3001:3000

# GCP simulation
kubectl -n gcp-simulation port-forward service/eyouth-31005141801597-shopsphere-frontend 3002:3000
```

The frontend services are then available at:

- AWS simulation: `http://localhost:3001`
- GCP simulation: `http://localhost:3002`

Ingress and port-forwarding are optional local access methods. The two
namespaces are used to simulate separate cloud environments on one cluster.

## CI/CD and protected main branch

GitHub Actions runs the ShopSphere CI/CD workflow on pull requests and pushes
to `main`. The `test-and-build` job runs:

- Backend tests
- Frontend tests
- Frontend production build
- AWS and GCP Kubernetes manifest validation

The `main` branch is protected. Changes should be submitted through a pull
request, and the required check is:

```text
EYOUTH-31005141801597-ShopSphere CI/CD / test-and-build
```

If the check fails, GitHub blocks the pull request from merging into `main`.
After it passes, the pull request can be merged and the production deployment
workflow can run.
