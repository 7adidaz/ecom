# E-commerce System

A full-stack e-commerce system with Laravel RESTful API backend and React.js frontend.

## Quick Start Guide

### Clone the Repository

```bash
git clone https://github.com/7adidaz/ecom
cd php-js
```

### Running with Docker (Recommended)

1. Create a copy of your .env file:

```bash
cp .env.example .env
```

2. Start Docker containers:

```bash
# Make the script executable
chmod +x ./docker.sh

# Start the containers
./docker.sh start
```

That's it! The application will be available at [http://localhost:8000](http://localhost:8000)

### Running without Docker

1. Install dependencies:

```bash
composer install
npm install
```

2. Setup environment:

```bash
cp .env.example .env
php artisan key:generate
```

3. Configure SQLite database:

```bash
touch database/database.sqlite
```

4. Update your .env file:

```
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite
```

5. Setup database and start servers:

```bash
php artisan migrate
php artisan db:seed
php artisan serve
```

In a separate terminal:

```bash
npm run dev
```

## Login Credentials

Once the application is running, you can log in with the following credentials:

### Admin User

- Email: `admin@example.com`
- Password: `password`

### Test User

- Email: `test@example.com`
- Password: `password`

Visit [http://localhost:8000](http://localhost:8000) in your browser to access the application.
