// src/widgets/SeriesTrackerWidgetPlaceholder.tsx
// Un placeholder para el futuro widget de Series Tracker.

import React from 'react';
import { WidgetProps } from '@/types'; // Asumiendo que @ es un alias para src/
import { Button, Icon } from '@mi-dashboard/ui';
import { Tv, ExternalLink } from 'lucide-react';

const SeriesTrackerWidgetPlaceholder: React.FC<WidgetProps> = ({ instanceConfig }) => {
  const handleOpenApp = () => {
    // En un escenario real, esto podría abrir una nueva pestaña a la URL de la app Series Tracker
    // o interactuar con el orquestador para mostrar la app completa.
    alert('Abriendo la aplicación Series Tracker (simulado)...');
    // window.open('URL_DE_TU_APP_SERIES_TRACKER', '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <Icon as={Tv} size={48} className="mb-4 text-blue-500 dark:text-blue-400" />
      <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">
        Series Tracker
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Aquí verás un resumen de tus series y películas.
      </p>
      <Button variant="outline" size="sm" onClick={handleOpenApp}>
        <Icon as={ExternalLink} size={16} className="mr-2" />
        Abrir App Completa
      </Button>
    </div>
  );
};

export default SeriesTrackerWidgetPlaceholder;
