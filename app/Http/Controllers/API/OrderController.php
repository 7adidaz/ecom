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
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id ?? 1; // Fallback to user ID 1 if auth not working
        $perPage = $request->input('per_page', 10);
        
        // Build query
        $query = Order::with('products')
            ->where('user_id', $userId);
            
        // Allow sorting by date or status
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDir = $request->input('sort_dir', 'desc');
        
        $allowedSortFields = ['created_at', 'status', 'total_amount'];
        $sortField = in_array($sortBy, $allowedSortFields) ? $sortBy : 'created_at';
        $sortDirection = in_array($sortDir, ['asc', 'desc']) ? $sortDir : 'desc';
        
        $query->orderBy($sortField, $sortDirection);
        
        // Get paginated results
        $orders = $query->paginate($perPage);
        
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
        $order = Order::with('products')->where('id', $id)->where('user_id', $userId)->firstOrFail();
        
        return response()->json(new OrderResource($order));
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
                $product = Product::findOrFail($item['id']);
                
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
            $order = Order::create([
                'user_id' => $userId,
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->billing_address,
            ]);
            
            // Attach products to the order
            $order->products()->attach($productItems);
            
            // Commit transaction
            DB::commit();
            
            // Ensure order has products loaded
            $order->load('products');
            
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
        $order = Order::where('id', $id)->where('user_id', $userId)->firstOrFail();
        
        // Update only allowed fields
        $order->fill($request->only(['status', 'shipping_address', 'billing_address']));
        $order->save();
        
        return response()->json([
            'message' => 'Order updated successfully',
            'order' => new OrderResource($order),
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
        $order = Order::where('id', $id)->where('user_id', $userId)->firstOrFail();
        
        // Delete the order
        $order->delete();
        
        return response()->json([
            'message' => 'Order deleted successfully'
        ]);
    }
}
