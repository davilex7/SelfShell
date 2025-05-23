# 6. Vista en Tiempo de Ejecución

Este capítulo describe las interacciones dinámicas entre los componentes de SelfShell durante escenarios de uso representativos, mostrando cómo colaboran para cumplir sus funciones.

## 6.1. Escenario: Carga Inicial del Dashboard y Visualización de un Widget de Datos

Este flujo detalla el proceso desde el acceso del usuario hasta la presentación de datos por un widget que consume una API, como `SeriesTrackerWidget`.

1.  **Petición del Usuario:** El usuario accede a la URL de `apps/dashboard` (ej., `http://localhost:3002`).
2.  **Respuesta del Servidor (`apps/dashboard`):** El servidor Next.js procesa la ruta y sirve la página principal (`page.tsx`) junto con el `RootLayout`.
3.  **Inicialización en Cliente:** El navegador carga HTML/JS. React se inicializa y monta el componente `App` (`page.tsx`).
4.  **Lógica de `App` Component (`apps/dashboard`):** Se inicializan estados (`dashboardLayout`, `isDarkMode`). Se renderizan `Header`, `WidgetGrid`, `Footer`.
5.  **Renderizado de `WidgetGrid`:** Itera sobre `dashboardLayout.widgets`, renderizando un `WidgetRenderer` por cada `WidgetInstanceConfig`.
6.  **Operación de `WidgetRenderer`:** Obtiene la `WidgetDefinition` del `WIDGET_REGISTRY` y renderiza el componente widget (ej., `SeriesTrackerWidget`) dentro de `WidgetWrapper`.
7.  **Ciclo de Vida de `SeriesTrackerWidget`:**
    * **Montaje y Petición:** `useEffect` llama a `fetchItems`. `isLoading = true`. Se ejecuta `fetch` a `/api/series-tracker/items`.
    * **Proxy en Dashboard:** La petición (ej., a `localhost:3002/api/series-tracker/items`) es redirigida por `rewrites` en `apps/dashboard/next.config.mjs` al servidor de `apps/series-tracker` (ej., `localhost:3001/api/items`).
    * **Procesamiento en API (`apps/series-tracker`):** La API Route `items/route.ts` lee `tracker-data.json` y devuelve JSON.
    * **Actualización del Widget:** `SeriesTrackerWidget` recibe el JSON, actualiza su estado `items`, `isLoading = false`, y se re-renderiza.
8.  **Otros Widgets:** Widgets locales (ej., `ClockWidget`) se renderizan directamente.

<div class="mermaid">
sequenceDiagram
    actor U as Usuario
    participant B as Navegador
    participant D_FE as Dashboard Frontend (apps/dashboard)
    participant D_BE as Dashboard Backend (Next.js Server - apps/dashboard)
    participant STW_FE as SeriesTrackerWidget (en D_FE)
    participant ST_API as SeriesTracker API (Next.js Server - apps/series-tracker)
    participant ST_DATA as tracker-data.json (en apps/series-tracker)

    U->>B: Accede a URL del Dashboard
    B->>D_BE: GET /
    D_BE-->>B: HTML/JS (Shell de la App)
    B->>D_FE: Renderiza Dashboard (App, Header, WidgetGrid)
    D_FE->>STW_FE: Monta SeriesTrackerWidget
    STW_FE->>STW_FE: useEffect -> fetchItems() [isLoading=true]
    STW_FE->>B: fetch('/api/series-tracker/items')
    B->>D_BE: GET /api/series-tracker/items
    Note over D_BE: Aplica Rewrite a http://localhost:3001/api/items
    D_BE->>ST_API: GET /api/items
    ST_API->>ST_DATA: Lee datos
    ST_DATA-->>ST_API: Datos JSON
    ST_API-->>D_BE: Respuesta JSON
    D_BE-->>B: Respuesta JSON
    B->>STW_FE: Datos recibidos
    STW_FE->>STW_FE: setState(items), setIsLoading(false)
    STW_FE->>D_FE: Re-renderiza con datos
</div>

## 6.2. Escenario: Usuario Añade un Nuevo Widget

1.  **Acción del Usuario:** Clic en "Añadir Widget".
2.  **Respuesta del `Header`:** Actualiza estado en `App` para mostrar `AddWidgetPanel`.
3.  **Operación de `AddWidgetPanel`:** Muestra widgets del `WIDGET_REGISTRY`.
4.  **Selección del Usuario:** Elige un widget.
5.  **Lógica en `App` (`addWidgetToLayout`):** Crea `WidgetInstanceConfig`, actualiza `dashboardLayout.widgets`, cierra panel.
6.  **Actualización del Dashboard:** `WidgetGrid` se re-renderiza, mostrando el nuevo widget.

## 6.3. Escenario: Usuario Interactúa con un Widget Local (ej. Notas Rápidas)

1.  **Acción del Usuario:** Escribe en `NotesWidget`.
2.  **Respuesta de `NotesWidget`:** Actualiza estado interno y llama a `updateInstanceConfig` con nuevos `settings`.
3.  **Lógica en `App` (`updateWidgetConfig`):** Actualiza `dashboardLayout.widgets`.
4.  **Persistencia (Futura):** El cambio podría guardarse (`localStorage`).

## 6.4. Escenario: Widget de Series Tracker Actualiza un Rating

1.  **Acción del Usuario:** Cambia rating en `SeriesTrackerWidget`.
2.  **Respuesta de `SeriesTrackerWidget`:** Actualiza estado local, llama a `debouncedSave`.
3.  **Función `debouncedSave`:** Ejecuta `fetch POST` a `/api/series-tracker/items` con lista actualizada.
4.  **Procesamiento por API:** API de `series-tracker` actualiza `tracker-data.json`.
5.  **Respuesta en `SeriesTrackerWidget`:** Recibe confirmación, puede mostrar `toast`.

<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad: true });
</script>