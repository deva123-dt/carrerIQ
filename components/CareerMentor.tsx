import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { sendMessageToChatStream, startChat } from '../services/geminiService';
import { ICONS } from '../constants';

const CareerMentor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startChat(); // Initialize the chat session on component mount
    setMessages([
        { id: crypto.randomUUID(), text: "Hello! I'm your AI Career Mentor. How can I help you with your career development today? Feel free to ask about resume tips, interview preparation, or skill development.", sender: 'ai' }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiMessageId = crypto.randomUUID();
    // Add a placeholder for the AI's response
    setMessages(prev => [...prev, { id: aiMessageId, text: '', sender: 'ai', streaming: true }]);

    try {
      const stream = await sendMessageToChatStream(input);
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: fullResponse } : msg
          )
        );
      }
      // Finalize the message by removing the streaming indicator
      setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, streaming: false } : msg
          )
        );
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId ? { ...msg, text: "Sorry, I'm having trouble connecting. Please try again.", streaming: false } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-card-white rounded-lg shadow-md">
        <div className="p-4 border-b flex items-center space-x-3">
            <div className="text-primary">{ICONS.mentor}</div>
            <h2 className="text-2xl font-bold font-heading text-text-dark">AI Career Mentor</h2>
        </div>
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'ai' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center p-1.5">{ICONS.mentor}</div>}
                    <div className={`max-w-lg px-4 py-2 rounded-xl whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-200 text-text-dark'}`}>
                       <p className="text-sm">{msg.text}</p>
                       {msg.streaming && msg.text.length === 0 && <span className="inline-block w-2 h-2 ml-1 bg-text-dark rounded-full animate-pulse"></span>}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t bg-white rounded-b-lg">
            <form onSubmit={handleSubmit} className="flex items-center space-x-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask for career advice..."
                    className="flex-1 bg-gray-100 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isLoading}
                />
                <button type="submit" className="bg-primary text-white rounded-full p-2 disabled:bg-gray-400 hover:bg-blue-700 transition-colors" disabled={isLoading} aria-label="Send message">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                </button>
            </form>
        </div>
    </div>
  );
};

export default CareerMentor;
