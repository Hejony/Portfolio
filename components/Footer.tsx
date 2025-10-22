// FIX: Reverted `import * as React from 'react'` to the standard `import React from 'react'`. The `* as React` form can cause issues with JSX type resolution in some TypeScript configurations, leading to errors where standard HTML elements are not recognized. The standard import practice resolves these JSX intrinsic element errors.
import React from 'react';
import AnimatedWrapper from './AnimatedWrapper';

const Footer: React.FC = () => {
  return (
    <footer 
      className="bg-black text-center py-20 text-white min-h-[80vh] flex items-center justify-center relative z-20"
    >
      <AnimatedWrapper className="relative z-10 p-8">
        <h2 className="text-7xl font-bold mb-4 text-shadow font-alexandria">
            <span className="text-reveal-mask">
                <span style={{ transitionDelay: '100ms' }}>End Of Document</span>
            </span>
        </h2>
        <p className="text-xl text-white mb-8 max-w-md mx-auto text-shadow">
            <span className="text-reveal-mask">
                <span style={{ transitionDelay: '200ms' }}>
                    포트폴리오를 끝까지 확인해주셔서 감사합니다.
                </span>
            </span>
        </p>
        <a href="mailto:hyejeong.designer@example.com" className="inline-block bg-white/10 text-white font-bold py-3 px-8 rounded-full border border-white/30
                                                                   hover:bg-white/20 backdrop-blur-sm transition-all text-lg font-alexandria">
          CONTACT
        </a>
        <p className="mt-12 text-white/70 text-sm text-shadow">
          &copy; {new Date().getFullYear()} Hye Jeong Lee. All rights reserved.
        </p>
      </AnimatedWrapper>
    </footer>
  );
};

export default Footer;