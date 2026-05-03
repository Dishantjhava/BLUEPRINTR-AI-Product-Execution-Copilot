import React from 'react';
import { useStore } from '../store/useStore';
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
  ArrowRight,
  Plus,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { exportBlueprintToPDF } from '../utils/pdfExport';

const DashboardPage = () => {
  const { blueprint, isDark } = useStore();

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
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20">
          <Plus size={18} />
          Create New Idea
        </button>
      </div>
    );
  }

  return (
    <div className="px-8 py-10 space-y-12">
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
               <span className="text-[10px] font-bold text-gray-500 uppercase">0% Complete</span>
            </div>
          </div>
          <TaskBoard tasks={blueprint.tasks} />
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
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                          api.method === 'GET' ? 'bg-blue-500/10 text-blue-400' :
                          api.method === 'POST' ? 'bg-green-500/10 text-green-400' :
                          'bg-amber-500/10 text-amber-400'
                        }`}>
                          {api.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-400 group-hover:text-white transition-colors">
                        {api.endpoint}
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
                        <span className="text-indigo-500">{field.field_name}</span>
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

