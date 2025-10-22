// FIX: Reverted `import * as React from 'react'` to the standard `import React from 'react'`. The `* as React` form can cause issues with JSX type resolution in some TypeScript configurations, leading to errors where standard HTML elements are not recognized. The standard import practice resolves these JSX intrinsic element errors.
import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Import 'types.ts' for side effects at the application root to ensure global JSX augmentations are loaded reliably for the entire app. This resolves the issue where the 'model-viewer' custom element was not recognized.
import './types';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);