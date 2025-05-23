// src/components/dashboard/WidgetRenderer.tsx
// Este componente es responsable de renderizar el widget correcto
// basado en su `typeId`, obteniendo la definición del `WIDGET_REGISTRY`.

import React from 'react';
import { WidgetInstanceConfig, WidgetProps } from '@/types';
import { WIDGET_REGISTRY } from '@/widgets/registry';
import WidgetWrapper from './WidgetWrapper';
import { Icon } from '@mi-dashboard/ui';
import { AlertTriangle } from 'lucide-react';

interface WidgetRendererProps {
  instanceConfig: WidgetInstanceConfig;
  updateInstanceConfig: (id: string, newConfig: Partial<WidgetInstanceConfig>) => void;
  removeWidget: (id: string) => void;
  maximizeWidget: (widgetId: string | null) => void; // Función para manejar la maximización
  maximizedWidgetId: string | null; // ID del widget actualmente maximizado, o null
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  instanceConfig,
  updateInstanceConfig,
  removeWidget,
  maximizeWidget,
  maximizedWidgetId,
}) => {
  // Obtiene la definición estática del widget desde el registro.
  const definition = WIDGET_REGISTRY[instanceConfig.typeId];

  // Manejo de caso donde la definición del widget no se encuentra.
  if (!definition) {
    console.error(`Error: Widget definition not found for typeId: ${instanceConfig.typeId}`);
    return (
      <div 
        className="bg-red-100 dark:bg-red-900/30 border border-red-500 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-md flex flex-col items-center justify-center text-center h-full"
        style={{
            gridColumnStart: instanceConfig.x + 1,
            gridColumnEnd: instanceConfig.x + 1 + instanceConfig.w,
            gridRowStart: instanceConfig.y + 1,
            gridRowEnd: instanceConfig.y + 1 + instanceConfig.h,
        }}
      >
        <Icon as={AlertTriangle} size={32} className="mb-2"/>
        <p className="font-semibold">Error de Widget</p>
        <p className="text-sm">El widget "{instanceConfig.typeId}" (ID: {instanceConfig.id}) no se pudo cargar.</p>
        <button 
          onClick={() => removeWidget(instanceConfig.id)}
          className="mt-2 text-xs text-red-600 dark:text-red-400 hover:underline"
        >
          Eliminar este widget
        </button>
      </div>
    );
  }

  // El componente React específico para este tipo de widget.
  const WidgetComponent = definition.component;
  const isCurrentlyMaximized = maximizedWidgetId === instanceConfig.id;

  const handleMaximizeToggle = () => {
    maximizeWidget(isCurrentlyMaximized ? null : instanceConfig.id);
  };
  
  const handleRemove = () => {
    // Si el widget está maximizado, minimizarlo antes de eliminarlo.
    if (isCurrentlyMaximized) {
      maximizeWidget(null);
    }
    removeWidget(instanceConfig.id);
  };

  return (
    <WidgetWrapper
      instanceConfig={instanceConfig}
      definition={definition}
      onRemove={handleRemove}
      onMaximize={handleMaximizeToggle}
      isMaximized={isCurrentlyMaximized}
      // onSettings={() => console.log(`Settings for ${definition.title}`)} // Placeholder para la lógica de configuración
    >
      {/* Renderiza el componente del widget, pasándole las props necesarias. */}
      <WidgetComponent
        instanceConfig={instanceConfig}
        definition={definition}
        updateInstanceConfig={updateInstanceConfig}
        removeWidget={removeWidget} // Pasar removeWidget aquí también si el widget necesita auto-eliminarse
      />
    </WidgetWrapper>
  );
};

export default WidgetRenderer;
