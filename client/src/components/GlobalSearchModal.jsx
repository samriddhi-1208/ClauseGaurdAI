import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, ShieldAlert, ArrowRight, X } from 'lucide-react';
import { documentAPI, analysisAPI } from '../services/api';

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [documents, setDocuments] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchSearchData();
    }
  }, [isOpen]);

  const fetchSearchData = async () => {
    try {
      setLoading(true);
      const [docRes, anaRes] = await Promise.all([
        documentAPI.getAll(),
        analysisAPI.getAll()
      ]);
      if (docRes.data.success) setDocuments(docRes.data.documents || []);
      if (anaRes.data.success) setAnalyses(anaRes.data.analyses || []);
    } catch (err) {
      console.error('[Search Data Error]', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredDocs = query.trim()
    ? documents.filter(d => d.fileName.toLowerCase().includes(query.toLowerCase()))
    : documents.slice(0, 3);

  const filteredAnalyses = query.trim()
    ? analyses.filter(a => (a._id || a.id).toLowerCase().includes(query.toLowerCase()))
    : analyses.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 bg-[#090D16]/80 flex items-start justify-center pt-20 px-4 font-sans">
      <div className="bg-[#111827] w-full max-w-2xl rounded-xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-[#0B101D]">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contracts, extracted terms, or contradiction reports... (Ctrl + K)"
            autoFocus
            className="w-full bg-transparent text-sm text-white font-normal placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-5 flex-1">
          {/* Contracts Section */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Contracts & Agreements</span>
            </h4>

            {filteredDocs.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No matching contracts found.</p>
            ) : (
              <div className="space-y-1.5">
                {filteredDocs.map((doc) => {
                  const docId = doc._id || doc.id;
                  return (
                    <div
                      key={docId}
                      onClick={() => {
                        onClose();
                        navigate(`/documents/${docId}`);
                      }}
                      className="p-3 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 cursor-pointer transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-8 h-8 rounded-md bg-blue-950 text-blue-400 flex items-center justify-center shrink-0 border border-blue-800/60">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <h5 className="font-medium text-xs text-white truncate group-hover:text-blue-400 transition-colors">
                            {doc.fileName}
                          </h5>
                          <span className="text-[11px] text-slate-400 font-normal">
                            {doc.totalClauses || 0} clauses &bull; {doc.totalPages || 1} pages
                          </span>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Analysis Scans Section */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Risk Analysis Scans</span>
            </h4>

            {filteredAnalyses.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No analysis scans found.</p>
            ) : (
              <div className="space-y-1.5">
                {filteredAnalyses.map((ana) => {
                  const anaId = ana._id || ana.id;
                  return (
                    <div
                      key={anaId}
                      onClick={() => {
                        onClose();
                        navigate(`/results/${anaId}`);
                      }}
                      className="p-3 rounded-lg border border-slate-800 hover:border-rose-800/60 hover:bg-rose-950/20 cursor-pointer transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-8 h-8 rounded-md bg-rose-950 text-rose-400 flex items-center justify-center shrink-0 border border-rose-800/60">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-medium text-xs text-white group-hover:text-rose-400 transition-colors">
                            Risk Scan: #{anaId.slice(0, 8)}
                          </h5>
                          <span className="text-[11px] text-rose-300 font-normal">
                            {ana.totalFindings || 0} Contradiction Findings
                          </span>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-[#0B101D] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Press <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-300 font-mono text-[10px]">ESC</kbd> to dismiss</span>
          <span>ClauseGuard AI</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
