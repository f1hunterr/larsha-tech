# Larsha Tech

Company website for **Larsha Tech** — an IT services business in Bangalore offering laptop/computer repair and professional web development.

Live site: [larsha.com](https://larsha.com)  
API: [workspaceserver-production-8351.up.railway.app](https://workspaceserver-production-8351.up.railway.app/health)

## Features

- Laptop & computer repair booking with status tracking
- Free diagnosis request form
- Web development services showcase with pricing
- Service areas section (Bangalore localities)
- Job application portal with resume upload
- Admin dashboard for managing leads, bookings, and applications
- Live chat via Tawk.to
- Google Analytics 4 with real event tracking
- PWA support with offline capability
- Docker-ready for self-hosted full-stack deployment

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
  larsha-tech/   # React frontend
  server/        # Express backend API
.github/
  workflows/
    ci.yml              # Typecheck + build on every push/PR
    deploy.yml          # Deploy frontend to GitHub Pages on push to main
    update-lockfile.yml # Manually regenerate pnpm-lock.yaml
Dockerfile              # Docker image for the frontend (Nginx)
Dockerfile.api          # Docker image for the backend (Express)
docker-compose.yml      # Full-stack local dev / self-hosted deploy
nginx.conf              # Nginx config for the frontend container
vercel.json             # Vercel deploy config (frontend)
railway.toml            # Railway deploy config (backend)
```

## Pages

| Route | Description |
|---|---|
| `/` | Home — services, pricing, service areas, lead form, FAQ, contact |
| `/book-repair` | Repair booking form (submits to API) |
| `/free-diagnosis` | Free diagnosis request form |
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
| GET | `/health` | — | Health check |
| POST | `/api/leads` | — | Submit a quick lead |
| GET | `/api/leads` | Admin | List all leads |
| POST | `/api/bookings` | — | Submit a repair booking (multipart, supports photo upload) |
| GET | `/api/bookings` | Admin | List all bookings |
| PATCH | `/api/bookings/:id/status` | Admin | Update booking status |
| POST | `/api/diagnoses` | — | Submit a free diagnosis request |
| GET | `/api/diagnoses` | Admin | List all diagnosis requests |
| PATCH | `/api/diagnoses/:id/status` | Admin | Update diagnosis status |
| POST | `/api/applications` | — | Submit a job application (multipart, resume upload) |
| GET | `/api/applications` | Admin | List all applications |
| PATCH | `/api/applications/:id/status` | Admin | Update application status |
| GET | `/api/applications/:id/resume` | Admin | Download resume file |
| GET | `/admin` | Admin | Server-rendered admin dashboard |

Admin endpoints use HTTP Basic Auth. Credentials are set via environment variables (see below).

## Environment variables

### Backend (`artifacts/server`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `4000` | Port the API listens on (Railway sets this automatically) |
| `DB_PATH` | `./leads.db` | Path to the SQLite database file |
| `ADMIN_USERNAME` | `admin` | Admin login username |
| `ADMIN_PASSWORD` | *(required in production)* | Admin login password |
| `ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:5173` | Comma-separated list of allowed CORS origins |
| `NODE_ENV` | `development` | Set to `production` in deployed environments |

### Frontend (build-time)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Full URL of the backend API (e.g. `https://yourapi.railway.app`) |
| `VITE_FORMSPREE_ID` | Formspree form ID for the contact/lead form fallback |
| `BASE_PATH` | URL base path — use `/` for Vercel, `/larsha-tech/` for GitHub Pages |

## Deployment

### Vercel + Railway (recommended)

The frontend is hosted on **Vercel** and the backend on **Railway**.

**Railway (API):**
1. New project → deploy from `f1hunterr/larsha-tech` → Railway auto-detects `railway.toml`
2. Set environment variables: `ADMIN_PASSWORD`, `ADMIN_USERNAME`, `NODE_ENV=production`, `ALLOWED_ORIGINS`
3. Add a volume mounted at `/data` and set `DB_PATH=/data/leads.db`
4. Generate a public domain — this becomes your `VITE_API_URL`

**Vercel (Frontend):**
1. New project → import `f1hunterr/larsha-tech` → Vercel auto-detects `vercel.json`
2. Set environment variables: `VITE_API_URL=<Railway URL>`, `VITE_FORMSPREE_ID=<your id>`
3. Deploy → copy the Vercel URL → add it to Railway's `ALLOWED_ORIGINS`

### Docker (self-hosted, full stack)

Runs two containers:
- **web** — Nginx serving the built React frontend on port `3000`
- **api** — Express + SQLite API server (internal)

#### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on the server

> **Apple Silicon (M1/M2):** Docker runs linux/arm64 by default and is fully supported.

#### 1. Clone the repo

```bash
git clone https://github.com/f1hunterr/larsha-tech.git
cd larsha-tech
```

#### 2. Create the `.env` file

```bash
cat > .env <<EOF
ADMIN_PASSWORD=your_strong_password_here
ALLOWED_ORIGINS=http://localhost:3000
EOF
```

> The API container **refuses to start** if `ADMIN_PASSWORD` is missing — it is required, not optional.

#### 3. Start the stack

```bash
docker compose up -d --build
```

First build takes ~3–5 minutes (compiles native SQLite dependencies).  
Subsequent starts are fast — Docker caches the layers.

#### 4. Open the site

```
http://localhost:3000
```

---

#### Useful commands

| Command | Description |
|---|---|
| `docker compose up -d --build` | Build images and start in background |
| `docker compose down` | Stop and remove containers |
| `docker compose logs -f api` | Stream API logs |
| `docker compose logs -f web` | Stream Nginx logs |
| `docker compose ps` | Show running containers and their status |
| `docker compose restart api` | Restart only the API container |

#### Data persistence

Leads, bookings, and applications are stored in a SQLite database inside a Docker volume (`leads_data`). Data survives container restarts and image rebuilds.

**Backup the database:**

```bash
docker run --rm \
  -v larsha-tech_leads_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/leads-backup.tar.gz /data
```

#### Putting it behind a domain with SSL

Install [Nginx](https://nginx.org/) and [Certbot](https://certbot.eff.org/) on the host, then proxy traffic to the Docker containers:

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
    }
}
```

Then obtain an SSL certificate:

```bash
sudo certbot --nginx -d yourdomain.com
```

## CI / Workflows

| Workflow | Trigger | Description |
|---|---|---|
| `ci.yml` | Push / PR to `main` | Typecheck and full build |
| `deploy.yml` | Push to `main` | Deploy frontend to GitHub Pages |
| `update-lockfile.yml` | Manual | Regenerate `pnpm-lock.yaml` after catalog changes |
