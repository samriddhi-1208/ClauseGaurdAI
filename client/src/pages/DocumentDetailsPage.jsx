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
      <div className="flex-1 bg-[#0B0A08] flex flex-col min-w-0 font-sans text-[#EDE5D5]">
        <Navbar title="Contract Inspection" />
        <div className="p-16 text-center text-[#8C806F] text-xs font-normal">
          Loading extracted clause breakdown...
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex-1 bg-[#0B0A08] flex flex-col min-w-0 font-sans text-[#EDE5D5]">
        <Navbar title="Contract Not Found" />
        <div className="p-16 text-center space-y-4">
          <p className="text-xs text-[#8C806F]">
            The requested legal document could not be found or access is restricted.
          </p>
          <Link
            to="/documents"
            className="px-4 py-2 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] text-xs font-semibold rounded-lg inline-block"
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
    <div className="flex-1 bg-[#0B0A08] flex flex-col min-w-0 pb-16 font-sans text-[#EDE5D5] selection:bg-[#E5C38E]/20 selection:text-[#F8F6F0]">
      <Navbar title={document.fileName} subtitle="Extracted clauses, semantic categories, and page references" />

      <main className="p-6 md:p-10 max-w-7xl w-full mx-auto space-y-7">
        <div>
          <Link
            to="/documents"
            className="inline-flex items-center gap-1.5 text-xs text-[#A99E8C] hover:text-[#EDE5D5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
            <span>Back to Contract Library</span>
          </Link>
        </div>

        {/* Two Column Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Document Overview Sticky Sidebar */}
          <div className="bg-[#12100D] p-6 rounded-xl border border-[#231F19] space-y-5 lg:sticky lg:top-24">
            <div className="flex items-start gap-3 border-b border-[#1F1B16] pb-4">
              <div className="w-10 h-10 rounded-lg bg-[#191612] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div className="truncate">
                <h1 className="text-sm font-serif font-medium text-[#F4EFE5] truncate">{document.fileName}</h1>
                <div className="mt-1">
                  <StatusBadge status={document.processingStatus} />
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-[#8C806F]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#5C5346]" />
                  <span>Processed:</span>
                </span>
                <span className="font-medium text-[#EDE5D5]">
                  {new Date(document.uploadDate || document.createdAt || Date.now()).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#8C806F]">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#5C5346]" />
                  <span>Total Clauses:</span>
                </span>
                <span className="font-medium text-[#EDE5D5]">{clauses.length}</span>
              </div>
            </div>

            {/* Category Breakdown Tags */}
            <div className="border-t border-[#1F1B16] pt-4 space-y-2">
              <h4 className="text-[11px] font-medium text-[#A99E8C] uppercase tracking-wider">
                Category Distribution
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(categoryCounts).map(([cat, count]) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#16130F] text-[#C9BEAE] border border-[#231F19] text-[10px]"
                  >
                    <span>{cat.replace(/_/g, ' ')}:</span>
                    <span className="font-medium text-[#E5C38E]">{count}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/compare"
                state={{ selectedDocumentIds: [document._id || document.id] }}
                className="w-full py-2.5 px-4 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <GitCompare className="w-3.5 h-3.5 stroke-[2]" />
                <span>Compare This Document</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Clauses Stream */}
          <div className="lg:col-span-2 space-y-5">
            {/* Category Filter Pills */}
            <div className="bg-[#12100D] p-4 rounded-xl border border-[#231F19]">
              <div className="flex items-center gap-2 mb-3 text-xs font-medium text-[#A99E8C]">
                <Filter className="w-3.5 h-3.5 text-[#E5C38E]" />
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
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#E5C38E] text-[#12110E]'
                          : 'bg-[#16130F] text-[#8C806F] hover:text-[#EDE5D5] border border-[#231F19] hover:border-[#383127]'
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
                <div className="bg-[#12100D] rounded-xl border border-[#231F19] p-12 text-center text-xs text-[#8C806F]">
                  No clauses found for the selected category.
                </div>
              ) : (
                filteredClauses.map((clause, idx) => (
                  <div
                    key={clause._id || clause.id || idx}
                    className="bg-[#12100D] p-6 rounded-xl border border-[#231F19] space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1F1B16] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-[#191612] border border-[#2D261C] text-[#E5C38E] text-xs font-mono font-medium flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-serif font-medium text-xs text-[#F4EFE5]">
                          {clause.clauseId || `Clause #${idx + 1}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#171410] text-[#A99E8C] border border-[#2B251B]">
                          {clause.category || 'OTHER'}
                        </span>
                        {clause.pageNumber && (
                          <span className="text-[10px] text-[#8C806F]">
                            Page {clause.pageNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Warm Cream Parchment Document Preview Excerpt */}
                    <div className="bg-[#EFECE4] text-[#1B1915] p-5 rounded-lg border border-[#DDD6C5] shadow-xs">
                      <div className="border-l-2 border-[#C9A765] pl-3.5 py-1">
                        <p className="whitespace-pre-line italic font-serif text-[14px] md:text-[15px] text-[#1A1815] leading-relaxed tracking-normal">
                          "{clause.text}"
                        </p>
                      </div>
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
