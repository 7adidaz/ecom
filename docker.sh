#!/bin/bash

# Docker helper script for the e-commerce project

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

case "$1" in
  start)
    echo -e "${GREEN}Starting Docker containers...${NC}"
    docker compose up -d
    echo -e "${GREEN}Containers started. Application is available at:${NC}"
    echo -e "${YELLOW}http://localhost:8000${NC}"
    ;;
    
  stop)
    echo -e "${GREEN}Stopping Docker containers...${NC}"
    docker compose down
    echo -e "${GREEN}Containers stopped.${NC}"
    ;;
    
  restart)
    echo -e "${GREEN}Restarting Docker containers...${NC}"
    docker compose down
    docker compose up -d
    echo -e "${GREEN}Containers restarted. Application is available at:${NC}"
    echo -e "${YELLOW}http://localhost:8000${NC}"
    ;;
    
  build)
    echo -e "${GREEN}Building Docker containers...${NC}"
    docker compose build
    echo -e "${GREEN}Build completed. Start containers with:${NC}"
    echo -e "${YELLOW}./docker.sh start${NC}"
    ;;
    
  migrate)
    echo -e "${GREEN}Running database migrations...${NC}"
    docker compose exec app php artisan migrate
    echo -e "${GREEN}Migrations complete.${NC}"
    ;;
    
  seed)
    echo -e "${GREEN}Seeding the database...${NC}"
    docker compose exec app php artisan db:seed
    echo -e "${GREEN}Seeding complete.${NC}"
    ;;
    
  logs)
    echo -e "${GREEN}Showing container logs...${NC}"
    docker compose logs -f
    ;;
    
  shell)
    echo -e "${GREEN}Opening shell in the app container...${NC}"
    docker compose exec app /bin/bash
    ;;
    
  npm)
    echo -e "${GREEN}Running npm command...${NC}"
    shift
    docker compose exec nodejs npm $@
    ;;
    
  artisan)
    echo -e "${GREEN}Running artisan command...${NC}"
    shift
    docker compose exec app php artisan $@
    ;;
    
  *)
    echo -e "${GREEN}Laravel + React Docker Helper${NC}"
    echo -e "Usage: $0 {start|stop|restart|build|migrate|seed|logs|shell|npm|artisan}"
    echo ""
    echo "Commands:"
    echo "  start     - Start the containers"
    echo "  stop      - Stop the containers"
    echo "  restart   - Restart the containers"
    echo "  build     - Rebuild the containers"
    echo "  migrate   - Run database migrations"
    echo "  seed      - Seed the database"
    echo "  logs      - View container logs"
    echo "  shell     - Open shell in the app container"
    echo "  npm       - Run npm commands (e.g. ./docker.sh npm install)"
    echo "  artisan   - Run artisan commands (e.g. ./docker.sh artisan route:list)"
    exit 1
    ;;
esac

exit 0
