<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use App\Models\ApartmentImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ApartmentController extends Controller
{
    private function geocodeAddress(string $address): array
    {
        $response = Http::withHeaders([
            'User-Agent' => 'UrbanStay/1.0',
        ])->get('https://nominatim.openstreetmap.org/search', [
            'q' => $address,
            'format' => 'jsonv2',
            'limit' => 1,
        ]);

        if (! $response->successful()) {
            return ['latitude' => null, 'longitude' => null];
        }

        $data = $response->json();

        if (empty($data) || ! isset($data[0]['lat'], $data[0]['lon'])) {
            return ['latitude' => null, 'longitude' => null];
        }

        return [
            'latitude' => (float) $data[0]['lat'],
            'longitude' => (float) $data[0]['lon'],
        ];
    }

    public function index(Request $request)
    {
        $query = Apartment::with('creator:id,name,email')->latest();

        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        if ($request->filled('rental_type')) {
            if ($request->rental_type === 'nightly') {
                $query->whereIn('rental_type', ['nightly', 'both']);
            } elseif ($request->rental_type === 'monthly') {
                $query->whereIn('rental_type', ['monthly', 'both']);
            } elseif ($request->rental_type === 'both') {
                $query->where('rental_type', 'both');
            }
        }

        if ($request->filled('min_price')) {
            $query->where(function ($q) use ($request) {
                $q->where('price_per_night', '>=', $request->min_price)
                    ->orWhere('price_per_month', '>=', $request->min_price);
            });
        }

        if ($request->filled('max_price')) {
            $query->where(function ($q) use ($request) {
                $q->where('price_per_night', '<=', $request->max_price)
                    ->orWhere('price_per_month', '<=', $request->max_price);
            });
        }

        if (
            $request->filled('lat_min') &&
            $request->filled('lat_max') &&
            $request->filled('lng_min') &&
            $request->filled('lng_max')
        ) {
            $query->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->whereBetween('latitude', [(float) $request->lat_min, (float) $request->lat_max])
                ->whereBetween('longitude', [(float) $request->lng_min, (float) $request->lng_max]);
        }

        $apartments = $query->paginate(20);

        return response()->json($apartments);
    }

    public function show($id)
    {
        $apartment = Apartment::with([
            'creator:id,name,email',
            'images',
            'reviews.user:id,name',
            'unavailableDates',
            'bookings',
        ])->find($id);

        if (! $apartment) {
            return response()->json([
                'message' => 'Apartment not found',
            ], 404);
        }

        $averageRating = $apartment->reviews->avg('rating');

        return response()->json([
            'apartment' => $apartment,
            'average_rating' => $averageRating ? round($averageRating, 1) : null,
            'total_reviews' => $apartment->reviews->count(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'price_per_night' => ['nullable', 'numeric', 'min:0'],
            'price_per_month' => ['nullable', 'numeric', 'min:0'],
            'rental_type' => ['required', 'in:nightly,monthly,both'],
            'bedrooms' => ['required', 'integer', 'min:1'],
            'bathrooms' => ['required', 'integer', 'min:1'],
            'size' => ['nullable', 'integer', 'min:1'],
            'is_available' => ['nullable', 'boolean'],
            'featured_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'gallery_images.*' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $imagePath = null;

        if ($request->hasFile('featured_image')) {
            $imagePath = $request->file('featured_image')->store('apartments', 'public');
        }

        $fullAddress = $validated['address'] . ', ' . $validated['location'] . ', Finland';
        $coordinates = $this->geocodeAddress($fullAddress);

        $apartment = Apartment::create([
            'created_by' => $request->user()->id,
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(6),
            'description' => $validated['description'],
            'location' => $validated['location'],
            'address' => $validated['address'],
            'price_per_night' => $validated['price_per_night'] ?? null,
            'price_per_month' => $validated['price_per_month'] ?? null,
            'rental_type' => $validated['rental_type'],
            'bedrooms' => $validated['bedrooms'],
            'bathrooms' => $validated['bathrooms'],
            'size' => $validated['size'] ?? null,
            'is_available' => $validated['is_available'] ?? true,
            'featured_image' => $imagePath ? asset('storage/' . $imagePath) : null,
            'latitude' => $coordinates['latitude'],
            'longitude' => $coordinates['longitude'],
        ]);

        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $image) {
                $galleryPath = $image->store('apartments/gallery', 'public');

                ApartmentImage::create([
                    'apartment_id' => $apartment->id,
                    'image_path' => asset('storage/' . $galleryPath),
                ]);
            }
        }

        return response()->json([
            'message' => 'Apartment created successfully',
            'apartment' => $apartment->load('images'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $apartment = Apartment::with('images')->find($id);

        if (! $apartment) {
            return response()->json([
                'message' => 'Apartment not found',
            ], 404);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'location' => ['sometimes', 'string', 'max:255'],
            'address' => ['sometimes', 'string', 'max:255'],
            'price_per_night' => ['nullable', 'numeric', 'min:0'],
            'price_per_month' => ['nullable', 'numeric', 'min:0'],
            'rental_type' => ['sometimes', 'in:nightly,monthly,both'],
            'bedrooms' => ['sometimes', 'integer', 'min:1'],
            'bathrooms' => ['sometimes', 'integer', 'min:1'],
            'size' => ['nullable', 'integer', 'min:1'],
            'is_available' => ['nullable', 'boolean'],
            'featured_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'gallery_images.*' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'replace_gallery' => ['nullable', 'boolean'],
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(6);
        }

        if ($request->hasFile('featured_image')) {
            if ($apartment->featured_image) {
                $oldPath = str_replace(asset('storage/') . '/', '', $apartment->featured_image);
                Storage::disk('public')->delete($oldPath);
            }

            $newImagePath = $request->file('featured_image')->store('apartments', 'public');
            $validated['featured_image'] = asset('storage/' . $newImagePath);
        }

        $fullAddress = ($validated['address'] ?? $apartment->address) . ', ' . ($validated['location'] ?? $apartment->location) . ', Finland';
        $coordinates = $this->geocodeAddress($fullAddress);

        $validated['latitude'] = $coordinates['latitude'];
        $validated['longitude'] = $coordinates['longitude'];

        $apartment->update($validated);

        if ($request->boolean('replace_gallery')) {
            foreach ($apartment->images as $image) {
                $oldGalleryPath = str_replace(asset('storage/') . '/', '', $image->image_path);
                Storage::disk('public')->delete($oldGalleryPath);
                $image->delete();
            }
        }

        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $image) {
                $galleryPath = $image->store('apartments/gallery', 'public');

                ApartmentImage::create([
                    'apartment_id' => $apartment->id,
                    'image_path' => asset('storage/' . $galleryPath),
                ]);
            }
        }

        return response()->json([
            'message' => 'Apartment updated successfully',
            'apartment' => $apartment->fresh()->load('images'),
        ]);
    }

    public function destroy($id)
    {
        $apartment = Apartment::with('images')->find($id);

        if (! $apartment) {
            return response()->json([
                'message' => 'Apartment not found',
            ], 404);
        }

        if ($apartment->featured_image) {
            $oldPath = str_replace(asset('storage/') . '/', '', $apartment->featured_image);
            Storage::disk('public')->delete($oldPath);
        }

        foreach ($apartment->images as $image) {
            $oldGalleryPath = str_replace(asset('storage/') . '/', '', $image->image_path);
            Storage::disk('public')->delete($oldGalleryPath);
            $image->delete();
        }

        $apartment->delete();

        return response()->json([
            'message' => 'Apartment deleted successfully',
        ]);
    }
}
