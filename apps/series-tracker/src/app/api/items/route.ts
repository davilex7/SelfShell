// apps/series-tracker/src/app/api/items/route.ts
import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

// --- Esquema de Validación Zod (similar al de actions.ts) ---
import { 
  ItemTypeSchema, 
  StoredItemInfoSchema, 
  StoredItemInfoArraySchema,
  type ItemType, 
  type StoredItemInfo 
} from '@mi-dashboard/types';

// --- Configuración de Ruta de Archivo ---
const dataDir = path.resolve(process.cwd(), 'data'); // Asume que 'data' está en la raíz de `apps/series-tracker`
const dataFilePath = path.join(dataDir, 'tracker-data.json');

// --- Funciones Auxiliares de Archivo (adaptadas de actions.ts) ---
async function ensureDataDirExists() {
  try {
    await fs.access(dataDir);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.log(`Directorio de datos no encontrado en ${dataDir} para series-tracker. Creando...`);
      await fs.mkdir(dataDir, { recursive: true });
    } else {
      throw error;
    }
  }
}

async function readTrackerData(): Promise<StoredItemInfo[]> {
  await ensureDataDirExists();
  try {
    await fs.access(dataFilePath);
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const parsedJson = JSON.parse(fileContent);
    
    // Validar y filtrar datos corruptos
    const validationResult = StoredItemInfoArraySchema.safeParse(parsedJson);
    if (!validationResult.success) {
      console.warn(`Validación de datos fallida para ${dataFilePath}. Errores:`, validationResult.error.flatten());
      if (Array.isArray(parsedJson)) {
        const validItems = parsedJson.filter(item => StoredItemInfoSchema.safeParse(item).success);
        console.warn(`Retornando ${validItems.length} ítems válidos después de filtrar.`);
        return validItems as StoredItemInfo[];
      }
      return [];
    }
    return validationResult.data;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return []; // Si el archivo no existe, retorna lista vacía
    } else if (error instanceof SyntaxError) {
      console.error(`Error parseando JSON de ${dataFilePath}. Retornando lista vacía.`, error);
      return [];
    }
    console.error(`Error leyendo archivo de datos de series-tracker ${dataFilePath}:`, error);
    throw new Error('No se pudieron cargar los datos del tracker.'); // Propagar error para manejo en el handler
  }
}

async function writeTrackerData(itemList: StoredItemInfo[]): Promise<void> {
  await ensureDataDirExists();
  // Validar antes de escribir
  const validationResult = StoredItemInfoArraySchema.safeParse(itemList);
  if (!validationResult.success) {
    console.error('Intento de escribir datos inválidos en series-tracker:', validationResult.error.flatten());
    throw new Error('Datos inválidos proporcionados para guardar.');
  }

  // Deduplicar por tmdbId antes de escribir
  const uniqueList = validationResult.data.reduce((acc, current) => {
    if (!acc.some(item => item.tmdbId === current.tmdbId)) {
      acc.push(current);
    }
    return acc;
  }, [] as StoredItemInfo[]);

  const dataString = JSON.stringify(uniqueList, null, 2);
  await fs.writeFile(dataFilePath, dataString, 'utf-8');
}

// --- Manejadores de Ruta ---

/**
 * @method GET
 * @description Obtiene todos los ítems del tracker.
 */
export async function GET(request: NextRequest) {
  try {
    const items = await readTrackerData();
    return NextResponse.json(items);
  } catch (error: any) {
    console.error('[API/ITEMS_GET] Error cargando ítems:', error);
    return NextResponse.json({ message: error.message || 'Error del servidor al cargar ítems.' }, { status: 500 });
  }
}

/**
 * @method POST
 * @description Guarda la lista completa de ítems del tracker.
 * Se espera un array de StoredItemInfo en el body.
 */
export async function POST(request: NextRequest) {
  try {
    const itemListJson = await request.json();
    
    // Validar el payload de entrada
    const validationResult = StoredItemInfoArraySchema.safeParse(itemListJson);
    if (!validationResult.success) {
      return NextResponse.json({ message: 'Datos de entrada inválidos.', errors: validationResult.error.flatten() }, { status: 400 });
    }

    await writeTrackerData(validationResult.data);
    return NextResponse.json({ message: 'Ítems guardados correctamente.' }, { status: 200 });
  } catch (error: any) {
    console.error('[API/ITEMS_POST] Error guardando ítems:', error);
    // Distinguir errores de validación de Zod de otros errores de servidor
    if (error.message.includes('Datos inválidos proporcionados para guardar')) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: error.message || 'Error del servidor al guardar ítems.' }, { status: 500 });
  }
}

