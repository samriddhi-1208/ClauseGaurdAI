import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  GitCompare, 
  ArrowRight, 
  AlertTriangle,
  Share2,
  BookOpen,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { demoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [seeding, setSeeding] = useState(false);

  const handleRunDemo = async () => {
    if (!isAuthenticated) {
      navigate('/login?demo=true');
      return;
    }
    try {
      setSeeding(true);
      const res = await demoAPI.seed();
      if (res.data?.success) {
        navigate(`/results/${res.data.analysisId}`);
      }
    } catch (err) {
      console.error('[Demo Error]', err);
      alert('Could not start demo. Please log in first.');
    } finally {
      setSeeding(false);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#F8F6F0] flex flex-col font-sans selection:bg-[#E5C38E] selection:text-[#12110E]">

      {/* Top Header Navigation */}
      <header className="border-b border-[#24201A] bg-[#0E0D0B]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#1A1815] border border-[#C8A97E]/40 flex items-center justify-center text-[#E5C38E] shadow-sm group-hover:border-[#E5C38E] transition-colors">
              <Shield className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg md:text-xl text-[#F8F6F0] tracking-tight block leading-tight">
                ClauseGuard AI
              </span>
              <span className="hidden sm:block text-xs text-[#A89E8D] font-normal leading-normal mt-0.5">
                Smarter Contracts. Safer Decisions.
              </span>
            </div>
          </Link>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-bold text-xs md:text-sm rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-xs md:text-sm font-semibold text-[#D6CFBE] hover:text-white border border-[#3A342B] hover:border-[#6B6150] rounded-xl bg-[#161411] hover:bg-[#201D18] transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-bold text-xs md:text-sm rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#24201A] bg-[#0E0D0B]">
        {/* Background Atmosphere Image - Positioned to show brass scales clearly between headline and document */}
        <div 
          className="absolute inset-0 bg-cover bg-[position:60%_center] md:bg-[position:56%_center] pointer-events-none opacity-90 brightness-95 contrast-105"
          style={{ backgroundImage: `url('/legal_hero_bg.jpg')` }}
        />
        {/* Soft targeted gradient to ensure left text readability without obscuring the brass balance scale */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0B0A] via-[#0C0B0A]/65 to-transparent pointer-events-none w-full md:w-1/2" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A] via-transparent to-transparent pointer-events-none h-full" />

        <div className="relative max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content (Hero Copy) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-block">
                <span className="text-[11px] font-bold tracking-[0.22em] text-[#C8A97E] uppercase block">
                  AI FOR CONTRACT INTELLIGENCE
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F8F6F0] leading-[1.12] tracking-tight">
                Turn Complex<br />
                Contracts<br />
                into <span className="text-[#E5C38E] italic font-serif">Clear Insights</span>
              </h1>

              <p className="text-sm md:text-base text-[#BDB2A0] max-w-lg font-normal leading-relaxed">
                Upload legal documents, compare contracts, detect contradictions, and uncover potential risks with AI-powered analysis.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link
                  to={isAuthenticated ? "/upload" : "/register"}
                  className="px-6 py-3.5 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-bold text-xs md:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all group"
                >
                  <span>Analyze a Contract</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="px-6 py-3.5 bg-[#171512]/90 hover:bg-[#25211B] border border-[#3A3328] hover:border-[#6B5E49] text-[#E0D8CB] font-semibold text-xs md:text-sm rounded-xl transition-all flex items-center gap-2"
                >
                  <span>See How It Works</span>
                </button>
              </div>

              {/* Hero Bottom 3 Micro-features */}
              <div className="pt-8 flex flex-wrap items-center gap-6 text-xs text-[#C8BBA7]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#1D1A15] border border-[#3A3328] flex items-center justify-center text-[#E5C38E]">
                    <FileText className="w-3.5 h-3.5 stroke-[2]" />
                  </div>
                  <span className="font-medium">Smart Contract Analysis</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#1D1A15] border border-[#3A3328] flex items-center justify-center text-[#E5C38E]">
                    <GitCompare className="w-3.5 h-3.5 stroke-[2]" />
                  </div>
                  <span className="font-medium">Contradiction Detection</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#1D1A15] border border-[#3A3328] flex items-center justify-center text-[#E5C38E]">
                    <Shield className="w-3.5 h-3.5 stroke-[2]" />
                  </div>
                  <span className="font-medium">Risk & Clause Insights</span>
                </div>
              </div>

            </div>

            {/* Right Visual: Compact Contract Review Parchment Document shifted right to reveal scales */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[365px] transform -rotate-6 lg:translate-x-6 xl:translate-x-10 hover:-rotate-2 transition-transform duration-500 ease-out">
                
                {/* Parchment Document Sheet with crisp dark border and deep drop shadow */}
                <div className="relative bg-[#EAE4D3] text-[#1B1915] rounded-2xl p-5 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] border-2 border-[#1E1B15] space-y-3 font-sans">
                  
                  {/* Document Title Header */}
                  <div className="text-center border-b border-[#CDC5B0] pb-2.5">
                    <span className="font-serif tracking-[0.24em] text-xs font-bold text-[#342D21] uppercase block">
                      CONTRACT REVIEW
                    </span>
                  </div>

                  {/* Intro document skeleton lines */}
                  <div className="space-y-1 pb-0.5">
                    <div className="h-1 bg-[#CCC4B0] rounded-full w-full"></div>
                    <div className="h-1 bg-[#CCC4B0] rounded-full w-5/6"></div>
                  </div>

                  {/* Clause 1: Payment Terms */}
                  <div className="space-y-1">
                    <div className="inline-block">
                      <span className="bg-[#EED5A5] text-[#342711] px-2 py-0.5 rounded text-[10.5px] font-bold tracking-wide">
                        1. Payment Terms
                      </span>
                    </div>
                    <p className="text-[11px] text-[#3E382C] font-medium leading-relaxed">
                      Invoices payable within Net-30 days of receipt; late fees accrue at 1.5% monthly.
                    </p>
                    <div className="h-1 bg-[#CCC4B0] rounded-full w-4/5"></div>
                  </div>

                  {/* Clause 2: Termination */}
                  <div className="space-y-1">
                    <div className="inline-block">
                      <span className="bg-[#EED5A5] text-[#342711] px-2 py-0.5 rounded text-[10.5px] font-bold tracking-wide">
                        2. Termination
                      </span>
                    </div>
                    <p className="text-[11px] text-[#3E382C] font-medium leading-relaxed">
                      Immediate termination upon material breach with standard 30-day cure period.
                    </p>
                    <div className="h-1 bg-[#CCC4B0] rounded-full w-3/4"></div>
                  </div>

                  {/* Clause 3: Confidentiality */}
                  <div className="space-y-1">
                    <div className="inline-block">
                      <span className="bg-[#EED5A5] text-[#342711] px-2 py-0.5 rounded text-[10.5px] font-bold tracking-wide">
                        3. Confidentiality
                      </span>
                    </div>
                    <p className="text-[11px] text-[#3E382C] font-medium leading-relaxed">
                      Non-disclosure covenants remain enforceable for five (5) years post-termination.
                    </p>
                    <div className="h-1 bg-[#CCC4B0] rounded-full w-5/6"></div>
                  </div>

                  {/* Clause 4: Liability */}
                  <div className="space-y-1">
                    <div className="inline-block">
                      <span className="bg-[#EED5A5] text-[#342711] px-2 py-0.5 rounded text-[10.5px] font-bold tracking-wide">
                        4. Liability
                      </span>
                    </div>
                    <p className="text-[11px] text-[#3E382C] font-medium leading-relaxed">
                      Total aggregate liability capped at total fees remitted during previous 12 months.
                    </p>
                    <div className="h-1 bg-[#CCC4B0] rounded-full w-2/3"></div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: THE INTELLIGENCE BEHIND EVERY AGREEMENT */}
      <section className="py-20 md:py-24 px-6 max-w-7xl mx-auto w-full border-b border-[#24201A]">
        <div className="space-y-2 mb-12">
          <span className="text-[11px] font-bold tracking-[0.22em] text-[#C8A97E] uppercase block">
            THE INTELLIGENCE BEHIND EVERY AGREEMENT
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F8F6F0] tracking-tight">
            Everything You Need to Understand Your Contracts
          </h2>
        </div>

        {/* 4 Feature Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-6 border-t border-[#26221B]">
          
          {/* Card 1 */}
          <div className="space-y-3.5 pr-2">
            <div className="w-8 h-8 flex items-center justify-center text-[#E5C38E]">
              <FileText className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#F8F6F0]">
              Smart Contract Analysis
            </h3>
            <p className="text-xs md:text-[13px] text-[#A89E8D] leading-relaxed">
              Analyze important clauses and extract meaningful information.
            </p>
          </div>

          {/* Card 2 */}
          <div className="space-y-3.5 pr-2 border-t md:border-t-0 border-[#26221B] pt-6 md:pt-0">
            <div className="w-8 h-8 flex items-center justify-center text-[#E5C38E]">
              <BookOpen className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#F8F6F0]">
              Contradiction Detection
            </h3>
            <p className="text-xs md:text-[13px] text-[#A89E8D] leading-relaxed">
              Compare multiple contracts and identify conflicting terms.
            </p>
          </div>

          {/* Card 3 */}
          <div className="space-y-3.5 pr-2 border-t lg:border-t-0 border-[#26221B] pt-6 lg:pt-0">
            <div className="w-8 h-8 flex items-center justify-center text-[#E5C38E]">
              <AlertTriangle className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#F8F6F0]">
              Risk Identification
            </h3>
            <p className="text-xs md:text-[13px] text-[#A89E8D] leading-relaxed">
              Identify clauses that may require additional review.
            </p>
          </div>

          {/* Card 4 */}
          <div className="space-y-3.5 pr-2 border-t lg:border-t-0 border-[#26221B] pt-6 lg:pt-0">
            <div className="w-8 h-8 flex items-center justify-center text-[#E5C38E]">
              <Share2 className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#F8F6F0]">
              Cross-Document Intelligence
            </h3>
            <p className="text-xs md:text-[13px] text-[#A89E8D] leading-relaxed">
              Connect information across multiple legal documents.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 3: SEE CONTRADICTIONS CLEARLY (Visual Comparison Demo) */}
      <section className="py-20 md:py-24 px-6 max-w-7xl mx-auto w-full border-b border-[#24201A]">
        <div className="space-y-2 mb-12">
          <span className="text-[11px] font-bold tracking-[0.22em] text-[#C8A97E] uppercase block">
            A CLEARER VIEW OF EVERY DETAIL
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F8F6F0] tracking-tight">
            See Contradictions Clearly
          </h2>
        </div>

        {/* Side-by-Side Interactive Comparison Cards */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Card A: Service Agreement */}
          <div className="bg-[#EFECE4] text-[#1A1815] p-7 md:p-8 rounded-2xl shadow-xl border border-[#D5CFBE] space-y-4">
            <span className="text-[11px] font-bold tracking-widest text-[#736A5B] uppercase block">
              CONTRACT A
            </span>
            <h3 className="font-serif text-xl font-bold text-[#14120E]">
              Service Agreement
            </h3>
            <p className="text-sm md:text-base text-[#2E281F] leading-relaxed font-serif">
              Payment: <span className="bg-[#EED5A5] px-2 py-0.5 rounded text-[#2E2413] font-sans font-bold">$50,000</span> payable within <span className="bg-[#EED5A5] px-2 py-0.5 rounded text-[#2E2413] font-sans font-bold">30 days</span>.
            </p>
            <div className="space-y-2 pt-2">
              <div className="h-1.5 bg-[#D8D2C0] rounded-full w-full"></div>
              <div className="h-1.5 bg-[#D8D2C0] rounded-full w-4/5"></div>
              <div className="h-1.5 bg-[#D8D2C0] rounded-full w-2/3"></div>
            </div>
          </div>

          {/* Central Floating Badge: CONTRADICTION DETECTED */}
          <div className="lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 flex justify-center z-20 my-2 lg:my-0">
            <div className="w-24 h-24 rounded-full bg-[#161411] border-2 border-[#3D3528] flex flex-col items-center justify-center p-2 text-center shadow-2xl ring-4 ring-[#0C0B0A]">
              <span className="text-[9px] font-bold tracking-widest text-[#E5C38E] leading-tight uppercase">
                CONTRADICTION<br />DETECTED
              </span>
            </div>
          </div>

          {/* Card B: Revised Agreement */}
          <div className="bg-[#EFECE4] text-[#1A1815] p-7 md:p-8 rounded-2xl shadow-xl border border-[#D5CFBE] space-y-4">
            <span className="text-[11px] font-bold tracking-widest text-[#736A5B] uppercase block">
              CONTRACT B
            </span>
            <h3 className="font-serif text-xl font-bold text-[#14120E]">
              Revised Agreement
            </h3>
            <p className="text-sm md:text-base text-[#2E281F] leading-relaxed font-serif">
              Payment: <span className="bg-[#EED5A5] px-2 py-0.5 rounded text-[#2E2413] font-sans font-bold">$60,000</span> payable within <span className="bg-[#EED5A5] px-2 py-0.5 rounded text-[#2E2413] font-sans font-bold">60 days</span>.
            </p>
            <div className="space-y-2 pt-2">
              <div className="h-1.5 bg-[#D8D2C0] rounded-full w-full"></div>
              <div className="h-1.5 bg-[#D8D2C0] rounded-full w-4/5"></div>
              <div className="h-1.5 bg-[#D8D2C0] rounded-full w-2/3"></div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section id="how-it-works" className="py-20 md:py-24 px-6 max-w-7xl mx-auto w-full border-b border-[#24201A]">
        <div className="space-y-2 mb-14">
          <span className="text-[11px] font-bold tracking-[0.22em] text-[#C8A97E] uppercase block">
            A MORE CONSIDERED WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F8F6F0] tracking-tight">
            How It Works
          </h2>
        </div>

        {/* 4-Step Stepper Line */}
        <div className="relative pt-6">
          {/* Subtle horizontal track */}
          <div className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-[#352F25]"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Step 01 */}
            <div className="relative space-y-2">
              <div className="w-3 h-3 rounded-full bg-[#E5C38E] ring-4 ring-[#0C0B0A] mb-4"></div>
              <span className="text-xs font-semibold text-[#8C806F] block">01</span>
              <h3 className="font-serif text-lg font-bold text-[#F8F6F0]">Upload</h3>
              <p className="text-xs md:text-[13px] text-[#A89E8D] leading-relaxed">
                Upload your legal documents.
              </p>
            </div>

            {/* Step 02 */}
            <div className="relative space-y-2">
              <div className="w-3 h-3 rounded-full bg-[#E5C38E] ring-4 ring-[#0C0B0A] mb-4"></div>
              <span className="text-xs font-semibold text-[#8C806F] block">02</span>
              <h3 className="font-serif text-lg font-bold text-[#F8F6F0]">Analyze</h3>
              <p className="text-xs md:text-[13px] text-[#A89E8D] leading-relaxed">
                AI extracts and understands important clauses.
              </p>
            </div>

            {/* Step 03 */}
            <div className="relative space-y-2">
              <div className="w-3 h-3 rounded-full bg-[#E5C38E] ring-4 ring-[#0C0B0A] mb-4"></div>
              <span className="text-xs font-semibold text-[#8C806F] block">03</span>
              <h3 className="font-serif text-lg font-bold text-[#F8F6F0]">Compare</h3>
              <p className="text-xs md:text-[13px] text-[#A89E8D] leading-relaxed">
                Compare information across documents.
              </p>
            </div>

            {/* Step 04 */}
            <div className="relative space-y-2">
              <div className="w-3 h-3 rounded-full bg-[#E5C38E] ring-4 ring-[#0C0B0A] mb-4"></div>
              <span className="text-xs font-semibold text-[#8C806F] block">04</span>
              <h3 className="font-serif text-lg font-bold text-[#F8F6F0]">Discover</h3>
              <p className="text-xs md:text-[13px] text-[#A89E8D] leading-relaxed">
                Find contradictions and potential risks.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: CLARITY STARTS HERE (Bottom CTA) */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto w-full space-y-4">
        <span className="text-[11px] font-bold tracking-[0.22em] text-[#C8A97E] uppercase block">
          CLARITY STARTS HERE
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F8F6F0] tracking-tight">
          Make Every Contract Clearer.
        </h2>
        <p className="text-sm md:text-base text-[#A89E8D] max-w-lg mx-auto leading-relaxed">
          Understand your agreements, identify contradictions, and make more informed decisions.
        </p>
        <div className="pt-4">
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="px-8 py-3.5 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-bold text-sm rounded-xl shadow-md inline-flex items-center gap-2 transition-all group"
          >
            <span>Start Analyzing</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#24201A] bg-[#0A0908] py-8 px-6 text-left">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif font-bold text-sm text-[#F8F6F0]">ClauseGuard AI</h4>
            <p className="text-xs text-[#8C806F] mt-0.5">Smarter Contracts. Safer Decisions.</p>
          </div>
          <p className="text-xs text-[#61584C]">
            © 2026 ClauseGuard AI — Automated Legal Contract Intelligence & Contradiction Detection
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
