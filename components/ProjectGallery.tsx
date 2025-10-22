// FIX: Reverted `import * as React from 'react'` to the standard `import React, { ... } from 'react'`. The `* as React` form can cause issues with JSX type resolution, and this change to standard imports and hook usage (e.g., `useState` instead of `React.useState`) resolves these JSX intrinsic element errors.
import React, { useState, useRef, useEffect, useCallback, createContext } from 'react';
import type { Project } from '../types';
import ProjectGalleryItem from './ProjectGalleryItem';
import AnimatedWrapper from './AnimatedWrapper';

interface ProjectGalleryProps {
  project: Project;
  onClose: () => void;
  isClosing: boolean;
  onAnimationEnd: () => void;
}

// Create a context to provide the scrollable container ref to child components.
// This is necessary for IntersectionObservers in children to correctly use the scrolling div as their root.
export const GalleryScrollContext = createContext<React.RefObject<HTMLDivElement> | null>(null);

const PlayIcon = () => (
  <svg className="w-8 h-8 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const Icon3D = () => (
  <svg className="w-8 h-8 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ project, onClose, isClosing, onAnimationEnd }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [activeDetailIndex, setActiveDetailIndex] = useState(0);
  const detailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isScrollingProgrammatically = useRef(false);

  const handleAnimationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
    if (event.target === galleryRef.current && isClosing) {
      onAnimationEnd();
    }
  };

  useEffect(() => {
    if (!isClosing) {
      // Start header content animation after the main slide-in is underway
      const timer = setTimeout(() => {
        setIsHeaderVisible(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isClosing]);

  const scrollToDetail = useCallback((index: number) => {
    isScrollingProgrammatically.current = true;
    detailRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    // Reset the flag after scroll likely finishes
    setTimeout(() => {
        isScrollingProgrammatically.current = false;
    }, 1000); // 1s timeout should be safe for smooth scroll
  }, []);

  useEffect(() => {
    const galleryEl = galleryRef.current;
    if (!galleryEl) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    const handleScroll = () => {
      const el = galleryRef.current;
      if (!el) return;
      
      requestAnimationFrame(() => {
        if (!galleryRef.current) return;
        const scrollTop = galleryRef.current.scrollTop;
        const scrollHeight = galleryRef.current.scrollHeight - galleryRef.current.clientHeight;
        
        if (scrollHeight > 0) {
          const progress = (scrollTop / scrollHeight) * 100;
          setScrollProgress(progress);
          localStorage.setItem(`project-progress-${project.id}`, String(progress));
        } else {
          // If there's no scrollbar, it's 100% viewed.
          setScrollProgress(100);
          localStorage.setItem(`project-progress-${project.id}`, '100');
        }
      });
    };

    galleryEl.scrollTo(0, 0);
    window.addEventListener('keydown', handleEsc);
    galleryEl.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call to set state

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingProgrammatically.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = detailRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setActiveDetailIndex(index);
            }
          }
        });
      },
      {
        root: galleryEl,
        rootMargin: '-50% 0px -50% 0px', // Center of the viewport
        threshold: 0,
      }
    );

    const currentRefs = detailRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });


    return () => {
      window.removeEventListener('keydown', handleEsc);
      galleryEl.removeEventListener('scroll', handleScroll);
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [onClose, project.id]);
  
  return (
    <div 
      ref={galleryRef}
      onAnimationEnd={handleAnimationEnd}
      className={`fixed inset-0 z-[100] bg-gradient-to-b from-gray-950 via-black to-black text-white overflow-y-auto scrollbar-hide ${isClosing ? 'animate-slide-out-down' : 'animate-slide-in-up'}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} Project Details`}
    >
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[110] pointer-events-none">
        <div className="h-full bg-white transition-all duration-150 ease-linear" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Sticky Header */}
      <header className={`sticky top-0 z-50 bg-black/50 backdrop-blur-lg shadow-xl ${isHeaderVisible ? 'is-visible' : ''}`}>
          <button 
              onClick={onClose} 
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close project details and return to main page"
              data-cursor-hover="true"
          >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
          </button>
          
          <div className="container mx-auto px-6 pt-16 pb-8 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-shadow tracking-wide uppercase text-white font-project-title">
                <span className="text-reveal-mask">
                  <span style={{ transitionDelay: '0ms' }}>{project.title}</span>
                </span>
              </h2>
              <h3 className="text-xl md:text-2xl font-light mt-2 text-white text-shadow font-alexandria">
                <span className="text-reveal-mask">
                  <span style={{ transitionDelay: '100ms' }}>{project.subtitle}</span>
                </span>
              </h3>
              <div
                className="w-24 h-px bg-white/30 my-6 mx-auto transition-transform duration-700 ease-out"
                style={{
                  transform: isHeaderVisible ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'center',
                  transitionDelay: '200ms'
                }}
              />
              <p
                className="max-w-3xl mx-auto text-white/80 leading-relaxed transition-opacity duration-700 ease-out"
                style={{
                  opacity: isHeaderVisible ? 1 : 0,
                  transitionDelay: '300ms'
                }}
              >{project.overview}</p>

              <div 
                className="w-full mt-8 overflow-x-auto scrollbar-hide"
                style={{
                  opacity: isHeaderVisible ? 1 : 0,
                  transition: 'opacity 0.7s ease-out 0.4s'
                }}
              >
                <div className="flex justify-center items-center gap-4 px-6 pb-2 min-w-max">
                  {project.details.map((detail, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToDetail(index)}
                      className={`
                        relative w-28 h-20 rounded-md overflow-hidden flex-shrink-0
                        border-2 transition-all duration-300 ease-out group
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-white
                        ${activeDetailIndex === index ? 'border-white scale-110' : 'border-transparent hover:border-white/50 hover:scale-105'}
                      `}
                      aria-label={`Go to section: ${detail.title}`}
                      data-cursor-hover="true"
                    >
                      <img src={detail.image} alt={detail.title || `Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                      {(detail.videoUrl || detail.modelUrl) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          {detail.modelUrl ? <Icon3D /> : <PlayIcon />}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

          </div>
      </header>
      
      <GalleryScrollContext.Provider value={galleryRef}>
        <main className="relative z-10">
          {project.details.map((detail, index) => (
            <ProjectGalleryItem
              // FIX: Corrected the ref callback to prevent it from returning a value. The previous implementation `el => detailRefs.current[index] = el` implicitly returned the element, causing a TypeScript type error. The fix wraps the assignment in a block `{}` to ensure the callback returns `void`, aligning with React's ref callback type definition.
              ref={(el) => { detailRefs.current[index] = el; }}
              key={index} 
              detail={detail} 
              index={index} 
            />
          ))}

          {project.challengesAndSolutions && (
            <section className="py-24 px-4 md:px-8 bg-gradient-to-t from-gray-950 to-black">
              <AnimatedWrapper>
                <div className="container mx-auto text-white">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-shadow tracking-wide uppercase font-project-title">
                      Challenges & Solutions
                    </h2>
                    <div className="w-24 h-px bg-white/30 my-6 mx-auto" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Challenge Column */}
                    <div className="border-l-2 border-white/30 pl-6">
                      <h3 className="text-2xl font-semibold mb-4 font-alexandria uppercase tracking-widest text-white/70">The Challenge</h3>
                      <p className="text-lg text-white/80 leading-relaxed whitespace-pre-line">
                        {project.challengesAndSolutions.challenge}
                      </p>
                    </div>
                    {/* Solution Column */}
                    <div className="border-l-2 border-white/30 pl-6">
                      <h3 className="text-2xl font-semibold mb-4 font-alexandria uppercase tracking-widest text-white/70">The Solution</h3>
                      <p className="text-lg text-white/80 leading-relaxed whitespace-pre-line">
                        {project.challengesAndSolutions.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedWrapper>
            </section>
          )}
        </main>
      </GalleryScrollContext.Provider>
    </div>
  );
};

export default ProjectGallery;