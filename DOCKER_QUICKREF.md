# Docker Quick Reference

Quick reference for common Docker commands for TheMovingDB.

## Development Mode

```bash
# Start (with logs)
docker compose up

# Start (in background)
docker compose up -d

# Stop
docker compose down

# Restart
docker compose restart

# View logs (all services)
docker compose logs -f

# View logs (specific service)
docker compose logs -f backend
docker compose logs -f frontend

# Rebuild
docker compose build

# Rebuild and restart
docker compose up --build

# Check status
docker compose ps

# Execute command in container
docker compose exec backend sh
docker compose exec frontend sh
```

## Production Mode

```bash
# Start
docker compose -f docker-compose.prod.yml up -d

# Stop
docker compose -f docker-compose.prod.yml down

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build

# Check health status
docker compose -f docker-compose.prod.yml ps
```

## Database Management

```bash
# Backup database
docker compose cp backend:/app/data/moving.db ./backup-moving.db

# Restore database
docker compose cp ./backup-moving.db backend:/app/data/moving.db

# Access database container
docker compose exec backend sh
cd /app/data
ls -la
```

## Troubleshooting

```bash
# View container stats (CPU, memory)
docker stats

# Check disk usage
docker system df

# Remove stopped containers
docker compose down

# Remove all (including volumes)
docker compose down -v

# Rebuild from scratch
docker compose build --no-cache

# Restart specific service
docker compose restart backend
```

## Cleanup

```bash
# Stop and remove containers
docker compose down

# Stop and remove containers + volumes
docker compose down -v

# Remove images
docker rmi themovingdb-backend themovingdb-frontend

# Prune unused resources
docker system prune

# Prune everything (careful!)
docker system prune -a --volumes
```

## Environment Variables

```bash
# Check environment in container
docker compose exec backend env
docker compose exec frontend env

# Override environment variable
PORT=8080 docker compose up
```

## Tips

- Use `docker compose` (v2) instead of `docker-compose` (v1)
- Add `-d` flag to run in background (detached mode)
- Add `-f` flag to specify compose file
- Use `--build` to rebuild images before starting
- Use `--no-cache` to rebuild from scratch
- Use `docker compose logs -f` to follow logs in real-time
