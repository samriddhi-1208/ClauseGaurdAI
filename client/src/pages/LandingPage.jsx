import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Scale, 
  ShieldAlert, 
  FileText, 
  Brain, 
  GitCompare, 
  CheckCircle2, 
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
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">ClauseGuard <span className="text-blue-600">AI</span></span>
              <span className="block text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Legal Intelligence System</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 transition-colors">
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all shadow-md shadow-blue-600/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            <span>AI-Powered Legal Contract Intelligence & Contradiction Detection</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Analyze Legal Documents.<br />
            <span className="text-blue-600">Detect Potential Contradictions.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            ClauseGuard AI automatically extracts key clauses, categorizes obligations, and performs cross-document semantic comparison to highlight conflicting terms and legal risks across contracts.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/upload" : "/register"}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <button
              onClick={handleRunDemo}
              disabled={seeding}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-base rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>{seeding ? "Loading Sample Data..." : "Try Instant Demo"}</span>
            </button>
          </div>

          {/* Workflow Diagram */}
          <div className="pt-12">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xl max-w-4xl mx-auto">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">How ClauseGuard Works</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm text-slate-900">📄 Upload PDFs</span>
                  <span className="text-xs text-slate-500 mt-1">Multi-contract ingest</span>
                </div>

                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                    <Brain className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm text-slate-900">🧠 AI Extraction</span>
                  <span className="text-xs text-slate-500 mt-1">Extract & categorize</span>
                </div>

                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                    <GitCompare className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm text-slate-900">⚖️ Comparison</span>
                  <span className="text-xs text-slate-500 mt-1">Cross-document match</span>
                </div>

                <div className="flex flex-col items-center p-4 bg-red-50 rounded-xl border border-red-100">
                  <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm text-red-900">🚨 Risk Detection</span>
                  <span className="text-xs text-red-600 mt-1">Side-by-side evidence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core USP Example Section */}
      <section className="py-16 px-6 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">🚨 Cross-Document Contradiction Engine</h2>
            <p className="text-slate-600 mt-2">ClauseGuard AI identifies hidden clashes across distinct vendor agreements, NDAs, and corporate policies.</p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-bold text-sm text-red-400">DETECTED CONTRADICTION FINDING</span>
              </div>
              <span className="px-3 py-1 bg-red-500/20 text-red-300 text-xs font-semibold rounded-full border border-red-500/30">
                🔴 High Risk Level
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-blue-400">Document A: Enterprise Services.pdf</span>
                  <span className="text-xs text-slate-400">Page 2</span>
                </div>
                <p className="text-sm text-slate-200 bg-slate-900/60 p-3 rounded border border-slate-700 italic">
                  "Customer data must be retained for 5 years from contract termination."
                </p>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-amber-400">Document B: Vendor Privacy Agreement.pdf</span>
                  <span className="text-xs text-slate-400">Page 3</span>
                </div>
                <p className="text-sm text-slate-200 bg-slate-900/60 p-3 rounded border border-slate-700 italic">
                  "Customer data must be permanently deleted after 2 years."
                </p>
              </div>
            </div>

            <div className="bg-blue-950/60 border border-blue-800/60 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">🧠 AI Explanation</h4>
              <p className="text-xs text-slate-300">
                Document A specifies a 5-year retention requirement, whereas Document B mandates data deletion after 2 years. Compliance with both agreements is legally impossible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">Complete Contract Intelligence Suite</h2>
            <p className="text-slate-600 mt-2">Built for legal teams, procurement leads, and risk managers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Multi-Document Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Upload multiple PDFs simultaneously and maintain indexed vector isolation per user account.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">AI Clause Extraction</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Automatically extract payment, liability, confidentiality, data retention, and jurisdiction clauses into structured categories.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Semantic Candidate Search</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Vector similarity matching pairs related clauses across distinct contracts for targeted contradiction evaluation.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <GitCompare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Cross-Document Comparison</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Select any 2+ uploaded documents and execute category-level comparison powered by Google Gemini AI.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Transparent Risk Scoring</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Clear 🔴 High, 🟠 Medium, and 🟢 Low risk ratings accompanied by grounded legal recommendations.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Document RAG Chatbot</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Ask natural language legal questions and receive answers strictly grounded in your contract context with page citations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 border-t border-slate-800 py-8 px-6 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-white">ClauseGuard AI</span>
            <span>— Major LegalTech Prototype Project</span>
          </div>
          <p>© 2026 ClauseGuard AI. For informational analysis & major project demonstration.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
