// FIX: Reverted `import * as React from 'react'` to the standard `import React, { ... } from 'react'`. The `* as React` form can cause issues with JSX type resolution, and this change to standard imports and hook usage (e.g., `useRef` instead of `React.useRef`) resolves these JSX intrinsic element errors.
import React, { useRef, useEffect } from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollAnimFrame = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const titleElement = titleRef.current;
      if (!titleElement) return;

      if (scrollAnimFrame.current) {
        cancelAnimationFrame(scrollAnimFrame.current);
      }

      scrollAnimFrame.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        // Animate over the first 70% of the viewport scroll for a pleasing effect
        const progress = Math.min(scrollY / (viewportHeight * 0.7), 1);
        
        // Fade out slightly faster than it moves up
        const opacity = 1 - progress * 1.2;
        const translateY = -progress * 200; // Move up by 200px at full progress
        const scale = 1 - progress * 0.2; // Scale down by 20% for perspective

        titleElement.style.opacity = `${Math.max(0, opacity)}`;
        titleElement.style.transform = `translateY(${translateY}px) scale(${scale})`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Set initial state on load, in case the page is reloaded at a scrolled position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollAnimFrame.current) {
        cancelAnimationFrame(scrollAnimFrame.current);
      }
    };
  }, []);

  return (
    <div
      className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute top-0 left-0 w-full h-full z-[-1]" aria-hidden="true">
        <video
          src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Overlay to darken the video and ensure text readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Decorative Background Text */}
      <div className="absolute inset-0 flex items-center justify-center z-0" aria-hidden="true">
        <h2 className="text-[25vw] lg:text-[20vw] font-black text-white/10 blur-sm select-none font-alexandria uppercase tracking-widest">
          {title}
        </h2>
      </div>

       <div className="relative z-10 p-8 flex flex-col items-center">
        <div className="hero-glow" aria-hidden="true" />
        <h1 
          ref={titleRef}
          className="text-7xl md:text-8xl font-black italic font-bodoni tracking-normal text-white hero-title-interactive animate-ethereal-shadow"
          data-cursor-hover="true"
          style={{ willChange: 'transform, opacity' }}
        >
           {subtitle.split('').map((char, index) => (
            <span 
              key={index} 
              className="inline-block opacity-0"
              style={{
                animation: 'textReveal 1s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                animationDelay: `${index * 80}ms`,
                transitionDelay: `${index * 40}ms`
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        <div className="animate-fade-in-up" style={{ animationDelay: '800ms', animationFillMode: 'backwards' }}>
          <div className="w-24 h-px bg-white/50 my-8 mx-auto"></div>
          <p className="max-w-4xl text-xl md:text-2xl font-light text-white/90 animate-ethereal-shadow leading-relaxed">
            브랜드의 본질을 꿰뚫는 스토리텔링과 크리에이티브로<br/>사람들의 마음을 움직이는 콘텐츠를 만듭니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;