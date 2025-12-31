import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, User, Search, MessageSquare } from 'lucide-react';

const Messages = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(location.state?.targetUser || null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await api.get('/api/messages/conversations');
                setConversations(res.data.data);
            } catch (err) {
                console.error('Error fetching conversations', err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            const fetchMessages = async () => {
                try {
                    const res = await api.get(`/api/messages/${selectedUser._id}`);
                    setMessages(res.data.data);
                } catch (err) {
                    console.error('Error fetching messages', err);
                }
            };
            fetchMessages();
            // Polling for real-time (Simple MVP way)
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [selectedUser]);

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const res = await api.post('/api/messages', {
                receiver: selectedUser._id,
                content: newMessage
            });
            setMessages([...messages, res.data.data]);
            setNewMessage('');

            // Update conversations list shortcut
            setConversations(prev => {
                const index = prev.findIndex(c => c.user._id === selectedUser._id);
                if (index > -1) {
                    const updated = [...prev];
                    updated[index].lastMessage = res.data.data;
                    return updated;
                }
                return prev;
            });

        } catch (err) {
            alert('Error sending message');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading chats...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 h-[calc(100-100px)]">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 min-h-[600px] flex overflow-hidden">

                {/* Conversations Sidebar */}
                <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
                    <div className="p-6 border-b border-gray-100 bg-white">
                        <h2 className="text-xl font-black text-gray-900 mb-4">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-black transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map(conv => (
                            <div
                                key={conv.user._id}
                                onClick={() => setSelectedUser(conv.user)}
                                className={`p-4 flex items-center cursor-pointer hover:bg-white transition-all border-l-4 ${selectedUser?._id === conv.user._id ? 'bg-white border-black' : 'border-transparent'
                                    }`}
                            >
                                <div className="h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center font-black text-lg mr-3 shadow-md">
                                    {conv.user.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4 className="font-black text-sm text-gray-900 truncate">{conv.user.name}</h4>
                                        <span className="text-[10px] font-bold text-gray-400">
                                            {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate font-medium">{conv.lastMessage.content}</p>
                                </div>
                            </div>
                        ))}
                        {conversations.length === 0 && (
                            <div className="p-10 text-center text-gray-400">
                                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm font-bold">No chats yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {selectedUser ? (
                        <>
                            <div className="p-4 border-b border-gray-100 flex items-center">
                                <div className="h-10 w-10 rounded-xl bg-gray-100 text-black flex items-center justify-center font-black text-md mr-3">
                                    {selectedUser.name[0]}
                                </div>
                                <div>
                                    <h4 className="font-black text-sm text-gray-900">{selectedUser.name}</h4>
                                    <div className="flex items-center text-[10px] text-green-500 font-black uppercase tracking-wider">
                                        <span className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                        Online
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                                {messages.map(msg => (
                                    <div
                                        key={msg._id}
                                        className={`flex ${msg.sender === user.id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${msg.sender === user.id
                                            ? 'bg-black text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                            }`}>
                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                            <span className={`text-[9px] font-bold mt-1 block ${msg.sender === user.id ? 'text-gray-400' : 'text-gray-400'
                                                }`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-3 bg-gray-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black transition-all"
                                />
                                <button
                                    type="submit"
                                    className="p-3 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                                <MessageSquare className="h-10 w-10 opacity-20" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900">Your Inbox</h3>
                            <p className="text-sm font-medium mt-1">Select a conversation to start chatting.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
