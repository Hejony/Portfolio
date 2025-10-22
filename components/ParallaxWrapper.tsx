// FIX: Reverted `import * as React from 'react'` to the standard `import React, { ... } from 'react'`. The `* as React` form can cause issues with JSX type resolution, and this change to standard imports and hook usage resolves these JSX intrinsic element errors.
import React, { useRef, useEffect } from 'react';

interface ParallaxWrapperProps {
  children: React.ReactNode;
  speed?: number; // Speed factor: positive for slower, negative for faster-ish
  className?: string;
}

const ParallaxWrapper: React.FC<ParallaxWrapperProps> = ({ children, speed = 0.1, className = '' }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      animationFrameId.current = requestAnimationFrame(() => {
        const rect = wrapper.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const elementCenter = rect.top + rect.height / 2;
        
        // Calculate the difference between the viewport center and the element's center.
        // The value will be 0 when the element is perfectly centered.
        const delta = viewportCenter - elementCenter;
        
        // Apply the transform. The `speed` factor determines how much the element moves.
        const translateY = delta * speed;
        
        wrapper.style.transform = `translateY(${translateY}px)`;
      });
    };
    
    // Set initial position on load
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [speed]);

  return (
    <div ref={wrapperRef} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
};

export default ParallaxWrapper;