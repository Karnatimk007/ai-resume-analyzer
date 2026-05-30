import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  FileText, Sparkles, Target, Zap, Shield, ChevronRight, 
  ArrowRight, Award, CheckCircle, Percent
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="animated-bg min-h-[calc(100vh-76px)] text-slate-100 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-16 text-center overflow-hidden">
        {/* Glow decorative circle */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-600/10 blur-[80px] pointer-events-none" />

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs font-semibold text-blue-400 mb-6 tracking-wide animate-pulse-slow">
          <Sparkles size={12} />
          <span>Powered by Gemini 1.5 & OpenAI</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-white mb-6">
          Optimize Your Resume.<br />
          <span className="gradient-text">Beat the ATS Filters.</span>
        </h1>

        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your resume, analyze it against role descriptions, identify missing keywords, calculate your ATS score, and download a tailored PDF.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={user ? "/dashboard" : "/register"}
            className="gradient-btn px-8 py-4 rounded-2xl flex items-center justify-center gap-2 text-base font-semibold w-full sm:w-auto"
          >
            <span>{user ? "Go to Dashboard" : "Get Started for Free"}</span>
            <ArrowRight size={18} />
          </Link>
          
          <a
            href="#features"
            className="px-6 py-4 rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-900/30 text-slate-350 hover:text-white transition-all text-sm font-medium w-full sm:w-auto text-center"
          >
            Learn How It Works
          </a>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-850 flex items-center gap-4">
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400">
              <Percent size={22} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">75%</h4>
              <p className="text-xs text-slate-400">Resumes filtered out by ATS automated systems</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-850 flex items-center gap-4">
            <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-blue-400">
              <Target size={22} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">3x More</h4>
              <p className="text-xs text-slate-400">Interview invitations with keyword optimization</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-850 flex items-center gap-4">
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl text-indigo-400">
              <Award size={22} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">100% Secure</h4>
              <p className="text-xs text-slate-400">Your documents are processed with full confidentiality</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white">Advanced AI-Powered Tooling</h2>
          <p className="text-slate-400 mt-2 max-w-md mx-auto">
            Our optimizer provides actionable feedback using industry recruiter insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-850 hover:border-slate-800 transition-all hover:translate-y-[-4px] group">
            <div className="bg-blue-500/10 text-blue-400 p-3 rounded-xl w-fit mb-4">
              <FileText size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Resume Parsing</h3>
            <p className="text-xs text-slate-450 leading-relaxed">
              Upload PDF or DOCX files. Our text extraction engine reads files in real-time, removing visual clutter.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-850 hover:border-slate-800 transition-all hover:translate-y-[-4px] group">
            <div className="bg-indigo-500/10 text-indigo-400 p-3 rounded-xl w-fit mb-4">
              <Award size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">ATS Score Checker</h3>
            <p className="text-xs text-slate-455 leading-relaxed">
              Get an instant mathematical score representing how well search filters will scan your credentials.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-850 hover:border-slate-800 transition-all hover:translate-y-[-4px] group">
            <div className="bg-purple-500/10 text-purple-400 p-3 rounded-xl w-fit mb-4">
              <Sparkles size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Tailored Suggestions</h3>
            <p className="text-xs text-slate-460 leading-relaxed">
              Gemini AI analyzes structural layouts, experience descriptors, and points out missing keywords for your target role.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-850 hover:border-slate-800 transition-all hover:translate-y-[-4px] group">
            <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl w-fit mb-4">
              <Zap size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">A4 Export Builder</h3>
            <p className="text-xs text-slate-465 leading-relaxed">
              Edit the AI-improved suggestions on our built-in markdown editor and print a high-quality PDF.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Action Section */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="glass-panel p-10 rounded-3xl border border-blue-500/15 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Ready to increase your call-back rate?
          </h2>
          <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">
            Take 2 minutes to scan your resume and receive immediate improvement criteria.
          </p>
          <Link
            to={user ? "/dashboard" : "/register"}
            className="gradient-btn px-6 py-3 rounded-xl inline-flex items-center gap-1.5 font-semibold"
          >
            <span>Scan Resume Now</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}
