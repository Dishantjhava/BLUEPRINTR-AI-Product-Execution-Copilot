import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode, Database } from 'lucide-react';
import { useStore } from '../../store/useStore';

const CodePreview = ({ code }) => {
  const { isDark } = useStore();
  const [activeFile, setActiveFile] = useState('backend');
  const [copied, setCopied] = useState(false);

  const files = [
    { id: 'backend', label: 'app.js', icon: Terminal },
    { id: 'routes', label: 'routes.js', icon: FileCode },
    { id: 'models', label: 'models.js', icon: Database },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(code[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      isDark ? 'bg-card-dark border-white/5' : 'bg-card-light border-gray-200'
    }`}>
      {/* File Tabs */}
      <div className={`flex items-center justify-between px-4 border-b ${
        isDark ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex overflow-x-auto no-scrollbar">
          {files.map((file) => (
            <button
              key={file.id}
              onClick={() => setActiveFile(file.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-medium transition-all relative ${
                activeFile === file.id 
                  ? (isDark ? 'text-white' : 'text-gray-900') 
                  : (isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600')
              }`}
            >
              <file.icon size={14} />
              {file.label}
              {activeFile === file.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
          ))}
        </div>
        
        <button 
          onClick={handleCopy}
          className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded transition-all ${
            isDark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Code Area */}
      <div className={`p-6 overflow-x-auto custom-scrollbar font-mono text-[13px] leading-relaxed min-h-[300px] ${
        isDark ? 'bg-[#0f172a] text-indigo-300/80' : 'bg-[#f8fafc] text-slate-600'
      }`}>
        <pre>
          <code>{code[activeFile]}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodePreview;
