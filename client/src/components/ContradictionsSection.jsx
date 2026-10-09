import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

/**
 * ContradictionsSection Component
 * Implements a realistic crumpled-paper unfolding animation for Contract A and Contract B:
 * - Starts with slightly crumpled cream-colored sheets with physical 3D perspective and soft lighting.
 * - Smoothly unfolds and flattens into rectangular contract cards.
 * - Reveals the central 'CONTRADICTION DETECTED' badge in the dedicated horizontal gap between cards.
 * - The badge NEVER overlaps the contract text.
 * - Settle cleanly into the original clean comparison UI with identical text, fonts, and colors.
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

  // Master Animation Timing Sequence:
  // 1. Initial crumpled state (0s to 500ms)
  // 2. Unfolding begins (500ms to 2400ms)
  // 3. Settle completely into original clean cards (2600ms)
  useEffect(() => {
    if (phase !== 'crumpled') return;

    const timerUnfold = setTimeout(() => {
      setPhase('unfolding');
    }, 500);

    const timerComplete = setTimeout(() => {
      setPhase('complete');
    }, 2600);

    return () => {
      clearTimeout(timerUnfold);
      clearTimeout(timerComplete);
    };
  }, [phase]);

  const handleReplay = () => {
    setPhase('crumpled');
  };

  const isCrumpled = phase === 'crumpled';
  const isUnfolding = phase === 'unfolding';
  const isComplete = phase === 'complete';

  // Card A 3D Transform and Shadow
  const getCardAStyle = () => {
    if (prefersReducedMotion || isComplete) {
      return {
        transform: 'perspective(1000px) rotate(0deg) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale(1)',
        transition: 'transform 1400ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 1400ms ease-out'
      };
    }
    if (isCrumpled) {
      return {
        transform: 'perspective(1000px) rotate(-2.4deg) rotateX(3.5deg) rotateY(-3deg) translate3d(-3px, -4px, 0) scale(0.98)',
        boxShadow: '0 24px 38px -12px rgba(0, 0, 0, 0.75), 0 8px 16px -6px rgba(0, 0, 0, 0.55)',
        transition: 'none'
      };
    }
    // unfolding
    return {
      transform: 'perspective(1000px) rotate(0deg) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale(1)',
      transition: 'transform 1400ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 1400ms ease-out'
    };
  };

  // Card B 3D Transform and Shadow
  const getCardBStyle = () => {
    if (prefersReducedMotion || isComplete) {
      return {
        transform: 'perspective(1000px) rotate(0deg) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale(1)',
        transition: 'transform 1400ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 1400ms ease-out'
      };
    }
    if (isCrumpled) {
      return {
        transform: 'perspective(1000px) rotate(2.2deg) rotateX(3deg) rotateY(3.5deg) translate3d(3px, -3px, 0) scale(0.98)',
        boxShadow: '0 24px 38px -12px rgba(0, 0, 0, 0.75), 0 8px 16px -6px rgba(0, 0, 0, 0.55)',
        transition: 'none'
      };
    }
    // unfolding
    return {
      transform: 'perspective(1000px) rotate(0deg) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale(1)',
      transition: 'transform 1400ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 1400ms ease-out'
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

      {/* 
        3-Column Grid on Desktop, Single-Column on Mobile:
        Column 1: Card A
        Column 2: Central Contradiction Badge (guaranteed dedicated space, ZERO overlap with text)
        Column 3: Card B
      */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-stretch gap-6 lg:gap-5 xl:gap-8 relative">
        
        {/* ============================================================== */}
        {/* CARD A: Service Agreement (Contract A) */}
        {/* ============================================================== */}
        <div 
          style={getCardAStyle()}
          className="relative bg-[#E5DFD0] text-[#16130F] p-5 sm:p-7 md:p-8 rounded-2xl shadow-xl border border-[#C8BFAC] flex flex-col justify-between transform-gpu transition-all"
        >
          {/* Subtle Initial Paper Lighting & Dog-Ear Fold (Fades to 0, completely gone in final state) */}
          {!isComplete && (
            <div 
              className={`absolute inset-0 pointer-events-none rounded-2xl overflow-hidden transition-opacity duration-1000 ease-out z-10 ${
                isUnfolding ? 'opacity-0' : 'opacity-100'
              }`}
              aria-hidden="true"
            >
              {/* Soft ambient light falloff (NO stripes) */}
              <div 
                className="absolute inset-0 mix-blend-multiply opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.8) 0%, rgba(0,0,0,0.12) 60%, transparent 100%)'
                }}
              />
              {/* Subtle top-right folded corner that uncurls */}
              <div 
                className="absolute top-0 right-0 w-8 h-8 transition-transform duration-700 ease-out"
                style={{
                  transform: isCrumpled ? 'scale(1)' : 'scale(0)',
                  transformOrigin: 'top right'
                }}
              >
                <div 
                  className="w-full h-full bg-[#D4CCA] shadow-sm border-b border-l border-[#BDB3A0]"
                  style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}
                />
              </div>
            </div>
          )}

          {/* Clean Original Card Content */}
          <div className="space-y-3.5">
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
        </div>

        {/* ============================================================== */}
        {/* CENTRAL BADGE: CONTRADICTION DETECTED */}
        {/* Positioned in dedicated center column/gap, ZERO overlap with text */}
        {/* ============================================================== */}
        <div className="self-center flex items-center justify-center my-2 lg:my-0 z-20 shrink-0">
          <div 
            className="transition-all duration-700 ease-out"
            style={{
              opacity: isCrumpled ? 0 : 1,
              transform: isCrumpled ? 'scale(0.8)' : 'scale(1)',
              transitionDelay: isUnfolding ? '350ms' : '0ms'
            }}
          >
            <div 
              className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#14120E] flex flex-col items-center justify-center p-2 text-center transition-all duration-700 ${
                isUnfolding 
                  ? 'border border-[#E5C38E] ring-4 ring-[#E5C38E]/50 shadow-[0_0_24px_rgba(229,195,142,0.35)]' 
                  : 'border border-[#C8A97E]/70 ring-4 ring-[#0C0B0A] shadow-2xl'
              }`}
            >
              <span className="text-[8px] sm:text-[9px] font-bold tracking-widest text-[#E5C38E] leading-tight uppercase select-none">
                CONTRADICTION<br />DETECTED
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CARD B: Revised Agreement (Contract B) */}
        {/* ============================================================== */}
        <div 
          style={getCardBStyle()}
          className="relative bg-[#E5DFD0] text-[#16130F] p-5 sm:p-7 md:p-8 rounded-2xl shadow-xl border border-[#C8BFAC] flex flex-col justify-between transform-gpu transition-all"
        >
          {/* Subtle Initial Paper Lighting & Dog-Ear Fold (Fades to 0, completely gone in final state) */}
          {!isComplete && (
            <div 
              className={`absolute inset-0 pointer-events-none rounded-2xl overflow-hidden transition-opacity duration-1000 ease-out z-10 ${
                isUnfolding ? 'opacity-0' : 'opacity-100'
              }`}
              aria-hidden="true"
            >
              {/* Soft ambient light falloff (NO stripes) */}
              <div 
                className="absolute inset-0 mix-blend-multiply opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.8) 0%, rgba(0,0,0,0.12) 60%, transparent 100%)'
                }}
              />
              {/* Subtle bottom-right folded corner that uncurls */}
              <div 
                className="absolute bottom-0 right-0 w-8 h-8 transition-transform duration-700 ease-out"
                style={{
                  transform: isCrumpled ? 'scale(1)' : 'scale(0)',
                  transformOrigin: 'bottom right'
                }}
              >
                <div 
                  className="w-full h-full bg-[#D4CCA] shadow-sm border-t border-l border-[#BDB3A0]"
                  style={{ clipPath: 'polygon(0 100%, 100% 0, 0 0)' }}
                />
              </div>
            </div>
          )}

          {/* Clean Original Card Content */}
          <div className="space-y-3.5">
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

      </div>
    </section>
  );
};

export default ContradictionsSection;
