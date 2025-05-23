// src/components/layout/Footer.tsx
// Componente para el pie de página del dashboard.

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center p-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 mt-auto">
      Dashboard Personal © {new Date().getFullYear()}
      <p className="mt-1">
        Desarrollado con fines de demostración arquitectónica.
      </p>
    </footer>
  );
};

export default Footer;
