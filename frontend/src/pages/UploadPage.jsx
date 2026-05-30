import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import UploadZone from '../components/UploadZone.jsx';
import { Target, FileText, ChevronRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState('');

  const handleFileSelected = (selectedFile) => {
    setFile(selectedFile);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select or upload a resume file first.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Simulate staging steps for rich user feedback
    const stages = [
      'Extracting text content from document...',
      'Comparing text structure against ATS standards...',
      'Interpreting matching metrics with Gemini AI...',
      'Saving analysis report...'
    ];

    let stageIdx = 0;
    setLoadingStage(stages[0]);
    const timer = setInterval(() => {
      stageIdx++;
      if (stageIdx < stages.length) {
        setLoadingStage(stages[stageIdx]);
      }
    }, 1800);

    try {
      const result = await api.analyzeResume(file, jobDescription);
      clearInterval(timer);
      navigate(`/analysis/${result._id}`);
    } catch (err) {
      clearInterval(timer);
      setError(err.message || 'Analysis failed. Please check files and try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animated-bg min-h-[calc(100vh-76px)]">
      {/* Back button */}
      <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-6 w-fit">
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Evaluate Your Resume</h1>
        <p className="text-slate-400 mt-1 max-w-lg mx-auto">
          Upload your resume and optionally provide a target job description to get role-specific scoring and recommendations.
        </p>
      </div>

      {isLoading ? (
        <div className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center border border-blue-500/20 shadow-2xl my-8">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-slate-900 border-t-blue-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-blue-400 animate-pulse-slow">
              <FileText size={22} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Analyzing Resume</h3>
          <p className="text-sm text-slate-400 text-center animate-pulse max-w-sm">
            {loadingStage}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          {/* Main upload zone */}
          <div className="md:col-span-3 space-y-6">
            <div className="glass-panel p-6 rounded-3xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs">1</span>
                <span>Upload Document</span>
              </h2>
              <UploadZone onFileSelected={handleFileSelected} isLoading={isLoading} />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {file && (
              <button
                onClick={handleAnalyze}
                className="w-full gradient-btn py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
              >
                <span>Analyze Resume</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          {/* Job description input */}
          <div className="md:col-span-2">
            <div className="glass-panel p-6 rounded-3xl h-full">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs">2</span>
                <span>Target Job Details</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Target size={14} className="text-indigo-400" />
                    <span>Job Role / Description</span>
                  </label>
                  <textarea
                    rows={8}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="E.g., Senior Full-Stack Engineer. Paste target job description here to check for missing keywords, skill alignments, and role relevance scoring."
                    className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-200 placeholder-slate-650 transition-colors text-sm resize-none"
                  />
                </div>
                <div className="bg-slate-900/50 p-4 border border-slate-850 rounded-xl">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    💡 **Tip:** Supplying the job description enables detailed role-matching intelligence, highlighting exactly which skills and terms are missing from your resume.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
