import { useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import echo from '../echo' 

export default function Dashboard() {
    useEffect(() => {
        console.log('Echo instance:', echo)

        // TypeScript-safe access to the socket
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

        echo.channel('chat')
            .listen('.MessageSent', (e: any) => {
                console.log('📩 New message received:', e.message)
            })

        return () => {
            echo.leave('chat')
        }
    }, [])

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
