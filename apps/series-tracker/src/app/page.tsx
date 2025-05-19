// apps/series-tracker/src/app/page.tsx
"use client";

import * as React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { 
	Button, 
	Input,
	Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
	Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
	Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
	ScrollArea,
	Separator,
	StarRating,
	Icons,
	useToast,
	Alert, 
	AlertDescription, 
	AlertTitle,
	Badge,
	cn
} from "@mi-dashboard/ui";

// --- Definiciones de Tipos (mantenidas localmente por ahora, podrían moverse a packages/types) ---
import type { 
  ItemType, 
  StoredItemInfo, 
  TmdbSearchResult, 
  RecommendationResult 
} from '@mi-dashboard/types';

type SortKey = "title" | "rating";
type SortDirection = "asc" | "desc";
interface SortOption {
    value: `${SortKey}-${SortDirection}`;
    label: string;
}

const sortOptions: SortOption[] = [
    { value: "title-asc", label: "Título (A-Z)" },
    { value: "title-desc", label: "Título (Z-A)" },
    { value: "rating-desc", label: "Valoración (Mayor a Menor)" },
    { value: "rating-asc", label: "Valoración (Menor a Mayor)" },
];

// --- Constante para la URL base de la API ---
// Asumimos que las API Routes están en la misma aplicación Next.js
const API_BASE_URL = '/api'; 

// --- Componente Principal de la Página ---
export default function TrackerPage() {
    const [itemList, setItemList] = useState<StoredItemInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // isSaving ya no es tan relevante para el guardado debounced, pero puede usarse para feedback inmediato si se desea.
    // const [isSaving, setIsSaving] = useState(false); 
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isRecommending, setIsRecommending] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<TmdbSearchResult[]>([]);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
    const [sortCriteria, setSortCriteria] = useState<SortOption["value"]>("title-asc");
    const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
    const [isRecommendationsDialogOpen, setIsRecommendationsDialogOpen] = useState(false);
    const [recommendationError, setRecommendationError] = useState<string | null>(null);

    const { toast } = useToast();

    // --- Cargar Datos Iniciales ---
    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/items`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Error desconocido al cargar ítems."}));
                throw new Error(errorData.message || `Error del servidor: ${response.status}`);
            }
            const loadedItems: StoredItemInfo[] = await response.json();
            setItemList(loadedItems);
        } catch (error: any) {
            console.error("Error cargando ítems:", error);
            toast({
                title: "Error de Carga",
                description: error.message || "No se pudieron cargar los elementos.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // --- Guardar Datos (Debounced) ---
    const debouncedSave = useCallback(
        debounce(async (itemsToSave: StoredItemInfo[]) => {
            console.log("Guardado automático activado con ítems:", itemsToSave);
            try {
                const response = await fetch(`${API_BASE_URL}/items`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemsToSave),
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: "Error desconocido al guardar."}));
                    throw new Error(errorData.message || `Error del servidor al guardar: ${response.status}`);
                }
                // const result = await response.json();
                // console.log("Ítems guardados vía API:", result.message);
                // No es necesario un toast para cada guardado automático exitoso, puede ser molesto.
            } catch (error: any) {
                console.error("Error guardando ítems vía API:", error);
                toast({
                    title: "Error de Guardado Automático",
                    description: error.message || "No se pudieron guardar los últimos cambios.",
                    variant: "destructive",
                });
            }
        }, 1500),
        [toast]
    );

    // --- Manejadores de Eventos ---
    const handleRatingChange = (tmdbId: number, newRating: number) => {
        setItemList((prevList) => {
            const newList = prevList.map((item) =>
                item.tmdbId === tmdbId ? { ...item, rating: newRating } : item
            );
            debouncedSave(newList);
            return newList;
        });
    };

    const handleSeasonChange = (tmdbId: number, newSeason: string) => {
        setItemList((prevList) => {
            const newList = prevList.map((item) =>
                item.tmdbId === tmdbId ? { ...item, userSeason: newSeason } : item
            );
            debouncedSave(newList);
            return newList;
        });
    };

    const handleEpisodeChange = (tmdbId: number, newEpisode: string) => {
        setItemList((prevList) => {
            const newList = prevList.map((item) =>
                item.tmdbId === tmdbId ? { ...item, userEpisode: newEpisode } : item
            );
            debouncedSave(newList);
            return newList;
        });
    };

    const handleDeleteItem = (tmdbId: number) => {
        let deletedItemTitle = "Elemento";
        let newListAfterDelete: StoredItemInfo[] = [];

        setItemList((prevList) => {
            const itemToDelete = prevList.find(item => item.tmdbId === tmdbId);
            if (itemToDelete) {
                deletedItemTitle = `"${itemToDelete.title}"`;
            }
            newListAfterDelete = prevList.filter((item) => item.tmdbId !== tmdbId);
            return newListAfterDelete; // Actualiza el estado local inmediatamente
        });

        debouncedSave(newListAfterDelete); // Guarda la nueva lista (sin el ítem eliminado)
        toast({ title: "Elemento eliminado", description: `${deletedItemTitle} se ha quitado de tu lista.` });
    };

    const handleSearchTmdb = async () => {
        if (!searchQuery.trim()) {
            setSearchError("Introduce un título para buscar.");
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        setSearchError(null);
        setSearchResults([]);
        try {
            const response = await fetch(`${API_BASE_URL}/tmdb/search?query=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Error desconocido en la búsqueda."}));
                throw new Error(errorData.message || `Error del servidor en la búsqueda: ${response.status}`);
            }
            const results: TmdbSearchResult[] = await response.json();
            setSearchResults(results);
            if (results.length === 0) {
                setSearchError("No se encontraron resultados para tu búsqueda.");
            }
        } catch (error: any) {
            console.error("Error durante la búsqueda en TMDb:", error);
            setSearchError(error.message || "Error desconocido durante la búsqueda.");
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddItem = (result: TmdbSearchResult) => {
        if (itemList.some(item => item.tmdbId === result.id)) {
            toast({ title: "Duplicado", description: "Este elemento ya está en tu lista.", variant: "default" });
            return;
        }

        const newItem: StoredItemInfo = {
            tmdbId: result.id,
            title: result.title || result.name || "Título Desconocido",
            type: result.media_type === 'tv' ? 'series' : 'movie',
            latestSeason: null, // Se actualizará con handleUpdateData si es una serie
            userSeason: '0',
            userEpisode: '0',
            rating: 0,
            posterPath: result.poster_path,
            releaseYear: result.release_date?.substring(0, 4) || result.first_air_date?.substring(0, 4) || null,
        };

        let newListWithAddition: StoredItemInfo[] = [];
        setItemList((prevList) => {
            newListWithAddition = [...prevList, newItem];
            return newListWithAddition;
        });

        debouncedSave(newListWithAddition);
        toast({ title: "Añadido", description: `"${newItem.title}" se ha añadido a tu lista.` });

        setIsSearchDialogOpen(false);
        setSearchQuery("");
        setSearchResults([]);
        setSearchError(null);
    };

    const handleUpdateData = async () => {
        setIsUpdating(true);
        toast({ title: "Actualizando...", description: "Obteniendo datos de TMDb para las series..." });
        try {
            const response = await fetch(`${API_BASE_URL}/tmdb/update`, { method: 'POST' });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Error desconocido al actualizar."}));
                throw new Error(errorData.message || `Error del servidor al actualizar: ${response.status}`);
            }
            const { updatedList, errors, message } = await response.json();
            
            setItemList(updatedList); // Actualiza la lista completa con los datos potencialmente modificados

            if (errors && errors.length > 0) {
                errors.forEach((err: { title: string, error: string }) => {
                    toast({ title: `Error al actualizar "${err.title}"`, description: err.error, variant: "destructive" });
                });
            } else {
                toast({ title: "Datos Actualizados", description: message || "Información de temporadas actualizada." });
            }
        } catch (error: any) {
            console.error("Error actualizando datos desde TMDb:", error);
            toast({
                title: "Error de Actualización",
                description: error.message || "No se pudieron actualizar los datos desde TMDb.",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
        }
    };
    
    // El manejador de recomendaciones ya usa fetch, así que solo verificamos la URL base
    const handleGetRecommendations = async () => {
        setIsRecommending(true);
        setRecommendations([]);
        setRecommendationError(null);
        setIsRecommendationsDialogOpen(true);

        const ratedSeriesForAI = itemList
            .filter(item => item.rating > 0)
            .map(item => ({ title: item.title, rating: item.rating }));
        const excludeTitles = itemList.map(item => item.title);

        if (ratedSeriesForAI.length === 0) {
            setRecommendationError("No has valorado ninguna serie o película todavía. ¡Valora algunas para obtener recomendaciones!");
            setIsRecommending(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/recommendations`, { // Usa API_BASE_URL
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: { ratedSeries: ratedSeriesForAI, excludeTitles: excludeTitles, count: 5 }
                }),
            });

            if (!response.ok) {
                let errorMsg = `Error del servidor: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error?.message || errorMsg;
                } catch (parseError) { /* Ignorar si no se puede parsear el error */ }
                throw new Error(errorMsg);
            }
            const result = await response.json();
            if (!result || !Array.isArray(result.recommendations)) {
                if (result.message) { // Manejar mensajes específicos de la API como "Valora algunas series..."
                    setRecommendationError(result.message);
                    setIsRecommending(false);
                    return;
                }
                throw new Error("La respuesta de la API de recomendaciones no tuvo el formato esperado.");
            }
            setRecommendations(result.recommendations);
        } catch (err: any) {
            console.error("Error obteniendo recomendaciones:", err);
            setRecommendationError(err.message || "Ocurrió un error inesperado al obtener recomendaciones.");
        } finally {
            setIsRecommending(false);
        }
    };

    // --- Lógica de Filtrado y Ordenación ---
    const filteredAndSortedList = useMemo(() => {
        const [key, direction] = sortCriteria.split("-") as [SortKey, SortDirection];
        const filtered = itemList.filter((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return filtered.sort((a, b) => {
            let compareA: string | number = key === "title" ? a.title.toLowerCase() : a.rating;
            let compareB: string | number = key === "title" ? b.title.toLowerCase() : b.rating;
            if (compareA < compareB) return direction === "asc" ? -1 : 1;
            if (compareA > compareB) return direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [itemList, searchTerm, sortCriteria]);

    // --- Renderizado (sin cambios significativos en la estructura JSX) ---
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Mi Lista de Películas y Series</h1>

            {/* Controles */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
                <Input
                    type="text"
                    placeholder="Filtrar por título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                />
                <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto justify-center">
                    <Select value={sortCriteria} onValueChange={(value: SortOption["value"]) => setSortCriteria(value)}>
                        <SelectTrigger className="w-full sm:w-[180px] md:w-[200px]">
                            <SelectValue placeholder="Ordenar Por" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleUpdateData} disabled={isUpdating} variant="outline" className="w-auto flex-grow sm:flex-grow-0">
                        {isUpdating ? <Icons.loader className="mr-2 h-4 w-4 animate-spin" /> : <Icons.refreshCw className="mr-2 h-4 w-4" />}
                        Actualizar Datos
                    </Button>
                    <Button onClick={handleGetRecommendations} disabled={isRecommending || isLoading} variant="outline" className="w-auto flex-grow sm:flex-grow-0 bg-blue-600 hover:bg-blue-700 text-white">
                        {isRecommending ? <Icons.loader className="mr-2 h-4 w-4 animate-spin" /> : <Icons.wand className="mr-2 h-4 w-4" />}
                        Recomiéndame
                    </Button>
                    <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-auto flex-grow sm:flex-grow-0">
                                <Icons.plus className="mr-2 h-4 w-4" /> Añadir...
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                                <DialogTitle>Buscar y Añadir Película/Serie</DialogTitle>
                                <DialogDescription>
                                    Busca en TMDb y añade elementos a tu lista.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex gap-2 my-4">
                                <Input
                                    placeholder="Buscar título en TMDb..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearchTmdb()}
                                />
                                <Button onClick={handleSearchTmdb} disabled={isSearching}>
                                    {isSearching ? <Icons.loader className="mr-2 h-4 w-4 animate-spin" /> : <Icons.search className="mr-2 h-4 w-4" />}
                                    Buscar
                                </Button>
                            </div>
                            {searchError && <Alert variant="destructive"><AlertDescription>{searchError}</AlertDescription></Alert>}
                            <ScrollArea className="h-[400px] mt-4">
                                {searchResults.length > 0 && (
                                    <div className="space-y-4">
                                        {searchResults.map((result) => (
                                            <Card key={result.id} className="flex items-center p-3 gap-4">
                                                <img
                                                    src={result.poster_path ? `https://image.tmdb.org/t/p/w92${result.poster_path}` : "https://placehold.co/92x138/666/fff?text=N/A"}
                                                    alt={`Poster de ${result.title || result.name}`}
                                                    className="w-[60px] h-[90px] object-cover rounded-sm flex-shrink-0 bg-muted"
                                                    onError={(e) => (e.currentTarget.src = "https://placehold.co/92x138/666/fff?text=Error")}
                                                />
                                                <div className="flex-grow">
                                                    <p className="font-semibold">{result.title || result.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {result.media_type === 'movie' ? 'Película' : 'Serie'}
                                                        {` (${result.release_date?.substring(0, 4) || result.first_air_date?.substring(0, 4) || 'N/A'})`}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{result.overview}</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAddItem(result)}
                                                    disabled={itemList.some(item => item.tmdbId === result.id)}
                                                >
                                                    {itemList.some(item => item.tmdbId === result.id) ? <Icons.check className="mr-2 h-4 w-4" /> : <Icons.plus className="mr-2 h-4 w-4" />}
                                                    {itemList.some(item => item.tmdbId === result.id) ? 'Añadido' : 'Añadir'}
                                                </Button>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Lista de Ítems */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Icons.loader className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredAndSortedList.length === 0 ? (
                <p className="text-center text-muted-foreground mt-10">
                    {searchTerm ? "No se encontraron elementos que coincidan con tu filtro." : "Tu lista está vacía. ¡Añade alguna película o serie!"}
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredAndSortedList.map((item) => (
                        <Card key={item.tmdbId} className="flex flex-col">
                            <CardHeader className="p-0 relative">
                                <img
                                    src={item.posterPath ? `https://image.tmdb.org/t/p/w342${item.posterPath}` : "https://placehold.co/342x513/666/fff?text=N/A"}
                                    alt={`Poster de ${item.title}`}
                                    className="w-full h-auto object-cover rounded-t-lg aspect-[2/3] bg-muted"
                                    onError={(e) => (e.currentTarget.src = "https://placehold.co/342x513/666/fff?text=Error")}
                                    loading="lazy"
                                />
                                <Badge variant={item.type === 'series' ? 'secondary' : 'outline'} className="absolute top-2 right-2">
                                    {item.type === 'series' ? 'Serie' : 'Película'}
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-4 flex-grow flex flex-col justify-between">
                                <div>
                                    <CardTitle className="text-lg mb-1 line-clamp-2">{item.title}</CardTitle>
                                    {item.releaseYear && (
                                        <CardDescription className="text-xs mb-2">{item.releaseYear}</CardDescription>
                                    )}
                                    <div className="mb-3">
                                        <StarRating
                                            rating={item.rating}
                                            onRatingChange={(newRating) => handleRatingChange(item.tmdbId, newRating)}
                                            size={22}
                                        />
                                    </div>
                                </div>
                                {item.type === 'series' && (
                                    <div className="mt-auto space-y-2">
                                        <div className="flex items-center gap-2">
                                            <label htmlFor={`season-${item.tmdbId}`} className="text-sm font-medium whitespace-nowrap">Tu Temporada:</label>
                                            <Input
                                                id={`season-${item.tmdbId}`}
                                                type="number"
                                                min="0"
                                                value={item.userSeason}
                                                onChange={(e) => handleSeasonChange(item.tmdbId, e.target.value)}
                                                className="h-8 w-16 text-center"
                                                placeholder="S"
                                            />
                                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                                                {item.latestSeason !== null ? `/ ${item.latestSeason}` : ''}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label htmlFor={`episode-${item.tmdbId}`} className="text-sm font-medium whitespace-nowrap">Tu Episodio:</label>
                                            <Input
                                                id={`episode-${item.tmdbId}`}
                                                type="number"
                                                min="0"
                                                value={item.userEpisode}
                                                onChange={(e) => handleEpisodeChange(item.tmdbId, e.target.value)}
                                                className="h-8 w-16 text-center"
                                                placeholder="E"
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="p-3 border-t">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteItem(item.tmdbId)}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    aria-label={`Eliminar ${item.title}`}
                                >
                                    <Icons.trash className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" asChild className="ml-auto">
                                    <a
                                        href={`https://www.themoviedb.org/${item.type === 'series' ? 'tv' : 'movie'}/${item.tmdbId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Ver ${item.title} en TMDb`}
                                    >
                                        <Icons.externalLink className="h-4 w-4" />
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Diálogo de Recomendaciones */}
            <Dialog open={isRecommendationsDialogOpen} onOpenChange={setIsRecommendationsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Recomendaciones para ti</DialogTitle>
                        <DialogDescription>
                            Basado en tus valoraciones, aquí tienes algunas series que podrían gustarte.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {isRecommending ? (
                            <div className="flex justify-center items-center h-20">
                                <Icons.loader className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : recommendationError ? (
                            <Alert variant="destructive">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{recommendationError}</AlertDescription>
                            </Alert>
                        ) : recommendations.length > 0 ? (
                            <ul className="space-y-3">
                                {recommendations.map((rec, index) => (
                                    <li key={index} className="border-b pb-2 last:border-b-0">
                                        <p className="font-semibold">{rec.title}</p>
                                        {rec.reason && (
                                            <p className="text-sm text-muted-foreground italic">"{rec.reason}"</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-muted-foreground">No hay recomendaciones disponibles.</p>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cerrar
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// --- Utilidad Debounce ---
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<F>): Promise<ReturnType<F>> => {
        return new Promise((resolve) => {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                timeoutId = null;
                resolve(func(...args));
            }, waitFor);
        });
    };
}
