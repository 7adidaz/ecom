#!/bin/bash

# Copy Docker environment file
if [ ! -f .env ]; then
  cp .env.docker .env
fi

# Create SQLite database if it doesn't exist
touch database/database.sqlite
chown -R www-data:www-data database/database.sqlite

# Install PHP dependencies
composer install --no-interaction --optimize-autoloader --no-dev

# Install JavaScript dependencies
npm install

# Generate application key
php artisan key:generate --force

# Clear cache
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Run database migrations
php artisan migrate --force

# Seed the database
php artisan db:seed --force

# Build frontend assets
npm run build

# Set correct permissions
chown -R www-data:www-data storage bootstrap/cache

# Start Apache
apache2-foreground
