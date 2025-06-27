<?php

namespace App\Repositories\Interfaces;

use App\Models\Order;

interface OrderRepositoryInterface extends RepositoryInterface
{
    /**
     * Get orders for a specific user
     * 
     * @param int $userId
     * @return mixed
     */
    public function getOrdersByUser($userId);

    /**
     * Get order with its products
     * 
     * @param int $id
     * @return mixed
     */
    public function getOrderWithProducts($id);
}
