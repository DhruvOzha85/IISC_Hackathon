import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Clock, GraduationCap } from 'lucide-react';

export default function Roadmap({ roadmap }) {
  if (!roadmap || roadmap.length === 0) {
    return (
      <div className="glass-panel p-12 flex flex-col items-center justify-center text-center gap-4 border-green-500/20">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
          <GraduationCap className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-green-300">You're Ready!</h3>
        <p className="text-textMuted max-w-lg">No skill gaps detected. You already possess all the required skills at the targeted proficiency level for this job description.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-3">Your Personalized Pathway</h2>
        <p className="text-textMuted">A grounded, step-by-step curriculum customized precisely to fill your skill gaps.</p>
      </div>

      <div className="relative pt-8 pb-12">
        {/* Timeline Line */}
        <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-transparent transform md:-translate-x-1/2" />

        <div className="flex flex-col gap-12">
          {roadmap.map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center justify-between w-full ${isEven ? 'md:flex-row-reverse' : ''}`}
              >
                
                {/* Center Node */}
                <div className="absolute left-[28px] md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10">
                  <div className="w-10 h-10 rounded-full bg-background border-4 border-primary flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <span className="text-sm font-bold">{step.step}</span>
                  </div>
                </div>

                {/* Content Card */}
                <div className="w-full pl-20 pr-4 md:px-0 md:w-[45%]">
                  <div className="glass-panel p-6 hover:border-primary/50 transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <BookOpen className="w-24 h-24 text-primary transform rotate-12" />
                    </div>
                    
                    <h4 className="text-xl font-bold text-white mb-2 relative z-10">{step.title}</h4>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm text-textMuted relative z-10">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {step.duration || '4 weeks'}
                      </div>
                      <div className="flex items-center gap-1.5 text-primary">
                        <Target className="w-4 h-4" />
                        Target Course
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 relative z-10">
                      <p className="text-sm text-gray-300 leading-relaxed italic">
                        <span className="font-semibold not-italic text-white block mb-1">Reasoning Trace:</span>
                        "{step.reasoning_trace}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block w-[45%]" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
