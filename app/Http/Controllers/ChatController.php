<?php

namespace App\Http\Controllers;
use App\Events\MessageSent;

class ChatController extends Controller
{
    public function testBroadcast()
    {
        $variable = 'Hello from the backend!';

        broadcast(new MessageSent($variable));
        return response()->json(['status' => 'message sent']);
    }
}
