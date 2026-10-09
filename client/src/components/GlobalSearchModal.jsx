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
      if (docRes.data?.success) setDocuments(docRes.data.documents || []);
      if (anaRes.data?.success) setAnalyses(anaRes.data.analyses || []);
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
    <div className="fixed inset-0 z-50 bg-[#000000]/70 backdrop-blur-xs flex items-start justify-center pt-8 sm:pt-20 px-3 sm:px-4 font-sans">
      <div className="bg-[#14120E] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#2B251B] overflow-hidden flex flex-col max-h-[80vh] text-[#EDE5D5]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#24201A] flex items-center gap-3 bg-[#181612]">
          <Search className="w-5 h-5 text-[#E5C38E] shrink-0 stroke-[2]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contracts, extracted terms, or contradiction reports... (Ctrl + K)"
            autoFocus
            className="w-full bg-transparent text-sm text-[#F8F6F0] font-normal placeholder-[#8C806F] focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-lg text-[#8C806F] hover:text-[#F8F6F0] hover:bg-[#201D17] transition-colors"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="py-8 text-center text-xs text-[#8C806F] font-normal">
              Querying contracts and contradiction index...
            </div>
          ) : (
            <>
              {/* Documents Section */}
              <div>
                <p className="text-[11px] font-bold text-[#8C806F] uppercase tracking-wider mb-2">
                  Matching Contracts ({filteredDocs.length})
                </p>
                {filteredDocs.length === 0 ? (
                  <p className="text-xs text-[#8C806F] py-2">No matching contracts found.</p>
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
                          className="p-3 bg-[#181612] hover:bg-[#201D17] border border-[#2B251B] hover:border-[#3D3528] rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3 truncate">
                            <div className="w-7 h-7 rounded-lg bg-[#241E15] border border-[#C8A97E]/30 text-[#E5C38E] flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 stroke-[2]" />
                            </div>
                            <div className="truncate">
                              <h5 className="text-xs font-bold text-[#F8F6F0] group-hover:text-[#E5C38E] truncate">
                                {doc.fileName}
                              </h5>
                              <p className="text-[10px] text-[#8C806F]">
                                {doc.totalClauses || 0} extracted clauses • {new Date(doc.uploadDate || doc.createdAt || Date.now()).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#8C806F] group-hover:text-[#E5C38E] shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Contradiction Analyses Section */}
              <div>
                <p className="text-[11px] font-bold text-[#8C806F] uppercase tracking-wider mb-2">
                  Contradiction Reports ({filteredAnalyses.length})
                </p>
                {filteredAnalyses.length === 0 ? (
                  <p className="text-xs text-[#8C806F] py-2">No comparison reports found.</p>
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
                          className="p-3 bg-[#181612] hover:bg-[#201D17] border border-[#2B251B] hover:border-[#3D3528] rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
                        >
                          <div className="truncate">
                            <h5 className="text-xs font-bold text-[#F8F6F0] group-hover:text-[#E5C38E] truncate">
                              Contradiction Audit #{id.slice(-6)}
                            </h5>
                            <p className="text-[10px] text-[#8C806F]">
                              {ana.totalFindings || 0} findings flagged across documents
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#8C806F] group-hover:text-[#E5C38E] shrink-0" />
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
        <div className="p-3 bg-[#181612] border-t border-[#24201A] flex items-center justify-between text-[11px] text-[#8C806F]">
          <span>Navigation tip: Click any result to view details</span>
          <kbd className="px-1.5 py-0.5 bg-[#201D17] border border-[#352F25] text-[#E5C38E] rounded text-[10px] font-mono">
            ESC to close
          </kbd>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
