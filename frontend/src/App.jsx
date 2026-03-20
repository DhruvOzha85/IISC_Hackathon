import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadSection from './components/UploadSection';
import SkillGap from './components/SkillGap';
import Roadmap from './components/Roadmap';
import { Code2, BrainCircuit } from 'lucide-react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background text-textMain relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-secondary/20 blur-[100px] pointer-events-none" />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium tracking-wide text-primary">AI-ADAPTIVE ONBOARDING ENGINE</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Hack the Learning Curve
          </h1>
          <p className="text-lg text-textMuted max-w-2xl mx-auto leading-relaxed">
            Upload your Resume and the Target Job Description. Our engine will dynamically map a personalized, precise learning roadmap skipping what you already know.
          </p>
        </motion.header>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {!data ? (
            <motion.div 
              key="upload-section"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-3xl"
            >
              <UploadSection setData={setData} loading={loading} setLoading={setLoading} />
            </motion.div>
          ) : (
            <motion.div
              key="results-section"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, staggerChildren: 0.2 }}
              className="w-full flex flex-col gap-12"
            >
              <div className="flex justify-between items-center bg-surface/50 border border-white/5 backdrop-blur-sm p-4 rounded-xl">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Code2 className="text-secondary" /> Analysis Complete
                </h2>
                <button 
                  onClick={() => setData(null)}
                  className="px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
                >
                  Start Over
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <SkillGap 
                  title="Your Current Skills" 
                  skills={data.existing_skills} 
                  type="existing"
                />
                <SkillGap 
                  title="Target Job Skills" 
                  skills={data.required_skills} 
                  type="required"
                  gap={data.skill_gap}
                />
              </div>

              <div className="w-full mt-8">
                <Roadmap roadmap={data.roadmap} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

export default App;
