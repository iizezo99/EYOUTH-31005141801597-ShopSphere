# ShopSphere

Full-stack e-commerce application built for the ShopSphere Enterprise Cloud-Native Modernization project.

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
- Review service: (https://eyouth-31005141801597-shop-sphere-m.vercel.app)
- Review service health: (https://eyouth-31005141801597-shop-sphere-m.vercel.app/health)

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

Verify the workloads:

```powershell
kubectl -n aws-simulation get pods,svc
kubectl -n gcp-simulation get pods,svc
```

Use the shared Ingress controller:

```powershell
kubectl -n ingress-nginx port-forward service/ingress-nginx-controller 18080:80
```

Open the default local application at:

```text
http://localhost:18080
```

Both namespaces have independent frontend and backend Pods and Services, while
the shared Ingress provides one local load-balancer entry point.
