// src/components/dashboard/AddWidgetPanel.tsx
// Panel modal para seleccionar y añadir nuevos widgets al dashboard, ahora agrupados por categoría.

import React from 'react';
import { WidgetDefinition } from '@/types';
import { Button, Icon, Card, CardHeader, CardTitle, CardContent, cn } from '@mi-dashboard/ui';
import { X, LayoutGrid, PlusCircle } from 'lucide-react';

interface AddWidgetPanelProps {
  isOpen: boolean;
  onClose: () => void;
  availableWidgets: WidgetDefinition[];
  onAddWidget: (typeId: string) => void;
}

const AddWidgetPanel: React.FC<AddWidgetPanelProps> = ({
  isOpen,
  onClose,
  availableWidgets,
  onAddWidget,
}) => {
  if (!isOpen) {
    return null;
  }

  // Agrupar widgets por categoría
  const groupedWidgets = useMemo(() => {
    return availableWidgets.reduce((acc, widget) => {
      const category = widget.category || 'Otros'; // Categoría por defecto si no se especifica
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(widget);
      return acc;
    }, {} as Record<string, WidgetDefinition[]>);
  }, [availableWidgets]);

  // Ordenar categorías alfabéticamente, pero quizás poner "Otros" al final
  const sortedCategories = useMemo(() => {
    return Object.keys(groupedWidgets).sort((a, b) => {
      if (a === 'Otros') return 1;
      if (b === 'Otros') return -1;
      return a.localeCompare(b);
    });
  }, [groupedWidgets]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="addWidgetPanelTitle"
    >
      <Card
        className="w-full max-w-3xl max-h-[90vh] flex flex-col !shadow-2xl animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon as={PlusCircle} className="text-blue-600 dark:text-blue-400" size={22}/>
            <CardTitle id="addWidgetPanelTitle">Añadir Widgets al Dashboard</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar panel">
            <Icon as={X} />
          </Button>
        </CardHeader>

        <CardContent className="overflow-y-auto space-y-6 styled-scrollbar"> {/* Añadido styled-scrollbar */}
          {sortedCategories.length === 0 && (
             <p className="text-center text-slate-500 dark:text-slate-400 py-10">
              No hay widgets disponibles para añadir.
            </p>
          )}
          {sortedCategories.map(category => (
            <section key={category} aria-labelledby={`category-title-${category.replace(/\s+/g, '-').toLowerCase()}`}>
              <h3 
                id={`category-title-${category.replace(/\s+/g, '-').toLowerCase()}`} 
                className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-300 border-b pb-2 border-slate-200 dark:border-slate-700 sticky top-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm z-10 pt-2 -mt-2"
              >
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedWidgets[category].map(widgetDef => {
                  const WidgetIcon = widgetDef.icon || LayoutGrid;
                  return (
                    <button
                      key={widgetDef.id}
                      onClick={() => onAddWidget(widgetDef.id)}
                      className={cn(
                        "p-4 border border-slate-300 dark:border-slate-700 rounded-lg",
                        "hover:bg-slate-50 dark:hover:bg-slate-700/70",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                        "transition-all text-left flex flex-col items-start gap-2 h-full hover:shadow-lg transform hover:-translate-y-1"
                      )}
                      aria-label={`Añadir widget ${widgetDef.title}`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon as={WidgetIcon} size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{widgetDef.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 flex-grow min-h-[3em]">
                        {widgetDef.description || 'Sin descripción disponible.'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </CardContent>
      </Card>
      {/* CSS para animaciones y scrollbar (podría ir en globals.css) */}
      <style jsx global>{`
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scaleUp { animation: scaleUp 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        
        .styled-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .styled-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .styled-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.4); /* slate-400 con opacidad */
          border-radius: 3px;
        }
        .styled-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(107, 114, 128, 0.6); /* slate-500 con opacidad */
        }
        .dark .styled-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(75, 85, 99, 0.4); /* slate-600 con opacidad */
        }
        .dark .styled-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(55, 65, 81, 0.6); /* slate-700 con opacidad */
        }
      `}</style>
    </div>
  );
};

export default AddWidgetPanel;
