<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TestController extends Controller
{
    /**
     * Simple test endpoint.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function test(): JsonResponse
    {
        return response()->json([
            'message' => 'API is working correctly',
            'timestamp' => now()->toDateTimeString()
        ]);
    }
}
