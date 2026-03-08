<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index($apartmentId)
    {
        $apartment = Apartment::find($apartmentId);

        if (! $apartment) {
            return response()->json([
                'message' => 'Apartment not found',
            ], 404);
        }

        $reviews = Review::with('user:id,name')
            ->where('apartment_id', $apartmentId)
            ->latest()
            ->get();

        $averageRating = Review::where('apartment_id', $apartmentId)->avg('rating');

        return response()->json([
            'reviews' => $reviews,
            'average_rating' => $averageRating ? round($averageRating, 1) : null,
            'total_reviews' => $reviews->count(),
        ]);
    }

    public function store(Request $request, $apartmentId)
    {
        $apartment = Apartment::find($apartmentId);

        if (! $apartment) {
            return response()->json([
                'message' => 'Apartment not found',
            ], 404);
        }

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'max:1000'],
        ]);

        $existingReview = Review::where('apartment_id', $apartmentId)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'You have already reviewed this apartment.',
            ], 422);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'apartment_id' => $apartmentId,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return response()->json([
            'message' => 'Review added successfully',
            'review' => $review->load('user:id,name'),
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $review = Review::find($id);

        if (! $review) {
            return response()->json([
                'message' => 'Review not found',
            ], 404);
        }

        if (
            $request->user()->role !== 'admin' &&
            $review->user_id !== $request->user()->id
        ) {
            return response()->json([
                'message' => 'Forbidden',
            ], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully',
        ]);
    }
}
