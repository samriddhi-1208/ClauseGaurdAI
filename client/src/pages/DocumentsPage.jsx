import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, GitCompare, Trash2, Eye, Plus, Search, CheckSquare, Square, Zap, Filter, FolderOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { documentAPI, demoAPI } from '../services/api';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await documentAPI.getAll();
      if (res.data.success) {
        setDocuments(res.data.documents || []);
      }
    } catch (err) {
      console.error('[Fetch Documents Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredDocs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDocs.map(d => d._id || d.id));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contract and remove all extracted clauses & vector indexes?')) return;
    try {
      setDeletingId(id);
      await documentAPI.delete(id);
      setDocuments(prev => prev.filter(d => (d._id !== id && d.id !== id)));
      setSelectedIds(prev => prev.filter(item => item !== id));
    } catch (err) {
      console.error('[Delete Error]', err);
      alert('Failed to delete document.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCompareSelected = () => {
    if (selectedIds.length < 2) {
      alert('Please select at least two contracts for cross-document comparison.');
      return;
    }
    navigate('/compare', { state: { selectedDocumentIds: selectedIds } });
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

  const filteredDocs = documents
    .filter(d => d.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0);
      if (sortBy === 'clauses') return (b.totalClauses || 0) - (a.totalClauses || 0);
      return a.fileName.localeCompare(b.fileName);
    });

  return (
    <div className="flex-1 bg-[#0B0A08] flex flex-col min-w-0 pb-16 font-sans text-[#EDE5D5] selection:bg-[#E5C38E]/20 selection:text-[#F8F6F0]">
      <Navbar title="Contract Library" subtitle="Manage legal contracts, extracted clauses, and vector storage" />

      <main className="p-6 md:p-10 max-w-7xl w-full mx-auto space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-medium text-[#F4EFE5] tracking-normal leading-snug">
              Contract Library
            </h1>
            <p className="text-sm text-[#B9AE9A] mt-2 leading-relaxed">
              Select 2 or more contracts to initiate automated cross-document contradiction analysis
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {selectedIds.length >= 2 && (
              <button
                onClick={handleCompareSelected}
                className="px-3.5 py-2 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <GitCompare className="w-3.5 h-3.5 stroke-[2]" />
                <span>Compare Selected ({selectedIds.length})</span>
              </button>
            )}

            <button
              onClick={handleRunDemo}
              disabled={seeding}
              className="px-3.5 py-2 bg-[#14120E] hover:bg-[#1B1813] text-[#EDE5D5] border border-[#2D261C] hover:border-[#E5C38E]/50 font-medium text-xs rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[#E5C38E]" />
              <span>{seeding ? 'Loading...' : 'Instant Demo'}</span>
            </button>

            <Link
              to="/upload"
              className="px-3.5 py-2 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2]" />
              <span>Upload Contract</span>
            </Link>
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div className="bg-[#12100D] p-4 rounded-xl border border-[#231F19] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#8C806F] absolute left-3.5 top-2.5 stroke-[1.8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contracts by file name..."
              className="w-full pl-10 pr-4 py-2 bg-[#16130F] border border-[#231F19] rounded-lg text-xs text-[#EDE5D5] placeholder-[#8C806F] focus:outline-none focus:border-[#E5C38E]/60 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2 text-xs text-[#8C806F]">
              <Filter className="w-3.5 h-3.5 text-[#E5C38E]" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#16130F] border border-[#231F19] rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#EDE5D5] focus:outline-none focus:border-[#E5C38E]/60"
              >
                <option value="newest">Newest First</option>
                <option value="clauses">Most Clauses</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            <span className="text-xs text-[#8C806F] pl-3 border-l border-[#1F1B16]">
              {filteredDocs.length} Contracts
            </span>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="bg-[#12100D] rounded-xl border border-[#231F19] overflow-hidden">
          {loading ? (
            <div className="py-14 text-center text-[#8C806F] text-xs font-normal">
              Loading contract library...
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#1A1712] border border-[#2E271D] text-[#E5C38E] flex items-center justify-center mx-auto">
                <FolderOpen className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h4 className="text-sm font-serif text-[#F4EFE5]">No contracts found</h4>
              <p className="text-xs text-[#8C806F] max-w-sm mx-auto">
                No legal agreements matched your search filter. Clear your query or upload new documents.
              </p>
              <button
                onClick={handleRunDemo}
                className="px-4 py-2 bg-[#14120E] hover:bg-[#1B1813] text-[#EDE5D5] border border-[#2D261C] font-medium text-xs rounded-lg cursor-pointer"
              >
                Load Sample Contracts
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#EDE5D5]">
                <thead className="bg-[#16130F] text-[11px] font-medium text-[#8C806F] uppercase tracking-wider border-b border-[#1F1B16]">
                  <tr>
                    <th className="py-3 px-4 w-10">
                      <button
                        onClick={toggleSelectAll}
                        aria-label="Select all contracts"
                        className="text-[#8C806F] hover:text-[#E5C38E] transition-colors"
                      >
                        {selectedIds.length === filteredDocs.length && filteredDocs.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-[#E5C38E]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#5C5346]" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4">Contract Name</th>
                    <th className="py-3 px-4">Clauses</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Upload Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1B1813]">
                  {filteredDocs.map((doc) => {
                    const id = doc._id || doc.id;
                    const isSelected = selectedIds.includes(id);

                    return (
                      <tr
                        key={id}
                        className={`hover:bg-[#171410] transition-colors ${
                          isSelected ? 'bg-[#1D1913]/60' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleSelect(id)}
                            aria-label={`Select contract ${doc.fileName}`}
                            className="text-[#8C806F] hover:text-[#E5C38E] transition-colors"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#E5C38E]" />
                            ) : (
                              <Square className="w-4 h-4 text-[#5C5346]" />
                            )}
                          </button>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-[#191612] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center shrink-0">
                              <FileText className="w-3.5 h-3.5 stroke-[1.8]" />
                            </div>
                            <div className="truncate max-w-xs md:max-w-md">
                              <Link
                                to={`/documents/${id}`}
                                className="font-serif font-medium text-xs text-[#F4EFE5] hover:text-[#E5C38E] transition-colors truncate block"
                              >
                                {doc.fileName}
                              </Link>
                              <span className="text-[10px] text-[#8C806F]">
                                ID: {id.slice(-8)}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#171410] text-[#A99E8C] border border-[#2B251B] text-[11px] font-medium">
                            {doc.totalClauses || 0} clauses
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <StatusBadge status={doc.processingStatus} />
                        </td>

                        <td className="py-3 px-4 text-[#8C806F] font-normal">
                          {new Date(doc.uploadDate || doc.createdAt || Date.now()).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/documents/${id}`}
                              className="p-1.5 rounded-lg text-[#8C806F] hover:text-[#EDE5D5] hover:bg-[#1E1A14] transition-colors"
                              title="Inspect Clauses"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(id)}
                              disabled={deletingId === id}
                              className="p-1.5 rounded-lg text-[#8C806F] hover:text-[#ECA09B] hover:bg-[#261516] transition-colors disabled:opacity-40 cursor-pointer"
                              title="Delete Contract"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DocumentsPage;
