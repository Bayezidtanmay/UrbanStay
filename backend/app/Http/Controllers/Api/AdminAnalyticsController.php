<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use App\Models\Booking;
use App\Models\Broker;
use App\Models\BrokerMessage;
use App\Models\ContactMessage;
use App\Models\Favorite;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends Controller
{
    public function index()
    {
        $summary = [
            'total_apartments' => Apartment::count(),
            'total_bookings' => Booking::count(),
            'total_users' => User::where('role', 'user')->count(),
            'total_admins' => User::where('role', 'admin')->count(),
            'total_brokers' => Broker::count(),
            'total_favorites' => Favorite::count(),
            'total_contact_messages' => ContactMessage::count(),
            'total_broker_messages' => BrokerMessage::count(),
        ];

        $bookingStatus = Booking::select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => ucfirst($item->status),
                    'total' => $item->total,
                ];
            })
            ->values();

        $bookingsByLocation = Booking::join('apartments', 'bookings.apartment_id', '=', 'apartments.id')
            ->select('apartments.location as location', DB::raw('COUNT(bookings.id) as total'))
            ->groupBy('apartments.location')
            ->orderByDesc('total')
            ->limit(8)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->location,
                    'total' => $item->total,
                ];
            })
            ->values();

        $recentBookings = Booking::with([
            'user:id,name,email',
            'apartment:id,title,location',
        ])
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'summary' => $summary,
            'booking_status' => $bookingStatus,
            'bookings_by_location' => $bookingsByLocation,
            'recent_bookings' => $recentBookings,
        ]);
    }
}
