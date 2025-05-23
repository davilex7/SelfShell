// src/widgets/registry.ts
// Este archivo centraliza la definición de todos los widgets disponibles en la aplicación.
// Permite al dashboard descubrir y renderizar widgets dinámicamente.

import { WidgetDefinition } from '@/types'; // Asumiendo que @ es un alias para src/
import ClockWidget from './ClockWidget';
import NotesWidget from './NotesWidget';

import { SeriesTrackerWidget } from '@mi-dashboard/series-tracker-widget';
import { Icons } from '@mi-dashboard/ui';

// Importa iconos de lucide-react para usarlos en las definiciones
import { Clock, Tv, Newspaper, BarChart2, Calendar as CalendarIcon } from 'lucide-react';

export const WIDGET_REGISTRY: Record<string, WidgetDefinition> = {
  'clock': {
    id: 'clock', // Identificador único del tipo de widget
    title: 'Reloj Mundial', // Título legible
    description: 'Muestra la hora y fecha actual. Configurable por zona horaria (futuro).', // Descripción
    icon: Clock, // Icono para mostrar en el panel de selección de widgets
    component: ClockWidget, // El componente React que renderiza este widget
    defaultConfig: { // Configuración por defecto para nuevas instancias
      x: 0, // Posición inicial en la cuadrícula
      y: 0,
      w: 2, // Ancho en columnas de la cuadrícula
      h: 1, // Alto en filas de la cuadrícula
      settings: { timezone: 'Europe/Madrid' }, // Ejemplo de configuración específica del widget
    },
    category: 'Utilidades', // Categoría para organización
  },
  'notes': {
    id: 'notes',
    title: 'Notas Rápidas',
    description: 'Un espacio simple para tomar notas rápidas y recordatorios.',
    icon: Newspaper, // Un icono más apropiado para notas
    component: NotesWidget,
    defaultConfig: {
      x: 0,
      y: 0,
      w: 2,
      h: 2,
      settings: { initialNote: "¡Bienvenido a tus notas!" },
    },
    category: 'Productividad',
  },
  'series-tracker': {
    id: 'series-tracker',
    title: 'Seguimiento de Series',
    description: 'Visualiza y gestiona tus series y películas favoritas.',
    icon: Icons.tv, // <--- Usa el icono desde tu paquete UI
    component: SeriesTrackerWidget, // <--- Usa el componente importado del paquete
    defaultConfig: {
      x: 0, y: 0, w: 3, h: 2, // Ajusta el tamaño por defecto si es necesario
      settings: { displayCount: 3, showOnly: 'topRated' }, // Configuración inicial para el widget
    },
    category: 'Entretenimiento',
  },
  // --- Futuros Widgets (Ejemplos de definiciones) ---
  /*
  'weather': {
    id: 'weather',
    title: 'Clima Local',
    description: 'Pronóstico del tiempo para tu ubicación.',
    icon: CloudSun, // Necesitarías importar CloudSun de lucide-react
    component: PlaceholderWidget, // Reemplazar con el componente real WeatherWidget
    defaultConfig: { x: 0, y: 0, w: 2, h: 1, settings: { location: 'auto' } },
    category: 'Información',
  },
  'calendar-events': {
    id: 'calendar-events',
    title: 'Próximos Eventos',
    description: 'Muestra tus próximos eventos del calendario.',
    icon: CalendarIcon,
    component: PlaceholderWidget, // Reemplazar con CalendarEventsWidget
    defaultConfig: { x: 0, y: 0, w: 2, h: 2, settings: { calendarId: 'primary' } },
    category: 'Productividad',
  },
  */
};

// Componente placeholder genérico para widgets aún no implementados
// Podrías moverlo a un archivo separado si lo usas mucho.
// const PlaceholderWidget: React.FC<WidgetProps> = ({ definition }) => (
//   <div className="flex items-center justify-center h-full bg-slate-100 dark:bg-slate-700 rounded-md">
//     <p className="text-slate-500 dark:text-slate-400">Widget: {definition.title} (Próximamente)</p>
//   </div>
// );
