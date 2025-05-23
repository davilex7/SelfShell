// src/widgets/OcrTranslatorWidget.tsx
// Widget informativo para los proyectos de Traductor OCR.

import React from 'react';
import { WidgetProps } from '@/types';
import { Button, Icon } from '@mi-dashboard/ui';
import { ExternalLink, SearchCode, Info, Package, MonitorSmartphone } from 'lucide-react'; // Package para extensión, MonitorSmartphone para app escritorio

const OcrTranslatorWidget: React.FC<WidgetProps> = ({ instanceConfig }) => {
  const { desktopReadmeUrl, extensionReadmeUrl, statusNote } = instanceConfig.settings || {};

  return (
    <div className="p-1 flex flex-col justify-start h-full space-y-3">
      {statusNote && (
        <div className="mb-2 p-2 text-xs bg-amber-100 dark:bg-amber-800/50 text-amber-700 dark:text-amber-300 rounded-md flex items-start gap-2">
          <Icon as={Info} size={16} className="flex-shrink-0 mt-0.5" />
          <span>{statusNote}</span>
        </div>
      )}

      {desktopReadmeUrl && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(desktopReadmeUrl, '_blank', 'noopener,noreferrer')}
          className="w-full justify-start"
        >
          <Icon as={MonitorSmartphone} className="mr-2" size={16} />
          App Escritorio (README)
        </Button>
      )}

      {extensionReadmeUrl && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(extensionReadmeUrl, '_blank', 'noopener,noreferrer')}
          className="w-full justify-start"
        >
          <Icon as={Package} className="mr-2" size={16} /> {/* Icono para extensión */}
          Extensión Navegador (README)
        </Button>
      )}

      {!desktopReadmeUrl && !extensionReadmeUrl && (
        <p className="text-sm text-center text-slate-500 dark:text-slate-400 py-4">
          No hay enlaces de documentación configurados para los proyectos OCR.
        </p>
      )}
    </div>
  );
};

export default OcrTranslatorWidget;
