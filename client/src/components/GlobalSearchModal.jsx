import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, ShieldAlert, Tag, ArrowRight, X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-brand shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contracts, clauses, categories, or risk reports... (Ctrl + K)"
            autoFocus
            className="w-full bg-transparent text-sm text-navy-900 font-medium placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1">
          {/* Contracts Section */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-brand" />
              <span>Contracts & Agreements</span>
            </h4>

            {filteredDocs.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No matching contracts found.</p>
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
                      className="p-3 rounded-xl border border-slate-100 hover:border-brand/40 hover:bg-brand-subtle/50 cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <h5 className="font-bold text-xs text-navy-900 truncate group-hover:text-brand transition-colors">
                            {doc.fileName}
                          </h5>
                          <span className="text-[11px] text-slate-500">
                            {doc.totalClauses || 0} clauses • {doc.totalPages || 1} pages
                          </span>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Analysis Scans Section */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
              <span>Risk Analysis Scans</span>
            </h4>

            {filteredAnalyses.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No analysis scans found.</p>
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
                      className="p-3 rounded-xl border border-slate-100 hover:border-red-200 hover:bg-red-50/40 cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-navy-900 group-hover:text-red-600 transition-colors">
                            Risk Scan: #{anaId.slice(0, 8)}
                          </h5>
                          <span className="text-[11px] text-red-600 font-semibold">
                            {ana.totalFindings || 0} Contradiction Findings
                          </span>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Press <kbd className="px-1.5 py-0.5 bg-white border rounded font-sans font-bold">ESC</kbd> to close</span>
          <span>Powered by ClauseGuard AI Global Search</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
