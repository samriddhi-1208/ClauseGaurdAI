import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, ArrowRight, X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-[#18231C]/35 backdrop-blur-xs flex items-start justify-center pt-20 px-4 font-sans">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-dropdown border border-[#DDDCD3] overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E8E6DC] flex items-center gap-3 bg-[#F8F7F2]">
          <Search className="w-5 h-5 text-[#5A665D] shrink-0 stroke-[1.8]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contracts, extracted terms, or contradiction reports... (Ctrl + K)"
            autoFocus
            className="w-full bg-transparent text-sm text-[#18231C] font-normal placeholder-[#8C948C] focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-lg text-[#6B736D] hover:text-[#18231C] hover:bg-[#EAE8DF] transition-colors"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="py-8 text-center text-xs text-[#6B736D] font-normal">
              Querying contracts and contradiction index...
            </div>
          ) : (
            <>
              {/* Documents Section */}
              <div>
                <p className="text-[11px] font-semibold text-[#6B736D] uppercase tracking-wider mb-2">
                  Matching Contracts ({filteredDocs.length})
                </p>
                {filteredDocs.length === 0 ? (
                  <p className="text-xs text-[#8C948C] py-2">No matching contracts found.</p>
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
                          className="p-3 bg-white hover:bg-[#F8F7F2] border border-[#DDDCD3] rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3 truncate">
                            <div className="w-7 h-7 rounded-lg bg-[#D8E4EE] text-[#35536D] flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 stroke-[1.8]" />
                            </div>
                            <div className="truncate">
                              <h5 className="text-xs font-semibold text-[#18231C] group-hover:text-[#3F6149] truncate">
                                {doc.fileName}
                              </h5>
                              <p className="text-[10px] text-[#6B736D]">
                                {doc.totalClauses || 0} extracted clauses • {new Date(doc.uploadDate || doc.createdAt || Date.now()).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#8C948C] group-hover:text-[#3F6149] shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Contradiction Analyses Section */}
              <div>
                <p className="text-[11px] font-semibold text-[#6B736D] uppercase tracking-wider mb-2">
                  Contradiction Reports ({filteredAnalyses.length})
                </p>
                {filteredAnalyses.length === 0 ? (
                  <p className="text-xs text-[#8C948C] py-2">No comparison reports found.</p>
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
                          className="p-3 bg-white hover:bg-[#F8F7F2] border border-[#DDDCD3] rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
                        >
                          <div className="truncate">
                            <h5 className="text-xs font-semibold text-[#18231C] group-hover:text-[#3F6149] truncate">
                              Contradiction Audit #{id.slice(-6)}
                            </h5>
                            <p className="text-[10px] text-[#6B736D]">
                              {ana.totalFindings || 0} findings flagged across documents
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#8C948C] group-hover:text-[#3F6149] shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#F8F7F2] border-t border-[#E8E6DC] flex items-center justify-between text-[11px] text-[#6B736D]">
          <span>Navigation tip: Click any result to view details</span>
          <kbd className="px-1.5 py-0.5 bg-[#EDE9DE] border border-[#DDD6C5] rounded text-[10px] font-mono">
            ESC to close
          </kbd>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
