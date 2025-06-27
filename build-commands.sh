#!/bin/bash

# Build script for Laravel + React project

echo "Building the application..."

# Install PHP dependencies
echo "Installing PHP dependencies..."
composer install

# Install JavaScript dependencies
echo "Installing JavaScript dependencies..."
npm install

# Build frontend assets with Vite
echo "Building frontend assets..."
npm run build

echo "Build complete!"
echo ""
echo "To run the application:"
echo "1. Configure your database in .env file"
echo "2. Run migrations: php artisan migrate"
echo "3. Seed the database: php artisan db:seed"
echo "4. Start the server: php artisan serve"
echo ""
echo "Visit http://localhost:8000 in your browser"
