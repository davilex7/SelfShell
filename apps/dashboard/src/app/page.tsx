// apps/dashboard/src/app/page.tsx
// Componente raíz de la aplicación Dashboard.
"use client"; // Necesario para hooks de React

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DashboardLayout, WidgetInstanceConfig } from '@/types'; // Usando alias @/
import { WIDGET_REGISTRY } from '@/widgets/registry'; // Usando alias @/
import { Button, Icon, cn } from '@mi-dashboard/ui';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AddWidgetPanel from '@/components/dashboard/AddWidgetPanel';
import WidgetGrid from '@/components/dashboard/WidgetGrid';

// --- Constantes y Configuración Inicial ---
const INITIAL_COLUMNS = 12; // Un sistema de 12 columnas es común y flexible

// Configuración inicial de widgets para el dashboard.
// En una aplicación real, esto se cargaría desde localStorage o un backend.
const initialWidgets: WidgetInstanceConfig[] = [
  { id: 'clock-main', typeId: 'clock', x: 0, y: 0, w: 3, h: 1, settings: { timezone: 'Europe/Madrid' } },
  { id: 'notes-tasks', typeId: 'notes', x: 3, y: 0, w: 6, h: 2, settings: { initialNote: "Lista de tareas:\n- Revisar la arquitectura del dashboard.\n- Adaptar el widget de Series Tracker.\n- ¡Dominar el mundo (opcional)!" } },
  { id: 'series-tracker-main', typeId: 'series-tracker', x: 0, y: 2, w: 9, h: 3 },
  { id: 'clock-utc', typeId: 'clock', x: 9, y: 0, w: 3, h: 1, title: "Reloj (UTC)", settings: { timezone: 'UTC' } },
];

const App: React.FC = () => {
  // --- Estados ---
  const [dashboardLayout, setDashboardLayout] = useState<DashboardLayout>({
    columns: INITIAL_COLUMNS,
    widgets: initialWidgets,
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('dashboard-theme');
      return savedTheme === 'dark';
    }
    return false;
  });
  const [isWidgetPanelOpen, setIsWidgetPanelOpen] = useState<boolean>(false);
  const [maximizedWidgetId, setMaximizedWidgetId] = useState<string | null>(null);

  // --- Efectos ---
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add('dark');
      localStorage.setItem('dashboard-theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('dashboard-theme', 'light');
    }
    if (maximizedWidgetId) {
        document.body.classList.add('overflow-hidden');
    } else {
        document.body.classList.remove('overflow-hidden');
    }
    return () => {
        document.body.classList.remove('overflow-hidden');
    };
  }, [isDarkMode, maximizedWidgetId]);

  // --- Callbacks para Manipulación de Widgets ---
  const updateWidgetConfig = useCallback((id: string, newConfig: Partial<WidgetInstanceConfig>) => {
    setDashboardLayout(prevLayout => ({
      ...prevLayout,
      widgets: prevLayout.widgets.map(w =>
        w.id === id ? { ...w, ...newConfig } : w
      ),
    }));
  }, []);

  const removeWidgetFromLayout = useCallback((idToRemove: string) => {
    setDashboardLayout(prevLayout => ({
      ...prevLayout,
      widgets: prevLayout.widgets.filter(w => w.id !== idToRemove),
    }));
    if (maximizedWidgetId === idToRemove) {
        setMaximizedWidgetId(null);
    }
  }, [maximizedWidgetId]);

  const addWidgetToLayout = useCallback((typeId: string) => {
    const definition = WIDGET_REGISTRY[typeId];
    if (!definition) {
      console.error(`No se pudo añadir widget: Definición no encontrada para typeId "${typeId}"`);
      return;
    }
    let nextY = 0;
    if (dashboardLayout.widgets.length > 0) {
      nextY = Math.max(0, ...dashboardLayout.widgets.map(w => w.y + w.h));
    }
    const newWidgetInstance: WidgetInstanceConfig = {
      id: `${typeId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      typeId: typeId,
      ...definition.defaultConfig,
      y: nextY,
      x: 0,
    };
    if (newWidgetInstance.x + newWidgetInstance.w > dashboardLayout.columns) {
        newWidgetInstance.x = 0;
        newWidgetInstance.w = Math.min(newWidgetInstance.w, dashboardLayout.columns);
    }
    setDashboardLayout(prevLayout => ({
      ...prevLayout,
      widgets: [...prevLayout.widgets, newWidgetInstance],
    }));
    setIsWidgetPanelOpen(false);
  }, [dashboardLayout.widgets, dashboardLayout.columns]);

  // --- Memoización ---
  const availableWidgets = useMemo(() => Object.values(WIDGET_REGISTRY), []);

  // --- Renderizado ---
  return (
    <div className={cn(
        "min-h-screen font-inter flex flex-col",
        isDarkMode ? 'dark' : '',
        "bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors duration-300"
      )}
    >
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenAddWidgetPanel={() => setIsWidgetPanelOpen(true)}
      />

      <main className={cn("flex-grow", maximizedWidgetId ? "" : "container mx-auto")}>
        <WidgetGrid
          layout={dashboardLayout}
          updateInstanceConfig={updateWidgetConfig}
          removeWidget={removeWidgetFromLayout}
          maximizeWidget={setMaximizedWidgetId}
          maximizedWidgetId={maximizedWidgetId}
        />
      </main>

      <AddWidgetPanel
        isOpen={isWidgetPanelOpen}
        onClose={() => setIsWidgetPanelOpen(false)}
        availableWidgets={availableWidgets}
        onAddWidget={addWidgetToLayout}
      />
      
      {!maximizedWidgetId && <Footer />}
    </div>
  );
};

export default App;
