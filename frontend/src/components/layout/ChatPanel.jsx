import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  X,
  Maximize2,
  Minimize2,
  Trash2
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const ChatPanel = () => {
  const { isDark, isChatOpen, toggleChat, messages, addMessage, clearMessages } = useStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    addMessage({ role: 'user', content: input });
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      addMessage({ 
        role: 'assistant', 
        content: 'I am analyzing your context and the generated blueprint. How can I help you refine the technical specifications?' 
      });
    }, 1000);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isChatOpen ? 340 : 0, opacity: isChatOpen ? 1 : 0 }}
      className={`flex flex-col h-screen border-l transition-colors duration-300 relative ${
        isDark 
          ? 'bg-[#0B0F19] border-white/5' 
          : 'bg-white border-gray-200'
      }`}
    >
      <AnimatePresence>
        {isChatOpen && (
          <div className="flex flex-col h-full w-[340px]">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-500" />
                <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={clearMessages}
                  className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
                <button 
                  onClick={toggleChat}
                  className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'assistant' 
                      ? 'bg-indigo-600/10 text-indigo-500' 
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'assistant'
                      ? (isDark ? 'bg-white/5 text-gray-200' : 'bg-gray-100 text-gray-800')
                      : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5">
              <form 
                onSubmit={handleSend}
                className={`relative flex items-center rounded-xl border transition-all ${
                  isDark 
                    ? 'bg-black/20 border-white/10 focus-within:border-white/20' 
                    : 'bg-gray-50 border-gray-200 focus-within:border-gray-300 shadow-sm'
                }`}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask assistant..."
                  className={`w-full bg-transparent px-4 py-3 text-sm focus:outline-none placeholder-gray-500 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className={`p-2 mr-1 rounded-lg transition-all ${
                    input.trim() ? 'text-indigo-500 hover:bg-indigo-500/10' : 'text-gray-600'
                  }`}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};

export default ChatPanel;
