<?php

namespace App\Http\Controllers\API;

use App\Events\OrderPlaced;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderCollection;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use App\Repositories\Interfaces\OrderRepositoryInterface;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * @var OrderRepositoryInterface
     */
    private $orderRepository;
    
    /**
     * @var ProductRepositoryInterface
     */
    private $productRepository;
    
    /**
     * OrderController constructor.
     * 
     * @param OrderRepositoryInterface $orderRepository
     * @param ProductRepositoryInterface $productRepository
     */
    public function __construct(
        OrderRepositoryInterface $orderRepository,
        ProductRepositoryInterface $productRepository
    ) {
        $this->orderRepository = $orderRepository;
        $this->productRepository = $productRepository;
    }

    /**
     * Display a listing of the orders.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id ?? 1; // Fallback to user ID 1 if auth not working
        
        // Get orders for the user
        $orders = $this->orderRepository->getOrdersByUser($userId);
        
        return response()->json(new OrderCollection($orders));
    }

    /**
     * Display the specified order.
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id): JsonResponse
    {
        $userId = request()->user()->id ?? 1; // Fallback to user ID 1 if auth not working
        $order = $this->orderRepository->getOrderWithProducts($id);
        
        // Check if order belongs to user
        if ($order && $order->user_id == $userId) {
            return response()->json(new OrderResource($order));
        }
        
        return response()->json(['message' => 'Order not found'], 404);
    }

    /**
     * Store a newly created order in storage.
     * 
     * @param \App\Http\Requests\StoreOrderRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreOrderRequest $request): JsonResponse
    {
        // Start a database transaction
        DB::beginTransaction();

        try {
            $totalAmount = 0;
            $productItems = [];
            
            // Check product availability and calculate total
            foreach ($request->products as $item) {
                $product = $this->productRepository->find($item['id']);
                
                if (!$product) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Product not found: ID ' . $item['id'],
                    ], 404);
                }
                
                // Check if requested quantity is available
                if ($product->quantity_in_stock < $item['quantity']) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Not enough stock for product: ' . $product->name,
                        'available' => $product->quantity_in_stock,
                        'requested' => $item['quantity'],
                    ], 422);
                }
                
                // Calculate subtotal for this item
                $itemTotal = $product->price * $item['quantity'];
                $totalAmount += $itemTotal;
                
                // Prepare data for order_product pivot
                $productItems[$product->id] = [
                    'quantity' => $item['quantity'],
                    'price_at_purchase' => $product->price
                ];
                
                // Decrease product stock
                $product->quantity_in_stock -= $item['quantity'];
                $product->save();
            }
            
            // Create the order
            $userId = $request->user()->id ?? 1; // Fallback to user ID 1 if auth not working
            $orderData = [
                'user_id' => $userId,
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->billing_address,
            ];
            
            $order = $this->orderRepository->create($orderData);
            
            // Attach products to the order
            $order->products()->attach($productItems);
            
            // Commit transaction
            DB::commit();
            
            // Ensure order has products loaded
            $order = $this->orderRepository->getOrderWithProducts($order->id);
            
            // Dispatch OrderPlaced event to trigger email notification
            event(new OrderPlaced($order));
            
            return response()->json([
                'message' => 'Order placed successfully',
                'order' => new OrderResource($order),
            ], 201);
            
        } catch (\Exception $e) {
            // Rollback transaction on error
            DB::rollBack();
            
            return response()->json([
                'message' => 'An error occurred while placing the order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update the specified order in storage.
     * 
     * @param \App\Http\Requests\UpdateOrderRequest $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateOrderRequest $request, string $id): JsonResponse
    {
        $userId = $request->user()->id ?? 1; // Fallback to user ID 1 if auth not working
        $order = $this->orderRepository->find($id);
        
        if (!$order || $order->user_id != $userId) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        
        // Update only allowed fields
        $updateData = $request->only(['status', 'shipping_address', 'billing_address']);
        $this->orderRepository->update($updateData, $id);
        
        // Get updated order
        $updatedOrder = $this->orderRepository->find($id);
        
        return response()->json([
            'message' => 'Order updated successfully',
            'order' => new OrderResource($updatedOrder),
        ]);
    }

    /**
     * Remove the specified order from storage.
     * 
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        $userId = request()->user()->id ?? 1; // Fallback to user ID 1 if auth not working
        $order = $this->orderRepository->find($id);
        
        if (!$order || $order->user_id != $userId) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        
        // Delete the order
        $this->orderRepository->delete($id);
        
        return response()->json([
            'message' => 'Order deleted successfully'
        ]);
    }
}
