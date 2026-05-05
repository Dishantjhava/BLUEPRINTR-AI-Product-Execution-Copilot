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
      
      // Projects History State
      projects: [],
      folders: [],
      addProject: (project) => set((state) => ({
        projects: [project, ...state.projects]
      })),
      addFolder: (folderName) => set((state) => {
        if (!state.folders.includes(folderName)) {
          return { folders: [...state.folders, folderName] };
        }
        return state;
      }),
      renameProject: (projectId, newName) => set((state) => ({
        projects: state.projects.map(p => p.id === projectId ? { ...p, name: newName } : p)
      })),
      moveProjectToFolder: (projectId, folderName) => set((state) => ({
        projects: state.projects.map(p => p.id === projectId ? { ...p, project: folderName } : p)
      })),
      deleteProject: (projectId) => set((state) => ({
        projects: state.projects.filter(p => p.id !== projectId)
      })),
      deleteMultipleProjects: (projectIds) => set((state) => ({
        projects: state.projects.filter(p => !projectIds.includes(p.id))
      })),
      moveMultipleProjects: (projectIds, folderName) => set((state) => ({
        projects: state.projects.map(p => projectIds.includes(p.id) ? { ...p, project: folderName } : p)
      })),

      // User Profile State
      userProfile: null,
      updateProfile: (profile) => set({ userProfile: profile ? { ...profile, initials: profile.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U' } : null }),
      
      checkAuth: async () => {
        try {
          const res = await fetch('/api/auth/me', { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            set({ userProfile: { ...data.user, initials: data.user.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U' } });
          } else {
            set({ userProfile: null });
          }
        } catch (err) {
          console.error("Auth Check Failed:", err);
          set({ userProfile: null });
        }
      },

      logoutUser: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        } catch (err) {
          console.error("Logout Error:", err);
        }
        set({ userProfile: null });
        // Optional: clear local projects/data if required
      },

      // AI Preferences State
      aiPreferences: { model: 'Gemini 2.0 Pro (Recommended)', apiKey: '' },
      updateAiPreferences: (prefs) => set((state) => ({ aiPreferences: { ...state.aiPreferences, ...prefs } })),
      
      
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
      partialize: (state) => ({ 
        isDark: state.isDark,
        projects: state.projects,
        folders: state.folders,
        aiPreferences: state.aiPreferences
      }),
    }
  )
);
