// src/widgets/MangasTrackerWidgetPlaceholder.tsx
// Placeholder para el widget de seguimiento de mangas.

import React from 'react';
import { WidgetProps } from '@/types';
import { Button, Icon } from '@mi-dashboard/ui';
import { BookOpen as MangaIcon, ExternalLink } from 'lucide-react'; // Usando BookOpen como icono

const MangasTrackerWidgetPlaceholder: React.FC<WidgetProps> = ({ instanceConfig }) => {
  const handleOpenApp = () => {
    alert('Abriendo la aplicación Mangas Tracker (simulado)...');
    // Idealmente, esta URL vendría de la configuración o una variable de entorno
    // window.open('URL_DE_TU_APP_MANGAS_TRACKER', '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <Icon as={MangaIcon} size={48} className="mb-4 text-green-600 dark:text-green-400" />
      <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">
        Mangas Tracker
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Tu colección de mangas y progreso de lectura.
      </p>
      <Button variant="outline" size="sm" onClick={handleOpenApp}>
        <Icon as={ExternalLink} size={16} className="mr-2" />
        Abrir App Completa
      </Button>
    </div>
  );
};

export default MangasTrackerWidgetPlaceholder;
