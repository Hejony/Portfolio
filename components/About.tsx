// FIX: Reverted `import * as React from 'react'` to the standard `import React, { ... } from 'react'`. The `* as React` form can cause issues with JSX type resolution, and this change to standard imports and hook usage (e.g., `useState` instead of `React.useState`) resolves these JSX intrinsic element errors.
import React, { useState, useRef, useEffect } from 'react';
import type { PortfolioData } from '../types';
import AnimatedWrapper from './AnimatedWrapper';

// Icon for Certification section
const CertificateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622a11.99 11.99 0 00-2.598-3.75c-.48-.62-1.022-1.183-1.62-1.685A11.953 11.953 0 0112 2.75z" />
    </svg>
);

// Icon for Awards section
const AwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);

const SECTIONS = [
  { id: 'intro', title: 'INTRODUCTION' },
  { id: 'skill_experience', title: 'SKILL & EXPERIENCE' },
];

const About: React.FC<{ data: PortfolioData['about'] }> = ({ data }) => {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Trigger when the section is in the middle of the viewport
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    const refs = sectionRefs.current;
    // FIX: Changed from Object.values to Object.keys to iterate over the refs.
    // This provides stronger type safety, ensuring that each `ref` is correctly
    // identified as an HTMLDivElement, which is required by observer.observe.
    Object.keys(refs).forEach(key => {
      const ref = refs[key];
      if (ref) observer.observe(ref);
    });

    return () => {
      // FIX: Also updated the cleanup function to use Object.keys for type safety.
      // This ensures that when the component unmounts, we are unobserving valid elements.
      Object.keys(refs).forEach(key => {
        const ref = refs[key];
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  
  // Parallax effect for the profile image
  useEffect(() => {
    const handleScroll = () => {
      if (imageContainerRef.current) {
        const introSection = sectionRefs.current['intro'];
        if (introSection) {
          const rect = introSection.getBoundingClientRect();
          // Check if the section is in the viewport
          if (rect.top < window.innerHeight && rect.bottom >= 0) {
            const distance = window.innerHeight - rect.top;
            const totalDistance = window.innerHeight + rect.height;
            const percentage = Math.min(Math.max(distance / totalDistance, 0), 1);
            const parallaxY = (percentage - 0.5) * 80;

            requestAnimationFrame(() => {
                if (imageContainerRef.current) {
                    imageContainerRef.current.style.transform = `translateY(${parallaxY}px)`;
                }
            });
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="py-24 text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 lg:gap-8">
          
          {/* Left Column: Sticky Navigation */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 h-max">
             <AnimatedWrapper>
                <h2 className="text-4xl lg:text-5xl font-bold tracking-widest uppercase text-shadow mb-12 font-alexandria">
                    <span className="text-reveal-mask">
                        <span>About Me</span>
                    </span>
                </h2>
                <nav>
                    <ul className="space-y-4">
                        {SECTIONS.map(section => (
                            <li key={section.id}>
                                <a 
                                    href={`#${section.id}`}
                                    className={`
                                        text-sm font-bold tracking-widest uppercase transition-colors duration-300 font-alexandria
                                        ${activeSection === section.id ? 'text-white' : 'text-white/60 hover:text-white'}
                                    `}
                                >
                                    {section.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
             </AnimatedWrapper>
          </div>

          {/* Right Column: Scrollable Content */}
          <div className="lg:col-span-3 space-y-24">
            {/* --- INTRODUCTION SECTION --- */}
            <div id="intro" ref={el => { sectionRefs.current['intro'] = el; }}>
              <AnimatedWrapper>
                <div className="min-h-[70vh] flex items-center py-16">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                    
                    {/* Image Column */}
                    <div ref={imageContainerRef} className="lg:col-span-1 flex justify-center items-center">
                        <div className="relative w-56 h-56 sm:w-64 sm:h-64 group" data-cursor-hover="true">
                            <div className="absolute inset-[-20px] animate-spin-slow">
                               <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                    <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                                    <circle cx="100" cy="100" r="100" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="4 8" />
                                </svg>
                            </div>
                            <img 
                                src={data.profileImage}
                                alt={`${data.name} 프로필 사진`}
                                className="rounded-full w-full h-full object-cover relative z-10 transition-transform duration-300 group-hover:scale-105 shadow-2xl"
                            />
                        </div>
                    </div>

                    {/* Text Column */}
                    <div className="lg:col-span-2 text-center lg:text-left">
                      <h3 className="text-5xl font-bold mb-2 font-alexandria">
                        <span className="text-reveal-mask"><span style={{ transitionDelay: '200ms' }}>{data.name}</span></span>
                      </h3>
                      <p className="text-xl text-white/80 mb-10">
                        <span className="text-reveal-mask"><span style={{ transitionDelay: '300ms' }}>{data.dob}</span></span>
                      </p>
                      <div className="space-y-6 text-xl text-white leading-loose max-w-3xl mx-auto lg:mx-0">
                         {data.introduction.map((p, i) => (
                           <p key={i}>
                             <span className="text-reveal-mask"><span style={{ transitionDelay: `${400 + i * 100}ms` }}>{p}</span></span>
                           </p>
                         ))}
                      </div>
                    </div>

                  </div>
                </div>
              </AnimatedWrapper>
            </div>
            
            {/* --- SKILL & EXPERIENCE SECTION --- */}
            <div id="skill_experience" ref={el => { sectionRefs.current['skill_experience'] = el; }}>
                <AnimatedWrapper>
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-x-16 gap-y-24">
                    
                        {/* Experience Section */}
                        <div className="xl:col-span-3">
                            <h3 className="text-3xl font-bold tracking-widest text-white uppercase mb-12 font-alexandria">
                                <span className="text-reveal-mask"><span>Experience</span></span>
                            </h3>
                            <div className="space-y-12">
                            {data.experience.map((item, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-1">
                                    <p className="text-base text-white/70 font-mono">
                                        <span className="text-reveal-mask"><span style={{ transitionDelay: `${index * 50}ms` }}>{item.period}</span></span>
                                    </p>
                                </div>
                                <div className="md:col-span-3">
                                    <h4 className="font-bold text-2xl text-white mb-2">
                                        <span className="text-reveal-mask"><span style={{ transitionDelay: `${50 + index * 50}ms` }}>{item.title}</span></span>
                                    </h4>
                                    <p className="text-white/80 text-lg leading-relaxed">
                                        <span className="text-reveal-mask"><span style={{ transitionDelay: `${100 + index * 50}ms` }}>{item.description}</span></span>
                                    </p>
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="xl:col-span-2">
                            <h3 className="text-3xl font-bold tracking-widest text-white uppercase mb-12 font-alexandria">
                                <span className="text-reveal-mask"><span>Skills</span></span>
                            </h3>
                            <div className="space-y-16">
                            {data.skills.map((skill, index) => (
                                <div key={index}>
                                <h4 className="text-xl font-semibold mb-8 text-white">
                                    <span className="text-reveal-mask"><span style={{ transitionDelay: `${index * 100}ms` }}>{skill.category}</span></span>
                                </h4>
                                <div className="flex items-center flex-wrap gap-10">
                                    {skill.tools.map((tool, toolIndex) => {
                                    const Icon = tool.icon;
                                    return (
                                        <div key={toolIndex} className="relative flex flex-col items-center gap-4 text-white group" data-cursor-hover="true">
                                            <div className="absolute bottom-full mb-3 px-3 py-1.5 text-sm font-medium text-black bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none w-48 text-center transform -translate-x-1/2 left-1/2">
                                                {tool.description}
                                                <svg className="absolute text-white h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve">
                                                    <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                                                </svg>
                                            </div>
                                            <div className="w-20 h-20 p-3 border border-white/20 rounded-xl transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:border-white/50 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]">
                                                <Icon />
                                            </div>
                                            <span className="text-sm font-light text-white/70 font-alexandria">{tool.name}</span>
                                        </div>
                                    );
                                    })}
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>

                        {/* Certs & Awards Section */}
                        <div className="xl:col-span-5">
                            <h3 className="text-3xl font-bold tracking-widest text-white uppercase mb-12 font-alexandria">
                                <span className="text-reveal-mask"><span>Awards & Certifications</span></span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <h4 className="text-xl font-semibold text-white mb-6">
                                        <span className="text-reveal-mask"><span>Awards</span></span>
                                    </h4>
                                    <div className="space-y-8">
                                        {data.awards.map((item, index) => (
                                            <div key={index} className="relative group" data-cursor-hover="true">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0 mt-1"><AwardIcon /></div>
                                                    <div>
                                                        <p className="font-bold text-xl">
                                                            <span className="text-reveal-mask"><span style={{ transitionDelay: `${index * 50}ms` }}>{item.title}</span></span>
                                                        </p>
                                                        <p className="text-base text-white/70">
                                                            <span className="text-reveal-mask"><span style={{ transitionDelay: `${50 + index * 50}ms` }}>{item.date}</span></span>
                                                        </p>
                                                    </div>
                                                </div>
                                                {item.details && (
                                                    <div className="absolute bottom-full left-10 mb-2 w-max max-w-xs px-3 py-1.5 text-sm font-medium text-black bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                                        {item.details}
                                                        <svg className="absolute text-white h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve">
                                                            <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-white mb-6">
                                        <span className="text-reveal-mask"><span>Certifications</span></span>
                                    </h4>
                                    <div className="space-y-8">
                                        {data.certifications.map((item, index) => (
                                            <div key={index} className="flex items-start gap-4">
                                            <div className="flex-shrink-0 mt-1"><CertificateIcon /></div>
                                            <div>
                                                <p className="font-bold text-xl">
                                                    <span className="text-reveal-mask"><span style={{ transitionDelay: `${index * 50}ms` }}>{item.title}</span></span>
                                                </p>
                                                <p className="text-base text-white/70">
                                                    <span className="text-reveal-mask"><span style={{ transitionDelay: `${50 + index * 50}ms` }}>{item.description} | {item.date}</span></span>
                                                </p>
                                            </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedWrapper>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;