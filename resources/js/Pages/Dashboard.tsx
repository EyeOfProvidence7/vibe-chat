import { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import echo from '../echo'
import axios from 'axios'

export default function Dashboard() {
    const [messages, setMessages] = useState<string[]>([])
    const [input, setInput] = useState('')

    useEffect(() => {
        const socket = (echo.connector as any)?.socket

        if (socket) {
            socket.onopen = () => {
                console.log('✅ WebSocket connection established')
            }

            socket.onerror = (err: any) => {
                console.error('❌ WebSocket error:', err)
            }
        } else {
            console.warn('⚠️ Echo socket not found')
        }

        echo.channel('chat').listen('.MessageSent', (e: any) => {
            console.log('📩 New message received:', e.message)
            setMessages((prev) => [...prev, e.message])
        })

        return () => {
            echo.leave('chat')
        }
    }, [])

    const handleSend = async () => {
        if (!input.trim()) return

        await axios.post('/chat/message', { message: input })
        setMessages((prev) => [...prev, input]) // Optimistic update
        setInput('')
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Chat
                </h2>
            }
        >
            <Head title="Chat" />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 space-y-4">
                            <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2">
                                {messages.map((msg, i) => (
                                    <div key={i} className="text-gray-900 dark:text-gray-100">
                                        {msg}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message"
                                    className="flex-1 px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                />
                                <button
                                    onClick={handleSend}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
