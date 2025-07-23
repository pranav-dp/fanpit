"use client";

import { useState, FormEvent, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'agent';
  isLoading?: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Hi there! I'm your Fanpit Event Concierge. How can I help you today?", 
      sender: 'agent' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { text: input, sender: 'user' };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    
    setIsLoading(true);
    setMessages(prev => [...prev, { text: "", sender: 'agent', isLoading: true }]);
    
    setInput('');

    try {
      const response = await fetch('/api/invoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input, chat_history: messages }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      setMessages(prev => {
        const newMessages = prev.filter(msg => !msg.isLoading);
        if (data.messages && data.messages.length > 0) {
          const agentResponse = data.messages[data.messages.length - 1];
          if (agentResponse.content) {
            return [...newMessages, {
              text: agentResponse.content,
              sender: 'agent'
            }];
          }
        }
        return newMessages;
      });

    } catch (error) {
      console.error('Error invoking agent:', error);
      setMessages(prev => {
        const newMessages = prev.filter(msg => !msg.isLoading);
        return [...newMessages, { 
          text: 'Sorry, something went wrong. Please try again.', 
          sender: 'agent' 
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto h-[95vh] max-h-[800px] flex flex-col">
      <div className="mt-10 mb-6">
        <h1 className="text-4xl font-bold text-white text-center">
          Chat with <span className="text-purple-400">bolt</span>!
        </h1>
        <p className="text-lg text-purple-300 text-center mt-4 px-4">
          Chat with <span className="text-purple-400 font-semibold">bolt</span>, our smart assistant, about current events and more!
        </p>
      </div>
      <div className="w-full flex-grow flex flex-col bg-gray-900/70 backdrop-blur-xl rounded-3xl border-2 border-white/10 shadow-2xl">
        <header className="p-4 flex justify-center items-center relative">
          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full border border-white/10">
            <span className="text-md font-bold text-white">Fanpit</span>
            <span className="text-purple-400 text-sm">♥</span>
          </div>
        </header>
      
        <div className="flex-grow p-4 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'agent' && !msg.isLoading && (
                  <img src="/bolt.png" alt="Bolt" className="w-8 h-8 rounded-full" />
                )}
                {msg.isLoading ? (
                  <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-4 py-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                ) : (
                  <div
                    className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-white/90 ${
                      msg.sender === 'user'
                        ? 'bg-purple-600/80'
                        : 'bg-black/30'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                )}
                {msg.sender === 'user' && (
                  <img src="https://www.fanpit.com/user-avatar.png" alt="User" className="w-8 h-8 rounded-full" />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
 
        <div className="p-4">
          <form onSubmit={handleSubmit} className="flex items-center bg-black/30 border-2 border-white/10 rounded-full p-1.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-grow px-4 py-2 bg-transparent rounded-full focus:outline-none text-white placeholder:text-gray-400/80"
              placeholder="Your wish is my command..."
            />
            <button
              type="submit"
              disabled={isLoading}
              className="p-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
