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
    <div className="flex-1 bg-[#F8FAFC] flex flex-col min-w-0 pb-12 font-sans">
      <Navbar title="Compare Contracts" subtitle="Identify potential contradictions and legal inconsistencies across multiple agreements" />

      <main className="p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#0F172A] tracking-tight">Cross-Document Contradiction Analysis</h1>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Select 2 or more contracts to compare related clauses within matching legal categories
            </p>
          </div>

          <button
            onClick={handleRunDemo}
            disabled={seeding}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{seeding ? 'Loading...' : '⚡ Load Demo Contracts'}</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-bold text-red-700">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Select Documents */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-[#0F172A] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-extrabold">1</span>
              <span>Select Documents to Compare ({selectedDocIds.length} Selected)</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">Select 2 or more contracts</span>
          </div>

          {loadingDocs ? (
            <div className="py-10 text-center text-slate-500 text-xs font-bold">Loading contract library...</div>
          ) : documents.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">No uploaded contracts available to compare.</p>
              <button
                onClick={handleRunDemo}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs"
              >
                ⚡ Load Sample Contracts (Contract A vs B)
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
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-600 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="mt-0.5 text-blue-600">
                      {isSelected ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </div>

                    <div className="flex-1 truncate">
                      <h4 className="font-extrabold text-xs text-[#0F172A] truncate">{doc.fileName}</h4>
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                        {doc.totalClauses || 0} clauses extracted • {doc.totalPages || 1} pages
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* STEP 2: Category Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-[#0F172A] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-extrabold">2</span>
              <span>Analysis Categories Configuration</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">Target specific legal categories</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CATEGORY_CHECKBOXES.map((cat) => {
              const isChecked = selectedCategories.includes(cat);
              return (
                <div
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-2 text-xs font-extrabold ${
                    isChecked
                      ? 'bg-purple-50 border-purple-600 text-purple-700 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isChecked ? <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                  <span>{cat}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Execution Card */}
        <div className="bg-[#0F172A] rounded-2xl p-6 text-white shadow-md space-y-5 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white tracking-tight">Google Gemini Contradiction Engine</h3>
              <p className="text-xs text-slate-400 font-medium">Category grouping, semantic matrix matching & risk scoring</p>
            </div>
          </div>

          <button
            onClick={handleStartAnalysis}
            disabled={analyzing || selectedDocIds.length < 2}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running AI Comparison Matrix...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>⚡ Run AI Comparison ({selectedDocIds.length} Contracts Selected)</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ComparePage;
