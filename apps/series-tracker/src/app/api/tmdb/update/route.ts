// apps/series-tracker/src/app/api/tmdb/update/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
// Las funciones readTrackerData y writeTrackerData se pueden importar desde un helper
// o duplicarlas/adaptarlas aquí si son simples. Para este ejemplo, las adaptaremos.
// En un proyecto más grande, considera un módulo `lib/tracker-data-service.ts` dentro de `apps/series-tracker`.

// --- Esquemas y Tipos (Reutilizados o importados) ---
import { 
  ItemTypeSchema, 
  StoredItemInfoSchema, 
  StoredItemInfoArraySchema,
  type ItemType, 
  type StoredItemInfo 
} from '@mi-dashboard/types';


// --- Configuración y Helpers de Archivo (Adaptados de api/items/route.ts) ---
import fs from 'fs/promises';
import path from 'path';

const dataDirUpdate = path.resolve(process.cwd(), 'data');
const dataFilePathUpdate = path.join(dataDirUpdate, 'tracker-data.json');

async function ensureDataDirExistsUpdate() {
  try { await fs.access(dataDirUpdate); } catch (e: any) { if (e.code === 'ENOENT') await fs.mkdir(dataDirUpdate, { recursive: true }); else throw e; }
}
async function readTrackerDataUpdate(): Promise<StoredItemInfo[]> {
  await ensureDataDirExistsUpdate();
  try {
    const fileContent = await fs.readFile(dataFilePathUpdate, 'utf-8');
    return StoredItemInfoArraySchema.parse(JSON.parse(fileContent));
  } catch (e) { return []; }
}
async function writeTrackerDataUpdate(items: StoredItemInfo[]): Promise<void> {
  await ensureDataDirExistsUpdate();
  await fs.writeFile(dataFilePathUpdate, JSON.stringify(StoredItemInfoArraySchema.parse(items), null, 2), 'utf-8');
}
// --- Fin Helpers de Archivo ---


const TMDB_API_KEY_UPDATE = process.env.TMDB_API_KEY;
const TMDB_BASE_URL_UPDATE = 'https://api.themoviedb.org/3';

async function fetchSeriesDetailsFromTmdb(tmdbId: number): Promise<{ latestSeason: number | null, error?: string }> {
  if (!TMDB_API_KEY_UPDATE) return { latestSeason: null, error: 'Clave API de TMDb no configurada.' };

  const url = `${TMDB_BASE_URL_UPDATE}/tv/${tmdbId}?api_key=${TMDB_API_KEY_UPDATE}&language=es-ES`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) return { latestSeason: null, error: 'Serie no encontrada (404).' };
      throw new Error(`Error TMDb: ${response.status}`);
    }
    const data = await response.json() as { number_of_seasons?: number };
    return { latestSeason: data.number_of_seasons ?? null };
  } catch (error: any) {
    console.error(`[API/TMDB_UPDATE_HELPER] Error obteniendo detalles de serie ${tmdbId}:`, error);
    return { latestSeason: null, error: error.message || "Error desconocido." };
  }
}

export async function POST(request: NextRequest) {
  if (!TMDB_API_KEY_UPDATE) {
    return NextResponse.json({ message: 'Error de configuración: Falta la clave API de TMDb.' }, { status: 500 });
  }

  try {
    const currentItemList = await readTrackerDataUpdate();
    const seriesList = currentItemList.filter(item => item.type === 'series' && typeof item.tmdbId === 'number');

    if (seriesList.length === 0) {
      return NextResponse.json({ updatedList: currentItemList, errors: [], message: "No hay series para actualizar." });
    }

    const updateErrors: { title: string, error: string }[] = [];
    let itemsChanged = false;

    const updatedListPromises = seriesList.map(async (item) => {
      // Añadir un pequeño delay para no saturar la API de TMDb
      await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay por petición
      
      const result = await fetchSeriesDetailsFromTmdb(item.tmdbId);
      if (result.error) {
        updateErrors.push({ title: item.title, error: result.error });
        return item; // Devuelve el ítem original si hay error
      }
      if (item.latestSeason !== result.latestSeason) {
        itemsChanged = true;
        return { ...item, latestSeason: result.latestSeason };
      }
      return item;
    });

    const newUpdatedListItems = await Promise.all(updatedListPromises);
    
    // Reconstruir la lista completa con películas y series actualizadas/no actualizadas
    const finalUpdatedList = currentItemList.map(item => {
        if (item.type === 'series') {
            const updatedSeriesItem = newUpdatedListItems.find(s => s.tmdbId === item.tmdbId);
            return updatedSeriesItem || item;
        }
        return item;
    });


    if (itemsChanged) {
      await writeTrackerDataUpdate(finalUpdatedList);
    }

    return NextResponse.json({ updatedList: finalUpdatedList, errors: updateErrors, message: itemsChanged ? "Datos actualizados." : "No se encontraron cambios en las temporadas." });

  } catch (error: any) {
    console.error('[API/TMDB_UPDATE] Error actualizando datos de TMDb:', error);
    return NextResponse.json({ message: error.message || 'Error del servidor al actualizar datos.' }, { status: 500 });
  }
}

