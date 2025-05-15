<?php

namespace App\Http\Controllers;
use App\Events\MessageSent;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function testBroadcast()
    {
        $variable = 'Hello from the backend!';

        broadcast(new MessageSent($variable));
        return response()->json(['status' => 'message sent']);
    }

    public function sendMessage(Request $request)
{
    $request->validate([
        'message' => 'required|string|max:1000',
    ]);

    $message = $request->input('message');

    broadcast(new MessageSent($message))->toOthers();

    return response()->json(['status' => 'Message sent']);
}
}
