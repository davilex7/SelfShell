// src/components/dashboard/WidgetGrid.tsx
// Este componente es responsable de renderizar la cuadrícula de widgets.

import React from 'react';
import { DashboardLayout, WidgetInstanceConfig } from '@/types';
import WidgetRenderer from './WidgetRenderer';

interface WidgetGridProps {
  layout: DashboardLayout;
  updateInstanceConfig: (id: string, newConfig: Partial<WidgetInstanceConfig>) => void;
  removeWidget: (id: string) => void;
  maximizeWidget: (widgetId: string | null) => void;
  maximizedWidgetId: string | null;
}

const WidgetGrid: React.FC<WidgetGridProps> = ({
  layout,
  updateInstanceConfig,
  removeWidget,
  maximizeWidget,
  maximizedWidgetId,
}) => {
  // Estilo para el contenedor de la cuadrícula CSS.
  // Las dimensiones de las filas y columnas se definen aquí.
  // Para una cuadrícula responsiva y con drag-and-drop, se usarían bibliotecas
  // como react-grid-layout, que manejan estos cálculos internamente.
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`, // Crea N columnas flexibles
    gridAutoRows: '180px', // Altura base para cada fila de la cuadrícula (ajustar según necesidad)
    gap: '1rem', // Equivalente a Tailwind `gap-4`
  };

  // Si un widget está maximizado, solo renderizamos ese.
  const maximizedWidget = layout.widgets.find(w => w.id === maximizedWidgetId);

  if (maximizedWidget) {
    return (
      <div className="p-0"> {/* Sin padding adicional cuando está maximizado */}
        <WidgetRenderer
          key={maximizedWidget.id}
          instanceConfig={maximizedWidget}
          updateInstanceConfig={updateInstanceConfig}
          removeWidget={removeWidget}
          maximizeWidget={maximizeWidget}
          maximizedWidgetId={maximizedWidgetId}
        />
      </div>
    );
  }

  // Si no hay widget maximizado, renderiza la cuadrícula normal.
  return (
    <div style={gridStyle} className="min-h-[calc(100vh-10rem)]"> {/* Asegura altura mínima para ver la cuadrícula */}
      {layout.widgets.map(widgetConfig => (
        <WidgetRenderer
          key={widgetConfig.id}
          instanceConfig={widgetConfig}
          updateInstanceConfig={updateInstanceConfig}
          removeWidget={removeWidget}
          maximizeWidget={maximizeWidget}
          maximizedWidgetId={maximizedWidgetId}
        />
      ))}
    </div>
  );
};

export default WidgetGrid;
