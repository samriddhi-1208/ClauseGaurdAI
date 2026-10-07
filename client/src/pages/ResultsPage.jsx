import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  FileText, 
  Lightbulb, 
  Calendar, 
  Layers,
  ChevronDown,
  ChevronUp,
  Zap,
  ArrowRight,
  GitCompare,
  AlertTriangle,
  Check,
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

  return (
    <div className="flex-1 bg-[#F8F7F2] flex flex-col min-w-0 pb-16 font-sans text-[#18231C]">
      <Navbar title="Risk Insights & Contradictions" subtitle="Cross-document semantic conflict reports & legal recommendations" />

      <main className="p-6 md:p-10 max-w-7xl w-full mx-auto space-y-7">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-[#18231C] tracking-tight">
              Contradiction Audit Report
            </h1>
            <p className="text-xs text-[#5A665D] mt-0.5">
              Comprehensive discrepancy analysis across evaluated legal obligations
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRunDemo}
              disabled={seeding}
              className="px-3.5 py-2 bg-white hover:bg-[#F2F0E8] text-[#18231C] border border-[#DDDCD3] font-semibold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-[#C27D38]" />
              <span>{seeding ? 'Seeding...' : 'Load Sample Audit'}</span>
            </button>

            <Link
              to="/compare"
              className="px-3.5 py-2 bg-[#3F6149] hover:bg-[#34503C] text-white font-semibold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <GitCompare className="w-3.5 h-3.5 stroke-[2]" />
              <span>New Comparison</span>
            </Link>
          </div>
        </div>

        {/* Audit Report Summary Banner */}
        {selectedAnalysis && (
          <div className="bg-white rounded-2xl border border-[#DDDCD3] p-6 md:p-8 shadow-card space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ECEAE2] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#3F6149] bg-[#EAECE4] px-2.5 py-1 rounded-md">
                    AUDIT #{selectedAnalysis._id ? selectedAnalysis._id.slice(-8).toUpperCase() : 'ACTIVE'}
                  </span>
                  <span className="text-xs text-[#758177]">
                    Executed on {new Date(selectedAnalysis.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-[#18231C] mt-2">
                  {findings.length} Discrepancies Flagged Across Contract Obligations
                </h2>
              </div>

              {/* 3 Triage Metric Pills */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="bg-[#FAF0F0] border border-[#EED1D0] px-3.5 py-2 rounded-xl text-center min-w-[90px]">
                  <span className="text-lg font-bold text-[#B5413D] leading-none block">{highRiskCount}</span>
                  <span className="text-[10px] font-semibold text-[#A63C38] mt-1 block">High Risk</span>
                </div>

                <div className="bg-[#FAF1ED] border border-[#EDD5CA] px-3.5 py-2 rounded-xl text-center min-w-[90px]">
                  <span className="text-lg font-bold text-[#9C6A28] leading-none block">{mediumRiskCount}</span>
                  <span className="text-[10px] font-semibold text-[#8C523D] mt-1 block">Medium Risk</span>
                </div>

                <div className="bg-[#F1F5F8] border border-[#D5E0EA] px-3.5 py-2 rounded-xl text-center min-w-[90px]">
                  <span className="text-lg font-bold text-[#2F5236] leading-none block">{lowRiskCount}</span>
                  <span className="text-[10px] font-semibold text-[#5A665D] mt-1 block">Low Risk</span>
                </div>
              </div>
            </div>

            {/* Evaluated Contract Tags */}
            {selectedAnalysis.documents && selectedAnalysis.documents.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap text-xs text-[#5A665D]">
                <span className="font-semibold text-[#18231C]">Evaluated Documents:</span>
                {selectedAnalysis.documents.map((d, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF9F5] border border-[#DDDCD3] text-[#18231C] font-semibold">
                    <FileText className="w-3.5 h-3.5 text-[#35536D]" />
                    <span>{typeof d === 'object' ? d.fileName : `Document #${i + 1}`}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Findings Accordion Stream */}
        {loading ? (
          <div className="py-16 text-center text-xs text-[#6B736D] font-normal">
            Synthesizing cross-document contradiction findings...
          </div>
        ) : findings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#DDDCD3] p-12 text-center shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAECE4] text-[#3F6149] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-sm font-semibold text-[#18231C]">No Contradictions Detected</h3>
            <p className="text-xs text-[#5A665D] max-w-sm mx-auto">
              The evaluated contracts contain fully aligned terms with no direct legal contradictions or conflicting obligations.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {findings.map((finding, idx) => {
              const fId = finding._id || finding.id || idx;
              const isExpanded = !!expandedIds[fId];

              return (
                <div
                  key={fId}
                  className="bg-white rounded-2xl border border-[#DDDCD3] shadow-card overflow-hidden transition-all"
                >
                  {/* Finding Header */}
                  <div
                    onClick={() => toggleExpand(fId)}
                    className="p-5 md:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF9F5] transition-colors"
                  >
                    <div className="flex items-center gap-3 truncate min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#EAECE4] text-[#3F6149] flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div className="truncate">
                        <h3 className="text-xs md:text-sm font-semibold text-[#18231C] truncate">
                          {finding.title || `Contradiction in ${(finding.category || 'CONTRACT').replace(/_/g, ' ')}`}
                        </h3>
                        <p className="text-[11px] text-[#758177] truncate mt-0.5">
                          Scope: {(finding.category || 'GENERAL').replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <RiskBadge riskLevel={finding.riskLevel} classification={finding.classification} />
                      <button className="text-[#8C948C] hover:text-[#18231C] p-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Finding Body Details */}
                  {isExpanded && (
                    <div className="p-6 pt-0 border-t border-[#ECEAE2] space-y-5 bg-white">
                      
                      {/* Side-by-side Clause Excerpts */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        {/* Clause 1 */}
                        <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#DDDCD3] space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-[#35536D] border-b border-[#ECEAE2] pb-1.5">
                            <span className="truncate">{finding.doc1Name || 'Contract A'}</span>
                            <span className="text-[#758177]">Clause 1</span>
                          </div>
                          <p className="text-xs text-[#242C26] italic leading-relaxed whitespace-pre-line">
                            "{finding.clause1Text || finding.clause1Snippet || 'No clause text extracted.'}"
                          </p>
                        </div>

                        {/* Clause 2 */}
                        <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#DDDCD3] space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-[#9B4F37] border-b border-[#ECEAE2] pb-1.5">
                            <span className="truncate">{finding.doc2Name || 'Contract B'}</span>
                            <span className="text-[#758177]">Clause 2</span>
                          </div>
                          <p className="text-xs text-[#242C26] italic leading-relaxed whitespace-pre-line">
                            "{finding.clause2Text || finding.clause2Snippet || 'No conflicting clause text extracted.'}"
                          </p>
                        </div>
                      </div>

                      {/* AI Legal Explanation */}
                      <div className="p-4 rounded-xl bg-[#FAF1ED]/60 border border-[#EDD5CA] text-xs text-[#18231C] space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-[#9B4F37]">
                          <AlertTriangle className="w-3.5 h-3.5 stroke-[2]" />
                          <span>Legal Contradiction Breakdown:</span>
                        </div>
                        <p className="text-[#2E3731] leading-relaxed pt-1">
                          {finding.explanation || 'Direct operational contradiction identified between the two obligations.'}
                        </p>
                      </div>

                      {/* AI Counsel Guidance & Recommendation */}
                      <div className="p-4 rounded-xl bg-[#EAECE4] border border-[#D7DACD] text-xs text-[#18231C] space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-[#34503C]">
                          <Lightbulb className="w-3.5 h-3.5 stroke-[2] text-[#3F6149]" />
                          <span>Counsel Mitigation Guidance:</span>
                        </div>
                        <p className="text-[#2E3731] leading-relaxed pt-1">
                          {finding.recommendation || 'Harmonize definitions by executing an addendum aligning notice timelines and liability limits.'}
                        </p>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
};

export default ResultsPage;
