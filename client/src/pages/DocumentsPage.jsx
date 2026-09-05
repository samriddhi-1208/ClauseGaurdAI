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
    if (!window.confirm('Are you sure you want to delete this document and clean all extracted clauses & vectors?')) return;
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
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Contract Library</h1>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Select 2 or more contracts to run cross-document contradiction analysis
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedIds.length >= 2 && (
              <button
                onClick={handleCompareSelected}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all animate-pulse"
              >
                <GitCompare className="w-4 h-4" />
                <span>Compare Selected ({selectedIds.length})</span>
              </button>
            )}

            <button
              onClick={handleRunDemo}
              disabled={seeding}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>{seeding ? 'Loading...' : '⚡ Load Demo Contracts'}</span>
            </button>

            <Link
              to="/upload"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Upload PDF</span>
            </Link>
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div className="bg-[#131C31] p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contracts by name..."
              className="w-full pl-10 pr-4 py-2 bg-[#0D1322] border border-slate-700/80 rounded-xl text-xs text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
              <Filter className="w-3.5 h-3.5" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#0D1322] border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs font-extrabold text-white focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="clauses">Most Clauses</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            <span className="text-xs text-slate-400 font-extrabold pl-3 border-l border-slate-800">
              {filteredDocs.length} Contracts
            </span>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="bg-[#131C31] rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-14 text-center text-slate-400 text-xs font-bold">Loading contract library...</div>
          ) : filteredDocs.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <FolderOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs font-bold text-slate-400">No legal contracts match your query.</p>
              <button
                onClick={handleRunDemo}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-sm"
              >
                ⚡ Load Sample Contracts
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0D1322] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 w-10">
                      <button onClick={toggleSelectAll} className="text-slate-400 hover:text-blue-400">
                        {selectedIds.length === filteredDocs.length && filteredDocs.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4">Contract Name</th>
                    <th className="py-3 px-4">Upload Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Pages</th>
                    <th className="py-3 px-4">Clauses</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredDocs.map((doc) => {
                    const docId = doc._id || doc.id;
                    const isSelected = selectedIds.includes(docId);
                    return (
                      <tr
                        key={docId}
                        className={`transition-colors ${isSelected ? 'bg-blue-950/40' : 'hover:bg-[#1A2642]'}`}
                      >
                        <td className="py-3.5 px-4">
                          <button onClick={() => toggleSelect(docId)} className="text-slate-400 hover:text-blue-400">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-blue-400" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-white flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center shrink-0 border border-blue-800/60">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="truncate max-w-[260px]">{doc.fileName}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-semibold">
                          {new Date(doc.uploadDate || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={doc.processingStatus} />
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-300">{doc.totalPages || 1}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-300">{doc.totalClauses || 0} clauses</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/documents/${docId}`}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-blue-600 hover:text-white font-extrabold transition-all text-[11px] flex items-center gap-1 border border-slate-700"
                              title="View Clauses"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </Link>

                            <button
                              onClick={() => handleDelete(docId)}
                              disabled={deletingId === docId}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/60 transition-colors disabled:opacity-50"
                              title="Delete Document"
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
