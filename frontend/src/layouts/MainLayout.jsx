import React, { useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatPanel from '../components/layout/ChatPanel';
import { useStore } from '../store/useStore';
import { MessageSquare, Sparkles } from 'lucide-react';

const MainLayout = ({ children }) => {
  const { isDark, isChatOpen, toggleChat, userProfile } = useStore();

  useEffect(() => {
    // Sync theme with HTML class
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#000000] text-white' : 'bg-[#F9FAFB] text-gray-900'
    }`}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col relative overflow-hidden ${
        isDark ? 'bg-[#000000]' : 'bg-[#F9FAFB]'
      }`}>
        {/* Top Header */}
        <header className={`h-16 flex items-center justify-between px-8 border-b transition-colors duration-300 ${
          isDark ? 'border-[#222222] bg-[#000000]' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded bg-indigo-500/10 text-indigo-500`}>
              BETA
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Version 1.0.4
            </span>
          </div>
          
          <div className="flex items-center gap-4">
             {!isChatOpen && (
               <button 
                 onClick={toggleChat}
                 className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-600/20"
               >
                 <Sparkles size={14} />
                 Open Assistant
               </button>
             )}
             {userProfile && (
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-md cursor-pointer hover:scale-105 transition-transform" title={userProfile.name}>
                 {userProfile.initials}
               </div>
             )}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar ${
          isDark ? 'bg-[#000000]' : 'bg-[#F9FAFB]'
        }`}>
          {children}
        </div>
      </main>

      {/* Chat Panel */}
      <ChatPanel />

      
      {/* Mobile Toggle for Chat (Hidden on desktop) */}
      {!isChatOpen && (
        <button 
          onClick={toggleChat}
          className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 md:hidden z-50"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default MainLayout;
