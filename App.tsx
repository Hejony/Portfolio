// FIX: Reverted `import * as React from 'react'` to the standard `import React, { ... } from 'react'`. The `* as React` form can cause issues with JSX type resolution, and this change to standard imports and hook usage (e.g., `useState` instead of `React.useState`) resolves these JSX intrinsic element errors.
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import ProjectSection from './components/ProjectSection';
import ProjectGallery from './components/ProjectGallery';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import CanvasBackground from './components/CanvasBackground';
import AnimatedWrapper from './components/AnimatedWrapper';
import ProjectCarousel from './components/ProjectCarousel';
import ScrollToTopButton from './components/ScrollToTopButton';
import ParallaxWrapper from './components/ParallaxWrapper';
import { portfolioData } from './constants';
import type { Project } from './types';

// --- Gradient Spotlight Component ---
const GradientSpotlight: React.FC = () => {
    const [pos, setPos] = useState({ x: -1000, y: -1000 });
    const [isVisible, setIsVisible] = useState(false);
    const frameId = useRef<number | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (frameId.current) {
                cancelAnimationFrame(frameId.current);
            }
            frameId.current = requestAnimationFrame(() => {
                setPos({ x: e.clientX, y: e.clientY });
            });
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        document.documentElement.addEventListener('mousemove', handleMouseMove);
        document.documentElement.addEventListener('mouseenter', handleMouseEnter);
        document.documentElement.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.documentElement.removeEventListener('mousemove', handleMouseMove);
            document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
            document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
            if (frameId.current) {
                cancelAnimationFrame(frameId.current);
            }
        };
    }, []);

    return (
        <div
            className={`gradient-spotlight ${isVisible ? 'visible' : ''}`}
            style={{
                transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`,
            }}
            aria-hidden="true"
        />
    );
};
// --- End Gradient Spotlight Component ---

const App: React.FC = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [cursorType, setCursorType] = useState('default');
    const [isMounted, setIsMounted] = useState(false);
    const [activeTag, setActiveTag] = useState('All');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isGalleryClosing, setIsGalleryClosing] = useState(false);

    const dotRef = useRef<HTMLDivElement>(null);
    const outlineRef = useRef<HTMLDivElement>(null);
    const cursorAnimFrame = useRef<number | null>(null);

    useEffect(() => {
        // On initial mount, force scroll to the top of the page.
        // This prevents the browser from auto-scrolling to an anchor (e.g., #contact)
        // if it's present in the URL, ensuring the user always starts at the hero section.
        window.scrollTo(0, 0);
    }, []);

    // Effect for handling loading screen dismissal
    useEffect(() => {
        // Start fade-in of the main app content
        setIsMounted(true);
    }, []);

    // Effect to lock body scroll when project gallery (modal) is open
    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        // Cleanup function to ensure scroll is restored
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedProject]);

    // Effect to add custom-cursor class to html tag for safe cursor hiding
    useEffect(() => {
        document.documentElement.classList.add('custom-cursor');
        return () => {
            document.documentElement.classList.remove('custom-cursor');
        };
    }, []);

    // Effect for custom cursor movement and hover states (PERFORMANCE OPTIMIZED)
    useEffect(() => {
        const dot = dotRef.current;
        const outline = outlineRef.current;
        if (!dot || !outline) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (cursorAnimFrame.current) {
                cancelAnimationFrame(cursorAnimFrame.current);
            }
            cursorAnimFrame.current = requestAnimationFrame(() => {
                dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
                outline.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
            });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('[data-cursor-hover="true"], a, button')) {
                setCursorType('hover');
            } else {
                setCursorType('default');
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleMouseOver);
            if (cursorAnimFrame.current) {
                cancelAnimationFrame(cursorAnimFrame.current);
            }
        };
    }, []);

    // Effect for cursor click ripple
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            const ripple = document.createElement('div');
            ripple.className = 'cursor-ripple';
            document.body.appendChild(ripple);

            ripple.style.left = `${e.clientX}px`;
            ripple.style.top = `${e.clientY}px`;

            // Clean up the ripple element after the animation is complete
            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        };

        window.addEventListener('mousedown', handleMouseDown);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

    // Effect for smooth scrolling anchor links
    useEffect(() => {
        // This effect should only run when the main portfolio is visible
        if (selectedProject) return;

        const handleSmoothScroll = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const anchor = target.closest('a[href^="#"]');

            if (anchor) {
                const href = anchor.getAttribute('href');
                if (href && href.length > 1) {
                    event.preventDefault();
                    const elementId = href.substring(1);
                    const element = document.getElementById(elementId);
                    if (element) {
                        element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            }
        };

        document.addEventListener('click', handleSmoothScroll);
        return () => {
            document.removeEventListener('click', handleSmoothScroll);
        };
    }, [selectedProject]);

    const handleProjectSelect = useCallback((project: Project) => {
        setSelectedProject(project);
    }, []);

    const handleCloseProject = useCallback(() => {
        if (selectedProject) {
            window.dispatchEvent(new CustomEvent('updateProjectProgress', {
                detail: { projectId: selectedProject.id }
            }));
            setIsGalleryClosing(true);
        }
    }, [selectedProject]);

    const handleGalleryAnimationEnd = useCallback(() => {
        if (isGalleryClosing) {
            setSelectedProject(null);
            setIsGalleryClosing(false);
        }
    }, [isGalleryClosing]);

    const handleTagChange = useCallback((tag: string) => {
        if (tag === activeTag) return;

        setIsTransitioning(true);
        setTimeout(() => {
            setActiveTag(tag);
            setIsTransitioning(false);
        }, 300);
    }, [activeTag]);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        portfolioData.projects.forEach(p => p.tags.forEach(t => tags.add(t)));
        return ['All', ...Array.from(tags)];
    }, []);

    const filteredProjects = useMemo(() => {
        if (activeTag === 'All') {
            return portfolioData.projects;
        }
        return portfolioData.projects.filter(p => p.tags.includes(activeTag));
    }, [activeTag]);

    return (
        <>
            <CanvasBackground />
            <GradientSpotlight />

            <div className="relative z-10">
                <div
                    ref={dotRef}
                    className={`cursor-dot ${cursorType}`}
                />
                <div
                    ref={outlineRef}
                    className={`cursor-outline ${cursorType}`}
                />

                <div className={`text-white min-h-screen transition-opacity duration-700 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
                    <Header />
                    <main>
                        <Hero
                            title={portfolioData.hero.title}
                            subtitle={portfolioData.hero.subtitle}
                        />

                        <div id="about">
                            <ParallaxWrapper speed={0.1}>
                                <About data={portfolioData.about} />
                            </ParallaxWrapper>
                        </div>

                        <ParallaxWrapper speed={-0.05}>
                            <ProjectCarousel
                                projects={portfolioData.projects}
                                onProjectSelect={handleProjectSelect}
                            />
                        </ParallaxWrapper>

                        <div id="projects">
                            <div className="container mx-auto px-6 pt-32 pb-16 text-center">
                                <AnimatedWrapper>
                                    <h2 className="text-7xl font-bold tracking-widest uppercase text-shadow font-alexandria mb-12">
                                        <span className="text-reveal-mask">
                                            <span>Selected Works</span>
                                        </span>
                                    </h2>
                                </AnimatedWrapper>
                                <div className="flex justify-center flex-wrap gap-x-6 gap-y-4">
                                    {allTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => handleTagChange(tag)}
                                            className={`filter-button ${activeTag === tag ? 'active' : ''}`}
                                            data-cursor-hover="true"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className={`transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                                <ProjectSection
                                    projects={filteredProjects}
                                    onProjectSelect={handleProjectSelect}
                                />
                            </div>
                        </div>

                        <div id="contact">
                            <ParallaxWrapper speed={0.05}>
                                <Footer />
                            </ParallaxWrapper>
                        </div>
                    </main>
                    <Chatbot />
                    <ScrollToTopButton />
                </div>

                {selectedProject && (
                    <ProjectGallery
                        project={selectedProject}
                        onClose={handleCloseProject}
                        isClosing={isGalleryClosing}
                        onAnimationEnd={handleGalleryAnimationEnd}
                    />
                )}
            </div>
        </>
    );
};

export default App;