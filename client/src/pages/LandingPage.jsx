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
      <header className="border-b border-[#E2DFD5] bg-[#F8F7F2] sticky top-0 z-50 py-1">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3F6149] flex items-center justify-center text-white shadow-2xs shrink-0">
              <Shield className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-extrabold text-lg md:text-xl text-[#101A13] tracking-tight block leading-tight">
                ClauseGuard AI
              </span>
              <span className="hidden sm:block text-xs md:text-[13px] text-[#38463C] font-semibold leading-normal mt-0.5">
                Smarter Contracts. Safer Decisions.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2.5 bg-[#3F6149] hover:bg-[#34503C] text-white font-bold text-xs md:text-sm rounded-xl transition-colors shadow-2xs cursor-pointer"
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
      <section className="pt-8 md:pt-10 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#101A13] tracking-tight leading-tight">
            Analyze Multi-Contract Obligations.<br />
            <span className="text-[#3F6149]">Detect Cross-Document Contradictions.</span>
          </h1>

          <p className="text-sm md:text-base text-[#38463C] max-w-2xl mx-auto font-medium leading-relaxed">
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
        <div className="text-center mb-10 space-y-1.5">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#101A13] tracking-tight">
            Engineered for Precision Legal Operations
          </h2>
          <p className="text-sm md:text-base text-[#38463C] font-semibold">
            Built specifically to solve cross-contract inconsistency risks before signing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDDCD3] shadow-card hover:border-[#CCD4CC] transition-all space-y-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#D8E4EE] text-[#35536D] flex items-center justify-center">
              <FileText className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-base md:text-[17px] font-bold text-[#101A13]">Clause Extraction</h3>
            <p className="text-[13.5px] md:text-sm text-[#2D3930] font-medium leading-relaxed">
              Automated legal parsing isolates confidentiality, payment, termination, and liability terms from raw PDFs.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDDCD3] shadow-card hover:border-[#CCD4CC] transition-all space-y-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F5DDD3] text-[#9B4F37] flex items-center justify-center">
              <GitCompare className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-base md:text-[17px] font-bold text-[#101A13]">Contradiction Engine</h3>
            <p className="text-[13.5px] md:text-sm text-[#2D3930] font-medium leading-relaxed">
              Identifies conflicting retention periods, cure periods, and conflicting dispute venues across vendor agreements.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDDCD3] shadow-card hover:border-[#CCD4CC] transition-all space-y-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#E3DEEC] text-[#5B4F73] flex items-center justify-center">
              <Database className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-base md:text-[17px] font-bold text-[#101A13]">Semantic Search</h3>
            <p className="text-[13.5px] md:text-sm text-[#2D3930] font-medium leading-relaxed">
              Vector indexing with ChromaDB enables grounded natural language questions with source clause citations.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDDCD3] shadow-card hover:border-[#CCD4CC] transition-all space-y-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#E2ECE3] text-[#2F5236] flex items-center justify-center">
              <Shield className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-base md:text-[17px] font-bold text-[#101A13]">Risk Triage</h3>
            <p className="text-[13.5px] md:text-sm text-[#2D3930] font-medium leading-relaxed">
              Every identified conflict is categorized by severity (High, Medium, Low) with actionable counsel recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Quote Banner */}
      <section className="py-12 px-6 mt-auto">
        <div className="max-w-4xl mx-auto bg-[#EAECE4] border border-[#D4D8CB] rounded-2xl p-8 md:p-10 text-center space-y-3 shadow-2xs">
          <div className="inline-flex items-center justify-center text-[#3F6149] bg-[#DEE2D7] p-2.5 rounded-2xl">
            <Leaf className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-[#16301D] tracking-tight leading-snug">
            Better contracts. Stronger partnerships.
          </h3>
          <p className="text-sm md:text-base font-semibold text-[#344638] max-w-xl mx-auto leading-relaxed">
            Empowering legal operations and corporate counsel with automated contract conflict intelligence.
          </p>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-[#E2DFD5] py-6 px-6 text-center text-xs md:text-[13px] font-semibold text-[#4F5D52]">
        <p>© 2026 ClauseGuard AI — Legal Contract Intelligence & Contradiction Detection</p>
      </footer>
    </div>
  );
};

export default LandingPage;
