import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  User, 
  Settings, 
  Palette, 
  Cpu, 
  Key, 
  Moon, 
  Sun,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const { isDark, toggleTheme, userProfile, updateProfile, aiPreferences, updateAiPreferences } = useStore();
  const [profileForm, setProfileForm] = useState({ name: userProfile.name, email: userProfile.email });

  const Section = ({ title, icon: Icon, children }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0A0A0A] border-[#222222]' : 'bg-white border-gray-200 shadow-sm'}`}
    >
      <div className="flex items-center gap-3 mb-6 min-w-0">
        <div className={`p-2 rounded-lg flex-shrink-0 ${isDark ? 'bg-[#111111] text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
          <Icon size={20} />
        </div>
        <h2 className="text-xl font-bold tracking-tight truncate">{title}</h2>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </motion.div>
  );

  return (
    <div className={`min-h-full p-8 transition-colors ${isDark ? 'bg-[#000000] text-white' : 'bg-[#F9FAFB] text-gray-900'}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Manage your account, appearance, and AI preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Settings Content */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            
            <Section title="Account Profile" icon={User}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                  {userProfile.initials}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{userProfile.name}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{userProfile.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Display Name</label>
                  <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${isDark ? 'bg-[#111111] border-[#333333] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                  <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${isDark ? 'bg-[#111111] border-[#333333] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                </div>
                <button onClick={() => updateProfile(profileForm)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors text-sm">Save Changes</button>
              </div>
            </Section>

            <Section title="AI Preferences" icon={Cpu}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Default AI Model</label>
                  <select value={aiPreferences.model} onChange={(e) => updateAiPreferences({ model: e.target.value })} className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${isDark ? 'bg-[#111111] border-[#333333] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                    <option>Gemini 2.0 Pro (Recommended)</option>
                    <option>Gemini 1.5 Flash</option>
                    <option>GPT-4o</option>
                    <option>Claude 3.5 Sonnet</option>
                  </select>
                </div>
                <div>
                  <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Key size={16} /> Custom API Key (Optional)
                  </label>
                  <input type="password" value={aiPreferences.apiKey} onChange={(e) => updateAiPreferences({ apiKey: e.target.value })} placeholder="sk-..." className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${isDark ? 'bg-[#111111] border-[#333333] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>If provided, we will use your API key for generation requests instead of our internal balance.</p>
                </div>
              </div>
            </Section>

          </div>

          {/* Sidebar Settings Content */}
          <div className="space-y-6">
            
            <Section title="Appearance" icon={Palette}>
              <div className={`p-5 rounded-xl border flex flex-col gap-4 ${isDark ? 'bg-[#111111] border-[#333333]' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  {isDark ? <Moon size={24} className="text-indigo-400 flex-shrink-0" /> : <Sun size={24} className="text-orange-500 flex-shrink-0" />}
                  <div>
                    <h4 className="font-bold text-base">Theme</h4>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{isDark ? 'Currently Dark Mode' : 'Currently Light Mode'}</p>
                  </div>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`w-full py-2.5 rounded-lg flex items-center justify-center font-medium transition-all ${
                    isDark ? 'bg-[#222222] hover:bg-[#333333] text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  Switch to {isDark ? 'Light' : 'Dark'} Mode
                </button>
              </div>
            </Section>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center gap-4 ${isDark ? 'bg-[#0A0A0A] border-red-900/30' : 'bg-white border-gray-200 shadow-sm'}`}
            >
              <div className="p-3 rounded-full bg-red-500/10 text-red-500">
                <LogOut size={24} />
              </div>
              <div>
                <h3 className="font-bold">Sign Out</h3>
                <p className={`text-sm mt-1 mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Are you sure you want to log out of your account?</p>
                <button className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg font-medium transition-colors text-sm border border-red-500/20">
                  Sign Out
                </button>
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
