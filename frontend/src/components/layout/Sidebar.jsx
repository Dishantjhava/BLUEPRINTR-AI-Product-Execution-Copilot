import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Settings, 
  Moon, 
  Sun, 
  ChevronLeft,
  Command,
  PlusCircle,
  History,
  HelpCircle
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { isDark, toggleTheme, isSidebarOpen, toggleSidebar } = useStore();
  const location = useLocation();

  const navItems = [
    { icon: Lightbulb, label: 'New Idea', path: '/' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: History, label: 'History', path: '/history' },
  ];

  const bottomItems = [
    { icon: HelpCircle, label: 'Support', path: '/support' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarOpen ? 260 : 80 }}
      className={`flex flex-col h-screen border-r transition-colors duration-300 ${
        isDark 
          ? 'bg-[#0B0F19] border-white/5 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Command size={18} />
          </div>
          {isSidebarOpen && (
            <span className="font-bold tracking-tight text-lg">BLUEPRINTR</span>
          )}
        </Link>
        {isSidebarOpen && (
          <button 
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all group ${
              location.pathname === item.path 
                ? 'active-nav-item' 
                : 'hover:bg-white/5 text-gray-500 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            {!isSidebarOpen && (
              <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {item.label}
              </div>
            )}
          </Link>
        ))}
        
        {isSidebarOpen && (
          <div className="pt-6 pb-2 px-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20">
              <PlusCircle size={18} />
              New Project
            </button>
          </div>
        )}
      </div>

      {/* Auth & System Items */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <Link
          to="/signin"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group"
        >
          <div className="w-5 h-5 flex items-center justify-center">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          </div>
          {isSidebarOpen && <span className="font-medium text-sm">Sign In</span>}
        </Link>
        
        <Link
          to="/signup"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all group"
        >
          <div className="w-5 h-5 flex items-center justify-center">
             <PlusCircle size={18} />
          </div>
          {isSidebarOpen && <span className="font-bold text-sm">Sign Up</span>}
        </Link>

        <div className="my-2 border-t border-white/5" />

        {bottomItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group"
          >
            <item.icon size={20} />
            {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
          </Link>
        ))}
        
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          {isSidebarOpen && (
            <span className="font-medium text-sm">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
