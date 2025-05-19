// apps/series-tracker/src/app/api/tmdb/search/route.ts
import { NextResponse, NextRequest } from 'next/server';
// import fetch from 'node-fetch'; // Next.js 13+ tiene fetch global

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Interfaz para los resultados de búsqueda de TMDb que espera el frontend
import type { TmdbApiSearchResult } from '@mi-dashboard/types';

export async function GET(request: NextRequest) {
  if (!TMDB_API_KEY) {
    console.error("API Route TMDb Search: Falta la clave API de TMDb.");
    return NextResponse.json({ message: 'Error de configuración del servidor: Falta la clave API de TMDb.' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query || query.trim() === '') {
    return NextResponse.json({ message: 'El término de búsqueda no puede estar vacío.' }, { status: 400 });
  }

  const url = `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES&page=1&include_adult=false`;

  try {
    console.log(`[API/TMDB_SEARCH] Buscando en TMDb: ${url.replace(TMDB_API_KEY, 'TMDB_API_KEY_REDACTED')}`);
    const tmdbResponse = await fetch(url);

    if (!tmdbResponse.ok) {
      const errorBody = await tmdbResponse.text();
      console.error(`[API/TMDB_SEARCH] Falló la búsqueda en TMDb: ${tmdbResponse.status}`, errorBody);
      return NextResponse.json({ message: `Error en la búsqueda de TMDb: ${tmdbResponse.statusText}` }, { status: tmdbResponse.status });
    }

    const data = await tmdbResponse.json() as { results: any[] };

    const filteredResults: TmdbApiSearchResult[] = data.results
      .filter(result => (result.media_type === 'movie' || result.media_type === 'tv') && result.id)
      .map(result => ({
        id: result.id,
        title: result.title,
        name: result.name,
        media_type: result.media_type,
        release_date: result.release_date,
        first_air_date: result.first_air_date,
        poster_path: result.poster_path,
        overview: result.overview,
      }));
    
    console.log(`[API/TMDB_SEARCH] TMDb encontró ${filteredResults.length} resultados para: "${query}"`);
    return NextResponse.json(filteredResults);

  } catch (error: any) {
    console.error('[API/TMDB_SEARCH] Error buscando en TMDb:', error);
    return NextResponse.json({ message: error.message || 'Error desconocido durante la búsqueda en TMDb.' }, { status: 500 });
  }
}

