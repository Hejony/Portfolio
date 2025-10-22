// FIX: Reverted `import * as React from 'react'` to the standard `import React, { ... } from 'react'`. The `* as React` form can cause issues with JSX type resolution, and this change to standard imports and hook usage (e.g., `useState` instead of `React.useState`) resolves these JSX intrinsic element errors.
import React, { useRef, useState, useEffect } from 'react';
import type { Project } from '../types';

interface ProjectSectionProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
}

const ProjectItem: React.FC<{
  project: Project;
  onSelect: () => void;
  isEven: boolean;
}> = ({ project, onSelect, isEven }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [viewProgress, setViewProgress] = useState(0);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const [isSpotlightVisible, setIsSpotlightVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setImageSrc(project.thumbnail); // Trigger image load
          observer.unobserve(entry.target); // Animate and load only once
        }
      },
      { 
        threshold: 0.3,
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [project.thumbnail]);

  useEffect(() => {
    const updateProgress = () => {
      const savedProgress = parseFloat(localStorage.getItem(`project-progress-${project.id}`) || '0');
      setViewProgress(savedProgress);
    };
    
    updateProgress(); // Initial load

    const handleProgressUpdate = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail.projectId === project.id) {
            updateProgress();
        }
    };

    window.addEventListener('updateProjectProgress', handleProgressUpdate);

    return () => {
        window.removeEventListener('updateProjectProgress', handleProgressUpdate);
    };
  }, [project.id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!thumbnailRef.current) return;
    const rect = thumbnailRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { width, height } = rect;

    const rotateX = ((y / height) - 0.5) * -12; // Creates a range of -6 to 6 degrees
    const rotateY = ((x / width) - 0.5) * 12;   // Creates a range of -6 to 6 degrees

    thumbnailRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
  };

  const handleMouseLeave = () => {
    if (!thumbnailRef.current) return;
    thumbnailRef.current.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
  };

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const spotlight = spotlightRef.current;
    if (!container || !spotlight) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    requestAnimationFrame(() => {
        spotlight.style.left = `${x}px`;
        spotlight.style.top = `${y}px`;
    });
  };

  const imageContainerOrder = isEven ? 'lg:order-last' : '';
  const textContainerAlign = isEven ? 'lg:items-start lg:text-left' : 'lg:items-end lg:text-right';

  const isComplete = viewProgress >= 99.5;
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (viewProgress / 100) * circumference;

  const ProgressIndicator = (
      <div 
          className={`relative w-8 h-8 flex-shrink-0 mt-2 transition-transform duration-300 ${isComplete ? 'animate-pulse-glow' : ''}`}
          title={isComplete ? '완료' : `진행률 ${Math.floor(viewProgress)}%`}
      >
          <svg className="w-full h-full" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r={radius} stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
              <circle
                  cx="10"
                  cy="10"
                  r={radius}
                  stroke={'white'}
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  transform="rotate(-90 10 10)"
                  style={{
                      strokeDasharray: circumference,
                      strokeDashoffset: offset,
                      transition: 'stroke-dashoffset 0.5s ease-out, stroke 0.5s ease-out'
                  }}
              />
              {isComplete && (
                  <path
                      d="M7 10.5l2 2 4-4"
                      stroke="white"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0"
                      style={{ animation: 'fadeIn 0.5s ease-out 0.5s forwards' }}
                  />
              )}
          </svg>
      </div>
  );
  
  return (
    <section 
        ref={containerRef} 
        onMouseMove={handleContainerMouseMove}
        onMouseEnter={() => setIsSpotlightVisible(true)}
        onMouseLeave={() => setIsSpotlightVisible(false)}
        className={`h-full w-full py-24 flex items-center project-section-gradient relative overflow-hidden transition-opacity duration-700 ease-out ${isVisible ? 'is-visible opacity-100' : 'opacity-0'}`}
    >
      <div
        ref={spotlightRef}
        className={`project-spotlight ${isSpotlightVisible ? 'visible' : ''}`}
      />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Column */}
          <div className={`w-full ${imageContainerOrder}`}>
            <div
              ref={thumbnailRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              data-cursor-hover="true"
              onClick={onSelect}
              className={`relative aspect-[4/5] rounded-lg overflow-hidden shadow-2xl group cursor-pointer bg-black border border-white/20 hover:border-white/40 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
              style={{ transition: 'transform 0.1s linear' }}
            >
              {imageSrc && (
                <img 
                  src={imageSrc} 
                  alt={`${project.title} thumbnail`}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setIsImageLoaded(true)}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                  <h4 className="text-2xl font-bold text-shadow font-project-title transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">{project.title}</h4>
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className={`flex flex-col justify-center h-full ${textContainerAlign}`}>
            <span className="text-reveal-mask">
                <div style={{ transitionDelay: '200ms' }} className="flex items-center gap-4">
                    {!isEven && ProgressIndicator}
                    <h2 
                      className="text-6xl font-bold tracking-tighter uppercase text-shadow font-project-title relative inline-block after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
                      data-cursor-hover="true"
                    >
                        {project.title}
                    </h2>
                    {isEven && ProgressIndicator}
                </div>
            </span>
             <span className="text-reveal-mask">
                <h3 
                    className="text-2xl text-white mt-4 mb-4"
                    style={{ transitionDelay: '275ms' }}
                >
                    {project.subtitle}
                </h3>
             </span>
            <div className="text-reveal-mask">
                <div 
                    className="mb-8 text-white/70 text-base"
                    style={{ transitionDelay: '300ms' }}
                >
                    <span>{project.type} 프로젝트</span>
                    <span className="mx-2 text-white/40">|</span>
                    <span>{project.role}</span>
                </div>
            </div>
            <div className="text-reveal-mask">
                <div 
                    className={`flex flex-wrap gap-3 mb-10 ${isEven ? 'justify-start' : 'justify-end'}`}
                    style={{ transitionDelay: '350ms' }}
                >
                    {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-semibold uppercase tracking-widest border border-white/40 rounded-full px-3 py-1 text-white/70">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className="text-reveal-mask">
              <div
                onMouseEnter={() => setIsOverviewExpanded(true)}
                onMouseLeave={() => setIsOverviewExpanded(false)}
                className="relative max-w-md mb-10 cursor-pointer group"
                data-cursor-hover="true"
                style={{ transitionDelay: '425ms' }}
              >
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOverviewExpanded ? 'max-h-96' : 'max-h-[7.5rem]'}`}>
                  <p className="text-lg text-white/80 leading-relaxed">
                    {project.overview}
                  </p>
                </div>
                <div className={`absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent pointer-events-none transition-opacity duration-300 ${isOverviewExpanded ? 'opacity-0' : 'opacity-100'}`} />
                <div className={`absolute bottom-2 right-0 text-xs font-semibold uppercase tracking-widest text-white/60 transition-opacity duration-300 group-hover:opacity-0 ${isOverviewExpanded ? 'opacity-0' : 'opacity-100'}`}>
                  Read More
                </div>
              </div>
            </div>
             <div className="text-reveal-mask">
                <div style={{ transitionDelay: '500ms' }}>
                    <button 
                        onClick={onSelect} 
                        className="project-view-button font-alexandria"
                        data-cursor-hover="true"
                    >
                        View Project
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectSection: React.FC<ProjectSectionProps> = ({ projects, onProjectSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isSnapping = useRef(false);
  const scrollEndTimeout = useRef<number | null>(null);
  const snapAnimFrame = useRef<number | null>(null);
  const visualScrollAnimFrame = useRef<number | null>(null);

  // Easing function for a more natural animation curve
  const easeOutCubic = (t: number) => --t * t * t + 1;

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track || projects.length <= 1) {
      if (container) container.style.height = 'auto';
      return;
    }

    const numProjects = projects.length;
    container.style.height = `${numProjects * 100}vh`;

    const handleVisualScroll = () => {
      if (visualScrollAnimFrame.current) cancelAnimationFrame(visualScrollAnimFrame.current);

      visualScrollAnimFrame.current = requestAnimationFrame(() => {
        const currentContainer = containerRef.current;
        const currentTrack = trackRef.current;
        if (!currentContainer || !currentTrack) return;

        const rect = currentContainer.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          const scrollableHeight = currentContainer.scrollHeight - window.innerHeight;
          const progress = Math.max(0, Math.min(1, -rect.top / scrollableHeight));
          
          const totalHorizontalScrollWidth = (numProjects - 1) * 100;
          const translateX = -progress * totalHorizontalScrollWidth;
          currentTrack.style.transform = `translateX(${translateX}vw)`;

          const panels = currentTrack.querySelectorAll('.horizontal-scroll-panel');
          const currentPosition = progress * (numProjects - 1);

          panels.forEach((panel, idx) => {
            const wrapper = panel as HTMLElement;
            const distance = Math.abs(currentPosition - idx);
            const scale = 1 - Math.min(distance, 1) * 0.1;
            const opacity = 1 - Math.min(distance, 1) * 0.5;
            wrapper.style.transform = `scale(${scale})`;
            wrapper.style.opacity = `${opacity}`;
          });
        }
      });
    };
    
    const smoothScrollTo = (targetY: number, duration: number) => {
      const startY = window.scrollY;
      const distance = targetY - startY;
      let startTime: number | null = null;
      isSnapping.current = true;

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);

        window.scrollTo(0, startY + distance * easedProgress);

        if (timeElapsed < duration) {
          snapAnimFrame.current = requestAnimationFrame(animation);
        } else {
          snapAnimFrame.current = null;
          setTimeout(() => { isSnapping.current = false; }, 50);
        }
      };

      if (snapAnimFrame.current) cancelAnimationFrame(snapAnimFrame.current);
      snapAnimFrame.current = requestAnimationFrame(animation);
    };

    const onScrollEnd = () => {
        if (isSnapping.current) return;

        const rect = container.getBoundingClientRect();
        if (rect.top > 0 || rect.bottom < window.innerHeight) return;

        const scrollableHeight = container.scrollHeight - window.innerHeight;
        if (scrollableHeight <= 0) return;

        const progress = Math.max(0, Math.min(1, -rect.top / scrollableHeight));
        const currentItemPosition = progress * (numProjects - 1);

        if (Math.abs(currentItemPosition - Math.round(currentItemPosition)) < 0.01) {
            return;
        }

        const targetIndex = Math.round(currentItemPosition);
        const targetProgress = targetIndex / (numProjects - 1);
        const targetScrollTopInContainer = targetProgress * scrollableHeight;
        const finalScrollY = container.offsetTop + targetScrollTopInContainer;

        smoothScrollTo(finalScrollY, 400);
    };

    const scrollHandler = () => {
        handleVisualScroll();
        if (scrollEndTimeout.current) clearTimeout(scrollEndTimeout.current);
        scrollEndTimeout.current = window.setTimeout(onScrollEnd, 200);
    };

    const interruptSnap = () => {
        if (isSnapping.current && snapAnimFrame.current) {
            cancelAnimationFrame(snapAnimFrame.current);
            snapAnimFrame.current = null;
            isSnapping.current = false;
        }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('wheel', interruptSnap, { passive: true });
    window.addEventListener('touchstart', interruptSnap, { passive: true });
    
    handleVisualScroll();

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('wheel', interruptSnap);
      window.removeEventListener('touchstart', interruptSnap);
      if (scrollEndTimeout.current) clearTimeout(scrollEndTimeout.current);
      if (snapAnimFrame.current) cancelAnimationFrame(snapAnimFrame.current);
      if (visualScrollAnimFrame.current) cancelAnimationFrame(visualScrollAnimFrame.current);
    };
  }, [projects]);

  if (!projects || projects.length === 0) {
    return (
        <div className="text-center py-20 text-white/70">
            No projects found for this category.
        </div>
    );
  }

  return (
    <div ref={containerRef} className="horizontal-scroll-wrapper">
      <div className="horizontal-scroll-sticky-container">
        <div 
            ref={trackRef} 
            className="horizontal-scroll-track" 
            style={{ width: `${projects.length * 100}vw` }}
        >
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className="horizontal-scroll-panel"
              style={{ willChange: 'transform, opacity' }}
            >
              <ProjectItem
                project={project}
                onSelect={() => onProjectSelect(project)}
                isEven={index % 2 === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectSection;