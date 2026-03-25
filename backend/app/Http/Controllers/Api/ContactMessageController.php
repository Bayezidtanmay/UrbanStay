<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use App\Models\ContactMessage;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function store(Request $request, $apartmentId)
    {
        $apartment = Apartment::find($apartmentId);

        if (! $apartment) {
            return response()->json([
                'message' => 'Apartment not found',
            ], 404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $contactMessage = ContactMessage::create([
            'apartment_id' => $apartmentId,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'message' => $validated['message'],
        ]);

        NotificationService::sendToAdmins(
            'apartment_contact_message',
            'New apartment inquiry',
            $validated['name'] . ' sent a message about apartment ' . $apartment->title . '.',
            '/admin/messages',
            [
                'apartment_id' => $apartment->id,
                'contact_message_id' => $contactMessage->id,
                'sender_name' => $validated['name'],
                'sender_email' => $validated['email'],
            ]
        );

        return response()->json([
            'message' => 'Message sent successfully',
            'contact_message' => $contactMessage,
        ], 201);
    }

    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Forbidden. Admin access only.',
            ], 403);
        }

        $messages = ContactMessage::with('apartment:id,title,location')
            ->latest()
            ->paginate(10);

        return response()->json($messages);
    }

    public function show(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Forbidden. Admin access only.',
            ], 403);
        }

        $message = ContactMessage::with('apartment:id,title,location,address')
            ->find($id);

        if (! $message) {
            return response()->json([
                'message' => 'Contact message not found',
            ], 404);
        }

        return response()->json($message);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Forbidden. Admin access only.',
            ], 403);
        }

        $message = ContactMessage::find($id);

        if (! $message) {
            return response()->json([
                'message' => 'Contact message not found',
            ], 404);
        }

        $message->delete();

        return response()->json([
            'message' => 'Contact message deleted successfully',
        ]);
    }
}
