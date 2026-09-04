import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  FileText, 
  Brain, 
  Lightbulb, 
  AlertTriangle, 
  Calendar, 
  Layers,
  ChevronDown,
  ChevronUp,
  Zap,
  CheckCircle2,
  FileCode,
  ArrowRight
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
      <div className="flex-1 bg-[#F8FAFC] flex flex-col min-w-0 font-sans">
        <Navbar title="Risk Analysis Report" />
        <div className="p-16 text-center text-slate-500 text-xs font-bold">Loading cross-document contradiction report...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F8FAFC] flex flex-col min-w-0 pb-12 font-sans">
      <Navbar title="Risk Analysis Report" subtitle="Cross-document contradiction findings & grounded intelligence" />

      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        
        {/* Top Actions & Disclaimers */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Cross-Document Risk Analysis
            </h1>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Review side-by-side evidence, clause mismatches, and legal recommendations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunDemo}
              disabled={seeding}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>{seeding ? 'Loading...' : '⚡ Load Demo Findings'}</span>
            </button>

            <Link
              to="/compare"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
            >
              <span>Run New Scan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Compact Horizontal Risk Analysis Summary Card */}
        {selectedAnalysis && (
          <div className="bg-[#0F172A] text-white p-5 rounded-2xl border border-slate-800 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  <h2 className="font-extrabold text-base text-white tracking-tight">
                    Risk Analysis Overview
                  </h2>
                  <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-extrabold rounded-full border border-blue-400/30">
                    Latest Contract Comparison Results
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Date: <strong className="text-slate-200">{new Date(selectedAnalysis.createdAt || Date.now()).toLocaleDateString()}</strong>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    Documents Analyzed: <strong className="text-slate-200">{docsAnalyzedCount}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Total Findings: <strong className="text-slate-200">{findings.length}</strong>
                  </span>
                </div>
              </div>

              {/* Compact Risk Pills */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <div className="px-3 py-1.5 bg-red-950/80 border border-red-500/50 rounded-xl flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span className="text-xs font-extrabold text-red-200">🔴 High Risk: {highRiskCount}</span>
                </div>

                <div className="px-3 py-1.5 bg-amber-950/80 border border-amber-500/50 rounded-xl flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-xs font-extrabold text-amber-200">🟠 Medium Risk: {mediumRiskCount}</span>
                </div>

                <div className="px-3 py-1.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-extrabold text-emerald-200">🟢 Low Risk: {lowRiskCount}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-medium">
              💡 Note: ClauseGuard AI evaluates semantic friction across contractual obligations. Review the side-by-side evidence below to resolve clashes.
            </p>
          </div>
        )}

        {!selectedAnalysis ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
            <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-extrabold text-base text-[#0F172A]">No Contradiction Analysis Scans Found</h3>
            <p className="text-xs text-slate-600 font-medium">Run a cross-document comparison or load instant sample data to view findings.</p>
            <button
              onClick={handleRunDemo}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl inline-block"
            >
              ⚡ Load Demo Findings (Data Retention & Payment)
            </button>
          </div>
        ) : (
          /* Contradiction Findings Reports */
          <div className="space-y-6">
            {findings.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-600 text-xs font-bold shadow-xs">
                🟢 No significant contradictions detected between the selected contracts.
              </div>
            ) : (
              findings.map((item, idx) => {
                const findingId = item._id || item.id || idx;
                const isExpanded = expandedIds[findingId];

                // Strict Risk Colors
                let riskBorder = 'border-[#EF4444] bg-red-50/20';
                let riskHeaderBg = 'bg-red-50/60 border-red-100';
                let riskBadge = <RiskBadge riskLevel="HIGH" classification="POTENTIAL_CONTRADICTION" compact={true} />;
                
                if (item.riskLevel === 'MEDIUM' || item.classification === 'POTENTIAL_INCONSISTENCY') {
                  riskBorder = 'border-[#F59E0B] bg-amber-50/20';
                  riskHeaderBg = 'bg-amber-50/60 border-amber-100';
                  riskBadge = <RiskBadge riskLevel="MEDIUM" classification="POTENTIAL_INCONSISTENCY" compact={true} />;
                } else if (item.riskLevel === 'LOW' || item.classification === 'NO_SIGNIFICANT_CONFLICT') {
                  riskBorder = 'border-[#22C55E] bg-emerald-50/20';
                  riskHeaderBg = 'bg-emerald-50/60 border-emerald-100';
                  riskBadge = <RiskBadge riskLevel="LOW" classification="NO_SIGNIFICANT_CONFLICT" compact={true} />;
                }

                return (
                  <div
                    key={findingId}
                    className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${riskBorder}`}
                  >
                    {/* Finding Intelligence Header */}
                    <div
                      onClick={() => toggleExpand(findingId)}
                      className={`px-6 py-4 flex items-center justify-between cursor-pointer border-b transition-colors ${riskHeaderBg}`}
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        {riskBadge}

                        <span className="font-extrabold text-xs text-[#0F172A] tracking-wider uppercase bg-white border border-slate-200 px-3 py-1 rounded-lg">
                          {item.category}
                        </span>

                        <span className="text-xs text-slate-600 font-bold hidden md:inline">
                          Confidence: {Math.round((item.confidence || 0.92) * 100)}%
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                          {isExpanded ? 'Collapse' : 'Expand Finding'}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
                      </div>
                    </div>

                    {/* Finding Detailed Body */}
                    {isExpanded && (
                      <div className="p-6 space-y-6">
                        
                        {/* Two-Column Comparison Layout */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                              ⚖️ Side-by-Side Clause Evidence
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">Cross-Document Match</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Document A */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-[#0F172A] flex items-center gap-1.5 truncate max-w-[200px]">
                                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                                  {item.documentA?.name || 'Document A'}
                                </span>
                                <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                                  Page {item.clauseA?.pageNumber || 1}
                                </span>
                              </div>
                              <div className="p-3.5 bg-white rounded-lg border border-slate-200 text-xs text-[#0F172A] font-medium leading-relaxed italic">
                                "{item.clauseA?.content}"
                              </div>
                            </div>

                            {/* Document B */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-[#0F172A] flex items-center gap-1.5 truncate max-w-[200px]">
                                  <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                                  {item.documentB?.name || 'Document B'}
                                </span>
                                <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                                  Page {item.clauseB?.pageNumber || 1}
                                </span>
                              </div>
                              <div className="p-3.5 bg-white rounded-lg border border-slate-200 text-xs text-[#0F172A] font-medium leading-relaxed italic">
                                "{item.clauseB?.content}"
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AI Explanation & Legal Recommendation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                          
                          {/* AI Explanation */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-extrabold text-[#0F172A] flex items-center gap-1.5 uppercase tracking-wider">
                              <Brain className="w-4 h-4 text-blue-600" />
                              <span>🧠 AI Analysis & Conflict Explanation</span>
                            </h4>
                            <p className="text-xs text-slate-700 font-medium leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                              {item.explanation}
                            </p>
                          </div>

                          {/* Actionable Recommendation */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-extrabold text-[#0F172A] flex items-center gap-1.5 uppercase tracking-wider">
                              <Lightbulb className="w-4 h-4 text-amber-600" />
                              <span>💡 Recommended Action</span>
                            </h4>
                            <p className="text-xs text-slate-700 font-medium leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100">
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
