<?php

namespace Database\Seeders;

use App\Models\Apartment;
use App\Models\ApartmentImage;
use App\Models\Booking;
use App\Models\ContactMessage;
use App\Models\Review;
use App\Models\UnavailableDate;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ApartmentSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'tanmay@example.com')->first();

        if (! $admin) {
            $admin = User::create([
                'name' => 'Tanmay',
                'email' => 'tanmay@example.com',
                'password' => 'password123',
                'role' => 'admin',
            ]);
        }

        ApartmentImage::query()->delete();
        Booking::query()->delete();
        Review::query()->delete();
        ContactMessage::query()->delete();
        UnavailableDate::query()->delete();
        Apartment::query()->delete();

        $apartments = [
            [
                'title' => 'Modern Studio in Helsinki',
                'description' => 'A beautiful modern studio apartment in the city center.',
                'location' => 'Helsinki',
                'address' => 'Mannerheimintie 10',
                'price_per_night' => 90,
                'price_per_month' => 1400,
                'rental_type' => 'both',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'size' => 35,
                'is_available' => true,
                'featured_image' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Modern Studio in Kamppi',
                'description' => 'Central studio close to  Kamppi shopping center and metro.',
                'location' => 'Helsinki',
                'address' => 'Fredrikinkatu 61A',
                'price_per_night' => 110,
                'price_per_month' => 1480,
                'rental_type' => 'both',
                'bedrooms' => 2,
                'bathrooms' => 1,
                'size' => 35,
                'is_available' => true,
                'featured_image' => 'https://plus.unsplash.com/premium_photo-1684175656218-70f1c6f442b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            ],
            [
                'title' => 'Cozy Apartment in Kallio',
                'description' => 'Comfortable flat in a lively neighborhood with cafés.',
                'location' => 'Helsinki',
                'address' => 'Puikkari 7',
                'price_per_night' => 75,
                'price_per_month' => 1400,
                'rental_type' => 'both',
                'bedrooms' => 3,
                'bathrooms' => 1,
                'size' => 65,
                'is_available' => true,
                'featured_image' => 'https://images.unsplash.com/photo-1741764014072-68953e93cd48?q=80&w=2119&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            ],
            [
                'title' => 'Bright Studio in Töölö',
                'description' => 'Sunny apartment near parks and the seaside.',
                'location' => 'Helsinki',
                'address' => 'Töölönkatu 21',
                'price_per_night' => 120,
                'price_per_month' => 1600,
                'rental_type' => 'both',
                'bedrooms' => 3,
                'bathrooms' => 1,
                'size' => 85,
                'is_available' => true,
                'featured_image' => 'https://images.unsplash.com/photo-1648160670241-1d6f5e713996?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            ],
            [
                'title' => 'Stylish Flat in Pasila',
                'description' => 'Modern apartment close to the Mall of Tripla and train station.',
                'location' => 'Helsinki',
                'address' => 'Höyrykatu 8',
                'price_per_night' => 100,
                'price_per_month' => 1400,
                'rental_type' => 'both',
                'bedrooms' => 2,
                'bathrooms' => 1,
                'size' => 55,
                'is_available' => true,
                'featured_image' => 'https://images.unsplash.com/photo-1674171178943-fb9459f0b258?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            ],
            [
                'title' => 'Compact Studio in Hakaniemi',
                'description' => 'Small but efficient apartment near market square.',
                'location' => 'Helsinki',
                'address' => 'Haapaniemenkatu 14',
                'price_per_night' => 65,
                'price_per_month' => 999,
                'rental_type' => 'both',
                'bedrooms' => 2,
                'bathrooms' => 1,
                'size' => 50,
                'is_available' => true,
                'featured_image' => 'https://images.unsplash.com/photo-1610220940576-84516b482590?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            ],
            [
                'title' => 'Elegant Apartment in Lauttasaari',
                'description' => 'Peaceful coastal apartment with great transport links.',
                'location' => 'Helsinki',
                'address' => 'Pohjoiskaari 31',
                'price_per_night' => 85,
                'price_per_month' => 1050,
                'rental_type' => 'both',
                'bedrooms' => 2,
                'bathrooms' => 1,
                'size' => 60,
                'is_available' => true,
                'featured_image' => 'https://images.unsplash.com/photo-1757742690834-aa581b9f53b2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            ],
            [
                'title' => 'Urban Studio in Vallila',
                'description' => 'Trendy studio in a creative Helsinki district.',
                'location' => 'Helsinki',
                'address' => 'Sturenkatu 28',
                'price_per_night' => 85,
                'price_per_month' => 1200,
                'rental_type' => 'both',
                'bedrooms' => 2,
                'bathrooms' => 1,
                'size' => 60,
                'is_available' => true,
                'featured_image' => 'https://plus.unsplash.com/premium_photo-1683769252446-e3d8052c0411?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            ],
            [
                'title' => 'Cozy Loft in Espoo',
                'description' => 'A cozy and stylish loft apartment perfect for short stays and remote work.',
                'location' => 'Espoo',
                'address' => 'Leppävaarankatu 5, Espoo',
                'price_per_night' => 75,
                'price_per_month' => 1250,
                'rental_type' => 'both',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'size' => 32,
                'is_available' => true,
                'featured_image' => 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Family Apartment in Vantaa',
                'description' => 'Spacious apartment with modern kitchen and family-friendly neighborhood.',
                'location' => 'Vantaa',
                'address' => 'Koivukylänväylä 22, Vantaa',
                'price_per_night' => 110,
                'price_per_month' => 1800,
                'rental_type' => 'both',
                'bedrooms' => 3,
                'bathrooms' => 2,
                'size' => 78,
                'is_available' => true,
                'featured_image' => 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Budget Studio in Tampere',
                'description' => 'Affordable studio apartment near public transport and local shops.',
                'location' => 'Tampere',
                'address' => 'Hämeenkatu 14, Tampere',
                'price_per_night' => 55,
                'price_per_month' => 950,
                'rental_type' => 'both',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'size' => 27,
                'is_available' => true,
                'featured_image' => 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Luxury Flat in Turku',
                'description' => 'Elegant luxury flat with premium interior, balcony, and city views.',
                'location' => 'Turku',
                'address' => 'Aurakatu 9, Turku',
                'price_per_night' => 140,
                'price_per_month' => 2400,
                'rental_type' => 'both',
                'bedrooms' => 2,
                'bathrooms' => 2,
                'size' => 68,
                'is_available' => true,
                'featured_image' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Monthly Rental in Oulu',
                'description' => 'Comfortable apartment ideal for longer stays, students, and professionals.',
                'location' => 'Oulu',
                'address' => 'Torikatu 11, Oulu',
                'price_per_night' => null,
                'price_per_month' => 1150,
                'rental_type' => 'monthly',
                'bedrooms' => 2,
                'bathrooms' => 1,
                'size' => 49,
                'is_available' => true,
                'featured_image' => 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Long Stay Cabin in Rovaniemi',
                'description' => 'Warm and charming cabin-style apartment for short stays near nature.',
                'location' => 'Rovaniemi',
                'address' => 'Poromiehentie 7, Rovaniemi',
                'price_per_night' => 130,
                'price_per_month' => null,
                'rental_type' => 'nightly',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'size' => 38,
                'is_available' => true,
                'featured_image' => 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80',
            ],
        ];

        foreach ($apartments as $item) {
            Apartment::create([
                'created_by' => $admin->id,
                'title' => $item['title'],
                'slug' => Str::slug($item['title']) . '-' . Str::random(6),
                'description' => $item['description'],
                'location' => $item['location'],
                'address' => $item['address'],
                'price_per_night' => $item['price_per_night'],
                'price_per_month' => $item['price_per_month'],
                'rental_type' => $item['rental_type'],
                'bedrooms' => $item['bedrooms'],
                'bathrooms' => $item['bathrooms'],
                'size' => $item['size'],
                'is_available' => $item['is_available'],
                'featured_image' => $item['featured_image'],
            ]);
        }
    }
}
