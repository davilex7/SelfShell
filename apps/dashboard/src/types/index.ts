// src/types/index.ts
// Este archivo centraliza todas las definiciones de tipos e interfaces
// para el sistema de dashboard y widgets.

import React from 'react';

/**
 * @interface WidgetDefinition
 * @description Define la estructura estática de un tipo de widget.
 * Contiene información como su ID único, título, descripción,
 * el componente React que lo renderiza, y su configuración por defecto.
 */
export interface WidgetDefinition {
  id: string; // Identificador único del tipo de widget (ej. "clock", "series-tracker")
  title: string; // Título legible para mostrar en la UI
  description?: string; // Descripción breve de lo que hace el widget
  icon?: React.ElementType; // Componente de icono (ej. de lucide-react)
  component: React.ComponentType<WidgetProps>; // El componente React que renderiza la lógica y UI del widget
  defaultConfig: Omit<WidgetInstanceConfig, 'id' | 'typeId'>; // Configuración por defecto para una nueva instancia de este widget
  category?: string; // Categoría para agrupar widgets (ej. "Productividad", "Entretenimiento")
}

/**
 * @interface WidgetInstanceConfig
 * @description Describe una instancia activa de un widget en el dashboard.
 * Incluye su ID único en el dashboard, el tipo de widget al que pertenece,
 * su posición y tamaño en la cuadrícula, y configuraciones específicas.
 */
export interface WidgetInstanceConfig {
  id: string; // Identificador único de ESTA instancia del widget en el dashboard (ej. "clock-1", "notes-xyz")
  typeId: string; // ID del WidgetDefinition al que corresponde esta instancia (ej. "clock")
  x: number; // Posición en la columna de inicio de la cuadrícula (basado en 0)
  y: number; // Posición en la fila de inicio de la cuadrícula (basado en 0)
  w: number; // Ancho del widget en unidades de columna de la cuadrícula
  h: number; // Alto del widget en unidades de fila de la cuadrícula
  title?: string; // Título opcional para sobreescribir el título por defecto de WidgetDefinition
  settings?: Record<string, any>; // Objeto para configuraciones específicas del widget (ej. { "timezone": "UTC" } para un reloj)
}

/**
 * @interface WidgetProps
 * @description Props que se pasan a cada componente de widget individual.
 * Proporciona la configuración de la instancia, la definición del widget,
 * y funciones para interactuar con el dashboard (actualizar configuración, eliminar).
 */
export interface WidgetProps {
  instanceConfig: WidgetInstanceConfig; // La configuración específica de esta instancia
  definition: WidgetDefinition; // La definición estática del tipo de widget
  updateInstanceConfig: (id: string, newConfig: Partial<WidgetInstanceConfig>) => void; // Función para actualizar la configuración de esta instancia
  removeWidget: (id: string) => void; // Función para eliminar esta instancia del dashboard
}

/**
 * @interface DashboardLayout
 * @description Define la estructura general del layout del dashboard.
 * Incluye el número de columnas de la cuadrícula y la lista de widgets activos.
 */
export interface DashboardLayout {
  columns: number; // Número total de columnas en la cuadrícula del dashboard
  widgets: WidgetInstanceConfig[]; // Array de las configuraciones de todas las instancias de widgets activas
}
