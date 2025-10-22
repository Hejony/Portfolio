// FIX: Changed the React import to a default import (`React`) to align with the rest of the project. This consistency is crucial for TypeScript's declaration merging, ensuring that the global JSX augmentation for custom elements like 'model-viewer' is correctly applied.
// FIX: Resolved namespace errors by explicitly importing types (`DetailedHTMLProps`, `HTMLAttributes`, `CSSProperties`) from 'react'. This avoids ambiguity and ensures the TypeScript compiler correctly resolves these types within the `declare global` block, fixing the 'Namespace 'global.React' has no exported member' errors.
import React, { DetailedHTMLProps, HTMLAttributes, CSSProperties } from 'react';

// FIX: A critical, project-wide TypeScript configuration issue was preventing the application from rendering. Conflicting global JSX type definitions were causing standard HTML elements (like 'div') and custom elements to be unrecognized. This has been resolved by consolidating all JSX augmentations into this single, authoritative declaration block.
declare global {
  // FIX: The JSX type augmentation for 'model-viewer' was not being applied because it was targeting the outdated global `JSX` namespace. It has been updated to target the correct `React.JSX` namespace, which is used by modern React's JSX transform. This resolves the 'Property 'model-viewer' does not exist on type 'JSX.IntrinsicElements'' error.
  namespace React.JSX {
    // FIX: Corrected the JSX type augmentation for the 'model-viewer' custom element. The `extends React.JSX.IntrinsicElements` clause was removed because it was incorrectly creating a new interface definition that shadowed the global one, rather than augmenting it. This change relies on TypeScript's standard declaration merging to correctly add 'model-viewer' to the global `JSX.IntrinsicElements`, resolving the error without affecting standard HTML elements.
    // FIX: The type definition for 'model-viewer' was refactored to use the standard and more robust pattern of intersecting custom props with `React.DetailedHTMLProps`. The previous method, which embedded the custom props within the generic arguments, was not being correctly resolved by TypeScript's JSX parser, leading to the 'property does not exist' error. This change resolves the error.
    interface IntrinsicElements {
      // FIX: Replaced `React.DetailedHTMLProps` and `React.HTMLAttributes` with their directly imported counterparts to resolve namespace errors. This addresses the "'global.React' has no exported member 'DetailedHTMLProps'" and "'global.React' has no exported member 'HTMLAttributes'" errors.
      'model-viewer': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src: string;
        alt: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'shadow-intensity'?: string;
        'environment-image'?: string;
        loading?: 'auto' | 'lazy' | 'eager';
        // FIX: Replaced `React.CSSProperties` with the directly imported `CSSProperties` type to resolve the "'global.React' has no exported member 'CSSProperties'" error.
        style?: CSSProperties & { '--poster-color'?: string; };
      };
    }
  }
}

export interface Skill {
  category: string;
  tools: { name: string; icon: React.ComponentType<{}>; description: string; }[];
}

export interface InfoItem {
  period?: string;
  date?: string;
  title: string;
  description?: string;
  details?: string;
}

export interface BrandIdentityComponent {
  title: string;
  description: string;
  image: string;
}

export interface ProductSlide {
  title: string;
  description: string;
  image: string;
}

export interface ProductCarouselData {
  introTitle: string;
  slides: ProductSlide[];
}

export interface ProjectDetail {
  title: string;
  subtitle?: string;
  description: string | BrandIdentityComponent[] | ProductCarouselData;
  image: string;
  videoUrl?: string;
  modelUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  overview: string;
  thumbnail: string;
  details: ProjectDetail[];
  tags: string[];
  type: '개인' | '그룹';
  role: string;
  challengesAndSolutions?: {
    challenge: string;
    solution: string;
  };
}

export interface PortfolioData {
  hero: {
    title: string;
    subtitle: string;
    background?: string;
  };
  about: {
    name: string;
    dob: string;
    introduction: string[];
    profileImage: string;
    skills: Skill[];
    certifications: InfoItem[];
    experience: InfoItem[];
    awards: InfoItem[];
  };
  projects: Project[];
  footer: {
    background?: string;
  };
}