<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Broker;
use App\Models\BrokerMessage;
use Illuminate\Http\Request;

class BrokerMessageController extends Controller
{
    public function store(Request $request, $brokerId)
    {
        $broker = Broker::find($brokerId);

        if (! $broker) {
            return response()->json([
                'message' => 'Broker not found',
            ], 404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $brokerMessage = BrokerMessage::create([
            'broker_id' => $broker->id,
            'user_id' => $request->user()?->id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'message' => $validated['message'],
        ]);

        return response()->json([
            'message' => 'Message sent to broker successfully',
            'broker_message' => $brokerMessage,
        ], 201);
    }

    public function index()
    {
        return response()->json(
            BrokerMessage::with('broker', 'user')->latest()->get()
        );
    }

    public function destroy($id)
    {
        $message = BrokerMessage::find($id);

        if (! $message) {
            return response()->json([
                'message' => 'Broker message not found',
            ], 404);
        }

        $message->delete();

        return response()->json([
            'message' => 'Broker message deleted successfully',
        ]);
    }
}
