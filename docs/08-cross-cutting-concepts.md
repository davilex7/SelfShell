# 8. Conceptos Transversales

Esta sección describe conceptos, patrones y decisiones que se aplican a múltiples bloques de construcción o aspectos del sistema SelfShell.

## 8.1. Gestión de Estado

* **Estado del Dashboard (`apps/dashboard`):**
    * El estado principal del dashboard (ej. `dashboardLayout` que contiene la configuración de los widgets, `isDarkMode`, `maximizedWidgetId`, `isWidgetPanelOpen`) se gestiona localmente en el componente raíz `App` (`page.tsx`) usando hooks de React (`useState`, `useCallback`, `useMemo`).
    * **Persistencia Futura:** Para persistir el layout y las preferencias del usuario entre sesiones, se podría implementar `localStorage` o, para una solución más robusta y sincronizada, un backend con autenticación.
* **Estado de Widgets Individuales:**
    * Cada widget es responsable de gestionar su propio estado interno (ej. la hora actual en `ClockWidget`, el contenido de la nota en `NotesWidget`, la lista de ítems cargados en `SeriesTrackerWidget`).
    * Los widgets usan hooks de React (`useState`, `useEffect`) para su estado y lógica.
    * La configuración persistente de un widget (ej. `displayCount` para `SeriesTrackerWidget`) se almacena en el `dashboardLayout` y se pasa al widget a través de `instanceConfig.settings`. Los cambios a estos settings se comunican al dashboard mediante `updateInstanceConfig`.
* **No se utiliza una librería de gestión de estado global (como Redux, Zustand) en la etapa actual.** Para la complejidad actual, los hooks de React y el paso de props/callbacks son suficientes. Si la complejidad del estado compartido entre muchos widgets o componentes del dashboard aumenta significativamente, se podría reconsiderar.

## 8.2. Comunicación

* **Dashboard a Widget:**
    * El dashboard (`WidgetRenderer`) pasa la `instanceConfig` y la `definition` como props al componente del widget.
    * También pasa callbacks como `updateInstanceConfig` y `removeWidget` para que el widget pueda interactuar con el layout del dashboard.
* **Widget a API de Aplicación Tracker (ej. `SeriesTrackerWidget` a `apps/series-tracker/api`):**
    * Se realiza mediante peticiones `fetch` HTTP a las API Routes expuestas por la aplicación tracker.
    * En desarrollo, el dashboard (`apps/dashboard`) utiliza `rewrites` en `next.config.mjs` para hacer proxy de estas peticiones al servidor de desarrollo de la aplicación tracker correspondiente (que corre en un puerto diferente).
    * En producción, las URLs de destino de los `rewrites` apuntarían a las URLs de las APIs desplegadas.
* **Comunicación entre Widgets:**
    * Actualmente no hay un mecanismo directo de comunicación entre widgets. Se busca el desacoplamiento.
    * **Futuro:** Si fuera necesario, se podría implementar un sistema de eventos simple a nivel del dashboard (ej. usando `Context API` o un pequeño event emitter) donde los widgets puedan emitir y suscribirse a eventos, con el dashboard actuando como intermediario.

## 8.3. Estilos y Tematización

* **Tailwind CSS:** Es la base para los estilos en todo el monorepo (aplicaciones y el paquete `packages/ui`). Proporciona un enfoque utility-first para un desarrollo rápido y personalizable.
* **Paquete `packages/ui`:** Centraliza los componentes UI reutilizables. Estos componentes están estilizados con Tailwind CSS.
* **Modo Oscuro/Claro:**
    * Implementado en `apps/dashboard` mediante una clase `dark` en el elemento `<html>`.
    * Un estado en el componente `App` (`isDarkMode`) controla la adición/eliminación de esta clase.
    * La preferencia se guarda en `localStorage`.
    * Los componentes en `packages/ui` y las aplicaciones utilizan las variantes `dark:` de Tailwind para adaptar sus estilos.
* **Consistencia Visual:** El uso de `packages/ui` y Tailwind CSS en todas las partes del sistema busca asegurar una apariencia visual coherente.

## 8.4. Gestión de Errores y Resiliencia

* **Errores de API en Widgets:**
    * Los widgets que hacen peticiones `fetch` (como `SeriesTrackerWidget`) implementan bloques `try/catch` para manejar errores de red o respuestas no exitosas de la API.
    * Se muestra un mensaje de error al usuario dentro del widget y se ofrece la opción de reintentar.
    * Se usan `toast` (a través de `useToast` de `packages/ui`) para notificaciones de error más globales o no bloqueantes.
* **Errores de Renderizado de Widget:**
    * El `WidgetRenderer` en `apps/dashboard` tiene un mecanismo para detectar si una `WidgetDefinition` no se encuentra y muestra un mensaje de error en lugar de romper la aplicación.
* **Validación de Datos:**
    * Se utiliza `Zod` en las API Routes de `apps/series-tracker` para validar los payloads de entrada (ej. al guardar ítems) y las respuestas esperadas de servicios externos (ej. recomendaciones de Gemini).
    * Esto ayuda a prevenir errores debidos a datos malformados.
* **Errores de Compilación/Build:**
    * TypeScript proporciona detección de errores en tiempo de compilación.
    * ESLint ayuda a detectar problemas de código.
    * Turbopack/Next.js muestran errores detallados durante el desarrollo.

## 8.5. Build y Orquestación de Tareas con Turborepo

* **`turbo.json`:** Define el pipeline de tareas (`build`, `lint`, `dev`, `test`, `clean`).
* **`dependsOn`:** Especifica las dependencias entre tareas (ej. `build` de un paquete depende de `^build` de sus dependencias internas del workspace).
* **`outputs`:** Define los artefactos generados por las tareas, permitiendo a Turborepo cachearlos.
* **Cacheo:** Turborepo cachea los resultados de las tareas, evitando re-ejecuciones innecesarias y acelerando los builds locales y en CI/CD (con Remote Caching).
* **Ejecución Paralela y Selectiva:** Turborepo ejecuta tareas en paralelo cuando es posible y solo en los paquetes afectados por los cambios.
* **Scripts en `package.json` Raíz:** Scripts como `pnpm run build` o `pnpm run dev` invocan `turbo run ...` para orquestar las tareas en todo el monorepo.

## 8.6. Persistencia de Datos

* **Datos de Trackers (`series-tracker`, `mangas-tracker`):**
    * **Desarrollo Local:** Se utilizan archivos JSON (`tracker-data.json`) almacenados en la carpeta `data/` de cada aplicación respectiva. Las API Routes de estas aplicaciones son responsables de leer y escribir en estos archivos.
    * **Producción (Propuesta):** Se requerirá una migración a una solución de base de datos (SQL o NoSQL en la nube) para escalabilidad y fiabilidad, ya que los sistemas de archivos en entornos serverless suelen ser efímeros.
* **Configuración del Dashboard (`apps/dashboard`):**
    * **Tema Oscuro/Claro:** La preferencia se guarda en `localStorage`.
    * **Layout de Widgets (Futuro):** La configuración de qué widgets están activos, sus posiciones, tamaños y settings específicos se podría persistir en `localStorage` para una solución simple, o en un backend si se implementa autenticación de usuarios.
* **Datos de Otros Widgets/Proyectos:**
    * **Notas Rápidas:** El estado se gestiona en el componente y se podría persistir en `localStorage` a través de la configuración del widget en el `dashboardLayout`.
    * **Widgets Informativos (Extensiones, OCR):** No suelen tener datos persistentes propios; muestran información estática o enlaces.
