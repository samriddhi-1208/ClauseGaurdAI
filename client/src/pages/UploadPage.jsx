import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle2, Loader2, AlertCircle, ArrowRight, Zap, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { documentAPI, demoAPI } from '../services/api';

const UploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processedDocs, setProcessedDocs] = useState([]);
  const [error, setError] = useState('');
  const [seeding, setSeeding] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadAll = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one PDF, DOCX, or TXT legal document.');
      return;
    }

    setUploading(true);
    setUploadProgress(10);
    setError('');
    const results = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);

        setUploadProgress(Math.round(((i + 0.5) / selectedFiles.length) * 100));
        const res = await documentAPI.upload(formData);
        
        if (res.data.success) {
          results.push(res.data.document);
        }
      }

      setUploadProgress(100);
      setProcessedDocs(results);
      setSelectedFiles([]);
    } catch (err) {
      console.error('[Upload Error]', err);
      setError(err.response?.data?.message || 'Failed to process file uploads.');
    } finally {
      setUploading(false);
    }
  };

  const handleRunDemo = async () => {
    try {
      setSeeding(true);
      const res = await demoAPI.seed();
      if (res.data.success) {
        navigate(`/results/${res.data.analysisId}`);
      }
    } catch (err) {
      console.error('[Demo Seed Error]', err);
      alert('Could not seed demo contracts.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-w-0 pb-12 font-sans text-slate-900">
      <Navbar title="Upload Legal Documents" subtitle="Upload agreements, NDAs, or policies for AI clause extraction & vector indexing" />

      <main className="p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Upload Contracts</h1>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Upload agreements to extract clauses and perform cross-document contradiction detection
            </p>
          </div>

          <button
            onClick={handleRunDemo}
            disabled={seeding}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-medium text-xs rounded-lg shadow-2xs flex items-center gap-2 transition-colors disabled:opacity-50 shrink-0"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>{seeding ? 'Loading...' : 'Instant Demo Mode'}</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs font-medium text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Drag & Drop Upload Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-slate-500 bg-white p-10 md:p-12 rounded-xl text-center cursor-pointer transition-colors shadow-sm group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".pdf,.docx,.txt"
            className="hidden"
          />

          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>

          <h3 className="font-semibold text-base text-slate-900 tracking-tight">Upload Legal Agreements</h3>
          <p className="text-xs text-slate-500 font-normal mt-1 max-w-md mx-auto">
            Drag and drop contracts here, or click to browse files on your computer.
          </p>

          <div className="flex items-center justify-center gap-2 mt-5">
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium border border-slate-200">
              PDF
            </span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium border border-slate-200">
              DOCX
            </span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium border border-slate-200">
              TXT
            </span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded text-xs font-normal border border-slate-200">
              Max 25MB per file
            </span>
          </div>
        </div>

        {/* Upload Queue */}
        {selectedFiles.length > 0 && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-semibold text-xs text-slate-900 uppercase tracking-wider">
                Upload Queue ({selectedFiles.length} Selected)
              </h4>
              <button
                onClick={() => setSelectedFiles([])}
                className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-2">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center gap-3 truncate">
                    <FileText className="w-4 h-4 text-slate-600 shrink-0" />
                    <div className="truncate">
                      <h5 className="font-medium text-slate-900 truncate">{file.name}</h5>
                      <span className="text-[11px] text-slate-500 font-normal">{Math.round(file.size / 1024)} KB</span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFile(idx)}
                    aria-label={`Remove ${file.name} from queue`}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {uploading && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>Uploading & Extracting Clauses via Gemini AI...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={handleUploadAll}
              disabled={uploading}
              className="w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-medium text-xs md:text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Upload Queue...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Process ({selectedFiles.length} Contracts)</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Processed Results Notification */}
        {processedDocs.length > 0 && (
          <div className="bg-white p-5 rounded-xl border border-emerald-300 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h4 className="font-semibold text-xs uppercase tracking-wider">
                  Upload Complete ({processedDocs.length} Documents)
                </h4>
              </div>

              <Link
                to="/compare"
                className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white font-medium text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Proceed to Contradiction Scan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2">
              {processedDocs.map((doc) => {
                const docId = doc._id || doc.id;
                return (
                  <div key={docId} className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border border-emerald-200 text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-emerald-700" />
                      <span className="font-medium text-slate-900">{doc.fileName}</span>
                    </div>
                    <StatusBadge status={doc.processingStatus} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UploadPage;
