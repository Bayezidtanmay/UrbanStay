<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Broker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BrokerController extends Controller
{
    public function index(Request $request)
    {
        $query = Broker::query()->where('is_active', true)->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('area', 'like', "%{$search}%")
                    ->orWhere('specialty', 'like', "%{$search}%");
            });
        }

        if ($request->filled('area')) {
            $query->where(function ($q) use ($request) {
                $q->where('area', $request->area)
                    ->orWhereJsonContains('service_areas', $request->area);
            });
        }

        return response()->json($query->get());
    }

    public function all()
    {
        return response()->json(Broker::latest()->get());
    }

    public function show($id)
    {
        $broker = Broker::find($id);

        if (! $broker) {
            return response()->json([
                'message' => 'Broker not found',
            ], 404);
        }

        return response()->json($broker);
    }

    public function recommendedByArea($area)
    {
        $brokers = Broker::where('is_active', true)
            ->where(function ($q) use ($area) {
                $q->where('area', $area)
                    ->orWhereJsonContains('service_areas', $area);
            })
            ->latest()
            ->get();

        return response()->json($brokers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'area' => ['required', 'string', 'max:255'],
            'service_areas' => ['nullable', 'array'],
            'service_areas.*' => ['string', 'max:255'],
            'specialty' => ['required', 'string', 'max:255'],
            'languages' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('brokers', 'public');
        }

        $broker = Broker::create([
            'name' => $validated['name'],
            'area' => $validated['area'],
            'service_areas' => $validated['service_areas'] ?? [],
            'specialty' => $validated['specialty'],
            'languages' => $validated['languages'] ?? null,
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'description' => $validated['description'] ?? null,
            'image' => $imagePath ? asset('storage/' . $imagePath) : null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Broker created successfully',
            'broker' => $broker,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $broker = Broker::find($id);

        if (! $broker) {
            return response()->json([
                'message' => 'Broker not found',
            ], 404);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'area' => ['sometimes', 'string', 'max:255'],
            'service_areas' => ['nullable', 'array'],
            'service_areas.*' => ['string', 'max:255'],
            'specialty' => ['sometimes', 'string', 'max:255'],
            'languages' => ['nullable', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if ($request->hasFile('image')) {
            if ($broker->image) {
                $oldPath = str_replace(asset('storage/') . '/', '', $broker->image);
                Storage::disk('public')->delete($oldPath);
            }

            $newImagePath = $request->file('image')->store('brokers', 'public');
            $validated['image'] = asset('storage/' . $newImagePath);
        }

        $broker->update($validated);

        return response()->json([
            'message' => 'Broker updated successfully',
            'broker' => $broker,
        ]);
    }

    public function destroy($id)
    {
        $broker = Broker::find($id);

        if (! $broker) {
            return response()->json([
                'message' => 'Broker not found',
            ], 404);
        }

        if ($broker->image) {
            $oldPath = str_replace(asset('storage/') . '/', '', $broker->image);
            Storage::disk('public')->delete($oldPath);
        }

        $broker->delete();

        return response()->json([
            'message' => 'Broker deleted successfully',
        ]);
    }
}
