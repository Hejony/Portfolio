// FIX: Reverted `import * as React from 'react'` to the standard `import React, { ... } from 'react'`. The `* as React` form can cause issues with JSX type resolution, and this change to standard imports and hook usage (e.g., `useRef` instead of `React.useRef`) resolves these JSX intrinsic element errors.
import React, { useRef, useEffect } from 'react';

const CanvasBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    const particleCount = 200;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      twinkleSpeed: number;
      twinkleDirection: number;
      isGlowing: boolean;
      glowProgress: number;
      glowDirection: number;
      glowSpeed: number;

      constructor() {
        this.x = Math.random() * (canvas.width || window.innerWidth);
        this.y = Math.random() * (canvas.height || window.innerHeight);
        this.size = Math.random() * 2 + 0.5;
        
        const speedMagnitude = this.size * 0.15;
        const angle = Math.random() * Math.PI * 2;
        this.speedX = Math.cos(angle) * speedMagnitude;
        this.speedY = Math.sin(angle) * speedMagnitude;

        this.opacity = Math.random() * 0.5 + 0.2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleDirection = Math.random() < 0.5 ? 1 : -1;
        
        this.isGlowing = false;
        this.glowProgress = 0;
        this.glowDirection = 1;
        this.glowSpeed = Math.random() * 0.01 + 0.005;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y > canvas.height + this.size) {
            this.y = 0 - this.size;
            this.x = Math.random() * canvas.width;
        } else if (this.y < 0 - this.size) {
            this.y = canvas.height + this.size;
            this.x = Math.random() * canvas.width;
        }
        if (this.x > canvas.width + this.size) {
            this.x = 0 - this.size;
            this.y = Math.random() * canvas.height;
        } else if (this.x < 0 - this.size) {
            this.x = canvas.width + this.size;
            this.y = Math.random() * canvas.height;
        }

        this.opacity += this.twinkleSpeed * this.twinkleDirection;
        if (this.opacity > 0.8 || this.opacity < 0.2) {
            this.twinkleDirection *= -1;
        }

        if (!this.isGlowing && Math.random() < 0.0005) {
            this.isGlowing = true;
            this.glowDirection = 1;
        }

        if (this.isGlowing) {
            this.glowProgress += this.glowSpeed * this.glowDirection;
            if (this.glowProgress >= 1) {
                this.glowProgress = 1;
                this.glowDirection = -1;
            } else if (this.glowProgress < 0) {
                this.glowProgress = 0;
                this.isGlowing = false;
            }
        }
      }

      draw() {
        if (!ctx) return;
        
        ctx.save();

        if (this.isGlowing && this.glowProgress > 0) {
            ctx.shadowBlur = this.size * 8 * this.glowProgress;
            ctx.shadowColor = `rgba(220, 225, 255, ${this.glowProgress * 0.7})`;
        }
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(200, 205, 220, ${this.opacity * 0.8})`);
        gradient.addColorStop(0.5, `rgba(200, 205, 220, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(200, 205, 220, 0)`);

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    let animationFrameId: number;
    
    const drawConnections = () => {
      const maxDistance = 120; // Max distance to draw a line
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) { // Use j = i + 1 to avoid duplicate checks
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacityValue = 1 - (distance / maxDistance);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue * 0.15})`; // Low max opacity for subtlety
            ctx.lineWidth = 0.5; // Thin lines
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the geometric connections first, so particles are on top
      drawConnections();
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      if (canvas) {
        const scrollY = window.scrollY;
        canvas.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    };

    const onScroll = () => {
      if (scrollFrameId.current) {
        cancelAnimationFrame(scrollFrameId.current);
      }
      scrollFrameId.current = requestAnimationFrame(handleScroll);
    };

    const handleResize = () => {
        resizeCanvas();
        init();
    };

    resizeCanvas();
    init();
    animate();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
      if (scrollFrameId.current) {
        cancelAnimationFrame(scrollFrameId.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -2, pointerEvents: 'none', background: 'transparent', willChange: 'transform' }} aria-hidden="true" />;
};

export default CanvasBackground;