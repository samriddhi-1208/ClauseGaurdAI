import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GitCompare, FileText, CheckSquare, Square, Search, Loader2, Zap, AlertCircle, ArrowRight } from 'lucide-react';
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
    <div className="flex-1 bg-[#F8F7F2] flex flex-col min-w-0 pb-16 font-sans text-[#18231C]">
      <Navbar title="Compare Contracts" subtitle="Automated cross-document contradiction & obligation alignment engine" />

      <main className="p-6 md:p-10 max-w-4xl w-full mx-auto space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-[#18231C] tracking-tight">
              Cross-Document Comparison
            </h1>
            <p className="text-xs text-[#5A665D] mt-0.5">
              Select 2 or more contracts to identify conflicting clauses, mismatched periods, and liability clashes
            </p>
          </div>

          <button
            onClick={handleRunDemo}
            disabled={seeding}
            className="px-4 py-2 bg-white hover:bg-[#F2F0E8] text-[#18231C] border border-[#DDDCD3] font-semibold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors disabled:opacity-50 self-start sm:self-auto"
          >
            <Zap className="w-3.5 h-3.5 text-[#C27D38]" />
            <span>{seeding ? 'Loading Demo...' : 'Load Sample Pair'}</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-[#F9DFDE] border border-[#F2CAC8] rounded-xl flex items-center gap-2.5 text-xs font-semibold text-[#B5413D]">
            <AlertCircle className="w-4 h-4 text-[#B5413D] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Document Selection */}
        <div className="bg-white rounded-2xl border border-[#DDDCD3] p-6 md:p-8 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#ECEAE2] pb-3">
            <h2 className="text-sm font-semibold text-[#18231C]">
              Step 1: Select Contracts to Compare ({selectedDocIds.length} selected)
            </h2>
            <span className="text-xs text-[#5A665D]">Min: 2 contracts</span>
          </div>

          {loadingDocs ? (
            <div className="py-8 text-center text-xs text-[#6B736D] font-normal">
              Loading available contract repository...
            </div>
          ) : documents.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-xs text-[#5A665D]">No contracts in library yet.</p>
              <button
                onClick={handleRunDemo}
                className="px-4 py-2 bg-[#3F6149] text-white text-xs font-semibold rounded-xl"
              >
                Load Demo Contract Pair
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {documents.map((doc) => {
                const id = doc._id || doc.id;
                const isSelected = selectedDocIds.includes(id);

                return (
                  <div
                    key={id}
                    onClick={() => toggleSelectDoc(id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#EAECE4]/50 border-[#3F6149] shadow-2xs'
                        : 'bg-[#FAF9F5] border-[#DDDCD3] hover:border-[#BFD1DF]'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="text-[#3F6149]">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#3F6149]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#8C948C]" />
                        )}
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-[#D8E4EE] text-[#35536D] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 stroke-[1.8]" />
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-xs text-[#18231C] truncate">{doc.fileName}</p>
                        <p className="text-[10px] text-[#758177]">
                          {doc.totalClauses || 0} clauses • {new Date(doc.uploadDate || doc.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#EDE9DE] text-[#685F4D] border border-[#DDD6C5]">
                      {doc.processingStatus || 'Completed'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 2: Legal Scope Categories */}
        <div className="bg-white rounded-2xl border border-[#DDDCD3] p-6 md:p-8 shadow-card space-y-4">
          <div className="border-b border-[#ECEAE2] pb-3">
            <h2 className="text-sm font-semibold text-[#18231C]">
              Step 2: Legal Scopes to Cross-Analyze
            </h2>
            <p className="text-xs text-[#5A665D] mt-0.5">
              Select specific obligations to prioritize during semantic cross-comparison
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CATEGORY_CHECKBOXES.map((cat) => {
              const isChecked = selectedCategories.includes(cat);
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all text-xs font-semibold ${
                    isChecked
                      ? 'bg-[#EAECE4] border-[#3F6149] text-[#18231C]'
                      : 'bg-[#FAF9F5] border-[#DDDCD3] text-[#5A665D] hover:border-[#BFD1DF]'
                  }`}
                >
                  <div className="text-[#3F6149]">
                    {isChecked ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 text-[#8C948C]" />}
                  </div>
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Launch Comparison Action */}
        <div className="pt-2">
          <button
            onClick={handleStartAnalysis}
            disabled={analyzing || selectedDocIds.length < 2}
            className="w-full py-3 px-6 bg-[#3F6149] hover:bg-[#34503C] text-white font-semibold text-xs md:text-sm rounded-xl shadow-card transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Semantic Contradiction Engine...</span>
              </>
            ) : (
              <>
                <GitCompare className="w-4 h-4 stroke-[2]" />
                <span>Run Contradiction Analysis ({selectedDocIds.length} Contracts)</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ComparePage;
