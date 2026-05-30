import React, { useRef, useState } from 'react';
import { UploadCloud, File, AlertCircle } from 'lucide-react';

export default function UploadZone({ onFileSelected, isLoading }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const fileInputRef = useRef(null);

  const validateAndProcessFile = (file) => {
    setError(null);
    if (!file) return;

    const allowedExtensions = ['.pdf', '.docx'];
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      setError('Invalid file type. Please upload a PDF or DOCX file.');
      setFileDetails(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum size is 5MB.');
      setFileDetails(null);
      return;
    }

    setFileDetails({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    });
    
    onFileSelected(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const triggerInputClick = () => {
    if (!isLoading) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInputClick}
        className={`w-full py-10 px-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          isDragActive 
            ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/5' 
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          disabled={isLoading}
        />

        <div className="bg-slate-950 p-4 rounded-full text-blue-500 mb-4 border border-slate-800 shadow-md group-hover:scale-110 transition-transform">
          <UploadCloud size={32} />
        </div>

        <h3 className="text-lg font-semibold text-slate-200 mb-1">
          Drag & drop your resume here
        </h3>
        <p className="text-sm text-slate-400 text-center mb-6 max-w-xs">
          Supports PDF or DOCX format (Max size 5MB)
        </p>

        <button
          type="button"
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 text-sm font-medium transition-all text-slate-300"
        >
          Select File
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm animate-pulse-slow">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {fileDetails && !error && (
        <div className="mt-4 flex items-center gap-3 p-3 rounded-xl border border-slate-850 bg-slate-900/30 text-slate-300 text-sm">
          <File size={16} className="text-blue-500 shrink-0" />
          <div className="flex-1 truncate">
            <p className="font-medium truncate">{fileDetails.name}</p>
            <p className="text-xs text-slate-500">{fileDetails.size}</p>
          </div>
        </div>
      )}
    </div>
  );
}
