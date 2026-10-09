import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

/**
 * ContradictionsSection Component
 * Implements a premium crumpled-paper unfolding animation for Contract A and Contract B,
 * revealing the central 'CONTRADICTION DETECTED' badge with a champagne-gold glow,
 * then cleanly settling into the exact existing comparison UI.
 */
const ContradictionsSection = () => {
  const sectionRef = useRef(null);

  // Animation Phase States:
  // 'idle' -> 'crumpled' -> 'unfolding' -> 'complete'
  const [phase, setPhase] = useState('idle');

  // Check for prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Trigger animation when scrolled into view
  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase('complete');
      return;
    }

    if (phase !== 'idle') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && phase === 'idle') {
          setPhase('crumpled');
        }
      },
      {
        rootMargin: '0px 0px -15% 0px',
        threshold: 0.2
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [phase, prefersReducedMotion]);

  // Master Animation Timing Sequence
  // t=0: crumpled (initial physical paper state)
  // t=600ms: unfolding begins (papers flatten, rotate to 0deg, creases fade)
  // t=1600ms: contradiction badge reveals with gold glow
  // t=2800ms: settle completely into clean comparison state
  useEffect(() => {
    if (phase !== 'crumpled') return;

    const timerUnfold = setTimeout(() => {
      setPhase('unfolding');
    }, 600);

    const timerComplete = setTimeout(() => {
      setPhase('complete');
    }, 2800);

    return () => {
      clearTimeout(timerUnfold);
      clearTimeout(timerComplete);
    };
  }, [phase]);

  const handleReplay = () => {
    setPhase('crumpled');
  };

  // Determine dynamic classes based on animation phase
  const isCrumpled = phase === 'crumpled';
  const isUnfolding = phase === 'unfolding';
  const isComplete = phase === 'complete';

  // Card A Transform styling
  const getCardAStyle = () => {
    if (prefersReducedMotion || isComplete) {
      return {
        transform: 'perspective(1200px) rotate(0deg) rotateX(0deg) rotateY(0deg) translate(0px, 0px) scale(1)',
        transition: 'transform 1200ms cubic-bezier(0.25, 1, 0.35, 1), box-shadow 1200ms ease-out'
      };
    }
    if (isCrumpled) {
      return {
        transform: 'perspective(1200px) rotate(-3deg) rotateX(4deg) rotateY(-4deg) translate(-4px, -3px) scale(0.975)',
        boxShadow: '0 24px 45px -12px rgba(0, 0, 0, 0.85), 0 8px 16px -6px rgba(0, 0, 0, 0.65)'
      };
    }
    // 'unfolding' state
    return {
      transform: 'perspective(1200px) rotate(0deg) rotateX(0deg) rotateY(0deg) translate(0px, 0px) scale(1)',
      transition: 'transform 1400ms cubic-bezier(0.25, 1, 0.35, 1), box-shadow 1400ms ease-out'
    };
  };

  // Card B Transform styling
  const getCardBStyle = () => {
    if (prefersReducedMotion || isComplete) {
      return {
        transform: 'perspective(1200px) rotate(0deg) rotateX(0deg) rotateY(0deg) translate(0px, 0px) scale(1)',
        transition: 'transform 1200ms cubic-bezier(0.25, 1, 0.35, 1), box-shadow 1200ms ease-out'
      };
    }
    if (isCrumpled) {
      return {
        transform: 'perspective(1200px) rotate(2.8deg) rotateX(3.5deg) rotateY(4deg) translate(4px, -2px) scale(0.975)',
        boxShadow: '0 24px 45px -12px rgba(0, 0, 0, 0.85), 0 8px 16px -6px rgba(0, 0, 0, 0.65)'
      };
    }
    // 'unfolding' state
    return {
      transform: 'perspective(1200px) rotate(0deg) rotateX(0deg) rotateY(0deg) translate(0px, 0px) scale(1)',
      transition: 'transform 1400ms cubic-bezier(0.25, 1, 0.35, 1), box-shadow 1400ms ease-out'
    };
  };

  return (
    <section 
      id="contradictions" 
      ref={sectionRef}
      className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full border-b border-[#24201A] overflow-hidden"
    >
      {/* Section Header */}
      <div className="space-y-2 mb-8 sm:mb-12">
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-[#C8A97E] uppercase block">
            A CLEARER VIEW OF EVERY DETAIL
          </span>
          {isComplete && (
            <button
              onClick={handleReplay}
              title="Replay Paper Unfolding"
              className="p-1 rounded-md text-[#8C806F] hover:text-[#E5C38E] hover:bg-[#1D1914] transition-colors cursor-pointer"
              aria-label="Replay paper unfolding animation"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F8F6F0] tracking-normal leading-snug">
          See Contradictions Clearly
        </h2>
      </div>

      {/* Side-by-Side Comparison Cards Container with Unfolding Mechanics */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
        
        {/* ============================================================== */}
        {/* CARD A: Service Agreement (Contract A) */}
        {/* ============================================================== */}
        <div 
          style={getCardAStyle()}
          className="relative bg-[#E5DFD0] text-[#16130F] p-5 sm:p-7 md:p-8 rounded-2xl shadow-xl border border-[#C8BFAC] space-y-3.5 transform-gpu transition-all"
        >
          {/* Subtle Paper Creases & Dog-ear Corner Overlay */}
          <div 
            className={`absolute inset-0 pointer-events-none rounded-2xl overflow-hidden transition-opacity duration-1000 ease-out z-10 ${
              isComplete ? 'opacity-0' : 'opacity-85'
            }`}
            aria-hidden="true"
          >
            {/* Realistic diagonal crease lines and fold shadows */}
            <div 
              className="absolute inset-0 mix-blend-multiply opacity-30"
              style={{
                backgroundImage: 'linear-gradient(118deg, transparent 20%, rgba(0,0,0,0.18) 22%, rgba(255,255,255,0.45) 23.5%, transparent 26%, transparent 45%, rgba(0,0,0,0.2) 48%, rgba(255,255,255,0.5) 49.5%, transparent 52%, transparent 70%, rgba(0,0,0,0.14) 73%, rgba(255,255,255,0.35) 74.5%, transparent 77%)'
              }}
            />
            {/* Natural facet lighting */}
            <div 
              className="absolute inset-0 mix-blend-soft-light opacity-50"
              style={{
                backgroundImage: 'radial-gradient(ellipse at 30% 35%, rgba(255,255,255,0.7) 0%, transparent 60%), radial-gradient(ellipse at 75% 70%, rgba(0,0,0,0.2) 0%, transparent 50%)'
              }}
            />
            {/* Dog-ear folded corner at top-right */}
            <div 
              className="absolute top-0 right-0 transition-all duration-700 ease-out"
              style={{
                width: '36px',
                height: '36px',
                transform: isCrumpled ? 'scale(1)' : 'scale(0)',
                opacity: isCrumpled ? 0.95 : 0,
                transformOrigin: 'top right'
              }}
            >
              <div 
                className="w-full h-full bg-[#D6CEBC] shadow-sm border-b border-l border-[#B3A790]"
                style={{
                  clipPath: 'polygon(0 0, 100% 100%, 0 100%)'
                }}
              />
            </div>
          </div>

          {/* Existing Content */}
          <span className="text-[11px] font-bold tracking-widest text-[#6B5F4D] uppercase block">
            CONTRACT A
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#14120E]">
            Service Agreement
          </h3>
          <div className="space-y-2.5 pt-1 text-xs sm:text-sm md:text-base leading-relaxed font-serif">
            <p className="text-[#16130F]">
              <strong className="font-semibold text-[#14120E]">Payment:</strong> <span className="bg-[#DDBE84] px-2 py-0.5 rounded text-[#14120E] font-sans font-bold border border-[#C9A765]/40">$50,000</span> payable within <span className="bg-[#DDBE84] px-2 py-0.5 rounded text-[#14120E] font-sans font-bold border border-[#C9A765]/40">30 days</span>
            </p>
            <p className="text-[#16130F]">
              <strong className="font-semibold text-[#14120E]">Termination:</strong> Advance written notice of <span className="bg-[#DDBE84] px-2 py-0.5 rounded text-[#14120E] font-sans font-bold border border-[#C9A765]/40">30 days</span> required
            </p>
            <p className="text-[#16130F]">
              <strong className="font-semibold text-[#14120E]">Retention:</strong> Audit records must be retained for <span className="bg-[#DDBE84] px-2 py-0.5 rounded text-[#14120E] font-sans font-bold border border-[#C9A765]/40">5 years</span>
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CENTRAL FLOATING BADGE: CONTRADICTION DETECTED */}
        {/* Revealed smoothly with champagne-gold outline during unfolding */}
        {/* ============================================================== */}
        <div 
          className="lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 flex justify-center z-20 my-2 lg:my-0 transition-all duration-700 ease-out"
          style={{
            opacity: isCrumpled ? 0 : 1,
            transform: isCrumpled 
              ? 'scale(0.7)' 
              : 'scale(1)',
            transitionDelay: isUnfolding ? '300ms' : '0ms'
          }}
        >
          <div 
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#161411] flex flex-col items-center justify-center p-2 text-center shadow-2xl transition-all duration-700 ${
              isUnfolding 
                ? 'border-2 border-[#E5C38E] ring-4 ring-[#E5C38E]/60 shadow-[0_0_30px_rgba(229,195,142,0.4)] animate-pulse'
                : 'border-2 border-[#3D3528] ring-4 ring-[#0C0B0A]'
            }`}
          >
            <span className="text-[8px] sm:text-[9px] font-bold tracking-widest text-[#E5C38E] leading-tight uppercase select-none">
              CONTRADICTION<br />DETECTED
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CARD B: Revised Agreement (Contract B) */}
        {/* ============================================================== */}
        <div 
          style={getCardBStyle()}
          className="relative bg-[#E5DFD0] text-[#16130F] p-5 sm:p-7 md:p-8 rounded-2xl shadow-xl border border-[#C8BFAC] space-y-3.5 transform-gpu transition-all"
        >
          {/* Subtle Paper Creases & Fold Overlay */}
          <div 
            className={`absolute inset-0 pointer-events-none rounded-2xl overflow-hidden transition-opacity duration-1000 ease-out z-10 ${
              isComplete ? 'opacity-0' : 'opacity-85'
            }`}
            aria-hidden="true"
          >
            {/* Realistic diagonal crease lines and fold shadows */}
            <div 
              className="absolute inset-0 mix-blend-multiply opacity-30"
              style={{
                backgroundImage: 'linear-gradient(62deg, transparent 22%, rgba(0,0,0,0.18) 24%, rgba(255,255,255,0.45) 25.5%, transparent 28%, transparent 50%, rgba(0,0,0,0.2) 53%, rgba(255,255,255,0.5) 54.5%, transparent 57%, transparent 75%, rgba(0,0,0,0.14) 77%, rgba(255,255,255,0.35) 78.5%, transparent 81%)'
              }}
            />
            {/* Natural facet lighting */}
            <div 
              className="absolute inset-0 mix-blend-soft-light opacity-50"
              style={{
                backgroundImage: 'radial-gradient(ellipse at 70% 35%, rgba(255,255,255,0.7) 0%, transparent 60%), radial-gradient(ellipse at 25% 75%, rgba(0,0,0,0.2) 0%, transparent 50%)'
              }}
            />
            {/* Dog-ear folded corner at bottom-right */}
            <div 
              className="absolute bottom-0 right-0 transition-all duration-700 ease-out"
              style={{
                width: '36px',
                height: '36px',
                transform: isCrumpled ? 'scale(1)' : 'scale(0)',
                opacity: isCrumpled ? 0.95 : 0,
                transformOrigin: 'bottom right'
              }}
            >
              <div 
                className="w-full h-full bg-[#D6CEBC] shadow-sm border-t border-l border-[#B3A790]"
                style={{
                  clipPath: 'polygon(0 100%, 100% 0, 0 0)'
                }}
              />
            </div>
          </div>

          {/* Existing Content */}
          <span className="text-[11px] font-bold tracking-widest text-[#6B5F4D] uppercase block">
            CONTRACT B
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#14120E]">
            Revised Agreement
          </h3>
          <div className="space-y-2.5 pt-1 text-xs sm:text-sm md:text-base leading-relaxed font-serif">
            <p className="text-[#16130F]">
              <strong className="font-semibold text-[#14120E]">Payment:</strong> <span className="bg-[#DDBE84] px-2 py-0.5 rounded text-[#14120E] font-sans font-bold border border-[#C9A765]/40">$60,000</span> payable within <span className="bg-[#DDBE84] px-2 py-0.5 rounded text-[#14120E] font-sans font-bold border border-[#C9A765]/40">60 days</span>
            </p>
            <p className="text-[#16130F]">
              <strong className="font-semibold text-[#14120E]">Termination:</strong> Advance written notice of <span className="bg-[#DDBE84] px-2 py-0.5 rounded text-[#14120E] font-sans font-bold border border-[#C9A765]/40">60 days</span> required
            </p>
            <p className="text-[#16130F]">
              <strong className="font-semibold text-[#14120E]">Retention:</strong> All confidential records purged within <span className="bg-[#DDBE84] px-2 py-0.5 rounded text-[#14120E] font-sans font-bold border border-[#C9A765]/40">2 years</span>
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContradictionsSection;
