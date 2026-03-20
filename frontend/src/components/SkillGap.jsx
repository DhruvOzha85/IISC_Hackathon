import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function SkillGap({ title, skills, type, gap = [] }) {
  
  const getBadgeColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'advanced': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'intermediate': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const isGap = (skillName) => gap.includes(skillName);

  return (
    <div className="glass-panel p-6 flex flex-col gap-6">
      <h3 className="text-xl font-semibold border-b border-white/10 pb-4">{title}</h3>
      
      {skills.length === 0 ? (
        <p className="text-textMuted italic py-4 text-center">No skills detected.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {skills.map((skill, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: type === 'existing' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg border ${type === 'required' && isGap(skill.name) ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/5'}`}
            >
              <div className="flex items-center gap-3">
                {type === 'existing' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 opacity-80" />
                ) : type === 'required' && isGap(skill.name) ? (
                  <XCircle className="w-5 h-5 text-red-400 opacity-80" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-green-400 opacity-80" />
                )}
                <span className="font-medium text-lg">{skill.name}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border ${getBadgeColor(skill.level)}`}>
                {skill.level}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {type === 'required' && gap.length > 0 && (
        <div className="mt-4 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
          <div className="text-sm">
            <span className="font-semibold text-orange-300 block mb-1">Skill Gaps Detected</span>
            <p className="text-orange-200/80">We found {gap.length} missing skill{gap.length > 1 ? 's' : ''} required for this role. Your custom learning pathway has been generated below to bridge this gap.</p>
          </div>
        </div>
      )}
    </div>
  );
}
