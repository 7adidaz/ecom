<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendOrderPlacedNotification implements ShouldQueue
{
    use InteractsWithQueue;
    
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(OrderPlaced $event): void
    {
        // In a real application, we would send an email notification here
        // For this task, we'll just log the notification
        
        $order = $event->order;
        $products = $order->products;
        $user = $order->user;
        
        $productList = $products->map(function($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'quantity' => $product->pivot->quantity,
                'price' => $product->pivot->price_at_purchase
            ];
        });
        
        $message = "New order placed! Order ID: {$order->id}, Customer: {$user->name}, Total Amount: \${$order->total_amount}";
        
        // Log the notification (simulating email sending to admin)
        Log::info("ADMIN NOTIFICATION: " . $message, [
            'order_id' => $order->id,
            'user_id' => $order->user_id,
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'products' => $productList->toArray(),
            'total_items' => $products->sum('pivot.quantity'),
            'total_amount' => $order->total_amount,
            'shipping_address' => $order->shipping_address,
            'billing_address' => $order->billing_address,
            'status' => $order->status,
            'created_at' => $order->created_at->format('Y-m-d H:i:s')
        ]);
    }
}
