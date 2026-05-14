# Larsha Tech

Company website for **Larsha Tech** — an IT services business in Bangalore offering laptop/computer repair and professional web development.

Live site: [larsha-tech.github.io/larsha-tech](https://larsha-tech.github.io/larsha-tech/)

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, Tailwind CSS 4 |
| Routing | Wouter |
| UI | Radix UI, Lucide icons |
| Backend | Express 4, Node.js 24 |
| Database | SQLite (better-sqlite3) |
| File uploads | Multer |
| Package manager | pnpm workspaces |
| Language | TypeScript 5 |

## Project structure

```
artifacts/
  larsha-tech/   # React frontend (GitHub Pages)
  server/        # Express backend API
.github/
  workflows/
    ci.yml       # Typecheck + build on every push/PR
    deploy.yml   # Deploy frontend to GitHub Pages on push to main
Dockerfile.api   # Docker image for the backend
docker-compose.yml
nginx.conf
```

## Pages

| Route | Description |
|---|---|
| `/` | Home — services, pricing, lead form, FAQ, contact |
| `/book-repair` | Repair booking form (submits to API) |
| `/careers` | Job application form with resume upload |
| `/admin` | Admin dashboard (requires login) |

## Development

```bash
# Install dependencies
pnpm install

# Run the frontend
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/larsha-tech run dev

# Run the backend
pnpm --filter @workspace/server run dev

# Type-check all packages
pnpm run typecheck

# Build everything
PORT=3000 BASE_PATH=/ pnpm run build
```

## Backend API

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/leads` | — | Submit a quick lead |
| GET | `/api/leads` | Admin | List all leads |
| POST | `/api/bookings` | — | Submit a repair booking |
| GET | `/api/bookings` | Admin | List all bookings |
| PATCH | `/api/bookings/:id/status` | Admin | Update booking status |
| POST | `/api/applications` | — | Submit a job application |
| GET | `/api/applications` | Admin | List all applications |
| PATCH | `/api/applications/:id/status` | Admin | Update application status |
| GET | `/api/applications/:id/resume` | Admin | Download resume file |

Admin endpoints use HTTP Basic Auth. Credentials are set via environment variables (see below).

## Environment variables

### Backend (`artifacts/server`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `4000` | Port the API listens on |
| `DB_PATH` | `./leads.db` | Path to the SQLite database file |
| `ADMIN_USERNAME` | `admin` | Admin login username |
| `ADMIN_PASSWORD` | `dev-only-changeme` | Admin login password — **change in production** |

### Frontend (build-time)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Full URL of the backend API (e.g. `https://api.yourdomain.com`) |
| `BASE_PATH` | URL base path (e.g. `/larsha-tech/` for GitHub Pages) |

For the GitHub Pages deploy, set `VITE_API_URL` as a repository secret in **Settings → Secrets and variables → Actions**.

## Self-hosting the backend

The backend is packaged as a Docker image via `Dockerfile.api`.

```bash
# Build and run with docker-compose
ADMIN_PASSWORD=your-strong-password docker-compose up -d
```

The `docker-compose.yml` runs the API on port 4000 and persists the SQLite database in a named volume (`leads_data`). Put Nginx in front with SSL (certbot) and proxy `/api` to `localhost:4000`.

## CI / Deployment

- **CI** (`ci.yml`): runs typecheck and full build on every push and pull request to `main`.
- **Deploy** (`deploy.yml`): builds the frontend and deploys to GitHub Pages on every push to `main`. Requires `VITE_API_URL` to be set as a repository secret.
