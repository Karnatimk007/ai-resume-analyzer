import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import ATSGauge from '../components/ATSGauge.jsx';
import { 
  ArrowLeft, CheckCircle2, XCircle, Tag, Eye, Edit3, Download, 
  Sparkles, FileText, ChevronRight, BookOpen, User, Calendar
} from 'lucide-react';

export default function AnalysisDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('suggestions'); // 'suggestions', 'original', 'improved'
  const [improvedText, setImprovedText] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await api.getResumeDetails(id);
        setResume(data);
        setImprovedText(data.analysisResult.improvedResumeContent || '');
      } catch (err) {
        setError('Could not retrieve detailed resume analysis.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[calc(100vh-76px)]">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Performing AI analytical breakdown...</p>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center min-h-[calc(100vh-76px)] flex flex-col justify-center">
        <div className="glass-panel p-8 rounded-3xl border border-red-500/20">
          <p className="text-red-400 mb-6 font-medium">{error || 'Resume not found.'}</p>
          <Link to="/" className="gradient-btn px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const { analysisResult } = resume;

  // Tiny inline markdown compiler for structured preview
  const parseInlineMarkdown = (text) => {
    if (!text) return '';
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        return <h1 key={idx} className="text-2xl font-bold mt-6 mb-3 text-white border-b border-slate-800 pb-1">{trimmed.replace('# ', '')}</h1>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="text-xl font-bold mt-5 mb-2.5 text-blue-400">{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="text-lg font-bold mt-4 mb-2 text-slate-200">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const content = trimmed.replace(/^[-*]\s+/, '');
        return (
          <ul key={idx} className="list-disc pl-5 my-1.5 text-slate-300">
            <li className="leading-relaxed">{parseInlineMarkdown(content)}</li>
          </ul>
        );
      }
      if (trimmed.length === 0) {
        return <div key={idx} className="h-2" />;
      }
      return <p key={idx} className="my-1.5 text-slate-350 leading-relaxed">{parseInlineMarkdown(trimmed)}</p>;
    });
  };

  // Modern print function compiling markdown to full stylesheet A4 preview
  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked! Please allow popups to download your resume.');
      return;
    }

    // Markdown compiler to HTML string for printing
    const compileToHtml = (markdown) => {
      return markdown.split('\n').map(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('# ')) {
          return `<h1>${trimmed.replace('# ', '')}</h1>`;
        }
        if (trimmed.startsWith('## ')) {
          return `<h2>${trimmed.replace('## ', '')}</h2>`;
        }
        if (trimmed.startsWith('### ')) {
          return `<h3>${trimmed.replace('### ', '')}</h3>`;
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const content = trimmed.replace(/^[-*]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          return `<li class="bullet">${content}</li>`;
        }
        if (trimmed.length === 0) {
          return '<div style="height: 6px;"></div>';
        }
        const textWithBold = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return `<p>${textWithBold}</p>`;
      }).join('');
    };

    const compiledBody = compileToHtml(improvedText);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Improved Resume - ResuMind</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Georgia&family=Inter:wght@400;600;700&display=swap');
          
          @page {
            size: A4;
            margin: 20mm;
          }
          
          body {
            font-family: 'Georgia', serif;
            color: #1a1a1a;
            line-height: 1.5;
            font-size: 11pt;
            margin: 0;
            padding: 0;
          }
          
          h1 {
            font-family: 'Inter', sans-serif;
            font-size: 20pt;
            font-weight: 700;
            text-align: center;
            margin: 0 0 4px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          h2 {
            font-family: 'Inter', sans-serif;
            font-size: 12pt;
            font-weight: 600;
            border-bottom: 1.5px solid #333;
            margin: 18px 0 8px 0;
            padding-bottom: 2px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          h3 {
            font-family: 'Inter', sans-serif;
            font-size: 11pt;
            font-weight: 600;
            margin: 8px 0 2px 0;
            display: flex;
            justify-content: space-between;
          }
          
          p {
            margin: 0 0 6px 0;
            text-align: justify;
          }
          
          ul {
            margin: 0 0 6px 0;
            padding-left: 15px;
          }
          
          li.bullet {
            margin-bottom: 3px;
          }
          
          /* Contact info centered styling */
          h1 + p {
            text-align: center;
            font-family: 'Inter', sans-serif;
            font-size: 9.5pt;
            color: #555;
            margin-bottom: 14px;
          }
          
          strong {
            font-weight: 600;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="resume-wrapper">
          ${compiledBody}
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animated-bg min-h-[calc(100vh-76px)]">
      {/* Top navigation */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar size={12} />
            <span>Analyzed on {new Date(resume.createdAt).toLocaleDateString()}</span>
          </span>
        </div>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Score & Core metrics (col span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* ATS Circle Gauge Panel */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col items-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6">ATS Match Summary</h3>
            <ATSGauge score={resume.atsScore} size={170} />
            <div className="w-full border-t border-slate-850 mt-6 pt-5">
              <span className="text-xs font-semibold text-slate-400 block mb-2 uppercase tracking-wide">Target Role context</span>
              <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl flex items-center gap-2">
                <FileText size={16} className="text-blue-400 shrink-0" />
                <span className="text-sm text-slate-200 truncate font-semibold">{resume.roleCompared}</span>
              </div>
            </div>
          </div>

          {/* Job description comparison score */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-3">AI Role Matching</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Matching Relevance</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                analysisResult.roleMatching?.roleRelevance === 'High' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : analysisResult.roleMatching?.roleRelevance === 'Medium'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {analysisResult.roleMatching?.roleRelevance || 'Medium'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {analysisResult.roleMatching?.comments || 'No comments on job role matching.'}
            </p>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="glass-panel p-6 rounded-3xl space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-3">Core Assessment</h3>
            
            {/* Strengths */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Key Strengths</span>
              {analysisResult.strengths?.map((strength, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-emerald-400">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                  <span className="text-slate-350">{strength}</span>
                </div>
              ))}
            </div>

            {/* Weaknesses */}
            <div className="space-y-2.5 pt-2 border-t border-slate-850">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Gaps & Improvement Areas</span>
              {analysisResult.weaknesses?.map((weakness, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-red-400">
                  <XCircle size={14} className="mt-0.5 shrink-0" />
                  <span className="text-slate-350">{weakness}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-3 mb-4">Missing ATS Keywords</h3>
            {analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analysisResult.missingKeywords.map((keyword, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-850 text-slate-300 rounded-full text-xs font-medium">
                    <Tag size={10} className="text-indigo-400" />
                    <span>{keyword}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No missing critical keywords identified.</p>
            )}
          </div>

        </div>

        {/* Right Side: Tab container (col span 8) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[580px]">
          {/* Tab Selector */}
          <div className="flex border-b border-slate-850 bg-slate-900/50">
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'suggestions'
                  ? 'border-blue-500 text-blue-400 bg-slate-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-950/10'
              }`}
            >
              <Sparkles size={16} />
              <span>AI Recommendations</span>
            </button>
            
            <button
              onClick={() => setActiveTab('improved')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'improved'
                  ? 'border-blue-500 text-blue-400 bg-slate-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-950/10'
              }`}
            >
              <Edit3 size={16} />
              <span>Improved Resume</span>
            </button>

            <button
              onClick={() => setActiveTab('original')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'original'
                  ? 'border-blue-500 text-blue-400 bg-slate-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-950/10'
              }`}
            >
              <BookOpen size={16} />
              <span>Original Text</span>
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="p-6 flex-1 flex flex-col bg-slate-900/10">
            
            {/* Panel 1: Suggestions */}
            {activeTab === 'suggestions' && (
              <div className="space-y-6">
                
                {/* Summary */}
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded bg-blue-500" />
                    <span>Executive Summary</span>
                  </h4>
                  <p className="text-sm text-slate-350 leading-relaxed bg-slate-900/40 p-4 border border-slate-850 rounded-2xl">
                    {analysisResult.summary}
                  </p>
                </div>

                {/* Candidate Info Extracted */}
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded bg-indigo-500" />
                    <span>Parsed Candidate Profile</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-2xl">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Name</span>
                      <span className="block text-sm font-semibold text-slate-200 mt-1">{analysisResult.candidateInfo?.name || 'Unknown'}</span>
                    </div>
                    <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-2xl truncate">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Email</span>
                      <span className="block text-sm font-semibold text-slate-200 mt-1 truncate">{analysisResult.candidateInfo?.email || 'Unknown'}</span>
                    </div>
                    <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-2xl">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Phone</span>
                      <span className="block text-sm font-semibold text-slate-200 mt-1">{analysisResult.candidateInfo?.phone || 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations List */}
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded bg-purple-500" />
                    <span>Actionable Recommendations</span>
                  </h4>
                  <div className="space-y-3">
                    {analysisResult.recommendations?.map((rec, i) => (
                      <div key={i} className="flex gap-3 bg-slate-900/30 border border-slate-850 p-4 rounded-2xl">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs shrink-0 font-bold">
                          {i + 1}
                        </span>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {rec}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Panel 2: Improved Text Editor & PDF printing */}
            {activeTab === 'improved' && (
              <div className="flex-1 flex flex-col md:grid md:grid-cols-2 gap-6 min-h-[480px]">
                {/* Editor on Left */}
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Edit Markdown Resume</span>
                    <span className="text-[10px] text-slate-500">Auto-formatted for download</span>
                  </div>
                  <textarea
                    value={improvedText}
                    onChange={(e) => setImprovedText(e.target.value)}
                    className="flex-1 w-full p-4 bg-slate-950 border border-slate-850 rounded-2xl focus:border-blue-500 focus:outline-none text-slate-300 font-mono text-xs leading-relaxed resize-none h-[380px] md:h-full"
                    placeholder="Enter resume content in markdown..."
                  />
                </div>

                {/* Live Preview on Right */}
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">A4 Standard Preview</span>
                    <button
                      onClick={handleDownloadPDF}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-blue-500/15"
                    >
                      <Download size={13} />
                      <span>Download PDF</span>
                    </button>
                  </div>
                  
                  {/* Clean container mirroring physical document */}
                  <div className="flex-1 overflow-y-auto bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 font-serif text-[10px] leading-normal h-[380px] md:h-full max-h-[420px]">
                    <div className="prose prose-sm max-w-none text-slate-900">
                      {renderMarkdown(improvedText)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Panel 3: Original Parsed Text */}
            {activeTab === 'original' && (
              <div className="flex-1 flex flex-col space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Raw Extracted Text</span>
                <div className="flex-1 bg-slate-950 border border-slate-850 p-5 rounded-2xl overflow-y-auto text-slate-400 font-mono text-xs leading-relaxed max-h-[420px] whitespace-pre-wrap">
                  {resume.parsedText}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
