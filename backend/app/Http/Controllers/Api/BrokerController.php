<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Broker;
use Illuminate\Http\Request;

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
            $query->where('area', $request->area);
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'area' => ['required', 'string', 'max:255'],
            'specialty' => ['required', 'string', 'max:255'],
            'languages' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $broker = Broker::create($validated);

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
            'specialty' => ['sometimes', 'string', 'max:255'],
            'languages' => ['nullable', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

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

        $broker->delete();

        return response()->json([
            'message' => 'Broker deleted successfully',
        ]);
    }
}
