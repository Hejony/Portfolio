// FIX: Resolved 'Property 'model-viewer' does not exist' error by changing the type definition import to a standard side-effect import (`import '../types'`). The previous type-only import (`import type {}`) was being stripped by the compiler and did not apply the necessary global JSX augmentations from 'types.ts'.
import '../types';
import React from 'react';

interface ModelViewerProps {
  src: string;
  alt: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ src, alt }) => {
  return (
    <div className="relative w-full h-80 md:h-96 bg-black/30 rounded-lg overflow-hidden">
      <model-viewer
        src={src}
        alt={alt}
        camera-controls
        auto-rotate
        shadow-intensity="1"
        environment-image="neutral"
        loading="lazy"
        style={{ width: '100%', height: '100%', '--poster-color': 'transparent' }}
      />
    </div>
  );
};

export default ModelViewer;
