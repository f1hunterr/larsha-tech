# Larsha Tech

Company website for **Larsha Tech** — an IT services business in Bangalore offering laptop/computer repair and professional web development.

Live site: [f1hunterr.github.io/larsha-tech](https://f1hunterr.github.io/larsha-tech/)

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

## Docker Deploy (self-hosted, full stack)

Runs two containers:
- **web** — Nginx serving the built React frontend on port `3000`
- **api** — Express + SQLite API server (internal, port `4000`)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on the server

### 1. Clone the repo

```bash
git clone https://github.com/f1hunterr/larsha-tech.git
cd larsha-tech
```

### 2. Create the `.env` file

```bash
cat > .env <<EOF
ADMIN_PASSWORD=your_strong_password_here
EOF
```

> The API container **refuses to start** if `ADMIN_PASSWORD` is missing — it is required, not optional.

### 3. Start the stack

```bash
docker compose up -d --build
```

First build takes ~3–5 minutes (compiles native SQLite dependencies).  
Subsequent starts are fast — Docker caches the layers.

### 4. Open the site

```
http://your-server-ip:3000
```

The frontend communicates with the API automatically — no extra config needed.

---

### Useful commands

| Command | Description |
|---|---|
| `docker compose up -d --build` | Build images and start in background |
| `docker compose down` | Stop and remove containers |
| `docker compose logs -f api` | Stream API logs |
| `docker compose logs -f web` | Stream Nginx logs |
| `docker compose ps` | Show running containers and their status |
| `docker compose restart api` | Restart only the API container |

### Data persistence

Leads, bookings, and applications are stored in a SQLite database inside a Docker volume (`leads_data`). Data survives container restarts and image rebuilds.

**Backup the database:**

```bash
docker run --rm \
  -v larsha-tech_leads_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/leads-backup.tar.gz /data
```

### Putting it behind a domain with SSL

Install [Nginx](https://nginx.org/) and [Certbot](https://certbot.eff.org/) on the host, then proxy traffic to the Docker containers:

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:4000;
    }
}
```

Then obtain an SSL certificate:

```bash
sudo certbot --nginx -d yourdomain.com
```

## CI / Deployment

- **CI** (`ci.yml`): runs typecheck and full build on every push and pull request to `main`.
- **Deploy** (`deploy.yml`): builds the frontend and deploys to GitHub Pages on every push to `main`. Requires `VITE_API_URL` to be set as a repository secret.
- **Update lockfile** (`update-lockfile.yml`): manually triggered workflow to regenerate `pnpm-lock.yaml` after dependency catalog changes.
