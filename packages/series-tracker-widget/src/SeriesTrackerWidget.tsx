// packages/series-tracker-widget/src/SeriesTrackerWidget.tsx
"use client"; 

import React, { useState, useEffect, useCallback } from 'react';
// En Fase 3, estos imports vendrán de @mi-dashboard/types y @mi-dashboard/ui
import { Button, Icon } from '@mi-dashboard/ui';
import { List, Plus, Star, AlertTriangle, Loader2, Tv } from 'lucide-react';
import type { WidgetProps } from '@/types'; 
import type { StoredItemInfo, ItemType } from '@mi-dashboard/types';

// URL base de la API de series-tracker.
// Esto asume que el dashboard (que ejecuta este widget) tiene configurados
// 'rewrites' en su next.config.mjs para redirigir estas peticiones
// a la aplicación series-tracker-app que corre en otro puerto.
const SERIES_TRACKER_API_BASE_URL = '/api/series-tracker'; 

interface DisplayItem extends StoredItemInfo {
  // Puedes añadir campos específicos para la visualización del widget si es necesario
}

const SeriesTrackerWidget: React.FC<WidgetProps> = ({ instanceConfig, definition }) => {
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ejemplo de cómo podrías usar settings del widget definidos en el registry
  const { displayCount = 3, showOnly = 'topRated' } = instanceConfig.settings || {};

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${SERIES_TRACKER_API_BASE_URL}/items`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error de red o respuesta no JSON" }));
        throw new Error(errorData.message || `Error al cargar datos: ${response.statusText}`);
      }
      const data: StoredItemInfo[] = await response.json();
      
      let processedItems = [...data]; // Crear una copia para no mutar el estado original directamente al ordenar
      if (showOnly === 'topRated') {
        processedItems.sort((a, b) => b.rating - a.rating);
      } else if (showOnly === 'recent') {
        // Para 'recent', necesitarías un campo como 'addedDate' o 'lastUpdatedDate' en tus StoredItemInfo.
        // Como no lo tenemos, simplemente mostramos los primeros como ejemplo.
        // processedItems.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
      }
      setItems(processedItems.slice(0, displayCount));

    } catch (err: any) {
      setError(err.message || 'No se pudieron cargar los ítems del tracker.');
      console.error("Error fetching series tracker items for widget:", err);
    } finally {
      setIsLoading(false);
    }
  }, [displayCount, showOnly]); // Dependencias del useCallback

  useEffect(() => {
    fetchItems();
    // Opcional: Configurar un intervalo para refrescar los datos periódicamente
    // const intervalId = setInterval(fetchItems, 60000); // Refrescar cada 60 segundos
    // return () => clearInterval(intervalId);
  }, [fetchItems]); // fetchItems es ahora una dependencia estable gracias a useCallback

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
        <Icon as={Loader2} className="animate-spin" size={32} />
        <p className="mt-2 text-sm">Cargando series...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-600 dark:text-red-400 p-4 text-center">
        <Icon as={AlertTriangle} className="mb-2" size={32} />
        <p className="font-semibold">Error al Cargar</p>
        <p className="text-xs mb-3">{error}</p>
        <Button onClick={fetchItems} variant="outline" size="sm">
          Reintentar
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400 p-4 text-center">
        <Icon as={List} className="mb-2" size={32} />
        <p className="text-sm">No hay series para mostrar según los criterios.</p>
        {/* Podrías añadir un botón para ir a la app completa o añadir una nueva */}
      </div>
    );
  }

  return (
    <div className="space-y-2 p-1 overflow-y-auto h-full">
      {items.map(item => (
        <div 
          key={item.tmdbId} 
          className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700/60 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600/60 transition-colors cursor-pointer"
          onClick={() => alert(`Abrir detalles de: ${item.title} (funcionalidad futura)`)} // Ejemplo de acción
          title={`Ver ${item.title}`}
        >
          {item.posterPath ? (
            <img 
              src={`https://image.tmdb.org/t/p/w92${item.posterPath}`} 
              alt={`Poster de ${item.title}`}
              className="w-10 h-14 object-cover rounded-md flex-shrink-0 bg-slate-200 dark:bg-slate-600"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevenir bucles si el placeholder también falla
                target.src = "https://placehold.co/92x138/777/ccc?text=Img";
              }}
            />
          ) : (
            <div className="w-10 h-14 rounded-md flex-shrink-0 bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-400 dark:text-slate-500">
              <Icon as={Tv} size={20}/>
            </div>
          )}
          <div className="flex-grow overflow-hidden min-w-0"> {/* min-w-0 para que truncate funcione bien en flex */}
            <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-100" title={item.title}>
              {item.title}
            </p>
            <div className="flex items-center text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              <Icon as={Star} size={12} className="mr-1 text-yellow-400 fill-yellow-400 flex-shrink-0" />
              {item.rating % 1 === 0 ? item.rating.toFixed(0) : item.rating.toFixed(1)}
              {item.type === 'series' && (
                <span className="ml-2 truncate">
                  T{item.userSeason || 0} E{item.userEpisode || 0}
                  {item.latestSeason !== null && item.latestSeason > 0 && ` de ${item.latestSeason}T`}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SeriesTrackerWidget;

