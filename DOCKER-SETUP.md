# Docker Setup Instructions

## What's Included

I've set up your project with Docker and SQLite as requested. Here's what I've created:

1. **Dockerfile** - Contains the PHP and Apache configuration
2. **docker compose.yml** - Sets up the Laravel and Node.js containers
3. **.env.docker** - Docker-specific environment configuration with SQLite
4. **docker-entrypoint.sh** - Script that runs on container startup
5. **docker.sh** - Helper script for common Docker operations
6. Docker configuration files in the docker/ directory

## How to Use It

1. Make the helper script executable:
   ```bash
   chmod +x ./docker.sh
   ```

2. Start the application:
   ```bash
   ./docker.sh start
   ```

3. The application will be available at http://localhost:8000

## Other Useful Commands

```bash
# View container logs
./docker.sh logs

# Stop the containers
./docker.sh stop

# Access the app container shell
./docker.sh shell

# Run artisan commands
./docker.sh artisan route:list

# Run npm commands
./docker.sh npm run dev

# Rebuild the containers (after Dockerfile changes)
./docker.sh build
```

## Database

- SQLite database file will be created at `/var/www/html/database/database.sqlite` inside the Docker container
- The database will be automatically migrated and seeded during container startup
- You can run migrations manually with `./docker.sh migrate`
- You can seed the database manually with `./docker.sh seed`

## Development Workflow

1. Edit files on your local machine
2. The changes will be reflected in the containers
3. For frontend development, the Vite development server will automatically refresh

## Troubleshooting

- If you encounter permission issues with the SQLite database, you can run:
  ```bash
  ./docker.sh shell
  chown -R www-data:www-data database/database.sqlite storage/
  ```

- If the containers aren't starting correctly, check the logs:
  ```bash
  ./docker.sh logs
  ```

- If you need to recreate the containers from scratch:
  ```bash
  ./docker.sh stop
  docker compose rm -f
  ./docker.sh build
  ./docker.sh start
  ```
