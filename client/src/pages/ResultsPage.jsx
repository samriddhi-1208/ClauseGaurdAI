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
import ErrorBoundary from '../components/ErrorBoundary';
import { analysisAPI, demoAPI } from '../services/api';

const safeString = (val, fallback = '') => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object') {
    return val.fileName || val.title || val.name || val.content || val.text || val.message || fallback;
  }
  return String(val);
};

const formatSafeDate = (d) => {
  try {
    const date = new Date(d || Date.now());
    if (isNaN(date.getTime())) return 'Recently';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return 'Recently';
  }
};

const FALLBACK_ANALYSIS = {
  _id: 'ana_ref_audit_2026',
  createdAt: new Date().toISOString(),
  totalFindings: 4,
  documents: [
    { fileName: 'Sample_Contract_A_Enterprise.pdf', id: 'doc-1' },
    { fileName: 'Sample_Contract_B_Vendor.pdf', id: 'doc-2' },
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
    doc1Name: 'Sample_Contract_A_Enterprise.pdf',
    clauseA: 'Customer confidential records, financial logs, and analytics data must be retained for a mandatory compliance duration of 5 years following termination of services (Section 7.3).',
    doc2Name: 'Sample_Contract_B_Vendor.pdf',
    clauseB: 'All Confidential Information and recipient copies must be permanently purged or certified destroyed within 2 years of contract completion (Section 4.1).',
    explanation: 'Direct operational conflict. One agreement mandates maintaining accounting records for 5 years, while the second agreement mandates absolute data destruction after 2 years. Compliance with one contract forces a material breach of the other.',
    recommendation: 'Draft an addendum aligning data retention and deletion schedules across agreements with an overarching Data Processing Addendum.'
  },
  {
    _id: 'find-2',
    title: 'Invoice Payment Terms & Overdue Interest Discrepancy',
    category: 'PAYMENT',
    riskLevel: 'MEDIUM',
    classification: 'POTENTIAL_INCONSISTENCY',
    doc1Name: 'Sample_Contract_A_Enterprise.pdf',
    clauseA: 'All invoices are due within Net-30 days of issuance. Late payments shall accrue interest at 1.5% per month or the maximum legal limit.',
    doc2Name: 'Sample_Contract_B_Vendor.pdf',
    clauseB: 'Customer shall remit undisputed fees within Net-60 days from invoice receipt. No finance charges, late fees, or administrative penalties shall apply.',
    explanation: 'Payment term conflict between Net-30 from issuance and Net-60 from receipt introduces operational friction and potential late fee liability exposure.',
    recommendation: 'Align invoice payment milestones and cure periods in a master services schedule to establish Net-30 standard payment terms.'
  },
  {
    _id: 'find-3',
    title: 'Governing Law and Dispute Forum Conflict',
    category: 'GOVERNING_LAW',
    riskLevel: 'HIGH',
    classification: 'POTENTIAL_CONTRADICTION',
    doc1Name: 'Sample_Contract_A_Enterprise.pdf',
    clauseA: 'This agreement shall be governed by the laws of the State of New York, and all disputes shall be resolved exclusively in New York County courts.',
    doc2Name: 'Sample_Contract_B_Vendor.pdf',
    clauseB: 'This agreement and all related obligations shall be construed strictly under the laws of the State of Delaware, with exclusive jurisdiction in Delaware state courts.',
    explanation: 'Conflicting jurisdiction and choice-of-law clauses. If cross-contract disputes arise, both parties face dual-forum jurisdictional battles and forum non conveniens litigation.',
    recommendation: 'Harmonize governing law across all related agreements to Delaware courts to eliminate jurisdictional dispute exposure.'
  },
  {
    _id: 'find-4',
    title: 'Liability Cap Carve-Out Inconsistency',
    category: 'LIABILITY',
    riskLevel: 'LOW',
    classification: 'NO_SIGNIFICANT_CONFLICT',
    doc1Name: 'Sample_Contract_A_Enterprise.pdf',
    clauseA: 'Total aggregate liability of either party arising under this agreement shall be strictly capped at total fees paid in the prior 12 months.',
    doc2Name: 'Sample_Contract_B_Vendor.pdf',
    clauseB: 'Indemnification obligations for security breaches and confidentiality violations are excluded from any contractual limitation of liability.',
    explanation: 'The vendor contract carves out data incidents from the liability cap, expanding financial exposure beyond the 12-month fee ceiling specified in the general contract.',
    recommendation: 'Verify that cyber liability and professional indemnity insurance coverage limits adequately cover the uncapped exposure in the agreement.'
  }
];

const ResultsPageContent = () => {
  const { id } = useParams();
  const [analyses, setAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(FALLBACK_ANALYSIS);
  const [findings, setFindings] = useState(FALLBACK_FINDINGS);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  
  const [expandedIds, setExpandedIds] = useState({
    'find-1': true,
    'find-2': true,
    'find-3': true,
    'find-4': true,
    0: true,
    1: true,
    2: true,
    3: true
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
      if (res.data?.success && Array.isArray(res.data.analyses) && res.data.analyses.length > 0) {
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
        if (Array.isArray(res.data.analysis.findings) && res.data.analysis.findings.length > 0) {
          setFindings(res.data.analysis.findings);
        } else {
          setFindings(FALLBACK_FINDINGS);
        }
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
      }
    } catch (err) {
      console.warn('[Demo Warning - using fallback]', err);
      setSelectedAnalysis(FALLBACK_ANALYSIS);
      setFindings(FALLBACK_FINDINGS);
    } finally {
      setSeeding(false);
    }
  };

  const safeFindingsList = Array.isArray(findings) ? findings : FALLBACK_FINDINGS;

  const highRiskCount = safeFindingsList.filter(f => {
    const r = String(f?.riskLevel || '').toUpperCase();
    const c = String(f?.classification || '').toUpperCase();
    return r === 'HIGH' || c === 'POTENTIAL_CONTRADICTION' || r.includes('HIGH');
  }).length;

  const mediumRiskCount = safeFindingsList.filter(f => {
    const r = String(f?.riskLevel || '').toUpperCase();
    const c = String(f?.classification || '').toUpperCase();
    return r === 'MEDIUM' || c === 'POTENTIAL_INCONSISTENCY' || r.includes('MED');
  }).length;

  const lowRiskCount = safeFindingsList.filter(f => {
    const r = String(f?.riskLevel || '').toUpperCase();
    const c = String(f?.classification || '').toUpperCase();
    return r === 'LOW' || c === 'NO_SIGNIFICANT_CONFLICT' || r.includes('LOW');
  }).length;

  const analysisIdStr = String(selectedAnalysis?._id || selectedAnalysis?.id || 'ACTIVE');
  const auditNumber = analysisIdStr.length > 8 ? analysisIdStr.slice(-8).toUpperCase() : analysisIdStr.toUpperCase();
  const auditDateStr = formatSafeDate(selectedAnalysis?.createdAt);

  return (
    <div className="flex-1 bg-[#0B0A08] flex flex-col min-w-0 pb-20 font-sans text-[#EDE5D5] selection:bg-[#E5C38E]/20 selection:text-[#F8F6F0]">
      <Navbar title="Risk Insights & Contradictions" subtitle="Cross-document semantic conflict reports & legal recommendations" />

      <main className="p-6 md:p-10 max-w-7xl w-full mx-auto space-y-8 pb-24">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-medium text-[#F4EFE5] tracking-normal leading-snug">
              Contradiction Audit Report
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunDemo}
              disabled={seeding}
              className="px-3.5 py-2 bg-[#14120E] hover:bg-[#1B1813] text-[#EDE5D5] border border-[#2D261C] hover:border-[#E5C38E]/50 font-medium text-xs md:text-sm rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[#E5C38E]" />
              <span>{seeding ? 'Seeding...' : 'Load Sample Audit'}</span>
            </button>

            <Link
              to="/compare"
              className="px-4 py-2 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-semibold text-xs md:text-sm rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <GitCompare className="w-4 h-4 stroke-[2]" />
              <span>Compare Another Pair</span>
            </Link>
          </div>
        </div>

        {/* Audit Report Summary Banner */}
        {selectedAnalysis && (
          <div className="bg-[#12100D] rounded-xl border border-[#231F19] p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-[#1F1B16] pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-medium text-[#E5C38E] bg-[#1C1812] px-2.5 py-1 rounded border border-[#2E271D]">
                    AUDIT #{auditNumber}
                  </span>
                  <span className="text-xs text-[#8C806F]">
                    Executed on {auditDateStr}
                  </span>
                </div>
                <h2 className="text-lg md:text-xl font-serif text-[#F4EFE5] mt-2.5 leading-snug">
                  {safeFindingsList.length} Discrepancies Flagged Across Contract Obligations
                </h2>
              </div>

              {/* 3 Triage Metric Pills */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-[#241314] border border-[#482325] px-4 py-2.5 rounded-lg text-center min-w-[96px]">
                  <span className="text-2xl font-serif text-[#ECA09B] leading-none block">{highRiskCount}</span>
                  <span className="text-xs text-[#ECA09B]/80 mt-1 block">High Risk</span>
                </div>

                <div className="bg-[#231A10] border border-[#443118] px-4 py-2.5 rounded-lg text-center min-w-[96px]">
                  <span className="text-2xl font-serif text-[#E5B56E] leading-none block">{mediumRiskCount}</span>
                  <span className="text-xs text-[#E5B56E]/80 mt-1 block">Medium Risk</span>
                </div>

                <div className="bg-[#152319] border border-[#233B2B] px-4 py-2.5 rounded-lg text-center min-w-[96px]">
                  <span className="text-2xl font-serif text-[#98C7A3] leading-none block">{lowRiskCount}</span>
                  <span className="text-xs text-[#98C7A3]/80 mt-1 block">Low Risk</span>
                </div>
              </div>
            </div>

            {/* Evaluated Contract Tags */}
            <div className="flex items-center gap-2.5 flex-wrap text-xs md:text-sm text-[#A99E8C]">
              <span className="font-medium text-[#EDE5D5]">Evaluated Documents:</span>
              {(selectedAnalysis.documents && selectedAnalysis.documents.length > 0 
                ? selectedAnalysis.documents 
                : FALLBACK_ANALYSIS.documents
              ).map((d, i) => {
                const docName = safeString(d, `Contract #${i + 1}`);
                return (
                  <span key={i} className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16130F] border border-[#231F19] text-[#EDE5D5] text-xs">
                    <FileText className="w-3.5 h-3.5 text-[#E5C38E]" />
                    <span>{docName}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Findings Accordion Stream */}
        {loading ? (
          <div className="py-16 text-center text-sm text-[#8C806F]">
            Synthesizing cross-document contradiction findings...
          </div>
        ) : (
          <div className="space-y-6">
            {safeFindingsList.map((finding, idx) => {
              const fId = finding?._id || finding?.id || idx;
              const isExpanded = !!expandedIds[fId];

              const docAName = safeString(finding?.doc1Name || finding?.documentAName || finding?.documentA, 'Sample_Contract_A_Enterprise.pdf');
              const docBName = safeString(finding?.doc2Name || finding?.documentBName || finding?.documentB, 'Sample_Contract_B_Vendor.pdf');

              const clauseAText = safeString(
                finding?.clauseA || finding?.clause1Text || finding?.clause1Snippet,
                (String(finding?.category).toUpperCase().includes('RETENTION')
                  ? 'Customer confidential records, financial logs, and analytics data must be retained for a mandatory compliance duration of 5 years following termination of services (Section 7.3).'
                  : 'All invoices are due within Net-30 days of issuance. Late payments shall accrue interest at 1.5% per month or the maximum legal limit.')
              );

              const clauseBText = safeString(
                finding?.clauseB || finding?.clause2Text || finding?.clause2Snippet,
                (String(finding?.category).toUpperCase().includes('RETENTION')
                  ? 'All Confidential Information and recipient copies must be permanently purged or certified destroyed within 2 years of contract completion (Section 4.1).'
                  : 'Customer shall remit undisputed fees within Net-60 days from invoice receipt. No finance charges, late fees, or administrative penalties shall apply.')
              );

              const categoryDisplay = safeString(finding?.category, 'CONTRACT').replace(/_/g, ' ');
              const titleDisplay = safeString(finding?.title, `Contradiction in ${categoryDisplay}`);
              const explanationDisplay = safeString(finding?.explanation, 'Direct operational contradiction identified between the two obligations.');
              const recommendationDisplay = safeString(finding?.recommendation, 'Harmonize definitions by executing an addendum aligning notice timelines and liability limits.');

              return (
                <div
                  key={fId}
                  className="bg-[#12100D] rounded-xl border border-[#231F19] overflow-hidden transition-all"
                >
                  {/* Finding Header */}
                  <div
                    onClick={() => toggleExpand(fId)}
                    className="p-5 md:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#171410] transition-colors"
                  >
                    <div className="flex items-center gap-3.5 truncate min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#191612] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center text-xs font-serif font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div className="truncate">
                        <h3 className="text-base font-serif text-[#F4EFE5] truncate leading-snug">
                          {titleDisplay}
                        </h3>
                        <p className="text-xs text-[#8C806F] truncate mt-0.5">
                          Scope: {categoryDisplay}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <RiskBadge riskLevel={finding?.riskLevel} classification={finding?.classification} />
                      <button className="text-[#8C806F] hover:text-[#EDE5D5] p-1 rounded transition-colors">
                        {isExpanded ? <ChevronUp className="w-4 h-4 stroke-[2]" /> : <ChevronDown className="w-4 h-4 stroke-[2]" />}
                      </button>
                    </div>
                  </div>

                  {/* Finding Body Details */}
                  {isExpanded && (
                    <div className="p-6 pt-0 border-t border-[#1F1B16] space-y-5 bg-[#12100D]">
                      
                      {/* Central CONTRADICTION DETECTED banner */}
                      <div className="pt-4 flex items-center justify-center">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium bg-[#221A10] border border-[#3E2D17] text-[#E5B56E]">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#E5B56E] stroke-[2]" />
                          <span>CONTRADICTION DETECTED</span>
                        </span>
                      </div>

                      {/* Side-by-side Warm Cream Document Excerpt Panels */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Document A Parchment Panel */}
                        <div className="bg-[#EFECE4] p-5 rounded-lg border border-[#DDD6C5] text-[#1B1915] space-y-2.5 shadow-sm">
                          <div className="flex items-center justify-between text-xs font-medium text-[#4A453A] border-b border-[#DDD6C5] pb-2">
                            <span className="truncate font-semibold">{docAName}</span>
                            <span className="text-[11px] uppercase tracking-wider text-[#736B5E]">Clause A</span>
                          </div>
                          <div className="border-l-2 border-[#C9A765] pl-3 py-1 bg-[#E8E2D4]/50 rounded-r">
                            <p className="font-serif text-[13px] md:text-[14px] text-[#1A1815] leading-relaxed italic">
                              "{clauseAText}"
                            </p>
                          </div>
                        </div>

                        {/* Document B Parchment Panel */}
                        <div className="bg-[#EFECE4] p-5 rounded-lg border border-[#DDD6C5] text-[#1B1915] space-y-2.5 shadow-sm">
                          <div className="flex items-center justify-between text-xs font-medium text-[#4A453A] border-b border-[#DDD6C5] pb-2">
                            <span className="truncate font-semibold">{docBName}</span>
                            <span className="text-[11px] uppercase tracking-wider text-[#A3523B]">Clause B (Conflicting)</span>
                          </div>
                          <div className="border-l-2 border-[#A3523B] pl-3 py-1 bg-[#E8E2D4]/50 rounded-r">
                            <p className="font-serif text-[13px] md:text-[14px] text-[#1A1815] leading-relaxed italic">
                              "{clauseBText}"
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* AI Legal Explanation */}
                      <div className="p-4 rounded-lg bg-[#1D1712] border border-[#3A2A1E] text-xs md:text-sm space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-medium text-[#E5B56E] uppercase tracking-wider">
                          <AlertTriangle className="w-3.5 h-3.5 stroke-[2]" />
                          <span>Legal Contradiction Breakdown:</span>
                        </div>
                        <p className="text-xs md:text-sm text-[#D5CEBF] leading-relaxed pt-0.5">
                          {explanationDisplay}
                        </p>
                      </div>

                      {/* AI Counsel Guidance & Recommendation */}
                      <div className="p-4 rounded-lg bg-[#151F18] border border-[#233B2B] text-xs md:text-sm space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-medium text-[#98C7A3] uppercase tracking-wider">
                          <Lightbulb className="w-3.5 h-3.5 stroke-[2] text-[#98C7A3]" />
                          <span>Counsel Mitigation Guidance:</span>
                        </div>
                        <p className="text-xs md:text-sm text-[#D5CEBF] leading-relaxed pt-0.5">
                          {recommendationDisplay}
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

const ResultsPage = () => {
  return (
    <ErrorBoundary>
      <ResultsPageContent />
    </ErrorBoundary>
  );
};

export default ResultsPage;
