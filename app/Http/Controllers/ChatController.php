<?php

namespace App\Http\Controllers;
use App\Events\MessageSent;

class ChatController extends Controller
{
    public function testBroadcast()
    {
        broadcast(new MessageSent('Hello from the backend!'));
        return response()->json(['status' => 'message sent']);
    }
}
