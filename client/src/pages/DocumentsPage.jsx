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
    <div className="flex-1 bg-[#090D16] flex flex-col min-w-0 pb-12 font-sans text-slate-100">
      <Navbar title="Document Library" subtitle="Manage legal contracts, extracted clauses, and vector storage" />

      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Contract Library</h1>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Select 2 or more contracts to initiate automated cross-document contradiction analysis
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedIds.length >= 2 && (
              <button
                onClick={handleCompareSelected}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg shadow-xs flex items-center gap-2 transition-colors"
              >
                <GitCompare className="w-4 h-4" />
                <span>Compare Selected ({selectedIds.length})</span>
              </button>
            )}

            <button
              onClick={handleRunDemo}
              disabled={seeding}
              className="px-3.5 py-2 bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border border-amber-800/60 font-medium text-xs rounded-lg shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{seeding ? 'Loading...' : 'Instant Demo Mode'}</span>
            </button>

            <Link
              to="/upload"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg shadow-xs flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Contract</span>
            </Link>
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contracts by file name..."
              className="w-full pl-10 pr-4 py-2 bg-[#0B101D] border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#0B101D] border border-slate-800 rounded-md px-2.5 py-1 text-xs font-medium text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="clauses">Most Clauses</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            <span className="text-xs text-slate-400 font-medium pl-3 border-l border-slate-800">
              {filteredDocs.length} Contracts
            </span>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="bg-[#111827] rounded-xl border border-slate-800 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-14 text-center text-slate-400 text-xs font-normal">Loading contract library...</div>
          ) : filteredDocs.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <FolderOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-semibold text-white">No contracts found</h4>
              <p className="text-xs text-slate-400 font-normal max-w-sm mx-auto">
                No legal agreements matched your search filter. Clear your query or upload new documents.
              </p>
              <button
                onClick={handleRunDemo}
                className="px-4 py-2 bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border border-amber-800/60 font-medium text-xs rounded-lg shadow-xs"
              >
                Load Sample Contracts
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0B101D] text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 w-10">
                      <button
                        onClick={toggleSelectAll}
                        aria-label="Select all contracts"
                        className="text-slate-400 hover:text-blue-400"
                      >
                        {selectedIds.length === filteredDocs.length && filteredDocs.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4">Contract Name</th>
                    <th className="py-3 px-4">Upload Date</th>
                    <th className="py-3 px-4">Processing Status</th>
                    <th className="py-3 px-4">Pages</th>
                    <th className="py-3 px-4">Clauses</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredDocs.map((doc) => {
                    const docId = doc._id || doc.id;
                    const isSelected = selectedIds.includes(docId);
                    return (
                      <tr
                        key={docId}
                        className={`transition-colors ${isSelected ? 'bg-blue-950/30' : 'hover:bg-slate-800/50'}`}
                      >
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => toggleSelect(docId)}
                            aria-label={`Select contract ${doc.fileName}`}
                            className="text-slate-400 hover:text-blue-400"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-blue-400" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-white flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md bg-blue-950 text-blue-400 flex items-center justify-center shrink-0 border border-blue-800/60">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="truncate max-w-[260px]">{doc.fileName}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-normal">
                          {new Date(doc.uploadDate || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={doc.processingStatus} />
                        </td>
                        <td className="py-3.5 px-4 font-normal text-slate-300">{doc.totalPages || 1}</td>
                        <td className="py-3.5 px-4 font-normal text-slate-300">{doc.totalClauses || 0} clauses</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/documents/${docId}`}
                              className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 hover:bg-blue-600 hover:text-white font-medium transition-colors text-xs flex items-center gap-1 border border-slate-700"
                              title="Inspect Clauses"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </Link>

                            <button
                              onClick={() => handleDelete(docId)}
                              disabled={deletingId === docId}
                              aria-label={`Delete ${doc.fileName}`}
                              className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors disabled:opacity-50"
                              title="Delete Contract"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
