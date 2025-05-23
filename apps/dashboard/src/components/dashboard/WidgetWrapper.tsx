// src/components/dashboard/WidgetWrapper.tsx
// Este componente envuelve cada widget individual, proporcionando
// la estructura de tarjeta, encabezado con título y controles.

import React from 'react';
import { WidgetInstanceConfig, WidgetDefinition } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Button, Icon, cn } from '@mi-dashboard/ui';
import { Settings, X, Maximize2, Minimize2, LayoutGrid } from 'lucide-react'; // Iconos comunes

interface WidgetWrapperProps {
  instanceConfig: WidgetInstanceConfig;
  definition: WidgetDefinition;
  children: React.ReactNode;
  onRemove: (widgetId: string) => void;
  onSettings?: (widgetId: string) => void; // Callback para abrir configuraciones específicas del widget
  onMaximize?: (widgetId: string) => void; // Callback para maximizar/minimizar
  isMaximized?: boolean; // Estado para saber si el widget está maximizado
  // Podríamos añadir onEditLayout, onDuplicate, etc. en el futuro
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
  instanceConfig,
  definition,
  children,
  onRemove,
  onSettings,
  onMaximize,
  isMaximized,
}) => {
  // El título puede ser el de la instancia (personalizado) o el de la definición (por defecto).
  const title = instanceConfig.title || definition.title;
  // Icono por defecto si no se especifica en la definición.
  const WidgetIconComponent = definition.icon || LayoutGrid;

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que el click se propague a otros elementos (ej. drag)
    onRemove(instanceConfig.id);
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSettings) {
      onSettings(instanceConfig.id);
    }
  };

  const handleMaximizeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMaximize) {
      onMaximize(instanceConfig.id);
    }
  };

  // Estilos condicionales para el modo maximizado
  const wrapperClasses = cn(
    "transition-all duration-300 ease-in-out", // Clases base de Card ya están en el componente Card
    isMaximized ? "fixed inset-0 z-[100] m-0 rounded-none h-screen w-screen" : ""
  );

  const cardStyle: React.CSSProperties = isMaximized ? {} : {
    gridColumnStart: instanceConfig.x + 1,
    gridColumnEnd: instanceConfig.x + 1 + instanceConfig.w,
    gridRowStart: instanceConfig.y + 1,
    gridRowEnd: instanceConfig.y + 1 + instanceConfig.h,
  };

  return (
    <Card className={wrapperClasses} style={cardStyle} data-widget-id={instanceConfig.id} data-widget-type={definition.id}>
      <CardHeader>
        <div className="flex items-center gap-2 min-w-0"> {/* min-w-0 para truncar correctamente */}
          <Icon as={WidgetIconComponent} size={18} className="text-slate-500 dark:text-slate-400 flex-shrink-0" />
          <CardTitle className="truncate">{title}</CardTitle>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0"> {/* Reducido gap para botones más juntos */}
          {onSettings && (
            <Button variant="ghost" size="icon" onClick={handleSettingsClick} aria-label={`Configuración de ${title}`}>
              <Icon as={Settings} size={16} />
            </Button>
          )}
          {onMaximize && (
             <Button variant="ghost" size="icon" onClick={handleMaximizeClick} aria-label={isMaximized ? `Minimizar ${title}` : `Maximizar ${title}`}>
              <Icon as={isMaximized ? Minimize2 : Maximize2} size={16} />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={handleRemoveClick} aria-label={`Eliminar ${title}`} className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-500">
            <Icon as={X} size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className={cn(isMaximized ? "overflow-y-auto" : "")}>
        {/* El children es el contenido específico del widget (ClockWidget, NotesWidget, etc.) */}
        {children}
      </CardContent>
    </Card>
  );
};

export default WidgetWrapper;
