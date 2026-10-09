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
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { demoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PuzzleFeatureSection from '../components/PuzzleFeatureSection';
import ContradictionsSection from '../components/ContradictionsSection';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRunDemo = async () => {
    setMobileMenuOpen(false);
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
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#F8F6F0] flex flex-col font-sans selection:bg-[#E5C38E] selection:text-[#12110E] overflow-x-hidden">

      {/* Top Header Navigation */}
      <header className="border-b border-[#24201A] bg-[#0E0D0B]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#1A1815] border border-[#C8A97E]/40 flex items-center justify-center text-[#E5C38E] shadow-sm group-hover:border-[#E5C38E] transition-colors shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
            </div>
            <div>
              <span className="font-serif font-bold text-base sm:text-lg md:text-xl text-[#F8F6F0] tracking-normal block leading-tight">
                ClauseGuard AI
              </span>
              <span className="hidden sm:block text-[11px] md:text-xs text-[#A89E8D] font-normal leading-normal mt-0.5">
                Smarter Contracts · Safer Decisions
              </span>
            </div>
          </Link>

          {/* Desktop Center Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#BDB2A0]">
            <button 
              onClick={() => scrollToSection('capabilities')} 
              className="hover:text-[#F8F6F0] transition-colors cursor-pointer"
            >
              Capabilities
            </button>
            <button 
              onClick={() => scrollToSection('contradictions')} 
              className="hover:text-[#F8F6F0] transition-colors cursor-pointer"
            >
              Contradictions
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="hover:text-[#F8F6F0] transition-colors cursor-pointer"
            >
              How It Works
            </button>
          </nav>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-bold text-xs md:text-sm rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="hidden xs:inline-flex px-3 sm:px-4 py-1.5 sm:py-2 text-xs md:text-sm font-semibold text-[#D6CFBE] hover:text-white border border-[#3A342B] hover:border-[#6B6150] rounded-xl bg-[#161411] hover:bg-[#201D18] transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 sm:px-5 py-1.5 sm:py-2.5 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-bold text-xs md:text-sm rounded-xl transition-all shadow-sm flex items-center gap-1 sm:gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </Link>
              </>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-2 rounded-xl bg-[#161411] border border-[#2B251B] text-[#EDE5D5] hover:text-[#E5C38E] transition-colors shrink-0"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 stroke-[2]" /> : <Menu className="w-4 h-4 stroke-[2]" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer & Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#000000]/80 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Menu */}
          <aside className="fixed top-0 right-0 bottom-0 w-72 max-w-[85vw] bg-[#0E0D0B] border-l border-[#24201A] p-6 z-50 flex flex-col justify-between font-sans shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#24201A]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1A1815] border border-[#C8A97E]/40 flex items-center justify-center text-[#E5C38E]">
                    <Shield className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className="font-serif font-bold text-base text-[#F8F6F0]">ClauseGuard</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#8C806F] hover:text-[#F8F6F0] hover:bg-[#1C1914] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4 stroke-[2]" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-6 space-y-2">
                <button
                  onClick={() => scrollToSection('capabilities')}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-[#EDE5D5] hover:bg-[#1A1612] hover:text-[#E5C38E] transition-colors flex items-center justify-between"
                >
                  <span>Core Capabilities</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8C806F]" />
                </button>
                <button
                  onClick={() => scrollToSection('contradictions')}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-[#EDE5D5] hover:bg-[#1A1612] hover:text-[#E5C38E] transition-colors flex items-center justify-between"
                >
                  <span>Contradiction Detection</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8C806F]" />
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-[#EDE5D5] hover:bg-[#1A1612] hover:text-[#E5C38E] transition-colors flex items-center justify-between"
                >
                  <span>How It Works</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8C806F]" />
                </button>
                <button
                  onClick={handleRunDemo}
                  disabled={seeding}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-[#E5C38E] hover:bg-[#1A1612] transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-[#E5C38E]" />
                    <span>Try Interactive Demo</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E5C38E]" />
                </button>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-6 border-t border-[#24201A] space-y-2.5">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Go to Workspace</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center text-sm font-semibold text-[#D6CFBE] hover:text-white border border-[#3A342B] rounded-xl bg-[#161411] block transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                  </Link>
                </>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#24201A] bg-[#0E0D0B]">
        {/* Background Atmosphere Image - Positioned to show brass scales clearly between headline and document */}
        <div 
          className="absolute inset-0 bg-cover bg-[position:60%_center] md:bg-[position:56%_center] pointer-events-none opacity-90 brightness-95 contrast-105"
          style={{ backgroundImage: `url('/legal_hero_bg.jpg')` }}
        />
        {/* Soft targeted gradient to ensure left text readability without obscuring the brass balance scale */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0B0A] via-[#0C0B0A]/75 to-transparent pointer-events-none w-full md:w-1/2" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A] via-transparent to-transparent pointer-events-none h-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 md:pt-24 pb-14 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            
            {/* Left Content (Hero Copy) */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              
              <div className="inline-block">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-[#C8A97E] uppercase block">
                  AI FOR CONTRACT INTELLIGENCE
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#F8F6F0] leading-[1.18] sm:leading-[1.14] tracking-normal">
                Turn Complex<br />
                Contracts<br />
                into <span className="text-[#E5C38E] italic font-serif">Clear Insights</span>
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-[#BDB2A0] max-w-lg font-normal leading-relaxed">
                Upload legal documents, compare contracts, detect contradictions, and uncover potential risks with AI-powered analysis
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5">
                <Link
                  to={isAuthenticated ? "/upload" : "/register"}
                  className="px-6 py-3 sm:py-3.5 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-bold text-xs md:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all group w-full sm:w-auto"
                >
                  <span>Analyze a Contract</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="px-6 py-3 sm:py-3.5 bg-[#171512]/90 hover:bg-[#25211B] border border-[#3A3328] hover:border-[#6B5E49] text-[#E0D8CB] font-semibold text-xs md:text-sm rounded-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
                >
                  <span>See How It Works</span>
                </button>
              </div>

              {/* Hero Bottom 3 Micro-features */}
              <div className="pt-6 sm:pt-8 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#C8BBA7]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#1D1A15] border border-[#3A3328] flex items-center justify-center text-[#E5C38E] shrink-0">
                    <FileText className="w-3.5 h-3.5 stroke-[2]" />
                  </div>
                  <span className="font-medium text-[11px] sm:text-xs">Smart Contract Analysis</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#1D1A15] border border-[#3A3328] flex items-center justify-center text-[#E5C38E] shrink-0">
                    <GitCompare className="w-3.5 h-3.5 stroke-[2]" />
                  </div>
                  <span className="font-medium text-[11px] sm:text-xs">Contradiction Detection</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#1D1A15] border border-[#3A3328] flex items-center justify-center text-[#E5C38E] shrink-0">
                    <Shield className="w-3.5 h-3.5 stroke-[2]" />
                  </div>
                  <span className="font-medium text-[11px] sm:text-xs">Risk & Clause Insights</span>
                </div>
              </div>

            </div>

            {/* Right Visual: Compact Contract Review Parchment Document */}
            <div className="lg:col-span-5 mt-6 lg:mt-0 flex flex-col items-center lg:items-end justify-center">
              <div className="relative w-full max-w-[290px] xs:max-w-[320px] sm:max-w-[365px] transform rotate-0 sm:-rotate-3 lg:-rotate-6 lg:translate-x-6 xl:translate-x-10 hover:-rotate-1 transition-transform duration-500 ease-out">
                
                {/* Parchment Document Sheet with crisp dark border and deep drop shadow */}
                <div className="relative bg-[#EAE4D3] text-[#1B1915] rounded-2xl p-4 xs:p-5 sm:p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.95)] border-2 border-[#1E1B15] space-y-2.5 sm:space-y-3 font-sans">
                  
                  {/* Document Title Header */}
                  <div className="text-center border-b border-[#CDC5B0] pb-2">
                    <span className="font-serif tracking-[0.24em] text-[11px] sm:text-xs font-bold text-[#342D21] uppercase block">
                      CONTRACT REVIEW
                    </span>
                  </div>

                  {/* Intro document skeleton lines */}
                  <div className="space-y-1 pb-0.5">
                    <div className="h-1 bg-[#CCC4B0] rounded-full w-full"></div>
                    <div className="h-1 bg-[#CCC4B0] rounded-full w-5/6"></div>
                  </div>

                  {/* Clause 1: Payment Terms */}
                  <div className="space-y-0.5 sm:space-y-1">
                    <div className="inline-block">
                      <span className="bg-[#EED5A5] text-[#342711] px-2 py-0.5 rounded text-[10px] sm:text-[10.5px] font-bold tracking-wide">
                        1. Payment Terms
                      </span>
                    </div>
                    <p className="text-[10.5px] sm:text-[11px] text-[#3E382C] font-medium leading-relaxed">
                      Invoices payable within Net-30 days of receipt; late fees accrue at 1.5% monthly
                    </p>
                    <div className="h-1 bg-[#CCC4B0] rounded-full w-4/5"></div>
                  </div>

                  {/* Clause 2: Termination */}
                  <div className="space-y-0.5 sm:space-y-1">
                    <div className="inline-block">
                      <span className="bg-[#EED5A5] text-[#342711] px-2 py-0.5 rounded text-[10px] sm:text-[10.5px] font-bold tracking-wide">
                        2. Termination
                      </span>
                    </div>
                    <p className="text-[10.5px] sm:text-[11px] text-[#3E382C] font-medium leading-relaxed">
                      Immediate termination upon material breach with standard 30-day cure period
                    </p>
                    <div className="h-1 bg-[#CCC4B0] rounded-full w-3/4"></div>
                  </div>

                  {/* Clause 3: Confidentiality */}
                  <div className="space-y-0.5 sm:space-y-1">
                    <div className="inline-block">
                      <span className="bg-[#EED5A5] text-[#342711] px-2 py-0.5 rounded text-[10px] sm:text-[10.5px] font-bold tracking-wide">
                        3. Confidentiality
                      </span>
                    </div>
                    <p className="text-[10.5px] sm:text-[11px] text-[#3E382C] font-medium leading-relaxed">
                      Non-disclosure covenants remain enforceable for five (5) years post-termination
                    </p>
                    <div className="h-1 bg-[#CCC4B0] rounded-full w-5/6"></div>
                  </div>

                  {/* Clause 4: Liability */}
                  <div className="space-y-0.5 sm:space-y-1">
                    <div className="inline-block">
                      <span className="bg-[#EED5A5] text-[#342711] px-2 py-0.5 rounded text-[10px] sm:text-[10.5px] font-bold tracking-wide">
                        4. Liability
                      </span>
                    </div>
                    <p className="text-[10.5px] sm:text-[11px] text-[#3E382C] font-medium leading-relaxed">
                      Total aggregate liability capped at total fees remitted during previous 12 months
                    </p>
                    <div className="h-1 bg-[#CCC4B0] rounded-full w-2/3"></div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: ANIMATED INTERLOCKING PUZZLE FEATURE SECTION */}
      <div id="capabilities" className="w-full">
        <PuzzleFeatureSection />
      </div>

      {/* SECTION 3: SEE CONTRADICTIONS CLEARLY (Visual Comparison Demo with Crumpled Paper Unfolding) */}
      <ContradictionsSection />

      {/* SECTION 4: HOW IT WORKS */}
      <section id="how-it-works" className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full border-b border-[#24201A]">
        <div className="space-y-2 mb-10 sm:mb-14">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-[#C8A97E] uppercase block">
            A MORE CONSIDERED WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F8F6F0] tracking-normal leading-snug">
            How It Works
          </h2>
        </div>

        {/* 4-Step Stepper Line */}
        <div className="relative pt-2 sm:pt-6">
          {/* Subtle horizontal track */}
          <div className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-[#352F25]"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Step 01 */}
            <div className="relative space-y-2">
              <div className="w-3 h-3 rounded-full bg-[#E5C38E] ring-4 ring-[#0C0B0A] mb-3 sm:mb-4"></div>
              <span className="text-xs font-semibold text-[#8C806F] block">01</span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#F8F6F0]">Upload</h3>
              <p className="text-xs md:text-[13px] text-[#A89E8D] leading-relaxed">
                Upload your legal documents
              </p>
            </div>

            {/* Step 02 */}
            <div className="relative space-y-2">
              <div className="w-3 h-3 rounded-full bg-[#E5C38E] ring-4 ring-[#0C0B0A] mb-3 sm:mb-4"></div>
              <span className="text-xs font-semibold text-[#8C806F] block">02</span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#F8F6F0]">Analyze</h3>
              <p className="text-xs md:text-[13px] text-[#A89E8D] leading-relaxed">
                AI extracts and understands important clauses
              </p>
            </div>

            {/* Step 03 */}
            <div className="relative space-y-2">
              <div className="w-3 h-3 rounded-full bg-[#E5C38E] ring-4 ring-[#0C0B0A] mb-3 sm:mb-4"></div>
              <span className="text-xs font-semibold text-[#8C806F] block">03</span>
              <h3 className="font-serif text-lg font-bold text-[#F8F6F0]">Compare</h3>
              <p className="text-xs md:text-[13px] text-[#A89E8D] leading-relaxed">
                Compare information across documents
              </p>
            </div>

            {/* Step 04 */}
            <div className="relative space-y-2">
              <div className="w-3 h-3 rounded-full bg-[#E5C38E] ring-4 ring-[#0C0B0A] mb-3 sm:mb-4"></div>
              <span className="text-xs font-semibold text-[#8C806F] block">04</span>
              <h3 className="font-serif text-lg font-bold text-[#F8F6F0]">Discover</h3>
              <p className="text-xs md:text-[13px] text-[#A89E8D] leading-relaxed">
                Find contradictions and potential risks
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: CLARITY STARTS HERE (Bottom CTA) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 text-center max-w-4xl mx-auto w-full space-y-3 sm:space-y-4">
        <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-[#C8A97E] uppercase block">
          CLARITY STARTS HERE
        </span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-[#F8F6F0] tracking-normal leading-snug">
          Make Every Contract Clearer
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[#A89E8D] max-w-lg mx-auto leading-relaxed">
          Understand your agreements, identify contradictions, and make more informed decisions
        </p>
        <div className="pt-3 sm:pt-4">
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="px-7 sm:px-8 py-3 sm:py-3.5 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-bold text-xs sm:text-sm rounded-xl shadow-md inline-flex items-center gap-2 transition-all group"
          >
            <span>Start Analyzing</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#24201A] bg-[#0A0908] py-8 px-4 sm:px-6 text-left">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif font-bold text-sm text-[#F8F6F0]">ClauseGuard AI</h4>
            <p className="text-xs text-[#8C806F] mt-0.5">Smarter Contracts · Safer Decisions</p>
          </div>
          <p className="text-[11px] sm:text-xs text-[#61584C]">
            © 2026 ClauseGuard AI — Automated Legal Contract Intelligence & Contradiction Detection
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
