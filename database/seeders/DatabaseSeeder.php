<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password')
        ]);

        // Create regular user
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password')
        ]);

        // Create products
        $products = [
            [
                'name' => 'Laptop Pro',
                'description' => 'High-performance laptop for professionals',
                'price' => 1299.99,
                'quantity_in_stock' => 50,
                'category' => 'electronics',
                'image_url' => 'https://via.placeholder.com/300x200?text=Laptop+Pro'
            ],
            [
                'name' => 'Wireless Earbuds',
                'description' => 'Premium wireless earbuds with noise cancellation',
                'price' => 149.99,
                'quantity_in_stock' => 200,
                'category' => 'electronics',
                'image_url' => 'https://via.placeholder.com/300x200?text=Wireless+Earbuds'
            ],
            [
                'name' => 'Smart Watch',
                'description' => 'Fitness tracker with heart rate monitoring',
                'price' => 199.99,
                'quantity_in_stock' => 75,
                'category' => 'electronics',
                'image_url' => 'https://via.placeholder.com/300x200?text=Smart+Watch'
            ],
            [
                'name' => 'Coffee Maker',
                'description' => 'Programmable coffee maker with 12-cup capacity',
                'price' => 49.99,
                'quantity_in_stock' => 120,
                'category' => 'home',
                'image_url' => 'https://via.placeholder.com/300x200?text=Coffee+Maker'
            ],
            [
                'name' => 'Desk Chair',
                'description' => 'Ergonomic office chair with lumbar support',
                'price' => 299.99,
                'quantity_in_stock' => 30,
                'category' => 'furniture',
                'image_url' => 'https://via.placeholder.com/300x200?text=Desk+Chair'
            ]
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}
