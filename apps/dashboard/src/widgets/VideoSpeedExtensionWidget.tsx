// src/widgets/VideoSpeedExtensionWidget.tsx
// Widget informativo para la extensión de control de velocidad de video.

import React from 'react';
import { WidgetProps } from '@/types';
import { Button, Icon } from '@mi-dashboard/ui';
import { ExternalLink, BookOpen, Chrome, Firefox, MonitorPlay } from 'lucide-react'; // MonitorPlay como icono principal

const VideoSpeedExtensionWidget: React.FC<WidgetProps> = ({ instanceConfig }) => {
  const { readmeUrl, chromeStoreUrl, firefoxStoreUrl, projectRepoUrl } = instanceConfig.settings || {};

  return (
    <div className="p-1 flex flex-col justify-start h-full space-y-3">
       {projectRepoUrl && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(projectRepoUrl, '_blank', 'noopener,noreferrer')}
          className="w-full justify-start"
        >
          <Icon as={ExternalLink} className="mr-2" size={16} />
          Repositorio del Proyecto
        </Button>
      )}
      {readmeUrl && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(readmeUrl, '_blank', 'noopener,noreferrer')}
          className="w-full justify-start"
        >
          <Icon as={BookOpen} className="mr-2" size={16} />
          Documentación (README)
        </Button>
      )}
      
      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        {chromeStoreUrl && (
          <Button
            variant="secondary" // Un poco diferente para destacar
            size="sm"
            onClick={() => window.open(chromeStoreUrl, '_blank', 'noopener,noreferrer')}
            className="flex-1"
          >
            <Icon as={Chrome} className="mr-2" size={16} /> {/* Reemplazar con el icono real si es posible */}
            Chrome Store
          </Button>
        )}
        {firefoxStoreUrl && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.open(firefoxStoreUrl, '_blank', 'noopener,noreferrer')}
            className="flex-1"
          >
            <Icon as={Firefox} className="mr-2" size={16} /> {/* Reemplazar con el icono real si es posible */}
            Firefox Add-ons
          </Button>
        )}
      </div>

      {!readmeUrl && !chromeStoreUrl && !firefoxStoreUrl && !projectRepoUrl && (
        <p className="text-sm text-center text-slate-500 dark:text-slate-400 py-4">
          Información de la extensión no configurada.
        </p>
      )}
    </div>
  );
};

export default VideoSpeedExtensionWidget;
