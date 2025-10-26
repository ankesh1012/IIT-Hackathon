// client/src/pages/PrivateChat.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { userAPI } from '@/lib/api';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

// Connect to the socket server
const SOCKET_ENDPOINT = 'http://localhost:5000';
let socket;

export default function PrivateChat() {
    const { otherUserId } = useParams();
    const { user: currentUser } = useAuthContext();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [recipient, setRecipient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // --- Core Socket and History Logic ---
    useEffect(() => {
        if (!currentUser) {
            navigate('/auth'); // Redirect if not logged in
            return;
        }

        // 1. Establish Socket Connection
        socket = io(SOCKET_ENDPOINT);

        // 2. Authenticate the current user (tell the server who we are)
        socket.emit('authenticate', currentUser._id);

        // 3. Fetch Recipient Info & History
        const fetchChatData = async () => {
            try {
                // Get recipient's name for display
                const recipientResponse = await userAPI.getUser(otherUserId);
                setRecipient(recipientResponse.data);

                // Get message history
                const historyResponse = await userAPI.api.get(`/api/messages/${otherUserId}`);
                setMessages(historyResponse.data);
            } catch (err) {
                console.error("Error fetching chat data:", err);
                // Handle 404 or other errors
            } finally {
                setIsLoading(false);
            }
        };

        fetchChatData();

        // 4. Handle Incoming Messages
        socket.on('receive_message', (message) => {
            // Update the message state with the new message
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // 5. Cleanup on component unmount
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [currentUser, otherUserId, navigate]);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim() && currentUser) {
            const messageData = {
                senderId: currentUser._id,
                recipientId: otherUserId,
                content: input.trim(),
            };

            // Emit the message to the server
            socket.emit('send_message', messageData);

            setInput('');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
        );
    }
    
    // Safety check in case recipient lookup failed
    const recipientName = recipient?.name || 'User';

    return (
        <div className="container mx-auto max-w-2xl p-4 md:p-8">
            <Card className="shadow-large h-[80vh] flex flex-col">
                <CardHeader className="border-b p-4 flex flex-row items-center justify-between">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                    </Button>
                    <CardTitle className="text-xl font-bold flex-1 text-center">
                        Chat with {recipientName}
                    </CardTitle>
                    <div className='w-10'></div> {/* Spacer */}
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                    {messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`flex ${message.sender._id === currentUser._id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[75%] px-4 py-2 rounded-xl text-sm shadow-md ${
                                message.sender._id === currentUser._id 
                                    ? 'bg-primary text-primary-foreground rounded-br-none' 
                                    : 'bg-card text-foreground rounded-tl-none'
                            }`}>
                                <p>{message.content}</p>
                                <span className="block text-xs opacity-70 mt-1">
                                    {format(new Date(message.createdAt), 'h:mm a')}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </CardContent>

                <CardFooter className="p-4 border-t">
                    <form onSubmit={sendMessage} className="flex w-full gap-2">
                        <Input
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-grow"
                            disabled={!socket || !recipient}
                        />
                        <Button type="submit" disabled={!input.trim() || !socket || !recipient}>
                            <Send size={18} />
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}