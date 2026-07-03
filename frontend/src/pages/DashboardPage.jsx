import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { API } from '../services/api.service';
import FeatureCard from '../components/dashboard/FeatureCard';
import TaskBoard from '../components/dashboard/TaskBoard';
import CodePreview from '../components/dashboard/CodePreview';
import ProjectStructure from '../components/dashboard/ProjectStructure';
import { 
  Sparkles, 
  Terminal, 
  Database, 
  Layers, 
  Zap,
  Plus,
  Download,
  Loader2,
  AlertTriangle,
  ShieldOff,
  LogIn,
  FolderOpen,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { exportBlueprintToPDF } from '../utils/pdfExport';

// ── Fetch states ────────────────────────────────────────────────────────
// idle        → no :id in URL, use whatever is in Zustand (guest/ephemeral)
// loading     → fetch in flight
// success     → blueprint loaded from backend
// notfound    → 404 — blueprint doesn't exist
// forbidden   → 403 — user doesn't own this blueprint
// unauthorized→ 401 — not logged in
// error       → any other failure
// ────────────────────────────────────────────────────────────────────────

const DashboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    blueprint, 
    setBlueprint, 
    isDark, 
    lastBlueprintId, 
    saveWarning, 
    clearSaveWarning 
  } = useStore();

  const [fetchState, setFetchState] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [completedTasks, setCompletedTasks] = useState({});

  const toggleTask = (taskTitle) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskTitle]: !prev[taskTitle]
    }));
  };

  const tasksList = blueprint?.tasks || [];
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const percentComplete = tasksList.length > 0 ? Math.round((completedCount / tasksList.length) * 100) : 0;

  // Redirect to dashboard/:id if lastBlueprintId is present but URL lacks ID
  useEffect(() => {
    if (!id && lastBlueprintId) {
      navigate(`/dashboard/${lastBlueprintId}`, { replace: true });
    }
  }, [id, lastBlueprintId, navigate]);

  // ── Fetch blueprint from MongoDB when :id is in the URL ────────────
  useEffect(() => {
    if (!id) {
      // No ID in URL — guest/ephemeral mode, use Zustand directly
      setFetchState('idle');
      return;
    }

    // If the store already has this exact blueprint loaded, skip the fetch
    if (blueprint && blueprint._id === id) {
      setFetchState('success');
      return;
    }

    const load = async () => {
      setFetchState('loading');
      setErrorMessage('');
      try {
        const data = await API.getBlueprintById(id);
        if (data.success && data.blueprint) {
          setBlueprint({ ...data.blueprint.solution, _id: data.blueprint._id });
          setFetchState('success');
        } else {
          setFetchState('notfound');
        }
      } catch (err) {
        console.error('Failed to fetch blueprint:', err);
        setErrorMessage(err.message || 'An unexpected error occurred');

        if (err.status === 401) {
          setFetchState('unauthorized');
        } else if (err.status === 403) {
          setFetchState('forbidden');
        } else if (err.status === 404) {
          setFetchState('notfound');
        } else {
          setFetchState('error');
        }
      }
    };

    load();
  }, [id, setBlueprint]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clear save warning on unmount (declared at top to satisfy Rules of Hooks)
  useEffect(() => {
    return () => {
      clearSaveWarning();
    };
  }, [clearSaveWarning]);

  // ════════════════════════════════════════════════════════════════════
  // RENDER GUARDS — prevent empty-state flash during fetch
  // ════════════════════════════════════════════════════════════════════

  // ── Loading ────────────────────────────────────────────────────────
  if (fetchState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-50'}`}>
          <Loader2 size={32} className="text-indigo-500 animate-spin" />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Loading Blueprint</h2>
        <p className={`text-sm max-w-xs mx-auto ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Fetching your blueprint from the cloud...
        </p>
      </div>
    );
  }

  // ── 404 — Blueprint Not Found ──────────────────────────────────────
  if (fetchState === 'notfound') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${isDark ? 'bg-red-600/10' : 'bg-red-50'}`}>
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Blueprint Not Found</h2>
        <p className={`text-sm max-w-xs mx-auto mb-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          This blueprint no longer exists. It may have been deleted.
        </p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} />
          Create New Blueprint
        </button>
      </div>
    );
  }

  // ── 403 — Forbidden (wrong ownership) ──────────────────────────────
  if (fetchState === 'forbidden') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${isDark ? 'bg-amber-600/10' : 'bg-amber-50'}`}>
          <ShieldOff size={32} className="text-amber-500" />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Access Denied</h2>
        <p className={`text-sm max-w-xs mx-auto mb-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          You don't have access to this blueprint.
        </p>
        <button
          onClick={() => navigate('/chats')}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20"
        >
          <FolderOpen size={18} />
          Go to My Projects
        </button>
      </div>
    );
  }

  // ── 401 — Unauthorized (not logged in) ─────────────────────────────
  if (fetchState === 'unauthorized') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-50'}`}>
          <LogIn size={32} className="text-indigo-500" />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Sign In Required</h2>
        <p className={`text-sm max-w-xs mx-auto mb-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Please sign in to view this blueprint.
        </p>
        <Link
          to="/signin"
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20"
        >
          <LogIn size={18} />
          Sign In
        </Link>
      </div>
    );
  }

  // ── Generic error (network failure, server 500, etc.) ──────────────
  if (fetchState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${isDark ? 'bg-red-600/10' : 'bg-red-50'}`}>
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Something Went Wrong</h2>
        <p className={`text-sm max-w-xs mx-auto mb-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {errorMessage || 'Failed to load the blueprint. Please try again.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg ${
            isDark 
              ? 'bg-white/10 hover:bg-white/15 text-white shadow-white/5' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900 shadow-gray-200/50'
          }`}
        >
          Try Again
        </button>
      </div>
    );
  }

  // ── Empty state (no blueprint in store AND no :id in URL) ──────────
  if (!blueprint) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-6">
          <Sparkles size={32} />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No Active Blueprint</h2>
        <p className={`text-sm max-w-xs mx-auto mb-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Generate a new product blueprint to see your technical architecture and tasks here.
        </p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} />
          Create New Idea
        </button>
      </div>
    );
  }



  // ════════════════════════════════════════════════════════════════════
  // MAIN DASHBOARD — blueprint is guaranteed to exist past this point
  // ════════════════════════════════════════════════════════════════════
  return (
    <div className="px-8 py-10 space-y-12">
      {saveWarning && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
          isDark 
            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="flex-shrink-0" />
            <p className="text-sm font-medium">{saveWarning}</p>
          </div>
          <button 
            onClick={clearSaveWarning} 
            className={`p-1 rounded-md transition-colors ${
              isDark ? 'hover:bg-amber-500/20' : 'hover:bg-amber-200/50'
            }`}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Overview Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">
          <Sparkles size={14} />
          Active Intelligence
        </div>
        <h1 className={`text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {blueprint.product_summary.title}
        </h1>
        <p className={`text-lg max-w-3xl leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {blueprint.product_summary.description}
        </p>
      </div>

      {/* 2-Column Section for Features and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Features Column */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Zap size={20} className="text-indigo-500" />
              Core Features
            </h2>
            <button className="text-xs text-indigo-500 font-bold uppercase tracking-widest hover:underline">Edit All</button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {blueprint.features.map((feature, idx) => (
              <FeatureCard key={idx} feature={feature} />
            ))}
          </div>
        </section>

        {/* Tasks Column */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Terminal size={20} className="text-indigo-500" />
              Technical Roadmap
            </h2>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-gray-500 uppercase">{percentComplete}% Complete</span>
            </div>
          </div>
          <TaskBoard tasks={blueprint.tasks} completedTasks={completedTasks} toggleTask={toggleTask} />
        </section>
      </div>

      {/* APIs and Schema Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* APIs */}
         <section className="space-y-6">
            <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Layers size={20} className="text-indigo-500" />
              API Endpoints
            </h2>
            <div className={`rounded-2xl border overflow-hidden ${isDark ? 'border-white/5 bg-card-dark' : 'border-gray-200 bg-card-light shadow-sm'}`}>
              <table className="w-full text-left">
                <thead>
                  <tr className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'bg-white/[0.02] text-gray-500' : 'bg-gray-50 text-gray-400'}`}>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Endpoint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {blueprint.apis.map((api, idx) => (
                    <tr key={idx} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4 align-top">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                          api.method === 'GET' ? 'bg-blue-500/10 text-blue-400' :
                          api.method === 'POST' ? 'bg-green-500/10 text-green-400' :
                          'bg-amber-500/10 text-amber-400'
                        }`}>
                          {api.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-400 group-hover:text-white transition-colors">
                        <div>{api.endpoint}</div>
                        {api.description && (
                          <div className={`text-[10px] font-sans mt-1 normal-case leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {api.description}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         </section>

         {/* Database Schema */}
         <section className="space-y-6">
            <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Database size={20} className="text-indigo-500" />
              Data Schema
            </h2>
            <div className={`rounded-2xl border p-6 ${isDark ? 'border-white/5 bg-card-dark' : 'border-gray-200 bg-card-light shadow-sm'}`}>
              {blueprint.database_schema.collections.map((coll, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <Database size={14} />
                    {coll.name}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {coll.fields.map((field, fidx) => (
                      <div key={fidx} className={`px-3 py-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-2 ${
                        isDark ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}>
                        <span className="text-indigo-500">
                          {field.field_name}
                          {field.required && <span className="text-red-500 ml-0.5" title="Required">*</span>}
                        </span>
                        <span className="text-gray-600 opacity-50">/</span>
                        <span>{field.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
         </section>
      </div>

      {/* Code Preview Section */}
      <section className="space-y-6">
        <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Terminal size={20} className="text-indigo-500" />
          Starter Code
        </h2>
        <CodePreview code={blueprint.starter_code} />
      </section>

      {/* Project Structure Section */}
      <section className="pb-8">
        <ProjectStructure data={blueprint.project_structure} />
      </section>

      {/* Download Action */}
      <div className={`flex flex-col items-center justify-center pt-8 pb-20 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <button
          onClick={() => exportBlueprintToPDF(blueprint)}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:-translate-y-1 ${
            isDark 
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20' 
              : 'bg-black hover:bg-gray-800 text-white shadow-black/10'
          }`}
        >
          <Download size={20} />
          Download Blueprint PDF
        </button>
        <p className={`mt-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Export this structured document to feed into an AI application builder.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
