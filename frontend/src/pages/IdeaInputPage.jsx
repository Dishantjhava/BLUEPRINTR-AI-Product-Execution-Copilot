import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import {
  ArrowRight, Zap, Terminal, Search,
  MessageSquare, Lightbulb, Rocket,
  Clock, FolderOpen, ChevronRight, Layers,
  Star, Shield, Code2, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import GenerationLoader from '../components/GenerationLoader';

// ── Fake avatar seeds for social proof ──────────────────────────────────
const AVATARS = [
  { initials: 'AK', color: 'from-violet-500 to-indigo-500' },
  { initials: 'SR', color: 'from-pink-500 to-rose-500' },
  { initials: 'MJ', color: 'from-cyan-500 to-teal-500' },
  { initials: 'PL', color: 'from-amber-500 to-orange-500' },
  { initials: 'TN', color: 'from-emerald-500 to-green-500' },
];

const HOW_IT_WORKS = [
  { step: '1️⃣', title: 'Describe your idea',     desc: 'Tell us what you want to build in plain English.' },
  { step: '2️⃣', title: 'AI generates your full blueprint',     desc: 'We instantly architect the schemas, APIs, and stack.' },
  { step: '3️⃣', title: 'Start building immediately',  desc: 'Export the plan and start writing code immediately.' },
];

const SUGGESTIONS = [
  'A fitness app with AI coaching',
  'SaaS for freelance tax management',
  'Real-time translation for video calls',
  'AI-powered inventory for small shops',
];

// ────────────────────────────────────────────────────────────────────────
const IdeaInputPage = () => {
  const [idea, setIdea]           = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError]         = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const {
    setBlueprint, isDark, addMessage, addProject,
    aiPreferences, projects, userProfile,
  } = useStore();

  const navigate = useNavigate();
  const isLoggedIn = !!userProfile;

  // ── Greeting ────────────────────────────────────────────────────────
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);
  const firstName = userProfile?.name?.split(' ')[0] || null;

  // ── Recent projects ─────────────────────────────────────────────────
  const recentProjects = useMemo(() =>
    [...projects].sort((a, b) => b.updated - a.updated).slice(0, 3),
    [projects]
  );

  // ── Generate handler ─────────────────────────────────────────────────
  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!idea.trim()) return;
    setIsGenerating(true);
    setError(null);
    addMessage({ role: 'user', content: `Generate blueprint for: ${idea}` });
    try {
      const res  = await fetch('/api/askAI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, customApiKey: aiPreferences?.apiKey || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setBlueprint(data.solution);
        addProject({
          id:       Date.now(),
          name:     data.solution.product_summary?.title || idea || 'Untitled Project',
          project:  'Draft',
          updated:  Date.now(),
          isActive: true,
          data:     data.solution,
        });
        addMessage({ role: 'assistant', content: `Blueprint for "${data.solution.product_summary.title}" generated! View it in the dashboard.` });
        // Logged-out: intercept and show save-prompt modal
        if (!isLoggedIn) {
          setShowSaveModal(true);
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.error || 'Failed to generate blueprint');
        addMessage({ role: 'assistant', content: `Error: ${data.error || 'Failed to generate blueprint'}` });
      }
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20">
        <GenerationLoader />
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // LOGGED-OUT  →  Landing page experience
  // ════════════════════════════════════════════════════════════════════
  if (!isLoggedIn) {
    return (
      <>
      {/* Save Blueprint Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className={`w-full max-w-md rounded-2xl border p-8 text-center space-y-6 shadow-2xl ${
                isDark ? 'bg-[#0f0f0f] border-white/10' : 'bg-white border-gray-200'
              }`}
            >
              <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                <span className="text-3xl">🎉</span>
              </div>
              <div className="space-y-2">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Your blueprint is ready!
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Create a free account to save it permanently, access your dashboard, and generate unlimited blueprints.
                </p>
              </div>
              <div className="space-y-3">
                <Link
                  to="/signup"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/25"
                >
                  Create free account <ArrowRight size={15} />
                </Link>
                <button
                  onClick={() => { setShowSaveModal(false); navigate('/dashboard'); }}
                  className={`w-full px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  View blueprint without saving
                </button>
              </div>
              <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                No credit card required · Free forever plan available
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-6 py-14 space-y-14"
      >
        {/* ── Sticky sign-in banner ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center justify-between gap-4 px-5 py-3 rounded-xl border ${
            isDark
              ? 'bg-indigo-500/5 border-indigo-500/20 text-gray-300'
              : 'bg-indigo-50 border-indigo-100 text-gray-700'
          }`}
        >
          <p className="text-sm">
            <span className="font-semibold">Sign in to save your blueprints</span>
            <span className={`ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              — your work disappears on refresh without an account.
            </span>
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              to="/signin"
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                isDark ? 'text-gray-300 hover:text-white hover:bg-white/10 border border-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-white border border-gray-200'
              }`}
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              Sign up free
            </Link>
          </div>
        </motion.div>
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase tracking-widest"
          >
            <Zap size={13} />
            Powered by Gemini 2.0
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={`text-5xl sm:text-6xl font-bold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Turn any idea into a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              production blueprint
            </span>
            <br />in seconds.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            BLUEPRINTR uses AI to generate complete technical blueprints — features, APIs, schemas,
            and starter code — from a single sentence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              to="/signup"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              Start for free <ArrowRight size={15} />
            </Link>
            <Link
              to="/signin"
              className={`px-6 py-3 rounded-xl border font-semibold text-sm transition-all hover:-translate-y-0.5 ${
                isDark
                  ? 'border-white/10 text-gray-300 hover:bg-white/5'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
              }`}
            >
              Sign in
            </Link>
          </motion.div>
        </div>

        {/* ── Social proof bar ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 py-5 px-6 rounded-2xl border ${
            isDark ? 'bg-white/[0.02] border-white/[0.07]' : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          {/* Stacked avatars */}
          <div className="flex -space-x-2.5">
            {AVATARS.map((a) => (
              <div
                key={a.initials}
                className={`w-8 h-8 rounded-full bg-gradient-to-tr ${a.color} flex items-center justify-center text-[10px] font-bold text-white ring-2 ${isDark ? 'ring-[#111]' : 'ring-white'}`}
              >
                {a.initials}
              </div>
            ))}
          </div>

          {/* Copy */}
          <div className="text-center sm:text-left">
            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ✨ Join <span className="text-indigo-500">1,200+</span> developers
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              who have blueprinted their ideas — from indie hackers to startup founders
            </p>
          </div>

          {/* Trust badges */}
          <div className={`flex items-center gap-4 text-xs font-medium sm:ml-auto ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <span className="flex items-center gap-1"><Shield size={12} className="text-emerald-500" /> Secure</span>
            <span className="flex items-center gap-1"><Star size={12} className="text-amber-400" /> 4.9 / 5</span>
            <span className="flex items-center gap-1"><Code2 size={12} className="text-indigo-400" /> Open Source</span>
          </div>
        </motion.div>

        {/* ── Input box (try it without signing in) ──────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3"
        >
          <p className={`text-center text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            Try it now — no account needed
          </p>
          <InputBox
            idea={idea} setIdea={setIdea}
            handleGenerate={handleGenerate}
            isGenerating={isGenerating}
            isDark={isDark}
          />
        </motion.div>

        {/* ── Error ──────────────────────────────────────────────────── */}
        <AnimatePresence>
          {error && <ErrorBanner message={error} />}
        </AnimatePresence>

        {/* ── Suggestion pills ───────────────────────────────────────── */}
        <SuggestionPills suggestions={SUGGESTIONS} setIdea={setIdea} isDark={isDark} />

        {/* ── How it works ───────────────────────────────────────────── */}
        <div className="space-y-6 pt-10">
          <div className={`text-center text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            How BLUEPRINTR works
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item, i) => (
              <StepCard key={i} {...item} isDark={isDark} />
            ))}
          </div>
        </div>

        {/* ── Testimonial strip ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { quote: 'Saved me 3 days of architecture planning.', author: 'Arjun K.', role: 'Indie Hacker' },
            { quote: 'The starter code alone is worth it. Incredible tool.', author: 'Simran R.', role: 'Full-stack Dev' },
            { quote: 'Pitched my investor with the PDF export. They were impressed.', author: 'Mark J.', role: 'Startup Founder' },
          ].map(({ quote, author, role }) => (
            <div
              key={author}
              className={`p-4 rounded-xl border text-sm space-y-3 ${
                isDark ? 'bg-white/[0.02] border-white/[0.07]' : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className={`italic leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>"{quote}"</p>
              <div>
                <p className={`font-semibold text-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>{author}</p>
                <p className={`text-[11px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{role}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
      </>
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // LOGGED-IN  →  Dashboard experience
  // ════════════════════════════════════════════════════════════════════
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-6 py-14 space-y-10"
    >
      {/* ── Greeting ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="text-center space-y-1"
      >
        <p className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {greeting}, {firstName} 👋
        </p>
        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Ready to build something new?
        </p>
      </motion.div>

      {/* ── Recent Projects ──────────────────────────────────────────── */}
      {recentProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={13} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
              <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Recent Projects
              </span>
            </div>
            <button
              onClick={() => navigate('/chats')}
              className={`flex items-center gap-1 text-xs font-medium transition-colors ${isDark ? 'text-gray-500 hover:text-indigo-400' : 'text-gray-400 hover:text-indigo-600'}`}
            >
              View all <ChevronRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentProjects.map((project, i) => {
              const featureCount = project.data?.features?.length ?? 0;
              const domain  = project.project || 'Draft';
              const dateStr = project.updated
                ? new Date(project.updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : '—';
              return (
                <motion.button
                  key={project.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.06 }}
                  onClick={() => { if (project.data) { setBlueprint(project.data); navigate('/dashboard'); } }}
                  className={`group text-left p-4 rounded-xl border transition-all duration-200 ${
                    isDark
                      ? 'bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.07] hover:border-indigo-500/30'
                      : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                      <Layers size={15} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                      {domain}
                    </span>
                  </div>
                  <p className={`text-sm font-semibold leading-tight mb-2 line-clamp-2 group-hover:text-indigo-500 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {project.name}
                  </p>
                  <div className={`flex items-center justify-between text-[11px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    <span>{dateStr}</span>
                    {featureCount > 0 && (
                      <span className="flex items-center gap-1">
                        <FolderOpen size={10} />{featureCount} features
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Compact hero ─────────────────────────────────────────────── */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase tracking-widest">
          <Zap size={13} /> Powered by Gemini 2.0
        </div>
        <h1 className={`text-4xl font-bold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
          From Idea to <span className="text-indigo-500">Architecture</span> in Seconds.
        </h1>
        <p className={`text-base max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Describe your product idea and get a full technical blueprint instantly.
        </p>
      </div>

      {/* ── Input box ────────────────────────────────────────────────── */}
      <InputBox
        idea={idea} setIdea={setIdea}
        handleGenerate={handleGenerate}
        isGenerating={isGenerating}
        isDark={isDark}
      />

      {/* ── Error ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {error && <ErrorBanner message={error} />}
      </AnimatePresence>

      {/* ── Suggestion pills ─────────────────────────────────────────── */}
      <SuggestionPills suggestions={SUGGESTIONS} setIdea={setIdea} isDark={isDark} />

      {/* ── How it works ───────────────────────────────────────────── */}
      <div className={`space-y-6 pt-10 border-t ${isDark ? 'border-[#222222]' : 'border-gray-200'}`}>
        <div className={`text-center text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          How BLUEPRINTR works
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((item, i) => (
            <StepCard key={i} {...item} isDark={isDark} />
          ))}
        </div>
      </div>

    </motion.div>
  );
};

// ── Shared sub-components ─────────────────────────────────────────────────

const InputBox = ({ idea, setIdea, handleGenerate, isGenerating, isDark }) => {
  const textareaRef = React.useRef(null);

  const autoResize = React.useCallback((el) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  const handleChange = (e) => {
    setIdea(e.target.value);
    autoResize(e.target);
  };

  // Also resize on first render if idea is pre-filled (e.g. suggestion click)
  React.useEffect(() => {
    autoResize(textareaRef.current);
  }, [idea, autoResize]);

  const wordCount = idea.trim() === '' ? 0 : idea.trim().split(/\s+/).length;
  const MAX_WORDS = 500;
  const wordColor =
    wordCount === 0       ? ''
    : wordCount < 20      ? 'text-amber-500'
    : wordCount < 100     ? 'text-indigo-400'
    : wordCount <= MAX_WORDS ? 'text-emerald-500'
    :                        'text-red-500';

  return (
    <div className="space-y-3">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200" />
      <form
        onSubmit={handleGenerate}
        className={`relative p-2 rounded-2xl border transition-all ${
          isDark ? 'bg-[#0A0A0A] border-[#222222]' : 'bg-white border-gray-200 shadow-xl'
        }`}
      >
        {/* Input row — icon pins to top */}
        <div className="flex items-start gap-4 px-4 pt-4 pb-2">
          <Search className="text-gray-500 flex-shrink-0 mt-1" size={20} />
          <textarea
            ref={textareaRef}
            value={idea}
            rows={3}
            onChange={handleChange}
            placeholder="What are you building? Describe your idea in detail..."
            className={`w-full flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-base leading-relaxed resize-none py-1 placeholder-gray-600 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
            style={{ minHeight: '88px', maxHeight: '320px', overflowY: 'auto' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); }
            }}
          />
        </div>

        {/* Footer row */}
        <div className={`flex items-center justify-between px-4 py-3 border-t ${isDark ? 'border-[#222222]' : 'border-gray-100'}`}>
          <div className="flex items-center gap-4">
            <button type="button" className={`transition-colors ${isDark ? 'text-gray-600 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}>
              <Terminal size={17} />
            </button>
            <button type="button" className={`transition-colors ${isDark ? 'text-gray-600 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}>
              <MessageSquare size={17} />
            </button>
            {/* Word count */}
            <div className="flex items-center gap-2">
              {wordCount > 0 && (
                <>
                  {/* Mini progress bar */}
                  <div className={`h-1 w-16 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        wordCount < 20 ? 'bg-amber-500'
                        : wordCount < 100 ? 'bg-indigo-500'
                        : wordCount <= 500 ? 'bg-emerald-500'
                        : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((wordCount / MAX_WORDS) * 100, 100)}%` }}
                    />
                  </div>
                  <span className={`text-[11px] tabular-nums font-medium transition-colors ${wordColor}`}>
                    {wordCount} / {MAX_WORDS} words
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Shift+Enter hint */}
            {idea.trim() && (
              <span className={`text-[10px] hidden sm:block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>
                Shift+↵ for new line
              </span>
            )}
            <button
              disabled={isGenerating || !idea.trim()}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                idea.trim()
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                  : isDark
                  ? 'bg-white/5 text-gray-600 cursor-not-allowed shadow-none'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              {isGenerating ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Architecting...</>
              ) : (
                <>Generate Blueprint <ArrowRight size={16} /></>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
    {!idea.trim() && (
      <p className={`text-[11px] text-center px-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        e.g. "A SaaS platform that helps indie developers manage client invoices, with recurring billing, PDF exports, and a Stripe integration."
      </p>
    )}
    </div>
  );
};

const ErrorBanner = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center"
  >
    {message}
  </motion.div>
);

const SuggestionPills = ({ suggestions, setIdea, isDark }) => (
  <div className="space-y-3">
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
);

const StepCard = ({ step, title, desc, isDark }) => (
  <div className={`text-center space-y-3 p-6 rounded-2xl border ${isDark ? 'bg-white/[0.02] border-white/[0.07]' : 'bg-white border-gray-200 shadow-sm'}`}>
    <div className="text-3xl mb-2">{step}</div>
    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h4>
    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
  </div>
);

export default IdeaInputPage;
