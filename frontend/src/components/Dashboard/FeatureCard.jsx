import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, Shield, Globe, Cpu, Layers } from 'lucide-react';
import { useStore } from '../../store/useStore';

const FeatureCard = ({ feature }) => {
  const { isDark } = useStore();
  
  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('api')) return <Cpu size={20} />;
    if (n.includes('auth')) return <Shield size={20} />;
    if (n.includes('web')) return <Globe size={20} />;
    if (n.includes('core')) return <Zap size={20} />;
    return <Layers size={20} />;
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className={`p-6 rounded-2xl border transition-all group ${
        isDark 
          ? 'bg-card-dark border-white/5 hover:border-white/10' 
          : 'bg-card-light border-gray-200 hover:border-gray-300 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${
          isDark ? 'bg-white/5 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
        }`}>
          {getIcon(feature.name)}
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest ${
          feature.priority === 'high' 
            ? 'bg-red-500/10 text-red-500' 
            : feature.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
        }`}>
          {feature.priority}
        </span>
      </div>
      
      <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {feature.name}
      </h3>
      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {feature.description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
