import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockUsers, mockChatMessages, addChatMessage } from '../data/mockData';
import { User, ChatMessage } from '../data/mockData';
import { 
  Users, 
  MessageCircle, 
  UserPlus, 
  UserMinus, 
  Send, 
  Search,
  Circle,
  Dot
} from 'lucide-react';

const FriendsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to view friends</h2>
        </div>
      </div>
    );
  }

  // Mock friends data - in real app this would come from user's friend list
  const friends = mockUsers.filter(u => u.id !== user.id).slice(0, 5);
  const chatMessages = mockChatMessages.filter(msg => 
    activeChat && (
      (msg.senderId === user.id && msg.receiverId === activeChat) ||
      (msg.senderId === activeChat && msg.receiverId === user.id)
    )
  );

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: activeChat,
      content: newMessage.trim(),
      timestamp: new Date(),
      read: false
    };

    addChatMessage(message);
    setNewMessage('');
  };

  const getOnlineStatus = (userId: string) => {
    // Mock online status - randomly assign for demo
    return Math.random() > 0.5;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <div className="flex h-[600px]">
            {/* Friends List */}
            <div className="w-1/3 border-r border-white/20 flex flex-col">
              <div className="p-6 border-b border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Users className="mr-3" />
                  Friends
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search friends..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => setActiveChat(friend.id)}
                    className={`p-4 border-b border-white/10 cursor-pointer transition-colors ${
                      activeChat === friend.id ? 'bg-purple-500/20' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            {friend.username.charAt(0).toUpperCase()}
                          </div>
                          {getOnlineStatus(friend.id) ? (
                            <Circle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 fill-current" />
                          ) : (
                            <Circle className="absolute -bottom-1 -right-1 w-4 h-4 text-gray-500 fill-current" />
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-white font-medium">{friend.username}</p>
                          <p className="text-gray-400 text-sm">{friend.rank}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-400 hover:text-red-300 transition-colors">
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-white/20">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friend
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {activeChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-white/20">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {friends.find(f => f.id === activeChat)?.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-white font-medium">
                          {friends.find(f => f.id === activeChat)?.username}
                        </h3>
                        <p className="text-gray-400 text-sm flex items-center">
                          <Dot className={`w-4 h-4 mr-1 ${getOnlineStatus(activeChat) ? 'text-green-500' : 'text-gray-500'}`} />
                          {getOnlineStatus(activeChat) ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === user.id
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/10 text-white'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-6 border-t border-white/20">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">Select a friend to start chatting</h3>
                    <p className="text-gray-400">Choose a friend from the list to begin your conversation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;