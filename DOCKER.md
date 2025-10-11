# Docker Deployment Guide

This document provides detailed instructions for running TheMovingDB using Docker.

- For testing and verification, see [DOCKER_TESTING.md](DOCKER_TESTING.md)
- For quick command reference, see [DOCKER_QUICKREF.md](DOCKER_QUICKREF.md)

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or later)
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop)

## Quick Start

### Using the Setup Script

The easiest way to get started:

```bash
./docker-setup.sh
```

Follow the prompts to choose between development or production mode.

### Manual Setup

#### Development Mode (Recommended for Development)

Start the application with hot reload:

```bash
docker compose up
```

Or run in detached mode:

```bash
docker compose up -d
```

**Features:**
- Backend auto-restarts on code changes (Bun's `--watch` flag)
- Frontend has Hot Module Replacement (Vite HMR)
- Source code is mounted as volumes
- Database persists in a Docker volume

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

#### Production Mode

Build and start the optimized production containers:

```bash
docker compose -f docker-compose.prod.yml up -d
```

**Features:**
- Optimized builds with multi-stage Dockerfiles
- Frontend served by nginx with gzip compression
- Smaller image sizes
- Health checks enabled
- Database persists in a Docker volume

**Access:**
- Frontend: http://localhost:80
- Backend API: http://localhost:3000/api

## Common Commands

### Development Mode

```bash
# Start services
docker compose up

# Start in background
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Rebuild images
docker compose build

# Restart a specific service
docker compose restart backend
docker compose restart frontend
```

### Production Mode

```bash
# Start services
docker compose -f docker-compose.prod.yml up -d

# Stop services
docker compose -f docker-compose.prod.yml down

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build
```

## Environment Variables

### Backend

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

### Frontend

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:3000/api)

To customize, create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:3000/api
```

## Data Persistence

The database is stored in a Docker volume named `backend-data`. This volume persists even when containers are stopped or removed.

### Backup Database

```bash
# Copy database from volume
docker compose cp backend:/app/data/moving.db ./backup-moving.db
```

### Restore Database

```bash
# Copy database to volume
docker compose cp ./backup-moving.db backend:/app/data/moving.db
```

### Delete All Data

```bash
# Stop containers and remove volumes
docker compose down -v
```

## Customization

### Changing Ports

Edit the `docker-compose.yml` or `docker-compose.prod.yml` file:

```yaml
services:
  backend:
    ports:
      - "8080:3000"  # Changed from 3000:3000
  
  frontend:
    ports:
      - "8000:5173"  # Changed from 5173:5173
```

### Custom nginx Configuration

Edit `frontend/nginx.conf` to customize the nginx server configuration for production.

### Using External Database

To use an external database instead of the SQLite file:

1. Update `backend/database.ts` to support your database
2. Add database connection environment variables
3. Remove the volume mount for the database

## Troubleshooting

### Port Already in Use

If you get a "port already in use" error:

```bash
# Check which process is using the port
lsof -i :3000
lsof -i :5173

# Stop the containers
docker compose down

# Or change the port mapping in docker-compose.yml
```

### Cannot Connect to Backend

If frontend cannot connect to backend:

1. Check backend is running: `docker compose ps`
2. Check backend logs: `docker compose logs backend`
3. Verify CORS settings in `backend/index.ts`
4. Ensure `VITE_API_BASE_URL` points to the correct backend URL

### Changes Not Reflected

**Development mode:**
- Changes should auto-reload
- If not, check volume mounts in docker-compose.yml
- Restart the container: `docker compose restart backend`

**Production mode:**
- You need to rebuild: `docker compose -f docker-compose.prod.yml up -d --build`

### Database Issues

```bash
# Check database file
docker compose exec backend ls -la /app/data/

# Access backend container
docker compose exec backend sh

# View database schema
docker compose exec backend bun run -e "import db from './database.ts'; console.log(db.query('SELECT name FROM sqlite_master WHERE type=\"table\"').all())"
```

## Architecture

### Development Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      Docker Compose (Dev)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │   Backend Container  │      │  Frontend Container  │    │
│  │  themovingdb-backend │      │ themovingdb-frontend │    │
│  │                      │      │                      │    │
│  │  Bun 1.1.38 Alpine   │      │  Node 20 Alpine      │    │
│  │  Port: 3000          │◄─────┤  Port: 5173          │    │
│  │  CMD: bun --watch    │      │  CMD: vite --host    │    │
│  │                      │      │                      │    │
│  │  Volumes:            │      │  Volumes:            │    │
│  │  - ./backend → /app  │      │  - ./frontend → /app │    │
│  │  - backend-data      │      │  - (node_modules)    │    │
│  └──────────────────────┘      └──────────────────────┘    │
│           │                              │                   │
│           │                              │                   │
│           └──────────────┬───────────────┘                   │
│                          │                                   │
│                    ┌─────▼──────┐                           │
│                    │  Volume:   │                           │
│                    │ backend-   │                           │
│                    │   data     │                           │
│                    │ (SQLite DB)│                           │
│                    └────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- **Backend**: Bun 1.1.38 (Alpine Linux) with watch mode
- **Frontend**: Node 20 (Alpine Linux) with Vite dev server
- **Hot Reload**: Source code mounted as volumes
- **Port 3000**: Backend API
- **Port 5173**: Frontend with HMR

### Production Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Compose (Prod)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │   Backend Container  │      │  Frontend Container  │    │
│  │  themovingdb-backend │      │ themovingdb-frontend │    │
│  │                      │      │                      │    │
│  │  Bun 1.1.38 Alpine   │      │  Nginx Alpine        │    │
│  │  Port: 3000          │◄─────┤  Port: 80            │    │
│  │  CMD: bun index.ts   │      │  Serving: /dist      │    │
│  │  Health Check ✓      │      │  Health Check ✓      │    │
│  │                      │      │  Gzip: ON            │    │
│  │  Volume:             │      │  Cache: Enabled      │    │
│  │  - backend-data      │      │                      │    │
│  └──────────────────────┘      └──────────────────────┘    │
│           │                                                  │
│           │                                                  │
│           └──────────────┬                                   │
│                          │                                   │
│                    ┌─────▼──────┐                           │
│                    │  Volume:   │                           │
│                    │ backend-   │                           │
│                    │   data     │                           │
│                    │ (SQLite DB)│                           │
│                    └────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- **Backend**: Bun 1.1.38 (Alpine Linux) optimized build
- **Frontend**: 
  - Build stage: Node 20 (Alpine Linux)
  - Runtime stage: nginx (Alpine Linux)
- **Optimized**: Multi-stage builds, no dev dependencies
- **Port 3000**: Backend API
- **Port 80**: Frontend (nginx)

### Network

Services communicate through Docker's internal network. Frontend connects to backend using the service name `backend` as hostname within the Docker network.

## Performance

### Development Mode

- Hot reload enabled for rapid development
- Larger image sizes (includes dev dependencies)
- Source code mounted from host

### Production Mode

- Multi-stage builds for smaller images
- No dev dependencies
- Gzip compression enabled
- Static assets cached by nginx
- Health checks for reliability

## Security Notes

1. Change default ports in production
2. Configure CORS appropriately for production
3. Use environment variables for sensitive data
4. Don't commit `.env` files
5. Regularly update base images for security patches

## Contributing

When modifying Docker configuration:

1. Test both dev and prod modes
2. Update this documentation
3. Update `.dockerignore` to exclude unnecessary files
4. Ensure images build successfully
5. Test hot reload in dev mode
