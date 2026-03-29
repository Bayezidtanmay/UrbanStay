<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class CheckoutController extends Controller
{
    public function show(Request $request, $bookingId)
    {
        $booking = Booking::with([
            'apartment:id,title,location,address,price_per_night,price_per_month,rental_type,featured_image',
            'user:id,name,email',
        ])->find($bookingId);

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

    public function pay(Request $request, $bookingId)
    {
        $booking = Booking::with([
            'apartment:id,title,location',
            'user:id,name,email',
        ])->find($bookingId);

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

        $validated = $request->validate([
            'card_name' => ['required', 'string', 'max:255'],
            'card_number' => ['required', 'string', 'min:12', 'max:19'],
            'expiry' => ['required', 'string', 'max:10'],
            'cvv' => ['required', 'string', 'min:3', 'max:4'],
            'payment_method' => ['required', 'in:card,demo_card'],
        ]);

        if ($booking->payment_status === 'paid') {
            return response()->json([
                'message' => 'This booking has already been paid.',
            ], 422);
        }

        $booking->update([
            'payment_status' => 'paid',
            'payment_method' => $validated['payment_method'],
            'paid_at' => Carbon::now(),
            'status' => $booking->status === 'cancelled' ? 'cancelled' : 'confirmed',
        ]);

        NotificationService::sendToAdmins(
            'booking_paid',
            'Booking paid',
            $booking->user->name . ' completed payment for ' . $booking->apartment->title . '.',
            '/admin/bookings',
            [
                'booking_id' => $booking->id,
                'apartment_id' => $booking->apartment_id,
                'user_id' => $booking->user_id,
            ]
        );

        NotificationService::send(
            $booking->user_id,
            'payment_success',
            'Payment successful',
            'Your payment for ' . $booking->apartment->title . ' was completed successfully.',
            '/dashboard',
            [
                'booking_id' => $booking->id,
                'apartment_id' => $booking->apartment_id,
            ]
        );

        return response()->json([
            'message' => 'Payment completed successfully',
            'booking' => $booking->fresh(['apartment:id,title,location', 'user:id,name,email']),
        ]);
    }
}
