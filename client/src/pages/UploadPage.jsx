import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UploadCloud, FileText, Check, Loader2, AlertCircle, ArrowRight, Zap, X } from 'lucide-react';
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
    <div className="flex-1 bg-[#F8F7F2] flex flex-col min-w-0 pb-16 font-sans text-[#18231C]">
      <Navbar title="Upload Legal Documents" subtitle="Upload agreements, NDAs, or SLAs for AI clause extraction & vector indexing" />

      <main className="p-6 md:p-10 max-w-4xl w-full mx-auto space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-[#18231C] tracking-tight">
              Contract Intake & Indexing
            </h1>
            <p className="text-xs text-[#5A665D] mt-0.5">
              Select contracts in PDF, DOCX, or TXT format for automatic clause breakdown
            </p>
          </div>

          <button
            onClick={handleRunDemo}
            disabled={seeding}
            className="px-4 py-2 bg-white hover:bg-[#F2F0E8] text-[#18231C] border border-[#DDDCD3] font-semibold text-xs rounded-xl shadow-2xs flex items-center gap-2 transition-colors disabled:opacity-50 self-start sm:self-auto"
          >
            <Zap className="w-3.5 h-3.5 text-[#C27D38]" />
            <span>{seeding ? 'Seeding Demo Data...' : 'Load Sample Contracts'}</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-[#F9DFDE] border border-[#F2CAC8] rounded-xl flex items-center gap-2.5 text-xs font-semibold text-[#B5413D]">
            <AlertCircle className="w-4 h-4 text-[#B5413D] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Drag and Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="bg-white border-2 border-dashed border-[#D2DDD2] hover:border-[#3F6149] rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all shadow-card group"
        >
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-[#EAECE4] group-hover:bg-[#D7DCD3] text-[#3F6149] flex items-center justify-center mx-auto mb-4 transition-colors shadow-2xs">
            <UploadCloud className="w-7 h-7 stroke-[1.8]" />
          </div>

          <h3 className="text-sm md:text-base font-semibold text-[#18231C]">
            Click to upload or drag & drop contracts
          </h3>
          <p className="text-xs text-[#5A665D] mt-1 max-w-sm mx-auto">
            Supported formats: PDF, DOCX, TXT. Documents are securely processed and vectorized.
          </p>
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#DDDCD3] p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECEAE2] pb-3">
              <h3 className="text-xs font-semibold text-[#18231C]">
                Ready for Extraction ({selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'})
              </h3>
              <button
                onClick={() => setSelectedFiles([])}
                className="text-[11px] font-semibold text-[#B5413D] hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {selectedFiles.map((f, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#FAF9F5] border border-[#DDDCD3] rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-[#D8E4EE] text-[#35536D] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 stroke-[1.8]" />
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-[#18231C] truncate">{f.name}</p>
                      <p className="text-[10px] text-[#758177]">{(f.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    className="p-1 text-[#8C948C] hover:text-[#B5413D] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {uploading && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-semibold text-[#3F6149]">
                  <span>Extracting clauses & building semantic embeddings...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#EAECE4] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#3F6149] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={handleUploadAll}
              disabled={uploading}
              className="w-full py-2.5 bg-[#3F6149] hover:bg-[#34503C] text-white font-semibold text-xs md:text-sm rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Documents...</span>
                </>
              ) : (
                <>
                  <span>Upload & Analyze Obligations</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Processed Documents Result List */}
        {processedDocs.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#DDDCD3] p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2F5236] border-b border-[#ECEAE2] pb-3">
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Successfully Processed Documents ({processedDocs.length})</span>
            </div>

            <div className="space-y-2">
              {processedDocs.map((doc) => {
                const id = doc._id || doc.id;
                return (
                  <div
                    key={id}
                    className="p-3 bg-[#FAF9F5] border border-[#DDDCD3] rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-7 h-7 rounded-lg bg-[#E2ECE3] text-[#2F5236] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 stroke-[1.8]" />
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-[#18231C] truncate">{doc.fileName}</p>
                        <p className="text-[10px] text-[#758177]">
                          {doc.totalClauses || 0} clauses categorized into vector memory
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={doc.processingStatus} />
                      <Link
                        to={`/documents/${id}`}
                        className="text-xs font-semibold text-[#3F6149] hover:text-[#273C2D] flex items-center gap-1 transition-colors"
                      >
                        <span>View Clauses</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 flex justify-end">
              <Link
                to="/compare"
                className="py-2.5 px-4 bg-[#3F6149] hover:bg-[#34503C] text-white font-semibold text-xs rounded-xl shadow-2xs flex items-center gap-2 transition-colors"
              >
                <span>Proceed to Cross-Document Comparison</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UploadPage;
