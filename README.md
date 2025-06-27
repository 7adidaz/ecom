# E-commerce System

A full-stack e-commerce system with Laravel RESTful API backend and React.js frontend.

## Time Tracking

- Estimated time: X hours (Please fill this in before starting)
- Actual time taken: X hours (Please fill this in upon completion)

## Features

### Backend (Laravel)

- RESTful API with Laravel
- Authentication with Laravel Sanctum
- Products CRUD with filtering, pagination, and caching
- Orders management with validation, stock checks, and notifications
- Many-to-many relationship between products and orders

### Frontend (React with Vite)

- Modern UI with Material UI components
- User authentication (login/register)
- Products browsing with filtering and pagination
- Cart management
- Order placement and tracking

## API Documentation

### Authentication Endpoints

- `POST /api/register` - Register a new user
  - Body: `{ "name": "string", "email": "string", "password": "string", "password_confirmation": "string" }`
  - Response: User data with access token

- `POST /api/login` - Login and get access token
  - Body: `{ "email": "string", "password": "string" }`
  - Response: User data with access token

- `GET /api/user` - Get authenticated user information
  - Headers: `Authorization: Bearer {token}`
  - Response: User data

- `POST /api/logout` - Logout and invalidate token
  - Headers: `Authorization: Bearer {token}`
  - Response: Success message

### Product Endpoints

- `GET /api/products` - List all products with pagination and filtering
  - Query parameters:
    - `page`: Page number
    - `per_page`: Items per page
    - `name`: Filter by name (partial match)
    - `min_price`: Filter by minimum price
    - `max_price`: Filter by maximum price
    - `category`: Filter by category
  - Response: Paginated products data

- `GET /api/products/{id}` - Get detailed product information
  - Response: Product data

### Order Endpoints (Protected)

- `GET /api/orders` - List all orders for the authenticated user
  - Headers: `Authorization: Bearer {token}`
  - Response: User's orders

- `POST /api/orders` - Place a new order
  - Headers: `Authorization: Bearer {token}`
  - Body:
  
    ```json
    { 
      "products": [
        { "id": 1, "quantity": 2 }, 
        { "id": 3, "quantity": 1 }
      ],
      "shipping_address": "string",
      "billing_address": "string"
    }
    ```
    
  - Response: Order confirmation with ID and total amount

- `GET /api/orders/{id}` - Get detailed order information
  - Headers: `Authorization: Bearer {token}`
  - Response: Order details with products, quantities, and total

## Requirements

- PHP 8.1 or higher
- Composer
- Node.js and npm
- MySQL or SQLite

## Installation

### Using Docker (Recommended)

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd php-js
   ```

2. Create a copy of your .env file

   ```bash
   cp .env.example .env
   ```

3. Use the provided helper script to start Docker containers

   ```bash
   ./docker.sh
   ```

   This will build the Docker images, start the containers, and run the necessary setup commands.

### Manual Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd php-js
   ```

2. Install PHP dependencies

   ```bash
   composer install
   ```

3. Install JavaScript dependencies

   ```bash
   npm install
   ```

4. Create a copy of your .env file

   ```bash
   cp .env.example .env
   ```

5. Generate an app encryption key

   ```bash
   php artisan key:generate
   ```

6. Configure your database in .env file

   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=ecommerce
   DB_USERNAME=root
   DB_PASSWORD=
   ```

   Or for SQLite (simpler for testing):

   ```env
   DB_CONNECTION=sqlite
   DB_DATABASE=/absolute/path/to/database/database.sqlite
   ```

   Then create the SQLite database:

   ```bash
   touch database/database.sqlite
   ```

7. Run database migrations

   ```bash
   php artisan migrate
   ```

8. Seed the database (optional)

   ```bash
   php artisan db:seed
   ```

9. Start the development server

   ```bash
   npm run dev
   ```

   In a separate terminal:

   ```bash
   php artisan serve
   ```

Visit [http://localhost:8000](http://localhost:8000) in your browser.

## Authentication Flow

1. **Registration**: Users can register using the `/api/register` endpoint, providing their name, email, and password.

2. **Login**: After registration, users can log in using the `/api/login` endpoint, which returns an access token.

3. **Authorization**: The access token should be included in the `Authorization` header for all protected routes.
   
   ```
   Authorization: Bearer {your_token}
   ```

4. **Protected Endpoints**: All order-related endpoints require authentication. The system uses Laravel Sanctum to validate tokens.

5. **Logout**: Users can invalidate their tokens using the `/api/logout` endpoint.

1. Clone the repository

```bash
git clone <repository-url>
cd php-js
```

2. Create a copy of your .env file

```bash
cp .env.example .env
```

3. Use the provided helper script to start Docker containers

```bash
# Make the script executable
chmod +x ./docker.sh

# Start the containers
./docker.sh start
```

That's it! The application will be available at [http://localhost:8000](http://localhost:8000)

The helper script provides additional commands:
```bash
./docker.sh {start|stop|restart|build|migrate|seed|logs|shell|npm|artisan}
```

### Manual Installation

1. Clone the repository

```bash
git clone <repository-url>
cd php-js
```

2. Install PHP dependencies

```bash
composer install
```

3. Install JavaScript dependencies

```bash
npm install
```

4. Create a copy of your .env file

```bash
cp .env.example .env
```

5. Generate an app encryption key

```bash
php artisan key:generate
```

6. Configure your database in .env file

For SQLite:
```
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite
```
Create the SQLite file:
```bash
touch database/database.sqlite
```

For MySQL:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

7. Run database migrations

```bash
php artisan migrate
```

8. Seed the database (optional)

```bash
php artisan db:seed
```

9. Start the development server

```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite development server
npm run dev
```

Visit http://localhost:8000 in your browser.

## API Documentation

### Authentication Endpoints

#### Register a new user
```
POST /api/register
```
Parameters:
- name (required): User's full name
- email (required): User's email
- password (required): User's password
- password_confirmation (required): Password confirmation

#### Login
```
POST /api/login
```
Parameters:
- email (required): User's email
- password (required): User's password

#### Logout
```
POST /api/logout
```
Authentication: Bearer token required

#### Current user
```
GET /api/user
```
Authentication: Bearer token required

### Product Endpoints

#### List all products
```
GET /api/products
```
Query parameters:
- page (optional): Page number for pagination
- per_page (optional): Items per page
- category (optional): Filter products by category
- min_price (optional): Filter products by minimum price
- max_price (optional): Filter products by maximum price
- search (optional): Search term for product name or description

#### Get a single product
```
GET /api/products/{id}
```

#### Create a product (Admin only)
```
POST /api/products
```
Parameters:
- name (required): Product name
- description (optional): Product description
- price (required): Product price
- quantity_in_stock (required): Available quantity
- category (optional): Product category
- image_url (optional): Product image URL

#### Update a product (Admin only)
```
PUT /api/products/{id}
```
Parameters: same as create

#### Delete a product (Admin only)
```
DELETE /api/products/{id}
```

### Order Endpoints

#### List user orders
```
GET /api/orders
```
Authentication: Bearer token required

#### Create a new order
```
POST /api/orders
```
Authentication: Bearer token required
Parameters:
- products (required): Array of products with their quantities:
  ```json
  [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 3,
      "quantity": 1
    }
  ]
  ```
- shipping_address (required): Shipping address
- billing_address (optional): Billing address (defaults to shipping address)

#### Get order details
```
GET /api/orders/{id}
```
Authentication: Bearer token required

## Directory Structure

- `/app/Models`: Database models (Product, Order)
- `/app/Http/Controllers/API`: API controllers
- `/app/Events`: Events (OrderPlaced)
- `/app/Listeners`: Event listeners (SendOrderPlacedNotification)
- `/database/migrations`: Database migrations
- `/routes/api.php`: API routes
- `/resources/js`: React frontend application
  - `/components`: Reusable UI components
  - `/pages`: Page components
  - `/contexts`: React contexts
  - `/services`: API services

## License

This project is licensed under the MIT License.

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
