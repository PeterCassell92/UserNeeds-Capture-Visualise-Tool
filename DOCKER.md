# Docker Setup Guide

This guide covers running the User Needs Visualiser with Docker Compose.

## Quick Start

```bash
# Start the application
docker-compose up -d

# View at http://localhost:3000
```

That's it! The application will:
- Build both backend and frontend images
- Start both services
- Auto-create `data.json` if it doesn't exist
- Be ready at http://localhost:3000

## Docker Architecture

### Services

1. **Backend** (FastAPI)
   - Port: 8000 (exposed for direct API access)
   - Health check: HTTP GET to `/`
   - Data persistence: Volume mounts for data files

2. **Frontend** (React + Nginx)
   - Port: 3000 (mapped from container port 80)
   - Depends on backend health check
   - Proxies `/api` requests to backend service

### Volumes

Data files are mounted as volumes for persistence:
- `./data.json` → `/app/data.json` (read-write)
- `./data.demomode.json` → `/app/data.demomode.json` (read-write)
- `./data.example.json` → `/app/data.example.json` (read-only)
- `./data.template.json` → `/app/data.template.json` (read-only)

This ensures your data persists even when containers are stopped or rebuilt.

## Common Commands

### Starting & Stopping

```bash
# Start in detached mode
docker-compose up -d

# Start with logs visible
docker-compose up

# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

### Logs

```bash
# View all logs
docker-compose logs

# Follow logs (real-time)
docker-compose logs -f

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
```

### Rebuilding

```bash
# Rebuild images after code changes
docker-compose build

# Rebuild and restart
docker-compose up -d --build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend
```

### Container Management

```bash
# List running containers
docker-compose ps

# Restart a service
docker-compose restart backend

# Execute command in container
docker-compose exec backend python --version
docker-compose exec frontend sh

# View container resource usage
docker stats
```

## Development Workflow

### Making Code Changes

**Backend changes:**
1. Edit files in `backend/`
2. Rebuild: `docker-compose build backend`
3. Restart: `docker-compose restart backend`

**Frontend changes:**
1. Edit files in `frontend/src/`
2. Rebuild: `docker-compose build frontend`
3. Restart: `docker-compose restart frontend`

### Live Reload (Optional)

For development with live reload, modify `docker-compose.yml` to add volume mounts:

```yaml
services:
  backend:
    volumes:
      - ./backend:/app
      # ... other volumes

  frontend:
    volumes:
      - ./frontend/src:/app/src
      # ... other volumes
```

Then use `docker-compose up` (without `-d`) to see logs in real-time.

## Troubleshooting

### Port Already in Use

If port 3000 or 8000 is already in use:

```bash
# Stop other services using those ports, or modify docker-compose.yml
# Change the port mapping:
ports:
  - "8080:3000"  # Use port 8080 instead of 3000
```

### Backend Won't Start

```bash
# Check backend logs
docker-compose logs backend

# Common issues:
# - Missing requirements.txt
# - Python syntax errors
# - Port conflicts
```

### Frontend Won't Start

```bash
# Check frontend logs
docker-compose logs frontend

# Common issues:
# - Build failures (check package.json)
# - Nginx configuration errors
# - Backend not healthy
```

### Data Not Persisting

Make sure data files exist in project root:
```bash
ls -la data*.json

# If missing, create them:
touch data.json data.demomode.json
```

### Complete Reset

```bash
# Stop everything
docker-compose down

# Remove all containers, networks, and images
docker-compose down --rmi all

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

## Production Deployment

For production deployment:

1. **Set environment variables** (create `.env` file from `.env.example`)
2. **Use proper secrets management** (don't commit `.env`)
3. **Enable HTTPS** (add TLS certificates to nginx)
4. **Use proper database** (consider PostgreSQL instead of JSON files)
5. **Set up monitoring** (add health check endpoints)
6. **Configure backups** (automate data.json backups)

Example production docker-compose additions:

```yaml
services:
  frontend:
    environment:
      - NODE_ENV=production
    restart: always

  backend:
    environment:
      - PYTHONOPTIMIZE=1
    restart: always
```

## Advanced Configuration

### Custom Network

```bash
# Create custom network
docker network create user-needs-net

# Update docker-compose.yml to use it
networks:
  user-needs-network:
    external:
      name: user-needs-net
```

### Resource Limits

Add to docker-compose.yml:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

### Health Checks

Health checks are already configured. To test manually:

```bash
# Backend health check
curl http://localhost:8000/

# Frontend health check
curl http://localhost:3000/
```

## Files Created

- `docker-compose.yml` - Multi-service orchestration
- `backend/Dockerfile` - Backend container image
- `backend/.dockerignore` - Backend build exclusions
- `frontend/Dockerfile` - Frontend container image (multi-stage)
- `frontend/.dockerignore` - Frontend build exclusions
- `frontend/nginx.conf` - Nginx configuration for SPA + API proxy
- `.env.example` - Environment variables template

## Next Steps

- See [README.md](README.md) for feature documentation
- See [CLAUDE.md](CLAUDE.md) for development guide
- Access the app at http://localhost:3000
- API docs at http://localhost:8000/docs
