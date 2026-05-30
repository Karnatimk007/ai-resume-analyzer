import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FileText, LogOut, User, LayoutDashboard, UploadCloud, Home } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl text-white group-hover:rotate-6 transition-transform duration-200 shadow-md shadow-blue-500/20">
            <FileText size={22} />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
            Resu<span className="text-blue-500">Mind</span>
          </span>
        </Link>

        {/* Action Buttons */}
        {user ? (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
              <User size={16} className="text-blue-500" />
              <span>Hello, <span className="font-medium text-slate-200">{user.username}</span></span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive('/') 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <Home size={16} />
                <span>Home</span>
              </Link>
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive('/dashboard') 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/upload"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive('/upload') 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <UploadCloud size={16} />
                <span>Upload</span>
              </Link>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-800 hover:border-red-500/30 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg text-sm font-medium transition-all"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive('/') 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Home size={16} />
              <span>Home</span>
            </Link>
            <Link
              to="/login"
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="gradient-btn px-4 py-2 rounded-xl text-sm"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
