# Docker Testing Guide

This guide helps you verify that the Docker setup is working correctly.

## Prerequisites

- Docker and Docker Compose installed
- No other services running on ports 3000, 5173, or 80

## Testing Development Mode

### 1. Build and Start Services

```bash
docker compose up
```

### 2. Verify Services are Running

In a new terminal:

```bash
# Check running containers
docker compose ps

# Should show both backend and frontend as "running"
```

### 3. Test Backend API

```bash
# Health check
curl http://localhost:3000/api/dashboard

# Should return JSON with dashboard stats (initially empty)
```

### 4. Test Frontend

Open your browser to http://localhost:5173

You should see:
- The Moving DB dashboard
- Three tabs: Dashboard, Boxes, Items
- Empty state messages (no data yet)

### 5. Test Hot Reload

**Backend hot reload:**

1. Edit `backend/index.ts` - add a console.log statement
2. Save the file
3. Watch the terminal - Bun should automatically restart the server
4. You should see your console.log in the output

**Frontend hot reload:**

1. Edit `frontend/src/App.tsx` - change the header text
2. Save the file
3. The browser should automatically update without refresh

### 6. Stop Services

```bash
docker compose down
```

## Testing Production Mode

### 1. Build and Start Services

```bash
docker compose -f docker-compose.prod.yml up -d
```

### 2. Verify Services are Running

```bash
docker compose -f docker-compose.prod.yml ps

# Both services should show as "running" with "healthy" status after a minute
```

### 3. Check Health Status

```bash
# Wait a minute for health checks to complete
docker compose -f docker-compose.prod.yml ps

# Status should show "(healthy)" next to service names
```

### 4. Test Backend API

```bash
curl http://localhost:3000/api/dashboard
```

### 5. Test Frontend

Open your browser to http://localhost

You should see the same interface, but served by Bun.serve() on port 80.

### 6. Test Production Features

**Static file serving:**
```bash
# Test that static assets are served correctly
curl -I http://localhost
# Should return 200 OK with HTML content

# Test asset files
curl -I http://localhost/assets/index.js
# Should return 200 OK
```

### 7. View Logs

```bash
# All logs
docker compose -f docker-compose.prod.yml logs -f

# Just backend
docker compose -f docker-compose.prod.yml logs -f backend

# Just frontend
docker compose -f docker-compose.prod.yml logs -f frontend
```

### 8. Stop Services

```bash
docker compose -f docker-compose.prod.yml down
```

## Testing Data Persistence

### 1. Create Some Data

1. Start dev mode: `docker compose up -d`
2. Open http://localhost:5173
3. Create a box and some items
4. Note the data you created

### 2. Restart Services

```bash
docker compose restart
```

### 3. Verify Data Persists

Refresh the browser - your data should still be there.

### 4. Stop and Remove Containers

```bash
docker compose down
```

### 5. Start Again

```bash
docker compose up -d
```

Your data should still be present because it's stored in the Docker volume.

### 6. Clean Up

```bash
# Remove containers and volumes
docker compose down -v
```

## Common Issues

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Stop conflicting service or change port in docker-compose.yml
```

### Build Fails

```bash
# Clean build
docker compose build --no-cache

# Check Dockerfile syntax
docker compose config
```

### Cannot Connect to Backend

```bash
# Check backend logs
docker compose logs backend

# Verify backend is running
docker compose ps

# Test API directly
curl http://localhost:3000/api/dashboard
```

### Hot Reload Not Working

**Development mode only:**

1. Verify volumes are mounted: `docker compose config`
2. Check file permissions
3. Restart the service: `docker compose restart backend`

## Performance Testing

### Development Mode

```bash
# Check resource usage
docker stats

# Backend and frontend will use more resources due to dev tools
```

### Production Mode

```bash
# Check image sizes
docker images | grep themovingdb

# Production images should be smaller than dev images
```

## Security Testing

### Check for Exposed Secrets

```bash
# Make sure no secrets in images
docker compose -f docker-compose.prod.yml exec backend env | grep -i key
docker compose -f docker-compose.prod.yml exec backend env | grep -i secret
```

### Verify CORS Settings

```bash
# Test CORS from different origin
curl -H "Origin: http://example.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3000/api/boxes
```

## Cleanup

### Remove All Images

```bash
docker compose down
docker compose -f docker-compose.prod.yml down
docker rmi themovingdb-backend-dev themovingdb-frontend-dev
docker rmi themovingdb-backend-prod themovingdb-frontend-prod
```

### Remove All Volumes

```bash
docker volume rm themovingdb_backend-data
```

### Complete Cleanup

```bash
docker system prune -a --volumes
# WARNING: This removes ALL unused Docker resources
```

## Success Criteria

✅ All services start without errors
✅ Backend API responds to requests
✅ Frontend loads in browser
✅ Hot reload works in dev mode
✅ Data persists across restarts
✅ Health checks pass in prod mode
✅ No security warnings or exposed secrets
