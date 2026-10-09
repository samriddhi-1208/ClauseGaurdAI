import React, { useState, useEffect, useRef } from 'react';
import { FileText, BookOpen, AlertTriangle, Share2, RotateCcw } from 'lucide-react';

// Mathematically authentic 720x720 organic bulb jigsaw puzzle paths
// Outer corners have rounded radius R=20.
// Naturally proportioned bulb tabs: narrow waist (30px), smoothly rounded head (52px), 48px protrusion.
// Symmetrical, continuous C1-tangent curves with zero gaps or overlaps across all shared edges.
const PUZZLE_PATHS = {
  TL: 'M 20 0 L 360 0 L 360.0 132.0 C 360.0 146.0, 364.0 165.0, 372.0 165.0 C 380.0 165.0, 383.0 154.0, 390.0 154.0 C 400.0 154.0, 408.0 166.0, 408.0 180.0 C 408.0 194.0, 400.0 206.0, 390.0 206.0 C 383.0 206.0, 380.0 195.0, 372.0 195.0 C 364.0 195.0, 360.0 214.0, 360.0 228.0 L 360 360 L 228.0 360.0 C 214.0 360.0, 195.0 364.0, 195.0 372.0 C 195.0 380.0, 206.0 383.0, 206.0 390.0 C 206.0 400.0, 194.0 408.0, 180.0 408.0 C 166.0 408.0, 154.0 400.0, 154.0 390.0 C 154.0 383.0, 165.0 380.0, 165.0 372.0 C 165.0 364.0, 146.0 360.0, 132.0 360.0 L 0 360 L 0 20 Q 0 0 20 0 Z',
  TR: 'M 360 0 L 700 0 Q 720 0 720 20 L 720 360 L 588.0 360.0 C 574.0 360.0, 555.0 356.0, 555.0 348.0 C 555.0 340.0, 566.0 337.0, 566.0 330.0 C 566.0 320.0, 554.0 312.0, 540.0 312.0 C 526.0 312.0, 514.0 320.0, 514.0 330.0 C 514.0 337.0, 525.0 340.0, 525.0 348.0 C 525.0 356.0, 506.0 360.0, 492.0 360.0 L 360 360 L 360.0 228.0 C 360.0 214.0, 364.0 195.0, 372.0 195.0 C 380.0 195.0, 383.0 206.0, 390.0 206.0 C 400.0 206.0, 408.0 194.0, 408.0 180.0 C 408.0 166.0, 400.0 154.0, 390.0 154.0 C 383.0 154.0, 380.0 165.0, 372.0 165.0 C 364.0 165.0, 360.0 146.0, 360.0 132.0 L 360 0 Z',
  BL: 'M 0 360 L 132.0 360.0 C 146.0 360.0, 165.0 364.0, 165.0 372.0 C 165.0 380.0, 154.0 383.0, 154.0 390.0 C 154.0 400.0, 166.0 408.0, 180.0 408.0 C 194.0 408.0, 206.0 400.0, 206.0 390.0 C 206.0 383.0, 195.0 380.0, 195.0 372.0 C 195.0 364.0, 214.0 360.0, 228.0 360.0 L 360 360 L 360.0 492.0 C 360.0 506.0, 356.0 525.0, 348.0 525.0 C 340.0 525.0, 337.0 514.0, 330.0 514.0 C 320.0 514.0, 312.0 526.0, 312.0 540.0 C 312.0 554.0, 320.0 566.0, 330.0 566.0 C 337.0 566.0, 340.0 555.0, 348.0 555.0 C 356.0 555.0, 360.0 574.0, 360.0 588.0 L 360 720 L 20 720 Q 0 720 0 700 L 0 360 Z',
  BR: 'M 360 360 L 492.0 360.0 C 506.0 360.0, 525.0 356.0, 525.0 348.0 C 525.0 340.0, 514.0 337.0, 514.0 330.0 C 514.0 320.0, 526.0 312.0, 540.0 312.0 C 554.0 312.0, 566.0 320.0, 566.0 330.0 C 566.0 337.0, 555.0 340.0, 555.0 348.0 C 555.0 356.0, 574.0 360.0, 588.0 360.0 L 720 360 L 720 700 Q 720 720 700 720 L 360 720 L 360.0 588.0 C 360.0 574.0, 356.0 555.0, 348.0 555.0 C 340.0 555.0, 337.0 566.0, 330.0 566.0 C 320.0 566.0, 312.0 554.0, 312.0 540.0 C 312.0 526.0, 320.0 514.0, 330.0 514.0 C 337.0 514.0, 340.0 525.0, 348.0 525.0 C 356.0 525.0, 360.0 506.0, 360.0 492.0 L 360 360 Z'
};

const HEADLINE_TEXT = 'Everything You Need to Understand Your Contracts';

const PUZZLE_ITEMS = [
  {
    id: 'tl',
    key: 'TL',
    badge: 'Capability 01',
    title: 'Smart Contract Analysis',
    desc: 'Analyze important clauses and extract meaningful information',
    Icon: FileText,
    quadrantClass: 'top-0 left-0',
    transformOrigin: '25% 25%',
    // Entry flight offset: from upper-left
    entryTransform: 'translate(-45px, -35px) rotate(-4deg)',
    delay: 0,
    gradientId: 'grad-tl',
    gradientColors: ['#24201A', '#161410']
  },
  {
    id: 'tr',
    key: 'TR',
    badge: 'Capability 02',
    title: 'Contradiction Detection',
    desc: 'Compare multiple contracts and identify conflicting terms',
    Icon: BookOpen,
    quadrantClass: 'top-0 right-0',
    transformOrigin: '75% 25%',
    // Entry flight offset: from upper-right
    entryTransform: 'translate(45px, -35px) rotate(4deg)',
    delay: 180,
    gradientId: 'grad-tr',
    gradientColors: ['#221E18', '#15130F']
  },
  {
    id: 'bl',
    key: 'BL',
    badge: 'Capability 03',
    title: 'Risk Identification',
    desc: 'Identify clauses that may require additional review',
    Icon: AlertTriangle,
    quadrantClass: 'bottom-0 left-0',
    transformOrigin: '25% 75%',
    // Entry flight offset: from lower-left
    entryTransform: 'translate(-45px, 35px) rotate(3deg)',
    delay: 360,
    gradientId: 'grad-bl',
    gradientColors: ['#201C17', '#14120E']
  },
  {
    id: 'br',
    key: 'BR',
    badge: 'Capability 04',
    title: 'Cross-Document Intelligence',
    desc: 'Connect information across multiple legal documents',
    Icon: Share2,
    quadrantClass: 'bottom-0 right-0',
    transformOrigin: '75% 75%',
    // Entry flight offset: from lower-right
    entryTransform: 'translate(45px, 35px) rotate(-3deg)',
    delay: 540,
    gradientId: 'grad-br',
    gradientColors: ['#1E1A15', '#12100D']
  }
];

const PuzzleFeatureSection = () => {
  const sectionRef = useRef(null);
  
  // Animation Phase States:
  // 'idle' -> 'typing' -> 'pausing' -> 'washingOut' -> 'assembling' -> 'complete'
  const [phase, setPhase] = useState('idle');
  const [typedChars, setTypedChars] = useState(0);
  const [activePieces, setActivePieces] = useState([false, false, false, false]);
  const [hoveredPiece, setHoveredPiece] = useState(null);
  const [snappingIdx, setSnappingIdx] = useState(null);

  // Check for prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Trigger ONLY when the user actually scrolls down to this section
  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase('complete');
      setActivePieces([true, true, true, true]);
      setTypedChars(HEADLINE_TEXT.length);
      return;
    }

    if (phase !== 'idle') return;

    const handleScrollCheck = () => {
      if (phase !== 'idle' || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const scrollY = window.scrollY || window.pageYOffset || 0;

      // Ensure user has scrolled down past the hero (scrollY > 80)
      // and Section 2 is brought into active viewing focus (rect.top <= 65% of viewport)
      if (scrollY > 80 && rect.top <= vh * 0.65 && rect.bottom >= vh * 0.15) {
        setPhase('typing');
      }
    };

    // Check on scroll
    window.addEventListener('scroll', handleScrollCheck, { passive: true });

    // Also observe with strict bottom rootMargin so it won't fire while user is at the top Hero fold
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        if (entry.isIntersecting && scrollY > 80 && phase === 'idle') {
          setPhase('typing');
        }
      },
      { 
        rootMargin: '0px 0px -30% 0px', 
        threshold: 0.15 
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      window.removeEventListener('scroll', handleScrollCheck);
      observer.disconnect();
    };
  }, [phase, prefersReducedMotion]);

  // Phase A: Typewriter Effect (Smooth, consistent 65ms cadence, zero stutter/skipping)
  useEffect(() => {
    if (phase !== 'typing') return;

    let currentIdx = 0;
    setTypedChars(0);

    const intervalId = setInterval(() => {
      currentIdx += 1;
      setTypedChars(currentIdx);

      if (currentIdx >= HEADLINE_TEXT.length) {
        clearInterval(intervalId);
        // Completed typing headline -> transition to 'pausing' phase immediately (removes caret)
        setPhase('pausing');
      }
    }, 65); // 65ms per character (within 55–75ms range)

    return () => {
      clearInterval(intervalId);
    };
  }, [phase]);

  // Phase B1: Pause briefly with complete text readable and caret removed
  useEffect(() => {
    if (phase !== 'pausing') return;

    const pauseTimer = setTimeout(() => {
      setPhase('washingOut');
    }, 750);

    return () => clearTimeout(pauseTimer);
  }, [phase]);

  // Phase B2: Cinematic Wash-out Effect (Smooth blur/fade before assembly)
  useEffect(() => {
    if (phase !== 'washingOut') return;

    const washTimer = setTimeout(() => {
      setPhase('assembling');
    }, 380);

    return () => clearTimeout(washTimer);
  }, [phase]);

  // Phase C & D: Four-piece puzzle staggered entrance & snap
  useEffect(() => {
    if (phase !== 'assembling') return;

    const timeouts = PUZZLE_ITEMS.map((item, index) => {
      return setTimeout(() => {
        setActivePieces((prev) => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
        // Brief gentle snap highlight during piece entry
        setSnappingIdx(index);
        setTimeout(() => setSnappingIdx(null), 450);
      }, item.delay);
    });

    // Mark complete after last piece snaps into place
    const completeTimer = setTimeout(() => {
      setPhase('complete');
      setSnappingIdx(null);
    }, PUZZLE_ITEMS[3].delay + 700);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, [phase]);

  // Replay animation function
  const handleReplay = () => {
    setPhase('idle');
    setTypedChars(0);
    setActivePieces([false, false, false, false]);
    setHoveredPiece(null);
    setSnappingIdx(null);
    setTimeout(() => {
      setPhase('typing');
    }, 100);
  };

  const isHeadlineWashingOut = phase === 'washingOut';
  const isHeadlineVisible = phase === 'idle' || phase === 'typing' || phase === 'pausing' || phase === 'washingOut';

  return (
    <section 
      ref={sectionRef}
      id="features-puzzle" 
      className="pt-16 sm:pt-20 md:pt-28 pb-12 sm:pb-16 md:pb-20 px-3 sm:px-6 max-w-5xl mx-auto w-full border-b border-[#24201A] relative flex flex-col justify-center items-center scroll-mt-24 sm:scroll-mt-28 overflow-hidden"
    >
      {/* Background Subtle Atmosphere Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] bg-[#E5C38E]/[0.025] blur-[120px] rounded-full pointer-events-none" 
        aria-hidden="true"
      />

      {/* Top Header Area: Eyebrow + Controls */}
      <div className={`text-center relative z-10 w-full max-w-2xl mx-auto transition-all duration-500 ${
        isHeadlineVisible ? 'space-y-2.5 sm:space-y-3.5 mb-3 sm:mb-5' : 'mb-5 sm:mb-8'
      }`}>
        <div className="flex items-center justify-center gap-2 px-2">
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.24em] text-[#C8A97E] uppercase block text-center">
            THE INTELLIGENCE BEHIND EVERY AGREEMENT
          </span>
          {phase === 'complete' && (
            <button
              onClick={handleReplay}
              title="Replay Puzzle Assembly"
              className="p-1 rounded-md text-[#8C806F] hover:text-[#E5C38E] hover:bg-[#1D1914] transition-colors cursor-pointer"
              aria-label="Replay assembly animation"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          )}
        </div>

        {/* Phase A & B: Reserved Height Typewriter Headline (Collapses smoothly when washed out) */}
        <div className={`flex items-center justify-center px-2 transition-all duration-500 overflow-hidden ${
          isHeadlineVisible 
            ? 'min-h-[72px] sm:min-h-[96px] md:min-h-[114px] lg:min-h-[128px] opacity-100 my-1' 
            : 'max-h-0 min-h-0 opacity-0 my-0 py-0'
        }`}>
          {isHeadlineVisible && (
            <h2
              className={`text-xl sm:text-3xl md:text-4xl lg:text-[42px] font-serif font-bold text-[#FAF8F5] tracking-tight leading-normal sm:leading-[1.44] md:leading-[1.48] transition-all duration-250 ease-out select-none text-center ${
                isHeadlineWashingOut 
                  ? 'opacity-0 filter blur-md scale-[1.02] text-[#E5C38E]/40' 
                  : 'opacity-100 filter blur-0 scale-100'
              }`}
            >
              <span>{HEADLINE_TEXT.slice(0, typedChars)}</span>
              {phase === 'typing' && (
                <span className="inline-block w-[3px] sm:w-[4px] h-[0.95em] ml-1.5 sm:ml-2 align-middle bg-[#E5C38E] animate-pulse rounded-full" />
              )}
            </h2>
          )}
        </div>
      </div>

      {/* Phase C & D: Four-piece Interlocking Puzzle Assembly Block */}
      <div className="relative max-w-[340px] xs:max-w-[380px] sm:max-w-[480px] md:max-w-[540px] lg:max-w-[560px] aspect-square mx-auto w-full select-none">
        
        {/* Subtle Outer Enclosure Glow & Unified Frame when Fully Assembled */}
        <div 
          className={`absolute -inset-1 sm:-inset-1.5 rounded-2xl transition-opacity duration-1000 pointer-events-none ${
            phase === 'complete' ? 'opacity-100 shadow-[0_0_35px_rgba(229,195,142,0.08)] border border-[#C8A97E]/15' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        {/* Puzzle Pieces Canvas Container */}
        <div className="relative w-full h-full">
          {PUZZLE_ITEMS.map((item, idx) => {
            const isPieceInPlace = activePieces[idx];
            const isHovered = hoveredPiece === item.id;
            const isSnapping = snappingIdx === idx;
            const isHighlighted = isHovered || isSnapping;
            const Icon = item.Icon;

            return (
              <div
                key={item.id}
                onClick={() => phase === 'complete' && setHoveredPiece(prev => prev === item.id ? null : item.id)}
                onMouseEnter={() => phase === 'complete' && setHoveredPiece(item.id)}
                onMouseLeave={() => setHoveredPiece(null)}
                className={`absolute inset-0 transition-all duration-[780ms] ${
                  isPieceInPlace 
                    ? 'opacity-100 translate-x-0 translate-y-0 rotate-0' 
                    : 'opacity-0 pointer-events-none'
                }`}
                style={{
                  transformOrigin: item.transformOrigin,
                  transform: isPieceInPlace 
                    ? (isHovered ? 'translate(0, 0) scale(1.012)' : 'translate(0, 0) scale(1)') 
                    : item.entryTransform,
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: isHovered ? 25 : (isSnapping ? 20 : 10 + idx)
                }}
              >
                {/* SVG Interlocking Puzzle Geometry */}
                <svg 
                  viewBox="0 0 720 720" 
                  className="absolute inset-0 w-full h-full overflow-visible pointer-events-none drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)]"
                >
                  <defs>
                    <linearGradient id={item.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={item.gradientColors[0]} />
                      <stop offset="60%" stopColor={item.gradientColors[0]} />
                      <stop offset="100%" stopColor={item.gradientColors[1]} />
                    </linearGradient>
                    <filter id={`piece-depth-${item.id}`} x="-15%" y="-15%" width="130%" height="130%">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.5" />
                    </filter>
                  </defs>
                  
                  {/* Complementary Tab/Socket Shape with Authentic Jigsaw Geometry */}
                  <path
                    d={PUZZLE_PATHS[item.key]}
                    fill={`url(#${item.gradientId})`}
                    stroke={isHighlighted ? '#F5D8A8' : '#3E3527'}
                    strokeWidth={isHighlighted ? 2.25 : 1.75}
                    filter={`url(#piece-depth-${item.id})`}
                    className="transition-colors duration-300"
                  />
                </svg>

                {/* HTML Quadrant Content (Naturally positioned & fully accessible) */}
                <div 
                  className={`absolute w-1/2 h-1/2 p-2.5 xs:p-3.5 sm:p-5 md:p-6 lg:p-7 flex flex-col justify-start pointer-events-auto cursor-default overflow-hidden ${item.quadrantClass}`}
                >
                  {/* Top: Capability Eyebrow & Icon */}
                  <div>
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <span className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[#D8B477] truncate pr-1">
                        {item.badge}
                      </span>
                      <div 
                        className={`w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-md sm:rounded-lg bg-[#211C16] border border-[#483C2A] flex items-center justify-center text-[#E5C38E] shrink-0 transition-all duration-300 shadow-md ${
                          isHighlighted ? 'scale-110 border-[#E5C38E] text-[#FFF0D4] bg-[#2D251D]' : ''
                        }`}
                      >
                        <Icon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 stroke-[2.2]" />
                      </div>
                    </div>

                    {/* Headline Title */}
                    <h3 className="font-serif text-[11.5px] xs:text-[13px] sm:text-base md:text-lg lg:text-[19px] font-bold text-[#FFFFFF] leading-tight sm:leading-snug tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  {/* Feature Description (High-contrast, clearly legible warm ivory) */}
                  <p className="text-[10px] xs:text-[11px] sm:text-[13px] md:text-[14px] lg:text-[14.5px] text-[#F5EFE6] leading-tight sm:leading-relaxed font-medium mt-1 sm:mt-2 line-clamp-3 sm:line-clamp-none">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PuzzleFeatureSection;
