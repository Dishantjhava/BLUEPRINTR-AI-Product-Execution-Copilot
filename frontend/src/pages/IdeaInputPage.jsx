import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Terminal, 
  Search,
  MessageSquare,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GenerationLoader from '../components/GenerationLoader';

const IdeaInputPage = () => {
  const [idea, setIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const { setBlueprint, isDark, addMessage, addProject, aiPreferences } = useStore();
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!idea.trim()) return;

    setIsGenerating(true);
    setError(null);
    addMessage({ role: 'user', content: `Generate blueprint for: ${idea}` });

    try {
      const response = await fetch('/api/askAI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idea, 
          customApiKey: aiPreferences?.apiKey || undefined 
        }),
      });

      const data = await response.json();
      if (data.success) {
        setBlueprint(data.solution);
        addProject({
          id: Date.now(),
          name: data.solution.product_summary?.title || idea || "Untitled Project",
          project: "Draft",
          updated: Date.now(),
          isActive: true,
          data: data.solution
        });
        addMessage({ role: 'assistant', content: `Blueprint for "${data.solution.product_summary.title}" has been generated successfully! You can view it in the dashboard.` });
        navigate('/dashboard');
      } else {
        setError(data.error || 'Failed to generate blueprint');
        addMessage({ role: 'assistant', content: `Sorry, I encountered an error: ${data.error || 'Failed to generate blueprint'}` });
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestions = [
    "A fitness app with AI coaching",
    "SaaS for freelance tax management",
    "Real-time translation for video calls",
    "AI-powered inventory for small shops"
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
      {isGenerating ? (
        <GenerationLoader />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-12"
        >
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase tracking-widest"
        >
          <Zap size={14} />
          Powered by Gemini 2.0
        </motion.div>
        
        <h1 className={`text-5xl font-bold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
          From Idea to <span className="text-indigo-500">Architecture</span> <br />
          in Seconds.
        </h1>
        <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Describe your product idea and our AI architect will generate a complete technical blueprint including features, tasks, APIs, and starter code.
        </p>
      </div>

      {/* Input Section */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <form 
          onSubmit={handleGenerate}
          className={`relative p-2 rounded-2xl border transition-all ${
            isDark ? 'bg-[#0A0A0A] border-[#222222]' : 'bg-white border-gray-200 shadow-xl'
          }`}
        >
          <div className="flex items-center gap-4 px-4 py-2">
            <Search className="text-gray-500" size={20} />
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your startup idea (e.g., A subscription coffee app for local roasters...)"
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-lg resize-none min-h-[100px] py-4 placeholder-gray-600"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
          </div>
          
          <div className={`flex items-center justify-between px-4 py-3 border-t ${
            isDark ? 'border-[#222222]' : 'border-gray-100'
          }`}>
             <div className="flex items-center gap-4">
                <button type="button" className="text-gray-500 hover:text-white transition-colors">
                  <Terminal size={18} />
                </button>
                <button type="button" className="text-gray-500 hover:text-white transition-colors">
                  <MessageSquare size={18} />
                </button>
             </div>
             
             <button
              disabled={isGenerating || !idea.trim()}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                idea.trim() 
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed shadow-none'
              }`}
             >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Architecting...
                </>
              ) : (
                <>
                  Generate Blueprint
                  <ArrowRight size={16} />
                </>
              )}
             </button>
          </div>
        </form>
      </div>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions */}
      <div className="space-y-4">
        <div className={`text-xs font-bold uppercase tracking-widest text-center ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          Popular Templates
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setIdea(s)}
              className={`px-4 py-2 rounded-full border text-sm transition-all ${
                isDark 
                  ? 'bg-[#111111] border-[#222222] text-gray-400 hover:text-white hover:border-gray-500' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      
      {/* Footer Info */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t ${isDark ? 'border-[#222222]' : 'border-gray-200'}`}>
        {[
          { icon: Lightbulb, title: 'Ideation', desc: 'Refine your raw idea with AI-driven market insights.' },
          { icon: Terminal, title: 'Architecture', desc: 'Get full-stack schemas, APIs, and boilerplate code.' },
          { icon: Rocket, title: 'Execution', desc: 'Export your blueprint and start building immediately.' },
        ].map((item, i) => (
          <div key={i} className="text-center space-y-3">
            <div className={`mx-auto w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-white/5 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
            }`}>
              <item.icon size={20} />
            </div>
            <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
      </motion.div>
      )}
    </div>
  );
};

export default IdeaInputPage;
