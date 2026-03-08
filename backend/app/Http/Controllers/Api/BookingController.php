<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with([
            'user:id,name,email',
            'apartment:id,title,location,address,price_per_night,price_per_month,rental_type'
        ])->latest();

        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        }

        $bookings = $query->paginate(10);

        return response()->json($bookings);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'apartment_id' => ['required', 'exists:apartments,id'],
            'booking_type' => ['required', 'in:nightly,monthly'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['required', 'date', 'after:start_date'],
        ]);

        $apartment = Apartment::findOrFail($validated['apartment_id']);

        if (! $apartment->is_available) {
            return response()->json([
                'message' => 'This apartment is currently unavailable.',
            ], 422);
        }

        if (
            $validated['booking_type'] === 'nightly' &&
            ! in_array($apartment->rental_type, ['nightly', 'both'])
        ) {
            return response()->json([
                'message' => 'This apartment is not available for nightly booking.',
            ], 422);
        }

        if (
            $validated['booking_type'] === 'monthly' &&
            ! in_array($apartment->rental_type, ['monthly', 'both'])
        ) {
            return response()->json([
                'message' => 'This apartment is not available for monthly booking.',
            ], 422);
        }

        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);

        $overlapExists = Booking::where('apartment_id', $apartment->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
            })
            ->exists();

        if ($overlapExists) {
            return response()->json([
                'message' => 'The selected dates are not available.',
            ], 422);
        }

        if ($validated['booking_type'] === 'nightly') {
            $days = $startDate->diffInDays($endDate);
            $price = $apartment->price_per_night;
            $totalPrice = $days * $price;
        } else {
            $months = max(1, $startDate->diffInMonths($endDate));
            $price = $apartment->price_per_month;
            $totalPrice = $months * $price;
        }

        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'apartment_id' => $apartment->id,
            'booking_type' => $validated['booking_type'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_price' => $totalPrice,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Booking created successfully',
            'booking' => $booking->load('apartment:id,title,location', 'user:id,name,email'),
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $booking = Booking::with([
            'user:id,name,email',
            'apartment:id,title,location,address,price_per_night,price_per_month,rental_type'
        ])->find($id);

        if (! $booking) {
            return response()->json([
                'message' => 'Booking not found',
            ], 404);
        }

        if (
            $request->user()->role !== 'admin' &&
            $booking->user_id !== $request->user()->id
        ) {
            return response()->json([
                'message' => 'Forbidden',
            ], 403);
        }

        return response()->json($booking);
    }

    public function updateStatus(Request $request, $id)
    {
        $booking = Booking::find($id);

        if (! $booking) {
            return response()->json([
                'message' => 'Booking not found',
            ], 404);
        }

        $validated = $request->validate([
            'status' => ['required', 'in:pending,confirmed,cancelled'],
        ]);

        $booking->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Booking status updated successfully',
            'booking' => $booking,
        ]);
    }

    public function cancel(Request $request, $id)
    {
        $booking = Booking::find($id);

        if (! $booking) {
            return response()->json([
                'message' => 'Booking not found',
            ], 404);
        }

        if (
            $request->user()->role !== 'admin' &&
            $booking->user_id !== $request->user()->id
        ) {
            return response()->json([
                'message' => 'Forbidden',
            ], 403);
        }

        $booking->update([
            'status' => 'cancelled',
        ]);

        return response()->json([
            'message' => 'Booking cancelled successfully',
            'booking' => $booking,
        ]);
    }
}
