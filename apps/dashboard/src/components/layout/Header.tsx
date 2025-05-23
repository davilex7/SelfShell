// src/components/layout/Header.tsx
// Componente para el encabezado principal del dashboard.

import React from 'react';
import { Button, Icon } from '@mi-dashboard/ui';
import { LayoutGrid, PlusCircle, Sun, Moon, Settings } from 'lucide-react'; // Iconos comunes

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAddWidgetPanel: () => void;
  // onOpenDashboardSettings?: () => void; // Futura funcionalidad
}

const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  onOpenAddWidgetPanel,
  // onOpenDashboardSettings,
}) => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-[60] border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo y Título del Dashboard */}
        <div className="flex items-center gap-2">
          <Icon as={LayoutGrid} size={24} className="text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Mi Dashboard Personal
          </h1>
        </div>

        {/* Controles del Dashboard */}
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onOpenAddWidgetPanel} size="sm">
            <Icon as={PlusCircle} size={16} className="mr-2" />
            Añadir Widget
          </Button>
          
          {/*
          {onOpenDashboardSettings && (
            <Button variant="ghost" size="icon" onClick={onOpenDashboardSettings} aria-label="Configuración del dashboard">
              <Icon as={Settings} size={20} />
            </Button>
          )}
          */}

          <Button variant="ghost" size="icon" onClick={onToggleDarkMode} aria-label={isDarkMode ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}>
            <Icon as={isDarkMode ? Sun : Moon} size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
