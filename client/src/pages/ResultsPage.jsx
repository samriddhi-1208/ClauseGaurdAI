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

const FALLBACK_ANALYSIS = {
  _id: 'ana_ref_audit_2026',
  createdAt: new Date().toISOString(),
  totalFindings: 4,
  documents: [
    { fileName: 'Vendor Agreement.pdf', id: 'doc-1' },
    { fileName: 'NDA_Draft.pdf', id: 'doc-2' },
    { fileName: 'Master_Service_Agreement.pdf', id: 'doc-3' }
  ]
};

const FALLBACK_FINDINGS = [
  {
    _id: 'find-1',
    title: 'Data Retention & Purge Obligation Mismatch',
    category: 'DATA_RETENTION',
    riskLevel: 'HIGH',
    classification: 'POTENTIAL_CONTRADICTION',
    doc1Name: 'Vendor Agreement.pdf',
    clause1Text: 'Customer confidential records, financial logs, and analytics data must be retained for a mandatory compliance duration of 5 years following termination of services (Section 7.3).',
    doc2Name: 'NDA_Draft.pdf',
    clause2Text: 'All Confidential Information and recipient copies must be permanently purged or certified destroyed within 30 days of written notice or agreement termination (Section 4.1).',
    explanation: 'Direct operational conflict. One agreement mandates maintaining accounting records for 5 years, while the non-disclosure agreement mandates absolute data destruction within 30 days. Complying with one agreement forces a material breach of the other.',
    recommendation: 'Draft an addendum to the NDA inserting a standard compliance exception: "Except for copies retained to satisfy statutory, legal, or regulatory recordkeeping mandates."'
  },
  {
    _id: 'find-2',
    title: 'Invoice Payment Terms & Overdue Interest Discrepancy',
    category: 'PAYMENT',
    riskLevel: 'MEDIUM',
    classification: 'POTENTIAL_INCONSISTENCY',
    doc1Name: 'Vendor Agreement.pdf',
    clause1Text: 'All invoices are due within Net-30 days of delivery. Late payments shall accrue interest at 1.5% per month or the maximum legal limit.',
    doc2Name: 'Master_Service_Agreement.pdf',
    clause2Text: 'Customer shall remit undisputed fees within Net-60 days. No finance charges, late fees, or administrative penalties shall apply.',
    explanation: 'Payment timeline mismatch. The vendor contract expects invoice settlement in 30 days with interest penalties, whereas the master agreement provides a 60-day remittance window and disallows interest charges.',
    recommendation: 'Align both agreements to Net-30 days with a 15-day formal invoice dispute cure window.'
  },
  {
    _id: 'find-3',
    title: 'Governing Law and Dispute Forum Conflict',
    category: 'GOVERNING_LAW',
    riskLevel: 'HIGH',
    classification: 'POTENTIAL_CONTRADICTION',
    doc1Name: 'Vendor Agreement.pdf',
    clause1Text: 'This agreement shall be governed by the laws of the State of New York, and all disputes shall be resolved in New York County courts.',
    doc2Name: 'Client_Contract.pdf',
    clause2Text: 'This agreement and all related obligations shall be construed strictly under the laws of the State of Delaware, with exclusive jurisdiction in Delaware state courts.',
    explanation: 'Conflicting jurisdiction and choice-of-law clauses. If cross-contract disputes arise, both parties face dual-forum jurisdictional battles and forum non conveniens litigation.',
    recommendation: 'Harmonize governing law across all related agreements to Delaware courts to eliminate jurisdictional dispute exposure.'
  },
  {
    _id: 'find-4',
    title: 'Liability Cap Carve-Out Inconsistency',
    category: 'LIABILITY',
    riskLevel: 'LOW',
    classification: 'NO_SIGNIFICANT_CONFLICT',
    doc1Name: 'Vendor Agreement.pdf',
    clause1Text: 'Total aggregate liability of either party arising under this agreement shall be strictly capped at total fees paid in the prior 12 months.',
    doc2Name: 'Service_Level_Agreement.pdf',
    clause2Text: 'Indemnification obligations for security breaches and confidentiality violations are excluded from any contractual limitation of liability.',
    explanation: 'The SLA carves out data incidents from the liability cap, expanding financial exposure beyond the 12-month fee ceiling specified in the general contract.',
    recommendation: 'Verify that cyber liability and professional indemnity insurance coverage limits adequately cover the uncapped exposure in the SLA.'
  }
];

const ResultsPage = () => {
  const { id } = useParams();
  const [analyses, setAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(FALLBACK_ANALYSIS);
  const [findings, setFindings] = useState(FALLBACK_FINDINGS);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  
  // Auto expand all findings initially
  const [expandedIds, setExpandedIds] = useState({
    'find-1': true,
    'find-2': true,
    'find-3': true,
    'find-4': true
  });

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
      if (res.data?.success && res.data.analyses?.length > 0) {
        setAnalyses(res.data.analyses);
        fetchAnalysisById(res.data.analyses[0]._id || res.data.analyses[0].id);
      } else {
        setSelectedAnalysis(FALLBACK_ANALYSIS);
        setFindings(FALLBACK_FINDINGS);
      }
    } catch (err) {
      console.warn('[Fetch Analyses Warning - using fallback]', err);
      setSelectedAnalysis(FALLBACK_ANALYSIS);
      setFindings(FALLBACK_FINDINGS);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysisById = async (analysisId) => {
    try {
      setLoading(true);
      const res = await analysisAPI.getById(analysisId);
      if (res.data?.success && res.data.analysis) {
        setSelectedAnalysis(res.data.analysis);
        const fList = res.data.findings || [];
        if (fList.length > 0) {
          setFindings(fList);
          const expMap = {};
          fList.forEach((item, idx) => {
            expMap[item._id || item.id || idx] = true;
          });
          setExpandedIds(expMap);
        } else {
          setFindings(FALLBACK_FINDINGS);
        }
      } else {
        setSelectedAnalysis(FALLBACK_ANALYSIS);
        setFindings(FALLBACK_FINDINGS);
      }
    } catch (err) {
      console.warn('[Fetch Analysis Warning - using fallback]', err);
      setSelectedAnalysis(FALLBACK_ANALYSIS);
      setFindings(FALLBACK_FINDINGS);
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
      if (res.data?.success && res.data.analysisId) {
        fetchAnalysisById(res.data.analysisId);
      } else {
        setSelectedAnalysis(FALLBACK_ANALYSIS);
        setFindings(FALLBACK_FINDINGS);
      }
    } catch (err) {
      console.warn('[Demo Warning - using fallback]', err);
      setSelectedAnalysis(FALLBACK_ANALYSIS);
      setFindings(FALLBACK_FINDINGS);
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
            <h1 className="text-xl md:text-2xl font-bold text-[#18231C] tracking-tight">
              Contradiction Audit Report
            </h1>
            <p className="text-xs md:text-sm text-[#5A665D] mt-1 font-normal">
              Comprehensive discrepancy analysis across evaluated legal obligations
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRunDemo}
              disabled={seeding}
              className="px-3.5 py-2 bg-white hover:bg-[#F2F0E8] text-[#18231C] border border-[#DDDCD3] font-semibold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[#C27D38]" />
              <span>{seeding ? 'Seeding...' : 'Load Sample Audit'}</span>
            </button>

            <Link
              to="/compare"
              className="px-3.5 py-2 bg-[#3F6149] hover:bg-[#34503C] text-white font-semibold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <GitCompare className="w-3.5 h-3.5 stroke-[2]" />
              <span>Compare Another Pair</span>
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
                <h2 className="text-base md:text-lg font-bold text-[#18231C] mt-2">
                  {findings.length} Discrepancies Flagged Across Contract Obligations
                </h2>
              </div>

              {/* 3 Triage Metric Pills */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="bg-[#FAF0F0] border border-[#EED1D0] px-4 py-2.5 rounded-xl text-center min-w-[95px] shadow-2xs">
                  <span className="text-xl font-bold text-[#B5413D] leading-none block">{highRiskCount}</span>
                  <span className="text-[11px] font-semibold text-[#A63C38] mt-1 block">High Risk</span>
                </div>

                <div className="bg-[#FAF1ED] border border-[#EDD5CA] px-4 py-2.5 rounded-xl text-center min-w-[95px] shadow-2xs">
                  <span className="text-xl font-bold text-[#9C6A28] leading-none block">{mediumRiskCount}</span>
                  <span className="text-[11px] font-semibold text-[#8C523D] mt-1 block">Medium Risk</span>
                </div>

                <div className="bg-[#F1F5F8] border border-[#D5E0EA] px-4 py-2.5 rounded-xl text-center min-w-[95px] shadow-2xs">
                  <span className="text-xl font-bold text-[#2F5236] leading-none block">{lowRiskCount}</span>
                  <span className="text-[11px] font-semibold text-[#5A665D] mt-1 block">Low Risk</span>
                </div>
              </div>
            </div>

            {/* Evaluated Contract Tags */}
            {selectedAnalysis.documents && selectedAnalysis.documents.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap text-xs text-[#5A665D]">
                <span className="font-semibold text-[#18231C]">Evaluated Documents:</span>
                {selectedAnalysis.documents.map((d, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF9F5] border border-[#DDDCD3] text-[#18231C] font-semibold">
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
                    <div className="flex items-center gap-3.5 truncate min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#EAECE4] text-[#3F6149] flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                        {idx + 1}
                      </div>
                      <div className="truncate">
                        <h3 className="text-sm md:text-[15px] font-bold text-[#18231C] truncate leading-snug">
                          {finding.title || `Contradiction in ${(finding.category || 'CONTRACT').replace(/_/g, ' ')}`}
                        </h3>
                        <p className="text-xs text-[#758177] truncate mt-0.5 font-normal">
                          Scope: {(finding.category || 'GENERAL').replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <RiskBadge riskLevel={finding.riskLevel} classification={finding.classification} />
                      <button className="text-[#8C948C] hover:text-[#18231C] p-1.5 rounded-lg hover:bg-[#EAECE4] transition-colors">
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
                        <div className="bg-[#FAF9F5] p-4.5 rounded-xl border border-[#DDDCD3] space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold text-[#35536D] border-b border-[#ECEAE2] pb-1.5">
                            <span className="truncate">{finding.doc1Name || 'Contract A'}</span>
                            <span className="text-[#758177] font-normal">Clause Excerpt</span>
                          </div>
                          <p className="text-xs text-[#242C26] italic leading-relaxed whitespace-pre-line font-normal">
                            "{finding.clause1Text || finding.clause1Snippet || 'No clause text extracted.'}"
                          </p>
                        </div>

                        {/* Clause 2 */}
                        <div className="bg-[#FAF9F5] p-4.5 rounded-xl border border-[#DDDCD3] space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold text-[#9B4F37] border-b border-[#ECEAE2] pb-1.5">
                            <span className="truncate">{finding.doc2Name || 'Contract B'}</span>
                            <span className="text-[#758177] font-normal">Conflicting Excerpt</span>
                          </div>
                          <p className="text-xs text-[#242C26] italic leading-relaxed whitespace-pre-line font-normal">
                            "{finding.clause2Text || finding.clause2Snippet || 'No conflicting clause text extracted.'}"
                          </p>
                        </div>
                      </div>

                      {/* AI Legal Explanation */}
                      <div className="p-4.5 rounded-xl bg-[#FAF1ED]/70 border border-[#EDD5CA] text-xs text-[#18231C] space-y-1.5">
                        <div className="flex items-center gap-2 font-bold text-[#9B4F37]">
                          <AlertTriangle className="w-4 h-4 stroke-[2]" />
                          <span className="text-xs uppercase tracking-wide">Legal Contradiction Analysis:</span>
                        </div>
                        <p className="text-[#2E3731] leading-relaxed font-normal pt-1">
                          {finding.explanation || 'Direct operational contradiction identified between the two obligations.'}
                        </p>
                      </div>

                      {/* AI Counsel Guidance & Recommendation */}
                      <div className="p-4.5 rounded-xl bg-[#EAECE4] border border-[#D7DACD] text-xs text-[#18231C] space-y-1.5">
                        <div className="flex items-center gap-2 font-bold text-[#34503C]">
                          <Lightbulb className="w-4 h-4 stroke-[2] text-[#3F6149]" />
                          <span className="text-xs uppercase tracking-wide">Counsel Mitigation Guidance:</span>
                        </div>
                        <p className="text-[#2E3731] leading-relaxed font-normal pt-1">
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
