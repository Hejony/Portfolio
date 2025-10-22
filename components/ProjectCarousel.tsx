// FIX: Reverted `import * as React from 'react'` to the standard `import React, { ... } from 'react'`. The `* as React` form can cause issues with JSX type resolution, and this change to standard imports and hook usage (e.g., `useMemo` instead of `React.useMemo`) resolves these JSX intrinsic element errors.
import React, { useMemo } from 'react';
import type { Project } from '../types';
import AnimatedWrapper from './AnimatedWrapper';

interface ProjectCarouselProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projects, onProjectSelect }) => {
  const allImages = useMemo(() => {
    return projects.flatMap(project => 
      project.details.map(detail => ({
        id: `${project.id}-${detail.title}`,
        image: detail.image,
        title: project.title,
        project: project,
      }))
    );
  }, [projects]);

  const duplicatedImages = useMemo(() => [...allImages, ...allImages], [allImages]);

  const handleItemClick = (project: Project) => {
    onProjectSelect(project);
  };

  return (
    <section id="project-preview" className="py-24 bg-black overflow-hidden relative">
      <AnimatedWrapper>
        <div className="text-center mb-16 px-6">
          <h2 className="text-5xl lg:text-6xl font-bold tracking-widest uppercase text-shadow font-alexandria">
            <span className="text-reveal-mask">
              <span>Project Preview</span>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 mt-4 max-w-2xl mx-auto">
             <span className="text-reveal-mask">
                <span style={{ transitionDelay: '100ms' }}>
                    A glimpse into the creative journey and visual storytelling behind each brand.
                </span>
            </span>
          </p>
        </div>
      </AnimatedWrapper>
      <div className="carousel-container" data-cursor-hover="true">
        <div className="carousel-track">
          {duplicatedImages.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className="carousel-item group"
              onClick={() => handleItemClick(item.project)}
            >
              <img src={item.image} alt={item.title} className="carousel-image" loading="lazy" />
              <div className="carousel-overlay">
                <div>
                    <h3 className="text-xl font-bold font-project-title">{item.title}</h3>
                    <p className="text-sm uppercase tracking-widest font-alexandria mt-1">View Project</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectCarousel;