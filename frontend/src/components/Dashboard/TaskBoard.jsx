import React from 'react';
import { CheckCircle2, Circle, Clock, MoreHorizontal } from 'lucide-react';
import { useStore } from '../../store/useStore';

const TaskBoard = ({ tasks, completedTasks = {}, toggleTask }) => {
  const { isDark } = useStore();

  return (
    <div className="space-y-3">
      {tasks.map((task, idx) => {
        const isCompleted = !!completedTasks[task.title];
        return (
          <div 
            key={idx}
            className={`flex items-start gap-4 p-4 rounded-xl border transition-all hover:translate-x-1 ${
              isCompleted
                ? (isDark ? 'bg-indigo-950/10 border-indigo-500/20 opacity-75' : 'bg-indigo-50/30 border-indigo-100 opacity-75')
                : (isDark ? 'bg-card-dark border-white/5 hover:border-white/10' : 'bg-card-light border-gray-200 hover:border-gray-300')
            }`}
          >
            <div className="mt-1" onClick={() => toggleTask?.(task.title)}>
              {isCompleted ? (
                <CheckCircle2 size={18} className="text-emerald-500 hover:text-emerald-400 cursor-pointer transition-colors" />
              ) : (
                <Circle size={18} className="text-gray-600 hover:text-indigo-500 cursor-pointer transition-colors" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className={`font-semibold text-sm transition-all ${
                  isCompleted 
                    ? 'line-through text-gray-500' 
                    : (isDark ? 'text-white' : 'text-gray-900')
                }`}>
                  {task.title}
                </h4>
                <div className="flex items-center gap-2">
                   <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                     isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'
                   }`}>
                     {task.priority}
                   </span>
                   <button className="text-gray-600 hover:text-white transition-colors">
                     <MoreHorizontal size={14} />
                   </button>
                </div>
              </div>
              <p className={`text-xs mb-3 transition-colors ${
                isCompleted 
                  ? 'text-gray-600' 
                  : (isDark ? 'text-gray-500' : 'text-gray-400')
              }`}>
                {task.description}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-indigo-500">
                  <Clock size={12} />
                  {task.estimated_time}
                </div>
                <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                <div className="text-[10px] font-medium text-gray-600 uppercase tracking-tighter">
                  Engineering
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskBoard;
