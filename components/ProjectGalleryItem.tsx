// FIX: Reverted `import * as React from 'react'` to the standard `import React, { ... } from 'react'`. The `* as React` form can cause issues with JSX type resolution, and this change to standard imports and hook usage (e.g., `useState` instead of `React.useState`) resolves these JSX intrinsic element errors.
import React, { useRef, useState, useEffect, useContext, useMemo, forwardRef, useCallback } from 'react';
import type { ProjectDetail, BrandIdentityComponent, ProductCarouselData, ProductSlide } from '../types';
import ModelViewer from './ModelViewer';
import { GalleryScrollContext } from './ProjectGallery';
import AnimatedWrapper from './AnimatedWrapper';

// --- Video Player Icons ---
const VideoPlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.539 0 3.286L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
);
const VideoPauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 00-.75.75v12c0 .414.336.75.75.75h3a.75.75 0 00.75-.75V6a.75.75 0 00-.75-.75h-3zm7.5 0a.75.75 0 00-.75.75v12c0 .414.336.75.75.75h3a.75.75 0 00.75-.75V6a.75.75 0 00-.75-.75h-3z" clipRule="evenodd" />
    </svg>
);
const MutedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);
const UnmutedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);

const CustomVideoPlayer: React.FC<{ src: string, poster: string }> = ({ src, poster }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isControlsVisible, setIsControlsVisible] = useState(false);

    const togglePlay = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play().catch(console.error);
        } else {
            video.pause();
        }
    }, []);

    const toggleMute = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => {
            if (video.duration > 0) {
                setProgress((video.currentTime / video.duration) * 100);
            }
        };

        const setVideoDuration = () => setDuration(video.duration);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => {
            setIsPlaying(false);
            if (video) video.currentTime = 0;
            setProgress(0);
        };

        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('loadedmetadata', setVideoDuration);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        
        video.muted = isMuted;

        return () => {
            video.removeEventListener('timeupdate', updateProgress);
            video.removeEventListener('loadedmetadata', setVideoDuration);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
        };
    }, [isMuted]);

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const progressContainer = progressRef.current;
        const video = videoRef.current;
        if (!progressContainer || !video || duration === 0) return;

        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const seekRatio = Math.max(0, Math.min(1, clickX / rect.width));
        video.currentTime = seekRatio * duration;
    };

    return (
        <div 
            className="aspect-video w-full bg-black/30 rounded-lg overflow-hidden shadow-2xl relative group/player"
            onMouseEnter={() => setIsControlsVisible(true)}
            onMouseLeave={() => setIsControlsVisible(false)}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                muted={isMuted}
                playsInline
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
            />
            
            {!isPlaying && (
                <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 pointer-events-none"
                    aria-hidden="true"
                >
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                        <VideoPlayIcon />
                    </div>
                </div>
            )}

            <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                 <div className="flex items-center gap-4 text-white">
                    <button onClick={togglePlay} data-cursor-hover="true" className="p-2 -ml-2" aria-label={isPlaying ? 'Pause video' : 'Play video'}>
                        {isPlaying ? <VideoPauseIcon /> : <VideoPlayIcon />}
                    </button>

                    <div 
                        ref={progressRef} 
                        onClick={handleSeek} 
                        className="w-full h-5 flex items-center group/progress cursor-pointer"
                        role="slider"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progress}
                        aria-label="Video progress bar"
                    >
                        <div className="w-full h-1 bg-white/20 rounded-full">
                            <div 
                                className="h-full bg-white rounded-full relative" 
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity -mr-1.5" />
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={toggleMute} data-cursor-hover="true" className="p-2" aria-label={isMuted ? 'Unmute video' : 'Mute video'}>
                        {isMuted ? <MutedIcon /> : <UnmutedIcon />}
                    </button>
                </div>
            </div>
        </div>
    );
};


interface DetailSectionProps {
  detail: Partial<ProjectDetail> & { image: string }; // image is required
  isEven: boolean;
}

const DetailSection: React.FC<DetailSectionProps> = ({ detail, isEven }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const scrollContext = useContext(GalleryScrollContext);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { 
        root: scrollContext?.current,
        threshold: 0.2,
      }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => { if (currentRef) observer.unobserve(currentRef) };
  }, [scrollContext]);
  
  const textBlockClass = isEven ? 'text-left' : 'text-left lg:text-right';
  const isVimeo = detail.videoUrl?.includes('vimeo');
  const isDirectVideo = detail.videoUrl && !isVimeo;

  // Special layout for 3D models or interactive media (videos)
  if (detail.modelUrl || isVimeo || isDirectVideo) {
    const mediaContent = useMemo(() => {
        if (detail.modelUrl) {
            return <ModelViewer src={detail.modelUrl} alt={detail.title || '3D Model'} />;
        }
        if (isVimeo) {
            return (
              <div className="aspect-video w-full bg-black/30 rounded-lg overflow-hidden shadow-2xl">
                <iframe
                    src={detail.videoUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={detail.title}
                ></iframe>
              </div>
            );
        }
        if (isDirectVideo) {
            return <CustomVideoPlayer src={detail.videoUrl!} poster={detail.image} />;
        }
        return null;
    }, [detail.modelUrl, detail.videoUrl, detail.title, detail.image, isVimeo, isDirectVideo]);
    
    return (
       <section ref={ref} className="min-h-screen flex items-center py-24 px-4 md:px-8 bg-black">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className={`
              flex flex-col justify-center
              transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] 
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
              ${isEven ? 'lg:order-last' : ''}
            `}>
              <div className={`${isVisible ? 'is-visible' : ''} text-left`}>
                <span className="text-reveal-mask">
                  <h4
                    className="text-3xl font-bold mb-2 text-white tracking-wider uppercase font-alexandria"
                    style={{ transitionDelay: '200ms' }}
                  >
                    {detail.title}
                  </h4>
                </span>
                {detail.subtitle && (
                  <span className="text-reveal-mask">
                    <h5 className="text-xl font-medium mb-4 text-white/80" style={{ transitionDelay: '300ms' }}>
                      {detail.subtitle}
                    </h5>
                  </span>
                )}
                <div className="w-16 h-px bg-white/30 my-6"></div>
                {detail.description && typeof detail.description === 'string' &&
                  <span className="text-reveal-mask">
                    <p className="text-white/80 text-lg leading-relaxed whitespace-pre-wrap max-w-prose" style={{ transitionDelay: '400ms' }}>
                      {detail.description}
                    </p>
                  </span>
                }
              </div>
            </div>
            <div className={`
              transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] 
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
            `}>
              {mediaContent}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback to default full-bleed background layout for IMAGES ONLY
  const textAlignContainerClass = isEven ? 'lg:justify-start' : 'lg:justify-end text-left lg:text-right';

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden flex items-center">
      {/* Background Media */}
      <img
        src={detail.image}
        alt={detail.title || 'Project background'}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        style={{ animation: 'ken-burns-background 20s ease-in-out infinite alternate' }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Foreground Text Content */}
      <div className={`relative z-10 container mx-auto px-6 w-full flex ${textAlignContainerClass}`}>
        <div className={`
          lg:w-1/2 max-w-prose
          transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] 
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
        `}>
          <div className={`${isVisible ? 'is-visible' : ''} ${textBlockClass}`}>
            <span className="text-reveal-mask">
              <h4
                className="text-4xl font-bold mb-2 text-white tracking-wider uppercase font-alexandria"
                style={{ transitionDelay: '200ms' }}
              >
                {detail.title}
              </h4>
            </span>
            {detail.subtitle && (
              <span className="text-reveal-mask">
                <h5 className="text-2xl font-medium mb-4 text-white/80" style={{ transitionDelay: '300ms' }}>
                  {detail.subtitle}
                </h5>
              </span>
            )}
            <div className={`w-24 h-px bg-white/30 my-6 ${!isEven && 'ml-auto'}`}></div>
            {detail.description && typeof detail.description === 'string' &&
              <span className="text-reveal-mask">
                <p className="text-white/80 text-xl leading-relaxed whitespace-pre-wrap" style={{ transitionDelay: '400ms' }}>
                  {(detail.description).split(/(\*\*.*?\*\*)/g).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i} className="text-white font-bold block mt-4 mb-2">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </p>
              </span>
            }
          </div>
        </div>
      </div>
    </section>
  );
};

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

interface CarouselSlide extends ProductSlide {
  isModel?: boolean;
  modelUrl?: string;
}

const ProductDesignCarousel: React.FC<{ carouselData: ProductCarouselData, subtitle?: string, modelUrl?: string, image: string }> = ({ carouselData, subtitle, modelUrl, image }) => {
  const introSlide = carouselData.slides.length > 0 ? carouselData.slides[0] : null;
  const productSlides = carouselData.slides.length > 1 ? carouselData.slides.slice(1) : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const allCarouselSlides: CarouselSlide[] = useMemo(() => {
    const slides: CarouselSlide[] = [...productSlides];
    if (modelUrl) {
      slides.push({
        title: "3D Product View",
        description: "제품의 디자인을 360도로 자유롭게 살펴보세요.",
        image: image,
        isModel: true,
        modelUrl: modelUrl,
      });
    }
    return slides;
  }, [productSlides, modelUrl, image]);

  const handleNavClick = (newIndex: number) => {
    if (newIndex === currentIndex) return;
    setCurrentIndex(newIndex);
  };

  const handlePrev = () => handleNavClick((currentIndex - 1 + allCarouselSlides.length) % allCarouselSlides.length);
  const handleNext = () => handleNavClick((currentIndex + 1) % allCarouselSlides.length);

  const currentCarouselSlide = allCarouselSlides[currentIndex];

  return (
    <div>
      {introSlide && (
        <section className="relative min-h-screen overflow-hidden flex items-center justify-center text-center">
          <img
            src={introSlide.image}
            alt={carouselData.introTitle || 'Product Design Overview'}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            style={{ animation: 'ken-burns-background 20s ease-in-out infinite alternate' }}
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative z-10 container mx-auto px-6">
            <AnimatedWrapper>
              <span className="text-reveal-mask">
                <h4 className="text-5xl font-bold text-white tracking-wider uppercase font-alexandria text-shadow" style={{ transitionDelay: '100ms' }}>Product Design</h4>
              </span>
              {subtitle && 
                <span className="text-reveal-mask">
                  <h5 className="text-2xl font-medium mt-4 text-white/80 text-shadow" style={{ transitionDelay: '200ms' }}>{subtitle}</h5>
                </span>
              }
              <div className="w-24 h-px bg-white/30 my-6 mx-auto"></div>
              <span className="text-reveal-mask">
                <p className="text-lg text-white/80 leading-relaxed max-w-3xl mx-auto" style={{ transitionDelay: '300ms' }}>
                  {introSlide.description}
                </p>
              </span>
            </AnimatedWrapper>
          </div>
        </section>
      )}

      {allCarouselSlides.length > 0 && (
        <section className="min-h-screen flex flex-col items-center justify-center py-24 px-4 md:px-8 bg-black">
          <AnimatedWrapper className="w-full flex flex-col items-center">
            <div className="text-center mb-16 max-w-4xl mx-auto">
              <h4 className="text-5xl font-bold text-white tracking-wider uppercase font-alexandria text-shadow">Product Lineup</h4>
            </div>
            
            <div className="relative w-full max-w-6xl aspect-video rounded-lg shadow-2xl overflow-hidden group bg-black/20">
              {currentCarouselSlide && (
                <>
                  <div key={currentIndex} className="w-full h-full animate-fade-in">
                      {currentCarouselSlide.isModel ? (
                          <ModelViewer src={currentCarouselSlide.modelUrl!} alt={currentCarouselSlide.title} />
                      ) : (
                          <img src={currentCarouselSlide.image} alt={currentCarouselSlide.title} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
                      )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white pointer-events-none">
                      <div key={currentIndex} style={{ animation: 'fadeInUp 0.5s ease-out forwards' }}>
                          <h5 className="text-2xl md:text-3xl font-bold text-shadow">{currentCarouselSlide.title}</h5>
                          <p className="text-base md:text-lg text-white/80 mt-2 max-w-3xl text-shadow">{currentCarouselSlide.description}</p>
                      </div>
                  </div>
                </>
              )}
              <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0" data-cursor-hover="true" aria-label="Previous Slide">
                  <ChevronLeftIcon />
              </button>
              <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0" data-cursor-hover="true" aria-label="Next Slide">
                  <ChevronRightIcon />
              </button>
            </div>
            
            {allCarouselSlides.length > 1 && (
              <div className="flex justify-center gap-3 mt-6">
                  {allCarouselSlides.map((_, index) => (
                      <button
                          key={index}
                          onClick={() => handleNavClick(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
                          aria-label={`Go to slide ${index + 1}`}
                          data-cursor-hover="true"
                      />
                  ))}
              </div>
            )}
          </AnimatedWrapper>
        </section>
      )}
    </div>
  );
};


interface ProjectGalleryItemProps { 
  detail: ProjectDetail; 
  index: number;
}

const ProjectGalleryItem = forwardRef<HTMLDivElement, ProjectGalleryItemProps>(({ detail, index }, ref) => {
  const isBrandIdentity = Array.isArray(detail.description);
  const isProductCarousel = typeof detail.description === 'object' && !Array.isArray(detail.description) && 'slides' in detail.description;

  let content;

  if (isBrandIdentity) {
    const items = detail.description as BrandIdentityComponent[];
    content = (
      <>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-black is-visible">
          <span className="text-reveal-mask">
            <h4 className="text-5xl font-bold text-white tracking-wider uppercase font-alexandria text-shadow" style={{ transitionDelay: '100ms' }}>{detail.title}</h4>
          </span>
          {detail.subtitle && 
            <span className="text-reveal-mask">
              <h5 className="text-2xl font-medium mt-4 text-white/80 text-shadow" style={{ transitionDelay: '200ms' }}>{detail.subtitle}</h5>
            </span>
          }
        </div>
        {items.map((item, itemIndex) => (
          <DetailSection
            key={itemIndex}
            detail={{
              title: item.title,
              description: item.description,
              image: item.image,
            }}
            isEven={itemIndex % 2 === 0}
          />
        ))}
      </>
    );
  } else if (isProductCarousel) {
    const carouselData = detail.description as ProductCarouselData;
    content = (
      <ProductDesignCarousel 
          carouselData={carouselData}
          subtitle={detail.subtitle}
          modelUrl={detail.modelUrl}
          image={detail.image}
      />
    );
  } else {
    content = (
      <DetailSection
        detail={detail}
        isEven={index % 2 === 0}
      />
    );
  }

  return <div ref={ref}>{content}</div>;
});

export default ProjectGalleryItem;