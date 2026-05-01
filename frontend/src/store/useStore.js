import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      // Theme State
      isDark: true,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      
      // Sidebar State
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      // Blueprint State
      blueprint: null,
      setBlueprint: (data) => set({ blueprint: data }),
      
      // Chat State
      isChatOpen: true,
      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
      messages: [
        { 
          id: 1, 
          role: 'assistant', 
          content: 'Hello! I am your AI Product Execution Copilot. Describe your idea and I will help you build a full-stack blueprint.' 
        }
      ],
      addMessage: (msg) => set((state) => ({ 
        messages: [...state.messages, { id: Date.now(), ...msg }] 
      })),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'blueprintr-storage',
      partialize: (state) => ({ isDark: state.isDark }),
    }
  )
);
