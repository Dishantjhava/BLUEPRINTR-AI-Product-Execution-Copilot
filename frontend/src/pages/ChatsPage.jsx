import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Search, 
  MoreHorizontal, 
  FolderPlus, 
  ListFilter, 
  ChevronDown, 
  CircleDashed 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ChatsPage = () => {
  const { isDark, projects, setBlueprint } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-full p-8 transition-colors ${isDark ? 'bg-[#000000] text-white' : 'bg-[#F9FAFB] text-gray-900'}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Title */}
        <h1 className="text-3xl font-bold tracking-tight">Chats</h1>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors ${
            isDark ? 'bg-[#0A0A0A] border-[#222222] focus-within:border-gray-600' : 'bg-white border-gray-200 focus-within:border-indigo-500'
          }`}>
            <Search size={18} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-sm placeholder-gray-500"
            />
          </div>

          {/* Options Button */}
          <button className={`p-2 rounded-lg border transition-colors ${
            isDark ? 'bg-[#0A0A0A] border-[#222222] hover:bg-[#111111]' : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}>
            <MoreHorizontal size={18} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
          </button>

          {/* Folder Button */}
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors font-medium text-sm ${
            isDark ? 'bg-[#0A0A0A] border-[#222222] hover:bg-[#111111]' : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}>
            <FolderPlus size={16} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
            Folder
          </button>
        </div>

        {/* Filter Button */}
        <div>
          <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors text-sm font-medium ${
            isDark ? 'bg-transparent border-[#222222] hover:bg-[#111111] text-gray-300' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
          }`}>
            <ListFilter size={16} />
            Filter
          </button>
        </div>

        {/* Data Table */}
        <div className="mt-8">
          {/* Table Header */}
          <div className={`grid grid-cols-12 gap-4 pb-3 border-b text-sm font-medium ${isDark ? 'border-[#222222] text-gray-400' : 'border-gray-200 text-gray-500'}`}>
            <div className="col-span-5 pl-2">Name</div>
            <div className="col-span-4">Project</div>
            <div className="col-span-3 flex justify-end items-center gap-1 pr-2">
              Updated
              <ChevronDown size={14} />
            </div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col">
            {filteredProjects.length === 0 ? (
              <div className={`py-12 text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                No chats found. Try generating a new idea!
              </div>
            ) : (
              filteredProjects.map((chat) => (
                <motion.div 
                  key={chat.id}
                  onClick={() => {
                    if (chat.data) {
                      setBlueprint(chat.data);
                      navigate('/dashboard');
                    }
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`grid grid-cols-12 gap-4 items-center py-4 border-b group transition-colors cursor-pointer ${
                    isDark ? 'border-[#222222]/50 hover:bg-[#0A0A0A]' : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  {/* Name */}
                  <div className="col-span-5 pl-2 font-medium text-sm">
                    {chat.name}
                  </div>

                  {/* Project */}
                  <div className={`col-span-4 flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <CircleDashed size={16} />
                    {chat.project}
                  </div>

                  {/* Updated & Actions */}
                  <div className={`col-span-3 flex justify-end items-center gap-4 pr-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>{formatTime(chat.updated)}</span>
                    {chat.isActive && (
                      <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                    )}
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatsPage;
