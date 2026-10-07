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
    <div className="flex-1 bg-[#F8F7F2] flex flex-col min-w-0 pb-16 font-sans text-[#18231C]">
      <Navbar title="Document Library" subtitle="Manage legal contracts, extracted clauses, and vector storage" />

      <main className="p-6 md:p-10 max-w-7xl w-full mx-auto space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-[#18231C] tracking-tight">
              Contract Library
            </h1>
            <p className="text-xs text-[#5A665D] mt-0.5">
              Select 2 or more contracts to initiate automated cross-document contradiction analysis
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {selectedIds.length >= 2 && (
              <button
                onClick={handleCompareSelected}
                className="px-3.5 py-2 bg-[#3F6149] hover:bg-[#34503C] text-white font-semibold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
              >
                <GitCompare className="w-3.5 h-3.5 stroke-[2]" />
                <span>Compare Selected ({selectedIds.length})</span>
              </button>
            )}

            <button
              onClick={handleRunDemo}
              disabled={seeding}
              className="px-3.5 py-2 bg-white hover:bg-[#F2F0E8] text-[#18231C] border border-[#DDDCD3] font-semibold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-[#C27D38]" />
              <span>{seeding ? 'Loading...' : 'Instant Demo'}</span>
            </button>

            <Link
              to="/upload"
              className="px-3.5 py-2 bg-[#3F6149] hover:bg-[#34503C] text-white font-semibold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2]" />
              <span>Upload Contract</span>
            </Link>
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#DDDCD3] shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#8C948C] absolute left-3.5 top-3 stroke-[1.8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contracts by file name..."
              className="w-full pl-10 pr-4 py-2 bg-[#FAF9F5] border border-[#DDDCD3] rounded-xl text-xs text-[#18231C] placeholder-[#8C948C] focus:outline-none focus:border-[#3F6149] focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2 text-xs text-[#5A665D]">
              <Filter className="w-3.5 h-3.5 text-[#8C948C]" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FAF9F5] border border-[#DDDCD3] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#18231C] focus:outline-none focus:border-[#3F6149]"
              >
                <option value="newest">Newest First</option>
                <option value="clauses">Most Clauses</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            <span className="text-xs text-[#758177] pl-3 border-l border-[#ECEAE2]">
              {filteredDocs.length} Contracts
            </span>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="bg-white rounded-2xl border border-[#DDDCD3] shadow-card overflow-hidden">
          {loading ? (
            <div className="py-14 text-center text-[#6B736D] text-xs font-normal">
              Loading contract library...
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EAECE4] text-[#3F6149] flex items-center justify-center mx-auto">
                <FolderOpen className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h4 className="text-sm font-semibold text-[#18231C]">No contracts found</h4>
              <p className="text-xs text-[#5A665D] max-w-sm mx-auto">
                No legal agreements matched your search filter. Clear your query or upload new documents.
              </p>
              <button
                onClick={handleRunDemo}
                className="px-4 py-2 bg-white hover:bg-[#F2F0E8] text-[#18231C] border border-[#DDDCD3] font-semibold text-xs rounded-xl shadow-2xs"
              >
                Load Sample Contracts
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#18231C]">
                <thead className="bg-[#FAF9F5] text-[11px] font-semibold text-[#5A665D] uppercase tracking-wider border-b border-[#ECEAE2]">
                  <tr>
                    <th className="py-3.5 px-4 w-10">
                      <button
                        onClick={toggleSelectAll}
                        aria-label="Select all contracts"
                        className="text-[#8C948C] hover:text-[#3F6149] transition-colors"
                      >
                        {selectedIds.length === filteredDocs.length && filteredDocs.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-[#3F6149]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-3.5 px-4">Contract Name</th>
                    <th className="py-3.5 px-4">Clauses</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Upload Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1EFE8]">
                  {filteredDocs.map((doc) => {
                    const id = doc._id || doc.id;
                    const isSelected = selectedIds.includes(id);

                    return (
                      <tr
                        key={id}
                        className={`hover:bg-[#FAF9F5] transition-colors ${
                          isSelected ? 'bg-[#EAECE4]/40' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => toggleSelect(id)}
                            aria-label={`Select contract ${doc.fileName}`}
                            className="text-[#8C948C] hover:text-[#3F6149] transition-colors"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#3F6149]" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-[#D8E4EE] text-[#35536D] flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 stroke-[1.8]" />
                            </div>
                            <div className="truncate max-w-xs md:max-w-md">
                              <Link
                                to={`/documents/${id}`}
                                className="font-semibold text-xs text-[#18231C] hover:text-[#3F6149] transition-colors truncate block"
                              >
                                {doc.fileName}
                              </Link>
                              <span className="text-[10px] text-[#758177]">
                                ID: {id.slice(-8)}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#EDE9DE] text-[#685F4D] border border-[#DDD6C5] text-[11px] font-semibold">
                            {doc.totalClauses || 0} clauses
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <StatusBadge status={doc.processingStatus} />
                        </td>

                        <td className="py-3.5 px-4 text-[#758177] font-normal">
                          {new Date(doc.uploadDate || doc.createdAt || Date.now()).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/documents/${id}`}
                              className="p-1.5 rounded-lg text-[#5A665D] hover:text-[#18231C] hover:bg-[#EAECE4] transition-colors"
                              title="Inspect Clauses"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(id)}
                              disabled={deletingId === id}
                              className="p-1.5 rounded-lg text-[#8C948C] hover:text-[#B5413D] hover:bg-[#F9DFDE]/50 transition-colors disabled:opacity-40"
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
