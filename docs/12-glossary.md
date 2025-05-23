# 12. Glosario

Esta sección define términos clave utilizados a lo largo de la documentación de SelfShell para asegurar una comprensión común.

* **API (Application Programming Interface):**
    Interfaz que permite a diferentes componentes de software comunicarse entre sí. En SelfShell, se refiere principalmente a las API Routes HTTP expuestas por `apps/series-tracker` y `apps/mangas-tracker`.

* **API Route (Next.js):**
    Funcionalidad de Next.js que permite crear endpoints backend (APIs) dentro de una aplicación Next.js, típicamente ubicados en la carpeta `app/api/`.

* **App Router (Next.js):**
    El sistema de enrutamiento más reciente en Next.js (introducido en la v13), basado en convenciones de carpetas dentro del directorio `app/`. Utilizado por `apps/dashboard`, `apps/series-tracker`, y `apps/mangas-tracker`.

* **Arc42:**
    Una plantilla estándar y pragmática para la documentación de arquitecturas de software.

* **Artefacto (Build Artifact):**
    El resultado de un proceso de compilación o empaquetado, como un archivo `.zip` para una extensión de navegador, un ejecutable para una aplicación de escritorio, o los archivos estáticos generados por `next build`.

* **Autoprefixer:**
    Una herramienta de PostCSS que añade prefijos de proveedor (-webkit-, -moz-, etc.) a las reglas CSS para asegurar la compatibilidad entre navegadores. Con Tailwind CSS v4, su necesidad como plugin separado se reduce.

* **Barrel File:**
    Un archivo `index.ts` (o `index.js`) que reexporta múltiples módulos de una carpeta, simplificando los imports desde fuera de esa carpeta. Usado en `packages/ui` y `packages/types`.

* **Componente React:**
    Bloque de construcción fundamental en React, una función o clase que devuelve elementos React para ser renderizados en la UI.

* **CRUD:**
    Acrónimo de Create, Read, Update, Delete, las operaciones básicas de persistencia de datos.

* **Dashboard (SelfShell Dashboard / `apps/dashboard`):**
    La aplicación principal de SelfShell que actúa como un panel de control centralizado, mostrando y orquestando widgets.

* **Desacoplamiento (Decoupling):**
    Principio de diseño de software donde los componentes tienen una interdependencia mínima, permitiendo que evolucionen y sean mantenidos de forma independiente.

* **ESLint:**
    Herramienta de linting para JavaScript y TypeScript que ayuda a encontrar y corregir problemas en el código.

* **Extensibilidad:**
    La capacidad del sistema para ser ampliado con nuevas funcionalidades con un esfuerzo razonable.

* **Fetch API:**
    Interfaz moderna de JavaScript para realizar peticiones HTTP, utilizada por los widgets para comunicarse con las API Routes.

* **Hook (React Hook):**
    Funciones especiales en React (ej. `useState`, `useEffect`, `useCallback`) que permiten usar estado y otras características de React en componentes funcionales.

* **Hidratación (React/Next.js):**
    El proceso por el cual React "toma control" del HTML renderizado por el servidor y lo convierte en una aplicación interactiva en el cliente, adjuntando listeners de eventos y estado.

* **iFrame (Inline Frame):**
    Elemento HTML que permite embeber otro documento HTML dentro de la página actual. Considerado como una alternativa para la integración de widgets, pero descartado en favor de componentes React directos para una mejor UX.

* **Lucide-React:**
    Biblioteca de iconos SVG ligeros y personalizables utilizada en el proyecto.

* **Mantenibilidad:**
    La facilidad con la que el software puede ser modificado para corregir errores, mejorar el rendimiento, o adaptar funcionalidades.

* **Microfrontend:**
    Un enfoque arquitectónico donde una aplicación web frontend se descompone en "micro aplicaciones" más pequeñas y semi-independientes. Los widgets de SelfShell se inspiran en este concepto, especialmente aquellos que consumen APIs de aplicaciones separadas.

* **Monorepo:**
    Estrategia de desarrollo de software donde el código de múltiples proyectos (aplicaciones, bibliotecas) se almacena en un único repositorio Git.

* **Next.js:**
    Un framework React popular para construir aplicaciones web, utilizado para `apps/dashboard`, `apps/series-tracker` y `apps/mangas-tracker`.

* **Orquestador (Dashboard Shell):**
    El componente principal del dashboard (`apps/dashboard`) que gestiona el layout, la carga y la configuración de los widgets.

* **Paquete (Package):**
    En el contexto del monorepo, una unidad de código con su propio `package.json`, típicamente ubicada en la carpeta `packages/` (ej. `@mi-dashboard/ui`, `@mi-dashboard/series-tracker-widget`).

* **Persistencia:**
    El acto de guardar datos de forma que sobrevivan al cierre de la aplicación o sesión.

* **Placeholder:**
    Un componente o sección de código temporal que se utiliza para representar una funcionalidad futura o aún no implementada.

* **pnpm:**
    Un gestor de paquetes rápido y eficiente en el uso de espacio en disco, utilizado para gestionar las dependencias y workspaces en el monorepo SelfShell.

* **PostCSS:**
    Herramienta para transformar CSS con plugins JavaScript. Utilizada por Tailwind CSS.

* **React:**
    Biblioteca JavaScript para construir interfaces de usuario.

* **Refactorizar:**
    Reestructurar código existente sin cambiar su comportamiento externo, con el objetivo de mejorar su diseño, legibilidad o mantenibilidad.

* **Registry (WidgetRegistry):**
    Un objeto o mapa centralizado en `apps/dashboard` que contiene las definiciones de todos los widgets disponibles.

* **Rewrite (Next.js Rewrite):**
    Funcionalidad de Next.js que permite mapear una ruta de URL entrante a una ruta de destino diferente (interna o externa), útil para hacer proxy de llamadas API.

* **Scaffolding:**
    La estructura base o esqueleto inicial de un proyecto de software.

* **ShadCN/UI:**
    Una colección de componentes UI reutilizables construidos con Radix UI y Tailwind CSS. SelfShell se inspira en sus principios para su paquete `packages/ui`.

* **Stakeholder:**
    Cualquier persona o entidad con un interés en el proyecto. En este caso, principalmente el desarrollador.

* **Tailwind CSS:**
    Un framework CSS utility-first para construir diseños personalizados rápidamente.

* **TMDb (The Movie Database):**
    Una popular base de datos online y API para información sobre películas y series de TV.

* **Turbopack:**
    Un bundler incremental basado en Rust, desarrollado por Vercel, diseñado para ser el sucesor de Webpack y ofrecer builds extremadamente rápidos. Usado por `next dev --turbopack`.

* **Turborepo:**
    Un sistema de compilación de alto rendimiento para monorepos JavaScript/TypeScript, utilizado en SelfShell para orquestar tareas y cacheo.

* **TypeScript:**
    Un superconjunto de JavaScript que añade tipado estático opcional al lenguaje.

* **UI (User Interface):**
    La parte del sistema con la que el usuario interactúa directamente.

* **UX (User Experience):**
    La experiencia general de una persona al usar un producto o sistema.

* **Widget:**
    Un componente modular y autónomo que proporciona una funcionalidad o muestra información específica dentro del dashboard SelfShell.

* **Workspace (pnpm Workspace):**
    Funcionalidad de pnpm (y otros gestores de paquetes) que permite gestionar múltiples paquetes dentro de un único monorepo.

* **Zod:**
    Una librería de declaración y validación de esquemas TypeScript-first.
