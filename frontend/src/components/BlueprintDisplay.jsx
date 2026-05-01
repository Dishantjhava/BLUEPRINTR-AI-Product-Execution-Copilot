import React, { useState } from 'react';
import { 
  Layout, 
  CheckCircle2, 
  Zap, 
  Server, 
  Database, 
  Code2, 
  Copy, 
  Check, 
  ArrowRight,
  Sparkles,
  Layers,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BlueprintDisplay = ({ blueprint }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [copiedSection, setCopiedSection] = useState(null);

  const tabs = [
    { id: 'summary', label: 'Summary', icon: Layout },
    { id: 'features', label: 'Features', icon: Zap },
    { id: 'tasks', label: 'Tasks', icon: Terminal },
    { id: 'apis', label: 'APIs', icon: Server },
    { id: 'schema', label: 'Schema', icon: Database },
    { id: 'code', label: 'Code', icon: Code2 },
  ];

  const handleCopy = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-5xl mt-12 mb-20"
    >
      <div className="glass rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-white/5 text-white">
              <Sparkles size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Blueprint Generated</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
            {blueprint.product_summary.title}
          </h2>
          <p className="text-lg text-white/60 leading-relaxed max-w-3xl">
            {blueprint.product_summary.description}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-white/5 bg-black/20 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap ${
                activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'summary' && (
                <div className="space-y-8">
                  <section>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Layers size={20} className="text-white/60" />
                      Vision Statement
                    </h3>
                    <p className="text-white/70 text-lg leading-relaxed bg-white/5 p-6 rounded-xl border border-white/5">
                      {blueprint.product_summary.description}
                    </p>
                  </section>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">Complexity</div>
                      <div className="text-lg text-white">Production Ready</div>
                    </div>
                    <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">Architectural Style</div>
                      <div className="text-lg text-white">Full-Stack Modern</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blueprint.features.map((feature, idx) => (
                    <div key={idx} className="p-6 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-colors group">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white text-lg">{feature.name}</h4>
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                          feature.priority === 'high' ? 'bg-red-500/20 text-red-400' : 
                          feature.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {feature.priority}
                        </span>
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="space-y-3">
                  {blueprint.tasks.map((task, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 group">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-white/20 group-hover:border-white/50 group-hover:text-white/50 transition-colors">
                        <span className="text-[10px] font-bold">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-white">{task.title}</h4>
                          <span className="text-xs text-white/30">{task.estimated_time}</span>
                        </div>
                        <p className="text-sm text-white/50">{task.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'apis' && (
                <div className="space-y-4">
                  {blueprint.apis.map((api, idx) => (
                    <div key={idx} className="overflow-hidden rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-4 px-6 py-4 bg-white/[0.02]">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          api.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                          api.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                          api.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {api.method}
                        </span>
                        <code className="text-sm text-white/80 font-mono">{api.endpoint}</code>
                      </div>
                      <div className="px-6 py-4 border-t border-white/5">
                        <p className="text-sm text-white/50">{api.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'schema' && (
                <div className="space-y-6">
                  {blueprint.database_schema.collections.map((coll, idx) => (
                    <div key={idx} className="rounded-xl border border-white/5 overflow-hidden">
                      <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex items-center gap-2">
                        <Database size={16} className="text-white/40" />
                        <span className="font-mono text-sm text-white">{coll.name} Collection</span>
                      </div>
                      <div className="p-0">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="text-white/40 bg-white/[0.02]">
                              <th className="px-6 py-3 font-medium">Field Name</th>
                              <th className="px-6 py-3 font-medium">Type</th>
                              <th className="px-6 py-3 font-medium">Required</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {coll.fields.map((field, fidx) => (
                              <tr key={fidx} className="text-white/70 hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4 font-mono text-xs">{field.field_name}</td>
                                <td className="px-6 py-4 text-xs">{field.type}</td>
                                <td className="px-6 py-4">
                                  {field.required ? (
                                    <CheckCircle2 size={14} className="text-green-500/50" />
                                  ) : (
                                    <span className="text-white/20">-</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'code' && (
                <div className="space-y-8">
                  {['backend', 'routes', 'models'].map((section) => (
                    <div key={section} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-white/40 uppercase tracking-widest">{section}.js</h4>
                        <button 
                          onClick={() => handleCopy(blueprint.starter_code[section], section)}
                          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
                        >
                          {copiedSection === section ? <Check size={14} /> : <Copy size={14} />}
                          {copiedSection === section ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre className="p-6 rounded-xl bg-black border border-white/5 overflow-x-auto code-block">
                        <code className="text-white/80">{blueprint.starter_code[section]}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-8 bg-white/[0.02] border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <CheckCircle2 size={16} className="text-green-500" />
            Architecturally sound and ready for implementation
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2">
              Next Steps <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlueprintDisplay;
