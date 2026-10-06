import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Scale, 
  ShieldAlert, 
  FileText, 
  Brain, 
  GitCompare, 
  ArrowRight, 
  MessageSquare, 
  Search, 
  Zap 
} from 'lucide-react';
import { demoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [seeding, setSeeding] = React.useState(false);

  const handleRunDemo = async () => {
    if (!isAuthenticated) {
      navigate('/login?demo=true');
      return;
    }
    try {
      setSeeding(true);
      const res = await demoAPI.seed();
      if (res.data.success) {
        navigate(`/results/${res.data.analysisId}`);
      }
    } catch (err) {
      console.error('[Demo Error]', err);
      alert('Could not start demo. Please log in first.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xs sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">ClauseGuard <span className="text-blue-600">AI</span></span>
              <span className="block text-[10px] text-slate-500 font-medium tracking-wider uppercase">Legal Contract Intelligence</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs md:text-sm rounded-lg transition-colors shadow-xs"
              >
                Go to Workspace
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-xs md:text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-1.5 transition-colors">
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs md:text-sm rounded-lg transition-colors shadow-xs"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-16 px-6 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
            <span>AI-Powered Legal Contract Intelligence & Contradiction Detection</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Analyze Multi-Contract Obligations.<br />
            <span className="text-blue-600">Detect Cross-Document Contradictions.</span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            ClauseGuard AI automatically extracts contractual clauses, groups obligations by legal category, and runs semantic cross-document comparisons to uncover conflicting terms, retention clashes, and compliance risks.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={isAuthenticated ? "/upload" : "/register"}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-xs flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleRunDemo}
              disabled={seeding}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-lg transition-colors shadow-xs flex items-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{seeding ? "Loading Demo..." : "Instant Demo Mode"}</span>
            </button>
          </div>

          {/* Workflow Sequence */}
          <div className="pt-10">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">Intelligence Pipeline Architecture</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-xs text-slate-900">Upload Contracts</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">PDF, DOCX, TXT</span>
                </div>

                <div className="flex flex-col items-center p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2.5">
                    <Brain className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-xs text-slate-900">AI Clause Extraction</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">Categorize terms</span>
                </div>

                <div className="flex flex-col items-center p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-2.5">
                    <GitCompare className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-xs text-slate-900">Cross-Document Scan</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">Pairwise matching</span>
                </div>

                <div className="flex flex-col items-center p-3.5 bg-rose-50 rounded-lg border border-rose-200/80">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-2.5">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-xs text-rose-900">Risk Assessment</span>
                  <span className="text-[11px] text-rose-600 mt-0.5">Grounded rationale</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Comparative Evidence Preview */}
      <section className="py-14 px-6 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900">Cross-Document Contradiction Example</h2>
            <p className="text-xs text-slate-500 mt-1">Identifies subtle friction points across distinct agreements</p>
          </div>

          <div className="bg-[#0B101D] rounded-xl p-6 text-white shadow-md border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span className="font-medium text-xs text-rose-400 uppercase tracking-wider">Identified Contradiction</span>
              </div>
              <span className="px-2.5 py-0.5 bg-rose-950/60 text-rose-300 text-xs font-medium rounded-md border border-rose-800/60">
                High Risk Friction
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs text-blue-400">Master Services Agreement</span>
                  <span className="text-[11px] text-slate-400">Page 2</span>
                </div>
                <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded border border-slate-800 font-mono">
                  "Customer transactional records and audit logs shall be retained for 5 years following termination."
                </p>
              </div>

              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs text-amber-400">Vendor Privacy Policy</span>
                  <span className="text-[11px] text-slate-400">Page 3</span>
                </div>
                <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded border border-slate-800 font-mono">
                  "All customer confidential data and records must be permanently purged within 2 years of delivery."
                </p>
              </div>
            </div>

            <div className="bg-blue-950/40 border border-blue-800/50 p-3.5 rounded-lg space-y-1">
              <h4 className="text-xs font-semibold text-blue-300 uppercase tracking-wider">AI Legal Analysis</h4>
              <p className="text-xs text-slate-300 font-normal leading-relaxed">
                The Master Agreement mandates a 5-year data retention schedule, whereas the Privacy Policy imposes permanent deletion within 2 years. Compliance with both obligations concurrently is legally impossible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="py-14 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Contract Intelligence Capabilities</h2>
            <p className="text-xs text-slate-500 mt-1">Designed for in-house counsel, risk analysts, and procurement teams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900 mb-1">Multi-Format Support</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Native processing for PDF, DOCX, and TXT agreements with section and page-level metadata extraction.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                <Brain className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900 mb-1">AI Clause Classification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Automatic categorization into Payment, Liability, Confidentiality, Data Retention, and Jurisdiction.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900 mb-1">Vector Similarity Retrieval</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Persistent ChromaDB embeddings index pairing related obligations across disparate documents.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                <GitCompare className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900 mb-1">Pairwise Contradiction Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Gemini AI evaluation highlighting logical discrepancies, conflicting durations, and opposing covenants.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900 mb-1">Risk Severity Scoring</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Triaged High, Medium, and Low risk classifications accompanied by actionable recommendations.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900 mb-1">Grounded RAG Dialogue</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Inquire in natural language with answers strictly cited against specific contract clauses and page numbers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#0B101D] text-slate-400 border-t border-slate-800 py-6 px-6 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-white">ClauseGuard AI</span>
            <span>&bull; Legal Contract Intelligence System</span>
          </div>
          <p>&copy; 2026 ClauseGuard AI. Designed for professional legal research and contract contradiction analysis.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
