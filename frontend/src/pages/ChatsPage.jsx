import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { 
  Search, 
  MoreHorizontal, 
  FolderPlus, 
  ListFilter, 
  ChevronDown, 
  CircleDashed,
  X,
  Folder,
  Edit2,
  Trash2,
  Check,
  Inbox,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ChatsPage = () => {
  const { 
    isDark, 
    projects, 
    folders, 
    setBlueprint, 
    addFolder, 
    renameProject, 
    moveProjectToFolder, 
    deleteProject,
    deleteMultipleProjects,
    moveMultipleProjects
  } = useStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Modals & Dropdowns State
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [optionsDropdownOpen, setOptionsDropdownOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  const [perChatDropdownId, setPerChatDropdownId] = useState(null);
  const [moveToFolderId, setMoveToFolderId] = useState(null);
  
  // Rename State
  const [renameChatId, setRenameChatId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  // Bulk Actions State
  const [selectedChatIds, setSelectedChatIds] = useState([]);
  const [bulkMoveDropdownOpen, setBulkMoveDropdownOpen] = useState(false);

  // Filtering & Sorting State
  const [activeFilter, setActiveFilter] = useState('All'); 
  const [sortOrder, setSortOrder] = useState('Newest'); 

  // Format Time Helper
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

  // Close dropdowns on outside click
  const closeAllDropdowns = () => {
    setFilterDropdownOpen(false);
    setOptionsDropdownOpen(false);
    setPerChatDropdownId(null);
    setMoveToFolderId(null);
    setBulkMoveDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = () => closeAllDropdowns();
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Filter and Sort Logic
  let processedProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (activeFilter === 'Active') {
    processedProjects = processedProjects.filter(p => p.isActive);
  } else if (activeFilter === 'Drafts') {
    processedProjects = processedProjects.filter(p => p.project === 'Draft');
  } else if (activeFilter !== 'All') {
    processedProjects = processedProjects.filter(p => p.project === activeFilter);
  }

  processedProjects.sort((a, b) => {
    if (sortOrder === 'Newest') return (b.updated || 0) - (a.updated || 0);
    if (sortOrder === 'Oldest') return (a.updated || 0) - (b.updated || 0);
    if (sortOrder === 'A-Z') return a.name.localeCompare(b.name);
    if (sortOrder === 'Z-A') return b.name.localeCompare(a.name);
    return 0;
  });

  // Action Handlers
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName('');
      setFolderModalOpen(false);
    }
  };

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    if (renameValue.trim() && renameChatId) {
      renameProject(renameChatId, renameValue.trim());
    }
    setRenameChatId(null);
    setRenameValue('');
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      deleteProject(id);
      setSelectedChatIds(prev => prev.filter(cId => cId !== id));
    }
    setPerChatDropdownId(null);
  };

  // Bulk Handlers
  const toggleSelection = (id, e) => {
    e.stopPropagation();
    setSelectedChatIds(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedChatIds.length === processedProjects.length) {
      setSelectedChatIds([]);
    } else {
      setSelectedChatIds(processedProjects.map(p => p.id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedChatIds.length} chats?`)) {
      deleteMultipleProjects(selectedChatIds);
      setSelectedChatIds([]);
    }
  };

  const handleBulkMove = (folder) => {
    moveMultipleProjects(selectedChatIds, folder);
    setBulkMoveDropdownOpen(false);
    setSelectedChatIds([]);
  };

  return (
    <div className={`min-h-full p-8 transition-colors ${isDark ? 'bg-[#000000] text-white' : 'bg-[#F9FAFB] text-gray-900'}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Title */}
        <h1 className="text-3xl font-bold tracking-tight">Chats</h1>

        {/* Toolbar Area */}
        <div className="relative h-[42px]">
          <AnimatePresence mode="wait">
            {selectedChatIds.length > 0 ? (
              <motion.div 
                key="bulk"
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className={`absolute inset-0 flex items-center justify-between px-4 rounded-lg border ${
                  isDark ? 'bg-[#111] border-[#333]' : 'bg-indigo-50 border-indigo-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedChatIds([])} className={`p-1 rounded hover:bg-gray-500/20`}><X size={16}/></button>
                  <span className={`text-sm font-medium ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>
                    {selectedChatIds.length} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setBulkMoveDropdownOpen(!bulkMoveDropdownOpen); }}
                      className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        isDark ? 'hover:bg-[#222] text-gray-300' : 'hover:bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      <FolderPlus size={16} /> Move
                    </button>
                    {bulkMoveDropdownOpen && (
                      <div className={`absolute right-0 top-full mt-1 w-48 rounded-lg shadow-xl border z-50 py-1 ${
                        isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-gray-200'
                      }`}>
                        <button onClick={() => handleBulkMove('Draft')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-500/10">
                          Draft (Remove folder)
                        </button>
                        {folders.map(folder => (
                          <button key={folder} onClick={() => handleBulkMove(folder)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-500/10">
                            {folder}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="normal"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute inset-0 flex items-center gap-3"
              >
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
                <div className="relative">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setOptionsDropdownOpen(!optionsDropdownOpen); setFilterDropdownOpen(false); }}
                    className={`p-2 rounded-lg border transition-colors ${
                      isDark ? 'bg-[#0A0A0A] border-[#222222] hover:bg-[#111111]' : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <MoreHorizontal size={18} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                  </button>
                  <AnimatePresence>
                    {optionsDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl border z-50 overflow-hidden ${
                          isDark ? 'bg-[#111111] border-[#222222]' : 'bg-white border-gray-200'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className={`px-3 py-2 text-xs font-semibold uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Sort By</div>
                        {['Newest', 'Oldest', 'A-Z', 'Z-A'].map(sort => (
                          <button key={sort} onClick={() => { setSortOrder(sort); setOptionsDropdownOpen(false); }}
                            className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-500/10 ${sortOrder === sort ? 'font-medium' : ''}`}>
                            {sort} {sortOrder === sort && <Check size={14} />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Folder Button */}
                <button 
                  onClick={() => setFolderModalOpen(true)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors font-medium text-sm ${
                    isDark ? 'bg-[#0A0A0A] border-[#222222] hover:bg-[#111111]' : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}>
                  <FolderPlus size={16} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                  Folder
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filter Button */}
        <div className="relative inline-block mt-4">
          <button 
            onClick={(e) => { e.stopPropagation(); setFilterDropdownOpen(!filterDropdownOpen); setOptionsDropdownOpen(false); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors text-sm font-medium ${
              isDark ? 'bg-transparent border-[#222222] hover:bg-[#111111] text-gray-300' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
            }`}>
            <ListFilter size={16} />
            Filter {activeFilter !== 'All' && <span className="ml-1 w-2 h-2 rounded-full bg-indigo-500"></span>}
          </button>
          
          <AnimatePresence>
            {filterDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                className={`absolute left-0 top-full mt-2 w-48 rounded-lg shadow-xl border z-50 overflow-hidden ${
                  isDark ? 'bg-[#111111] border-[#222222]' : 'bg-white border-gray-200'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`px-3 py-2 text-xs font-semibold uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Status</div>
                {['All', 'Active', 'Drafts'].map(filter => (
                  <button key={filter} onClick={() => { setActiveFilter(filter); setFilterDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-500/10 ${activeFilter === filter ? 'font-medium' : ''}`}>
                    {filter} {activeFilter === filter && <Check size={14} />}
                  </button>
                ))}
                
                {folders.length > 0 && (
                  <>
                    <div className={`px-3 py-2 mt-1 border-t text-xs font-semibold uppercase ${isDark ? 'border-[#222] text-gray-500' : 'border-gray-200 text-gray-400'}`}>Folders</div>
                    {folders.map(folder => (
                      <button key={folder} onClick={() => { setActiveFilter(folder); setFilterDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-500/10 ${activeFilter === folder ? 'font-medium' : ''}`}>
                        {folder} {activeFilter === folder && <Check size={14} />}
                      </button>
                    ))}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Data Table */}
        <div className="mt-8">
          {/* Table Header */}
          <div className={`grid grid-cols-12 gap-4 pb-3 border-b text-sm font-medium ${isDark ? 'border-[#222222] text-gray-400' : 'border-gray-200 text-gray-500'}`}>
            <div className="col-span-5 pl-2 flex items-center gap-3">
              <button 
                onClick={selectAll}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  selectedChatIds.length > 0 ? (selectedChatIds.length === processedProjects.length ? 'bg-indigo-500 border-indigo-500' : 'bg-indigo-500/50 border-indigo-500/50') 
                  : (isDark ? 'border-[#444]' : 'border-gray-300')
                }`}
              >
                {selectedChatIds.length > 0 && <Check size={12} className="text-white" />}
              </button>
              Name
            </div>
            <div className="col-span-4">Project</div>
            <div className="col-span-3 flex justify-end items-center gap-1 pr-2">
              Updated
              <ChevronDown size={14} />
            </div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col">
            {processedProjects.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="py-20 flex flex-col items-center justify-center text-center"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-[#111]' : 'bg-gray-100'}`}>
                  <Inbox size={32} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                </div>
                <h3 className={`text-lg font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>No chats found</h3>
                <p className={`text-sm mb-6 max-w-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  We couldn't find any chats matching your filters. Generate a new blueprint idea to get started.
                </p>
                <button 
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus size={16} />
                  Generate New Idea
                </button>
              </motion.div>
            ) : (
              processedProjects.map((chat) => {
                const isSelected = selectedChatIds.includes(chat.id);
                // Try to extract a brief description
                const previewText = chat.data?.description 
                  || (chat.messages && chat.messages.length > 1 ? chat.messages[1].content.substring(0, 50) + "..." : null)
                  || "Started a new blueprint session";

                return (
                  <motion.div 
                    key={chat.id}
                    onClick={() => {
                      if (chat.data && !renameChatId && !isSelected) {
                        setBlueprint(chat.data);
                        navigate('/dashboard');
                      }
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative grid grid-cols-12 gap-4 items-center py-4 border-b group transition-colors cursor-pointer ${
                      isSelected 
                        ? (isDark ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200') 
                        : (isDark ? 'border-[#222222]/50 hover:bg-[#0A0A0A]' : 'border-gray-100 hover:bg-gray-50')
                    }`}
                  >
                    {/* Name & Checkbox */}
                    <div className="col-span-5 pl-2 flex items-start gap-3">
                      <div className="pt-1">
                        <button 
                          onClick={(e) => toggleSelection(chat.id, e)}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isSelected 
                            ? 'bg-indigo-500 border-indigo-500' 
                            : (isDark ? 'border-[#444] group-hover:border-gray-500' : 'border-gray-300 group-hover:border-gray-400')
                          }`}
                        >
                          {isSelected && <Check size={12} className="text-white" />}
                        </button>
                      </div>
                      
                      <div className="flex flex-col overflow-hidden w-full">
                        {renameChatId === chat.id ? (
                          <form onSubmit={handleRenameSubmit} onClick={e => e.stopPropagation()} className="flex items-center gap-2 pr-4">
                            <input 
                              autoFocus
                              type="text" 
                              value={renameValue} 
                              onChange={(e) => setRenameValue(e.target.value)}
                              className={`px-2 py-1 rounded border text-sm w-full ${isDark ? 'bg-[#111] border-[#333]' : 'bg-white border-gray-300'}`}
                            />
                            <button type="submit" className="text-green-500"><Check size={16}/></button>
                            <button type="button" onClick={() => setRenameChatId(null)} className="text-red-500"><X size={16}/></button>
                          </form>
                        ) : (
                          <>
                            <span className="font-medium text-sm truncate">{chat.name}</span>
                            <span className={`text-xs truncate mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                              {previewText}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Project */}
                    <div className={`col-span-4 flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {chat.project !== 'Draft' ? <Folder size={14} className="text-indigo-400" /> : <CircleDashed size={16} />}
                      {chat.project}
                    </div>

                    {/* Updated & Actions */}
                    <div className={`col-span-3 flex justify-end items-center gap-4 pr-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>{formatTime(chat.updated)}</span>
                      {chat.isActive && (
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                      )}
                      
                      <div className="relative flex items-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            closeAllDropdowns();
                            setPerChatDropdownId(perChatDropdownId === chat.id ? null : chat.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-500/20"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {perChatDropdownId === chat.id && (
                          <div 
                            className={`absolute right-0 top-full mt-1 w-40 rounded-lg shadow-xl border z-50 py-1 ${
                              isDark ? 'bg-[#111111] border-[#222222]' : 'bg-white border-gray-200'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button 
                              onClick={() => {
                                setRenameChatId(chat.id);
                                setRenameValue(chat.name);
                                setPerChatDropdownId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-500/10"
                            >
                              <Edit2 size={14} /> Rename
                            </button>
                            
                            <div className="relative">
                              <button 
                                onClick={() => setMoveToFolderId(moveToFolderId === chat.id ? null : chat.id)}
                                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-500/10"
                              >
                                <FolderPlus size={14} /> Move to...
                              </button>
                              
                              {moveToFolderId === chat.id && (
                                <div className={`absolute right-full top-0 mr-1 w-40 rounded-lg shadow-xl border z-50 py-1 ${
                                  isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-gray-50 border-gray-200'
                                }`}>
                                  <button 
                                    onClick={() => { moveProjectToFolder(chat.id, 'Draft'); setPerChatDropdownId(null); }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-500/10"
                                  >
                                    Draft (Remove from folder)
                                  </button>
                                  {folders.map(folder => (
                                    <button 
                                      key={folder}
                                      onClick={() => { moveProjectToFolder(chat.id, folder); setPerChatDropdownId(null); }}
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-500/10"
                                    >
                                      {folder}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className={`border-t my-1 ${isDark ? 'border-[#333]' : 'border-gray-200'}`}></div>
                            <button 
                              onClick={(e) => handleDelete(chat.id, e)}
                              className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-red-500/10 text-red-500"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Create Folder Modal */}
      <AnimatePresence>
        {folderModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-sm rounded-xl border p-6 shadow-2xl ${isDark ? 'bg-[#111111] border-[#333333]' : 'bg-white border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Create New Folder</h3>
                <button onClick={() => setFolderModalOpen(false)} className={`p-1 rounded-md hover:bg-gray-500/20`}>
                  <X size={18} />
                </button>
              </div>
              <input 
                autoFocus
                type="text" 
                placeholder="Folder name" 
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter') handleCreateFolder(); }}
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                  isDark ? 'bg-[#0A0A0A] border-[#333] text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setFolderModalOpen(false)} className={`px-4 py-2 text-sm font-medium rounded-lg ${isDark ? 'hover:bg-[#222]' : 'hover:bg-gray-100'}`}>Cancel</button>
                <button onClick={handleCreateFolder} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Create Folder</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatsPage;
