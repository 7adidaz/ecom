<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->whenNotNull($this->description),
            'price_at_purchase' => $this->pivot->price_at_purchase,
            'quantity' => $this->pivot->quantity,
            'subtotal' => $this->pivot->price_at_purchase * $this->pivot->quantity,
            'category' => $this->whenNotNull($this->category),
            'image_url' => $this->whenNotNull($this->image_url),
        ];
    }
}
