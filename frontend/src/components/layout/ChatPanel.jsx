import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  X,
  Maximize2,
  Minimize2,
  Trash2,
  Download
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const ChatPanel = () => {
  const { isDark, isChatOpen, toggleChat, messages, addMessage, clearMessages } = useStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    addMessage(userMessage);
    setInput('');
    
    try {
      const { blueprint, aiPreferences, messages: currentMessages } = useStore.getState();
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...currentMessages, userMessage],
          blueprint,
          customApiKey: aiPreferences?.apiKey || undefined
        })
      });

      const data = await response.json();
      if (data.success) {
        addMessage({ role: 'assistant', content: data.reply });
      } else {
        addMessage({ role: 'assistant', content: "Sorry, I encountered an error. Please try again." });
      }
    } catch (err) {
      addMessage({ role: 'assistant', content: "Network error occurred." });
    }
  };

  const handleDownload = (content) => {
    // Extract a title from the markdown if possible, otherwise use a generic name
    let title = "implementation-plan";
    const match = content.match(/# Implementation Plan: (.*)/);
    if (match && match[1]) {
      title = match[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'assistant'
                      ? (isDark ? 'bg-white/5 text-gray-200' : 'bg-gray-100 text-gray-800')
                      : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="flex flex-col">
                        <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''} prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:p-2 prose-pre:rounded-lg prose-headings:font-bold prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1 prose-li:my-0`}>
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                        {msg.content.length > 50 && (
                          <button 
                            onClick={() => handleDownload(msg.content)}
                            className={`mt-4 self-start flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              isDark ? 'bg-[#222222] hover:bg-[#333333] text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            <Download size={14} />
                            Download Plan (.md)
                          </button>
                        )}
                      </div>
                    ) : (
                      msg.content
                    )}
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
