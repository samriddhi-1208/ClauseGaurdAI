import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  FileText, 
  Brain, 
  Lightbulb, 
  Calendar, 
  Layers,
  ChevronDown,
  ChevronUp,
  Zap,
  ArrowRight,
  Scale
} from 'lucide-react';
import Navbar from '../components/Navbar';
import RiskBadge from '../components/RiskBadge';
import { analysisAPI, demoAPI } from '../services/api';

const ResultsPage = () => {
  const { id } = useParams();
  const [analyses, setAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [expandedIds, setExpandedIds] = useState({});

  useEffect(() => {
    if (id) {
      fetchAnalysisById(id);
    } else {
      fetchAllAnalyses();
    }
  }, [id]);

  const fetchAllAnalyses = async () => {
    try {
      setLoading(true);
      const res = await analysisAPI.getAll();
      if (res.data.success) {
        const list = res.data.analyses || [];
        setAnalyses(list);
        if (list.length > 0) {
          fetchAnalysisById(list[0]._id || list[0].id);
        }
      }
    } catch (err) {
      console.error('[Fetch Analyses Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysisById = async (analysisId) => {
    try {
      setLoading(true);
      const res = await analysisAPI.getById(analysisId);
      if (res.data.success) {
        setSelectedAnalysis(res.data.analysis);
        const fList = res.data.findings || [];
        setFindings(fList);
        
        // Auto expand all findings initially
        const expMap = {};
        fList.forEach((item, idx) => {
          expMap[item._id || item.id || idx] = true;
        });
        setExpandedIds(expMap);
      }
    } catch (err) {
      console.error('[Fetch Analysis Details Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (fId) => {
    setExpandedIds(prev => ({ ...prev, [fId]: !prev[fId] }));
  };

  const handleRunDemo = async () => {
    try {
      setSeeding(true);
      const res = await demoAPI.seed();
      if (res.data.success) {
        fetchAnalysisById(res.data.analysisId);
      }
    } catch (err) {
      console.error('[Demo Error]', err);
      alert('Could not seed demo contracts.');
    } finally {
      setSeeding(false);
    }
  };

  const highRiskCount = findings.filter(f => f.riskLevel === 'HIGH' || f.classification === 'POTENTIAL_CONTRADICTION').length;
  const mediumRiskCount = findings.filter(f => f.riskLevel === 'MEDIUM' || f.classification === 'POTENTIAL_INCONSISTENCY').length;
  const lowRiskCount = findings.filter(f => f.riskLevel === 'LOW' || f.classification === 'NO_SIGNIFICANT_CONFLICT').length;

  const docsAnalyzedCount = selectedAnalysis?.documents?.length || (findings.length > 0 ? 2 : 0);

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col min-w-0 font-sans text-slate-900">
        <Navbar title="Risk Analysis Report" />
        <div className="p-16 text-center text-slate-500 text-xs font-normal">Loading cross-document contradiction report...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-w-0 pb-12 font-sans text-slate-900">
      <Navbar title="Risk Analysis Report" subtitle="Cross-document contradiction findings & grounded intelligence" />

      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        
        {/* Top Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Cross-Document Risk Analysis
            </h1>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Side-by-side comparative evidence, clause friction, and legal recommendations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunDemo}
              disabled={seeding}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-medium text-xs rounded-lg shadow-2xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>{seeding ? 'Loading...' : 'Instant Demo Mode'}</span>
            </button>

            <Link
              to="/compare"
              className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-sm flex items-center gap-2 transition-colors"
            >
              <span>Run Comparison Scan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Risk Analysis Overview Banner */}
        {selectedAnalysis && (
          <div className="bg-white text-slate-900 p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <h2 className="font-semibold text-base text-slate-900 tracking-tight">
                    Contradiction Assessment Overview
                  </h2>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md border border-slate-200">
                    Cross-Contract Evaluation
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-slate-500 font-normal mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Scan Date: <strong className="text-slate-800 font-medium">{new Date(selectedAnalysis.createdAt || Date.now()).toLocaleDateString()}</strong>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    Contracts Compared: <strong className="text-slate-800 font-medium">{docsAnalyzedCount}</strong>
                  </span>
                  <span>&bull;</span>
                  <span>
                    Total Identified Clashes: <strong className="text-slate-800 font-medium">{findings.length}</strong>
                  </span>
                </div>
              </div>

              {/* Risk Counter Pills */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <div className="px-2.5 py-1 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  <span className="text-xs font-semibold text-rose-800">High Risk: {highRiskCount}</span>
                </div>

                <div className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span className="text-xs font-semibold text-amber-800">Medium Risk: {mediumRiskCount}</span>
                </div>

                <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span className="text-xs font-semibold text-emerald-800">Low Risk: {lowRiskCount}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-normal">
              Notice: ClauseGuard AI evaluates semantic and logical friction across contractual obligations. Findings are classified as Potential Contradictions or Potential Inconsistencies for legal review.
            </p>
          </div>
        )}

        {!selectedAnalysis ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-4 shadow-sm">
            <Scale className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-semibold text-base text-slate-900">No Contradiction Analysis Reports Found</h3>
            <p className="text-xs text-slate-500 font-normal max-w-sm mx-auto">
              Run a cross-document comparison or load sample contracts to view side-by-side contradiction findings.
            </p>
            <button
              onClick={handleRunDemo}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-medium text-xs rounded-lg transition-colors inline-block"
            >
              Load Demo Contracts (Retention & Payment Clashes)
            </button>
          </div>
        ) : (
          /* Contradiction Findings Reports */
          <div className="space-y-5">
            {findings.length === 0 ? (
              <div className="bg-white p-10 rounded-xl border border-slate-200 text-center text-slate-600 text-xs font-normal shadow-sm">
                No significant contradictions or conflicting terms detected between the evaluated contracts.
              </div>
            ) : (
              findings.map((item, idx) => {
                const findingId = item._id || item.id || idx;
                const isExpanded = expandedIds[findingId];

                let riskBorder = 'border-rose-200';
                let riskHeaderBg = 'bg-rose-50/70 border-rose-200';
                let riskBadge = <RiskBadge riskLevel="HIGH" classification="POTENTIAL_CONTRADICTION" compact={true} />;
                
                if (item.riskLevel === 'MEDIUM' || item.classification === 'POTENTIAL_INCONSISTENCY') {
                  riskBorder = 'border-amber-200';
                  riskHeaderBg = 'bg-amber-50/70 border-amber-200';
                  riskBadge = <RiskBadge riskLevel="MEDIUM" classification="POTENTIAL_INCONSISTENCY" compact={true} />;
                } else if (item.riskLevel === 'LOW' || item.classification === 'NO_SIGNIFICANT_CONFLICT') {
                  riskBorder = 'border-emerald-200';
                  riskHeaderBg = 'bg-emerald-50/70 border-emerald-200';
                  riskBadge = <RiskBadge riskLevel="LOW" classification="NO_SIGNIFICANT_CONFLICT" compact={true} />;
                }

                return (
                  <div
                    key={findingId}
                    className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${riskBorder}`}
                  >
                    {/* Finding Intelligence Header */}
                    <div
                      onClick={() => toggleExpand(findingId)}
                      className={`px-5 py-3.5 flex items-center justify-between cursor-pointer border-b transition-colors ${riskHeaderBg}`}
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        {riskBadge}

                        <span className="font-semibold text-xs text-slate-800 tracking-wider uppercase bg-white border border-slate-200 px-2.5 py-0.5 rounded-md shadow-2xs">
                          {item.category}
                        </span>

                        <span className="text-xs text-slate-500 font-normal hidden md:inline">
                          Confidence: {Math.round((item.confidence || 0.92) * 100)}%
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                          {isExpanded ? 'Collapse' : 'Expand'}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </div>
                    </div>

                    {/* Finding Detailed Body */}
                    {isExpanded && (
                      <div className="p-5 md:p-6 space-y-6 bg-white">
                        
                        {/* Two-Column Comparison Layout */}
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              Comparative Contract Clauses
                            </span>
                            <span className="text-xs text-slate-500 font-normal">Cross-Document Evidence</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Document A */}
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-xs text-slate-900 flex items-center gap-1.5 truncate max-w-[200px]">
                                  <FileText className="w-4 h-4 text-slate-600 shrink-0" />
                                  {item.documentA?.name || 'Document A'}
                                </span>
                                <span className="text-[11px] font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                                  Page {item.clauseA?.pageNumber || 1}
                                </span>
                              </div>
                              <div className="p-3.5 bg-white rounded border border-slate-200 text-xs text-slate-800 font-sans leading-relaxed border-l-4 border-l-blue-600">
                                "{item.clauseA?.content}"
                              </div>
                            </div>

                            {/* Document B */}
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-xs text-slate-900 flex items-center gap-1.5 truncate max-w-[200px]">
                                  <FileText className="w-4 h-4 text-slate-600 shrink-0" />
                                  {item.documentB?.name || 'Document B'}
                                </span>
                                <span className="text-[11px] font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                                  Page {item.clauseB?.pageNumber || 1}
                                </span>
                              </div>
                              <div className="p-3.5 bg-white rounded border border-slate-200 text-xs text-slate-800 font-sans leading-relaxed border-l-4 border-l-amber-600">
                                "{item.clauseB?.content}"
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AI Explanation & Legal Recommendation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                          
                          {/* AI Explanation */}
                          <div className="space-y-1.5">
                            <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                              <Brain className="w-4 h-4 text-slate-600" />
                              <span>AI Conflict Rationale</span>
                            </h4>
                            <p className="text-xs text-slate-700 font-normal leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                              {item.explanation}
                            </p>
                          </div>

                          {/* Actionable Recommendation */}
                          <div className="space-y-1.5">
                            <h4 className="text-xs font-semibold text-blue-950 flex items-center gap-1.5 uppercase tracking-wider">
                              <Lightbulb className="w-4 h-4 text-blue-700" />
                              <span>Recommended Counsel Action</span>
                            </h4>
                            <p className="text-xs text-blue-950 font-normal leading-relaxed bg-blue-50/60 p-4 rounded-lg border border-blue-200">
                              {item.recommendation}
                            </p>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ResultsPage;
