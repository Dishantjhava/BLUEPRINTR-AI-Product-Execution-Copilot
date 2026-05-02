import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  FolderTree, 
  Terminal, 
  Database, 
  Layers,
  Copy,
  Check,
  Server,
  Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectStructure = ({ data }) => {
  const { isDark } = useStore();
  const [activeTab, setActiveTab] = useState('structure');
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!data) return null;

  const { structure, setupCommands, envVariables, techStack } = data;

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyEnvAll = () => {
    if (!envVariables) return;
    const text = envVariables.map(env => `# ${env.description}\n${env.key}=${env.example}`).join('\n\n');
    handleCopy(text, 'env_all');
  };

  const tabs = [
    { id: 'structure', label: 'Structure', icon: FolderTree },
    { id: 'setup', label: 'Setup', icon: Terminal },
    { id: 'env', label: 'Environment', icon: Database },
    { id: 'stack', label: 'Tech Stack', icon: Layers }
  ];

  return (
    <div className={`mt-8 rounded-2xl border overflow-hidden ${isDark ? 'bg-[#0A0A0A] border-[#222222]' : 'bg-white border-gray-200 shadow-xl'}`}>
      <div className={`p-6 border-b ${isDark ? 'border-[#222222]' : 'border-gray-100'} flex justify-between items-center`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <FolderTree size={20} />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Project Structure</h2>
            <p className="text-sm text-gray-500">Complete architectural roadmap and setup instructions.</p>
          </div>
        </div>
      </div>

      <div className={`flex border-b ${isDark ? 'border-[#222222] bg-[#111111]' : 'border-gray-100 bg-gray-50'}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? (isDark ? 'text-purple-400 bg-[#1A1A1A] border-b-2 border-purple-500' : 'text-purple-600 bg-white border-b-2 border-purple-500')
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'structure' && (
            <motion.div
              key="structure"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`rounded-xl border p-4 overflow-x-auto ${isDark ? 'bg-black border-[#222222]' : 'bg-gray-50 border-gray-200'}`}
            >
              <pre className={`text-sm font-mono leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                {structure || "No structure generated yet."}
              </pre>
            </motion.div>
          )}

          {activeTab === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {setupCommands?.map((cmd, i) => (
                <div key={i} className={`flex items-center justify-between rounded-xl border p-4 ${isDark ? 'bg-black border-[#222222]' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 font-mono text-sm">{i + 1}</span>
                    <code className={`text-sm font-mono ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{cmd}</code>
                  </div>
                  <button
                    onClick={() => handleCopy(cmd, i)}
                    className="p-2 rounded-lg text-gray-500 hover:text-white transition-colors hover:bg-white/5"
                  >
                    {copiedIndex === i ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'env' && (
            <motion.div
              key="env"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-end">
                <button
                  onClick={copyEnvAll}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-all"
                >
                  {copiedIndex === 'env_all' ? <Check size={16} /> : <Copy size={16} />}
                  Copy All for .env
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {envVariables?.map((env, i) => (
                  <div key={i} className={`rounded-xl border p-4 ${isDark ? 'bg-black border-[#222222]' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-mono text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{env.key}</span>
                      <button onClick={() => handleCopy(env.example, `env_${i}`)} className="text-gray-500 hover:text-white">
                        {copiedIndex === `env_${i}` ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{env.description}</p>
                    <code className={`text-xs p-2 rounded block ${isDark ? 'bg-white/5 text-purple-300' : 'bg-gray-100 text-purple-600'}`}>
                      {env.example}
                    </code>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'stack' && (
            <motion.div
              key="stack"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[
                { title: 'Frontend', items: techStack?.frontend, icon: Server, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { title: 'Backend', items: techStack?.backend, icon: Database, color: 'text-green-500', bg: 'bg-green-500/10' },
                { title: 'Database', items: techStack?.database, icon: Layers, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                { title: 'DevOps', items: techStack?.devops, icon: Cloud, color: 'text-pink-500', bg: 'bg-pink-500/10' }
              ].map((stack, i) => (
                <div key={i} className={`rounded-xl border p-6 ${isDark ? 'bg-[#111111] border-[#222222]' : 'bg-white border-gray-200 shadow-sm'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stack.bg} ${stack.color}`}>
                      <stack.icon size={16} />
                    </div>
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stack.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stack.items?.map((item, j) => (
                      <span key={j} className={`px-3 py-1 rounded-full text-xs font-medium border ${isDark ? 'bg-black border-white/10 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectStructure;
