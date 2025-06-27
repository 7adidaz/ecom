<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        // Pagination parameters
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);
        
        // Sorting parameters
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDir = $request->input('sort_dir', 'desc');
        
        // Cache key based on query parameters
        $cacheKey = 'products_' . $page . '_' . $perPage . '_sort_' . $sortBy . '_' . $sortDir;
        
        // Add filters to cache key if present
        if ($request->has('search')) {
            $cacheKey .= '_search_' . $request->input('search');
        }
        if ($request->has('name')) {
            $cacheKey .= '_name_' . $request->input('name');
        }
        if ($request->has('min_price')) {
            $cacheKey .= '_min_price_' . $request->input('min_price');
        }
        if ($request->has('max_price')) {
            $cacheKey .= '_max_price_' . $request->input('max_price');
        }
        if ($request->has('category')) {
            $cacheKey .= '_category_' . $request->input('category');
        }
        
        // Return from cache if exists
        if (Cache::has($cacheKey)) {
            return response()->json(Cache::get($cacheKey));
        }
        
        // Build query
        $query = Product::query();
        
        // Global search (searches across multiple columns)
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                  ->orWhere('description', 'like', '%' . $searchTerm . '%')
                  ->orWhere('category', 'like', '%' . $searchTerm . '%');
            });
        }
        
        // Apply specific filters if they exist
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }
        
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }
        
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }
        
        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }
        
        // Apply sorting (with validation to prevent SQL injection)
        $allowedSortFields = ['name', 'price', 'category', 'quantity_in_stock', 'created_at'];
        $sortField = in_array($sortBy, $allowedSortFields) ? $sortBy : 'created_at';
        $sortDirection = in_array($sortDir, ['asc', 'desc']) ? $sortDir : 'desc';
        $query->orderBy($sortField, $sortDirection);
        
        // Get the paginated results
        $products = $query->paginate($perPage);
        
        // Store in cache for 15 minutes
        Cache::put($cacheKey, $products, now()->addMinutes(15));
        
        return response()->json($products);
    }

    /**
     * Display the specified product.
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id): JsonResponse
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    /**
     * Store a newly created product in storage.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'quantity_in_stock' => 'required|integer|min:0',
            'category' => 'nullable|string|max:100',
            'image_url' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::create($request->all());
        return response()->json($product, 201);
    }

    /**
     * Update the specified product in storage.
     * 
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'quantity_in_stock' => 'sometimes|required|integer|min:0',
            'category' => 'nullable|string|max:100',
            'image_url' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::findOrFail($id);
        $product->update($request->all());
        
        // Clear cache when a product is updated
        Cache::flush();
        
        return response()->json($product);
    }

    /**
     * Remove the specified product from storage.
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();
        
        // Clear cache when a product is removed
        Cache::flush();
        
        return response()->json(null, 204);
    }
}
