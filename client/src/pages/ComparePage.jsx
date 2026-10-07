import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GitCompare, FileText, CheckSquare, Square, Search, Loader2, Sparkles, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { documentAPI, analysisAPI, demoAPI } from '../services/api';

const CATEGORY_CHECKBOXES = [
  'Payment',
  'Confidentiality',
  'Termination',
  'Liability',
  'Data Privacy',
  'Data Retention'
];

const ComparePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [selectedDocIds, setSelectedDocIds] = useState(
    location.state?.selectedDocumentIds || []
  );
  const [selectedCategories, setSelectedCategories] = useState(CATEGORY_CHECKBOXES);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true);
      const res = await documentAPI.getAll();
      if (res.data.success) {
        const docs = res.data.documents || [];
        setDocuments(docs);

        // Auto select first 2 docs if none selected yet
        if (selectedDocIds.length < 2 && docs.length >= 2) {
          setSelectedDocIds([docs[0]._id || docs[0].id, docs[1]._id || docs[1].id]);
        }
      }
    } catch (err) {
      console.error('[Compare Fetch Error]', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const toggleSelectDoc = (id) => {
    setSelectedDocIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleStartAnalysis = async () => {
    if (selectedDocIds.length < 2) {
      setError('Please select at least 2 contracts for cross-document comparison.');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const res = await analysisAPI.compare(selectedDocIds);
      if (res.data.success) {
        const analysisId = res.data.analysis._id || res.data.analysis.id;
        navigate(`/results/${analysisId}`);
      }
    } catch (err) {
      console.error('[Analysis Error]', err);
      setError(err.response?.data?.message || 'Cross-document analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRunDemo = async () => {
    try {
      setSeeding(true);
      const res = await demoAPI.seed();
      if (res.data.success) {
        navigate(`/results/${res.data.analysisId}`);
      }
    } catch (err) {
      console.error('[Demo Error]', err);
      alert('Could not seed demo contracts.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-w-0 pb-12 font-sans text-slate-900">
      <Navbar title="Compare Contracts" subtitle="Identify potential contradictions and legal inconsistencies across multiple agreements" />

      <main className="p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Cross-Document Contradiction Analysis</h1>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Select 2 or more contracts to compare related clauses within matching legal categories
            </p>
          </div>

          <button
            onClick={handleRunDemo}
            disabled={seeding}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-medium text-xs rounded-lg shadow-2xs flex items-center gap-2 transition-colors disabled:opacity-50 shrink-0"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>{seeding ? 'Loading...' : 'Instant Demo Mode'}</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-medium text-rose-700">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Select Documents */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0F172A] text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Select Documents to Compare ({selectedDocIds.length} Selected)</span>
            </h3>
            <span className="text-xs text-slate-500 font-normal">Requires at least 2 contracts</span>
          </div>

          {loadingDocs ? (
            <div className="py-10 text-center text-slate-500 text-xs font-normal">Loading contract library...</div>
          ) : documents.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-900">No contracts available to compare</h4>
              <p className="text-xs text-slate-500 font-normal">Upload at least two contracts or load sample contracts to run comparison.</p>
              <button
                onClick={handleRunDemo}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-medium text-xs rounded-lg shadow-2xs"
              >
                Load Sample Contracts (Contract A vs B)
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.map((doc) => {
                const docId = doc._id || doc.id;
                const isSelected = selectedDocIds.includes(docId);
                return (
                  <div
                    key={docId}
                    onClick={() => toggleSelectDoc(docId)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-50/50 border-blue-500 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="mt-0.5 text-blue-600">
                      {isSelected ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </div>

                    <div className="flex-1 truncate">
                      <h4 className="font-semibold text-xs text-slate-900 truncate">{doc.fileName}</h4>
                      <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                        {doc.totalClauses || 0} clauses extracted &bull; {doc.totalPages || 1} pages
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* STEP 2: Category Scope */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0F172A] text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Target Analysis Categories</span>
            </h3>
            <span className="text-xs text-slate-500 font-normal">Specific clause categories to cross-analyze</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CATEGORY_CHECKBOXES.map((cat) => {
              const isChecked = selectedCategories.includes(cat);
              return (
                <div
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center gap-2 text-xs font-medium ${
                    isChecked
                      ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isChecked ? <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                  <span>{cat}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Execution Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 tracking-tight">AI Contradiction Detection Engine</h3>
              <p className="text-xs text-slate-500 font-normal">Cross-document semantic matching, category grouping, and risk assessment</p>
            </div>
          </div>

          <button
            onClick={handleStartAnalysis}
            disabled={analyzing || selectedDocIds.length < 2}
            className="w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-medium text-xs md:text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Comparing clauses & evaluating contradictions...</span>
              </>
            ) : (
              <>
                <GitCompare className="w-4 h-4" />
                <span>Run Contradiction Analysis ({selectedDocIds.length} Contracts Selected)</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ComparePage;
