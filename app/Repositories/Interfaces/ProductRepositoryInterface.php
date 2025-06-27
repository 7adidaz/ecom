<?php

namespace App\Repositories\Interfaces;

use App\Models\Product;

interface ProductRepositoryInterface extends RepositoryInterface
{
    /**
     * Get all active products
     * 
     * @return mixed
     */
    public function getActiveProducts();
}
