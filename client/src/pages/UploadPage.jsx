import React, { useState, useRef, useEffect } from 'react';
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

  // Poll for document processing completion if any document is in 'processing' status
  useEffect(() => {
    const hasPending = processedDocs.some(d => d.processingStatus === 'processing');
    if (!hasPending) return;

    const interval = setInterval(async () => {
      try {
        const res = await documentAPI.getAll();
        if (res.data?.success && Array.isArray(res.data.documents)) {
          const map = new Map(res.data.documents.map(d => [d._id || d.id, d]));
          setProcessedDocs(prev => prev.map(doc => {
            const fresh = map.get(doc._id || doc.id);
            return fresh ? { ...doc, ...fresh } : doc;
          }));
        }
      } catch (err) {
        console.warn('[Doc Status Polling Error]', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [processedDocs]);

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
    <div className="flex-1 bg-[#0B0A08] flex flex-col min-w-0 pb-16 font-sans text-[#EDE5D5] selection:bg-[#E5C38E]/20 selection:text-[#F8F6F0]">
      <Navbar title="Contract Intake & Upload" subtitle="Upload agreements, NDAs, or SLAs for AI clause extraction & vector indexing" />

      <main className="p-6 md:p-10 max-w-4xl w-full mx-auto space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-medium text-[#F4EFE5] tracking-normal leading-snug">
              Contract Intake & Indexing
            </h1>
            <p className="text-sm text-[#B9AE9A] mt-2 leading-relaxed">
              Select contracts in PDF, DOCX, or TXT format for automatic clause breakdown
            </p>
          </div>

          <button
            onClick={handleRunDemo}
            disabled={seeding}
            className="px-4 py-2.5 bg-[#14120E] hover:bg-[#1B1813] text-[#EDE5D5] border border-[#2D261C] hover:border-[#E5C38E]/50 font-medium text-xs md:text-sm rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 self-start sm:self-auto cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-[#E5C38E]" />
            <span>{seeding ? 'Seeding Demo Data...' : 'Load Sample Contracts'}</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-[#241314] border border-[#482325] rounded-lg flex items-center gap-2.5 text-xs md:text-sm text-[#ECA09B]">
            <AlertCircle className="w-4 h-4 text-[#ECA09B] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Drag and Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="bg-[#12100D] border-2 border-dashed border-[#2B251B] hover:border-[#E5C38E]/60 rounded-xl p-10 md:p-14 text-center cursor-pointer transition-all group"
        >
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />

          <div className="w-14 h-14 rounded-xl bg-[#1A1712] border border-[#2E271D] group-hover:border-[#E5C38E]/40 text-[#E5C38E] flex items-center justify-center mx-auto mb-4 transition-colors">
            <UploadCloud className="w-7 h-7 stroke-[1.8]" />
          </div>

          <h3 className="text-base md:text-lg font-serif font-medium text-[#F4EFE5] tracking-normal leading-snug">
            Click to upload or drag & drop contracts
          </h3>
          <p className="text-xs md:text-sm text-[#A99E8C] mt-2.5 max-w-md mx-auto leading-relaxed">
            Supported formats: PDF, DOCX, TXT. Documents are securely parsed and vectorized into isolated embeddings.
          </p>
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="bg-[#12100D] rounded-xl border border-[#231F19] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F1B16] pb-3">
              <h3 className="text-xs uppercase tracking-wider text-[#A99E8C] font-medium">
                Ready for Extraction ({selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'})
              </h3>
              <button
                onClick={() => setSelectedFiles([])}
                className="text-[11px] font-medium text-[#ECA09B] hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {selectedFiles.map((f, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#16130F] border border-[#231F19] rounded-lg flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-[#1D1914] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 stroke-[1.8]" />
                    </div>
                    <div className="truncate">
                      <p className="font-medium text-[#EDE5D5] truncate">{f.name}</p>
                      <p className="text-[10px] text-[#8C806F]">{(f.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    className="p-1 text-[#8C806F] hover:text-[#ECA09B] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {uploading && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] text-[#E5C38E]">
                  <span>Extracting clauses & building semantic embeddings...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#1B1813] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#E5C38E] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={handleUploadAll}
              disabled={uploading}
              className="w-full py-2.5 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-semibold text-xs md:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
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
          <div className="bg-[#12100D] rounded-xl border border-[#231F19] p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-[#98C7A3] border-b border-[#1F1B16] pb-3">
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Successfully Processed Documents ({processedDocs.length})</span>
            </div>

            <div className="space-y-2">
              {processedDocs.map((doc) => {
                const id = doc._id || doc.id;
                return (
                  <div
                    key={id}
                    className="p-3.5 bg-[#16130F] border border-[#231F19] rounded-lg flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-8 h-8 rounded-lg bg-[#1D1914] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 stroke-[1.8]" />
                      </div>
                      <div className="truncate">
                        <p className="font-serif font-medium text-sm text-[#F4EFE5] truncate">{doc.fileName}</p>
                        {doc.processingStatus === 'processing' ? (
                          <p className="text-xs text-[#E5C38E] flex items-center gap-1.5 mt-0.5">
                            <Loader2 className="w-3 h-3 animate-spin text-[#E5C38E]" />
                            <span>Extracting clauses & vectorizing into memory...</span>
                          </p>
                        ) : (
                          <p className="text-xs text-[#8C806F] mt-0.5">
                            {doc.totalClauses || 0} clauses categorized into vector memory
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={doc.processingStatus} />
                      <Link
                        to={`/documents/${id}`}
                        className="text-xs font-medium text-[#E5C38E] hover:text-[#F4EFE5] flex items-center gap-1 transition-colors"
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
                className="py-2.5 px-4 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-semibold text-xs md:text-sm rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
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
