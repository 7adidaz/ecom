<?php

namespace App\Repositories;

use App\Models\Order;
use App\Repositories\Interfaces\OrderRepositoryInterface;

class OrderRepository extends BaseRepository implements OrderRepositoryInterface
{
    /**
     * OrderRepository constructor.
     * 
     * @param Order $model
     */
    public function __construct(Order $model)
    {
        parent::__construct($model);
    }

    /**
     * Get orders for a specific user
     * 
     * @param int $userId
     * @return mixed
     */
    public function getOrdersByUser($userId)
    {
        return $this->model->where('user_id', $userId)->get();
    }

    /**
     * Get order with its products
     * 
     * @param int $id
     * @return mixed
     */
    public function getOrderWithProducts($id)
    {
        return $this->model->with('products')->find($id);
    }
}
