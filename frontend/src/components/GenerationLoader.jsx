import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Terminal, Database, Server, Layout } from 'lucide-react';

const GenerationLoader = () => {
  const { isDark } = useStore();
  const [textIndex, setTextIndex] = useState(0);

  const loadingPhrases = [
    "Analyzing your idea...",
    "Designing database schema...",
    "Architecting APIs...",
    "Drafting UI components...",
    "Generating starter code...",
    "Building project structure...",
    "Finalizing blueprint..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full max-w-4xl mx-auto min-h-[60vh] flex flex-col items-center justify-center space-y-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      
      {/* Animated Mock Interface */}
      <div className="relative w-full max-w-3xl aspect-[16/9] flex items-center justify-center">
        {/* Glow effect behind */}
        <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full animate-pulse-subtle"></div>
        
        {/* Main Editor Window */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative z-10 w-full h-full rounded-xl border flex flex-col overflow-hidden shadow-2xl ${
            isDark ? 'bg-[#0A0A0A] border-[#222222]' : 'bg-white border-gray-200'
          }`}
        >
          {/* Header */}
          <div className={`h-10 flex items-center px-4 gap-2 border-b ${isDark ? 'border-[#222222] bg-[#111111]' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex-1 text-center">
              <div className={`inline-block px-3 py-1 rounded-md text-xs font-mono ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                /blueprint/generating...
              </div>
            </div>
          </div>
          
          {/* Editor Body */}
          <div className="flex-1 p-6 flex flex-col gap-4">
            <div className={`h-4 w-3/4 rounded animate-pulse-subtle ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}></div>
            <div className={`h-4 w-1/2 rounded animate-pulse-subtle delay-75 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}></div>
            <div className={`h-4 w-5/6 rounded animate-pulse-subtle delay-150 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}></div>
            
            <div className="mt-8 flex gap-4">
               {/* Skeleton Panels */}
               <div className={`flex-1 rounded-lg border p-4 ${isDark ? 'border-[#222222] bg-[#111111]' : 'border-gray-200 bg-gray-50'}`}>
                 <div className="flex items-center gap-2 mb-4">
                   <Server size={16} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                   <div className={`h-3 w-20 rounded ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                 </div>
                 <div className="space-y-2">
                   <div className={`h-2 w-full rounded ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                   <div className={`h-2 w-4/5 rounded ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                   <div className={`h-2 w-full rounded ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                 </div>
               </div>
               <div className={`flex-1 rounded-lg border p-4 ${isDark ? 'border-[#222222] bg-[#111111]' : 'border-gray-200 bg-gray-50'}`}>
                 <div className="flex items-center gap-2 mb-4">
                   <Database size={16} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                   <div className={`h-3 w-20 rounded ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                 </div>
                 <div className="space-y-2">
                   <div className={`h-2 w-full rounded ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                   <div className={`h-2 w-3/4 rounded ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                   <div className={`h-2 w-5/6 rounded ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Typing Animation */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-xl font-medium tracking-tight">
          <motion.span
            key={textIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {loadingPhrases[textIndex]}
          </motion.span>
          <span className="w-2 h-5 bg-indigo-500 animate-blink"></span>
        </div>
        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Our AI architect is building your application structure
        </p>
      </div>
      
    </div>
  );
};

export default GenerationLoader;
