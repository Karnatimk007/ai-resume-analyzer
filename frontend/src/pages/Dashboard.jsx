import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { FileText, Calendar, Target, Award, Trash2, ArrowRight, Eye, RefreshCw, BarChart2 } from 'lucide-react';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getHistory();
      setHistory(data);
    } catch (err) {
      setError('Could not retrieve your upload history.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this analysis record?')) {
      return;
    }

    try {
      setDeletingId(id);
      await api.deleteResume(id);
      setHistory(history.filter(item => item._id !== id));
    } catch (err) {
      alert('Failed to delete the record. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Stats calculators
  const totalUploads = history.length;
  const avgAtsScore = totalUploads > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.atsScore, 0) / totalUploads)
    : 0;
  const maxScore = totalUploads > 0 
    ? Math.max(...history.map(item => item.atsScore))
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animated-bg min-h-[calc(100vh-76px)]">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Track and compare your resumes against ATS standards
          </p>
        </div>
        <Link
          to="/upload"
          className="gradient-btn px-6 py-3 rounded-xl flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <span>Analyze New Resume</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Loading dashboard statistics...</p>
        </div>
      ) : error ? (
        <div className="glass-panel p-6 rounded-2xl border border-red-500/20 text-center max-w-md mx-auto">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchHistory}
            className="px-4 py-2 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-900 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={14} />
            <span>Try Again</span>
          </button>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {/* Stat 1 */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex items-center gap-5">
              <div className="bg-blue-500/10 border border-blue-500/20 p-3.5 rounded-xl text-blue-400">
                <FileText size={24} />
              </div>
              <div>
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Total Resumes</span>
                <span className="text-3xl font-bold text-white mt-0.5 block">{totalUploads}</span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex items-center gap-5">
              <div className="bg-indigo-500/10 border border-indigo-500/20 p-3.5 rounded-xl text-indigo-400">
                <BarChart2 size={24} />
              </div>
              <div>
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Average ATS Score</span>
                <span className="text-3xl font-bold text-white mt-0.5 block">
                  {avgAtsScore}%
                </span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex items-center gap-5">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl text-emerald-400">
                <Award size={24} />
              </div>
              <div>
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Highest Score</span>
                <span className="text-3xl font-bold text-white mt-0.5 block">
                  {maxScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Resume History List */}
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <span>Recent Analysis History</span>
            {totalUploads > 0 && <span className="bg-slate-900 border border-slate-800 text-slate-400 text-xs px-2.5 py-0.5 rounded-full">{totalUploads}</span>}
          </h2>

          {history.length === 0 ? (
            <div className="glass-panel border-dashed border-2 border-slate-800 p-12 rounded-3xl text-center flex flex-col items-center justify-center">
              <div className="bg-slate-900/50 p-4 rounded-full text-slate-600 mb-4 border border-slate-850">
                <FileText size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-300">No resumes analyzed yet</h3>
              <p className="text-slate-500 text-sm max-w-sm mt-1.5 mb-6">
                Upload your first resume and let the AI extract details, calculate ATS score and suggest structural changes.
              </p>
              <Link
                to="/upload"
                className="gradient-btn px-5 py-2.5 rounded-xl text-sm"
              >
                Upload Resume
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {history.map((item) => (
                <Link
                  key={item._id}
                  to={`/analysis/${item._id}`}
                  className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-slate-700 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-slate-900 p-2.5 border border-slate-850 rounded-xl text-blue-500 group-hover:scale-105 transition-transform">
                          <FileText size={20} />
                        </div>
                        <div className="truncate">
                          <h4 className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs group-hover:text-blue-400 transition-colors">
                            {item.fileName}
                          </h4>
                          <span className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                            <Calendar size={12} />
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </span>
                        </div>
                      </div>

                      {/* Score Indicator */}
                      <div className="flex flex-col items-end">
                        <span className={`text-2xl font-black ${
                          item.atsScore < 50 ? 'text-red-400' : item.atsScore < 75 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {item.atsScore}%
                        </span>
                        <span className="text-[10px] uppercase text-slate-500 tracking-wider font-semibold">ATS SCORE</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/50 border border-slate-850 rounded-xl text-xs text-slate-300 mt-2 mb-4 w-fit">
                      <Target size={12} className="text-indigo-400" />
                      <span className="font-medium text-slate-400">Target Role:</span>
                      <span className="truncate max-w-[150px] font-semibold text-indigo-300">{item.roleCompared}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-850 pt-4 mt-2">
                    <span className="text-xs text-blue-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View analysis report</span>
                      <Eye size={12} />
                    </span>

                    <button
                      onClick={(e) => handleDelete(item._id, e)}
                      disabled={deletingId === item._id}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Delete resume analysis"
                    >
                      {deletingId === item._id ? (
                        <span className="block w-4 h-4 border-2 border-slate-500 border-t-red-500 rounded-full animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
