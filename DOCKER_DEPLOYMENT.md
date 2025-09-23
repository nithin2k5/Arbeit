# Docker Deployment Guide for Arbeit

This guide will help you deploy the Arbeit application using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10 or later)
- Docker Compose (version 2.0 or later)
- At least 4GB of available RAM
- At least 10GB of available disk space

## Project Structure

```
arbeit/
├── my-app/                 # Next.js frontend
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ...
├── springboot-backend/     # Spring Boot backend
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ...
├── docker-compose.yml      # Docker orchestration
├── docker-env-example.txt  # Environment variables template
└── DOCKER_DEPLOYMENT.md    # This file
```

## Quick Start

### 1. Environment Setup

Copy the environment template and configure your secrets:

```bash
cp docker-env-example.txt .env
```

Edit the `.env` file with your actual values:

```bash
# Required: Change these values for production
MYSQL_ROOT_PASSWORD=your_secure_mysql_root_password
MYSQL_PASSWORD=your_secure_mysql_user_password
ACCESS_TOKEN=your_super_secret_jwt_access_token_key
REFRESH_TOKEN=your_super_secret_jwt_refresh_token_key
GEMINI_API_KEY=your_actual_gemini_api_key

# Optional: Configure CORS for your domain
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 2. Build and Start Services

```bash
# Build and start all services
docker-compose up --build -d

# Or build first, then start
docker-compose build
docker-compose up -d
```

### 3. Check Service Status

```bash
# Check if all services are running
docker-compose ps

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

## Service URLs

Once deployed, your application will be available at:

- **Frontend**: http://localhost:3003
- **Backend API**: http://localhost:8080/api
- **MySQL Database**: localhost:3308

## Environment Variables

### Database Configuration
- `MYSQL_ROOT_PASSWORD`: MySQL root password
- `MYSQL_DATABASE`: Database name (default: arbeit)
- `MYSQL_USER`: MySQL user (default: arbeit_user)
- `MYSQL_PASSWORD`: MySQL user password

### JWT Configuration
- `ACCESS_TOKEN`: JWT access token secret key
- `REFRESH_TOKEN`: JWT refresh token secret key

### External Services
- `GEMINI_API_KEY`: Google Gemini AI API key

### Network Configuration
- `CORS_ALLOWED_ORIGINS`: Allowed origins for CORS (comma-separated)
- `NEXT_PUBLIC_API_URL`: API URL for frontend to connect to backend

## Docker Commands

### Managing Services

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up --build -d

# View logs
docker-compose logs -f [service_name]

# Execute commands in running containers
docker-compose exec backend bash
docker-compose exec mysql mysql -u root -p
```

### Database Management

```bash
# Access MySQL shell
docker-compose exec mysql mysql -u root -p arbeit

# Backup database
docker-compose exec mysql mysqldump -u root -p arbeit > backup.sql

# Restore database
docker-compose exec -T mysql mysql -u root -p arbeit < backup.sql
```

### File Upload Management

The backend includes a volume mount for file uploads:

```bash
# Check uploaded files
docker-compose exec backend ls -la uploads/resumes/

# Copy files to/from container
docker cp ./my-file.txt $(docker-compose ps -q backend):/app/uploads/resumes/
```

## Production Deployment

### 1. Security Considerations

- **Change all default passwords** in the `.env` file
- **Use strong JWT secrets** (at least 64 characters)
- **Configure proper CORS origins** for your domain
- **Use HTTPS** in production (configure reverse proxy)

### 2. Database Persistence

Data is persisted using Docker volumes:
- `mysql_data`: MySQL database files
- `backend_uploads`: Uploaded resume files

To backup volumes:

```bash
# Create backup directory
mkdir -p backups

# Backup MySQL data
docker run --rm -v arbeit_mysql_data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/mysql_backup.tar.gz -C /data .

# Backup uploads
docker run --rm -v arbeit_backend_uploads:/data -v $(pwd)/backups:/backup alpine tar czf /backup/uploads_backup.tar.gz -C /data .
```

### 3. Monitoring and Health Checks

All services include health checks:
- **MySQL**: Checks database connectivity
- **Backend**: HTTP health check on `/api/actuator/health`
- **Frontend**: HTTP health check on `/api/health`

### 4. Scaling

For production scaling:

```bash
# Scale backend services
docker-compose up -d --scale backend=3

# Scale frontend services
docker-compose up -d --scale frontend=2
```

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check what's using ports
   lsof -i :3000
   lsof -i :8080
   lsof -i :3306

   # Change ports in docker-compose.yml if needed
   ```

2. **Database connection issues**
   ```bash
   # Check MySQL logs
   docker-compose logs mysql

   # Verify environment variables
   docker-compose exec backend env | grep MYSQL
   ```

3. **Build failures**
   ```bash
   # Clean build cache
   docker system prune -f
   docker-compose build --no-cache
   ```

4. **Out of memory**
   ```bash
   # Increase Docker memory limit in Docker Desktop
   # Or add memory limits to docker-compose.yml
   ```

### Health Check Commands

```bash
# Check all service health
curl http://localhost:8080/api/actuator/health
curl http://localhost:3000/api/health

# Database connectivity test
docker-compose exec backend nc -z mysql 3306
```

## Development vs Production

### Development
```bash
# Run with hot reload (mount source code)
docker-compose -f docker-compose.dev.yml up
```

### Production
```bash
# Use production optimized images
docker-compose up -d
```

## Cleanup

```bash
# Stop and remove all containers
docker-compose down

# Remove volumes (WARNING: This deletes all data)
docker-compose down -v

# Clean up unused Docker resources
docker system prune -f
```

## Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify environment variables are set correctly
3. Ensure Docker has sufficient resources
4. Check network connectivity between services

For more help, refer to the main project documentation or create an issue in the repository.
