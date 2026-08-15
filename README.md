# E-Commerce Full-Stack App

A full-stack e-commerce application with a React frontend, Express backend, PostgreSQL (products/users), and MongoDB (shopping cart).

## GitHub Repository

**Repository:** https://github.com/iizezo99/ecommerce-fullstack-project

## Technologies Used

### Frontend
- **React 18** - User interface library
- **Vite** - Frontend build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vitest** - Testing framework
- **React Testing Library** - React component testing
- **MSW (Mock Service Worker)** - API mocking for tests

### Backend
- **Express 5** - Web framework
- **Prisma ORM** - Database ORM for PostgreSQL
- **Prisma Adapter for PostgreSQL** - Prisma Postgres adapter
- **Mongoose** - ODM for MongoDB (cart)
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cookie-parser** - Cookie handling
- **cors** - Cross-origin resource sharing
- **multer** - File upload handling
- **nodemailer** - Email sending
- **dotenv** - Environment variables
- **Jest** - Testing framework
- **Supertest** - API testing

### Database
- **PostgreSQL** - Relational database (users, products, categories)
- **MongoDB** - NoSQL database (shopping cart)

### DevOps / Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Node.js** - JavaScript runtime

## Quick Start (Docker)

The only requirement is [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

```bash
docker compose up --build
```

Wait until all services are healthy. Then open:

| Service    | URL                          |
|------------|------------------------------|
| Frontend   | http://localhost:3000        |
| Backend    | http://localhost:5000        |
| Health API | http://localhost:5000/health |

### Default seed accounts

| Role     | Email                  | Password |
|----------|------------------------|----------|
| Admin    | admin@example.com      | 123456   |
| Customer | customer@example.com   | 123456   |

### Stop the app

```bash
docker compose down
```

To also remove database volumes:

```bash
docker compose down -v
```

## What Docker starts

1. **PostgreSQL** — users, categories, products
2. **MongoDB** — shopping carts
3. **Backend** — runs migrations, seeds data, starts API on port 5000
4. **Frontend** — builds and serves the React app on port 3000

## Important Notes

- **Admin Role Only Features:** Creating, updating, and deleting products/categories, and viewing the admin dashboard with counts are only accessible to admin users.
- **Password Update:** To change your password in your profile, you must provide your current password.
- **Product Photo Requirement:** Products cannot be created or updated without a photo (either via file upload or image URL).
- **Email Setup:** The app uses Nodemailer for welcome emails. To configure real email sending, set SMTP environment variables in the backend (see backend code for defaults using ethereal.email for testing).
- **Data Persistence:** By default, Docker volumes are used for PostgreSQL and MongoDB to keep your data even after stopping containers. Use `docker compose down -v` to completely remove all data.

## Running tests locally

### Backend (Jest + Supertest)

```bash
cd backend
npm install
npm test
```

## Production deployment

Use [docs/PRODUCTION-RUNBOOK.md](docs/PRODUCTION-RUNBOOK.md) for the Supabase PostgreSQL, MongoDB Atlas, Vercel, CI/CD, Kubernetes namespace simulation, security, monitoring, and rollback procedure. Use [docs/UPTIMEROBOT.md](docs/UPTIMEROBOT.md) to configure external uptime monitoring. Configure environment variables directly in each deployment platform and keep local `.env` files untracked.

### Frontend (Vitest + React Testing Library + MSW)

```bash
cd frontend
npm install
npm test
```

## Project structure

```
├── backend/          Express API, Prisma, Mongoose
├── frontend/         React + Vite UI
└── docker-compose.yml
```
