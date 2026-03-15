<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $favorites = Favorite::with('apartment')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($favorites);
    }

    public function store(Request $request, $apartmentId)
    {
        $apartment = Apartment::find($apartmentId);

        if (! $apartment) {
            return response()->json([
                'message' => 'Apartment not found',
            ], 404);
        }

        $existing = Favorite::where('user_id', $request->user()->id)
            ->where('apartment_id', $apartmentId)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Apartment is already in favorites',
            ], 422);
        }

        $favorite = Favorite::create([
            'user_id' => $request->user()->id,
            'apartment_id' => $apartmentId,
        ]);

        return response()->json([
            'message' => 'Added to favorites',
            'favorite' => $favorite,
        ], 201);
    }

    public function destroy(Request $request, $apartmentId)
    {
        $favorite = Favorite::where('user_id', $request->user()->id)
            ->where('apartment_id', $apartmentId)
            ->first();

        if (! $favorite) {
            return response()->json([
                'message' => 'Favorite not found',
            ], 404);
        }

        $favorite->delete();

        return response()->json([
            'message' => 'Removed from favorites',
        ]);
    }

    public function check(Request $request, $apartmentId)
    {
        $isFavorite = Favorite::where('user_id', $request->user()->id)
            ->where('apartment_id', $apartmentId)
            ->exists();

        return response()->json([
            'is_favorite' => $isFavorite,
        ]);
    }
}
