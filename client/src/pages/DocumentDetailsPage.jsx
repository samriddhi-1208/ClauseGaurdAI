import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, ArrowLeft, Filter, Tag, Calendar, Layers, GitCompare } from 'lucide-react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { documentAPI } from '../services/api';

const CATEGORY_OPTIONS = [
  'ALL',
  'PAYMENT',
  'CONFIDENTIALITY',
  'TERMINATION',
  'LIABILITY',
  'DATA_PRIVACY',
  'DATA_RETENTION',
  'DATA_STORAGE',
  'JURISDICTION',
  'INTELLECTUAL_PROPERTY',
  'OTHER'
];

const DocumentDetailsPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [clauses, setClauses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocDetails();
  }, [id]);

  const fetchDocDetails = async () => {
    try {
      setLoading(true);
      const res = await documentAPI.getById(id);
      if (res.data.success) {
        setDocument(res.data.document);
        setClauses(res.data.clauses || []);
      }
    } catch (err) {
      console.error('[Doc Details Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClauses = selectedCategory === 'ALL'
    ? clauses
    : clauses.filter(c => c.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col min-w-0 font-sans text-slate-900">
        <Navbar title="Contract Inspection" />
        <div className="p-16 text-center text-slate-500 text-xs font-normal">Loading extracted clause breakdown...</div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col min-w-0 font-sans text-slate-900">
        <Navbar title="Contract Not Found" />
        <div className="p-16 text-center space-y-4">
          <p className="text-xs font-medium text-slate-500">The requested legal document could not be found or access is restricted.</p>
          <Link to="/documents" className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-medium rounded-lg inline-block">
            Return to Contract Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-w-0 pb-12 font-sans text-slate-900">
      <Navbar title={document.fileName} subtitle="Extracted clauses, semantic categories, and page references" />

      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        <div>
          <Link to="/documents" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Contract Library</span>
          </Link>
        </div>

        {/* Two Column Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Document Overview Sticky Sidebar */}
          <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-sm space-y-5 lg:sticky lg:top-20">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <h1 className="text-sm font-semibold text-slate-900 truncate">{document.fileName}</h1>
                <div className="mt-1">
                  <StatusBadge status={document.processingStatus} />
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-normal">Upload Date</span>
                <span className="font-medium text-slate-900">
                  {new Date(document.uploadDate || Date.now()).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-normal">File Size</span>
                <span className="font-medium text-slate-900">{Math.round((document.fileSize || 0) / 1024)} KB</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-normal">Total Pages</span>
                <span className="font-medium text-slate-900">{document.totalPages || 1} Pages</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-normal">Extracted Clauses</span>
                <span className="font-medium text-blue-700">{clauses.length} Clauses</span>
              </div>
            </div>

            <Link
              to="/compare"
              className="w-full py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare with Another Contract</span>
            </Link>
          </div>

          {/* Right Column: Clause Cards Feed */}
          <div className="lg:col-span-2 space-y-5">
            {/* Category Filter Pills */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter by Clause Category</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map(cat => {
                  const count = cat === 'ALL' ? clauses.length : clauses.filter(c => c.category === cat).length;
                  if (cat !== 'ALL' && count === 0) return null;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[#0F172A] text-white shadow-2xs'
                          : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cat.replace('_', ' ')} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Extracted Clause Cards */}
            <div className="space-y-3.5">
              {filteredClauses.length === 0 ? (
                <div className="bg-white p-10 rounded-xl border border-slate-200 text-center text-slate-500 text-xs font-normal">
                  No clauses indexed under category "{selectedCategory}".
                </div>
              ) : (
                filteredClauses.map((clause, idx) => {
                  const clauseId = clause._id || clause.id || idx;
                  return (
                    <div
                      key={clauseId}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1.5">
                          <Tag className="w-3 h-3 text-slate-600" />
                          {clause.category}
                        </span>

                        <div className="flex items-center gap-2 text-xs text-slate-500 font-normal">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                            Page {clause.pageNumber || 1}
                          </span>
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                            Confidence: {Math.round((clause.confidence || 0.9) * 100)}%
                          </span>
                        </div>
                      </div>

                      <p className="text-xs font-normal text-slate-800 bg-slate-50/70 p-4 rounded-lg border border-slate-200 leading-relaxed font-sans border-l-4 border-l-slate-400">
                        "{clause.content}"
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentDetailsPage;
