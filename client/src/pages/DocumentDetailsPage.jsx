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
      <div className="flex-1 bg-[#F8F7F2] flex flex-col min-w-0 font-sans text-[#18231C]">
        <Navbar title="Contract Inspection" />
        <div className="p-16 text-center text-[#6B736D] text-xs font-normal">
          Loading extracted clause breakdown...
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex-1 bg-[#F8F7F2] flex flex-col min-w-0 font-sans text-[#18231C]">
        <Navbar title="Contract Not Found" />
        <div className="p-16 text-center space-y-4">
          <p className="text-xs font-semibold text-[#6B736D]">
            The requested legal document could not be found or access is restricted.
          </p>
          <Link
            to="/documents"
            className="px-4 py-2 bg-[#3F6149] hover:bg-[#34503C] text-white text-xs font-semibold rounded-xl inline-block shadow-2xs"
          >
            Return to Contract Library
          </Link>
        </div>
      </div>
    );
  }

  // Count clauses per category
  const categoryCounts = clauses.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex-1 bg-[#F8F7F2] flex flex-col min-w-0 pb-16 font-sans text-[#18231C]">
      <Navbar title={document.fileName} subtitle="Extracted clauses, semantic categories, and page references" />

      <main className="p-6 md:p-10 max-w-7xl w-full mx-auto space-y-7">
        <div>
          <Link
            to="/documents"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A665D] hover:text-[#18231C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
            <span>Back to Contract Library</span>
          </Link>
        </div>

        {/* Two Column Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Document Overview Sticky Sidebar */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDDCD3] shadow-card space-y-5 lg:sticky lg:top-24">
            <div className="flex items-start gap-3 border-b border-[#ECEAE2] pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#D8E4EE] text-[#35536D] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div className="truncate">
                <h1 className="text-sm font-semibold text-[#18231C] truncate">{document.fileName}</h1>
                <div className="mt-1">
                  <StatusBadge status={document.processingStatus} />
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-[#5A665D]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8C948C]" />
                  <span>Processed:</span>
                </span>
                <span className="font-semibold text-[#18231C]">
                  {new Date(document.uploadDate || document.createdAt || Date.now()).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#5A665D]">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#8C948C]" />
                  <span>Total Clauses:</span>
                </span>
                <span className="font-semibold text-[#18231C]">{clauses.length}</span>
              </div>
            </div>

            {/* Category Breakdown Tags */}
            <div className="border-t border-[#ECEAE2] pt-4 space-y-2">
              <h4 className="text-[11px] font-semibold text-[#6B736D] uppercase tracking-wider">
                Category Distribution
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(categoryCounts).map(([cat, count]) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EDE9DE] text-[#685F4D] border border-[#DDD6C5] text-[10px] font-semibold"
                  >
                    <span>{cat.replace(/_/g, ' ')}:</span>
                    <span className="font-bold">{count}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/compare"
                state={{ selectedDocumentIds: [document._id || document.id] }}
                className="w-full py-2.5 px-4 bg-[#3F6149] hover:bg-[#34503C] text-white font-semibold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-colors"
              >
                <GitCompare className="w-3.5 h-3.5 stroke-[2]" />
                <span>Compare This Document</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Clauses Stream */}
          <div className="lg:col-span-2 space-y-5">
            {/* Category Filter Pills */}
            <div className="bg-white p-4 rounded-2xl border border-[#DDDCD3] shadow-card">
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-[#18231C]">
                <Filter className="w-3.5 h-3.5 text-[#3F6149]" />
                <span>Filter by Category:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_OPTIONS.map((cat) => {
                  const count = cat === 'ALL' ? clauses.length : (categoryCounts[cat] || 0);
                  if (cat !== 'ALL' && count === 0) return null;

                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#3F6149] text-white shadow-2xs'
                          : 'bg-[#FAF9F5] text-[#5A665D] hover:text-[#18231C] border border-[#DDDCD3] hover:border-[#BFD1DF]'
                      }`}
                    >
                      {cat.replace(/_/g, ' ')} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clauses List */}
            <div className="space-y-4">
              {filteredClauses.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#DDDCD3] p-12 text-center text-xs text-[#6B736D] shadow-card">
                  No clauses found for the selected category.
                </div>
              ) : (
                filteredClauses.map((clause, idx) => (
                  <div
                    key={clause._id || clause.id || idx}
                    className="bg-white p-6 rounded-2xl border border-[#DDDCD3] shadow-card space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECEAE2] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#EAECE4] text-[#3F6149] text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-xs text-[#18231C]">
                          {clause.clauseId || `Clause #${idx + 1}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#EDE9DE] text-[#685F4D] border border-[#DDD6C5]">
                          {clause.category || 'OTHER'}
                        </span>
                        {clause.pageNumber && (
                          <span className="text-[10px] text-[#758177]">
                            Page {clause.pageNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-[#2E3731] leading-relaxed font-normal bg-[#FAF9F5] p-4 rounded-xl border border-[#E8E6DC]/80">
                      <p className="whitespace-pre-line italic text-[#242C26]">
                        "{clause.text}"
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DocumentDetailsPage;
