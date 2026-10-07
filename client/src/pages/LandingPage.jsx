import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  GitCompare, 
  ArrowRight, 
  Search, 
  Zap, 
  AlertTriangle,
  Check,
  Leaf,
  Layers,
  Database
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
    <div className="min-h-screen bg-[#F8F7F2] text-[#18231C] flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="border-b border-[#E2DFD5] bg-[#F8F7F2] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3F6149] flex items-center justify-center text-white shadow-2xs">
              <Shield className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <span className="font-semibold text-sm text-[#18231C] tracking-tight">ClauseGuard AI</span>
              <span className="hidden sm:block text-[10px] text-[#5A665D] font-normal">Smarter Contracts. Safer Decisions.</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-[#3F6149] hover:bg-[#34503C] text-white font-semibold text-xs rounded-xl transition-colors shadow-2xs"
              >
                Go to Workspace →
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-xs font-semibold text-[#5A665D] hover:text-[#18231C] px-3 py-1.5 transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#3F6149] hover:bg-[#34503C] text-white font-semibold text-xs rounded-xl transition-colors shadow-2xs"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h1 className="text-3xl md:text-5xl font-bold text-[#18231C] tracking-tight leading-tight">
            Analyze Multi-Contract Obligations.<br />
            <span className="text-[#3F6149]">Detect Cross-Document Contradictions.</span>
          </h1>

          <p className="text-sm md:text-base text-[#5A665D] max-w-2xl mx-auto font-normal leading-relaxed">
            ClauseGuard AI automatically extracts contractual clauses, groups obligations by legal category, and runs semantic cross-document comparisons to uncover conflicting terms, retention clashes, and compliance risks.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="px-5 py-3 bg-[#3F6149] hover:bg-[#34503C] text-white font-semibold text-xs md:text-sm rounded-xl shadow-2xs flex items-center gap-2 transition-colors"
            >
              <span>{isAuthenticated ? 'Open Workspace' : 'Start Analyzing Contracts'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </Link>

            <button
              onClick={handleRunDemo}
              disabled={seeding}
              className="px-5 py-3 bg-white hover:bg-[#F2F0E8] border border-[#DDDCD3] text-[#18231C] font-semibold text-xs md:text-sm rounded-xl shadow-2xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-[#C27D38] stroke-[2]" />
              <span>{seeding ? 'Seeding Demo Data...' : 'Explore Interactive Demo'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Feature Highlights Grid */}
      <section className="py-12 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-[#18231C] tracking-tight">
            Engineered for Precision Legal Operations
          </h2>
          <p className="text-xs md:text-sm text-[#5A665D] mt-1">
            Built specifically to solve cross-contract inconsistency risks before signing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDDCD3] shadow-card space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#D8E4EE] text-[#35536D] flex items-center justify-center">
              <FileText className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="text-sm font-semibold text-[#18231C]">Clause Extraction</h3>
            <p className="text-xs text-[#5A665D] leading-relaxed">
              Automated legal parsing isolates confidentiality, payment, termination, and liability terms from raw PDFs.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDDCD3] shadow-card space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#F5DDD3] text-[#9B4F37] flex items-center justify-center">
              <GitCompare className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="text-sm font-semibold text-[#18231C]">Contradiction Engine</h3>
            <p className="text-xs text-[#5A665D] leading-relaxed">
              Identifies conflicting retention periods, cure periods, and conflicting dispute venues across vendor agreements.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDDCD3] shadow-card space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#E3DEEC] text-[#5B4F73] flex items-center justify-center">
              <Database className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="text-sm font-semibold text-[#18231C]">Semantic Search</h3>
            <p className="text-xs text-[#5A665D] leading-relaxed">
              Vector indexing with ChromaDB enables grounded natural language questions with source clause citations.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDDCD3] shadow-card space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#E2ECE3] text-[#2F5236] flex items-center justify-center">
              <Shield className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="text-sm font-semibold text-[#18231C]">Risk Triage</h3>
            <p className="text-xs text-[#5A665D] leading-relaxed">
              Every identified conflict is categorized by severity (High, Medium, Low) with actionable counsel recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Quote Banner */}
      <section className="py-12 px-6 mt-auto">
        <div className="max-w-4xl mx-auto bg-[#EAECE4] border border-[#D7DACD] rounded-2xl p-6 text-center space-y-2 shadow-2xs">
          <div className="inline-flex items-center justify-center text-[#3F6149]">
            <Leaf className="w-5 h-5 stroke-[2]" />
          </div>
          <h3 className="text-sm md:text-base font-semibold text-[#34503C]">
            Better contracts. Stronger partnerships.
          </h3>
          <p className="text-xs text-[#5A665D] max-w-md mx-auto">
            Empowering legal operations and corporate counsel with automated contract conflict intelligence.
          </p>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-[#E2DFD5] py-6 px-6 text-center text-xs text-[#758177]">
        <p>© 2026 ClauseGuard AI — Legal Contract Intelligence & Contradiction Detection</p>
      </footer>
    </div>
  );
};

export default LandingPage;
