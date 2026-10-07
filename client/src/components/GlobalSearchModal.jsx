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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4 font-sans">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contracts, extracted terms, or contradiction reports... (Ctrl + K)"
            autoFocus
            className="w-full bg-transparent text-sm text-slate-900 font-normal placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500 font-normal">
              Querying contracts and contradiction index...
            </div>
          ) : (
            <>
              {/* Documents Section */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Matching Contracts ({filteredDocs.length})
                </p>
                {filteredDocs.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">No matching contracts found.</p>
                ) : (
                  <div className="space-y-1.5">
                    {filteredDocs.map((doc) => {
                      const id = doc._id || doc.id;
                      return (
                        <div
                          key={id}
                          onClick={() => {
                            onClose();
                            navigate(`/documents/${id}`);
                          }}
                          className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3 truncate">
                            <FileText className="w-4 h-4 text-slate-500 group-hover:text-blue-600 shrink-0" />
                            <div className="truncate">
                              <h5 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 truncate">
                                {doc.fileName}
                              </h5>
                              <p className="text-[11px] text-slate-500 font-normal">
                                {doc.totalClauses || 0} clauses • {new Date(doc.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Analyses Section */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Contradiction Reports ({filteredAnalyses.length})
                </p>
                {filteredAnalyses.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">No matching contradiction reports found.</p>
                ) : (
                  <div className="space-y-1.5">
                    {filteredAnalyses.map((ana) => {
                      const id = ana._id || ana.id;
                      return (
                        <div
                          key={id}
                          onClick={() => {
                            onClose();
                            navigate(`/results/${id}`);
                          }}
                          className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3 truncate">
                            <ShieldAlert className="w-4 h-4 text-slate-500 group-hover:text-blue-600 shrink-0" />
                            <div className="truncate">
                              <h5 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 truncate">
                                Report ID: {id.substring(0, 10)}...
                              </h5>
                              <p className="text-[11px] text-slate-500 font-normal">
                                {ana.totalFindings || 0} findings detected • {new Date(ana.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Keybind Info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Press ESC to close</span>
          <span>ClauseGuard Cross-Document Search</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
