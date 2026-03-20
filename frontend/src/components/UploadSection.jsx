import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, Play } from 'lucide-react';
import axios from 'axios';

export default function UploadSection({ setData, loading, setLoading }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!resumeFile) return setError("Please upload your resume.");
    if (!jdText.trim()) return setError("Please paste the job description.");
    
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('job_description', jdText);

      const response = await axios.post('http://localhost:8000/api/parse-and-map', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if(response.data.error) {
        setError(response.data.error);
      } else {
        setData(response.data);
      }
    } catch (err) {
      setError("Failed to connect to the engine. Ensure backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 w-full flex flex-col gap-8 relative overflow-hidden">
      
      {/* Step 1: Resume */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-textMuted uppercase tracking-wider">Step 1: Resume</label>
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${resumeFile ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="application/pdf" 
            className="hidden" 
          />
          {resumeFile ? (
            <div className="flex items-center gap-3 text-primary">
              <FileText className="w-8 h-8" />
              <span className="font-medium text-lg">{resumeFile.name}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-textMuted">
              <UploadCloud className="w-10 h-10 mb-2 opacity-50" />
              <p className="font-medium">Click or drag and drop your Resume</p>
              <p className="text-xs">PDF format required</p>
            </div>
          )}
        </div>
      </div>

      {/* Step 2: JD */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-textMuted uppercase tracking-wider">Step 2: Target Job Description</label>
        <textarea 
          placeholder="Paste the Job Description here..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-textMain placeholder:-textMuted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all resize-none"
        />
      </div>

      {/* Error & Action */}
      <div className="flex flex-col items-center gap-4 mt-4">
        {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
        
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed w-full sm:w-auto min-w-[200px]"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Data...
            </>
          ) : (
            <>
              Generate Learning Path
              <Play className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
            </>
          )}
          {/* Button Shine effect */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
        </button>
      </div>

    </div>
  );
}
