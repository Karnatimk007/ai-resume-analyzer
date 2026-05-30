import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-auto py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Branding & Info */}
        <div className="md:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2 group w-fit">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-1.5 rounded-lg text-white group-hover:rotate-6 transition-transform shadow-md shadow-blue-500/10">
              <FileText size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-200">
              Resu<span className="text-blue-500">Mind</span>
            </span>
          </Link>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Optimize your resume, benchmark skills against job requirements, calculate ATS compatibility scores, and draft professional documents powered by advanced AI.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/" className="text-slate-500 hover:text-blue-400 transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/dashboard" className="text-slate-500 hover:text-blue-400 transition-colors">Dashboard</Link>
            </li>
            <li>
              <Link to="/upload" className="text-slate-500 hover:text-blue-400 transition-colors">Analyze Resume</Link>
            </li>
          </ul>
        </div>

        {/* Tech Stack Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Powered By</h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Built with React, Tailwind CSS v4, Node.js + Express, Mongoose, Gemini 1.5, and Cloudinary storage.
          </p>
          
          {/* Social icons */}
          <div className="flex items-center gap-4 pt-2 text-slate-505">
            <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="Github">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="Mail">
              <Mail size={16} />
            </a>
          </div>
        </div>

      </div>

      {/* Divider and Copyright */}
      <div className="max-w-7xl mx-auto border-t border-slate-900/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-600">
        <span>&copy; {new Date().getFullYear()} ResuMind. All rights reserved.</span>
        <span className="flex items-center gap-1">
          Crafted with <Heart size={10} className="text-red-500 fill-red-500" /> for developers
        </span>
      </div>
    </footer>
  );
}
